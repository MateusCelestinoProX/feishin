#!/bin/bash
# Install Feishin macOS Customizations
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_BIN="$(which python3 || echo "python3")"

echo "=== Instalando Customizações do Feishin for macOS ==="
$PYTHON_BIN "$SCRIPT_DIR/apply_customizations.py" "$@"

if pgrep -x "Feishin" > /dev/null; then
    echo "[*] Reiniciando Feishin..."
    pkill -9 -f "Feishin" || true
    sleep 1
    open -a "Feishin"
    echo "[✓] Feishin reiniciado!"
fi
