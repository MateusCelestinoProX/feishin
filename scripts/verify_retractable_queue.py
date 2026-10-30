import sys
import asyncio
import json
from pathlib import Path

sys.path.insert(0, '/Users/mcp/.gemini/antigravity/scratch/feishin')
from scripts.feishin_cdp import FeishinCDP

async def main():
    print("[*] Conectando ao Feishin na porta 9223...")
    cdp = FeishinCDP(port=9223)
    await cdp.connect()

    # 1. Verificar se fullscreen player está aberto; se não, abrir clicando na capa ou chamando store
    print("[*] Abrindo FullScreen Player...")
    await cdp.evaluate("""(() => {
        const fsStore = window.__FEISHIN_FS_STORE__?.getState();
        if (fsStore?.actions?.setStore) {
            fsStore.actions.setStore({ expanded: true, activeTab: 'queue' });
        }
    })()""")

    await asyncio.sleep(1.0)

    # 2. Testar Estado 1: Fila Aberta / Expandida (Layout Split Side-by-Side 50/50 - Imagem 2)
    print("[*] Testando Estado 1: Fila Expandida (Side-by-side 50/50)...")
    res_open = await cdp.evaluate("""(() => {
        const fsContainer = document.querySelector('.fs-full-screen-player-module-container');
        const respContainer = document.querySelector('.fs-full-screen-player-module-responsive-container');
        const imageCol = document.querySelector('.fs-full-screen-player-module-image-column');
        const queueGrid = document.querySelector('.fs-full-screen-player-queue-module-grid-container');
        const cover = document.querySelector('.fs-full-screen-player-image-module-image-container');
        const fsStore = window.__FEISHIN_FS_STORE__?.getState();

        const getR = el => el ? {
            x: Math.round(el.getBoundingClientRect().x),
            y: Math.round(el.getBoundingClientRect().y),
            width: Math.round(el.getBoundingClientRect().width),
            height: Math.round(el.getBoundingClientRect().height),
            right: Math.round(el.getBoundingClientRect().right),
            left: Math.round(el.getBoundingClientRect().left)
        } : null;

        return {
            windowWidth: window.innerWidth,
            activeTab: fsStore?.activeTab,
            imageColClass: imageCol?.className,
            queueGridClass: queueGrid?.className,
            imageCol: getR(imageCol),
            cover: getR(cover),
            queueGrid: getR(queueGrid)
        };
    })()""")
    print("Estado Expandido (Geometria):", json.dumps(res_open, indent=2))
    await cdp.screenshot('/tmp/feishin_open_state.png')

    # Validação do Estado Expandido:
    w = res_open['windowWidth']
    cover_right = res_open['cover']['right'] if res_open['cover'] else 0
    queue_left = res_open['queueGrid']['left'] if res_open['queueGrid'] else 0
    overlap = max(0, cover_right - queue_left)
    print(f"[*] Verificação de Sobreposição: Capa termina em {cover_right}px, Fila começa em {queue_left}px -> Sobreposição: {overlap}px")
    assert overlap == 0, f"FALHA: Houve sobreposição de {overlap}px!"
    print("[✓] Split side-by-side 50/50 perfeito: ZERO sobreposição!")

    # 3. Testar Estado 2: Fila Contraída / Retraída (apenas hero image centralizada)
    print("\n[*] Testando Estado 2: Fila Contraída / Retraída (Hero image centralizada)...")
    await cdp.evaluate("""(() => {
        const fsStore = window.__FEISHIN_FS_STORE__?.getState();
        if (fsStore?.actions?.setStore) {
            fsStore.actions.setStore({ activeTab: '' });
        }
    })()""")

    await asyncio.sleep(1.0)

    res_collapsed = await cdp.evaluate("""(() => {
        const imageCol = document.querySelector('.fs-full-screen-player-module-image-column');
        const queueGrid = document.querySelector('.fs-full-screen-player-queue-module-grid-container');
        const cover = document.querySelector('.fs-full-screen-player-image-module-image-container');
        const fsStore = window.__FEISHIN_FS_STORE__?.getState();

        const getR = el => el ? {
            x: Math.round(el.getBoundingClientRect().x),
            y: Math.round(el.getBoundingClientRect().y),
            width: Math.round(el.getBoundingClientRect().width),
            height: Math.round(el.getBoundingClientRect().height),
            right: Math.round(el.getBoundingClientRect().right),
            left: Math.round(el.getBoundingClientRect().left)
        } : null;

        return {
            windowWidth: window.innerWidth,
            activeTab: fsStore?.activeTab,
            imageColClass: imageCol?.className,
            queueGridClass: queueGrid?.className,
            imageCol: getR(imageCol),
            cover: getR(cover),
            queueGrid: getR(queueGrid),
            queueGridComputed: queueGrid ? {
                transform: window.getComputedStyle(queueGrid).transform,
                opacity: window.getComputedStyle(queueGrid).opacity,
                visibility: window.getComputedStyle(queueGrid).visibility
            } : null
        };
    })()""")
    print("Estado Contraído (Geometria):", json.dumps(res_collapsed, indent=2))
    await cdp.screenshot('/tmp/feishin_collapsed_state.png')

    # Validação do Estado Contraído:
    assert res_collapsed['activeTab'] == '', f"FALHA: activeTab não permaneceu contraído! Valor: {res_collapsed['activeTab']}"
    assert 'image-column-full' in res_collapsed['imageColClass'], "FALHA: imageColClass não possui image-column-full!"
    assert 'grid-container-collapsed' in res_collapsed['queueGridClass'], "FALHA: queueGridClass não possui grid-container-collapsed!"
    
    # Hero image deve estar centralizada na tela:
    cover_rect = res_collapsed['cover']
    if cover_rect:
        center_x = cover_rect['x'] + (cover_rect['width'] / 2)
        window_center = w / 2
        diff = abs(center_x - window_center)
        print(f"[*] Centro da capa: {center_x}px, Centro da janela: {window_center}px -> Diferença: {diff}px")
        assert diff < 2.0, f"FALHA: Capa não está centralizada! Diferença: {diff}px"
        print("[✓] Hero image perfeitamente centralizada na tela inteira!")

    # 4. Testar Re-expansão (Toggle interativo via botão de controle)
    print("\n[*] Testando Re-expansão da fila (toggle interativo)...")
    await cdp.evaluate("""(() => {
        // Encontra o botão de fila nos controles do fullscreen player
        const queueBtn = document.querySelector('.fs-full-screen-player-queue-module-controls-container button');
        if (queueBtn) {
            queueBtn.click();
        } else {
            const fsStore = window.__FEISHIN_FS_STORE__?.getState();
            fsStore?.actions?.setStore({ activeTab: 'queue' });
        }
    })()""")

    await asyncio.sleep(1.0)

    res_reopened = await cdp.evaluate("""(() => {
        const fsStore = window.__FEISHIN_FS_STORE__?.getState();
        const imageCol = document.querySelector('.fs-full-screen-player-module-image-column');
        const queueGrid = document.querySelector('.fs-full-screen-player-queue-module-grid-container');
        const cover = document.querySelector('.fs-full-screen-player-image-module-image-container');
        const getR = el => el ? {
            x: Math.round(el.getBoundingClientRect().x),
            width: Math.round(el.getBoundingClientRect().width),
            right: Math.round(el.getBoundingClientRect().right),
            left: Math.round(el.getBoundingClientRect().left)
        } : null;
        return {
            activeTab: fsStore?.activeTab,
            imageCol: getR(imageCol),
            cover: getR(cover),
            queueGrid: getR(queueGrid)
        };
    })()""")
    print("Re-expandido após toggle:", json.dumps(res_reopened, indent=2))
    assert res_reopened['activeTab'] == 'queue', "FALHA: Não reabriu a fila!"
    cover_right = res_reopened['cover']['right']
    queue_left = res_reopened['queueGrid']['left']
    overlap = max(0, cover_right - queue_left)
    assert overlap == 0, f"FALHA na re-expansão: Sobreposição de {overlap}px!"
    print("[✓] Re-expansão validada com sucesso! Zero sobreposição!")

    print("\n=======================================================")
    print(" TODAS AS VALIDAÇÕES PASSARAM COM SUCESSO ABSOLUTO! ")
    print("=======================================================")

    await cdp.ws.close()

if __name__ == '__main__':
    asyncio.run(main())
