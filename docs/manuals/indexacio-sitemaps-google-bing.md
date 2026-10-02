# Indexació i sitemaps — Google Search Console i Bing Webmaster Tools

**Estat:** pendent — fer-ho quan es pugui.
**Per què:** el `robots.txt` ja assenyala `https://llumatics.com/sitemap.xml`, però cal confirmar l'alta i el reenviament als panells de cerca perquè Google i Bing processin els canvis ràpidament (pàgines noves com `/laboratori-fotografic-barcelona/`, títols nous, etc.).

## Sitemaps del lloc
- Índex: `https://llumatics.com/sitemap.xml`
- CA: `https://llumatics.com/ca/sitemap.xml`
- ES: `https://llumatics.com/es/sitemap.xml`
- EN: `https://llumatics.com/en/sitemap.xml`

## Google Search Console
1. `search.google.com/search-console` → propietat `llumatics.com`. Si no hi és: "Afegeix propietat" → prefix d'URL → verificar per DNS o fitxer HTML.
2. Menú **Sitemaps** → "Afegeix un sitemap nou" → `sitemap.xml`.
3. Revisa **Indexació de pàgines** (errors, excloses) i **Millores**.
4. Després de canvis grans: torna a enviar el sitemap (no cal esborrar-lo abans).

## Bing Webmaster Tools
1. `bing.com/webmasters` → entra-hi (es pot **importar** la propietat directament des de Google Search Console).
2. **Sitemaps** → afegeix `https://llumatics.com/sitemap.xml`.
3. Revisa **Index Explorer** i els errors de rastreig.
4. Opcional: **IndexNow** + clau per notificar canvis a l'instant.

## Comprovacions ràpides
- `curl -s https://llumatics.com/robots.txt | grep -i sitemap` → ha de mostrar la línia `Sitemap:`.
- `curl -s https://llumatics.com/sitemap.xml` → ha de retornar 200 i els 3 sub-sitemaps.
- Els sub-sitemaps han d'incloure les URLs noves (p. ex. la landing del laboratori).

## Periodicitat
- Reenviar després de publicar pàgines noves o canvis d'URL grans.
- Revisar la cobertura 1 cop al mes, o quan es faci feina de SEO.

---
*Creat: 2026-10-03. Pendent d'executar (requereix accés als comptes de Google i Bing del propietari).*
