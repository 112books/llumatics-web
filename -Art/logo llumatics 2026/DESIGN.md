---
version: alpha
name: Llumàtics
colors:
  background: "#0D0D0F"
  surface: "#171717"
  surfaceLight: "#F0F0F0"
  surfaceLightText: "#0D0D0F"
  text: "#F0F0F0"
  muted: "#9AA0A6"
  accent: "#F2A64F"
  darkroomRed: "#C93A3A"
typography:
  display:
    fontFamily: system-ui
    fontSize: 32px
    fontWeight: 700
    letterSpacing: "-0.02em"
  wordmark:
    fontFamily: system-ui
    fontSize: 34px
    fontWeight: 700
  body:
    fontFamily: system-ui
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "Courier New", monospace
    fontSize: 13px
    fontWeight: 600
  tagline:
    fontFamily: system-ui
    fontSize: 12px
    fontWeight: 400
    letterSpacing: "0.08em"
spacing:
  unit: 8px
  logoGap: 16px
rounded:
  circle: "50%"
components:
  logoAperture:
    size: "48px"
    bladeColor: "#262626"
    accentColor: "{colors.accent}"
  logoWordmark:
    colorAccent: "{colors.accent}"
    colorText: "{colors.text}"
  logoTagline:
    color: "{colors.muted}"
    typography: "{typography.tagline}"
---

## Overview

Llumàtics és una escola de fotografia química/anàloga. La identitat visual gira
al voltant de dos símbols de la fotografia: el **diafragma** (obertura de l'obturador)
i el **diafragma f/8**, una de les parades clàssiques i el "punt dolç" de molts
objectius. El nom ve de *llum* + la terminologia òptica; per això l'accent de marca
és un ambre càlid que recorda la llum de la cambra fosca i la paperada fotogràfica.

## Direcció visual

- **Estil**: minimalista tècnic amb ànima analògica. Línies netes, contrast fort,
  tipografia sans-serif robusta i notes monoespaçades com els indicadors de l'objectiu.
- **Contrast**: fons fosc (cambra fosca) amb accents de llum àmber. Funciona igual
  sobre fons clar (paper fotogràfic).
- **Símbol principal**: diafragma amb 8 aspes formant un octàgon; dins, la marca
  *f/8* en tipografia tècnica.
- **Paraula clau**: "Llumàtics" amb la "L" en accent (llum) i la resta en text.

## Aplicacions

- **Rodona** (badge): cercle amb "Llumàtics" a la part superior, diafragma f/8 al
  centre i "escola de fotografia química" a la part inferior. Ideal per a
  Instagram/web.
- **Horizontal**: icona del diafragma + logotip de paraula + subtítol. Per a
  capçaleres web, documents i papereria.
- **Icona**: diafragma f/8 sol (favicon, avatar).

## Usos i limitacions

- Deixa espai mínim d'un cercle de protecció al voltant del símbol del diafragma.
- El logotip rodó manté proporcions 1:1; el horitzontal és flexible.
- No escalfis l'ambre més enllà de `{colors.accent}`; el vermell de cambra fosca només
  s'usa de manera puntual.
