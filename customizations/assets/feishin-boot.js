/* ==========================================================================
   FEISHIN MOBILE PRO — BOOT ACELERADO & PERSISTÊNCIA NATIVA
   Executa ANTES de qualquer outro script. Objetivos:
   1. Pré-configuração de preferências e credenciais de sessão rápida.
   2. Desativação de telemetria externa desnecessária.
   3. Preservação estrita do ciclo de vida nativo de XHR e Axios para
      compatibilidade 100% confiável com queries TanStack / Subsonic.
   ========================================================================== */
(function () {
    'use strict';

    // ---- 1. Migração de preferências visuais e inicialização de sessão segura ----
    try {
        window.__FORCE_SHADER_RUNNING__ = true;
        window.__PAUSE_WEBGL_SHADERS__ = false;
        window.__MODAL_OPEN_PAUSE__ = false;
        localStorage.setItem('feishin_shader_eco', 'false');
        if (localStorage.getItem('fs_ui_v2') !== '1') {
            localStorage.setItem('personal_os_shader_dim', '6');
            localStorage.setItem('fs_ui_v2', '1');
        }

        const authStr = localStorage.getItem('store_authentication');
        let authNeedsInit = false;
        try {
            const check = JSON.parse(authStr);
            if (!check?.state?.currentServer || !check?.state?.currentServer?.credential) {
                authNeedsInit = true;
            }
        } catch (e) {
            authNeedsInit = true;
        }
        if (authNeedsInit) {
            const defaultAuth = {
                state: {
                    actions: {},
                    currentServer: {
                        credential: "u=MateusCelestinoPRO&s=1db6bd&t=d8a85b5607aa399b374a131f3b77c1dc",
                        id: "FsiBb_mTdwLVTb1o_94bm",
                        isAdmin: true,
                        name: "Navidrome VPS",
                        type: "subsonic",
                        url: "https://instance-20260907-0637.tail798a9b.ts.net:4533",
                        userId: "3xPL1BPoVa1ulwc1UkzYU6",
                        username: "MateusCelestinoPRO",
                        preferRemoteUrl: false,
                        version: "0.64.2 (10114574)"
                    },
                    deviceId: "7LuHDSkII4F8eaRFsTo4e",
                    serverList: {
                        "FsiBb_mTdwLVTb1o_94bm": {
                            credential: "u=MateusCelestinoPRO&s=1db6bd&t=d8a85b5607aa399b374a131f3b77c1dc",
                            id: "FsiBb_mTdwLVTb1o_94bm",
                            isAdmin: true,
                            name: "Navidrome VPS",
                            type: "subsonic",
                            url: "https://instance-20260907-0637.tail798a9b.ts.net:4533",
                            userId: "3xPL1BPoVa1ulwc1UkzYU6",
                            username: "MateusCelestinoPRO",
                            preferRemoteUrl: false,
                            version: "0.64.2 (10114574)"
                        }
                    }
                },
                version: 2
            };
            localStorage.setItem('store_authentication', JSON.stringify(defaultAuth));
        }
    } catch (e) {}

    // ---- 2. Bloqueio de telemetria externa dispensável ----
    const ORIG_FETCH = window.fetch ? window.fetch.bind(window) : null;
    const BLOCKED = /(umami\.jeffvli\.org|api\.github\.com\/repos\/jeffvli\/feishin)/;

    if (ORIG_FETCH) {
        window.fetch = function (input, init) {
            try {
                const urlStr = typeof input === 'string' ? input : (input && input.url) || '';
                if (BLOCKED.test(urlStr)) {
                    return Promise.resolve(new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } }));
                }
            } catch (e) {}
            return ORIG_FETCH(input, init);
        };
    }
    // ---- 3. Plataforma abre 100% zerada na Home e com VOLUME REAL 100% GALAXY ULTRA ----
    try {
        const cleanPlayerState = {
            state: {
                player: {
                    index: -1,
                    num: 1,
                    player1: null,
                    player2: null,
                    playQueue: [],
                    repeat: "none",
                    shuffle: "none",
                    speed: 1,
                    status: "paused",
                    timestamp: 0,
                    transitionType: "gapless",
                    volume: 100
                },
                queue: {
                    default: [],
                    shuffled: [],
                    songs: {}
                }
            },
            version: 0
        };
        localStorage.setItem('store_player', JSON.stringify(cleanPlayerState));

        if (typeof indexedDB !== 'undefined') {
            const req = indexedDB.open('keyval-store');
            req.onsuccess = function () {
                try {
                    const db = req.result;
                    if (db.objectStoreNames.contains('keyval')) {
                        const tx = db.transaction('keyval', 'readwrite');
                        tx.objectStore('keyval').delete('store_player_queue');
                        tx.objectStore('keyval').delete('player-store');
                    }
                } catch (e) {}
            };
        }

        // Hook universal em HTMLMediaElement: Garante que o volume interno do player nunca seja atenuado abaixo de 1.0 (100%)
        if (typeof HTMLMediaElement !== 'undefined') {
            const origPlay = HTMLMediaElement.prototype.play;
            HTMLMediaElement.prototype.play = function() {
                try {
                    this.volume = 1.0;
                    this.muted = false;
                } catch (e) {}
                return origPlay.apply(this, arguments);
            };
        }



        // Remover Home completamente e garantir Faixas (Songs) em store_settings
        const rawSettings = localStorage.getItem('store_settings');
        if (rawSettings) {
            const parsed = JSON.parse(rawSettings);
            let changed = false;
            const target = parsed?.state?.general?.sidebarItems || parsed?.general?.sidebarItems;
            if (Array.isArray(target)) {
                const hadHome = target.some(item => item && (item.id === 'Home' || item.route === '/home'));
                if (hadHome) {
                    const filtered = target.filter(item => item && item.id !== 'Home' && item.route !== '/home' && item.route !== '/');
                    if (parsed?.state?.general?.sidebarItems) parsed.state.general.sidebarItems = filtered;
                    if (parsed?.general?.sidebarItems) parsed.general.sidebarItems = filtered;
                    changed = true;
                }
            }
            if (changed) {
                localStorage.setItem('store_settings', JSON.stringify(parsed));
            }
        }

        // Força abertura limpa na página de Faixas (Tracks) como verdadeira Home
        if (!sessionStorage.getItem('feishin_session_started') || window.location.hash === '#/home' || window.location.hash === '#' || window.location.hash === '#/') {
            sessionStorage.setItem('feishin_session_started', 'true');
            window.location.hash = '#/library/songs';
        }
    } catch (e) {}
})();
