import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { eventEmitter } from '/@/renderer/events/event-emitter';
import { useCurrentServer } from '/@/renderer/store';
import { usePlayerStore } from '/@/renderer/store/player.store';
import { toast } from '/@/shared/components/toast/toast';
import { ItemListKey } from '/@/shared/types/types';

export const useRealtimeEngineEvents = () => {
    const server = useCurrentServer();
    const queryClient = useQueryClient();

    useEffect(() => {
        const serverUrl = server?.url || (typeof window !== 'undefined' ? window.location.origin : '');
        if (!serverUrl) return;

        const baseUrl = serverUrl.replace(/\/$/, '');
        const eventsUrl = `${baseUrl}/api/engine/events`;
        let eventSource: EventSource | null = null;
        let reconnectTimeout: NodeJS.Timeout | null = null;

        const triggerFullLibraryRefresh = (data?: any) => {
            console.log('[RealtimeEngine] Invalidação global de biblioteca disparada:', data);

            // 1. Invalida todas as queries do TanStack React Query vinculadas ao servidor
            if (server?.id) {
                queryClient.invalidateQueries({ queryKey: [server.id] });
                queryClient.invalidateQueries({ queryKey: [server.id, 'songs'] });
                queryClient.invalidateQueries({ queryKey: [server.id, 'albums'] });
                queryClient.invalidateQueries({ queryKey: [server.id, 'artists'] });
                queryClient.invalidateQueries({ queryKey: [server.id, 'genres'] });
                queryClient.invalidateQueries({ queryKey: [server.id, 'playlists'] });
                queryClient.invalidateQueries({ queryKey: [server.id, 'item-list-infinite-loader'] });
            } else {
                queryClient.invalidateQueries();
            }

            // 2. Dispara mutação de refresh nas tabelas de lista infinita
            eventEmitter.emit('ITEM_LIST_REFRESH', { key: ItemListKey.SONG });
            eventEmitter.emit('ITEM_LIST_REFRESH', { key: ItemListKey.ALBUM });
            eventEmitter.emit('ITEM_LIST_REFRESH', { key: ItemListKey.ARTIST });
            eventEmitter.emit('ITEM_LIST_REFRESH', { key: ItemListKey.ALBUM_ARTIST });
            eventEmitter.emit('ITEM_LIST_REFRESH', { key: ItemListKey.GENRE });
            eventEmitter.emit('ITEM_LIST_REFRESH', { key: ItemListKey.PLAYLIST });

            // 3. Recarrega a aba Recentes
            if (typeof window !== 'undefined') {
                if ((window as any).__FEISHIN_RECENTLY_ADDED__?.reload) {
                    (window as any).__FEISHIN_RECENTLY_ADDED__.reload(true);
                }
                window.dispatchEvent(new CustomEvent('feishin:refresh-library', { detail: data }));
            }
        };

        const connect = () => {
            try {
                eventSource = new EventSource(eventsUrl);

                // Nova faixa enviada para a VPS
                eventSource.addEventListener('track_uploaded', (e: MessageEvent) => {
                    try {
                        const data = JSON.parse(e.data);
                        console.log('[RealtimeEngine] Evento track_uploaded recebido:', data);

                        toast.info({
                            message: `Música "${data.title || data.filename || 'Nova faixa'}" sincronizada na biblioteca.`,
                            title: 'Biblioteca Atualizada',
                        });

                        triggerFullLibraryRefresh(data);

                        // Delays preventivos para garantir conclusão do scan do Navidrome
                        setTimeout(() => triggerFullLibraryRefresh(data), 1200);
                        setTimeout(() => triggerFullLibraryRefresh(data), 3200);
                    } catch (err) {
                        console.error('[RealtimeEngine] Erro ao processar track_uploaded:', err);
                    }
                });

                // Scan do Navidrome concluído
                eventSource.addEventListener('scan_finished', (e: MessageEvent) => {
                    try {
                        const data = JSON.parse(e.data);
                        console.log('[RealtimeEngine] Evento scan_finished recebido:', data);
                        triggerFullLibraryRefresh(data);
                    } catch (err) {}
                });

                // Atualização geral de catálogo
                eventSource.addEventListener('library_updated', (e: MessageEvent) => {
                    try {
                        const data = JSON.parse(e.data);
                        console.log('[RealtimeEngine] Evento library_updated recebido:', data);
                        triggerFullLibraryRefresh(data);
                    } catch (err) {}
                });

                // Metadados ou capa de faixa atualizados
                eventSource.addEventListener('track_updated', (e: MessageEvent) => {
                    try {
                        const data = JSON.parse(e.data);
                        console.log('[RealtimeEngine] Evento track_updated recebido:', data);
                        triggerFullLibraryRefresh(data);
                    } catch (err) {}
                });

                // Faixa deletada
                eventSource.addEventListener('track_deleted', (e: MessageEvent) => {
                    try {
                        const data = JSON.parse(e.data);
                        const deletedId = data.id;
                        if (!deletedId) return;

                        console.log('[RealtimeEngine] Evento track_deleted recebido:', data);

                        triggerFullLibraryRefresh(data);

                        // Parar reprodução ou avançar se a música deletada estiver tocando
                        const playerState = usePlayerStore.getState();
                        if (playerState.currentSong?.id === deletedId) {
                            playerState.actions.skipTrack();
                        }
                        playerState.actions.clearSelected([{ id: deletedId } as any]);

                        toast.info({
                            message: `Música "${data.title || 'Faixa'}" foi apagada do servidor VPS.`,
                            title: 'Sincronização em Tempo Real',
                        });
                    } catch (err) {
                        console.error('[RealtimeEngine] Erro ao processar track_deleted:', err);
                    }
                });

                eventSource.onerror = () => {
                    if (eventSource) {
                        eventSource.close();
                        eventSource = null;
                    }
                    reconnectTimeout = setTimeout(connect, 5000);
                };
            } catch (err) {
                console.error('[RealtimeEngine] Erro ao conectar SSE:', err);
                reconnectTimeout = setTimeout(connect, 8000);
            }
        };

        connect();

        // Escuta gatilhos globais customizados
        const onCustomTrigger = () => triggerFullLibraryRefresh();
        window.addEventListener('feishin:trigger-library-refresh', onCustomTrigger);

        return () => {
            if (eventSource) {
                eventSource.close();
            }
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            window.removeEventListener('feishin:trigger-library-refresh', onCustomTrigger);
        };
    }, [queryClient, server?.id, server?.url]);
};
