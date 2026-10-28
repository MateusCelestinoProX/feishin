// ==========================================================================
// FEISHIN ULTRA-PREMIUM APPLE GLASS — RECENTLY ADDED (HIERARQUIA CRONOLÓGICA)
// Alocação Hierárquica Estrita por Data de Criação do Arquivo (birthTime)
// ==========================================================================

(function() {
  console.log('[Recently Added Engine] Inicializando Adicionadas Recentemente (Hierarquia por Data de Criação)...');

  const STORAGE_CACHE_KEY = 'feishin_recently_added_cache_v3';

  let cachedSongs = [];
  let totalRecordCount = 0;
  let isFetching = false;
  let searchQuery = '';
  let isMounting = false;
  let mountDebounceTimer = null;
  let lastCheckedHash = '';

  // 1. Credentials & Auth Helper
  function getAuthInfo() {
    let url = null;
    let cred = null;
    let serverId = null;
    let token = null;

    try {
      const auth = JSON.parse(localStorage.getItem('store_authentication') || '{}');
      const s = auth?.state?.currentServer;
      url = s?.url;
      serverId = s?.id;
      token = s?.ndCredential;
    } catch (e) {}

    const root = document.querySelector('#root');
    if (root && (!cred || !serverId)) {
      function scan(f, d = 0) {
        if (!f || d > 60 || cred) return;
        if (f.memoizedState) {
          let st = f.memoizedState;
          while (st) {
            if (st.memoizedState?.credential) {
              cred = st.memoizedState.credential;
              break;
            }
            st = st.next;
          }
        }
        if (f.child) scan(f.child, d + 1);
        if (f.sibling) scan(f.sibling, d + 1);
      }
      const fiberKey = Object.keys(root).find(k => k.startsWith('__reactContainer'));
      if (fiberKey) scan(root[fiberKey]);
    }

    return { url, cred, serverId, token };
  }

  function getCoverUrl(imageId) {
    if (!imageId) return '';
    const { url, cred } = getAuthInfo();
    if (url && cred) {
      return `${url}/rest/getCoverArt.view?id=${encodeURIComponent(imageId)}&${cred}&v=1.13.0&c=Feishin&size=300`;
    }
    return '';
  }

  function normalizeSong(s, serverId) {
    const durSec = s.duration || 0;
    const durMs = durSec > 10000 ? durSec : Math.round(durSec * 1000);
    const creationTime = s.birthTime || s.createdAt || s.updatedAt || new Date().toISOString();

    return {
      id: s.id,
      name: s.title || s.name || 'Faixa',
      title: s.title || s.name || 'Faixa',
      artistName: s.artist || s.artistName || (s.artists?.[0]?.name) || '[Unknown Artist]',
      album: s.album || s.albumName || '',
      albumId: s.albumId || s.id,
      duration: durMs,
      imageId: s.id,
      thumbHash: s.thumbHash || null,
      birthTime: s.birthTime || null,
      createdAt: s.createdAt || null,
      creationTime: creationTime,
      year: s.year || (s.releaseDate ? new Date(s.releaseDate).getFullYear() : null),
      _serverId: s._serverId || serverId,
      _serverType: 'navidrome',
      _itemType: 'song',
      _uniqueId: 'ra_' + s.id + '_' + Date.now()
    };
  }

  // 2. High-Performance Full Library Ingestion Sorted by birthTime (Creation Date)
  async function loadInitialSongs() {
    if (isFetching) return;
    isFetching = true;

    // Load from cache first for zero-latency instant render
    try {
      const saved = localStorage.getItem(STORAGE_CACHE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedSongs = parsed;
          totalRecordCount = parsed.length;
          renderViewContent();
        }
      }
    } catch (e) {}

    const { url, serverId, token } = getAuthInfo();
    if (!url || !token) {
      isFetching = false;
      return;
    }

    try {
      // Step 1: Fetch first batch (0..100) sorted strictly by birthTime (file creation date)
      const r0 = await fetch(`${url}/api/song?_start=0&_end=100&_order=DESC&_sort=birthTime`, {
        headers: { 'x-nd-authorization': `Bearer ${token}` }
      });
      const totalHeader = r0.headers.get('x-total-count');
      const total = totalHeader ? Number(totalHeader) : 1738;
      totalRecordCount = total;

      const page0 = await r0.json();
      if (Array.isArray(page0)) {
        cachedSongs = page0.map(s => normalizeSong(s, serverId));
        renderViewContent();
      }

      // Step 2: Parallel fetch of remaining pages in chunks of 200
      const fetchPromises = [];
      for (let start = 100; start < total; start += 200) {
        const end = Math.min(start + 200, total);
        fetchPromises.push(
          fetch(`${url}/api/song?_start=${start}&_end=${end}&_order=DESC&_sort=birthTime`, {
            headers: { 'x-nd-authorization': `Bearer ${token}` }
          })
          .then(res => res.json())
          .catch(() => [])
        );
      }

      const allRemainingPages = await Promise.all(fetchPromises);
      const remainingSongs = allRemainingPages.flat().map(s => normalizeSong(s, serverId));

      // Deduplicate and combine
      const seenIds = new Set(cachedSongs.map(s => s.id));
      const freshAdditions = remainingSongs.filter(s => !seenIds.has(s.id));
      cachedSongs = cachedSongs.concat(freshAdditions);
      
      // Ensure sorted strictly by creationTime descending
      cachedSongs.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));
      totalRecordCount = cachedSongs.length;

      // Save top 1200 tracks to cache
      try {
        localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(cachedSongs.slice(0, 1200)));
      } catch (e) {}

      renderViewContent();
    } catch (e) {
      console.error('[Recently Added] Falha na ingestão de faixas:', e);
    } finally {
      isFetching = false;
    }
  }

  // 3. Playback Helpers
  function playTrack(song, playlist = null, startIndex = 0) {
    const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
    if (!store) {
      console.warn('[Recently Added] Player Store indisponível');
      return;
    }

    const { serverId } = getAuthInfo();
    const cleanItem = (s) => ({
      id: s.id,
      name: s.name || s.title || 'Faixa',
      title: s.name || s.title || 'Faixa',
      artistName: s.artistName || (s.artists?.[0]?.name) || '[Unknown Artist]',
      album: s.album || s.albumName || '',
      duration: s.duration,
      imageId: s.imageId || s.id,
      thumbHash: s.thumbHash || null,
      _serverId: s._serverId || serverId,
      _serverType: 'navidrome',
      _itemType: 'song',
      _uniqueId: 'ra_' + s.id + '_' + Date.now()
    });

    if (playlist && playlist.length > 0) {
      const queueItems = playlist.map(cleanItem);
      store.setQueue(queueItems, startIndex);
    } else {
      store.addToQueueByType([cleanItem(song)], 'now');
    }

    setTimeout(renderActiveTrackIndicator, 150);
  }

  function playAll(shuffle = false) {
    const list = getFilteredSongs();
    if (list.length === 0) return;
    
    let songsToPlay = [...list];
    if (shuffle) {
      for (let i = songsToPlay.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [songsToPlay[i], songsToPlay[j]] = [songsToPlay[j], songsToPlay[i]];
      }
    }
    playTrack(songsToPlay[0], songsToPlay, 0);
  }

  function playGroup(groupKey) {
    const groups = groupSongsByCreationHierarchy(getFilteredSongs());
    const group = groups.find(g => g.key === groupKey);
    if (group && group.songs.length > 0) {
      playTrack(group.songs[0], group.songs, 0);
    }
  }

  // 4. Date Utilities & Hierarchical Clustering
  function formatCreationDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';

    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');

    if (isToday) return `Hoje às ${hours}:${mins}`;
    if (isYesterday) return `Ontem às ${hours}:${mins}`;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year} ${hours}:${mins}`;
  }

  function formatDuration(durMs) {
    if (!durMs) return '0:00';
    let totalSec = Math.round(durMs > 10000 ? durMs / 1000 : durMs);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function groupSongsByCreationHierarchy(songs) {
    const groups = new Map();
    const now = new Date();
    const todayStr = now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    songs.forEach(song => {
      const d = new Date(song.creationTime);
      const isInvalid = isNaN(d.getTime());
      const songDate = isInvalid ? new Date() : d;

      let key = '';
      let title = '';
      let subtitle = '';
      let icon = '📅';

      if (songDate.toDateString() === todayStr) {
        key = 'group-today';
        title = 'Hoje';
        subtitle = `${songDate.getDate()} de ${monthNames[songDate.getMonth()]}`;
        icon = '⚡';
      } else if (songDate.toDateString() === yesterdayStr) {
        key = 'group-yesterday';
        title = 'Ontem';
        subtitle = `${songDate.getDate()} de ${monthNames[songDate.getMonth()]}`;
        icon = '✨';
      } else if (songDate >= sevenDaysAgo) {
        key = 'group-this-week';
        title = 'Esta Semana';
        subtitle = 'Últimos 7 dias';
        icon = '🔥';
      } else if (songDate >= fourteenDaysAgo) {
        key = 'group-last-week';
        title = 'Semana Passada';
        subtitle = 'Entre 7 e 14 dias atrás';
        icon = '🗓️';
      } else {
        const m = songDate.getMonth();
        const y = songDate.getFullYear();
        key = `group-${y}-${m}`;
        title = `${monthNames[m]} de ${y}`;
        subtitle = `Arquivos criados em ${monthNames[m]}`;
        icon = '📁';
      }

      if (!groups.has(key)) {
        groups.set(key, { key, title, subtitle, icon, songs: [] });
      }
      groups.get(key).songs.push(song);
    });

    return Array.from(groups.values());
  }

  function getFilteredSongs() {
    if (!searchQuery || !searchQuery.trim()) return cachedSongs;
    const q = searchQuery.toLowerCase().trim();
    return cachedSongs.filter(s =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.artistName || '').toLowerCase().includes(q) ||
      (s.album || '').toLowerCase().includes(q)
    );
  }

  function getCurrentPlayingSongId() {
    try {
      const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
      return store?.getCurrentSong?.()?.id || null;
    } catch (e) {
      return null;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 5. Renderers: Hero Header + Hierarchical Tracklist (Clean & Fast)
  function renderHeroHeaderHtml(total, filteredCount) {
    const isFiltering = searchQuery && searchQuery.trim().length > 0;
    const badgeText = isFiltering
      ? `${filteredCount} de ${total.toLocaleString('pt-BR')} faixas`
      : `${total.toLocaleString('pt-BR')} faixas`;

    return `
      <div class="ra-hero-header">
        <div class="ra-header-left">
          <div class="ra-header-icon-badge">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="ra-header-titles">
            <div class="ra-header-title-row">
              <h1 class="ra-header-title">Adicionadas recentemente</h1>
              <span class="ra-badge-count" id="ra-header-badge">${badgeText}</span>
            </div>
            <p class="ra-header-subtitle">
              <span class="pulse-dot-cyan"></span>
              Alocação hierárquica por data de criação do arquivo • Ordem cronológica decrescente
            </p>
          </div>
        </div>

        <div class="ra-header-actions">
          <button type="button" class="ra-glass-btn ra-glass-btn-primary" id="ra-btn-play-all">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <span>Tocar Tudo</span>
          </button>

          <button type="button" class="ra-glass-btn" id="ra-btn-shuffle-all">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 3 21 3 21 8"/>
              <line x1="4" y1="20" x2="21" y2="3"/>
              <polyline points="21 16 21 21 16 21"/>
              <line x1="15" y1="15" x2="21" y2="21"/>
              <line x1="4" y1="4" x2="9" y2="9"/>
            </svg>
            <span>Aleatório</span>
          </button>

          <div class="ra-search-wrap">
            <svg class="ra-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" class="ra-search-input" id="ra-search-field" placeholder="Buscar faixas..." value="${escapeHtml(searchQuery)}" />
            ${isFiltering ? `
              <button type="button" class="ra-search-clear-btn" id="ra-search-clear" title="Limpar busca">✕</button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function renderHierarchicalTracklistHtml(songs) {
    if (songs.length === 0) {
      return `
        <div class="ra-empty-state">
          <div class="ra-empty-icon">🔍</div>
          <h3 class="ra-empty-title">Nenhuma música encontrada</h3>
          <p class="ra-empty-desc">Tente ajustar a sua busca ou verifique se as músicas foram sincronizadas no servidor.</p>
        </div>
      `;
    }

    const currentId = getCurrentPlayingSongId();
    const groups = groupSongsByCreationHierarchy(songs);
    let globalIndex = 0;

    return `
      <div class="ra-hierarchical-sections-container">
        ${groups.map(group => {
          return `
            <div class="ra-hierarchy-section" id="${group.key}">
              <!-- Glass Hierarchy Section Header -->
              <div class="ra-hierarchy-header">
                <div class="ra-hierarchy-header-left">
                  <span class="ra-hierarchy-icon">${group.icon}</span>
                  <div class="ra-hierarchy-header-texts">
                    <span class="ra-hierarchy-title">${escapeHtml(group.title)}</span>
                    <span class="ra-hierarchy-subtitle">${escapeHtml(group.subtitle)}</span>
                  </div>
                  <span class="ra-hierarchy-count-pill">${group.songs.length} ${group.songs.length === 1 ? 'faixa' : 'faixas'}</span>
                </div>
                <div class="ra-hierarchy-header-right">
                  <button type="button" class="ra-section-play-btn" data-group-key="${group.key}" title="Tocar todas desta seção">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    <span>Tocar Seção</span>
                  </button>
                </div>
              </div>

              <!-- Section Tracks Table -->
              <div class="ra-tracklist-container">
                <table class="ra-tracklist-table">
                  <thead>
                    <tr>
                      <th style="width: 44px; text-align: center;">#</th>
                      <th style="width: 48px;"></th>
                      <th>TÍTULO</th>
                      <th>ÁLBUM</th>
                      <th>DATA DE CRIAÇÃO DO ARQUIVO</th>
                      <th style="width: 60px;">ANO</th>
                      <th style="width: 70px; text-align: right;">DURAÇÃO</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${group.songs.map(song => {
                      const idx = globalIndex++;
                      const isPlaying = song.id === currentId;
                      const coverUrl = getCoverUrl(song.imageId || song.id);
                      const dur = formatDuration(song.duration);
                      const creationStr = formatCreationDate(song.creationTime);

                      return `
                        <tr class="ra-tracklist-row ${isPlaying ? 'is-playing' : ''}" data-id="${song.id}" data-index="${idx}">
                          <td class="ra-col-idx">
                            ${isPlaying ? `
                              <div class="ra-mini-equalizer">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            ` : `
                              <span class="ra-idx-num">${idx + 1}</span>
                              <button type="button" class="ra-row-play-btn" data-play-id="${song.id}">▶</button>
                            `}
                          </td>
                          <td class="ra-track-cover-cell">
                            <div class="ra-track-thumb-box">
                              ${coverUrl ? `<img class="ra-track-thumb-img" src="${coverUrl}" loading="lazy" />` : `<span>🎵</span>`}
                            </div>
                          </td>
                          <td class="ra-track-title-cell">
                            <div class="ra-track-title">${escapeHtml(song.name || song.title || 'Faixa')}</div>
                            <div class="ra-track-artist">${escapeHtml(song.artistName || (song.artists?.[0]?.name) || '[Unknown Artist]')}</div>
                          </td>
                          <td>
                            <div class="ra-track-album">${escapeHtml(song.album || song.albumName || '—')}</div>
                          </td>
                          <td>
                            <span class="ra-track-creation-date">
                              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.6; vertical-align: -1px; margin-right: 4px;">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 15 14"/>
                              </svg>
                              ${creationStr}
                            </span>
                          </td>
                          <td style="color: rgba(255,255,255,0.45); font-size: 12.5px;">
                            ${song.year || '—'}
                          </td>
                          <td class="ra-track-duration">
                            ${dur}
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // 6. Bind Events
  function bindViewEvents(container) {
    container.querySelector('#ra-btn-play-all')?.addEventListener('click', () => playAll(false));
    container.querySelector('#ra-btn-shuffle-all')?.addEventListener('click', () => playAll(true));

    const searchField = container.querySelector('#ra-search-field');
    if (searchField) {
      searchField.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderViewContentOnly();
      });
    }

    container.querySelector('#ra-search-clear')?.addEventListener('click', () => {
      searchQuery = '';
      renderViewContent();
    });

    // Play Section Button
    container.querySelectorAll('.ra-section-play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const groupKey = btn.getAttribute('data-group-key');
        if (groupKey) playGroup(groupKey);
      });
    });

    // Track Rows Double-Click & Play Button
    container.querySelectorAll('.ra-tracklist-row').forEach(row => {
      row.addEventListener('dblclick', () => {
        const id = row.getAttribute('data-id');
        const song = cachedSongs.find(s => s.id === id);
        if (song) playTrack(song, getFilteredSongs(), Number(row.getAttribute('data-index') || 0));
      });

      row.querySelector('.ra-row-play-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = row.getAttribute('data-id');
        const song = cachedSongs.find(s => s.id === id);
        if (song) playTrack(song, getFilteredSongs(), Number(row.getAttribute('data-index') || 0));
      });
    });
  }

  function renderViewContentOnly() {
    const body = document.getElementById('ra-content-body-wrap');
    if (!body) return;
    const songs = getFilteredSongs();
    const prevScroll = document.getElementById('feishin-recently-added-view')?.scrollTop || 0;

    const badge = document.getElementById('ra-header-badge');
    if (badge) {
      const isFiltering = searchQuery && searchQuery.trim().length > 0;
      badge.textContent = isFiltering
        ? `${songs.length} de ${(totalRecordCount || cachedSongs.length).toLocaleString('pt-BR')} faixas`
        : `${(totalRecordCount || cachedSongs.length).toLocaleString('pt-BR')} faixas`;
    }

    body.innerHTML = renderHierarchicalTracklistHtml(songs);

    const container = document.getElementById('feishin-recently-added-view');
    if (container) {
      bindViewEvents(container);
      if (prevScroll > 0) container.scrollTop = prevScroll;
    }
  }

  function renderViewContent() {
    const container = document.getElementById('feishin-recently-added-view');
    if (!container) return;

    const songs = getFilteredSongs();
    const prevScroll = container.scrollTop;

    container.innerHTML = `
      ${renderHeroHeaderHtml(totalRecordCount || cachedSongs.length, songs.length)}
      <div id="ra-content-body-wrap" style="width: 100%;">
        ${renderHierarchicalTracklistHtml(songs)}
      </div>
    `;

    bindViewEvents(container);
    if (prevScroll > 0) container.scrollTop = prevScroll;
  }

  function renderActiveTrackIndicator() {
    const currentId = getCurrentPlayingSongId();
    document.querySelectorAll('.ra-tracklist-row').forEach(row => {
      const isCur = row.getAttribute('data-id') === currentId;
      row.classList.toggle('is-playing', isCur);
    });
  }

  // 7. Mount & Navigation Management (Conflict-Free Architecture)
  function getMountContainer() {
    return document.querySelector('.fs-main-content-module-main-content-body-scroll') ||
           document.querySelector('.fs-main-content-module-main-content-body') ||
           document.querySelector('main');
  }

  function isOtherCustomPageActive(hash) {
    return hash.includes('analytics') || hash.startsWith('#/library/genres') || hash.startsWith('#/library/tags');
  }

  function ensureSidebarRecentlyAddedItem() {
    const parent = document.querySelector('.fs-sidebar-module-accordion-content');
    if (!parent) return;

    let item = document.getElementById('personal-os-sidebar-recently-added-item');
    if (!item) {
      item = document.createElement('a');
      item.id = 'personal-os-sidebar-recently-added-item';
      item.className = 'mantine-focus-never mantine-active fs-button-module-root fs-sidebar-item-module-link fs-sidebar-item-module-root m_77c9d27d mantine-Button-root m_87cf2631 mantine-UnstyledButton-root';
      item.setAttribute('data-variant', 'subtle');
      item.setAttribute('data-size', 'sm');
      item.setAttribute('draggable', 'false');
      item.setAttribute('title', 'Músicas Adicionadas Recentemente');
      item.style.cssText = '--button-height: var(--button-height-sm); --button-padding-x: var(--button-padding-x-sm); --button-fz: 11px; --button-bg: transparent; --button-hover: var(--mantine-color-primary-light-hover); --button-color: var(--mantine-color-primary-light-color); --button-bd: calc(0.0625rem * var(--mantine-scale)) solid transparent; cursor: pointer; user-select: none; -webkit-app-region: no-drag;';

      item.innerHTML = `
        <span class="fs-sidebar-item-module-inner m_80f1301b mantine-Button-inner">
          <span class="fs-sidebar-item-module-label m_811560b9 mantine-Button-label" style="width: 100%;">
            <div class="m_4081bf90 mantine-Group-root" style="--group-gap: var(--mantine-spacing-md); --group-align: center; --group-justify: flex-start; --group-wrap: nowrap; width: 100%;">
              <span class="fs-sidebar-icon-module-wrapper">
                <svg stroke="currentColor" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" height="1.15em" width="1.15em" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
              <span style="font-size: 11.5px; font-weight: 600; letter-spacing: -0.2px; white-space: nowrap;">ADICIONADAS RECENTEMENTE</span>
            </div>
          </span>
        </span>
      `;

      item.addEventListener('pointerdown', (e) => e.stopPropagation());
      item.addEventListener('mousedown', (e) => e.stopPropagation());
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.hash = '#/library/recently-added';
        scheduleMount();
      });

      const faixasItem = parent.querySelector('a[href*="/library/songs"]');
      if (faixasItem && faixasItem.nextSibling) {
        parent.insertBefore(item, faixasItem.nextSibling);
      } else if (faixasItem) {
        parent.appendChild(item);
      } else {
        const firstNav = parent.querySelector('a');
        if (firstNav) parent.insertBefore(item, firstNav);
        else parent.appendChild(item);
      }
    }

    const currentHash = window.location.hash || '';
    if (currentHash.includes('recently-added')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  }

  async function mountRecentlyAddedUI() {
    if (isMounting) return;
    isMounting = true;
    try {
      ensureSidebarRecentlyAddedItem();

      const mainContainer = getMountContainer();
      if (!mainContainer) return;

      const hash = window.location.hash || '';
      const isTargetRoute = hash.includes('recently-added');
      let viewContainer = document.getElementById('feishin-recently-added-view');

      if (isTargetRoute) {
        document.body.classList.add('feishin-route-recently-added');

        if (!viewContainer) {
          viewContainer = document.createElement('div');
          viewContainer.id = 'feishin-recently-added-view';
          mainContainer.appendChild(viewContainer);
        } else if (viewContainer.parentElement !== mainContainer) {
          mainContainer.appendChild(viewContainer);
        }

        // Hide native siblings
        Array.from(mainContainer.children).forEach(child => {
          if (child !== viewContainer) {
            child.style.display = 'none';
          }
        });

        viewContainer.style.setProperty('display', 'flex', 'important');

        const sidebarItem = document.getElementById('personal-os-sidebar-recently-added-item');
        if (sidebarItem) sidebarItem.classList.add('active');

        if (cachedSongs.length === 0) {
          viewContainer.innerHTML = `
            <div class="ra-empty-state" style="padding: 100px 20px;">
              <div class="ra-empty-icon" style="animation: raDotPulse 1.5s infinite ease-in-out;">⚡</div>
              <h3 class="ra-empty-title">Carregando Músicas Adicionadas Recentemente...</h3>
              <p class="ra-empty-desc">Conectando ao catálogo Navidrome e organizando por data de criação do arquivo.</p>
            </div>
          `;
          await loadInitialSongs();
        } else {
          renderViewContent();
        }
      } else {
        document.body.classList.remove('feishin-route-recently-added');

        if (viewContainer) {
          viewContainer.style.setProperty('display', 'none', 'important');
        }

        // Restore native siblings ONLY if no other custom view is active
        if (!isOtherCustomPageActive(hash)) {
          Array.from(mainContainer.children).forEach(child => {
            if (child !== viewContainer && child.id !== 'feishin-analytics-dashboard' && child.id !== 'fs-tags-page-mount') {
              if (child.style.display === 'none') {
                child.style.display = '';
              }
            }
          });
        }

        const sidebarItem = document.getElementById('personal-os-sidebar-recently-added-item');
        if (sidebarItem) sidebarItem.classList.remove('active');
      }
    } finally {
      isMounting = false;
    }
  }

  function scheduleMount() {
    if (mountDebounceTimer) return;
    mountDebounceTimer = setTimeout(() => {
      mountDebounceTimer = null;
      mountRecentlyAddedUI();
    }, 50);
  }

  // Navigation listeners
  window.addEventListener('hashchange', () => {
    scheduleMount();
  });
  window.addEventListener('popstate', () => {
    scheduleMount();
  });

  // Periodic lightweight sanity check (every 400ms)
  setInterval(() => {
    const hash = window.location.hash || '';
    if (hash !== lastCheckedHash) {
      lastCheckedHash = hash;
      scheduleMount();
      return;
    }

    const shouldShow = hash.includes('recently-added');
    const view = document.getElementById('feishin-recently-added-view');
    const sidebarItem = document.getElementById('personal-os-sidebar-recently-added-item');

    if (shouldShow && (!view || view.style.display === 'none')) {
      scheduleMount();
    } else if (!sidebarItem) {
      ensureSidebarRecentlyAddedItem();
    }
  }, 400);

  // Initial schedule
  scheduleMount();

  // Expose API
  window.__FEISHIN_RECENTLY_ADDED__ = {
    playAll,
    playGroup,
    getSongs: () => cachedSongs,
    reload: loadInitialSongs
  };

})();
