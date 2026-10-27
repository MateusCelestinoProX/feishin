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
      if (this.openedBoxTagId === id) {
        this.openedBoxTagId = null;
        if (window.location.hash.includes('tag=')) {
          window.location.hash = '#/library/genres';
        }
      }
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
      openTagEditorModal(null, songs);
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

  function getTagParamFromHash() {
    const hash = window.location.hash || '';
    const qIdx = hash.indexOf('?');
    if (qIdx === -1) return null;
    const params = new URLSearchParams(hash.substring(qIdx + 1));
    return params.get('tag');
  }

  // 5. TAGS PAGE VIEW RENDERER (Hero Boxes & Tag Editor + Tabs View)
  function initTagsPageRouter() {
    function checkRoute() {
      const hash = window.location.hash || '';
      const isTagsRoute = hash.startsWith('#/library/genres') || hash.startsWith('#/library/tags');
      const mainBody = document.querySelector('.fs-main-content-module-main-content-body') || document.querySelector('main');

      if (isTagsRoute) {
        const tagParam = getTagParamFromHash();
        const tagChanged = engine.openedBoxTagId !== tagParam;
        if (tagChanged) {
          engine.openedBoxTagId = tagParam;
        }
        ensureTagsPageMounted(mainBody, tagChanged);
      } else {
        engine.openedBoxTagId = null;
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
    window.addEventListener('popstate', checkRoute);
    setInterval(checkRoute, 250);
    checkRoute();
  }

  function ensureTagsPageMounted(mainBody, shouldReRender = false) {
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
      if (shouldReRender || !mountEl.hasChildNodes() || mountEl.innerHTML.trim() === '') {
        renderTagsPage(mountEl);
      }
    }
  }

  // ==========================================================================
  // HELPERS: ESCAPE, IMAGE PROCESSOR & MODAL ENGINE
  // ==========================================================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function isDataUrl(url) {
    return typeof url === 'string' && url.startsWith('data:');
  }

  function safeCssUrl(url) {
    if (!url) return '';
    const clean = String(url).replace(/'/g, "\\'");
    return `url('${clean}')`;
  }

  function closeTagModals() {
    const existing = document.getElementById('fs-tag-modal-container');
    if (existing) existing.remove();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTagModals();
    }
  });

  // UPLOAD UNIVERSAL DE IMAGEM (QUALQUER FORMATO)
  // Suporta PNG, JPG, WEBP, GIF, SVG, AVIF, BMP, ICO.
  // Preserva SVGs vetoriais e GIFs animados. Redimensiona imagens raster grandes via Canvas.
  function processImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('Nenhum arquivo fornecido'));

      const isSvg = file.type === 'image/svg+xml' || (file.name && file.name.toLowerCase().endsWith('.svg'));
      const isGif = file.type === 'image/gif' || (file.name && file.name.toLowerCase().endsWith('.gif'));

      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem'));
      reader.onload = (e) => {
        const dataUrl = e.target.result;

        // Manter integridade pura de SVG vetorial e GIF animado
        // Arquivos leves (< 250KB) também não necessitam de recompressão
        if (isSvg || isGif || file.size < 250 * 1024) {
          return resolve(dataUrl);
        }

        // Para fotos e imagens de alta resolução (PNG/JPG/WEBP/AVIF/BMP):
        // Redimensionar para no máximo 1280px para garantir nitidez retina sem estourar localStorage
        const img = new Image();
        img.onerror = () => resolve(dataUrl);
        img.onload = () => {
          try {
            const maxDim = 1280;
            let width = img.width;
            let height = img.height;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            let optimizedUrl = canvas.toDataURL('image/webp', 0.88);
            if (!optimizedUrl || optimizedUrl.length < 50) {
              optimizedUrl = canvas.toDataURL('image/jpeg', 0.88);
            }
            resolve(optimizedUrl || dataUrl);
          } catch (err) {
            resolve(dataUrl);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  }

  // MODAL CONFIRMAÇÃO DE EXCLUSÃO (MINIMALISTA)
  function openDeleteConfirmModal(tagId) {
    closeTagModals();
    const tag = engine.getTag(tagId);
    if (!tag) return;

    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'fs-tag-modal-container';
    modalBackdrop.className = 'fs-tag-modal-backdrop';

    modalBackdrop.innerHTML = `
      <div class="fs-tag-modal-dialog fs-delete-dialog" role="dialog" aria-modal="true">
        <div class="fs-delete-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </div>
        <h3 class="fs-delete-title">Excluir Tag</h3>
        <p class="fs-delete-msg">
          Deseja realmente apagar a tag <strong>"${escapeHtml(tag.name)}"</strong>?<br>
          As músicas permanecerão intactas na sua biblioteca.
        </p>
        <div class="fs-delete-actions">
          <button type="button" class="fs-modal-btn-cancel" id="fs-delete-cancel">Cancelar</button>
          <button type="button" class="fs-btn-confirm-delete" id="fs-delete-confirm">Sim, Excluir</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    modalBackdrop.querySelector('#fs-delete-cancel')?.addEventListener('click', closeTagModals);
    modalBackdrop.querySelector('#fs-delete-confirm')?.addEventListener('click', () => {
      engine.deleteTag(tagId);
      closeTagModals();
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeTagModals();
    });
  }

  // MODAL ELEGANTE DO TAG EDITOR (CRIAR / EDITAR)
  function openTagEditorModal(tagId = null, initialSongs = null) {
    closeTagModals();

    const isEdit = Boolean(tagId);
    const tag = isEdit ? engine.getTag(tagId) : null;
    if (isEdit && !tag) return;

    let currentName = tag ? tag.name : '';
    let currentImage = tag ? tag.heroImage : PRESET_HEROES[Math.floor(Math.random() * PRESET_HEROES.length)].url;

    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'fs-tag-modal-container';
    modalBackdrop.className = 'fs-tag-modal-backdrop';

    modalBackdrop.innerHTML = `
      <div class="fs-tag-modal-dialog" role="dialog" aria-modal="true">
        <!-- Header -->
        <div class="fs-tag-modal-header">
          <div class="fs-tag-modal-title-group">
            <div class="fs-tag-modal-icon-badge">
              <span>${isEdit ? '✏️' : '✨'}</span>
            </div>
            <div>
              <h2 class="fs-tag-modal-title">${isEdit ? 'Editar Tag' : 'Criar Nova Tag'}</h2>
              <span style="font-size: 11.5px; color: rgba(255,255,255,0.45);">Personalize o nome e a Hero Image da sua tag</span>
            </div>
          </div>
          <button type="button" class="fs-tag-modal-close-btn" id="fs-modal-close" title="Fechar (Esc)">✕</button>
        </div>

        <!-- Body -->
        <div class="fs-tag-modal-body">
          <!-- Left: Real-time Live Preview -->
          <div class="fs-tag-modal-preview-col">
            <span class="fs-tag-modal-label">PRÉVIA EM TEMPO REAL</span>
            <div class="fs-hero-box fs-modal-preview-card" id="fs-modal-preview-box" style="background-image: ${safeCssUrl(currentImage)};">
              <div class="fs-hero-box-overlay"></div>
              <div class="fs-hero-box-top">
                <span class="fs-hero-box-tag-pill">🏷️ Tag</span>
                <span class="fs-hero-box-count-pill">${isEdit ? engine.getSongsForTag(tag.id).length : (initialSongs ? initialSongs.length : 0)} faixas</span>
              </div>
              <div class="fs-hero-box-bottom">
                <h3 class="fs-hero-box-title" id="fs-modal-preview-title">${escapeHtml(currentName) || 'Nome da Tag'}</h3>
                <div class="fs-hero-box-actions" style="opacity: 0.85; pointer-events: none;">
                  <div class="fs-hero-btn-play"><span>▶ Tocar Tag</span></div>
                </div>
              </div>
            </div>
            <span class="fs-tag-preview-hint">Esta imagem é exibida no card da biblioteca e no banner superior da playlist.</span>
          </div>

          <!-- Right: Controls -->
          <div class="fs-tag-modal-form-col">
            <!-- Tag Name Input -->
            <div class="fs-modal-field-group">
              <label class="fs-tag-modal-label" for="fs-modal-input-name">NOME DA TAG *</label>
              <input type="text" id="fs-modal-input-name" class="fs-modal-text-input" placeholder="Ex: Synthwave, Madrugada, Jazz & Soul..." value="${escapeHtml(currentName)}" autocomplete="off" />
            </div>

            <!-- Image Upload Dropzone -->
            <div class="fs-modal-field-group">
              <label class="fs-tag-modal-label">HERO IMAGE (UPLOAD DE QUALQUER FORMATO)</label>
              
              <div class="fs-tag-upload-dropzone" id="fs-tag-dropzone">
                <input type="file" id="fs-tag-file-input" accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.svg,.avif,.bmp,.ico" style="display: none;" />
                <div class="fs-dropzone-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div class="fs-dropzone-text" id="fs-dropzone-label">
                  <strong>Clique para selecionar</strong> ou arraste qualquer imagem aqui
                </div>
                <div class="fs-dropzone-subtext" id="fs-dropzone-sublabel">
                  Suporta PNG, JPG, WEBP, GIF, SVG, AVIF (otimização e retina sharp)
                </div>
              </div>

              <!-- Secondary Option: URL / Presets -->
              <div class="fs-modal-secondary-options">
                <details class="fs-modal-details" id="fs-modal-details-presets">
                  <summary class="fs-modal-details-summary">Ou use uma URL de imagem / Presets rápidos</summary>
                  <div class="fs-modal-details-content">
                    <input type="text" id="fs-modal-input-url" class="fs-modal-text-input" placeholder="Cole uma URL (https://...)" value="${isDataUrl(currentImage) ? '' : escapeHtml(currentImage)}" />
                    <div class="fs-presets-chips-compact">
                      ${PRESET_HEROES.map(p => `
                        <button type="button" class="fs-preset-chip-compact" data-url="${p.url}">
                          <span>${p.icon}</span> <span>${p.name}</span>
                        </button>
                      `).join('')}
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="fs-tag-modal-footer">
          <div>
            ${isEdit ? `
              <button type="button" class="fs-modal-btn-delete" id="fs-modal-delete-btn" title="Excluir esta tag permanentemente">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                <span>Excluir Tag</span>
              </button>
            ` : ''}
          </div>
          <div class="fs-modal-footer-right">
            <button type="button" class="fs-modal-btn-cancel" id="fs-modal-cancel-btn">Cancelar</button>
            <button type="button" class="fs-modal-btn-save" id="fs-modal-save-btn">
              <span>${isEdit ? 'Salvar Alterações' : 'Criar Tag'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    // Elements
    const nameInput = modalBackdrop.querySelector('#fs-modal-input-name');
    const urlInput = modalBackdrop.querySelector('#fs-modal-input-url');
    const previewBox = modalBackdrop.querySelector('#fs-modal-preview-box');
    const previewTitle = modalBackdrop.querySelector('#fs-modal-preview-title');
    const dropzone = modalBackdrop.querySelector('#fs-tag-dropzone');
    const fileInput = modalBackdrop.querySelector('#fs-tag-file-input');
    const dropzoneLabel = modalBackdrop.querySelector('#fs-dropzone-label');
    const dropzoneSublabel = modalBackdrop.querySelector('#fs-dropzone-sublabel');
    const closeBtn = modalBackdrop.querySelector('#fs-modal-close');
    const cancelBtn = modalBackdrop.querySelector('#fs-modal-cancel-btn');
    const saveBtn = modalBackdrop.querySelector('#fs-modal-save-btn');
    const deleteBtn = modalBackdrop.querySelector('#fs-modal-delete-btn');

    // Autofocus name input
    setTimeout(() => nameInput?.focus(), 60);

    // Live update title
    nameInput?.addEventListener('input', () => {
      currentName = nameInput.value;
      previewTitle.textContent = currentName.trim() || 'Nome da Tag';
    });

    // Helper to update active image
    function updateActiveImage(imgSrc, sourceLabel = null) {
      currentImage = imgSrc;
      previewBox.style.backgroundImage = `url('${imgSrc}')`;
      if (sourceLabel) {
        dropzoneLabel.innerHTML = `<strong>${escapeHtml(sourceLabel)}</strong> pronta!`;
        dropzoneSublabel.innerHTML = `<span class="fs-dropzone-loaded-badge">✓ Imagem carregada</span> Clique para trocar`;
      }
    }

    // Dropzone Click
    dropzone?.addEventListener('click', (e) => {
      if (e.target !== fileInput) {
        fileInput.click();
      }
    });

    // Handle File
    async function handleFile(file) {
      if (!file) return;
      try {
        dropzoneLabel.innerHTML = '<strong>Carregando imagem...</strong>';
        dropzoneSublabel.textContent = 'Processando e otimizando formato...';
        const dataUrl = await processImageFile(file);
        updateActiveImage(dataUrl, file.name);
      } catch (err) {
        console.error('[Tags Engine] Erro no upload da imagem:', err);
        engine.showToast('Erro ao processar imagem selecionada.', 'error');
        dropzoneLabel.innerHTML = '<strong>Clique para selecionar</strong> ou arraste qualquer imagem';
        dropzoneSublabel.textContent = 'Suporta PNG, JPG, WEBP, GIF, SVG, AVIF';
      }
    }

    fileInput?.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        handleFile(fileInput.files[0]);
      }
    });

    // Drag and Drop
    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });

    dropzone?.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });

    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    // URL input
    urlInput?.addEventListener('input', () => {
      const val = urlInput.value.trim();
      if (val) {
        updateActiveImage(val);
      }
    });

    // Preset Chips
    modalBackdrop.querySelectorAll('.fs-preset-chip-compact').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.getAttribute('data-url');
        if (url) {
          if (urlInput) urlInput.value = url;
          updateActiveImage(url, btn.textContent.trim());
        }
      });
    });

    // Save Action
    function submitModal() {
      const finalName = (nameInput?.value || '').trim();
      if (!finalName) {
        engine.showToast('Por favor, informe o nome da tag.', 'warning');
        nameInput?.focus();
        return;
      }

      if (isEdit) {
        engine.updateTag(tag.id, {
          name: finalName,
          heroImage: currentImage
        });
      } else {
        const newTag = engine.createTag(finalName, currentImage);
        if (newTag && initialSongs && initialSongs.length) {
          initialSongs.forEach(s => engine.assignTrack(s, newTag.id));
        }
      }

      closeTagModals();
    }

    saveBtn?.addEventListener('click', submitModal);

    nameInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitModal();
      }
    });

    // Delete Action
    deleteBtn?.addEventListener('click', () => {
      closeTagModals();
      openDeleteConfirmModal(tag.id);
    });

    // Close actions
    closeBtn?.addEventListener('click', closeTagModals);
    cancelBtn?.addEventListener('click', closeTagModals);

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeTagModals();
      }
    });
  }

  // ==========================================================================
  // RENDER MAIN TAGS PAGE
  // ==========================================================================
  function renderTagsPage(container) {
    const allTags = engine.getTags();
    const viewMode = engine.viewMode; // 'boxes' | 'tabs'

    container.innerHTML = `
      <div class="fs-tags-container">
        <!-- TOP CONTROL BAR WITH VIEW TOGGLE & ACTIONS -->
        <div class="fs-tags-top-bar">
          <div class="fs-tags-title-block">
            <h1 class="fs-tags-title">🏷️ Tags</h1>
            <span class="fs-tags-count-badge">${allTags.length} tags</span>
          </div>

          <div class="fs-tags-top-bar-actions">
            <button type="button" class="fs-btn-new-tag-primary" id="fs-btn-top-new-tag" title="Criar Nova Tag com Hero Image">
              <span style="font-size: 15px; font-weight: 800;">+</span>
              <span>Nova Tag</span>
            </button>

            <!-- THE TOGGLE SWITCH -->
            <div class="fs-tags-toggle-switch">
              <button type="button" class="fs-tags-toggle-btn ${viewMode === 'boxes' ? 'active' : ''}" id="fs-toggle-boxes">
                <span>📦</span>
                <span>Hero Boxes</span>
              </button>
              <button type="button" class="fs-tags-toggle-btn ${viewMode === 'tabs' ? 'active' : ''}" id="fs-toggle-tabs">
                <span>📑</span>
                <span>Lista por Abas</span>
              </button>
            </div>
          </div>
        </div>

        <!-- MAIN VIEW CONTAINER -->
        <div id="fs-tags-view-content" class="fs-tags-view-content"></div>
      </div>
    `;

    // Bind Top New Tag Button
    container.querySelector('#fs-btn-top-new-tag')?.addEventListener('click', () => {
      openTagEditorModal();
    });

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
  // VIEW 1: HERO BOXES (MINIMALISTA COM AÇÕES DIRETAS)
  // ==========================================================================
  function renderView1_Boxes(container, allTags) {
    // If a box is currently opened/clicked, render its playlist!
    if (engine.openedBoxTagId) {
      renderTagPlaylistView(container, engine.openedBoxTagId);
      return;
    }

    if (allTags.length === 0) {
      container.innerHTML = `
        <div class="fs-tag-empty-state" style="padding: 70px 20px; text-align: center;">
          <div style="font-size: 44px; margin-bottom: 14px;">🏷️</div>
          <h2 style="color: #fff; font-size: 19px; font-weight: 700; margin-bottom: 8px;">Nenhuma tag criada ainda</h2>
          <p style="color: rgba(255,255,255,0.5); font-size: 13.5px; max-width: 440px; margin: 0 auto 22px;">
            Crie tags com upload de imagens personalizadas para organizar sua biblioteca de forma elegante e inteligente.
          </p>
          <button type="button" id="fs-empty-btn-create" class="fs-btn-new-tag-primary" style="padding: 10px 20px; font-size: 13px;">
            <span>+</span> <span>Criar Primeira Tag</span>
          </button>
        </div>
      `;
      container.querySelector('#fs-empty-btn-create')?.addEventListener('click', () => {
        openTagEditorModal();
      });
      return;
    }

    container.innerHTML = `
      <!-- MINIMALIST SUBHEADER BAR -->
      <div class="fs-tags-minimal-bar">
        <div class="fs-tags-minimal-chips">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255,255,255,0.45); margin-right: 4px;">Gerenciar:</span>
          ${allTags.map(tag => {
            const count = engine.getSongsForTag(tag.id).length;
            return `
              <div class="fs-tag-manager-pill" data-pill-id="${tag.id}" title="Clique para abrir playlist ou editar">
                <img src="${escapeHtml(tag.heroImage)}" class="fs-tag-mini-thumb" alt="" />
                <span class="fs-tag-manager-name">${escapeHtml(tag.name)}</span>
                <span class="fs-tag-manager-count">${count}</span>
                <button type="button" class="fs-tag-mini-btn fs-tag-btn-edit" data-id="${tag.id}" title="Editar Tag">✏️</button>
              </div>
            `;
          }).join('')}
        </div>
        <span style="font-size: 11.5px; color: rgba(255,255,255,0.45); white-space: nowrap;">Passe o mouse no card para editar ou excluir</span>
      </div>

      <!-- HERO BOXES GRID -->
      <div class="fs-hero-boxes-grid">
        ${allTags.map(tag => {
          const songs = engine.getSongsForTag(tag.id);
          return `
            <div class="fs-hero-box" data-id="${tag.id}" style="background-image: ${safeCssUrl(tag.heroImage)};">
              <div class="fs-hero-box-overlay"></div>
              
              <div class="fs-hero-box-top">
                <span class="fs-hero-box-tag-pill">🏷️ Tag</span>
                <div class="fs-hero-box-top-actions">
                  <span class="fs-hero-box-count-pill">${songs.length} faixas</span>
                  <button type="button" class="fs-hero-card-action-btn fs-card-edit-btn" data-edit-id="${tag.id}" title="Editar Nome / Capa da Tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button type="button" class="fs-hero-card-action-btn fs-card-delete-btn" data-delete-id="${tag.id}" title="Excluir Tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>

              <div class="fs-hero-box-bottom">
                <h3 class="fs-hero-box-title">${escapeHtml(tag.name)}</h3>
                
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

    // Bind Edit Buttons
    container.querySelectorAll('.fs-card-edit-btn, .fs-tag-btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-edit-id') || btn.getAttribute('data-id');
        if (id) openTagEditorModal(id);
      });
    });

    // Bind Delete Buttons
    container.querySelectorAll('.fs-card-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-delete-id');
        if (id) openDeleteConfirmModal(id);
      });
    });

    // Bind Pill clicks
    container.querySelectorAll('.fs-tag-manager-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        if (e.target.closest('.fs-tag-btn-edit')) return;
        const id = pill.getAttribute('data-pill-id');
        if (id) window.location.hash = '#/library/genres?tag=' + encodeURIComponent(id);
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

      box.addEventListener('click', (e) => {
        if (e.target.closest('.fs-hero-card-action-btn') || e.target.closest('.fs-hero-box-actions')) {
          return;
        }
        window.location.hash = '#/library/genres?tag=' + encodeURIComponent(tagId);
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
        <div class="fs-tag-hero-banner" style="background-image: ${safeCssUrl(tag.heroImage)};">
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
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.hash = '#/library/genres';
      }
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
        <div style="text-align: center; padding: 70px 20px; color: rgba(255,255,255,0.5);">
          <div style="font-size: 40px; margin-bottom: 12px;">📑</div>
          <h3 style="color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 8px;">Nenhuma tag criada ainda</h3>
          <p style="font-size: 13.5px; margin-bottom: 20px;">Crie sua primeira tag com capa e nome personalizados para visualizar por abas.</p>
          <button type="button" id="fs-tabs-empty-create" class="fs-btn-new-tag-primary">
            <span>+</span> <span>Criar Primeira Tag</span>
          </button>
        </div>
      `;
      container.querySelector('#fs-tabs-empty-create')?.addEventListener('click', () => {
        openTagEditorModal();
      });
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
                <img src="${escapeHtml(t.heroImage)}" class="fs-tag-pill-thumb" alt="" />
                <span class="fs-tag-pill-name">${escapeHtml(t.name)}</span>
                <span class="fs-tag-pill-count">${count}</span>
              </button>
            `;
          }).join('')}
          <button type="button" class="fs-tag-pill-btn fs-tag-pill-add-btn" id="fs-tabs-add-tag-btn" title="Criar Nova Tag">
            <span style="font-size: 13px; font-weight: bold;">+</span>
            <span>Nova Tag</span>
          </button>
        </div>

        <!-- ACTIVE TAG ACTION BAR -->
        <div class="fs-active-tag-action-bar">
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="${escapeHtml(activeTag.heroImage)}" class="fs-active-tag-large-thumb" alt="" />
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h2 style="font-size: 20px; font-weight: 700; color: #fff; margin: 0;">${escapeHtml(activeTag.name)}</h2>
                <span style="font-size: 11px; padding: 2px 8px; border-radius: 99px; background: rgba(167, 139, 250, 0.2); color: #c4b5fd; font-weight: 600;">${songs.length} faixas</span>
                <button type="button" class="fs-tag-mini-btn" id="fs-tabs-edit-active-tag" title="Editar Tag" style="margin-left: 4px; font-size: 13px;">✏️</button>
                <button type="button" class="fs-tag-mini-btn" id="fs-tabs-del-active-tag" title="Excluir Tag" style="font-size: 13px; color: #f87171;">✕</button>
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
    container.querySelectorAll('.fs-tag-pill-btn:not(#fs-tabs-add-tag-btn)').forEach(btn => {
      btn.addEventListener('click', () => {
        engine.activeTabId = btn.getAttribute('data-tag-id');
        engine.searchQuery = '';
        renderView2_Tabs(container, allTags);
      });
    });

    // Bind Add Tag Button
    container.querySelector('#fs-tabs-add-tag-btn')?.addEventListener('click', () => {
      openTagEditorModal();
    });

    // Bind Edit and Delete for Active Tag
    container.querySelector('#fs-tabs-edit-active-tag')?.addEventListener('click', () => {
      openTagEditorModal(activeTag.id);
    });

    container.querySelector('#fs-tabs-del-active-tag')?.addEventListener('click', () => {
      openDeleteConfirmModal(activeTag.id);
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
