---
titol: "Quin curs em convé? — Especificació de l'eina"
projecte: llumatics.com
versio: 0.1
data: 2026-10-02
estat: proposta per validar
---

# Quin curs em convé?

Especificació de l'eina de recomanació de formació de Llumàtics, del canvi de títol de la secció Formació i de la integració amb les formacions flash i les efemèrides.

Els elements marcats amb **CONFIRMAR** estan pendents de validació o de comprovació al repositori.

---

## 1. Context i principis

### 1.1 Què és Llumàtics (i què no)

- Llumàtics és **sempre fotografia química**.
- **No** s'ofereix formació de fotografia amb telèfon ni amb càmera digital.
- El digital només hi entra per **digitalitzar resultats analògics** (escàner, edició d'imatges digitalitzades) i portar-los al món digital o editorial, en paper.
- Els tallers **teòrics i de conceptualització** (llenguatge, mirada, projecte, fotollibre) són transportables a qualsevol fotografia. Es poden presentar així: "útil també si fas digital". Tot és fotografia.
- Fora de l'eina, de moment: fotografia d'aliments i de producte.

### 1.2 Principis de l'eina

1. **Parla amb les paraules de l'usuari.** Les opcions són frases en primera persona (model de John Paul Caponigro: "Quina d'aquestes frases et descriu?"), no preguntes abstractes.
2. **Mai "el correcte", sempre "el més probable".** El resultat diu "segons el que ens has explicat" i sempre deixa la porta oberta a parlar amb una persona.
3. **Més d'un resultat, cadascun amb el seu motiu.** Entre dos i tres recomanacions, i cada motiu es construeix a partir de les respostes que hi han aportat punts.
4. **La tutoria fotogràfica és la xarxa de seguretat.** Quan no hi ha encaix clar, quan les respostes es contradiuen o quan es demana un acompanyament a mida.
5. **Només es recomana el que es pot reservar.** Hi ha un filtre d'estat obligatori.
6. **Sense seguiment.** No hi ha cookies ni analítica. El correu és opcional, només es demana després de mostrar el resultat i sempre amb consentiment explícit.
7. **Un sol motor.** El mateix motor serveix per a "Regala un curs" i per a "Quin curs em convé?", amb un sol fitxer de dades.

---

## 2. Canvi de títol de la secció Formació

| Element | Valor |
|---|---|
| Eyebrow | Formació |
| Títol (H1, `<title>`, menú, breadcrumbs) | **Tallers, cursos i recorreguts** |
| Subtítol proposat | Tallers d'una sessió per tastar, cursos de diverses sessions per aprofundir i recorreguts per dominar un procés de cap a cap. |

S'evita "recorreguts formatius" perquè, amb l'eyebrow "Formació", seria redundant.

Fitxers afectats: `content/{ca,es,en}/tallers/_index.md` (3 línies).

Efecte en el SEO: el títol incorpora "cursos" i "recorreguts", que avui no hi són.

---

## 3. Formats de formació

L'eina treballa amb cinc formats:

| Format | Descripció | Exemple |
|---|---|---|
| `flash` | Activitat curta lligada a una efemèride, de preu baix o gratuïta, que fa de porta d'entrada | Tarda Holga |
| `taller` | Una sessió o poques sessions, sobre un tema tancat | Cianotípia |
| `curs` | Diverses sessions amb continuïtat | Fotollibre (3 sessions) |
| `recorregut` | Una línia del metro sencera, en seqüència | Procés analògic |
| `tutoria` | Formació un a un, totalment personalitzada | Tutoria fotogràfica |

El llarg termini (un curs anual com Del Carrer al Llibre) és un `curs` amb `durada: anual`.

---

## 4. Estats i cicle de vida

| Estat | Visible al web | Al recomanador | Acció de l'usuari |
|---|---|---|---|
| `draft: true` | No | No | — |
| `en-preparacio` | Només amb el títol | En un bloc a part: "També et pot interessar" | Botó **M'interessa** (llista de Brevo) |
| `proxim` | Sí, amb la data prevista | Sí, amb l'etiqueta "properament" i sense botó de reserva | M'interessa |
| `actiu` | Sí | Sí | Reservar |

Regles:

- Les formacions noves es creen al repositori com a `draft` i, en passar a producció, entren soles al recomanador.
- Per a les formacions en preparació es fixa un mínim d'interessats. Quan s'hi arriba, es programa i es passa a `actiu`. El recompte es porta a mà al frontmatter (`interessats: n`) perquè no cal cap backend.

---

## 5. Estructura del qüestionari

Té una pregunta prèvia, tres passos i un camp opcional. El temps estimat per respondre'l és d'un minut.

### Pas 0 · Per a qui és?

- És per a mi → continua amb "Quin curs em convé?"
- És per regalar → porta a "Regala un curs", amb el mateix motor
- És per a un grup, una escola o una entitat → enllaç al canal d'institucions

### Pas 1 · On soc ara?

Se n'ha de triar una. La resposta fixa el **nivell** de l'usuari (de 0 a 4).

| Id | Frase | Nivell |
|---|---|---|
| `n0` | No sé fer fotos (crec), però en vull aprendre de zero. | 0 |
| `n1` | Faig fotos, però no m'agraden els resultats i no sé per què. | 1 |
| `n2` | En sé una mica, però no controlo bé el triangle de l'exposició. | 2 |
| `n3` | Controlo l'exposició i, en general, m'agrada el que faig. | 3 |
| `n4` | Domino la tècnica i el procés, en analògic o en digital. | 4 |

### Pas 2 · Què vull ara?

Se'n poden triar fins a tres. Els blocs que es mostren depenen del nivell:

| Bloc | Nivells que el veuen |
|---|---|
| A · Entendre la base | 0, 1, 2 |
| B · El procés químic | Tots |
| C · Els negatius en digital | Tots |
| D · Disciplines i llenguatge | 2, 3, 4 |
| E · Fotografia diferent | Tots |

**A · Entendre la base**

| Id | Frase | Apunta a |
|---|---|---|
| `a1` | Vull entendre com funciona la fotografia, sense presses. | línia Fonaments |
| `a2` | Vull controlar la tècnica des de zero. | línia Fonaments |
| `a3` | Vull entendre la fotografia per ser millor fotògraf/a, també en digital. | Fonaments i Revelat B/N |

**B · El procés químic**

| Id | Frase | Apunta a |
|---|---|---|
| `b1` | Vull revelar els meus rodets i entendre què hi passa. | `iniciacio-revelat`, `revelat-bn` |
| `b2` | Vull anar a fons amb el revelat: reveladors, temps, control del gra. | `revelat-bn`, `reveladors-artesanals` |
| `b3` | Vull experimentar amb revelats que no són els de sempre. | `reveladors-artesanals`, `revelat-color-bn` |
| `b4` | Vull fer còpies en paper al laboratori. | `introduccio-al-positivat`, `copies-en-paper` |
| `b5` | Ja positivo i vull fer còpies millors: contrast, màscares, virats. | `copies-beers-developer` (CONFIRMAR), tutoria |

**C · Els negatius en digital**

| Id | Frase | Apunta a |
|---|---|---|
| `c1` | No vull revelar. Vull treure el màxim dels meus negatius en digital. | `digitalitzacio-escaner`, `edicio-imatges-fotoquimiques` |
| `c2` | Vull entendre l'escàner: profunditat de bits, resolució, automatitzacions. | `digitalitzacio-escaner` |
| `c3` | Vull editar bé les imatges digitalitzades: pols, ratllades, color. | `edicio-imatges-fotoquimiques` |
| `c4` | Vull digitalitzar els records de casa. | `digitalitzacio-escaner` |

**D · Disciplines i llenguatge**

| Id | Frase | Apunta a |
|---|---|---|
| `d1` | Vull fer retrat editorial. | `retrat-analogic`, `retrat-6x6`, tutoria |
| `d2` | Vull explicar històries: reportatge. | tutoria (sense curs) |
| `d3` | Vull fotografiar esdeveniments i concerts. | tutoria (sense curs) |
| `d4` | Vull aprendre a dirigir una persona davant la càmera. | `retrat-analogic`, tutoria |
| `d5` | Vull entendre el carrer i la seva manera de mirar. | `fotografia-de-carrer`, `carrer-i-mirada`, `del-carrer-al-llibre` |
| `d6` | Vull fotografiar quan viatjo, sense fer postals. | `carrer-i-mirada`, tutoria |
| `d7` | Vull fer autoretrat amb una idea al darrere. | tutoria (sense curs) |
| `d8` | Vull entendre el llenguatge fotogràfic, també a partir del cinema. | tutoria (sense curs) (CONFIRMAR) |
| `d9` | Vull convertir les meves fotos en un llibre. | `fotollibre`, `del-carrer-al-llibre` |

**E · Fotografia diferent**

| Id | Frase | Apunta a |
|---|---|---|
| `e1` | Vull fer estenopeica de debò, no com una curiositat. | `fotografia-estenopeica` |
| `e2` | Vull treure tot el suc a una Hasselblad. | `hasselblad-500` |
| `e3` | Vull fer retrat amb gran format. | `gran-format-4x5`, `retrat-analogic` (CONFIRMAR) |
| `e4` | Vull treballar amb gran format. | `introduccio-gran-format`, `gran-format-4x5` |
| `e5` | Vull jugar amb processos alternatius: cianotípia i altres. | `cianotipia`, línia Processos alternatius |
| `e6` | Vull provar una càmera de joguina i deixar-me sorprendre. | `retrat-amb-holga` |

### Pas 3 · Com ho vull fer?

Se n'ha de triar una.

| Id | Frase | Afavoreix |
|---|---|---|
| `f1` | Una tarda, per tastar-ho. | `flash`, `taller` |
| `f2` | Unes quantes sessions, al meu ritme. | `taller`, `curs` |
| `f3` | Un compromís llarg, de tot un curs. | `recorregut`, `curs` anual |
| `f4` | Amb algú que m'acompanyi un a un. | `tutoria` |

### Pas 4 · Alguna cosa molt concreta? (opcional)

Un camp de text lliure de 280 caràcters com a màxim. Si s'omple, la tutoria apareix sempre entre els resultats i el text s'envia amb el formulari de contacte (vegeu el punt 8).

---

## 6. Lògica de càlcul

### 6.1 Puntuació

1. **Filtre.** Només entren les formacions amb estat `actiu` o `proxim`. Les que estan `en-preparacio` van a un bloc a part.
2. **Pes per frase.** Cada frase del pas 2 suma punts als slugs (3 punts) o a les línies (1 punt a cada formació de la línia) a què apunta.
3. **Adequació de nivell.** Si una formació té `nivell_minim` per sobre del nivell de l'usuari més 1, la puntuació es divideix per dos. Una formació de nivell 0 per a un usuari de nivell 4 rep un -2 (perquè no se senti tractat de principiant).
4. **Format.** La resposta del pas 3 afegeix 2 punts als formats que afavoreix.
5. **Efemèride activa.** Si hi ha una formació flash activa aquesta setmana i encaixa amb alguna frase triada, rep 2 punts més. El motiu ho diu: "és aquesta setmana".
6. **Empats.** Guanya la formació de nivell més baix.

### 6.2 Tipus de resultat

**A · Formacions concretes.** Les dues o tres de més puntuació, cadascuna amb el seu motiu.

**B · Recorregut sencer.** S'activa si es compleixen dues condicions:
- dues o més de les formacions més ben puntuades són de la mateixa línia;
- al pas 3 s'ha triat `f2` o `f3`.

Llavors es mostra la línia en seqüència, com al metro, amb l'estació on comença l'usuari. Per exemple: `iniciacio-revelat` → `revelat-bn` → `copies-en-paper`.

Del Carrer al Llibre (anual) només apareix si s'han triat **alhora** `d5` o `d9` **i** `f3`.

**C · Tutoria fotogràfica.** Apareix:
- com a **primera opció**, si s'ha triat `f4`; si cap formació arriba a 4 punts; o si totes les frases triades apunten a "tutoria (sense curs)";
- **entre els resultats**, si s'ha omplert el pas 4 o si les frases triades són de tres blocs diferents (interessos dispersos);
- **sempre**, al final i de manera discreta: "O bé, una formació feta només per a tu."

### 6.3 Composició del motiu

Cada frase té un fragment de motiu a `i18n/*.yaml`. El motiu del resultat combina les frases que hi han sumat més punts:

> Has dit que **fas fotos però no t'agraden els resultats** i que **vols entendre com funciona**. → **Fonaments**. És exactament per a això.

> I has marcat que **vols revelar els teus rodets**. → Quan acabis Fonaments, **Revelat B/N** és el pas següent. Aquí tens el recorregut sencer.

Per als tallers teòrics, s'hi afegeix la coletilla: "útil també si fas digital".

### 6.4 Pantalla de resultat

1. Una frase d'obertura: "Segons el que ens has explicat, això és el que et proposem."
2. De dues a tres targetes. Cada targeta porta el títol, el format, la línia, el motiu, la propera data (o "properament") i un botó per veure el taller.
3. El recorregut, si s'escau.
4. La tutoria.
5. El bloc "També et pot interessar (en preparació)", amb el botó M'interessa.
6. "Vols que en parlem?" (vegeu el punt 8).
7. Els enllaços "Torna a començar" i "Comparteix aquest resultat".

---

## 7. Dades i implementació (Hugo)

### 7.1 Fitxers

| Fitxer | Contingut |
|---|---|
| `data/quiz.yaml` | Passos, frases, pesos i regles. És compartit amb "Regala un curs" |
| `i18n/{ca,es,en}.yaml` | El text de les frases i els fragments de motiu |
| `data/efemerides.yaml` | El calendari d'efemèrides i les finestres d'activació |
| Frontmatter de cada taller | `estat`, `format`, `linia`, `nivell_minim`, `interessats` |
| `content/{ca,es,en}/tallers/quin-curs-em-conve.md` | La pàgina de l'eina |

### 7.2 Exemple de `data/quiz.yaml`

```yaml
quin_curs:
  passos:
    - id: nivell
      tipus: unica
      opcions:
        - { id: n0, nivell: 0 }
        - { id: n1, nivell: 1 }
        - { id: n2, nivell: 2 }
        - { id: n3, nivell: 3 }
        - { id: n4, nivell: 4 }

    - id: interessos
      tipus: multiple
      maxim: 3
      blocs:
        - id: base
          visible_nivells: [0, 1, 2]
          opcions:
            - id: a1
              linies: { fonaments: 1 }
            - id: a3
              linies: { fonaments: 1 }
              slugs: { revelat-bn: 3 }
              transportable: true
        - id: proces
          opcions:
            - id: b1
              slugs: { iniciacio-revelat: 3, revelat-bn: 3 }
            - id: b5
              slugs: { copies-beers-developer: 3 }   # CONFIRMAR
              tutoria: true
        - id: disciplines
          visible_nivells: [2, 3, 4]
          opcions:
            - id: d2
              tutoria: true
              demanda: reportatge     # per mesurar demanda
            - id: d5
              slugs: { fotografia-de-carrer: 3, carrer-i-mirada: 3 }
              condicio_anual: true    # del-carrer-al-llibre només amb f3

    - id: format
      tipus: unica
      opcions:
        - { id: f1, formats: [flash, taller] }
        - { id: f2, formats: [taller, curs] }
        - { id: f3, formats: [recorregut, curs-anual] }
        - { id: f4, formats: [tutoria] }

  regles:
    pes_slug: 3
    pes_linia: 1
    bonus_format: 2
    bonus_efemeride: 2
    llindar_minim: 4
    max_resultats: 3
    empat: nivell_mes_baix
```

### 7.3 Validació en el build

Una plantilla parcial recorre `data/quiz.yaml` i comprova que cada slug existeix a `content/`. Si en falta algun, el build falla amb un missatge clar (`errorf "quiz.yaml: slug '%s' no existeix"`). Així s'eviten les recomanacions que desapareixen sense avís quan es canvia el nom d'un taller.

### 7.4 Client

- JavaScript pla, sense dependències. Les dades s'injecten en el build com a JSON.
- Les respostes es desen als paràmetres de l'URL (`?n=n1&i=a1,b1&f=f2`). Així el resultat es pot compartir i tornar a obrir sense desar res.
- Sense `localStorage`, sense cookies i sense analítica.
- Es pot fer servir amb teclat, amb una pregunta per pantalla, una barra de progrés i navegació enrere.
- Respecta `prefers-reduced-motion`.

### 7.5 Ubicació

- La pàgina pròpia és `/tallers/quin-curs-em-conve/` (i les seves equivalents en ES i EN).
- Hi ha blocs d'accés a la pàgina de tallers (sota el títol) i a la portada (després de les sis línies).
- Està pensada per enllaçar-la des d'Instagram, el butlletí i la signatura del correu.

---

## 8. Contacte i Brevo

- El correu es demana **després** del resultat i és **opcional**. El resultat mai queda bloquejat darrere d'un formulari.
- El text proposat és "Vols que en parlem? Deixa'ns el correu i t'escrivim nosaltres."
- S'hi envien el correu, el text del pas 4 i el resultat (els paràmetres de l'URL).
- Porta una casella de consentiment explícita i un enllaç a la política de privacitat.
- El botó **M'interessa** de les formacions en preparació apunta a una llista de Brevo per formació.

---

## 9. Integració amb les formacions flash i les efemèrides

### 9.1 Calendari de referència

| Efemèride | Data | Formació possible |
|---|---|---|
| Holga Week | 1–7 d'octubre | Sortida o tarda Holga, i enviament al concurs (8 d'octubre – 8 de novembre) |
| Polaroid Week | Abril i octubre (tardor 2026: 18–23 d'octubre) | Només si es treballa amb pel·lícula instantània (CONFIRMAR) |
| World Cyanotype Day | Últim dissabte de setembre | Cianotípia, amb peça col·lectiva |
| Aniversari d'Anna Atkins | 16 de març | Cianotípia i fotollibre |
| Sant Jordi | 23 d'abril | Fotollibre, amb 112Books |
| Worldwide Pinhole Photography Day | Últim diumenge d'abril (25 d'abril de 2027) | Estenopeica i enviament a la galeria mundial |
| Film Photography Day | 12 d'abril (CONFIRMAR si es manté) | — |
| Dia Mundial de la Fotografia | 19 d'agost | Comunicació |

### 9.2 Protocol

| Moment | Web | Xarxes i butlletí | Producció |
|---|---|---|---|
| D-30 | Formació en `draft` | — | Decisions, material i sessió de fotos pròpia |
| D-21 | Fitxa publicada i entrada a l'agenda | Anunci | Peces gràfiques |
| D-14 | Pop-up en fase d'anunci | Carrusel i butlletí | — |
| D-7 | Pop-up amb places | Reel o stories del procés | — |
| Dia D | Pop-up "avui" | Stories en directe | Fotos de l'activitat |
| D+7 | Pop-up desactivat i entrada al blog | Resultats i enllaç a la línia corresponent | Enviament a la galeria internacional |

Les imatges són sempre pròpies i es produeixen expressament: una llista de 5 o 6 fotos per efemèride.

Formats de les peces gràfiques:
- feed 1080×1350;
- stories 1080×1920;
- imatge OG 1200×630;
- targeta del pop-up.

### 9.3 Pop-up

- **Entrada.** Una targeta d'uns 300 px que llisca des del lateral dret fins a mitja alçada de la pantalla, uns 3 segons després de carregar la pàgina.
- **Contingut.** Una imatge, un títol, la data i un botó.
- **Retirada.** Es replega al cap d'uns 8 segons, en fer scroll o en tancar-la, i en queda una pestanya vertical a la vora ("Holga · 8 oct"). Si es clica la pestanya, torna a sortir.
- **En mòbil.** La pestanya és una franja fina a la part inferior.
- **Memòria.** Si es tanca, no es torna a desplegar durant la visita. Es guarda amb `sessionStorage`, que no és una cookie.
- **Accessibilitat.** Respecta `prefers-reduced-motion`, es pot fer servir amb teclat, té `aria-label` i un botó de tancar visible.
- **Una sola alhora.** Si dues efemèrides coincideixen, guanya la que tingui data més propera.
- **Activació automàtica.** S'activa i es desactiva segons les finestres definides a `data/efemerides.yaml`.

---

## 10. Perfils de prova

Abans de publicar l'eina, cal comprovar que cada perfil rep el resultat esperat.

| Perfil | Respostes | Resultat esperat |
|---|---|---|
| Fotògraf/a digital professional que vol tastar l'analògic | `n4` · `b1`, `e2` · `f1` | Revelat B/N, Hasselblad; mai Fonaments |
| Especialista | `n4` · `b5` · `f4` + text | Tutoria (primera opció) i el taller corresponent |
| Teòric/a | `n3` · `d8`, `d9` · `f2` | Fotollibre, tutoria (llenguatge) |
| Pràctic/a i experimental | `n2` · `e5`, `b3` · `f1` | Cianotípia, reveladors artesanals |
| Curiós/a | `n0` · `e6`, `a1` · `f1` | Retrat amb Holga, Fonaments (flash, si n'hi ha una d'activa) |
| Jove que vol millorar en digital | `n1` · `a3`, `a1` · `f2` | Recorregut Fonaments → Revelat B/N, amb la nota "útil també en digital" |
| Digitalitzar records | `n0` · `c4` · `f2` | Digitalització amb escàner |
| Carrer amb compromís | `n3` · `d5`, `d9` · `f3` | Del Carrer al Llibre |

---

## 11. Pendents

1. Quines disciplines del bloc D tenen formació avui i quines van a tutoria (CONFIRMAR els slugs).
2. Els slugs exactes de `copies-beers-developer`, `gran-format-4x5` i `guinneol`, i on encaixa `guinneol`.
3. El preu, la durada i el format (presencial o en línia) de la tutoria, per mostrar-los al resultat.
4. El nombre mínim d'interessats per programar una formació en preparació.
5. Si es treballa amb pel·lícula instantània (Polaroid Week).
6. Què passa quan la formació recomanada no té dates: llista d'espera, avís o tutoria.
7. Les traduccions al castellà i l'anglès de les frases i els motius.

---

## 12. Ordre de treball proposat

1. Canvi de títol de Formació (opció A).
2. Afegir `format`, `nivell_minim` i `estat` al frontmatter de tots els tallers.
3. `data/quiz.yaml` i la validació en el build.
4. La pàgina de l'eina amb `draft: true`, i provar els perfils del punt 10.
5. La connexió amb Brevo (contacte i M'interessa).
6. Migrar "Regala un curs" al motor compartit, amb el filtre d'estat.
7. `data/efemerides.yaml` i el pop-up.
8. Publicació.
