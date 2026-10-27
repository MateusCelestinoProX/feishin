#!/bin/bash
# Install Feishin macOS Customizations
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_BIN="$(which python3 || echo "python3")"

echo "=== Instalando Customizações do Feishin for macOS com SafeGuard ==="
$PYTHON_BIN "$SCRIPT_DIR/apply_customizations.py" "$@"
