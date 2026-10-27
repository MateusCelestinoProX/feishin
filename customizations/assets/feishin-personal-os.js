// ==========================================================================
// FEISHIN x PERSONAL OS — SHADER ENGINE & LIQUID GLASS CONTROLLER
// Seamlessly merges Personal OS WebGL Shaders with Feishin's Music Interface
// ==========================================================================

import './webgl-backgrounds.js';

(function() {
  console.log('[Personal OS Engine] Inicializando Shaders & Liquid Glass no Feishin...');

  // 1. Shaders catalog from Personal OS
  const SHADER_CATALOG = [
    {
      category: '🌌 Cósmico & Etéreo',
      items: [
        { id: 'softaurora', name: 'Soft Aurora', icon: '✨' },
        { id: 'aurora', name: 'Aurora Borealis', icon: '🌌' },
        { id: 'antigravity', name: 'Antigravity', icon: '🔮' },
        { id: 'prism', name: 'Prism Light', icon: '💎' },
        { id: 'prismaticburst', name: 'Prismatic Burst', icon: '🎆' },
        { id: 'liquidether', name: 'Liquid Ether', icon: '🌀' },
        { id: 'orb', name: 'Luminous Orb', icon: '🪐' }
      ]
    },
    {
      category: '⚡ Energia & Ondas',
      items: [
        { id: 'plasmawave', name: 'Plasma Wave', icon: '🌊' },
        { id: 'plasma', name: 'Core Plasma', icon: '⚡' },
        { id: 'strands', name: 'Neon Strands', icon: '🧵' },
        { id: 'siderays', name: 'Side Rays', icon: '🔆' },
        { id: 'beams', name: 'Beams Flow', icon: '🌠' },
        { id: 'lightning', name: 'Lightning Storm', icon: '🌩️' },
        { id: 'linewaves', name: 'Line Waves', icon: '〰️' }
      ]
    },
    {
      category: '🧪 Fluidos & Orgânico',
      items: [
        { id: 'ferrofluid', name: 'Ferrofluid', icon: '⚫' },
        { id: 'liquidchrome', name: 'Liquid Chrome', icon: '🪞' },
        { id: 'silk', name: 'Pure Silk', icon: '🪡' },
        { id: 'floatinglines', name: 'Floating Lines', icon: '🪄' },
        { id: 'ghostfibers', name: 'Ghost Fibers', icon: '🕸️' },
        { id: 'webthreads', name: 'Web Threads', icon: '🕷️' }
      ]
    },
    {
      category: '🎮 Cyber & Arcade',
      items: [
        { id: 'balatro', name: 'Balatro CRT', icon: '🃏' },
        { id: 'dither', name: 'Dither Noise', icon: '📺' },
        { id: 'darkveil', name: 'Dark Veil', icon: '🕶️' },
        { id: 'topography', name: 'Topography Map', icon: '🗺️' },
        { id: 'faultyterminal', name: 'Faulty Terminal', icon: '📟' },
        { id: 'gridscan', name: 'Grid Scanner', icon: '📡' },
        { id: 'pixelblast', name: 'Pixel Blast', icon: '👾' },
        { id: 'radar', name: 'Pulse Radar', icon: '🎯' },
        { id: 'ripplegrid', name: 'Ripple Grid', icon: '🌐' },
        { id: 'magicrings', name: 'Magic Rings', icon: '💫' },
        { id: 'letterglitch', name: 'Letter Glitch', icon: '🔡' },
        { id: 'evileye', name: 'Evil Eye', icon: '👁️' },
        { id: 'particles', name: 'Starfield Particles', icon: '⭐' }
      ]
    }
  ];

  const FLAT_SHADERS = SHADER_CATALOG.flatMap(c => c.items);

  // 2. State & Preferences
  let activeShader = localStorage.getItem('feishin_active_shader') || 'plasmawave';
  let isRotative = localStorage.getItem('feishin_shader_rotative') === 'true';
  let rotativeSeconds = parseInt(localStorage.getItem('feishin_shader_rotative_sec') || '30', 10);
  let isEcoMode = localStorage.getItem('feishin_shader_eco') === 'true';
  let rotativeTimer = null;
  let currentRotativeIdx = 0;

  // 3. Ensure DOM Canvas Container
  function ensureShaderContainer() {
    let container = document.getElementById('bg-webgl-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'bg-webgl-container';
      document.body.prepend(container);
    }
    let vignette = document.getElementById('bg-webgl-vignette');
    if (!vignette) {
      vignette = document.createElement('div');
      vignette.id = 'bg-webgl-vignette';
      document.body.insertBefore(vignette, container.nextSibling);
    }
    return container;
  }

  // 4. Activate Shader
  function applyShader(shaderId) {
    if (isEcoMode) {
      if (window.stopWebGLBackground) window.stopWebGLBackground();
      updatePillLabel('🍃 Eco Mode (Pausado)');
      return;
    }

    activeShader = shaderId;
    localStorage.setItem('feishin_active_shader', shaderId);

    const found = FLAT_SHADERS.find(s => s.id === shaderId) || FLAT_SHADERS[0];

    try {
      if (typeof window.setWebGLBackground === 'function') {
        window.setWebGLBackground(shaderId);
      } else if (typeof window.renderWebGLBackground === 'function') {
        window.renderWebGLBackground(shaderId);
      }
    } catch(err) {
      console.warn('[Personal OS Shader Error]', err);
    }

    updatePillLabel(`${found.icon} ${found.name}`);
    updateModalUI();
  }

  // 5. Rotative Mode Engine
  function startRotative() {
    stopRotative();
    rotativeTimer = setInterval(() => {
      if (isEcoMode) return;
      currentRotativeIdx = (currentRotativeIdx + 1) % FLAT_SHADERS.length;
      applyShader(FLAT_SHADERS[currentRotativeIdx].id);
    }, rotativeSeconds * 1000);
  }

  function stopRotative() {
    if (rotativeTimer) {
      clearInterval(rotativeTimer);
      rotativeTimer = null;
    }
  }

  function updatePillLabel(text) {
    const lbl = document.getElementById('personal-os-pill-label');
    if (lbl) lbl.textContent = text;
  }

  // 6. Mount UI Controls
  function mountShaderSwitcherUI() {
    if (document.getElementById('personal-os-shader-pill')) return;

    // Header Pill Button
    const pill = document.createElement('button');
    pill.id = 'personal-os-shader-pill';
    pill.type = 'button';
    pill.title = 'Personal OS WebGL Shaders & Liquid Glass';
    pill.innerHTML = `
      <div class="shader-glow-dot"></div>
      <span id="personal-os-pill-label">🔮 Plasma Wave</span>
      <span class="badge-bg-num">${FLAT_SHADERS.length} fundos</span>
      <span style="font-size: 8px; opacity: 0.7; margin-left: 2px;">▾</span>
    `;

    // Always float safely at top-right with no-drag guarantees
    pill.style.position = 'fixed';
    pill.style.top = '7px';
    pill.style.right = '40px';
    pill.style.zIndex = '99999';
    pill.style.webkitAppRegion = 'no-drag';
    document.body.appendChild(pill);

    // Backdrop
    let backdrop = document.getElementById('personal-os-shader-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'personal-os-shader-backdrop';
      backdrop.style.display = 'none';
      backdrop.style.webkitAppRegion = 'no-drag';
      document.body.appendChild(backdrop);
    }

    // Modal / Popover
    let modal = document.getElementById('personal-os-shader-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'personal-os-shader-modal';
      modal.style.display = 'none';
      modal.style.webkitAppRegion = 'no-drag';

      modal.innerHTML = `
        <div class="shader-modal-header">
          <h3><span>🔮</span> Shaders Personal OS</h3>
          <button class="shader-modal-close" id="shader-modal-close-btn" type="button">✕</button>
        </div>
        <div class="shader-modal-controls">
          <button class="shader-ctrl-btn ${isRotative ? 'active' : ''}" id="shader-rotative-toggle" type="button">
            <span>🔄</span> Rotativo: ${isRotative ? 'Ativo' : 'Fixo'}
          </button>
          <button class="shader-ctrl-btn ${isEcoMode ? 'active' : ''}" id="shader-eco-toggle" type="button">
            <span>${isEcoMode ? '▶️' : '🍃'}</span> ${isEcoMode ? 'Retomar' : 'Eco Mode'}
          </button>
        </div>
        <div class="shader-grid-list" id="shader-grid-list-container">
          <!-- populated dynamically -->
        </div>
      `;

      document.body.appendChild(modal);

      // Populate Shaders in Grid
      const listContainer = modal.querySelector('#shader-grid-list-container');
      SHADER_CATALOG.forEach(cat => {
        const catHeader = document.createElement('div');
        catHeader.className = 'shader-category-title';
        catHeader.textContent = cat.category;
        listContainer.appendChild(catHeader);

        cat.items.forEach(sh => {
          const card = document.createElement('div');
          card.className = `shader-item-card ${sh.id === activeShader ? 'active' : ''}`;
          card.setAttribute('data-shader-id', sh.id);
          card.innerHTML = `
            <span>${sh.icon} ${sh.name}</span>
            <span class="shader-item-badge">${sh.id}</span>
          `;
          card.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            isEcoMode = false;
            localStorage.setItem('feishin_shader_eco', 'false');
            applyShader(sh.id);
            setTimeout(() => {
              closeModal();
            }, 250);
          };
          listContainer.appendChild(card);
        });
      });

      // Close Modal Button
      modal.querySelector('#shader-modal-close-btn').onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      };

      // Rotative Mode Toggle
      modal.querySelector('#shader-rotative-toggle').onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        isRotative = !isRotative;
        localStorage.setItem('feishin_shader_rotative', isRotative);
        this.classList.toggle('active', isRotative);
        this.innerHTML = `<span>🔄</span> Rotativo: ${isRotative ? 'Ativo' : 'Fixo'}`;
        if (isRotative) {
          startRotative();
        } else {
          stopRotative();
        }
      };

      // Eco Mode Toggle
      modal.querySelector('#shader-eco-toggle').onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        isEcoMode = !isEcoMode;
        localStorage.setItem('feishin_shader_eco', isEcoMode);
        this.classList.toggle('active', isEcoMode);
        this.innerHTML = `<span>${isEcoMode ? '▶️' : '🍃'}</span> ${isEcoMode ? 'Retomar' : 'Eco Mode'}`;
        if (isEcoMode) {
          if (window.stopWebGLBackground) window.stopWebGLBackground();
          updatePillLabel('🍃 Eco Mode');
        } else {
          applyShader(activeShader);
        }
      };
    }

    function openModal() {
      backdrop.style.display = 'block';
      modal.style.display = 'flex';
      updateModalUI();
    }

    function closeModal() {
      backdrop.style.display = 'none';
      modal.style.display = 'none';
    }

    function toggleModal() {
      if (modal.style.display === 'flex') {
        closeModal();
      } else {
        openModal();
      }
    }

    // Toggle Modal on Pill Click & Pointerdown (Guarantees zero drag interception)
    pill.addEventListener('pointerdown', (e) => e.stopPropagation());
    pill.addEventListener('mousedown', (e) => e.stopPropagation());
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleModal();
    });

    backdrop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });

    // Initial label update
    const cur = FLAT_SHADERS.find(s => s.id === activeShader) || FLAT_SHADERS[0];
    updatePillLabel(`${cur.icon} ${cur.name}`);
  }

  function updateModalUI() {
    const modal = document.getElementById('personal-os-shader-modal');
    if (!modal) return;
    modal.querySelectorAll('.shader-item-card').forEach(card => {
      const id = card.getAttribute('data-shader-id');
      card.classList.toggle('active', id === activeShader && !isEcoMode);
    });
  }

  // 7. Auto Lifecycle & Pause Handling
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.__PAUSE_WEBGL_SHADERS__ = true;
    } else {
      window.__PAUSE_WEBGL_SHADERS__ = false;
      if (!isEcoMode && (window.renderWebGLBackground || window.setWebGLBackground)) {
        applyShader(activeShader);
      }
    }
  });

  // 8. Bootstrap Engine
  function initEngine() {
    ensureShaderContainer();
    mountShaderSwitcherUI();
    initTrayBridge();

    // Loop checking until setWebGLBackground is available
    const checkInit = () => {
      if (typeof window.setWebGLBackground === 'function' || typeof window.renderWebGLBackground === 'function') {
        if (!isEcoMode) applyShader(activeShader);
        if (isRotative) startRotative();
      } else {
        setTimeout(checkInit, 100);
      }
    };
    checkInit();
  }

  // ==========================================================================
  // 9. TRAY MINI-PANEL & PERSONAL OS BRIDGE
  // ==========================================================================
  function initTrayBridge() {
    console.log('[Personal OS] Conectando Tray Mini-Panel Bridge...');

    function getPlayerStore() {
      if (window.__FEISHIN_PLAYER_STORE__) return window.__FEISHIN_PLAYER_STORE__.getState();
      if (window.__FEISHIN_STORE__) return window.__FEISHIN_STORE__;
      const root = document.querySelector("#root");
      if (!root) return null;
      const fiberKey = Object.keys(root).find(k => k.startsWith("__reactContainer"));
      if (!fiberKey) return null;
      let store = null;
      function search(f, depth) {
        if (!f || depth > 30 || store) return;
        if (f.memoizedProps && f.memoizedProps.value && typeof f.memoizedProps.value.getQueue === "function") {
          store = f.memoizedProps.value;
          return;
        }
        if (f.child) search(f.child, depth + 1);
        if (f.sibling) search(f.sibling, depth + 1);
      }
      search(root[fiberKey], 0);
      if (store) window.__FEISHIN_STORE__ = store;
      return store;
    }

    function getCoverUrl() {
      const img = document.querySelector("footer img") || 
                  document.querySelector(".fs-player-bar-module-cover-art img") || 
                  document.querySelector("img[alt]");
      return img ? img.src : null;
    }

    function broadcastState() {
      const store = getPlayerStore();
      if (!store) return;
      try {
        const q = store.getQueue();
        const items = Array.isArray(q) ? q : (q && q.items ? q.items : []);
        const current = items.find(i => i.isCurrent) || store.getCurrentSong?.() || (items.length > 0 ? items[0] : null);
        
        // Elapsed & Duration
        const timeStore = window.__FEISHIN_TIME_STORE__;
        const timestamp = timeStore?.getState?.()?.timestamp || 0;
        const duration = current?.duration ? (current.duration > 10000 ? Math.round(current.duration / 1000) : current.duration) : 0;
        
        // Status
        let isPlaying = false;
        const docTitle = document.title || "";
        if (docTitle.startsWith("(Tocando)") || docTitle.startsWith("(Playing)")) {
          isPlaying = true;
        } else if (store.player?.status) {
          isPlaying = store.player.status === "PLAYING";
        }

        const coverUrl = getCoverUrl();

        const payload = {
          title: current?.name || current?.title || "Nenhuma faixa selecionada",
          artist: current?.artistName || (current?.artists?.map(a => a.name).join(", ")) || "Artista Desconhecido",
          album: current?.album || current?.albumName || "",
          coverUrl: coverUrl,
          isPlaying: isPlaying,
          timestamp: timestamp,
          duration: duration,
          queue: items.map((t, idx) => ({
            index: idx,
            id: t._uniqueId || t.id,
            name: t.name || t.title || `Faixa ${idx + 1}`,
            artist: t.artistName || (t.artists?.map(a => a.name).join(", ")) || "",
            album: t.album || t.albumName || "",
            duration: t.duration ? (t.duration > 10000 ? Math.round(t.duration / 1000) : t.duration) : 0,
            isCurrent: current ? ((t._uniqueId && t._uniqueId === current._uniqueId) || (t.id && t.id === current.id)) : false
          }))
        };

        if (window.api && window.api.ipc && typeof window.api.ipc.send === "function") {
          window.api.ipc.send("tray-panel-send-state", payload);
        }
      } catch (e) {
        console.warn("[TrayBridge Broadcast Error]", e);
      }
    }

    function handleAction(action, payload) {
      const store = getPlayerStore();
      if (!store) return;
      switch (action) {
        case "previous":
          store.mediaPrevious?.();
          break;
        case "skip-backward":
          store.mediaSkipBackward?.(3);
          break;
        case "play-pause":
          store.mediaTogglePlayPause?.();
          break;
        case "skip-forward":
          store.mediaSkipForward?.(3);
          break;
        case "next":
          store.mediaNext?.();
          break;
        case "play-index":
          if (payload && typeof payload.index === "number") {
            store.mediaPlayByIndex?.(payload.index);
          }
          break;
      }
      setTimeout(broadcastState, 150);
    }

    // Interval to keep mini panel state sync in real time
    setInterval(broadcastState, 1000);

    // Subscribe to IPC events if available
    if (window.api && window.api.ipc && typeof window.api.ipc.on === "function") {
      window.api.ipc.on("tray-panel-request-state", () => broadcastState());
      window.api.ipc.on("tray-panel-execute-action", (_e, data) => {
        if (data && data.action) handleAction(data.action, data.payload);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }
})();
