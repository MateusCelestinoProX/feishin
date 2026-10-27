import asyncio
import json
import urllib.request
import websockets
import base64
from pathlib import Path

async def verify_layout():
    targets = json.loads(urllib.request.urlopen('http://127.0.0.1:9222/json').read())
    main_target = [x for x in targets if 'out/renderer/index.html' in x['url']][0]
    v = json.loads(urllib.request.urlopen('http://127.0.0.1:9222/json/version').read())
    b_url = v['webSocketDebuggerUrl']

    async with websockets.connect(b_url, max_size=100*1024*1024) as ws:
        # Attach to renderer target
        await ws.send(json.dumps({'id': 1, 'method': 'Target.attachToTarget', 'params': {'targetId': main_target['id'], 'flatten': True}}))
        while True:
            m = json.loads(await ws.recv())
            if m.get('id') == 1:
                sid = m['result']['sessionId']
                break

        # Check if full-screen player is open; if not, click cover
        await ws.send(json.dumps({
            'id': 2,
            'sessionId': sid,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': '''(() => {
                    let fs = document.querySelector(".fs-full-screen-player-module-container");
                    if (!fs) {
                        const cover = document.querySelector(".fs-left-controls-module-image") || document.querySelector("#player-bar img");
                        if (cover) cover.click();
                        return "Cover clicked";
                    }
                    return "Already in FS";
                })()''',
                'returnByValue': True
            }
        }))
        r2 = json.loads(await ws.recv())
        print("Player FS state:", r2.get('result', {}).get('result', {}).get('value'))

        await asyncio.sleep(1.0)

        # Measure geometry
        await ws.send(json.dumps({
            'id': 3,
            'sessionId': sid,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': '''(() => {
                    const q = document.querySelector(".fs-full-screen-player-queue-module-grid-container");
                    const ctrl = document.querySelector(".fs-full-screen-player-queue-module-controls-container");
                    const playerBar = document.querySelector("#player-bar");
                    function getProps(el) {
                        if (!el) return null;
                        const r = el.getBoundingClientRect();
                        return {
                            top: r.top, left: r.left, right: r.right, bottom: r.bottom,
                            width: r.width, height: r.height,
                            distFromRightEdge: window.innerWidth - r.right,
                            distFromBottomEdge: window.innerHeight - r.bottom
                        };
                    }
                    return {
                        window: { w: window.innerWidth, h: window.innerHeight },
                        queue: getProps(q),
                        controls: getProps(ctrl),
                        playerBar: getProps(playerBar),
                        gapBetweenQueueAndPlayerBar: (playerBar && q) ? (playerBar.getBoundingClientRect().top - q.getBoundingClientRect().bottom) : null
                    };
                })()''',
                'returnByValue': True
            }
        }))
        r3 = json.loads(await ws.recv())
        geom = r3.get('result', {}).get('result', {}).get('value')
        print("Verified Geometry:", json.dumps(geom, indent=2))

        # Capture screenshot
        await ws.send(json.dumps({
            'id': 4,
            'sessionId': sid,
            'method': 'Page.captureScreenshot',
            'params': {'format': 'png'}
        }))
        r4 = json.loads(await ws.recv())
        data = r4['result']['data']
        out_file = '/Users/mcp/.gemini/antigravity/brain/cc18fe27-cf17-4c66-84e6-d7140dc05d8a/feishin_verified_elegant_spacing.png'
        Path(out_file).write_bytes(base64.b64decode(data))
        print("Verification screenshot saved to:", out_file)

asyncio.run(verify_layout())
