---
title: "Revelar color com si fos blanc i negre"
layout: "private-doc"
url: "/tallers/revelat-color-bn/privat/doc/"
course_ref: "revelat-color-bn"
image: "/images/tallers/revelat-color-bn.jpg"
noindex: true
sitemap:
  disable: true
robots: "noindex, nofollow"
draft: true
---

## Per què revelar C-41 en química B/N?

Les pel·lícules de color C-41 (les pel·lícules de color més comunes: Kodak Gold, Kodak ColorPlus, Kodak Ultramax, Fuji C200, etc.) estan formulades per ser revelades en el procés C-41, que requereix temperatura precisa de 38 °C i productes específics.

Quan es revelen en química B/N convencional (Rodinal, HC-110, D-76...) els resultats són completament imprevisibles i per tant molt interessants des d'un punt de vista experimental:

- La capa de base ataronjada (orange mask) del negatiu de color no es dissol completament
- Cada capa d'emulsió de color (grogues, magenta, cian) reacciona de manera diferent al revelador B/N
- El resultat és un negatiu de contrast inusual, amb tons mig-alts molt comprimits i ombres pronunciades

## Què esperar: resultats característics

**Contrast**: habitualment alt. Les altes llums tendeixen a saturar-se (highlights burned out), les ombres queden molt fosques.

**Ton de la base ataronjada**: el negatiu tindrà una dominanta ataronjada pronunciada quan s'escaneja. L'inversor automàtic dels escàners pot tenir dificultats per compensar-la.

**Sensibilitat efectiva reduïda**: la química B/N és menys eficient en l'emulsió de color. Compte amb una o dos stops de pèrdua d'efectivitat. Per a una pel·lícula ISO 200, treballa com si fos ISO 100.

**Gra**: depenent del revelador, el gra pot ser molt pronunciat. Rodinal 1+50 a temps llargs dona resultats molt particulars.

## Films recomanats

| Film | ISO nominal | ISO recomanat per a B/N | Notes |
|---|---|---|---|
| Kodak ColorPlus 200 | 200 | 100 | Molt econòmic, base ataronjada forta, contrastos interessants |
| Kodak Gold 200 | 200 | 100 | Tonalitats càlides, gra visible, resultats molt orgànics |
| Kodak Ultramax 400 | 400 | 200-250 | Latitud una mica major, menys brusc |
| Fuji C200 | 200 | 100 | Base ataronjada menys intensa, tons lleugerament més neutres |
| Lomography Color 400 | 400 | 200 | Interessant per a experimentació; colors de base variables |

## Reveladors recomanats i temps

El revelat de C-41 en B/N és molt variable. Aquests temps son punts de partida: experimenta i anota els resultats.

| Revelador | Dilució | Temperatura | Temps orientatiu |
|---|---|---|---|
| Rodinal (R09) | 1+50 | 20 °C | 15-18 min |
| Rodinal | 1+100 (stand) | 20 °C | 60-90 min |
| HC-110 | Dilució B (1+31) | 20 °C | 8-10 min |
| D-76 / ID-11 | 1+1 | 20 °C | 14-16 min |
| Caffenol-C | estàndard | 20 °C | 18-25 min |

**Increment respecte al B/N estàndard**: afegeix un 15-25% al temps habitual per a la mateixa pel·lícula B/N. La base de color resiteix lleugerament el revelador.

## El procés: igual que B/N

El procés és exactament el mateix que per a qualsevol negatiu B/N:

1. Carrega en foscor (igual que qualsevol negatiu)
2. Revela amb el revelador triat a 20 °C
3. Para amb aiguaparat 30 s
4. Fixa amb fixador estàndard 5-7 min (el fixador B/N estàndard funciona bé)
5. Renta 5 min
6. Asseca

**Atenció al fixador**: el fixador B/N dissol la base ataronjada parcialment. El resultat pot tenir una dominanta marronosa-groga. Això és normal.

## Escanejar la base ataronjada

L'escaneig d'un negatiu de color revelat en B/N pot ser complicat:

1. **Escaneja com a transparent positiu** (no com a negatiu de color): dona al software l'oportunitat de veure la imatge "crua".
2. **Inverteix manualment** a Lightroom o Photoshop: ves a Corbes, inverteix tots els canals, i ajusta manualment la dominanta de color.
3. **Negative Lab Pro** (plugin per a Lightroom): gestiona molt bé les dominants difícils de negatiu de color, inclosos els revelats creuats en B/N.
4. **Mètode ràpid**: escaneja en escala de grisos si el teu escàner ho permet en mode transparent. Molts escàners permeten des-activar la compensació de la base de color i donar un negatiu pràcticament neutre.
