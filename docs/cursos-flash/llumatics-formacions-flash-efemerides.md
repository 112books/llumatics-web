---
titol: "Formacions flash i efemèrides — catàleg de propostes"
projecte: llumatics.com
versio: 0.2
data: 2026-10-02
estat: proposta per validar
relacionat:
  - llumatics-recomanador-quin-curs-em-conve.md
  - tarda-holga-2026.md
---

# Formacions flash i efemèrides

Catàleg de formacions flash lligades a dates del calendari fotogràfic, amb èmfasi en la fotografia experimental. Inclou els criteris comuns, el model de publicació, el protocol de comunicació i una fitxa desenvolupada per a cada proposta.

Complementa el document del recomanador (punts 3, 4 i 9).

Els elements marcats amb **CONFIRMAR** estan pendents.

---

## 1. Criteris comuns

### 1.1 Què és una formació flash

- **Curta:** de 2 a 4 hores, o dues sessions curtes si el procés ho exigeix.
- **Amb data:** lligada a una efemèride internacional, local o històrica.
- **Accessible:** barata o gratuïta. És una porta d'entrada, no un producte de marge.
- **Amb continuació:** sempre acaba indicant a quina línia del metro es pot continuar.
- **Amb imatges pròpies:** tota la comunicació es fa amb fotografies originals de Llumàtics, produïdes expressament per a cada flash.
- **Química:** com tota la formació de Llumàtics. Les excepcions (com Visa pour l'Image) són formació en llenguatge i mirada, transportable a qualsevol fotografia.

### 1.2 Tipus de flash

| Tipus | Descripció | Exemple |
|---|---|---|
| Trobada | Gratuïta, per la joia de compartir. El material es ven a part | Tarda Holga |
| Taller flash | Una sessió de 2 a 4 h amb el material inclòs | Fotografia d'esperits |
| Flash en dues sessions | El procés demana temps entre sessions | Solargrafia |
| Projecte col·lectiu | Diverses setmanes, amb sessió d'obertura i de tancament | Film Swap |
| Sortida | Activitat fora de la Nau | Visa pour l'Image |

### 1.3 Preus

**Tots els preus d'aquest document són orientatius i estan pendents de revisió.** Cal recalcular-los amb el cost real del material i els honoraris de cada persona col·laboradora.

La fórmula general dels tallers (50 €/h + 20 € fixos) no s'aplica a les flash. Proposta inicial:

| Tipus | Preu orientatiu |
|---|---|
| Trobada | Gratuïta. Material a part (p. ex., rodets de B/N a 10 €) |
| Taller flash | Cost del material + 15–25 € |
| Flash en dues sessions | 35–45 € |
| Projecte col·lectiu | 25–40 € (sessions d'obertura i tancament, i revelat) |
| Sortida | Cost (transport + dinar) + honoraris de la guia, desglossat |

Quan hi intervé una persona col·laboradora, els seus honoraris s'afegeixen al preu de manera transparent.

### 1.4 Places

- **Mínim per defecte:** 4 persones (CONFIRMAR).
- **Màxim:** segons l'espai, el laboratori i el material disponible. S'indica a cada fitxa.

---

## 2. Model de publicació al web

Cada proposta passa per aquests estats, definits al document del recomanador:

| Estat | Què es veu al web | Què pot fer la gent |
|---|---|---|
| `en-preparacio` | Títol, una frase i la data aproximada | **M'interessa** (llista de Brevo per a cada flash) |
| `draft: true` | Res. La fitxa completa es prepara al repositori | — |
| `actiu` | Fitxa completa, pop-up i agenda | Inscriure's |

**Flux:**

1. Totes les propostes d'aquest document es publiquen ja com a `en-preparacio`, amb el text públic de la seva fitxa.
2. Quan una arriba al mínim d'interessats (o es decideix fer-la igualment), es prepara la fitxa completa en `draft` i comença el protocol D-30.
3. Quan es publica (`actiu`), entra automàticament al recomanador i s'activa el pop-up segons `data/efemerides.yaml`.
4. Les persones de la llista M'interessa reben l'avís per correu abans que ningú.

**Fitxa mínima en estat `en-preparacio`:**

```yaml
title: "Solargrafia: sis mesos en una llauna"
format: flash
tipus_flash: dues-sessions
estat: en-preparacio
efemeride: solstici-hivern
linia: processos-alternatius
col·laboracio: "Jesús Joglar"
interessats: 0
minim: 4
resum: "Una càmera de llauna que fotografia el sol durant mig any."
```

---

## 3. Protocol de comunicació

### 3.1 Calendari de treball

| Moment | Web | Xarxes i butlletí | Producció |
|---|---|---|---|
| Sempre | Proposta en `en-preparacio` amb M'interessa | Mencions puntuals | — |
| D-30 | Fitxa completa en `draft` | — | Decisions (data, preu, places, material). Sessió de fotos pròpia |
| D-21 | Fitxa publicada i entrada a l'agenda | Primer post. Correu a la llista M'interessa | Edició de les imatges i peces gràfiques |
| D-14 | Pop-up en fase d'anunci | Carrusel i butlletí | — |
| D-7 | Pop-up amb places disponibles | Reel o stories del procés | — |
| Dia D | Pop-up "avui" | Stories en directe | Fotos de l'activitat |
| D+7 | Pop-up desactivat. Entrada al blog | Post de resultats amb enllaç a la línia | Enviament a galeries internacionals, si n'hi ha |

### 3.2 Peces gràfiques per a cada flash

- Feed 1080×1350.
- Stories 1080×1920.
- Imatge OG 1200×630, perquè l'enllaç surti bé quan es comparteix.
- Imatge per a la targeta del pop-up.

### 3.3 El pop-up

Comportament definit al document del recomanador (punt 9.3). En resum:
- una targeta petita que llisca fins a mitja alçada de la pantalla;
- es replega al cap d'uns segons i en deixa una pestanya;
- se n'activa només una alhora;
- les dates d'activació es controlen des de `data/efemerides.yaml`.

### 3.4 Calendari realista per a aquesta tardor

Sense els 30 dies de marge, les flash d'octubre i novembre del 2026 no poden seguir el protocol complet:

- **Polaroid Week (18–23 d'octubre):** passa al 2027.
- **Fotografia d'esperits (31 d'octubre):** només en versió reduïda, si es decideix ara mateix. Si no, passa al 2027.
- **Caffenol (novembre):** és el primer que pot seguir el protocol complet.

---

## 4. Calendari 2026–2027

| Data | Efemèride | Proposta | Tipus | Prioritat |
|---|---|---|---|---|
| Dj 8 oct 2026 | Holga Week (1–7 oct) | Tarda Holga | Trobada | **Preparada** |
| Ds 17 oct 2026 | World Toy Camera Day (3r cap de setmana d'octubre — CONFIRMAR ds/dg) | Trobada Diana F+ / càmera de joguina | Trobada | Mitjana |
| Ds 31 oct 2026 | Castanyada / Halloween | Fotografia d'esperits | Taller flash | Alta (o 2027) |
| Mitjans nov 2026 | Setmana de la Ciència | Caffenol | Taller flash | Mitjana |
| Principis des 2026 | Nadal | Postals i regals en cianotípia | Flash en dues sessions | Alta |
| Dl 21 des 2026 | Solstici d'hivern | Solargrafia (instal·lació) | Flash en dues sessions | Alta |
| Gen–abr 2027 | — | Film Swap Llumàtics | Projecte col·lectiu | Alta |
| Dt 16 mar 2027 | Aniversari d'Anna Atkins | Herbari blau | Taller flash | Mitjana |
| Abr 2027 | Polaroid Week de primavera | Instantània (amb col·laboració) | Taller flash | Alta |
| Dj 22 abr 2027 | Dia de la Terra | Antotípia | Taller flash | Mitjana |
| Dv 23 abr 2027 | Sant Jordi | Llibret fotogràfic artesà | Taller flash | Alta |
| Dg 25 abr 2027 | Worldwide Pinhole Photography Day | Estenopeica a la Nau | Taller flash | Alta |
| Ds 1 maig 2027 | World Wet Plate Day | Col·lodió humit | Demostració | Condicional |
| Dl 21 jun 2027 | Solstici d'estiu | Solargrafia (recollida) | Flash en dues sessions | Alta |
| Dj 5 ago 2027 | #DianaDay | Trobada Diana / clon | Trobada | Mitjana |
| Dc 19 ago 2027 | Dia Mundial de la Fotografia | Només comunicació | — | Baixa |
| Set 2027 | Visa pour l'Image | Escapada a Perpinyà | Sortida | Alta |
| Ds 25 set 2027 | World Cyanotype Day | Cianotípia col·lectiva | Trobada + taller | Alta |
| 1–7 oct 2027 | Holga Week | Sortida Holga | Trobada | Alta |
| Ds 16 oct 2027 | World Toy Camera Day (3r cap de setmana d'octubre — CONFIRMAR ds/dg) | Trobada Diana F+ / càmera de joguina | Trobada | Mitjana |

**Moments forts de l'any:**
- **La setmana gran (del 22 al 25 d'abril):** Dia de la Terra, Sant Jordi i Pinhole Day encadenats.
- **El cicle del sol (del 21 de desembre al 21 de juny):** la solargrafia fa de fil conductor de tota la temporada.

**Fil conductor de la temporada:** el 2026 es commemoren els 200 anys del naixement de la fotografia.

---

## 5. Fitxes de proposta

Cada fitxa té la mateixa estructura:
- estat i col·laboració;
- data i durada;
- places i preu;
- programa;
- material;
- imatges a produir;
- text públic (per a l'estat `en-preparacio`);
- línia de continuació;
- riscos.

---

### 5.1 Tarda Holga — Holga Week 2026

- **Estat:** preparada. Fitxa completa a `tarda-holga-2026.md` i comunicació a `tarda-holga-2026-comunicacio.md`.
- **Data:** dijous 8 d'octubre de 2026, de 18 a 20 h.
- **Tipus:** trobada gratuïta. Rodets de B/N de 120 i 35 mm a 10 €.
- **Continuació:** revelat (opcional) i, després, positivat.
- **Pendents:** el nombre de Holgas de pel·lícula disponibles i el sistema d'inscripció.

---

### 5.2 Fotografia d'esperits — Castanyada

- **Estat:** proposta.
- **Data:** dissabte 31 d'octubre de 2026, a la tarda i al vespre. Si no s'hi arriba a temps, passa al 2027.
- **Durada:** 3 h.
- **Places:** 8.
- **Preu:** material inclòs (rodet i revelat) + 20 € (CONFIRMAR).
- **Programa:**
  1. Història breu: la fotografia d'esperits del segle XIX i el frau dels fotògrafs espiritistes.
  2. Tècnica: exposicions llargues amb figures que es mouen o desapareixen a mitja exposició, i dobles exposicions en càmera.
  3. Pràctica a la Nau, amb poca llum, llanternes, llençols i vestuari.
  4. Revelat en una sessió posterior, o el mateix dia si es fa una versió més llarga.
- **Material:** càmeres amb temps B o amb exposició múltiple, trípodes, disparadors de cable, llanternes, llençols blancs, rodets de B/N d'ISO baixa.
- **Imatges a produir:**
  - una figura "fantasma" a la Nau;
  - una doble exposició amb una cara i una finestra;
  - el trípode a les fosques;
  - un llençol en moviment.
- **Text públic:**
  > A finals del segle XIX, hi havia fotògrafs que asseguraven que fotografiaven esperits. Nosaltres us ensenyem com ho feien. Exposicions llargues, dobles exposicions i molta llum de llanterna, per la Castanyada.
- **Línia de continuació:** Pràctica (llenguatge) i Mig format.
- **Riscos:** cal temps B a les càmeres. Si no n'hi ha prou, cal limitar les places.

---

### 5.3 Caffenol — Setmana de la Ciència

- **Estat:** proposta.
- **Data:** un dia de la Setmana de la Ciència (a mitjans de novembre, CONFIRMAR).
- **Durada:** 3 h.
- **Places:** 6, segons els tancs de revelat.
- **Preu:** material inclòs + 15 € (CONFIRMAR). Cada persona porta un rodet ja disparat, o el compra a 10 €.
- **Programa:**
  1. Per què el cafè revela: la química explicada per a tothom.
  2. Preparació del revelador amb cafè soluble, carbonat de sodi i vitamina C.
  3. Revelat del rodet. Comparació amb un revelador convencional.
  4. Assecat i primera mirada als negatius.
- **Material:** cafè soluble, carbonat de sodi, vitamina C, tancs, termòmetres, fixador.
- **Imatges a produir:**
  - la tassa de cafè al costat del tanc de revelat;
  - un negatiu mullat a contrallum;
  - unes mans pesant els ingredients.
- **Text públic:**
  > El cafè que et beus cada matí pot revelar un rodet. Química de cuina, sense misteris, per la Setmana de la Ciència.
- **Línia de continuació:** Procés, i és la porta de `reveladors-artesanals`.
- **Riscos:** cap destacable. És una de les flash més segures.

---

### 5.4 Postals i regals en cianotípia — Nadal

- **Estat:** proposta.
- **Data:** dues sessions a principis de desembre.
- **Durada:** 2 × 2,5 h.
- **Places:** 8.
- **Preu:** material inclòs + 25 € (CONFIRMAR).
- **Programa:**
  - **Sessió 1.** Sensibilització del paper i preparació de negatius digitals impresos sobre acetat, o de fotogrames amb objectes.
  - **Sessió 2.** Exposició al sol o amb llum UV, revelat amb aigua, virats opcionals (te, cafè) i muntatge de les postals.
- **Material:** química de cianotípia, paper d'aquarel·la, acetats, vidres de contacte, llum UV si no fa sol.
- **Imatges a produir:**
  - les postals estenent-se a assecar;
  - el blau sortint a l'aigua;
  - una postal en un sobre.
- **Text públic:**
  > Aquest Nadal, regala una imatge feta amb el sol. Postals en cianotípia, fetes a mà, una a una.
- **Línia de continuació:** Processos alternatius.
- **Enllaç:** és el millor moment de l'any per activar "Regala un curs".
- **Riscos:** el sol de desembre és feble. Cal llum UV de reserva.

---

### 5.5 Solargrafia: sis mesos en una llauna

- **Estat:** proposta llesta, **pendent de parlar-ho amb Jesús Joglar**, que la conduiria.
- **Dates:**
  - **Sessió 1:** al voltant del solstici d'hivern (dilluns 21 de desembre de 2026, o el cap de setmana més proper).
  - **Sessió 2:** al voltant del solstici d'estiu (dilluns 21 de juny de 2027, o el cap de setmana més proper).
- **Durada:** 2 × 3 h.
- **Places:** 10.
- **Preu:** 35–45 € + honoraris de Jesús Joglar (CONFIRMAR).
- **Programa:**
  - **Sessió 1.** Què és la solargrafia i per què funciona. Construcció d'una càmera estenopeica amb una llauna, càrrega de paper fotogràfic a les fosques, i criteris per triar on instal·lar-la (orientació sud, punt fix, protecció de l'aigua). Cada persona s'emporta la llauna i la instal·la (balcó, terrat, la Nau o el barri).
  - **Sessió 2.** Es recullen les llaunes i el paper s'escaneja sense revelar: la imatge latent apareix directament. Ajustos bàsics de la imatge escanejada. Posada en comú.
- **Durant els sis mesos:**
  - un mapa compartit dels punts on hi ha llaunes (Nou Barris, la Sagrera, la resta de la ciutat);
  - un petit seguiment per correu: "el sol ja ha arribat al punt més baix", "l'equinocci".
- **Material:** llaunes, planxes d'alumini per fer el forat, cinta, paper fotogràfic, bossa de canvi o laboratori, escàner.
- **Imatges a produir:**
  - la llauna instal·lada en un balcó;
  - les mans fent el forat;
  - una solargrafia anterior (de Jesús Joglar, si hi està d'acord).
- **Text públic:**
  > Una llauna, un forat i un full de paper fotogràfic. Del solstici d'hivern al d'estiu, la teva càmera fotografiarà el camí del sol cada dia. Sis mesos per fer una sola imatge.
- **Línia de continuació:** Processos alternatius i Digitalització (l'escaneig és la clau del resultat).
- **Final possible:** una exposició col·lectiva a la Nau al juliol.
- **Riscos:** algunes llaunes es perdran o s'inundaran. Cal dir-ho des del principi: forma part del joc. Cal permís per instal·lar-ne al terrat de la Nau (CONFIRMAR).

---

### 5.6 Film Swap Llumàtics

- **Estat:** proposta.
- **Dates:**
  - sessió d'obertura a mitjans de gener del 2027;
  - període d'intercanvi de 4 a 6 setmanes;
  - sessió de revelat al març;
  - presentació de resultats a la setmana gran d'abril.
- **Places:** de 8 a 16, en nombre parell.
- **Preu:** 25–40 € (sessions d'obertura i de tancament, i revelat) (CONFIRMAR).
- **Com funciona:** una persona dispara un rodet, el rebobina i el passa a una altra, que hi torna a disparar a sobre sense saber què hi ha. El resultat són dobles exposicions a l'atzar.
- **Programa:**
  1. **Sessió d'obertura.** La doble exposició: teoria i pràctica. Es fan les parelles (o cadenes de tres persones) i es marquen els rodets.
  2. **Primer torn.** Cada persona dispara el seu rodet, seguint una llista de motius.
  3. **Intercanvi a la Nau.**
  4. **Segon torn.** Es torna a disparar a sobre amb una segona llista de motius.
  5. **Sessió de revelat i resultats.**
- **Les dues llistes:**
  - **Primer torn:** espais (portes, finestres, escales, cels, carrers).
  - **Segon torn:** textures i persones (fulles, mans, rostres, teixits).
  - Combinar un espai amb una textura funciona millor que combinar dues imatges plenes.
- **Consells tècnics:**
  - subexposar 1 o 2 passos cada exposició, perquè el rodet rebrà llum dues vegades;
  - marcar l'inici del rodet amb un retolador per fer coincidir els fotogrames;
  - deixar la cua del rodet fora en rebobinar.
- **Variants:**
  - **Local:** entre alumnes de Llumàtics.
  - **De barri:** amb 9 Barris Imatge.
  - **Internacional:** amb una altra escola analògica d'un altre país, per correu postal.
- **Imatges a produir:**
  - dos rodets intercanviant-se entre dues mans;
  - un rodet marcat amb retolador;
  - una doble exposició vostra.
- **Text públic:**
  > Tu dispares un rodet. Una altra persona hi torna a disparar a sobre, sense saber què hi ha. Ningú sap què sortirà fins que el revelem. Un projecte col·lectiu de dobles exposicions a l'atzar.
- **Línia de continuació:** Pràctica i Procés.
- **Riscos:** la gent oblida o perd rodets. Cal un calendari de lliurament clar i un correu de recordatori.

---

### 5.7 Herbari blau — aniversari d'Anna Atkins

- **Estat:** proposta.
- **Data:** dimarts 16 de març de 2027, o el cap de setmana anterior. També es pot avançar al 8 de març.
- **Durada:** 3 h.
- **Places:** 8.
- **Preu:** material inclòs + 20 € (CONFIRMAR).
- **Programa:**
  1. Anna Atkins i el primer llibre il·lustrat amb fotografies, fet amb algues en cianotípia.
  2. Recollida i preparació de plantes (o plantes que porta cada persona).
  3. Fotogrames botànics en cianotípia.
  4. Enquadernació senzilla d'un petit herbari de 4 o 6 làmines.
- **Material:** química de cianotípia, paper, plantes, vidres, fil i agulla per enquadernar.
- **Imatges a produir:**
  - una fulla sobre paper sensibilitzat;
  - un herbari obert;
  - el blau sortint de l'aigua.
- **Text públic:**
  > Fa gairebé dos segles, Anna Atkins va fer el primer llibre il·lustrat amb fotografies posant algues sobre paper al sol. Fes el teu herbari blau, en homenatge a una pionera.
- **Línia de continuació:** Processos alternatius i Fotollibre.

---

### 5.8 Instantània: el laboratori dins del paper — Polaroid Week

- **Estat:** proposta amb col·laboració. **Pendent de triar i parlar-ho amb una persona experta** en instantània.
- **Per què encaixa a Llumàtics:** la pel·lícula instantània és fotografia química pura. Cada còpia porta el revelador a dins i el procés es fa sol davant dels teus ulls. És el laboratori més petit del món.
- **Data:** la Polaroid Week de primavera del 2027 (abril, CONFIRMAR dates). Com que n'hi ha dues a l'any, pot ser una cita fixa amb dos formats:
  - **Primavera:** taller amb la persona col·laboradora.
  - **Tardor:** trobada per disparar plegats i compartir resultats.
- **Durada:** 3 h.
- **Places:** 6. La pel·lícula és cara i cal controlar el consum.
- **Preu:** material inclòs (un nombre fix de fotos per persona) + honoraris de la persona col·laboradora (CONFIRMAR).
- **Programa (a definir amb la persona col·laboradora):**
  1. Com funciona la química de la instantània, i per què cada còpia és única.
  2. Disparar: exposició, temperatura i protecció de la llum durant el revelat.
  3. Transferència d'emulsió i lift-off.
  4. Intervencions sobre la còpia (rascar, pintar, manipular durant el revelat).
- **Imatges a produir:**
  - una instantània revelant-se a la mà;
  - una emulsió flotant a l'aigua;
  - una taula plena de còpies.
- **Text públic:**
  > La instantània és el laboratori més petit del món: el revelador va dins de cada còpia. Aprèn a disparar-la, a manipular-la i a treure-li l'emulsió per portar-la sobre altres superfícies.
- **Línia de continuació:** Processos alternatius.

---

### 5.9 Antotípia — Dia de la Terra

- **Estat:** proposta.
- **Data:** dijous 22 d'abril de 2027 (obre la setmana gran).
- **Durada:** 3 h.
- **Places:** 8.
- **Preu:** material inclòs + 15 € (CONFIRMAR).
- **Programa:**
  1. Fotografia sense química industrial: la llum que destenyeix els pigments vegetals.
  2. Preparació d'emulsions amb plantes (espinacs, remolatxa, cúrcuma, pètals).
  3. Preparació de les exposicions, que duren dies. Cada persona s'emporta la seva a casa.
  4. Mostra d'antotípies ja acabades, preparades setmanes abans.
- **Material:** plantes, morter, filtres, alcohol, paper, vidres de contacte.
- **Imatges a produir:**
  - el morter amb pigment;
  - una antotípia groga de cúrcuma;
  - fulles i pètals sobre la taula.
- **Text públic:**
  > Una fotografia feta amb espinacs, remolatxa o pètals de flor. Sense química, sense laboratori: només plantes, sol i paciència. Pel Dia de la Terra.
- **Línia de continuació:** Processos alternatius.
- **Riscos:** l'exposició és molt llarga i el resultat no es veu el mateix dia. Cal explicar-ho bé al text públic.

---

### 5.10 Llibret fotogràfic artesà — Sant Jordi

- **Estat:** proposta.
- **Col·laboració:** 112Books.
- **Data:** divendres 23 d'abril de 2027, o el cap de setmana anterior.
- **Durada:** 3 h.
- **Places:** 8.
- **Preu:** material inclòs + 25 € (CONFIRMAR).
- **Programa:**
  1. Cada persona porta de 15 a 20 còpies petites (o arxius per imprimir).
  2. Seqüència: com es tria i s'ordena un relat de 8 o 12 imatges.
  3. Enquadernació artesana: cosit japonès o acordió.
  4. Presentació dels llibrets.
- **Material:** paper, cartró, fil, agulles, punxons.
- **Imatges a produir:**
  - unes mans cosint un llibret;
  - fotos escampades sobre la taula, en procés de seqüència;
  - un llibret acabat amb una rosa.
- **Text públic:**
  > Per Sant Jordi, fes el teu propi llibre. Tria, ordena i enquaderna a mà un llibret amb les teves fotografies.
- **Línia de continuació:** Fotollibre i Del Carrer al Llibre.

---

### 5.11 Estenopeica a la Nau — Worldwide Pinhole Photography Day

- **Estat:** proposta.
- **Data:** diumenge 25 d'abril de 2027 (tanca la setmana gran).
- **Durada:** 4 h.
- **Places:** 10.
- **Preu:** material inclòs + 20 € (CONFIRMAR).
- **Programa:**
  1. Construcció d'una càmera estenopeica (llauna o caixa).
  2. Càrrega amb paper fotogràfic.
  3. Fotografia a la Nau i als voltants.
  4. Revelat del paper negatiu i positivat per contacte.
  5. Escaneig i enviament a la galeria mundial del Pinhole Day.
- **Visibilitat:** el taller es registra com a esdeveniment al web oficial. Les fotos de la Nau Bostik apareixen a la galeria internacional.
- **Imatges a produir:**
  - una càmera de llauna sobre un mur de la Nau;
  - un negatiu en paper sortint de la cubeta;
  - la Nau vista a través d'una estenopeica.
- **Text públic:**
  > L'últim diumenge d'abril, fotògrafs de tot el món fan fotos sense objectiu: només un forat. Construeix la teva càmera, fes la teva foto i envia-la a la galeria mundial.
- **Línia de continuació:** `fotografia-estenopeica`.
- **Enllaç:** és el moment ideal per presentar el projecte de solargrafia als nous interessats.

---

### 5.12 Col·lodió humit — World Wet Plate Day

- **Estat:** condicional. Llumàtics no té formació de col·lodió (CONFIRMAR).
- **Data:** dissabte 1 de maig de 2027 (primer dissabte de maig).
- **Què és:** se celebra cada any des del 2009. Cada edició té un concepte obert a interpretació: el del 2026 va ser "looking the other way".
- **Opcions:**
  - una xerrada amb demostració a càrrec d'una persona convidada que el practiqui;
  - una sessió de retrats en ferrotip oberta al públic, de pagament per retrat.
- **Línia de continuació:** Gran format.
- **Pendent:** trobar la persona que el practiqui.

---

### 5.13 Escapada a Visa pour l'Image (Perpinyà)

- **Estat:** proposta llesta, **pendent de parlar-ho amb Jordi d'Osona**, que la guiaria.
- **Què és:** el festival internacional de fotoperiodisme més important del món. Se celebra cada any a Perpinyà de finals d'agost a mitjan setembre. L'edició del 2026 va ser del 29 d'agost al 13 de setembre. Les exposicions són gratuïtes i obren cada dia de 10 a 20 h, en espais patrimonials del centre (el Convent dels Mínims, l'Església dels Dominics). Durant la setmana professional hi ha projeccions nocturnes gratuïtes al claustre del Campo Santo.
- **Data proposada:** un dissabte de la primera quinzena de setembre del 2027 (CONFIRMAR quan es publiquin les dates).
- **Tipus:** sortida comentada, d'un dia.
- **Places:** segons el vehicle (minibús o autocar, CONFIRMAR).
- **Preu:** desglossat a la fitxa: transport + dinar + honoraris de la guia (CONFIRMAR).
- **Programa:**

  | Hora | Activitat |
  |---|---|
  | 7:30 | Sortida de Barcelona |
  | 10:00 | Arribada. Primer bloc d'exposicions comentades |
  | 13:30 | Dinar conjunt |
  | 15:00 | Segon bloc d'exposicions comentades |
  | 18:00 | Temps lliure |
  | 19:00 | Tornada |

- **Sessió prèvia (opcional):** una sessió curta a la Nau, una setmana abans, per presentar les exposicions que es veuran.
- **Variant de dos dies:** quedar-se a dormir per veure una projecció del Campo Santo durant la setmana professional. Millor provar primer la versió d'un dia.
- **Per què comentada i no col·lectiva:** com que les exposicions són gratuïtes, una sortida col·lectiva només seria repartir el cost del transport. El valor és veure les exposicions amb algú que ajudi a llegir-les. Amb el preu desglossat, queda clar que es paga per la mirada i no per l'excursió.
- **Imatges a produir:** les de l'edició anterior no són vostres i no es poden fer servir. Per al primer any: un retrat de Jordi d'Osona amb càmera, i imatges del viatge mateix com a material per a l'any següent.
- **Text públic:**
  > Un dia al festival de fotoperiodisme més important del món, a dues hores de Barcelona. Les exposicions comentades per un fotògraf, el dinar plegats i la tornada amb el cap ple d'imatges.
- **Línia de continuació:** Pràctica (llenguatge), i tutoria per a qui vulgui fer reportatge.
- **Nota:** és fotoperiodisme, no fotografia química. Encaixa com a formació en llenguatge i mirada, que és transportable a qualsevol fotografia.

---

### 5.14 Cianotípia col·lectiva — World Cyanotype Day

- **Estat:** proposta.
- **Data:** dissabte 25 de setembre de 2027 (últim dissabte de setembre).
- **Durada:** 4 h, amb format obert (la gent entra i surt).
- **Places:** obertes per a la peça col·lectiva. 8 places per al taller.
- **Preu:** la participació a la peça col·lectiva és gratuïta. Les peces per endur-se, material inclòs + 15 € (CONFIRMAR).
- **Programa:**
  1. Una peça col·lectiva gran feta de petites cianotípies de 10×10 cm, una per persona, seguint el tema que proposin els organitzadors aquell any.
  2. En paral·lel, taller per fer peces pròpies.
  3. Al final, foto de la peça col·lectiva acabada.
- **Imatges a produir:**
  - la graella de quadrats blaus;
  - mans posant objectes sobre el paper;
  - la peça acabada vista des de dalt.
- **Text públic:**
  > L'últim dissabte de setembre és el dia mundial de la cianotípia. Vine a fer un quadrat blau per a la nostra peça col·lectiva. Gratuït, obert, sense experiència prèvia.
- **Línia de continuació:** `cianotipia` i Processos alternatius.

---

### 5.15 Holga Week 2027

- **Estat:** proposta.
- **Data:** de l'1 al 7 d'octubre de 2027.
- **Programa:**
  - una sortida Holga **dins** de la setmana (dissabte 2 o diumenge 3 d'octubre), perquè les fotos puguin entrar al concurs;
  - una sessió de revelat i enviament a partir del 8 d'octubre.
- **Protocol:** complet, començant el 2 de setembre.
- **Material de comunicació:** les fotos de la Tarda Holga 2026, incloent-hi el díptic entre la Holga digital i la pel·lícula.

---

## 6. Col·laboracions

| Persona | Proposta | Estat |
|---|---|---|
| Jesús Joglar | Solargrafia (5.5) | Pendent de parlar-ho |
| Jordi d'Osona | Escapada a Visa pour l'Image (5.13) | Pendent de parlar-ho |
| Jordi | Col·lodió humit (5.12) | Pendent de parlar-ho |
| Perih | Pyrogaelic / revelador propi | Pendent de parlar-ho |
| Per definir (persona experta en instantània) | Polaroid Week (5.8) | Pendent de triar |
| 112Books | Llibret de Sant Jordi (5.10) | Pròpia |
| 9 Barris Imatge | Film Swap de barri (5.6) | Opcional |

A les fitxes de col·laboració, la persona col·laboradora apareix amb el seu nom, una línia de presentació i, si ho vol, un enllaç al seu web.

Els textos dels correus per contactar-los són a docs/cursos-flash/correus-collaboradors.md.

---

## 7. Idees per a més endavant

- **Lumen print:** paper fotogràfic exposat al sol sense revelar. Molt fàcil i molt bo per a infants i famílies. Podria anar a la Festa Major o a activitats de barri.
- **Quimigrames:** pintar amb revelador i fixador sobre paper fotogràfic. Encaixa amb artistes d'altres disciplines.
- **Nit dels Museus i Festa Major de la Sagrera:** portes obertes a la Nau amb demostracions de laboratori.
- **Infraroig analògic:** una flash d'estiu, amb llum dura i vegetació.
- **#DianaDay (5 d'agost):** celebració no oficial de tot el que envolta la càmera Diana, fundada per Denise. Es tracta de disparar amb una Diana (o un clon) el 5 d'agost i publicar les fotos amb l'etiqueta #DianaDay. Sense guanyadors ni premis.
- **World Toy Camera Day (3r cap de setmana d'octubre — CONFIRMAR dissabte o diumenge):** trobada de càmeres de joguina, amb la Diana F+ i la Holga com a protagonistes. Creada per la fotògrafa nord-americana Becky Ramotowski. Es pot reaprofitar el material de la Tarda Holga (càmeres de préstec i rodets).
- **Pyrogaelic:** taller per fabricar el revelador propi (pirogalol) i revelar-hi un rodet. Pendent de validar amb la persona col·laboradora (Perih).
- **Menorca analògica:** curs pendent de desenvolupar (projecte futur, no flash). Detall a docs/cursos-futurs/menorca-analogica.md.

---

## 8. Pendents

**Holga 2026:**
1. El nombre de Holgas de pel·lícula disponibles i el seu format.
2. El sistema d'inscripció (Brevo o correu).

**Decisions generals:**
3. Els preus finals de les flash.
4. El mínim i el màxim de participants per formació.
5. Si la Fotografia d'esperits es fa ja aquest 31 d'octubre o passa al 2027.

**Material i espais:**
6. Quina persona experta en instantània conduiria la Polaroid Week.
7. Si hi ha accés a algú que practiqui el col·lodió humit (Wet Plate Day).
8. On es poden instal·lar llaunes de solargrafia (terrat de la Nau, permisos).
9. Les càmeres disponibles amb temps B (Fotografia d'esperits).

**Col·laboracions:**
10. Parlar la solargrafia amb Jesús Joglar.
11. Parlar l'escapada a Visa pour l'Image amb Jordi d'Osona: honoraris i sessió prèvia.
12. El pressupost del transport a Perpinyà.

**Film Swap:**
13. Versió local, de barri o internacional.
14. Valorar una trobada per #DianaDay (5 ago) i pel World Toy Camera Day (3r cap de setmana d'octubre; Diana F+ i Holga).
