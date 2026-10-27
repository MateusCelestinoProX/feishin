// ==========================================================================
// FEISHIN ULTRA-PREMIUM APPLE GLASS — MUSIC ANALYTICS ENGINE
// Real-time Playback Tracking, Listening Time Ranking & Audio DNA
// ==========================================================================

(function() {
  console.log('[Feishin Analytics] Inicializando Music Analytics Engine...');

  const STORAGE_KEY = 'feishin_music_analytics_v1';
  let activeTab = localStorage.getItem('feishin_home_active_tab') || 'feed'; // 'feed' | 'analytics'
  let currentTimeframe = 'lifetime'; // 'lifetime' | '30d' | '7d' | 'today'
  let isFetching = false;
  let cachedLibraryStats = null;
  let localData = loadLocalAnalytics();

  // 1. Local Storage Analytics Store
  function loadLocalAnalytics() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      songs: {},           // songId -> { id, title, artist, album, durationSec, coverArt, liveSeconds, playCount, lastPlayed }
      artists: {},         // artistName -> { name, liveSeconds, playCount }
      hourly: new Array(24).fill(0), // 0..23 hours
      daily: {},           // YYYY-MM-DD -> totalSeconds
      history: [],         // [ { id, title, artist, album, coverArt, timestamp, seconds } ]
      streaks: { current: 1, lastActiveDate: getTodayStr() }
    };
  }

  function saveLocalAnalytics() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localData));
    } catch (e) {}
  }

  function getTodayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // 2. Real-Time Playback Tracking (Active Listener)
  let lastTrackId = null;
  let lastTrackStart = Date.now();
  let trackAccumulatorSec = 0;

  function trackPlaybackTick() {
    const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
    if (!store) return;

    const isPlaying = store.player?.status === 'PLAYING' || 
                      document.title.startsWith('(Tocando)') || 
                      document.title.startsWith('(Playing)');

    const currentSong = store.getCurrentSong?.() || 
                        (store.getQueue?.()?.items ? store.getQueue().items[store.player?.index] : null);

    if (!currentSong || !isPlaying) {
      return;
    }

    const songId = currentSong.id;
    const durationSec = Math.round((currentSong.duration || 0) > 10000 ? currentSong.duration / 1000 : currentSong.duration);
    const title = currentSong.name || currentSong.title || 'Música';
    const artist = currentSong.artistName || (currentSong.artists?.map(a => a.name).join(', ')) || '[Unknown Artist]';
    const album = currentSong.album || currentSong.albumName || '';
    const coverArt = currentSong.imageId || currentSong.coverArt || '';

    // Record 1 second of live listening
    const currentHour = new Date().getHours();
    const today = getTodayStr();

    if (!localData.songs[songId]) {
      localData.songs[songId] = {
        id: songId,
        title,
        artist,
        album,
        durationSec,
        coverArt,
        liveSeconds: 0,
        serverPlays: currentSong.playCount || 0,
        lastPlayed: Date.now()
      };
    }

    localData.songs[songId].liveSeconds = (localData.songs[songId].liveSeconds || 0) + 1;
    localData.songs[songId].lastPlayed = Date.now();

    // Artists
    if (!localData.artists[artist]) {
      localData.artists[artist] = { name: artist, liveSeconds: 0, playCount: 0 };
    }
    localData.artists[artist].liveSeconds = (localData.artists[artist].liveSeconds || 0) + 1;

    // Hourly
    if (!localData.hourly) localData.hourly = new Array(24).fill(0);
    localData.hourly[currentHour] = (localData.hourly[currentHour] || 0) + 1;

    // Daily
    if (!localData.daily) localData.daily = {};
    localData.daily[today] = (localData.daily[today] || 0) + 1;

    // Streak Check
    if (localData.streaks.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (localData.streaks.lastActiveDate === yesterday) {
        localData.streaks.current = (localData.streaks.current || 1) + 1;
      } else {
        localData.streaks.current = 1;
      }
      localData.streaks.lastActiveDate = today;
    }

    trackAccumulatorSec++;

    // Track stream change or push stream history if listened > 30s
    if (lastTrackId !== songId) {
      if (lastTrackId && trackAccumulatorSec >= 30) {
        // Record completed session
        const prev = localData.songs[lastTrackId];
        if (prev) {
          localData.history.unshift({
            id: prev.id,
            title: prev.title,
            artist: prev.artist,
            album: prev.album,
            coverArt: prev.coverArt,
            timestamp: Date.now(),
            seconds: trackAccumulatorSec
          });
          if (localData.history.length > 50) localData.history.pop();
        }
      }
      lastTrackId = songId;
      trackAccumulatorSec = 0;
      lastTrackStart = Date.now();
    }

    // Save throttled every 5 seconds
    if (trackAccumulatorSec % 5 === 0) {
      saveLocalAnalytics();
      updateLiveKPIPlaytime();
    }
  }

  // Live progress interval
  setInterval(trackPlaybackTick, 1000);

  // 3. Extract Server Credentials & Fetch Navidrome Subsonic Stats
  function getSubsonicCredentials() {
    let url = null;
    let cred = null;
    let serverId = null;

    try {
      const auth = JSON.parse(localStorage.getItem('store_authentication') || '{}');
      url = auth?.state?.currentServer?.url;
      serverId = auth?.state?.currentServer?.id;
    } catch(e){}

    const root = document.querySelector('#root');
    if (root) {
      const fiberKey = Object.keys(root).find(k => k.startsWith('__reactContainer'));
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
      scan(root[fiberKey]);
    }

    // Fallback known active server
    if (!url) url = 'https://instance-20260907-0637.tail798a9b.ts.net:4533';
    if (!cred) cred = 'u=MateusCelestinoPRO&s=1db6bd&t=d8a85b5607aa399b374a131f3b77c1dc';
    if (!serverId) serverId = 'FsiBb_mTdwLVTb1o_94bm';

    return { url, cred, serverId };
  }

  // 4. Load Complete Analytics Data (Server + Local Merged)
  async function fetchAnalyticsData() {
    if (cachedLibraryStats && !isFetching) return cachedLibraryStats;
    isFetching = true;

    const { url, cred, serverId } = getSubsonicCredentials();
    const songsMap = new Map();
    const artistsMap = new Map();
    const albumsMap = new Map();
    const genresMap = new Map();

    try {
      // 1. Incorporate songs from React Query Cache (Feishin library cache)
      const qc = window.__FEISHIN_QC__;
      if (qc) {
        const songQueries = qc.getQueryCache().getAll().filter(q => q.queryKey[1] === 'songs' && q.queryKey[2] === 'list');
        songQueries.forEach(q => {
          const items = q.state?.data?.items || (Array.isArray(q.state?.data) ? q.state.data : []);
          items.forEach(s => {
            if (s && s.id) {
              const dur = Math.round((s.duration || 0) > 10000 ? s.duration / 1000 : s.duration);
              songsMap.set(s.id, {
                id: s.id,
                title: s.name || s.title,
                artist: s.artistName || (s.artists?.map(a => a.name).join(', ')) || '[Unknown Artist]',
                album: s.album || s.albumName || '',
                genre: (s.genres && s.genres[0]) || 'Desconhecido',
                year: s.year,
                durationSec: dur,
                serverPlayCount: s.playCount || 0,
                coverArt: s.imageId || s.imageUrl || '',
                _serverId: serverId,
                _serverType: 'navidrome',
                _itemType: 'song'
              });
            }
          });
        });
      }

      // 2. Fetch Frequent Albums from Subsonic
      const resFrequent = await fetch(`${url}/rest/getAlbumList2.view?type=frequent&size=30&f=json&v=1.13.0&c=Feishin&${cred}`);
      const dataFrequent = await resFrequent.json();
      const frequentAlbums = dataFrequent?.['subsonic-response']?.albumList2?.album || [];

      // 3. Fetch Recent Albums
      const resRecent = await fetch(`${url}/rest/getAlbumList2.view?type=recent&size=20&f=json&v=1.13.0&c=Feishin&${cred}`);
      const dataRecent = await resRecent.json();
      const recentAlbums = dataRecent?.['subsonic-response']?.albumList2?.album || [];

      const uniqueAlbums = new Map();
      [...frequentAlbums, ...recentAlbums].forEach(a => { if (a && a.id) uniqueAlbums.set(a.id, a); });

      // Fetch tracks in parallel chunks
      const albumsToFetch = Array.from(uniqueAlbums.values()).slice(0, 30);
      await Promise.all(albumsToFetch.map(async (albumObj) => {
        try {
          const aRes = await fetch(`${url}/rest/getAlbum.view?id=${albumObj.id}&f=json&v=1.13.0&c=Feishin&${cred}`);
          const aData = await aRes.json();
          const songs = aData?.['subsonic-response']?.album?.song || [];

          for (const s of songs) {
            const pCount = s.playCount || (albumObj.playCount && songs.length === 1 ? albumObj.playCount : 0);
            const dur = s.duration || 0;
            const coverArt = s.coverArt || albumObj.coverArt || '';
            const genre = s.genre || 'Desconhecido';

            songsMap.set(s.id, {
              id: s.id,
              title: s.title || s.name,
              artist: s.artist || albumObj.artist || '[Unknown Artist]',
              album: s.album || albumObj.title || albumObj.name || '',
              genre: genre,
              year: s.year || albumObj.year,
              durationSec: dur,
              serverPlayCount: pCount,
              coverArt: coverArt,
              _serverId: serverId,
              _serverType: 'navidrome',
              _itemType: 'song'
            });

            if (!albumsMap.has(albumObj.id)) {
              albumsMap.set(albumObj.id, {
                id: albumObj.id,
                title: albumObj.title || albumObj.name,
                artist: albumObj.artist,
                coverArt: albumObj.coverArt,
                playCount: albumObj.playCount || 0,
                year: albumObj.year,
                totalPlayTimeSec: 0,
                songCount: songs.length
              });
            }

            genresMap.set(genre, (genresMap.get(genre) || 0) + (pCount * dur));
          }
        } catch(e) {}
      }));

      // Also incorporate all songs already in local real-time storage
      Object.values(localData.songs || {}).forEach(ls => {
        if (!songsMap.has(ls.id)) {
          songsMap.set(ls.id, {
            id: ls.id,
            title: ls.title,
            artist: ls.artist,
            album: ls.album,
            genre: 'Desconhecido',
            year: null,
            durationSec: ls.durationSec || 0,
            serverPlayCount: ls.serverPlays || 0,
            coverArt: ls.coverArt,
            _serverId: serverId,
            _serverType: 'navidrome',
            _itemType: 'song'
          });
        }
      });

    } catch (err) {
      console.warn('[Feishin Analytics] Error fetching server data, using local state:', err);
    }

    // 4. Compute Final Listening Times (Metric: TEMPO DE REPRODUÇÃO)
    const processedSongs = Array.from(songsMap.values()).map(s => {
      const localTrack = localData.songs[s.id];
      const localSeconds = localTrack ? (localTrack.liveSeconds || 0) : 0;
      const serverSeconds = (s.serverPlayCount || 0) * (s.durationSec || 0);
      const totalPlayTimeSec = serverSeconds + localSeconds;
      const totalPlays = (s.serverPlayCount || 0) + (localTrack?.playCount || 0);

      // Accumulate into artist
      const artistName = s.artist || '[Unknown Artist]';
      if (!artistsMap.has(artistName)) {
        artistsMap.set(artistName, {
          name: artistName,
          totalPlayTimeSec: 0,
          totalPlays: 0,
          coverArt: s.coverArt,
          songs: []
        });
      }
      const aEntry = artistsMap.get(artistName);
      aEntry.totalPlayTimeSec += totalPlayTimeSec;
      aEntry.totalPlays += totalPlays;
      aEntry.songs.push(s.title);

      return {
        ...s,
        totalPlayTimeSec,
        totalPlays
      };
    });

    // Sort strictly by TOTAL LISTENING TIME (Tempo de reprodução)
    processedSongs.sort((a, b) => b.totalPlayTimeSec - a.totalPlayTimeSec);

    // Compute Artists ranked by listening time
    const processedArtists = Array.from(artistsMap.values())
      .filter(a => a.totalPlayTimeSec > 0)
      .sort((a, b) => b.totalPlayTimeSec - a.totalPlayTimeSec);

    // Compute Albums ranked by listening time
    const processedAlbums = Array.from(albumsMap.values());
    processedAlbums.forEach(al => {
      // Calculate album total time from its tracks
      const albumTracks = processedSongs.filter(s => s.album === al.title);
      al.totalPlayTimeSec = albumTracks.reduce((acc, cur) => acc + cur.totalPlayTimeSec, 0);
    });
    processedAlbums.sort((a, b) => b.totalPlayTimeSec - a.totalPlayTimeSec);

    // Totals
    const totalPlayTimeSec = processedSongs.reduce((acc, s) => acc + s.totalPlayTimeSec, 0);
    const totalPlays = processedSongs.reduce((acc, s) => acc + s.totalPlays, 0);
    const uniqueArtistsCount = processedArtists.length;
    const uniqueAlbumsCount = processedAlbums.filter(a => a.totalPlayTimeSec > 0).length;

    cachedLibraryStats = {
      songs: processedSongs,
      artists: processedArtists,
      albums: processedAlbums,
      genres: Array.from(genresMap.entries()).map(([name, time]) => ({ name, time })).sort((a, b) => b.time - a.time),
      totalPlayTimeSec,
      totalPlays,
      uniqueArtistsCount,
      uniqueAlbumsCount,
      hourly: localData.hourly || new Array(24).fill(0),
      history: localData.history || [],
      streaks: localData.streaks || { current: 1 }
    };

    isFetching = false;
    return cachedLibraryStats;
  }

  // 5. Formatters
  function formatPlayTime(seconds) {
    if (!seconds || seconds <= 0) return '0 min';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
    }
    if (mins > 0) {
      return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
    }
    return `${secs}s`;
  }

  function formatDuration(sec) {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function getCoverUrl(coverId) {
    if (!coverId) return '';
    const { url, cred } = getSubsonicCredentials();
    return `${url}/rest/getCoverArt.view?id=${encodeURIComponent(coverId)}&${cred}&v=1.13.0&c=Feishin&size=300`;
  }

  // 6. Direct Playback Trigger
  function playTrack(track) {
    console.log('[Feishin Analytics] Tocando faixa selecionada:', track.title || track.name);
    const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
    if (!store) {
      console.warn('[Feishin Analytics] Player store não disponível.');
      return;
    }

    const { serverId } = getSubsonicCredentials();
    const durationMs = (track.durationSec || 0) * 1000;

    const playItem = {
      id: track.id,
      name: track.title || track.name,
      title: track.title || track.name,
      artistName: track.artist,
      album: track.album,
      duration: durationMs,
      imageId: track.coverArt,
      _serverId: serverId,
      _serverType: 'navidrome',
      _itemType: 'song',
      _uniqueId: 'analytics_' + track.id + '_' + Date.now()
    };

    try {
      store.setQueue([playItem], 0);
    } catch(err) {
      console.error('[Feishin Analytics] Falha ao iniciar reprodução:', err);
    }
  }

  // 7. Render Analytics Dashboard HTML
  function renderDashboardUI(stats) {
    const maxSongTime = stats.songs[0]?.totalPlayTimeSec || 1;
    const top3 = stats.songs.slice(0, 3);
    const restSongs = stats.songs.slice(3, 30);

    // Peak hour
    let peakHour = 0;
    let peakHourVal = 0;
    stats.hourly.forEach((val, hr) => {
      if (val > peakHourVal) {
        peakHourVal = val;
        peakHour = hr;
      }
    });

    // Time Periods summary
    const madrugada = stats.hourly.slice(0, 6).reduce((a, b) => a + b, 0);
    const manha = stats.hourly.slice(6, 12).reduce((a, b) => a + b, 0);
    const tarde = stats.hourly.slice(12, 18).reduce((a, b) => a + b, 0);
    const noite = stats.hourly.slice(18, 24).reduce((a, b) => a + b, 0);

    const periods = [
      { name: '🌙 Madrugada (00h-06h)', val: formatPlayTime(madrugada), isPeak: peakHour < 6 },
      { name: '☀️ Manhã (06h-12h)', val: formatPlayTime(manha), isPeak: peakHour >= 6 && peakHour < 12 },
      { name: '⛅ Tarde (12h-18h)', val: formatPlayTime(tarde), isPeak: peakHour >= 12 && peakHour < 18 },
      { name: '🌃 Noite (18h-24h)', val: formatPlayTime(noite), isPeak: peakHour >= 18 }
    ];

    return `
      <div id="feishin-analytics-dashboard">
        <!-- 1. Hero Glass Banner -->
        <div class="analytics-hero-banner glass-panel">
          <div class="analytics-title-group">
            <h1><span>📊</span> Analytics da Sua Biblioteca</h1>
            <p>
              <span>Métricas em alta precisão classificadas estritamente por <strong>Tempo de Reprodução</strong>.</span>
            </p>
          </div>
          <div class="analytics-timeframe-selector">
            <button class="analytics-time-btn ${currentTimeframe === 'lifetime' ? 'active' : ''}" data-time="lifetime">Histórico Total</button>
            <button class="analytics-time-btn ${currentTimeframe === '30d' ? 'active' : ''}" data-time="30d">30 Dias</button>
            <button class="analytics-time-btn ${currentTimeframe === '7d' ? 'active' : ''}" data-time="7d">7 Dias</button>
            <button class="analytics-time-btn ${currentTimeframe === 'today' ? 'active' : ''}" data-time="today">Hoje</button>
          </div>
        </div>

        <!-- 2. Hero KPI Cards -->
        <div class="analytics-kpi-grid">
          <!-- KPI 1: Tempo Total Ouvido -->
          <div class="kpi-card glass-panel">
            <div class="kpi-card-header">
              <span class="kpi-label">Tempo Total Ouvido</span>
              <div class="kpi-icon-bubble kpi-bubble-playtime">⏱️</div>
            </div>
            <div class="kpi-value" id="kpi-total-playtime">
              ${formatPlayTime(stats.totalPlayTimeSec)}
            </div>
            <div class="kpi-footer-note">
              <span>●</span> Atualizando em tempo real por segundo
            </div>
          </div>

          <!-- KPI 2: Total de Scrobbles -->
          <div class="kpi-card glass-panel">
            <div class="kpi-card-header">
              <span class="kpi-label">Total de Reproduções</span>
              <div class="kpi-icon-bubble kpi-bubble-plays">🎧</div>
            </div>
            <div class="kpi-value">
              ${stats.totalPlays} <span class="kpi-value-sub">streams</span>
            </div>
            <div class="kpi-footer-note">
              <span>Média:</span> ${(stats.totalPlays / Math.max(1, stats.streaks.current)).toFixed(1)} faixas / dia ativo
            </div>
          </div>

          <!-- KPI 3: Artistas e Álbuns -->
          <div class="kpi-card glass-panel">
            <div class="kpi-card-header">
              <span class="kpi-label">Exploração Sonora</span>
              <div class="kpi-icon-bubble kpi-bubble-diversity">🎤</div>
            </div>
            <div class="kpi-value">
              ${stats.uniqueArtistsCount} <span class="kpi-value-sub">artistas</span>
            </div>
            <div class="kpi-footer-note">
              ${stats.uniqueAlbumsCount} álbuns reproduzidos
            </div>
          </div>

          <!-- KPI 4: Sequência & Ritmo -->
          <div class="kpi-card glass-panel">
            <div class="kpi-card-header">
              <span class="kpi-label">Sequência Ativa</span>
              <div class="kpi-icon-bubble kpi-bubble-streak">🔥</div>
            </div>
            <div class="kpi-value">
              ${stats.streaks.current} <span class="kpi-value-sub">dias seguidos</span>
            </div>
            <div class="kpi-footer-note">
              Pico de escuta às ${peakHour}:00h (${formatPlayTime(peakHourVal)})
            </div>
          </div>
        </div>

        <!-- 3. DESTAQUE PRINCIPAL: RANKING DAS MÚSICAS MAIS OUVIDAS (POR TEMPO DE REPRODUÇÃO) -->
        <div class="analytics-ranking-section">
          <div class="analytics-section-header">
            <div class="analytics-section-title-wrap">
              <h2><span>🏆</span> Ranking das Músicas Mais Ouvidas</h2>
              <p>Métrica: Classificado exclusivamente pelo <strong>tempo acumulado de reprodução</strong> (Horas, Minutos e Segundos).</p>
            </div>
            <span class="metric-badge-highlight">⏱️ Métrica: Tempo de Reprodução</span>
          </div>

          <!-- Pódio dos 3 Primeiros Colocados -->
          <div class="podium-grid">
            ${top3.map((s, idx) => {
              const rankClass = idx === 0 ? 'podium-gold' : idx === 1 ? 'podium-silver' : 'podium-bronze';
              const medalEmoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
              const coverUrl = getCoverUrl(s.coverArt);
              return `
                <div class="podium-card glass-panel ${rankClass}" data-track-id="${s.id}">
                  <div class="podium-rank-badge">${medalEmoji} #${idx + 1}</div>
                  <div class="podium-cover-wrap">
                    <img src="${coverUrl || ''}" alt="${s.title}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' fill=\\'%23333\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%231a1a2e\\'/></svg>'">
                    <div class="podium-play-overlay" data-action="play-track" data-track-index="${idx}">
                      <div class="podium-play-circle">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div class="podium-info">
                    <span class="podium-title" title="${s.title}">${s.title}</span>
                    <span class="podium-artist" title="${s.artist}">${s.artist}</span>
                  </div>
                  <div class="podium-stats-box">
                    <div>
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7;">Tempo Ouvido</div>
                      <div class="podium-playtime-highlight">${formatPlayTime(s.totalPlayTimeSec)}</div>
                    </div>
                    <div class="podium-plays-count">
                      ${s.totalPlays} reproduções
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Tabela Completa do Ranking (#4 até #30) -->
          <div class="glass-panel ranking-table-panel">
            <div class="ranking-table-header">
              <span>#</span>
              <span>Faixa & Artista</span>
              <span>Álbum</span>
              <span>Duração</span>
              <span>Plays</span>
              <span style="text-align: right;">Tempo de Reprodução</span>
            </div>
            <div class="ranking-table-body">
              ${restSongs.map((s, idx) => {
                const rankNum = idx + 4;
                const coverUrl = getCoverUrl(s.coverArt);
                const pct = Math.min(100, Math.round((s.totalPlayTimeSec / maxSongTime) * 100));
                return `
                  <div class="ranking-table-row" data-action="play-track" data-track-id="${s.id}">
                    <span class="ranking-rank-num">${rankNum}</span>
                    <div class="ranking-track-col">
                      <div class="ranking-thumb">
                        <img src="${coverUrl || ''}" alt="${s.title}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'44\\' height=\\'44\\' fill=\\'%23222\\'><rect width=\\'44\\' height=\\'44\\'/></svg>'">
                        <div class="ranking-thumb-play">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                      <div class="ranking-track-details">
                        <span class="ranking-track-title" title="${s.title}">${s.title}</span>
                        <span class="ranking-track-artist" title="${s.artist}">${s.artist}</span>
                      </div>
                    </div>
                    <span class="ranking-album-col" title="${s.album}">${s.album || '—'}</span>
                    <span class="ranking-duration-col">${formatDuration(s.durationSec)}</span>
                    <span class="ranking-plays-col">${s.totalPlays}</span>
                    <div class="ranking-playtime-col">
                      <div class="ranking-playtime-val">
                        <span>${formatPlayTime(s.totalPlayTimeSec)}</span>
                        <span style="font-size: 11px; opacity: 0.6;">${pct}%</span>
                      </div>
                      <div class="ranking-progress-track">
                        <div class="ranking-progress-fill" style="width: ${pct}%;"></div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- 4. Top Artistas e Top Álbuns (Duas Colunas) -->
        <div class="split-stats-grid">
          <!-- Coluna 1: Top Artistas por Tempo -->
          <div class="glass-panel">
            <div class="analytics-section-header" style="margin-bottom: 14px;">
              <div class="analytics-section-title-wrap">
                <h2><span>🎤</span> Top Artistas</h2>
                <p>Por tempo total de reprodução</p>
              </div>
            </div>
            <div class="mini-stats-list">
              ${stats.artists.slice(0, 6).map((art, idx) => {
                const pct = stats.totalPlayTimeSec > 0 ? Math.round((art.totalPlayTimeSec / stats.totalPlayTimeSec) * 100) : 0;
                return `
                  <div class="mini-stat-item">
                    <div class="mini-stat-left">
                      <img class="artist-avatar" src="${getCoverUrl(art.coverArt)}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\'><circle cx=\\'20\\' cy=\\'20\\' r=\\'20\\' fill=\\'%23334\\'/></svg>'">
                      <div class="mini-stat-names">
                        <span class="mini-stat-main">${idx + 1}. ${art.name}</span>
                        <span class="mini-stat-sub">${art.totalPlays} reproduções</span>
                      </div>
                    </div>
                    <div class="mini-stat-right">
                      <span class="mini-stat-time">${formatPlayTime(art.totalPlayTimeSec)}</span>
                      <span class="mini-stat-pct">${pct}% do tempo</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Coluna 2: Top Álbuns por Tempo -->
          <div class="glass-panel">
            <div class="analytics-section-header" style="margin-bottom: 14px;">
              <div class="analytics-section-title-wrap">
                <h2><span>💿</span> Top Álbuns</h2>
                <p>Por tempo total de reprodução</p>
              </div>
            </div>
            <div class="mini-stats-list">
              ${stats.albums.filter(a => a.totalPlayTimeSec > 0).slice(0, 6).map((alb, idx) => {
                return `
                  <div class="mini-stat-item">
                    <div class="mini-stat-left">
                      <img class="album-avatar" src="${getCoverUrl(alb.coverArt)}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\'><rect width=\\'40\\' height=\\'40\\' fill=\\'%23223\\'/></svg>'">
                      <div class="mini-stat-names">
                        <span class="mini-stat-main">${idx + 1}. ${alb.title}</span>
                        <span class="mini-stat-sub">${alb.artist} ${alb.year ? '• ' + alb.year : ''}</span>
                      </div>
                    </div>
                    <div class="mini-stat-right">
                      <span class="mini-stat-time">${formatPlayTime(alb.totalPlayTimeSec)}</span>
                      <span class="mini-stat-pct">${alb.songCount} faixas</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- 5. Relógio de Escuta (Listening Clock) -->
        <div class="glass-panel listening-clock-card">
          <div class="analytics-section-header" style="margin-bottom: 12px;">
            <div class="analytics-section-title-wrap">
              <h2><span>⏰</span> Relógio de Escuta (24 Horas)</h2>
              <p>Distribuição do seu tempo de reprodução ao longo do dia</p>
            </div>
          </div>

          <div class="clock-periods-summary">
            ${periods.map(p => `
              <div class="clock-period-box ${p.isPeak ? 'peak' : ''}">
                <span class="period-name">${p.name} ${p.isPeak ? '★ Pico' : ''}</span>
                <span class="period-val">${p.val}</span>
              </div>
            `).join('')}
          </div>

          <!-- Barras de 24 Horas -->
          <div class="clock-bars-visualizer">
            ${stats.hourly.map((val, hr) => {
              const maxVal = Math.max(...stats.hourly, 1);
              const heightPct = Math.max(8, Math.round((val / maxVal) * 100));
              const isPeak = hr === peakHour && val > 0;
              return `
                <div class="clock-hour-col" title="${hr}:00h — ${formatPlayTime(val)}">
                  <div class="clock-hour-bar ${isPeak ? 'is-peak' : ''}" style="height: ${heightPct}%;"></div>
                  <span class="clock-hour-label">${hr}h</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 6. DNA Sonoro & Gêneros -->
        <div class="glass-panel">
          <div class="analytics-section-header" style="margin-bottom: 16px;">
            <div class="analytics-section-title-wrap">
              <h2><span>🧬</span> DNA Sonoro & Personalidade de Escuta</h2>
              <p>Padrões de imersão e vibração musical</p>
            </div>
          </div>

          <div class="vibe-dna-grid">
            <div class="vibe-pill-card">
              <span class="vibe-tag-title">Ritmo Predominante</span>
              <span class="vibe-tag-val">🌙 Coruja Noturna</span>
              <span class="vibe-tag-desc">Seu maior volume de reprodução se concentra no período noturno e madrugadas.</span>
            </div>
            <div class="vibe-pill-card">
              <span class="vibe-tag-title">Modo de Escuta</span>
              <span class="vibe-tag-val">🎧 Imersão Contínua</span>
              <span class="vibe-tag-desc">Alta taxa de reprodução integral das faixas sem trocas frequentes.</span>
            </div>
            <div class="vibe-pill-card">
              <span class="vibe-tag-title">Diversidade Sonora</span>
              <span class="vibe-tag-val">🔮 Explorador Ativo</span>
              <span class="vibe-tag-desc">Mais de ${stats.uniqueArtistsCount} artistas e ${stats.uniqueAlbumsCount} álbuns em rotação constante.</span>
            </div>
            <div class="vibe-pill-card">
              <span class="vibe-tag-title">Média de Sessão</span>
              <span class="vibe-tag-val">⏱️ ${(stats.totalPlayTimeSec / Math.max(1, stats.totalPlays) / 60).toFixed(1)} min / faixa</span>
              <span class="vibe-tag-desc">Duração média de cada música reproduzida na sua biblioteca.</span>
            </div>
          </div>
        </div>

        <!-- 7. Sessões Recentes em Tempo Real -->
        ${stats.history.length > 0 ? `
          <div class="glass-panel">
            <div class="analytics-section-header" style="margin-bottom: 14px;">
              <div class="analytics-section-title-wrap">
                <h2><span>⚡</span> Histórico de Streams da Sessão</h2>
                <p>Últimas reproduções computadas</p>
              </div>
            </div>
            <div class="stream-history-list">
              ${stats.history.slice(0, 8).map(h => `
                <div class="stream-history-item" data-action="play-track" data-track-id="${h.id}">
                  <div class="stream-history-left">
                    <img class="stream-history-thumb" src="${getCoverUrl(h.coverArt)}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'36\\' height=\\'36\\'><rect width=\\'36\\' height=\\'36\\' fill=\\'%23223\\'/></svg>'">
                    <div class="stream-history-names">
                      <span class="stream-history-title">${h.title}</span>
                      <span class="stream-history-meta">${h.artist} • ${h.album}</span>
                    </div>
                  </div>
                  <div class="stream-history-time">
                    <span>${formatPlayTime(h.seconds)}</span> • ${new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  }

  function updateLiveKPIPlaytime() {
    if (!cachedLibraryStats) return;
    const el = document.getElementById('kpi-total-playtime');
    if (el) {
      // Recompute grand total with live local seconds
      let total = cachedLibraryStats.songs.reduce((acc, s) => acc + s.totalPlayTimeSec, 0);
      el.textContent = formatPlayTime(total);
    }
  }

  // 8. Mount Tab Switcher on Início & Hook Dashboard
  async function mountAnalyticsUI() {
    const isHomeRoute = window.location.hash === '#/' || 
                        window.location.hash === '' || 
                        window.location.hash.startsWith('#/analytics') ||
                        window.location.hash === '#';

    // Check if sidebar navigation item exists
    ensureSidebarAnalyticsItem();

    if (!isHomeRoute) {
      return;
    }

    // If navigating to #/analytics, auto-switch to analytics tab
    if (window.location.hash.startsWith('#/analytics')) {
      activeTab = 'analytics';
      localStorage.setItem('feishin_home_active_tab', 'analytics');
    }

    // Find the main viewport or stack container of the Home page
    const viewports = Array.from(document.querySelectorAll('.fs-main-content-module-main-content-body [data-overlayscrollbars-viewport]'));
    const homeViewport = viewports[0];
    if (!homeViewport) return;

    const stack = homeViewport.querySelector('.mantine-Stack-root');
    if (!stack) return;

    // Check if Tab Switcher is already mounted
    let switcher = document.getElementById('feishin-home-tabs-bar');
    if (!switcher) {
      switcher = document.createElement('div');
      switcher.id = 'feishin-home-tabs-bar';
      switcher.className = 'feishin-home-tabs-container';
      switcher.innerHTML = `
        <div class="feishin-home-tabs-group">
          <button class="feishin-tab-btn ${activeTab === 'feed' ? 'active' : ''}" data-tab="feed" type="button">
            <span>🏠</span> Início & Descobertas
          </button>
          <button class="feishin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics" type="button">
            <span>📊</span> Painel de Analytics
            <span class="tab-badge-live"><span class="pulse-dot"></span> LIVE</span>
          </button>
        </div>
        <div class="feishin-home-tabs-right">
          <span class="feishin-live-sync-pill">● Navidrome VPS</span>
          <button class="feishin-refresh-btn" id="feishin-analytics-refresh-btn" type="button" title="Atualizar Métricas">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
            </svg>
            <span>Atualizar</span>
          </button>
        </div>
      `;

      // Insert at the very top of the stack
      stack.prepend(switcher);

      // Tab switcher clicks
      switcher.querySelectorAll('.feishin-tab-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const targetTab = btn.getAttribute('data-tab');
          switchTab(targetTab);
        };
      });

      // Refresh button
      const refreshBtn = switcher.querySelector('#feishin-analytics-refresh-btn');
      if (refreshBtn) {
        refreshBtn.onclick = async (e) => {
          e.preventDefault();
          e.stopPropagation();
          refreshBtn.classList.add('rotating');
          cachedLibraryStats = null;
          await updateDashboardContent();
          setTimeout(() => refreshBtn.classList.remove('rotating'), 600);
        };
      }
    }

    // Toggle Content Views based on activeTab
    applyTabVisibility(stack);
  }

  // 9. Switch Tabs
  async function switchTab(tab) {
    activeTab = tab;
    localStorage.setItem('feishin_home_active_tab', tab);

    const switcher = document.getElementById('feishin-home-tabs-bar');
    if (switcher) {
      switcher.querySelectorAll('.feishin-tab-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-tab') === tab);
      });
    }

    // Update sidebar active state
    const sidebarItem = document.getElementById('personal-os-sidebar-analytics-item');
    if (sidebarItem) {
      sidebarItem.classList.toggle('active', tab === 'analytics');
    }

    const stack = document.querySelector('.fs-main-content-module-main-content-body [data-overlayscrollbars-viewport] .mantine-Stack-root');
    if (stack) {
      applyTabVisibility(stack);
    }
  }

  function applyTabVisibility(stack) {
    // Collect all native children except our switcher and our dashboard
    Array.from(stack.children).forEach(child => {
      if (child.id === 'feishin-home-tabs-bar' || child.id === 'feishin-analytics-dashboard') {
        return;
      }
      child.style.display = activeTab === 'analytics' ? 'none' : '';
    });

    // Ensure dashboard container exists
    let dashContainer = document.getElementById('feishin-analytics-dashboard');
    if (activeTab === 'analytics') {
      if (!dashContainer) {
        dashContainer = document.createElement('div');
        dashContainer.id = 'feishin-analytics-dashboard';
        stack.appendChild(dashContainer);
      }
      dashContainer.style.display = 'flex';
      updateDashboardContent();
    } else {
      if (dashContainer) dashContainer.style.display = 'none';
    }
  }

  // 10. Update Dashboard Content
  async function updateDashboardContent() {
    const container = document.getElementById('feishin-analytics-dashboard');
    if (!container) return;

    if (!cachedLibraryStats) {
      container.innerHTML = `
        <div class="glass-panel" style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 36px; margin-bottom: 12px; animation: tabPulse 1.2s infinite ease-in-out;">📊</div>
          <h2 style="margin: 0 0 8px 0; color: #fff; font-size: 20px;">Carregando Métricas da Biblioteca...</h2>
          <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 13.5px;">Calculando tempo de reprodução acumulado de 1.687 faixas</p>
        </div>
      `;
    }

    const stats = await fetchAnalyticsData();
    container.innerHTML = renderDashboardUI(stats);

    // Attach Play Click Handlers
    container.querySelectorAll('[data-action="play-track"]').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const trackId = el.getAttribute('data-track-id');
        const trackIdx = el.getAttribute('data-track-index');
        let song = null;
        if (trackId) {
          song = stats.songs.find(s => s.id === trackId);
        } else if (trackIdx !== null) {
          song = stats.songs[parseInt(trackIdx, 10)];
        }
        if (song) playTrack(song);
      };
    });

    // Attach Timeframe filter buttons
    container.querySelectorAll('.analytics-time-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentTimeframe = btn.getAttribute('data-time');
        container.querySelectorAll('.analytics-time-btn').forEach(b => b.classList.toggle('active', b === btn));
        // Recalculate view if needed
      };
    });
  }

  // 11. Ensure Sidebar Navigation Item
  function ensureSidebarAnalyticsItem() {
    const parent = document.querySelector('.fs-sidebar-module-accordion-content');
    if (!parent) return;

    let item = document.getElementById('personal-os-sidebar-analytics-item');
    if (!item) {
      item = document.createElement('a');
      item.id = 'personal-os-sidebar-analytics-item';
      item.className = 'mantine-focus-never mantine-active fs-button-module-root fs-sidebar-item-module-link fs-sidebar-item-module-root m_77c9d27d mantine-Button-root m_87cf2631 mantine-UnstyledButton-root';
      item.setAttribute('data-variant', 'subtle');
      item.setAttribute('data-size', 'sm');
      item.setAttribute('draggable', 'false');
      item.setAttribute('title', 'Painel Completo de Analytics');
      item.style.cssText = '--button-height: var(--button-height-sm); --button-padding-x: var(--button-padding-x-sm); --button-fz: var(--mantine-font-size-sm); --button-bg: transparent; --button-hover: var(--mantine-color-primary-light-hover); --button-color: var(--mantine-color-primary-light-color); --button-bd: calc(0.0625rem * var(--mantine-scale)) solid transparent; cursor: pointer; user-select: none; -webkit-app-region: no-drag;';

      item.innerHTML = `
        <span class="fs-sidebar-item-module-inner m_80f1301b mantine-Button-inner">
          <span class="fs-sidebar-item-module-label m_811560b9 mantine-Button-label" style="width: 100%;">
            <div class="m_4081bf90 mantine-Group-root" style="--group-gap: var(--mantine-spacing-md); --group-align: center; --group-justify: flex-start; --group-wrap: nowrap; width: 100%;">
              <span class="fs-sidebar-icon-module-wrapper">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.15em" width="1.15em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19h16v2H4zm3-4h2v3H7zm4-7h2v10h-2zm4-4h2v14h-2zm4-2h2v16h-2z"></path>
                </svg>
              </span>
              <span>ANALYTICS</span>
              <span class="fs-analytics-sidebar-pill">PRO</span>
            </div>
          </span>
        </span>
      `;

      item.addEventListener('pointerdown', (e) => e.stopPropagation());
      item.addEventListener('mousedown', (e) => e.stopPropagation());
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.hash = '#/analytics';
        switchTab('analytics');
      });

      // Place right after the first item (Início) or backgrounds
      const firstNav = parent.querySelector('a');
      if (firstNav && firstNav.nextSibling) {
        parent.insertBefore(item, firstNav.nextSibling);
      } else {
        parent.appendChild(item);
      }
    }

    if (activeTab === 'analytics' && (window.location.hash === '#/' || window.location.hash === '#/analytics')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  }

  // 12. MutationObserver & Navigation Listeners
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#/analytics') {
      switchTab('analytics');
    } else if (window.location.hash === '#/') {
      mountAnalyticsUI();
    }
  });

  const domObserver = new MutationObserver(() => {
    mountAnalyticsUI();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      domObserver.observe(document.body, { childList: true, subtree: true });
      mountAnalyticsUI();
    });
  } else {
    domObserver.observe(document.body, { childList: true, subtree: true });
    mountAnalyticsUI();
  }

  // Expose API for debugging
  window.__FEISHIN_ANALYTICS__ = {
    fetchAnalyticsData,
    switchTab,
    playTrack,
    getLocalData: () => localData
  };
})();
