#!/usr/bin/env python3
"""
Feishin for macOS — Customization Engine & Installer
Aplica automaticamente todas as customizações:
1. Glassmorphism Flutuante de 2 Paineis (Personal OS Theme)
2. 33 Shaders WebGL Interativos (Aurora, Antigravity, Plasma, Chrome, etc.)
3. Tradução Completa em Português do Brasil (100% PT-BR)
4. Expansão da Tela da Música ao clicar no espaço livre da barra inferior
"""

import os
import sys
import shutil
import subprocess
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CUSTOMIZATIONS_DIR = REPO_ROOT / "customizations"
ASSETS_DIR = CUSTOMIZATIONS_DIR / "assets"
PATCHES_DIR = CUSTOMIZATIONS_DIR / "patches"

DEFAULT_ASAR_PATH = "/Applications/Feishin.app/Contents/Resources/app.asar"

def run_cmd(cmd, cwd=None):
    res = subprocess.run(cmd, shell=True, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"[!] Erro ao executar: {cmd}")
        print(res.stderr)
        raise RuntimeError(f"Command failed: {cmd}")
    return res.stdout

def main():
    target_asar = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_ASAR_PATH
    asar_path = Path(target_asar)

    if not asar_path.exists():
        print(f"[!] Erro: Arquivo {asar_path} não encontrado!")
        print("Certifique-se de que o Feishin está instalado em /Applications/Feishin.app")
        sys.exit(1)

    print(f"[*] Alvo: {asar_path}")

    # 1. Backup
    backup_path = asar_path.with_name("app.asar.bak")
    if not backup_path.exists():
        print(f"[*] Criando backup original em {backup_path}...")
        shutil.copy2(asar_path, backup_path)
    else:
        print(f"[✓] Backup já existente em {backup_path}")

    # 2. Extração
    with tempfile.TemporaryDirectory() as tmp_dir:
        extract_dir = Path(tmp_dir) / "feishin_asar"
        print(f"[*] Extraindo {asar_path.name} para área temporária...")
        run_cmd(f"npx --yes @electron/asar extract \"{asar_path}\" \"{extract_dir}\"")

        renderer_dir = extract_dir / "out" / "renderer"
        assets_dest = renderer_dir / "assets"

        if not assets_dest.exists():
            print(f"[!] Erro: Diretório {assets_dest} não encontrado no asar descompactado.")
            sys.exit(1)

        # 3. Copiar assets customizados
        print("[*] Injetando assets (Personal OS Glass, Shaders WebGL, PT-BR, Tray Mini Panel)...")
        for asset in ["feishin-personal-os.css", "feishin-personal-os.js", "webgl-backgrounds.js", "ogl.js", "pt-br-full.js"]:
            src = ASSETS_DIR / asset
            if src.exists():
                shutil.copy2(src, assets_dest / asset)
                print(f"  [+] Injetado: {asset}")

        tray_panel_src = ASSETS_DIR / "tray-panel.html"
        if tray_panel_src.exists():
            shutil.copy2(tray_panel_src, renderer_dir / "tray-panel.html")
            print("  [+] Injetado: tray-panel.html (Mini Painel macOS)")

        # 4. Atualizar index.html
        custom_index = CUSTOMIZATIONS_DIR / "index.html"
        if custom_index.exists():
            shutil.copy2(custom_index, renderer_dir / "index.html")
            print("  [✓] index.html atualizado com scripts de inicialização e containers WebGL.")

        # 5. Patch no bundle JavaScript
        bundle_files = list(assets_dest.glob("index-*.js"))
        if not bundle_files:
            print("[!] Erro: Nenhum bundle index-*.js encontrado em assets.")
            sys.exit(1)

        target_bundle = bundle_files[0]
        print(f"[*] Aplicando patches cirúrgicos no bundle: {target_bundle.name}...")
        patch_script = PATCHES_DIR / "patch_bundle.py"
        run_cmd(f"python3 \"{patch_script}\" \"{target_bundle}\"")

        # 5b. Patch no processo principal e preload (Tray Mini Panel)
        main_index_file = extract_dir / "out" / "main" / "index.js"
        preload_index_file = extract_dir / "out" / "preload" / "index.js"
        patch_main_script = PATCHES_DIR / "patch_main.py"
        if patch_main_script.exists() and main_index_file.exists():
            print("[*] Aplicando patches no processo principal e preload para Tray Mini Panel...")
            run_cmd(f"python3 \"{patch_main_script}\" \"{main_index_file}\" \"{preload_index_file}\"")

        # 6. Reempacotar asar
        new_asar = Path(tmp_dir) / "app.asar"
        print(f"[*] Reempacotando novo app.asar...")
        run_cmd(f"npx --yes @electron/asar pack \"{extract_dir}\" \"{new_asar}\"")

        # 7. Substituir no aplicativo
        print(f"[*] Aplicando novo app.asar em {asar_path}...")
        shutil.copy2(new_asar, asar_path)

    # 8. Re-assinar o aplicativo no macOS (Ad-hoc signature)
    app_bundle = asar_path.parents[2]
    if app_bundle.name == "Feishin.app" and app_bundle.exists():
        print("[*] Re-assinando Feishin.app com assinatura ad-hoc macOS...")
        try:
            run_cmd(f"codesign --force --deep -s - \"{app_bundle}\"")
            print("[✓] Feishin.app assinado com sucesso.")
        except Exception as e:
            print(f"[!] Aviso na assinatura (pode ser ignorado se já inicializado): {e}")

    print("\n=======================================================")
    print(" Feishin for macOS Customizado com Sucesso! ")
    print(" Reinicie o Feishin para desfrutar da nova experiência.")
    print("=======================================================\n")

if __name__ == "__main__":
    main()
