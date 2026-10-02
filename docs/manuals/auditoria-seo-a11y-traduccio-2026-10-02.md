---
titol: "Auditoria SEO, AEO, accessibilitat i traducció"
data: 2026-10-02
estat: en curs
---

# Auditoria SEO / AEO / accessibilitat / traducció — 2026-10-02

Auditoria feta sobre 1.426 pàgines del build i les plantilles. A sota, què s'ha
corregit i què queda pendent.

## Corregit

### SEO / AEO
- **JSON-LD amb @id penjants:** Organization/Person només s'emetien a la home, i 250
  pàgines referencien #organization/#person. Ara el graf va a TOTES les pàgines.
- **Durada ISO 8601:** PT3.5H (invàlid) → PT3H30M.
- **Agenda:** el title de cada sessió inclou la data (abans 10-11 pàgines compartien títol).
- **Esdeveniments passats:** status past passa a noindex, follow i s'exclou del sitemap.
- **Sitemap:** plantilla pròpia que exclou noindex, esdeveniments passats i taxonomies amb menys
  de 2 elements. CA passa de 287 a 140 URLs; es preserven hreflang.
- **Sitemap de CA inaccessible:** /ca/sitemap.xml redirigia a /sitemap.xml (l'índex) per la
  regla .htaccess de ca/. Afegida excepció.
- **Títols massa llargs:** el subtítol només s'afegeix si el títol resultant cap en ~48 caràcters.
- **Build net:** deploy.sh usa --cleanDestinationDir (elimina fitxers obsolets de public/).

### Accessibilitat
- **Contrast:** .btn--accent, .hero__eyebrow, .info-box__proxim-badge,
  .quiz__step.is-current .quiz__step-num i .btn--primary:hover passen de --color-accent
  (#0096D2, 3.34:1 amb blanc) a --color-accent-dark (#00719E).
- **Skip link** «Salta al contingut» a totes les pàgines.
- **Cerca:** aria-label a l'input (totes les pàgines i el 404).
- **Formulari «Avisa'm»:** aria-label als inputs de correu i aria-expanded als botons.

### Traducció
- **Materials privats:** 38 títols catalans a ES/EN traduïts.
- **Ortografia ES:** «cianotipia» sense accent.
- **Strings d'interfície hardcoded:** «des de», «Tots», «Filtrar per àmbit», «Màxim N persones»,
  «Inscripció →» i el text del 404 ara passen per i18n. Claus noves CA/ES/EN.

### Eines noves al panell
- /admin/subscriptors.php — comptador de subscriptors de Brevo (butlletí, waitlist, total).
- /admin/impacte.php — impacte del cupó regal, del recomanador i dels cursos nous/flash.

## Pendent

### SEO
- Event.location sense PostalAddress (la comparació in de Go template no encaixa).
- og:image:width/height fixos (1322×744) per a totes les imatges.
- llms.txt: dos H1, sense resum, URLs nuves; diu «sota demanda» i «català i castellà».
- Falta WebSite global i Product/Offer a /regala/.
- og:image trencada a 6 /privat/doc/ (noindex).
- Sense BreadcrumbList.
- Títols curts de secció («Blog», «Agenda», «Els espais»).

### Accessibilitat
- Galeria/portada del blog no operables amb teclat.
- Errors de formulari sense role=alert ni associació (gift, contacte).
- aria-label encara en català en alguns llocs (breadcrumb, filtres, contacte).
- alt buit a imatges de contingut (galeries) i alt copiat al lightbox.
- Indicador de focus eliminat (.search-input, .search-result a).
- role=listbox als resultats de cerca sense role=option.
- Salt h1 → h3 a l'agenda; taules sense scope; dt/dd fora de dl.

### Traducció
- og:image:alt català a les portades ES/EN.
- Correu de confirmació del val-regal sempre en català.
- Comentari YAML català a del-carrer-al-llibre (ES/EN).
- ES inconsistent: «cuarto oscuro» vs «laboratorio oscuro».
- Defaults amb fallback català latents a ~40 plantilles.
