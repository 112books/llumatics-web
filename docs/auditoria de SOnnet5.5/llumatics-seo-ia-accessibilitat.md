---
titol: "Llumàtics — SEO, cercadors d'IA, accessibilitat i posicionament"
projecte: llumatics.com
versio: 0.1
data: 2026-10-02
estat: per aplicar
relacionat:
  - llumatics-veu-i-terminologia.md
  - llumatics-recomanador-quin-curs-em-conve.md
  - llumatics-formacions-flash-efemerides.md
---

# Llumàtics — SEO, cercadors d'IA, accessibilitat i posicionament

Pla complet per situar llumatics.com tan amunt com sigui possible a Google, Bing i els cercadors i assistents d'IA (Google AI Overviews i AI Mode, ChatGPT, Claude, Perplexity, Copilot, Gemini), amb un web accessible per a tothom.

Està pensat per a la sessió que treballa amb el repositori de Hugo. Cada apartat diu **què** cal fer, **per què** i **com** comprovar-ho.

Els elements marcats amb **CONFIRMAR** cal verificar-los al repositori o als panells de control.

---

## 0. Resum executiu

1. **El SEO per a IA és, sobretot, bon SEO.** Google va publicar el maig del 2026 una guia oficial que ho diu clarament: les funcions d'IA de la cerca es basen en els mateixos sistemes de rànquing i qualitat que la cerca clàssica. El que més pesa és el contingut útil, original i accessible als rastrejadors.
2. **El primer problema és tècnic, no de contingut.** En la revisió prèvia, les pàgines interiors del web (/tallers/, /regala/, /es/, articles del blog) donaven un error de "massa redireccions" des d'un lector extern. Si Google o els rastrejadors d'IA veuen el mateix, tot el contingut que no és la portada és invisible. **És la prioritat número u.**
3. **El posicionament local guanya el mercat.** Qui busca "taller revelat Barcelona" vol un lloc a prop. La fitxa de Google Business Profile, les ressenyes i la coherència del nom i l'adreça a tot arreu pesen tant com el web.
4. **Els rastrejadors d'IA s'han de deixar entrar explícitament.** Cal distingir els que entrenen models dels que citen fonts en les respostes, i decidir-ho de manera conscient.
5. **El contingut de referència és l'avantatge competitiu.** Llumàtics sap coses que la gent pregunta. Guies pràctiques amb imatges pròpies són el que els assistents d'IA citen i el que la competència no té.
6. **L'accessibilitat no és obligatòria per llei per a Llumàtics, però és el que s'ha de fer.** I coincideix gairebé del tot amb el que demana el SEO.

---

## 1. Diagnòstic i prioritat zero: la indexació

### 1.1 El bucle de redireccions

Des d'un lector extern, la portada es carregava però les pàgines interiors entraven en un bucle de redireccions. Pot ser un problema del lector, però **cal descartar-ho avui mateix**.

**Com comprovar-ho:**

```bash
# Seguir les redireccions i veure la cadena completa
curl -sIL https://llumatics.com/tallers/ | grep -iE "^(HTTP|location)"
curl -sIL https://llumatics.com/tallers  | grep -iE "^(HTTP|location)"
curl -sIL https://www.llumatics.com/     | grep -iE "^(HTTP|location)"
curl -sIL http://llumatics.com/es/       | grep -iE "^(HTTP|location)"

# Amb l'agent de Googlebot
curl -sIL -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  https://llumatics.com/tallers/ | grep -iE "^(HTTP|location)"
```

Cada URL ha d'acabar en **un sol 200** després de com a màxim una redirecció.

**Causes habituals en Hugo + GitHub Pages:**

| Causa | Símptoma | Solució |
|---|---|---|
| Cloudflare (o un altre proxy) en mode SSL "Flexible" amb "Enforce HTTPS" actiu a GitHub Pages | Bucle infinit http ↔ https | Posar el proxy en mode "Full" o "Full (strict)" |
| Regles de redirecció d'idioma que es contradiuen (`/` → `/ca/` → `/`) | Bucle a les rutes d'idioma | Revisar `defaultContentLanguageInSubdir` i les regles del proxy |
| Barra final: una regla treu la `/` i GitHub Pages la torna a posar | Bucle entre `/tallers` i `/tallers/` | No forçar la retirada de la barra final |
| `www` ↔ sense `www` configurats en dos llocs | Bucle entre dominis | Una sola redirecció canònica, en un sol lloc |
| `baseURL` de Hugo diferent del domini real | Enllaços i canònics incorrectes | `baseURL = "https://llumatics.com/"` |

**Com comprovar que Google ho veu bé:** a Google Search Console, eina "Inspecció d'URL", provar /tallers/ i un taller concret amb "Prova l'URL publicat".

### 1.2 Visibilitat de la marca

En una cerca de prova del nom de la marca, llumatics.com no apareixia entre els resultats. El cercador utilitzat no era Google, i per tant no és concloent, però cal comprovar-ho:

- `site:llumatics.com` a Google i a Bing: quantes pàgines hi ha indexades?
- "Llumàtics" i "llumatics" (sense accent) a Google i a Bing: surt el web primer?
- Search Console → Pàgines: quantes en estat "Indexada" i quantes amb errors?

**Risc de confusió de nom:** existeix un festival de fotografia a Sant Cugat amb un nom semblant (Lumínic). Cal reforçar el nom propi amb dades estructurades (`alternateName`), amb la coherència del nom a tot arreu i amb les dues grafies, amb accent i sense.

### 1.3 Llista de comprovació de la prioritat zero

- [ ] Totes les URL interiors responen 200 sense bucles.
- [ ] Una única versió canònica del domini (amb `https`, sense `www` o amb, però només una).
- [ ] Search Console verificat (propietat de domini, via DNS).
- [ ] Bing Webmaster Tools verificat (es pot importar des de Search Console).
- [ ] Sitemap enviat a tots dos.
- [ ] `robots.txt` revisat (apartat 4).
- [ ] Inspecció d'URL de la portada, /tallers/ i tres fitxes de taller: indexables.

---

## 2. SEO tècnic a Hugo

### 2.1 Configuració base

```toml
baseURL = "https://llumatics.com/"
enableRobotsTXT = true          # robots.txt des d'una plantilla pròpia
canonifyURLs = false
removePathAccents = true        # URL sense accents: /tallers/cianotipia/
defaultContentLanguage = "ca"
defaultContentLanguageInSubdir = false   # CONFIRMAR l'estructura actual

[sitemap]
  changeFreq = "weekly"
  priority = 0.5
```

Hugo genera automàticament un sitemap per idioma i un índex de sitemaps a l'arrel. Cal comprovar que l'índex es troba a `https://llumatics.com/sitemap.xml` i que no hi apareixen pàgines amb `draft: true` ni pàgines buides.

### 2.2 Capçalera `<head>` de cada pàgina

```html
<html lang="{{ .Site.Language.LanguageCode }}">   <!-- ca, es, en -->

<title>{{ partial "seo-title" . }}</title>
<meta name="description" content="{{ partial "seo-description" . }}">
<link rel="canonical" href="{{ .Permalink }}">

<!-- hreflang: cada traducció apunta a totes les altres i a si mateixa -->
{{ range .AllTranslations }}
<link rel="alternate" hreflang="{{ .Language.LanguageCode }}" href="{{ .Permalink }}">
{{ end }}
<link rel="alternate" hreflang="x-default" href="{{ .Site.Home.Permalink }}">

<!-- Open Graph i targetes socials -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...1200x630...">
<meta property="og:locale" content="ca_ES">
<meta name="twitter:card" content="summary_large_image">
```

**Regles:**

- El `title` i la `description` segueixen els patrons de `llumatics-veu-i-terminologia.md` (apartat 4): "analògica" al camp de cerca, "química" al cos.
- Cada pàgina té un `title` i una `description` **únics**. Una plantilla parcial ha de fer fallar el build (o com a mínim avisar) si en troba de duplicats.
- Les pàgines amb `estat: en-preparacio` sense contingut real porten `<meta name="robots" content="noindex, follow">`, perquè no siguin contingut fi indexat.
- El codi d'idioma de `lang` és el de l'idioma de la pàgina, i les citacions en un altre idioma porten el seu propi `lang`.

### 2.3 URL

- Curtes, en minúscules, sense accents i amb guions: `/tallers/revelat-bn/`.
- Estables: si mai canvia una URL, cal una redirecció 301 (a GitHub Pages, amb `aliases` al frontmatter de Hugo).
- Una sola URL per contingut: sense paràmetres que en dupliquin les versions. El recomanador fa servir paràmetres (`?n=…`) i la seva pàgina ha de tenir un canònic sense paràmetres.

### 2.4 Enllaçat intern

L'enllaçat intern és com Google i els assistents entenen l'estructura del web.

- **Línies del metro:** cada taller enllaça l'anterior i el següent de la seva línia, i la pàgina de la línia.
- **Recomanador:** enllaçat des de la portada, des de la pàgina de formació i des del peu de cada fitxa ("No saps si és el teu taller? Fes el test").
- **Blog → tallers:** cada article enllaça el taller relacionat amb un text d'enllaç descriptiu ("taller de revelat de pel·lícula en blanc i negre"), mai "clica aquí".
- **Tallers → blog:** cada fitxa enllaça una o dues guies relacionades.
- **Breadcrumbs** visibles a totes les pàgines interiors, amb dades estructurades.
- **Cap pàgina orfe:** totes accessibles en un màxim de tres clics des de la portada.

### 2.5 Rendiment (Core Web Vitals)

Un web estàtic de Hugo ja parteix amb avantatge. Cal no perdre'l amb les imatges.

**Imatges** (on es juga gairebé tot en un web de fotografia):

- Processar-les amb Hugo Pipes: `.Resize`, `.Fill`, i formats WebP o AVIF amb JPEG de reserva.
- `srcset` i `sizes` per servir la mida adequada a cada pantalla.
- `width` i `height` sempre explícits, per evitar salts de disseny (CLS).
- La imatge principal de cada pàgina (la que defineix el LCP): sense `loading="lazy"` i amb `fetchpriority="high"`.
- La resta: `loading="lazy"` i `decoding="async"`.
- La galeria i la lightbox no carreguen les imatges grans fins que es demanen.

**Tipografies:**

- Allotjades al mateix domini, en WOFF2, amb només els pesos i caràcters necessaris (subset llatí amb `l·l`, `à`, `ç`).
- `font-display: swap` i `preload` de la tipografia principal.

**JavaScript:**

- Mínim i diferit. El recomanador i el pop-up són JavaScript pla, sense dependències.
- Cap script de tercers que bloquegi la càrrega.

**Objectius (mòbil, dades reals de Search Console):**

| Mètrica | Objectiu |
|---|---|
| LCP | < 2,5 s |
| INP | < 200 ms |
| CLS | < 0,1 |

### 2.6 Pàgina 404

Una pàgina 404 pròpia que respongui amb codi 404 real (no 200), en tres idiomes, amb enllaços a Formació, al recomanador i a l'agenda.

### 2.7 Notificació instantània amb IndexNow

IndexNow avisa Bing i altres cercadors cada vegada que una pàgina canvia, sense esperar que la rastregin. És útil per a l'agenda i les formacions flash, que són contingut amb data.

- Generar una clau i publicar-la com a fitxer a l'arrel.
- Una GitHub Action que, després de cada desplegament, enviï a IndexNow les URL modificades.
- Google no utilitza IndexNow. Per a Google n'hi ha prou amb el sitemap actualitzat (amb `lastmod` real) i un enllaçat intern bo.

---

## 3. Dades estructurades (Schema.org)

### 3.1 Què ha canviat i per què encara val la pena

- El juny del 2025 Google va deixar de mostrar a la cerca els resultats enriquits de **Course Info**, juntament amb altres tipus. Google va precisar que l'ús d'aquestes dades fora de la seva cerca no es veu afectat.
- La guia de Google per a la cerca amb IA (2026) diu que les dades estructurades no són un requisit per aparèixer a les respostes d'IA.
- **Per què posar-les igualment:**
  - Bing i altres cercadors les fan servir.
  - Ajuden qualsevol sistema automàtic (assistents d'IA, agregadors, agendes) a entendre sense ambigüitat què és Llumàtics, on és, què ofereix, quan i a quin preu.
  - Alguns tipus encara generen resultats enriquits a Google: breadcrumbs, dades de l'organització i esdeveniments (CONFIRMAR l'estat actual de cada tipus a la documentació de Search Central abans d'implementar-lo).
  - Són poques plantilles de Hugo, generades automàticament a partir del frontmatter: el cost de manteniment és gairebé zero.

**Regla d'or:** les dades estructurades han de coincidir exactament amb el que es veu a la pàgina. Mai posar-hi preus, dates o ressenyes que no siguin visibles.

### 3.2 Organització (a totes les pàgines, una sola vegada)

```json
{
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  "@id": "https://llumatics.com/#organitzacio",
  "name": "Llumàtics",
  "alternateName": ["Llumatics", "Llumàtics, escola de fotografia química"],
  "description": "Escola de fotografia química (analògica) a la Nau Bostik, Barcelona.",
  "url": "https://llumatics.com/",
  "logo": "https://llumatics.com/images/llumatics-logo.png",
  "image": "https://llumatics.com/images/llumatics-laboratori.jpg",
  "email": "hola@llumatics.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "CONFIRMAR (adreça de la Nau Bostik)",
    "addressLocality": "Barcelona",
    "postalCode": "CONFIRMAR",
    "addressRegion": "Catalunya",
    "addressCountry": "ES"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "CONFIRMAR", "longitude": "CONFIRMAR" },
  "areaServed": "Barcelona",
  "knowsAbout": [
    "Fotografia analògica", "Revelat de pel·lícula", "Positivat",
    "Cianotípia", "Fotografia estenopeica", "Mig format", "Gran format",
    "Processos alternatius", "Fotollibre"
  ],
  "founder": { "@id": "https://llumatics.com/#joan" },
  "sameAs": [
    "https://www.instagram.com/CONFIRMAR",
    "https://www.google.com/maps/CONFIRMAR (fitxa de Google Business Profile)"
  ]
}
```

### 3.3 Persona: qui ensenya

Clau per a la confiança (allò que Google anomena experiència, coneixement, autoritat i fiabilitat). Va a la pàgina "Qui som" i s'hi referencia des de les fitxes.

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://llumatics.com/#joan",
  "name": "Joan Linux Martínez i Serres",
  "jobTitle": "Fotògraf i formador",
  "worksFor": { "@id": "https://llumatics.com/#organitzacio" },
  "knowsAbout": ["Fotografia química", "Fotografia de concerts", "Edició gràfica"],
  "sameAs": ["https://pocallum.cat/", "https://112books.eu/"]
}
```

Les persones col·laboradores (Jesús Joglar, Jordi d'Osona i altres) tindran la seva pròpia entitat `Person` quan participin en una formació, amb el seu consentiment.

### 3.4 Fitxa de taller: `Course` amb `CourseInstance`

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://llumatics.com/tallers/revelat-bn/#curs",
  "name": "Revelat de pel·lícula en blanc i negre",
  "description": "Aprèn a revelar els teus rodets de blanc i negre, del tanc a l'assecat.",
  "inLanguage": "ca",
  "provider": { "@id": "https://llumatics.com/#organitzacio" },
  "educationalLevel": "Iniciació",
  "teaches": ["Revelat de pel·lícula", "Química fotogràfica"],
  "hasCourseInstance": [{
    "@type": "CourseInstance",
    "courseMode": "Onsite",
    "startDate": "2026-10-15T18:00:00+02:00",
    "endDate": "2026-10-15T21:00:00+02:00",
    "location": { "@id": "https://llumatics.com/#organitzacio" },
    "instructor": { "@id": "https://llumatics.com/#joan" },
    "offers": {
      "@type": "Offer",
      "price": "170",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": "https://llumatics.com/tallers/revelat-bn/"
    }
  }]
}
```

Es genera des del frontmatter. Si el taller no té dates, s'omet `hasCourseInstance`.

### 3.5 Sessió amb data: `Event`

Cada sessió concreta de l'agenda (i cada formació flash) porta també un `Event`. És el tipus amb més possibilitats de sortir als resultats d'esdeveniments de Google.

```json
{
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  "name": "Tarda Holga a la Nau Bostik",
  "startDate": "2026-10-08T18:00:00+02:00",
  "endDate": "2026-10-08T20:00:00+02:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": { "@id": "https://llumatics.com/#organitzacio" },
  "organizer": { "@id": "https://llumatics.com/#organitzacio" },
  "image": ["https://llumatics.com/images/tarda-holga-2026.jpg"],
  "description": "Trobada gratuïta per disparar amb Holga i celebrar la Holga Week.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://llumatics.com/tallers/tarda-holga-2026/"
  }
}
```

Si una sessió es cancel·la o s'ajorna, s'actualitza `eventStatus` (`EventCancelled`, `EventRescheduled`) en lloc d'esborrar la pàgina.

### 3.6 Altres tipus

| Tipus | On | Per a què |
|---|---|---|
| `WebSite` | Portada | Identificar el web i el seu nom |
| `BreadcrumbList` | Totes les pàgines interiors | Ruta de navegació als resultats |
| `Article` o `BlogPosting` | Articles del blog | Autor, data, imatge |
| `FAQPage` | Pàgina de preguntes freqüents | Google ja no en mostra resultats enriquits per a aquest tipus de webs, però el contingut de preguntes i respostes és molt útil per als assistents d'IA i per a les persones. Les preguntes han de ser visibles a la pàgina |
| `ImageObject` amb `creator` i `copyrightNotice` | Imatges destacades | Autoria de les fotografies pròpies |

### 3.7 Validació

- Schema Markup Validator (validator.schema.org), per a la sintaxi.
- Rich Results Test de Google, per als tipus que encara admeten resultats enriquits.
- Una prova al build: que cada fitxa amb dates tingui un `startDate` vàlid i un preu visible a la pàgina.

---

## 4. Rastrejadors d'IA i `robots.txt`

### 4.1 Els tres tipus de rastrejadors

| Tipus | Què fa | Exemples (token de `robots.txt`) |
|---|---|---|
| **Cerca clàssica** | Indexa per als resultats del cercador | `Googlebot`, `Bingbot` |
| **Cerca amb IA** | Indexa per citar el web dins les respostes d'un assistent | `OAI-SearchBot` (ChatGPT), `Claude-SearchBot` (Claude), `PerplexityBot` (Perplexity) |
| **Petició d'una persona** | Llegeix una pàgina quan algú ho demana a l'assistent | `ChatGPT-User`, `Claude-User`, `Perplexity-User` |
| **Entrenament** | Recull contingut per entrenar models | `GPTBot` (OpenAI), `ClaudeBot` (Anthropic), `Google-Extended` (Gemini), `CCBot` (Common Crawl), `Applebot-Extended` |

**Detalls importants:**

- Bloquejar `Google-Extended` **no** treu Llumàtics de la cerca de Google ni de les AI Overviews: aquestes funcionen amb l'índex normal de Googlebot. No hi ha manera de quedar-se a Google i sortir de les AI Overviews.
- Bloquejar `ClaudeBot` o `GPTBot` només impedeix l'entrenament. Les citacions continuen passant pels seus rastrejadors de cerca.
- `robots.txt` és una declaració d'intencions que respecten els rastrejadors honestos. No és una barrera tècnica.

### 4.2 La decisió: entrenament sí o no

**Els rastrejadors de cerca amb IA s'han de deixar entrar sempre.** És el que fa que ChatGPT, Claude o Perplexity puguin recomanar Llumàtics quan algú pregunta on aprendre a revelar a Barcelona.

**L'entrenament és una decisió de valors:**

| | Permetre l'entrenament | Bloquejar l'entrenament |
|---|---|---|
| A favor | Els models "coneixen" Llumàtics fins i tot sense cercar | Coherent amb el discurs de Llumàtics i de LinuxBCN: control sobre la pròpia obra |
| En contra | Les fotografies i els textos propis poden acabar dins de models comercials | Una mica menys de presència en les respostes que no fan cerca |

**Proposta per defecte:** permetre tota la cerca (clàssica i amb IA) i bloquejar l'entrenament. És coherent amb els valors de la casa i el cost en visibilitat és petit, perquè els assistents fan cada vegada més cerques en directe. (CONFIRMAR)

### 4.3 `robots.txt` proposat

```
# llumatics.com — robots.txt

# Cerca clàssica
User-agent: Googlebot
User-agent: Bingbot
Allow: /

# Cerca i citació dins d'assistents d'IA
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
Allow: /

# Entrenament de models (decisió de Llumàtics: no)
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: Bytespider
User-agent: meta-externalagent
Disallow: /

# Resta de rastrejadors
User-agent: *
Allow: /

Sitemap: https://llumatics.com/sitemap.xml
```

La llista de rastrejadors canvia sovint. Cal revisar-la cada sis mesos amb una llista mantinguda per la comunitat (per exemple, el repositori `ai-robots-txt` de GitHub).

### 4.4 `llms.txt`: no és prioritari

`llms.txt` és un fitxer proposat el 2024 per oferir als models un resum del web. A data d'avui:

- Google ha dit explícitament que la seva cerca no el fa servir, ni per al rànquing ni per a les funcions d'IA.
- Els estudis independents no hi troben cap efecte en les citacions dels assistents.
- On sí que té un ús real és en les eines d'agents i de programació.

**Decisió:** no és una prioritat. Si es vol fer (costa vint minuts), que sigui un resum net del que és Llumàtics i dels enllaços principals, i que es generi automàticament des de Hugo perquè no quedi desactualitzat. Mai a canvi de dedicar menys temps al contingut.

---

## 5. SEO per a IA: com ser citat

### 5.1 Com funcionen els assistents quan cerquen

Els assistents amb cerca (Google AI Mode i AI Overviews, ChatGPT, Claude, Perplexity, Copilot) funcionen de manera semblant:

1. Reben una pregunta ("On puc aprendre a revelar en blanc i negre a Barcelona?").
2. La descomponen en diverses cerques més concretes. Google ho anomena *query fan-out*: "taller revelat Barcelona", "escola fotografia analògica Barcelona", "preu taller revelat", "laboratori de lloguer Barcelona"…
3. Recuperen pàgines dels seus índexs (el de Google, el de Bing o els seus propis).
4. Redacten una resposta i hi citen les fonts.

**Conseqüència:** per ser citat cal aparèixer a les cerques concretes en què es descompon la pregunta. Això vol dir pàgines que responguin preguntes concretes de manera clara, completa i verificable.

### 5.2 Què fa que un text sigui citable

- **Respostes clares al principi.** Cada pàgina i cada apartat comença amb la resposta, i després en dona el detall. Per exemple, una fitxa de taller hauria de començar dient què és, per a qui, quant dura, quant costa i on es fa, en dues frases.
- **Fets concrets i verificables.** Preus, durades, nombre de places, material inclòs, adreça, horaris. Els assistents necessiten dades; les frases buides no les poden citar.
- **Coneixement propi.** El que només Llumàtics sap: temps de revelat comprovats, comparacions fetes al laboratori, errors habituals de l'alumnat. És el contingut que no es troba enlloc més i, per tant, el que s'acaba citant.
- **Imatges pròpies amb text alternatiu descriptiu.** Les funcions d'IA de Google també mostren imatges i vídeos, i una fotografia original ben descrita és una altra porta d'entrada.
- **Autoria visible.** Qui ho escriu, quina experiència té. Una signatura al final de cada article, amb enllaç a "Qui som".
- **Dates visibles.** "Actualitzat el…" als articles i a les fitxes, perquè els assistents prefereixen informació recent.

### 5.3 Què no cal fer

La guia de Google del 2026 desmenteix explícitament diverses pràctiques que es venen com a "GEO":

- No cal escriure en un estil especial per a la IA.
- No cal fer versions en Markdown de les pàgines ni fitxers especials.
- No serveix comprar o fabricar mencions de la marca.

### 5.4 Presència fora del web

Els assistents també es basen en el que es diu de Llumàtics en altres llocs:

- **Fitxes de directoris i agendes** (apartat 6.3).
- **Mencions a la premsa local** i a mitjans de barri.
- **Ressenyes** a Google i altres plataformes.
- **Pàgines d'entitats amb què es col·labora:** la Nau Bostik, 9 Barris Imatge, 112Books, les persones col·laboradores.
- **Galeries internacionals** de les efemèrides (Pinhole Day, Holga Week), que enllacen el lloc de cada taller.

---

## 6. Posicionament local

### 6.1 Google Business Profile

Per a una escola amb lloc físic, la fitxa de Google és tan important com el web. És el que surt al mapa quan algú busca "taller fotografia analògica Barcelona".

- **Categoria principal:** la més propera a "escola de fotografia" que ofereixi Google. Categories secundàries: taller d'art, escola d'art (CONFIRMAR les disponibles).
- **Nom:** "Llumàtics", exactament així. Sense afegir paraules clau al nom (va contra les normes de Google i pot comportar la suspensió de la fitxa).
- **Adreça:** la de la Nau Bostik, amb indicacions d'accés (porta, planta).
- **Horaris:** els d'atenció o els de les activitats, sempre actualitzats. Si l'espai només obre durant els tallers, cal dir-ho a la descripció.
- **Descripció:** amb "fotografia analògica" i "química", seguint la guia de veu.
- **Fotografies:** pròpies, sovint. Laboratori, mans treballant, l'espai, resultats.
- **Publicacions:** cada formació flash i cada taller amb data nova.
- **Preguntes i respostes:** omplir-les amb les preguntes reals que arriben per correu.
- **Ressenyes:** demanar-les sempre al final de cada taller amb un enllaç directe (un codi QR al laboratori i un correu de seguiment). Respondre-les totes, també les negatives, amb calma.

### 6.2 Nom, adreça i contacte coherents

El nom, l'adreça i el contacte han de ser **idèntics** al web, a Google Business Profile, a Bing Places, a Apple Maps (Apple Business Connect), a OpenStreetMap, a Instagram i a tots els directoris. Qualsevol diferència (una "C/" al costat d'un "Carrer", un telèfon diferent) resta confiança.

### 6.3 Directoris i agendes

| On | Per què |
|---|---|
| Bing Places | Alimenta Bing i Copilot |
| Apple Business Connect | Mapes d'iPhone i Siri |
| OpenStreetMap | Mapa lliure, coherent amb els valors de la casa; el fan servir moltes aplicacions |
| Web de la Nau Bostik | Enllaç des de l'espai on és l'escola |
| 9 Barris Imatge | Comunitat local |
| Agendes culturals (Guia de Barcelona de l'Ajuntament, agendes de barri, Time Out, agregadors de plans) | Cada flash i cada taller amb data. Hi ha agregadors que ja publiquen tallers de laboratori d'altres centres |
| Galeries de les efemèrides | Pinhole Day i Holga Week, amb enllaç al web |

### 6.4 Pàgina de contacte i ubicació

- Adreça completa com a text (no només en una imatge o un mapa).
- Com arribar-hi: metro, bus, Rodalies, bicicleta.
- Accessibilitat física de l'espai: ascensor, graons, lavabo adaptat (CONFIRMAR). És informació útil per a les persones i també per als assistents.
- Mapa incrustat d'OpenStreetMap (sense galetes de tercers) en lloc del de Google.

---

## 7. Estratègia de paraules clau i contingut

### 7.1 Mapa de cerques

Tres tipus d'intenció, tres tipus de pàgina:

| Intenció | Exemples | Pàgina que respon |
|---|---|---|
| **Comprar o inscriure's** (local) | taller revelat Barcelona, curs fotografia analògica Barcelona, escola fotografia analògica Barcelona, taller cianotípia Barcelona, laboratori blanc i negre Barcelona | Fitxes de taller, pàgina de formació, portada |
| **Aprendre** (informativa) | com revelar un rodet, revelador casolà, quin paper fotogràfic triar, com escanejar negatius, què és una estenopeica | Articles i guies del blog |
| **Marca** | Llumàtics, llumatics, Llumàtics Nau Bostik | Portada, Qui som, Google Business Profile |

**Per idioma:**

| Concepte | CA | ES | EN |
|---|---|---|---|
| Curs general | curs de fotografia analògica | curso de fotografía analógica | film photography course |
| Revelat | taller de revelat | taller de revelado | film developing workshop |
| Laboratori | laboratori fotogràfic | laboratorio fotográfico | darkroom |
| Positivat | positivat, còpies en paper | positivado, ampliación | darkroom printing |
| Ubicació | a Barcelona | en Barcelona | in Barcelona |

La versió anglesa té un públic propi i valuós: persones estrangeres que viuen a Barcelona i turistes que busquen una activitat diferent ("darkroom workshop Barcelona", "film photography class Barcelona").

**Validar abans de prioritzar:** el volum real de cada cerca s'ha de comprovar a Search Console, al planificador de paraules clau de Google Ads i a les suggerències de cerca. Aquesta taula és un punt de partida.

### 7.2 Arquitectura de contingut

```
Portada
├── Formació (Tallers, cursos i recorreguts)
│   ├── Línies del metro (una pàgina per línia)
│   │   └── Fitxes de taller
│   ├── Formacions flash
│   ├── Tutoria fotogràfica
│   └── Quin curs em convé? (recomanador)
├── Agenda
├── Blog / Guies
│   ├── Guies pràctiques (enllacen tallers)
│   └── Cròniques de tallers i efemèrides
├── Regala un curs
├── Qui som (persones, espai, filosofia)
├── Preguntes freqüents
└── Contacte i com arribar-hi
```

Cada línia del metro té la seva pròpia pàgina, amb text real (no només un llistat). Aquestes pàgines poden posicionar per cerques àmplies ("curs de revelat i positivat Barcelona").

### 7.3 Guies prioritàries

Les guies són el contingut que més cerques capta i el que més citen els assistents. Totes amb imatges pròpies i un enllaç al taller corresponent.

| Guia | Cerca principal | Taller enllaçat |
|---|---|---|
| Fotografia analògica o química? Per què diem química | fotografia analògica | Portada, Fonaments |
| Com revelar un rodet de blanc i negre: guia pas a pas | com revelar un rodet | Revelat B/N |
| Caffenol: revelar amb cafè | revelador de cafè | Reveladors artesanals |
| Com escanejar negatius: resolució, profunditat de bits i errors habituals | escanejar negatius | Digitalització amb escàner |
| Què és la cianotípia i com fer-ne una | cianotípia | Cianotípia |
| Primeres passes amb una càmera de mig format | mig format, Hasselblad | Hasselblad, Retrat 6×6 |
| Què és la solargrafia | solargrafia | Solargrafia |
| On revelar pel·lícula a Barcelona | revelat Barcelona | Revelat B/N |
| Com fer el teu primer fotollibre | fer un fotollibre | Fotollibre |

L'article "On revelar pel·lícula a Barcelona" pot incloure laboratoris i botigues de la ciutat. Ser generós amb la competència dona credibilitat, i és el tipus de pàgina que els assistents citen quan algú fa aquesta pregunta.

### 7.4 Estructura de cada guia

1. Títol que respon a una pregunta real.
2. Resposta en dues o tres frases al principi.
3. Material necessari (llista).
4. Passos numerats amb una fotografia pròpia per pas.
5. Errors habituals.
6. "Si ho vols aprendre amb nosaltres" i l'enllaç al taller.
7. Autoria i data d'actualització.

### 7.5 Pàgina de preguntes freqüents

Les preguntes que arriben realment per correu, respostes directament. Exemples:

- Cal tenir càmera per apuntar-se?
- Què passa si no he revelat mai res?
- El material està inclòs?
- Puc fer servir el laboratori pel meu compte?
- Feu tallers en castellà o en anglès?
- Feu tallers per a grups i escoles?
- Puc regalar un taller?

---

## 8. Accessibilitat

### 8.1 Marc legal i decisió

- La Llei 11/2023 transposa a l'Estat espanyol la Directiva europea d'accessibilitat i és plenament aplicable des del 28 de juny de 2025.
- Les microempresses (menys de 10 persones treballadores i una facturació anual no superior a 2 milions d'euros) que ofereixen serveis n'estan exemptes. **Llumàtics no està obligada per llei.**
- **Proposta:** complir-la igualment, amb objectiu WCAG 2.2 nivell AA. Tres motius:
  - és coherent amb els valors de la casa;
  - gairebé tot el que demana l'accessibilitat també millora el SEO (estructura, text alternatiu, rendiment, idioma);
  - la gent gran que vol digitalitzar els records de família (un dels públics del recomanador) se'n beneficia directament.

### 8.2 Requisits principals

**Estructura i llengua**

- [ ] Un sol `<h1>` per pàgina i una jerarquia de títols sense salts (`h2` → `h3`, mai `h2` → `h4`).
- [ ] Regions de pàgina: `<header>`, `<nav>`, `<main>`, `<footer>`.
- [ ] Enllaç "Salta al contingut" al principi, visible quan rep el focus.
- [ ] `lang` correcte a cada pàgina i a cada fragment en un altre idioma.
- [ ] Títols de pàgina únics i descriptius.

**Imatges** (el cas especial d'un web de fotografia)

- [ ] Totes les imatges informatives porten `alt` descriptiu.
- [ ] Les imatges decoratives porten `alt=""`.
- [ ] Les fotografies d'obra es descriuen com ho faria un fotògraf: què es veu, la llum, el procés. Per exemple: "Còpia en cianotípia d'una fulla de falguera, blau intens sobre paper d'aquarel·la". Un bon text alternatiu és accessibilitat, és SEO d'imatges i és contingut citable per als assistents.
- [ ] El text alternatiu no comença per "Imatge de…" ni repeteix el peu de foto.
- [ ] Cap text important dins d'una imatge (cartells, preus). Si hi ha un cartell, el text també ha d'estar a la pàgina.

**Color i contrast**

- [ ] Contrast mínim de 4,5:1 per al text normal i de 3:1 per al text gran i els elements d'interfície.
- [ ] El color no és mai l'única manera de transmetre informació (per exemple, l'estat d'un taller: "complet" també en text, no només en vermell).
- [ ] Les línies del metro tenen color **i** nom o número.
- [ ] Els dos temes, clar i fosc, compleixen els contrastos.

**Teclat i focus**

- [ ] Tot es pot fer amb el teclat: menú, galeria, lightbox, recomanador, pop-up, formularis.
- [ ] Focus sempre visible, amb un indicador clar (mai `outline: none` sense alternativa).
- [ ] La lightbox atrapa el focus mentre és oberta, es tanca amb Esc i torna el focus a la imatge d'origen.
- [ ] Ordre del focus lògic.

**Mida dels objectius**

- [ ] Botons i enllaços clicables d'almenys 24×24 px (WCAG 2.2) i, idealment, 44×44 px en mòbil.

**Moviment**

- [ ] Respectar `prefers-reduced-motion` (pop-up, transicions, carrusels).
- [ ] Cap contingut que es mogui sol durant més de 5 segons sense poder-lo aturar.
- [ ] Cap vídeo que es reprodueixi automàticament amb so.

**Formularis** (Brevo, recomanador, inscripcions)

- [ ] Cada camp té una etiqueta `<label>` visible.
- [ ] Els errors s'expliquen amb text, al costat del camp, i s'anuncien als lectors de pantalla.
- [ ] Casella de consentiment amb text clar.
- [ ] Cap CAPTCHA visual sense alternativa.

**Recomanador i pop-up**

- [ ] Cada pas del recomanador és un grup de controls amb `<fieldset>` i `<legend>`.
- [ ] El canvi de pas mou el focus al títol del pas nou.
- [ ] Barra de progrés amb text ("Pas 2 de 4").
- [ ] El pop-up es pot tancar amb teclat, té `aria-label` i no roba el focus en aparèixer.

**Vídeo**

- [ ] Subtítols en tots els vídeos amb veu.
- [ ] Transcripció o descripció per als vídeos de procés.

**Documents**

- [ ] Els PDF que es publiquin (programes, fitxes) han de ser accessibles, o millor encara, el contingut ha d'estar també en HTML.

### 8.3 Declaració d'accessibilitat

Una pàgina breu, voluntària, que expliqui:
- l'objectiu (WCAG 2.2 AA);
- el que se sap que encara no compleix;
- com informar d'un problema (correu).

Dona confiança i és una pràctica poc habitual en webs petits.

### 8.4 Com comprovar-ho

- **Automàtic:** Lighthouse (Chrome), axe DevTools, WAVE i Pa11y o axe-core en una GitHub Action que revisi les pàgines principals a cada desplegament.
- **Manual (les eines automàtiques només en detecten una part):** recórrer el web només amb el teclat; provar-lo amb un lector de pantalla (NVDA a Windows, Orca a Linux, VoiceOver a macOS i iOS); fer zoom al 200 % i comprovar que res no es trenca.

---

## 9. Privacitat i mesura

### 9.1 Coherència amb els valors

Llumàtics no fa seguiment de les visites. Això és compatible amb el SEO: les dades que importen per al posicionament no venen del web, sinó dels cercadors.

**Fonts de dades sense seguiment al web:**

- **Google Search Console:** cerques, impressions, clics, posició mitjana, pàgines indexades, Core Web Vitals.
- **Bing Webmaster Tools:** el mateix per a Bing, que alimenta Copilot i altres assistents.
- **Google Business Profile:** cerques que mostren la fitxa, peticions d'indicacions, clics al web.

**Opcional, si es volen dades de visites:** una analítica sense galetes i de programari lliure, allotjada per Llumàtics o en un servei respectuós (per exemple, GoatCounter, Umami o Plausible). No necessita bàner de galetes si no recull dades personals. (CONFIRMAR si es vol.)

### 9.2 Indicadors

| Indicador | Font | Freqüència |
|---|---|---|
| Pàgines indexades / pàgines publicades | Search Console, Bing | Mensual |
| Impressions i clics de les cerques prioritàries | Search Console | Mensual |
| Posició mitjana de les 10 cerques clau | Search Console | Mensual |
| Core Web Vitals en mòbil | Search Console | Trimestral |
| Visites a la fitxa, indicacions i trucades | Google Business Profile | Mensual |
| Nombre i valoració mitjana de les ressenyes | Google Business Profile | Mensual |
| Presència en respostes d'IA | Prova manual (9.3) | Mensual |
| Inscripcions i "M'interessa" | Brevo | Mensual |
| Errors d'accessibilitat automàtics | GitHub Action | A cada desplegament |

### 9.3 Prova mensual als assistents d'IA

No hi ha cap eina fiable i gratuïta que mesuri la presència en respostes d'IA. La manera honesta és provar-ho a mà, cada mes, amb les mateixes preguntes, i apuntar-ne el resultat en un full de càlcul.

**Assistents:** Google (AI Mode i AI Overviews), ChatGPT, Claude, Perplexity, Copilot i Gemini.

**Preguntes de prova:**

1. On puc aprendre fotografia analògica a Barcelona?
2. Busco un taller de revelat en blanc i negre a Barcelona.
3. Escola de fotografia química a Barcelona.
4. Taller de cianotípia a Barcelona.
5. On puc aprendre a fer servir una Hasselblad a Barcelona?
6. Curs de fotografia estenopeica a Barcelona.
7. Com puc digitalitzar bé els negatius de la meva família?
8. Regal original per a algú a qui agrada la fotografia, a Barcelona.
9. Darkroom workshop in Barcelona.
10. Curso de revelado analógico en Barcelona.

**Què s'apunta:** si Llumàtics apareix, si se'l cita amb enllaç, quina informació en diu (i si és correcta) i quins competidors apareixen.

Si un assistent diu alguna cosa incorrecta sobre Llumàtics, la solució no és "corregir l'assistent", sinó fer que la informació correcta sigui clara, visible i coherent al web i a tots els directoris.

---

## 10. Competència

### 10.1 Panorama

A Barcelona la formació en fotografia química la fan principalment:

- **Centres cívics** amb laboratori, que ofereixen tallers d'iniciació al revelat a preus baixos.
- **Botigues i laboratoris** de fotografia analògica que fan cursos o tallers puntuals.
- **Escoles de fotografia generalistes** amb algun curs analògic dins d'una oferta majoritàriament digital.
- **Fotògrafs i col·lectius** que fan tallers de processos alternatius de manera esporàdica.

(CONFIRMAR i completar amb una cerca local a Google i Google Maps.)

### 10.2 On guanya Llumàtics

| Avantatge | Com es fa visible als cercadors |
|---|---|
| Especialització total en química | Pàgines per a cada procés, amb profunditat que una escola generalista no té |
| Oferta àmplia i estructurada (línies del metro) | Pàgines de línia i enllaçat intern |
| Processos alternatius i experimentals | Guies i fitxes de cianotípia, estenopeica, solargrafia, antotípia |
| Recomanador i tutoria | Captura qui no sap què vol |
| Formacions flash amb efemèrides | Contingut fresc amb data, esdeveniments a l'agenda i a les galeries internacionals |
| Imatges pròpies | Cerca d'imatges i funcions visuals de la IA |
| Tres idiomes | Públic internacional de Barcelona |

### 10.3 Anàlisi periòdica

Cada trimestre:

1. Buscar les 10 cerques clau en una finestra privada, en català, castellà i anglès.
2. Apuntar qui surt als 5 primers resultats i al mapa.
3. Mirar què té cada competidor que Llumàtics no té (una guia, una pàgina, ressenyes) i decidir si cal respondre-hi.

---

## 11. Full de ruta

### Setmana 1 · Prioritat zero

1. Diagnosticar i corregir el bucle de redireccions (apartat 1.1).
2. Verificar Search Console i Bing Webmaster Tools, i enviar-hi el sitemap.
3. `robots.txt` nou (apartat 4.3).
4. Inspecció d'URL de les pàgines principals.

### Mes 1 · Fonaments

5. Canònics, `hreflang` i `title`/`description` únics a totes les pàgines (apartat 2.2).
6. Dades estructurades d'organització, persona, breadcrumbs, cursos i esdeveniments (apartat 3).
7. Google Business Profile complet, i Bing Places, Apple Business Connect i OpenStreetMap (apartat 6).
8. Rendiment de les imatges (apartat 2.5).
9. Revisió d'accessibilitat de la portada, la pàgina de formació, una fitxa i el recomanador (apartat 8).
10. Pàgina de contacte i com arribar-hi (apartat 6.4).

### Trimestre 1 · Contingut i autoritat

11. Les tres primeres guies: "Química o analògica", "Com revelar un rodet" i "On revelar a Barcelona".
12. Pàgina de preguntes freqüents.
13. Pàgines de línia del metro amb text propi.
14. Pàgina "Qui som" amb les persones i l'espai.
15. Sistema de ressenyes al final de cada taller.
16. Alta a agendes i directoris.
17. IndexNow i la comprovació d'accessibilitat a cada desplegament.
18. Declaració d'accessibilitat.
19. Primera prova mensual als assistents d'IA.

### Continu

- Una guia nova al mes.
- Una crònica de cada formació flash, amb fotos pròpies.
- Revisió trimestral de la competència.
- Revisió semestral del `robots.txt`.

---

## 12. Pendents

1. Diagnòstic del bucle de redireccions (prioritat zero).
2. Si hi ha un proxy (Cloudflare o similar) davant de GitHub Pages, i amb quina configuració SSL.
3. L'adreça exacta i les coordenades de la Nau Bostik per a les dades estructurades.
4. La decisió sobre els rastrejadors d'entrenament (apartat 4.2).
5. Si es vol analítica sense galetes, i quina.
6. Si ja existeix una fitxa de Google Business Profile.
7. L'accessibilitat física de l'espai (ascensor, graons).
8. El compte d'Instagram i altres perfils per a `sameAs`.
9. Si hi ha vídeos al web (subtítols).
