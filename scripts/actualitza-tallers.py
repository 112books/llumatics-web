#!/usr/bin/env python3
"""
Actualitza els frontmatters dels tallers de Llumàtics al nou format.
Executa des de l'arrel del repositori:
  python3 scripts/actualitza-tallers.py

El script:
- Llegeix cada index.md de content/ca/tallers/
- Substitueix els camps antics pel nou frontmatter
- Escriu el fitxer actualitzat (fa backup amb .bak)
- Elimina camera-i-exposicio (duplicat de fonaments-iniciacio-puntual)
- Reanomena fotografia-estenopèica → fotografia-estenopeica
"""

import os
import re
import shutil

# ── Definició de tots els tallers ──────────────────────────────────────────

TALLERS = {
    "fonaments-iniciacio-puntual": {
        "title": "Aprèn a controlar la llum",
        "subtitle": "Iniciació a la fotografia analògica",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["fonaments"],
        "nivell": "Iniciació",
        "estat": "actiu",
        "preu_1": 220, "preu_2": 125, "preu_3": 94, "preu_4": 79,
        "durada_hores": 4,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["revelat-bn", "fotografia-de-carrer", "fotografia-estenopeica"],
        "tags": ["iniciació", "exposició", "analògica", "manual"],
    },
    "revelat-bn": {
        "title": "Revelat de pel·lícula B/N",
        "subtitle": "Push, pull i el control de la densitat",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["proces"],
        "nivell": "Intermedi",
        "estat": "actiu",
        "preu_1": 220, "preu_2": 125, "preu_3": 94, "preu_4": 79,
        "durada_hores": 4,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["copies-en-paper", "revelats-experimentals", "reveladors-artesanals"],
        "tags": ["revelat", "blanc i negre", "push", "pull", "laboratori"],
    },
    "iniciacio-revelat": {
        "title": "Iniciació al revelat",
        "subtitle": "Carrega el rodet, surt a disparar i revela-ho tu mateix",
        "tipus": "taller",
        "canal": "externs",
        "blocs": ["proces", "fonaments"],
        "nivell": "Iniciació",
        "estat": "actiu",
        "preu_1": 170, "preu_2": 97, "preu_3": 72, "preu_4": 61,
        "durada_hores": 3,
        "max_places": 10,
        "sota_demanda": False,
        "continua_aprenent": ["revelat-bn", "copies-en-paper", "introduccio-al-positivat"],
        "tags": ["revelat", "iniciació", "35mm", "Cameras and Films"],
        "extern_location": "Cameras & Films (c/ Tallers, Barcelona)",
    },
    "introduccio-al-positivat": {
        "title": "Introducció al positivat",
        "subtitle": "La teva primera vegada a l'ampliadora",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["proces"],
        "nivell": "Iniciació",
        "estat": "actiu",
        "preu_1": 170, "preu_2": 97, "preu_3": 72, "preu_4": 61,
        "durada_hores": 3,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["copies-en-paper", "revelat-i-positivat"],
        "tags": ["positivat", "ampliadora", "paper", "laboratori", "iniciació"],
    },
    "copies-en-paper": {
        "title": "Còpies en paper",
        "subtitle": "De negatiu a còpia: treballar amb l'ampliadora",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["proces"],
        "nivell": "Intermedi",
        "estat": "actiu",
        "preu_1": 220, "preu_2": 125, "preu_3": 94, "preu_4": 79,
        "durada_hores": 4,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["revelats-experimentals", "gran-format-4x5"],
        "tags": ["ampliadora", "paper", "còpies", "laboratori", "blanc i negre"],
    },
    "revelat-i-positivat": {
        "title": "Revelat + positivat en un dia",
        "subtitle": "Del carret al paper en una sola jornada",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["proces"],
        "nivell": "Iniciació",
        "estat": "actiu",
        "preu_1": 375, "preu_2": 210, "preu_3": 160, "preu_4": 134,
        "durada_hores": 8,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["revelat-bn", "copies-en-paper"],
        "tags": ["revelat", "positivat", "dia complet", "intensiu", "laboratori"],
    },
    "revelats-experimentals": {
        "title": "Revelats experimentals",
        "subtitle": "Fòrmules artesanals, processos forçats i reveladors casolans",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["proces", "processos-alternatius"],
        "nivell": "Avançat",
        "estat": "actiu",
        "preu_1": 420, "preu_2": 239, "preu_3": 179, "preu_4": 150,
        "durada_hores": 8,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["reveladors-artesanals"],
        "tags": ["revelat", "experimental", "caffenol", "beers", "artesanal"],
    },
    "reveladors-artesanals": {
        "title": "Reveladors artesanals",
        "subtitle": "Formular, barrejar i entendre el que revela les teves imatges",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["processos-alternatius", "proces"],
        "nivell": "Avançat",
        "estat": "actiu",
        "preu_1": 420, "preu_2": 239, "preu_3": 179, "preu_4": 150,
        "durada_hores": 8,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["revelats-experimentals"],
        "tags": ["reveladors", "artesanals", "fòrmules", "química", "Beers", "Caffenol"],
    },
    "digitalitzacio-escaner": {
        "title": "Digitalització i escàner",
        "subtitle": "Els teus negatius mereixen més que una foto amb el mòbil",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["proces"],
        "nivell": "Iniciació",
        "estat": "actiu",
        "preu_1": 220, "preu_2": 125, "preu_3": 94, "preu_4": 79,
        "durada_hores": 4,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": [],
        "tags": ["escàner", "digitalització", "negatius", "Photoshop", "Lightroom"],
    },
    "fotografia-estenopeica": {
        "title": "Fotografia estenopèica",
        "subtitle": "La càmera sense objectiu. El principi de tot.",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["fonaments", "processos-alternatius"],
        "nivell": "Iniciació",
        "estat": "actiu",
        "preu_1": 220, "preu_2": 125, "preu_3": 94, "preu_4": 79,
        "durada_hores": 4,
        "max_places": 4,
        "sota_demanda": True,
        "ideal_institucions": True,
        "continua_aprenent": ["fonaments-iniciacio-puntual", "cianotipia"],
        "tags": ["estenopèica", "pinhole", "paper", "revelat", "construcció", "experimental"],
    },
    "fotogrames-cianotipia": {
        "title": "Fotogrames amb cianotípia",
        "subtitle": "Imatges sense càmera. Primer contacte amb la cianotípia.",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["processos-alternatius", "fonaments"],
        "nivell": "Iniciació",
        "estat": "actiu",
        "preu_1": 120, "preu_2": 68, "preu_3": 51, "preu_4": 43,
        "durada_hores": 2,
        "max_places": 15,
        "sota_demanda": True,
        "ideal_institucions": True,
        "preu_institucions": "A convenir segons assistència",
        "continua_aprenent": ["cianotipia", "fotografia-estenopeica"],
        "tags": ["cianotípia", "fotogrames", "sense càmera", "institucions", "solar"],
    },
    "cianotipia": {
        "title": "Cianotípia",
        "subtitle": "El blau de la llum. Impressió fotogràfica sense càmera ni ampliadora.",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["processos-alternatius"],
        "nivell": "Iniciació",
        "estat": "actiu",
        "preu_1": 420, "preu_2": 239, "preu_3": 179, "preu_4": 150,
        "durada_hores": 8,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["reveladors-artesanals"],
        "tags": ["cianotípia", "procés alternatiu", "impressió", "blau", "solar"],
    },
    "retrat-analogic": {
        "title": "Retrat analògic",
        "subtitle": "La persona davant la càmera. Llum, relació i tècnica.",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["practica"],
        "nivell": "Intermedi",
        "estat": "actiu",
        "preu_1": 220, "preu_2": 125, "preu_3": 94, "preu_4": 79,
        "durada_hores": 4,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["retrat-6x6", "gran-format-4x5"],
        "tags": ["retrat", "plató", "flaix", "analògic", "llum artificial"],
    },
    "retrat-6x6": {
        "title": "Retrat en mig format 6×6",
        "subtitle": "Quan necessites molt més que el pas universal",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["mig-format", "practica"],
        "nivell": "Intermedi",
        "estat": "actiu",
        "preu_1": 220, "preu_2": 125, "preu_3": 94, "preu_4": 79,
        "durada_hores": 4,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["hasselblad-500", "gran-format-4x5"],
        "tags": ["retrat", "mig format", "6x6", "120", "Hasselblad"],
    },
    "hasselblad-500": {
        "title": "El meravellós món Hasselblad",
        "subtitle": "Mig format 6×6 amb la sèrie 500. Secrets, trucs i molt de rodet.",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["mig-format", "practica"],
        "nivell": "Intermedi",
        "estat": "actiu",
        "preu_1": 195, "preu_2": 111, "preu_3": 83, "preu_4": 70,
        "durada_hores": 3.5,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["retrat-6x6", "gran-format-4x5"],
        "tags": ["hasselblad", "mig format", "6x6", "120", "doble exposició"],
    },
    "gran-format-4x5": {
        "title": "Gran format 4×5\"",
        "subtitle": "Fotografia lenta i conscient. Una exposició, una decisió.",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["gran-format"],
        "nivell": "Avançat",
        "estat": "actiu",
        "preu_1": 420, "preu_2": 239, "preu_3": 179, "preu_4": 150,
        "durada_hores": 8,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["retrat-gran-format"],
        "tags": ["gran format", "4x5", "plànxes", "lent", "conscient"],
    },
    "introduccio-gran-format": {
        "title": "Introducció al gran format",
        "subtitle": "Descobreix la fotografia lenta abans de submergir-t'hi de ple",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["gran-format"],
        "nivell": "Intermedi",
        "estat": "actiu",
        "preu_1": 220, "preu_2": 125, "preu_3": 94, "preu_4": 79,
        "durada_hores": 4,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["gran-format-4x5"],
        "tags": ["gran format", "plànxes", "introductori", "4x5"],
    },
    "retrat-gran-format": {
        "title": "Retrat en gran format",
        "subtitle": "Una càmera del segle XIX, paper fotosensible i una persona al davant",
        "tipus": "taller",
        "canal": "externs",
        "blocs": ["gran-format", "practica"],
        "nivell": "Intermedi",
        "estat": "actiu",
        "preu_1": 220, "preu_2": 125, "preu_3": 94, "preu_4": 79,
        "durada_hores": 4,
        "max_places": 4,
        "sota_demanda": False,
        "continua_aprenent": ["gran-format-4x5", "retrat-analogic"],
        "tags": ["gran format", "retrat", "segle XIX", "paper fotosensible"],
        "extern_location": "Cameras & Films (c/ Tallers, Barcelona)",
    },
    "carrer-i-mirada": {
        "title": "Carrer i mirada",
        "subtitle": "Un recorregut fotogràfic per Barcelona. Del lloc al fotollibre.",
        "tipus": "curs",
        "canal": "llumatics",
        "blocs": ["practica"],
        "nivell": "Avançat",
        "estat": "en-preparacio",
        "preu_1": 880, "preu_2": 502, "preu_3": 376, "preu_4": 315,
        "durada_hores": 16,
        "max_places": 3,
        "sota_demanda": True,
        "continua_aprenent": ["tutoria-fotografica"],
        "tags": ["carrer", "street photography", "Barcelona", "fotollibre", "112books"],
    },
    "fotografia-de-carrer": {
        "title": "Fotografia de carrer",
        "subtitle": "La mirada, el temps i la gent. Fotografiar allò que passa.",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["practica"],
        "nivell": "Intermedi",
        "estat": "actiu",
        "preu_1": 195, "preu_2": 111, "preu_3": 83, "preu_4": 70,
        "durada_hores": 3.5,
        "max_places": 4,
        "sota_demanda": True,
        "continua_aprenent": ["carrer-i-mirada", "tutoria-fotografica"],
        "tags": ["carrer", "documental", "mirada", "analògica", "Barcelona"],
    },
    "tutoria-fotografica": {
        "title": "Tutoria fotogràfica",
        "subtitle": "Acompanyament personalitzat al teu ritme i interessos",
        "tipus": "taller",
        "canal": "llumatics",
        "blocs": ["practica"],
        "nivell": "Tots els nivells",
        "estat": "actiu",
        "preu_1": 120, "preu_2": None, "preu_3": None, "preu_4": None,
        "durada_hores": 2,
        "max_places": 1,
        "sota_demanda": True,
        "nota_preu": "Sessió mínima 2 hores. Es pot ampliar a 4h per 220€.",
        "continua_aprenent": [],
        "tags": ["tutoria", "individual", "personalitzat", "projecte", "acompanyament"],
    },
}

ELIMINAR = ["camera-i-exposicio"]
REANOMENAR = {"fotografia-estenopèica": "fotografia-estenopeica"}


def blocs_yaml(blocs):
    if len(blocs) == 1:
        return f'["{blocs[0]}"]'
    return "[" + ", ".join(f'"{b}"' for b in blocs) + "]"


def continua_yaml(slugs):
    if not slugs:
        return "[]"
    lines = "\n".join(f'  - "{s}"' for s in slugs)
    return f"\n{lines}"


def genera_frontmatter(slug, d):
    extern = d["canal"] == "externs"
    is_tutoria = slug == "tutoria-fotografica"

    lines = ["---"]
    lines.append(f'title: "{d["title"]}"')
    lines.append(f'subtitle: "{d["subtitle"]}"')

    # lead i description es mantenen del fitxer original — no els sobreescrivim
    # (el script els preserva del contingut existent)

    lines.append("")
    lines.append("# Classificació")
    lines.append(f'tipus: "{d["tipus"]}"')
    lines.append(f'canal: "{d["canal"]}"')
    lines.append(f'blocs: {blocs_yaml(d["blocs"])}')
    lines.append(f'nivell: "{d["nivell"]}"')
    lines.append(f'estat: "{d["estat"]}"')

    lines.append("")
    lines.append("# Fitxa tècnica")
    lines.append(f'preu_1: {d["preu_1"]}')
    if d["preu_2"] is not None:
        lines.append(f'preu_2: {d["preu_2"]}')
        lines.append(f'preu_3: {d["preu_3"]}')
        lines.append(f'preu_4: {d["preu_4"]}')
    if "nota_preu" in d:
        lines.append(f'nota_preu: "{d["nota_preu"]}"')
    lines.append(f'durada_hores: {d["durada_hores"]}')

    if extern:
        lines.append(f'lloc: "{d.get("extern_location", "Cameras & Films, Barcelona")}"')
        lines.append(f'extern: true')
        lines.append(f'extern_location: "{d.get("extern_location", "Cameras & Films, Barcelona")}"')
    else:
        lines.append(f'lloc: "Llumàtics — Nau Bostik, La Sagrera, Barcelona"')
        lines.append(f'extern: false')

    lines.append(f'max_places: {d["max_places"]}')
    lines.append(f'sota_demanda: {str(d["sota_demanda"]).lower()}')

    if d.get("ideal_institucions"):
        lines.append(f'ideal_institucions: true')
    if "preu_institucions" in d:
        lines.append(f'preu_institucions: "{d["preu_institucions"]}"')

    lines.append("")
    lines.append("# Tallers relacionats")
    lines.append(f'continua_aprenent: {continua_yaml(d["continua_aprenent"])}')

    tags_str = ", ".join(f'"{t}"' for t in d["tags"])
    lines.append(f'tags: [{tags_str}]')

    draft = "true" if d["estat"] in ["en-preparacio", "idea"] else "false"
    lines.append(f'draft: {draft}')
    lines.append("---")

    return "\n".join(lines)


def extreu_contingut(text):
    """Extreu lead, description i el cos del markdown preservant-los."""
    # Troba el tancament del frontmatter
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text

    old_fm = parts[1]
    cos = parts[2].strip()

    # Extreu lead i description del frontmatter antic
    lead = ""
    description = ""
    image = ""
    objective = ""
    methodology = ""
    result = ""
    prerequisites = ""
    target = ""

    for line in old_fm.splitlines():
        if line.startswith("lead:"):
            lead = line[5:].strip().strip('"')
        elif line.startswith("description:"):
            description = line[12:].strip().strip('"')
        elif line.startswith("image:"):
            image = line[6:].strip().strip('"')
        elif line.startswith("objective:"):
            objective = line[10:].strip().strip('"')
        elif line.startswith("methodology:"):
            methodology = line[12:].strip().strip('"')
        elif line.startswith("result:"):
            result = line[7:].strip().strip('"')
        elif line.startswith("prerequisites:"):
            prerequisites = line[14:].strip().strip('"')
        elif line.startswith("target:"):
            target = line[7:].strip().strip('"')

    return {
        "lead": lead,
        "description": description,
        "image": image,
        "objective": objective,
        "methodology": methodology,
        "result": result,
        "prerequisites": prerequisites,
        "target": target,
    }, cos


def processa_fitxer(filepath, slug, dades):
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    # Backup
    shutil.copy(filepath, filepath + ".bak")

    camps, cos = extreu_contingut(text)

    # Genera nou frontmatter
    nou_fm = genera_frontmatter(slug, dades)

    # Afegeix camps preservats (lead, description, image, fitxa pedagògica)
    # just després del title/subtitle al frontmatter
    inserts = []
    if camps.get("lead"):
        inserts.append(f'lead: "{camps["lead"]}"')
    if camps.get("description"):
        inserts.append(f'description: "{camps["description"]}"')
    if camps.get("image"):
        inserts.append(f'image: "{camps["image"]}"')

    # Fitxa pedagògica (camps que no sobreescrivim amb dades.py)
    fitxa = []
    if camps.get("objective"):
        fitxa.append(f'objective: "{camps["objective"]}"')
    if camps.get("methodology"):
        fitxa.append(f'methodology: "{camps["methodology"]}"')
    if camps.get("result"):
        fitxa.append(f'result: "{camps["result"]}"')
    if camps.get("prerequisites"):
        fitxa.append(f'prerequisits: "{camps["prerequisites"]}"')
    if camps.get("target"):
        fitxa.append(f'target: "{camps["target"]}"')

    # Insereix lead/description/image després de subtitle
    if inserts:
        nou_fm = nou_fm.replace(
            f'subtitle: "{dades["subtitle"]}"',
            f'subtitle: "{dades["subtitle"]}"\n' + "\n".join(inserts)
        )

    # Insereix fitxa pedagògica abans de "# Tallers relacionats"
    if fitxa:
        nou_fm = nou_fm.replace(
            "\n# Tallers relacionats",
            "\n# Fitxa pedagògica\n" + "\n".join(fitxa) + "\n\n# Tallers relacionats"
        )

    resultat = nou_fm + "\n\n" + cos + "\n"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(resultat)

    print(f"  ✓ {slug}")


def main():
    base = "content/ca/tallers"

    if not os.path.isdir(base):
        print(f"ERROR: No trobo el directori {base}")
        print("Executa l'script des de l'arrel del repositori.")
        return

    print("\n── Llumàtics: actualització de frontmatters ──\n")

    # 1. Eliminar duplicats
    for slug in ELIMINAR:
        path = os.path.join(base, slug)
        if os.path.isdir(path):
            shutil.rmtree(path)
            print(f"  ✗ eliminat: {slug}")

    # 2. Reanomenar directoris (accents en slugs)
    for vell, nou in REANOMENAR.items():
        vell_path = os.path.join(base, vell)
        nou_path = os.path.join(base, nou)
        if os.path.isdir(vell_path) and not os.path.isdir(nou_path):
            shutil.move(vell_path, nou_path)
            print(f"  → reanomenat: {vell} → {nou}")

    # 3. Actualitzar frontmatters
    print("\nActualitzant frontmatters:\n")
    for slug, dades in TALLERS.items():
        filepath = os.path.join(base, slug, "index.md")
        if os.path.isfile(filepath):
            processa_fitxer(filepath, slug, dades)
        else:
            print(f"  ⚠ no trobat: {slug} ({filepath})")

    print("\n── Fet. Revisa els fitxers .bak si cal recuperar alguna cosa. ──\n")
    print("Comprova el resultat amb: hugo server -D")
    print("Si tot va bé, elimina els backups amb: find content/ca/tallers -name '*.bak' -delete\n")


if __name__ == "__main__":
    main()