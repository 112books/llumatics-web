#!/usr/bin/env python3
"""Genera miniatures (JPEG + WebP) per a les galeries d'imatges.

Per a cada imatge d'un directori font, crea a <dir>/thumbs/ una versió
redimensionada (costat més llarg = MAX_PX) en JPEG i WebP. Les plantilles
poden servir la miniatura i deixar la imatge gran només per al lightbox.

Ús:
    python3 scripts/generate-thumbs.py static/images/holga
    python3 scripts/generate-thumbs.py static/images/holga static/images/blog

El script és idempotent: sobreescriu les miniatures existents.
"""
import os
import sys

from PIL import Image

MAX_PX = 360      # costat més llarg de la miniatura
QUALITY = 80

EXTS = ('.jpg', '.jpeg', '.png')


def main():
    dirs = sys.argv[1:] or ['static/images/holga']
    total = 0
    for d in dirs:
        if not os.path.isdir(d):
            print('  ! no existeix:', d, file=sys.stderr)
            continue
        out = os.path.join(d, 'thumbs')
        os.makedirs(out, exist_ok=True)
        for fn in sorted(os.listdir(d)):
            if not fn.lower().endswith(EXTS):
                continue
            src = os.path.join(d, fn)
            if not os.path.isfile(src):
                continue
            im = Image.open(src).convert('RGB')
            w, h = im.size
            scale = MAX_PX / max(w, h)
            if scale < 1:
                im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
            base = os.path.splitext(fn)[0]
            jpg = os.path.join(out, base + '.jpg')
            webp = os.path.join(out, base + '.webp')
            im.save(jpg, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
            im.save(webp, 'WEBP', quality=QUALITY, method=6)
            total += 1
            print('  %-26s → %3d KB jpg · %3d KB webp' % (
                fn, os.path.getsize(jpg) // 1024, os.path.getsize(webp) // 1024))
    print('Miniatures generades:', total)


if __name__ == '__main__':
    main()
