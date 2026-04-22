# Llumàtics — Web oficial

Web de **Llumàtics**, escola de fotografia a Barcelona especialitzada en fotografia fotoquímica i processos alternatius.

- **Producció:** [llumatics.com](https://llumatics.com) → branca `main`
- **Staging:** [112books.github.io/llumatics-web](https://112books.github.io/llumatics-web) → branca `develop`
- **Repositori:** `github.com/112books/llumatics-web`

---

## Stack

| Capa | Tecnologia |
|------|-----------|
| SSG | Hugo v0.159+ extended |
| Tema | Custom (`themes/llumatics/`) |
| CSS | Vanilla CSS amb custom properties |
| JS | Vanilla JS mínim |
| Idiomes | CA (per defecte), ES, EN |
| Formularis | Tally.so |
| Newsletter | web3forms → Brevo (en configuració) |
| PDF alumnes | Make.com → Pandoc (pipeline extern, pendent) |
| Hosting | GitHub Pages |

---

## Desenvolupament local

```bash
# Servidor local amb drafts
hugo server -D

# Port alternatiu
hugo server -D --port 1314

# Build de producció
hugo --minify
```

---

## Desplegament

```bash
# Staging
git checkout develop
git push origin develop     # Activa GitHub Action

# Producció
git checkout main
git merge develop
git push origin main        # Activa GitHub Action
```

---

## Estructura

```
llumatics-hugo/
├── themes/llumatics/
│   ├── assets/css/main.css       # Tots els estils
│   ├── assets/js/main.js         # JS mínim (menú, lightbox, newsletter, collapsible)
│   ├── layouts/
│   │   ├── _default/             # baseof, list, single, private, gift
│   │   ├── tallers/single.html   # Fitxa de taller amb info-box, galeria, CTA
│   │   ├── espais/list.html      # Pàgina d'espais
│   │   ├── partials/             # header, footer, course-card, recorregut
│   │   └── shortcodes/           # galeria, seccions-collapsibles
│   └── i18n/                     # ca.yaml, es.yaml, en.yaml
├── content/
│   ├── ca/                       # Contingut català (per defecte)
│   ├── es/                       # Contingut castellà
│   └── en/                       # Contingut anglès
├── static/images/                # Imatges estàtiques
├── data/                         # blocs.yaml, recorregut.yaml, gift_amounts.yaml
└── hugo.toml                     # Configuració principal + params
```

---

## Tallers actius

| Slug | Títol | Canal | Estat |
|------|-------|-------|-------|
| fonaments-iniciacio-puntual | Aprèn a controlar la llum | llumatics | actiu |
| revelat-bn | Revelat B/N | llumatics | actiu |
| revelat-color-bn | Revelar color com si fos B/N | llumatics | actiu |
| guinneol | Guinneol: revela amb cervesa Guinness | llumatics | actiu |
| copies-beers-developer | Còpies amb el teu propi revelador | llumatics | actiu |
| copies-en-paper | Còpies en paper | llumatics | actiu |
| revelat-i-positivat | Revelat i positivat | llumatics | actiu |
| revelats-experimentals | Revelats experimentals | llumatics | actiu |
| reveladors-artesanals | Reveladors artesanals | llumatics | actiu |
| introduccio-al-positivat | Introducció al positivat | llumatics | actiu |
| digitalitzacio-escaner | Digitalització amb escànner | llumatics | actiu |
| fotografia-estenopeica | Fotografia estenopèica | llumatics | actiu |
| fotogrames-cianotipia | Fotogrames i cianotípia | llumatics | actiu |
| cianotipia | Cianotípia | llumatics | actiu |
| retrat-analogic | Retrat analògic | llumatics | actiu |
| retrat-6x6 | Retrat 6×6 | llumatics | actiu |
| hasselblad-500 | Hasselblad 500 | llumatics | actiu |
| gran-format-4x5 | Gran format 4×5 | llumatics | actiu |
| introduccio-gran-format | Introducció al gran format | llumatics | actiu |
| retrat-gran-format | Retrat en gran format | externs | actiu |
| iniciacio-revelat | Iniciació al revelat | externs | actiu |
| fotografia-de-carrer | Fotografia de carrer | llumatics | actiu |
| tutoria-fotografica | Tutoria fotogràfica | llumatics | actiu |
| carrer-i-mirada | Carrer i mirada | llumatics | en-preparacio |

---

## Paràmetres clau (`hugo.toml`)

```toml
[params]
  contactEmail         = "hola@llumatics.com"
  web3formsKey         = "..."          # Actiu: recull subscripcions newsletter
  tallyFormNewsletter  = ""             # Quan es configuri → substitueix web3forms
  tallyFormAvisa       = ""             # Waitlist per taller ("Avisa'm")
  tallyFormSolicitud   = ""             # Sol·licitar data de taller
  tallyFormContact     = ""             # Consultes generals
  tallyFormGiftVoucher = ""             # Vals regal
```

---

## Shortcodes disponibles

| Shortcode | Ús |
|-----------|-----|
| `{{< galeria id="nom" >}}` | Galeria amb lightbox (llista de paths, un per línia) |
| `{{% seccions-collapsibles %}}` | Seccions h2 collapsibles (FAQ-style), processa Markdown intern |
