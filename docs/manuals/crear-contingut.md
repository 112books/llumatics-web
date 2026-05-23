# Manual ràpid — Crear contingut a Llumàtics

---

## 1. Crear un nou taller

### Pas 1 — Crear el fitxer

```bash
hugo new content ca/tallers/nom-del-taller/index.md
```

Substitueix `nom-del-taller` pel slug (tot en minúscules, sense accents, paraules separades per `-`).  
Exemple: `revelat-color-bn`, `fotografia-estenopeica`, `retrat-6x6`

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

Obre el fitxer creat i omple tots els camps:

```yaml
---
title: "Títol atractiu i suggerent"
lead: "Una frase que enganxi, per a cards i xarxes."
description: "SEO — màx. 155 caràcters."
image: "/images/tallers/nom-del-taller.jpg"

tipus: "taller"
canal: "llumatics"          # llumatics | externs | institucions
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

prerequisits: "Cap"         # o descripció dels coneixements necessaris

continua_aprenent: []       # slugs d'altres tallers relacionats

tags: []
draft: true
---
```

---

### Pas 4 — Escriure el contingut

Segueix aquest ordre al cos del document:

1. **Per què fer aquest taller** — motivació, context
2. **Continguts** — llista de què s'aprendrà
3. **Inclòs en el preu** — materials, químics, etc.
4. **Cal portar** — el que ha de portar l'alumne
5. **No inclòs** — per evitar malentesos

---

### Pas 5 — Afegir la imatge

Copia la imatge a:
```
static/images/tallers/nom-del-taller.jpg
```
Format: jpg/webp · Mida: 1200×800px · Màx. 500KB

---

### Pas 6 — Publicar

Quan el taller estigui llest:

1. Canvia al frontmatter: `draft: false` i `estat: "actiu"`
2. Puja a staging per revisar:
   ```bash
   git add .
   git commit -m "feat: nou taller nom-del-taller"
   git push origin develop
   ```
3. Revisa a `https://112books.github.io/llumatics-web`
4. Si tot va bé, desplega a producció:
   ```bash
   git checkout main
   git merge develop
   git push origin main
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

> **Important:** el `course_ref` ha de ser exactament el slug del taller (la carpeta a `content/ca/tallers/`). Si no coincideix, l'agenda no pot recuperar les dades del taller.

---

### Pas 3 — Publicar

```bash
git add .
git commit -m "feat: agenda revelat-bn juny-2026"
git push origin main
hugo --minify --baseURL "https://llumatics.com/"
rsync -avz --delete --exclude 'admin/' public/ llumatics@vl28359.dinaserver.com:www/
```

---

## Referència ràpida de slugs de tallers actius

| Slug | Taller |
|------|--------|
| `fonaments-iniciacio-puntual` | Fonaments de fotografia |
| `revelat-bn` | Revelat en blanc i negre |
| `revelat-color-bn` | Revelar color com si fos blanc i negre |
| `copies-en-paper` | Còpies en paper |
| `revelat-i-positivat` | Revelat i positivat |
| `introduccio-al-positivat` | Introducció al positivat |
| `revelats-experimentals` | Revelats experimentals |
| `reveladors-artesanals` | Reveladors artesanals |
| `guinneol` | Guinneol |
| `copies-beers-developer` | Còpies amb Beers Developer |
| `digitalitzacio-escaner` | Digitalització amb escàner |
| `fotografia-estenopeica` | Fotografia estenopeica |
| `fotogrames-cianotipia` | Fotogrames i cianotípia |
| `cianotipia` | Cianotípia |
| `retrat-analogic` | Retrat analògic |
| `retrat-6x6` | Retrat 6×6 |
| `hasselblad-500` | Hasselblad 500 |
| `introduccio-gran-format` | Introducció al gran format |
| `gran-format-4x5` | Gran format 4×5 |
| `retrat-gran-format` | Retrat en gran format (C&F) |
| `iniciacio-revelat` | Iniciació al revelat (C&F) |
| `fotografia-de-carrer` | Fotografia de carrer |
| `tutoria-fotografica` | Tutoria fotogràfica |
