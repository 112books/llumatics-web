<?php
// mailer.php — Correu transaccional de Llumàtics amb plantilla corporativa.
// S'envia pel MTA local de Dinahosting (mail()) — sense Brevo.
// Ús: require_once __DIR__ . '/mailer.php'; llum_send_html(...);

if (!defined('LLUM_MAIL_FROM')) {
    define('LLUM_MAIL_FROM', defined('MAIL_FROM') ? MAIL_FROM : 'hola@llumatics.com');
}
if (!defined('LLUM_MAIL_FROM_NAME')) {
    define('LLUM_MAIL_FROM_NAME', defined('MAIL_FROM_NAME') ? MAIL_FROM_NAME : 'Llumàtics');
}
if (!defined('LLUM_SITE_URL')) {
    define('LLUM_SITE_URL', 'https://llumatics.com');
}

function llum_e(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

/** Botó corporatiu per als correus. */
function llum_button(string $href, string $label): string {
    return '<a href="' . llum_e($href) . '" style="display:inline-block;background:#1a1a1a;color:#ffffff;'
         . 'text-decoration:none;padding:13px 26px;border-radius:6px;font-family:Arial,Helvetica,sans-serif;'
         . 'font-size:14px;line-height:1;">' . llum_e($label) . '</a>';
}

/** Taula de dades clau/valor (per als avisos interns). */
function llum_rows(array $rows): string {
    $html = '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;'
          . 'font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;border-collapse:collapse;">';
    foreach ($rows as $k => $v) {
        $html .= '<tr><td style="padding:7px 0;color:#7a7368;width:150px;vertical-align:top;">'
               . llum_e((string)$k) . '</td><td style="padding:7px 0;">' . $v . '</td></tr>';
    }
    return $html . '</table>';
}

/** Plantilla HTML corporativa (logo + cos + CTA + peu). */
function llum_email_html(string $title, string $bodyHtml, string $ctaHtml = ''): string {
    $logo = LLUM_SITE_URL . '/images/email/llumatics-logo.png';
    $site = LLUM_SITE_URL;
    $from = LLUM_MAIL_FROM;
    $cta  = $ctaHtml !== ''
          ? '<tr><td style="padding:6px 32px 30px;">' . $ctaHtml . '</td></tr>'
          : '<tr><td style="height:24px;"></td></tr>';
    $t = llum_e($title);
    return <<<HTML
<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{$t}</title>
</head>
<body style="margin:0;padding:0;background:#efeae1;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efeae1;padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;">
<tr><td style="padding:30px 32px 22px;text-align:center;border-bottom:1px solid #eee;">
<a href="{$site}" style="text-decoration:none;"><img src="{$logo}" width="118" alt="Llumàtics" style="display:block;margin:0 auto;width:118px;height:auto;border:0;"></a>
</td></tr>
<tr><td style="padding:28px 32px 6px;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
<h1 style="margin:0 0 18px;font-size:22px;line-height:1.35;font-weight:normal;color:#1a1a1a;">{$t}</h1>
{$bodyHtml}
</td></tr>
{$cta}
<tr><td style="padding:22px 32px;background:#1a1a1a;color:#c9c1b4;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.7;">
<strong style="color:#f5f1ea;">Llumàtics</strong> · Escola de fotografia química<br>
Nau Bostik · Carrer Ferran Turné, 1-11 · 08027 Barcelona<br>
<a href="{$site}" style="color:#c9c1b4;">llumatics.com</a> ·
<a href="mailto:{$from}" style="color:#c9c1b4;">{$from}</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
HTML;
}

/**
 * Envia un correu multipart (text pla + HTML) pel MTA local.
 * Retorna true si el MTA l'ha acceptat.
 */
function llum_send(string $to, string $subject, string $text, string $html, string $replyTo = ''): bool {
    $boundary    = '=_llum_' . bin2hex(random_bytes(12));
    $enc_subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $text = preg_replace("/\r\n|\r|\n/", "\r\n", $text);
    $html = preg_replace("/\r\n|\r|\n/", "\r\n", $html);

    $body  = "--{$boundary}\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
    $body .= quoted_printable_encode($text) . "\r\n";
    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
    $body .= quoted_printable_encode($html) . "\r\n";
    $body .= "--{$boundary}--\r\n";

    $headers  = 'From: ' . LLUM_MAIL_FROM_NAME . ' <' . LLUM_MAIL_FROM . ">\r\n";
    $headers .= 'Reply-To: ' . ($replyTo !== '' ? $replyTo : LLUM_MAIL_FROM) . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";

    return mail($to, $enc_subject, $body, $headers, '-f ' . LLUM_MAIL_FROM);
}

/** Drecera: embolcalla en la plantilla corporativa i envia. */
function llum_send_html(string $to, string $subject, string $title, string $bodyHtml,
                        string $text, string $ctaHtml = '', string $replyTo = ''): bool {
    return llum_send($to, $subject, $text, llum_email_html($title, $bodyHtml, $ctaHtml), $replyTo);
}
