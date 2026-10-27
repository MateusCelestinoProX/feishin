import fs from 'fs';

async function main() {
  const action = process.argv[2] || 'snap';
  const outPath = process.argv[3] || '/Users/mcp/.gemini/antigravity/brain/cc18fe27-cf17-4c66-84e6-d7140dc05d8a/feishin_live.png';

  const targetsRes = await fetch("http://127.0.0.1:9222/json");
  const targets = await targetsRes.json();
  const mainTarget = targets.find(t => t.url.includes("out/renderer/index.html"));
  if (!mainTarget) {
    console.error("Target not found!");
    process.exit(1);
  }

  const ws = new WebSocket(mainTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  function send(method, params = {}) {
    const curId = id++;
    return new Promise((resolve) => {
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === curId) {
          ws.removeEventListener("message", handler);
          resolve(data.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  if (action === 'eval') {
    const expr = process.argv[3];
    const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true });
    console.log(JSON.stringify(res.result.value, null, 2));
  } else if (action === 'toggle-player') {
    const res = await send("Runtime.evaluate", {
      expression: `(() => {
        // Look for the maximize button or the song info cover
        const cover = document.querySelector(".fs-left-controls-module-image") ||
                      document.querySelector("#player-bar img");
        if (cover) {
          cover.click();
          return "Cover clicked";
        }
        return "Not found";
      })()`,
      returnByValue: true
    });
    console.log("Toggle result:", res.result.value);
  } else if (action === 'snap') {
    const snap = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(outPath, Buffer.from(snap.data, "base64"));
    console.log("Screenshot written to " + outPath);
  }

  ws.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
