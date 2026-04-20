# CLAUDE.md — Llumàtics Web

> Guia operativa per a Claude Code en aquest projecte.

## Projecte

Web oficial de **Llumàtics**, escola de fotografia a Barcelona especialitzada en fotografia fotoquímica i processos alternatius. Construïda amb Hugo (static site generator), tema custom i continguts en Markdown.

- **Repositori:** `github.com/112books/llumatics-web`
- **Producció:** `https://llumatics.com` → branca `main` → GitHub Pages
- **Staging:** `https://112books.github.io/llumatics-web` → branca `develop`
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