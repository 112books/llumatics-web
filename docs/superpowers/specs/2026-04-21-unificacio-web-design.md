# Disseny: Unificació web Llumàtics

**Data:** 2026-04-21  
**Estat:** Aprovat — pendent d'implementació

---

## Resum

Unificació visual i funcional del web de Llumàtics en 5 àrees: header, layout global, menú, footer i pàgina de contacte completa.

---

## 1. Header — Language switcher sempre visible

**Problema:** El language switcher al `header.html` usa `{{ if .IsTranslated }}`, de manera que les pàgines sense traducció activa no el mostren.

**Solució:** Eliminar la condició `{{ if .IsTranslated }}`. Mostrar sempre tots els idiomes configurats al site (`site.Languages`), marcant l'actual com a actiu (no clicable). Si una pàgina no té traducció en un idioma concret, el link apunta a l'arrel d'aquell idioma (`/es/`, `/en/`).

**Fitxer:** `themes/llumatics/layouts/partials/header.html`

---

## 2. Menú principal — Contacte sempre visible

**Problema:** Contacte apareix al `hugo.toml` amb `weight = 7` i `highlight = true` als 3 idiomes, però pot quedar fora de vista per truncació CSS en mides intermèdies.

**Solució:** Verificar en servidor local i ajustar CSS si cal (reducció de gap entre items, mida de font, o breakpoint del menú mòbil).

**Fitxer:** `themes/llumatics/assets/css/main.css`

---

## 3. Layout global 1/3 blanc + 2/3 contingut

**Patró:** Igual que `tallers-hero__inner` (width: 66.666%; margin-left: auto). S'aplica a totes les pàgines excepte les fitxes individuals de taller.

**Implementació:**

Al `baseof.html`, afegir classe condicional al wrapper del `block "main"`:

```html
<div class="page-layout{{ if eq .Type "tallers" }} page-layout--full{{ end }}">
  {{ block "main" . }}{{ end }}
</div>
```

CSS nou a `main.css`:

```css
.page-layout {
  /* 2/3 dreta, 1/3 blanc esquerra */
}

.page-layout--full {
  /* sense restricció — fitxes de taller */
}
```

**Pàgines afectades:** totes excepte `Type = tallers` (tant la llista com les fitxes individuals). La pàgina de llista de tallers ja té el seu propi layout intern 2/3; les fitxes individuals usen l'amplada completa per disseny.  
**Fitxers:** `themes/llumatics/layouts/_default/baseof.html`, `themes/llumatics/assets/css/main.css`

---

## 4. Footer — Seccions d'Espais

**Problema:** La columna "Espais" al footer consulta `where .Site.RegularPages "Type" "espais"` però no hi ha pàgines individuals d'espais — només `_index.md`.

**Solució:** Substituir la consulta dinàmica per links estàtics amb ancles:

| Link visible | URL |
|---|---|
| El laboratori | `/espais/#laboratori` |
| El plató | `/espais/#plato` |
| Zona d'escaneig i retoc | `/espais/#escaneig` |
| La biblioteca | `/espais/#biblioteca` |

Afegir els `id` corresponents als títols `##` de `content/ca/espais/_index.md`. Nota: "Zona d'escaneig i retoc" no existeix com a secció al fitxer actual — cal afegir-la amb contingut bàsic (escàner de negatius, retoc digital bàsic).

**Fitxers:** `themes/llumatics/layouts/partials/footer.html`, `content/ca/espais/_index.md`

---

## 5. Pàgina Contacte — Redisseny complet

El layout `themes/llumatics/layouts/contacte/list.html` es reescriu completament. El contingut de `content/ca/contacte/index.md` s'actualitza.

### 5.1 Mapa

**Tecnologia:** OpenStreetMap via iframe (sense API key).  
**Coordenades:** Carrer Ferran Turné, 1-11, Barcelona (41.4285, 2.1912).  
**Estil:** alçada 380px, cantonades arrodonides (`border-radius: var(--radius)`), ombra suau.

### 5.2 Cards de transport

Graella de 7 cards: 2 columnes desktop, 1 columna mòbil.  
Icones SVG inline estil minimalista línia (Heroicons/Lucide), color `var(--color-text-muted)`.

| Card | Transport | Detall |
|---|---|---|
| Metro | L1, L5, L9N, L10N — La Sagrera | 8-10 min caminant |
| Tren | Rodalies R4 — La Sagrera | 10 min caminant |
| Bus | 34, B24, H6, H8, V29, V31 | 5-10 min |
| Bici | Bicing / bicicleta | Aparcament a l'entrada |
| Avió | Aeroport El Prat (TMB+Rodalies) | 45-60 min |
| Vaixell | Port de Barcelona | 30-45 min |
| Cotxe | Zona blava propera | ~2,50€/hora |

Estil de card: fons blanc, icona SVG gris 40px, transport en negreta, detall en gris, vora suau, ombra lleugera en hover.

### 5.3 Formulari de contacte

**Backend:** Formspree (pla gratuït, 50 enviaments/mes). ID configurat a `hugo.toml` com a `params.formspreeId`.

**Camps:**

1. **Tipus de consulta** — `<fieldset>` amb 2 radios: "Consulta general" / "Sol·licitar un taller"
2. **Nom i cognoms** — `<input type="text">` requerit
3. **Email** — `<input type="email">` requerit
4. **Taller** — `<select>` visible només si tipus = "Sol·licitar un taller". Poblat dinàmicament via Hugo template: rang dels tallers amb `estat = "actiu"`, mostrant `title` i `preu_1`.
5. **Data ideal** — `<input type="date">` (date picker natiu HTML)
6. **Horari preferit** — `<select>`: "Matí (10–14h)" / "Tarda (16–18h)" / "Indiferent"
7. **Nombre d'alumnes** — `<select>`: 1 / 2 / 3 / 4
8. **Missatge** — `<textarea>` opcional
9. **Botó enviar** — classe `btn btn--primary`

Els camps de taller (4-7: taller, data, horari, alumnes) s'amaguen/mostren via JS mínim segons el valor del radio. Quan s'escull "Consulta general" queden ocults; quan s'escull "Sol·licitar un taller" apareixen.

### 5.4 FAQ desplegables

**Implementació:** `<details>/<summary>` nadiu HTML, sense JS. CSS animat amb icona `+`/`×`.

**11 preguntes en 4 categories:**

**Sobre els tallers**
1. Quants alumnes hi ha per sessió?
2. Cal tenir experiència prèvia en fotografia analògica?
3. Quin equipament he de portar?
4. Els tallers tenen dates fixes o es fan sota demanda?

**Sobre l'espai**
5. On és Llumàtics exactament?
6. Puc visitar l'espai abans de fer un taller?

**Sobre preus i pagament**
7. Com es fa el pagament? Necessito factura?
8. Hi ha descomptes per grup o per repetir taller?
9. Quina és la política de cancel·lació?

**Tallers externs i institucions**
10. Feu tallers fora de la Nau Bostik?
11. Organitzeu tallers per a escoles o centres culturals?

---

## Fitxers a modificar

| Fitxer | Canvi |
|---|---|
| `themes/llumatics/layouts/partials/header.html` | Language switcher sempre visible |
| `themes/llumatics/layouts/_default/baseof.html` | Wrapper 1/3+2/3 global |
| `themes/llumatics/layouts/partials/footer.html` | Espais com a links estàtics |
| `themes/llumatics/layouts/contacte/list.html` | Redisseny complet |
| `themes/llumatics/assets/css/main.css` | Nous estils: page-layout, transport cards, FAQ, form |
| `content/ca/espais/_index.md` | Afegir IDs als títols |
| `content/ca/contacte/index.md` | Netejar contingut (mapa i transport al template) |
| `hugo.toml` | Afegir `params.formspreeId` |

## Fitxers nous

| Fitxer | Contingut |
|---|---|
| *(cap)* | Tot va als fitxers existents |

---

## Decisions tècniques

- **OpenStreetMap** en lloc de Google Maps: sense API key, GDPR més net.
- **Formspree** per a enviament del formulari: compatible amb GitHub Pages (site estàtic).
- **`<details>/<summary>`** per a FAQ: sense JS, accessible, progressivament millorable.
- **SVG inline** per a icones de transport: sense dependència externa, color controlat per CSS.
- **Hugo template** per a llista de tallers al `<select>`: manteniment zero, sincronitzat amb el contingut.
