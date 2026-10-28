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
        return fetch(`${srv.url}/api/song?_start=1128&_end=1725&_sort=title&_order=ASC`, {
            headers: {
                'x-nd-authorization': `Bearer ${srv.ndCredential}`,
                'x-nd-client-unique-id': auth?.state?.deviceId || 'feishin'
            }
        }).then(r => r.json()).then(data => data.map((s, i) => ({ idx: 1128 + i, title: s.title, artist: s.artist })));
    })()
    """
    items = await cdp.evaluate(js)
    print("Sample items from 1128 to 1160:")
    for it in items[:35]:
        print(f"[{it['idx']}] Title: {it['title']!r} | Artist: {it['artist']!r}")

    print("\nSample items from 1690 to 1721:")
    for it in items[-30:]:
        print(f"[{it['idx']}] Title: {it['title']!r} | Artist: {it['artist']!r}")

    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
