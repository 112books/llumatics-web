#!/usr/bin/env python3
"""
Genera esborranys de campanya a Brevo quan es detecten tallers o posts nous.
Cridat pel GitHub Action newsletter-draft.yml.

Secrets necessaris al repo:
  BREVO_API_KEY  — clau API de Brevo (Settings > API Keys)
  BREVO_LIST_ID  — ID de la llista "Butlletí Llumàtics" a Brevo
"""

import os
import sys
import json
import requests
import frontmatter

SITE_URL = os.environ.get("SITE_URL", "https://llumatics.com")
BREVO_API_KEY = os.environ["BREVO_API_KEY"]
BREVO_LIST_ID = int(os.environ["BREVO_LIST_ID"])
SENDER = {"name": "Llumàtics", "email": "hola@llumatics.com"}

BASE_STYLE = """
  font-family: Georgia, 'Times New Roman', serif;
  max-width: 580px;
  margin: 0 auto;
  padding: 40px 24px;
  color: #1a1a1a;
  line-height: 1.6;
"""

FOOTER_HTML = f"""
<hr style="margin:48px 0 24px;border:none;border-top:1px solid #e0e0e0;">
<p style="font-size:12px;color:#999;margin:0;">
  Llumàtics · Escola de fotografia analògica · Nau Bostik, Barcelona<br>
  <a href="{SITE_URL}" style="color:#999;">llumatics.com</a> ·
  <a href="{{{{ unsubscribe }}}}" style="color:#999;">donar-se de baixa</a>
</p>
"""


def eyebrow(text):
    return f'<p style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888;margin:0 0 8px;">{text}</p>'


def build_taller_html(meta, url):
    title = meta.get("title", "")
    lead = meta.get("lead", meta.get("description", ""))
    image = meta.get("image", "")
    preu_1 = meta.get("preu_1")
    preu_4 = meta.get("preu_4")
    durada = meta.get("durada_hores")

    img_tag = ""
    if image:
        abs_img = image if image.startswith("http") else f"{SITE_URL}{image}"
        img_tag = f'<img src="{abs_img}" alt="{title}" style="width:100%;max-width:580px;display:block;margin:24px 0;border-radius:2px;">'

    preus_html = ""
    if preu_1 and preu_4:
        preus_html = f"""
        <table style="border-collapse:collapse;margin:24px 0;font-size:14px;">
          <tr>
            <td style="padding:4px 16px 4px 0;color:#666;">1 alumne</td>
            <td style="padding:4px 0;font-weight:600;">{preu_1}€</td>
          </tr>
          <tr>
            <td style="padding:4px 16px 4px 0;color:#666;">Grup de 4</td>
            <td style="padding:4px 0;font-weight:600;">{preu_4}€/persona</td>
          </tr>
          {"<tr><td style='padding:4px 16px 4px 0;color:#666;'>Durada</td><td style='padding:4px 0;'>" + str(durada) + " h</td></tr>" if durada else ""}
        </table>
        """

    return f"""
<div style="{BASE_STYLE}">
  {eyebrow("Nou taller")}
  <h1 style="font-size:26px;margin:0 0 8px;font-weight:normal;">{title}</h1>
  {img_tag}
  <p style="font-size:16px;margin:0 0 24px;">{lead}</p>
  {preus_html}
  <p style="font-size:13px;color:#666;margin:0 0 24px;">
    Sota demanda · Màxim 4 alumnes · Nau Bostik, La Sagrera, Barcelona
  </p>
  <a href="{url}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:13px 28px;text-decoration:none;font-size:14px;letter-spacing:0.03em;border-radius:2px;">
    Sol·licita una data →
  </a>
  {FOOTER_HTML}
</div>
"""


def build_blog_html(meta, url):
    title = meta.get("title", "")
    lead = meta.get("lead", meta.get("description", ""))
    image = meta.get("image", "")

    img_tag = ""
    if image:
        abs_img = image if image.startswith("http") else f"{SITE_URL}{image}"
        img_tag = f'<img src="{abs_img}" alt="{title}" style="width:100%;max-width:580px;display:block;margin:24px 0;border-radius:2px;">'

    return f"""
<div style="{BASE_STYLE}">
  {eyebrow("Del laboratori")}
  <h1 style="font-size:26px;margin:0 0 8px;font-weight:normal;">{title}</h1>
  {img_tag}
  <p style="font-size:16px;margin:0 0 32px;">{lead}</p>
  <a href="{url}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:13px 28px;text-decoration:none;font-size:14px;letter-spacing:0.03em;border-radius:2px;">
    Llegir l'article →
  </a>
  {FOOTER_HTML}
</div>
"""


def create_brevo_draft(name, subject, html_content):
    payload = {
        "name": name,
        "subject": subject,
        "sender": SENDER,
        "type": "classic",
        "htmlContent": html_content,
        "recipients": {"listIds": [BREVO_LIST_ID]},
    }
    resp = requests.post(
        "https://api.brevo.com/v3/emailCampaigns",
        headers={"api-key": BREVO_API_KEY, "Content-Type": "application/json"},
        json=payload,
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()


def process_file(filepath):
    filepath = filepath.strip()
    if not filepath or not os.path.exists(filepath):
        print(f"[SKIP] No existeix: {filepath}")
        return

    with open(filepath) as f:
        post = frontmatter.load(f)
    meta = post.metadata

    if meta.get("draft", False):
        print(f"[SKIP] Draft: {filepath}")
        return

    if "tallers" in filepath:
        parts = filepath.replace("\\", "/").split("/")
        try:
            slug = parts[parts.index("tallers") + 1]
        except (ValueError, IndexError):
            print(f"[SKIP] No s'ha pogut extreure slug: {filepath}")
            return
        url = f"{SITE_URL}/tallers/{slug}/"
        title = meta.get("title", slug)
        html = build_taller_html(meta, url)
        result = create_brevo_draft(
            name=f"Nou taller: {title}",
            subject=f"Nou taller a Llumàtics: {title}",
            html_content=html,
        )

    elif "blog" in filepath:
        slug = os.path.basename(filepath).replace(".md", "")
        url = f"{SITE_URL}/blog/{slug}/"
        title = meta.get("title", slug)
        html = build_blog_html(meta, url)
        result = create_brevo_draft(
            name=f"Nou article: {title}",
            subject=title,
            html_content=html,
        )

    else:
        print(f"[SKIP] Tipus desconegut: {filepath}")
        return

    campaign_id = result.get("id", "?")
    print(f"[OK] Esborrany creat #{campaign_id}: {title}")
    print(f"     Brevo → Campanyes → '{result.get('name', '')}'")


def main():
    if len(sys.argv) < 2:
        print("Ús: newsletter_draft.py <fitxer_amb_paths>")
        sys.exit(1)

    list_file = sys.argv[1]
    with open(list_file) as f:
        files = [l.strip() for l in f if l.strip()]

    if not files:
        print("Cap fitxer per processar.")
        return

    for filepath in files:
        try:
            process_file(filepath)
        except requests.HTTPError as e:
            print(f"[ERROR] Brevo API: {e.response.status_code} — {e.response.text}")
        except Exception as e:
            print(f"[ERROR] {filepath}: {e}")


if __name__ == "__main__":
    main()
