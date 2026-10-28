import asyncio
import pprint
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    js = """
    (() => {
        const qc = window.__FEISHIN_QC__;
        if (!qc) return 'No QC';
        const queries = qc.getQueryCache().getAll();
        const songLoader = queries.find(q => q.queryKey[1] === 'item-list-infinite-loader' && q.queryKey[2] === 'song');
        const songCount = queries.find(q => q.queryKey[1] === 'songs' && q.queryKey[2] === 'count');
        const songLists = queries.filter(q => q.queryKey[1] === 'songs' && q.queryKey[2] === 'list');
        return {
            loaderKey: songLoader?.queryKey,
            count: songCount?.state?.data,
            samplePage0: songLists[0]?.queryKey,
            samplePage0Count: songLists[0]?.state?.data?.items?.length,
            samplePage0First3: songLists[0]?.state?.data?.items?.slice(0, 3).map(s => s.name)
        };
    })()
    """
    res = await cdp.evaluate(js)
    pprint.pprint(res)
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
