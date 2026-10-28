import { closeAllModals, openModal } from '@mantine/modals';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { queryKeys } from '/@/renderer/api/query-keys';
import { useCurrentServer } from '/@/renderer/store';
import { usePlayerStore } from '/@/renderer/store/player.store';
import { ContextMenu } from '/@/shared/components/context-menu/context-menu';
import { ConfirmModal } from '/@/shared/components/modal/modal';
import { Text } from '/@/shared/components/text/text';
import { toast } from '/@/shared/components/toast/toast';
import { Song } from '/@/shared/types/domain-types';

interface DeleteSongActionProps {
    disabled?: boolean;
    items: Song[];
}

export const DeleteSongAction = ({ disabled, items }: DeleteSongActionProps) => {
    const { t } = useTranslation();
    const server = useCurrentServer();
    const queryClient = useQueryClient();

    const handleDeleteSong = useCallback(async () => {
        if (!items || items.length === 0) return;

        const songIds = items.map((i) => i.id);
        const baseUrl = (server?.url || window.location.origin).replace(/\/$/, '');
        const endpoint = `${baseUrl}/api/engine/delete-track`;

        try {
            const res = await fetch(endpoint, {
                body: JSON.stringify({ songIds }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Erro ${res.status} ao excluir música do servidor`);
            }

            const data = await res.json();
            const deletedIds = new Set(songIds);

            // 1. Atualizar e expurgar do cache React Query instantaneamente
            queryClient.invalidateQueries({ queryKey: queryKeys.songs.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.albums.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.playlists.all });

            queryClient.setQueriesData({ queryKey: queryKeys.songs.all }, (oldData: any) => {
                if (!oldData) return oldData;
                if (Array.isArray(oldData)) {
                    return oldData.filter((s: any) => !deletedIds.has(s.id));
                }
                if (oldData.items && Array.isArray(oldData.items)) {
                    return {
                        ...oldData,
                        items: oldData.items.filter((s: any) => !deletedIds.has(s.id)),
                        totalRecordCount: Math.max(
                            0,
                            (oldData.totalRecordCount || oldData.items.length) - deletedIds.size,
                        ),
                    };
                }
                return oldData;
            });

            // 2. Parar reprodução ou avançar se a música excluída estiver tocando
            const playerState = usePlayerStore.getState();
            if (playerState.currentSong && deletedIds.has(playerState.currentSong.id)) {
                playerState.actions.skipTrack();
            }
            playerState.actions.clearSelected(items as any);

            // 3. Notificar sucesso absoluto
            const successMsg =
                items.length === 1
                    ? `Música "${items[0].title}" excluída completamente do sistema!`
                    : `${items.length} músicas excluídas completamente do sistema!`;

            toast.success({
                message: successMsg,
                title: 'Exclusão Concluída',
            });
        } catch (err: any) {
            toast.error({
                message: err.message || 'Falha ao deletar música do servidor VPS',
                title: 'Erro na Exclusão',
            });
        } finally {
            closeAllModals();
        }
    }, [items, queryClient, server?.url]);

    const openDeleteConfirmModal = useCallback(() => {
        if (!items || items.length === 0) return;

        const songName = items.length === 1 ? `"${items[0].title}"` : `${items.length} músicas`;

        openModal({
            children: (
                <ConfirmModal
                    labels={{
                        cancel: 'Cancelar',
                        confirm: 'Excluir do Servidor',
                    }}
                    onConfirm={handleDeleteSong}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Text fw={600} style={{ color: '#ff4d4f' }}>
                            Atenção: Exclusão Permanente no Servidor VPS
                        </Text>
                        <Text size="sm">
                            Deseja realmente apagar {songName} do sistema?
                        </Text>
                        <Text c="dimmed" size="xs">
                            O arquivo de áudio será removido fisicamente do disco da VPS e a faixa sairá
                            automaticamente de todos os dispositivos clientes conectados (Desktop e Mobile).
                        </Text>
                    </div>
                </ConfirmModal>
            ),
            title: 'Deletar Música Definitivamente',
        });
    }, [handleDeleteSong, items]);

    if (!items || items.length === 0) return null;

    return (
        <ContextMenu.Item
            disabled={disabled}
            leftIcon="delete"
            onSelect={openDeleteConfirmModal}
            style={{
                color: '#ff4d4f',
                fontWeight: 500,
            }}
        >
            {items.length > 1 ? 'Deletar Músicas do Servidor' : 'Deletar Música'}
        </ContextMenu.Item>
    );
};
