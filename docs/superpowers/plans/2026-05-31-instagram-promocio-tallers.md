# Instagram — Perfil i Promoció Automàtica de Tallers

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatitzar la publicació de 3 posts d'Instagram per cada taller nou, amb revisió via Meta Business Suite abans de publicar.

**Architecture:** GitHub Action detecta tallers nous al push a `main` i envia les dades a Make.com via webhook. Make.com genera els captions, crida l'Instagram Graph API per crear posts programats i envia un email de preview. L'usuari revisa i modifica si cal a Meta Business Suite.

**Tech Stack:** GitHub Actions · Python 3 · Make.com · Instagram Graph API v21.0 · Meta Business Suite

---

## Fitxers que es creen o modifiquen

| Fitxer | Acció | Responsabilitat |
|--------|-------|-----------------|
| `.github/workflows/deploy-production.yml` | Crear | Deploy automàtic a producció via rsync SSH |
| `.github/workflows/instagram-taller.yml` | Crear | Detecta taller nou → webhook Make.com |
| `.github/workflows/instagram-agenda.yml` | Crear | Detecta agenda nova → webhook Make.com |
| `hugo.toml` | No tocar | Cap canvi necessari |

Els escenaris de Make.com i la configuració de Meta Developer App són tasques UI manuals, sense fitxers al repositori.

---

## Task 1: Optimitzar el perfil d'Instagram (manual)

**Files:** Cap

- [ ] **Pas 1: Actualitza la bio**

Obre Instagram → Perfil → Editar perfil.

Posa exactament:
```
Escola de fotografia fotoquímica · Barcelona
Revelat, positivat i processos alternatius
Nau Bostik, La Sagrera
```
(L'enllaç va al camp "Lloc web" — vegeu el pas següent.)

- [ ] **Pas 2: Enllaç a la bio**

Al camp "Lloc web" (o "Enllaç extern" a la versió nova):
```
https://llumatics.com
```

- [ ] **Pas 3: Comprova la foto de perfil**

Ha de ser el logo de Llumàtics, llegible en rodó a 40px. Si no ho és, puja la versió quadrada del logo.

- [ ] **Pas 4: Crea els highlights (un cop tinguis stories)**

Els highlights es creen des de l'app: Perfil → Highlights → `+`. Crea'n un per cada àmbit:
- `Fonaments` · `Revelat` · `Positivat` · `Processos` · `Tallers` · `Espai`

Pots fer-ho ara (quedaran buits fins que hi afegeixis stories) o quan publiquis les primeres.

---

## Task 2: Crear Meta Developer App (manual — ~30 min)

**Files:** Cap

- [ ] **Pas 1: Crea l'app a Meta for Developers**

Obre `https://developers.facebook.com/apps/` → "Create App".

Configuració:
- Use case: **Other**
- App type: **Business**
- App name: `Llumatics Instagram Publisher`
- App contact email: `hola@llumatics.com`
- Business account: selecciona el compte de Meta Business vinculat a Llumàtics

- [ ] **Pas 2: Afegeix el producte Instagram**

Al dashboard de l'app → "Add Product" → **Instagram Graph API** → Set Up.

- [ ] **Pas 3: Afegeix el compte d'Instagram com a tester**

A l'app → Instagram → API setup with Instagram Business Login → "Add Instagram testers" → afegeix el compte `llumatics`.

Obre Instagram → Configuració → App i llocs web → Sol·licituds pendents → Accepta la invitació.

- [ ] **Pas 4: Genera un token de curt termini amb Graph API Explorer**

Obre `https://developers.facebook.com/tools/explorer/`.

- Selecciona la teva app `Llumatics Instagram Publisher`
- "Generate Access Token"
- Afegeix els permisos: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`
- Copia el token (és vàlid ~1h, però el convertirem a llarg termini al Task 3)

- [ ] **Pas 5: Obté el teu Instagram User ID**

Al Graph API Explorer, fes aquesta crida GET:
```
GET /me/accounts
```

A la resposta, busca la Pàgina de Facebook associada i anota'n l'`id`. Després:
```
GET /{page-id}?fields=instagram_business_account
```

Anota el valor de `instagram_business_account.id` — aquest és el teu `INSTAGRAM_USER_ID`.

---

## Task 3: Obtenir token llarg termini i guardar secrets (manual)

**Files:** Cap. Els secrets van a GitHub → Settings → Secrets and variables → Actions.

- [ ] **Pas 1: Converteix el token a llarga durada (~60 dies)**

Al terminal (substitueix els valors):
```bash
curl -i -X GET "https://graph.facebook.com/v21.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={APP_ID}
  &client_secret={APP_SECRET}
  &fb_exchange_token={SHORT_LIVED_TOKEN}"
```

`APP_ID` i `APP_SECRET` els trobes a l'app → Settings → Basic.

Copia el `access_token` de la resposta.

- [ ] **Pas 2: Crea el webhook de Make.com**

Obre Make.com → Create a new scenario → afegeix un mòdul **Webhooks > Custom webhook** → Copy address.

Guarda aquesta URL — la necessitaràs al pas següent i al Task 6.

- [ ] **Pas 3: Guarda els secrets a GitHub**

Obre el repositori a GitHub → Settings → Secrets and variables → Actions → New repository secret.

Crea aquests 4 secrets:

| Nom del secret | Valor |
|----------------|-------|
| `INSTAGRAM_ACCESS_TOKEN` | El token de 60 dies del Pas 1 |
| `INSTAGRAM_USER_ID` | El ID obtingut al Task 2, Pas 5 |
| `MAKECOM_INSTAGRAM_TALLER_WEBHOOK` | URL del webhook Make.com (Pas 2) |
| `VPS_SSH_KEY` | Clau SSH privada per al VPS Dinahosting (vegeu Pas 4) |

- [ ] **Pas 4: Genera clau SSH per al deploy automàtic**

Al terminal:
```bash
ssh-keygen -t ed25519 -C "github-actions-llumatics" -f ~/.ssh/llumatics_deploy -N ""
```

Copia la clau pública al VPS:
```bash
ssh-copy-id -i ~/.ssh/llumatics_deploy.pub llumatics@vl28359.dinaserver.com
```

Verifica que funciona:
```bash
ssh -i ~/.ssh/llumatics_deploy llumatics@vl28359.dinaserver.com "echo OK"
```
Ha de respondre `OK`.

Copia el contingut de `~/.ssh/llumatics_deploy` (clau privada) i enganxa-la com a secret `VPS_SSH_KEY` a GitHub.

---

## Task 4: Crear workflow de deploy a producció

**Files:**
- Crear: `.github/workflows/deploy-production.yml`

Ara el deploy a producció és manual (rsync). Aquest workflow l'automatitza i servirà de trigger per als workflows d'Instagram.

- [ ] **Pas 1: Crea el fitxer**

```yaml
# .github/workflows/deploy-production.yml
name: Deploy → Producció

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-production
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: '0.159.0'
          extended: true

      - name: Build Hugo (producció)
        run: hugo --minify --baseURL "https://llumatics.com/"

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan vl28359.dinaserver.com >> ~/.ssh/known_hosts

      - name: Deploy via rsync
        run: |
          rsync -avz --delete \
            --exclude='admin/' \
            -e "ssh -i ~/.ssh/deploy_key" \
            public/ \
            llumatics@vl28359.dinaserver.com:www/
```

- [ ] **Pas 2: Commit**

```bash
git add .github/workflows/deploy-production.yml
git commit -m "feat: deploy automàtic a producció via GitHub Actions"
```

- [ ] **Pas 3: Verifica el deploy**

Fes push a `main` i comprova a GitHub → Actions que el workflow s'executa correctament i el site es manté accessible a llumatics.com.

---

## Task 5: Crear GitHub Action — detecció de taller nou

**Files:**
- Crear: `.github/workflows/instagram-taller.yml`

S'executa quan el deploy a producció completa. Detecta si hi ha tallers nous (fitxers `content/ca/tallers/*/index.md` afegits en aquest push amb `draft: false` i `estat: actiu`) i envia les dades a Make.com.

- [ ] **Pas 1: Crea el fitxer**

```yaml
# .github/workflows/instagram-taller.yml
name: Instagram — Nou taller

on:
  workflow_run:
    workflows: ["Deploy → Producció"]
    types: [completed]
    branches: [main]

jobs:
  notify:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Instal·la pyyaml
        run: pip install pyyaml

      - name: Detecta i envia tallers nous
        env:
          MAKECOM_WEBHOOK: ${{ secrets.MAKECOM_INSTAGRAM_TALLER_WEBHOOK }}
        run: |
          python3 << 'PYEOF'
          import os, re, json, urllib.request
          import yaml

          webhook_url = os.environ['MAKECOM_WEBHOOK']

          # Fitxers nous en aquest push (diff HEAD~1 HEAD)
          import subprocess
          result = subprocess.run(
              ['git', 'diff', '--name-only', '--diff-filter=A', 'HEAD~1', 'HEAD',
               '--', 'content/ca/tallers/*/index.md'],
              capture_output=True, text=True
          )
          # glob no expandeix dins git diff, cal filtrar manualment
          result2 = subprocess.run(
              ['git', 'diff', '--name-only', '--diff-filter=A', 'HEAD~1', 'HEAD'],
              capture_output=True, text=True
          )
          all_new = result2.stdout.strip().split('\n')
          taller_files = [
              f for f in all_new
              if re.match(r'content/ca/tallers/[^/]+/index\.md', f)
          ]

          if not taller_files:
              print("Cap taller nou detectat.")
              exit(0)

          for filepath in taller_files:
              if not os.path.exists(filepath):
                  continue

              with open(filepath, encoding='utf-8') as f:
                  content = f.read()

              # Extreu frontmatter YAML (entre els --- inicials)
              match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
              if not match:
                  print(f"No s'ha trobat frontmatter a {filepath}")
                  continue

              fm = yaml.safe_load(match.group(1))

              # Només tallers publicats i actius
              if fm.get('draft', True):
                  print(f"Saltat (draft): {filepath}")
                  continue
              if fm.get('estat') != 'actiu':
                  print(f"Saltat (estat={fm.get('estat')}): {filepath}")
                  continue

              # Slug = nom de la carpeta
              slug = filepath.split('/')[3]

              images = fm.get('images', [])
              payload = {
                  'slug': slug,
                  'title': fm.get('title', ''),
                  'lead': fm.get('lead', ''),
                  'image': f"https://llumatics.com{fm.get('image', '')}",
                  'image_1': f"https://llumatics.com{images[0]}" if len(images) > 0 else f"https://llumatics.com{fm.get('image', '')}",
                  'image_2': f"https://llumatics.com{images[1]}" if len(images) > 1 else f"https://llumatics.com{fm.get('image', '')}",
                  'durada_hores': fm.get('durada_hores', ''),
                  'max_places': fm.get('max_places', 4),
                  'lloc': fm.get('lloc', 'Nau Bostik, La Sagrera, Barcelona'),
                  'blocs': fm.get('blocs', []),
                  'sota_demanda': fm.get('sota_demanda', True),
                  'canal': fm.get('canal', 'llumatics'),
                  'url': f"https://llumatics.com/tallers/{slug}/",
              }

              data = json.dumps(payload).encode('utf-8')
              req = urllib.request.Request(
                  webhook_url, data=data,
                  headers={'Content-Type': 'application/json'}
              )
              urllib.request.urlopen(req)
              print(f"Webhook enviat per: {slug}")
          PYEOF
```

- [ ] **Pas 2: Commit**

```bash
git add .github/workflows/instagram-taller.yml
git commit -m "feat: GitHub Action detecta taller nou i notifica Make.com"
```

---

## Task 6: Crear GitHub Action — detecció d'agenda nova

**Files:**
- Crear: `.github/workflows/instagram-agenda.yml`

Quan s'afegeix una entrada d'agenda nova amb un taller existent, Make.com programa els Posts 2 i 3.

- [ ] **Pas 1: Crea el fitxer**

```yaml
# .github/workflows/instagram-agenda.yml
name: Instagram — Nova data agenda

on:
  workflow_run:
    workflows: ["Deploy → Producció"]
    types: [completed]
    branches: [main]

jobs:
  notify:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Instal·la pyyaml
        run: pip install pyyaml

      - name: Detecta i envia agenda nova
        env:
          MAKECOM_WEBHOOK: ${{ secrets.MAKECOM_INSTAGRAM_AGENDA_WEBHOOK }}
        run: |
          python3 << 'PYEOF'
          import os, re, json, urllib.request, yaml, subprocess

          webhook_url = os.environ.get('MAKECOM_WEBHOOK', '')
          if not webhook_url:
              print("MAKECOM_INSTAGRAM_AGENDA_WEBHOOK no configurat.")
              exit(0)

          result = subprocess.run(
              ['git', 'diff', '--name-only', '--diff-filter=A', 'HEAD~1', 'HEAD'],
              capture_output=True, text=True
          )
          all_new = result.stdout.strip().split('\n')
          agenda_files = [
              f for f in all_new
              if re.match(r'content/ca/agenda/[^/]+\.md', f)
              and not f.endswith('_index.md')
          ]

          if not agenda_files:
              print("Cap entrada d'agenda nova detectada.")
              exit(0)

          for filepath in agenda_files:
              if not os.path.exists(filepath):
                  continue

              with open(filepath, encoding='utf-8') as f:
                  content = f.read()

              match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
              if not match:
                  continue

              fm = yaml.safe_load(match.group(1))

              if fm.get('draft', False):
                  continue
              if fm.get('status') not in ('active', 'soon'):
                  continue

              course_ref = fm.get('course_ref', '')
              date_start = str(fm.get('date_start', ''))
              time_start = fm.get('time_start', '10:00')

              if not course_ref or not date_start:
                  print(f"Saltat (sense course_ref o date_start): {filepath}")
                  continue

              # Llegeix el taller per obtenir title i image
              taller_path = f"content/ca/tallers/{course_ref}/index.md"
              taller_title = course_ref
              taller_image_1 = ''
              taller_image_2 = ''
              taller_url = f"https://llumatics.com/tallers/{course_ref}/"

              if os.path.exists(taller_path):
                  with open(taller_path, encoding='utf-8') as tf:
                      tc = tf.read()
                  tm = re.match(r'^---\n(.*?)\n---', tc, re.DOTALL)
                  if tm:
                      tfm = yaml.safe_load(tm.group(1))
                      taller_title = tfm.get('title', course_ref)
                      imgs = tfm.get('images', [])
                      taller_image_1 = f"https://llumatics.com{imgs[0]}" if imgs else f"https://llumatics.com{tfm.get('image','')}"
                      taller_image_2 = f"https://llumatics.com{imgs[1]}" if len(imgs) > 1 else taller_image_1

              payload = {
                  'course_ref': course_ref,
                  'title': taller_title,
                  'date_start': date_start,
                  'time_start': time_start,
                  'lloc': fm.get('lloc', fm.get('location', 'Nau Bostik, La Sagrera, Barcelona')),
                  'max_places': fm.get('max_places', 4),
                  'image_1': taller_image_1,
                  'image_2': taller_image_2,
                  'url': taller_url,
              }

              data = json.dumps(payload).encode('utf-8')
              req = urllib.request.Request(
                  webhook_url, data=data,
                  headers={'Content-Type': 'application/json'}
              )
              urllib.request.urlopen(req)
              print(f"Webhook enviat per agenda: {course_ref} — {date_start}")
          PYEOF
```

- [ ] **Pas 2: Afegeix el secret de l'agenda webhook a GitHub**

Crea un segon escenari a Make.com (igual que el del Task 7 però per a l'agenda), copia la URL del webhook i afegeix-la com a secret `MAKECOM_INSTAGRAM_AGENDA_WEBHOOK` a GitHub.

- [ ] **Pas 3: Commit**

```bash
git add .github/workflows/instagram-agenda.yml
git commit -m "feat: GitHub Action detecta entrada d'agenda i notifica Make.com"
```

---

## Task 7: Crear escenari Make.com — Nou taller (UI)

**Files:** Cap (configuració Make.com)

Aquest escenari rep les dades del taller i crea els 3 posts programats a Instagram.

- [ ] **Pas 1: Crea l'escenari**

Make.com → Create a new scenario → nom: `Llumatics — Instagram Nou Taller`.

- [ ] **Pas 2: Afegeix el mòdul Webhook**

Afegeix: **Webhooks > Custom webhook** → "Add" → nom: `taller-nou` → Copy address.

Desa aquesta URL com a `MAKECOM_INSTAGRAM_TALLER_WEBHOOK` als secrets de GitHub (Task 3, Pas 3).

Fes clic a "Run once" i envia una petició de prova des del terminal per registrar l'estructura:
```bash
curl -X POST {WEBHOOK_URL} \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "revelat-bn",
    "title": "Revelat en B/N",
    "lead": "Aprèn a revelar els teus propis negatius pas a pas.",
    "image": "https://llumatics.com/images/tallers/revelat-bn.jpg",
    "image_1": "https://llumatics.com/images/tallers/revelat-bn-1.jpg",
    "image_2": "https://llumatics.com/images/tallers/revelat-bn-2.jpg",
    "durada_hores": 4,
    "max_places": 4,
    "lloc": "Nau Bostik, La Sagrera, Barcelona",
    "blocs": ["proces"],
    "sota_demanda": true,
    "canal": "llumatics",
    "url": "https://llumatics.com/tallers/revelat-bn/"
  }'
```

- [ ] **Pas 3: Afegeix mòdul "Set Multiple Variables" per al caption del Post 1**

Afegeix: **Tools > Set Multiple Variables**.

Crea la variable `caption_post1`:
```
{{1.title}}

{{1.lead}}

{{1.durada_hores}}h · {{1.lloc}}
Màxim {{1.max_places}} persones · Sota demanda

Tots els detalls i reserves a la bio.

#llumatics #fotografiaanalogica #barcelona #tallersfotografia
```

(Si `canal = externs`, el text "Sota demanda" es substitueix per la data, però per simplicitat a la primera versió aplica el template estàndard i ajusta manualment a Meta Business Suite si cal.)

- [ ] **Pas 4: Crea el Media Container del Post 1 (Instagram Graph API)**

Afegeix: **HTTP > Make a request**.

Configuració:
- URL: `https://graph.facebook.com/v21.0/{{INSTAGRAM_USER_ID}}/media`
- Method: POST
- Headers: Afegeix `Authorization` → `Bearer {{INSTAGRAM_ACCESS_TOKEN}}`
- Body type: `application/x-www-form-urlencoded`
- Fields:
  - `image_url` → `{{1.image}}`
  - `caption` → `{{caption_post1}}`
  - `published` → `false`
  - `scheduled_publish_time` → fes servir la funció Make.com: `{{addSeconds(now; 7200)}}` (Unix timestamp en segons)

Nota: `INSTAGRAM_USER_ID` i `INSTAGRAM_ACCESS_TOKEN` els guardes com a **Connection variables** o com a **Text** dins de cada mòdul (desa'ls en una nota segura — no hi ha "secrets" a Make.com free tier).

- [ ] **Pas 5: Publica el container del Post 1**

Afegeix: **HTTP > Make a request**.

Configuració:
- URL: `https://graph.facebook.com/v21.0/{{INSTAGRAM_USER_ID}}/media_publish`
- Method: POST
- Headers: `Authorization: Bearer {{INSTAGRAM_ACCESS_TOKEN}}`
- Body type: `application/x-www-form-urlencoded`
- Fields:
  - `creation_id` → `{{4.data.id}}` (el `id` de la resposta del Pas 4 — ajusta el número de mòdul)

- [ ] **Pas 6: Afegeix un Router per als Posts 2 i 3**

Afegeix: **Flow control > Router**.

El Router té dues sortides:
- **Ruta A** (sense filtre — sempre s'executa): continua al Post 1 (ja fet)
- **Ruta B** (filtre: `{{1.sota_demanda}} = false`): programa Posts 2 i 3 si el taller té dates fixes

Per ara, connecta la Ruta B a un mòdul **Tools > Sleep** de 0 segones (placeholder). Els Posts 2 i 3 amb dates es gestionen des de l'escenari d'agenda (Task 8).

- [ ] **Pas 7: Envia email de preview**

Afegeix: **Email > Send an email** (o **Gmail** si el compte de Google està connectat).

Configuració:
- To: `hola@llumatics.com`
- Subject: `Instagram programat — {{1.title}}`
- Body:
```
Nou post programat per a {{1.title}}.

Post 1 (en ~2h): {{1.url}}

Caption:
{{caption_post1}}

Imatge: {{1.image}}

Revisa i edita si cal a Meta Business Suite:
https://business.facebook.com/content_management
```

- [ ] **Pas 8: Activa l'escenari**

Toggle "Scheduling" → ON. Freqüència: "Immediately" (s'activa per webhook, no per temps).

---

## Task 8: Crear escenari Make.com — Nova data d'agenda (UI)

**Files:** Cap (configuració Make.com)

Quan s'afegeix una data d'agenda, programa els Posts 2 i 3 relatius a aquella data.

- [ ] **Pas 1: Crea l'escenari**

Make.com → Create a new scenario → nom: `Llumatics — Instagram Nova Agenda`.

- [ ] **Pas 2: Afegeix Webhook i registra l'estructura**

Igual que al Task 7, Pas 2. Copia la URL com a `MAKECOM_INSTAGRAM_AGENDA_WEBHOOK`.

Petició de prova:
```bash
curl -X POST {WEBHOOK_URL_AGENDA} \
  -H "Content-Type: application/json" \
  -d '{
    "course_ref": "revelat-bn",
    "title": "Revelat en B/N",
    "date_start": "2026-07-15",
    "time_start": "10:00",
    "lloc": "Nau Bostik, La Sagrera, Barcelona",
    "max_places": 4,
    "image_1": "https://llumatics.com/images/tallers/revelat-bn-1.jpg",
    "image_2": "https://llumatics.com/images/tallers/revelat-bn-2.jpg",
    "url": "https://llumatics.com/tallers/revelat-bn/"
  }'
```

- [ ] **Pas 3: Calcula timestamps dels Posts 2 i 3**

Afegeix: **Tools > Set Multiple Variables**.

Crea:
- `date_taller_ts`: `{{parseDate(1.date_start; "YYYY-MM-DD")}}` (Unix timestamp de la data)
- `ts_post2`: `{{subtractSeconds(date_taller_ts; 604800)}}` (7 dies abans en segons)
- `ts_post3`: `{{subtractSeconds(date_taller_ts; 172800)}}` (2 dies abans en segons)
- `date_taller_fmt`: `{{formatDate(parseDate(1.date_start; "YYYY-MM-DD"); "D [de] MMMM"; "ca")}}` (ex: "15 de juliol")

- [ ] **Pas 4: Crea i publica el Post 2 (Procés)**

Afegeix dos mòduls HTTP (igual que Task 7, Passos 4-5) per al Post 2.

Caption:
```
Això faràs.

{{1.title}} · {{date_taller_fmt}}

Màxim {{1.max_places}} persones — places limitades.

Tots els detalls a la bio.

#llumatics #fotografiaanalogica #barcelona
```

`scheduled_publish_time`: `{{ts_post2}}`
`image_url`: `{{1.image_1}}`

- [ ] **Pas 5: Crea i publica el Post 3 (Recordatori)**

Afegeix dos mòduls HTTP per al Post 3.

Caption:
```
{{1.title}} · {{date_taller_fmt}}

Queden 2 dies.

Màxim {{1.max_places}} persones.
Si t'interessa, ara és el moment.

{{1.url}}

#llumatics #fotografiaanalogica #barcelona
```

`scheduled_publish_time`: `{{ts_post3}}`
`image_url`: `{{1.image_2}}`

- [ ] **Pas 6: Email de confirmació**

Afegeix un mòdul d'email amb preview dels Posts 2 i 3 a `hola@llumatics.com`.

- [ ] **Pas 7: Activa l'escenari**

Toggle "Scheduling" → ON.

---

## Task 9: Test end-to-end

- [ ] **Pas 1: Prova el deploy automàtic**

Fes un canvi mínim a un fitxer (ex: afegeix un espai al README), commit i push a `main`. Comprova a GitHub → Actions que el workflow `Deploy → Producció` s'executa i completa sense errors.

- [ ] **Pas 2: Prova el webhook de taller**

Afegeix un taller de prova `content/ca/tallers/test-instagram/index.md` amb `draft: false` i `estat: actiu`. Commit i push a `main`. Comprova:
1. GitHub Actions → `Instagram — Nou taller` s'ha executat
2. Make.com → has rebut el webhook (History del escenari)
3. Instagram → Meta Business Suite → Content → el post apareix com a "Programat"
4. `hola@llumatics.com` ha rebut l'email de preview

- [ ] **Pas 3: Prova el webhook d'agenda**

Afegeix una entrada d'agenda per al taller de prova amb `date_start` a 10+ dies en el futur. Comprova el mateix flux.

- [ ] **Pas 4: Elimina el taller de prova**

```bash
rm -rf content/ca/tallers/test-instagram/
git add -A
git commit -m "test: elimina taller de prova instagram"
git push origin main
```

Cancela els posts programats a Meta Business Suite si cal.

- [ ] **Pas 5: Marca els 3 posts del taller del 13 de juny**

Publica manualment els 3 posts de "Iniciació al revelat" a Meta Business Suite (els texts estan a la conversa de disseny del 2026-05-30).
