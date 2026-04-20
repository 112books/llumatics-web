# Llumàtics — Web

Web oficial de [Llumàtics](https://llumatics.com), escola de fotografia a Barcelona.  
Construïda amb **Hugo** (static site generator) i un tema custom sense frameworks.

---

## Entorns

| Entorn | URL | Branca | Com desplegar |
|--------|-----|--------|---------------|
| Local | `http://localhost:1313` | qualsevol | `hugo server -D` |
| Staging | `https://112books.github.io/llumatics-web` | `develop` | `git push origin develop` |
| Producció | `https://llumatics.com` | `main` | `git push origin main` |

```bash
# Servidor local amb drafts visibles
hugo server -D

# Build de producció (sense drafts)
hugo --minify
```

---

## Crear un nou taller

### 1. Crear el fitxer

```bash
hugo new content ca/tallers/nom-del-taller/index.md
```

Això genera el fitxer a partir de `archetypes/tallers.md` amb tots els camps predefinits.

### 2. Omplir el frontmatter

Camps obligatoris:

```yaml
title: "Títol suggerent i atractiu"
subtitle: "Una línia descriptiva"
lead: "1-2 frases per a les cards i xarxes socials."
description: "Descripció SEO (màx. 155 caràcters)"
image: "/images/tallers/slug-del-taller.jpg"

# Classificació
tipus: "taller"         # taller | curs
canal: "llumatics"      # llumatics | externs | institucions
blocs:
  - proces              # fonaments | proces | practica | mig-format | gran-format | processos-alternatius
nivell: "Iniciació"     # Iniciació | Intermedi | Avançat | Tots els nivells
estat: "actiu"          # actiu | en-preparacio | idea

# Fitxa tècnica
preu_1: 220             # Preu per 1 alumne (€, sense IVA — formació exempta)
preu_2: 125             # Preu per persona si venen 2
preu_3: 94              # Preu per persona si venen 3
preu_4: 79              # Preu per persona si venen 4
durada_hores: 4
lloc: "Llumàtics — Nau Bostik, La Sagrera, Barcelona"
max_places: 4
sota_demanda: true

# Fitxa pedagògica (apareix automàticament a la pàgina)
objective: "..."
methodology: "..."
result: "..."
prerequisits: "..."
target: "..."

# Tallers relacionats (apareixen com a "Continua aprenent")
continua_aprenent:
  - slug-taller-1
  - slug-taller-2

tags: []
draft: true
```

**Per a tallers de Cameras & Films** (`canal: externs`):
```yaml
canal: "externs"
extern: true
extern_location: "Cameras & Films (c/ Tallers, Barcelona)"
sota_demanda: false
```

**Per a tallers ideals per a institucions** (centres cívics, instituts, centres d'art):
```yaml
ideal_institucions: true
preu_institucions: "A convenir segons assistència"
```

---

### 3. Fórmula de preus

Base de càlcul: **50€/hora + 20€ de cost fix per persona** (refrigeri, espai, despeses mínimes).

```
cost_base = (durada_hores × 50) + 20

preu_1 = cost_base
preu_2 = round((cost_base × 1.14) / 2)
preu_3 = round((cost_base × 1.28) / 3)
preu_4 = round((cost_base × 1.43) / 4)
```

Exemple per a un taller de 4 hores:
```
cost_base = (4 × 50) + 20 = 220€
preu_1 = 220€  /  preu_2 = 125€  /  preu_3 = 94€  /  preu_4 = 79€
```

La card del taller mostra "des de Xè" (el `preu_4`, el més econòmic per participant).  
Els preus no porten IVA — l'activitat de formació n'està exempta (art. 20.1.9 LIVA).  
Si el client necessita factura, s'indica a les FAQ generals del web.

**Casos especials fora de la fórmula:**
- `tutoria-fotografica` — 120€/sessió de 2h (1 persona). Ampliable a 4h per 220€.
- `revelat-i-positivat` — 375€/persona (paquet 2×1, preu arrodonit).
- `carrer-i-mirada` — curs de 4 sessions, calculat per bloc de 4×4h.
- Tallers `externs` — preu fixat per Cameras & Films (habitualment 55€, fins a 10 persones).

---

### 4. Imatges

#### Imatge principal
- Ruta: `static/images/tallers/[slug].jpg`
- Format: JPG o WebP, ratio **3:2** (recomanat 1200×800px, màx. 500KB)
- Nom de fitxer: igual que el slug del taller

```yaml
image: "/images/tallers/revelat-bn.jpg"
```

#### Imatges secundàries (galeria)
- Rutes: `static/images/tallers/[slug]-1.jpg`, `[slug]-2.jpg`, etc.
- Apareixen com a galeria en graella sota el contingut principal
- Màxim recomanat: 6 imatges

```yaml
images:
  - "/images/tallers/revelat-bn-1.jpg"
  - "/images/tallers/revelat-bn-2.jpg"
```

#### Criteris de qualitat
- Fotos del taller en acció (alumnes treballant, no posant)
- Primers plans de detall: mans en la química, negatiu a contrallum, ampliadora encesa
- B/N preferible per a tallers de laboratori; color per als de carrer i retrat
- Sense marques d'aigua ni text sobreimposat
- Comprimits a menys de 500KB per imatge

---

### 5. Contingut (cos del fitxer)

L'estructura recomanada:

```markdown
## Títol evocador (no "Descripció")

Paràgraf d'entrada: el "per què" del taller, no el "què".

## Continguts clau

- Item 1
- Item 2

## Inclòs en el preu

- Refrigeri (cafè o te i fruita)
- Material específic
- Ús del laboratori / plató

## Cal portar

- Cosa necessària (o "Res — tot el material es facilita")

## No inclòs

- Cosa extra disponible a Llumàtics (+preu)
```

La fitxa pedagògica (`objective`, `methodology`, `result`, `prerequisits`, `target`) apareix automàticament com a "Fitxa del taller" — no cal repetir-la al cos del text.

---

### 6. Material privat per a alumnes

Cada taller pot tenir una pàgina privada accessible només als alumnes que han fet el curs.

```bash
# Crear manualment:
content/ca/tallers/nom-del-taller/privat/index.md
```

```yaml
---
title: "Material per a alumnes — [Nom del taller]"
layout: "private"
course_ref: "slug-del-taller"
noindex: true
sitemap:
  disable: true
robots: "noindex, nofollow"
draft: false
---
```

**Flux de generació de PDF personalitzat:**
1. Alumne accedeix a `/tallers/[slug]/privat/`
2. Omple formulari Tally (nom + email + opt-in newsletter)
3. Make.com genera un PDF amb el nom de l'alumne al peu i l'envia per email
4. El contacte s'afegeix a Brevo amb el tag del curs

---

### 7. Estats i visibilitat

| `estat` | `draft` | Visible al web |
|---------|---------|----------------|
| `actiu` | `false` | Sí |
| `en-preparacio` | `true` | No |
| `idea` | `true` | No |

---

### 8. Publicar

```yaml
estat: "actiu"
draft: false
```

Push a `develop` → staging → revisar → merge a `main` → producció.

---

## Crear una entrada d'agenda

Les entrades d'agenda són sessions concretes amb data d'un taller existent.

```bash
hugo new content ca/agenda/revelat-bn-cameras-films-maig-2026.md
```

```yaml
---
title: "Revelat bàsic de pel·lícula B/N"
course_ref: "revelat-bn"
date_start: "2026-05-09"
time_start: "10:00"
time_end: "14:00"
lloc: "Cameras & Films, Barcelona"
preu_1: 55
max_places: 10
status: "active"
purchase_url: "https://..."
draft: false
---
```

Els tallers de Cameras & Films porten sempre `purchase_url` amb el link de compra.

---

## Crear un post de blog

```bash
content/ca/blog/nom-del-post.md
```

```yaml
---
title: "Títol del post"
lead: "1-2 frases de resum"
description: "Descripció SEO"
image: "/images/blog/nom-del-post.jpg"
date: 2026-04-20
tags: ["revelat", "laboratori"]
course_ref: "revelat-bn"    # opcional: vincula al taller relacionat
draft: true
---
```

**Imatges de blog:** `static/images/blog/[slug].jpg` (ratio 3:2, 1200×800px)

---

## Estructura de carpetes d'imatges

```
static/images/
├── llumatics-logo.svg
├── tallers/
│   ├── revelat-bn.jpg           ← imatge principal
│   ├── revelat-bn-1.jpg         ← galeria secundària
│   ├── revelat-bn-2.jpg
│   ├── copies-en-paper.jpg
│   └── ...
├── blog/
│   └── ...
└── espais/
    ├── laboratori.jpg
    ├── plato.jpg
    └── ...
```

---

## Canals de tallers

| Canal | `canal` | Qui gestiona les dates | CTA al web | `sota_demanda` |
|-------|---------|----------------------|------------|----------------|
| Llumàtics | `llumatics` | Joan, sota demanda | "Sol·licita una data" | `true` |
| Cameras & Films | `externs` | Cameras & Films | "Consulta C&F" + IG | `false` |
| Institucions | `institucions` | Joan, a convenir | "Contacta'ns" | `true` |

Els tallers de Llumàtics no tenen calendari fix publicat. L'alumne escriu, es mira disponibilitat i es confirma data. Els de C&F es gestionen externament — la web mostra avís i redirigeix.

---

## Multilingüisme

- Contingut per defecte: **CA** (`content/ca/`)
- Castellà: `content/es/` — duplicar i traduir
- Anglès: `content/en/`
- Traduccions d'interfície: `themes/llumatics/i18n/ca.yaml`, `es.yaml`, `en.yaml`
- Prioritat: consolidar CA primer. ES i EN en fase posterior.

---

## Comandes útils

```bash
hugo server -D                              # servidor local amb drafts
hugo --minify                               # build de producció
hugo new content ca/tallers/slug/index.md   # nou taller
hugo new content ca/agenda/slug.md          # nova entrada d'agenda
hugo list all                               # llistat de tot el contingut
hugo --templateMetricsHints                 # verificar build sense errors
./sync-llumatics.sh                         # menú interactiu de deploy
```

---

## Tallers actuals (21 tallers)

| Slug | Bloc | preu_1 | preu_4 | Hores | Canal | Estat |
|------|------|--------|--------|-------|-------|-------|
| `fonaments-iniciacio-puntual` | fonaments | 220€ | 79€ | 4h | llumatics | actiu |
| `revelat-bn` | proces | 220€ | 79€ | 4h | llumatics | actiu |
| `copies-en-paper` | proces | 220€ | 79€ | 4h | llumatics | actiu |
| `retrat-analogic` | practica | 220€ | 79€ | 4h | llumatics | actiu |
| `digitalitzacio-escaner` | proces | 220€ | 79€ | 4h | llumatics | actiu |
| `fotografia-estenopeica` | fonaments | 220€ | 79€ | 4h | llumatics | actiu |
| `introduccio-gran-format` | gran-format | 220€ | 79€ | 4h | llumatics | actiu |
| `retrat-6x6` | mig-format | 220€ | 79€ | 4h | llumatics | actiu |
| `fotografia-de-carrer` | practica | 195€ | 70€ | 3.5h | llumatics | actiu |
| `hasselblad-500` | mig-format | 195€ | 70€ | 3.5h | llumatics | actiu |
| `introduccio-al-positivat` | proces | 170€ | 61€ | 3h | llumatics | actiu |
| `fotogrames-cianotipia` | processos-alternatius | 120€ | 43€ | 2h | llumatics | actiu |
| `tutoria-fotografica` | practica | 120€ | — | 2h | llumatics | actiu |
| `revelat-i-positivat` | proces | 375€ | 134€ | 8h | llumatics | actiu |
| `revelats-experimentals` | proces | 420€ | 150€ | 8h | llumatics | actiu |
| `reveladors-artesanals` | processos-alternatius | 420€ | 150€ | 8h | llumatics | actiu |
| `cianotipia` | processos-alternatius | 420€ | 150€ | 8h | llumatics | actiu |
| `gran-format-4x5` | gran-format | 420€ | 150€ | 8h | llumatics | actiu |
| `iniciacio-revelat` | proces + fonaments | 170€ | 61€ | 3h | externs (C&F) | actiu |
| `retrat-gran-format` | gran-format + practica | 220€ | 79€ | 4h | externs (C&F) | actiu |
| `carrer-i-mirada` | practica | 880€ | 315€ | 16h | llumatics | en-preparacio |