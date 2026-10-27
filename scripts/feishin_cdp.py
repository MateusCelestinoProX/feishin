#!/usr/bin/env python3
import asyncio
import json
import urllib.request
import websockets
from pathlib import Path

class FeishinCDP:
    def __init__(self, port=9222):
        self.port = port
        self.ws = None
        self.session_id = None
        self.req_id = 1
        self.pending = {}
        self.recv_task = None

    async def connect(self):
        v = json.loads(urllib.request.urlopen(f'http://127.0.0.1:{self.port}/json/version').read())
        b_url = v['webSocketDebuggerUrl']
        self.ws = await websockets.connect(b_url, max_size=100 * 1024 * 1024)
        self.recv_task = asyncio.create_task(self._listen())

        # List targets
        targets = await self.call('Target.getTargets')
        main_target = None
        for t in targets.get('targetInfos', []):
            if 'out/renderer/index.html' in t.get('url', ''):
                main_target = t
                break
        
        if not main_target:
            raise RuntimeError("Renderer target não encontrado!")

        attach_res = await self.call('Target.attachToTarget', {
            'targetId': main_target['targetId'],
            'flatten': True
        })
        self.session_id = attach_res.get('sessionId')

    async def _listen(self):
        try:
            async for raw in self.ws:
                msg = json.loads(raw)
                print("[RAW RECV]", msg)
                msg_id = msg.get('id')
                if msg_id and msg_id in self.pending:
                    fut = self.pending.pop(msg_id)
                    if not fut.done():
                        fut.set_result(msg)
        except asyncio.CancelledError:
            pass
        except Exception as e:
            print("[CDP] Erro no listener:", e)

    async def call(self, method, params=None, timeout=10):
        cur_id = self.req_id
        self.req_id += 1
        fut = asyncio.get_running_loop().create_future()
        self.pending[cur_id] = fut

        payload = {'id': cur_id, 'method': method}
        if params:
            payload['params'] = params
        if self.session_id and not method.startswith('Target.'):
            payload['sessionId'] = self.session_id

        print("[RAW SEND]", payload)
        await self.ws.send(json.dumps(payload))
        res = await asyncio.wait_for(fut, timeout=timeout)
        if 'error' in res:
            raise RuntimeError(f"CDP Error ({method}): {res['error']}")
        return res.get('result', {})

    async def evaluate(self, expression, timeout=10):
        res = await self.call('Runtime.evaluate', {
            'expression': expression,
            'returnByValue': True,
            'awaitPromise': True
        }, timeout=timeout)
        result_data = res.get('result', {})
        if 'value' in result_data:
            return result_data['value']
        if res.get('exceptionDetails'):
            raise RuntimeError(f"JS Exception: {res['exceptionDetails']}")
        return result_data

    async def screenshot(self, output_path):
        res = await self.call('Page.captureScreenshot', {'format': 'png'})
        data = res.get('data')
        import base64
        Path(output_path).write_bytes(base64.b64decode(data))
        print(f"[✓] Screenshot salvo: {output_path}")

    async def close(self):
        if self.recv_task:
            self.recv_task.cancel()
        if self.ws:
            await self.ws.close()
