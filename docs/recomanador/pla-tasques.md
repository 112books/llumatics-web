---
titol: "Pla de tasques — Recomanador, flash i GEO"
data: 2026-10-02
estat: en curs
---

# Pla de tasques

Documentació de referència:
- `docs/recomanador/llumatics-recomanador-quin-curs-em-conve.md` (motor del qüestionari)
- `docs/cursos-flash/llumatics-formacions-flash-efemerides.md` (15 formacions flash)

## Bloc A — Recomanador "Quin curs em convé?"
- [x] A1. `format` i `nivell_minim` al frontmatter (99 fitxers).
- [x] A2. `data/quiz.yaml` + validació de slugs al build.
- [x] A3. i18n CA: frases, avisos i motius del qüestionari (71 claus).
- [x] A4. Pàgina `/tallers/quin-curs-em-conve/` (draft) + plantilla. Afegit `linia` a 94 fitxers.
- [x] A5. Motor JS (puntuació, motius, recorregut, tutoria) i CSS.
- [x] A6. Provats els 8 perfils de la spec amb un harness de Node (pendent revisió visual al navegador).
- [x] A7. i18n ES/EN (71 claus + pàgines traduïdes amb translationKey).
- [x] A8. Contacte: el CTA del quiz arriba al formulari amb el resultat precarregat. "M'interessa" (Brevo) queda pendent perquè no hi ha formacions `en-preparacio` visibles.
- [x] A9. El qüestionari de regal llegeix el mapping de cursos de `data/quiz.yaml` (amb fallback) i la validació n'inclou els slugs.
- [x] A10. Enllaços d'accés a la portada i a /tallers/ i publicació del qüestionari (CA/ES/EN).
- [x] A11. UX del pas 2: opcions agrupades per temes (tècnica, laboratori, digital, disciplines, processos) amb títol de grup, graella a 2 columnes i desplaçament al capdamunt del qüestionari en canviar de pas (CA/ES/EN).
- [x] A12. Capçalera del qüestionari: indicador visual "Pas X de 3" amb passos numerats clicables (estat actual/fet), per anar al pas anterior o següent (CA/ES/EN).

## Bloc B — Formacions flash
- [x] B1. Drafts de les 14 propostes flash (CA).
- [x] B2. `data/efemerides.yaml` amb totes les finestres (15 entrades).
- [x] B3. Bloc "També et pot interessar" al recomanador amb les 14 formacions flash (`data/formacions-flash.yaml`), amb "M'interessa" al formulari.
- [ ] B4. Fitxa completa de cada flash **en activar-se** (protocol D-30): per disseny, no es fa ara; els drafts ja tenen la fitxa bàsica i el text públic.

## Bloc C — GEO / FAQ per curs
- [x] C1. Recerca de com es busca cada curs i taller per idioma (`docs/recomanador/recerca-cerca-cursos.md`).
- [x] C2. FAQ específica per curs: tots els cursos actius/pròxims tenen 3 preguntes en CA/ES/EN i schema FAQPage; també l'efemèride «Tarda Holga». Resta només mantenir-les quan s'afegeixin cursos nous.
- [x] C3. FAQPage: mecanisme global verificat; a totes les pàgines amb FAQ el JSON-LD es genera amb 3 Questions.
- [x] C4. Landing `aprendre-a-revelar` (CA/ES/EN) + enllaç intern des de /tallers/.
- [x] C5. Auditoria NAP (`docs/recomanador/auditoria-nap.md`): intern consistent; pendent extern el Google Business Profile.

## Bloc D — Pendents generals
- [x] D1. Auditoria d'`alt`: cap `img` sense atribut `alt`; els buits (decoratius) són intencionats.
- [x] D2. Títols curts: les fitxes de taller amb títol <20 caràcters ara afegeixen el subtítol al `<title>` (SEO).
- [x] D3. Accessibilitat de l'accent: tot el text d'accent passa a `--color-accent-dark` (#00719E); el ceruli clar queda per a fons/botons/icones.
- [ ] D4. Google Business Profile: revisar adreça/barri (extern).

## Bloc G — Navegació (peticions d'usuari)
- [x] G1. Footer: nova columna «Tria un curs» amb «Selecciona un curs» (recomanador) i «Regala un curs»; tret de sota Contacte. Graella del footer a 5 columnes.
- [x] G2. Menú principal: estat actiu de la secció amb color d'accent (CA/ES/EN).
- [x] G3. Contacte: pastilles d'ancoratge amb text blanc i fons d'accent.
- [x] G4. Footer: treta la llista arbitrària de tallers (era els primers 5 sense criteri); nova ordre de columnes «Tria un curs» (amb «El camí ideal» → /tallers/#recorregut) | «Espais» | «Legal» | «Contacte».
- [x] G5. Portada: CTA «Quin curs em convé?» afegit a l'hero, al costat de «Veure tallers» i «Properes dates» (CA/ES/EN).

## Bloc F — Traducció i llenguatge
- [~] F1. Auditoria de traducció i llenguatge fotogràfic: `docs/manuals/auditoria-traduccio-llenguatge.md` (primera passada + correccions de «laboratorio oscuro» i «cámara oscura»). Pendent: decisió sobre «quarto fosc» i revisió completa.

## Bloc E — Contingut i imatges
- [x] E1. Imatge de portada per als 6 posts de blog sense imatge. Totes provisionals (del mateix tema/espai), pendents de substituir per fotos reals: `revelat-zenit-cameras-films-2025-02`, `jornades-obertes-nau-bostik-2022`, `resultats-taller-forcats-blues-2019`, `resultats-taller-retrat-2019-02`, `sessions-individuals-2020`, `trasllat-nau-bostik`.
