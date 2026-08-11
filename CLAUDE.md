# CLAUDE.md — Llumàtics Web

> Guia operativa per a Claude Code en aquest projecte.

## Projecte

Web oficial de **Llumàtics**, escola de fotografia a Barcelona especialitzada en fotografia fotoquímica i processos alternatius. Construïda amb Hugo (static site generator), tema custom i continguts en Markdown.

- **Repositori:** `github.com/112books/llumatics-web`
- **Producció:** `https://llumatics.com` → VPS Dinahosting (`vl28359.dinaserver.com`) → rsync manual
- **Staging:** `https://112books.github.io/llumatics-web` → branca `develop` → GitHub Pages
- **Local:** `hugo server -D` → `http://localhost:1313`

---

## Stack tècnic

| Capa | Tecnologia |
|------|-----------|
| SSG | Hugo v0.159+ extended |
| Tema | Custom (`themes/llumatics/`) |
| CSS | Vanilla CSS amb custom properties (cap framework) |
| JS | Vanilla JS mínim |
| Idiomes | CA (per defecte), ES, EN |
| Formularis | Tally.so (embed iframes) |
| Newsletter | Brevo (API + formulari Tally) |
| PDF alumnes | Make.com → Pandoc (pipeline extern) |
| DNS/Domini | Dinahosting |

---

## Entorns

### Local
```bash
hugo server -D              # Amb drafts
hugo server -D --port 1314  # Port alternatiu
```

### Staging (branca develop)
```bash
git checkout develop
git push origin develop     # Activa GitHub Action
```

### Producció (branca main)
```bash
git checkout main
git merge develop
git push origin main        # Activa GitHub Action
```

---

## Estructura de directoris

```
llumatics-hugo/
├── .github/workflows/       # CI/CD GitHub Actions
├── themes/llumatics/        # Tema custom (NO tocar sense necessitat)
│   ├── assets/css/main.css  # Tots els estils
│   ├── assets/js/main.js    # JS mínim
│   ├── layouts/             # Templates Hugo
│   │   ├── _default/        # baseof, list, single, private, gift
│   │   ├── tallers/         # single.html específic per cursos
│   │   └── partials/        # header, footer, course-card, etc.
│   └── i18n/                # ca.yaml, es.yaml, en.yaml
├── content/
│   ├── ca/                  # Contingut Català (per defecte)
│   ├── es/                  # Contingut Castellà
│   └── en/                  # Contingut Anglès
├── static/images/           # Imatges estàtiques
├── data/                    # YAML de dades (gift_amounts, etc.)
├── archetypes/              # Plantilles per `hugo new`
└── hugo.toml                # Configuració principal
```

---

## Tipus de contingut i frontmatter

### Taller (fitxa pública)
**Ruta:** `content/ca/tallers/[slug]/index.md`
**Crear:** `hugo new content ca/tallers/nom-taller/index.md`

```yaml
---
title: ""                  # Títol suggerent i atractiu
lead: ""                   # Resum curt: per a cards, hero i xarxes socials
description: ""            # SEO meta description (màx. 155 caràcters)
image: ""                  # /images/tallers/slug.jpg (1200×800px, jpg/webp)

# Classificació
tipus: "taller"            # taller | curs
canal: "llumatics"         # llumatics | externs | institucions
categoria: ""              # iniciacio | intermedi | avançat | tematic
estat: "idea"              # actiu | en-preparacio | idea

# Fitxa tècnica (requadre destacat)
preu_1: 0                  # Preu per 1 alumne (€, sense IVA —formació exempta—)
preu_2: 0                  # Preu per persona si venen 2
preu_3: 0                  # Preu per persona si venen 3
preu_4: 0                  # Preu per persona si venen 4
durada_hores: 0            # Número enter o decimal (ex: 1.5)
lloc: "Llumàtics — Nau Bostik, La Sagrera, Barcelona"
max_places: 4              # Per defecte 4; pot variar en tallers externs o institucions
nivell: ""                 # Iniciació | Intermedi | Avançat
sota_demanda: true         # true per a llumatics i institucions; false per a externs

# Prerequisits
prerequisits: ""           # "Cap" si no en té; o descripció dels coneixements mínims

# Tallers relacionats (slugs, per a la secció "Continua aprenent")
continua_aprenent: []

tags: []
draft: true
---
```

#### Fórmula de preus
Base de càlcul: **50€/hora + 20€ de cost fix per persona** (refrigeri, espai, despeses mínimes).

```
cost_base = (durada_hores × 50) + 20

preu_1 = cost_base                          (mínim garantit)
preu_2 = round((cost_base × 1.14) / 2)
preu_3 = round((cost_base × 1.28) / 3)
preu_4 = round((cost_base × 1.43) / 4)
```

Exemple per a un taller de 4 hores:
- cost_base = (4 × 50) + 20 = 220€
- 1 alumne: 220€
- 2 alumnes: 125€/persona
- 3 alumnes: 94€/persona
- 4 alumnes: 79€/persona

> Alguns tallers (gran format, fotografia de carrer amb tutoria) tenen tarifa superior.
> En aquests casos s'indica explícitament al frontmatter i al contingut.
> Els preus no porten IVA indicat —l'activitat de formació n'està exempta (art. 20.1.9 LIVA).
> Si el client necessita factura, s'indica a les FAQ generals del web.

#### Canals
- **llumatics** — Tallers impartits a Llumàtics (Nau Bostik). Sota demanda, màx. 4 alumnes.
- **externs** — Tallers impartits fora de Llumàtics (actualment: Cameras and Films). Coordinació externa, sense dates sota demanda.
- **institucions** — Tallers per a instituts, centres cívics i centres d'art. Sous demanda, places variables.

#### Estats dels continguts
- **actiu** — Taller llest, visible al web, es pot sol·licitar.
- **en-preparacio** — Contingut en desenvolupament, no visible al web (`draft: true`).
- **idea** — Concepte apuntat, sense desenvolupar. No visible al web (`draft: true`).

---

### Material privat d'alumnes
**Ruta:** `content/ca/tallers/[slug]/privat/index.md`

```yaml
---
title: "Material per a alumnes — [Nom del taller]"
layout: "private"
course_ref: "[slug-del-taller]"
noindex: true
sitemap:
  disable: true
robots: "noindex, nofollow"
draft: false
---
```

#### Flux de generació de PDF personalitzat
1. Alumne accedeix a `/tallers/[slug]/privat/`
2. Omple formulari Tally (nom + email + opt-in newsletter)
3. Tally fa webhook a Make.com
4. Make.com:
   - Agafa el fitxer `.md` del curs de l'API del repo (o un template)
   - Injecta el nom de l'alumne al principi i al peu
   - Executa Pandoc → genera PDF
   - Envia PDF per email a l'alumne
   - Afegeix contacte a Brevo (amb tag del curs)

#### Peu del PDF (plantilla)
```
──────────────────────────────────────────────
Document generat per Llumàtics per a ús exclusiu de [NOM ALUMNE].
No es permet la distribució ni reproducció d'aquest material.
© Llumàtics — llumatics.com
──────────────────────────────────────────────
```

---

### Entrada d'agenda
**Ruta:** `content/ca/agenda/[slug].md`
**Crear:** `hugo new content ca/agenda/revelat-bn-maig-2026.md`

```yaml
---
title: ""
course_ref: ""            # slug del taller relacionat
date_start: "2026-05-10"
date_end: ""              # opcional
time_start: "10:00"
time_end: "14:00"
lloc: "Llumàtics — Nau Bostik, La Sagrera, Barcelona"
durada_hores: 0
preu_1: 0
preu_2: 0
preu_3: 0
preu_4: 0
max_places: 4
status: "active"          # active | full | soon | cancelled
draft: false
---
```

---

### Post de blog
**Ruta:** `content/ca/blog/[slug].md`

Els posts van directament a `content/ca/blog/` — **no en carpeta pròpia** (diferent dels tallers).

```yaml
---
title: ""
lead: ""                   # 1-2 frases per a la card i xarxes socials
description: ""            # SEO meta description (màx. 155 caràcters)
image: "/images/blog/slug.jpg"
images:                    # opcional: galeria secundària amb lightbox
  - "/images/blog/slug-1.jpg"
  - "/images/blog/slug-2.jpg"
date: 2026-01-01
tags: []
course_ref: ""             # opcional: slug del taller relacionat (apareix com a CTA al peu)
draft: true
---
```

**Tipus de posts recomanats:**
- Crònica d'un procés experimental (origen dels tallers)
- Article tècnic sobre una tècnica concreta
- Notícia d'un nou taller o col·laboració

**Imatges de blog:**
- Principal: `static/images/blog/[slug].jpg` — ratio 3:2, 1200×800px, màx. 500KB
- Galeria: `static/images/blog/[slug]-1.jpg`, `[slug]-2.jpg`, etc.
- El template mostra la galeria amb lightbox (clic per veure en gran, Escape per tancar)

---

## Estructura de la pàgina de taller (layout single)

Ordre dels blocs al template `layouts/tallers/single.html`:

1. **Hero** — imatge principal + títol + lead
2. **Requadre destacat** (sticky o destacat visualment) amb:
   - Preu (taula 1/2/3/4 alumnes)
   - Durada
   - Lloc (amb enllaç a pàgina Contacte on hi ha el mapa)
   - Alumnes màx.
   - Nivell
   - Sota demanda (text: *"No hi ha dates fixes. Escriu-nos i busquem una data que t'encaixi."*)
   - Botó primari: **Sol·licita una data** → formulari Tally
   - Botó secundari: **Fer una consulta** → formulari Tally o mailto
3. **Cos del taller** (Markdown):
   - Descripció / motivació (per què fer aquest taller)
   - Continguts clau (llista)
   - Inclòs en el preu (llista)
   - Cal portar (llista)
   - No inclòs (llista — per evitar malentesos)
   - Fitxa: Objectiu / Metodologia / Resultat / Prerequisits / A qui va dirigit
4. **Continua aprenent** — cards dels tallers relacionats (via `continua_aprenent`)
5. **Botó de material per a alumnes** → `/tallers/[slug]/privat/`

---

## Multilingüisme

- La llengua per defecte és **CA** (`content/ca/`)
- Els fitxers ES i EN van a `content/es/` i `content/en/`
- Les traduccions de textos d'interfície estan a `themes/llumatics/i18n/`
- Cada idioma té el seu propi menú definit a `hugo.toml`
- Les URLs de l'idioma per defecte NO tenen prefix (`/tallers/`)
- Les URLs d'ES i EN SÍ que en tindran (`/es/tallers/`, `/en/tallers/`)
- Els tallers es tradueixen en última fase; primer es consolida el CA

---

## Variables de configuració (hugo.toml → params)

```toml
[params]
  contactEmail = "info@llumatics.com"
  instagram = "https://www.instagram.com/llumatics"
  tallyFormNewsletter = ""    # ID del formulari Tally per newsletter
  tallyFormContact = ""       # ID del formulari Tally per inscripcions/PDF
  tallyFormGiftVoucher = ""   # ID del formulari Tally per vals-regal
  tallyFormSolicitud = ""     # ID del formulari Tally per sol·licitar data de taller
```

---

## Imatges

### Convencions de ruta i format

| Tipus | Ruta | Mida | Format |
|-------|------|------|--------|
| Logo | `static/images/logo.png` | — | PNG (fins SVG definitiu) |
| Taller (principal) | `static/images/tallers/[slug].jpg` | 1200×800px | jpg/webp |
| Taller (galeria) | `static/images/tallers/[slug]-1.jpg` | 1200×800px | jpg/webp |
| Blog (principal) | `static/images/blog/[slug].jpg` | 1200×800px | jpg/webp |
| Blog (galeria) | `static/images/blog/[slug]-1.jpg` | 1200×800px | jpg/webp |
| Espais | `static/images/espais/[nom].jpg` | lliure | jpg/webp |

- Sempre amb atribut `alt` descriptiu. Mai PNG per a fotografies.
- Màx. 500KB per imatge. Comprimir amb ImageMagick o Squoosh abans de pujar.
- Si no hi ha imatge, el component mostra un placeholder automàticament.

### Galeria amb lightbox

Tant el template de tallers (`layouts/tallers/single.html`) com el de blog (`layouts/blog/single.html`) implementen galeria amb lightbox vanilla JS:

- Camp `image` → imatge principal (gran, sense clic)
- Camp `images` (array) → galeria de miniatures a sota, amb lightbox al clic
- Clic a qualsevol imatge de la galeria → s'obre en gran
- Clic fora o `Escape` → tanca el lightbox

```yaml
# Exemple frontmatter amb galeria
image: "/images/tallers/revelat-bn.jpg"
images:
  - "/images/tallers/revelat-bn-1.jpg"
  - "/images/tallers/revelat-bn-2.jpg"
  - "/images/tallers/revelat-bn-3.jpg"
```

El CSS de la galeria ja existeix a `main.css` (`.course-single__gallery`, `.gallery__item`). No cal afegir res.

---

## Vals-regal

- Pàgina: `content/ca/regala/_index.md` (layout: gift)
- Imports configurats a: `data/gift_amounts.yaml`
- Flux actual: email a `info@llumatics.com`
- Flux futur: generació automàtica de codis únics (quan hi hagi VPS)

---

## Normes per editar

- **CSS:** Tot a `themes/llumatics/assets/css/main.css`. Variables a `:root`.
- **No frameworks CSS.** Vanilla CSS amb custom properties.
- **No JavaScript innecessari.** El JS és mínim (menú mòbil, lazy load).
- **Continguts sempre en Markdown.** Cap HTML inline als fitxers `.md` tret de casos excepcionals documentats.
- **Imatges:** sempre amb `alt` descriptiu. Format jpg/webp, mai PNG per fotos.
- **Drafts:** `draft: true` mentre no estigui llest per publicar.
- **Noindex** obligatori a totes les pàgines privades d'alumnes.
- **Títols de tallers:** atractius i suggerents, no tècnics ni descriptius secs.
- **Tone of voice:** directe, sense floritures, expert però accessible. Res de corporatiu.
- **Preus:** sense menció d'IVA. Remetre a FAQ per a facturació.
- **⚠️ `.htaccess` — NO afegir redirect HTTPS.** Dinahosting fa SSL termination al proxy: Apache veu HTTP tot i que el client ve per HTTPS. Afegir `RewriteCond %{HTTPS} off` causa bucle infinit de redireccions i cau el site. Dinahosting ja força HTTPS a nivell de servidor.

---

## Workflow per publicar un nou taller

1. Crear la fitxa pública:
   ```bash
   hugo new content ca/tallers/nom-taller/index.md
   ```
2. Omplir el frontmatter complet (vegeu l'apartat de frontmatter)
3. Calcular preus amb la fórmula (vegeu Fórmula de preus)
4. Escriure el contingut seguint l'ordre de blocs definit
5. Afegir la imatge a `static/images/tallers/`
6. Crear el material privat per alumnes:
   ```bash
   # Crear manualment: content/ca/tallers/nom-taller/privat/index.md
   # layout: "private", noindex: true
   ```
7. Crear entrada d'agenda si hi ha dates:
   ```bash
   hugo new content ca/agenda/nom-taller-mes-any.md
   ```
8. Duplicar les fitxes per ES i EN quan el CA estigui aprovat
9. Canviar `draft: false` i `estat: "actiu"` per publicar
10. Commit i push a `develop` → staging
11. Revisar staging → merge a `main` → producció

---

## Registre de canvis

### 2026-05-29
**Tallers complets + metàfora metro + SEO/GEO + animació recorregut**

- **Docs alumnes CA publicats** (`draft: false`): 20 docs passats a visible (cianotipia, copies-beers-developer, copies-en-paper, digitalitzacio-escaner, edicio-imatges-fotoquimiques, fotografia-de-carrer, fotografia-estenopeica, fotogrames-cianotipia, gran-format-4x5, guinneol, hasselblad-500, introduccio-al-positivat, introduccio-gran-format, retrat-6x6, retrat-amb-holga, retrat-analogic, reveladors-artesanals, revelat-color-bn, revelat-i-positivat, revelats-experimentals).
- **Preus fixats**: `revelat-i-positivat` → 420€ (CA/ES/EN), `tutoria-fotografica` → `durada_hores: 2` (CA/ES/EN), `preu_3` arrodoniment a `introduccio-al-positivat` i `revelat-color-bn` (CA/ES/EN).
- **Fix imatge**: `digitalitzacio-scanner.jpg` → `digitalitzacio-escaner.jpg` (ES/EN apuntaven a fitxer inexistent).
- **Fix CSS**: `section__subtitle` usava `--color-error` (vermell) → ara `--color-text-muted`.
- **Metàfora metro**: home secció "Sis línies de formació" + paràgraf explicatiu (CA/ES/EN). `_index.md` tallers (CA/ES/EN) reescrit: subtítol metro, cos curt, fix "cinc→sis àmbits".
- **FAQPage schema** (`/contacte/`): 10 preguntes/respostes JSON-LD per AEO/featured snippets.
- **llms.txt** actualitzat: +20 tallers, 6 línies metro, fets citable per IA, secció "Fets clau".
- **Pàgina Sobre**: paràgraf de fets estructurats citable (70 paraules, autocontingut).
- **Animació recorregut** (`/tallers/`): acordió smooth (`max-height` cubic-bezier), swatch creix 28→44px en obrir, stops entren amb `@keyframes stopIn` + stagger nth-child.

### 2026-05-22
**Val-regal complet (front-end) + agenda externs + hover quiz**

- **Val-regal `gift.html`**: formulari inline de compra (destinatari, remitent, missatge opcional, email, import editable min 20€), PayPal Smart Buttons SDK JS v2, pantalla d'èxit inline sense redirecció. Webhook Make.com s'envia a `onApprove` amb totes les dades (per_a, de, missatge, email, import, taller_nom, paypal_order_id, paypal_payer_email, data).
- **PayPal locale**: CA → `en_US` (preferència política, no `ca_ES` que PayPal no suporta), ES → `es_ES`, EN → `en_US`.
- **`hugo.toml`**: afegit `paypalClientID` (sandbox actiu, verificat) i `makecomGiftWebhook` (buit, pendent Make.com).
- **Hover quiz** (`main.css`): `.gift-option` amb barra accent esquerra animada `scaleY`, fletxa `→` que llisca des de la dreta, lift `translateY(-2px)`, tint de fons accent 7%. `focus-visible` per accessibilitat.
- **Agenda tallers externs** (`single.html`): llista dates properes des de CA com a font de veritat (`hugo.Sites`), filtre futur per data ISO, CTA genèric → Instagram `camerasandfilms.barcelona/` (sense `purchase_url` per data).
- **Instagram URL** Cameras & Films: corregida de `camerasandfilms/` a `camerasandfilms.barcelona/`.
- **`static/val-regal/marc-val-regal.png`**: fons del PDF val-regal (1491×1055px, ja al repo).
- **Sandbox verificat**: flux complet formulari → PayPal → success screen funciona.

### 2026-05-23
**Sincronització multi-ordinador + val-regal complet en producció + nous continguts**

- **Sincronització**: fusió de 11 commits de l'estudi (origin/main) a develop. Conflictes resolts: `main.js` (quiz + cerca), `contacte/single.html` (access_key duplicat), `agenda-item.html` (GetPage sense `/` inicial).
- **Imatge hero portada**: canviada a `taller-revelat-CandF.jpeg` (CA/ES/EN). Efecte vignette invertit: màscara radial `transparent` al centre → `black` a les vores, `opacity: 0.35`.
- **Val-regal live**: Make.com eliminat completament. Flux definitiu: PayPal `onApprove` → genera codi `LLM-YYYY-XXXXX` al browser → 2 POSTs web3forms. Email 1: notificació completa a `hola@llumatics.com`. Email 2: confirmació al comprador (web3forms free plan no respecta el camp `to` — arriba a `linuxbcn@gmail.com`, cal reenviar manualment). PayPal live Client ID `ARfv0r9Y...` configurat i verificat.
- **Voucher imprimible**: `#gift-voucher-print` amb disseny centrat, header lleuger (poc tinta), nom del taller en gran (display font), import eliminat del val, codi en pill. `@media print` amaga tot menys el val. Botó "Imprimeix el val / Desa com a PDF →" → `window.print()`.
- **Textos actualitzats**: hint email del formulari corregit. `gift_info` CA/ES/EN: informa que el val s'imprimeix des del navegador i recomana posar-lo en un sobre.
- **Manual d'operacions pagaments**: `docs/manuals/operacions-pagaments.md` — com enviar link de pagament PayPal, gestionar vals-regal rebuts, bescanviar vals, reemborsaments, facturació.
- **Nou taller `edicio-imatges-fotoquimiques`**: publicat CA/ES/EN, `blocs: ["fonaments"]`, `weight: 30`. Pas 5 del recorregut actiu.
- **Manual de continguts**: `docs/manuals/crear-contingut.md` creat.
- **Ordre bloc Fonaments** per camp `weight`: 10-iniciació, 20-digitalitzacio-escaner, 30-edicio-imatges, 40-estenopeica, 50-fotogrames. CA/ES/EN.
- **Camps obligatoris al frontmatter**: `extern: false` (per aparèixer a la llista), `weight` (ordre dins bloc).

### 2026-05-25
**Documentació alumnes CA/ES/EN: fonaments, Caffenol, Wineol + taller Wineol + GDPR**

- **`fonaments-iniciacio-puntual-doc`** CA/ES/EN: documentació completa del taller d'iniciació. Imatges pedagògiques (formats, càmera, exposició, focal, perspectiva, profunditat de camp), triangle d'exposició amb gràfic específic per idioma (`triangle-ca/es/en.png`). Typos CA corregits.
- **`caffenol-doc`** CA/ES/EN: documentació definitiva del taller Caffenol. Fórmula Llumàtics per 500ml (14,5g cafè / 20g Na₂CO₃ / 1,8g vitamina C), taula d'escala per 4 volums, procés Solució A+B, ajust contrast/densitat, escaneig en color i tons vermellosos. Imatges caffenol-01 a 09.
- **`wineol-doc`** CA/ES/EN + **taller `wineol`** CA/ES/EN + **pàgines privades gate** CA/ES/EN: revelador de vi negre (54g Na₂CO₃ / 16g vit.C / 10g sal per 500ml vi), 20min a 22°C, 4 cops per bombolles, rentat final 12min. Taller amb avís experimental molt destacat, anècdota personal d'inestabilitat. Imatges wineol01-05.
- **GDPR**: checkbox obligatori afegit a `private.html` (`RGPD_CHECK` required + camp hidden `RGPD` → "true" via JS). Clau `private_gdpr_label` afegida a CA/ES/EN amb link a política de privacitat.
- **Deploy**: tot mergetat a `main` i en producció via GitHub Actions.

### 2026-05-24
**Camp `weight` per a tots els tallers + sistema de documentació nominal per a alumnes (Fase 1)**

- **Camp `weight` afegit** a 21 tallers que no el tenien (`content/ca/tallers/*/index.md`). Ordre pedagògic dins de cada bloc. Commit `7623ad7`.

- **Sistema de documentació nominal — infraestructura completa implementada** (Tasks 2-8 del pla `docs/superpowers/plans/2026-05-24-documentacio-alumnes.md`):
  - **`hugo.toml`**: nou param `brevoListFormAction = ""` (buit fins configurar Brevo)
  - **`private.html`** (reescrit): formulari amb camps NOM, EMAIL, IDIOMA (select pre-seleccionat per idioma de la pàgina), TALLER (hidden, del `course_ref`), honeypot Brevo (`email_address_check`), checkbox newsletter no pre-marcat. JS guarda `localStorage` just abans del submit i amaga el formulari visualment.
  - **`confirmat.html`** (NOU): pàgina relay post-confirmació Brevo. JS llegeix `llum_doc` de `localStorage`, l'esborra i redirigeix a `/tallers/{taller}/privat/doc/?nom=...&taller=...&lang=...`
  - **`private-doc.html`** (NOU): layout documentació. Mostra contingut Markdown del taller + certificat formal. JS llegeix `nom` de la URL; si no n'hi ha, mostra "Accés restringit". Injecta nom a capçalera, certificat i peu PDF.
  - **`content/ca/confirmat/_index.md`** (NOU): pàgina relay (noindex, draft: false)
  - **`content/ca/tallers/revelat-bn/privat/doc/index.md`** (NOU): primera documentació de taller. Layout `private-doc`, imatge principal, contingut complet: introducció, història, procediment pas a pas (7 passos), consells, taula de resum, referències externes.
  - **`static/images/docs/`**: directori creat per a imatges de documentació
  - **i18n** (CA/ES/EN): 19 claus noves: `private_name_label`, `private_name_placeholder`, `private_language_label`, `private_newsletter_label`, `private_submit_cta`, `private_confirm_message`, `private_footer_nominal`, `confirmat_title`, `confirmat_message`, `doc_prepared_for`, `doc_no_access_title`, `doc_no_access_message`, `doc_no_access_cta`, `doc_print_cta`, `doc_footer_copyright`, `certificate_certifies`, `certificate_completed`, `certificate_place`, `certificate_issuer`
  - **`main.css`**: afegit `.private-form`, `.private-gate__confirm`, `.private-gate__footer`, `.doc-header`, `.doc-hero-image`, `.doc-print-bar`, `.doc-print-btn`, `.doc-body`, `.doc-print-footer`, `.certificate` (i tots els elements `certificate__*`), estils impressió `@media print` (amaga site header/footer, mostra `.doc-header` i `.doc-print-footer`, `.certificate` amb `page-break-before:always`, `@page { size: A4; margin: 2cm }`)

- **Fix staging (staticrypt)**: `deploy-staging.yml` — substituïda la lògica de globstar amb `npx staticrypt public --recursive`. El problema anterior era que `shopt -s globstar` no trobava fitxers en subdirectoris profunds i staticrypt descartava les pàgines no processades. Amb `--recursive` tot el directori `public/` s'encripta correctament. Commit `228647d9`.

- **Spec i pla escrits**: `docs/superpowers/specs/2026-05-24-documentacio-alumnes-design.md` + `docs/superpowers/plans/2026-05-24-documentacio-alumnes.md`

### 2026-04-19
**Redisseny home + pàgina tallers + línia del temps del recorregut**

- **Home page** (`layouts/index.html`): substituïda la graella genèrica de 6 tallers per 6 tiles de colors (un per àmbit de formació), preview de les 3 últimes entrades del blog, i secció de properes dates. Eliminada la secció d'espais de la home.
- **Sistema de colors per blocs** (`main.css`): custom properties `--bloc-color`, `--bloc-bg`, `--bloc-text` assignades via `data-bloc="[slug]"` a cada element. Colors definits per a 6 blocs: fonaments (daurat), proces (terracota), practica (verd), mig-format (blau), gran-format (gris), processos-alternatius (violeta).
- **Course card** (`partials/course-card.html`): franja de color superior via `::before`, CTA "El vull →" per a tallers propis i "Veure dates →" per a tallers externs (C&F).
- **Pàgina de tallers** (`layouts/tallers/list.html`): afegida línia del temps del recorregut formatiu ideal dalt de tot, seguida del filtre per blocs i les seccions acolorides per àmbit.
- **Línia del temps** (`partials/recorregut.html` + `data/recorregut.yaml`): 8 passos del camí core (passos 5 i 8 marcats com "Aviat") + 7 especialitzacions temàtiques en pills de color. Horitzontal en desktop, vertical en mòbil. Multilingüe CA/ES/EN.
- **Logo** (`main.css`): ampliat de 44px a 56px per millor llegibilitat.
- **Imatges** baixades del lloc antic: 21 imatges de tallers a `static/images/tallers/`, 8+ imatges de blog a `static/images/blog/`.
- **Blog** (`layouts/blog/`): nou layout list i single. 10 entrades noves a `content/ca/blog/` (algunes publicades, altres draft).
- **Traduccions** (`i18n/ca.yaml`, `es.yaml`, `en.yaml`): afegides keys per a blocs, blog, recorregut, agenda i elements de preu/estat.
- **Contingut multilingüe**: tots els tallers duplicats a `content/es/` i `content/en/` (21 tallers × 3 idiomes). Pàgines d'índex per a agenda, blog, espais i regala en ES i EN.
- **Data**: `data/blocs.yaml` (6 blocs amb nom, icon, desc en 3 idiomes), `data/recorregut.yaml` (recorregut formatiu en 3 idiomes).
- **Remote GitHub** afegit: `git@github.com:112books/llumatics-web.git` (branca `main`).

---

## Pendent / Properes sessions

### Infraestructura i deploy
- [x] VPS: `/admin/` té `chmod 777` — PHP pot escriure `analytics-cache.json`
- [x] Dashboard `/admin/` funciona — clicar "↻ actualitzar" per regenerar dades
- ⚠️ `static/admin/` NO es despleguen via rsync (exit 23). Usar sempre `scp` directe:
  ```bash
  hugo --minify --baseURL "https://llumatics.com/"
  scp public/admin/fetch-analytics.php llumatics@llumatics.com:www/admin/fetch-analytics.php
  scp public/admin/index.html llumatics@llumatics.com:www/admin/index.html
  ```
- [x] Branca `develop` per a staging — ja configurada

### Val-regal — LLEST EN PRODUCCIÓ ✅

Flux complet funcionant a `llumatics.com/regala/` des de 2026-05-23.

**Com funciona:**
1. Comprador omple el quiz → selecciona taller i import → omple formulari (Per a, De part de, missatge, email)
2. PayPal Smart Buttons → pagament live
3. `onApprove` → genera codi `LLM-YYYY-XXXXX` (random al browser) → 2 POSTs web3forms:
   - **Email 1** → `hola@llumatics.com`: totes les dades de la venda (per_a, de, missatge, email, import, taller, codi, paypal_order_id)
   - **Email 2** → intent d'enviar al comprador (web3forms free no respecta `to` → arriba a `linuxbcn@gmail.com`)
4. Pantalla d'èxit inline amb el val imprimible
5. Botó "Imprimeix / Desa com a PDF" → `window.print()`

**⚠️ Limitació web3forms (pla gratuït):**
El camp `to` no funciona — tots els emails arriben a `linuxbcn@gmail.com` (compte propietari).
**Workaround manual:** quan arriba l'Email 1 a `hola@llumatics.com`, copiar l'email del comprador i reenviar-li el codi. Veure `docs/manuals/operacions-pagaments.md` per al text exacte.

**Configuració a `hugo.toml`:**
- `paypalClientID` → Client ID live `ARfv0r9Y...` ✅
- `makecomGiftWebhook` → URL webhook Make.com (ja no s'usa, pot quedar buit) ✅
- `web3formsKey` → `31b4da8e-2f87-4909-8019-67ed2df04295` ✅

**Pendent val-regal (millores futures, no bloquejants):**
- [ ] Actualitzar nom/adreça de PayPal Business → `paypal.com → Settings → Business Information` (ara surt el nom personal del titular)
- [ ] Considerar upgrade web3forms de pagament si es vol email automàtic al comprador

---

### Formularis i integracions

#### "Avisa'm" per taller — PARCIALMENT LLEST (2026-05-27)

**Estat actual:**
- [x] Brevo: llista `#5 — Waitlist tallers` creada
- [x] Brevo: atributs `TALLER`, `IDIOMA`, `NOM`, `DATA_SOL_LICITUD`, `NEWSLETTER` ja existien
- [x] Tally: formulari creat — ID `LZ6r0O` — camps: email + hidden `taller` (`@taller`) → integració Brevo llista #5
- [x] Hugo: `tallyFormAvisa = "LZ6r0O"` a `hugo.toml` — botó actiu a tots els tallers
- [ ] **PENDENT: Brevo automation** — email de confirmació automàtic quan s'afegeix contacte a llista #5

**Com crear l'automation (pendent fer a l'estudi):**
1. `app.brevo.com → Automations → New automation → Start from scratch`
2. **Trigger:** "Contact is added to a list" → llista #5
3. **Primer:** crear el template a `Email → Templates → Create a template`:
   - Nom: `Avisa'm — confirmació`
   - Assumpte: `T'avisarem quan obrim places — Llumàtics`
   - Cos: "Hem apuntat el teu interès. Quan obrim places per al taller t'enviarem un avís. / Joan — Llumàtics"
   - Guardar i activar el template
4. **Action:** "Send an email" → seleccionar template `Avisa'm — confirmació`
5. Activar l'automatització

**Waitlist manual pendent:**
- Importar `waitlist.csv` a Brevo llista #5 (Núria Graell Bullich → taller `retrat-6x6`)

#### Altres formularis Tally pendents
- [ ] `tallyFormNewsletter` — subscripció al butlletí
- [ ] `tallyFormSolicitud` — sol·licitar data de taller
- [ ] `tallyFormContact` — formulari de contacte general

#### PDF alumnes
- [ ] Pipeline Make.com → Pandoc → email. **SUBSTITUÏT** per sistema de documentació al navegador (vegeu secció següent).

---

### Documentació nominal alumnes — EN CURS (Fase 1 infraestructura feta)

**Estat:** infraestructura de codi completament implementada. Pendent: configurar Brevo + test end-to-end.

**Pla complet:** `docs/superpowers/plans/2026-05-24-documentacio-alumnes.md`
**Spec de disseny:** `docs/superpowers/specs/2026-05-24-documentacio-alumnes-design.md`

**Arquitectura:** Formulari identificació → POST Brevo (doble opt-in) → `localStorage` relay → `/confirmat/` → `/privat/doc/?nom=...` → JS injecta nom → `window.print()` → PDF nominal amb certificat.

**Task 1 — Configurar Brevo (MANUAL — tu has de fer-ho):**
1. `app.brevo.com` → Contacts → Lists → "Alumnes Llumàtics" (apuntar l'ID)
2. Contacts → Settings → Contact attributes: `NOM` (Text), `TALLER` (Text), `IDIOMA` (Text), `DATA_SOL·LICITUD` (Date), `NEWSLETTER` (Boolean)
3. Contacts → Forms → Subscription form → camps: Email + NOM + TALLER (hidden) + IDIOMA (hidden) + NEWSLETTER (checkbox) → Double opt-in activat → Redirect URL: `https://llumatics.com/confirmat/`
4. Al formulari → Share/Embed → HTML form → copiar el valor de `action` (format: `https://sibforms.com/serve/MUIFA...`)
5. Enganxar l'URL a `hugo.toml`: `brevoListFormAction = "https://sibforms.com/serve/MUIFA..."`

**Tasks 2-8 — Codi (LLESTS ✅):**
- `hugo.toml`: param `brevoListFormAction` afegit (buit)
- `layouts/_default/private.html`: formulari Brevo + localStorage
- `layouts/_default/confirmat.html`: relay localStorage → /doc/
- `layouts/_default/private-doc.html`: documentació + injecció nom + certificat
- `content/ca/confirmat/_index.md`: pàgina relay
- `content/ca/tallers/revelat-bn/privat/doc/index.md`: documentació completa revelat B/N
- `main.css`: estils formulari, doc, certificat, @media print A4
- i18n CA/ES/EN: 19 claus noves

**Task 9 — Test staging (pendent):**
Un cop el staging funcioni correctament (fix staticrypt acabat de pujar, commit `228647d9`):
- `https://112books.github.io/llumatics-web/tallers/revelat-bn/privat/doc/?nom=Joan+Puig&taller=revelat-bn&lang=ca` → ha de mostrar la documentació completa

**Task 9 — Test end-to-end (pendent, necessita Brevo configurat):**
1. Obrir `/tallers/revelat-bn/privat/` → omplir formulari → verificar email doble opt-in Brevo
2. Confirmar email → verificar redirecció a `/confirmat/` → redirecció automàtica a `/doc/?nom=...`
3. Verificar document amb nom + botó impressió + certificat + PDF A4

**Inventari complet de documentació per alumnes (2026-05-26):**

Format: `slug | doc CA | doc ES/EN | hores taller`

✅ = publicat (draft:false) | 🔶 = esborrany (draft:true, té contingut) | ❌ = no existeix

| Taller | Doc CA | Doc ES/EN | Hores |
|--------|--------|-----------|-------|
| fonaments-iniciacio-puntual | ✅ | ✅ | 4h |
| revelat-bn | ✅ (path antic*) | ✅ | 4h |
| caffenol | ✅ | ✅ | 3h |
| wineol | ✅ | ✅ | 2h |
| iniciacio-revelat | ✅ | ✅ | 3h |
| retrat-gran-format | ✅ | ✅ | 3h |
| guinneol | 🔶 | ❌ | 2h |
| cianotipia | 🔶 | ❌ | 8h |
| copies-beers-developer | 🔶 | ❌ | 4h |
| copies-en-paper | 🔶 | ❌ | 4h |
| digitalitzacio-escaner | 🔶 | ❌ | 4h |
| edicio-imatges-fotoquimiques | 🔶 | ❌ | 4h |
| fotografia-de-carrer | 🔶 | ❌ | 3.5h |
| fotografia-estenopeica | 🔶 | ❌ | 4h |
| fotogrames-cianotipia | 🔶 | ❌ | 2h |
| gran-format-4x5 | 🔶 | ❌ | 8h |
| hasselblad-500 | 🔶 | ❌ | 3.5h |
| introduccio-al-positivat | 🔶 | ❌ | 3h |
| introduccio-gran-format | 🔶 | ❌ | 4h |
| retrat-6x6 | 🔶 | ❌ | 4h |
| retrat-amb-holga | 🔶 | ❌ | 4h |
| retrat-analogic | 🔶 | ❌ | 4h |
| reveladors-artesanals | 🔶 | ❌ | 8h |
| revelat-color-bn | 🔶 | ❌ | 3h |
| revelat-i-positivat | 🔶 | ❌ | 8h |
| revelats-experimentals | 🔶 | ❌ | 8h |
| tutoria-fotografica | 🔶 | ❌ | ⚠️ buit! |

`*` `revelat-bn-doc` és a `content/ca/tallers/revelat-bn/privat/doc/index.md` (path antic). Migrar a `content/[lang]/privat/revelat-bn-doc.md`.

**Flux de revisió per a cada doc 🔶:**
1. Revisar contingut CA: text, hores, preus, imatges
2. Corregir `durada_hores` al frontmatter del taller si cal
3. Canviar `draft: false` al doc CA
4. Crear versions ES i EN (`content/es/privat/[slug]-doc.md`, `content/en/privat/[slug]-doc.md`)

**Bug pendent:** `tutoria-fotografica` — `durada_hores` buit al frontmatter del taller.

**Nota:** tallers públics orgànics llests:
- [x] `wineol` — CA/ES/EN ✅
- [x] `caffenol` — CA/ES/EN ✅

**Pendent (logo C&F per tallers externs):**
- [ ] Afegir suport `partner_logo` a `private-doc.html`
- [ ] Copiar logo: `docs-cursos/Camera-and-films-inciacio-revelat/im/LOGO_C&F.png` → `static/images/logos/cameras-and-films.png`
- [ ] Afegir `partner_logo: /images/logos/cameras-and-films.png` al doc de `iniciacio-revelat`

---

### Contingut

- [ ] Imatges tallers que falten: `revelat-color-bn`, `guinneol`, `copies-beers-developer` (no estan a `static/images/tallers/`)
- [ ] `continua_aprenent` de `revelats-experimentals` — afegir `guinneol`, `revelat-color-bn`
- [ ] `archetypes/tallers.md` — actualitzar amb el frontmatter actual
- [ ] **Il·luminació bàsica** — taller nou: flaixos, modificadors, relació llum/ombra per a retrat analògic

### Qualitat i acabats
- [ ] Responsive: revisió pendent (mòbil)
- [ ] Traduccions ES i EN — pendent fins tenir CA ben polit
- [ ] Connexió xarxes socials (Instagram embed o feed)

### Fet aquesta sessió (2026-08-12)
**Waitlist alumnes + recordatori vals + FAQ laboratori + mapa Leaflet transport públic**

- **`static/admin/alumnes.php`** — panell PHP+SQLite de gestió de waitlist. Resum per taller amb alerta si ≥2 inscrits ("PROPOSA DATA"). Estats espera/contactat/confirmat/completat. Botó "Avisa" per enviar SMTP. Inserció manual. Auth: `llumatics`.
- **`form-handler.php`** (VPS, gitignored) — `type=avisa`: insereix a taula `waitlist` (UNIQUE email+taller), compta inscrits per taller, envia avís intern `[ACCIÓ] PROPOSA DATA` si ≥2. Waitlist comparteix `www/admin/vals.db`.
- **`static/admin/vals.php`** — botó "Recordatori" per enviar email en anglès al comprador d'un val actiu. Link "Alumnes" afegit a la topbar.
- **`static/admin/config.php`** (gitignored) — credencials SMTP Brevo extretes de tots els PHP. Clau Brevo rotada (`...xCp4hnW4vtjbWByy`) per secret exposat en push.
- **`static/admin/config.example.php`** — plantilla de config sense secrets (tracked).
- **FAQ laboratori independent** — afegida entrada FAQ a `content/{ca,es,en}/contacte/index.md`: "El laboratori és un temple, accés exclusiu per a tallers."
- **Mapa Leaflet** (`themes/llumatics/layouts/contacte/single.html`):
  - Base: CartoDB Light (`light_all`)
  - Marcador: logo SVG de Llumàtics (`static/images/llumatics-logo.svg`)
  - Transport: Overpass API — metro (vermell), tren/Rodalies (taronja), bus (blau), Bicing (verd)
  - Leaflet servit localment (`static/vendor/leaflet/`) per evitar bloqueig ad-blocker
  - Lliçó: operador `!=` a Overpass falla silenciosament; classificar metro vs tren al JS
  - Llegenda sota el mapa amb punt de color per a cada tipus de transport
  - Zoom: scroll normal = pàgina, Ctrl+scroll = zoom al mapa (comportament estàndard web)

**Incidència secrets:**
- Clau SMTP Brevo apareixia hardcodejada a `vals.php` i `alumnes.php` → GitHub push protection ho va bloquejar
- Solució: `git reset --soft` al commit net, extracció a `config.php` gitignored, rotació de clau a Brevo
- Pattern definitiu: tots els PHP d'admin fan `require_once __DIR__ . '/config.php'`

### Fet aquesta sessió (2026-08-11)
**Sistema de gestió de vals-regal + tracking de temps**

- **`static/admin/vals.php`** — panell PHP+SQLite per gestionar vals-regal. Login per sessió (password: `llumatics`). KPIs (actius, bescanviats, total emesos, volum €). Filtres per estat. Taula amb codi, taller, import, destinatari, comprador, dates, notes. Accions: bescanviat / cancel·lar / reactivar / nota inline. Formulari d'inserció manual. Precarrega automàtica dels 2 vals pendents en el primer arrencada.
- **`static/admin/index.html`** — afegit link "Vals-regal" a la topbar per navegar entre panells.
- **`themes/llumatics/layouts/_default/gift.html`** — `onApprove` de PayPal ara fa un tercer POST a `/form-handler.php` (type=`val`) per registrar cada venda automàticament.
- **`form-handler.php`** (VPS, gitignored) — nou handler `type=val`: valida codi, insereix a SQLite (`www/admin/vals.db`), calcula caducitat a +6 mesos.
- **Deploy**: `vals.php` i `index.html` via `scp`; `form-handler.php` via `scp`; `gift.html` via commit+push a `main`.
- **Tracking de temps** — skill `gestor-hores` activat. Directoris `.taques/llumatics/` i `.taques-central/` creats. ~1.8h registrades avui.

**Vals registrats manualment (precarregats al DB):**
| Codi | Taller | Import | Per a | Comprador | Compra | Caduca |
|------|--------|--------|-------|-----------|--------|--------|
| LLM-2026-0X2ZB | Aprende a controlar la luz | 220€ | Ale | elenavigoolivan@gmail.com | 2026-07-17 | 2027-01-17 |
| LLM-2026-OPUH9 | Introduction to darkroom printing | 170€ | Nataliia Lisohurska | mdkisselgof@gmail.com | 2026-08-11 | 2027-02-11 |

### Fet aquesta sessió (2026-07-08) — continuació
**Avisa'm: sistema de confirmació complet**

- **form-handler.php** (gitignored, desplegat via scp): flux definitiu:
  1. SMTP (Brevo relay) → avís intern a `hola@llumatics.com` (taller + email + data)
  2. API Brevo `/v3/smtp/email` → confirmació HTML al subscrit amb nom del taller
  3. API Brevo `/v3/contacts` → contacte afegit a llista #5 (Waitlist tallers)
- **Brevo Automation #2** — desactivada (enviava mail duplicat amb taller buit; l'API Brevo contactes no dispara automacions)
- **Brevo IP autoritzada** — 82.98.166.123 (VPS Dinahosting) autoritzada per a API keys
- **Filtre anti-spam Dinahosting** — whitelist `hola@llumatics.com` al panell de control i a Roundcube. Si segueix a spam, obrir ticket a Dinahosting.
- **Pendent app gestió alumnes** — PHP+SQLite: waitlist per taller, comptador inscrits per taller, proposta de grup GDPR-compliant (veure memory)

### Fet aquesta sessió (2026-07-07 / 08)
**Tallers nous + lightbox + email autenticació**

- **Taller Fotollibre: del concepte a la materialització** — fitxa pública CA/ES/EN publicada (`estat: actiu`, `sota_demanda: true`, `preu_1: 620`). Tres sessions de 4h amb 112books.eu com a acompanyament d'impressió. Affinity Publisher (gratuït des de 2024).
- **Taller Del Carrer al Llibre** — fitxa publicada CA/ES/EN (`estat: proxim`, `proper_inici: Octubre 2026`). 12 sessions mensuals, màx. 6 persones. Preu semestral i anual amb escala 1-4+ alumnes.
- **data/recorregut.yaml** — substituït `carrer-i-mirada` (en_construccio) per `del-carrer-al-llibre` (actiu) a la línia `practica`; afegit `fotollibre` a continuació.
- **Blog** — 2 posts nous: `del-carrer-al-llibre-nou-curs.md` i `fotollibre-del-concepte-a-la-materialitzacio.md`, amb `course_ref` i links inline als tallers.
- **Imatges fotollibre** — `fotollibre-4/5/6.tif` convertits a JPG (max 1200px, ~250-400KB). Frontmatter CA/ES/EN actualitzat.
- **Lightbox galeria** — JS afegit a `main.js` (`.js-lightbox-trigger` + `data-gallery`). CSS i DOM ja existien. Navegació fletxes teclat, Escape per tancar.
- **form-handler.php** (gitignored, desplegat via scp) — correcció de text: "avisada/avisada" → "avisat/avisada", accents ("Llumàtics", "perquè", "política", "No és brossa", "compromís").
- **Email autenticació (SPF + DKIM + DMARC)** — mails de Brevo ja no van a spam:
  - SPF: afegit `include:spf.brevo.com` al registre TXT de llumatics.com a Dinahosting
  - DKIM: domini llumatics.com verificat a Brevo (Senders & IPs → Domains → Authenticated)
  - DMARC: registre actualitzat amb `rua` de Brevo i tornant a `p=reject`:
    `v=DMARC1; p=reject; rua=mailto:hola@llumatics.com,mailto:rua@dmarc.brevo.com; ruf=mailto:hola@llumatics.com; fo=1`

**Pendent comunicació:**
- [ ] Post per a 112books.eu anunciant la col·laboració al taller Fotollibre
- [ ] Newsletter a Brevo quan hi hagi subscrits

### Fet aquesta sessió (2026-06-01)
**Instagram — Posts pilot publicats + perfil optimitzat + Meta Developer App iniciada**

- **3 posts taller 13 juny** publicats/programats a Instagram via Meta Business Suite:
  - Post 1 (Anunci): publicat avui
  - Post 2 (Procés): programat per al 6 de juny
  - Post 3 (Recordatori): programat per a l'11 de juny
- **Perfil Instagram** optimitzat: bio, nom amb accent, lloc web `llumatics.com`
- **Meta Developer App** iniciada a `developers.facebook.com` — nom: `Llumatics Publisher`, use case: "Manage messaging & content on Instagram". **Pendent:** connectar el business portfolio correcte (el que té el compte Instagram de Llumàtics) i completar la creació.

**Pendent per a la propera sessió:**

1. **Meta Developer App** — tornar a `developers.facebook.com`, trobar l'app guardada, connectar el business portfolio i completar la configuració
2. **Token Instagram** — Graph API Explorer → permisos `instagram_basic` + `instagram_content_publish` + `pages_read_engagement` → intercanviar per token de llarga durada (~60 dies)
3. **Instagram User ID** — `GET /{page-id}?fields=instagram_business_account` via Graph API Explorer
4. **Make.com Escenari 1** — "Nou taller": webhook → captions → Instagram Graph API (3 posts) → email preview
5. **Make.com Escenari 2** — "Nova agenda": webhook → Posts 2 i 3 programats
6. **`.env` local** — `cp .env.example .env` + omplir els dos webhooks de Make.com
7. **SSH key sense contrasenya** per al VPS (per a `./scripts/deploy.sh`)
8. **Test end-to-end** — crear taller de prova, córrer `./scripts/deploy.sh`, verificar post a Meta Business Suite

### Fet aquesta sessió (2026-05-31)
**Instagram — Disseny i infraestructura de promoció automàtica de tallers**

- **Spec dissenyada i aprovada:** `docs/superpowers/specs/2026-05-30-instagram-promocio-tallers-design.md`
- **Pla d'implementació:** `docs/superpowers/plans/2026-05-31-instagram-promocio-tallers.md`
- **`scripts/deploy.sh`** — substitueix el rsync manual. Fa: build Hugo + rsync VPS + detecció de tallers/agenda nous + webhook Make.com. Executable, sense dependència de GitHub Actions.
- **`.env.example`** — plantilla per a les URLs dels webhooks de Make.com (el `.env` real va gitignored, l'usuari l'ha de crear)
- **`.gitignore`** — afegit `.env`
- **GitHub Actions descartats** — s'havien creat i revisat 3 workflows (deploy-production, instagram-taller, instagram-agenda) però eliminats per preferència de l'usuari: vol sistema independent i simple, sense dependències externes.
- **Posts pilot (13 juny)** — 3 posts redactats per a "Iniciació al revelat" (Cameras & Films). L'usuari els publicarà manualment a Meta Business Suite.

**Pendent per a la propera sessió — TASQUES MANUALS (requereixen l'usuari):**

1. **Perfil Instagram** — bio, foto, highlights (15 min, des del mòbil)
2. **Meta Developer App** — `developers.facebook.com` → crear app "Llumatics Instagram Publisher" → permisos `instagram_basic`, `instagram_content_publish`, `pages_read_engagement` → obtenir token llarga durada (~60 dies)
3. **Instagram User ID** — via Graph API Explorer: `GET /{page-id}?fields=instagram_business_account`
4. **Make.com — Escenari 1 "Nou taller"** — webhook → captions → Instagram Graph API (3 posts programats) → email preview a hola@llumatics.com
5. **Make.com — Escenari 2 "Nova agenda"** — webhook → Posts 2 i 3 programats relatius a la data
6. **Copiar URLs webhooks a `.env`** — `cp .env.example .env` i omplir `MAKECOM_INSTAGRAM_TALLER_WEBHOOK` i `MAKECOM_INSTAGRAM_AGENDA_WEBHOOK`
7. **SSH key per al deploy** — `ssh-keygen -t ed25519 -C "llumatics-deploy"` + `ssh-copy-id` al VPS (per poder usar `scripts/deploy.sh` sense contrasenya)
8. **Test end-to-end** — crear taller de prova, córrer `./scripts/deploy.sh`, verificar post a Meta Business Suite

**Posts pilot 13 juny — PUBLICAR MANUALMENT (urgent, queden 13 dies):**

| Post | Data | Imatge |
|------|------|--------|
| Anunci | Avui | `static/images/tallers/iniciacio-revelat.jpg` |
| Procés | 6 de juny | `static/images/tallers/iniciacio-revelat-1.jpg` |
| Recordatori | 11 de juny | `static/images/tallers/iniciacio-revelat-2.jpg` |

Els 3 textos estan a la conversa del 2026-05-30/31. Publicar a Meta Business Suite: `business.facebook.com/content_management`.

### Fet aquesta sessió (2026-05-29)
**SEO tècnic + recorregut acordió responsive**

- **SEO — 3 fixes crítics/alts:**
  - `head.html`: meta `noindex` renderitzat des del frontmatter (`noindex: true` o `robots: "noindex, nofollow"`)
  - `head.html`: `hreflang x-default` apuntant sempre a la versió CA
  - `robots.txt`: afegits blocs per `/privat/`, `/confirmat/` (CA/ES/EN) i AI crawlers (GPTBot, Google-Extended, Bytespider)
- **Recorregut formatiu — redisseny complet a acordió:**
  - `data/recorregut.yaml`: `trunk` reestructurat com a objecte (era llista plana); afegit `bloc` a `path_a` i `path_b`
  - `partials/recorregut.html`: reescrit complet — acordió data-driven, hub station, tronc comú obert per defecte, línies temàtiques, targeta especial, i18n CA/ES/EN, `en_construccio` + `avait`
  - `main.css`: reemplaçats ~375 línies CSS de timeline/metro per ~160 línies d'acordió. Colors automàtics via `data-bloc` i variables CSS existents
  - `main.js`: accordion toggle amb `aria-expanded`
  - Manteniment: afegir nova línia = 1 entrada YAML a `linies[]`
- Commit: `dda9d99d` — branca `develop` pujada a GitHub

**SEO pendent (mig prioritat):**
- [ ] og:image fallback
- [ ] og:site_name + twitter:card
- [ ] og:locale per ES/EN

### Fet aquesta sessió (2026-05-09)
- [x] `fetch-analytics.php`: fix GoatCounter API v0 — endpoints i keys de resposta incorrectes
  - `/stats/refs` → `/stats/toprefs`
  - `$raw['browsers']` → `$raw['stats']` (ídem systems, sizes, locations, refs)
  - `norm_items`: llegir `item['count']` directament (no `stats[].daily`)
  - **Resultat:** navegadors, SO i dispositius ja apareixen al dashboard
- [x] `index.html`: KPI "pàg./sessió" → "mitjana/dia" (GoatCounter API v0 no exposa `total_unique`)
- [x] Deploy: rsync (exit 23 per admin) + `scp` directe de `fetch-analytics.php` i `index.html` al VPS

### Fet aquesta sessió (2026-05-05)
- [x] Adreça al footer sota el logo ("Nau Bostik, La Sagrera · Barcelona") → link a `/contacte/#com-arribar-hi`
- [x] Dashboard `/admin/`: KPI pàgines/sessió + secció localització de visites
- [x] Dashboard `/admin/`: token GoatCounter actualitzat, parsing `daily` corregit
- [x] Deploy admin: documentat que `static/admin/` cal scp directe (rsync els salta per exit 23)

### Fet aquesta sessió (2026-05-04 tarda)
- [x] Tutoria fotogràfica: preu per hora (`preu_hora: 60`), blocs de 2h/3h/4h, inclou químics, no inclou paper ni pel·lícula (12€/unitat)
- [x] Template `single.html`: taula de preus condicional per a tallers per hora vs. per alumnes (i18n complet CA/ES/EN)
- [x] i18n CA/ES/EN: keys noves `preu_hora_minim`, `durada_col`, `preu_col`, `preu_2h`, `preu_3h`, `preu_4h`
- [x] Tutoria fotogràfica: traduccions ES i EN amb nou frontmatter
- [x] Introducció al positivat: traduccions ES i EN (preu_1:170/2:97/3:72/4:61, 10 fulls RC)
- [x] Preus dels carretes unificats a 12€ en tots els tallers (CA/ES/EN)
- [x] 36 fitxers ES/EN (18 tallers) migrats del frontmatter antic al nou format (preu_1-4, durada_hores, estat, etc.)
- [x] Deploy a producció (llumatics.com) via rsync al VPS Dinahosting

### Fet aquesta sessió (2026-05-04)
- [x] Tallers de retrat: camp `preu_model: 50` (CA/ES/EN) — model opcional +50€ o el porta l'alumne
- [x] Info-box tallers: fila "Model" explícita (+50€ opcional / o portes el teu·la teva)
- [x] Secció "No inclòs" dels 3 tallers de retrat: afegida línia de model
- [x] Tallers info-box: "Lloc" → link "Llumàtics" amb color accent + subratllat, apunta a `/contacte/#com-arribar-hi`
- [x] Pàgina contacte: bloc dades (adreça/correu/instagram) mogut sota "Com arribar-hi", ordre adreça → correu → instagram
- [x] Pàgina `/gracies/` (CA/ES/EN, noindex) amb missatge contextual per `?from=contacte` i `?from=newsletter`
- [x] Formulari contacte: redirect a `/gracies/?from=contacte` via web3forms
- [x] Newsletter: redirect a `/gracies/?from=newsletter` (en lloc de missatge inline)
- [x] header.html: `.Site.Languages` → `site.Languages` (deprecation Hugo v0.156)
- [x] Flux de branques: sincronització `develop` ↔ `main` regularitzada

### Fet aquesta sessió (2026-05-02)
- [x] Dashboard `/admin/` amb estadístiques GoatCounter (password: `llumatics`)
- [x] GoatCounter tracking a totes les pàgines (`goatcounterSite = "llumatics"`)
- [x] robots.txt custom + humans.txt + `<link rel="author">`
- [x] 404: el "404" ara és visible + eyebrow "Error 404 · Vel·lada total"
- [x] Pàgina contacte: formulari duplicat eliminat, layout 2 columnes, anchor nav darkroom
- [x] Anchor nav contacte traduïda CA/ES/EN
- [x] Nota newsletter sota botó "Avisa'm" a les fitxes de taller
- [x] GDPR/LOPD: fonts autoallotjades (Inter + Playfair Display), OSM mapa lazy-load
- [x] Pàgines legals en ES i EN (avís legal, privacitat, cookies)
- [x] `waitlist.csv` (no a git) — Nuria Graell Bullich apuntada per a `retrat-6x6`

---

## Comandes útils

```bash
# Servidor local amb drafts
hugo server -D

# Build de producció
hugo --minify

# Crear nou taller
hugo new content ca/tallers/nom-taller/index.md

# Crear nova entrada d'agenda
hugo new content ca/agenda/taller-mes-any.md

# Llistar tot el contingut
hugo list all

# Verificar el build sense errors
hugo --templateMetricsHints
```

---

# Sessió 2026-04-20 — Resum de canvis

## Fitxers nous

### Tallers
- `content/ca/tallers/revelat-color-bn/index.md` — taller nou: revelat C-41 amb procés B/N
- `content/ca/tallers/guinneol/index.md` — taller nou: revelat amb cervesa Guinness
- `content/ca/tallers/copies-beers-developer/index.md` — taller nou: còpies a l'ampliadora amb Beers Developer

### Blog
- `content/ca/blog/guinneol-revelat-cervesa.md` — post: crònica del Guinneol (2017)
- `content/ca/blog/beers-paper-developer.md` — post: fórmula Beers Developer (2017)

## Fitxers modificats

### Templates
- `themes/llumatics/layouts/tallers/single.html` — afegida galeria amb lightbox, taula de preus preu_1/2/3/4, camps nous (nivell, continua_aprenent, prerequisits, lloc)
- `themes/llumatics/layouts/partials/course-card.html` — migrat a camps nous (nivell, durada_hores, preu_1/preu_4, estat)
- `themes/llumatics/layouts/blog/single.html` — afegida galeria amb lightbox i camp images

### Dades i configuració
- `themes/llumatics/i18n/ca.yaml` — hero_title, hero_subtitle, hero_eyebrow, section_blocs_subtitle, footer_tagline, footer_sub
- `CLAUDE.md` — actualitzat amb nous camps, fórmula de preus, sistema de galeria/lightbox, canals, estats

### Contingut (migració frontmatter)
- Tots els tallers existents migrats del frontmatter antic (levels/formats/price/related) al nou (nivell/tipus/preu_1-4/continua_aprenent)
- `camera-i-exposicio` eliminat (duplicat de fonaments-iniciacio-puntual)
- `fotografia-estenopèica` reanomenat a `fotografia-estenopeica` (slug sense accent)

## Estat actual dels tallers

| Slug | Estat |
|------|-------|
| fonaments-iniciacio-puntual | actiu |
| revelat-bn | actiu |
| revelat-color-bn | actiu ← NOU |
| guinneol | actiu ← NOU |
| copies-beers-developer | actiu ← NOU |
| copies-en-paper | actiu |
| revelat-i-positivat | actiu |
| revelats-experimentals | actiu |
| reveladors-artesanals | actiu |
| introduccio-al-positivat | actiu |
| digitalitzacio-escaner | actiu |
| fotografia-estenopeica | actiu |
| fotogrames-cianotipia | actiu |
| cianotipia | actiu |
| retrat-analogic | actiu |
| retrat-6x6 | actiu |
| hasselblad-500 | actiu |
| gran-format-4x5 | actiu |
| introduccio-gran-format | actiu |
| retrat-gran-format | actiu (externs) |
| iniciacio-revelat | actiu (externs) |
| fotografia-de-carrer | actiu |
| tutoria-fotografica | actiu |
| carrer-i-mirada | en-preparacio |

## Pendent (sessió 2026-04-20)

- Caffenol i Wineol — tallers independents per fer (com el Guinneol)
- Imatges que falten per a tallers nous (revelat-color-bn, guinneol, copies-beers-developer)
- Traduccions ES i EN — pendent per a tots els tallers
- `archetypes/tallers.md` — actualitzar amb el nou frontmatter
- `continua_aprenent` de `revelats-experimentals` — afegir guinneol, revelat-color-bn

---

## Comportament de l'agent

### Inici de sessió (casa o estudi)
Abans de fer qualsevol altra cosa, sincronitza amb GitHub:

```bash
git fetch origin
git status
```

Si la branca local va per darrere del remote, fes pull i resol els conflictes:

```bash
git pull origin main
# Si hi ha conflictes a CLAUDE.md o altres fitxers, resol'ls manualment
# i fes commit de la resolució abans de continuar
```

> Treballem des de dos ordinadors (casa i estudi). Sempre pot haver-hi canvis al remote que no tenim en local.

---

### Abans de qualsevol implementació
- **Cerca prèvia obligatòria:** Abans d'implementar qualsevol biblioteca, API, patró o
  tecnologia externa, cerca a internet la documentació oficial i casos d'ús reals actuals.
  No assumeixis que el que saps és la versió vigent.
- **Seguretat del 100%:** No implementis cap dependència externa, crida a API o integració
  de tercers fins que hagis confirmat que funciona tal com s'espera en la versió actual.
  Si tens dubtes, pregunta abans d'actuar.
- **Comprova la compatibilitat** amb les versions exactes del projecte abans de proposar
  qualsevol canvi que afecti dependències.

### Memòria de sessió (MEMORY.md)
- En iniciar una sessió, llegeix `MEMORY.md` si existeix per recuperar el context previ.
- En tancar o en arribar a un punt de pausa significatiu, actualitza `MEMORY.md` afegint
  una entrada nova al principi del fitxer amb aquest format:
  
YYYY-MM-DD
Fet: resum breu de les accions completades
Decisions: canvis d'arquitectura o criteris adoptats
Pendent: tasques que queden obertes per a la propera sessió

- No esborris entrades anteriors. `MEMORY.md` és un log acumulatiu de totes les sessions.
- `MEMORY.md` no s'inclou al build de Hugo (afegeix-lo a `.gitignore` si no vols que
aparegui al repositori públic).

### Sub-agents per a tasques feixugues
Utilitza sub-agents per a:
- Exploració àmplia del codebase (més de 5 fitxers implicats)
- Recerca web que requereixi múltiples cerques i síntesi
- Tasques paral·lelitzables independents (anàlisi de templates, traduccions, validació)
- Qualsevol tasca que pugui saturar el context principal
Mantén el context principal net i delega el treball pesat als sub-agents.

---

# Sessió 2026-04-22 — Resum de canvis

## Correccions

- **Galeria espais (bug crític):** `strings.Split` al shortcode `galeria.html` tenia els arguments invertits via pipe → galleries renderitzaven buides. Fix: `strings.Split .Inner "\n"` sense pipe.
- **Lloc als tallers:** camp "Lloc" a la info-box ara és un link. Llumàtics → `/espais/#com-arribar-hi`. Extern (Cameras & Films) → Google Maps amb adreça Carrer d'en Rosic 3.

## Funcionalitats noves

### Biblioteca collapsible (espais)
- Nou shortcode `{{% seccions-collapsibles %}}` — wrapa contingut Markdown en un `<div class="collapsible-sections">`
- JS a `main.js`: agrupa el contingut de cada `h2` en un panel i afegeix toggle al clic (FAQ-style)
- CSS: estil amb `+` / `−`, tot tancat per defecte
- Aplicat a les categories de la biblioteca a `content/ca/espais/_index.md`

### Sistema d'avisos per taller ("Avisa'm")
- Botó "Avisa'm quan hi hagi places →" a la info-box de cada taller (CTA terciari, estil ghost)
- Nou param `tallyFormAvisa` a `hugo.toml` (buit fins crear el formulari Tally)
- Fallback: mailto si el param no està configurat
- Concepte: waitlist per taller → tag a Brevo → avís quan es programi

### Newsletter al footer
- Banda horitzontal al footer amb formulari de subscripció inline
- Connectat a **web3forms** (clau ja existent a `hugo.toml`) → envia email a `hola@llumatics.com`
- Quan `tallyFormNewsletter` tingui ID → mostra botó Tally en lloc del formulari nadiu
- Responsive: columna en mòbil

## Arquitectura del sistema d'avisos (concepte documentat)

```
Visitant al taller
  ├── "Sol·licita una data"  → vol reservar ara     → Tally form → Brevo
  ├── "Fer una consulta"     → vol parlar           → Tally form / mailto
  └── "Avisa'm"             → interès futur        → Tally form → Brevo (tag = slug-taller)

Quan hi ha 2+ interessats en un taller:
  → Filtrar a Brevo per tag
  → Enviar avís als interessats
  → Promo a xarxes socials per omplir places
  → Si s'omple → crear entrada d'agenda (estat: active)
```

## Fitxers modificats

| Fitxer | Canvi |
|--------|-------|
| `themes/llumatics/layouts/shortcodes/galeria.html` | Fix strings.Split |
| `themes/llumatics/layouts/shortcodes/seccions-collapsibles.html` | NOU |
| `themes/llumatics/layouts/tallers/single.html` | Lloc amb links + botó Avisa'm |
| `themes/llumatics/layouts/partials/footer.html` | Banda newsletter |
| `themes/llumatics/assets/css/main.css` | Collapsible + newsletter-band + btn--ghost |
| `themes/llumatics/assets/js/main.js` | Collapsible JS + web3forms real |
| `content/ca/espais/_index.md` | Biblioteca amb shortcode collapsible |
| `hugo.toml` | tallyFormAvisa + comentari |


## incidència amb formulari de contacte 11/04/2026

Entesos. Versió sobria i directa.

⸻

Llumàtics — Formulari de contacte Web3Forms

Incidència resolta i documentació

Context

El formulari de contacte no enviava missatges correctament en producció. El navegador retornava:

* POST https://api.web3forms.com/submit 400 (Bad Request)
* Missatge d’error a la interfície: “Error enviant el formulari”

El problema afectava només el formulari de contacte, no el newsletter.

⸻

Causes identificades

1. Duplicació de access_key

Es trobaven dues declaracions del mateix camp:

<input type="hidden" name="access_key" ...>

Això generava un payload inconsistent per Web3Forms.

Solució: eliminació d’un dels camps i manteniment d’una única clau.

⸻

2. Camp botcheck incorrecte

Inicialment definit com a checkbox ocult:

<input type="checkbox" name="botcheck">

Aquest format podia generar valors inesperats o ser interpretat com spam.

Solució: substitució per:

<input type="hidden" name="botcheck" value="">

⸻

3. Camp de missatge no estàndard

El camp utilitzava:

name="missatge"

Web3Forms espera preferentment:

name="message"

Solució: normalització del nom del camp.

⸻

4. Errors residuals de JavaScript

Es van detectar i eliminar:

* fragments de codi invàlid (...)
* duplicació de listeners de submit
* possibles conflictes d’abast del formulari

⸻

5. Error secundari de consola

A listener indicated an asynchronous response...

No està relacionat amb el formulari. Prové d’extensions del navegador o eines de desenvolupament.

⸻

Estat final

* Enviament de formulari operatiu
* Web3Forms accepta correctament les peticions
* Sense errors 400
* Newsletter sense afectació
* JavaScript estable

⸻

Aprenentatges

* Web3Forms és sensible a duplicats i camps no esperats
* Un sol camp incorrecte pot invalidar tot el request
* Els errors 400 en aquest context són gairebé sempre de payload, no de JS
* Cal evitar duplicacions en hidden inputs i normalitzar noms de camps

⸻

Tasques pendents

Interfície

* Afegir feedback d’estat clar en enviament (èxit/error)
* Millorar estat de “loading” del botó
* Substituir alertes per missatges inline

⸻

Formulari

* Millorar validació abans d’enviament
* Evitar doble submit (bloqueig del botó)
* Opcional: millorar sistema anti-spam (honeypot o temps mínim)

⸻

Depuració i manteniment

* Opcional: logging de payload en entorn de desenvolupament
* Revisió futura d’unificació de formularis del lloc

⸻

Conclusió

El problema no era estructural del projecte sinó una combinació de camps duplicats i incompatibilitats amb l’esquema esperat per Web3Forms. Un cop corregit, el sistema funciona de forma estable.

⸻

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
