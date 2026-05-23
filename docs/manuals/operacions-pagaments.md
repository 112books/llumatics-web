# Manual d'operacions — Pagaments i reserves

---

## 1. Cobrar un taller (flux sota demanda)

### Com funciona

Els tallers de Llumàtics no tenen dates fixes. El flux és:

1. L'alumne omple el formulari "Sol·licita una data" al web
2. Tu reps el missatge i contactes per acordar dia, hora i nombre d'alumnes
3. Un cop acordat, envies el link de pagament per email o WhatsApp
4. L'alumne paga i tu reps confirmació de PayPal
5. El taller queda reservat

### Càlcul del preu

| Alumnes | Fórmula | Exemple (taller 4h) |
|---------|---------|---------------------|
| 1 | `preu_1` | 220€ |
| 2 | `preu_2` per persona | 125€/persona = 250€ total |
| 3 | `preu_3` per persona | 94€/persona = 282€ total |
| 4 | `preu_4` per persona | 79€/persona = 316€ total |

Els preus de cada taller estan al seu frontmatter (`content/ca/tallers/[slug]/index.md`).

### Com enviar el link de pagament (PayPal)

1. Entra a **paypal.com** amb el compte de Llumàtics
2. Menú → **Enviar i sol·licitar** → **Sol·licitar diners**
3. Omple:
   - **Import:** el total (ex: 250€ per 2 alumnes a 125€)
   - **Nota:** ex: `Reserva taller Revelat B/N — 2 persones — 14 juny 2026`
4. Copia el link generat i envia'l per email o WhatsApp a l'alumne
5. L'alumne clica, paga amb targeta o compte PayPal
6. Reps email de confirmació de PayPal a info@llumatics.com

---

## 2. Gestionar un val-regal venut

Quan algú compra un val-regal a `/regala/`, reps dos emails a info@llumatics.com:

**Email 1 — Notificació de venda:**
```
Codi: LLM-2026-XXXXX
Per a: [nom destinatari]
De: [nom comprador]
Taller: [taller escollit]
Import: [import]€
Email comprador: [email]
PayPal order: [ID]
```

**Email 2 — Text de confirmació per al comprador** (web3forms no l'envia automàticament al comprador, ho fas tu manualment):

1. Copia l'email del comprador de l'Email 1
2. Envia'ls el codi i les instruccions:

```
Assumpte: El teu val-regal Llumàtics — [CODI]

Hola [nom comprador],

Gràcies per la teva compra! El val-regal per a [nom destinatari] ja és vàlid.

Codi del val: [CODI]
Taller: [taller]
Import: [import]€
Vàlid 6 mesos a partir d'avui.

Per fer efectiu el val, contacta'ns a hola@llumatics.com indicant el codi
i coordinarem una data.

Llumàtics — llumatics.com
```

### Registre de vals emesos

Recomanem portar un registre manual (full de càlcul o Notes) amb:
- Codi del val
- Data de venda
- Import
- Per a qui és
- Email comprador
- Estat: pendent / bescanviat / caducat

---

## 3. Bescanviar un val-regal

Quan algú contacta per bescanviar un val:

1. Demana el codi del val (format `LLM-YYYY-XXXXX`)
2. Verifica al registre que el val existeix i no ha caducat (6 mesos des de la data de venda)
3. Acorda taller, data i hora
4. Marca el val com a "bescanviat" al registre
5. **No cal cobrar res més** — el val ja estava pagat

Si l'import del val no cobreix el preu actual del taller, es cobra la diferència via el flux de pagament normal (punt 1).

---

## 4. Reemborsaments

PayPal permet fer devolucions des del tauler:

1. paypal.com → **Activitat** → cerca la transacció
2. **Reembossar** → selecciona import parcial o total
3. L'import torna a la targeta/compte de l'alumne en 3-5 dies hàbils

---

## 5. Facturació

Si un alumne o empresa demana factura:

- L'activitat de formació està **exempta d'IVA** (art. 20.1.9 LIVA)
- Emets factura amb: NIF/CIF del client, concepte, import, nota d'exempció d'IVA
- Eines gratuïtes per emetre factures: Holded (pla gratuït), Invoice Ninja, o plantilla Word/Pages
