<?php
// subscribe.php — Subscripció local (butlletí i material d'alumnes) amb doble opt-in.
// Sense Brevo: desa a SQLite (admin/vals.db) i envia la confirmació pel MTA local.
require_once __DIR__ . '/mailer.php';

$VALS_DB = __DIR__ . '/admin/vals.db';

function sub_db(): PDO {
    global $VALS_DB;
    $pdo = new PDO('sqlite:' . $VALS_DB);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("CREATE TABLE IF NOT EXISTS subscribers (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        email      TEXT NOT NULL,
        nom        TEXT,
        taller     TEXT NOT NULL DEFAULT '',
        idioma     TEXT,
        newsletter INTEGER NOT NULL DEFAULT 0,
        estat      TEXT NOT NULL DEFAULT 'pendent',
        token      TEXT UNIQUE,
        creat      TEXT,
        confirmat  TEXT,
        UNIQUE(email, taller)
    )");
    return $pdo;
}

function sub_json(array $a): void {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($a);
    exit;
}

function sub_rate_ok(string $ip, int $max = 8, int $window = 3600): bool {
    try {
        $pdo = sub_db();
        $pdo->exec("CREATE TABLE IF NOT EXISTS form_rate (ip TEXT NOT NULL, ts INTEGER NOT NULL)");
        $since = time() - $window;
        $pdo->prepare("DELETE FROM form_rate WHERE ts < ?")->execute([$since]);
        $s = $pdo->prepare("SELECT COUNT(*) FROM form_rate WHERE ip=? AND ts>=?");
        $s->execute([$ip, $since]);
        if ((int)$s->fetchColumn() >= $max) return false;
        $pdo->prepare("INSERT INTO form_rate (ip, ts) VALUES (?,?)")->execute([$ip, time()]);
        return true;
    } catch (Exception $e) { return true; }
}

// ── Confirmació / baixa (GET) ──────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pdo = sub_db();

    if (!empty($_GET['confirm'])) {
        $tok = preg_replace('/[^a-f0-9]/', '', (string)$_GET['confirm']);
        $s = $pdo->prepare("SELECT * FROM subscribers WHERE token=?");
        $s->execute([$tok]);
        $row = $s->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $pdo->prepare("UPDATE subscribers SET estat='confirmat', confirmat=? WHERE id=?")
                ->execute([date('Y-m-d H:i:s'), $row['id']]);
            if ($row['taller'] !== '') {
                $url = '/tallers/' . rawurlencode($row['taller']) . '/privat/doc/?nom=' . rawurlencode((string)$row['nom'])
                     . '&taller=' . rawurlencode($row['taller']) . '&lang=' . rawurlencode((string)$row['idioma']);
            } else {
                $url = '/gracies/?from=newsletter';
            }
            header('Location: ' . $url);
            exit;
        }
        header('Location: /gracies/?from=newsletter');
        exit;
    }

    if (!empty($_GET['baixa'])) {
        $tok = preg_replace('/[^a-f0-9]/', '', (string)$_GET['baixa']);
        $pdo->prepare("UPDATE subscribers SET estat='baixa' WHERE token=?")->execute([$tok]);
        header('Location: /gracies/?from=baixa');
        exit;
    }

    header('Content-Type: text/plain; charset=utf-8');
    echo 'subscribe endpoint';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { sub_json(['ok' => false]); }

// ── Anti-bot: origen ───────────────────────────────────────────────────────
$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$host    = '';
if ($origin !== '') {
    $host = (string) parse_url($origin, PHP_URL_HOST);
} elseif ($referer !== '') {
    $host = (string) parse_url($referer, PHP_URL_HOST);
}
if (!in_array(strtolower($host), ['llumatics.com', 'www.llumatics.com'], true)) {
    http_response_code(403);
    sub_json(['ok' => false, 'error' => 'Origen no permès']);
}

// Honeypot
if (!empty($_POST['website']) || !empty($_POST['email_address_check'])) { sub_json(['ok' => true]); }

// Límit per IP
if (!sub_rate_ok($_SERVER['REMOTE_ADDR'] ?? 'unknown')) {
    http_response_code(429);
    sub_json(['ok' => false, 'error' => 'Massa sol·licituds']);
}

// ── Alta (POST) ────────────────────────────────────────────────────────────
$email = filter_var(trim($_POST['email'] ?? $_POST['EMAIL'] ?? ''), FILTER_VALIDATE_EMAIL);
if (!$email) {
    http_response_code(400);
    sub_json(['ok' => false, 'error' => 'Email invàlid']);
}

$nom        = trim($_POST['nom'] ?? $_POST['NOM'] ?? '');
$taller     = preg_replace('/[^a-z0-9\-]/', '', strtolower(trim($_POST['taller'] ?? $_POST['TALLER'] ?? '')));
$idioma     = trim($_POST['idioma'] ?? $_POST['IDIOMA'] ?? $_POST['locale'] ?? 'ca');
$newsletter = (!empty($_POST['newsletter']) || !empty($_POST['NEWSLETTER'])) ? 1 : 0;

$token = bin2hex(random_bytes(16));
$pdo   = sub_db();
$st = $pdo->prepare("INSERT OR REPLACE INTO subscribers
    (email, nom, taller, idioma, newsletter, estat, token, creat)
    VALUES (?,?,?,?,?, 'pendent', ?, ?)");
$st->execute([$email, $nom, $taller, $idioma, $newsletter, $token, date('Y-m-d H:i:s')]);

$conf = 'https://llumatics.com/subscribe.php?confirm=' . $token;
$p    = 'margin:0 0 16px;font-size:16px;line-height:1.7;';
$hola = 'Hola' . ($nom !== '' ? ' ' . llum_e($nom) : '') . ',';

if ($taller !== '') {
    $title     = 'Confirma el teu correu';
    $subject   = 'Confirma el teu correu — Llumàtics';
    $cta_label = 'Confirmar i veure el material';
    $body = '<p style="' . $p . '">' . $hola . '</p>'
          . '<p style="' . $p . '">Confirma el teu correu i et donarem accés al <strong>material del taller</strong>.</p>';
    $text = "Hola" . ($nom !== '' ? " $nom" : '') . ",\n\nConfirma el teu correu per accedir al material del taller:\n$conf\n";
} else {
    $title     = 'Confirma la teva subscripció';
    $subject   = 'Confirma la teva subscripció — Llumàtics';
    $cta_label = 'Confirmar subscripció';
    $body = '<p style="' . $p . '">' . $hola . '</p>'
          . '<p style="' . $p . '">Confirma el teu correu per rebre el butlletí de Llumàtics. Un correu al mes, res d\'spam.</p>';
    $text = "Hola" . ($nom !== '' ? " $nom" : '') . ",\n\nConfirma la teva subscripció al butlletí:\n$conf\n";
}

llum_send_html($email, $subject, $title, $body, $text, llum_button($conf, $cta_label));
sub_json(['ok' => true]);
