# AGENTS.md — llumatics.com

## Propòsit del document

Aquest document defineix com han de comportar-se els agents (humans o basats en IA) que treballen amb el lloc web [https://llumatics.com](https://llumatics.com) i el seu repositori.

L'objectiu és garantir coherència editorial, qualitat tècnica i alineació amb els principis de **Llumàtics**: fotografia fotoquímica, procés analògic, mirada pròpia i formació real.

La font de veritat tècnica i editorial d'aquest projecte és el fitxer **[CLAUDE.md](CLAUDE.md)**.

---

## Objectius del lloc

Els agents han de contribuir a:

- Transmetre la qualitat i la serietat de la formació fotoquímica de Llumàtics.
- Generar sol·licituds de tallers i consultes qualificades.
- Posicionar Llumàtics com a referent en fotografia analògica, laboratori fosc i processos alternatius a Barcelona.
- Informar clarament sobre l'oferta formativa sense ambigüitat ni soroll.

---

## Audiència

Els continguts s'adrecen a:

- Persones amb interès en fotografia analògica, des d'iniciació fins a nivells avançats.
- Fotògrafs digitals que volen incorporar el procés químic.
- Artistes visuals que busquen processos alternatius (cianotípia, goma, experimentals).
- Col·leccionistes i aficionats a la fotografia de gran format.
- Centres educatius, culturals i institucions que volen tallers externs.

Els agents han d'assumir que l'audiència:

- Té interès genuí pel procés, no només pel resultat estètic.
- Busca informació clara i honesta sobre el que inclou cada taller.
- No necessita ser convençuda — necessita trobar el que ja busca.

---

## Principis editorials

### 1. Directe i sense floritures

El to de Llumàtics és expert, proper i sense artifici. Res de "descobreix la màgia de la fotografia analògica". Sí a "aprèn a revelar en blanc i negre amb chemistry que entendràs des del primer dia".

### 2. El procés per davant del resultat

Cada taller explica *com* es fa, no només *què* s'obté. L'audiència de Llumàtics vol entendre el procés. Els agents han de respectar i reflectir aquesta orientació.

### 3. Profunditat per davant de volum

Prioritzar:

- Descripció tècnica honesta de cada taller
- Prerequisits clars (no inflar l'audiència potencial)
- Equipament i material real (el que hi ha, el que cal portar)

Evitar:

- Adjectius buits ("únic", "exclusiu", "immersiu")
- Promeses que no es poden mesurar
- Contingut genèric aplicable a qualsevol escola de fotografia

### 4. Llengua i to

- **Llengua principal:** Català
- **Idiomes secundaris:** Castellà i Anglès (traduccions completes)
- To: directe, tècnic però accessible, sense pedanteria
- Minúscula als elements d'interfície (botons, nav, etiquetes)
- Majúscula als títols de tallers i seccions
- Sense corporatiu: res de "experiència transformadora" ni "viatge fotogràfic"

### 5. Preus i formació

Els agents han de:

- Aplicar sempre la fórmula de preus definida a CLAUDE.md
- No mencionar IVA (l'activitat és exempta, art. 20.1.9 LIVA)
- Remetre a les FAQ per a preguntes de facturació
- No inventar preus ni modificar la taula sense recalcular des de la fórmula

### 6. Accessibilitat com a estàndard

Tot codi i contingut generat ha de complir:

- **WCAG 2.1 AA** com a mínim
- `alt` descriptiu a totes les imatges fotogràfiques
- HTML5 semàntic vàlid
- Contrast mínim 4.5:1 per a text normal
- Skip links i ARIA correcte

### 7. Privacitat i seguretat per disseny

- Aplicar RGPD per disseny (veure `privacitat/index.md`)
- No afegir scripts de seguiment (cap Google Analytics, Meta Pixel, ni similars)
- Tots els `target="_blank"` han de tenir `rel="noopener noreferrer"`
- Els formularis envien a web3forms — no canviar sense actualitzar la política de privacitat

---

## Comportaments requerits

- Llegir `CLAUDE.md` abans de qualsevol acció sobre el projecte
- Basar totes les decisions tècniques en l'stack definit (Hugo, CSS vanilla, JS mínim)
- Respectar les convencions de noms: minúscules, guions, sense accents als slugs
- Crear contingut nou sempre en CA i replicar a ES/EN quan estigui aprovat
- Aplicar la fórmula de preus a tot taller nou (durada_hores × 50 + 20 = cost_base)
- Calcular preu_1/2/3/4 amb els multiplicadors definits a CLAUDE.md
- Missatges de commit en català, minúscules, imperatiu present

---

## Comportaments prohibits

Els agents **NO HAN DE**:

- Modificar preus sense recalcular des de la fórmula
- Afegir frameworks CSS o JS externs (cap Bootstrap, Tailwind, jQuery)
- Crear pàgines privades d'alumnes sense `noindex: true` i `robots: "noindex, nofollow"`
- Fer push a `main` directament sense revisar el build
- Inventar informació sobre equipament, horaris o disponibilitat
- Canviar l'email de contacte sense actualitzar `hugo.toml` i les pàgines legals
- Afegir Google Maps (usar OpenStreetMap) ni Google Fonts sense justificació
- Generar contingut de tallers en `draft: false` sense aprovació explícita

---

## Estructura dels tallers

Cada fitxa de taller ha de respondre a:

1. **Per a qui és** (nivell, prerequisits honestos)
2. **Què s'aprendrà i com** (procés, no llista de característiques)
3. **Què inclou el preu** (material, espai, química)
4. **Què cal portar** (sense ambigüitats)
5. **Taula de preus** (1/2/3/4 alumnes, calculat amb la fórmula)

---

## Ús de la IA

Els agents basats en IA han de:

- Actuar com a col·laboradors tècnics, no com a substituts del criteri de Joan Martínez Serres
- Verificar que els preus calculats coincideixen amb la fórmula de CLAUDE.md
- Preservar el to i la veu del projecte en tot contingut generat
- No afegir contingut no sol·licitat ni millorar "de passada" codi no relacionat

El contingut ha de semblar escrit per algú que ha revelat pel·lícules en un laboratori fosc, no per una IA.

---

## Mètriques de qualitat

Els agents han d'optimitzar per a:

- Claredat: un visitant nou entén en 10 segons de quin taller es tracta i a qui va dirigit
- Honestedat: els prerequisits i el contingut coincideixen amb la realitat del taller
- Tècnica: HTML vàlid, imatges amb `alt`, hreflang correcte, schema.org per a cursos
- Rendiment: cap imatge per sobre de 500KB, JS mínim

---

## Regla final

Si un contingut no ajuda una persona interessada en fotografia analògica a entendre per què Llumàtics és el lloc on vol aprendre, **no s'ha de publicar**.

---

*Última actualització: 2026-04-25*
*Mantenidor: Joan Martínez Serres — info@llumatics.com*
