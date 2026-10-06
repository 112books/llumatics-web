#!/usr/bin/env python3
"""Genera miniatures (JPEG + WebP) per a les galeries d'imatges.

Dues maneres d'usar-lo:

1. Sense arguments: descobreix automàticament totes les imatges dels blocs
   `images:` (galeries) de content/{ca,es,en}/tallers i content/{ca,es,en}/blog
   i genera una miniatura per a cadascuna a <dir>/thumbs/.

2. Amb arguments: processa directoris o fitxers concrets.
       python3 scripts/generate-thumbs.py static/images/holga
       python3 scripts/generate-thumbs.py static/images/blog/foo.jpg

Les plantilles (tallers/single.html, blog/single.html) serveixen
<dir>/thumbs/<nom>.webp (+ fallback .jpg) i deixen la imatge gran per al lightbox.
"""
import os
import re
import sys

from PIL import Image

MAX_PX = 360      # costat més llarg de la miniatura
QUALITY = 80
EXTS = ('.jpg', '.jpeg', '.png')

ROOTS = [
    'content/ca/tallers', 'content/es/tallers', 'content/en/tallers',
    'content/ca/blog', 'content/es/blog', 'content/en/blog',
]


def gallery_images():
    """Retorna el conjunt de rutes (com '/images/...') dels blocs images: del frontmatter."""
    paths = set()
    for root in ROOTS:
        if not os.path.isdir(root):
            continue
        for dp, _, fs in os.walk(root):
            for fn in fs:
                if not fn.endswith('.md'):
                    continue
                s = open(os.path.join(dp, fn), encoding='utf-8', errors='ignore').read()
                for m in re.finditer(r'^images:[ \t]*\n((?:[ \t]+-[ \t]+.*\n?)+)', s, re.M):
                    for line in m.group(1).splitlines():
                        mm = re.match(r'[ \t]+-[ \t]+["\']?([^"\'\s]+)', line)
                        if mm:
                            paths.add(mm.group(1))
    return paths


def thumb_for(src):
    d, fn = os.path.dirname(src), os.path.basename(src)
    out = os.path.join(d, 'thumbs')
    os.makedirs(out, exist_ok=True)
    base = os.path.splitext(fn)[0]
    im = Image.open(src).convert('RGB')
    w, h = im.size
    scale = MAX_PX / max(w, h)
    if scale < 1:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    jpg = os.path.join(out, base + '.jpg')
    webp = os.path.join(out, base + '.webp')
    im.save(jpg, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    im.save(webp, 'WEBP', quality=QUALITY, method=6)
    return jpg, webp


def main():
    args = sys.argv[1:]
    if args:
        files = []
        for a in args:
            if os.path.isdir(a):
                files += [os.path.join(a, f) for f in sorted(os.listdir(a))
                          if f.lower().endswith(EXTS) and os.path.isfile(os.path.join(a, f))]
            elif os.path.isfile(a):
                files.append(a)
            else:
                print('  ! no trobat:', a, file=sys.stderr)
    else:
        files = sorted('/'.join(['static', p.lstrip('/')]) for p in gallery_images())

    total = 0
    for src in files:
        if src.startswith('http') or not os.path.isfile(src):
            print('  ! falta:', src, file=sys.stderr)
            continue
        jpg, webp = thumb_for(src)
        total += 1
        print('  %-38s → %3d KB jpg · %3d KB webp' % (
            os.path.relpath(src, 'static'), os.path.getsize(jpg) // 1024, os.path.getsize(webp) // 1024))
    print('Miniatures generades:', total)


if __name__ == '__main__':
    main()
