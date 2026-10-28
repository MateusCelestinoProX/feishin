import asyncio
import pprint
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    js = """
    (() => {
        // Check localStorage filters or sort settings
        const filters = JSON.parse(localStorage.getItem('FsiBb_mTdwLVTb1o_94bm-filters') || '{}');
        const settings = JSON.parse(localStorage.getItem('store_settings') || '{}');
        const sortButton = document.querySelector('.fs-sort-button, [aria-label*="sort"], button:has(.tabler-icon-arrows-sort)');
        return {
            filters: filters,
            sortSongSetting: settings?.state?.list?.song?.sort,
            activeSortText: document.querySelector('.fs-page-header-module-header')?.innerText
        };
    })()
    """
    res = await cdp.evaluate(js)
    pprint.pprint(res)
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
