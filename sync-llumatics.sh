#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
#  Llumàtics — Script de deploy
#  Ús: ./sync-llumatics.sh
# ═══════════════════════════════════════════════════════════════════════


# --- nove funcio variable d'entorn --------
get_baseurl() {
  CURRENT=$(git branch --show-current)

  case "$CURRENT" in
    main)
      echo "https://llumatics.com/"
      ;;
    develop)
      echo "https://112books.github.io/llumatics-web/"
      ;;
    *)
      echo "http://localhost:1313/"
      ;;
  esac
}
# --- fi nova funció variable d'entorn

set -euo pipefail

# ── Variables ────────────────────────────────────────────────────────────
REMOTE="origin"
BUILD_DIR="public"
BRANCH_STAGING="develop"
BRANCH_PROD="main"
REPO_STAGING="https://112books.github.io/llumatics-web/"
REPO_PROD="https://llumatics.com/"

# VPS (futur — omplir quan estigui configurat)
SSH_USER=""
SSH_HOST=""
SSH_PATH=""

# ── Colors i helpers ─────────────────────────────────────────────────────
RED='\033[0;31m'
GRN='\033[0;32m'
YLW='\033[1;33m'
BLU='\033[0;34m'
DIM='\033[2m'
RST='\033[0m'

print() { echo -e "${BLU}▶${RST} $1"; }
ok()    { echo -e "${GRN}✓${RST} $1"; }
err()   { echo -e "${RED}✗ Error:${RST} $1" >&2; }
warn()  { echo -e "${YLW}⚠${RST}  $1"; }
dim()   { echo -e "${DIM}  $1${RST}"; }

require_clean() {
  if ! git diff --quiet || ! git diff --cached --quiet; then
    err "Hi ha canvis sense confirmar (commit pendent)."
    echo ""
    git status --short
    echo ""
    exit 1
  fi
}

require_vps() {
  if [[ -z "$SSH_USER" || -z "$SSH_HOST" || -z "$SSH_PATH" ]]; then
    err "VPS no configurat. Edita sync-llumatics.sh i omple SSH_USER, SSH_HOST i SSH_PATH."
    exit 1
  fi
}

# ── Funcions ─────────────────────────────────────────────────────────────

status() {
  echo ""
  CURRENT=$(git branch --show-current)
  print "Branca actual: ${YLW}${CURRENT}${RST}"
  echo ""
  git status --short
  echo ""
  dim "Últims commits:"
  git log --oneline -5
  echo ""
}

sync() {
  CURRENT=$(git branch --show-current)
  print "Sincronitzant amb ${REMOTE}/${CURRENT}..."

  git add -A

  if ! git diff --cached --quiet; then
    git commit -m "Auto-sync"
  fi

  git pull --rebase "$REMOTE" "$CURRENT" || {
    err "Pull/rebase fallat. Resol els conflictes manualment."
    exit 1
  }

  git push "$REMOTE" "$CURRENT" || exit 1
  ok "Sync complet (${CURRENT})"
}

build_local() {
  print "Build local (amb drafts)..."
  hugo --minify --buildDrafts || exit 1
  ok "Build correcte → ./${BUILD_DIR}/"
}

server_local() {
  print "Arrancant servidor local (http://localhost:1313)..."
  print "Ctrl+C per aturar."
  echo ""
  hugo server -D
}

build_staging() {
  print "Build staging..."

  BASEURL=$(get_baseurl)

  hugo --minify \
       --baseURL "$BASEURL" \
       --buildDrafts

  ok "Build staging correcte → ./${BUILD_DIR}/"
}

build_prod() {
  print "Build producció..."

  BASEURL=$(get_baseurl)

  hugo --minify \
       --baseURL "$BASEURL"

  ok "Build producció correcte → ./${BUILD_DIR}/"
}

deploy_staging() {
  require_clean
  CURRENT=$(git branch --show-current)
  if [[ "$CURRENT" != "$BRANCH_STAGING" ]]; then
    warn "No estàs a la branca ${BRANCH_STAGING}. Canviant..."
    git checkout "$BRANCH_STAGING"
  fi
  build_staging
  print "Pujant a GitHub (branca ${BRANCH_STAGING})..."
  dim "El GitHub Action s'encarregarà del deploy i el xifrat (staticrypt)."
  git push "$REMOTE" "$BRANCH_STAGING" || exit 1
  ok "Deploy staging iniciat → ${REPO_STAGING}"
  dim "Segueix el progrés a: https://github.com/112books/llumatics-web/actions"
}

deploy_prod() {
  require_clean
  CURRENT=$(git branch --show-current)
  if [[ "$CURRENT" != "$BRANCH_PROD" ]]; then
    warn "No estàs a la branca ${BRANCH_PROD}."
    read -r -p "  Vols fer merge de ${BRANCH_STAGING} → ${BRANCH_PROD}? [s/N] " confirm
    if [[ "$confirm" =~ ^[Ss]$ ]]; then
      git checkout "$BRANCH_PROD"
      print "Fent merge de ${BRANCH_STAGING}..."
      git merge "$BRANCH_STAGING" --no-edit || {
        err "Merge fallat. Resol els conflictes manualment."
        exit 1
      }
    else
      err "Opera des de la branca ${BRANCH_PROD} o confirma el merge."
      exit 1
    fi
  fi
  build_prod
  print "Pujant a GitHub (branca ${BRANCH_PROD})..."
  dim "El GitHub Action s'encarregarà del deploy i el xifrat (staticrypt)."
  git push "$REMOTE" "$BRANCH_PROD" || exit 1
  ok "Deploy producció iniciat → ${REPO_PROD}"
  dim "Segueix el progrés a: https://github.com/112books/llumatics-web/actions"
}

deploy_vps() {
  require_vps
  require_clean
  build_prod
  print "Pujant a VPS via rsync (${SSH_HOST})..."
  rsync -avz --delete \
    --exclude='.well-known' \
    --exclude='ssl' \
    "${BUILD_DIR}/" "${SSH_USER}@${SSH_HOST}:${SSH_PATH}" || exit 1
  ok "Deploy VPS fet → ${REPO_PROD}"
}

new_taller() {
  read -r -p "  Slug del taller (ex: gran-format): " slug
  if [[ -z "$slug" ]]; then
    err "El slug no pot estar buit."
    exit 1
  fi
  hugo new content "ca/tallers/${slug}/index.md"
  ok "Creat: content/ca/tallers/${slug}/index.md"
  dim "Recorda crear també la pàgina privada: content/ca/tallers/${slug}/privat/index.md"
}

new_data() {
  read -r -p "  Slug (ex: revelat-bn-juny-2026): " slug
  if [[ -z "$slug" ]]; then
    err "El slug no pot estar buit."
    exit 1
  fi
  hugo new content "ca/agenda/${slug}.md"
  ok "Creat: content/ca/agenda/${slug}.md"
}

# ── Menú ─────────────────────────────────────────────────────────────────

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Llumàtics — Deploy & Gestió"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
CURRENT=$(git branch --show-current 2>/dev/null || echo "?")
echo -e " Branca: ${YLW}${CURRENT}${RST}"
echo ""
echo " 1) Status"
echo " 2) Sync (git pull + push)"
echo " 3) Servidor local  →  localhost:1313"
echo " 4) Build local"
echo " 5) Deploy staging  →  GitHub Pages (develop)"
echo " 6) Deploy producció → GitHub Pages (main)"
echo " 7) Deploy VPS       [futur]"
echo "───────────────────────────────"
echo " n) Nou taller"
echo " d) Nova data d'agenda"
echo "───────────────────────────────"
echo " 0) Sortir"
echo ""

read -r -p "Opció: " opt
echo ""

case $opt in
  1) status ;;
  2) sync ;;
  3) server_local ;;
  4) build_local ;;
  5) deploy_staging ;;
  6) deploy_prod ;;
  7) deploy_vps ;;
  n) new_taller ;;
  d) new_data ;;
  0) exit 0 ;;
  *) err "Opció no vàlida: '${opt}'" ; exit 1 ;;
esac

echo ""
