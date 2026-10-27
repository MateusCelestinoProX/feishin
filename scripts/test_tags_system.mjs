import fs from 'fs';

async function main() {
  const targetsRes = await fetch("http://127.0.0.1:9222/json");
  const targets = await targetsRes.json();
  const mainTarget = targets.find(t => t.url.includes("out/renderer/index.html"));
  if (!mainTarget) {
    console.error("Renderer target not found!");
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

  async function evaluate(expression) {
    const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    return res?.result?.value;
  }

  console.log("[1] Checando se __FEISHIN_TAGS_ENGINE__ está presente...");
  const hasEngine = await evaluate("typeof window.__FEISHIN_TAGS_ENGINE__ !== 'undefined'");
  console.log("  hasEngine:", hasEngine);

  console.log("[2] Navegando para #/library/genres (Página de Tags)...");
  await evaluate("window.location.hash = '#/library/genres'");
  await new Promise(r => setTimeout(r, 1200));

  console.log("[3] Verificando montagem de #fs-tags-page-mount...");
  const mountInfo = await evaluate(`(() => {
    const el = document.getElementById('fs-tags-page-mount');
    if (!el) return null;
    return {
      exists: true,
      display: el.style.display,
      htmlLength: el.innerHTML.length,
      viewMode: window.__FEISHIN_TAGS_ENGINE__?.viewMode,
      tagsCount: window.__FEISHIN_TAGS_ENGINE__?.getTags()?.length,
      heroBoxesCount: el.querySelectorAll('.fs-hero-box').length,
      tabsCount: el.querySelectorAll('.fs-tag-pill-btn').length
    };
  })()`);
  console.log("  mountInfo:", JSON.stringify(mountInfo, null, 2));

  // Screenshot 1: Visualização 1 (Hero Boxes & Editor)
  const snap1 = await send("Page.captureScreenshot", { format: "png" });
  const outDir = "/Users/mcp/.gemini/antigravity/brain/10f68f77-69e5-4136-a770-8acbbfc9d5fd";
  fs.writeFileSync(`${outDir}/tags_view1_boxes.png`, Buffer.from(snap1.data, "base64"));
  console.log(`[4] Screenshot 1 salvo em: ${outDir}/tags_view1_boxes.png`);

  console.log("[5] Alternando toggle para Visualização 2 (Tabs com botões no topo)...");
  await evaluate(`(() => {
    const toggleBtn = document.getElementById('fs-toggle-tabs');
    if (toggleBtn) toggleBtn.click();
  })()`);
  await new Promise(r => setTimeout(r, 600));

  const viewMode2 = await evaluate("window.__FEISHIN_TAGS_ENGINE__?.viewMode");
  console.log("  viewMode atual:", viewMode2);

  // Screenshot 2: Visualização 2 (Tabs & Playlist da Tag)
  const snap2 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(`${outDir}/tags_view2_tabs.png`, Buffer.from(snap2.data, "base64"));
  console.log(`[6] Screenshot 2 salvo em: ${outDir}/tags_view2_tabs.png`);

  // Testar clicar na 2ª tag pill
  console.log("[7] Clicando na 2ª tag nas pills...");
  await evaluate(`(() => {
    const pills = document.querySelectorAll('.fs-tag-pill-btn');
    if (pills[1]) pills[1].click();
  })()`);
  await new Promise(r => setTimeout(r, 500));

  const activeTag = await evaluate("window.__FEISHIN_TAGS_ENGINE__?.activeTabId");
  console.log("  activeTabId agora:", activeTag);

  // Voltar para visualização de boxes e clicar em um hero box para abrir a playlist
  console.log("[8] Voltando para Visualização 1 e abrindo playlist de um Hero Box...");
  await evaluate(`(() => {
    const toggleBtn = document.getElementById('fs-toggle-boxes');
    if (toggleBtn) toggleBtn.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));

  await evaluate(`(() => {
    const firstBox = document.querySelector('.fs-hero-box');
    if (firstBox) firstBox.click();
  })()`);
  await new Promise(r => setTimeout(r, 600));

  const snap3 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(`${outDir}/tags_box_playlist_opened.png`, Buffer.from(snap3.data, "base64"));
  console.log(`[9] Screenshot 3 salvo em: ${outDir}/tags_box_playlist_opened.png`);

  ws.close();
}

main().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
