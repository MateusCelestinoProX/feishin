#!/usr/bin/env python3
"""
Patch para o processo principal do Feishin (out/main/index.js e out/preload/index.js).
Transforma o widget de bandeja padrão do macOS em um Mini Painel flutuante Liquid Glass.
"""

import sys
import os

def patch_main(main_js_path):
    if not os.path.exists(main_js_path):
        print(f"[!] Erro: Arquivo {main_js_path} não encontrado.")
        return False

    with open(main_js_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Target 1: createTray customization
    target = """  if (!isMacOS()) {
    tray.on("click", () => {
      if (store.get("window_minimize_to_tray") && mainWindow?.isVisible()) {
        hideMainWindowToTray();
      } else {
        showMainWindow();
      }
    });
  }
  tray.setToolTip("Feishin");
  tray.setContextMenu(contextMenu);"""

    helper_code = """
let trayMiniWindow = null;
let lastTrayState = null;

function createTrayMiniWindow() {
  if (trayMiniWindow && !trayMiniWindow.isDestroyed()) return trayMiniWindow;

  trayMiniWindow = new require$$0.BrowserWindow({
    width: 330,
    height: 470,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: true,
    vibrancy: "popover",
    visualEffectState: "active",
    webPreferences: {
      backgroundThrottling: false,
      sandbox: false,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false
    }
  });

  trayMiniWindow.loadFile(path$1.join(__dirname, "../renderer/tray-panel.html"));

  trayMiniWindow.on("blur", () => {
    if (trayMiniWindow && !trayMiniWindow.isDestroyed() && trayMiniWindow.isVisible()) {
      trayMiniWindow.hide();
    }
  });

  trayMiniWindow.webContents.on("did-finish-load", () => {
    if (lastTrayState && trayMiniWindow && !trayMiniWindow.isDestroyed()) {
      trayMiniWindow.webContents.send("tray-panel-update-state", lastTrayState);
    }
  });

  return trayMiniWindow;
}

function toggleTrayMiniPanel(bounds) {
  const win = createTrayMiniWindow();
  if (win.isVisible()) {
    win.hide();
    return;
  }
  const tb = bounds || tray.getBounds();
  const wb = win.getBounds();
  const display = require$$0.screen.getDisplayMatching(tb);
  let x = Math.round(tb.x + (tb.width / 2) - (wb.width / 2));
  let y = Math.round(tb.y + tb.height + 4);
  x = Math.max(display.workArea.x + 8, Math.min(x, display.workArea.x + display.workArea.width - wb.width - 8));
  win.setPosition(x, y, false);
  win.show();
  win.focus();

  if (lastTrayState) {
    win.webContents.send("tray-panel-update-state", lastTrayState);
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("tray-panel-request-state");
  }
}

function initPersonalOsTray(tray, contextMenu) {
  createTrayMiniWindow();

  tray.on("click", (_event, bounds) => {
    toggleTrayMiniPanel(bounds);
  });

  tray.on("right-click", () => {
    tray.popUpContextMenu(contextMenu);
  });
}

if (!require$$0.ipcMain.eventNames().includes("tray-panel-send-state")) {
  require$$0.ipcMain.on("tray-panel-send-state", (_event, state) => {
    lastTrayState = state;
    if (trayMiniWindow && !trayMiniWindow.isDestroyed()) {
      trayMiniWindow.webContents.send("tray-panel-update-state", state);
    }
  });
}

if (!require$$0.ipcMain.eventNames().includes("tray-panel-action")) {
  require$$0.ipcMain.on("tray-panel-action", (_event, action, payload) => {
    if (action === "open-main-window") {
      if (mainWindow === null) createWindow(false);
      else showMainWindow();
      if (trayMiniWindow && !trayMiniWindow.isDestroyed()) trayMiniWindow.hide();
      return;
    }
    if (action === "request-sync") {
      if (lastTrayState && trayMiniWindow && !trayMiniWindow.isDestroyed()) {
        trayMiniWindow.webContents.send("tray-panel-update-state", lastTrayState);
      }
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("tray-panel-request-state");
      }
      return;
    }
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("tray-panel-execute-action", { action, payload });
    }
  });
}

if (!require$$0.ipcMain.eventNames().includes("request-open-settings")) {
  require$$0.ipcMain.on("request-open-settings", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("renderer-open-settings");
    }
  });
}
"""

    replacement = helper_code + """
  tray.setToolTip("Feishin — Personal OS");
  if (isMacOS()) {
    initPersonalOsTray(tray, contextMenu);
  } else {
    tray.on("click", () => {
      if (store.get("window_minimize_to_tray") && mainWindow?.isVisible()) {
        hideMainWindowToTray();
      } else {
        showMainWindow();
      }
    });
    tray.setContextMenu(contextMenu);
  }"""

    if target in content:
        content = content.replace(target, replacement, 1)
        with open(main_js_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[✓] Patch aplicado em out/main/index.js com sucesso.")
        return True
    elif "initPersonalOsTray" in content:
        print("[-] Patch já presente em out/main/index.js.")
        return True
    else:
        print("[!] Aviso: Target não encontrado em out/main/index.js.")
        return False

def patch_preload(preload_js_path):
    if not os.path.exists(preload_js_path):
        print(f"[!] Erro: Arquivo {preload_js_path} não encontrado.")
        return False

    with open(preload_js_path, "r", encoding="utf-8") as f:
        content = f.read()

    target = """const ipc = {
  removeAllListeners,
  removeListener,
  send
};"""

    replacement = """const on = (channel, listener) => {
  electron.ipcRenderer.on(channel, listener);
  return () => electron.ipcRenderer.removeListener(channel, listener);
};
const ipc = {
  removeAllListeners,
  removeListener,
  send,
  on
};"""

    if target in content:
        content = content.replace(target, replacement, 1)
        with open(preload_js_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[✓] Patch aplicado em out/preload/index.js com sucesso.")
        return True
    elif "on: (channel, listener)" in content or "const ipc = {\n  removeAllListeners,\n  removeListener,\n  send,\n  on" in content:
        print("[-] Patch já presente em out/preload/index.js.")
        return True
    else:
        print("[!] Aviso: Target não encontrado em out/preload/index.js.")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python3 patch_main.py <caminho_out_main_index.js> <caminho_out_preload_index.js>")
        sys.exit(1)
    patch_main(sys.argv[1])
    patch_preload(sys.argv[2])
