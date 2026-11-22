# Control de cursos

Registre de sessions impartides i programades, amb l'origen de la inscripció (val-regal,
pagament, invitació) i l'estat del codi associat.

- **Aquest fitxer** és la vista de conjunt, la que es llegeix i s'actualitza a mà.
- **/admin/vals.php** (SQLite admin/vals.db al VPS) és l'estat operatiu dels vals:
  actiu / bescanviat / cancel·lat.
- **/admin/alumnes.php** és la waitlist per taller.

Quan es fa una sessió, s'anota aquí i es marca el val com a bescanviat al panell.

## Sessions

| Data | Hora | Taller | Alumne | Origen | Codi | Import | Estat |
|------|------|--------|--------|--------|------|--------|-------|
| 2026-11-23 | 10:00–14:00 | Taller d'iniciació a la fotografia analògica | Alejandra Céspedes Antolin · alejandracean@gmail.com | val-regal | LLM-2026-0X2ZB | 220 € | Programada |

### Notes de la sessió del 23/11/2026

- Alumna: **Alejandra Céspedes Antolin**, correu **alejandracean@gmail.com**.
- El taller és el que el val identifica com a «Aprende a controlar la luz»: la fitxa
  [fonaments-iniciacio-puntual](/tallers/fonaments-iniciacio-puntual/), 4 h, 1 alumna.
- Val comprat el **2026-07-17** per elenavigoolivan@gmail.com (correu del comprador,
  no de l'alumna); caduca el **2027-01-17**.
- Material: càmera analògica (se'n pot deixar una), carret de 35 mm B/N, plató.
- **2026-11-22** — val passat a *bescanviat* a vals.db (backup: vals.db.bak-20261122),
  amb el nom complet de l'alumna i les notes de la sessió.
- **2026-11-22** — alta a la waitlist de revelat-bn (id 11, estat *espera*).
- Document de l'alumne **v2 publicat al web** el 22/11/2026 a
  /tallers/fonaments-iniciacio-puntual/privat/doc/ (després del formulari, amb el nom a la URL).
- Còpia nominal del material per a ella (v2, 18 p.):
  pdf/alumnes/2026-11-23/alejandra-cespedes-iniciacio-ca.pdf
- Guia per impartir la classe: pdf/fonaments-iniciacio-puntual/fonaments-iniciacio-puntual-guia-professor-ca.pdf (5 p.)

### Correu de lliurament (esborrany)

**Assumpte:** El teu material del taller d'iniciació — Llumàtics

Hola Alejandra,

Gràcies per venir al laboratori. Aquí tens la documentació del taller: el resum del
que vam fer, les taules d'exposició, sis exercicis per continuar amb el carret i la
bibliografia per si vols aprofundir.

Tres coses que et poden anar bé:

- El carret no l'obris i revela'l aviat. Si vols, ho fem al Taller de Revelat B/N.
- Apunta cada foto en una llibreta (número, obertura, velocitat): quan arribi el
  negatiu entendràs per què cada foto ha sortit com ha sortit.
- Quan el tinguis revelat, porta el full de contactes i els mirem junts.

Qualsevol dubte, respon a aquest correu.

Bona llum,
Joan
Llumàtics · Nau Bostik, La Sagrera · llumatics.com

P.D. Si t'ha agradat el taller, una ressenya a Google ens ajuda molt:
https://g.page/r/CRWgnPBp1N1uEBM/review

## Vals-regal

| Codi | Taller | Import | Per a | Comprador | Compra | Caduca | Estat |
|------|--------|--------|-------|-----------|--------|--------|-------|
| LLM-2026-0X2ZB | Taller d'iniciació a la fotografia analògica | 220 € | Alejandra Céspedes Antolin · alejandracean@gmail.com | elenavigoolivan@gmail.com | 2026-07-17 | 2027-01-17 | **Bescanviat** (sessió 23/11/2026) |
| LLM-2026-OPUH9 | Introduction to darkroom printing | 170 € | Nataliia Lisohurska | mdkisselgof@gmail.com | 2026-08-11 | 2027-02-11 | Actiu |

## Pendent

- [ ] Enviar el correu de lliurament amb el PDF adjunt, després de la sessió.
- [ ] Enganxar el full de contactes quan es reveli el carret.

