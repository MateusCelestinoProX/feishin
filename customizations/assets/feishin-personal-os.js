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

  window.applyPersonalOsShader = applyShader;
  window.PERSONAL_OS_SHADERS = SHADER_CATALOG;

  // 5. Rotative Cycle
  function startRotative() {
    stopRotative();
    if (!isRotative || isEcoMode) return;
    rotativeTimer = setInterval(() => {
      currentRotativeIdx = (currentRotativeIdx + 1) % FLAT_SHADERS.length;
      const nextShader = FLAT_SHADERS[currentRotativeIdx].id;
      applyShader(nextShader);
    }, rotativeSeconds * 1000);
  }

  function stopRotative() {
    if (rotativeTimer) {
      clearInterval(rotativeTimer);
      rotativeTimer = null;
    }
  }

  // 6. Quick Shader Pill & Modal UI
  function updatePillLabel(text) {
    const label = document.getElementById('personal-os-pill-label');
    if (label) label.textContent = text;
  }

  function mountShaderSwitcherUI() {
    if (document.getElementById('personal-os-shader-pill')) return;

    // Header Pill
    const pill = document.createElement('div');
    pill.id = 'personal-os-shader-pill';
    pill.title = 'Personal OS WebGL Shaders & Liquid Glass';
    pill.innerHTML = `
      <div class="shader-glow-dot"></div>
      <span id="personal-os-pill-label">🔮 Plasma Wave</span>
      <span class="badge-bg-num">${FLAT_SHADERS.length} fundos</span>
      <span style="font-size: 8px; opacity: 0.6; margin-left: 2px;">▾</span>
    `;

    // Try finding the window bar or top bar
    const windowBar = document.querySelector('.fs-window-bar-module-window-bar') || 
                      document.querySelector('.fs-window-bar-module-macos-container');

    if (windowBar) {
      pill.style.position = 'relative';
      pill.style.margin = '0 10px';
      windowBar.appendChild(pill);
    } else {
      // Fixed floating in top bar
      pill.style.position = 'fixed';
      pill.style.top = '7px';
      pill.style.right = '70px';
      pill.style.zIndex = '99999';
      document.body.appendChild(pill);
    }

    // Modal / Popover
    const modal = document.createElement('div');
    modal.id = 'personal-os-shader-modal';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="shader-modal-header">
        <h3><span>🔮</span> Shaders Personal OS</h3>
        <button class="shader-modal-close" id="shader-modal-close-btn">✕</button>
      </div>
      <div class="shader-modal-controls">
        <button class="shader-ctrl-btn ${isRotative ? 'active' : ''}" id="shader-rotative-toggle">
          <span>🔄</span> Rotativo: ${isRotative ? 'Ativo' : 'Fixo'}
        </button>
        <button class="shader-ctrl-btn ${isEcoMode ? 'active' : ''}" id="shader-eco-toggle">
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
          e.stopPropagation();
          isEcoMode = false;
          localStorage.setItem('feishin_shader_eco', 'false');
          applyShader(sh.id);
          setTimeout(() => {
            modal.style.display = 'none';
          }, 350);
        };
        listContainer.appendChild(card);
      });
    });

    // Toggle Modal on Pill Click
    pill.onclick = (e) => {
      e.stopPropagation();
      modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
      if (modal.style.display === 'flex') updateModalUI();
    };

    // Close Modal Button
    modal.querySelector('#shader-modal-close-btn').onclick = (e) => {
      e.stopPropagation();
      modal.style.display = 'none';
    };

    // Rotative Mode Toggle
    modal.querySelector('#shader-rotative-toggle').onclick = function(e) {
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

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!modal.contains(e.target) && !pill.contains(e.target)) {
        modal.style.display = 'none';
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }
})();
