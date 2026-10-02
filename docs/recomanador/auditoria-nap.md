---
titol: "Auditoria NAP — Llumàtics"
data: 2026-10-02
estat: fet
---

# Auditoria NAP (Name, Address, Place)

## Resultat intern

La dada de Llumàtics és consistent a tot el web:

- **Nom:** Llumàtics
- **Adreça:** Nau Bostik, Carrer de Ferran Turné 1-11, 08027 Barcelona
- **Barri:** La Sagrera
- **Correu:** hola@llumatics.com

Comprovat a: schema JSON-LD (head.html, `postalCode: 08027`), `llms.txt`, pàgines legals (avís legal i privacitat, CA/ES/EN), pàgina de contacte, FAQ i les noves landings `aprendre-a-revelar`.

Els codis postals `08003` que apareixen a `iniciacio-revelat` i `retrat-gran-format` són de **Cameras & Films** (Carrer d'en Rosic 3, 08003 Barcelona), la seu de les col·laboracions externes, i són correctes.

## Causa externa de l'error "Gràcia"

La IA va dir que Llumàtics és "al barri de Gràcia o rodalia". Aquesta dada no surt del web (aquí sempre diem La Sagrera). Cal revisar fora del repositori:

1. **Google Business Profile**: adreça i barri (Ferran Turné 1-11, 08027, La Sagrera). És la font més probable d'un AI Overview.
2. Fitxes duplicades o antigues a Apple Maps, Bing Places i directoris de tallers.
3. Que el nom sigui sempre "Llumàtics" i el correu/telèfon consistents.

## Accions fetes

- Nova landing `aprendre-a-revelar` (CA/ES/EN) amb NAP explícit a l'inici i a la FAQ.
- FAQ citable amb la ubicació a cada fitxa de revelat i positivado.
- `llms.txt` amb secció de respostes directes i 08027 corregit.

## Pendent (extern)

- Revisar i corregir el Google Business Profile.
- Revisar directoris externs.
