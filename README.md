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
title: "Nom del taller"
subtitle: "Una línia descriptiva"
lead: "1-2 frases per a les cards i xarxes socials."
blocs:
  - proces          # fonaments | proces | practica | mig-format | gran-format | processos-alternatius
levels:
  - iniciacio       # iniciacio | intermedi | avançat
formats:
  - puntual         # puntual | curs | intensiu | personalitzat
duration: "4 hores"
price: 85
max_places: 4
location: "Nau Bostik, Barcelona"
extern: false
```

**Tallers de Cameras & Films:** posar `extern: true`. Aquests tallers els programa i gestiona directament Cameras & Films; la web mostra un avís i envia a la seva agenda. Els tallers interns de Llumàtics són tots **sota demanda**: l'alumne escriu i es busca una data.

### 3. Imatges

#### Imatge principal
- Ruta: `static/images/tallers/[slug].jpg`
- Format: JPG, ratio **3:2** (recomanat 1200×800px)
- Nom de fitxer: igual que el slug del taller (`revelat-bn.jpg`)

```yaml
# Al frontmatter:
image: "/images/tallers/revelat-bn.jpg"
```

#### Imatges secundàries (galeria)
- Rutes: `static/images/tallers/[slug]-1.jpg`, `[slug]-2.jpg`, etc.
- Apareixen com a galeria en graella sota el contingut principal
- Màxim recomanat: 6 imatges per no sobrecarregar la pàgina

```yaml
# Al frontmatter:
images:
  - "/images/tallers/revelat-bn-1.jpg"
  - "/images/tallers/revelat-bn-2.jpg"
  - "/images/tallers/revelat-bn-3.jpg"
```

#### Criteris de qualitat per a les imatges
- Fotos del taller en acció (alumnes treballant, no posant)
- Primeres en plans de detall: mans en la química, negatiu a contrallum, ampliadora encesa
- B/N preferible per a tallers de laboratori; color per als de carrer i retrat
- Sense marques d'aigua ni text sobreimposat
- Comprimits a menys de 500KB per imatge

### 4. Contingut

L'estructura recomanada del cos del fitxer:

```markdown
## Títol evocador (no "Descripció")

Paràgraf d'entrada: el "per què" del taller, no el "què".

## Continguts clau

- Item 1
- Item 2

## Inclòs en el preu

- Material 1
- Material 2

## Cal portar

- Cosa 1

## No inclòs

- Cosa extra (disponible a Llumàtics, preu)
```

### 5. Fitxa pedagògica

Els camps `objective`, `methodology`, `result`, `prerequisites` i `target` del frontmatter apareixen automàticament com a "Fitxa del taller" al final del contingut. No cal repetir-los al cos del text.

### 6. Tallers relacionats

El camp `related` accepta un array de slugs. Apareixen com a "Continua aprenent" amb enllaç directe:

```yaml
related:
  - revelat-bn
  - copies-en-paper
```

### 7. Publicar

```yaml
draft: false    # canviar de true a false
status: "soon"  # soon | active | full
```

---

## Crear una entrada d'agenda

Les entrades d'agenda són sessions concretes amb data d'un taller existent.

```bash
hugo new content ca/agenda/revelat-bn-cameras-films-maig-2026.md
```

```yaml
---
title: "Revelat bàsic de pel·lícula B/N"
course_ref: "revelat-bn"          # slug del taller relacionat
date_start: "2026-05-09"
time_start: "10:00"
time_end: "14:00"
location: "Cameras & Films, Barcelona"
organizer: "Cameras & Films"       # si no és Llumàtics qui organitza
duration: "3 hores"
price: 55
max_places: 10
status: "active"
purchase_url: "https://..."        # si hi ha compra directa (Square, etc.)
draft: false
---
```

**Nota important:** Els tallers de Cameras & Films tenen el seu propi sistema de dates i venda. Les entrades d'agenda de C&F porten sempre `purchase_url` amb el link de compra de la botiga.

---

## Crear un post de blog

```bash
# Crear manualment a:
content/ca/blog/nom-del-post.md
```

```yaml
---
title: "Títol del post"
lead: "1-2 frases de resum"
description: "Descripció SEO"
image: "/images/blog/nom-del-post.jpg"
date: 2026-04-19
tags: ["revelat", "laboratori"]
course_ref: "revelat-bn"    # opcional: vincula al taller relacionat
draft: true
---
```

**Tipus de posts recomanats:**
- Crònica d'un taller acabat (fotos incloses)
- Article tècnic sobre un procés
- Notícia d'un nou taller o col·laboració

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
│   ├── revelat-bn-3.jpg
│   ├── copies-en-paper.jpg
│   └── ...
├── blog/
│   ├── revelat-bn-primera-sessio.jpg
│   └── ...
└── espais/
    ├── laboratori.jpg
    ├── plato.jpg
    └── ...
```

---

## Lògica de tallers: sota demanda vs. Cameras & Films

| | Tallers Llumàtics | Tallers Cameras & Films |
|--|--|--|
| `extern` | `false` | `true` |
| Qui gestiona les dates | Joan (sota demanda) | Cameras & Films |
| CTA a la web | "Sol·licita una data" + email | "Consulta C&F" + IG link |
| Compra | Email a Llumàtics | Plataforma de C&F (Square) |
| Preu habitual | 65–165€ | 55€ (fins a 10 persones) |

**Tots els tallers de Llumàtics funcionen sota demanda:** l'alumne escriu, es mira la disponibilitat i es confirma una data. No hi ha calendari fix publicat (excepte els de C&F).

---

## Multilingüisme

- Contingut per defecte: **CA** (`content/ca/`)
- Contingut en castellà: `content/es/` (duplicar i traduir)
- Contingut en anglès: `content/en/`
- Traduccions d'interfície: `themes/llumatics/i18n/ca.yaml`, `es.yaml`, `en.yaml`

---

## Comandes útils

```bash
hugo server -D                          # servidor local amb drafts
hugo --minify                           # build de producció
hugo new content ca/tallers/slug/index.md   # nou taller
hugo new content ca/agenda/slug.md      # nova entrada d'agenda
./sync-llumatics.sh                     # menú interactiu de deploy
```

---

## Tallers actuals (20 tallers)

| Slug | Bloc | Preu | Durada | Extern |
|------|------|------|--------|--------|
| `fotogrames-cianotipia` | processos-alternatius | Gratuït | 2h | — |
| `introduccio-al-positivat` | proces | 65€ | 3h | — |
| `tutoria-fotografica` | practica | 70€ | 2-4h | — |
| `camera-i-exposicio` | fonaments | 75€ | 4h | — |
| `fotografia-estenopèica` | fonaments | 80€ | 4h | — |
| `copies-en-paper` | proces | 85€ | 4h | — |
| `retrat-analogic` | practica | 85€ | 4h | — |
| `digitalitzacio-escaner` | proces | 85€ | 4h | — |
| `introduccio-gran-format` | gran-format | 95€ | 4h | — |
| `retrat-gran-format` | gran-format | 95€ | 4h | ✓ C&F |
| `fotografia-de-carrer` | practica | 99€ | 3,5h | — |
| `hasselblad-500` | mig-format | 110€ | 3,5h | — |
| `retrat-6x6` | mig-format | 110€ | 4h | — |
| `iniciacio-revelat` | proces + fonaments | 55€ | 3h | ✓ C&F |
| `revelat-bn` | proces | 150€ | 4h | — |
| `revelat-i-positivat` | proces | 125€ | 8h | — |
| `cianotipia` | processos-alternatius | 129€ | 8h | — |
| `revelats-experimentals` | proces | 130€ | 8h | — |
| `reveladors-artesanals` | processos-alternatius | 140€ | 8h | — |
| `gran-format-4x5` | gran-format | 150€ | 8h | — |
| `carrer-i-mirada` | practica | 350€ | 4 sessions | — |
