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
- [ ] A9. Migrar "Regala un curs" al motor compartit.
- [ ] A10. Enllaços d'accés (home i tallers) i publicació.

## Bloc B — Formacions flash
- [x] B1. Drafts de les 14 propostes flash (CA).
- [x] B2. `data/efemerides.yaml` amb totes les finestres (15 entrades).
- [ ] B3. Estat `en-preparacio` + bloc "També et pot interessar".
- [ ] B4. Fitxa completa de cada flash en activar-se (protocol D-30).

## Bloc C — GEO / FAQ per curs
- [x] C1. Recerca de com es busca cada curs i taller per idioma (`docs/recomanador/recerca-cerca-cursos.md`).
- [~] C2. FAQ específica per curs. FETS els prioritaris (9): revelat-bn, iniciacio-revelat, introduccio-al-positivat, copies-en-paper, cianotipia, digitalitzacio-escaner, introduccio-gran-format, gran-format-4x5 i tutoria-fotografica (CA/ES/EN). Resten els secundaris (retrat, carrer, fotollibre, caffenol…).
- [~] C3. FAQPage: mecanisme global fet i verificat a les fitxes amb FAQ.
- [ ] C4. Landing "aprendre a revelar a Barcelona" + enllaços interns.
- [ ] C5. Auditoria de consistència NAP (08027, La Sagrera).

## Bloc D — Pendents generals
- [ ] D1. Auditoria d'`alt`.
- [ ] D2. Títols curts (<25 caràcters).
- [ ] D3. Accessibilitat de l'accent (#0096D2 vs #00719E).
- [ ] D4. Google Business Profile: revisar adreça/barri (extern).
