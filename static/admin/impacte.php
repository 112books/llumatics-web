<?php
session_start();
define('ADMIN_PASSWORD', 'LinuxBCN2026');
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pwd'])) {
    if ($_POST['pwd'] === ADMIN_PASSWORD) $_SESSION['impacte_ok'] = true;
    else $login_error = true;
}
if (isset($_POST['logout'])) { session_destroy(); header('Location: impacte.php'); exit; }
$authed = !empty($_SESSION['impacte_ok']);

$cache = null; $err = '';
$cacheFile = __DIR__ . '/analytics-cache.json';
if ($authed) {
    if (!is_file($cacheFile)) {
        $err = "Encara no hi ha analytics-cache.json. Vés a Stats i prem «actualitzar» per generar-lo.";
    } else {
        $cache = json_decode((string)file_get_contents($cacheFile), true);
        if (!is_array($cache)) $err = "No s'ha pogut llegir analytics-cache.json.";
    }
}

function lang_of(string $p): string {
    foreach (explode('/', $p) as $seg) if (in_array($seg, ['ca','es','en'], true)) return $seg;
    return 'ca';
}
function slug_of(string $p): string {
    if (preg_match('#/tallers/([^/]+)/#', $p, $m)) return $m[1];
    return '';
}

$hits = [];
if (is_array($cache) && !empty($cache['hits'])) {
    foreach ($cache['hits'] as $h) {
        $path = (string)($h['path'] ?? '');
        if ($path === '' || str_contains($path, '/privat')) continue;
        $hits[] = ['path'=>$path, 'count'=>(int)($h['count'] ?? 0), 'unique'=>(int)($h['count_unique'] ?? 0), 'lang'=>lang_of($path)];
    }
}
$total = 0; foreach ($hits as $h) $total += $h['count'];

function group_sum(array $hits, callable $pred): array {
    $n=0; $u=0; $byLang=['ca'=>0,'es'=>0,'en'=>0];
    foreach ($hits as $h) if ($pred($h['path'])) { $n += $h['count']; $u += $h['unique']; $byLang[$h['lang']] += $h['count']; }
    return ['count'=>$n, 'unique'=>$u, 'by_lang'=>$byLang];
}
// Cursos nous / flash destacats (es poden ampliar)
$nous = ['tarda-holga-2026','fotollibre','del-carrer-al-llibre','wineol','caffenol','solargrafia','collodio-humit','fotogrames-cianotipia','retrat-amb-holga'];

$regal = group_sum($hits, fn($p) => (bool)preg_match('#^/(es/|en/)?regala(/|$)#', $p));
$quiz  = group_sum($hits, fn($p) => str_contains($p, 'quin-curs-em-conve') || str_contains($p, 'que-curso-me-conviene') || str_contains($p, 'which-course-suits-me'));

// Cursos: agregats per slug
$cursos = [];
foreach ($hits as $h) {
    $s = slug_of($h['path']); if ($s === '') continue;
    if (!isset($cursos[$s])) $cursos[$s] = ['count'=>0,'unique'=>0];
    $cursos[$s]['count'] += $h['count'];
    $cursos[$s]['unique'] += $h['unique'];
}
uasort($cursos, fn($a,$b) => $b['count'] - $a['count']);

// Cursos nous (filtra només els que tenen visites)
$nous_rows = [];
foreach ($nous as $s) if (isset($cursos[$s])) $nous_rows[$s] = $cursos[$s];
uasort($nous_rows, fn($a,$b) => $b['count'] - $a['count']);

// Si la cache porta el bloc de campanyes calculat al servidor, mana.
if (is_array($cache['campaigns'] ?? null)) {
    $regal = $cache['campaigns']['regal'];
    $quiz  = $cache['campaigns']['quiz'];
    $nous_rows = $cache['campaigns']['nous'] ?? [];
    uasort($nous_rows, fn($a, $b) => $b['count'] - $a['count']);
}

function pct(int $n, int $total): string { return $total > 0 ? round(100*$n/$total, 1) . '%' : '—'; }
?>
<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Impacte · Llumàtics</title>
<style>
  :root { --bg:#FAFAF8; --ink:#1A1A18; --ink3:#6B6B65; --accent:#C8A96E; --accent2:#A8893E; --border:#E0DED8; --warn:#8b2500; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:var(--bg); color:var(--ink); font-family:system-ui,'Inter',sans-serif; font-size:13px; line-height:1.6; }
  #login { display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .login-box { width:320px; padding:2.5rem; border:1px solid var(--border); }
  .login-logo { font-family:Georgia,serif; font-size:1.3rem; font-weight:700; margin-bottom:.3rem; }
  .login-logo span { color:var(--accent); }
  .login-sub { font-size:11px; color:var(--ink3); letter-spacing:.1em; text-transform:uppercase; margin-bottom:2rem; }
  #pwd { width:100%; background:transparent; border:none; border-bottom:1px solid var(--border); padding:.5rem 0; font-size:15px; outline:none; margin-bottom:1.5rem; letter-spacing:.1em; }
  .err { color:var(--warn); font-size:11px; margin-top:.75rem; }
  .topbar { display:flex; align-items:center; gap:1rem; padding:.75rem 2rem; border-bottom:1px solid var(--border); position:sticky; top:0; background:var(--bg); z-index:20; flex-wrap:wrap; }
  .topbar-logo { font-family:Georgia,serif; font-size:1rem; font-weight:700; }
  .topbar-logo span { color:var(--accent); }
  .topbar-title { flex:1; font-size:11px; color:var(--ink3); letter-spacing:.08em; text-transform:uppercase; }
  .topbar-links { display:flex; gap:.5rem; }
  .topbar-links a { font-size:11px; color:var(--ink3); text-decoration:none; padding:.25rem .6rem; border:1px solid var(--border); }
  .topbar-links a:hover { color:var(--ink); }
  .btn-logout { background:transparent; border:1px solid var(--border); color:var(--ink3); font-size:11px; padding:.25rem .6rem; cursor:pointer; }
  .main { padding:2rem; max-width:1000px; }
  h1 { font-size:1.1rem; font-weight:700; margin-bottom:.25rem; }
  .muted { color:var(--ink3); font-size:11px; margin-bottom:1.5rem; }
  .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; margin-bottom:2rem; }
  .card { border:1px solid var(--border); padding:1.25rem; background:#fff; }
  .card-label { font-size:10px; text-transform:uppercase; letter-spacing:.1em; color:var(--ink3); margin-bottom:.4rem; }
  .card-value { font-family:Georgia,serif; font-size:2rem; font-weight:700; }
  .card-value.accent { color:var(--accent2); }
  .card-sub { font-size:11px; color:var(--ink3); }
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
    <div class="login-sub">Impacte</div>
    <input id="pwd" type="password" name="pwd" placeholder="contrasenya" autofocus>
    <button type="submit" class="btn-logout" style="width:100%">Entrar</button>
    <?php if (!empty($login_error)): ?><div class="err">Contrasenya incorrecta.</div><?php endif ?>
  </form>
</div>
<?php else: ?>
<div class="topbar">
  <div class="topbar-logo">Llum<span style="color:var(--accent)">à</span>tics</div>
  <div class="topbar-title">Impacte / Campanyes</div>
  <div class="topbar-links">
    <a href="index.html">Stats</a>
    <a href="vals.php">Vals-regal</a>
    <a href="alumnes.php">Alumnes</a>
    <a href="subscriptors.php">Subscriptors</a>
  </div>
  <form method="post" style="margin:0"><input type="hidden" name="logout" value="1"><button type="submit" class="btn-logout">Sortir</button></form>
</div>
<div class="main">
<?php if ($err): ?>
  <div class="flash-err"><?= htmlspecialchars($err) ?></div>
<?php else: ?>
  <h1>Impacte de campanyes i cursos</h1>
  <p class="muted">Dades de GoatCounter dels últims 365 dies (<?= (int)$total ?> visites de pàgina). Actualitza-les des de Stats → «actualitzar».</p>

  <h2>Cupó regal</h2>
  <div class="cards">
    <div class="card"><div class="card-label">Visites a /regala/</div><div class="card-value accent"><?= (int)$regal['count'] ?></div><div class="card-sub"><?= pct($regal['count'], $total) ?> del total · <?= (int)$regal['unique'] ?> úniques</div></div>
    <div class="card"><div class="card-label">Per idioma</div><div class="card-value" style="font-size:1.1rem">CA <?= (int)$regal['by_lang']['ca'] ?> · ES <?= (int)$regal['by_lang']['es'] ?> · EN <?= (int)$regal['by_lang']['en'] ?></div></div>
  </div>

  <h2>Recomanador «Quin curs em convé»</h2>
  <div class="cards">
    <div class="card"><div class="card-label">Visites al qüestionari</div><div class="card-value accent"><?= (int)$quiz['count'] ?></div><div class="card-sub"><?= pct($quiz['count'], $total) ?> del total · <?= (int)$quiz['unique'] ?> úniques</div></div>
    <div class="card"><div class="card-label">Per idioma</div><div class="card-value" style="font-size:1.1rem">CA <?= (int)$quiz['by_lang']['ca'] ?> · ES <?= (int)$quiz['by_lang']['es'] ?> · EN <?= (int)$quiz['by_lang']['en'] ?></div></div>
  </div>

  <h2>Cursos nous / flash</h2>
  <table>
    <thead><tr><th>Curs</th><th class="num">Visites</th><th class="num">Úniques</th></tr></thead>
    <tbody>
    <?php foreach ($nous_rows as $s => $v): ?>
      <tr><td><?= htmlspecialchars($s) ?></td><td class="num"><?= (int)$v['count'] ?></td><td class="num"><?= (int)$v['unique'] ?></td></tr>
    <?php endforeach ?>
    <?php if (!$nous_rows): ?><tr><td colspan="3" class="muted">Cap visita registrada encara a aquests cursos.</td></tr><?php endif ?>
    </tbody>
  </table>

  <h2>Top cursos per visites</h2>
  <table>
    <thead><tr><th>Curs</th><th class="num">Visites</th><th class="num">Úniques</th></tr></thead>
    <tbody>
    <?php $i=0; foreach ($cursos as $s => $v): if ($i++ >= 20) break; ?>
      <tr><td><?= htmlspecialchars($s) ?></td><td class="num"><?= (int)$v['count'] ?></td><td class="num"><?= (int)$v['unique'] ?></td></tr>
    <?php endforeach ?>
    </tbody>
  </table>

  <p class="note">«Cursos nous / flash» és una llista editable (variable $nous al fitxer): hi pots afegir nous cursos.</p>
<?php endif ?>
</div>
<?php endif ?>
</body>
</html>
