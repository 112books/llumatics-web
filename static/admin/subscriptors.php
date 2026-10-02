<?php
session_start();

define('ADMIN_PASSWORD', 'LinuxBCN2026');
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pwd'])) {
    if ($_POST['pwd'] === ADMIN_PASSWORD) $_SESSION['subs_ok'] = true;
    else $login_error = true;
}
if (isset($_POST['logout'])) { session_destroy(); header('Location: subscriptors.php'); exit; }
$authed = !empty($_SESSION['subs_ok']);

function brevo_get(string $path): ?array {
    if (!defined('BREVO_API_KEY') || BREVO_API_KEY === '') return null;
    $ctx = stream_context_create(['http' => [
        'method'  => 'GET',
        'header'  => "api-key: " . BREVO_API_KEY . "\r\naccept: application/json\r\n",
        'timeout' => 20,
    ]]);
    $res = @file_get_contents('https://api.brevo.com/v3' . $path, false, $ctx);
    if ($res === false) return null;
    $j = json_decode($res, true);
    return is_array($j) ? $j : null;
}

$newsId = defined('BREVO_NEWSLETTER_LIST_ID') ? BREVO_NEWSLETTER_LIST_ID : 3;
$waitId = defined('BREVO_WAITLIST_LIST_ID')   ? BREVO_WAITLIST_LIST_ID   : 5;

$lists = null; $total = null; $err = ''; $newsContacts = null; $waitContacts = null;
if ($authed) {
    $lists = brevo_get('/contacts/lists?limit=50');
    $c     = brevo_get('/contacts?limit=1');
    if ($lists === null || $c === null) {
        $err = "No s'ha pogut consultar l'API de Brevo. Revisa la clau i que la IP del servidor estigui autoritzada.";
    } else {
        $total        = $c['count'] ?? null;
        $newsContacts = brevo_get('/contacts/lists/' . $newsId . '/contacts?limit=50');
        $waitContacts = brevo_get('/contacts/lists/' . $waitId . '/contacts?limit=50');
    }
}

$news = 0; $wait = 0; $rows = [];
if ($lists) {
    foreach (($lists['lists'] ?? []) as $l) {
        $rows[] = $l;
        $u = $l['uniqueSubscribers'] ?? 0;
        if ((int)$l['id'] === (int)$newsId) $news = $u;
        if ((int)$l['id'] === (int)$waitId) $wait = $u;
    }
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
  <h1>Subscriptors de Brevo</h1>

  <?php if ($err): ?>
    <div class="flash-err"><?= htmlspecialchars($err) ?></div>
  <?php else: ?>
    <div class="kpis">
      <div class="kpi"><div class="kpi-label">Total contactes</div><div class="kpi-value"><?= (int)$total ?></div><div class="kpi-sub">a tot Brevo</div></div>
      <div class="kpi"><div class="kpi-label">Butlletí Llumàtics</div><div class="kpi-value accent"><?= (int)$news ?></div><div class="kpi-sub">subscrits únics (llista <?= (int)$newsId ?>)</div></div>
      <div class="kpi"><div class="kpi-label">Waitlist tallers</div><div class="kpi-value"><?= (int)$wait ?></div><div class="kpi-sub">interessats (llista <?= (int)$waitId ?>)</div></div>
    </div>

    <h2>Totes les llistes</h2>
    <table>
      <thead><tr><th>Llista</th><th class="num">Subscriptors</th><th class="num">Baixes</th></tr></thead>
      <tbody>
      <?php foreach ($rows as $l): ?>
        <tr><td><?= htmlspecialchars($l['name'] ?? '') ?></td><td class="num"><?= (int)($l['uniqueSubscribers'] ?? 0) ?></td><td class="num"><?= (int)($l['totalBlacklisted'] ?? 0) ?></td></tr>
      <?php endforeach ?>
      </tbody>
    </table>

    <?php if (!empty($newsContacts['contacts'])): ?>
      <h2>Butlletí Llumàtics — contactes</h2>
      <table>
        <thead><tr><th>Correu</th><th>Alta</th></tr></thead>
        <tbody>
        <?php foreach ($newsContacts['contacts'] as $c): ?>
          <tr><td><?= htmlspecialchars($c['email'] ?? '') ?></td><td><?= htmlspecialchars(substr((string)($c['createdAt'] ?? ''), 0, 10)) ?></td></tr>
        <?php endforeach ?>
        </tbody>
      </table>
    <?php endif ?>

    <?php if (!empty($waitContacts['contacts'])): ?>
      <h2>Waitlist tallers — contactes</h2>
      <table>
        <thead><tr><th>Correu</th><th>Alta</th></tr></thead>
        <tbody>
        <?php foreach ($waitContacts['contacts'] as $c): ?>
          <tr><td><?= htmlspecialchars($c['email'] ?? '') ?></td><td><?= htmlspecialchars(substr((string)($c['createdAt'] ?? ''), 0, 10)) ?></td></tr>
        <?php endforeach ?>
        </tbody>
      </table>
    <?php endif ?>

    <p class="note">Dades en directe de l'API de Brevo. Recarrega la pàgina per actualitzar-les.</p>
  <?php endif ?>
</div>
<?php endif ?>
</body>
</html>
