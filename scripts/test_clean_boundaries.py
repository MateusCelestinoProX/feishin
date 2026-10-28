import asyncio
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    js = """
    (() => {
        const auth = JSON.parse(localStorage.getItem('store_authentication') || '{}');
        const srv = Object.values(auth?.state?.serverList || {})[0];
        return fetch(`${srv.url}/api/song?_start=0&_end=2000&_sort=title&_order=ASC`, {
            headers: {
                'x-nd-authorization': `Bearer ${srv.ndCredential}`,
                'x-nd-client-unique-id': auth?.state?.deviceId || 'feishin'
            }
        }).then(r => r.json()).then(tracks => {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            const boundaries = {};
            
            boundaries['#'] = { index: 0, count: 0, firstTrack: tracks[0] ? { title: tracks[0].title, artist: tracks[0].artist } : null };
            
            letters.forEach(L => {
                boundaries[L] = { index: -1, count: 0, firstTrack: null };
            });
            boundaries['🌐'] = { index: -1, count: 0, firstTrack: null };
            
            tracks.forEach((t, i) => {
                const title = (t.title || '').trim();
                
                // Top symbols/numbers block before standard letters
                if (i < 24) {
                    boundaries['#'].count++;
                    return;
                }
                
                // Normalizing accented letters
                const norm = title.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
                const ch = norm.charAt(0).toUpperCase();
                
                if (ch >= 'A' && ch <= 'Z' && i < 1141) {
                    if (boundaries[ch].index === -1) {
                        boundaries[ch].index = i;
                        boundaries[ch].firstTrack = { title: t.title, artist: t.artist };
                    }
                    boundaries[ch].count++;
                } else if (i >= 1141) {
                    if (boundaries['🌐'].index === -1) {
                        boundaries['🌐'].index = i;
                        boundaries['🌐'].firstTrack = { title: t.title, artist: t.artist };
                    }
                    boundaries['🌐'].count++;
                } else {
                    boundaries['#'].count++;
                }
            });
            
            return boundaries;
        });
    })()
    """
    res = await cdp.evaluate(js, timeout=30)
    print("Exact Array Boundaries:")
    for k, v in res.items():
        if v['index'] != -1 or v['count'] > 0:
            first = v['firstTrack']['title'][:30] if v['firstTrack'] else 'None'
            print(f"[{k:>2}] Index: {v['index']:4d} | Count: {v['count']:3d} | First: {first!r}")
        else:
            print(f"[{k:>2}] (No tracks)")
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
