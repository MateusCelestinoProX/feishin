import asyncio
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    
    # Explicitly navigate to songs
    print("[*] Navigating to #/library/songs...")
    await cdp.evaluate('window.location.hash = "#/library/songs";')
    await asyncio.sleep(1.2)
    
    # Scroll to row 844 (Letter S)
    print("[*] Scrolling to row 844 (Letter S)...")
    await cdp.evaluate('document.querySelector(".fs-item-table-list-module-height-100").scrollTop = 844 * 66;')
    
    # Wait 1.0 second for Navidrome to return the chunk
    await asyncio.sleep(1.0)
    
    inspect_rows = """
    (() => {
        const rows = Array.from(document.querySelectorAll('.fs-item-table-list-module-height-100 tbody tr, .fs-item-table-list-module-height-100 [role="row"]'));
        return rows.slice(0, 5).map(r => r.innerText.split('\\n').join(' | '));
    })()
    """
    rows = await cdp.evaluate(inspect_rows)
    print("[✓] Loaded rows at S (after 1s):")
    for r in rows:
        print("  ", r)
        
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
