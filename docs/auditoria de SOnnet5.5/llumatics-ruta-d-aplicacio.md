---
titol: "Llumàtics — Ruta d'aplicació (resum per a la sessió del repositori)"
projecte: llumatics.com
versio: 0.1
data: 2026-10-02
estat: per aplicar
---

# Ruta d'aplicació

Aquest resum ordena la feina dels cinc documents de treball. Cada pas diu on és el detall. **No facis res marcat com a "decisió de Joan" sense que ell ho confirmi.**

Documents:

- `llumatics-veu-i-terminologia.md` (VEU)
- `llumatics-seo-ia-accessibilitat.md` (SEO)
- `llumatics-recomanador-quin-curs-em-conve.md` (RECOMANADOR)
- `llumatics-formacions-flash-efemerides.md` (FLASH)
- `tarda-holga-2026.md` i `tarda-holga-2026-comunicacio.md` (HOLGA)

Regla general: tot el que sigui nou entra com a `draft: true` fins que Joan ho validi. Els camps marcats **CONFIRMAR** als documents s'han de comprovar al repositori o preguntar a Joan; no s'inventen.

---

## Pas 0 · Comprovar abans de tocar res

1. Executar les ordres `curl` de SEO 1.1 i confirmar que /tallers/, /regala/, /es/ i una fitxa de taller responen amb un sol 200 i sense bucles.
2. Si hi ha bucle, **arreglar-lo abans de qualsevol altra cosa**: sense pàgines interiors indexables, la resta de la feina no serveix. Causes habituals: SSL "Flexible" d'un proxy amb HTTPS forçat a GitHub Pages, regles d'idioma que es contradiuen, barra final.
3. Confirmar quins canvis de la tanda anterior ja estan desplegats, per no duplicar-los.

## Pas 1 · Urgent: Tarda Holga (dijous 8 d'octubre, 18–20 h)

Detall a HOLGA.

1. Crear la fitxa `tarda-holga-2026` en `draft: true` amb el contingut de `tarda-holga-2026.md`, adaptant el frontmatter a l'esquema unificat del repositori.
2. Pendents de Joan abans de publicar: nombre de Holgas de pel·lícula (i format, 120 o 135) i sistema d'inscripció (Brevo o correu).
3. Quan Joan ho confirmi: publicar, i activar el pop-up temporal si ja està construït. Si no ho està, publicar només la fitxa i l'entrada d'agenda.

## Pas 2 · Veu, terminologia i títol de Formació

Detall a VEU i RECOMANADOR (apartat 2).

1. Canvi de títol de Formació, opció A: eyebrow "Formació", títol "Tallers, cursos i recorreguts" (3 línies: ca/es/en de `content/*/tallers/_index.md`).
2. Lema i línia explicativa de la portada en tres idiomes (VEU apartat 2).
3. Regla "analògica a la cerca, química al cos" aplicada als `title`, `description` i `alt` (VEU apartat 3 i 4). Primer a la portada, a la pàgina de formació i a les fitxes de taller.
4. Cap emoji, majúscula inicial només a la primera paraula dels títols, "Llumàtics" sempre amb accent.

## Pas 3 · SEO tècnic, dades estructurades i accessibilitat

Detall a SEO.

1. `robots.txt` (SEO 4.3). **Decisió de Joan:** bloquejar o no l'entrenament de models. La proposta per defecte és permetre tota la cerca i bloquejar l'entrenament.
2. Canònics, `hreflang`, `title` i `description` únics, `noindex` a les pàgines buides en `en-preparacio` (SEO 2.2).
3. Sitemap i enviament a Search Console i Bing Webmaster Tools (Joan ha de verificar les propietats).
4. Dades estructurades: organització, persona, `BreadcrumbList`, `Course` i `EducationEvent` generats des del frontmatter (SEO 3). L'adreça i les coordenades de la Nau Bostik són pendents de Joan.
5. Imatges: Hugo Pipes, WebP o AVIF, `srcset`, mides explícites, `lazy` excepte la imatge principal (SEO 2.5).
6. Accessibilitat: jerarquia de títols, `alt` descriptiu, contrast, teclat i focus, `prefers-reduced-motion`, lightbox amb gestió del focus (SEO 8). Afegir una comprovació automàtica (axe o Pa11y) al desplegament.
7. Pàgina 404 real en tres idiomes.

## Pas 4 · Recomanador "Quin curs em convé?"

Detall a RECOMANADOR.

1. Afegir `format`, `nivell_minim` i `estat` al frontmatter de tots els tallers.
2. Crear `data/quiz.yaml` i els textos a `i18n/{ca,es,en}.yaml`, amb la validació en el build (slugs inexistents fan fallar la compilació).
3. Pàgina `/tallers/quin-curs-em-conve/` en `draft: true`, amb els paràmetres a l'URL, sense galetes ni `localStorage`.
4. Provar els vuit perfils de l'apartat 10 abans de publicar.
5. Filtre d'estat obligatori. Corregir-lo també a "Regala un curs", que avui no filtra.
6. Pendents de Joan: slugs marcats CONFIRMAR, preu i durada de la tutoria, mínim d'interessats.

## Pas 5 · Formacions flash, efemèrides i pop-up

Detall a FLASH i RECOMANADOR (apartat 9).

1. `data/efemerides.yaml` amb les finestres d'anunci, activitat i tancament.
2. Pop-up temporal: targeta lateral discreta que es replega en una pestanya, `sessionStorage`, accessible, una sola alhora (RECOMANADOR 9.3).
3. Publicar totes les flash com a `en-preparacio` (només títol, frase i botó **M'interessa**), amb el text públic de cada fitxa. Una llista de Brevo per flash.
4. **Decisió de Joan:** quines es publiquen ja. La fotografia d'esperits del 31 d'octubre i la Polaroid Week de tardor no arriben al protocol de 30 dies.
5. Les fitxes amb col·laboradors (solargrafia amb Jesús Joglar, Visa pour l'Image amb Jordi d'Osona, instantània) **no es publiquen** fins que Joan ho hagi parlat amb ells.

## Pas 6 · Continu

- Una guia al mes al blog (SEO 7.3), començant per "Fotografia analògica o química?".
- Prova mensual als assistents d'IA (SEO 9.3).
- Revisió semestral del `robots.txt`.

---

## Coses que no s'han de fer

- No publicar res amb **CONFIRMAR** sense resoldre'l.
- No fer servir imatges que no siguin pròpies de Llumàtics.
- No afegir seguiment, galetes ni analítica de tercers sense decisió explícita de Joan.
- No oferir formació de fotografia amb telèfon ni amb càmera digital; el digital només entra per digitalitzar resultats químics.
- No esmentar ni enllaçar cap festival o persona que Joan hagi descartat.
- No publicar fitxes amb preus: tots els preus dels documents són orientatius i estan pendents de revisió.
