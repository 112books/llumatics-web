<?php
session_start();

define('ADMIN_PASSWORD', 'LinuxBCN2026');
define('DB_PATH', __DIR__ . '/vals.db');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pwd'])) {
    if ($_POST['pwd'] === ADMIN_PASSWORD) $_SESSION['subs_ok'] = true;
    else $login_error = true;
}
if (isset($_POST['logout'])) { session_destroy(); header('Location: subscriptors.php'); exit; }
$authed = !empty($_SESSION['subs_ok']);

function db(): PDO {
    static $pdo;
    if (!$pdo) {
        $pdo = new PDO('sqlite:' . DB_PATH);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, nom TEXT,
            taller TEXT NOT NULL DEFAULT '', idioma TEXT,
            newsletter INTEGER NOT NULL DEFAULT 0, estat TEXT NOT NULL DEFAULT 'pendent',
            token TEXT UNIQUE, creat TEXT, confirmat TEXT, UNIQUE(email, taller))");
        $pdo->exec("CREATE TABLE IF NOT EXISTS waitlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, taller TEXT NOT NULL,
            taller_nom TEXT NOT NULL, estat TEXT NOT NULL DEFAULT 'espera',
            data_inscripcio TEXT NOT NULL, notes TEXT,
            created_at TEXT DEFAULT (datetime('now')), UNIQUE(email, taller))");
    }
    return $pdo;
}

$news = []; $docs = []; $wait = [];
$nTotal = $nNews = $nPending = $nWait = 0;
if ($authed) {
    $d = db();
    $nTotal   = (int)$d->query("SELECT COUNT(DISTINCT email) FROM subscribers")->fetchColumn();
    $nNews    = (int)$d->query("SELECT COUNT(DISTINCT email) FROM subscribers WHERE newsletter=1 AND estat='confirmat'")->fetchColumn();
    $nPending = (int)$d->query("SELECT COUNT(*) FROM subscribers WHERE estat='pendent'")->fetchColumn();
    $nWait    = (int)$d->query("SELECT COUNT(*) FROM waitlist WHERE estat='espera'")->fetchColumn();
    $news = $d->query("SELECT email, nom, idioma, estat, creat, confirmat FROM subscribers WHERE taller='' AND newsletter=1 ORDER BY id DESC LIMIT 300")->fetchAll(PDO::FETCH_ASSOC);
    $docs = $d->query("SELECT email, nom, taller, idioma, estat, creat, confirmat FROM subscribers WHERE taller<>'' ORDER BY id DESC LIMIT 300")->fetchAll(PDO::FETCH_ASSOC);
    $wait = $d->query("SELECT email, taller_nom, estat, data_inscripcio FROM waitlist ORDER BY id DESC LIMIT 300")->fetchAll(PDO::FETCH_ASSOC);
}
?>
<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Subscriptors · Llumàtics</title>
<style>
  :root { --bg:#FAFAF8; --ink:#1A1A18; --ink3:#6B6B65; --accent:#C8A96E; --accent2:#A8893E; --border:#E0DED8; --surface:#EEECEA; --warn:#8b2500; --green:#2d6a2d; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:var(--bg); color:var(--ink); font-family:system-ui,'Inter',sans-serif; font-size:13px; line-height:1.6; min-height:100vh; }
  #login { display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .login-box { width:320px; padding:2.5rem; border:1px solid var(--border); }
  .login-logo { font-family:Georgia,serif; font-size:1.3rem; font-weight:700; margin-bottom:.3rem; }
  .login-logo span { color:var(--accent); }
  .login-sub { font-size:11px; color:var(--ink3); letter-spacing:.1em; text-transform:uppercase; margin-bottom:2rem; }
  #pwd { width:100%; background:transparent; border:none; border-bottom:1px solid var(--border); padding:.5rem 0; font-size:15px; color:var(--ink); outline:none; margin-bottom:1.5rem; letter-spacing:.1em; }
  #pwd:focus { border-bottom-color:var(--accent); }
  .err { color:var(--warn); font-size:11px; margin-top:.75rem; }
  .topbar { display:flex; align-items:center; gap:1rem; padding:.75rem 2rem; border-bottom:1px solid var(--border); position:sticky; top:0; background:var(--bg); z-index:20; flex-wrap:wrap; }
  .topbar-logo { font-family:Georgia,serif; font-size:1rem; font-weight:700; }
  .topbar-logo span { color:var(--accent); }
  .topbar-title { flex:1; font-size:11px; color:var(--ink3); letter-spacing:.08em; text-transform:uppercase; }
  .topbar-links { display:flex; gap:.5rem; }
  .topbar-links a { font-size:11px; color:var(--ink3); text-decoration:none; padding:.25rem .6rem; border:1px solid var(--border); }
  .topbar-links a:hover { color:var(--ink); border-color:var(--ink3); }
  .btn-logout { background:transparent; border:1px solid var(--border); color:var(--ink3); font-size:11px; padding:.25rem .6rem; cursor:pointer; }
  .btn-logout:hover { color:var(--ink); border-color:var(--ink3); }
  .main { padding:2rem; max-width:1000px; }
  h1 { font-size:1.1rem; font-weight:700; margin-bottom:1.25rem; }
  .kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:1rem; margin-bottom:2rem; }
  .kpi { border:1px solid var(--border); padding:1.25rem; background:#fff; }
  .kpi-label { font-size:10px; text-transform:uppercase; letter-spacing:.1em; color:var(--ink3); margin-bottom:.4rem; }
  .kpi-value { font-family:Georgia,serif; font-size:2rem; font-weight:700; }
  .kpi-value.accent { color:var(--accent2); }
  .kpi-sub { font-size:11px; color:var(--ink3); }
  h2 { font-size:11px; text-transform:uppercase; letter-spacing:.1em; color:var(--ink3); margin:2rem 0 .75rem; }
  table { width:100%; border-collapse:collapse; }
  th,td { text-align:left; padding:.5rem .6rem; border-bottom:1px solid var(--border); }
  th { font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:var(--ink3); font-weight:600; }
  td.num { text-align:right; font-variant-numeric:tabular-nums; }
  .note { color:var(--ink3); font-size:11px; margin-top:1rem; }
  .flash-err { border:1px solid var(--warn); color:var(--warn); padding:.75rem 1rem; margin-bottom:1.5rem; }
</style>
</head>
<body>
<?php if (!$authed): ?>
<div id="login">
  <form class="login-box" method="post">
    <div class="login-logo">Llum<span>à</span>tics</div>
    <div class="login-sub">Subscriptors</div>
    <input id="pwd" type="password" name="pwd" placeholder="contrasenya" autofocus>
    <button type="submit" class="btn-logout" style="width:100%;margin-top:.25rem">Entrar</button>
    <?php if (!empty($login_error)): ?><div class="err">Contrasenya incorrecta.</div><?php endif ?>
  </form>
</div>
<?php else: ?>
<div class="topbar">
  <div class="topbar-logo">Llum<span style="color:var(--accent)">à</span>tics</div>
  <div class="topbar-title">Subscriptors / Butlletí</div>
  <div class="topbar-links">
    <a href="index.html">Stats</a>
    <a href="vals.php">Vals-regal</a>
    <a href="alumnes.php">Alumnes</a>
  </div>
  <form method="post" style="margin:0"><input type="hidden" name="logout" value="1"><button type="submit" class="btn-logout">Sortir</button></form>
</div>
<div class="main">
  <h1>Subscriptors (local)</h1>

  <div class="kpis">
    <div class="kpi"><div class="kpi-label">Correus únics</div><div class="kpi-value"><?= (int)$nTotal ?></div><div class="kpi-sub">a la base de dades</div></div>
    <div class="kpi"><div class="kpi-label">Butlletí confirmats</div><div class="kpi-value accent"><?= (int)$nNews ?></div><div class="kpi-sub">subscrits actius</div></div>
    <div class="kpi"><div class="kpi-label">Pendents confirmar</div><div class="kpi-value"><?= (int)$nPending ?></div><div class="kpi-sub">doble opt-in</div></div>
    <div class="kpi"><div class="kpi-label">Llista d'espera</div><div class="kpi-value"><?= (int)$nWait ?></div><div class="kpi-sub">tallers (espera)</div></div>
  </div>

  <h2>Butlletí</h2>
  <table>
    <thead><tr><th>Correu</th><th>Nom</th><th>Idioma</th><th>Estat</th><th>Alta</th></tr></thead>
    <tbody>
    <?php foreach ($news as $c): ?>
      <tr><td><?= htmlspecialchars((string)$c['email']) ?></td><td><?= htmlspecialchars((string)$c['nom']) ?></td><td><?= htmlspecialchars((string)$c['idioma']) ?></td><td><?= htmlspecialchars((string)$c['estat']) ?></td><td><?= htmlspecialchars(substr((string)($c['confirmat'] ?: $c['creat']), 0, 10)) ?></td></tr>
    <?php endforeach ?>
    <?php if (!$news): ?><tr><td colspan="5" style="color:var(--ink3)">Encara no hi ha subscrits.</td></tr><?php endif ?>
    </tbody>
  </table>

  <h2>Material d'alumnes</h2>
  <table>
    <thead><tr><th>Correu</th><th>Nom</th><th>Taller</th><th>Estat</th><th>Alta</th></tr></thead>
    <tbody>
    <?php foreach ($docs as $c): ?>
      <tr><td><?= htmlspecialchars((string)$c['email']) ?></td><td><?= htmlspecialchars((string)$c['nom']) ?></td><td><?= htmlspecialchars((string)$c['taller']) ?></td><td><?= htmlspecialchars((string)$c['estat']) ?></td><td><?= htmlspecialchars(substr((string)($c['confirmat'] ?: $c['creat']), 0, 10)) ?></td></tr>
    <?php endforeach ?>
    <?php if (!$docs): ?><tr><td colspan="5" style="color:var(--ink3)">Encara no hi ha descàrregues.</td></tr><?php endif ?>
    </tbody>
  </table>

  <h2>Llista d'espera</h2>
  <table>
    <thead><tr><th>Correu</th><th>Taller</th><th>Estat</th><th>Data</th></tr></thead>
    <tbody>
    <?php foreach ($wait as $c): ?>
      <tr><td><?= htmlspecialchars((string)$c['email']) ?></td><td><?= htmlspecialchars((string)$c['taller_nom']) ?></td><td><?= htmlspecialchars((string)$c['estat']) ?></td><td><?= htmlspecialchars((string)$c['data_inscripcio']) ?></td></tr>
    <?php endforeach ?>
    <?php if (!$wait): ?><tr><td colspan="4" style="color:var(--ink3)">Encara no hi ha ningú.</td></tr><?php endif ?>
    </tbody>
  </table>

  <p class="note">Dades locals de <code>admin/vals.db</code> (SQLite). Recarrega la pàgina per actualitzar-les.</p>
</div>
<?php endif ?>
</body>
</html>
