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
        return fetch(`${srv.url}/api/song?_start=0&_end=2500&_sort=title&_order=ASC`, {
            headers: {
                'x-nd-authorization': `Bearer ${srv.ndCredential}`,
                'x-nd-client-unique-id': auth?.state?.deviceId || 'feishin'
            }
        }).then(async r => {
            const data = await r.json();
            return data.map((s, idx) => ({
                index: idx,
                id: s.id,
                title: s.title,
                artist: s.artist
            }));
        });
    })()
    """
    items = await cdp.evaluate(js)
    print(f"Total items: {len(items)}")

    # Analyze first characters of titles
    import unicodedata
    buckets = {}
    for item in items:
        title = (item['title'] or '').strip()
        if not title:
            ch = '?'
        else:
            ch = title[0]
        
        # Categorize
        cat = unicodedata.category(ch)
        if ch.isalpha() and ord(ch) < 128:
            group = ch.upper()
        elif ch.isdigit():
            group = '0-9'
        elif unicodedata.normalize('NFD', ch)[0].isalpha() and ord(unicodedata.normalize('NFD', ch)[0]) < 128:
            group = unicodedata.normalize('NFD', ch)[0].upper() # Accented letters e.g. Á -> A
        elif ch in '!@#$%^&*()_+-=[]{}|;:",.<>?/`~"\'“’':
            group = '#'
        else:
            group = '🌐' # Foreign / Emojis / Symbols / Math bold / CJK / etc.
        
        if group not in buckets:
            buckets[group] = []
        buckets[group].append(item)

    print("Groups found:")
    for g, song_list in sorted(buckets.items()):
        print(f"Group '{g}': {len(song_list)} songs (First: {song_list[0]['title'][:30]!r} at index {song_list[0]['index']})")

    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
