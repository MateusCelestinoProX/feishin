// HTMLMediaElement.volume throws an IndexSizeError outside [0, 1], so clamp
// the result to guard against unclamped inputs (persisted state, IPC, remote)
export const convertToLogVolume = (linearVolume: number) => {
    return Number.isFinite(linearVolume) ? Math.min(1, Math.max(0, linearVolume)) : 0;
};
