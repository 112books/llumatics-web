<?php
session_start();

define('ADMIN_PASSWORD', 'llumatics');
define('DB_PATH',        __DIR__ . '/vals.db');
require_once __DIR__ . '/config.php';

/* ── Auth ─────────────────────────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pwd'])) {
    if ($_POST['pwd'] === ADMIN_PASSWORD) $_SESSION['alumnes_ok'] = true;
    else $login_error = true;
}
if (isset($_POST['logout'])) { session_destroy(); header('Location: alumnes.php'); exit; }
$authed = !empty($_SESSION['alumnes_ok']);

/* ── DB ───────────────────────────────────────────────── */
function db(): PDO {
    static $pdo;
    if (!$pdo) {
        $pdo = new PDO('sqlite:' . DB_PATH);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("CREATE TABLE IF NOT EXISTS waitlist (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            email           TEXT NOT NULL,
            taller          TEXT NOT NULL,
            taller_nom      TEXT NOT NULL,
            estat           TEXT NOT NULL DEFAULT 'espera',
            data_inscripcio TEXT NOT NULL,
            notes           TEXT,
            created_at      TEXT DEFAULT (datetime('now')),
            UNIQUE(email, taller)
        )");
    }
    return $pdo;
}

/* ── SMTP ─────────────────────────────────────────────── */
function smtp_send(string $to, string $from, string $fromName, string $subject, string $body): bool {
    $ctx  = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'allow_self_signed' => false]]);
    $conn = @stream_socket_client(SMTP_HOST . ':' . SMTP_PORT, $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $ctx);
    if (!$conn) return false;
    stream_set_timeout($conn, 30);
    smtp_r($conn);
    smtp_c($conn, 'EHLO llumatics.com');
    fputs($conn, "AUTH LOGIN\r\n"); smtp_r($conn);
    fputs($conn, base64_encode(SMTP_USER) . "\r\n"); smtp_r($conn);
    fputs($conn, base64_encode(SMTP_PASS) . "\r\n");
    if (strpos(smtp_r($conn), '235') === false) { fclose($conn); return false; }
    smtp_c($conn, "MAIL FROM:<$from>");
    smtp_c($conn, "RCPT TO:<$to>");
    fputs($conn, "DATA\r\n"); smtp_r($conn);
    $enc_s = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $enc_n = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $msg   = "From: $enc_n <$from>\r\nTo: $to\r\nSubject: $enc_s\r\nMIME-Version: 1.0\r\n"
           . "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n"
           . $body . "\r\n.\r\n";
    fputs($conn, $msg);
    $ok = strpos(smtp_r($conn), '250') !== false;
    fputs($conn, "QUIT\r\n"); fclose($conn);
    return $ok;
}
function smtp_c($conn, string $cmd): string { fputs($conn, "$cmd\r\n"); return smtp_r($conn); }
function smtp_r($conn): string {
    $r = '';
    while ($l = fgets($conn, 512)) { $r .= $l; if (isset($l[3]) && $l[3] === ' ') break; }
    return $r;
}

/* ── Actions ──────────────────────────────────────────── */
if ($authed && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $db     = db();

    if ($action === 'add') {
        $db->prepare("INSERT OR IGNORE INTO waitlist (email, taller, taller_nom, estat, data_inscripcio, notes)
            VALUES (?,?,?,?,?,?)")->execute([
            strtolower(trim($_POST['email'])),
            trim($_POST['taller']),
            trim($_POST['taller_nom']),
            'espera',
            $_POST['data_inscripcio'] ?: date('Y-m-d'),
            trim($_POST['notes']),
        ]);
        header('Location: alumnes.php'); exit;
    }

    if (in_array($action, ['contactat', 'confirmat', 'completat', 'espera'], true)) {
        $db->prepare("UPDATE waitlist SET estat=? WHERE id=?")->execute([$action, (int)$_POST['id']]);
        header('Location: alumnes.php'); exit;
    }

    if ($action === 'nota') {
        $db->prepare("UPDATE waitlist SET notes=? WHERE id=?")->execute([trim($_POST['notes']), (int)$_POST['id']]);
        header('Location: alumnes.php'); exit;
    }

    if ($action === 'avisa') {
        $v = $db->query("SELECT * FROM waitlist WHERE id=" . (int)$_POST['id'])->fetch(PDO::FETCH_ASSOC);
        if ($v) {
            $subject = "Places obertes — " . $v['taller_nom'] . " · Llumàtics";
            $body    = "Hola,\n\n"
                     . "T'escrivim perquè et vas apuntar a la llista d'espera del taller \"{$v['taller_nom']}\".\n\n"
                     . "Tenim dates disponibles. Escriu-nos a hola@llumatics.com per confirmar.\n\n"
                     . "Joan — Llumàtics\nhttps://llumatics.com\n"
                     . "\n--\nReps aquest missatge perquè vas sol·licitar informació sobre el taller \"{$v['taller_nom']}\".\n"
                     . "Per donar-te de baixa, respon amb l'assumpte \"Baixa\".\n";
            $sent = smtp_send($v['email'], MAIL_FROM, MAIL_FROM_NAME, $subject, $body);
            if ($sent) {
                $db->prepare("UPDATE waitlist SET estat='contactat', notes=? WHERE id=?")
                   ->execute(["Avis enviat " . date('Y-m-d'), $v['id']]);
            }
            header('Location: alumnes.php?msg=' . ($sent ? 'ok' : 'err')); exit;
        }
        header('Location: alumnes.php'); exit;
    }

    if ($action === 'elimina') {
        $db->prepare("DELETE FROM waitlist WHERE id=?")->execute([(int)$_POST['id']]);
        header('Location: alumnes.php'); exit;
    }
}

/* ── Data ─────────────────────────────────────────────── */
if ($authed) {
    $db = db();

    // Resum per taller (espera)
    $resum = $db->query("SELECT taller_nom, COUNT(*) as n FROM waitlist WHERE estat='espera' GROUP BY taller ORDER BY n DESC")->fetchAll(PDO::FETCH_ASSOC);

    // Llista completa
    $filtre = $_GET['estat'] ?? 'tots';
    $where  = match($filtre) {
        'espera'    => "WHERE estat='espera'",
        'contactat' => "WHERE estat='contactat'",
        'confirmat' => "WHERE estat='confirmat'",
        'completat' => "WHERE estat='completat'",
        default     => ''
    };
    $llista = $db->query("SELECT * FROM waitlist $where ORDER BY taller, data_inscripcio ASC")->fetchAll(PDO::FETCH_ASSOC);

    $n_espera    = (int)$db->query("SELECT COUNT(*) FROM waitlist WHERE estat='espera'")->fetchColumn();
    $n_contactat = (int)$db->query("SELECT COUNT(*) FROM waitlist WHERE estat='contactat'")->fetchColumn();
    $n_confirmat = (int)$db->query("SELECT COUNT(*) FROM waitlist WHERE estat='confirmat'")->fetchColumn();
    $n_completat = (int)$db->query("SELECT COUNT(*) FROM waitlist WHERE estat='completat'")->fetchColumn();
    $n_total     = $n_espera + $n_contactat + $n_confirmat + $n_completat;
}

/* ── Helpers ──────────────────────────────────────────── */
function e(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function estat_pill(string $estat): string {
    $label = match($estat) { 'espera'=>'Espera', 'contactat'=>'Contactat', 'confirmat'=>'Confirmat', 'completat'=>'Completat', default=>$estat };
    $cls   = match($estat) { 'espera'=>'pill-espera', 'contactat'=>'pill-contactat', 'confirmat'=>'pill-confirmat', 'completat'=>'pill-completat', default=>'' };
    return '<span class="pill '.$cls.'">'.e($label).'</span>';
}
?>
<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Alumnes · Llumàtics</title>
  <style>
    :root {
      --bg:      #FAFAF8;
      --bg-alt:  #F2F0EC;
      --ink:     #1A1A18;
      --ink2:    #444440;
      --ink3:    #6B6B65;
      --accent:  #C8A96E;
      --accent2: #A8893E;
      --border:  #E0DED8;
      --surface: #EEECEA;
      --warn:    #8b2500;
      --green:   #2d6a2d;
      --blue:    #1a4a7a;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--ink); font-family: system-ui, 'Inter', sans-serif; font-size: 13px; line-height: 1.6; min-height: 100vh; }

    /* Login */
    #login { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .login-box { width: 320px; padding: 2.5rem; border: 1px solid var(--border); }
    .login-logo { font-family: Georgia, serif; font-size: 1.3rem; font-weight: 700; margin-bottom: .3rem; }
    .login-logo span { color: var(--accent); }
    .login-sub { font-size: 11px; color: var(--ink3); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 2rem; }
    #pwd { width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--border); padding: .5rem 0; font-size: 15px; color: var(--ink); outline: none; margin-bottom: 1.5rem; letter-spacing: .1em; }
    #pwd:focus { border-bottom-color: var(--accent); }
    .err { color: var(--warn); font-size: 11px; margin-top: .75rem; }

    /* Layout */
    .topbar { display: flex; align-items: center; gap: 1rem; padding: .75rem 2rem; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 20; flex-wrap: wrap; }
    .topbar-logo { font-family: Georgia, serif; font-size: 1rem; font-weight: 700; }
    .topbar-logo span { color: var(--accent); }
    .topbar-title { flex: 1; font-size: 11px; color: var(--ink3); letter-spacing: .08em; text-transform: uppercase; }
    .topbar-links { display: flex; gap: .5rem; }
    .topbar-links a { font-size: 11px; color: var(--ink3); text-decoration: none; padding: .25rem .6rem; border: 1px solid var(--border); }
    .topbar-links a:hover { color: var(--ink); border-color: var(--ink3); }
    .main { padding: 2rem; max-width: 1200px; }

    /* Flash */
    .flash { padding: .6rem 1rem; margin-bottom: 1.5rem; border: 1px solid; }
    .flash-ok  { border-color: #2d6a2d; color: #2d6a2d; background: #e8f5e8; }
    .flash-err { border-color: var(--warn); color: var(--warn); background: #fde8e8; }

    /* Resum tallers */
    .resum { display: flex; gap: .75rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .resum-card { border: 1px solid var(--border); padding: .75rem 1rem; min-width: 160px; }
    .resum-taller { font-size: 11px; color: var(--ink3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: .25rem; }
    .resum-n { font-size: 1.8rem; font-family: Georgia, serif; font-weight: 700; line-height: 1; }
    .resum-n.alert { color: var(--accent2); }
    .resum-lbl { font-size: 11px; color: var(--ink3); }

    /* KPIs */
    .kpis { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .kpi { border: 1px solid var(--border); padding: 1rem 1.5rem; min-width: 120px; }
    .kpi-val { font-size: 2rem; font-family: Georgia, serif; font-weight: 700; line-height: 1; }
    .kpi-lbl { font-size: 11px; color: var(--ink3); text-transform: uppercase; letter-spacing: .08em; margin-top: .3rem; }

    /* Filtres */
    .filtres { display: flex; gap: .4rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filtre { font-size: 11px; padding: .28rem .65rem; border: 1px solid var(--border); color: var(--ink3); text-decoration: none; }
    .filtre:hover { border-color: var(--ink3); color: var(--ink); }
    .filtre.actiu { border-color: var(--accent); color: var(--accent); background: #fdf8f0; }

    /* Taula */
    .table-wrap { overflow-x: auto; margin-bottom: 3rem; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink3); border-bottom: 1px solid var(--border); padding: .5rem .75rem; white-space: nowrap; }
    td { padding: .6rem .75rem; border-bottom: 1px solid var(--surface); vertical-align: top; }
    tr:hover td { background: var(--bg-alt); }

    /* Pills */
    .pill { font-size: 10px; padding: .2rem .55rem; letter-spacing: .04em; text-transform: uppercase; font-weight: 600; white-space: nowrap; }
    .pill-espera    { background: #fff3e0; color: #8a5000; }
    .pill-contactat { background: #e3f0ff; color: var(--blue); }
    .pill-confirmat { background: #e8f5e8; color: var(--green); }
    .pill-completat { background: #eee; color: var(--ink3); }

    /* Actions */
    .actions { display: flex; gap: .3rem; flex-wrap: wrap; margin-top: .3rem; }
    .btn-act { font-size: 10px; padding: .2rem .5rem; border: 1px solid var(--border); background: transparent; color: var(--ink3); cursor: pointer; white-space: nowrap; }
    .btn-act:hover { border-color: var(--ink3); color: var(--ink); }
    .btn-act.primary { border-color: var(--accent); color: var(--accent2); }
    .btn-act.primary:hover { background: #fdf8f0; }
    .btn-act.danger { border-color: #e8aaaa; color: var(--warn); }

    /* Formulari add */
    .add-section { margin-bottom: 2rem; }
    .add-toggle { font-size: 12px; background: none; border: 1px solid var(--border); padding: .35rem .8rem; cursor: pointer; color: var(--ink3); }
    .add-toggle:hover { border-color: var(--ink3); color: var(--ink); }
    .add-form { display: none; margin-top: 1rem; border: 1px solid var(--border); padding: 1.5rem; background: var(--bg-alt); }
    .add-form.open { display: block; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: .75rem; }
    .form-grid .full { grid-column: 1 / -1; }
    label { display: block; font-size: 11px; color: var(--ink3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: .25rem; }
    input[type=text], input[type=date], input[type=email], textarea {
      width: 100%; background: var(--bg); border: 1px solid var(--border); padding: .4rem .6rem;
      font-size: 13px; color: var(--ink); font-family: inherit; outline: none;
    }
    input:focus, textarea:focus { border-color: var(--accent); }
    .btn-submit { background: var(--accent); color: var(--ink); border: none; padding: .55rem 1.25rem; font-size: 12px; font-weight: 600; letter-spacing: .06em; cursor: pointer; margin-top: 1rem; }
    .btn-submit:hover { background: var(--accent2); }

    /* Nota inline */
    .nota-form { display: flex; gap: .3rem; margin-top: .3rem; }
    .nota-form input { flex: 1; padding: .2rem .4rem; font-size: 11px; }
    .nota-form button { font-size: 11px; padding: .2rem .5rem; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
    .nota-txt { font-size: 11px; color: var(--ink2); margin-bottom: .2rem; }

    .btn-logout { font-size: 11px; background: none; border: 1px solid var(--border); padding: .25rem .6rem; cursor: pointer; color: var(--ink3); }
    .btn-logout:hover { border-color: var(--warn); color: var(--warn); }

    .taller-grup { font-size: 11px; color: var(--ink3); font-style: italic; }
    @media (max-width: 600px) { .main { padding: 1rem; } }
  </style>
</head>
<body>

<?php if (!$authed): ?>
<div id="login">
  <div class="login-box">
    <div class="login-logo">Llum<span>à</span>tics</div>
    <div class="login-sub">Alumnes / Waitlist</div>
    <form method="post">
      <input type="password" id="pwd" name="pwd" placeholder="Contrasenya" autofocus autocomplete="current-password">
      <br>
      <button type="submit" class="btn-submit">Entrar</button>
      <div class="err"><?= isset($login_error) ? 'Contrasenya incorrecta.' : '' ?></div>
    </form>
  </div>
</div>
<?php else: ?>

<div class="topbar">
  <div class="topbar-logo">Llum<span style="color:var(--accent)">à</span>tics</div>
  <div class="topbar-title">Alumnes / Waitlist</div>
  <div class="topbar-links">
    <a href="index.html">Stats</a>
    <a href="vals.php">Vals-regal</a>
  </div>
  <form method="post" style="margin:0">
    <input type="hidden" name="logout" value="1">
    <button type="submit" class="btn-logout">Sortir</button>
  </form>
</div>

<div class="main">

  <?php if (isset($_GET['msg'])): ?>
    <div class="flash <?= $_GET['msg']==='ok' ? 'flash-ok' : 'flash-err' ?>">
      <?= $_GET['msg']==='ok' ? 'Avís enviat correctament.' : 'Error enviant l\'avís. Comprova la connexió SMTP.' ?>
    </div>
  <?php endif ?>

  <!-- KPIs -->
  <div class="kpis">
    <div class="kpi">
      <div class="kpi-val"><?= $n_espera ?></div>
      <div class="kpi-lbl">En espera</div>
    </div>
    <div class="kpi">
      <div class="kpi-val"><?= $n_contactat ?></div>
      <div class="kpi-lbl">Contactats</div>
    </div>
    <div class="kpi">
      <div class="kpi-val"><?= $n_confirmat ?></div>
      <div class="kpi-lbl">Confirmats</div>
    </div>
    <div class="kpi">
      <div class="kpi-val"><?= $n_completat ?></div>
      <div class="kpi-lbl">Completats</div>
    </div>
  </div>

  <!-- Resum per taller -->
  <?php if (!empty($resum)): ?>
  <h2 style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);margin-bottom:.75rem">Espera per taller</h2>
  <div class="resum" style="margin-bottom:2rem">
    <?php foreach ($resum as $r): ?>
    <div class="resum-card">
      <div class="resum-taller"><?= e($r['taller_nom']) ?></div>
      <div class="resum-n <?= $r['n'] >= 2 ? 'alert' : '' ?>"><?= $r['n'] ?></div>
      <div class="resum-lbl"><?= $r['n'] >= 2 ? 'proposa data' : 'persona' ?></div>
    </div>
    <?php endforeach ?>
  </div>
  <?php endif ?>

  <!-- Afegir entrada manual -->
  <div class="add-section">
    <button class="add-toggle" onclick="document.getElementById('add-form').classList.toggle('open')">+ Afegir entrada manual</button>
    <div class="add-form" id="add-form">
      <form method="post">
        <input type="hidden" name="action" value="add">
        <div class="form-grid">
          <div>
            <label>Email</label>
            <input type="email" name="email" required>
          </div>
          <div>
            <label>Taller (slug)</label>
            <input type="text" name="taller" placeholder="revelat-bn" required>
          </div>
          <div>
            <label>Nom del taller</label>
            <input type="text" name="taller_nom" placeholder="Revelat en B/N" required>
          </div>
          <div>
            <label>Data inscripció</label>
            <input type="date" name="data_inscripcio" value="<?= date('Y-m-d') ?>">
          </div>
          <div class="full">
            <label>Notes internes</label>
            <input type="text" name="notes">
          </div>
        </div>
        <button type="submit" class="btn-submit">Guardar</button>
      </form>
    </div>
  </div>

  <!-- Filtres -->
  <div class="filtres">
    <a href="alumnes.php?estat=tots"      class="filtre <?= $filtre==='tots'      ? 'actiu':'' ?>">Tots (<?= $n_total ?>)</a>
    <a href="alumnes.php?estat=espera"    class="filtre <?= $filtre==='espera'    ? 'actiu':'' ?>">Espera (<?= $n_espera ?>)</a>
    <a href="alumnes.php?estat=contactat" class="filtre <?= $filtre==='contactat' ? 'actiu':'' ?>">Contactats (<?= $n_contactat ?>)</a>
    <a href="alumnes.php?estat=confirmat" class="filtre <?= $filtre==='confirmat' ? 'actiu':'' ?>">Confirmats (<?= $n_confirmat ?>)</a>
    <a href="alumnes.php?estat=completat" class="filtre <?= $filtre==='completat' ? 'actiu':'' ?>">Completats (<?= $n_completat ?>)</a>
  </div>

  <!-- Taula -->
  <div class="table-wrap">
    <?php if (empty($llista)): ?>
      <p style="color:var(--ink3); padding: 2rem 0">Cap entrada per mostrar.</p>
    <?php else: ?>
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Taller</th>
          <th>Estat</th>
          <th>Inscripció</th>
          <th>Notes / Accions</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($llista as $a): ?>
        <tr>
          <td><a href="mailto:<?= e($a['email']) ?>" style="color:var(--ink2)"><?= e($a['email']) ?></a></td>
          <td>
            <?= e($a['taller_nom']) ?>
            <div class="taller-grup"><?= e($a['taller']) ?></div>
          </td>
          <td><?= estat_pill($a['estat']) ?></td>
          <td style="white-space:nowrap"><?= e($a['data_inscripcio']) ?></td>
          <td>
            <?php if ($a['notes']): ?>
              <div class="nota-txt"><?= e($a['notes']) ?></div>
            <?php endif ?>
            <form method="post" class="nota-form">
              <input type="hidden" name="action" value="nota">
              <input type="hidden" name="id" value="<?= $a['id'] ?>">
              <input type="text" name="notes" placeholder="Afegir nota…" value="<?= e($a['notes'] ?? '') ?>">
              <button type="submit">✓</button>
            </form>
            <div class="actions">
              <?php if ($a['estat'] === 'espera'): ?>
                <form method="post" onsubmit="return confirm('Enviar avís de places al ' + <?= json_encode($a['email']) ?> + '?')">
                  <input type="hidden" name="action" value="avisa">
                  <input type="hidden" name="id" value="<?= $a['id'] ?>">
                  <button type="submit" class="btn-act primary">Avisa</button>
                </form>
                <form method="post">
                  <input type="hidden" name="action" value="contactat">
                  <input type="hidden" name="id" value="<?= $a['id'] ?>">
                  <button type="submit" class="btn-act">Contactat</button>
                </form>
              <?php elseif ($a['estat'] === 'contactat'): ?>
                <form method="post">
                  <input type="hidden" name="action" value="confirmat">
                  <input type="hidden" name="id" value="<?= $a['id'] ?>">
                  <button type="submit" class="btn-act primary">Confirmat</button>
                </form>
                <form method="post">
                  <input type="hidden" name="action" value="espera">
                  <input type="hidden" name="id" value="<?= $a['id'] ?>">
                  <button type="submit" class="btn-act">Tornar a espera</button>
                </form>
              <?php elseif ($a['estat'] === 'confirmat'): ?>
                <form method="post">
                  <input type="hidden" name="action" value="completat">
                  <input type="hidden" name="id" value="<?= $a['id'] ?>">
                  <button type="submit" class="btn-act">Completat</button>
                </form>
              <?php endif ?>
              <form method="post" onsubmit="return confirm('Eliminar aquesta entrada?')">
                <input type="hidden" name="action" value="elimina">
                <input type="hidden" name="id" value="<?= $a['id'] ?>">
                <button type="submit" class="btn-act danger">Eliminar</button>
              </form>
            </div>
          </td>
        </tr>
        <?php endforeach ?>
      </tbody>
    </table>
    <?php endif ?>
  </div>

</div>
<?php endif ?>
</body>
</html>
