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
        const toObj = (r) => r ? ({ top: r.top, right: r.right, bottom: r.bottom, left: r.left, width: r.width, height: r.height }) : null;
        const parent = scroller.parentElement;
        const grandParent = parent.parentElement;
        const main = document.querySelector('.fs-main-content-module-main-content-body-scroll') || document.querySelector('main');
        return {
            windowSize: { w: window.innerWidth, h: window.innerHeight },
            scrollerRect: toObj(scroller.getBoundingClientRect()),
            parentClass: parent.className,
            parentRect: toObj(parent.getBoundingClientRect()),
            grandParentClass: grandParent?.className,
            grandParentRect: toObj(grandParent?.getBoundingClientRect()),
            mainRect: toObj(main?.getBoundingClientRect())
        };
    })()
    """
    res = await cdp.evaluate(js)
    pprint.pprint(res)
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
