# Spec: Qualitat pàgines estàtiques — Traduccions + SEO + A11y + Seguretat

**Data:** 2026-04-25
**Projecte:** Llumàtics Web (Hugo)
**Abast:** Totes les pàgines no-blog / no-taller

---

## Resum

Millora integral de les pàgines estàtiques del site: traduccions completes CA/ES/EN de les pàgines de contacte i legals, auditoria SEO completa (hreflang, OG, schema.org, canonical), accessibilitat WCAG 2.1 AA, i seguretat bàsica per a site estàtic.

---

## Context i estat actual

**Pàgines estàtiques existents (CA):**
- `_index.md` (home), `contacte/`, `espais/`, `sobre/`, `regala/`, `avis-legal/`, `cookies/`, `privacitat/`

**Traduccions actuals (ES/EN):**
- ✅ `_index.md`, `espais/`, `sobre/`, `regala/`
- ❌ Manquen: `contacte/`, `avis-legal/`, `cookies/`, `privacitat/`

**Problemes detectats:**
- `privacitat/index.md` (CA) menciona Formspree com a proveïdor de formularis, però el site usa web3forms
- Les FAQ de la pàgina de contacte estan hardcodejades en CA al template
- ~35 claus i18n del template de contacte no estan declarades als YAML (funcionen per `default` però no es tradueixen)
- El `head.html` no té `x-default` hreflang, ni `og:locale:alternate`, ni Twitter Card, ni canonical explícit
- El `baseof.html` no té skip-link
- Alguns `target="_blank"` al footer i altres partials no tenen `rel="noopener noreferrer"`
- El layout `gift.html` usa estils inline (`style=""`) en lloc de classes CSS

---

## Arquitectura: 5 capes seqüencials

```
Capa 1 — Templates  →  Capa 2 — A11y  →  Capa 3 — i18n  →  Capa 4 — Contingut  →  Capa 5 — Verificació
```

Cada capa es construeix sobre l'anterior: els templates milloren primer perquè s'apliquen a totes les pàgines incloses les que es crearan a les capes posteriors.

---

## Capa 1: Templates (SEO + Seguretat)

### `head.html`

**hreflang:**
```html
{{ range .AllTranslations }}
<link rel="alternate" hreflang="{{ .Language.Lang }}" href="{{ .Permalink }}">
{{ end }}
{{/* x-default apunta a la versió CA (llengua per defecte) */}}
{{ $defaultPage := .AllTranslations | where "Language.Lang" "ca" | first | default . }}
<link rel="alternate" hreflang="x-default" href="{{ $defaultPage.Permalink }}">
```

**Canonical:**
```html
<link rel="canonical" href="{{ .Permalink }}">
```

**Open Graph complet:**
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
<meta property="og:url" content="{{ .Permalink }}">
{{/* og:locale: ca→ca_ES, es→es_ES, en→en_US */}}
{{ $localeMap := dict "ca" "ca_ES" "es" "es_ES" "en" "en_US" }}
<meta property="og:locale" content="{{ index $localeMap .Language.Lang | default "ca_ES" }}">
{{ range .Translations }}
<meta property="og:locale:alternate" content="{{ index $localeMap .Language.Lang | default "es_ES" }}">
{{ end }}
<meta property="og:image" content="{{ with .Params.image }}{{ . | absURL }}{{ else }}{{ "images/og-default.jpg" | absURL }}{{ end }}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="{{ .Site.Title }}">
```

**Twitter Card:**
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} — {{ .Site.Title }}{{ end }}">
<meta name="twitter:description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">
<meta name="twitter:image" content="{{ with .Params.image }}{{ . | absURL }}{{ else }}{{ "images/og-default.jpg" | absURL }}{{ end }}">
```

**schema.org LocalBusiness** (totes les pàgines, via nou partial `themes/.../layouts/partials/schema-local.html`, invocat des de `head.html`):
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Llumàtics",
  "description": "Escola de fotografia analògica a Barcelona",
  "url": "https://llumatics.com",
  "email": "info@llumatics.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Carrer Ferran Turné, 1-11",
    "addressLocality": "Barcelona",
    "postalCode": "08027",
    "addressCountry": "ES"
  },
  "sameAs": ["https://www.instagram.com/llumaticscat"]
}
```

**schema.org Course millorat** (pàgines de taller):
- Afegir `educationalLevel`, `instructor` (Joan Martínez Serres), `offers` amb `preu_1`, `inLanguage`

**CSP via meta** (restrictiva, permet fonts conegudes):
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  frame-src https://tally.so https://www.openstreetmap.org;
  img-src 'self' data: https:;
  connect-src 'self' https://api.web3forms.com;
">
```

### `baseof.html`
- Afegir skip-link just després de `<body>`:
```html
<a href="#main-content" class="skip-link">{{ i18n "skip_to_content" | default "Saltar al contingut principal" }}</a>
```
- El `<main id="main-content">` ja existeix ✅

### `footer.html`
- Tots els `<a target="_blank">` → afegir `rel="noopener noreferrer"` si no en tenen
- Logo: `{{ site.BaseURL }}images/...` → `{{ "images/llumatics-logo.svg" | relURL }}`

---

## Capa 2: Accessibilitat (WCAG 2.1 AA)

### Skip-link CSS (`main.css`)
```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
  background: var(--color-text);
  color: var(--color-bg);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  z-index: 9999;
  transition: top 0.1s;
}
.skip-link:focus {
  top: 1rem;
}
```

### Focus visible global (`main.css`)
```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: var(--radius);
}
```
Eliminar qualsevol `outline: none` sense alternativa visible.

### ARIA millorat

| Element | Canvi |
|---------|-------|
| `<nav>` al header | `aria-label="{{ i18n "nav_aria_label" }}"` (traduït) |
| Botó hamburguesa | JS toggle `aria-label` entre "Obrir menú" / "Tancar menú" |
| Lightbox `aria-label` | Usar i18n key en lloc de CA hardcoded |
| `gift.html` | Migrar tots els `style=""` a classes CSS; afegir `<h2>` als blocs d'imports |

### Heading hierarchy
- `gift.html`: l'`<h1>` té el títol, però els blocs d'imports no tenen heading → afegir `<h2>` semàntic
- Pàgines legals: jerarquia correcta amb Markdown (`##` → `h2`, `###` → `h3`) ✅

### Contrast de colors
- Revisar `--color-text-muted` sobre `--color-bg` (mínim 4.5:1 per a text normal)
- Revisar text sobre blocs de color (`data-bloc="fonaments"` daurat, `processos-alternatius` violeta)
- Ajustar valors de color si no passen el test

---

## Capa 3: i18n — Keys noves (~35)

Afegir a `ca.yaml`, `es.yaml` i `en.yaml`:

### Navegació i skip
```yaml
skip_to_content: "Saltar al contingut principal" / "Saltar al contenido principal" / "Skip to main content"
nav_aria_label: "Navegació principal" / "Navegación principal" / "Main navigation"
```

### Contacte — mapa i transport
```yaml
how_to_get_here: "Com arribar-hi" / "Cómo llegar" / "How to get here"
transport_motto: "Llumàtics aposta sempre per el transport públic" / "Llumàtics apuesta siempre por el transporte público" / "Llumàtics always chooses public transport"
open_in_osm: "Obrir al mapa" / "Abrir en el mapa" / "Open in map"
```

### Contacte — formulari
```yaml
contact_form_title: "Escriu-nos" / "Escríbenos" / "Write to us"
contact_form_lead: "Intentem contestar en un màxim de 48 hores en dies feiners." / "Intentamos contestar en un máximo de 48 horas en días laborables." / "We aim to reply within 48 hours on working days."
contact_form_soon: "El formulari s'activarà aviat. Mentrestant, escriu-nos directament:" / "El formulario se activará pronto. Mientras tanto, escríbenos directamente:" / "The form will be active soon. In the meantime, contact us directly:"
inquiry_type: "Tipus de consulta" / "Tipo de consulta" / "Inquiry type"
inquiry_general: "Consulta general" / "Consulta general" / "General inquiry"
inquiry_workshop: "Sol·licitar un taller" / "Solicitar un taller" / "Request a workshop"
form_name: "Nom i cognoms" / "Nombre y apellidos" / "Full name"
form_email: "Correu electrònic" / "Correo electrónico" / "Email address"
form_workshop: "Taller d'interès" / "Taller de interés" / "Workshop of interest"
form_date: "Data ideal" / "Fecha ideal" / "Preferred date"
form_schedule: "Horari preferit" / "Horario preferido" / "Preferred schedule"
form_students: "Nombre d'alumnes" / "Número de alumnos" / "Number of students"
form_message: "Missatge" / "Mensaje" / "Message"
form_send: "Enviar" / "Enviar" / "Send"
schedule_morning: "Matí (10–14h)" / "Mañana (10–14h)" / "Morning (10–14h)"
schedule_afternoon: "Tarda (16–18h)" / "Tarde (16–18h)" / "Afternoon (16–18h)"
schedule_any: "Indiferent" / "Indiferente" / "No preference"
```

### FAQ categories
```yaml
faq_title: "FAQ — Preguntes freqüents" / "FAQ — Preguntas frecuentes" / "FAQ — Frequently asked questions"
faq_cat_workshops: "Sobre els tallers" / "Sobre los talleres" / "About the workshops"
faq_cat_space: "Sobre l'espai" / "Sobre el espacio" / "About the space"
faq_cat_payment: "Sobre preus i pagament" / "Sobre precios y pago" / "About pricing and payment"
faq_cat_external: "Tallers externs i institucions" / "Talleres externos e instituciones" / "External workshops and institutions"
```

### Legal
```yaml
legal_notice: "Avís legal" / "Aviso legal" / "Legal notice"
privacy_policy: "Política de privacitat" / "Política de privacidad" / "Privacy policy"
cookie_policy: "Política de cookies" / "Política de cookies" / "Cookie policy"
```

---

## Capa 4: Contingut nou i modificat

### Fitxers modificats
- `content/ca/contacte/index.md` — afegir FAQ en CA com a `{{ .Content }}`
- `content/ca/privacitat/index.md` — fix Formspree → web3forms

### Fitxers nous (8)

**Contacte ES i EN** — frontmatter traduït + FAQ completes en l'idioma corresponent:
- `content/es/contacte/index.md`
- `content/en/contacte/index.md`

**Legal ES** (traducció del CA, adaptada gramaticalment):
- `content/es/avis-legal/index.md`
- `content/es/cookies/index.md`
- `content/es/privacitat/index.md` (web3forms correcte)

**Legal EN** (traducció al anglès, llei espanyola explicada en anglès):
- `content/en/avis-legal/index.md`
- `content/en/cookies/index.md`
- `content/en/privacitat/index.md` (web3forms correcte)

### Template `contacte/single.html`
La secció FAQ, ara hardcodejada en CA, es substitueix per:
```html
<section class="contact-faq" id="faq">
  <h2 class="contact-section__title">{{ i18n "faq_title" }}</h2>
  {{ .Content }}
</section>
```
Les preguntes/respostes individuals de cada FAQ van a cada `index.md` com a Markdown estructurat amb `<details>` / `<summary>` (HTML directe permès pel `unsafe: true` de goldmark). Les classes CSS existents al template (`.faq-item`, `.faq-question`, `.faq-answer`, `.faq-icon`) es reutilitzen directament als atributs HTML inline del Markdown — no cal afegir CSS nou per a les FAQ.

---

## Capa 5: Verificació

Després de totes les implementacions:
1. Build sense errors: `hugo --minify`
2. Build staging: `hugo --minify --baseURL "https://112books.github.io/llumatics-web/" --buildDrafts`
3. Comprovar hreflang amb [hreflang checker](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)
4. Comprovar schema.org amb Google Rich Results Test
5. Comprovar contrast amb browser DevTools accessibility panel
6. Navegar totes les pàgines legals en ES i EN
7. Enviar el formulari de contacte en mode local

---

## Fitxers afectats (resum)

| Fitxer | Tipus de canvi |
|--------|---------------|
| `themes/.../partials/head.html` | SEO complet (hreflang, OG, Twitter, schema, canonical, CSP) |
| `themes/.../layouts/_default/baseof.html` | Skip-link |
| `themes/.../layouts/_default/gift.html` | Migrar inline styles a CSS |
| `themes/.../layouts/contacte/single.html` | FAQ → `{{ .Content }}` |
| `themes/.../partials/footer.html` | `rel="noopener noreferrer"` |
| `themes/.../partials/header.html` | ARIA nav label |
| `themes/.../assets/css/main.css` | Skip-link CSS, focus-visible, contrast fixes |
| `themes/.../i18n/ca.yaml` | ~35 keys noves |
| `themes/.../i18n/es.yaml` | ~35 keys noves (ES) |
| `themes/.../i18n/en.yaml` | ~35 keys noves (EN) |
| `content/ca/contacte/index.md` | FAQ en CA |
| `content/ca/privacitat/index.md` | Fix Formspree→web3forms |
| `content/es/contacte/index.md` | NOU |
| `content/es/avis-legal/index.md` | NOU |
| `content/es/cookies/index.md` | NOU |
| `content/es/privacitat/index.md` | NOU |
| `content/en/contacte/index.md` | NOU |
| `content/en/avis-legal/index.md` | NOU |
| `content/en/cookies/index.md` | NOU |
| `content/en/privacitat/index.md` | NOU |

**Total: ~20 fitxers** (10 modificats, 8 nous, 2 nous partials de schema)
