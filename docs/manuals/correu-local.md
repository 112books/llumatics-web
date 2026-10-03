# Correu de Llumàtics — 100% local (Dinahosting)

> Documentació del sistema de correu propi. Substitueix Brevo i web3forms.

## Resum

Tots els correus surten pel **MTA local de Dinahosting** amb `mail()` (Postfix + wrapper
`/usr/bin/phpmailer`). No depèn de cap servei extern. Com que el bústia
`hola@llumatics.com` és a la mateixa màquina que la web, l'entrega és local i no passa
pels filtres de correu externs (SpamCop/Bayes) que abans marcaven els avisos com a brossa.

## Fitxers

| Fitxer | Funció |
|--------|--------|
| `static/mailer.php` | Plantilla HTML corporativa + enviament multipart (`mail()`). |
| `static/form-handler.php` | Endpoints dels formularis (`avisa`, `contacte`, `val`, `newsletter`). |
| `static/subscribe.php` | Subscripcions amb doble opt-in (butlletí i material d'alumnes). |
| `static/images/email/llumatics-logo.png` (+ `@2x`) | Logo dels correus (PNG; els clients no renderitzen SVG). |
| `static/admin/vals.db` | SQLite compartit: `waitlist`, `vals`, `subscribers`, `form_rate`. |

## `mailer.php`

- `llum_email_html($title, $bodyHtml, $ctaHtml = '')` → plantilla completa (logo, peu amb adreça i contacte).
- `llum_button($href, $label)` → botó corporatiu.
- `llum_rows(array $k => $v)` → taula clau/valor (valors ja escapats amb `llum_e()`).
- `llum_send($to, $subject, $text, $html, $replyTo = '')` → multipart text+HTML pel MTA local.
- `llum_send_html($to, $subject, $title, $bodyHtml, $text, $ctaHtml = '', $replyTo = '')` → drecera.
- `llum_e($s)` → `htmlspecialchars`.

Constants: `LLUM_MAIL_FROM` = `hola@llumatics.com`, `LLUM_MAIL_FROM_NAME` = `Llumàtics`,
`LLUM_SITE_URL` = `https://llumatics.com`.

## Endpoints

### `POST /form-handler.php`
- `type=avisa` — llista d'espera: desa a `waitlist`, avís intern + confirmació a l'alumne.
- `type=contacte` — formulari de contacte: avís intern amb `Reply-To` del visitant.
- `type=val` — val-regal: desa a `vals` i envia avís intern + confirmació al comprador.
- `type=newsletter` — avís intern (el formulari públic viu a `subscribe.php`).

Comprovacions: honeypot (`website`), origen (`Origin`/`Referer` = llumatics.com), límit de 8/hora per IP.

### `GET/POST /subscribe.php`
- `POST` amb `email` (+ `NOM`, `TALLER`, `IDIOMA`, `NEWSLETTER`) → desa a `subscribers` (estat `pendent`) i envia el correu de confirmació.
- `GET ?confirm=TOKEN` → marca `confirmat` i redirigeix: si hi ha `taller`, a `/tallers/{taller}/privat/doc/?nom=...`; si no, a `/gracies/?from=newsletter`.
- `GET ?baixa=TOKEN` → marca `baixa` i redirigeix a `/gracies/?from=baixa`.

## Com canviar la plantilla o el logo

- **Textos/estil**: editar `llum_email_html()` a `static/mailer.php`.
- **Logo**: substituir `static/images/email/llumatics-logo.png` (i `@2x`). Ha de ser PNG, ~240×240 i fons clar/transparent.
  - Si tens un SVG nou, es pot renderitzar amb Chrome headless o ImageMagick i després ajustar la mida.
- **Adreça del peu**: editar el bloc `<tr>` del peu dins `llum_email_html()`.

## Nota sobre Dinahosting

- `sendmail_path` = `/usr/bin/phpmailer` (Perl): valida que el domini del `From` sigui dels permesos de l'usuari i després crida Postfix. Els enviaments correctes queden al log `/var/log/phpmailer/{usuari}-maillog.php` amb `estado=PERMITIDO`.
- **No** calen credencials SMTP per als enviaments locals.
- Si mai calgués una còpia a un altre compte, `MAIL_TO` es pot canviar a `static/form-handler.php`.

## Proves ràpides

```bash
# Rebuig sense origen (403) i enviament correcte (200)
curl -s -X POST https://llumatics.com/form-handler.php --data-urlencode 'type=avisa' --data-urlencode 'email=prova@example.com' -w '%{http_code}\n'
curl -s -X POST https://llumatics.com/form-handler.php -H 'Origin: https://llumatics.com' --data-urlencode 'type=avisa' --data-urlencode 'email=hola@llumatics.com' -w '%{http_code}\n'
```

## Manteniment

- Build + deploy: `./scripts/deploy.sh` (rsync de `public/`; els fitxers de `static/admin/` es pugen a part per `scp`).
- Els correus de l'admin usen `static/admin/config.php` (només `MAIL_*`).
