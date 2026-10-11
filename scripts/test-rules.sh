#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Lance les tests des règles Firestore sur l'émulateur local.
#
# Ne touche JAMAIS au projet de production : l'émulateur Firestore est
# purement local et la suite de tests utilise un projectId "demo-".
#
# Prérequis : Java (JRE 11+). Si java n'est pas installé, le JRE téléchargé
# dans ~/java-runtime est utilisé automatiquement s'il est présent.
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v java >/dev/null 2>&1; then
  JRE="$(ls -d "$HOME"/java-runtime/jdk-*-jre 2>/dev/null | head -n1 || true)"
  if [ -n "${JRE:-}" ]; then
    export JAVA_HOME="${JRE}"
    export PATH="${JAVA_HOME}/bin:${PATH}"
    echo "→ Java introuvable sur le système : utilisation de ${JRE}"
  else
    echo "Erreur : Java est requis pour l'émulateur Firestore." >&2
    echo "Installez un JRE (ex. sudo apt install default-jre) ou exécutez :" >&2
    echo "  mkdir -p ~/java-runtime && cd ~/java-runtime" >&2
    echo "  curl -sL 'https://api.adoptium.net/v3/binary/latest/21/ga/linux/x64/jre/hotspot/normal/eclipse' -o jre.tar.gz" >&2
    echo "  tar -xzf jre.tar.gz" >&2
    exit 1
  fi
fi

exec npx firebase emulators:exec --only firestore "node tests/firestore-rules.test.mjs"
