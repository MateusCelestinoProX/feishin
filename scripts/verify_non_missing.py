import asyncio
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    js = """
    (() => {
        const auth = JSON.parse(localStorage.getItem('store_authentication') || '{}');
        const srv = Object.values(auth?.state?.serverList || {})[0];
        return fetch(`${srv.url}/api/song?_start=0&_end=2500&_sort=title&_order=ASC`, {
            headers: {
                'x-nd-authorization': `Bearer ${srv.ndCredential}`,
                'x-nd-client-unique-id': auth?.state?.deviceId || 'feishin'
            }
        }).then(r => r.json()).then(data => {
            const nonMissing = data.filter(s => !s.missing);
            return {
                total: data.length,
                missingCount: data.filter(s => s.missing).length,
                nonMissingCount: nonMissing.length
            };
        });
    })()
    """
    res = await cdp.evaluate(js)
    print("Verification:", res)
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
