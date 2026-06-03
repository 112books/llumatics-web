# Disseny: Instagram — Perfil i promoció automàtica de tallers

**Data:** 2026-05-30  
**Estat:** Aprovat

---

## Objectiu

Convertir el compte d'Instagram de Llumàtics en l'eina principal de promoció de tallers:
1. Perfil optimitzat com a reflex del web i de l'escola.
2. Sistema automatitzat que genera i programa 3 posts per cada taller nou publicat, amb revisió manual abans de publicar.

---

## Part 1 — Optimització del perfil (tasca única)

### Foto de perfil
Logo de Llumàtics, quadrat, llegible en rodó a 40px.

### Nom del compte
`Llumàtics` (amb accent).

### Bio (màx. 150 caràcters)
```
Escola de fotografia fotoquímica · Barcelona
Revelat, positivat i processos alternatius
Nau Bostik, La Sagrera
llumatics.com
```

### Enllaç a la bio
`llumatics.com` — URL directa, sense intermediaris.

### Highlights
Carpetes d'històries fixades, organitzades per àmbit:
- `Fonaments` · `Revelat` · `Positivat` · `Processos` · `Tallers` · `Espai`

Els highlights es creen manualment des de l'app un cop hi hagi stories publicades (mínim 1 story per highlight). Tasca manual, única.

---

## Part 2 — Sistema de promoció automatitzada

### Estratègia de contingut

3 posts per cada taller nou publicat al web:

| Post | Quan | Imatge | Contingut |
|------|------|--------|-----------|
| 1 — Anunci | 2h després del push a main | `image` principal | Títol + lead + data/lloc + CTA |
| 2 — Procés | 7 dies abans de la data del taller* | `images[0]` | Continguts del taller + data |
| 3 — Recordatori | 2 dies abans de la data del taller* | `images[1]` o `image` | Urgència + data + CTA |

*Si no hi ha entrada d'agenda en el moment de publicar el taller, els Posts 2 i 3 es generen quan s'afegeix l'entrada d'agenda (`content/ca/agenda/`). Un segon trigger fa el mateix Make.com amb les dates.

**Idioma:** Català.  
**To:** Directe, sec, sense emojis. Coherent amb el Tone of Voice del web.  
**Preu:** No s'inclou als posts — l'objectiu és portar al web, on la persona veu el preu en context amb tots els tallers.

### Templates de captions

**Post 1 — Anunci**
```
[TITLE]

[LEAD]

[DURADA_HORES]h · [LLOC]
Màxim [MAX_PLACES] persones · Sota demanda

Tots els detalls i reserves a la bio.

#llumatics #fotografiaanalogica #barcelona #[BLOC] #tallersfotografia
```

Per a tallers externs (canal: externs), substituir l'última línia del cos per:
```
[DURADA_HORES]h · [LLOC]
[DATA_TALLER]

llumatics.com/tallers/[SLUG]/
```

**Post 2 — Procés**
```
Això faràs.

[CONTINGUT_1]
[CONTINGUT_2]
[CONTINGUT_3]

[DATA_TALLER] a Barcelona.
Places limitades — [MAX_PLACES] persones màxim.

Reserves a la bio.

#llumatics #[BLOC] #[TAGS] #barcelona
```

**Post 3 — Recordatori**
```
[TITLE] · [DATA_TALLER]

Queden 2 dies.

Màxim [MAX_PLACES] persones.
Si t'interessa, ara és el moment.

llumatics.com/tallers/[SLUG]/

#llumatics #fotografiaanalogica #barcelona
```

### Hashtags per bloc

| Bloc | Hashtags addicionals |
|------|---------------------|
| fonaments | #iniciaciorevelat #analogica |
| proces | #revelat #darkroom #argentique |
| positivat | #positivat #ampliadora #darkroom |
| processos-alternatius | #cianotipia #processosal ternatius #alternativeprocess |
| gran-format | #granformat #largeformat #4x5 |
| practica | #retrat #portrait #analogica |

---

## Arquitectura tècnica

### Flux complet

```
Push a main (branca principal)
  → GitHub Action detecta fitxers nous a content/ca/tallers/
  → Llegeix frontmatter del taller nou (title, lead, image, images[], 
    durada_hores, max_places, lloc, blocs, slug, sota_demanda)
  → Webhook POST a Make.com amb les dades + URL de la imatge principal
  → Make.com:
      1. Genera els 3 captions amb els templates
      2. Descarrega les imatges des de llumatics.com
      3. Crida Instagram Graph API:
         - Crea Media Container (imatge + caption)
         - Programa la publicació (Post 1: +2h, Posts 2 i 3: si hi ha data d'agenda)
      4. Envia email a hola@llumatics.com amb preview dels 3 posts
  → Usuari revisa a Meta Business Suite
  → Posts es publiquen sols a l'hora programada
```

Trigger secundari (quan s'afegeix entrada d'agenda):
```
Push a main amb fitxer nou a content/ca/agenda/
  → GitHub Action detecta l'entrada nova
  → Llegeix course_ref + date_start
  → Webhook a Make.com → programa Posts 2 i 3
```

### Components

| Component | Eina | Cost |
|-----------|------|------|
| Trigger | GitHub Actions | Gratuït |
| Orquestració | Make.com (escenari existent) | Free tier (1.000 ops/mes) |
| Publicació | Instagram Graph API | Gratuït |
| Revisió | Meta Business Suite | Gratuït |
| Notificació | Email via Make.com | Inclòs |

### Prerequisits tècnics

1. **Meta Developer App** — creada a developers.facebook.com, tipus "Business".
2. **Token d'accés de llarga durada** (~60 dies). Cal renovar-lo o automatitzar la renovació.
3. **Instagram Business Account** — ja confirmat.
4. **Pàgina de Facebook** associada al compte d'Instagram — ja confirmada.
5. **Token guardat com a secret** a GitHub (`INSTAGRAM_TOKEN`, `INSTAGRAM_USER_ID`) i a Make.com.

### Limitacions conegudes

- Instagram Graph API no té "esborrany" natiu — els posts programats es poden editar/cancel·lar des de Meta Business Suite abans de la publicació.
- El token de 60 dies s'ha de renovar manualment o via Make.com (HTTP request de renovació).
- Make.com free tier: 1.000 operacions/mes. Per a Llumàtics (freqüència baixa de tallers) és suficient.
- Mida mínima d'imatge per Instagram: 320px. Les imatges del web (1200×800px) compleixen el requisit.

---

## Pilot manual — Taller 13 de juny

Mentre es construeix el sistema, els 3 posts del taller "Iniciació al revelat" (Cameras & Films, 13 de juny 2026) es publiquen manualment a Meta Business Suite:

| Post | Data programada | Imatge |
|------|----------------|--------|
| Anunci | 30 de maig 2026 | `iniciacio-revelat.jpg` |
| Procés | 6 de juny 2026 | `iniciacio-revelat-1.jpg` |
| Recordatori | 11 de juny 2026 | `iniciacio-revelat-2.jpg` |

Els textos dels 3 posts estan definits a la conversa de disseny (2026-05-30).

---

## Fora d'abast (aquest disseny)

- Stories d'Instagram (format diferent, gestió manual recomanada)
- Reels o vídeos
- Altres xarxes socials (Facebook, TikTok, LinkedIn)
- Resposta automàtica a comentaris
- Analítica d'Instagram
