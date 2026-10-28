import asyncio
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    
    drag_sim = """
    (async () => {
        const scrubber = document.querySelector('#feishin-alphabet-scrubber');
        const rect = scrubber.getBoundingClientRect();
        const startY = rect.top + 10;
        const endY = rect.bottom - 10;
        const x = rect.left + rect.width / 2;
        
        const history = [];
        
        // Start pointerdown
        scrubber.dispatchEvent(new PointerEvent('pointerdown', {
            bubbles: true,
            clientX: x,
            clientY: startY,
            pointerId: 1
        }));
        
        // Move in 10 steps from top to bottom
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            const currentY = startY + (endY - startY) * (i / steps);
            window.dispatchEvent(new PointerEvent('pointermove', {
                bubbles: true,
                clientX: x,
                clientY: currentY,
                pointerId: 1
            }));
            
            const activeLetter = document.querySelector('.fs-az-item.active')?.dataset.letter;
            const hud = document.querySelector('#feishin-alphabet-hud');
            const scroller = document.querySelector('.fs-item-table-list-module-height-100');
            
            history.push({
                step: i,
                y: Math.round(currentY),
                letter: activeLetter,
                hudVisible: hud?.classList.contains('visible'),
                badge: hud?.querySelector('.fs-az-hud-badge')?.textContent,
                scrollTop: scroller?.scrollTop
            });
            
            await new Promise(r => setTimeout(r, 60));
        }
        
        // End pointerup
        window.dispatchEvent(new PointerEvent('pointerup', {
            bubbles: true,
            clientX: x,
            clientY: endY,
            pointerId: 1
        }));
        
        return history;
    })()
    """
    res = await cdp.evaluate(drag_sim, timeout=20)
    print("Drag Simulation Results (10 steps):")
    for h in res:
        print(f"Step {h['step']:2d} | Y: {h['y']} | Letter: {h['letter']} | Badge: {h['badge']} | ScrollTop: {h['scrollTop']}")
        
    await cdp.screenshot('drag_simulation_end.png')
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
