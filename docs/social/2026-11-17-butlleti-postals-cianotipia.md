# Butlletí — «Postals en cianotípia» (11 de desembre de 2026)

Correu per a la llista del butlletí (SQLite, `admin/vals.db` al VPS), remitent `hola@llumatics.com`.

> **Estat: en pausa (2026-11-17).** El proveïdor extern de butlletins ha quedat fora del projecte
> i l'Action que creava esborranys s'ha retirat (`newsletter-draft.yml`). La llista només té **1 subscriptor confirmat**,
> així que la difusió real és Instagram, el pop-up de portada i el correu personal. Aquest text
> queda com a material per si el butlletí es reactiva.

## Assumpte (triar-ne un)

1. `Postals de Nadal fetes amb el sol — 11 de desembre`
2. `Una tarda per fer postals en cianotípia (4 places)`
3. `Cianotípia a la Nau Bostik: postals de Nadal, 11 de desembre`

**Preheader:** `Divendres 11 de desembre, 18–21 h. 55 € amb tot el material. 4 places.`

## Cos en text pla

```
Hola,

Una postal de Nadal no s'ha de fer amb tinta: es pot fer amb el sol.

El divendres 11 de desembre obrim la Nau Bostik de tarda per fer postals en cianotípia. Emulsionem el paper, hi posem objectes, plantes i negatius, i deixem que la llum faci la resta. L'aigua només hi és per revelar-ho; el blau apareix sol.

18–21 h. Tres hores. Marxes amb un joc de postals fetes i revelades allà mateix — fetes per tu.

El desembre el sol va baix i les còpies demanen més minuts. També aprofitem això: serveix per entendre per què la cianotípia depèn del cel.

55 €, amb tot el material inclòs. 4 places. No cal experiència prèvia: si no n'has fet mai, aquesta és la porta d'entrada.

Reserva el teu lloc a https://llumatics.com/tallers/postals-cianotipia-nadal/ o respon a aquest correu i ho quadrem.

Joan — Llumàtics
```

## HTML del correu

```html
<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 580px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a; line-height: 1.6;">

  <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin: 0 0 8px;">Taller flash · Nadal</p>

  <h1 style="font-size: 26px; margin: 0 0 8px; font-weight: normal;">Postals en cianotípia</h1>

  <p style="font-size: 18px; margin: 0 0 24px; color: #555;">Divendres 11 de desembre · 18–21 h · La Nau Bostik</p>

  <img src="https://llumatics.com/images/tallers/postals-cianotipia-nadal.jpg" alt="Postals en cianotípia fetes a la Nau Bostik" style="width: 100%; max-width: 580px; display: block; margin: 24px 0; border-radius: 2px;">

  <p style="font-size: 16px; margin: 0 0 16px;">Una postal de Nadal no s'ha de fer amb tinta: es pot fer amb el sol.</p>

  <p style="font-size: 16px; margin: 0 0 16px;">Emulsionem el paper, hi posem objectes, plantes i negatius, i deixem que la llum faci la resta. L'aigua només hi és per revelar-ho; el blau apareix sol.</p>

  <p style="font-size: 16px; margin: 0 0 24px;">Tres hores. Marxes amb un joc de postals fetes i revelades allà mateix — fetes per tu.</p>

  <table style="border-collapse: collapse; margin: 24px 0; font-size: 14px;">
    <tr><td style="padding: 4px 16px 4px 0; color: #666;">Data</td><td style="padding: 4px 0; font-weight: 600;">divendres 11 de desembre</td></tr>
    <tr><td style="padding: 4px 16px 4px 0; color: #666;">Horari</td><td style="padding: 4px 0; font-weight: 600;">18:00–21:00</td></tr>
    <tr><td style="padding: 4px 16px 4px 0; color: #666;">Lloc</td><td style="padding: 4px 0;">Nau Bostik, La Sagrera, Barcelona</td></tr>
    <tr><td style="padding: 4px 16px 4px 0; color: #666;">Preu</td><td style="padding: 4px 0; font-weight: 600;">55 € · material inclòs</td></tr>
    <tr><td style="padding: 4px 16px 4px 0; color: #666;">Places</td><td style="padding: 4px 0; font-weight: 600;">4</td></tr>
  </table>

  <p style="font-size: 16px; margin: 0 0 28px;">No cal experiència prèvia: si no n'has fet mai, aquesta és la porta d'entrada.</p>

  <a href="https://llumatics.com/tallers/postals-cianotipia-nadal/" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 13px 28px; text-decoration: none; font-size: 14px; letter-spacing: 0.03em; border-radius: 2px;">Reserva el teu lloc →</a>

  <p style="font-size: 16px; margin: 32px 0 0;">Joan — Llumàtics</p>

  <hr style="margin: 48px 0 24px; border: none; border-top: 1px solid #e0e0e0;">

  <p style="font-size: 12px; color: #999; margin: 0;">
    Llumàtics · Escola de fotografia analògica · Nau Bostik, Barcelona<br>
    <a href="https://llumatics.com" style="color: #999;">llumatics.com</a> ·
    <a href="https://llumatics.com/subscribe.php?baixa=TOKEN" style="color: #999;">donar-se de baixa</a>
  </p>

</div>
```

## Com enviar-lo

1. Enviament pel **MTA local** (vegeu `docs/manuals/correu-local.md`), remitent `hola@llumatics.com`.
2. Destinataris: els confirmats de `subscribers` amb `taller = ''` i `estat = 'confirmat'`.
3. Enganxar l'HTML del bloc de dalt i posar assumpte + preheader.
4. Cada destinatari necessita el seu enllaç de baixa (`subscribe.php?baixa=TOKEN`): amb BCC no es pot personalitzar, així que cal enviar-los un a un o habilitar la resposta «baixa».
5. Enviar quan hi hagi imatges millors de la cianotípia, si el Joan ja les té; si no, amb la imatge actual n'hi ha prou.

## Criteris

- Sense emoticones i sense «oferta»: és un taller, no una promoció.
- Les dades de data, hora, preu i places han de coincidir amb la fitxa i l'agenda.
- Sempre «Nau Bostik», mai «Nau» a seques.
