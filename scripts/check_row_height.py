import asyncio
import pprint
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    js = """
    (() => {
        const scroller = document.querySelector('.fs-item-table-list-module-height-100');
        if (!scroller) return 'No scroller';
        const rows = Array.from(scroller.querySelectorAll('tbody tr, [role="row"]'));
        const rowHeights = rows.map(r => r.getBoundingClientRect().height);
        return {
            totalHeight: scroller.scrollHeight,
            clientHeight: scroller.clientHeight,
            rowsRendered: rows.length,
            sampleHeights: rowHeights.slice(0, 10),
            firstRowTop: rows[0]?.offsetTop,
            secondRowTop: rows[1]?.offsetTop
        };
    })()
    """
    res = await cdp.evaluate(js)
    pprint.pprint(res)
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
