---
title: "Digitalització i escàner"
layout: "private-doc"
url: "/tallers/digitalitzacio-escaner/privat/doc/"
course_ref: "digitalitzacio-escaner"
image: "/images/tallers/digitalitzacio-escaner.jpg"
noindex: true
sitemap:
  disable: true
robots: "noindex, nofollow"
draft: false
---

## Tipus d'escàners per a pel·lícula

**Escàner de plana amb adaptador de transparències**
El tipus més comú per a principiants. Escàners com l'Epson Perfection V600 o el Canon CanoScan 9000F permeten escanejar 35mm i 120 en positiu o negatiu. La qualitat és adequada per a impressions fins a 40×50 cm i publicació digital. Preu assequible.

**Escàner de pel·lícula dedicat**
El Plustek OpticFilm 8100/8200, Nikon Coolscan o Pacific Image PrimeFilm. Millor resolució òptica, millor gestió del color i de l'escuma del gra. Ideals per a 35mm. Preu mig-alt.

**Escàner de tambor**
Resolució altíssima, però cara i complexa. Usada per a impressions de gran format o arxiu professional. Poc pràctic per a ús regular.

## Resolució: quants DPI necessito?

La resolució d'escaneig determina la mida màxima d'impressió nítida.

| Ús | DPI recomanats | Equivalent en píxels (35mm) |
|---|---|---|
| Web / xarxes socials | 1.200 dpi | ~3.500 × 5.200 px |
| Impressió fins a 20×30 cm | 2.400 dpi | ~7.000 × 10.400 px |
| Impressió fins a 40×50 cm | 4.800 dpi | ~14.000 × 20.800 px |
| Arxiu màxim | 6.400 dpi | ~18.000 × 27.000 px |

Per a 120 (6×6), la pel·lícula és més gran i amb 1.600 dpi ja s'obté una qualitat equivalent a 4.800 dpi en 35mm.

## Profunditat de color i format de fitxer

**16 bits per canal** (48 bits total): sempre que sigui possible. Permet edicions sense degradació de to. Imprescindible per a negatiu de color on calen correccions importants.

**8 bits**: acceptable per a escanejats finals de blanc i negre o si l'espai de disc és crític.

**TIFF**: format sense pèrdues, ideal per a arxiu i edició posterior. Fitxers grans (30-150 MB per imatge a alta resolució).

**JPEG**: comprimit, adequat per a l'ús final (web, enviar a laboratori). No editeu JPEGs repetidament.

**DNG / RAW de l'escàner**: alguns escàners (Plustek, Nikon) permeten desar el RAW de l'escàner. Màxima flexibilitat d'edició.

## Perfils de color

- Escaneja sempre en **Adobe RGB** si editaràs posteriorment.
- Converteix a **sRGB** just abans d'exportar per a web o enviar a laboratori.
- Per a B/N, escaneja en escala de grisos (1 canal) o en color i converteix en postprocés (més control).

## ICE: eliminació de pols i ratllades

ICE (Image Correction and Enhancement) és una tecnologia integrada en alguns escàners que usa un raig infraroig per detectar pols i ratllades físiques a la pel·lícula i interpolar-les digitalment. Funciona molt bé amb pel·lícules de gelatina d'argent, però **no funciona** amb pel·lícules de base de plata (Kodachrome) ni amb la majoria de pel·lícules de B/N amb gra de plata pur (com Kodak Technical Pan o algunes emulsions antigues).

## Formats de pel·lícula: consideracions

| Format | Portanegatiu | DPI recomanats | Temps aprox. |
|---|---|---|---|
| 35mm (24×36mm) | 6 fotogrames per passada | 2.400-4.800 | 2-5 min/foto |
| 120 (6×6, 6×7, 6×9) | 2-3 fotogrames | 1.600-2.400 | 3-6 min/foto |
| 4×5 polzades | 1 fotograma | 800-1.200 | 5-10 min/foto |

## Inversió de negatiu de color

Els negatius de color C-41 tenen una base ataronjada (orange mask) que complica la inversió automàtica. La majoria del programari d'escàner ho gestiona raonablement. Per a màxim control, escaneja com a positiu (transparència) i inverteix manualment a Lightroom o Darktable amb el mòdul de calibratge de càmera o una corba personalitzada. Plugins específics com Negative Lab Pro (Lightroom) o Grain2Pixel donen excel·lents resultats.

## Flux de treball recomanat

1. Neteja el vidre de l'escàner i la pel·lícula (pinzell antiestàtic o aire comprimit)
2. Escaneja en 16 bits, Adobe RGB, TIFF, resolució adequada al format
3. Desa els TIFFs originals sense modificar (arxiu mestre)
4. Treballa sobre còpies per a edició i exportació
5. Exporta en JPEG sRGB per a ús final
