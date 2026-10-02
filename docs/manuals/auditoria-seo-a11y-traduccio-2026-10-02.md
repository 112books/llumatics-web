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

### Segona tanda
- **llms.txt:** un sol H1, resum citable, enllaços en format Markdown, i fets corregits
  (tres idiomes i agenda amb dates).
- **WebSite** JSON-LD global i **Product/AggregateOffer** a /regala/.
- **Galeria i portada del blog:** convertides a button amb aria-label i data-gallery (teclat).
- **Errors de formulari:** role=alert al val-regal i error inline (sense alert()) al contacte.
- **Event.location:** ara inclou l'adreça postal (Nau Bostik, 08027).
- **og:image:width/height** fixos: eliminats.
- **Agenda:** els items passen de h3 a h2 (sense salt de jerarquia).
- **Cerca:** tret el role=listbox incorrecte.
- **Fitxa pedagògica:** dt/dd dins de dl; scope=col a la taula de preus.

- **Focus visible:** .search-input i .search-result amb :focus-visible d'alt contrast.
- **og:image:alt** per idioma (usa el títol de la pàgina; abans era català fix).
- **Títols de secció** descriptius («Blog de fotografia analògica», «Agenda de tallers...»).
- **Coherència ES:** «cuarto oscuro»; comentaris YAML de del-carrer-al-llibre traduïts.
- **BreadcrumbList** JSON-LD a totes les pàgines (AEO).

### Eines noves al panell
- /admin/subscriptors.php — comptador de subscriptors de Brevo (butlletí, waitlist, total).
- /admin/impacte.php — impacte del cupó regal, del recomanador i dels cursos nous/flash.

## Pendent (baixa prioritat)

- og:image trencada a 6 fitxes /privat/doc/ (noindex): l'image del frontmatter apunta a un fitxer inexistent.
- Correu de confirmació del val-regal i notificació interna escrits en català fix al JS.
- alt buit a les imatges de la galeria del shortcode galeria.html (no tenen descripcio a l'origen).
- Defaults amb fallback catala latents a ~40 plantilles (avui tapats per la paritat i18n).
- Revisio visual manual amb navegador (contrast, focus, teclat) en dispositiu real.
