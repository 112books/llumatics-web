#!/usr/bin/env bash
# deploy.sh — Build, deploy i notificació Instagram per a Llumàtics
# Ús: ./scripts/deploy.sh
# Configuració: copia .env.example a .env i omple les variables

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"
VPS_HOST="llumatics@vl28359.dinaserver.com"
VPS_DIR="www/"

# Carrega .env si existeix
if [ -f "$ENV_FILE" ]; then
    # shellcheck source=/dev/null
    source "$ENV_FILE"
fi

MAKECOM_TALLER_WEBHOOK="${MAKECOM_INSTAGRAM_TALLER_WEBHOOK:-}"
MAKECOM_AGENDA_WEBHOOK="${MAKECOM_INSTAGRAM_AGENDA_WEBHOOK:-}"

# ── 1. Build Hugo ──────────────────────────────────────────────
echo "→ Build Hugo (producció)..."
cd "$REPO_ROOT"
hugo --minify --baseURL "https://llumatics.com/"

# ── 2. Deploy via rsync ────────────────────────────────────────
echo "→ Deploy al VPS..."
rsync -az --delete --stats \
    --exclude='admin/' \
    public/ \
    "$VPS_HOST:$VPS_DIR"

# ── 3. Detecta tallers nous i envia webhook ────────────────────
echo "→ Detectant contingut nou per a Instagram..."

python3 - "$MAKECOM_TALLER_WEBHOOK" "$MAKECOM_AGENDA_WEBHOOK" << 'PYEOF'
import sys, os, re, json, urllib.request, subprocess
import yaml

taller_webhook = sys.argv[1]
agenda_webhook = sys.argv[2]

def abs_url(path):
    if not path:
        return ''
    return f"https://llumatics.com/{path.lstrip('/')}"

def send_webhook(url, payload, label):
    if not url:
        print(f"  Webhook no configurat — saltat ({label})")
        return
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data,
                                  headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            print(f"  Webhook enviat: {label} — HTTP {resp.status}")
    except Exception as e:
        print(f"  Error enviant webhook per {label}: {e}")

result = subprocess.run(
    ['git', 'diff', '--name-only', '--diff-filter=A', 'HEAD~1', 'HEAD'],
    capture_output=True, text=True
)
if result.returncode != 0:
    print(f"Error executant git diff: {result.stderr}")
    sys.exit(1)

new_files = result.stdout.strip().split('\n') if result.stdout.strip() else []

# ── Tallers nous ──────────────────────────────────────────────
taller_files = [f for f in new_files
                if re.match(r'content/ca/tallers/[^/]+/index\.md$', f)]

for filepath in taller_files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        continue
    fm = yaml.safe_load(match.group(1))
    if fm.get('draft', True) or fm.get('estat') != 'actiu':
        print(f"  Taller saltat (draft o no actiu): {filepath}")
        continue
    slug = filepath.split('/')[3]
    images = fm.get('images', [])
    payload = {
        'slug': slug,
        'title': fm.get('title', ''),
        'lead': fm.get('lead', ''),
        'image': abs_url(fm.get('image', '')),
        'image_1': abs_url(images[0]) if images else abs_url(fm.get('image', '')),
        'image_2': abs_url(images[1]) if len(images) > 1 else abs_url(fm.get('image', '')),
        'durada_hores': fm.get('durada_hores', ''),
        'max_places': fm.get('max_places', 4),
        'lloc': fm.get('lloc', 'Nau Bostik, La Sagrera, Barcelona'),
        'blocs': fm.get('blocs', []),
        'sota_demanda': fm.get('sota_demanda', True),
        'canal': fm.get('canal', 'llumatics'),
        'url': f"https://llumatics.com/tallers/{slug}/",
    }
    send_webhook(taller_webhook, payload, f"taller:{slug}")

# ── Agenda nova ───────────────────────────────────────────────
agenda_files = [f for f in new_files
                if re.match(r'content/ca/agenda/[^/]+\.md$', f)
                and not f.endswith('_index.md')]

for filepath in agenda_files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        continue
    fm = yaml.safe_load(match.group(1))
    if fm.get('draft', False):
        continue
    if fm.get('status') not in ('active', 'soon'):
        continue
    course_ref = fm.get('course_ref', '')
    date_start = str(fm.get('date_start', ''))
    if not course_ref or not date_start:
        continue

    taller_title = course_ref
    taller_image_1 = ''
    taller_image_2 = ''
    taller_path = f"content/ca/tallers/{course_ref}/index.md"
    if os.path.exists(taller_path):
        with open(taller_path, encoding='utf-8') as tf:
            tc = tf.read()
        tm = re.match(r'^---\n(.*?)\n---', tc, re.DOTALL)
        if tm:
            tfm = yaml.safe_load(tm.group(1))
            taller_title = tfm.get('title', course_ref)
            imgs = tfm.get('images', [])
            taller_image_1 = abs_url(imgs[0]) if imgs else abs_url(tfm.get('image', ''))
            taller_image_2 = abs_url(imgs[1]) if len(imgs) > 1 else taller_image_1

    payload = {
        'course_ref': course_ref,
        'title': taller_title,
        'date_start': date_start,
        'time_start': fm.get('time_start', '10:00'),
        'lloc': fm.get('lloc', fm.get('location', 'Nau Bostik, La Sagrera, Barcelona')),
        'max_places': fm.get('max_places', 4),
        'image_1': taller_image_1,
        'image_2': taller_image_2,
        'url': f"https://llumatics.com/tallers/{course_ref}/",
    }
    send_webhook(agenda_webhook, payload, f"agenda:{course_ref}:{date_start}")

print("→ Notificació Instagram completada.")
PYEOF

echo "✓ Deploy complet."
