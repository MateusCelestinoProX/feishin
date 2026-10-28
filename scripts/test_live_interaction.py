import asyncio
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    
    # 1. Test hovering on Letter M
    print("[*] Testing Hover on Letter M...")
    hud_state = await cdp.evaluate("""
    (() => {
        const itemM = document.querySelector('.fs-az-item[data-letter="M"]');
        if (!itemM) return { error: 'Item M not found' };
        
        // Trigger pointerover
        itemM.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
        
        const hud = document.querySelector('#feishin-alphabet-hud');
        return {
            hudVisible: hud.classList.contains('visible'),
            badge: hud.querySelector('.fs-az-hud-badge')?.textContent,
            title: hud.querySelector('.fs-az-hud-title')?.textContent,
            count: hud.querySelector('.fs-az-hud-count')?.textContent,
            song: hud.querySelector('.fs-az-hud-song')?.textContent,
            artist: hud.querySelector('.fs-az-hud-artist')?.textContent,
            hudTop: hud.style.top
        };
    })()
    """)
    print("HUD on M:", hud_state)
    await asyncio.sleep(0.3)
    await cdp.screenshot('hud_preview_m.png')
    
    # 2. Test clicking on Letter M
    print("[*] Testing Click on Letter M...")
    click_res = await cdp.evaluate("""
    (() => {
        const itemM = document.querySelector('.fs-az-item[data-letter="M"]');
        itemM.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientY: itemM.getBoundingClientRect().top + 5 }));
        const scroller = document.querySelector('.fs-item-table-list-module-height-100');
        return {
            newScrollTop: scroller.scrollTop,
            activeItem: document.querySelector('.fs-az-item.active')?.dataset.letter
        };
    })()
    """)
    print("After click M:", click_res)
    await asyncio.sleep(0.8)
    
    inspect_rows = """
    (() => {
        const rows = Array.from(document.querySelectorAll('.fs-item-table-list-module-height-100 tbody tr, .fs-item-table-list-module-height-100 [role="row"]'));
        return rows.slice(0, 3).map(r => r.innerText.split('\\n').join(' | '));
    })()
    """
    rows_m = await cdp.evaluate(inspect_rows)
    print("Rows at M:", rows_m)
    await cdp.screenshot('table_at_m.png')
    
    # 3. Test hovering on 🌐 (Foreign/Symbol)
    print("[*] Testing Hover on 🌐...")
    hud_foreign = await cdp.evaluate("""
    (() => {
        const itemGlob = document.querySelector('.fs-az-item[data-letter="🌐"]');
        itemGlob.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
        const hud = document.querySelector('#feishin-alphabet-hud');
        return {
            hudVisible: hud.classList.contains('visible'),
            badge: hud.querySelector('.fs-az-hud-badge')?.textContent,
            title: hud.querySelector('.fs-az-hud-title')?.textContent,
            count: hud.querySelector('.fs-az-hud-count')?.textContent,
            song: hud.querySelector('.fs-az-hud-song')?.textContent,
            artist: hud.querySelector('.fs-az-hud-artist')?.textContent
        };
    })()
    """)
    print("HUD on 🌐:", hud_foreign)
    await asyncio.sleep(0.3)
    await cdp.screenshot('hud_preview_foreign.png')

    # 4. Test clicking on 🌐
    print("[*] Testing Click on 🌐...")
    await cdp.evaluate("""
    (() => {
        const itemGlob = document.querySelector('.fs-az-item[data-letter="🌐"]');
        itemGlob.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientY: itemGlob.getBoundingClientRect().top + 5 }));
    })()
    """)
    await asyncio.sleep(0.8)
    rows_foreign = await cdp.evaluate(inspect_rows)
    print("Rows at 🌐:", rows_foreign)
    await cdp.screenshot('table_at_foreign.png')
    
    # 5. Test hovering on # (Numbers/Symbols)
    print("[*] Testing Hover on #...")
    hud_hash = await cdp.evaluate("""
    (() => {
        const itemHash = document.querySelector('.fs-az-item[data-letter="#"]');
        itemHash.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
        const hud = document.querySelector('#feishin-alphabet-hud');
        return {
            hudVisible: hud.classList.contains('visible'),
            badge: hud.querySelector('.fs-az-hud-badge')?.textContent,
            title: hud.querySelector('.fs-az-hud-title')?.textContent,
            count: hud.querySelector('.fs-az-hud-count')?.textContent,
            song: hud.querySelector('.fs-az-hud-song')?.textContent,
            artist: hud.querySelector('.fs-az-hud-artist')?.textContent
        };
    })()
    """)
    print("HUD on #:", hud_hash)
    await asyncio.sleep(0.3)
    await cdp.screenshot('hud_preview_hash.png')
    
    # 6. Click back to # (top)
    await cdp.evaluate("""
    (() => {
        const itemHash = document.querySelector('.fs-az-item[data-letter="#"]');
        itemHash.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientY: itemHash.getBoundingClientRect().top + 5 }));
    })()
    """)
    await asyncio.sleep(0.8)
    rows_top = await cdp.evaluate(inspect_rows)
    print("Rows at top #:", rows_top)
    await cdp.screenshot('table_at_top.png')

    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
