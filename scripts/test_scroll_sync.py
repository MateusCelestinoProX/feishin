import asyncio
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    
    test_scroll_sync = """
    (() => {
        const scroller = document.querySelector('.fs-item-table-list-module-height-100');
        const engine = window.__FEISHIN_ALPHABET_SCRUBBER__;
        
        // Scroll to ~row 502 (Letter L: 502 * 66 = 33132)
        scroller.scrollTop = 502 * 66;
        
        // Trigger scroll event
        scroller.dispatchEvent(new Event('scroll'));
        
        const activeItem = document.querySelector('.fs-az-item.active');
        return {
            scrollTop: scroller.scrollTop,
            expectedLetter: 'L',
            highlightedLetter: activeItem?.dataset.letter
        };
    })()
    """
    res = await cdp.evaluate(test_scroll_sync)
    print("Scroll sync test:", res)
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
