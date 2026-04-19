# CLAUDE.md — Llumàtics Web

> Guia operativa per a Claude Code en aquest projecte.

## Projecte

Web oficial de **Llumàtics**, escola de fotografia a Barcelona. Construïda amb Hugo (static site generator), tema custom i continguts en Markdown.

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
title: ""
lead: ""                   # Descripció curta (hero i cards)
description: ""            # SEO meta description
image: ""                  # /images/tallers/nom.jpg
technique: ""              # Fotoquímica | Estenopèica | Gran Format | Retrat | Carrer | Teoria
level: ""                  # Iniciació | Intermedi | Avançat
duration: ""               # ex: "8 hores (2 sessions)"
location: "Laboratori Llumàtics, Barcelona"
price: 0
max_places: 6
status: "soon"             # active | full | soon
tags: []
draft: true
---
```

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
location: "Laboratori Llumàtics, Barcelona"
duration: ""
price: 0
max_places: 6
status: "active"          # active | full | soon | cancelled
draft: false
---
```

### Post de blog
**Ruta:** `content/ca/blog/[slug].md`

```yaml
---
title: ""
lead: ""
description: ""
image: ""
date: 2026-01-01
tags: []
draft: true
---
```

---

## Workflow per publicar un nou taller

1. Crea la fitxa pública:
   ```bash
   hugo new content ca/tallers/nom-taller/index.md
   ```
2. Omple el frontmatter i escriu el contingut
3. Afegeix la imatge a `static/images/tallers/`
4. Crea el material privat per alumnes:
   ```bash
   # Crea manualment: content/ca/tallers/nom-taller/privat/index.md
   # layout: "private", noindex: true
   ```
5. Crea entrada d'agenda (si hi ha dates):
   ```bash
   hugo new content ca/agenda/nom-taller-mes-any.md
   ```
6. Duplica les fitxes per ES i EN si cal
7. Canvia `draft: false` per publicar
8. Commit i push a `develop` → staging
9. Revisar staging → merge a `main` → producció

---

## Multilingüisme

- La llengua per defecte és **CA** (`content/ca/`)
- Els fitxers ES i EN van a `content/es/` i `content/en/`
- Les traduccions de textos d'interfície estan a `themes/llumatics/i18n/`
- Cada idioma té el seu propi menú definit a `hugo.toml`
- Les URLs de l'idioma per defecte NO tenen prefix (`/tallers/`)
- Les URLs d'ES i EN SÍ que en tindran (`/es/tallers/`, `/en/tallers/`) si `defaultContentLanguageInSubdir = true`

---

## Variables de configuració (hugo.toml → params)

```toml
[params]
  contactEmail = "info@llumatics.com"
  instagram = "https://www.instagram.com/llumaticscat"
  tallyFormNewsletter = ""    # ID del formulari Tally per newsletter
  tallyFormContact = ""       # ID del formulari Tally per inscripcions/PDF
  tallyFormGiftVoucher = ""   # ID del formulari Tally per vals-regal
```
Quan es creïn els formularis a Tally, omplir aquí els IDs (la part final de la URL).

---

## Imatges

- **Logo:** `static/images/logo.png` (PNG fins que hi hagi SVG)
- **Tallers:** `static/images/tallers/[slug].jpg` — recomanat 1200×800px
- **Espais:** `static/images/espais/[nom].jpg`
- **Blog:** `static/images/blog/[slug].jpg`
- Les imatges es van afegint progressivament. Si no hi ha imatge, el component mostra un placeholder.

---

## Generació de PDF per a alumnes

### Flux
1. Alumne accedeix a `/tallers/[slug]/privat/`
2. Omple formulari Tally (nom + email + opt-in newsletter)
3. Tally fa webhook a Make.com
4. Make.com:
   a. Agafa el fitxer `.md` del curs de l'API del repo (o un template)
   b. Injecta el nom de l'alumne al principi i al peu ("Generat per a [Nom]")
   c. Executa Pandoc → genera PDF
   d. Envia PDF per email a l'alumne
   e. Afegeix contacte a Brevo (amb tag del curs)

### Plantilla del peu del PDF
```
──────────────────────────────────────────────
Document generat per Llumàtics per a ús exclusiu de [NOM ALUMNE].
No es permet la distribució ni reproducció d'aquest material.
© Llumàtics — llumatics.com
──────────────────────────────────────────────
```

---

## Vals-regal

- Pàgina: `content/ca/regala/_index.md` (layout: gift)
- Imports configurats a: `data/gift_amounts.yaml`
- Flux actual: email a `info@llumatics.com`
- Flux futur (quan hi hagi VPS): generació automàtica de codis únics

---

## Normes per editar

- **CSS:** Tot a `themes/llumatics/assets/css/main.css`. Variables a `:root`.
- **No frameworks CSS.** Vanilla CSS amb custom properties.
- **No JavaScript innecessari.** El JS és mínim (menú mòbil, lazy load).
- **Continguts sempre en Markdown.** Cap HTML inline als fitxers `.md` tret de casos excepcionals.
- **Imatges:** sempre amb `alt` descriptiu. Format jpg/webp, mai PNG per fotos.
- **Drafts:** `draft: true` mentre no estigui llest per publicar.
- **Noindex** obligatori a totes les pàgines privades d'alumnes.

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
