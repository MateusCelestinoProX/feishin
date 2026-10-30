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
        # 2.1 Reprodutor: manter activeTab:"" por padrão (modo simples de música em música sem fila aberta)
        ('function XHt(t){return{collapsed:t.sidebar.collapsed,image:t.sidebar.image}}', 'function XHt(t){return{collapsed:t.sidebar.collapsed,image:!1}}'),
        ('activeTab:"queue",coverArtSize:75', 'activeTab:"",coverArtSize:75'),
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

    # 7. Patch de Remoção das Páginas de Álbuns e de Início (Interface e Código)
    replacements_page_removals = [
        # 7.1 Rota /library/albums redireciona para /library/songs (Faixas)
        ('f=p.jsx(Rn,{element:p.jsx(G7,{}),path:$t.LIBRARY_ALBUMS})',
         'f=p.jsx(Rn,{element:p.jsx(bKe,{to:$t.LIBRARY_SONGS,replace:!0}),path:$t.LIBRARY_ALBUMS})'),
        # 7.2 Rota /home redireciona para /library/songs (Faixas)
        ('o=p.jsx(Rn,{element:p.jsx(Yue,{}),path:$t.HOME})',
         'o=p.jsx(Rn,{element:p.jsx(bKe,{to:$t.LIBRARY_SONGS,replace:!0}),path:$t.HOME})'),
        # 7.3 Remover Álbuns e Início das configurações de itens da barra lateral (Hle)
        ('[sc.ALBUMS,"page.sidebar.albums"],',
         ''),
        ('[sc.HOME,"page.sidebar.home"],',
         ''),
        # 7.4 Desativar Álbuns e Início na lista padrão de sidebar items (Obe)
        ('{disabled:!1,id:"Albums",label:Ce.t("page.sidebar.albums"),route:$t.LIBRARY_ALBUMS},',
         '{disabled:!0,id:"Albums",label:"",route:""},'),
        ('{disabled:!1,id:"Home",label:Ce.t("page.sidebar.home"),route:$t.HOME},',
         '{disabled:!0,id:"Home",label:"",route:""},'),
        # 7.5 Remover Álbuns e Início da busca global/paleta de comando
        ('H=p.jsxs(uo.Group,{heading:"Library",children:[A,E,z,O,I,U]})',
         'H=p.jsxs(uo.Group,{heading:"Library",children:[E,z,O,I,U]})'),
        ('v=p.jsxs(uo.Group,{children:[d,h,b]})',
         'v=p.jsxs(uo.Group,{children:[h,b]})'),
        # 7.6 Hotkeys e atalhos de navegação para Home redirecionam para Faixas
        ('A=()=>e($t.HOME)',
         'A=()=>e($t.LIBRARY_SONGS)'),
        ('u=A=>{e($t.HOME),i(A),o(void 0)}',
         'u=A=>{e($t.LIBRARY_SONGS),i(A),o(void 0)}'),
        ('d=A=>{s($t.HOME),l(A),a(),r(""),n([hm.HOME])}',
         'd=A=>{s($t.LIBRARY_SONGS),l(A),a(),r(""),n([hm.HOME])}'),
        # 7.7 Filtrar Álbuns e Início na navegação mobile/recolhida (hJt)
        ('function hJt(t){return!t.disabled}',
         'function hJt(t){return!t.disabled&&t.id!=="Albums"&&t.id!=="Home"}')
    ]

    for old, new in replacements_page_removals:
        if old in js:
            js = js.replace(old, new, 1)
            modified = True
            print(f"[✓] Patch Remoção de Página aplicado: {old[:35]}...")
        elif new in js:
            print(f"[-] Patch Remoção de Página já presente: {new[:35]}...")
        else:
            print(f"[!] Aviso: Padrão não encontrado: {old[:35]}...")

    # 8. Patch no Menu de Contexto da Faixa (Botão "Tocar a seguir" no menu principal)
    replacements_context_menu = [
        (':Z=e[66],Z}',
         ':Z=e[66],(n===he.SONG||n===he.PLAYLIST_SONG||n===he.QUEUE_SONG)?p.jsxs(p.Fragment,{children:[Z,p.jsx(mt.Item,{key:"play-next-main",leftIcon:"mediaPlayNext",onSelect:f,children:O})]}):Z}')
    ]

    for old, new in replacements_context_menu:
        if old in js:
            js = js.replace(old, new, 1)
            modified = True
            print(f"[✓] Patch Menu de Contexto aplicado: {old[:35]}...")
        elif new in js:
            print(f"[-] Patch Menu de Contexto já presente: {new[:35]}...")
        else:
            print(f"[!] Aviso: Padrão Menu de Contexto não encontrado: {old[:35]}...")

    # 9. Patch de Fila Unitária Inteligente: Fila só com playlist ou adicionar a seguir
    replacements_queue_playback = [
        # 9.1 Ao reproduzir na tabela (f9t):
        # Se playlist -> carrega faixas da playlist
        # Se adicionar a seguir (NEXT/LAST) -> carrega [a] e ativa flag
        # Salvo esses 2 casos -> modo simples unitário [a], salva coleção em __FEISHIN_ACTIVE_COLLECTION__
        ('f9t=({index:t,internalState:e,item:a,meta:n,player:r})=>{const i=(n==null?void 0:n.playType)||Gt.NOW,s=e==null?void 0:e.getData();if(s&&s.length>1&&t!==void 0){r.addToQueueByData(s,i,a.id);return}if((n==null?void 0:n.singleSongOnly)===!0){r.addToQueueByData([a],i,a.id);return}t!==void 0&&s&&r.addToQueueByData(s,i,a.id)}',
         'f9t=({index:t,internalState:e,item:a,meta:n,player:r})=>{const i=(n==null?void 0:n.playType)||Gt.NOW,s=e==null?void 0:e.getData(),isP=a?._itemType==="playlist_song"||(n==null?void 0:n.isPlaylist)===!0||(window.location.hash||"").startsWith("#/playlist"),isNextOrLast=i===Gt.NEXT||i===Gt.LAST||i===Gt.NEXT_SHUFFLE||i===Gt.LAST_SHUFFLE;if(isNextOrLast){window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!0;r.addToQueueByData([a],i,a.id);return;}if(isP&&s&&s.length>0&&t!==void 0){window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!1;r.addToQueueByData(s,i,a.id);return;}window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!1;if(s&&t!==void 0){window.__FEISHIN_ACTIVE_COLLECTION__={items:s,currentIndex:t,isShuffle:!1};}r.addToQueueByData([a],i,a.id);}'),

        ('f9t=({index:t,internalState:e,item:a,meta:n,player:r})=>{const i=(n==null?void 0:n.playType)||Gt.NOW;if((n==null?void 0:n.singleSongOnly)===!0){r.addToQueueByData([a],i,a.id);return}const s=e==null?void 0:e.getData();t!==void 0&&s&&r.addToQueueByData(s,i,a.id)}',
         'f9t=({index:t,internalState:e,item:a,meta:n,player:r})=>{const i=(n==null?void 0:n.playType)||Gt.NOW,s=e==null?void 0:e.getData(),isP=a?._itemType==="playlist_song"||(n==null?void 0:n.isPlaylist)===!0||(window.location.hash||"").startsWith("#/playlist"),isNextOrLast=i===Gt.NEXT||i===Gt.LAST||i===Gt.NEXT_SHUFFLE||i===Gt.LAST_SHUFFLE;if(isNextOrLast){window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!0;r.addToQueueByData([a],i,a.id);return;}if(isP&&s&&s.length>0&&t!==void 0){window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!1;r.addToQueueByData(s,i,a.id);return;}window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!1;if(s&&t!==void 0){window.__FEISHIN_ACTIVE_COLLECTION__={items:s,currentIndex:t,isShuffle:!1};}r.addToQueueByData([a],i,a.id);}'),

        # 9.2 Ao reproduzir faixa individual pelo item-list-controls (findIndex...):
        ('.findIndex(L=>L.id===A);const R=(v==null?void 0:v.playType)||Gt.NOW,E=!1;let T;if(R===Gt.NEXT||R===Gt.LAST||R===Gt.NEXT_SHUFFLE||R===Gt.LAST_SHUFFLE)T=[g];',
         '.findIndex(L=>L.id===A);const R=(v==null?void 0:v.playType)||Gt.NOW,isP=b===he.PLAYLIST_SONG||(window.location.hash||"").startsWith("#/playlist"),isNextOrLast=R===Gt.NEXT||R===Gt.LAST||R===Gt.NEXT_SHUFFLE||R===Gt.LAST_SHUFFLE;let T;if(isNextOrLast){window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!0;T=[g];}else if(isP&&_.length>0&&C!==-1){window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!1;T=_;o.current.addToQueueByData(T,R,g.id);return;}else{window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!1;T=[g];if(_.length>0&&C!==-1){window.__FEISHIN_ACTIVE_COLLECTION__={items:_,currentIndex:C,isShuffle:!1};}}if(!T||T.length===0)T=[g];o.current.addToQueueByData(T,R,g.id);return}if(b===he.QUEUE_SONG){const S=g;S._uniqueId'),

        ('.findIndex(L=>L.id===A);const R=(v==null?void 0:v.playType)||Gt.NOW,E=(v==null?void 0:v.singleSongOnly)===!0;let T;if(E||R===Gt.NEXT||R===Gt.LAST||R===Gt.NEXT_SHUFFLE||R===Gt.LAST_SHUFFLE||_.length===0||C===-1)T=[g];else{const M=Math.max(0,C-50),F=Math.min(_.length,C+50+1);T=_.slice(M,F)}if(!T||T.length===0)T=[g];o.current.addToQueueByData(T,R,g.id);return}',
         '.findIndex(L=>L.id===A);const R=(v==null?void 0:v.playType)||Gt.NOW,isP=b===he.PLAYLIST_SONG||(window.location.hash||"").startsWith("#/playlist"),isNextOrLast=R===Gt.NEXT||R===Gt.LAST||R===Gt.NEXT_SHUFFLE||R===Gt.LAST_SHUFFLE;let T;if(isNextOrLast){window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!0;T=[g];}else if(isP&&_.length>0&&C!==-1){window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!1;T=_;o.current.addToQueueByData(T,R,g.id);return;}else{window.__FEISHIN_HAS_ENQUEUED_ITEMS__=!1;T=[g];if(_.length>0&&C!==-1){window.__FEISHIN_ACTIVE_COLLECTION__={items:_,currentIndex:C,isShuffle:!1};}}if(!T||T.length===0)T=[g];o.current.addToQueueByData(T,R,g.id);return}')
    ]

    for old, new in replacements_queue_playback:
        if old in js:
            js = js.replace(old, new)
            modified = True
            print(f"[✓] Patch Fila Completa de Reprodução aplicado: {old[:35]}...")
        elif new in js:
            print(f"[-] Patch Fila Completa de Reprodução já presente: {new[:35]}...")
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
                sb_js = sb_js.replace('function Je(e){return e.id!=="Collections"&&e.route}', 'function Je(e){return e.id!=="Collections"&&e.id!=="Albums"&&e.id!=="Home"&&e.route}', 1)
                sb_mod = True
                print(f"[✓] Patch Sidebar Remoção de Álbuns e Início aplicado em {sidebar_bundle.name}")
            if 'function Xe(e){return!e.disabled}' in sb_js:
                sb_js = sb_js.replace('function Xe(e){return!e.disabled}', 'function Xe(e){return!e.disabled&&e.id!=="Albums"&&e.id!=="Home"}', 1)
                sb_mod = True
                print(f"[✓] Patch Sidebar Xe Remoção de Álbuns e Início aplicado em {sidebar_bundle.name}")
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
                cb_js = cb_js.replace('function Pe(e){return!e.disabled}', 'function Pe(e){return!e.disabled&&e.id!=="Albums"&&e.id!=="Home"}', 1)
                with open(col_bundle, "w", encoding="utf-8") as f:
                    f.write(cb_js)
                print(f"[✓] Patch Collapsed Sidebar Remoção de Álbuns e Início aplicado em {col_bundle.name}")
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
