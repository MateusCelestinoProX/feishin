import asyncio
from feishin_cdp import FeishinCDP

async def run():
    cdp = FeishinCDP()
    await cdp.connect()
    
    # Jump to S (55704)
    await cdp.evaluate('document.querySelector(".fs-item-table-list-module-height-100").scrollTop = 55704;')
    
    inspect_rows = """
    (() => {
        const rows = Array.from(document.querySelectorAll('.fs-item-table-list-module-height-100 tbody tr, .fs-item-table-list-module-height-100 [role="row"]'));
        return rows.slice(0, 5).map(r => r.innerText.split('\\n').join(' | '));
    })()
    """
    
    for wait_time in [0.2, 0.5, 1.0, 1.5]:
        await asyncio.sleep(wait_time)
        rows = await cdp.evaluate(inspect_rows)
        print(f"After {wait_time}s:", rows[0] if rows else 'None')
        
    await cdp.close()

if __name__ == '__main__':
    asyncio.run(run())
