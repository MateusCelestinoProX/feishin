import asyncio
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    
    test_all_letters = """
    (() => {
        const engine = window.__FEISHIN_ALPHABET_SCRUBBER__;
        const alphabet = engine.alphabetList;
        const results = [];
        
        for (const letter of alphabet) {
            const item = document.querySelector(`.fs-az-item[data-letter="${letter}"]`);
            engine.jumpToLetter(letter, item);
            const hud = document.querySelector('#feishin-alphabet-hud');
            results.push({
                letter,
                badge: hud.querySelector('.fs-az-hud-badge')?.textContent,
                title: hud.querySelector('.fs-az-hud-title')?.textContent,
                count: hud.querySelector('.fs-az-hud-count')?.textContent,
                song: hud.querySelector('.fs-az-hud-song')?.textContent,
                targetIndex: engine.sectionMap[letter]?.firstIndex
            });
        }
        
        // Jump back to top #
        engine.jumpToLetter('#', document.querySelector('.fs-az-item[data-letter="#"]'));
        
        return results;
    })()
    """
    res = await cdp.evaluate(test_all_letters)
    print("Testing All 28 Alphabet & Special Buckets:")
    for r in res:
        print(f"[{r['letter']:>2}] Badge: {r['badge']:>2} | Title: {r['title']:<28} | Count: {r['count']:<12} | Idx: {str(r['targetIndex']):<5} | Sample: {r['song'][:35]}")
        
    await cdp.screenshot('all_letters_verified.png')
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
