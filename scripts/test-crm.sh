#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Lance les tests de la logique CRM (src/lib/crm.ts) sur l'émulateur Firestore.
# Même prérequis Java que scripts/test-rules.sh. Aucun accès à la production.
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v java >/dev/null 2>&1; then
  JRE="$(ls -d "$HOME"/java-runtime/jdk-*-jre 2>/dev/null | head -n1 || true)"
  if [ -n "${JRE:-}" ]; then
    export JAVA_HOME="${JRE}"
    export PATH="${JAVA_HOME}/bin:${PATH}"
  else
    echo "Erreur : Java est requis pour l'émulateur Firestore (voir scripts/test-rules.sh)." >&2
    exit 1
  fi
fi

exec npx firebase emulators:exec --only firestore "node tests/crm-emulator.test.mjs"
