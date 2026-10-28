/**
 * FEISHIN MOBILE PRO — MOTOR NATIVO ANDROID & LIQUID GLASS ORCHESTRATOR
 * Arquitetura Mobile Especializada para Samsung Galaxy S22 Ultra
 * - Sanitização de Tabelas: Rolagem infinita contínua (sem paginação de desktop)
 * - Single-Tap Instant Playback em hardware real
 * - Bottom Navigation Bar Liquid Glass com Thumb-Zone Design
 * - Sincronização direta com MediaSession e Android Foreground Service
 * - Suporte total aos 33 Shaders WebGL em Fullscreen Edge-to-Edge
 */

(function () {
    console.log('[FeishinMobile] Inicializando Motor Nativo Liquid Glass...');

    // 1. Sanitização Definitiva de Preferências & Layout
    function sanitizeSettings() {
        try {
            const rawSettings = localStorage.getItem('store_settings');
            let s = rawSettings ? JSON.parse(rawSettings) : {};
            let changed = false;

            if (!s.state) s.state = {};
            if (!s.state.general) s.state.general = {};

            // Forçar idioma oficial Português do Brasil ("Faixas 1736")
            if (s.state.general.language !== 'pt-BR') {
                s.state.general.language = 'pt-BR';
                changed = true;
            }

            // Otimizações Críticas de Performance e Latência de Reprodução
            if (!s.state.playback) s.state.playback = {};
            if (s.state.playback.audioFadeOnStatusChange !== false) {
                s.state.playback.audioFadeOnStatusChange = false; // Elimina rampa de 300ms de delay no som
                changed = true;
            }
            if (s.state.playback.confirmQueueChanges !== false) {
                s.state.playback.confirmQueueChanges = false; // Toca na hora sem diálogos
                changed = true;
            }
            if (!s.state.playback.transcode || s.state.playback.transcode.enabled !== false || s.state.playback.transcode.format !== 'raw') {
                s.state.playback.transcode = {
                    enabled: false,
                    format: 'raw',
                    bitrate: 0,
                    maxSampleRate: 0
                };
                changed = true;
            }

            // Otimizar todas as listas de músicas para o padrão mobile (Full-screen & Infinity)
            if (!s.state.lists) s.state.lists = {};
            const listKeys = ['song', 'playlistSong', 'albumDetail', 'queueSong', 'albumArtistSong', 'genreSong', 'folder'];

            listKeys.forEach(key => {
                if (!s.state.lists[key]) s.state.lists[key] = {};
                const list = s.state.lists[key];

                // Forçar rolagem infinita contínua (elimina qualquer quebra de páginas)
                if (list.pagination !== 'infinite') {
                    list.pagination = 'infinite';
                    changed = true;
                }
                if (list.display !== 'table') {
                    list.display = 'table';
                    changed = true;
                }
                if (list.itemsPerPage !== 100) {
                    list.itemsPerPage = 100;
                    changed = true;
                }

                if (!list.table) list.table = {};
                if (list.table.enableHeader !== false) {
                    list.table.enableHeader = false; // Remove cabeçalho desktop redundante
                    changed = true;
                }
                if (list.table.size !== 'default') {
                    list.table.size = 'default';
                    changed = true;
                }

                // Ajustar colunas mobile ideais (Layout unificado sem pin desincronizado)
                if (list.table.columns && Array.isArray(list.table.columns)) {
                    list.table.columns.forEach(col => {
                        col.pinned = null; // Unifica a rolagem virtual em um único container

                        if (col.id === 'rowIndex') {
                            if (!col.isEnabled || col.width !== 32) {
                                col.isEnabled = true;
                                col.width = 32;
                                changed = true;
                            }
                        } else if (col.id === 'titleCombined') {
                            if (!col.isEnabled || col.width !== 520) {
                                col.isEnabled = true;
                                col.width = 520;
                                changed = true;
                            }
                        } else if (col.id === 'duration') {
                            if (!col.isEnabled || col.width !== 50) {
                                col.isEnabled = true;
                                col.width = 50;
                                changed = true;
                            }
                        } else if (col.id === 'actions') {
                            if (!col.isEnabled || col.width !== 38) {
                                col.isEnabled = true;
                                col.width = 38;
                                changed = true;
                            }
                        } else {
                            if (col.isEnabled) {
                                col.isEnabled = false;
                                changed = true;
                            }
                        }
                    });
                }
            });

            if (changed) {
                localStorage.setItem('store_settings', JSON.stringify(s));
                console.log('[FeishinMobile] Preferências de exibição mobile aplicadas com sucesso.');
            }

            // Sanitização de osTranscodeDecision no store_authentication para eliminação de RTT na VPS
            try {
                const existingAuth = localStorage.getItem('store_authentication');
                if (existingAuth && existingAuth !== 'null') {
                    const parsedAuth = JSON.parse(existingAuth);
                    let authModified = false;
                    if (parsedAuth?.state?.currentServer?.features?.osTranscodeDecision) {
                        delete parsedAuth.state.currentServer.features.osTranscodeDecision;
                        authModified = true;
                    }
                    if (parsedAuth?.state?.serverList) {
                        Object.keys(parsedAuth.state.serverList).forEach(k => {
                            if (parsedAuth.state.serverList[k]?.features?.osTranscodeDecision) {
                                delete parsedAuth.state.serverList[k].features.osTranscodeDecision;
                                authModified = true;
                            }
                        });
                    }
                    if (authModified) {
                        localStorage.setItem('store_authentication', JSON.stringify(parsedAuth));
                        console.log('[FeishinMobile] osTranscodeDecision purgado do cache de autenticação.');
                    }
                }
            } catch (err) {
                console.warn('[FeishinMobile] Erro ao sanitizar store_authentication:', err);
            }

            // Credenciais Navidrome VPS (Inicialização se vazio)
            const authStr = localStorage.getItem('store_authentication');
            if (!authStr || authStr === 'null' || authStr === '{}') {
                const defaultAuth = {
                    state: {
                        actions: {},
                        currentServer: {
                            credential: "u=MateusCelestinoPRO&s=1db6bd&t=d8a85b5607aa399b374a131f3b77c1dc",
                            id: "FsiBb_mTdwLVTb1o_94bm",
                            isAdmin: true,
                            name: "Navidrome VPS",
                            type: "navidrome",
                            url: "https://instance-20260907-0637.tail798a9b.ts.net:4533",
                            userId: "3xPL1BPoVa1ulwc1UkzYU6",
                            username: "MateusCelestinoPRO",
                            preferRemoteUrl: false,
                            ndCredential: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG0iOnRydWUsImV4cCI6MTc5MzIzMzk2OSwiaWF0IjoxNzkzMDM5ODg0LCJpc3MiOiJORCIsInN1YiI6Ik1hdGV1c0NlbGVzdGlub1BSTyIsInVpZCI6IjN4UEwxQlBvVmExdWx3YzFVa3pZVTYifQ.O_8I9A0bohAgOlk6ohEEMVX2PZp25kLw7dIthV1sCsM",
                            features: {
                                lyricsMultipleStructured: [1, 2],
                                osFormPost: [1],
                                serverPlayQueue: [2, 1],
                                reportPlayback: [1],
                                topSongsByArtistId: [1],
                                artistImageUpload: [1],
                                internetRadioImageUpload: [1],
                                playlistImageUpload: [1],
                                trackYesNoRatingFilter: [1],
                                trackAlbumArtistSearch: [1],
                                bfr: [1],
                                tags: [1],
                                sharingAlbumSong: [1],
                                playlistsSmart: [1],
                                publicPlaylist: [1],
                                albumYesNoRatingFilter: [1],
                                jukebox: [1],
                                musicFolderMultiselect: [1]
                            },
                            version: "0.64.2 (10114574)"
                        },
                        deviceId: "7LuHDSkII4F8eaRFsTo4e",
                        serverList: {
                            "FsiBb_mTdwLVTb1o_94bm": {
                                credential: "u=MateusCelestinoPRO&s=1db6bd&t=d8a85b5607aa399b374a131f3b77c1dc",
                                id: "FsiBb_mTdwLVTb1o_94bm",
                                isAdmin: true,
                                name: "Navidrome VPS",
                                type: "navidrome",
                                url: "https://instance-20260907-0637.tail798a9b.ts.net:4533",
                                userId: "3xPL1BPoVa1ulwc1UkzYU6",
                                username: "MateusCelestinoPRO",
                                preferRemoteUrl: false,
                                ndCredential: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG0iOnRydWUsImV4cCI6MTc5MzIzMzk2OSwiaWF0IjoxNzkzMDM5ODg0LCJpc3MiOiJORCIsInN1YiI6Ik1hdGV1c0NlbGVzdGlub1BSTyIsInVpZCI6IjN4UEwxQlBvVmExdWx3YzFVa3pZVTYifQ.O_8I9A0bohAgOlk6ohEEMVX2PZp25kLw7dIthV1sCsM",
                                features: {
                                    lyricsMultipleStructured: [1, 2],
                                    osFormPost: [1],
                                    serverPlayQueue: [2, 1],
                                    reportPlayback: [1],
                                    topSongsByArtistId: [1],
                                    artistImageUpload: [1],
                                    internetRadioImageUpload: [1],
                                    playlistImageUpload: [1],
                                    trackYesNoRatingFilter: [1],
                                    trackAlbumArtistSearch: [1],
                                    bfr: [1],
                                    tags: [1],
                                    sharingAlbumSong: [1],
                                    playlistsSmart: [1],
                                    publicPlaylist: [1],
                                    albumYesNoRatingFilter: [1],
                                    jukebox: [1],
                                    musicFolderMultiselect: [1]
                                },
                                version: "0.64.2 (10114574)"
                            }
                        }
                    },
                    version: 2
                };
                localStorage.setItem('store_authentication', JSON.stringify(defaultAuth));
            }
        } catch (e) {
            console.warn('[FeishinMobile] Erro na sanitização:', e);
        }
    }

    sanitizeSettings();

    // 2. Ponte Nativa Android
    window.FeishinNative = {
        play: function () {
            const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
            if (store && typeof store.mediaPlay === 'function') {
                const cur = store.player?.currentSong;
                if (cur?._uniqueId) store.mediaPlay(cur._uniqueId);
                else store.mediaTogglePlayPause?.();
            }
        },
        pause: function () {
            const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
            if (store && typeof store.mediaPause === 'function') {
                store.mediaPause();
            }
        },
        togglePlay: function () {
            const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
            if (store && typeof store.mediaTogglePlayPause === 'function') {
                store.mediaTogglePlayPause();
            }
        },
        next: function () {
            const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
            if (store && typeof store.mediaNext === 'function') {
                store.mediaNext();
            }
        },
        prev: function () {
            const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
            if (store && typeof store.mediaPrevious === 'function') {
                store.mediaPrevious();
            }
        },
        seekTo: function (seconds) {
            const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
            if (store && typeof store.mediaSeekToTimestamp === 'function') {
                store.mediaSeekToTimestamp(seconds);
            }
        },
        openFullscreenPlayer: function () {
            if (window.FeishinTrackPage) {
                window.FeishinTrackPage.open();
                return;
            }
            const fsStore = window.__FEISHIN_FULLSCREEN_STORE__ || window.__FEISHIN_PLAYER_STORE__;
            if (fsStore && typeof fsStore.setState === 'function') {
                fsStore.setState({ expanded: true });
                return;
            }
            const trigger = document.querySelector('.fs-mobile-playerbar-module-container, [class*="mobilePlayerbar"], #player-bar');
            if (trigger) trigger.click();
        },
        openSidebarDrawer: function () {
            // Disparar o botão nativo do drawer do Mantine no Feishin
            const drawerBtn = document.querySelector('.fs-mobile-layout-module-drawer-button, button[aria-label="Menu"]');
            if (drawerBtn) {
                drawerBtn.click();
            } else {
                const headerMenuBtn = document.getElementById('feishin-header-menu-btn');
                if (headerMenuBtn) headerMenuBtn.click();
            }
        },
        openMoreMenu: function () {
            const moreBox = document.getElementById('feishin-more-glass-box');
            const backdrop = document.getElementById('feishin-more-glass-backdrop');
            if (moreBox && backdrop) {
                moreBox.classList.add('open');
                backdrop.classList.add('open');
                if (typeof window.__feishinSyncActiveTabs === 'function') {
                    window.__feishinSyncActiveTabs();
                }
            }
        },
        closeMoreMenu: function () {
            const moreBox = document.getElementById('feishin-more-glass-box');
            const backdrop = document.getElementById('feishin-more-glass-backdrop');
            if (moreBox && backdrop) {
                moreBox.classList.remove('open');
                backdrop.classList.remove('open');
                if (typeof window.__feishinSyncActiveTabs === 'function') {
                    window.__feishinSyncActiveTabs();
                }
            }
        },
        toggleMoreMenu: function () {
            const moreBox = document.getElementById('feishin-more-glass-box');
            if (moreBox && moreBox.classList.contains('open')) {
                window.FeishinNative.closeMoreMenu();
            } else {
                window.FeishinNative.openMoreMenu();
            }
        },
        toggleBackgrounds: function () {
            window.FeishinNative.closeMoreMenu();
            if (typeof window.togglePersonalOSBackgrounds === 'function') {
                window.togglePersonalOSBackgrounds();
            } else {
                const bgModal = document.getElementById('personal-os-shader-modal');
                const bgBackdrop = document.getElementById('personal-os-shader-backdrop');
                if (bgModal && bgBackdrop) {
                    const isOpen = bgModal.style.display === 'flex' || bgModal.style.display === 'block';
                    bgModal.style.setProperty('display', isOpen ? 'none' : 'flex', 'important');
                    bgBackdrop.style.setProperty('display', isOpen ? 'none' : 'block', 'important');
                } else {
                    document.getElementById('personal-os-sidebar-backgrounds-item')?.click();
                }
            }
            if (typeof window.__feishinSyncActiveTabs === 'function') {
                window.__feishinSyncActiveTabs();
            }
        },
        openSettings: function () {
            window.FeishinNative.closeMoreMenu();
            if (typeof window.openFeishinSettings === 'function') {
                window.openFeishinSettings();
            }
            window.location.hash = '#/settings';
            if (typeof window.__feishinSyncActiveTabs === 'function') {
                window.__feishinSyncActiveTabs();
            }
        },
        handleBackPress: function () {
            // 0. Fechar Página de Faixa Liquid Glass se aberta
            if (window.FeishinTrackPage && window.FeishinTrackPage.isOpen()) {
                const lyricsOpen = document.getElementById('feishin-tp-lyrics-sheet')?.classList.contains('open');
                const queueOpen = document.getElementById('feishin-tp-queue-sheet')?.classList.contains('open');
                const timerOpen = document.getElementById('feishin-tp-timer-backdrop')?.classList.contains('open');
                if (lyricsOpen) {
                    document.getElementById('feishin-tp-lyrics-sheet').classList.remove('open');
                    return true;
                }
                if (queueOpen) {
                    document.getElementById('feishin-tp-queue-sheet').classList.remove('open');
                    return true;
                }
                if (timerOpen) {
                    document.getElementById('feishin-tp-timer-backdrop').classList.remove('open');
                    return true;
                }
                window.FeishinTrackPage.close();
                return true;
            }

            // 1. Fechar popup "Mais" se aberto
            const moreBox = document.getElementById('feishin-more-glass-box');
            if (moreBox && moreBox.classList.contains('open')) {
                window.FeishinNative.closeMoreMenu();
                return true;
            }

            // 2. Fechar modal de backgrounds se aberto
            const shaderModal = document.getElementById('personal-os-shader-modal');
            if (shaderModal && (shaderModal.style.display === 'flex' || shaderModal.style.display === 'block')) {
                const shaderBackdrop = document.getElementById('personal-os-shader-backdrop');
                shaderModal.style.setProperty('display', 'none', 'important');
                if (shaderBackdrop) shaderBackdrop.style.setProperty('display', 'none', 'important');
                if (typeof window.__feishinSyncActiveTabs === 'function') {
                    window.__feishinSyncActiveTabs();
                }
                return true;
            }

            // 3. Fechar Fullscreen Player se aberto
            const fsOverlay = document.querySelector('[class*="fullScreenPlayerOverlay"], #full-screen-player');
            if (fsOverlay && fsOverlay.offsetParent !== null) {
                const closeBtn = fsOverlay.querySelector('button[aria-label*="arrowDown"], button[aria-label*="Close"], button[aria-label*="Fechar"], .fs-action-icon');
                if (closeBtn) {
                    closeBtn.click();
                    return true;
                }
            }

            // 4. Fechar Drawer da biblioteca se aberto
            const drawerOverlay = document.querySelector('.mantine-Drawer-overlay');
            if (drawerOverlay && drawerOverlay.offsetParent !== null) {
                drawerOverlay.click();
                return true;
            }

            // 5. Voltar rota interna se não estiver na raiz
            if (window.location.hash && window.location.hash !== '#/library/songs' && window.location.hash !== '#/') {
                window.history.back();
                return true;
            }

            return false;
        }
    };

    // 3. Montagem da Bottom Navigation Bar e Popup Box "Mais"
    function setupBottomNav() {
        if (document.getElementById('feishin-mobile-bottom-nav')) return;

        // A. Backdrop e Box Elegante de Vidro para "Mais"
        const moreBackdrop = document.createElement('div');
        moreBackdrop.id = 'feishin-more-glass-backdrop';
        moreBackdrop.addEventListener('click', () => {
            window.FeishinNative.closeMoreMenu();
        });
        document.body.appendChild(moreBackdrop);

        const moreBox = document.createElement('div');
        moreBox.id = 'feishin-more-glass-box';
        moreBox.innerHTML = `
            <div class="feishin-more-header">
                <div class="feishin-more-pill-handle"></div>
                <div class="feishin-more-title-row">
                    <span class="feishin-more-title">Biblioteca & Opções</span>
                    <button class="feishin-more-close-btn" id="feishin-more-close-btn" aria-label="Fechar">✕</button>
                </div>
            </div>
            <div class="feishin-more-grid">
                <button class="feishin-more-item" data-route="#/analytics" aria-label="Analytics">
                    <div class="feishin-more-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                    </div>
                    <span class="feishin-more-item-label">Analytics</span>
                    <span class="feishin-more-badge-pro">PRO</span>
                </button>

                <button class="feishin-more-item" data-route="#/favorites" aria-label="Favoritos">
                    <div class="feishin-more-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </div>
                    <span class="feishin-more-item-label">Favoritos</span>
                </button>

                <button class="feishin-more-item" data-route="#/library/recently-added" aria-label="Recentes">
                    <div class="feishin-more-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                    </div>
                    <span class="feishin-more-item-label">Recentes</span>
                </button>

                <button class="feishin-more-item" data-route="#/library/album-artists" aria-label="Artistas do Álbum">
                    <div class="feishin-more-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                    </div>
                    <span class="feishin-more-item-label">Artistas Álbum</span>
                </button>

                <button class="feishin-more-item" data-route="#/library/folders" aria-label="Pastas">
                    <div class="feishin-more-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                    </div>
                    <span class="feishin-more-item-label">Pastas</span>
                </button>

                <button class="feishin-more-item" data-route="#/radio" aria-label="Estações de Rádio">
                    <div class="feishin-more-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM4 8h16v12H4V8zm4 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    </div>
                    <span class="feishin-more-item-label">Rádio</span>
                </button>

                <button class="feishin-more-item" data-route="#/playlists" aria-label="Playlists">
                    <div class="feishin-more-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9H2v2h17V9zm0-4H2v2h17V5zM2 15h11v-2H2v2zm14-2v6l5-3-5-3z"/></svg>
                    </div>
                    <span class="feishin-more-item-label">Playlists</span>
                </button>

                <button class="feishin-more-item" id="feishin-more-drawer-btn" aria-label="Menu Lateral">
                    <div class="feishin-more-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                    </div>
                    <span class="feishin-more-item-label">Menu Completo</span>
                </button>
            </div>
        `;
        document.body.appendChild(moreBox);

        // Click no botão fechar do box Mais
        document.getElementById('feishin-more-close-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            window.FeishinNative.closeMoreMenu();
        });

        // Click nos itens dentro de Mais
        moreBox.querySelectorAll('.feishin-more-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.AndroidBridge?.vibrate) window.AndroidBridge.vibrate(15);
                const route = item.getAttribute('data-route');
                window.FeishinNative.closeMoreMenu();
                if (route) {
                    window.location.hash = route;
                } else if (item.id === 'feishin-more-drawer-btn') {
                    window.FeishinNative.openSidebarDrawer();
                }
            });
        });

        // B. Dock Android (Barra Inferior)
        // Ordem estrita solicitada: Faixas, Tags, Artistas, Backgrounds (antepenúltimo), Mais (penúltimo), Conf (último)
        const bottomNav = document.createElement('nav');
        bottomNav.id = 'feishin-mobile-bottom-nav';
        bottomNav.innerHTML = `
            <button class="feishin-nav-tab active" data-route="#/library/songs" aria-label="Faixas">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                <span class="feishin-nav-label">Faixas</span>
            </button>
            <button class="feishin-nav-tab" data-route="#/library/genres" aria-label="Tags">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
                <span class="feishin-nav-label">Tags</span>
            </button>
            <button class="feishin-nav-tab" data-route="#/library/artists" aria-label="Artistas">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                <span class="feishin-nav-label">Artistas</span>
            </button>
            <button class="feishin-nav-tab" id="feishin-nav-backgrounds-btn" aria-label="Backgrounds">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C12.55 22 13 21.55 13 21C13 20.75 12.9 20.53 12.75 20.36C12.6 20.19 12.5 19.97 12.5 19.72C12.5 19.17 12.95 18.72 13.5 18.72H15C18.86 18.72 22 15.58 22 11.72C22 6.36 17.52 2 12 2ZM12 4C16.41 4 20 7.46 20 11.72C20 14.48 17.76 16.72 15 16.72H13.5C11.85 16.72 10.5 18.07 10.5 19.72C10.5 20.24 10.7 20.71 11.02 21.07C11.13 21.19 11.2 21.34 11.2 21.5C11.2 21.78 10.98 22 10.7 22H12C6.49 22 2 17.51 2 12C2 6.49 6.49 4 12 4ZM6.5 10C5.67 10 5 10.67 5 11.5C5 12.33 5.67 13 6.5 13C7.33 13 8 12.33 8 11.5C8 10.67 7.33 10 6.5 10ZM9.5 7C8.67 7 8 7.67 8 8.5C8 9.33 8.67 10 9.5 10C10.33 10 11 9.33 11 8.5C11 7.67 10.33 7 9.5 7ZM14.5 7C13.67 7 13 7.67 13 8.5C13 9.33 13.67 10 14.5 10C15.33 10 16 9.33 16 8.5C16 7.67 15.33 7 14.5 7ZM17.5 10C16.67 10 16 10.67 16 11.5C16 12.33 16.67 13 17.5 13C18.33 13 19 12.33 19 11.5C19 10.67 18.33 10 17.5 10Z"/></svg>
                <span class="feishin-nav-label">Backgrounds</span>
            </button>
            <button class="feishin-nav-tab" id="feishin-nav-more-btn" aria-label="Mais">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                <span class="feishin-nav-label">Mais</span>
            </button>
            <button class="feishin-nav-tab" id="feishin-nav-settings-btn" data-route="#/settings" aria-label="Conf">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span class="feishin-nav-label">Conf</span>
            </button>
        `;

        bottomNav.querySelectorAll('.feishin-nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                if (window.AndroidBridge?.vibrate) window.AndroidBridge.vibrate(15);
                const route = tab.getAttribute('data-route');
                if (tab.id === 'feishin-nav-backgrounds-btn') {
                    window.FeishinNative.toggleBackgrounds();
                } else if (tab.id === 'feishin-nav-more-btn') {
                    window.FeishinNative.toggleMoreMenu();
                } else if (tab.id === 'feishin-nav-settings-btn') {
                    window.FeishinNative.openSettings();
                } else if (route) {
                    window.FeishinNative.closeMoreMenu();
                    window.location.hash = route;
                    syncActiveTab();
                }
            });
        });

        // Atualizar aba ativa em tempo real
        function syncActiveTab() {
            const hash = window.location.hash || '';
            const isMoreOpen = document.getElementById('feishin-more-glass-box')?.classList.contains('open');
            const isBgOpen = document.getElementById('personal-os-shader-modal')?.style?.display === 'flex' || document.getElementById('personal-os-shader-modal')?.style?.display === 'block';

            const tabSongs = bottomNav.querySelector('[data-route="#/library/songs"]');
            const tabTags = bottomNav.querySelector('[data-route="#/library/genres"]');
            const tabArtists = bottomNav.querySelector('[data-route="#/library/artists"]');
            const tabBg = document.getElementById('feishin-nav-backgrounds-btn');
            const tabMore = document.getElementById('feishin-nav-more-btn');
            const tabConf = document.getElementById('feishin-nav-settings-btn');

            bottomNav.querySelectorAll('.feishin-nav-tab').forEach(t => t.classList.remove('active'));

            if (isBgOpen) {
                tabBg?.classList.add('active');
            } else if (isMoreOpen) {
                tabMore?.classList.add('active');
            } else if (hash.startsWith('#/library/songs')) {
                tabSongs?.classList.add('active');
            } else if (hash.startsWith('#/library/genres') || hash.startsWith('#/library/tags')) {
                tabTags?.classList.add('active');
            } else if (hash.startsWith('#/library/artists')) {
                tabArtists?.classList.add('active');
            } else if (hash.startsWith('#/settings')) {
                tabConf?.classList.add('active');
            } else {
                tabMore?.classList.add('active');
            }

            // Sincronizar itens no popup Mais
            const moreEl = document.getElementById('feishin-more-glass-box');
            if (moreEl) {
                moreEl.querySelectorAll('.feishin-more-item').forEach(btn => {
                    const r = btn.getAttribute('data-route');
                    if (r && (hash === r || hash.startsWith(r))) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
        }

        window.__feishinSyncActiveTabs = syncActiveTab;
        window.addEventListener('hashchange', syncActiveTab);
        syncActiveTab();

        document.body.appendChild(bottomNav);
        console.log('[FeishinMobile] Dock Android 6-itens e Popup Mais inicializados com sucesso.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupBottomNav);
    } else {
        setupBottomNav();
    }

    // 4. Menu lateral gerenciado exclusivamente pela barra inferior (sem botão duplicado no topo)
    function injectHeaderMenuButton() {
        // Redundância eliminada: menu já disponível na aba 'Biblioteca' do Bottom Nav
    }

    setInterval(injectHeaderMenuButton, 800);

    // 5. Sincronização em Tempo Real com Android AudioPlaybackService
    let lastTrackId = null;
    let lastPlayStatus = null;

    function syncPlayerState() {
        try {
            const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
            if (!store) return;

            const player = store.player;
            const currentSong = player?.currentSong;
            const isPlaying = player?.status === 'playing';

            // Ajustar visibilidade do player-bar nativo
            const playerBar = document.getElementById('player-bar');
            if (playerBar) {
                if (currentSong) {
                    playerBar.classList.add('feishin-player-active');
                } else {
                    playerBar.classList.remove('feishin-player-active');
                }
            }

            if (currentSong) {
                const trackId = currentSong._uniqueId || currentSong.id;
                const position = typeof player?.timestamp === 'number' ? Math.floor(player.timestamp * 1000) : 0;
                const duration = typeof currentSong.duration === 'number' ? Math.floor(currentSong.duration * 1000) : 180000;

                if (trackId !== lastTrackId || isPlaying !== lastPlayStatus) {
                    lastTrackId = trackId;
                    lastPlayStatus = isPlaying;

                    const title = currentSong.name || currentSong.title || 'Faixa';
                    const artist = currentSong.artistName || (currentSong.artists?.[0]?.name) || 'Artista Desconhecido';
                    const album = currentSong.album || currentSong.albumName || '';
                    const coverUrl = currentSong.imageUrl || '';

                    if (window.AndroidBridge?.onPlaybackStateProgress) {
                        window.AndroidBridge.onPlaybackStateProgress(
                            isPlaying,
                            title,
                            artist,
                            album,
                            coverUrl,
                            position,
                            duration
                        );
                    }
                }
            }
        } catch (e) {
            // Silencioso
        }
    }

    setInterval(syncPlayerState, 400);

    // 6. Gesto de Swipe Down no Fullscreen Player para minimizar suavemente
    let touchStartY = 0;
    let touchStartX = 0;
    let longPressTimer = null;
    let longPressTarget = null;
    let longPressMoved = false;

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            longPressMoved = false;

            const row = e.target.closest('.fs-item-table-list-column-module-data-row, [data-row-index], .ra-item-row, [role="row"]');
            if (row && !e.target.closest('button, [role="button"], input, a')) {
                longPressTarget = row;
                if (longPressTimer) clearTimeout(longPressTimer);
                longPressTimer = setTimeout(() => {
                    if (!longPressMoved && longPressTarget) {
                        if (window.AndroidBridge?.hapticFeedback) {
                            window.AndroidBridge.hapticFeedback(0);
                        } else if (window.AndroidBridge?.vibrate) {
                            window.AndroidBridge.vibrate(35);
                        }
                        const ctxEvent = new MouseEvent('contextmenu', {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: touchStartX,
                            clientY: touchStartY,
                            button: 2
                        });
                        longPressTarget.dispatchEvent(ctxEvent);
                        longPressTarget = null;
                    }
                }, 420);
            }
        } else {
            if (longPressTimer) clearTimeout(longPressTimer);
            longPressTarget = null;
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
            const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
            if (deltaY > 8 || deltaX > 8) {
                longPressMoved = true;
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
            }
        }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        longPressTarget = null;

        if (e.changedTouches.length === 1) {
            const deltaY = e.changedTouches[0].clientY - touchStartY;
            const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);

            // Arraste descendente suave fecha o fullscreen player
            if (deltaY > 100 && deltaX < 70) {
                const fsOverlay = document.querySelector('[class*="fullScreenPlayerOverlay"], #full-screen-player');
                if (fsOverlay && fsOverlay.offsetParent !== null) {
                    const closeBtn = fsOverlay.querySelector('button[aria-label*="arrowDown"], button[aria-label*="Close"], .fs-action-icon');
                    if (closeBtn) closeBtn.click();
                }
            }
        }
    }, { passive: true });

    // 7. Motor Universal de Captura de Toque Instantâneo em Faixas
    // Garante que tocar em qualquer área referente a uma faixa inicie a reprodução imediatamente
    document.addEventListener('click', (e) => {
        // Ignorar se o toque foi em botões de ação explícita (menu 3 pontos, favorito)
        if (e.target.closest('.fs-actions-column-module-actions, [aria-haspopup="menu"], .fs-favorite-column-module-favorite, .ra-row-more-btn, button[aria-label*="Favorit"], button[aria-label*="Açõ"], button[aria-label*="Menu"]')) {
            return;
        }

        // Tabela Feishin padrão (desktop/mobile virtual table)
        const rowCell = e.target.closest('.fs-item-table-list-column-module-data-row, [data-row-index]');
        if (rowCell) {
            // Haptic feedback nativo instantâneo
            if (window.AndroidBridge?.hapticFeedback) {
                window.AndroidBridge.hapticFeedback(0);
            } else if (window.AndroidBridge?.vibrate) {
                window.AndroidBridge.vibrate(10);
            }

            // Se o clique foi em um link dentro da linha (ex: nome de artista ou título), prevenir navegação indevida
            const link = e.target.closest('a');
            if (link && rowCell.contains(link)) {
                e.preventDefault();
                e.stopPropagation();
                // Despachar duplo clique sintético imediato para acionar o player nativo do Feishin
                const dbl = new MouseEvent('dblclick', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                rowCell.dispatchEvent(dbl);
            }
        }
    }, true);

    // =========================================================================
    // 8. PÁGINA DA MÚSICA SAMSUNG MUSIC LIQUID GLASS (FeishinTrackPage)
    // =========================================================================
    window.FeishinTrackPage = {
        progressTimer: null,
        currentDuration: 0,
        isDraggingSeek: false,

        formatTime: function (sec) {
            sec = Math.max(0, Math.floor(sec || 0));
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return m + ':' + (s < 10 ? '0' : '') + s;
        },

        isOpen: function () {
            const tp = document.getElementById('feishin-track-page');
            return Boolean(tp && !tp.classList.contains('feishin-tp-hidden'));
        },

        open: function () {
            this.init();
            const tp = document.getElementById('feishin-track-page');
            if (!tp) return;

            this.sync();
            tp.classList.remove('feishin-tp-hidden');
            tp.style.transform = 'translateY(0%)';
            tp.style.opacity = '1';
            this.startTicker();
        },

        close: function () {
            const tp = document.getElementById('feishin-track-page');
            if (!tp) return;

            document.getElementById('feishin-tp-lyrics-sheet')?.classList.remove('open');
            document.getElementById('feishin-tp-queue-sheet')?.classList.remove('open');
            document.getElementById('feishin-tp-timer-backdrop')?.classList.remove('open');

            tp.style.transform = 'translateY(100%)';
            tp.style.opacity = '0';
            setTimeout(() => {
                tp.classList.add('feishin-tp-hidden');
            }, 340);

            this.stopTicker();
        },

        init: function () {
            if (document.getElementById('feishin-track-page')) return;

            const tp = document.createElement('div');
            tp.id = 'feishin-track-page';
            tp.className = 'feishin-tp-hidden';

            tp.innerHTML = `
              <div class="feishin-tp-ambient-aura" id="feishin-tp-aura"></div>
              <div class="feishin-tp-glass-backdrop"></div>
              <div class="feishin-tp-safe-area">
                <!-- Header Topo -->
                <div class="feishin-tp-header">
                  <button class="feishin-tp-icon-btn" id="feishin-tp-btn-close" aria-label="Minimizar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                  <div class="feishin-tp-header-right">
                    <button class="feishin-tp-icon-btn" id="feishin-tp-btn-timer" aria-label="Temporizador">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </button>
                    <button class="feishin-tp-icon-btn feishin-tp-more-btn" id="feishin-tp-btn-more" aria-label="Mais opções">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Capa do Álbum & Letras Pill -->
                <div class="feishin-tp-art-section">
                  <div class="feishin-tp-art-card">
                    <img class="feishin-tp-cover-img" id="feishin-tp-cover" src="" alt="Capa" />
                    <div class="feishin-tp-cover-fallback" id="feishin-tp-cover-fallback">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                      </svg>
                    </div>
                    <button class="feishin-tp-lyrics-pill" id="feishin-tp-pill-lyrics">Letras</button>
                  </div>
                </div>

                <!-- Painel de Controles e Metadados (Adaptável Portrait e Landscape) -->
                <div class="feishin-tp-landscape-right">
                  <!-- Informações da Faixa -->
                  <div class="feishin-tp-info-section">
                    <div class="feishin-tp-title" id="feishin-tp-title">—</div>
                    <div class="feishin-tp-artist" id="feishin-tp-artist">—</div>
                  </div>

                  <!-- Linha de Ações Rápidas -->
                  <div class="feishin-tp-quick-row">
                    <button class="feishin-tp-action-btn" id="feishin-tp-btn-queue" aria-label="Fila de Reprodução">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                      </svg>
                    </button>
                    <button class="feishin-tp-action-btn" id="feishin-tp-btn-fav" aria-label="Favoritar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      </svg>
                    </button>
                    <button class="feishin-tp-action-btn" id="feishin-tp-btn-lyrics" aria-label="Ver Letras">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Barra de Progresso / Seek Slider -->
                  <div class="feishin-tp-progress-section">
                    <div class="feishin-tp-slider-container" id="feishin-tp-slider-box">
                      <div class="feishin-tp-slider-rail"></div>
                      <div class="feishin-tp-slider-fill" id="feishin-tp-fill"></div>
                      <div class="feishin-tp-slider-thumb" id="feishin-tp-thumb"></div>
                    </div>
                    <div class="feishin-tp-time-row">
                      <span id="feishin-tp-time-cur">0:00</span>
                      <span id="feishin-tp-time-total">0:00</span>
                    </div>
                  </div>

                  <!-- Controles Principais de Reprodução -->
                  <div class="feishin-tp-controls-row">
                    <button class="feishin-tp-ctrl-btn" id="feishin-tp-btn-shuffle" aria-label="Ordem aleatória">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>
                      </svg>
                      <span class="feishin-tp-active-dot"></span>
                    </button>

                    <button class="feishin-tp-ctrl-btn" id="feishin-tp-btn-prev" aria-label="Faixa anterior">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                      </svg>
                    </button>

                    <button class="feishin-tp-play-btn" id="feishin-tp-btn-play" aria-label="Reproduzir ou Pausar">
                      <svg id="feishin-tp-play-icon" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      <svg id="feishin-tp-pause-icon" class="feishin-tp-hidden" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                    </button>

                    <button class="feishin-tp-ctrl-btn" id="feishin-tp-btn-next" aria-label="Próxima faixa">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                      </svg>
                    </button>

                    <button class="feishin-tp-ctrl-btn feishin-tp-repeat-btn" id="feishin-tp-btn-repeat" aria-label="Repetir">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                      </svg>
                      <span class="feishin-tp-active-dot"></span>
                      <span class="feishin-tp-repeat-badge">1</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Sheet de Fila (Queue) -->
              <div class="feishin-tp-sheet" id="feishin-tp-queue-sheet">
                <div class="feishin-tp-sheet-header">
                  <div class="feishin-tp-sheet-title">Fila de Reprodução</div>
                  <button class="feishin-tp-icon-btn" id="feishin-tp-queue-close" aria-label="Fechar fila">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                </div>
                <div class="feishin-tp-sheet-content" id="feishin-tp-queue-list"></div>
              </div>

              <!-- Sheet de Letras (Lyrics) -->
              <div class="feishin-tp-sheet" id="feishin-tp-lyrics-sheet">
                <div class="feishin-tp-sheet-header">
                  <div class="feishin-tp-sheet-title">Letras da Música</div>
                  <button class="feishin-tp-icon-btn" id="feishin-tp-lyrics-close" aria-label="Fechar letras">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                </div>
                <div class="feishin-tp-sheet-content" id="feishin-tp-lyrics-content"></div>
              </div>

              <!-- Modal Temporizador de Desligamento -->
              <div class="feishin-tp-modal-backdrop" id="feishin-tp-timer-backdrop">
                <div class="feishin-tp-modal">
                  <div class="feishin-tp-modal-title">Temporizador de Sono</div>
                  <div class="feishin-tp-timer-options">
                    <div class="feishin-tp-timer-opt" data-min="15">15 minutos</div>
                    <div class="feishin-tp-timer-opt" data-min="30">30 minutos</div>
                    <div class="feishin-tp-timer-opt" data-min="45">45 minutos</div>
                    <div class="feishin-tp-timer-opt" data-min="60">1 hora</div>
                    <div class="feishin-tp-timer-opt" data-min="end">Fim da faixa atual</div>
                    <div class="feishin-tp-timer-opt feishin-tp-timer-cancel" data-min="0">Desativar temporizador</div>
                  </div>
                  <button class="feishin-tp-modal-close" id="feishin-tp-timer-close">Fechar</button>
                </div>
              </div>
            `;

            document.body.appendChild(tp);
            this.bindEvents();
        },

        bindEvents: function () {
            const tp = document.getElementById('feishin-track-page');
            if (!tp) return;

            // Fechar
            document.getElementById('feishin-tp-btn-close')?.addEventListener('click', () => {
                if (window.AndroidBridge?.hapticFeedback) window.AndroidBridge.hapticFeedback(0);
                this.close();
            });

            // Controles de Playback
            document.getElementById('feishin-tp-btn-play')?.addEventListener('click', () => {
                if (window.AndroidBridge?.hapticFeedback) window.AndroidBridge.hapticFeedback(0);
                window.FeishinNative.togglePlay();
                setTimeout(() => this.sync(), 80);
            });

            document.getElementById('feishin-tp-btn-next')?.addEventListener('click', () => {
                if (window.AndroidBridge?.hapticFeedback) window.AndroidBridge.hapticFeedback(0);
                window.FeishinNative.next();
                setTimeout(() => this.sync(), 200);
            });

            document.getElementById('feishin-tp-btn-prev')?.addEventListener('click', () => {
                if (window.AndroidBridge?.hapticFeedback) window.AndroidBridge.hapticFeedback(0);
                window.FeishinNative.prev();
                setTimeout(() => this.sync(), 200);
            });

            document.getElementById('feishin-tp-btn-shuffle')?.addEventListener('click', () => {
                if (window.AndroidBridge?.hapticFeedback) window.AndroidBridge.hapticFeedback(0);
                const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
                if (store?.toggleShuffle) store.toggleShuffle();
                else if (store?.mediaToggleShuffle) store.mediaToggleShuffle();
                setTimeout(() => this.sync(), 80);
            });

            document.getElementById('feishin-tp-btn-repeat')?.addEventListener('click', () => {
                if (window.AndroidBridge?.hapticFeedback) window.AndroidBridge.hapticFeedback(0);
                const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
                if (store?.toggleRepeat) store.toggleRepeat();
                else if (store?.mediaToggleRepeat) store.mediaToggleRepeat();
                setTimeout(() => this.sync(), 80);
            });

            // Barra de Busca Touch & Drag (Seek Slider)
            const sliderBox = document.getElementById('feishin-tp-slider-box');
            const fill = document.getElementById('feishin-tp-fill');
            const thumb = document.getElementById('feishin-tp-thumb');
            const timeCur = document.getElementById('feishin-tp-time-cur');

            const handleSeekMove = (clientX) => {
                if (!sliderBox) return 0;
                const rect = sliderBox.getBoundingClientRect();
                const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                if (fill) fill.style.width = (pct * 100) + '%';
                if (thumb) thumb.style.left = (pct * 100) + '%';
                if (this.currentDuration > 0 && timeCur) {
                    timeCur.innerText = this.formatTime(pct * this.currentDuration);
                }
                return pct;
            };

            let seeking = false;
            sliderBox?.addEventListener('pointerdown', (e) => {
                seeking = true;
                this.isDraggingSeek = true;
                sliderBox.setPointerCapture?.(e.pointerId);
                handleSeekMove(e.clientX);
            });

            sliderBox?.addEventListener('pointermove', (e) => {
                if (seeking) handleSeekMove(e.clientX);
            });

            const finishSeek = (clientX) => {
                if (seeking) {
                    const pct = handleSeekMove(clientX);
                    seeking = false;
                    const targetSec = pct * (this.currentDuration || 0);
                    window.FeishinNative.seekTo(targetSec);
                    const audio = document.querySelector('audio');
                    if (audio && audio.duration) {
                        try { audio.currentTime = targetSec; } catch (err) {}
                    }
                    setTimeout(() => {
                        this.isDraggingSeek = false;
                        this.sync();
                    }, 80);
                }
            };

            sliderBox?.addEventListener('pointerup', (e) => finishSeek(e.clientX));
            sliderBox?.addEventListener('pointercancel', (e) => finishSeek(e.clientX));

            // Sheets
            document.getElementById('feishin-tp-pill-lyrics')?.addEventListener('click', () => this.openLyrics());
            document.getElementById('feishin-tp-btn-lyrics')?.addEventListener('click', () => this.openLyrics());
            document.getElementById('feishin-tp-lyrics-close')?.addEventListener('click', () => {
                document.getElementById('feishin-tp-lyrics-sheet')?.classList.remove('open');
            });

            document.getElementById('feishin-tp-btn-queue')?.addEventListener('click', () => this.openQueue());
            document.getElementById('feishin-tp-queue-close')?.addEventListener('click', () => {
                document.getElementById('feishin-tp-queue-sheet')?.classList.remove('open');
            });

            // Favorito
            document.getElementById('feishin-tp-btn-fav')?.addEventListener('click', () => {
                if (window.AndroidBridge?.hapticFeedback) window.AndroidBridge.hapticFeedback(0);
                const favBtn = document.querySelector('#player-bar button[aria-label*="Favorit"], .fs-favorite-column-module-favorite');
                if (favBtn) favBtn.click();
                setTimeout(() => this.sync(), 80);
            });

            // Mais opções
            document.getElementById('feishin-tp-btn-more')?.addEventListener('click', (e) => {
                if (window.AndroidBridge?.hapticFeedback) window.AndroidBridge.hapticFeedback(0);
                const moreTrigger = document.querySelector('#player-bar button[aria-label*="Açõ"], #player-bar button[aria-haspopup="menu"], #player-bar [class*="more"]');
                if (moreTrigger) {
                    moreTrigger.click();
                } else {
                    window.FeishinNative.toggleMoreMenu();
                }
            });

            // Temporizador
            document.getElementById('feishin-tp-btn-timer')?.addEventListener('click', () => {
                document.getElementById('feishin-tp-timer-backdrop')?.classList.add('open');
            });

            document.getElementById('feishin-tp-timer-close')?.addEventListener('click', () => {
                document.getElementById('feishin-tp-timer-backdrop')?.classList.remove('open');
            });

            document.getElementById('feishin-tp-timer-backdrop')?.addEventListener('click', (e) => {
                if (e.target.id === 'feishin-tp-timer-backdrop') {
                    e.target.classList.remove('open');
                }
            });

            document.querySelectorAll('.feishin-tp-timer-opt').forEach(opt => {
                opt.addEventListener('click', () => {
                    const min = opt.getAttribute('data-min');
                    this.setSleepTimer(min);
                });
            });

            // Fechamento da página por arraste suave para baixo
            let tpTouchY = 0;
            let tpTouchX = 0;
            tp.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    tpTouchY = e.touches[0].clientY;
                    tpTouchX = e.touches[0].clientX;
                }
            }, { passive: true });

            tp.addEventListener('touchend', (e) => {
                if (e.changedTouches.length === 1) {
                    const dy = e.changedTouches[0].clientY - tpTouchY;
                    const dx = Math.abs(e.changedTouches[0].clientX - tpTouchX);
                    if (dy > 90 && dx < 60) {
                        const lyricsOpen = document.getElementById('feishin-tp-lyrics-sheet')?.classList.contains('open');
                        const queueOpen = document.getElementById('feishin-tp-queue-sheet')?.classList.contains('open');
                        if (lyricsOpen) {
                            document.getElementById('feishin-tp-lyrics-sheet').classList.remove('open');
                            return;
                        }
                        if (queueOpen) {
                            document.getElementById('feishin-tp-queue-sheet').classList.remove('open');
                            return;
                        }
                        this.close();
                    }
                }
            }, { passive: true });
        },

        sync: function () {
            const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
            const cur = (typeof store?.getCurrentSong === 'function' ? store.getCurrentSong() : null) || store?.player?.currentSong;
            const status = store?.player?.status;
            const isPlaying = status === 'playing' || status === 1;

            const titleEl = document.getElementById('feishin-tp-title');
            const artistEl = document.getElementById('feishin-tp-artist');
            const coverEl = document.getElementById('feishin-tp-cover');
            const auraEl = document.getElementById('feishin-tp-aura');
            const playIcon = document.getElementById('feishin-tp-play-icon');
            const pauseIcon = document.getElementById('feishin-tp-pause-icon');
            const totalEl = document.getElementById('feishin-tp-time-total');
            const shuffleBtn = document.getElementById('feishin-tp-btn-shuffle');
            const repeatBtn = document.getElementById('feishin-tp-btn-repeat');
            const favBtn = document.getElementById('feishin-tp-btn-fav');

            // Metadados
            const title = cur?.name || cur?.title || document.querySelector('#player-bar .song-title, [class*="songTitle"]')?.innerText || 'Faixa';
            const artist = cur?.artistName || cur?.artists?.map(a => a.name).join(', ') || document.querySelector('#player-bar .song-artist, [class*="songArtist"]')?.innerText || 'Artista';

            if (titleEl) titleEl.innerText = title;
            if (artistEl) artistEl.innerText = artist;

            // Capa
            const barImg = document.querySelector('#player-bar img, .fs-mobile-playerbar-module-image, img[class*="playerbarImage"]');
            const coverSrc = barImg?.src || cur?.imageUrl || '';
            if (coverEl && coverSrc && !coverSrc.includes('data:image/svg')) {
                coverEl.src = coverSrc;
                coverEl.style.display = 'block';
                if (auraEl) auraEl.style.backgroundImage = 'url("' + coverSrc + '")';
            }

            // Play / Pause Icons
            if (playIcon && pauseIcon) {
                if (isPlaying) {
                    playIcon.classList.add('feishin-tp-hidden');
                    pauseIcon.classList.remove('feishin-tp-hidden');
                    auraEl?.classList.remove('paused');
                } else {
                    playIcon.classList.remove('feishin-tp-hidden');
                    pauseIcon.classList.add('feishin-tp-hidden');
                    auraEl?.classList.add('paused');
                }
            }

            // Shuffle & Repeat
            if (shuffleBtn && store?.player?.shuffle !== undefined) {
                shuffleBtn.classList.toggle('active', Boolean(store.player.shuffle));
            }
            if (repeatBtn && store?.player?.repeat !== undefined) {
                repeatBtn.classList.toggle('active', store.player.repeat !== 'off' && store.player.repeat !== false);
            }

            // Favorito
            if (favBtn && cur) {
                const isFav = Boolean(cur.userFavorite);
                favBtn.classList.toggle('feishin-tp-fav-active', isFav);
            }

            // Duração
            let dur = cur?.duration || 0;
            if (dur > 1000) dur = dur / 1000;
            const audio = document.querySelector('audio');
            if (audio && audio.duration) dur = audio.duration;
            this.currentDuration = dur;

            if (totalEl) totalEl.innerText = this.formatTime(dur);

            this.updateProgress();
        },

        updateProgress: function () {
            if (this.isDraggingSeek) return;

            let curTime = 0;
            const audio = document.querySelector('audio');
            if (audio && !isNaN(audio.currentTime)) {
                curTime = audio.currentTime;
            } else {
                const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
                curTime = (store?.player?.playbackPosition || 0) / 1000;
            }

            const curEl = document.getElementById('feishin-tp-time-cur');
            const fill = document.getElementById('feishin-tp-fill');
            const thumb = document.getElementById('feishin-tp-thumb');

            if (curEl) curEl.innerText = this.formatTime(curTime);

            if (this.currentDuration > 0) {
                const pct = Math.min(100, Math.max(0, (curTime / this.currentDuration) * 100));
                if (fill) fill.style.width = pct + '%';
                if (thumb) thumb.style.left = pct + '%';
            }
        },

        startTicker: function () {
            this.stopTicker();
            this.progressTimer = setInterval(() => {
                if (this.isOpen()) {
                    this.updateProgress();
                }
            }, 250);
        },

        stopTicker: function () {
            if (this.progressTimer) {
                clearInterval(this.progressTimer);
                this.progressTimer = null;
            }
        },

        openQueue: function () {
            const sheet = document.getElementById('feishin-tp-queue-sheet');
            const container = document.getElementById('feishin-tp-queue-list');
            if (!sheet || !container) return;

            container.innerHTML = '';
            const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
            const queue = (typeof store?.getQueue === 'function' ? store.getQueue() : null) || store?.player?.queue || store?.queue?.items || [];
            const currentSong = (typeof store?.getCurrentSong === 'function' ? store.getCurrentSong() : null) || store?.player?.currentSong;

            if (queue.length === 0) {
                container.innerHTML = '<div class="feishin-tp-queue-empty">A fila de reprodução está vazia.</div>';
                sheet.classList.add('open');
                return;
            }

            queue.forEach((item, idx) => {
                const row = document.createElement('div');
                const isCurrent = currentSong && (currentSong._uniqueId === item._uniqueId || currentSong.id === item.id);
                row.className = 'feishin-tp-q-item' + (isCurrent ? ' active' : '');

                const title = item.name || item.title || 'Faixa';
                const artist = item.artistName || item.artists?.[0]?.name || 'Artista';
                const duration = this.formatTime(item.duration ? (item.duration > 1000 ? item.duration / 1000 : item.duration) : 0);

                row.innerHTML = `
                  <span class="feishin-tp-q-idx">${idx + 1}</span>
                  <div class="feishin-tp-q-meta">
                    <div class="feishin-tp-q-title">${title}</div>
                    <div class="feishin-tp-q-artist">${artist}</div>
                  </div>
                  <span class="feishin-tp-q-duration">${duration}</span>
                `;

                row.addEventListener('click', () => {
                    if (window.AndroidBridge?.hapticFeedback) window.AndroidBridge.hapticFeedback(0);
                    if (store?.mediaPlayByIndex) {
                        store.mediaPlayByIndex(idx);
                    }
                    sheet.classList.remove('open');
                    setTimeout(() => this.sync(), 200);
                });

                container.appendChild(row);
            });

            sheet.classList.add('open');
            const activeEl = container.querySelector('.feishin-tp-q-item.active');
            if (activeEl) {
                setTimeout(() => activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            }
        },

        openLyrics: function () {
            const sheet = document.getElementById('feishin-tp-lyrics-sheet');
            const container = document.getElementById('feishin-tp-lyrics-content');
            if (!sheet || !container) return;

            sheet.classList.add('open');
            const lyricsDom = document.querySelector('.fs-lyrics-module-container, [class*="lyrics"]');
            if (lyricsDom && lyricsDom.innerText.trim()) {
                const lines = lyricsDom.innerText.split('\n').filter(l => l.trim().length > 0);
                container.innerHTML = lines.map(line => `<div class="feishin-tp-lyrics-line">${line}</div>`).join('');
            } else {
                container.innerHTML = '<div class="feishin-tp-lyrics-empty">Nenhuma letra sincronizada disponível para esta faixa.</div>';
            }
        },

        sleepTimerId: null,
        setSleepTimer: function (minutes) {
            if (this.sleepTimerId) {
                clearTimeout(this.sleepTimerId);
                this.sleepTimerId = null;
            }
            document.getElementById('feishin-tp-timer-backdrop')?.classList.remove('open');

            if (!minutes || minutes === '0' || minutes === 0) {
                if (window.AndroidBridge?.showToast) window.AndroidBridge.showToast('Temporizador desativado');
                return;
            }

            if (minutes === 'end') {
                const store = window.__FEISHIN_PLAYER_STORE__?.getState?.();
                if (store?.setPauseOnNextSongEnd) {
                    store.setPauseOnNextSongEnd(true);
                    if (window.AndroidBridge?.showToast) window.AndroidBridge.showToast('Pausa agendada para o fim da faixa');
                    return;
                }
            }

            const ms = parseInt(minutes, 10) * 60 * 1000;
            if (window.AndroidBridge?.showToast) window.AndroidBridge.showToast('Temporizador ativado para ' + minutes + ' minutos');

            this.sleepTimerId = setTimeout(() => {
                window.FeishinNative.pause();
                if (window.AndroidBridge?.showToast) window.AndroidBridge.showToast('Música pausada pelo temporizador');
            }, ms);
        }
    };

    // 9. Interceptor Universal de Toque no Player Bar para Abrir a Página da Música
    document.addEventListener('click', (e) => {
        const bar = e.target.closest('#player-bar, .fs-playerbar-module-container, .fs-mobile-playerbar-module-container');
        if (!bar) return;

        // Se o clique foi em um botão de controle de reprodução, slider ou kill-switch, permite ação direta
        const isPlaybackControl = e.target.closest(
            '.fs-center-controls-module-buttons-container, ' +
            '.fs-mobile-playerbar-module-controls-wrapper, ' +
            '.feishin-kill-btn, ' +
            '.mantine-Slider-root, ' +
            'input[type="range"]'
        );
        if (isPlaybackControl) return;

        // Previne qualquer navegação acidental para artista, álbum ou rota
        e.preventDefault();
        e.stopPropagation();

        if (window.AndroidBridge?.hapticFeedback) {
            window.AndroidBridge.hapticFeedback(0);
        } else if (window.AndroidBridge?.vibrate) {
            window.AndroidBridge.vibrate(10);
        }

        if (window.FeishinTrackPage) {
            window.FeishinTrackPage.open();
        }
    }, true);

    // 10. Sincronizador Realtime SSE com VPS Music Engine
    (function initRealtimeSync() {
        const eventsUrl = '/api/engine/events';
        let es = null;

        function connectSSE() {
            try {
                es = new EventSource(eventsUrl);
                es.addEventListener('track_deleted', (e) => {
                    try {
                        const data = JSON.parse(e.data);
                        console.log('[FeishinMobile] Sincronização em tempo real - música deletada:', data);
                        
                        // Encontrar e animar remoção das linhas correspondentes na UI
                        const titleLower = (data.title || '').toLowerCase().trim();
                        document.querySelectorAll('[data-row-index], .ra-item-row, .fs-item-table-list-column-module-data-row').forEach(row => {
                            const text = (row.innerText || '').toLowerCase();
                            if (text.includes(titleLower) && titleLower.length > 2) {
                                row.style.transition = 'all 0.3s ease-out';
                                row.style.opacity = '0';
                                row.style.transform = 'scaleY(0)';
                                row.style.maxHeight = '0px';
                                setTimeout(() => row.remove(), 320);
                            }
                        });

                        // Se a página de detalhes da música estiver aberta para esta faixa, fechar
                        if (window.FeishinTrackPage?.isOpen) {
                            const currentTitle = document.getElementById('feishin-tp-title')?.innerText || '';
                            if (currentTitle.toLowerCase().includes(titleLower)) {
                                window.FeishinTrackPage.close();
                            }
                        }
                    } catch (err) {
                        console.error('[FeishinMobile] Erro processando evento SSE:', err);
                    }
                });

                es.onerror = () => {
                    if (es) {
                        es.close();
                        es = null;
                    }
                    setTimeout(connectSSE, 6000);
                };
            } catch (e) {
                setTimeout(connectSSE, 10000);
            }
        }

        setTimeout(connectSSE, 1500);
    })();

    console.log('[FeishinMobile] Motor Nativo Liquid Glass Pronto e Ativo.');
})();
