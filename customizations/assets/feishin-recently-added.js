// ==========================================================================
// FEISHIN ULTRA-PREMIUM APPLE GLASS — RECENTLY ADDED & CINEMATIC TIMELINE
// Real-time Chronological Ingestion, Liquid Glass Aesthetics & 3D Depth
// ==========================================================================

(function() {
  console.log('[Recently Added Engine] Inicializando Adicionadas Recentemente & Linha do Tempo...');

  const STORAGE_VIEW_KEY = 'feishin_recently_added_view_mode';
  const STORAGE_CACHE_KEY = 'feishin_recently_added_cache_v1';

  let currentViewMode = localStorage.getItem(STORAGE_VIEW_KEY) || 'timeline'; // 'timeline' | 'tracklist'
  let cachedSongs = [];
  let totalRecordCount = 0;
  let isFetching = false;
  let hasFetchedAll = false;
  let searchQuery = '';
  let isMounting = false;
  let mountDebounceTimer = null;

  // 1. Credentials & Auth Helper
  function getQueryClient() {
    if (window.__FEISHIN_QC__) return window.__FEISHIN_QC__;
    const root = document.querySelector('#root');
    if (!root) return null;
    const k = Object.keys(root).find(key => key.startsWith('__reactContainer'));
    if (!k) return null;
    let fiber = root[k];
    let depth = 0;
    while (fiber && depth < 30) {
      if (fiber.memoizedProps && fiber.memoizedProps.client && fiber.memoizedProps.client.getQueryCache) {
        window.__FEISHIN_QC__ = fiber.memoizedProps.client;
        return fiber.memoizedProps.client;
      }
      fiber = fiber.child;
      depth++;
    }
    return null;
  }

  function getSubsonicCredentials() {
    let url = null;
    let cred = null;
    let serverId = null;

    try {
      const auth = JSON.parse(localStorage.getItem('store_authentication') || '{}');
      url = auth?.state?.currentServer?.url;
      serverId = auth?.state?.currentServer?.id;
    } catch (e) {}

    const root = document.querySelector('#root');
    if (root) {
      function scan(f, d = 0) {
        if (!f || d > 60 || cred) return;
        if (f.memoizedState) {
          let s = f.memoizedState;
          while (s) {
            if (s.memoizedState?.credential) {
              cred = s.memoizedState.credential;
              break;
            }
            s = s.next;
          }
        }
        if (f.child) scan(f.child, d + 1);
        if (f.sibling) scan(f.sibling, d + 1);
      }
      const fiberKey = Object.keys(root).find(k => k.startsWith('__reactContainer'));
      if (fiberKey) scan(root[fiberKey]);
    }

    return { url, cred, serverId };
  }

  function getCoverUrl(imageId) {
    if (!imageId) return '';
    const { url, cred } = getSubsonicCredentials();
    if (url && cred) {
      return `${url}/rest/getCoverArt.view?id=${encodeURIComponent(imageId)}&${cred}&v=1.13.0&c=Feishin&size=300`;
    }
    return '';
  }

  // 2. Data Fetcher through Feishin's native Query Client
  async function fetchRecentlyAddedBatch(startIndex = 0, limit = 100) {
    const qc = getQueryClient();
    if (!qc) throw new Error('Query Client not available');

    const queries = qc.getQueryCache().getAll();
    const sampleQuery = queries.find(q => q.queryKey[1] === 'songs' && q.queryKey[2] === 'list');
    if (!sampleQuery) throw new Error('Song list queryFn not found in cache');

    const serverId = sampleQuery.queryKey[0];
    const queryFn = sampleQuery.options.queryFn;

    const res = await queryFn({
      signal: new AbortController().signal,
      queryKey: [serverId, 'songs', 'list', { sortBy: 'recentlyAdded', sortOrder: 'DESC' }, { limit, startIndex }]
    });

    return res;
  }

  async function loadInitialSongs() {
    if (isFetching) return;
    isFetching = true;

    // Load from cache first if available
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

    try {
      // 1. Fetch First Batch (100 songs)
      const firstBatch = await fetchRecentlyAddedBatch(0, 100);
      if (firstBatch && firstBatch.items) {
        cachedSongs = firstBatch.items;
        totalRecordCount = firstBatch.totalRecordCount || firstBatch.items.length;
        renderViewContent();

        // 2. Fetch remaining pages sequentially/concurrently in the background
        const total = totalRecordCount;
        let startIndex = 100;
        
        while (startIndex < total) {
          try {
            const nextBatch = await fetchRecentlyAddedBatch(startIndex, 100);
            if (!nextBatch || !nextBatch.items || nextBatch.items.length === 0) break;
            
            // Merge deduplicated
            const existingIds = new Set(cachedSongs.map(s => s.id));
            const newItems = nextBatch.items.filter(s => !existingIds.has(s.id));
            cachedSongs = cachedSongs.concat(newItems);
            startIndex += 100;

            // Update badge count
            updateBadgeCount(cachedSongs.length, totalRecordCount);

            // Periodically refresh view if user is looking
            if (startIndex % 300 === 0 || startIndex >= total) {
              renderViewContent();
            }
          } catch (err) {
            console.warn('[Recently Added] Erro em batch de paginação:', err);
            break;
          }
        }

        hasFetchedAll = true;
        try {
          // Cache up to 1000 items in localStorage for fast reload
          localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(cachedSongs.slice(0, 1000)));
        } catch (e) {}

        renderViewContent();
      }
    } catch (e) {
      console.error('[Recently Added] Erro ao carregar faixas:', e);
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

    const { serverId } = getSubsonicCredentials();
    const cleanItem = (s) => ({
      id: s.id,
      name: s.name || s.title || 'Faixa',
      title: s.name || s.title || 'Faixa',
      artistName: s.artistName || (s.artists?.[0]?.name) || '[Unknown Artist]',
      album: s.album || s.albumName || '',
      duration: (s.duration || 0) > 10000 ? s.duration : (s.duration || 0) * 1000,
      imageId: s.imageId || s.coverArt || s.id,
      thumbHash: s.thumbHash || null,
      _serverId: s._serverId || serverId,
      _serverType: s._serverType || 'navidrome',
      _itemType: 'song',
      _uniqueId: 'ra_' + s.id + '_' + Date.now()
    });

    if (playlist && playlist.length > 0) {
      const queueItems = playlist.map(cleanItem);
      store.setQueue(queueItems, startIndex);
    } else {
      store.addToQueueByType([cleanItem(song)], 'now');
    }

    // Refresh view active playing indicator
    setTimeout(renderActiveTrackIndicator, 200);
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

  // 4. Grouping & Date Utilities
  function parseDate(dateStr) {
    if (!dateStr) return new Date();
    return new Date(dateStr);
  }

  function formatRelativeDate(dateStr) {
    if (!dateStr) return 'Recentemente';
    const d = parseDate(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Há poucos minutos';
    if (diffHours < 24) return `Hoje às ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    if (diffDays === 1) return `Ontem às ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    if (diffDays < 7) return `Há ${diffDays} dias`;

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${d.getDate()} de ${months[d.getMonth()]}, ${d.getFullYear()} • ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function formatDuration(durMsOrSec) {
    if (!durMsOrSec) return '0:00';
    let totalSec = Math.round(durMsOrSec > 10000 ? durMsOrSec / 1000 : durMsOrSec);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function clusterSongsByEpoch(songs) {
    const epochs = new Map();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOfWeek = startOfToday - (now.getDay() * 86400000);

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    songs.forEach(s => {
      const d = parseDate(s.createdAt || s.updatedAt);
      const time = d.getTime();
      let key = '';
      let title = '';
      let icon = '📅';

      if (time >= startOfToday) {
        key = 'epoch-today';
        title = 'Hoje';
        icon = '⚡';
      } else if (time >= startOfYesterday) {
        key = 'epoch-yesterday';
        title = 'Ontem';
        icon = '✨';
      } else if (time >= startOfWeek) {
        key = 'epoch-this-week';
        title = 'Esta Semana';
        icon = '🔥';
      } else {
        const m = d.getMonth();
        const y = d.getFullYear();
        key = `epoch-${y}-${m}`;
        title = `${monthNames[m]} de ${y}`;
        icon = '🌌';
      }

      if (!epochs.has(key)) {
        epochs.set(key, { key, title, icon, songs: [] });
      }
      epochs.get(key).songs.push(s);
    });

    return Array.from(epochs.values());
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

  // 5. Renderers: Hero Header + Views
  function renderHeroHeaderHtml(total, currentFiltered) {
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
              <span class="ra-badge-count" id="ra-header-badge">${total.toLocaleString('pt-BR')} faixas</span>
            </div>
            <p class="ra-header-subtitle">
              <span class="pulse-dot-cyan"></span>
              Ordem cronológica estrita • Da mais recente para a mais antiga
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
            <input type="text" class="ra-search-input" id="ra-search-field" placeholder="Buscar faixas..." value="${searchQuery}" />
          </div>

          <div class="ra-view-switcher">
            <button type="button" class="ra-view-btn ${currentViewMode === 'tracklist' ? 'active' : ''}" data-view="tracklist" id="ra-view-tracklist-btn">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              <span>Faixas</span>
            </button>
            <button type="button" class="ra-view-btn ${currentViewMode === 'timeline' ? 'active' : ''}" data-view="timeline" id="ra-view-timeline-btn">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 14 14"/>
              </svg>
              <span>Linha do Tempo</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // VIEW 1: Tracklist Table
  function renderTracklistHtml(songs) {
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

    return `
      <div class="ra-tracklist-container">
        <table class="ra-tracklist-table">
          <thead>
            <tr>
              <th style="width: 44px; text-align: center;">#</th>
              <th style="width: 48px;"></th>
              <th>TÍTULO</th>
              <th>ÁLBUM</th>
              <th>ADICIONADA EM</th>
              <th style="width: 60px;">ANO</th>
              <th style="width: 70px; text-align: right;">DURAÇÃO</th>
            </tr>
          </thead>
          <tbody>
            ${songs.map((song, idx) => {
              const isPlaying = song.id === currentId;
              const coverUrl = getCoverUrl(song.imageId || song.id);
              const dur = formatDuration(song.duration);
              const addedStr = formatRelativeDate(song.createdAt || song.updatedAt);
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
                    <span class="ra-track-added-date">${addedStr}</span>
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
    `;
  }

  // VIEW 2: Cinematic Glass Timeline
  function renderTimelineHtml(songs) {
    if (songs.length === 0) {
      return `
        <div class="ra-empty-state">
          <div class="ra-empty-icon">⏳</div>
          <h3 class="ra-empty-title">Linha do tempo vazia</h3>
          <p class="ra-empty-desc">Nenhuma música corresponde ao filtro atual.</p>
        </div>
      `;
    }

    const currentId = getCurrentPlayingSongId();
    const epochs = clusterSongsByEpoch(songs);

    return `
      <div class="ra-timeline-container">
        <!-- Central Glass Spine -->
        <div class="ra-timeline-spine"></div>

        <!-- Quick Jump Scrubber HUD -->
        <div class="ra-timeline-hud">
          ${epochs.map(ep => `
            <button type="button" class="ra-hud-item" data-jump-to="${ep.key}">
              <span class="ra-hud-dot"></span>
              <span>${ep.title}</span>
            </button>
          `).join('')}
        </div>

        ${epochs.map(epoch => `
          <div class="ra-epoch-group" id="${epoch.key}">
            <div class="ra-epoch-capsule-wrap">
              <div class="ra-epoch-capsule">
                <span class="ra-epoch-icon">${epoch.icon}</span>
                <span class="ra-epoch-title">${epoch.title}</span>
                <span class="ra-epoch-count-pill">${epoch.songs.length} faixas</span>
              </div>
            </div>

            <div class="ra-timeline-nodes-wrap">
              ${epoch.songs.map((song, songIdx) => {
                const isLeft = songIdx % 2 === 0;
                const isPlaying = song.id === currentId;
                const coverUrl = getCoverUrl(song.imageId || song.id);
                const dur = formatDuration(song.duration);
                const addedStr = formatRelativeDate(song.createdAt || song.updatedAt);

                return `
                  <div class="ra-timeline-node ${isLeft ? 'node-left' : 'node-right'}" data-node-id="${song.id}">
                    <div class="ra-timeline-connector"></div>
                    <div class="ra-timeline-dot"></div>

                    <div class="ra-timeline-card ${isPlaying ? 'is-active-playing' : ''}" data-id="${song.id}">
                      <div class="ra-card-art-wrap">
                        ${coverUrl ? `<img class="ra-card-art-img" src="${coverUrl}" loading="lazy" />` : `<span>🎵</span>`}
                        <button type="button" class="ra-card-play-btn" data-play-id="${song.id}" title="Tocar Agora">
                          <div class="ra-card-play-circle">▶</div>
                        </button>
                      </div>

                      <div class="ra-card-info">
                        <div class="ra-card-meta-top">
                          <span class="ra-card-time-badge">
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 15 14"/>
                            </svg>
                            ${addedStr}
                          </span>
                          <span class="ra-card-duration">${dur}</span>
                        </div>

                        <h4 class="ra-card-title" title="${escapeHtml(song.name || song.title || '')}">
                          ${escapeHtml(song.name || song.title || 'Faixa')}
                        </h4>
                        <p class="ra-card-artist" title="${escapeHtml(song.artistName || '')}">
                          ${escapeHtml(song.artistName || (song.artists?.[0]?.name) || '[Unknown Artist]')}
                        </p>
                        <p class="ra-card-album" title="${escapeHtml(song.album || '')}">
                          ${escapeHtml(song.album || song.albumName || 'Álbum')}
                        </p>

                        ${isPlaying ? `
                          <div class="ra-card-waveform-bar">
                            <span></span><span></span><span></span><span></span><span></span>
                          </div>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
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

  // 6. Bind Events
  function bindViewEvents(container) {
    // 1. Play All & Shuffle
    container.querySelector('#ra-btn-play-all')?.addEventListener('click', () => playAll(false));
    container.querySelector('#ra-btn-shuffle-all')?.addEventListener('click', () => playAll(true));

    // 2. Search Field Live Filter
    const searchField = container.querySelector('#ra-search-field');
    if (searchField) {
      searchField.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        const filtered = getFilteredSongs();
        updateBadgeCount(filtered.length, totalRecordCount);
        renderViewContentOnly();
      });
    }

    // 3. View Switcher Toggle
    container.querySelector('#ra-view-tracklist-btn')?.addEventListener('click', () => {
      if (currentViewMode === 'tracklist') return;
      currentViewMode = 'tracklist';
      localStorage.setItem(STORAGE_VIEW_KEY, 'tracklist');
      renderViewContent();
    });

    container.querySelector('#ra-view-timeline-btn')?.addEventListener('click', () => {
      if (currentViewMode === 'timeline') return;
      currentViewMode = 'timeline';
      localStorage.setItem(STORAGE_VIEW_KEY, 'timeline');
      renderViewContent();
    });

    // 4. Quick Jump HUD in Timeline
    container.querySelectorAll('[data-jump-to]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-jump-to');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // 5. Track Click Handlers (Tracklist Rows & Timeline Cards)
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

    container.querySelectorAll('.ra-timeline-card').forEach(card => {
      const id = card.getAttribute('data-id');
      const song = cachedSongs.find(s => s.id === id);

      card.addEventListener('click', (e) => {
        if (song) playTrack(song, getFilteredSongs());
      });

      card.querySelector('.ra-card-play-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (song) playTrack(song, getFilteredSongs());
      });

      // 3D Interactive Tilt on Glass Pod
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px) scale(1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  function updateBadgeCount(filteredCount, totalCount) {
    const badge = document.getElementById('ra-header-badge');
    if (badge) {
      if (searchQuery && searchQuery.trim()) {
        badge.textContent = `${filteredCount} de ${totalCount.toLocaleString('pt-BR')} faixas`;
      } else {
        badge.textContent = `${totalCount.toLocaleString('pt-BR')} faixas`;
      }
    }
  }

  function renderViewContentOnly() {
    const body = document.getElementById('ra-content-body-wrap');
    if (!body) return;
    const songs = getFilteredSongs();
    const prevScroll = document.getElementById('feishin-recently-added-view')?.scrollTop || 0;

    if (currentViewMode === 'tracklist') {
      body.innerHTML = renderTracklistHtml(songs);
    } else {
      body.innerHTML = renderTimelineHtml(songs);
    }

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
        ${currentViewMode === 'tracklist' ? renderTracklistHtml(songs) : renderTimelineHtml(songs)}
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
    document.querySelectorAll('.ra-timeline-card').forEach(card => {
      const isCur = card.getAttribute('data-id') === currentId;
      card.classList.toggle('is-active-playing', isCur);
    });
  }

  // 7. Mount & Navigation Management
  function getMountContainer() {
    return document.querySelector('.fs-main-content-module-main-content-body-scroll') ||
           document.querySelector('.fs-main-content-module-main-content-body') ||
           document.querySelector('main');
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
      item.setAttribute('title', 'Músicas Adicionadas Recentemente & Linha do Tempo');
      item.style.cssText = '--button-height: var(--button-height-sm); --button-padding-x: var(--button-padding-x-sm); --button-fz: var(--mantine-font-size-sm); --button-bg: transparent; --button-hover: var(--mantine-color-primary-light-hover); --button-color: var(--mantine-color-primary-light-color); --button-bd: calc(0.0625rem * var(--mantine-scale)) solid transparent; cursor: pointer; user-select: none; -webkit-app-region: no-drag;';

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
              <span>ADICIONADAS RECENTEMENTE</span>
              <span class="ra-sidebar-pill">TIME</span>
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

      // Place right under FAIXAS item (or below FAVORITOS)
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
        if (!viewContainer) {
          viewContainer = document.createElement('div');
          viewContainer.id = 'feishin-recently-added-view';
          mainContainer.appendChild(viewContainer);
        } else if (viewContainer.parentElement !== mainContainer) {
          mainContainer.appendChild(viewContainer);
        }

        // Hide sibling elements inside mainContainer
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
              <div class="ra-empty-icon" style="animation: raDotPulse 1.5s infinite ease-in-out;">⏳</div>
              <h3 class="ra-empty-title">Carregando Músicas Adicionadas Recentemente...</h3>
              <p class="ra-empty-desc">Conectando ao catálogo Navidrome e estruturando a linha do tempo de vidro.</p>
            </div>
          `;
          await loadInitialSongs();
        } else {
          renderViewContent();
        }
      } else {
        if (viewContainer) {
          viewContainer.style.setProperty('display', 'none', 'important');
        }
        // If not this route, restore other children unless analytics is active
        const isAnalyticsActive = hash.includes('analytics');
        if (!isAnalyticsActive) {
          Array.from(mainContainer.children).forEach(child => {
            if (child !== viewContainer && child.id !== 'feishin-analytics-dashboard' && child.style.display === 'none') {
              child.style.display = '';
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
    }, 60);
  }

  // 8. Listeners & Observer
  window.addEventListener('hashchange', scheduleMount);
  window.addEventListener('popstate', scheduleMount);

  setInterval(() => {
    const hash = window.location.hash || '';
    const shouldShow = hash.includes('recently-added');
    const view = document.getElementById('feishin-recently-added-view');
    if (shouldShow && (!view || view.style.display === 'none')) {
      scheduleMount();
    } else if (!shouldShow && view && view.style.display !== 'none') {
      scheduleMount();
    }
  }, 300);

  const observer = new MutationObserver((mutations) => {
    let needsSchedule = false;
    for (const m of mutations) {
      const t = m.target;
      if (t && (
        t.id === 'feishin-recently-added-view' ||
        t.closest?.('#feishin-recently-added-view') ||
        t.id === 'personal-os-sidebar-recently-added-item'
      )) {
        continue;
      }
      needsSchedule = true;
      break;
    }
    if (needsSchedule) scheduleMount();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial schedule
  scheduleMount();

  // Expose API
  window.__FEISHIN_RECENTLY_ADDED__ = {
    playAll,
    getSongs: () => cachedSongs,
    reload: loadInitialSongs,
    setViewMode: (m) => {
      currentViewMode = m;
      renderViewContent();
    }
  };

})();
