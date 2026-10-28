import asyncio
import pprint
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    js = """
    (() => {
        const qc = window.__FEISHIN_QC__;
        const countQuery = qc?.getQueryCache().getAll().find(q => q.queryKey[1] === 'songs' && q.queryKey[2] === 'count');
        const listQuery = qc?.getQueryCache().getAll().find(q => q.queryKey[1] === 'songs' && q.queryKey[2] === 'list');
        return {
            countQueryKey: countQuery?.queryKey,
            countQueryState: countQuery?.state?.data,
            listQueryKey: listQuery?.queryKey
        };
    })()
    """
    res = await cdp.evaluate(js)
    pprint.pprint(res)
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
