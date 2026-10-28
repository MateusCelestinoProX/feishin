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

            // Otimizar todas as listas de músicas para o padrão mobile
            if (!s.state.lists) s.state.lists = {};
            const listKeys = ['song', 'playlistSong', 'albumDetail', 'queueSong'];

            listKeys.forEach(key => {
                if (!s.state.lists[key]) s.state.lists[key] = {};
                const list = s.state.lists[key];

                // Forçar rolagem infinita contínua (elimina paginação por botões colidindo na tela)
                if (list.pagination !== 'infinite') {
                    list.pagination = 'infinite';
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

                // Ajustar colunas mobile ideais
                if (list.table.columns && Array.isArray(list.table.columns)) {
                    list.table.columns.forEach(col => {
                        if (col.id === 'rowIndex') {
                            if (!col.isEnabled || col.width !== 30) {
                                col.isEnabled = true;
                                col.width = 30;
                                col.pinned = 'left';
                                changed = true;
                            }
                        } else if (col.id === 'titleCombined') {
                            if (!col.isEnabled || col.width !== 260) {
                                col.isEnabled = true;
                                col.width = 260;
                                changed = true;
                            }
                        } else if (col.id === 'duration') {
                            if (!col.isEnabled || col.width !== 48) {
                                col.isEnabled = true;
                                col.width = 48;
                                changed = true;
                            }
                        } else if (col.id === 'actions') {
                            if (!col.isEnabled || col.width !== 36) {
                                col.isEnabled = true;
                                col.width = 36;
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

            // Credenciais Navidrome VPS
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
                                osTranscodeDecision: [1],
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
                                    osTranscodeDecision: [1],
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

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
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

    console.log('[FeishinMobile] Motor Nativo Liquid Glass Pronto e Ativo.');
})();
