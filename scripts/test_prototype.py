import asyncio
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    
    # Ensure on songs page
    await cdp.evaluate('window.location.hash = "#/library/songs"')
    await asyncio.sleep(1)
    
    test_js = """
    (() => {
        // Clean up previous test if any
        document.querySelector('#feishin-alphabet-scrubber')?.remove();
        document.querySelector('#feishin-alphabet-hud')?.remove();
        
        const scroller = document.querySelector('.fs-item-table-list-module-height-100');
        if (!scroller) return { error: 'No scroller found' };
        
        const container = document.createElement('div');
        container.id = 'feishin-alphabet-scrubber';
        container.style.cssText = `
            position: fixed;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            background: rgba(18, 12, 34, 0.55);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 8px 3px;
            z-index: 9999;
            user-select: none;
            cursor: pointer;
            width: 22px;
            height: calc(100vh - 240px);
            min-height: 480px;
            max-height: 640px;
            transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s;
        `;
        
        const alphabet = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), '🌐'];
        alphabet.forEach(letter => {
            const el = document.createElement('div');
            el.className = 'fs-az-item';
            el.dataset.letter = letter;
            el.textContent = letter;
            el.style.cssText = `
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 10px;
                font-weight: 700;
                line-height: 1;
                color: rgba(255, 255, 255, 0.65);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 16px;
                border-radius: 9px;
                transition: transform 0.12s, color 0.12s, background 0.12s;
            `;
            container.appendChild(el);
        });
        
        document.body.appendChild(container);
        
        return {
            success: true,
            containerRect: container.getBoundingClientRect(),
            itemsCount: container.children.length
        };
    })()
    """
    res = await cdp.evaluate(test_js)
    print("Injection test:", res)
    await cdp.screenshot('scrubber_prototype_1.png')
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
