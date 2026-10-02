#!/usr/bin/env python3
"""Genera còpies WebP de les imatges principals dels tallers i del blog.

Per a cada camp `image:` del frontmatter de content/{ca,es,en}/tallers i
content/{ca,es,en}/blog, crea un fitxer .webp germà (mateix nom) dins static/.
Després, les plantilles poden servir-lo amb <picture><source type="image/webp">.

Pendent (2026-10-02): falta implementar el <picture> a tallers/single.html,
blog/single.html i _default/single.html, i apuntar-hi el preload del head.
"""
import os, re, subprocess, sys

ROOTS = [
    'content/ca/tallers', 'content/es/tallers', 'content/en/tallers',
    'content/ca/blog', 'content/es/blog', 'content/en/blog',
]

def main():
    paths = set()
    for root in ROOTS:
        if not os.path.isdir(root):
            continue
        for dp, _, fs in os.walk(root):
            for fn in fs:
                if not fn.endswith('.md'):
                    continue
                s = open(os.path.join(dp, fn), encoding='utf-8', errors='ignore').read()
                m = re.search(r'^image:\s*"([^"]+)"', s, re.M)
                if m:
                    paths.add(m.group(1))
    gen = 0
    for p in sorted(paths):
        if not p.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        fp = os.path.join('static', p.lstrip('/'))
        if not os.path.isfile(fp):
            print('  ! falta', fp, file=sys.stderr)
            continue
        webp = os.path.splitext(fp)[0] + '.webp'
        if os.path.isfile(webp):
            continue
        subprocess.run(['cwebp', '-q', '82', '-m', '6', '-metadata', 'none', fp, '-o', webp],
                       capture_output=True)
        gen += 1
    print('WebP generals:', gen)

if __name__ == '__main__':
    main()
