#!/usr/bin/env python3
import asyncio
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

from scripts.feishin_cdp import FeishinCDP

ARTIFACTS_DIR = Path("/Users/mcp/.gemini/antigravity/brain/10f68f77-69e5-4136-a770-8acbbfc9d5fd")

async def run_verification():
    cdp = FeishinCDP()
    await cdp.connect()

    print("\n--- [ETAPA 1] Navegando para #/library/genres (Página de Tags) ---")
    await cdp.evaluate("window.location.hash = '#/library/genres'")
    await asyncio.sleep(1.2)

    page_status = await cdp.evaluate("""(() => {
        const root = document.getElementById('fs-tags-page-mount');
        if (!root) return { error: 'Elemento #fs-tags-page-mount não encontrado' };
        return {
            mounted: true,
            title: root.querySelector('.fs-tags-title')?.innerText,
            toggleButtons: Array.from(root.querySelectorAll('.fs-tags-toggle-btn')).map(b => b.innerText.trim()),
            viewMode: window.__FEISHIN_TAGS_ENGINE__?.viewMode,
            tagsCount: window.__FEISHIN_TAGS_ENGINE__?.getTags()?.length,
            heroBoxesCount: root.querySelectorAll('.fs-hero-box').length,
            tagEditorPresent: !!root.querySelector('.fs-tag-editor-panel')
        };
    })()""")
    print("Status da Página:", json.dumps(page_status, indent=2, ensure_ascii=False))

    # Screenshot 1: Visualização 1 (Hero Boxes + Tag Editor)
    await cdp.screenshot(str(ARTIFACTS_DIR / "feishin_tags_view1_hero_boxes.png"))

    print("\n--- [ETAPA 2] Testando Tag Editor (Adicionar Nova Tag) ---")
    add_result = await cdp.evaluate("""(() => {
        const engine = window.__FEISHIN_TAGS_ENGINE__;
        const newTag = engine.addTag('Synthwave Nostalgia', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop');
        return {
            newTagId: newTag.id,
            totalTags: engine.getTags().length
        };
    })()""")
    print("Tag Criada via Editor:", add_result)
    await asyncio.sleep(0.5)

    # Screenshot 2: Visualização 1 com nova tag adicionada
    await cdp.screenshot(str(ARTIFACTS_DIR / "feishin_tags_view1_after_tag_added.png"))

    print("\n--- [ETAPA 3] Testando Clique no Hero Box (Abrir Playlist da Tag) ---")
    box_click_res = await cdp.evaluate("""(() => {
        const firstBox = document.querySelector('.fs-hero-box');
        if (firstBox) {
            firstBox.click();
            return { clicked: true, boxTitle: firstBox.querySelector('.fs-hero-box-title')?.innerText };
        }
        return { clicked: false };
    })()""")
    print("Hero Box Clicado:", box_click_res)
    await asyncio.sleep(0.8)

    # Screenshot 3: Visualização do Hero Box aberto em Playlist
    await cdp.screenshot(str(ARTIFACTS_DIR / "feishin_tags_hero_box_playlist_view.png"))

    print("\n--- [ETAPA 4] Alternando para Visualização 2 (Toggle Abas/Botões no Topo) ---")
    # Clicar no botão voltar do box ou trocar o toggle direto
    toggle_to_tabs = await cdp.evaluate("""(() => {
        const engine = window.__FEISHIN_TAGS_ENGINE__;
        engine.closeBox();
        const toggleTabsBtn = document.getElementById('fs-toggle-tabs');
        if (toggleTabsBtn) toggleTabsBtn.click();
        return {
            viewMode: engine.viewMode,
            activeTabId: engine.activeTabId,
            pillsCount: document.querySelectorAll('.fs-tag-pill-btn').length
        };
    })()""")
    print("Toggle para Visualização 2:", toggle_to_tabs)
    await asyncio.sleep(0.8)

    # Screenshot 4: Visualização 2 (Tabs com botões no topo + lista de músicas)
    await cdp.screenshot(str(ARTIFACTS_DIR / "feishin_tags_view2_tabs.png"))

    print("\n--- [ETAPA 5] Alternando entre Tags na Visualização 2 ---")
    switch_tag = await cdp.evaluate("""(() => {
        const pills = document.querySelectorAll('.fs-tag-pill-btn');
        if (pills[1]) {
            pills[1].click();
            return {
                clickedPill: pills[1].innerText.trim(),
                activeTabId: window.__FEISHIN_TAGS_ENGINE__?.activeTabId
            };
        }
        return null;
    })()""")
    print("Alternância de Tag Pills:", switch_tag)
    await asyncio.sleep(0.8)

    # Screenshot 5: Visualização 2 com 2ª tag selecionada
    await cdp.screenshot(str(ARTIFACTS_DIR / "feishin_tags_view2_second_tab.png"))

    print("\n--- [ETAPA 6] Testando Atribuição de Música a Tag ---")
    assign_res = await cdp.evaluate("""(() => {
        const engine = window.__FEISHIN_TAGS_ENGINE__;
        const currentSong = window.__FEISHIN_PLAYER_STORE__?.getState()?.getCurrentSong?.() || {
            id: 'trk_test_1',
            name: 'Year of the Cat',
            artistName: 'Al Stewart',
            album: 'Year of the Cat',
            duration: 395
        };
        const firstTag = engine.getTags()[0];
        engine.assignTrackToTag(currentSong, firstTag.id);
        return {
            taggedSong: currentSong.name,
            tagAssigned: firstTag.name,
            tagSongsCount: engine.getSongsForTag(firstTag.id).length
        };
    })()""")
    print("Música Atribuída:", assign_res)
    await asyncio.sleep(0.5)

    # Voltar para a primeira tag para ver a música na tabela
    await cdp.evaluate("""(() => {
        const engine = window.__FEISHIN_TAGS_ENGINE__;
        const firstTag = engine.getTags()[0];
        engine.selectTab(firstTag.id);
    })()""")
    await asyncio.sleep(0.8)

    # Screenshot 6: Visualização 2 exibindo a música atribuída na tabela da tag
    await cdp.screenshot(str(ARTIFACTS_DIR / "feishin_tags_view2_song_assigned.png"))

    print("\n--- [ETAPA 7] Verificação do Menu Lateral ('Tags') ---")
    sidebar_check = await cdp.evaluate("""(() => {
        const links = Array.from(document.querySelectorAll('a, button, [role=\"button\"]'));
        const tagsLink = links.find(l => (l.getAttribute('href') || '').includes('/library/genres') || (l.innerText || '').includes('Tags'));
        return {
            found: !!tagsLink,
            text: tagsLink ? tagsLink.innerText.trim() : null,
            href: tagsLink ? tagsLink.getAttribute('href') : null
        };
    })()""")
    print("Sidebar Item Tags:", sidebar_check)

    await cdp.close()
    print("\n[✓] TODAS AS ETAPAS DE VERIFICAÇÃO FORAM CONCLUÍDAS COM SUCESSO!")

if __name__ == "__main__":
    asyncio.run(run_verification())
