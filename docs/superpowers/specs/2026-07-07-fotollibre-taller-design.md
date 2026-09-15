# Fotollibre: del concepte a la materialització — Fitxa web

**Data**: 2026-07-07
**Estat**: Aprovat

## Resum

Publicar la fitxa pública del Taller Fotollibre al web de Llumàtics, substituint el draft `taller-fotolibre` (mai publicat) per un nou slug `fotollibre` amb el títol definitiu i estructura de 3 sessions.

## Decisió de nom i slug

- **Títol**: *Fotollibre: del concepte a la materialització*
- **Slug**: `fotollibre` (nou, substitueix `taller-fotolibre` que era draft i no indexat)
- El directori antic `content/ca/tallers/taller-fotolibre/` pot quedar com a draft o eliminar-se.

## Frontmatter

```yaml
title: "Fotollibre: del concepte a la materialització"
subtitle: "Del cos de treball al llibre real."
lead: "Tres sessions per convertir les teves fotos en un fotolibre: concepte, disseny digital i producció. Sortida a PDF, ePub o impressió via 112books."
description: "Taller de creació de fotollibre a Barcelona. Conceptualització, narrativa visual, disseny amb Affinity Publisher i producció. Màxim 4 persones. Sota demanda."

tipus: "taller"
canal: "llumatics"
blocs: ["practica"]
weight: 92
nivell: "Tots els nivells"
estat: "actiu"

preu_1: 620
preu_2: 353
preu_3: 265
preu_4: 222
durada_hores: 12
lloc: "Llumàtics — Nau Bostik, La Sagrera, Barcelona"
extern: false
max_places: 4
sota_demanda: true

objective: "Transformar un cos de treball fotogràfic en un objecte editorial coherent i produïble: amb concepte, narrativa, disseny i fitxers llestos per a impressió o distribució digital."
methodology: "Tres sessions de 4h separades per tasques intermèdies. Sessió 1: concepte, format i narrativa. Tasca: maqueta física. Sessió 2: revisió maqueta i layout digital a Affinity Publisher. Tasca: acabar el document. Sessió 3: revisió final, exports i pressupost d'impressió."
result: "Un fitxer de fotolibre complet (Affinity Publisher), exportable a PDF per a impressió o distribució digital, ePub o web. Pressupost a mida per a impressió via 112books calculat durant la sessió 3."
prerequisits: "Tenir un cos de treball fotogràfic propi: mínim 50–100 imatges d'un mateix projecte o tema. No cal haver fet cap taller previ de Llumàtics."
target: "Fotògrafs amb un conjunt d'imatges que volen fer el pas al llibre. Sortida natural del curs Del Carrer al Llibre, però obert a qualsevol fotògraf amb un projecte."

continua_aprenent:
  - "del-carrer-al-llibre"
  - "revelat-i-positivat"
  - "tutoria-fotografica"

draft: false
```

## Estructura de sessions

### Sessió 1 — Concepte, format i narrativa (4h)
- **Conceptualització**: Quin és l'objectiu del llibre. Què vol explicar, per a qui, amb quina veu.
- **Decisió de format**: Nombre d'imatges ↔ nombre de pàgines (i cost). Mida, orientació, color vs B/N, paper, tapa dura/tova, enquadernació, tirada, sistema d'impressió (digital vs òfset).
- **Narrativa visual**: Com seqüenciar les imatges (com el muntatge al cinema). Ritme, respiració, tensió. Com fer "parlar" el llibre amb els enquadraments i la disposició.
- **Narrativa textual**: Si hi ha textos: qui els escriu, què han d'explicar, quant espai ocupen. Tipografia, mides.

**Tasca entre sessions**: Maqueta física — impressions domèstiques, tisores, ordenar-ho tot sobre una taula. Primer ordre de les imatges amb decisions de seqüència preses.

### Sessió 2 — Maqueta i disseny digital (4h)
- Revisió de la maqueta física amb el professor: seqüència, respiració, forats.
- Introducció pràctica a **Affinity Publisher**: configuració del document (mida, marges, sagnat), importació d'imatges, maquetació.
- Disseny de coberta i colofó: tipografia, color, materialitat.
- Decisió de paper: gramatge, acabat (mat, brillant, satinat).

**Tasca entre sessions**: Acabar el layout digital complet a Affinity Publisher.

### Sessió 3 — Revisió, exports i producció (4h)
- Revisió final del document digital.
- Exports: PDF per a impressió (amb sagnat, perfil CMYK), PDF digital, ePub, web.
- **Pressupost a mida via 112books**: mida, paper, pàgines, tirada, sistema d'impressió — calculat en directe durant la sessió.
- Tancament del projecte: fitxers organitzats i llestos.

## Exemples reals (112books.eu)
Mostrar com a referència de resultats possibles:
- *Acarrejant* — Joan Linux
- *Arrencant el dia — 112 revelats*
- *Medatsu-ki (Arbres cridaners)*
- *I Wanna Be Your Dog*

## Nota primera edició
El cos del taller inclou un paràgraf explicant que la primera edició és per als alumnes del curs *Del Carrer al Llibre*, però que qualsevol fotògraf amb un cos de treball propi pot apuntar-se a la llista d'espera per a edicions posteriors.

## Software
- **Affinity Publisher** (free des de 2024, Canva): els alumnes l'instal·len abans del taller.
- Llumàtics té llicència pròpia per a les sessions al taller.
- Alternativa acceptada: Adobe InDesign (l'alumne porta el seu).

## Preus
Fórmula estàndard (base 12h × 50€/h + 20€ = 620€):

| Alumnes | Preu/persona |
|---------|-------------|
| 1 | 620€ |
| 2 | 353€ |
| 3 | 265€ |
| 4 | 222€ |

## Implementació
1. Crear `content/ca/tallers/fotollibre/index.md` amb frontmatter i contingut complet
2. Mantenir `taller-fotolibre` com a `draft: true` (no eliminar per si hi ha links interns)
3. Actualitzar `data/recorregut.yaml`: afegir `fotollibre` a la línia `practica` (després de `del-carrer-al-llibre`)
4. Commit i push → producció
aca