import asyncio
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    
    # Navigate to #/analytics
    print("[*] Navigating away to #/analytics...")
    await cdp.evaluate('window.location.hash = "#/analytics";')
    await asyncio.sleep(1)
    
    check_unmounted = await cdp.evaluate("""
    (() => {
        return {
            hash: window.location.hash,
            scrubberInDom: document.querySelector('#feishin-alphabet-scrubber') !== null,
            hudInDom: document.querySelector('#feishin-alphabet-hud') !== null
        };
    })()
    """)
    print("When away:", check_unmounted)
    
    # Navigate back to #/library/songs
    print("[*] Navigating back to #/library/songs...")
    await cdp.evaluate('window.location.hash = "#/library/songs";')
    await asyncio.sleep(1.5)
    
    check_remounted = await cdp.evaluate("""
    (() => {
        return {
            hash: window.location.hash,
            scrubberInDom: document.querySelector('#feishin-alphabet-scrubber') !== null,
            hudInDom: document.querySelector('#feishin-alphabet-hud') !== null,
            itemCount: document.querySelectorAll('.fs-az-item').length
        };
    })()
    """)
    print("When returned:", check_remounted)
    
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
