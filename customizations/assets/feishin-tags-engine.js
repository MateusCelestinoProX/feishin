// ==========================================================================
// FEISHIN TAGS SYSTEM & ENGINE
// Substitui completamente o sistema de gêneros por um sistema completo de Tags
// 1. Tag Editor (Criar, Editar, Remover, Definir Hero Image livremente)
// 2. Hero Boxes (Visualização 1 - Cards com Hero Image, nome e playlist ao clicar)
// 3. Abas com Botões no Topo (Visualização 2 - Switcher dinâmico de tags e faixas)
// 4. Menu de Contexto (Clique direito na faixa para atribuir/desatribuir tags)
// ==========================================================================

(function() {
  console.log('[Tags Engine] Inicializando Sistema de Tags no Feishin...');

  // 1. PRESET HERO IMAGES (Alta Resolução & Temas Visuais)
  const PRESET_HEROES = [
    { name: 'Aurora Cósmica', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop', icon: '🌌' },
    { name: 'Rock Arena', url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=1200&auto=format&fit=crop', icon: '🎸' },
    { name: 'Neon Cyberpunk', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop', icon: '🌆' },
    { name: 'Cozy Lo-Fi', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop', icon: '☕' },
    { name: 'Plasma Energy', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop', icon: '⚡' },
    { name: 'Jazz & Soul', url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop', icon: '🎷' },
    { name: 'Deep Ocean', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1200&auto=format&fit=crop', icon: '🌊' },
    { name: 'Retro Arcade', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop', icon: '🪩' }
  ];

  // 2. TAGS ENGINE STATE & LOCAL STORAGE
  const STORAGE_TAGS_KEY = 'feishin_tags_db_v2';
  const STORAGE_TRACKS_KEY = 'feishin_tag_tracks_v2';
  const STORAGE_VIEW_KEY = 'feishin_tags_view_mode';

  class TagsEngine {
    constructor() {
      this.tags = [];
      this.taggedTracks = {}; // tagId -> Array<SongObject>
      this.viewMode = localStorage.getItem(STORAGE_VIEW_KEY) || 'boxes'; // 'boxes' | 'tabs'
      this.activeTabId = null;
      this.openedBoxTagId = null;
      this.searchQuery = '';
      this.listeners = new Set();

      this.load();
      if (this.tags.length === 0) {
        this.seedDefaultTags();
      }
    }

    load() {
      try {
        const rawTags = localStorage.getItem(STORAGE_TAGS_KEY);
        if (rawTags) this.tags = JSON.parse(rawTags);
      } catch (e) {
        console.error('[Tags Engine] Erro ao carregar tags:', e);
        this.tags = [];
      }

      try {
        const rawTracks = localStorage.getItem(STORAGE_TRACKS_KEY);
        if (rawTracks) this.taggedTracks = JSON.parse(rawTracks);
      } catch (e) {
        console.error('[Tags Engine] Erro ao carregar faixas marcadas:', e);
        this.taggedTracks = {};
      }
    }

    save() {
      try {
        localStorage.setItem(STORAGE_TAGS_KEY, JSON.stringify(this.tags));
        localStorage.setItem(STORAGE_TRACKS_KEY, JSON.stringify(this.taggedTracks));
      } catch (e) {
        console.error('[Tags Engine] Erro ao salvar tags:', e);
      }
      this.notify();
    }

    subscribe(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    }

    notify() {
      for (const fn of this.listeners) {
        try { fn(); } catch (err) { console.error(err); }
      }
    }

    seedDefaultTags() {
      this.tags = [
        {
          id: 'tag_rock',
          name: 'Rock & Guitarras',
          heroImage: PRESET_HEROES[1].url,
          createdAt: Date.now() - 50000
        },
        {
          id: 'tag_lofi',
          name: 'Lo-Fi & Relax',
          heroImage: PRESET_HEROES[3].url,
          createdAt: Date.now() - 40000
        },
        {
          id: 'tag_synthwave',
          name: 'Synthwave & Cyber',
          heroImage: PRESET_HEROES[2].url,
          createdAt: Date.now() - 30000
        },
        {
          id: 'tag_vibes',
          name: 'Madrugada / Vibes',
          heroImage: PRESET_HEROES[0].url,
          createdAt: Date.now() - 20000
        },
        {
          id: 'tag_jazz',
          name: 'Jazz & Instrumental',
          heroImage: PRESET_HEROES[5].url,
          createdAt: Date.now() - 10000
        }
      ];
      this.save();
    }

    getTags() {
      return [...this.tags];
    }

    getTag(id) {
      return this.tags.find(t => t.id === id);
    }

    createTag(name, heroImage) {
      const cleanName = (name || '').trim();
      if (!cleanName) return null;
      const id = 'tag_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const tag = {
        id,
        name: cleanName,
        heroImage: heroImage || PRESET_HEROES[Math.floor(Math.random() * PRESET_HEROES.length)].url,
        createdAt: Date.now()
      };
      this.tags.push(tag);
      this.taggedTracks[id] = [];
      this.save();
      this.showToast(`Tag "${cleanName}" criada com sucesso!`);
      return tag;
    }

    updateTag(id, updates) {
      const tag = this.getTag(id);
      if (!tag) return false;
      if (updates.name && updates.name.trim()) tag.name = updates.name.trim();
      if (updates.heroImage) tag.heroImage = updates.heroImage.trim();
      this.save();
      this.showToast(`Tag "${tag.name}" atualizada!`);
      return true;
    }

    deleteTag(id) {
      const tag = this.getTag(id);
      const tagName = tag ? tag.name : 'Tag';
      this.tags = this.tags.filter(t => t.id !== id);
      delete this.taggedTracks[id];
      if (this.activeTabId === id) this.activeTabId = this.tags[0]?.id || null;
      if (this.openedBoxTagId === id) this.openedBoxTagId = null;
      this.save();
      this.showToast(`Tag "${tagName}" removida.`);
      return true;
    }

    getSongsForTag(tagId) {
      if (!tagId) return [];
      return this.taggedTracks[tagId] || [];
    }

    isSongInTag(songId, tagId) {
      if (!songId || !tagId || !this.taggedTracks[tagId]) return false;
      return this.taggedTracks[tagId].some(s => s.id === songId);
    }

    assignTrack(song, tagId) {
      if (!song || !tagId) return false;
      const tag = this.getTag(tagId);
      if (!tag) return false;
      if (!this.taggedTracks[tagId]) this.taggedTracks[tagId] = [];
      const list = this.taggedTracks[tagId];
      if (!list.some(s => s.id === song.id)) {
        // Clone song to ensure all playback metadata is preserved
        const cleanSong = {
          id: song.id,
          name: song.name || 'Faixa sem título',
          artistName: song.artistName || (song.artists?.[0]?.name) || 'Artista Desconhecido',
          album: song.album || 'Álbum',
          albumId: song.albumId || song.id,
          duration: song.duration || 0,
          imageId: song.imageId || song.id,
          imageUrl: song.imageUrl || null,
          thumbHash: song.thumbHash || null,
          _itemType: song._itemType || 'song',
          _serverId: song._serverId || (window.__FEISHIN_SERVER_STORE__?.getState()?.currentServer?.id) || ''
        };
        list.push(cleanSong);
        this.save();
        this.showToast(`Faixa "${cleanSong.name}" atribuída à tag "${tag.name}"!`);
        return true;
      }
      return false;
    }

    removeTrack(songId, tagId) {
      if (!songId || !tagId || !this.taggedTracks[tagId]) return false;
      const tag = this.getTag(tagId);
      this.taggedTracks[tagId] = this.taggedTracks[tagId].filter(s => s.id !== songId);
      this.save();
      this.showToast(`Faixa removida da tag "${tag?.name || 'Tag'}".`);
      return true;
    }

    toggleTracksTag(songs, tagId) {
      if (!songs || !songs.length || !tagId) return;
      const tag = this.getTag(tagId);
      if (!tag) return;
      const allIn = songs.every(s => this.isSongInTag(s.id, tagId));
      if (allIn) {
        songs.forEach(s => this.removeTrack(s.id, tagId));
        this.showToast(`${songs.length > 1 ? songs.length + ' faixas removidas' : 'Faixa removida'} da tag "${tag.name}".`);
      } else {
        songs.forEach(s => this.assignTrack(s, tagId));
        this.showToast(`${songs.length > 1 ? songs.length + ' faixas atribuídas' : 'Faixa atribuída'} à tag "${tag.name}"!`);
      }
    }

    promptCreateTagAndAssign(songs) {
      const name = window.prompt('Digite o nome da nova tag:');
      if (name && name.trim()) {
        const newTag = this.createTag(name.trim());
        if (newTag && songs && songs.length) {
          songs.forEach(s => this.assignTrack(s, newTag.id));
        }
      }
    }

    playTag(tagId, shuffle = false) {
      const songs = this.getSongsForTag(tagId);
      if (!songs || songs.length === 0) {
        this.showToast('Nenhuma música cadastrada nesta tag para tocar.', 'warning');
        return;
      }
      const playerStore = window.__FEISHIN_PLAYER_STORE__?.getState();
      if (!playerStore) {
        this.showToast('Reprodutor Feishin não disponível.', 'error');
        return;
      }
      try {
        const mode = shuffle ? 'shuffle' : 'now';
        playerStore.addToQueueByType(songs, mode);
        this.showToast(`Reproduzindo tag: ${this.getTag(tagId)?.name} (${songs.length} faixas)`);
      } catch (err) {
        console.error('[Tags Engine] Erro ao reproduzir tag:', err);
        this.showToast('Erro ao iniciar reprodução.', 'error');
      }
    }

    playSong(song) {
      const playerStore = window.__FEISHIN_PLAYER_STORE__?.getState();
      if (!playerStore) return;
      try {
        playerStore.addToQueueByType([song], 'now');
      } catch (err) {
        console.error('[Tags Engine] Erro ao tocar música:', err);
      }
    }

    showToast(message, type = 'success') {
      console.log(`[Tags Toast] [${type.toUpperCase()}] ${message}`);
      // Native Feishin toast if available
      if (window.__FEISHIN_NOTIFY__) {
        if (type === 'error') window.__FEISHIN_NOTIFY__.error({ message });
        else if (type === 'warning') window.__FEISHIN_NOTIFY__.info({ message });
        else window.__FEISHIN_NOTIFY__.success({ message });
        return;
      }
      // Floating glass banner fallback
      let toastEl = document.getElementById('fs-tags-floating-toast');
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.id = 'fs-tags-floating-toast';
        document.body.appendChild(toastEl);
      }
      toastEl.innerText = message;
      toastEl.className = 'fs-tags-toast-active ' + (type === 'error' ? 'toast-error' : '');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toastEl.className = '';
      }, 2600);
    }
  }

  const engine = new TagsEngine();
  window.__FEISHIN_TAGS_ENGINE__ = engine;

  // 3. REACT NATIVE SUBMENU COMPONENT FOR CONTEXT MENUS
  window.__FEISHIN_TAG_MENU_ITEM__ = function({ items, mt, p }) {
    if (!items || !items.length || !mt || !p) return null;
    const allTags = engine.getTags();

    return p.jsxs(mt.Submenu, {
      key: "feishin-tags-submenu-item",
      children: [
        p.jsx(mt.SubmenuTarget, {
          children: p.jsx(mt.Item, {
            leftIcon: "priceTag",
            rightIcon: "arrowRightS",
            children: "🏷️ Atribuir a Tag"
          })
        }),
        p.jsxs(mt.SubmenuContent, {
          children: [
            allTags.length === 0 ? p.jsx(mt.Item, {
              disabled: true,
              children: "Nenhuma tag criada ainda"
            }) : null,
            ...allTags.map(tag => {
              const isAllTagged = items.every(s => engine.isSongInTag(s.id, tag.id));
              return p.jsx(mt.Item, {
                key: tag.id,
                leftIcon: isAllTagged ? "check" : void 0,
                onSelect: () => {
                  engine.toggleTracksTag(items, tag.id);
                },
                children: tag.name
              });
            }),
            p.jsx(mt.Divider, {}),
            p.jsx(mt.Item, {
              leftIcon: "add",
              onSelect: () => {
                engine.promptCreateTagAndAssign(items);
              },
              children: "+ Criar nova tag..."
            })
          ]
        })
      ]
    });
  };

  // 4. DOM OBSERVER FOR RIGHT-CLICK CONTEXT MENU INJECTION
  // Garante que o item "Atribuir a Tag" apareça instantaneamente mesmo em menus virtuais
  function initContextMenuObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1) {
            const dropdown = node.matches?.('.mantine-Menu-dropdown') ? node : node.querySelector?.('.mantine-Menu-dropdown');
            if (dropdown && !dropdown.querySelector('.fs-tags-context-item')) {
              checkAndInjectTagsMenuItem(dropdown);
            }
          }
        }
      }
    });

    const start = () => {
      const target = document.body || document.documentElement;
      if (target) {
        observer.observe(target, { childList: true, subtree: true });
      }
    };

    if (document.body) {
      start();
    } else {
      document.addEventListener('DOMContentLoaded', start);
    }
  }

  function checkAndInjectTagsMenuItem(dropdown) {
    const items = Array.from(dropdown.querySelectorAll('.mantine-Menu-item, [role="menuitem"], button'));
    // Check if this is a track/song context menu
    const isSongMenu = items.some(it => {
      const text = it.innerText || '';
      return text.includes('playlist') || text.includes('Playlist') || text.includes('tocar') || text.includes('Tocar');
    });

    if (!isSongMenu || dropdown.querySelector('.fs-tags-context-item')) return;

    // Detect target song from current selection or hovering row
    const targetSong = getActiveTargetSong();
    if (!targetSong) return;

    const tagItemBtn = document.createElement('button');
    tagItemBtn.type = 'button';
    tagItemBtn.className = 'mantine-focus-never mantine-active fs-menu-item-module-item mantine-Menu-item fs-tags-context-item';
    tagItemBtn.setAttribute('role', 'menuitem');
    tagItemBtn.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>🏷️</span>
          <span>Atribuir a Tag</span>
        </div>
        <span style="font-size: 11px; opacity: 0.6;">▸</span>
      </div>
    `;

    // Submenu container
    const submenu = document.createElement('div');
    submenu.className = 'fs-tags-context-submenu';
    submenu.style.display = 'none';

    function renderSubmenuItems() {
      const allTags = engine.getTags();
      let html = `<div style="padding: 6px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.45); border-bottom: 1px solid rgba(255,255,255,0.08);">Escolher Tag</div>`;
      if (allTags.length === 0) {
        html += `<div style="padding: 10px; font-size: 13px; color: rgba(255,255,255,0.5);">Nenhuma tag criada</div>`;
      } else {
        allTags.forEach(t => {
          const isTagged = engine.isSongInTag(targetSong.id, t.id);
          html += `
            <div class="fs-tags-submenu-row" data-tag-id="${t.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; cursor: pointer; border-radius: 6px; font-size: 13px; margin: 2px 4px; transition: background 0.15s ease;">
              <span>${t.name}</span>
              <span style="font-weight: bold; color: #a78bfa;">${isTagged ? '✓' : ''}</span>
            </div>
          `;
        });
      }
      html += `
        <div style="border-top: 1px solid rgba(255,255,255,0.08); margin-top: 4px; padding-top: 4px;">
          <div id="fs-tags-submenu-create" style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; cursor: pointer; border-radius: 6px; font-size: 13px; margin: 2px 4px; color: #c4b5fd; font-weight: 600;">
            <span>+</span> <span>Nova Tag...</span>
          </div>
        </div>
      `;
      submenu.innerHTML = html;

      // Click handlers
      submenu.querySelectorAll('.fs-tags-submenu-row').forEach(row => {
        row.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const tId = row.getAttribute('data-tag-id');
          engine.toggleTracksTag([targetSong], tId);
          renderSubmenuItems();
        });
      });

      const createBtn = submenu.querySelector('#fs-tags-submenu-create');
      if (createBtn) {
        createBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          engine.promptCreateTagAndAssign([targetSong]);
          renderSubmenuItems();
        });
      }
    }

    tagItemBtn.addEventListener('mouseenter', () => {
      renderSubmenuItems();
      submenu.style.display = 'block';
      const rect = tagItemBtn.getBoundingClientRect();
      submenu.style.top = rect.top + 'px';
      submenu.style.left = (rect.right + 4) + 'px';
    });

    tagItemBtn.addEventListener('mouseleave', (e) => {
      setTimeout(() => {
        if (!submenu.matches(':hover') && !tagItemBtn.matches(':hover')) {
          submenu.style.display = 'none';
        }
      }, 150);
    });

    submenu.addEventListener('mouseleave', () => {
      submenu.style.display = 'none';
    });

    document.body.appendChild(submenu);

    // Insert tag button below playlist item or at top
    const playlistItem = items.find(it => (it.innerText || '').includes('playlist') || (it.innerText || '').includes('Playlist'));
    if (playlistItem && playlistItem.parentNode) {
      playlistItem.parentNode.insertBefore(tagItemBtn, playlistItem.nextSibling);
    } else if (dropdown.firstChild) {
      dropdown.insertBefore(tagItemBtn, dropdown.firstChild);
    }
  }

  let lastRightClickedElement = null;
  document.addEventListener('contextmenu', (e) => {
    lastRightClickedElement = e.target;
  }, true);

  function findSongFromReactFiber(el) {
    if (!el) return null;
    let curr = el;
    let depth = 0;
    while (curr && depth < 10) {
      const fiberKey = Object.keys(curr).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
      if (fiberKey) {
        let fiber = curr[fiberKey];
        let fDepth = 0;
        while (fiber && fDepth < 15) {
          const props = fiber.memoizedProps || fiber.pendingProps;
          if (props) {
            if (props.song && (props.song.id || props.song.name || props.song.title)) {
              return props.song;
            }
            if (props.item && (props.item.id || props.item.name || props.item.title)) {
              return props.item;
            }
            if (props.row?.original && (props.row.original.id || props.row.original.name)) {
              return props.row.original;
            }
            if (props.data?.items && typeof props.index === 'number') {
              const item = props.data.items[props.index];
              if (item) return item;
            }
          }
          fiber = fiber.return;
          fDepth++;
        }
      }
      curr = curr.parentElement;
      depth++;
    }
    return null;
  }

  function getActiveTargetSong() {
    // 1. Tenta obter o objeto real da música via React Fiber do elemento clicado
    if (lastRightClickedElement) {
      const fiberSong = findSongFromReactFiber(lastRightClickedElement);
      if (fiberSong) {
        return {
          id: String(fiberSong.id || fiberSong.songId || 'trk_' + (fiberSong.name || 'song')),
          name: fiberSong.name || fiberSong.title || 'Música',
          artistName: fiberSong.artistName || fiberSong.artist || 'Artista',
          album: fiberSong.album || fiberSong.albumName || 'Álbum',
          duration: fiberSong.duration || 0,
          imageUrl: fiberSong.imageUrl || fiberSong.coverArt || null
        };
      }
    }

    // 2. Procura linhas no DOM por hover ou seleção
    const selectedRows = document.querySelectorAll('.fs-virtualized-list-module-row, [role="row"], tr, .fs-table-row');
    let hoveredRow = null;
    if (lastRightClickedElement) {
      hoveredRow = lastRightClickedElement.closest('.fs-virtualized-list-module-row, [role="row"], tr, .fs-table-row');
    }
    if (!hoveredRow) {
      selectedRows.forEach(r => {
        if (r.matches(':hover') || r.classList.contains('fs-table-row-selected') || r.getAttribute('data-selected') === 'true') {
          hoveredRow = r;
        }
      });
    }

    if (hoveredRow) {
      const fiberSong = findSongFromReactFiber(hoveredRow);
      if (fiberSong) {
        return {
          id: String(fiberSong.id || fiberSong.songId || 'trk_' + (fiberSong.name || 'song')),
          name: fiberSong.name || fiberSong.title || 'Música',
          artistName: fiberSong.artistName || fiberSong.artist || 'Artista',
          album: fiberSong.album || fiberSong.albumName || 'Álbum',
          duration: fiberSong.duration || 0,
          imageUrl: fiberSong.imageUrl || fiberSong.coverArt || null
        };
      }

      const titleEl = hoveredRow.querySelector('.fs-song-title-column-module-song-title, .fs-title-column-module-title, a');
      const artistEl = hoveredRow.querySelector('.fs-song-artist-column-module-artist, .fs-artist-column-module-artist');
      const title = titleEl ? titleEl.innerText.trim() : 'Música';
      const artist = artistEl ? artistEl.innerText.trim() : 'Artista';
      return {
        id: 'track_' + encodeURIComponent(title + '_' + artist).replace(/%/g, ''),
        name: title,
        artistName: artist,
        album: 'Álbum',
        duration: 210
      };
    }

    // 3. Fallback to current song in player store
    const cur = window.__FEISHIN_PLAYER_STORE__?.getState()?.getCurrentSong?.();
    if (cur) return cur;

    return null;
  }

  // 5. TAGS PAGE VIEW RENDERER (Hero Boxes & Tag Editor + Tabs View)
  function initTagsPageRouter() {
    function checkRoute() {
      const hash = window.location.hash || '';
      const isTagsRoute = hash.startsWith('#/library/genres') || hash.startsWith('#/library/tags');
      const mainBody = document.querySelector('.fs-main-content-module-main-content-body') || document.querySelector('main');

      if (isTagsRoute) {
        ensureTagsPageMounted(mainBody);
      } else {
        const mountedEl = document.getElementById('fs-tags-page-mount');
        if (mountedEl) mountedEl.remove();
        if (mainBody) {
          Array.from(mainBody.children).forEach(ch => {
            if (ch.id !== 'fs-tags-page-mount' && ch.style.display === 'none') {
              ch.style.display = '';
            }
          });
        }
      }
    }

    window.addEventListener('hashchange', checkRoute);
    setInterval(checkRoute, 250);
    checkRoute();
  }

  function ensureTagsPageMounted(mainBody) {
    if (!mainBody) {
      mainBody = document.querySelector('.fs-main-content-module-main-content-body') || document.querySelector('main');
      if (!mainBody) return;
    }

    let mountEl = document.getElementById('fs-tags-page-mount');
    if (!mountEl || !mainBody.contains(mountEl)) {
      // Oculta corpo nativo de gêneros
      Array.from(mainBody.children).forEach(ch => {
        if (ch.id !== 'fs-tags-page-mount') ch.style.display = 'none';
      });

      if (!mountEl) {
        mountEl = document.createElement('div');
        mountEl.id = 'fs-tags-page-mount';
        mountEl.className = 'fs-tags-page-root';
      }
      mainBody.appendChild(mountEl);

      engine.subscribe(() => {
        const curMount = document.getElementById('fs-tags-page-mount');
        if (curMount) renderTagsPage(curMount);
      });
      renderTagsPage(mountEl);
    } else {
      mountEl.style.display = 'flex';
      Array.from(mainBody.children).forEach(ch => {
        if (ch.id !== 'fs-tags-page-mount' && ch.style.display !== 'none') {
          ch.style.display = 'none';
        }
      });
      if (!mountEl.hasChildNodes() || mountEl.innerHTML.trim() === '') {
        renderTagsPage(mountEl);
      }
    }
  }

  function renderTagsPage(container) {
    const allTags = engine.getTags();
    const viewMode = engine.viewMode; // 'boxes' | 'tabs'

    container.innerHTML = `
      <div class="fs-tags-container">
        <!-- TOP CONTROL BAR WITH VIEW TOGGLE -->
        <div class="fs-tags-top-bar">
          <div class="fs-tags-title-block">
            <h1 class="fs-tags-title">🏷️ Tags</h1>
            <span class="fs-tags-count-badge">${allTags.length} tags</span>
          </div>

          <!-- THE TOGGLE SWITCH -->
          <div class="fs-tags-toggle-switch">
            <button type="button" class="fs-tags-toggle-btn ${viewMode === 'boxes' ? 'active' : ''}" id="fs-toggle-boxes">
              <span>📦</span>
              <span>Hero Boxes & Editor</span>
            </button>
            <button type="button" class="fs-tags-toggle-btn ${viewMode === 'tabs' ? 'active' : ''}" id="fs-toggle-tabs">
              <span>📑</span>
              <span>Lista por Abas</span>
            </button>
          </div>
        </div>

        <!-- MAIN VIEW CONTAINER -->
        <div id="fs-tags-view-content" class="fs-tags-view-content"></div>
      </div>
    `;

    // Bind Toggle Buttons
    const toggleBoxes = container.querySelector('#fs-toggle-boxes');
    const toggleTabs = container.querySelector('#fs-toggle-tabs');

    toggleBoxes.addEventListener('click', () => {
      engine.viewMode = 'boxes';
      localStorage.setItem(STORAGE_VIEW_KEY, 'boxes');
      renderTagsPage(container);
    });

    toggleTabs.addEventListener('click', () => {
      engine.viewMode = 'tabs';
      localStorage.setItem(STORAGE_VIEW_KEY, 'tabs');
      if (!engine.activeTabId && allTags.length > 0) {
        engine.activeTabId = allTags[0].id;
      }
      renderTagsPage(container);
    });

    const contentContainer = container.querySelector('#fs-tags-view-content');
    if (viewMode === 'boxes') {
      renderView1_Boxes(contentContainer, allTags);
    } else {
      renderView2_Tabs(contentContainer, allTags);
    }
  }

  // ==========================================================================
  // VIEW 1: HERO BOXES & TAG EDITOR PANEL
  // ==========================================================================
  function renderView1_Boxes(container, allTags) {
    // If a box is currently opened/clicked, render its playlist!
    if (engine.openedBoxTagId) {
      renderTagPlaylistView(container, engine.openedBoxTagId);
      return;
    }

    container.innerHTML = `
      <!-- 1. TAG EDITOR PANEL -->
      <div class="fs-tag-editor-panel">
        <div class="fs-tag-editor-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">✨</span>
            <span style="font-size: 15px; font-weight: 700; color: #fff;">Painel do Tag Editor</span>
          </div>
          <span style="font-size: 12px; color: rgba(255,255,255,0.5);">Adicione, personalize imagens ou remova tags</span>
        </div>

        <!-- ADD TAG FORM -->
        <div class="fs-tag-editor-form">
          <div class="fs-tag-form-group">
            <label class="fs-tag-label">Nome da Tag</label>
            <input type="text" id="fs-new-tag-name" class="fs-tag-input" placeholder="Ex: Rock Clássico, Synthwave, Madrugada..." />
          </div>

          <div class="fs-tag-form-group">
            <label class="fs-tag-label">Hero Image (URL ou escolha um Preset abaixo)</label>
            <input type="text" id="fs-new-tag-image" class="fs-tag-input" placeholder="https://..." value="${PRESET_HEROES[0].url}" />
          </div>

          <button type="button" id="fs-btn-add-tag" class="fs-tag-btn-primary">
            <span>+</span> <span>Adicionar Tag</span>
          </button>
        </div>

        <!-- PRESET PALETTE -->
        <div class="fs-presets-palette-wrapper">
          <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 6px; display: block;">Hero Images Rápidas:</span>
          <div class="fs-presets-chips">
            ${PRESET_HEROES.map(p => `
              <button type="button" class="fs-preset-chip" data-url="${p.url}">
                <span>${p.icon}</span> <span>${p.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- EXISTING TAGS MANAGER -->
        <div class="fs-tags-manager-section">
          <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 8px; display: block;">Tags Cadastradas:</span>
          <div class="fs-tags-manager-list">
            ${allTags.map(tag => {
              const count = engine.getSongsForTag(tag.id).length;
              return `
                <div class="fs-tag-manager-pill">
                  <img src="${tag.heroImage}" class="fs-tag-mini-thumb" alt="" />
                  <span class="fs-tag-manager-name">${tag.name}</span>
                  <span class="fs-tag-manager-count">${count}</span>
                  <button type="button" class="fs-tag-mini-btn fs-tag-btn-edit" data-id="${tag.id}" title="Editar Nome / Imagem">✏️</button>
                  <button type="button" class="fs-tag-mini-btn fs-tag-btn-del" data-id="${tag.id}" title="Remover Tag">✕</button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- 2. HERO BOXES GRID -->
      <div class="fs-hero-boxes-header">
        <h2 style="font-size: 18px; font-weight: 700; color: #fff; margin: 0;">Boxes de Tags</h2>
        <span style="font-size: 12px; color: rgba(255,255,255,0.5);">Clique em qualquer box para abrir sua playlist completa</span>
      </div>

      <div class="fs-hero-boxes-grid">
        ${allTags.map(tag => {
          const songs = engine.getSongsForTag(tag.id);
          return `
            <div class="fs-hero-box" data-id="${tag.id}" style="background-image: url('${tag.heroImage}');">
              <div class="fs-hero-box-overlay"></div>
              
              <div class="fs-hero-box-top">
                <span class="fs-hero-box-tag-pill">🏷️ Tag</span>
                <span class="fs-hero-box-count-pill">${songs.length} faixas</span>
              </div>

              <div class="fs-hero-box-bottom">
                <h3 class="fs-hero-box-title">${tag.name}</h3>
                
                <div class="fs-hero-box-actions">
                  <button type="button" class="fs-hero-btn-play" data-play-id="${tag.id}" title="Tocar Todas as Faixas">
                    <span>▶ Tocar Tag</span>
                  </button>
                  <button type="button" class="fs-hero-btn-shuffle" data-shuffle-id="${tag.id}" title="Tocar em Modo Aleatório">
                    <span>🔀</span>
                  </button>
                </div>

                <div class="fs-hero-box-footer-hint">Clique para abrir a playlist →</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Bind Add Tag Form
    const nameInput = container.querySelector('#fs-new-tag-name');
    const imageInput = container.querySelector('#fs-new-tag-image');
    const addBtn = container.querySelector('#fs-btn-add-tag');

    container.querySelectorAll('.fs-preset-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        imageInput.value = btn.getAttribute('data-url');
      });
    });

    addBtn.addEventListener('click', () => {
      const name = nameInput.value;
      const img = imageInput.value;
      if (name && name.trim()) {
        engine.createTag(name, img);
        nameInput.value = '';
      }
    });

    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addBtn.click();
    });

    // Bind Edit & Delete Buttons
    container.querySelectorAll('.fs-tag-btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const tag = engine.getTag(id);
        if (!tag) return;
        const newName = window.prompt('Editar nome da tag:', tag.name);
        if (newName === null) return;
        const newImg = window.prompt('Editar URL da Hero Image:', tag.heroImage);
        engine.updateTag(id, { name: newName, heroImage: newImg || tag.heroImage });
      });
    });

    container.querySelectorAll('.fs-tag-btn-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const tag = engine.getTag(id);
        if (!tag) return;
        if (window.confirm(`Tem certeza que deseja remover a tag "${tag.name}"?`)) {
          engine.deleteTag(id);
        }
      });
    });

    // Bind Hero Boxes Click & Play Actions
    container.querySelectorAll('.fs-hero-box').forEach(box => {
      const tagId = box.getAttribute('data-id');

      box.querySelector('.fs-hero-btn-play')?.addEventListener('click', (e) => {
        e.stopPropagation();
        engine.playTag(tagId, false);
      });

      box.querySelector('.fs-hero-btn-shuffle')?.addEventListener('click', (e) => {
        e.stopPropagation();
        engine.playTag(tagId, true);
      });

      box.addEventListener('click', () => {
        engine.openedBoxTagId = tagId;
        renderTagPlaylistView(container, tagId);
      });
    });
  }

  // ==========================================================================
  // PLAYLIST VIEW (Inside a clicked Box)
  // ==========================================================================
  function renderTagPlaylistView(container, tagId) {
    const tag = engine.getTag(tagId);
    if (!tag) {
      engine.openedBoxTagId = null;
      renderView1_Boxes(container, engine.getTags());
      return;
    }

    const songs = engine.getSongsForTag(tagId);

    container.innerHTML = `
      <div class="fs-tag-playlist-view">
        <!-- HERO BANNER -->
        <div class="fs-tag-hero-banner" style="background-image: url('${tag.heroImage}');">
          <div class="fs-tag-hero-banner-overlay"></div>
          
          <button type="button" id="fs-btn-back-to-boxes" class="fs-tag-btn-back">
            <span>← Voltar para Todas as Tags</span>
          </button>

          <div class="fs-tag-hero-banner-content">
            <span class="fs-tag-badge-pill">PLAYLIST DA TAG</span>
            <h1 class="fs-tag-banner-title">${tag.name}</h1>
            <div class="fs-tag-banner-meta">
              <span>✨ ${songs.length} músicas atribuídas</span>
              <span>•</span>
              <span>Hero Box Personalizada</span>
            </div>

            <div class="fs-tag-banner-actions">
              <button type="button" id="fs-banner-btn-play" class="fs-tag-btn-primary" ${songs.length === 0 ? 'disabled' : ''}>
                <span>▶ Tocar Tudo</span>
              </button>
              <button type="button" id="fs-banner-btn-shuffle" class="fs-tag-btn-secondary" ${songs.length === 0 ? 'disabled' : ''}>
                <span>🔀 Aleatório</span>
              </button>
            </div>
          </div>
        </div>

        <!-- TRACKLIST TABLE -->
        <div class="fs-tag-playlist-body">
          ${renderTracklistHtml(songs, tagId)}
        </div>
      </div>
    `;

    // Bind Back Button
    container.querySelector('#fs-btn-back-to-boxes')?.addEventListener('click', () => {
      engine.openedBoxTagId = null;
      renderView1_Boxes(container, engine.getTags());
    });

    // Bind Banner Play
    container.querySelector('#fs-banner-btn-play')?.addEventListener('click', () => {
      engine.playTag(tagId, false);
    });

    container.querySelector('#fs-banner-btn-shuffle')?.addEventListener('click', () => {
      engine.playTag(tagId, true);
    });

    bindTracklistEvents(container, tagId);
  }

  // ==========================================================================
  // VIEW 2: ABAS COM BOTÕES NO TOPO + LISTA DE MÚSICAS
  // ==========================================================================
  function renderView2_Tabs(container, allTags) {
    if (allTags.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.5);">
          <h3>Nenhuma tag criada ainda</h3>
          <p>Mude para a visualização "Hero Boxes & Editor" para cadastrar suas primeiras tags!</p>
        </div>
      `;
      return;
    }

    if (!engine.activeTabId || !allTags.some(t => t.id === engine.activeTabId)) {
      engine.activeTabId = allTags[0].id;
    }

    const activeTag = engine.getTag(engine.activeTabId) || allTags[0];
    const songs = engine.getSongsForTag(activeTag.id);

    container.innerHTML = `
      <div class="fs-tabs-view-container">
        <!-- HORIZONTAL SCROLLING TAG PILLS -->
        <div class="fs-tabs-buttons-bar">
          ${allTags.map(t => {
            const isActive = t.id === activeTag.id;
            const count = engine.getSongsForTag(t.id).length;
            return `
              <button type="button" class="fs-tag-pill-btn ${isActive ? 'active' : ''}" data-tag-id="${t.id}">
                <img src="${t.heroImage}" class="fs-tag-pill-thumb" alt="" />
                <span class="fs-tag-pill-name">${t.name}</span>
                <span class="fs-tag-pill-count">${count}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- ACTIVE TAG ACTION BAR -->
        <div class="fs-active-tag-action-bar">
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="${activeTag.heroImage}" class="fs-active-tag-large-thumb" alt="" />
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h2 style="font-size: 20px; font-weight: 700; color: #fff; margin: 0;">${activeTag.name}</h2>
                <span style="font-size: 11px; padding: 2px 8px; border-radius: 99px; background: rgba(167, 139, 250, 0.2); color: #c4b5fd; font-weight: 600;">${songs.length} faixas</span>
              </div>
              <span style="font-size: 12px; color: rgba(255,255,255,0.5);">Lista dinâmica atribuída a esta tag</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="text" id="fs-tabs-search-input" class="fs-tag-search-input" placeholder="Filtrar músicas nesta tag..." value="${engine.searchQuery || ''}" />
            
            <button type="button" id="fs-tabs-btn-play" class="fs-tag-btn-primary" ${songs.length === 0 ? 'disabled' : ''}>
              <span>▶ Tocar</span>
            </button>
            <button type="button" id="fs-tabs-btn-shuffle" class="fs-tag-btn-secondary" ${songs.length === 0 ? 'disabled' : ''}>
              <span>🔀</span>
            </button>
          </div>
        </div>

        <!-- TRACKLIST TABLE FOR ACTIVE TAB -->
        <div class="fs-tabs-tracklist-wrapper">
          ${renderTracklistHtml(filterSongs(songs, engine.searchQuery), activeTag.id)}
        </div>
      </div>
    `;

    // Bind Tag Pill Switches
    container.querySelectorAll('.fs-tag-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        engine.activeTabId = btn.getAttribute('data-tag-id');
        engine.searchQuery = '';
        renderView2_Tabs(container, allTags);
      });
    });

    // Bind Search Input
    const searchInput = container.querySelector('#fs-tabs-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        engine.searchQuery = e.target.value;
        const filtered = filterSongs(songs, engine.searchQuery);
        const wrapper = container.querySelector('.fs-tabs-tracklist-wrapper');
        if (wrapper) {
          wrapper.innerHTML = renderTracklistHtml(filtered, activeTag.id);
          bindTracklistEvents(container, activeTag.id);
        }
      });
    }

    // Bind Play & Shuffle
    container.querySelector('#fs-tabs-btn-play')?.addEventListener('click', () => {
      engine.playTag(activeTag.id, false);
    });

    container.querySelector('#fs-tabs-btn-shuffle')?.addEventListener('click', () => {
      engine.playTag(activeTag.id, true);
    });

    bindTracklistEvents(container, activeTag.id);
  }

  // ==========================================================================
  // SHARED TRACKLIST TABLE RENDERER & EVENT BINDER
  // ==========================================================================
  function filterSongs(songs, query) {
    if (!query || !query.trim()) return songs;
    const q = query.toLowerCase();
    return songs.filter(s => (s.name || '').toLowerCase().includes(q) || (s.artistName || '').toLowerCase().includes(q) || (s.album || '').toLowerCase().includes(q));
  }

  function renderTracklistHtml(songs, tagId) {
    if (!songs || songs.length === 0) {
      return `
        <div class="fs-tag-empty-state">
          <div style="font-size: 36px; margin-bottom: 10px;">🎵</div>
          <h3 style="color: #fff; font-size: 16px; margin-bottom: 6px;">Nenhuma música atribuída a esta tag</h3>
          <p style="color: rgba(255,255,255,0.5); font-size: 13px; max-width: 420px; margin: 0 auto 16px;">
            Clique com o <strong>botão direito</strong> em qualquer faixa na sua biblioteca e escolha 
            <span style="color: #c4b5fd; font-weight: 600;">"🏷️ Atribuir a Tag"</span> para organizá-la aqui!
          </p>
        </div>
      `;
    }

    return `
      <table class="fs-tag-track-table">
        <thead>
          <tr>
            <th style="width: 45px; text-align: center;">#</th>
            <th style="width: 48px;"></th>
            <th>TÍTULO</th>
            <th>ARTISTA</th>
            <th>ÁLBUM</th>
            <th style="width: 80px; text-align: right;">DURAÇÃO</th>
            <th style="width: 70px; text-align: center;">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          ${songs.map((song, idx) => {
            const dur = formatDuration(song.duration);
            return `
              <tr class="fs-tag-track-row" data-song-id="${song.id}">
                <td style="text-align: center; color: rgba(255,255,255,0.4);" class="fs-col-idx">
                  <span class="fs-idx-num">${idx + 1}</span>
                  <button type="button" class="fs-row-play-btn" data-play-song="${song.id}" title="Tocar">▶</button>
                </td>
                <td>
                  <div class="fs-track-thumb-container">
                    <span>🎵</span>
                  </div>
                </td>
                <td class="fs-track-col-title">
                  <div style="font-weight: 600; color: #fff;">${song.name || 'Faixa sem título'}</div>
                </td>
                <td style="color: rgba(255,255,255,0.7);">${song.artistName || '—'}</td>
                <td style="color: rgba(255,255,255,0.5);">${song.album || '—'}</td>
                <td style="text-align: right; color: rgba(255,255,255,0.4); font-variant-numeric: tabular-nums;">${dur}</td>
                <td style="text-align: center;">
                  <button type="button" class="fs-btn-remove-from-tag" data-untag="${song.id}" data-tag="${tagId}" title="Remover desta tag">✕</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  function bindTracklistEvents(container, tagId) {
    const songs = engine.getSongsForTag(tagId);

    // Double-click row to play
    container.querySelectorAll('.fs-tag-track-row').forEach(row => {
      const sId = row.getAttribute('data-song-id');
      const song = songs.find(s => s.id === sId);
      if (!song) return;

      row.addEventListener('dblclick', () => {
        engine.playSong(song);
      });

      row.querySelector('.fs-row-play-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        engine.playSong(song);
      });

      row.querySelector('.fs-btn-remove-from-tag')?.addEventListener('click', (e) => {
        e.stopPropagation();
        engine.removeTrack(sId, tagId);
      });
    });
  }

  function formatDuration(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    if (sec > 10000) sec = Math.round(sec / 1000); // ms to sec
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // 6. INITIALIZATION
  function startTagsEngine() {
    try {
      initContextMenuObserver();
    } catch (e) {
      console.error('[Tags Engine] Erro ao iniciar context menu observer:', e);
    }
    try {
      initTagsPageRouter();
    } catch (e) {
      console.error('[Tags Engine] Erro ao iniciar router de tags:', e);
    }
    console.log('[Tags Engine] Sistema de Tags carregado e ativo.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTagsEngine);
  } else {
    startTagsEngine();
  }
})();
