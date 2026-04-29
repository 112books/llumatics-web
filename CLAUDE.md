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
  instagram = "https://www.instagram.com/llumaticscat"
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

- [ ] Revisió de textos de tots els tallers (CA)
- [ ] PDF alumnes: model en preparació (usuari). Pipeline: Make.com → Pandoc → email. Pàgines privades ja definides.
- [ ] Formularis Tally: crear i omplir IDs a `hugo.toml` — `tallyFormNewsletter`, `tallyFormAvisa`, `tallyFormSolicitud`, `tallyFormContact`, `tallyFormGiftVoucher`
- [ ] Brevo: configurar llistes i integració Tally → Brevo per a newsletter i waitlist
- [x] Cercador intern: JSON index Hugo + overlay vanilla JS + icona lupa al menú
- [x] Pàgina Regala: questionaire de recomanació + icona Heroicons + link des de fitxes de taller
- [ ] Val regal — pipeline pendent:
  - [ ] Connectar webhook Tally → Make.com (URL: `https://hook.eu1.make.com/oq2j1m7ya89as3qtl32lxnvmxgq8qthg`)
  - [ ] Configurar emails a Make.com (notificació Joan + confirmació comprador)
  - [ ] Afegir ID formulari Tally a `hugo.toml` → `tallyFormGiftVoucher`
  - [ ] Dissenyar i generar PDF bonic (Make.com + plantilla)
- [ ] Formularis Tally: crear i omplir IDs a `hugo.toml` — `tallyFormNewsletter`, `tallyFormAvisa`, `tallyFormSolicitud`, `tallyFormContact`
- [ ] Brevo: configurar llistes i integració Tally → Brevo per a newsletter i waitlist
- [ ] Responsive: revisió pendent (mòbil)
- [ ] Traduccions ES i EN — pendent fins tenir CA ben polit
- [ ] Connexió xarxes socials (Instagram embed o feed)
- [ ] Tallers passos 5 i 8 del recorregut: crear fitxes quan estiguin llestes
- [ ] Imatge hero a la home (`heroImage` al frontmatter de `content/ca/_index.md`)
- [ ] Branca `develop` per a staging abans de pujar a producció
- [ ] Caffenol i Wineol — tallers independents per fer (com el Guinneol)
- [ ] Imatges tallers: revelat-color-bn, guinneol, copies-beers-developer
- [ ] `archetypes/tallers.md` — actualitzar amb el nou frontmatter
- [ ] `continua_aprenent` de `revelats-experimentals` — afegir guinneol, revelat-color-bn

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
