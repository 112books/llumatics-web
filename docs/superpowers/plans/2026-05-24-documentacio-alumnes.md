# Documentació nominal alumnes — Pla d'implementació

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sistema complet per accedir a la documentació nominal dels tallers: formulari d'identificació → doble opt-in Brevo → pàgina de documentació amb nom injectat → PDF al navegador amb certificat formal.

**Architecture:** Formulari HTML propi (estilitzat) envia dades a Brevo via el seu endpoint de subscripció públic. Prèviament el JS guarda les dades a `localStorage`. Brevo redirigeix a `/confirmat/`, que llegeix `localStorage` i redirigeix a `/tallers/[slug]/privat/doc/?nom=...`. El layout `private-doc.html` injecta el nom al document i al certificat final. `@media print` formata el PDF.

**Tech Stack:** Hugo templates, Vanilla JS, CSS `@media print`, Brevo embedded subscription form, localStorage

---

## Mapa de fitxers

| Fitxer | Acció | Responsabilitat |
|--------|-------|-----------------|
| `hugo.toml` | Modificar | Afegir `brevoListFormAction` |
| `themes/llumatics/layouts/_default/private.html` | Modificar | Formulari real Brevo + localStorage |
| `themes/llumatics/layouts/_default/confirmat.html` | Crear | Relay localStorage → `/doc/` |
| `themes/llumatics/layouts/_default/private-doc.html` | Crear | Layout documentació + injecció nom + certificat |
| `themes/llumatics/assets/css/main.css` | Modificar | Estils `.doc-*`, `.certificate`, extensió `@media print` |
| `themes/llumatics/assets/js/main.js` | Modificar | JS injecció nom a `/doc/` + relay a `/confirmat/` |
| `themes/llumatics/i18n/ca.yaml` | Modificar | Claus noves `private_*`, `certificate_*`, `confirmat_*` |
| `themes/llumatics/i18n/es.yaml` | Modificar | Ídem en castellà |
| `themes/llumatics/i18n/en.yaml` | Modificar | Ídem en anglès |
| `content/ca/confirmat/_index.md` | Crear | Pàgina relay (noindex) |
| `content/ca/tallers/revelat-bn/privat/doc/index.md` | Crear | Primera documentació de taller (prova) |
| `static/images/docs/` | Crear directori | Imatges de documentació |

---

## Task 1: Configuració Brevo (manual — sense codi)

Aquests passos els fa el propietari al panell de Brevo. Cal tenir el compte creat.

- [ ] **Pas 1.1: Crear la llista**
  Brevo dashboard → Contacts → Lists → Create a list → Nom: **"Alumnes Llumàtics"**. Apuntar l'ID de la llista (número a la URL).

- [ ] **Pas 1.2: Crear atributs de contacte**
  Contacts → Settings → Contact attributes → Add attribute:
  - `NOM` (Text)
  - `TALLER` (Text)
  - `IDIOMA` (Text)
  - `DATA_SOL·LICITUD` (Date)
  - `NEWSLETTER` (Boolean)

- [ ] **Pas 1.3: Crear el formulari de subscripció**
  Contacts → Forms → Create a form → tipus **Subscription form**.
  Camps a afegir:
  - Email (obligatori, ja hi és)
  - `NOM` (Text, obligatori)
  - `TALLER` (Text, hidden)
  - `IDIOMA` (Text, hidden)
  - `NEWSLETTER` (Boolean, checkbox)

  Configuració:
  - **Double opt-in:** activat
  - **Redirect URL (post-confirmació):** `https://llumatics.com/confirmat/`
  - **Lista:** "Alumnes Llumàtics"

- [ ] **Pas 1.4: Obtenir l'action URL del formulari**
  Al formulari creat → Share/Embed → seleccionar "HTML form" (no iframe).
  Copiar el valor de l'atribut `action` de la tag `<form>`. Tindrà aquest format:
  ```
  https://sibforms.com/serve/MUIFAxxxxxxxxxxxxxxxxxxxxxxxxxxx
  ```
  Guardar aquest valor — el necessitem al pas següent.

---

## Task 2: Paràmetres hugo.toml

**Fitxer:** `hugo.toml`

- [ ] **Pas 2.1: Afegir el param Brevo**

  Obrir `hugo.toml`. Localitzar el bloc `[params]` (línia ~55). Afegir just sota `web3formsKey`:

  ```toml
  brevoListFormAction = "https://sibforms.com/serve/MUIFA..."  # Form action URL de Brevo (subscripció alumnes)
  ```

  Substituir l'URL per la que s'ha obtingut al Pas 1.4.

- [ ] **Pas 2.2: Verificar build**
  ```bash
  hugo server -D
  ```
  Esperat: arrenca sense errors.

- [ ] **Pas 2.3: Commit**
  ```bash
  git add hugo.toml
  git commit -m "feat: afegeix brevoListFormAction a hugo.toml"
  ```

---

## Task 3: Claus i18n (CA / ES / EN)

**Fitxers:** `themes/llumatics/i18n/ca.yaml`, `es.yaml`, `en.yaml`

- [ ] **Pas 3.1: Afegir claus a ca.yaml**

  Afegir al final del fitxer:

  ```yaml
  # Pàgina privada — formulari d'identificació
  private_name_label: "Nom complet"
  private_name_placeholder: "El teu nom i cognoms"
  private_language_label: "Idioma del document"
  private_newsletter_label: "Vull rebre informació puntual sobre nous tallers i activitats de Llumàtics."
  private_submit_cta: "Sol·licita la documentació"
  private_confirm_message: "Perfecte! T'hem enviat un email de confirmació. Revisa la safata d'entrada (i el correu brossa, per si de cas)."
  private_footer_nominal: "La documentació és personal i intransferible. El document portarà el teu nom."

  # Pàgina /confirmat/ — relay
  confirmat_title: "Email confirmat"
  confirmat_message: "Redirigint a la documentació..."

  # Layout private-doc — capçalera del document
  doc_prepared_for: "Document preparat per a"
  doc_no_access_title: "Accés restringit"
  doc_no_access_message: "Accedeix primer des de la pàgina del taller per identificar-te."
  doc_no_access_cta: "Tornar al taller"
  doc_print_cta: "Imprimeix / Desa com a PDF →"
  doc_footer_copyright: "Document personal i intransferible · No es permet la distribució"

  # Certificat formal
  certificate_title: "Certificat de participació"
  certificate_certifies: "Certifica que"
  certificate_completed: "ha completat el taller"
  certificate_place: "Barcelona"
  certificate_issuer: "Llumàtics — Escola de fotografia fotoquímica"
  ```

- [ ] **Pas 3.2: Afegir claus a es.yaml**

  Afegir al final del fitxer:

  ```yaml
  # Pàgina privada — formulari d'identificació
  private_name_label: "Nombre completo"
  private_name_placeholder: "Tu nombre y apellidos"
  private_language_label: "Idioma del documento"
  private_newsletter_label: "Quiero recibir información puntual sobre nuevos talleres y actividades de Llumàtics."
  private_submit_cta: "Solicitar la documentación"
  private_confirm_message: "¡Perfecto! Te hemos enviado un email de confirmación. Revisa tu bandeja de entrada (y el correo no deseado, por si acaso)."
  private_footer_nominal: "La documentación es personal e intransferible. El documento llevará tu nombre."

  # Pàgina /confirmat/ — relay
  confirmat_title: "Email confirmado"
  confirmat_message: "Redirigiendo a la documentación..."

  # Layout private-doc — capçalera del document
  doc_prepared_for: "Documento preparado para"
  doc_no_access_title: "Acceso restringido"
  doc_no_access_message: "Accede primero desde la página del taller para identificarte."
  doc_no_access_cta: "Volver al taller"
  doc_print_cta: "Imprimir / Guardar como PDF →"
  doc_footer_copyright: "Documento personal e intransferible · No se permite su distribución"

  # Certificat formal
  certificate_title: "Certificado de participación"
  certificate_certifies: "Certifica que"
  certificate_completed: "ha completado el taller"
  certificate_place: "Barcelona"
  certificate_issuer: "Llumàtics — Escola de fotografia fotoquímica"
  ```

- [ ] **Pas 3.3: Afegir claus a en.yaml**

  Afegir al final del fitxer:

  ```yaml
  # Private page — identification form
  private_name_label: "Full name"
  private_name_placeholder: "Your full name"
  private_language_label: "Document language"
  private_newsletter_label: "I'd like to receive occasional updates about new workshops and activities from Llumàtics."
  private_submit_cta: "Request documentation"
  private_confirm_message: "Done! We've sent you a confirmation email. Check your inbox (and spam folder, just in case)."
  private_footer_nominal: "This documentation is personal and non-transferable. The document will include your name."

  # /confirmat/ relay page
  confirmat_title: "Email confirmed"
  confirmat_message: "Redirecting to your documentation..."

  # private-doc layout — document header
  doc_prepared_for: "Document prepared for"
  doc_no_access_title: "Restricted access"
  doc_no_access_message: "Please identify yourself first from the workshop page."
  doc_no_access_cta: "Back to the workshop"
  doc_print_cta: "Print / Save as PDF →"
  doc_footer_copyright: "Personal and non-transferable document · Distribution not permitted"

  # Formal certificate
  certificate_title: "Certificate of participation"
  certificate_certifies: "Certifies that"
  certificate_completed: "has completed the workshop"
  certificate_place: "Barcelona"
  certificate_issuer: "Llumàtics — School of photochemical photography"
  ```

- [ ] **Pas 3.4: Verificar build**
  ```bash
  hugo server -D
  ```
  Esperat: arrenca sense errors.

- [ ] **Pas 3.5: Commit**
  ```bash
  git add themes/llumatics/i18n/
  git commit -m "feat: claus i18n per a documentació nominal alumnes (CA/ES/EN)"
  ```

---

## Task 4: Formulari private.html

**Fitxer:** `themes/llumatics/layouts/_default/private.html`

Substituir el contingut complet del fitxer:

- [ ] **Pas 4.1: Reescriure private.html**

  ```html
  {{/* Layout: private.html — Formulari d'identificació alumnes → Brevo doble opt-in */}}
  {{ define "main" }}
  {{ $courseRef := .Params.course_ref | default (.File.Dir | path.Base) }}
  {{ $lang := .Language.Lang }}
  <div class="section container">

    <div class="private-gate">
      <div class="private-gate__box">
        <div class="private-gate__icon">🔒</div>
        <h1 class="private-gate__title">{{ i18n "private_title" }}</h1>
        <p class="private-gate__desc">{{ i18n "private_desc" }}</p>

        {{ if .Site.Params.brevoListFormAction }}
          <div id="private-form-wrap">
            <form
              id="private-brevo-form"
              action="{{ .Site.Params.brevoListFormAction }}"
              method="POST"
              class="private-form"
            >
              {{/* Camp nom */}}
              <label class="private-form__label" for="pf-nom">{{ i18n "private_name_label" }}</label>
              <input
                id="pf-nom"
                type="text"
                name="NOM"
                placeholder="{{ i18n "private_name_placeholder" }}"
                required
                autocomplete="name"
                class="private-form__input"
              >

              {{/* Camp email */}}
              <label class="private-form__label" for="pf-email">Email</label>
              <input
                id="pf-email"
                type="email"
                name="EMAIL"
                placeholder="{{ i18n "private_placeholder" }}"
                required
                autocomplete="email"
                class="private-form__input"
              >

              {{/* Camp idioma */}}
              <label class="private-form__label" for="pf-lang">{{ i18n "private_language_label" }}</label>
              <select id="pf-lang" name="IDIOMA" class="private-form__input">
                <option value="ca"{{ if eq $lang "ca" }} selected{{ end }}>Català</option>
                <option value="es"{{ if eq $lang "es" }} selected{{ end }}>Castellano</option>
                <option value="en"{{ if eq $lang "en" }} selected{{ end }}>English</option>
              </select>

              {{/* Camps hidden */}}
              <input type="hidden" name="TALLER" value="{{ $courseRef }}">
              <input type="hidden" name="email_address_check" value="">
              <input type="hidden" name="locale" value="{{ $lang }}">

              {{/* Newsletter opt-in */}}
              <label class="private-form__checkbox-label">
                <input type="checkbox" name="NEWSLETTER" value="true" class="private-form__checkbox">
                <span>{{ i18n "private_newsletter_label" }}</span>
              </label>

              <button type="submit" class="btn btn--primary private-form__submit">
                {{ i18n "private_submit_cta" }}
              </button>
            </form>

            <div id="private-confirm-msg" hidden class="private-gate__confirm">
              {{ i18n "private_confirm_message" }}
            </div>
          </div>
        {{ else }}
          <p style="color:var(--color-text-muted); font-size:0.875rem;">
            (Formulari pendent de configuració)
          </p>
        {{ end }}

        <p class="private-gate__footer">
          {{ i18n "private_footer_nominal" }}
        </p>
      </div>
    </div>

  </div>

  <script>
  (function() {
    var form = document.getElementById('private-brevo-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      var nom    = document.getElementById('pf-nom').value.trim();
      var lang   = document.getElementById('pf-lang').value;
      var taller = form.querySelector('[name="TALLER"]').value;

      if (!nom) return; // HTML5 required ja ho valida

      // Guardar a localStorage abans que Brevo redirigeixi
      try {
        localStorage.setItem('llum_doc', JSON.stringify({
          nom: nom,
          taller: taller,
          lang: lang
        }));
      } catch(err) {}

      // Amagar el formulari i mostrar missatge de confirmació
      form.style.display = 'none';
      var msg = document.getElementById('private-confirm-msg');
      if (msg) msg.removeAttribute('hidden');

      // Deixar que el formulari faci el submit normal a Brevo
    });
  })();
  </script>
  {{ end }}
  ```

- [ ] **Pas 4.2: Verificar que Hugo compila**
  ```bash
  hugo server -D
  ```
  Navegar a `http://localhost:1313/tallers/revelat-bn/privat/` — ha de mostrar el formulari amb els camps nom, email, idioma, taller (hidden) i checkbox newsletter.

- [ ] **Pas 4.3: Commit**
  ```bash
  git add themes/llumatics/layouts/_default/private.html
  git commit -m "feat: formulari d'identificació alumnes amb Brevo i localStorage"
  ```

---

## Task 5: Pàgina /confirmat/ (relay)

**Fitxers:**
- Crear: `content/ca/confirmat/_index.md`
- Crear: `themes/llumatics/layouts/_default/confirmat.html`

- [ ] **Pas 5.1: Crear el fitxer de contingut**

  ```bash
  mkdir -p /path/al/projecte/content/ca/confirmat
  ```

  Crear `content/ca/confirmat/_index.md`:

  ```markdown
  ---
  title: "Email confirmat"
  layout: "confirmat"
  noindex: true
  sitemap:
    disable: true
  robots: "noindex, nofollow"
  draft: false
  ---
  ```

- [ ] **Pas 5.2: Crear el layout confirmat.html**

  Crear `themes/llumatics/layouts/_default/confirmat.html`:

  ```html
  {{/* Layout: confirmat.html — Relay post-confirmació Brevo → /doc/ */}}
  {{ define "main" }}
  <div class="section container" style="min-height:60vh; display:flex; align-items:center; justify-content:center;">
    <div style="text-align:center; max-width:480px;">
      <div style="font-size:3rem; opacity:0.4; margin-bottom:1rem;">✓</div>
      <h1 style="font-family:var(--font-serif); font-size:var(--text-2xl); margin-bottom:0.75rem;">
        {{ i18n "confirmat_title" }}
      </h1>
      <p style="color:var(--color-text-muted);">{{ i18n "confirmat_message" }}</p>
    </div>
  </div>

  <script>
  (function() {
    try {
      var raw = localStorage.getItem('llum_doc');
      if (!raw) return;
      var data = JSON.parse(raw);
      if (!data.nom || !data.taller) return;
      localStorage.removeItem('llum_doc');

      var url = '/tallers/' + data.taller + '/privat/doc/'
        + '?nom=' + encodeURIComponent(data.nom)
        + '&taller=' + encodeURIComponent(data.taller)
        + '&lang=' + encodeURIComponent(data.lang || 'ca');

      window.location.replace(url);
    } catch(e) {}
  })();
  </script>
  {{ end }}
  ```

- [ ] **Pas 5.3: Verificar que la pàgina existeix**
  ```bash
  hugo server -D
  ```
  Navegar a `http://localhost:1313/confirmat/` — ha de mostrar la pàgina de relay (amb el check i el missatge).

- [ ] **Pas 5.4: Verificar el relay amb localStorage manual**
  A la consola del navegador (a qualsevol pàgina del servidor local):
  ```javascript
  localStorage.setItem('llum_doc', JSON.stringify({nom:'Joan Puig', taller:'revelat-bn', lang:'ca'}))
  ```
  Navegar a `http://localhost:1313/confirmat/` — ha de redirigir automàticament a:
  `http://localhost:1313/tallers/revelat-bn/privat/doc/?nom=Joan+Puig&taller=revelat-bn&lang=ca`

  (La pàgina `/doc/` no existeix encara — el 404 és esperat en aquest punt.)

- [ ] **Pas 5.5: Commit**
  ```bash
  git add content/ca/confirmat/ themes/llumatics/layouts/_default/confirmat.html
  git commit -m "feat: pàgina relay /confirmat/ post-confirmació Brevo"
  ```

---

## Task 6: Layout private-doc.html

**Fitxer:** Crear `themes/llumatics/layouts/_default/private-doc.html`

- [ ] **Pas 6.1: Crear el layout**

  ```html
  {{/* Layout: private-doc.html — Documentació nominal del taller */}}
  {{ define "main" }}
  {{ $courseTitle := .Title }}
  {{ $courseImage := .Params.image }}

  {{/* Capçalera visible al web i al PDF */}}
  <div class="doc-header no-print-hide">
    <div class="doc-header__meta" id="js-doc-meta">
      {{/* El nom s'injecta per JS */}}
    </div>
  </div>

  {{/* Missatge d'accés restringit (mostrat si no hi ha nom a la URL) */}}
  <div id="js-doc-no-access" class="section container" style="min-height:60vh; display:flex; align-items:center; justify-content:center; text-align:center;" hidden>
    <div style="max-width:420px;">
      <div style="font-size:3rem; opacity:0.3; margin-bottom:1rem;">🔒</div>
      <h1 style="font-family:var(--font-serif); font-size:var(--text-2xl); margin-bottom:0.75rem;">
        {{ i18n "doc_no_access_title" }}
      </h1>
      <p style="color:var(--color-text-muted); margin-bottom:2rem;">{{ i18n "doc_no_access_message" }}</p>
      <a href="../" class="btn btn--primary">{{ i18n "doc_no_access_cta" }}</a>
    </div>
  </div>

  {{/* Contingut principal (ocult fins que JS comprovi el nom) */}}
  <div id="js-doc-content" hidden>

    {{/* Botó d'impressió */}}
    <div class="doc-print-bar no-print">
      <div class="container container--narrow">
        <button onclick="window.print()" class="btn btn--ghost doc-print-btn">
          {{ i18n "doc_print_cta" }}
        </button>
      </div>
    </div>

    {{/* Imatge principal */}}
    {{ if $courseImage }}
    <div class="doc-hero-image">
      <img src="{{ $courseImage }}" alt="{{ $courseTitle }}" loading="eager">
    </div>
    {{ end }}

    {{/* Cos del document */}}
    <div class="section container container--narrow">
      <div class="prose doc-body">
        {{ .Content }}
      </div>
    </div>

    {{/* Certificat formal */}}
    <div class="certificate">
      <div class="certificate__inner">
        {{ $logo := .Site.Params.logo }}
        {{ if $logo }}
        <img src="{{ $logo }}" alt="Llumàtics" class="certificate__logo">
        {{ end }}
        <p class="certificate__certifies">{{ i18n "certificate_certifies" }}</p>
        <p class="certificate__name" id="js-cert-name"></p>
        <p class="certificate__completed">{{ i18n "certificate_completed" }}</p>
        <p class="certificate__course">{{ $courseTitle }}</p>
        <p class="certificate__date" id="js-cert-date"></p>
        <p class="certificate__place">{{ i18n "certificate_place" }}</p>
        <div class="certificate__line"></div>
        <p class="certificate__issuer">{{ i18n "certificate_issuer" }}</p>
      </div>
    </div>

  </div>{{/* /js-doc-content */}}

  {{/* Peu de pàgina visible al PDF (ocult al web) */}}
  <div class="doc-print-footer print-only" id="js-doc-print-footer"></div>

  <script>
  (function() {
    var params  = new URLSearchParams(window.location.search);
    var nom     = params.get('nom');
    var taller  = params.get('taller');

    var elContent  = document.getElementById('js-doc-content');
    var elNoAccess = document.getElementById('js-doc-no-access');
    var elMeta     = document.getElementById('js-doc-meta');
    var elCertName = document.getElementById('js-cert-name');
    var elCertDate = document.getElementById('js-cert-date');
    var elFooter   = document.getElementById('js-doc-print-footer');

    if (!nom) {
      elNoAccess.removeAttribute('hidden');
      return;
    }

    // Mostra el contingut
    elContent.removeAttribute('hidden');

    // Injecta nom a la capçalera
    if (elMeta) {
      elMeta.textContent = '{{ i18n "doc_prepared_for" }} ' + nom;
    }

    // Injecta nom al certificat
    if (elCertName) elCertName.textContent = nom;

    // Injecta data al certificat
    if (elCertDate) {
      var d = new Date();
      var months = ['gener','febrer','març','abril','maig','juny','juliol','agost','setembre','octubre','novembre','desembre'];
      elCertDate.textContent = d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear();
    }

    // Peu per a PDF
    if (elFooter) {
      elFooter.textContent = '© Llumàtics · ' + nom + ' · {{ i18n "doc_footer_copyright" }}';
    }
  })();
  </script>
  {{ end }}
  ```

- [ ] **Pas 6.2: Verificar build**
  ```bash
  hugo server -D
  ```
  Esperat: cap error de template.

- [ ] **Pas 6.3: Commit**
  ```bash
  git add themes/llumatics/layouts/_default/private-doc.html
  git commit -m "feat: layout private-doc.html amb injecció de nom i certificat"
  ```

---

## Task 7: CSS — estils document i impressió

**Fitxer:** `themes/llumatics/assets/css/main.css`

- [ ] **Pas 7.1: Afegir estils del document**

  Afegir després del bloc `.private-gate__desc { ... }` (línia ~1252):

  ```css
  /* ── Formulari privat ────────────────────────────────────────────────────── */
  .private-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    max-width: 400px;
    margin: 0 auto;
    text-align: left;
  }

  .private-form__label {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: var(--space-1);
  }

  .private-form__input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 2px;
    font-size: 1rem;
    background: var(--color-surface);
    color: var(--color-text);
    font-family: var(--font-sans);
  }

  .private-form__input:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-color: var(--color-accent);
  }

  .private-form__checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    cursor: pointer;
  }

  .private-form__checkbox {
    margin-top: 0.2rem;
    flex-shrink: 0;
    accent-color: var(--color-accent);
  }

  .private-form__submit {
    width: 100%;
    margin-top: var(--space-2);
  }

  .private-gate__confirm {
    padding: var(--space-6);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 2px;
    text-align: center;
    color: var(--color-text-muted);
    max-width: 400px;
    margin: 0 auto;
  }

  .private-gate__footer {
    margin-top: var(--space-8);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* ── Layout documentació nominal (private-doc) ───────────────────────────── */
  .doc-header {
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-3) var(--space-6);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    display: none; /* ocult al web, visible al PDF via @media print */
  }

  .doc-hero-image {
    width: 100%;
    max-height: 400px;
    overflow: hidden;
    margin-bottom: var(--space-12);
  }

  .doc-hero-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .doc-print-bar {
    padding: var(--space-4) 0;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-8);
  }

  .doc-print-btn {
    font-size: var(--text-sm);
  }

  .doc-body {
    padding-bottom: var(--space-16);
  }

  .doc-body img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: var(--space-6) auto;
  }

  .doc-print-footer {
    display: none; /* visible al PDF via @media print */
  }

  /* ── Certificat formal ───────────────────────────────────────────────────── */
  .certificate {
    margin-top: var(--space-16);
    padding: var(--space-16) var(--space-8);
    border-top: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
  }

  .certificate__inner {
    text-align: center;
    max-width: 520px;
  }

  .certificate__logo {
    height: 32px;
    width: auto;
    margin-bottom: var(--space-10);
    opacity: 0.7;
  }

  .certificate__certifies {
    font-size: var(--text-sm);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin-bottom: var(--space-4);
  }

  .certificate__name {
    font-family: var(--font-serif);
    font-size: 2.25rem;
    line-height: 1.2;
    margin-bottom: var(--space-6);
    color: var(--color-text);
  }

  .certificate__completed {
    font-size: var(--text-sm);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin-bottom: var(--space-2);
  }

  .certificate__course {
    font-family: var(--font-serif);
    font-size: var(--text-xl);
    margin-bottom: var(--space-8);
  }

  .certificate__date,
  .certificate__place {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin-bottom: var(--space-1);
  }

  .certificate__line {
    width: 80px;
    height: 1px;
    background: var(--color-border);
    margin: var(--space-8) auto;
  }

  .certificate__issuer {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    letter-spacing: 0.05em;
  }
  ```

- [ ] **Pas 7.2: Estendre @media print existent**

  Localitzar el bloc `@media print {` (línia ~3293). Afegir dins del bloc, just abans del tancament `}`:

  ```css
  /* ── Documentació alumnes (private-doc) ── */
  .no-print, .doc-print-bar, .site-header, .site-footer,
  #js-back-to-top, .no-print-hide { display: none !important; }

  .doc-header {
    display: block !important;
    font-size: 9pt;
    padding: 0.5cm 2cm;
    border-bottom: 0.5pt solid #ccc;
    background: none !important;
  }

  .doc-hero-image {
    max-height: 280pt;
    page-break-after: avoid;
  }

  .doc-body img {
    max-width: 100%;
    page-break-inside: avoid;
  }

  .doc-print-footer {
    display: block !important;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 8pt;
    color: #999;
    text-align: center;
    padding: 0.3cm 2cm;
    border-top: 0.5pt solid #eee;
  }

  .certificate {
    page-break-before: always;
    min-height: auto;
    padding: 3cm 2cm;
    border-top: none;
  }

  .certificate__name { font-size: 28pt; }
  .certificate__course { font-size: 16pt; }

  @page { size: A4; margin: 2cm; }
  ```

- [ ] **Pas 7.3: Afegir classe helper `.print-only`**

  Al final del fitxer (o prop del bloc `@media print`), afegir:

  ```css
  .print-only { display: none; }
  @media print { .print-only { display: block !important; } }
  ```

- [ ] **Pas 7.4: Verificar build**
  ```bash
  hugo server -D
  ```
  Esperat: cap error CSS, pàgina `/confirmat/` i `/privat/` es veuen bé.

- [ ] **Pas 7.5: Commit**
  ```bash
  git add themes/llumatics/assets/css/main.css
  git commit -m "feat: CSS documentació alumnes — doc-*, certificate, @media print"
  ```

---

## Task 8: Primera documentació de taller (revelat-bn)

**Fitxers:**
- Crear: `content/ca/tallers/revelat-bn/privat/doc/index.md`
- Crear directori: `static/images/docs/`

Aquest task verifica que tot el sistema funciona end-to-end amb contingut real.

- [ ] **Pas 8.1: Crear el directori d'imatges**
  ```bash
  mkdir -p static/images/docs
  ```

- [ ] **Pas 8.2: Crear el fitxer de documentació**

  Crear `content/ca/tallers/revelat-bn/privat/doc/index.md`:

  ```markdown
  ---
  title: "Revelat de pel·lícula B/N"
  layout: "private-doc"
  course_ref: "revelat-bn"
  image: "/images/tallers/revelat-bn.jpg"
  noindex: true
  sitemap:
    disable: true
  robots: "noindex, nofollow"
  draft: false
  ---

  ## Introducció

  El revelat de pel·lícula en blanc i negre és el primer pas cap al control total del procés fotogràfic. A diferència del revelat en color, el B/N és robust, perdonador i t'ofereix un marge de maniobra enorme per experimentar.

  En aquest taller has après que no hi ha un revelat "correcte" —hi ha el revelat que millor s'adapta a la teva intenció fotogràfica.

  ## Història

  El revelat fotogràfic tal com el coneixem avui té les seves arrels al segle XIX. Fox Talbot va descriure el 1839 el principi bàsic: els sals de plata sensibles a la llum es redueixen a plata metàl·lica en presència d'un agent reductor (el revelador). Des d'aleshores, la química ha evolucionat però el principi no ha canviat.

  El Rodinal, un dels reveladors més antics en producció contínua, va ser formulat per Agfa el 1891 i encara avui s'utilitza pràcticament sense canvis.

  ## Procediment pas a pas

  ### 1. Preparació

  - Preparar totes les solucions a 20 °C
  - Mesurar els volums exactes de revelador, aiguaparat i fixador
  - Preparar el tanc de revelat i les espirals en total foscor

  ### 2. Carregar el tanc (en foscor total)

  - Obrir el cartutx amb el obrepot
  - Enrotllar la pel·lícula a l'espiral sense tocar l'emulsió
  - Tancar el tanc hermèticament

  ### 3. Revelat

  1. Abocar el revelador ràpidament
  2. Agitar contínuament els primers 30 segons
  3. Agitar 10 segons a l'inici de cada minut
  4. Abocar el revelador al final del temps (reutilitzable si és 1+1 o concentrat)

  ### 4. Aiguaparat (stop bath)

  - 30 segons amb agitació contínua
  - Atura la reacció del revelador immediatament

  ### 5. Fixat

  - Mínim 5 minuts (fins a 10 per a pel·lícules ràpides)
  - Agitar els primers 30 segons, després cada minut
  - El fixador fa la pel·lícula permanent i insensible a la llum

  ### 6. Rentat final

  - Rentat amb aigua corrent 5-10 minuts
  - Opcional: Hypoclearing agent (redueix el temps de rentat)
  - Unes gotes de Photoflow a l'última aigua (evita taques per assecatge)

  ### 7. Assecat

  - Penjar la pel·lícula vertical en un espai sense pols
  - No tocar l'emulsió fins que estigui completament seca (1-2 hores)

  ## Consells

  - **Temperatura constant:** cada grau de diferència altera el resultat. Usa un termòmetre precís i pretemperitza les solucions.
  - **Escriu-ho tot:** apunta el revelador, la dilució, el temps i la temperatura de cada revelat. Sense notes no pots repetir (ni millorar) resultats.
  - **Confia en la química:** un revelat massa curt és pitjor que un de lleugerament llarg. Si tens dubtes, afegeix 30 segons.
  - **El fixador s'esgota:** comprova la capacitat del teu fixador i renova'l quan calgui. Un fixador esgotat crea imatges que s'enfosqueixen amb el temps.

  ## Resum

  | Variable | Estàndard | Push +1 | Push +2 |
  |----------|-----------|---------|---------|
  | Temperatura | 20 °C | 20 °C | 20 °C |
  | Rodinal 1+50 | 12 min | 16 min | 21 min |
  | Rodinal 1+25 | 9 min | 12 min | 16 min |
  | Agitació | Intermitent | Intermitent | Contínua |

  *Valors orientatius per a Fomapan 400. Consulta sempre les taules del fabricant.*

  ## Referències externes

  - [Digitaltruth Massive Dev Chart](https://www.digitaltruth.com/devchart.php) — taules de temps de revelat per a centenars de combinacions pel·lícula/revelador
  - [Ilford Guide to Film Processing](https://www.ilfordphoto.com/darkroomguides) — guia oficial d'Ilford
  - [Film Photography Project](https://filmphotographyproject.com) — recursos i fòrum de la comunitat
  ```

- [ ] **Pas 8.3: Verificar la pàgina de documentació**
  ```bash
  hugo server -D
  ```
  Navegar a:
  `http://localhost:1313/tallers/revelat-bn/privat/doc/?nom=Joan+Puig&taller=revelat-bn&lang=ca`

  Verificar:
  - [ ] La capçalera mostra "Document preparat per a Joan Puig"
  - [ ] El contingut del taller es veu complet
  - [ ] El certificat final mostra el nom "Joan Puig" en tipografia gran i el títol del taller
  - [ ] El botó "Imprimeix / Desa com a PDF" és visible

- [ ] **Pas 8.4: Verificar el guard sense nom**
  Navegar a `http://localhost:1313/tallers/revelat-bn/privat/doc/` (sense paràmetres).
  Verificar: mostra el missatge "Accés restringit" i el botó per tornar al taller. El contingut NO es veu.

- [ ] **Pas 8.5: Verificar impressió**
  A `http://localhost:1313/tallers/revelat-bn/privat/doc/?nom=Joan+Puig&taller=revelat-bn&lang=ca`:
  - Obrir el diàleg d'impressió del navegador (Ctrl+P / Cmd+P)
  - Verificar:
    - [ ] Header del web i footer del web no apareixen
    - [ ] La capçalera del document ("Document preparat per a Joan Puig") és visible
    - [ ] El certificat final ocupa una pàgina nova i mostra el nom
    - [ ] El peu de pàgina mostra "© Llumàtics · Joan Puig · Document personal..."

- [ ] **Pas 8.6: Commit**
  ```bash
  git add content/ca/tallers/revelat-bn/privat/doc/ static/images/docs/
  git commit -m "feat: primera documentació nominal — revelat-bn (template + verificació)"
  ```

---

## Task 9: Push a staging i verificació final

- [ ] **Pas 9.1: Push a develop (staging)**
  ```bash
  git push origin develop
  ```
  Esperar que GitHub Actions desplegi a `https://112books.github.io/llumatics-web`.

- [ ] **Pas 9.2: Verificar staging**
  - `https://112books.github.io/llumatics-web/tallers/revelat-bn/privat/` → formulari visible
  - `https://112books.github.io/llumatics-web/confirmat/` → pàgina relay visible
  - `https://112books.github.io/llumatics-web/tallers/revelat-bn/privat/doc/?nom=Prova&taller=revelat-bn&lang=ca` → documentació completa amb nom i certificat

- [ ] **Pas 9.3: Configurar URL de redirect a Brevo**
  Al panell de Brevo → el formulari creat al Task 1 → configuració → Redirect URL:
  ```
  https://llumatics.com/confirmat/
  ```

- [ ] **Pas 9.4: Test end-to-end**
  A `https://llumatics.com/tallers/revelat-bn/privat/` (o staging):
  1. Omplir el formulari amb nom i email real
  2. Comprovar que arriba l'email de doble opt-in de Brevo
  3. Clicar l'enllaç de confirmació
  4. Verificar que es redirigeix a la pàgina de documentació amb el nom correcte
  5. Verificar que el contacte apareix a Brevo amb els atributs correctes

---

## Notes d'implementació

- **El `e.preventDefault()` NO s'usa al submit:** el formulari ha de fer el POST real a Brevo. El JS guarda localStorage i amaga el formulari visualment, però deixa que el submit continuï.
- **`localStorage.removeItem('llum_doc')` a `/confirmat/`:** netejar després de llegir, per evitar que una recàrrega de `/confirmat/` redirigeixi de nou.
- **Imatges al Markdown (`loading="eager"`):** el layout `private-doc.html` no pot controlar el `loading` de les imatges inline del Markdown. Si es detecten blancs al PDF, afegir `img { content-visibility: visible; }` al bloc `@media print`.
- **Brevo form `email_address_check`:** camp hidden obligatori de Brevo com a honeypot anti-spam. Sempre buit.
