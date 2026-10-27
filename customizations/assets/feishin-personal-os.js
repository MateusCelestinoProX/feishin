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
        { id: 'linewaves', name: 'Line Waves', icon: '〰️' },
        { id: 'lighttunnel', name: 'Light Tunnel', icon: '🚇' }
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
        { id: 'webthreads', name: 'Web Threads', icon: '🕷️' },
        { id: 'acidsquares', name: 'Acid Squares', icon: '🟩' },
        { id: 'moltenmetal', name: 'Molten Metal', icon: '🪨' }
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
        { id: 'particles', name: 'Starfield Particles', icon: '⭐' },
        { id: 'morphslider', name: 'Morph Slider', icon: '🖼️' }
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
    const item = document.getElementById('personal-os-sidebar-backgrounds-item');
    if (item) item.title = `Personal OS — Planos de Fundo (${text})`;
  }

  // 6. Mount Sidebar Backgrounds Navigation Item & Modal UI
  function mountShaderSwitcherUI() {
    // If top bar exists, ensure it is completely hidden
    const topBar = document.querySelector('.fs-window-bar-module-window-bar');
    if (topBar) {
      topBar.style.setProperty('display', 'none', 'important');
    }

    // Invisible Drag handle for moving frameless window on macOS
    if (!document.getElementById('personal-os-drag-handle')) {
      const dragHandle = document.createElement('div');
      dragHandle.id = 'personal-os-drag-handle';
      document.body.appendChild(dragHandle);
    }

    // Remove legacy top pill if any exists
    const oldPill = document.getElementById('personal-os-shader-pill');
    if (oldPill) oldPill.remove();

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
          <h3><span>🎨</span> Temas & Shaders</h3>
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
      const item = document.getElementById('personal-os-sidebar-backgrounds-item');
      if (item) item.classList.add('active');
      updateModalUI();
    }

    function closeModal() {
      backdrop.style.display = 'none';
      modal.style.display = 'none';
      const item = document.getElementById('personal-os-sidebar-backgrounds-item');
      if (item) item.classList.remove('active');
    }

    function toggleModal() {
      if (modal.style.display === 'flex') {
        closeModal();
      } else {
        openModal();
      }
    }

    // Ensure item in Left Sidebar as a native-feeling nav item
    function ensureSidebarItem() {
      const parent = document.querySelector('.fs-sidebar-module-accordion-content');
      if (!parent) return;

      let item = document.getElementById('personal-os-sidebar-backgrounds-item');
      if (!item) {
        item = document.createElement('a');
        item.id = 'personal-os-sidebar-backgrounds-item';
        item.className = 'mantine-focus-never mantine-active fs-button-module-root fs-sidebar-item-module-link fs-sidebar-item-module-root m_77c9d27d mantine-Button-root m_87cf2631 mantine-UnstyledButton-root';
        item.setAttribute('data-variant', 'subtle');
        item.setAttribute('data-size', 'sm');
        item.setAttribute('draggable', 'false');
        item.setAttribute('title', 'Personal OS — Temas & Shaders');
        item.style.cssText = '--button-height: var(--button-height-sm); --button-padding-x: var(--button-padding-x-sm); --button-fz: var(--mantine-font-size-sm); --button-bg: transparent; --button-hover: var(--mantine-color-primary-light-hover); --button-color: var(--mantine-color-primary-light-color); --button-bd: calc(0.0625rem * var(--mantine-scale)) solid transparent; cursor: pointer; user-select: none; -webkit-app-region: no-drag;';

        item.innerHTML = `
          <span class="fs-sidebar-item-module-inner m_80f1301b mantine-Button-inner">
            <span class="fs-sidebar-item-module-label m_811560b9 mantine-Button-label">
              <div class="m_4081bf90 mantine-Group-root" style="--group-gap: var(--mantine-spacing-md); --group-align: center; --group-justify: flex-start; --group-wrap: wrap;">
                <span class="fs-sidebar-icon-module-wrapper">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C12.55 22 13 21.55 13 21C13 20.75 12.9 20.53 12.75 20.36C12.6 20.19 12.5 19.97 12.5 19.72C12.5 19.17 12.95 18.72 13.5 18.72H15C18.86 18.72 22 15.58 22 11.72C22 6.36 17.52 2 12 2ZM12 4C16.41 4 20 7.46 20 11.72C20 14.48 17.76 16.72 15 16.72H13.5C11.85 16.72 10.5 18.07 10.5 19.72C10.5 20.24 10.7 20.71 11.02 21.07C11.13 21.19 11.2 21.34 11.2 21.5C11.2 21.78 10.98 22 10.7 22H12C6.49 22 2 17.51 2 12C2 6.49 6.49 4 12 4ZM6.5 10C5.67 10 5 10.67 5 11.5C5 12.33 5.67 13 6.5 13C7.33 13 8 12.33 8 11.5C8 10.67 7.33 10 6.5 10ZM9.5 7C8.67 7 8 7.67 8 8.5C8 9.33 8.67 10 9.5 10C10.33 10 11 9.33 11 8.5C11 7.67 10.33 7 9.5 7ZM14.5 7C13.67 7 13 7.67 13 8.5C13 9.33 13.67 10 14.5 10C15.33 10 16 9.33 16 8.5C16 7.67 15.33 7 14.5 7ZM17.5 10C16.67 10 16 10.67 16 11.5C16 12.33 16.67 13 17.5 13C18.33 13 19 12.33 19 11.5C19 10.67 18.33 10 17.5 10Z"></path>
                  </svg>
                </span>
                <span>BACKGROUNDS</span>
              </div>
            </span>
          </span>
        `;

        item.addEventListener('pointerdown', (e) => e.stopPropagation());
        item.addEventListener('mousedown', (e) => e.stopPropagation());
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleModal();
        });

        parent.appendChild(item);
      } else if (item.parentElement !== parent) {
        parent.appendChild(item);
      }
    }

    ensureSidebarItem();

    // Reconnect whenever React reconciles/updates DOM
    if (!window.__PERSONAL_OS_SIDEBAR_OBSERVER__) {
      window.__PERSONAL_OS_SIDEBAR_OBSERVER__ = new MutationObserver(() => {
        ensureSidebarItem();
      });
      window.__PERSONAL_OS_SIDEBAR_OBSERVER__.observe(document.body, { childList: true, subtree: true });
    }

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
    initFullScreenFreeSpaceDismiss();

    // Enforce album art staying in playerbar dock corner and queue inside full-screen player
    try {
      const rawApp = localStorage.getItem('store_app');
      if (rawApp) {
        const parsed = JSON.parse(rawApp);
        let changed = false;
        if (parsed?.state?.sidebar?.image) {
          parsed.state.sidebar.image = false;
          changed = true;
        }
        if (parsed?.state?.sidebar?.rightExpanded) {
          parsed.state.sidebar.rightExpanded = false;
          changed = true;
        }
        if (changed) localStorage.setItem('store_app', JSON.stringify(parsed));
      }

      // Enforce activeTab: "queue" in full-screen player
      const rawFs = localStorage.getItem('store_full_screen_player');
      if (rawFs) {
        const parsedFs = JSON.parse(rawFs);
        if (parsedFs?.state && parsedFs.state.activeTab !== 'queue') {
          parsedFs.state.activeTab = 'queue';
          localStorage.setItem('store_full_screen_player', JSON.stringify(parsedFs));
        }
      }
    } catch (e) {}

    initPlayerSplitQueue();

    const enforcePlayerCoverArt = () => {
      const sidebarImg = document.querySelector('.fs-sidebar-module-image-container');
      if (sidebarImg) {
        const btn = sidebarImg.querySelector('button');
        if (btn) btn.click();
      }
    };
    const coverObserver = new MutationObserver(enforcePlayerCoverArt);
    coverObserver.observe(document.body, { childList: true, subtree: true });
    enforcePlayerCoverArt();

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
        
        // Find current song by index or method
        const currentIndex = (store.player && typeof store.player.index === "number") ? store.player.index : -1;
        const current = (currentIndex >= 0 && currentIndex < items.length) ? items[currentIndex] : (store.getCurrentSong?.() || (items.length > 0 ? items[0] : null));
        
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
            isCurrent: current ? ((t._uniqueId && t._uniqueId === current._uniqueId) || (t.id && t.id === current.id) || idx === currentIndex) : false
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

  // ==========================================================================
  // 10. FULLSCREEN FREE-SPACE CLICK-TO-DISMISS (ESC ACTION)
  // Clicar em qualquer espaço livre da tela de reprodução expandida
  // executa a ação da tecla Esc, retraindo a tela de volta para a barra.
  // ==========================================================================
  function initFullScreenFreeSpaceDismiss() {
    let pointerDownPos = null;

    window.addEventListener('pointerdown', (e) => {
      if (e.button === 0) {
        pointerDownPos = { x: e.clientX, y: e.clientY, time: Date.now() };
      }
    }, true);

    window.addEventListener('click', (e) => {
      // 1. Apenas botão principal (esquerdo)
      if (e.button !== 0) return;

      // 2. Ignora arrastos e seleções (> 8px)
      if (pointerDownPos) {
        const dx = Math.abs(e.clientX - pointerDownPos.x);
        const dy = Math.abs(e.clientY - pointerDownPos.y);
        pointerDownPos = null;
        if (dx > 8 || dy > 8) return;
      }

      // 3. Verifica se a tela cheia / expandida está ativa
      const fsContainer = document.querySelector('.fs-full-screen-player-module-container');
      if (!fsContainer) return;

      // 4. Ignora se houver texto selecionado
      if (window.getSelection && window.getSelection().toString().trim().length > 0) return;

      // 5. Ignora se algum modal, popover, menu ou o widget de temas estiver aberto
      if (document.querySelector('.mantine-Modal-content, .mantine-Popover-dropdown, .mantine-Menu-dropdown, .mantine-Select-dropdown')) return;
      const themeModal = document.getElementById('personal-os-shader-modal');
      if (themeModal && themeModal.style.display === 'flex') return;

      // 6. Lista de controles interativos que devem preservar sua ação própria
      const interactive = e.target.closest(
        'button, [role="button"], a, input, select, textarea, [role="slider"], ' +
        '.mantine-Slider-root, .mantine-Menu-dropdown, .mantine-Modal-content, ' +
        '.mantine-Popover-dropdown, #personal-os-shader-pill, #personal-os-shader-modal, ' +
        '#personal-os-shader-backdrop, .fs-full-screen-player-queue-module-grid-container, ' +
        '.fs-lyrics-module-container, #player-bar, footer, .full-screen-player-controls-container, ' +
        '.fs-full-screen-player-queue-module-controls-container, .fs-window-bar-module-window-bar, ' +
        '.fs-window-bar-module-macos-container'
      );
      if (interactive) return;

      // 7. Confirma que o clique ocorreu dentro da área de tela cheia ou fundo
      const isWithinFS = e.target.closest(
        '.fs-full-screen-player-module-container, #main-content, #bg-webgl-container, #bg-webgl-vignette, #root'
      );
      if (!isWithinFS) return;

      // 8. Executa a ação do botão Esc / Minimizar retraindo a tela
      console.log('[Personal OS] Espaço livre clicado — executando ação do Esc para retrair a barra...');
      const minBtn = document.querySelector('.fs-full-screen-player-module-container .full-screen-player-controls-container:not(.fs-full-screen-player-queue-module-controls-container) button');
      if (minBtn) {
        minBtn.click();
      } else {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Escape',
          code: 'Escape',
          keyCode: 27,
          which: 27,
          bubbles: true,
          cancelable: true
        }));
      }
    }, true);
  }

  // ==========================================================================
  // 11. PLAYER SPLIT QUEUE (50/50: CAPA DA TRACK + FILA DE REPRODUÇÃO)
  // Divide a tela da música permanentemente em 2: metade esquerda a capa,
  // metade direita a fila de reprodução integrada, eliminando o balão lateral.
  // ==========================================================================
  function initPlayerSplitQueue() {
    console.log('[Personal OS] Ativando Reprodutor com Tela Dividida (Capa + Fila)...');

    const enforceQueueActive = () => {
      const fsContainer = document.querySelector('.fs-full-screen-player-module-container');
      if (!fsContainer) return;

      // 1. Assegura persistência de activeTab: "queue"
      try {
        const rawFs = localStorage.getItem('store_full_screen_player');
        if (rawFs) {
          const parsedFs = JSON.parse(rawFs);
          if (parsedFs?.state && parsedFs.state.activeTab !== 'queue') {
            parsedFs.state.activeTab = 'queue';
            localStorage.setItem('store_full_screen_player', JSON.stringify(parsedFs));
          }
        }
      } catch (e) {}

      // 2. Se a fila estiver colapsada no DOM, dispara o clique no botão de fila
      const qg = fsContainer.querySelector('.fs-full-screen-player-queue-module-grid-container');
      if (qg && (qg.classList.contains('fs-full-screen-player-queue-module-grid-container-collapsed') || qg.children.length === 0)) {
        const queueControls = fsContainer.querySelector('.fs-full-screen-player-queue-module-controls-container');
        const btns = queueControls ? queueControls.querySelectorAll('button') : [];
        if (btns[0]) btns[0].click();
      }
    };

    // Observa entrada na tela da música
    const playerObserver = new MutationObserver(() => {
      enforceQueueActive();
    });
    playerObserver.observe(document.body, { childList: true, subtree: true });
    enforceQueueActive();

    // Redireciona clique no botão de fila da dock inferior para abrir a tela da música
    window.addEventListener('click', (e) => {
      const queueToggle = e.target.closest('.fs-playerbar-module-right-grid-item button');
      if (queueToggle && queueToggle.querySelector('rect[width="18"]')) {
        e.preventDefault();
        e.stopPropagation();
        const isFS = !!document.querySelector('.fs-full-screen-player-module-container');
        if (!isFS) {
          const cover = document.querySelector('.fs-left-controls-module-image') || document.querySelector('#player-bar img');
          cover?.click();
        }
        setTimeout(enforceQueueActive, 100);
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }
})();
