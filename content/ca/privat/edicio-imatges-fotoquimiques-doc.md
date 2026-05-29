---
title: "Del negatiu a la imatge — edició digital per a fotografia analògica"
layout: "private-doc"
url: "/tallers/edicio-imatges-fotoquimiques/privat/doc/"
course_ref: "edicio-imatges-fotoquimiques"
image: "/images/tallers/edicio-imatges-fotoquimiques.jpg"
noindex: true
sitemap:
  disable: true
robots: "noindex, nofollow"
draft: false
---

## El flux de treball no destructiu

Quan edites una fotografia analògica escanejada, el principi fonamental és no modificar mai el fitxer original. El flux de treball no destructiu significa que totes les edicions es desen com a instruccions separades, preservant el TIFF o RAW original intacte.

**Eines recomanades:**
- **Lightroom Classic** (Adobe): el més estès, bo per a catàleg i flux eficient.
- **Darktable** (codi obert, gratuït): molt complet, corba d'aprenentatge més pronunciada.
- **Capture One**: excel·lent gestió del color, popular en àmbits professionals.

## La corba tonal per a l'estètica analògica

La diferència visual entre digital i analògic sovint es redueix a la corba tonal. El film no registra negres absoluts ni blancs purs —té uns ombres suaus i unes altes llums suaus característiques.

**Ajust clàssic per a estètica film:**
1. Eleva lleugerament el punt negre (puja el vèrtex inferior de la corba uns 10-15 unitats)
2. Baixa molt lleugerament el punt blanc (baixa el vèrtex superior uns 5-10 unitats)
3. Afegeix un lleuger "S" a la corba per donar contrast als mitjos tons
4. En negatiu de color: lleugerament més calent a les ombres (split toning)

## Gra: afegir de tornada el que l'escàner elimina

L'escaneig amb ICE o el processat de l'escàner elimina part del gra natural de la pel·lícula. Per recuperar l'estètica, afegeix gra digitalment al final del procés d'edició:

- **Lightroom**: panell Efectes > Gra. Ajusta Quantitat (15-35), Mida (25-50), Suavitat (50).
- **Darktable**: mòdul "Grain". Treballar amb ISO equivalent al de la pel·lícula original.
- El gra s'ha d'afegir com a últim pas, sobre la imatge ja editada i a la mida final d'exportació.

## Conversió a B/N

No converteixis mai a escala de grisos directament (elimina informació de color). Usa la conversió B/N amb mixeig de canals per controlar la lluminositat relativa de cada color:

- **Canal vermell alt**: pell clara, cel fosc (efecte ortocromàtic)
- **Canal verd alt**: tons naturals, pell equilibrada
- **Canal blau alt**: pell fosca, cel clar (efecte infraroig lleuger)

A Lightroom, usa el panell "Mescla de B/N". A Darktable, el mòdul "Mixeig de canals" en mode B/N.

## Color grading per a emulsions específiques

Cada emulsió té la seva firma de color. Pots simular-la amb ajustos de Tonalitat, Saturació i Lluminositat (HSL) i amb el mapa de tons:

| Emulsió | Característica principal | Ajust orientatiu |
|---|---|---|
| Kodak Portra 400 | Tons càlids, pell excel·lent | +10 calor, +5 magenta en altes llums |
| Fuji Pro 400H | Verd-cian, fresc i net | -5 calor, +5 verd en mitjos tons |
| Kodak Gold 200 | Tons daurats, saturació alta | +15 calor, +10 groc en altes llums |
| Ilford HP5 (B/N) | Contrast mig, gra pronunciat | Corba lleugera S, gra Mida 40 |

## Eliminació de pols

Pols i ratllades s'eliminen amb l'eina de curació puntual o clonació:
- Utilitza una font propera a la taca per respectar el gra i la textura locals
- Treballa amb la imatge al 100% de zoom
- Fes-ho **abans** d'afegir gra digital (el gra emmascarà les petites irregularitats)

## Exportació

| Destí | Format | Espai de color | Resolució |
|---|---|---|---|
| Web / xarxes | JPEG, qualitat 85-90 | sRGB | 72-150 ppi, mida en píxels adequada |
| Impressió laboratori | JPEG o TIFF | sRGB | 300 ppi a la mida d'impressió |
| Arxiu | TIFF 16 bits | Adobe RGB | resolució original d'escaneig |

## Preservar l'estètica analògica

L'edició digital d'una fotografia analògica no ha de simular perfecció digital. Respecta:
- Les imperfeccions de l'emulsió (vores de fotogrames, irregularitats de revelat)
- El gra com a textura positiva, no com a soroll a eliminar
- Les aberracions del vidre òptic (distorsió, vinyeta suau)
- La compressió de rang dinàmic característica del film
