import { ipcRenderer } from 'electron';

const exit = () => {
    ipcRenderer.send('window-close');
};

const maximize = () => {
    ipcRenderer.send('window-maximize');
};

const minimize = () => {
    ipcRenderer.send('window-minimize');
};

const unmaximize = () => {
    ipcRenderer.send('window-unmaximize');
};

const quit = () => {
    ipcRenderer.send('window-quit');
};

const devtools = () => {
    ipcRenderer.send('window-dev-tools');
};

const clearCache = (): Promise<void> => {
    return ipcRenderer.invoke('window-clear-cache');
};

const setFullScreen = (flag: boolean) => {
    ipcRenderer.send('window-set-fullscreen', flag);
};

const toggleFullScreen = () => {
    ipcRenderer.send('window-toggle-fullscreen');
};

const isFullScreen = (): Promise<boolean> => {
    return ipcRenderer.invoke('window-is-fullscreen');
};

export const browser = {
    clearCache,
    devtools,
    exit,
    isFullScreen,
    maximize,
    minimize,
    quit,
    setFullScreen,
    toggleFullScreen,
    unmaximize,
};

export type Browser = typeof browser;
