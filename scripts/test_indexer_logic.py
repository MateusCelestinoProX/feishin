import asyncio
import pprint
import unicodedata
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
            // Function to normalize title / artist to section key
            function getSectionKey(rawStr) {
                if (!rawStr) return '#';
                // Strip leading whitespace, quotes, BOM, and zero-width chars
                let s = rawStr.replace(/^[\\s\\uFEFF\\u200B\\u200C\\u200D\\"\\'\\“\\”\\‘\\’\\[\\]\\(\\)\\{\\}]+/, '');
                if (!s) return '#';
                
                const firstChar = s[0];
                
                // Check if number
                if (/^[0-9]/.test(s)) return '#';
                
                // Normalize accents: É -> E, Á -> A, etc.
                const normalized = s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
                const normChar = normalized[0].toUpperCase();
                
                if (normChar >= 'A' && normChar <= 'Z') {
                    return normChar;
                }
                
                // Common punctuation symbols like $, !, #, +, -, ., @
                if (/^[!@#$%^&*+=\\-_~`|/\\\\?><:;]/.test(s)) {
                    return '#';
                }
                
                // Foreign / Non-Latin scripts (Cyrillic, CJK, Japanese, Korean, Arabic, Emojis, Math bold, etc.)
                return '🌐';
            }

            // Build index map: Section -> { firstIndex, count, sampleTitle, sampleArtist }
            const sections = {};
            // Pre-seed all standard sections
            const alphabet = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), '🌐'];
            alphabet.forEach(k => {
                sections[k] = { key: k, firstIndex: -1, count: 0, firstTrack: null };
            });

            data.forEach((track, idx) => {
                const key = getSectionKey(track.title);
                const sec = sections[key] || sections['🌐'];
                if (sec.firstIndex === -1) {
                    sec.firstIndex = idx;
                    sec.firstTrack = { title: track.title, artist: track.artist, album: track.album };
                }
                sec.count++;
            });

            return sections;
        });
    })()
    """
    res = await cdp.evaluate(js)
    print("Section Index Map:")
    for k, v in res.items():
        if v['count'] > 0:
            print(f"[{k}] Index: {v['firstIndex']:4d} | Count: {v['count']:3d} | First: {v['firstTrack']['title'][:35]!r} by {v['firstTrack']['artist'][:25]!r}")
        else:
            print(f"[{k}] (EMPTY)")
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
