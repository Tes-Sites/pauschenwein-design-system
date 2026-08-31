#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Pauschenwein Design-System · Self-Host-Sync
#
# Kopiert Design-System (Navbar, Footer, Tokens, Smooth-Scroll, Poppins-Fonts,
# Lenis) in eine Site und macht sie damit von jsDelivr unabhängig:
#   • DSGVO: keine Anfrage an einen Drittanbieter-CDN mehr, kein IP-Abfluss
#   • Performance: gleiche Origin -> kein extra DNS/TLS-Handshake, kein
#     render-blockierender Cross-Origin-Roundtrip
#
# Aufruf im Wurzelverzeichnis einer Site (dort, wo index.html liegt):
#
#   curl -sL https://raw.githubusercontent.com/Tes-Sites/pauschenwein-design-system/main/sync.sh | bash
#
# oder wenn das Repo schon lokal liegt:
#
#   bash /pfad/zu/pauschenwein-design-system/sync.sh
#
# Ergebnis: assets/pw-ds/  (Zielordner, siehe TARGET)
#
# Danach in der Site die jsDelivr-URLs ersetzen:
#   <link rel="stylesheet" href="/assets/pw-ds/tokens.css">
#   <link rel="stylesheet" href="/assets/pw-ds/fonts.css">
#   <script src="/assets/pw-ds/navbar.js" defer></script>
#   <script src="/assets/pw-ds/footer.js" defer></script>
#   <script src="/assets/pw-ds/smooth-scroll.js" defer></script>
#
# navbar.js / footer.js / smooth-scroll.js erkennen ihre eigene Basis-URL
# automatisch — es ist KEINE weitere Konfiguration nötig. Logos, Wortmarke
# und Lenis werden dann ebenfalls lokal geladen.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="https://github.com/Tes-Sites/pauschenwein-design-system.git"
REF="${PW_DS_REF:-main}"
TARGET="${PW_DS_TARGET:-assets/pw-ds}"

if [ ! -f "index.html" ]; then
  echo "! Kein index.html im aktuellen Verzeichnis gefunden."
  echo "  sync.sh im Wurzelverzeichnis der Site ausfuehren."
  exit 1
fi

SRC=""
SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-.}")" 2>/dev/null && pwd || true)"
if [ -n "$SELF_DIR" ] && [ -f "$SELF_DIR/navbar.js" ]; then
  SRC="$SELF_DIR"          # lokal vorhandenes Repo verwenden
else
  TMP="$(mktemp -d)"
  echo "> Klone Design-System ($REF) ..."
  git clone --quiet --depth 1 --branch "$REF" "$REPO" "$TMP/ds"
  SRC="$TMP/ds"
fi

echo "> Sync $SRC -> $TARGET"
mkdir -p "$TARGET"
for f in tokens.css fonts.css navbar.js footer.js smooth-scroll.js; do
  cp "$SRC/$f" "$TARGET/$f"
done
rm -rf "$TARGET/assets" "$TARGET/fonts" "$TARGET/vendor"
cp -R "$SRC/assets"  "$TARGET/assets"
cp -R "$SRC/fonts"   "$TARGET/fonts"
cp -R "$SRC/vendor"  "$TARGET/vendor"

REV="$(git -C "$SRC" rev-parse --short HEAD 2>/dev/null || echo unknown)"
cat > "$TARGET/VERSION.txt" <<EOF
Pauschenwein Design-System — lokale Kopie (self-hosted)
Quelle : $REPO
Ref    : $REF
Commit : $REV
Ziel   : $TARGET

Aktualisieren: sync.sh erneut ausfuehren (siehe Kopf der Datei).
Diesen Ordner NICHT manuell editieren — Aenderungen gehoeren ins
Design-System-Repo, damit alle Pauschenwein-Seiten sie bekommen.
EOF

echo "> Fertig. Commit: $REV"
echo "> $TARGET/VERSION.txt geschrieben."
