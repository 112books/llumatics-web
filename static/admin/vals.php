<?php
session_start();

define('ADMIN_PASSWORD', 'llumatics');
define('DB_PATH',        __DIR__ . '/vals.db');
require_once __DIR__ . '/config.php';

/* ── Auth ─────────────────────────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pwd'])) {
    if ($_POST['pwd'] === ADMIN_PASSWORD) {
        $_SESSION['vals_ok'] = true;
    } else {
        $login_error = true;
    }
}
if (isset($_POST['logout'])) {
    session_destroy();
    header('Location: vals.php');
    exit;
}

$authed = !empty($_SESSION['vals_ok']);

/* ── DB ───────────────────────────────────────────────── */
function db(): PDO {
    static $pdo;
    if (!$pdo) {
        $pdo = new PDO('sqlite:' . DB_PATH);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("CREATE TABLE IF NOT EXISTS vals (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            codi            TEXT UNIQUE NOT NULL,
            taller          TEXT NOT NULL,
            import          TEXT NOT NULL,
            per_a           TEXT NOT NULL,
            de_part_de      TEXT NOT NULL,
            email_comprador TEXT NOT NULL,
            paypal_order    TEXT,
            missatge        TEXT,
            data_compra     TEXT NOT NULL,
            data_caducitat  TEXT NOT NULL,
            estat           TEXT NOT NULL DEFAULT 'actiu',
            notes           TEXT,
            created_at      TEXT DEFAULT (datetime('now'))
        )");
        seed($pdo);
    }
    return $pdo;
}

function seed(PDO $pdo): void {
    $pending = [
        [
            'codi'            => 'LLM-2026-0X2ZB',
            'taller'          => 'Aprende a controlar la luz',
            'import'          => '220€',
            'per_a'           => 'Ale',
            'de_part_de'      => 'Kids',
            'email_comprador' => 'elenavigoolivan@gmail.com',
            'paypal_order'    => '1RM83369NY2371501',
            'missatge'        => 'Felicidades amiga!! Te mereces el mejor curso para aprender lo que más te guste 😍😍 te queremos!',
            'data_compra'     => '2026-07-17',
            'data_caducitat'  => '2027-01-17',
        ],
        [
            'codi'            => 'LLM-2026-OPUH9',
            'taller'          => 'Introduction to darkroom printing',
            'import'          => '170€',
            'per_a'           => 'Nataliia Lisohurska',
            'de_part_de'      => 'Michael Kisselgof',
            'email_comprador' => 'mdkisselgof@gmail.com',
            'paypal_order'    => '',
            'missatge'        => 'Happy Birthday Guapa! You clearly have an eye for the camera so I figured getting you into the dark room to throw you further down the rabbit hole is only natural :) Love Michael',
            'data_compra'     => '2026-08-11',
            'data_caducitat'  => '2027-02-11',
        ],
    ];
    $stmt = $pdo->prepare("INSERT OR IGNORE INTO vals
        (codi, taller, import, per_a, de_part_de, email_comprador, paypal_order, missatge, data_compra, data_caducitat)
        VALUES (:codi,:taller,:import,:per_a,:de_part_de,:email_comprador,:paypal_order,:missatge,:data_compra,:data_caducitat)");
    foreach ($pending as $v) $stmt->execute($v);
}

/* ── Actions ──────────────────────────────────────────── */
if ($authed && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $db = db();

    if ($action === 'add') {
        $db->prepare("INSERT OR IGNORE INTO vals
            (codi,taller,import,per_a,de_part_de,email_comprador,paypal_order,missatge,data_compra,data_caducitat,notes)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)")->execute([
            trim($_POST['codi']),   trim($_POST['taller']),
            trim($_POST['import']), trim($_POST['per_a']),
            trim($_POST['de_part_de']), trim($_POST['email_comprador']),
            trim($_POST['paypal_order']), trim($_POST['missatge']),
            $_POST['data_compra'],  $_POST['data_caducitat'],
            trim($_POST['notes']),
        ]);
        header('Location: vals.php'); exit;
    }

    if ($action === 'bescanviat') {
        $db->prepare("UPDATE vals SET estat='bescanviat' WHERE id=?")->execute([$_POST['id']]);
        header('Location: vals.php'); exit;
    }

    if ($action === 'reactiva') {
        $db->prepare("UPDATE vals SET estat='actiu' WHERE id=?")->execute([$_POST['id']]);
        header('Location: vals.php'); exit;
    }

    if ($action === 'cancel') {
        $db->prepare("UPDATE vals SET estat='cancel·lat' WHERE id=?")->execute([$_POST['id']]);
        header('Location: vals.php'); exit;
    }

    if ($action === 'nota') {
        $db->prepare("UPDATE vals SET notes=? WHERE id=?")->execute([trim($_POST['notes']), $_POST['id']]);
        header('Location: vals.php'); exit;
    }

    if ($action === 'recordatori') {
        $v = db()->query("SELECT * FROM vals WHERE id=" . (int)$_POST['id'])->fetch(PDO::FETCH_ASSOC);
        if ($v && $v['estat'] === 'actiu') {
            $subject = "Reminder: your Llumàtics gift voucher";
            $body    = "Hi,\n\n"
                     . "We wanted to remind you that {$v['per_a']} has a gift voucher"
                     . " for \"{$v['taller']}\" at Llumàtics, generously offered by {$v['de_part_de']}.\n\n"
                     . "Voucher code: {$v['codi']}\n"
                     . "Valid until: {$v['data_caducitat']}\n\n"
                     . "Whenever you're ready to book a date, just reply to this email"
                     . " or write us at hola@llumatics.com — we'll find something that works.\n\n"
                     . "Joan — Llumàtics\nhttps://llumatics.com\n";
            $sent = smtp_send($v['email_comprador'], MAIL_FROM, MAIL_FROM_NAME, $subject, $body);
            if ($sent) {
                db()->prepare("UPDATE vals SET notes=? WHERE id=?")
                    ->execute(["Recordatori enviat " . date('Y-m-d'), $v['id']]);
            }
            header('Location: vals.php?msg=' . ($sent ? 'ok' : 'err')); exit;
        }
        header('Location: vals.php'); exit;
    }
}

function smtp_send(string $to, string $from, string $fromName, string $subject, string $body): bool {
    $ctx  = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'allow_self_signed' => false]]);
    $conn = @stream_socket_client(SMTP_HOST . ':' . SMTP_PORT, $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $ctx);
    if (!$conn) return false;
    stream_set_timeout($conn, 30);
    smtp_r($conn); // 220
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

/* ── Data ─────────────────────────────────────────────── */
if ($authed) {
    $db = db();
    $filtre = $_GET['estat'] ?? 'tots';
    $where  = match($filtre) {
        'actiu'      => "WHERE estat='actiu'",
        'bescanviat' => "WHERE estat='bescanviat'",
        'cancel·lat' => "WHERE estat='cancel·lat'",
        default      => ''
    };
    $vals      = $db->query("SELECT * FROM vals $where ORDER BY data_caducitat ASC")->fetchAll(PDO::FETCH_ASSOC);
    $n_actius  = (int)$db->query("SELECT COUNT(*) FROM vals WHERE estat='actiu'")->fetchColumn();
    $n_total   = (int)$db->query("SELECT COUNT(*) FROM vals")->fetchColumn();
    $n_besc    = (int)$db->query("SELECT COUNT(*) FROM vals WHERE estat='bescanviat'")->fetchColumn();
    $suma      = (float)$db->query("SELECT COALESCE(SUM(CAST(REPLACE(REPLACE(import,'€',''),' ','') AS REAL)),0) FROM vals")->fetchColumn();
}

/* ── Helpers ──────────────────────────────────────────── */
function e(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function estat_pill(string $e): string {
    $label = match($e) { 'actiu'=>'Actiu', 'bescanviat'=>'Bescanviat', 'cancel·lat'=>'Cancel·lat', default=>$e };
    $cls   = match($e) { 'actiu'=>'pill-actiu', 'bescanviat'=>'pill-besc', default=>'pill-cancel' };
    return '<span class="pill '.$cls.'">'.e($label).'</span>';
}
function caducitat_class(string $data): string {
    $dies = (strtotime($data) - time()) / 86400;
    if ($dies < 0)  return 'caducitat-expired';
    if ($dies < 30) return 'caducitat-warn';
    return '';
}
?>
<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Vals-regal · Llumàtics</title>
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
    .err { color: var(--warn); font-size: 11px; margin-top: .75rem; min-height: 1.2em; }

    /* Layout */
    #app { display: none; }
    .topbar { display: flex; align-items: center; gap: 1rem; padding: .75rem 2rem; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 20; flex-wrap: wrap; }
    .topbar-logo { font-family: Georgia, serif; font-size: 1rem; font-weight: 700; }
    .topbar-logo span { color: var(--accent); }
    .topbar-title { flex: 1; font-size: 11px; color: var(--ink3); letter-spacing: .08em; text-transform: uppercase; }
    .topbar-links { display: flex; gap: .5rem; }
    .topbar-links a { font-size: 11px; color: var(--ink3); text-decoration: none; padding: .25rem .6rem; border: 1px solid var(--border); }
    .topbar-links a:hover { color: var(--ink); border-color: var(--ink3); }

    .main { padding: 2rem; max-width: 1200px; }

    /* KPIs */
    .kpis { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .kpi { border: 1px solid var(--border); padding: 1rem 1.5rem; min-width: 130px; }
    .kpi-val { font-size: 2rem; font-family: Georgia, serif; font-weight: 700; line-height: 1; }
    .kpi-lbl { font-size: 11px; color: var(--ink3); text-transform: uppercase; letter-spacing: .08em; margin-top: .3rem; }

    /* Filtres */
    .filtres { display: flex; gap: .4rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center; }
    .filtre { font-size: 11px; padding: .28rem .65rem; border: 1px solid var(--border); color: var(--ink3); text-decoration: none; }
    .filtre:hover { border-color: var(--ink3); color: var(--ink); }
    .filtre.actiu { border-color: var(--accent); color: var(--accent); background: #fdf8f0; }
    .filtres-sep { margin-left: auto; }

    /* Taula */
    .table-wrap { overflow-x: auto; margin-bottom: 3rem; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink3); border-bottom: 1px solid var(--border); padding: .5rem .75rem; white-space: nowrap; }
    td { padding: .6rem .75rem; border-bottom: 1px solid var(--surface); vertical-align: top; }
    tr:hover td { background: var(--bg-alt); }

    /* Pills */
    .pill { font-size: 10px; padding: .2rem .55rem; letter-spacing: .04em; text-transform: uppercase; font-weight: 600; white-space: nowrap; }
    .pill-actiu  { background: #e8f5e8; color: var(--green); }
    .pill-besc   { background: #eee; color: var(--ink3); }
    .pill-cancel { background: #fde8e8; color: var(--warn); }

    /* Caducitat */
    .caducitat-expired { color: var(--warn); font-weight: 600; }
    .caducitat-warn    { color: #9a6000; font-weight: 600; }

    .codi { font-family: monospace; font-size: 12px; letter-spacing: .05em; }
    .missatge-txt { font-size: 11px; color: var(--ink3); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Actions */
    .actions { display: flex; gap: .3rem; flex-wrap: wrap; }
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
    textarea { resize: vertical; min-height: 60px; }
    .btn-submit { background: var(--accent); color: var(--ink); border: none; padding: .55rem 1.25rem; font-size: 12px; font-weight: 600; letter-spacing: .06em; cursor: pointer; margin-top: 1rem; }
    .btn-submit:hover { background: var(--accent2); }

    /* Nota inline */
    .nota-form { display: flex; gap: .3rem; margin-top: .3rem; }
    .nota-form input { flex: 1; padding: .2rem .4rem; font-size: 11px; }
    .nota-form button { font-size: 11px; padding: .2rem .5rem; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
    .nota-txt { font-size: 11px; color: var(--ink2); margin-top: .2rem; }

    .btn-logout { font-size: 11px; background: none; border: 1px solid var(--border); padding: .25rem .6rem; cursor: pointer; color: var(--ink3); }
    .btn-logout:hover { border-color: var(--warn); color: var(--warn); }

    @media (max-width: 600px) {
      .main { padding: 1rem; }
      .kpis { gap: .5rem; }
      .kpi { min-width: 100px; }
    }
  </style>
</head>
<body>

<?php if (!$authed): ?>
<div id="login">
  <div class="login-box">
    <div class="login-logo">Llum<span>à</span>tics</div>
    <div class="login-sub">Vals-regal</div>
    <form method="post">
      <input type="password" id="pwd" name="pwd" placeholder="Contrasenya" autofocus autocomplete="current-password">
      <br>
      <button type="submit" class="btn-submit">Entrar</button>
      <div class="err"><?= isset($login_error) ? 'Contrasenya incorrecta.' : '' ?></div>
    </form>
  </div>
</div>
<?php else: ?>

<div id="app" style="display:block">
  <div class="topbar">
    <div class="topbar-logo">Llum<span style="color:var(--accent)">à</span>tics</div>
    <div class="topbar-title">Vals-regal</div>
    <div class="topbar-links">
      <a href="index.html">Stats</a>
      <a href="alumnes.php">Alumnes</a>
    </div>
    <form method="post" style="margin:0">
      <input type="hidden" name="logout" value="1">
      <button type="submit" class="btn-logout">Sortir</button>
    </form>
  </div>

  <div class="main">
    <?php if (isset($_GET['msg'])): ?>
      <div style="padding:.6rem 1rem;margin-bottom:1rem;border:1px solid;<?= $_GET['msg']==='ok' ? 'border-color:#2d6a2d;color:#2d6a2d;background:#e8f5e8' : 'border-color:#8b2500;color:#8b2500;background:#fde8e8' ?>">
        <?= $_GET['msg']==='ok' ? 'Recordatori enviat correctament.' : 'Error enviant el recordatori. Comprova la connexió SMTP.' ?>
      </div>
    <?php endif ?>


    <!-- KPIs -->
    <div class="kpis">
      <div class="kpi">
        <div class="kpi-val"><?= $n_actius ?></div>
        <div class="kpi-lbl">Vals actius</div>
      </div>
      <div class="kpi">
        <div class="kpi-val"><?= $n_besc ?></div>
        <div class="kpi-lbl">Bescanviats</div>
      </div>
      <div class="kpi">
        <div class="kpi-val"><?= $n_total ?></div>
        <div class="kpi-lbl">Total emesos</div>
      </div>
      <div class="kpi">
        <div class="kpi-val"><?= number_format($suma, 0, ',', '.') ?>€</div>
        <div class="kpi-lbl">Volum total</div>
      </div>
    </div>

    <!-- Afegir val manual -->
    <div class="add-section">
      <button class="add-toggle" onclick="document.getElementById('add-form').classList.toggle('open')">+ Afegir val manualment</button>
      <div class="add-form" id="add-form">
        <form method="post">
          <input type="hidden" name="action" value="add">
          <div class="form-grid">
            <div>
              <label>Codi</label>
              <input type="text" name="codi" placeholder="LLM-2026-XXXXX" required>
            </div>
            <div>
              <label>Taller</label>
              <input type="text" name="taller" required>
            </div>
            <div>
              <label>Import</label>
              <input type="text" name="import" placeholder="170€" required>
            </div>
            <div>
              <label>Per a (destinatari)</label>
              <input type="text" name="per_a" required>
            </div>
            <div>
              <label>De part de</label>
              <input type="text" name="de_part_de" required>
            </div>
            <div>
              <label>Email comprador</label>
              <input type="email" name="email_comprador" required>
            </div>
            <div>
              <label>Ordre PayPal</label>
              <input type="text" name="paypal_order">
            </div>
            <div>
              <label>Data compra</label>
              <input type="date" name="data_compra" required>
            </div>
            <div>
              <label>Caduca</label>
              <input type="date" name="data_caducitat" required>
            </div>
            <div class="full">
              <label>Missatge</label>
              <textarea name="missatge"></textarea>
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
      <a href="vals.php?estat=tots"       class="filtre <?= $filtre==='tots'       ? 'actiu':'' ?>">Tots (<?= $n_total ?>)</a>
      <a href="vals.php?estat=actiu"      class="filtre <?= $filtre==='actiu'      ? 'actiu':'' ?>">Actius (<?= $n_actius ?>)</a>
      <a href="vals.php?estat=bescanviat" class="filtre <?= $filtre==='bescanviat' ? 'actiu':'' ?>">Bescanviats (<?= $n_besc ?>)</a>
    </div>

    <!-- Taula -->
    <div class="table-wrap">
      <?php if (empty($vals)): ?>
        <p style="color:var(--ink3); padding: 2rem 0">Cap val per mostrar.</p>
      <?php else: ?>
      <table>
        <thead>
          <tr>
            <th>Codi</th>
            <th>Estat</th>
            <th>Taller</th>
            <th>Import</th>
            <th>Per a</th>
            <th>De</th>
            <th>Email comprador</th>
            <th>Compra</th>
            <th>Caduca</th>
            <th>Notes / Accions</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($vals as $v): ?>
          <tr>
            <td><span class="codi"><?= e($v['codi']) ?></span></td>
            <td><?= estat_pill($v['estat']) ?></td>
            <td><?= e($v['taller']) ?>
              <?php if ($v['missatge']): ?>
                <div class="missatge-txt" title="<?= e($v['missatge']) ?>">💬 <?= e($v['missatge']) ?></div>
              <?php endif ?>
            </td>
            <td><?= e($v['import']) ?></td>
            <td><?= e($v['per_a']) ?></td>
            <td><?= e($v['de_part_de']) ?></td>
            <td><a href="mailto:<?= e($v['email_comprador']) ?>" style="color:var(--ink2)"><?= e($v['email_comprador']) ?></a></td>
            <td style="white-space:nowrap"><?= e($v['data_compra']) ?></td>
            <td style="white-space:nowrap" class="<?= $v['estat']==='actiu' ? caducitat_class($v['data_caducitat']) : '' ?>">
              <?= e($v['data_caducitat']) ?>
            </td>
            <td>
              <!-- Nota -->
              <?php if ($v['notes']): ?>
                <div class="nota-txt"><?= e($v['notes']) ?></div>
              <?php endif ?>
              <form method="post" class="nota-form">
                <input type="hidden" name="action" value="nota">
                <input type="hidden" name="id" value="<?= $v['id'] ?>">
                <input type="text" name="notes" placeholder="Afegir nota…" value="<?= e($v['notes'] ?? '') ?>">
                <button type="submit">✓</button>
              </form>
              <!-- Accions d'estat -->
              <div class="actions" style="margin-top:.4rem">
                <?php if ($v['estat'] === 'actiu'): ?>
                  <form method="post" onsubmit="return confirm('Marcar com a bescanviat?')">
                    <input type="hidden" name="action" value="bescanviat">
                    <input type="hidden" name="id" value="<?= $v['id'] ?>">
                    <button type="submit" class="btn-act primary">Bescanviat</button>
                  </form>
                  <form method="post" onsubmit="return confirm('Enviar recordatori a ' + <?= json_encode($v['email_comprador']) ?> + '?')">
                    <input type="hidden" name="action" value="recordatori">
                    <input type="hidden" name="id" value="<?= $v['id'] ?>">
                    <button type="submit" class="btn-act">Recordatori</button>
                  </form>
                  <form method="post" onsubmit="return confirm('Cancel·lar aquest val?')">
                    <input type="hidden" name="action" value="cancel">
                    <input type="hidden" name="id" value="<?= $v['id'] ?>">
                    <button type="submit" class="btn-act danger">Cancel·lar</button>
                  </form>
                <?php elseif ($v['estat'] === 'bescanviat'): ?>
                  <form method="post" onsubmit="return confirm('Reactivar?')">
                    <input type="hidden" name="action" value="reactiva">
                    <input type="hidden" name="id" value="<?= $v['id'] ?>">
                    <button type="submit" class="btn-act">Reactivar</button>
                  </form>
                <?php endif ?>
              </div>
            </td>
          </tr>
          <?php endforeach ?>
        </tbody>
      </table>
      <?php endif ?>
    </div>

  </div><!-- /main -->
</div><!-- /app -->
<?php endif ?>

</body>
</html>
