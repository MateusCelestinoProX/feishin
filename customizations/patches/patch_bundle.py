#!/usr/bin/env python3
"""
Patch cirúrgico para o bundle JavaScript principal do Feishin (out/renderer/assets/index-C3w9ueFE.js).
Aplica:
1. Tradução Completa PT-BR via injeção dinâmica no i18next e fallback padrão para pt-BR.
2. Toggle da Tela da Música (FullScreenPlayer) ao clicar em espaço livre da barra do player inferior,
   preservando os botões interativos (Play/Pause, busca, volume, links).
"""

import sys
import os

def patch_bundle(file_path):
    if not os.path.exists(file_path):
        print(f"[!] Erro: Arquivo {file_path} não encontrado.")
        sys.exit(1)

    with open(file_path, "r", encoding="utf-8") as f:
        js = f.read()

    modified = False

    # 1. Patch de Localização PT-BR
    target_i18n = 'Ce.use(E8e).use(z8e).use(I8e).use(L8e).use(Eje).init({fallbackLng:"en",interpolation:{escapeValue:!1},resources:R8e});'
    replacement_i18n = 'const _initLng=(()=>{try{const s=JSON.parse(localStorage.getItem("store_settings"));if(s?.general?.language)return s.general.language}catch(e){}return "pt-BR"})();if(typeof window!=="undefined"&&window.__PT_BR_FULL__){R8e["pt-BR"]={translation:window.__PT_BR_FULL__};}Ce.use(E8e).use(z8e).use(I8e).use(L8e).use(Eje).init({lng:_initLng,fallbackLng:"en",interpolation:{escapeValue:!1},resources:R8e});window.i18n=Ce;if(window.__PT_BR_FULL__){Ce.addResourceBundle("pt-BR","translation",window.__PT_BR_FULL__,true,true);}'

    if target_i18n in js:
        js = js.replace(target_i18n, replacement_i18n, 1)
        print("[✓] Patch PT-BR aplicado com sucesso.")
        modified = True
    elif replacement_i18n in js:
        print("[-] Patch PT-BR já estava aplicado.")
    else:
        print("[!] Aviso: Padrão target_i18n não encontrado no bundle.")

    # 2. Patch de Clique na Barra do Player (FullScreenPlayer Toggle)
    replacements = [
        ('{className:es.lineItem,onClick:L,children:p.jsxs(It,{align:\\"center\\"', '{className:es.lineItem,onClick:void 0,children:p.jsxs(It,{align:\\"center\\"'),
        ('secondary,js.songArtist),onClick:L,children:p.jsx(ug,{artistName:(l==n', 'secondary,js.songArtist),onClick:void 0,children:p.jsx(ug,{artistName:(l==n'),
        ('.secondary,js.songAlbum),onClick:L,children:p.jsx(Ve,{component:Or,fw:', '.secondary,js.songAlbum),onClick:void 0,children:p.jsx(Ve,{component:Or,fw:'),
        ('const l=e?o:void 0;let c;', 'const l=o;let c;'),
        ('a=it({[Pue.container]:!0,[Pue.openDrawer]:e})', 'a=it({[Pue.container]:!0,[Pue.openDrawer]:!0})'),
        ('playButtonBehavior:Gt.NOW,playerbarOpenDrawer:!1,playerbarSlider:', 'playButtonBehavior:Gt.NOW,playerbarOpenDrawer:!0,playerbarSlider:')
    ]

    for old, new in replacements:
        if old in js:
            js = js.replace(old, new, 1)
            modified = True
            print(f"[✓] Patch Playerbar aplicado: {old[:35]}...")
        elif new in js:
            print(f"[-] Patch Playerbar já presente: {new[:35]}...")
        else:
            print(f"[!] Aviso: Padrão não encontrado: {old[:35]}...")

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(js)
        print(f"[✓] Bundle {file_path} atualizado com sucesso!")
    else:
        print("[-] Nenhuma modificação necessária no bundle.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python3 patch_bundle.py <caminho_para_index-C3w9ueFE.js>")
        sys.exit(1)
    patch_bundle(sys.argv[1])
