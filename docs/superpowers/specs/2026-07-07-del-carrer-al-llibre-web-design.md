# Del Carrer al Llibre — Presentació web + formularis

**Data:** 2026-07-07
**Estat:** Aprovat

## Context

Tres objectius lligats:

1. Publicar la pàgina `del-carrer-al-llibre` (curs anual) al web, diferenciada del taller curt `fotografia-de-carrer`.
2. Substituir el botó "Avisa'm" (que connectava a Tally, sense funcionar) per un formulari inline real que enviï a `hola@llumatics.com` via PHP + Brevo SMTP al VPS de Dinahosting.
3. Substituir el formulari de newsletter (web3forms, envia a Gmail) per un enllaç al formulari allotjat de Brevo (llista #3 Butlletí Llumàtics).

---

## 1. Pàgina del-carrer-al-llibre

### Canvis al frontmatter (`content/ca/tallers/del-carrer-al-llibre/index.md`)

```yaml
draft: false
estat: "proxim"          # nou estat: visible però sense dates obertes
sota_demanda: false
proper_inici: "Octubre 2026"   # nou camp, mostra badge a l'info-box
```

El camp `proper_inici` permet mostrar un badge "Pròxima edició — Octubre 2026" sense implicar que es pot inscriure ara. Si buit, no apareix res.

### Info-box — lògica de CTAs per a `estat: "proxim"`

Quan `estat == "proxim"`, la info-box substitueix els botons estàndard ("Sol·licita una data", "Fer una consulta") per:

- Badge destacat: **"Pròxima edició — {{ proper_inici }}"** (accent color, vistós)
- Un únic CTA primari: **"Apunta't a la llista d'espera"** → obre el formulari Avisa'm inline (vegeu secció 2)
- Text curt sota: *"T'avisarem quan obrim inscripcions per a l'edició d'octubre."*

La taula de preus continua visible a l'info-box (preus per sessió), però sense CTA de reserva.

### Taula de preus a l'info-box

Els camps `preu_1/2/3/4` del frontmatter reflecteixen el preu **per sessió** (250/140/105/88€). La info-box actual mostra `preu_per_persona` com a label — modificar el label a `"preu_per_sessió"` quan `tipus == "curs"` (nova clau i18n `preu_per_sessio`).

El cos de la pàgina (Markdown) ja explica els preus semestral i anual complets. No cal duplicar-ho a l'info-box.

---

## 2. Formulari Avisa'm — PHP + Brevo SMTP

### Arquitectura

```
Usuari prem "Avisa'm" al taller
  → formulari inline s'expandeix (JS toggle, no nova pàgina)
  → omple email → submit
  → POST a https://llumatics.com/form-handler.php
      (PHP al VPS Dinahosting, autenticat via Brevo SMTP)
  → Brevo SMTP envia email a hola@llumatics.com
  → PHP retorna JSON {ok: true}
  → JS redirigeix a /gracies/?from=avisa
```

### Formulari HTML (dins `single.html`, substitueix el link Tally)

```html
<div class="avisa-form" id="avisa-{{ $courseSlug }}">
  <button class="btn btn--ghost js-avisa-toggle"
          data-target="avisa-form-{{ $courseSlug }}"
          style="margin-top:var(--space-2);">
    {{ i18n "cta_avisa" }}
  </button>
  <form class="avisa-inline-form" id="avisa-form-{{ $courseSlug }}"
        style="display:none; margin-top:var(--space-3);"
        data-avisa-form>
    <input type="hidden" name="taller" value="{{ $courseSlug }}">
    <input type="hidden" name="subject" value="Avisa'm — {{ .Title }}">
    <input type="hidden" name="type" value="avisa">
    <input type="email" name="email" required
           placeholder="{{ i18n "avisa_email_placeholder" | default "El teu correu" }}"
           style="width:100%; margin-bottom:var(--space-2);">
    <button type="submit" class="btn btn--primary btn--sm" style="width:100%;">
      {{ i18n "avisa_submit" | default "Avisa'm" }}
    </button>
    <p style="font-size:var(--text-xs); color:var(--color-text-muted); margin-top:var(--space-2);">
      {{ i18n "avisa_privacy_note" | default "Només t'avisarem quan hi hagi places. Res més." }}
    </p>
  </form>
</div>
```

### PHP handler (`static/form-handler.php`)

Arxiu nou, es desplega al VPS via `scp` (igual que `/admin/`).

Responsabilitats:
- Accepta POST amb camps: `email`, `taller`, `subject`, `type`
- Valida email i `type` (ha de ser `"avisa"` o `"newsletter"`)
- Envia email via Brevo SMTP (`smtp-relay.brevo.com:587`) a `hola@llumatics.com`
- Assumpte: el camp `subject` del formulari
- Cos: email de l'usuari + taller + timestamp
- Retorna `Content-Type: application/json` amb `{"ok":true}` o `{"ok":false,"error":"..."}`
- CORS: `Access-Control-Allow-Origin: https://llumatics.com`
- Credencials SMTP: login = email compte Brevo, password = clau SMTP Brevo (no la contrasenya web)

Configuració SMTP Brevo (free plan: 300 emails/dia):
```
Host: smtp-relay.brevo.com
Port: 587
Auth: LOGIN
User: hola@llumatics.com (o l'email del compte Brevo)
Pass: [clau SMTP de Brevo → Settings → SMTP & API]
From: hola@llumatics.com
To:   hola@llumatics.com
```

### JS (`main.js`) — toggle + submit via fetch

```js
// Toggle formulari Avisa'm
document.querySelectorAll('.js-avisa-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const form = document.getElementById(btn.dataset.target);
    if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
  });
});

// Submit via fetch
document.querySelectorAll('[data-avisa-form]').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch('/form-handler.php', { method: 'POST', body: data });
      const json = await res.json();
      if (json.ok) window.location.href = '/gracies/?from=avisa';
    } catch (_) {
      window.location.href = '/gracies/?from=avisa'; // fail open
    }
  });
});
```

### Pàgina /gracies/ — cas `from=avisa`

Afegir a `layouts/_default/gracies.html` (o equivalent) el cas `?from=avisa`:
- Títol: "T'hem apuntat!"
- Text: "T'avisarem quan obrim places per al taller. Res d'spam."
- CTA: "Torna al taller ←" (back via JS o link a `/tallers/`)

---

## 3. Newsletter — Brevo hosted form

### Situació actual

El footer té un formulari inline que fa POST a web3forms. El problema: web3forms free sempre envia a `linuxbcn@gmail.com`, no a `hola@llumatics.com`.

### Solució

1. Crear a Brevo un formulari allotjat per a la llista #3 (Butlletí Llumàtics): `app.brevo.com → Contacts → Forms → Create a form` → activar doble opt-in → copiar la URL pública (format `https://sibforms.com/serve/...`).
2. Al footer (`partials/footer.html`): substituir el `<form>` web3forms per un `<a href="[URL brevo form]">Subscriu-te al butlletí →</a>` estilitzat com a botó.
3. A `hugo.toml`: afegir `brevoNewsletterFormURL = "https://sibforms.com/serve/..."` — el footer l'utilitza.

El formulari Brevo té el seu propi disseny. No intentem embeure'l via iframe (massa incontrolable).

---

## 4. Deploy

Tots els canvis de Hugo es despleguen via el flux normal:
```bash
git commit && git push origin main
```

El `form-handler.php` **no** va via GitHub Actions (igual que `/admin/`). Cal `scp` directe:
```bash
hugo --minify --baseURL "https://llumatics.com/"
scp public/form-handler.php llumatics@llumatics.com:www/form-handler.php
```

Les credencials SMTP de Brevo **no van al codi**. Es guarden directament al fitxer PHP al servidor (fora del repo).

---

## 5. Fitxers afectats

| Fitxer | Canvi |
|--------|-------|
| `content/ca/tallers/del-carrer-al-llibre/index.md` | `draft:false`, `estat:proxim`, `proper_inici:"Octubre 2026"` |
| `themes/llumatics/layouts/tallers/single.html` | Lògica `estat==proxim` + badge + formulari Avisa'm inline |
| `themes/llumatics/assets/js/main.js` | Toggle Avisa'm + fetch submit |
| `themes/llumatics/assets/css/main.css` | Estils `.avisa-inline-form` |
| `themes/llumatics/i18n/ca.yaml` (i es/en) | Claus noves: `preu_per_sessio`, `avisa_email_placeholder`, `avisa_submit`, `avisa_privacy_note` |
| `themes/llumatics/layouts/partials/footer.html` | Substituir form web3forms per link Brevo |
| `hugo.toml` | Afegir `brevoNewsletterFormURL` |
| `static/form-handler.php` | NOU — PHP handler Brevo SMTP (desplegar via scp) |
| `themes/llumatics/layouts/_default/gracies.html` | Afegir cas `?from=avisa` |

---

## 6. Tasques manuals prèvies (requereixen l'usuari)

Abans de la implementació, calen dues accions a Brevo:

1. **Clau SMTP Brevo**: `app.brevo.com → Settings → SMTP & API → Generate a new SMTP key`. Copiar la clau (s'usarà al PHP al servidor, no al repo).
2. **Formulari newsletter Brevo**: `Contacts → Forms → Create a subscription form` → llista #3 → doble opt-in → copiar la URL pública. Afegir-la a `hugo.toml` com a `brevoNewsletterFormURL`.
