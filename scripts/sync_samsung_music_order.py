#!/usr/bin/env python3
import asyncio
import json
import os
import re
import subprocess
import urllib.request
from datetime import datetime
from pathlib import Path
from feishin_cdp import FeishinCDP

REPO_ROOT = Path(__file__).resolve().parent.parent
CUSTOMIZATIONS_DIR = REPO_ROOT / "customizations" / "assets"
SRC_CUSTOM_DIR = REPO_ROOT / "src" / "renderer" / "assets" / "custom"

async def main():
    print("[*] 1. Extraindo catálogo completo de áudio do Android via ADB Wireless...")
    adb_cmd = [
        "adb", "-s", "100.107.180.88:5555", "shell",
        "content query --uri content://media/external/audio/media --projection _id:title:artist:album:_data:date_modified:date_added:duration:_size --sort 'date_modified DESC'"
    ]
    res = subprocess.run(adb_cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"[!] Erro ao executar ADB: {res.stderr}")
        return

    android_tracks = []
    for line in res.stdout.strip().split("\n"):
        if not line.startswith("Row:"):
            continue
        parts = line.split(", ")
        row_data = {}
        for p in parts:
            if "=" in p:
                k, v = p.split("=", 1)
                row_data[k.strip()] = v.strip()

        data_path = row_data.get("_data", "")
        filename = os.path.basename(data_path)
        try:
            mtime = int(row_data.get("date_modified", "0"))
        except ValueError:
            mtime = 0
        try:
            size = int(row_data.get("_size", "0"))
        except ValueError:
            size = 0

        android_tracks.append({
            "id": row_data.get("_id"),
            "title": row_data.get("title", ""),
            "artist": row_data.get("artist", ""),
            "album": row_data.get("album", ""),
            "filename": filename,
            "date_modified": mtime,
            "date_added": int(row_data.get("date_added", "0")),
            "size": size,
            "isoDate": datetime.fromtimestamp(mtime).isoformat() if mtime else None
        })

    print(f"[✓] {len(android_tracks)} faixas extraídas do Android MediaStore.")

    print("[*] 2. Obtendo credenciais do Navidrome via Feishin CDP...")
    cdp = FeishinCDP()
    await cdp.connect()
    auth_srv = await cdp.evaluate('(() => { const a = JSON.parse(localStorage.getItem("store_authentication") || "{}"); return a?.state?.currentServer; })()')
    await cdp.close()

    url = auth_srv["url"]
    token = auth_srv["ndCredential"]

    print(f"[*] Conectando a {url}...")
    req = urllib.request.Request(
        f"{url}/api/song?_start=0&_end=3500",
        headers={"x-nd-authorization": f"Bearer {token}"}
    )
    with urllib.request.urlopen(req) as resp:
        navi_tracks = json.loads(resp.read().decode())
    print(f"[✓] {len(navi_tracks)} faixas carregadas do Navidrome.")

    # 3. Mapeamento bidirecional por filename (case-insensitive) e fallback (título limpo)
    def clean_key(s):
        if not s:
            return ""
        return re.sub(r'[^a-zA-Z0-9]', '', s.lower())

    android_by_filename = {}
    android_by_title = {}

    for idx, t in enumerate(android_tracks):
        fn = t["filename"].lower()
        if fn:
            android_by_filename[fn] = (idx, t)
        
        tk = clean_key(t["title"])
        if tk and tk not in android_by_title:
            android_by_title[tk] = (idx, t)

    matched = 0
    chronology_map = {} # song_id -> { date_modified, isoDate, rank, filename }

    for s in navi_tracks:
        song_id = s["id"]
        p = os.path.basename(s.get("path", "")).lower()
        title_key = clean_key(s.get("title", ""))

        match = None
        if p in android_by_filename:
            match = android_by_filename[p]
        elif title_key in android_by_title:
            match = android_by_title[title_key]

        if match:
            idx, t = match
            matched += 1
            chronology_map[song_id] = {
                "date_modified": t["date_modified"],
                "isoDate": t["isoDate"],
                "rank": idx,
                "filename": t["filename"]
            }
        else:
            # Fallback se não encontrado
            chronology_map[song_id] = {
                "date_modified": 0,
                "isoDate": s.get("createdAt"),
                "rank": 999999,
                "filename": os.path.basename(s.get("path", ""))
            }

    print(f"[✓] Mapeamento concluído: {matched} de {len(navi_tracks)} faixas casadas perfeitamente ({matched/len(navi_tracks)*100:.1f}%)!")

    # 4. Salvar dicionário de cronologia original em assets
    out_file = CUSTOMIZATIONS_DIR / "samsung-music-chronology.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(chronology_map, f, indent=2)
    print(f"[✓] Arquivo salvo em: {out_file}")

    out_js = CUSTOMIZATIONS_DIR / "samsung-music-chronology.js"
    with open(out_js, "w", encoding="utf-8") as f:
        f.write(f"// SAMSUNG MUSIC CHRONOLOGY DATABASE\nwindow.__SAMSUNG_MUSIC_CHRONOLOGY__ = {json.dumps(chronology_map)};\n")
    print(f"[✓] Script JS salvo em: {out_js}")

    if SRC_CUSTOM_DIR.exists():
        src_out = SRC_CUSTOM_DIR / "samsung-music-chronology.json"
        with open(src_out, "w", encoding="utf-8") as f:
            json.dump(chronology_map, f, indent=2)
        print(f"[✓] Arquivo sincronizado em: {src_out}")

        src_js = SRC_CUSTOM_DIR / "samsung-music-chronology.js"
        with open(src_js, "w", encoding="utf-8") as f:
            f.write(f"// SAMSUNG MUSIC CHRONOLOGY DATABASE\nwindow.__SAMSUNG_MUSIC_CHRONOLOGY__ = {json.dumps(chronology_map)};\n")
        print(f"[✓] Script JS sincronizado em: {src_js}")

if __name__ == "__main__":
    asyncio.run(main())