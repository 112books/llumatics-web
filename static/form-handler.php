<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://llumatics.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── Configuració ───────────────────────────────────────────────────────────
// Tot el correu surt pel MTA local de Dinahosting (mail()); sense Brevo.
define('MAIL_FROM',      'hola@llumatics.com');
define('MAIL_FROM_NAME', 'Llumàtics');
define('MAIL_TO',        'hola@llumatics.com');
define('VALS_DB',        __DIR__ . '/admin/vals.db');

require_once __DIR__ . '/mailer.php';

// ── Validació entrada ──────────────────────────────────────────────────────
$email  = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$taller = preg_replace('/[^a-z0-9\-]/', '', strtolower(trim($_POST['taller'] ?? '')));
$type   = trim($_POST['type'] ?? '');

if ($type === 'val') {
    // El val no necessita email validat (email comprador pot no existir al POST)
    $email = filter_var(trim($_POST['email_comprador'] ?? ''), FILTER_VALIDATE_EMAIL) ?: '';
} else {
    if (!$email) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Email invàlid']);
        exit;
    }
}

if (!in_array($type, ['avisa', 'newsletter', 'val'], true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Tipus desconegut']);
    exit;
}

// Honeypot: si el camp "website" ve ple, és un bot
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

// ── Anti-bot: la petició ha de venir del web ───────────────────────────────
$origin   = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer  = $_SERVER['HTTP_REFERER'] ?? '';
$req_host = '';
if ($origin !== '') {
    $req_host = (string) parse_url($origin, PHP_URL_HOST);
} elseif ($referer !== '') {
    $req_host = (string) parse_url($referer, PHP_URL_HOST);
}
if (!in_array(strtolower($req_host), ['llumatics.com', 'www.llumatics.com'], true)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Origen no permès']);
    exit;
}

// ── Anti-bot: límit d'enviaments per IP (avisa/newsletter) ─────────────────
if ($type !== 'val' && !rate_limit_ok(client_ip())) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Massa sol·licituds']);
    exit;
}

// ── Preparació missatges ───────────────────────────────────────────────────
$p = 'margin:0 0 16px;font-size:16px;line-height:1.7;';

// Extreu el títol real del taller del camp "subject" (format: "Avisa'm — Títol del Taller")
$raw_subject  = trim($_POST['subject'] ?? '');
$taller_title = $taller; // fallback: slug
$em = "\xe2\x80\x94"; // em dash —
if ($raw_subject && strpos($raw_subject, " $em ") !== false) {
    $parts = explode(" $em ", $raw_subject, 2);
    $taller_title = trim($parts[1]);
}

if ($type === 'avisa') {
    // Guardar a SQLite i obtenir el total per a aquest taller
    $wl    = waitlist_insert($email, $taller, $taller_title ?: $taller);
    $count = $wl['count'];

    // Si ja hi era (email+taller únics), no tornem a enviar correus.
    if ($wl['inserted']) {
        $taller_display = $taller_title ?: $taller;
        $ales = ($count >= 2);

        // 1. Notificació interna
        $subject_admin = ($ales ? '[ACCIÓ] ' : '') . "Llista d'espera — $taller_display";
        $intro_admin   = $ales
            ? '<p style="' . $p . '"><strong>Ja hi ha ' . $count . ' persones esperant aquest taller.</strong> Val la pena proposar una data.</p>'
            : '<p style="' . $p . '">Nova inscripció a la llista d\'espera.</p>';
        $rows_admin = llum_rows([
            'Taller'         => llum_e($taller_display),
            'Email'          => '<a href="mailto:' . llum_e($email) . '" style="color:#1a1a1a;">' . llum_e($email) . '</a>',
            'Total esperant' => $count . ' ' . ($count === 1 ? 'persona' : 'persones'),
            'Data'           => date('Y-m-d H:i:s'),
        ]);
        $text_admin = ($ales ? "Acció: ja hi ha $count persones esperant.\n\n" : '')
                    . "Nova inscripció a la llista d'espera.\n\n"
                    . "Taller: $taller_display\nEmail: $email\n"
                    . "Total esperant: $count " . ($count === 1 ? 'persona' : 'persones') . "\n"
                    . "Data: " . date('Y-m-d H:i:s') . "\n";
        llum_send_html(MAIL_TO, $subject_admin, $subject_admin,
                       $intro_admin . $rows_admin, $text_admin,
                       llum_button('https://llumatics.com/admin/alumnes.php', 'Veure el panell'));

        // 2. Confirmació a l'inscrit
        $taller_txt = $taller_display ? ' del taller «' . $taller_display . '»' : '';
        $body_user  = '<p style="' . $p . '">Hola,</p>'
                    . '<p style="' . $p . '">T\'hem apuntat a la llista d\'espera' . llum_e($taller_txt) . '.</p>'
                    . '<p style="' . $p . '">Quan obrim places, t\'avisem. Cap compromís.</p>'
                    . '<p style="margin:0;font-size:13px;line-height:1.6;color:#7a7368;">Per donar-te de baixa, respon a aquest correu amb l\'assumpte «Baixa». Responsable: Llumàtics · hola@llumatics.com · <a href="https://llumatics.com/privacitat/" style="color:#7a7368;">Política de privacitat</a>.</p>';
        $text_user  = "Hola,\n\nT'hem apuntat a la llista d'espera$taller_txt.\n\n"
                    . "Quan obrim places, t'avisem. Cap compromís.\n\nJoan — Llumàtics\nhttps://llumatics.com\n";
        llum_send_html($email, "T'hem apuntat a la llista d'espera — Llumàtics",
                       "T'hem apuntat a la llista d'espera", $body_user, $text_user,
                       llum_button('https://llumatics.com/tallers/', 'Veure els tallers'));
    }

    echo json_encode(['ok' => true, 'count' => $count, 'duplicate' => !$wl['inserted']]);

} elseif ($type === 'val') {

    $codi           = trim($_POST['codi']            ?? '');
    $taller_nom     = trim($_POST['taller']          ?? '');
    $import_val     = trim($_POST['import']          ?? '');
    $per_a          = trim($_POST['per_a']           ?? '');
    $de_part_de     = trim($_POST['de_part_de']      ?? '');
    $email_comprador = trim($_POST['email_comprador'] ?? '');
    $paypal_order   = trim($_POST['paypal_order']    ?? '');
    $missatge_val   = trim($_POST['missatge']        ?? '');
    $data_compra    = date('Y-m-d');
    $data_caducitat = date('Y-m-d', strtotime('+6 months'));

    if (!$codi) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Codi buit']);
        exit;
    }

    try {
        $pdo = new PDO('sqlite:' . VALS_DB);
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
        $stmt = $pdo->prepare("INSERT OR IGNORE INTO vals
            (codi,taller,import,per_a,de_part_de,email_comprador,paypal_order,missatge,data_compra,data_caducitat)
            VALUES (?,?,?,?,?,?,?,?,?,?)");
        $stmt->execute([$codi, $taller_nom, $import_val, $per_a, $de_part_de,
                        $email_comprador, $paypal_order, $missatge_val,
                        $data_compra, $data_caducitat]);
        echo json_encode(['ok' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'DB error']);
    }

} else {
    // newsletter — avís intern (el formulari públic viu a subscribe.php)
    $subject = 'Subscripció al butlletí — Llumàtics';
    $body    = '<p style="' . $p . '">Nova subscripció al butlletí.</p>'
             . llum_rows([
                   'Email' => llum_e($email),
                   'Data'  => date('Y-m-d H:i:s'),
               ]);
    $text    = "Nova subscripció al butlletí.\n\nEmail: $email\nData: " . date('Y-m-d H:i:s') . "\n";
    $ok = llum_send_html(MAIL_TO, $subject, $subject, $body, $text);
    echo json_encode(['ok' => $ok]);
}

// ── Funcions auxiliars ─────────────────────────────────────────────────────
function waitlist_insert(string $email, string $taller, string $taller_nom): array {
    try {
        $pdo = new PDO('sqlite:' . VALS_DB);
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
        $ins = $pdo->prepare("INSERT OR IGNORE INTO waitlist (email, taller, taller_nom, data_inscripcio) VALUES (?,?,?,?)");
        $ins->execute([$email, $taller, $taller_nom, date('Y-m-d')]);
        $inserted = $ins->rowCount() > 0;
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM waitlist WHERE taller=? AND estat='espera'");
        $stmt->execute([$taller]);
        return ['count' => (int)$stmt->fetchColumn(), 'inserted' => $inserted];
    } catch (Exception $e) {
        return ['count' => 0, 'inserted' => false];
    }
}

function client_ip(): string {
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function rate_limit_ok(string $ip, int $max = 8, int $window = 3600): bool {
    try {
        $pdo = new PDO('sqlite:' . VALS_DB);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("CREATE TABLE IF NOT EXISTS form_rate (
            ip TEXT NOT NULL,
            ts INTEGER NOT NULL
        )");
        $since = time() - $window;
        $pdo->prepare("DELETE FROM form_rate WHERE ts < ?")->execute([$since]);
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM form_rate WHERE ip=? AND ts>=?");
        $stmt->execute([$ip, $since]);
        if ((int)$stmt->fetchColumn() >= $max) return false;
        $pdo->prepare("INSERT INTO form_rate (ip, ts) VALUES (?,?)")->execute([$ip, time()]);
        return true;
    } catch (Exception $e) {
        return true; // fail open
    }
}
