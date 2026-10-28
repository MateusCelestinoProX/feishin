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
        if (!srv) return 'No server';
        return fetch(`${srv.url}/api/song?_start=0&_end=15&_sort=title&_order=ASC`, {
            headers: {
                'x-nd-authorization': `Bearer ${srv.ndCredential}`,
                'x-nd-client-unique-id': auth?.state?.deviceId || 'feishin'
            }
        }).then(async r => {
            const data = await r.json();
            const total = r.headers.get('x-total-count');
            return {
                status: r.status,
                total: total,
                count: data.length,
                firstItems: data.map(s => ({
                    id: s.id,
                    title: s.title,
                    artist: s.artist,
                    album: s.album
                }))
            };
        }).catch(err => ({ error: err.message }));
    })()
    """
    res = await cdp.evaluate(js)
    pprint.pprint(res)
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
