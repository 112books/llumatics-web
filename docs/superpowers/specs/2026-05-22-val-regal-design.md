# Spec: Val-regal — flux de compra complet

**Data:** 2026-05-22  
**Estat:** Aprovat, pendent d'implementació

---

## Objectiu

Implementar el flux complet de compra d'un val-regal a `/regala/`: el comprador passa pel quiz existent, omple un formulari amb les dades del val, paga via PayPal, i rep automàticament el PDF per correu. Llumàtics rep una notificació per fer la factura.

---

## Fora d'abast (fase 2)

- Codis de descompte / codis promocionals
- Verificació de vals al bescanvi (es fa manualment per email)
- Val d'import fix predefinit (s'usa import lliure editable)

---

## Flux de l'usuari

```
/regala/
  │
  ├─ [Quiz existent] 2 preguntes → 3 tallers recomanats
  │
  ├─ "Regala aquest taller" → formulari inline (mateixa pàgina)
  │   ├─ Nom del destinatari *
  │   ├─ Nom del qui regala *
  │   ├─ Missatge personal (textarea, opcional)
  │   ├─ Email del comprador * (on s'envia el PDF)
  │   └─ Import (€) * — pre-omplert amb preu_1 del taller, editable
  │
  ├─ [PayPal Smart Button] — SDK JS oficial
  │   └─ Callback onApprove → POST a Make.com webhook
  │
  ├─ Pàgina mostra agraïment inline (sense redirecció)
  │
  └─ Make.com (paral·lel):
      ├─ Genera codi únic: LLM-YYYY-NNNNN (comptador en Google Sheet)
      ├─ Genera PDF del val-regal
      ├─ Email al comprador: PDF adjunt + agraïment
      └─ Email a hola@llumatics.com: notificació de venda per factura
```

---

## Formulari

Camps (tots obligatoris tret del missatge):

| Camp | Tipus | Notes |
|------|-------|-------|
| `per_a` | text | Nom del destinatari |
| `de` | text | Nom del qui regala |
| `missatge` | textarea | Opcional, màx. ~200 caràcters |
| `email` | email | On s'envia el PDF |
| `import` | number | Pre-omplert amb `preu_1` del taller, min 20, editable |
| `taller_nom` | hidden | Nom del taller recomanat (context per a Llumàtics) |

El formulari apareix inline (sota les cards de recomanació) quan el comprador fa clic a "Regala aquest taller". No es fa servir Tally — el formulari és HTML natiu amb validació JS.

---

## Integració PayPal

- **SDK:** PayPal JavaScript SDK (`sdk.paypal.com/sdk/js?client-id=...&currency=EUR`)
- **Client ID:** s'afegeix a `hugo.toml` com a `paypalClientID`
- **Botó:** `paypal.Buttons({...}).render('#paypal-button-container')`
- **Flux:**
  1. `createOrder`: crea ordre amb l'import del formulari
  2. `onApprove`: quan PayPal confirma, crida `orderActions.order.capture()`, després POST a Make.com
  3. `onError`: mostra missatge d'error inline
- **Dades enviades a Make.com:** `{ per_a, de, missatge, email, import, taller_nom, paypal_order_id, paypal_payer_email, data }`

---

## PDF del val-regal

**Format:** A4 apaïsat (297×210mm), generat per Make.com  
**Fons:** `/static/val-regal/marc-val-regal.png` (1491×1055px)  
**Logo:** `/static/images/llumatics-logo.svg`

**Contingut (camps posicionats sobre el fons):**

```
[Logo Llumàtics]                    Escola de fotografia · BCN

            VAL · REGAL
            ──────────────────────

Per a:   [per_a]

"[missatge]"

De:      [de]

Import:  [import] €

──────────────────────────────────────────────────────────────
Codi:  LLM-2026-00142          Emès:  [data]
Vàlid 6 mesos · hola@llumatics.com · llumatics.com

Aplicable a qualsevol taller de Llumàtics, excepte els
realitzats en col·laboració amb altres centres.
```

**Generació:** Make.com module "Create PDF from template" o similar. Si no disponible al pla actual, alternativa: HTML template → wkhtmltopdf o similar via Make.com HTTP module.

---

## Emails

### Al comprador
- **Assumpte:** `Val-regal Llumàtics — per a [per_a]`
- **Cos:** Agraïment breu, instruccions per imprimir/enviar, recordatori de validesa 6 mesos
- **Adjunt:** PDF del val-regal

### A Llumàtics (`hola@llumatics.com`)
- **Assumpte:** `[Val-regal] [import]€ — [per_a] — comanda [codi]`
- **Cos:** Totes les dades de la compra: comprador, destinatari, import, PayPal order ID, email comprador
- **Ús:** Generar factura manual si el comprador la sol·licita

---

## Codi únic

Format: `LLM-YYYY-NNNNN` (ex: `LLM-2026-00142`)  
Generat per Make.com: llegeix el darrer número d'un Google Sheet, incrementa, desa.  
El Google Sheet actua de registre de vals emesos (codi, data, import, comprador, destinatari, estat).

---

## Fitxers afectats

| Fitxer | Canvi |
|--------|-------|
| `hugo.toml` | Afegir `paypalClientID` als params |
| `themes/llumatics/layouts/_default/gift.html` | Formulari inline + PayPal SDK + lògica JS |
| `themes/llumatics/assets/js/main.js` | Funció `submitGiftOrder()` separada o inline al template |
| `themes/llumatics/assets/css/main.css` | Estils del formulari i estat d'agraïment |
| `static/val-regal/marc-val-regal.png` | Ja existeix ✓ |
| `static/images/llumatics-logo.svg` | Ja existeix ✓ |
| Make.com (extern) | Nou escenari: webhook → PDF → 2 emails |
| Google Sheet (extern) | Registre de vals emesos |

---

## Make.com — escenari (extern, fora del repo)

1. **Trigger:** Webhook (URL existent: `https://hook.eu1.make.com/oq2j1m7ya89as3qtl32lxnvmxgq8qthg`)
2. **Google Sheets:** Llegir últim codi → incrementar → desar nova fila
3. **Generar PDF:** Template amb camp de text sobre imatge de fons
4. **Email comprador:** Brevo o Gmail amb PDF adjunt
5. **Email Llumàtics:** Notificació de venda

---

## Notes d'implementació

- El PayPal Client ID es pot obtenir a developer.paypal.com (compte sandbox per a proves, live per a producció)
- El formulari NO usa Tally (s'evita la dependència externa i la redirecció)
- La validació del formulari és client-side; el botó PayPal no apareix fins que el formulari és vàlid
- L'import mínim és 20€ (per evitar errors de PayPal amb imports massa baixos)
- El missatge personal és opcional; si és buit, el PDF omete el bloc de quotes
