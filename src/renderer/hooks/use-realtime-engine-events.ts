import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { queryKeys } from '/@/renderer/api/query-keys';
import { useCurrentServer } from '/@/renderer/store';
import { usePlayerStore } from '/@/renderer/store/player.store';
import { toast } from '/@/shared/components/toast/toast';

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

        const connect = () => {
            try {
                eventSource = new EventSource(eventsUrl);

                eventSource.addEventListener('track_deleted', (e: MessageEvent) => {
                    try {
                        const data = JSON.parse(e.data);
                        const deletedId = data.id;
                        if (!deletedId) return;

                        console.log('[RealtimeEngine] Evento track_deleted recebido:', data);

                        // 1. Expurgar dos caches React Query
                        queryClient.invalidateQueries({ queryKey: queryKeys.songs.all });
                        queryClient.invalidateQueries({ queryKey: queryKeys.albums.all });
                        queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
                        queryClient.invalidateQueries({ queryKey: queryKeys.playlists.all });

                        queryClient.setQueriesData({ queryKey: queryKeys.songs.all }, (oldData: any) => {
                            if (!oldData) return oldData;
                            if (Array.isArray(oldData)) {
                                return oldData.filter((s: any) => s.id !== deletedId);
                            }
                            if (oldData.items && Array.isArray(oldData.items)) {
                                return {
                                    ...oldData,
                                    items: oldData.items.filter((s: any) => s.id !== deletedId),
                                    totalRecordCount: Math.max(
                                        0,
                                        (oldData.totalRecordCount || oldData.items.length) - 1,
                                    ),
                                };
                            }
                            return oldData;
                        });

                        // 2. Parar reprodução ou avançar se a música deletada estiver tocando
                        const playerState = usePlayerStore.getState();
                        if (playerState.currentSong?.id === deletedId) {
                            playerState.actions.skipTrack();
                        }
                        playerState.actions.clearSelected([{ id: deletedId } as any]);

                        // 3. Notificar sincronização em tempo real entre dispositivos
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
                    reconnectTimeout = setTimeout(connect, 6000);
                };
            } catch (err) {
                console.error('[RealtimeEngine] Erro ao conectar SSE:', err);
                reconnectTimeout = setTimeout(connect, 10000);
            }
        };

        connect();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
        };
    }, [queryClient, server?.url]);
};
