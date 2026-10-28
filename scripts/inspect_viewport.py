import asyncio
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    
    inspect_viewport_rows = """
    (() => {
        const scroller = document.querySelector('.fs-item-table-list-module-height-100');
        const sTop = scroller.scrollTop;
        const sHeight = scroller.clientHeight;
        const rows = Array.from(document.querySelectorAll('.fs-item-table-list-module-height-100 tbody tr, .fs-item-table-list-module-height-100 [role="row"]'));
        
        const inViewport = rows.filter(r => {
            const rect = r.getBoundingClientRect();
            const scrollerRect = scroller.getBoundingClientRect();
            return rect.top >= scrollerRect.top - 10 && rect.top <= scrollerRect.bottom;
        });
        
        return {
            scrollTop: sTop,
            inViewportCount: inViewport.length,
            firstInViewport: inViewport[0]?.innerText.split('\\n').join(' | '),
            secondInViewport: inViewport[1]?.innerText.split('\\n').join(' | '),
            lastInViewport: inViewport[inViewport.length - 1]?.innerText.split('\\n').join(' | ')
        };
    })()
    """
    res = await cdp.evaluate(inspect_viewport_rows)
    print("Viewport rows:", res)
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
