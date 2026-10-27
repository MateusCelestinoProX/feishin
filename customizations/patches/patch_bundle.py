#!/usr/bin/env python3
"""
Patch cirúrgico para o bundle JavaScript principal do Feishin (out/renderer/assets/index-C3w9ueFE.js)
e bundles adjacentes de listas/grids virtualizados.

Aplica:
1. Tradução Completa PT-BR via injeção dinâmica no i18next e fallback padrão para pt-BR.
2. Toggle da Tela da Música (FullScreenPlayer) ao clicar em espaço livre da barra do player inferior,
   preservando os botões interativos (Play/Pause, busca, volume, links).
3. Rolagem Virtualizada Ultra-Fluida e Consistente em Alta Velocidade:
   - Expansão do buffer de overscan (de 3 linhas para 50 linhas) em VirtualizedGrid (t_) e VirtualizedList (eea).
   - Garantia de buffer mínimo de 50 linhas na função central de limites S7.
   - Aceleração e prefetch de múltiplas páginas no carregador infinito (UXt), cobrindo de startIndex até stopIndex.
   - Redução da latência do throttle/debounce de busca de faixa de 150ms para 40ms.
   - Extensão do tempo de retenção em cache (gcTime e staleTime) de 15 segundos para 1 hora (1e3*60*60).
   - Otimização do overscan em listas grid (item-grid-list) e itemsPerPage para 200 no song-list-infinite-table.
"""

import sys
import os
import glob
from pathlib import Path

def patch_bundle(file_path):
    bundle_path = Path(file_path).resolve()
    if not bundle_path.exists():
        print(f"[!] Erro: Arquivo {bundle_path} não encontrado.")
        sys.exit(1)

    assets_dir = bundle_path.parent

    with open(bundle_path, "r", encoding="utf-8") as f:
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

    # 2. Patch de Clique na Barra do Player e Fixação da Imagem no Dock
    replacements_playerbar = [
        ('{className:es.lineItem,onClick:L,children:p.jsxs(It,{align:\\"center\\"', '{className:es.lineItem,onClick:void 0,children:p.jsxs(It,{align:\\"center\\"'),
        ('secondary,js.songArtist),onClick:L,children:p.jsx(ug,{artistName:(l==n', 'secondary,js.songArtist),onClick:void 0,children:p.jsx(ug,{artistName:(l==n'),
        ('.secondary,js.songAlbum),onClick:L,children:p.jsx(Ve,{component:Or,fw:', '.secondary,js.songAlbum),onClick:void 0,children:p.jsx(Ve,{component:Or,fw:'),
        ('const l=e?o:void 0;let c;', 'const l=o;let c;'),
        ('a=it({[Pue.container]:!0,[Pue.openDrawer]:e})', 'a=it({[Pue.container]:!0,[Pue.openDrawer]:!0})'),
        ('playButtonBehavior:Gt.NOW,playerbarOpenDrawer:!1,playerbarSlider:', 'playButtonBehavior:Gt.NOW,playerbarOpenDrawer:!0,playerbarSlider:'),
        ('function XHt(t){return{collapsed:t.sidebar.collapsed,image:t.sidebar.image}}', 'function XHt(t){return{collapsed:t.sidebar.collapsed,image:!1}}'),
        # 2.1 Reprodutor Tela Dividida em 2 (Capa + Fila Integrada) e remoção da fila lateral
        ('activeTab:"",coverArtSize:75', 'activeTab:"queue",coverArtSize:75'),
        ('r==="sideQueue"?n({rightExpanded:!a}):s(JWt)', 'n({rightExpanded:!1}),(document.querySelector(".fs-left-controls-module-image")||document.querySelector("#player-bar img"))?.click()')
    ]

    for old, new in replacements_playerbar:
        if old in js:
            js = js.replace(old, new, 1)
            modified = True
            print(f"[✓] Patch Playerbar aplicado: {old[:35]}...")
        elif new in js:
            print(f"[-] Patch Playerbar já presente: {new[:35]}...")
        else:
            print(f"[!] Aviso: Padrão não encontrado: {old[:35]}...")

    # 3. Patch de Exposição do Player Store & Auth Store para Analytics e Mini Painel do Tray
    replacements_tray_stores = [
        (',Pa=hYe(Ma)', ',Pa=(typeof window!=="undefined"&&(window.__FEISHIN_PLAYER_STORE__=Ma),hYe(Ma))'),
        ('to=()=>fr(NHe,la)', 'to=()=>(typeof window!=="undefined"&&(window.__FEISHIN_AUTH_STORE__=fr),fr(NHe,la))')
    ]

    for old, new in replacements_tray_stores:
        if old in js:
            js = js.replace(old, new, 1)
            modified = True
            print(f"[✓] Patch Tray Store aplicado: {old[:35]}...")
        elif new in js:
            print(f"[-] Patch Tray Store já presente: {new[:35]}...")
        else:
            print(f"[!] Aviso: Padrão Store não encontrado: {old[:35]}...")

    # 4. Patch de Rolagem Virtualizada Ultra-Fluida e Consistente (Overscan Buffer & S7)
    replacements_scroll = [
        # VirtualizedGrid default overscan: 3 -> 50 rows
        ('overscanCount:m=3,rowCount:f,rowHeight:h', 'overscanCount:m=50,rowCount:f,rowHeight:h'),
        # VirtualizedList default overscan: 3 -> 50 rows
        ('overscanCount:o=3,rowComponent:s,rowCount:l', 'overscanCount:o=50,rowComponent:s,rowCount:l'),
        # S7 bounds calculation: enforce minimum 50 items overscan buffer
        ('function S7({cachedBounds:t,containerScrollOffset:e,containerSize:a,itemCount:n,overscanCount:r}){const i=n-1;',
         'function S7({cachedBounds:t,containerScrollOffset:e,containerSize:a,itemCount:n,overscanCount:r}){r=Math.max(r||0,50);const i=n-1;'),
        # UXt cache duration: 15 seconds -> 1 hour
        ('gcTime:v?1e3*60*10:1e3*15,queryFn:async({signal:H})=>await i({apiClientProps:{serverId:s,signal:H},query:$}),queryKey:vt[Kwt(n)].list(s,$),staleTime:v?1e3*60*10:1e3*15',
         'gcTime:1e3*60*60,queryFn:async({signal:H})=>await i({apiClientProps:{serverId:s,signal:H},query:$}),queryKey:vt[Kwt(n)].list(s,$),staleTime:1e3*60*60'),
        # UXt range change throttle: 150ms -> 40ms
        ('P_e(A,150,{leading:!0,trailing:!0})', 'P_e(A,40,{leading:!0,trailing:!0})'),
        # UXt multi-page prefetch spanning startIndex to stopIndex
        ('const A=w.useCallback(async B=>{u.current=B;const I=Math.floor(B.startIndex/a),$=l.getQueryData(b),q=I*a,U=(I+1)*a,H=B.startIndex-q,G=U-B.stopIndex,V=Math.floor(a*e),K=($==null?void 0:$.pagesLoaded[I])??!1;K||await S(I),K&&(H<=V&&I>0&&!($!=null&&$.pagesLoaded[I-1])&&await S(I-1),G<=V&&!($!=null&&$.pagesLoaded[I+1])&&await S(I+1))},[a,e,l,b,S])',
         'const A=w.useCallback(async B=>{u.current=B;const I=Math.floor(B.startIndex/a),I2=Math.floor(B.stopIndex/a),$=l.getQueryData(b);for(let p=I;p<=I2;p++){if(!($!=null&&$.pagesLoaded&&$.pagesLoaded[p]))await S(p)}if(I>0&&!($!=null&&$.pagesLoaded&&$.pagesLoaded[I-1]))S(I-1);if(!($!=null&&$.pagesLoaded&&$.pagesLoaded[I2+1]))S(I2+1)},[a,e,l,b,S])')
    ]

    for old, new in replacements_scroll:
        if old in js:
            js = js.replace(old, new, 1)
            modified = True
            print(f"[✓] Patch Rolagem Alta Velocidade aplicado: {old[:35]}...")
        elif new in js:
            print(f"[-] Patch Rolagem Alta Velocidade já presente: {new[:35]}...")
        else:
            print(f"[!] Aviso: Padrão não encontrado: {old[:35]}...")

    # 5. Patch de Rota Inicial Padrão (Faixas / Tracks como página inicial)
    replacements_default_route = [
        ('t.FAVORITES="/favorites",t.HOME="/",t.LIBRARY_ALBUM_ARTISTS="/lib',
         't.FAVORITES="/favorites",t.HOME="/home",t.LIBRARY_ALBUM_ARTISTS="/lib'),
        ('i=p.jsx(Rn,{element:p.jsx(Yue,{}),index:!0}),t[4]=i',
         'i=p.jsx(Rn,{element:p.jsx(bKe,{to:$t.LIBRARY_SONGS,replace:!0}),index:!0}),t[4]=i'),
        # Expor Função de Abertura do Modal de Configurações para o Renderer
        ('kY=()=>{Pd({innerProps:{},modal:"settings",overlayProps:{opacity:1}',
         'kY=window.__FEISHIN_OPEN_SETTINGS__=()=>{Pd({innerProps:{},modal:"settings",overlayProps:{opacity:1}')
    ]

    for old, new in replacements_default_route:
        if old in js:
            js = js.replace(old, new, 1)
            modified = True
            print(f"[✓] Patch Rota Inicial aplicado: {old[:35]}...")
        elif new in js:
            print(f"[-] Patch Rota Inicial já presente: {new[:35]}...")
        else:
            print(f"[!] Aviso: Padrão não encontrado: {old[:35]}...")

    # 7. Patch de Remoção da Página de Álbuns (Interface e Código)
    replacements_albums_removal = [
        # 7.1 Rota /library/albums redireciona para /library/songs (Faixas)
        ('f=p.jsx(Rn,{element:p.jsx(G7,{}),path:$t.LIBRARY_ALBUMS})',
         'f=p.jsx(Rn,{element:p.jsx(bKe,{to:$t.LIBRARY_SONGS,replace:!0}),path:$t.LIBRARY_ALBUMS})'),
        # 7.2 Remover Álbuns das configurações de itens da barra lateral (Hle)
        ('[sc.ALBUMS,"page.sidebar.albums"],',
         ''),
        # 7.3 Desativar Álbuns na lista padrão de sidebar items (Obe)
        ('{disabled:!1,id:"Albums",label:Ce.t("page.sidebar.albums"),route:$t.LIBRARY_ALBUMS},',
         '{disabled:!0,id:"Albums",label:"",route:""},'),
        # 7.4 Remover Álbuns da busca global/paleta de comando (uo.Group heading Library)
        ('H=p.jsxs(uo.Group,{heading:"Library",children:[A,E,z,O,I,U]})',
         'H=p.jsxs(uo.Group,{heading:"Library",children:[E,z,O,I,U]})'),
        # 7.5 Filtrar Álbuns na navegação mobile/recolhida (hJt)
        ('function hJt(t){return!t.disabled}',
         'function hJt(t){return!t.disabled&&t.id!=="Albums"}')
    ]

    for old, new in replacements_albums_removal:
        if old in js:
            js = js.replace(old, new, 1)
            modified = True
            print(f"[✓] Patch Remoção de Álbuns aplicado: {old[:35]}...")
        elif new in js:
            print(f"[-] Patch Remoção de Álbuns já presente: {new[:35]}...")
        else:
            print(f"[!] Aviso: Padrão não encontrado: {old[:35]}...")

    if modified:
        with open(bundle_path, "w", encoding="utf-8") as f:
            f.write(js)
        print(f"[✓] Bundle {bundle_path.name} atualizado com sucesso!")
    else:
        print("[-] Nenhuma modificação necessária no bundle principal.")

    # 4. Patch em bundles adjacentes (item-grid-list e song-list-infinite-table)
    for grid_bundle in assets_dir.glob("item-grid-list-*.js"):
        try:
            with open(grid_bundle, "r", encoding="utf-8") as f:
                g_js = f.read()
            g_mod = False
            if "overscanCount:2" in g_js:
                g_js = g_js.replace("overscanCount:2", "overscanCount:15")
                g_mod = True
            target_dt_old = 'X.jsx(dt,{height:y,initialScrollOffset:ee(),itemCount:h.rowCount||0,itemData:V,itemSize:h.itemHeight||0,onItemsRendered:Z,onScroll:Y,outerRef:r,ref:o,width:w,children:Rt})'
            target_dt_new = 'X.jsx(dt,{height:y,initialScrollOffset:ee(),itemCount:h.rowCount||0,itemData:V,itemSize:h.itemHeight||0,onItemsRendered:Z,onScroll:Y,outerRef:r,ref:o,width:w,overscanCount:15,children:Rt})'
            if target_dt_old in g_js:
                g_js = g_js.replace(target_dt_old, target_dt_new, 1)
                g_mod = True
            if g_mod:
                with open(grid_bundle, "w", encoding="utf-8") as f:
                    f.write(g_js)
                print(f"[✓] Patch Grid aplicado com sucesso em {grid_bundle.name}")
        except Exception as e:
            print(f"[!] Erro ao patchear {grid_bundle.name}: {e}")

    for sidebar_bundle in assets_dir.glob("sidebar-*.js"):
        try:
            with open(sidebar_bundle, "r", encoding="utf-8") as f:
                sb_js = f.read()
            sb_mod = False
            if "function Ve(e){return e.sidebar.image}" in sb_js:
                sb_js = sb_js.replace("function Ve(e){return e.sidebar.image}", "function Ve(e){return!1}", 1)
                sb_mod = True
                print(f"[✓] Patch Sidebar Cover Art desativado em {sidebar_bundle.name}")
            if 'function Je(e){return e.id!=="Collections"&&e.route}' in sb_js:
                sb_js = sb_js.replace('function Je(e){return e.id!=="Collections"&&e.route}', 'function Je(e){return e.id!=="Collections"&&e.id!=="Albums"&&e.route}', 1)
                sb_mod = True
                print(f"[✓] Patch Sidebar Remoção de Álbuns aplicado em {sidebar_bundle.name}")
            if sb_mod:
                with open(sidebar_bundle, "w", encoding="utf-8") as f:
                    f.write(sb_js)
        except Exception as e:
            print(f"[!] Erro ao patchear {sidebar_bundle.name}: {e}")

    for col_bundle in assets_dir.glob("collapsed-sidebar-*.js"):
        try:
            with open(col_bundle, "r", encoding="utf-8") as f:
                cb_js = f.read()
            if 'function Pe(e){return!e.disabled}' in cb_js:
                cb_js = cb_js.replace('function Pe(e){return!e.disabled}', 'function Pe(e){return!e.disabled&&e.id!=="Albums"}', 1)
                with open(col_bundle, "w", encoding="utf-8") as f:
                    f.write(cb_js)
                print(f"[✓] Patch Collapsed Sidebar Remoção de Álbuns aplicado em {col_bundle.name}")
        except Exception as e:
            print(f"[!] Erro ao patchear {col_bundle.name}: {e}")

    for table_bundle in assets_dir.glob("song-list-infinite-table-*.js"):
        try:
            with open(table_bundle, "r", encoding="utf-8") as f:
                t_js = f.read()
            if "s=$===void 0?100:$" in t_js:
                t_js = t_js.replace("s=$===void 0?100:$", "s=$===void 0?200:$", 1)
                with open(table_bundle, "w", encoding="utf-8") as f:
                    f.write(t_js)
                print(f"[✓] Patch itemsPerPage=200 aplicado em {table_bundle.name}")
        except Exception as e:
            print(f"[!] Erro ao patchear {table_bundle.name}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python3 patch_bundle.py <caminho_para_index-C3w9ueFE.js>")
        sys.exit(1)
    patch_bundle(sys.argv[1])
