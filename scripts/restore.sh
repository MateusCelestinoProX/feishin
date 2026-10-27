#!/bin/bash
# Restore Feishin macOS to Stock/Original
set -e

APP_RESOURCES="/Applications/Feishin.app/Contents/Resources"
ASAR="$APP_RESOURCES/app.asar"
BAK="$APP_RESOURCES/app.asar.bak"

if [ ! -f "$BAK" ]; then
    echo "[!] Backup original não encontrado em $BAK"
    exit 1
fi

echo "[*] Restaurando app.asar original..."
cp "$BAK" "$ASAR"

echo "[*] Re-assinando Feishin.app..."
codesign --force --deep -s - /Applications/Feishin.app || true

if pgrep -x "Feishin" > /dev/null; then
    echo "[*] Reiniciando Feishin..."
    pkill -9 -f "Feishin" || true
    sleep 1
    open -a "Feishin"
fi

echo "[✓] Feishin restaurado para versão padrão original com sucesso!"
