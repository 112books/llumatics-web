# Manual operatiu — Crear contingut a Llumàtics

---

## 1. Crear un nou taller

### Pas 1 — Crear el fitxer

```bash
hugo new content ca/tallers/nom-del-taller/index.md
```

Substitueix `nom-del-taller` pel slug: tot en minúscules, sense accents, paraules separades per `-`.
Exemples: `revelat-color-bn`, `fotografia-estenopeica`, `retrat-6x6`

---

### Pas 2 — Calcular els preus

```
cost_base = (durada_hores × 50) + 20

preu_1 = cost_base
preu_2 = arrodonir((cost_base × 1.14) / 2)
preu_3 = arrodonir((cost_base × 1.28) / 3)
preu_4 = arrodonir((cost_base × 1.43) / 4)
```

**Exemple — taller de 4 hores:**
- cost_base = (4 × 50) + 20 = 220 €
- preu_1 = 220 € · preu_2 = 125 € · preu_3 = 94 € · preu_4 = 79 €

---

### Pas 3 — Omplir el frontmatter

```yaml
---
title: "Títol atractiu i suggerent"
lead: "Una frase que enganxi, per a cards i xarxes."
description: "SEO — màx. 155 caràcters."
image: "/images/tallers/nom-del-taller.jpg"

tipus: "taller"
canal: "llumatics"          # llumatics | externs | institucions
extern: false               # OBLIGATORI per aparèixer a la llista de tallers
categoria: "iniciacio"      # iniciacio | intermedi | avançat | tematic
estat: "en-preparacio"      # actiu | en-preparacio | idea

preu_1: 220
preu_2: 125
preu_3: 94
preu_4: 79
durada_hores: 4
lloc: "Llumàtics — Nau Bostik, La Sagrera, Barcelona"
max_places: 4
nivell: "Iniciació"         # Iniciació | Intermedi | Avançat
sota_demanda: true

prerequisits: "Cap"
continua_aprenent: []       # slugs d'altres tallers relacionats
blocs: ["proces"]           # vegeu secció "On apareix el taller"
weight: 50                  # ordre dins del bloc (10, 20, 30... per deixar espai)

tags: []
draft: true
---
```

---

### Pas 3b — On apareix el taller a la pàgina de Tallers

El camp `blocs` determina en quina secció apareix el taller a `/tallers/`:

| Slug | Secció |
|------|--------|
| `fonaments` | Fonaments i procés digital |
| `proces` | Procés analògic (revelat, positivat, laboratori) |
| `practica` | Pràctica fotogràfica (carrer, retrat...) |
| `mig-format` | Mig format |
| `gran-format` | Gran format |
| `processos-alternatius` | Processos alternatius (cianotipia, experimentals...) |

Un taller pot estar a més d'una secció: `blocs: ["proces", "practica"]`

**El camp `blocs` s'ha d'afegir als tres idiomes (CA, ES, EN) amb el mateix valor.**

---

### Pas 3c — On apareix al Camí Ideal i Especialitzacions

El camí ideal i les especialitzacions es gestionen a `data/recorregut.yaml`.

**Per afegir al Camí Ideal** (passos numerats):

```yaml
- step: 5
  title: "Nom del taller"
  title_es: "Nombre del taller"
  title_en: "Workshop name"
  slug: "nom-del-taller"
  bloc: "fonaments"
  desc: "Descripció breu."
  desc_es: "Descripción breve."
  desc_en: "Short description."
```

**Per afegir a Especialitzacions** (pills temàtiques):

```yaml
tematic:
  - title: "Nom del taller"
    title_es: "Nombre del taller"
    title_en: "Workshop name"
    slug: "nom-del-taller"
    bloc: "proces"
```

---

### Pas 4 — Escriure el contingut

Ordre al cos del document:

1. **Per què fer aquest taller** — motivació, context
2. **Continguts** — llista de què s'aprendrà
3. **Inclòs en el preu** — materials, químics, etc.
4. **Cal portar** — el que ha de portar l'alumne
5. **No inclòs** — per evitar malentesos

---

### Pas 5 — Afegir la imatge

```
static/images/tallers/nom-del-taller.jpg
```

Format: jpg/webp · Mida: 1200×800px · Màx. 500KB

---

### Pas 6 — Crear les pàgines privades d'alumnes

Vegeu la **Secció 3** d'aquest manual per al procés complet.
Resum: cal crear la **form page** i el **doc page** per a cada idioma.

---

### Pas 7 — Publicar

1. Canvia `draft: false` i `estat: "actiu"` als tres idiomes (CA, ES, EN)
2. Puja a staging:
   ```bash
   git add .
   git commit -m "feat: nou taller nom-del-taller"
   git push origin develop
   ```
3. Revisa a `https://112books.github.io/llumatics-web`
4. Desplega a producció:
   ```bash
   git checkout main && git merge develop && git push origin main
   hugo --minify --baseURL "https://llumatics.com/"
   rsync -avz --delete --exclude 'admin/' public/ llumatics@vl28359.dinaserver.com:www/
   git checkout develop
   ```

---

---

## 2. Crear una entrada d'agenda

### Pas 1 — Crear el fitxer

```bash
hugo new content ca/agenda/nom-taller-mes-any.md
```

Exemple: `ca/agenda/revelat-bn-juny-2026.md`

---

### Pas 2 — Omplir el frontmatter

```yaml
---
title: "Revelat en blanc i negre — Juny 2026"
course_ref: "revelat-bn"      # slug del taller (ha d'existir!)
date_start: "2026-06-14"
date_end: ""                   # deixar buit si és un sol dia
time_start: "10:00"
time_end: "14:00"
lloc: "Llumàtics — Nau Bostik, La Sagrera, Barcelona"
durada_hores: 4
preu_1: 220
preu_2: 125
preu_3: 94
preu_4: 79
max_places: 4
status: "active"              # active | full | soon | cancelled
draft: false
---
```

> **Important:** el `course_ref` ha de ser exactament el slug del taller. Si no coincideix, l'agenda no pot recuperar les dades.

L'agenda **només apareix a la home i a `/agenda/` en CA**. No cal crear entrades d'agenda per a ES ni EN.

---

### Pas 3 — Publicar

```bash
git add .
git commit -m "feat: agenda revelat-bn juny-2026"
git push origin develop
# Revisar staging, llavors:
git checkout main && git merge develop && git push origin main
hugo --minify --baseURL "https://llumatics.com/"
rsync -avz --delete --exclude 'admin/' public/ llumatics@vl28359.dinaserver.com:www/
git checkout develop
```

---

---

## 3. Pàgina privada d'alumnes

Cada taller té dos fitxers privats (a `content/[lang]/privat/`):

| Fitxer | URL pública | Funció |
|--------|------------|--------|
| `[slug].md` | `/tallers/[slug]/privat/` | Formulari d'identificació (layout `private`) |
| `[slug]-doc.md` | `/tallers/[slug]/privat/doc/` | Documentació del taller (layout `private-doc`) |

**Flux complet de l'alumne:**
1. Accedeix a `/tallers/[slug]/privat/` → veu el formulari (nom, email, idioma)
2. Envia el formulari → Brevo envia un email de doble opt-in
3. L'alumne confirma l'email → Brevo redirigeix a `/confirmat/`
4. `/confirmat/` llegeix `localStorage` i redirigeix automàticament a `/tallers/[slug]/privat/doc/?nom=Joan+Puig&taller=[slug]&lang=ca`
5. El document es mostra personalitzat amb el nom. El botó "Imprimeix" genera el PDF amb el certificat.

---

### 3.1 Crear la form page

Crea **tres fitxers** (un per idioma). El contingut és buit — el layout `private` fa tota la feina.

**CA** → `content/ca/privat/[slug].md`
```yaml
---
title: "Material per a alumnes — [Títol del taller]"
layout: "private"
url: "/tallers/[slug]/privat/"
course_ref: "[slug]"
noindex: true
sitemap:
  disable: true
robots: "noindex, nofollow"
draft: false
---
```

**ES** → `content/es/privat/[slug].md`
```yaml
---
title: "Material para alumnos — [Títol del taller]"
layout: "private"
url: "/es/tallers/[slug]/privat/"
course_ref: "[slug]"
noindex: true
sitemap:
  disable: true
robots: "noindex, nofollow"
draft: false
---
```

**EN** → `content/en/privat/[slug].md`
```yaml
---
title: "Student materials — [Workshop title]"
layout: "private"
url: "/en/tallers/[slug]/privat/"
course_ref: "[slug]"
noindex: true
sitemap:
  disable: true
robots: "noindex, nofollow"
draft: false
---
```

> **Nota:** Brevo (el formulari) és únic per a tots els tallers. El camp `course_ref` s'envia com a camp ocult `TALLER` a Brevo i s'usa per etiquetar el contacte.

---

### 3.2 Crear el doc page

El doc és el contingut real del taller. Comença com a `draft: true` i es publica quan estigui revisat.

**Només cal el fitxer CA.** Les versions ES i EN es faran quan escaigui.

**CA** → `content/ca/privat/[slug]-doc.md`
```yaml
---
title: "[Títol del taller en Català]"
layout: "private-doc"
url: "/tallers/[slug]/privat/doc/"
course_ref: "[slug]"
image: "/images/tallers/[slug].jpg"
noindex: true
sitemap:
  disable: true
robots: "noindex, nofollow"
draft: true
---
```

Seguit del contingut en Markdown (sense H1 — el layout ja el posa). Estructura recomanada:

```markdown
## Introducció

Per què és important aquest procés. Connexió amb el que s'ha fet al taller.

## [Context / Història / Teoria]

Antecedents, context històric o bases teòriques del procés.

## Procediment pas a pas

### 1. Primer pas
...

### 2. Segon pas
...

## Consells pràctics

- **Consell 1:** explicació
- **Consell 2:** explicació

## Taula de referència

| Variable | Valor estàndard | Notes |
|----------|----------------|-------|
| Temperatura | 20 °C | ... |
| Temps | 12 min | ... |

*Notes o advertències al peu.*

## Per continuar aprenent

- [Recurs extern](URL) — descripció breu
```

---

### 3.3 Publicar el doc

Quan el contingut estigui revisat i correcte:

1. Canvia `draft: true` → `draft: false` al fitxer `[slug]-doc.md`
2. Commit i deploy:
   ```bash
   git add content/ca/privat/[slug]-doc.md
   git commit -m "feat: doc privat [slug] — publicat"
   git push origin develop
   # Revisar staging, llavors:
   git checkout main && git merge develop && git push origin main
   hugo --minify --baseURL "https://llumatics.com/"
   rsync -avz --delete --exclude 'admin/' public/ llumatics@vl28359.dinaserver.com:www/
   git checkout develop
   ```

---

### 3.4 Verificar que tot funciona

Un cop desplegat, pots provar-ho directament sense passar pel formulari Brevo:

```
https://llumatics.com/tallers/[slug]/privat/doc/?nom=Joan+Puig&taller=[slug]&lang=ca
```

Hauries de veure:
- El document amb el nom "Joan Puig" al capçal
- El contingut del taller
- El certificat amb el nom i la data d'avui
- El botó "Imprimeix / Desa com a PDF"

---

### 3.5 Estructura de fitxers — resum visual

```
content/
├── ca/privat/
│   ├── _index.md                        ← secció (noindex, no tocar)
│   ├── [slug].md                        ← form page CA
│   └── [slug]-doc.md                    ← documentació CA (draft: true fins revisar)
├── es/privat/
│   ├── _index.md
│   └── [slug].md                        ← form page ES
└── en/privat/
    ├── _index.md
    └── [slug].md                        ← form page EN
```

Les pàgines privades **no apareixen a cap menú ni sitemap**. L'accés és només per qui coneix la URL.

---

---

## Referència ràpida — slugs de tallers actius

| Slug | Taller | Bloc |
|------|--------|------|
| `fonaments-iniciacio-puntual` | Iniciació a la fotografia analògica | fonaments |
| `digitalitzacio-escaner` | Digitalització i escàner | fonaments |
| `edicio-imatges-fotoquimiques` | Del negatiu a la imatge (edició digital) | fonaments |
| `revelat-bn` | Revelat en blanc i negre | proces |
| `revelat-color-bn` | Revelar color com si fos blanc i negre | proces |
| `revelat-i-positivat` | Revelat + positivat en un dia | proces |
| `introduccio-al-positivat` | Introducció al positivat | proces |
| `copies-en-paper` | Còpies en paper | proces |
| `copies-beers-developer` | Còpies amb Beers Developer | proces |
| `reveladors-artesanals` | Reveladors artesanals | proces |
| `revelats-experimentals` | Revelats experimentals | proces |
| `guinneol` | Guinneol: revela amb cervesa Guinness | processos-alternatius |
| `cianotipia` | Cianotípia | processos-alternatius |
| `fotogrames-cianotipia` | Fotogrames amb cianotípia | processos-alternatius |
| `fotografia-estenopeica` | Fotografia estenopèica | processos-alternatius |
| `fotografia-de-carrer` | Fotografia de carrer | practica |
| `tutoria-fotografica` | Tutoria fotogràfica | practica |
| `retrat-analogic` | Retrat analògic | practica |
| `retrat-6x6` | Retrat en mig format 6×6 | mig-format |
| `retrat-amb-holga` | Retrat amb Holga | mig-format |
| `hasselblad-500` | El meravellós món Hasselblad | mig-format |
| `introduccio-gran-format` | Introducció al gran format | gran-format |
| `gran-format-4x5` | Gran format 4×5 polzades | gran-format |
| `retrat-gran-format` | Retrat en gran format (C&F) | gran-format |
| `iniciacio-revelat` | Iniciació al revelat (C&F) | proces |
