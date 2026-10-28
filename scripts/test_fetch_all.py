import asyncio
import pprint
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    js = """
    (() => {
        const auth = JSON.parse(localStorage.getItem('store_authentication') || '{}');
        const srv = Object.values(auth?.state?.serverList || {})[0];
        const t0 = performance.now();
        return fetch(`${srv.url}/api/song?_start=0&_end=2500&_sort=title&_order=ASC`, {
            headers: {
                'x-nd-authorization': `Bearer ${srv.ndCredential}`,
                'x-nd-client-unique-id': auth?.state?.deviceId || 'feishin'
            }
        }).then(async r => {
            const data = await r.json();
            const elapsed = performance.now() - t0;
            return {
                status: r.status,
                count: data.length,
                elapsedMs: Math.round(elapsed),
                first: data[0].title,
                middle: data[Math.floor(data.length/2)].title,
                last: data[data.length - 1].title
            };
        });
    })()
    """
    res = await cdp.evaluate(js)
    pprint.pprint(res)
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
