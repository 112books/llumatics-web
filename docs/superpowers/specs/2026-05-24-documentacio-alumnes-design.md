# Especificació: Sistema de documentació nominal per a alumnes

**Data:** 2026-05-24
**Estat:** Aprovat
**Àmbit:** Pàgines privades dels tallers — formulari d'identificació, doble opt-in, PDF nominal amb certificat

---

## Objectiu

Permetre que els alumnes dels tallers de Llumàtics descarreguin la documentació oficial del taller en format PDF, personalitzada amb el seu nom. El procés serveix simultàniament per:

1. Verificar que l'email de l'alumne és real (doble opt-in)
2. Construir una llista d'alumnes a Brevo amb consentiment explícit per a comunicacions futures
3. Generar un document nominal que dificulti la distribució no autoritzada

---

## Arquitectura general

```
[/tallers/[slug]/privat/]          ← pàgina de formulari (layout: private)
        ↓
[Formulari HTML] → POST a Brevo API
        ↓
[Brevo] → envia email de doble opt-in
        ↓
[Alumne confirma] → Brevo redirigeix a:
/tallers/[slug]/privat/doc/?nom=Joan+Puig&taller=revelat-bn&lang=ca
        ↓
[/tallers/[slug]/privat/doc/]      ← pàgina de documentació (layout: private-doc)
        ↓
[JS injecta nom] → document complet amb capçalera, peu i certificat
        ↓
[window.print()] → PDF amb @media print
```

---

## Peces del sistema

### 1. Pàgina de formulari (`layout: private`)

**URL:** `/tallers/[slug]/privat/`

**Camps del formulari:**

| Camp | Tipus | Obligatori | Notes |
|------|-------|------------|-------|
| Nom complet | text | sí | |
| Email | email | sí | validació client-side |
| Idioma | select | sí | CA / ES / EN — per defecte el de la pàgina |
| Newsletter | checkbox | no | opt-in explícit, no pre-marcat |
| Taller | hidden | — | agafat de `{{ .Params.course_ref }}` |

**Comportament:**
- En enviar: POST directe a l'API de Brevo (sense intermediaris ni Make.com)
- Brevo crea el contacte amb atributs: `NOM`, `TALLER`, `IDIOMA`, `DATA_SOL·LICITUD`
- Brevo envia automàticament l'email de doble opt-in (template configurat a Brevo)
- La pàgina mostra un missatge: *"Et hem enviat un email de confirmació. Revisa la safata d'entrada."*

### 2. Integració Brevo

**Llista:** "Alumnes Llumàtics"

**Atributs de contacte:**
- `NOM` (text)
- `TALLER` (text — slug del taller)
- `IDIOMA` (text — ca / es / en)
- `DATA_SOL·LICITUD` (data)
- `NEWSLETTER` (boolean — true si ha marcat el checkbox)

**Segments:**
- "Tots els alumnes" — tots els contactes confirmats de la llista
- "Newsletter" — contactes amb `NEWSLETTER = true` → únics que poden rebre campanyes

**Redirect post-confirmació:**
Brevo redirigeix a una URL **estàtica** per llista — no pot incloure variables de contacte.
La solució és `localStorage`: just abans d'enviar el formulari, el JS guarda les dades al navegador:

```javascript
localStorage.setItem('llum_doc', JSON.stringify({ nom, taller, lang }))
// → POST a Brevo API
```

Brevo redirigeix a:
```
https://llumatics.com/confirmat/
```

La pàgina `/confirmat/` llegeix `localStorage`, construeix la URL completa i redirigeix:
```javascript
const data = JSON.parse(localStorage.getItem('llum_doc'))
window.location = `/tallers/${data.taller}/privat/doc/?nom=${encodeURIComponent(data.nom)}&taller=${data.taller}&lang=${data.lang}`
```

Funciona perquè `localStorage` persisteix entre pàgines del mateix navegador durant la mateixa sessió.

**Pla Brevo:** Free (300 emails/dia, 9.000/mes). Suficient per al volum previst.

### 3. Pàgina de documentació (`layout: private-doc`)

**URL:** `/tallers/[slug]/privat/doc/`

**Contingut:** Markdown del fitxer `privat/doc/index.md` de cada taller, renderitzat per Hugo.

**Injecció JS del nom:**
```javascript
const params = new URLSearchParams(window.location.search)
const nom = params.get('nom')
const taller = params.get('taller')
const lang = params.get('lang')

// Si no hi ha nom, amaga el contingut i mostra avís
if (!nom) {
  // Mostra: "Accedeix primer des del formulari del taller"
  // Botó → /tallers/[slug]/privat/
}
```

**On apareix el nom:**
- Capçalera del document: *"Document preparat per a [Nom Complet]"*
- Peu de cada pàgina (via CSS `@media print`): *"© Llumàtics · [Nom] · Document personal i intransferible"*
- Certificat final: nom en tipografia gran

**Protecció:**
- `noindex: true` i `sitemap: disable: true` — no indexada
- No enllaçada des de cap lloc públic del web
- Sense nom a la URL → el contingut no es mostra

### 4. Template de documentació unificat

Tots els tallers seguiran aquesta estructura Markdown:

```markdown
---
title: "Documentació — [Nom del taller]"
layout: "private-doc"
course_ref: "[slug]"
image: "/images/docs/[slug].jpg"     ← imatge principal del document
noindex: true
sitemap:
  disable: true
draft: false
---

## Introducció
## Història
## Fórmules          ← secció opcional
## Procediment pas a pas
## Consells
## Resum
## Referències externes
```

El `layout: private-doc` afegeix automàticament la capçalera nominal i el certificat — el Markdown no cal que els inclogui.

**Imatge principal (`image`):** apareix a la portada del document, sota la capçalera amb el nom de l'alumne. Format jpg/webp, 1200×800px. Ruta: `static/images/docs/[slug].jpg`.

**Imatges secundàries:** inline dins el Markdown, sense estructura imposada. Cada taller decideix on les posa i quantes. S'insereixen amb Markdown estàndard:

```markdown
![Descripció de la imatge](/images/docs/revelat-bn-pas1.jpg)
```

Ruta: `static/images/docs/[slug]-[descripció].jpg`.

**Consideracions per a impressió:**
- Les imatges no usen `loading="lazy"` — el layout `private-doc` les carrega eager per evitar blancs al PDF
- El CSS d'impressió limita l'amplada de les imatges al 100% de la columna
- `page-break-inside: avoid` a les imatges per evitar talls a meitat d'una foto

### 5. Certificat formal

Última pàgina del PDF, forçada per `page-break-before: always`.

**Contingut:**
```
[Logo Llumàtics]

CERTIFICA QUE

[NOM COMPLET]

ha completat el taller

[NOM DEL TALLER]

[Data de generació — injectada per JS]
Barcelona

[Línia de signatura — nom Llumàtics]
```

**Estil:**
- Fons blanc, centrat verticalment
- Nom de l'alumne: Playfair Display, mida gran (~2.5rem)
- Nom del taller: majúscules, pes normal
- Logo: petit, a dalt
- Línia fina de separació entre contingut del taller i certificat
- Minimalista — coherent amb el disseny actual del web

### 6. Estils d'impressió `@media print`

```css
@media print {
  /* Amaga elements del web */
  header, footer, nav, .btn-print, .private-gate { display: none; }

  /* Capçalera del document (visible al PDF) */
  .doc-header { display: block; }

  /* Peu de pàgina amb nom */
  .doc-footer {
    position: fixed;
    bottom: 0;
  }

  /* Certificat: pàgina nova */
  .certificate { page-break-before: always; }

  /* Mida A4 */
  @page { size: A4; margin: 2cm; }
}
```

---

## Estructura de fitxers

```
content/ca/
  confirmat/
    _index.md         ← pàgina de relay post-confirmació Brevo (layout: confirmat) — NOU

content/ca/tallers/[slug]/
  privat/
    index.md          ← formulari (layout: private) — ja existeix
    doc/
      index.md        ← documentació (layout: private-doc) — NOU

themes/llumatics/
  layouts/_default/
    private.html      ← actualitzar amb formulari Brevo
    private-doc.html  ← NOU: layout documentació + injecció JS
    confirmat.html    ← NOU: pàgina relay localStorage → /doc/
  assets/css/main.css ← afegir @media print + .certificate
  assets/js/main.js   ← afegir injecció nom + guard sense params

hugo.toml
  brevoApiKey = ""    ← NOU param
  brevoListId = ""    ← NOU param
```

---

## Multilingüisme

- El formulari detecta l'idioma de la pàgina actual i el pre-selecciona
- Les claus i18n noves: `private_name`, `private_language`, `private_newsletter_label`, `private_confirm_message`, `private_no_access`, `certificate_certifies`, `certificate_completed`
- La documentació de cada taller s'escriu en CA primer; ES i EN en fases posteriors
- La URL de redirect de Brevo inclou `lang` → la pàgina `/doc/` pot servir en l'idioma correcte

---

## Fases d'implementació

**Fase 1 — Infraestructura (una vegada)**
- Configurar Brevo: llista, atributs, template doble opt-in, URL de redirect → `/confirmat/`
- Afegir `brevoApiKey` i `brevoListId` a `hugo.toml`
- Crear `confirmat.html` (layout relay localStorage → /doc/)
- Crear `content/ca/confirmat/_index.md`
- Crear `private-doc.html` (layout)
- Actualitzar `private.html` (formulari → Brevo + localStorage)
- Afegir `@media print` i `.certificate` a `main.css`
- Afegir lògica JS d'injecció a `main.js`

**Fase 2 — Documentació dels tallers (per taller)**
- Crear `privat/doc/index.md` per a cada taller actiu
- Escriure la documentació seguint el template unificat
- Tallers prioritaris: `revelat-bn`, `reveladors-artesanals`, `copies-beers-developer`

---

## Decisions i restriccions

- **No Make.com**: el val-regal va demostrar que Make.com afegeix complexitat innecessària per a aquest volum. Brevo gestiona el doble opt-in de forma nativa.
- **PDF al navegador, no per email**: consistent amb el patró del val-regal. L'alumne desa/imprimeix des de la pàgina. L'email de confirmació és la verificació; el PDF és la recompensa.
- **Protecció per obscuritat**: Hugo no permet autenticació real. La URL `/doc/` no s'indexa ni s'enllaça públicament. El guard JS és suficient per al cas d'ús.
- **Nom del taller al formulari és hidden**: evita que l'alumne pugui falsificar a quin taller ha assistit.
- **Un sol segment "Newsletter"**: els alumnes sense opt-in resten a la llista però no reben campanyes. Compleix LOPD/RGPD.
- **Certificat no és acreditació oficial**: és un document de marca, no una titulació reconeguda. El text és "certifica que ha completat", no "acredita" ni "titula".
