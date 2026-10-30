# Manifesto Completo de Auditoria, De/Para & Reversão Faixa a Faixa

> **Biblioteca Musical:** Navidrome Cloud Backend  
> **Total de Registros Auditados:** 1736 faixas  
> **Status Atual da Execução:** 100% RENAMED  
> **Banco de Dados Master:** `/home/ubuntu/apps/navidrome/music/music_manifest.db`  

---

## 1. Guia Operacional de Reversão Total (Rollback)

O sistema foi construído de forma transacional e estritamente reversível. Cada arquivo renomeado possui seu estado original indexado no banco SQLite.

### 1.1. Reversão Total em Lote (1 Comando)
Para desfazer todas as renomeações físicas de uma vez e restaurar tanto os arquivos de áudio quanto os arquivos de letras `.lrc` aos seus nomes originais exatos:

```bash
# Na VPS:
/home/ubuntu/apps/navidrome/tools/venv/bin/python /home/ubuntu/apps/navidrome/tools/music_normalizer.py \
    --dir /home/ubuntu/apps/navidrome/music \
    --rollback
```

### 1.2. Reversão Cirúrgica por Faixa Específica
Para restaurar apenas uma faixa isolada utilizando o ID registrado na tabela abaixo:

```python
import os, sqlite3

TARGET_ID = 42 # Exemplo: informe o ID da faixa
MUSIC_DIR = '/home/ubuntu/apps/navidrome/music'

conn = sqlite3.connect(f'{MUSIC_DIR}/music_manifest.db')
row = conn.execute('SELECT original_name, proposed_name FROM tracks WHERE id = ?', (TARGET_ID,)).fetchone()

if row:
    orig, prop = row
    cur_path = os.path.join(MUSIC_DIR, prop)
    orig_path = os.path.join(MUSIC_DIR, orig)
    if os.path.exists(cur_path):
        os.rename(cur_path, orig_path)
        conn.execute("UPDATE tracks SET status = 'PENDING', renamed_at = NULL WHERE id = ?", (TARGET_ID,))
        conn.commit()
        print(f'Faixa {TARGET_ID} revertida com sucesso: {prop} -> {orig}')
```

### 1.3. Re-sincronização dos Clientes Feishin após Reversão
1. **Backend Navidrome:** executar `docker restart navidrome` (o *folder watcher* reindexará a pasta imediatamente).
2. **Cliente macOS:** fechar e reabrir o app ou limpar caches em `~/Library/Application Support/feishin/Cache`.
3. **Cliente Android:** disparar recarga via CDP com `node eval_cdp.mjs 'location.reload();'`.

---

## 2. Registro Transacional Completo Faixa a Faixa (1.736 Registros)

| ID | Nome Original (DE) | Nome Canônico Aplicado (PARA) | Validação | Confiança | Status |
| :---: | :--- | :--- | :---: | :---: | :---: |
| 1 | `--The lost soul down - sped up   reverbed--(MP3_320K).mp3` | `The lost soul down - sped up reverbed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 2 | `--⚔️ DARK TRIAD V2 CALM⚔️--(MP3_320K).mp3` | `Kabus - DARK TRIAD V2 CALM.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 3 | `01. b e g o t t e n 自杀 - (longing) - 渴望(MP3_320K).mp3` | `b e g o t t e n 自杀 - (longing) - 渴望.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 4 | `02. b e g o t t e n 自杀 - (sensuous) - 感觉上的(MP3_320K).mp3` | `b e g o t t e n 自杀 - (Sensuous) - 感觉上的.mp3` | MusicBrainz | 92.0% | RENAMED |
| 5 | `03 - Lobao - Essa Noite Não - Ao sol de Parador (1(MP3_128K).mp3` | `Lobao - Essa Noite Não - Ao sol de Parador.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 6 | `03_ Adolescence(MP3_320K).mp3` | `J. Cole - 03' Adolescence.mp3` | iTunes | 95.0% | RENAMED |
| 7 | `05. b e g o t t e n 自杀 - (fluorite) - 萤石(MP3_320K).mp3` | `b e g o t t e n 自杀 - (fluorite) - 萤石.mp3` | MusicBrainz | 92.0% | RENAMED |
| 8 | `08. b e g o t t e n 自杀 - (hidden) - 隐藏(MP3_320K).mp3` | `b e g o t t e n 自杀 - (hidden) - 隐藏.mp3` | MusicBrainz | 92.0% | RENAMED |
| 9 | `08. b e g o t t e n 自杀 - (suffering) - 痛苦(MP3_320K).mp3` | `b e g o t t e n 自杀 - (suffering) - 痛苦.mp3` | MusicBrainz | 92.0% | RENAMED |
| 10 | `09. b e g o t t e n 自杀 - (bonus track) - 宽容 [tolerant](MP3_320K).mp3` | `b e g o t t e n 自杀 - (bonus track) - 宽容 [tolerant].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 11 | `13 Beaches(MP3_320K).mp3` | `Lana Del Rey - 13 Beaches.mp3` | iTunes | 90.0% | RENAMED |
| 12 | `14 Bis - Planeta Sonho(MP3_320K).mp3` | `14 Bis - Planeta Sonho.mp3` | iTunes | 95.0% | RENAMED |
| 13 | `157 X Terremoto(MP3_320K).mp3` | `d.silvestre, MC PR, MC Renatinho Falcão - 157 X Terremoto.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 14 | `187 (Official Lyric Video)(MP3_320K).mp3` | `itzjustbenzo - 187 (Official Lyric Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 15 | `187 Family - Glock(MP3_320K).mp3` | `187 Family - Glock.mp3` | MusicBrainz | 92.0% | RENAMED |
| 16 | `187 Family - Hollywood Is My Click(MP3_320K).mp3` | `187 Family - Hollywood Is My Click.mp3` | MusicBrainz | 92.0% | RENAMED |
| 17 | `187 Family - No Sleep(MP3_320K).mp3` | `187 Family - No Sleep.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 18 | `187 Family - Topic - 187 Is the Click.mp3` | `187 Family - 187 Is the Click.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 19 | `187 Family- Drinking (Screwed by DJ D.A.P)(MP3_320K).mp3` | `DJDAPCrenshaw - 187 Family- Drinking (Screwed by DJ D.A.P).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 20 | `1985 - Guilherme Arantes - Cheia de charme(MP3_128K).mp3` | `1985 - Guilherme Arantes - Cheia de charme.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 21 | `1992 Key(MP3_320K).mp3` | `Epure Oleandru - 1992 Key.mp3` | iTunes | 95.0% | RENAMED |
| 22 | `2 Low Key - On That Devil Shit.mp3` | `2 Low Key - On That Devil Shit.mp3` | MusicBrainz | 92.0% | RENAMED |
| 23 | `20 Minute K Suave Mix PT3 (w_ Transitions)(MP3_320K).mp3` | `MIX UP THE MAGIC - 20 Minute K Suave Mix PT3 (w - Transitions).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 24 | `2099(MP3_320K).mp3` | `DIEGO什麼 - 2099.mp3` | iTunes | 95.0% | RENAMED |
| 25 | `21 savage - bank account (slowed   reverb) [432Hz](MP3_320K).mp3` | `21 savage - bank account (Slowed + Reverb) [432Hz].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 26 | `2Pac - Grab My Strap Ft. Snoop Dogg_ Daz Dillinger _ Phil Collins (Nozzy-E Remix) (Prod By Dopfunk)(MP3_320K).mp3` | `2Pac - Grab My Strap Ft. Snoop Dogg_ Daz Dillinger _ Phil Collins (Nozzy-E Remix) (Prod By Dopfunk).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 27 | `334b00tleg(MP3_320K).mp3` | `XEOE & HR - 334b00tleg.mp3` | iTunes | 95.0% | RENAMED |
| 28 | `3X MEMORY REBOOT _ _NarventMusic_ _voj_official_ _VXLLAIN(MP3_320K).mp3` | `M_NGOO - 3X MEMORY REBOOT - @NarventMusic, @voj_official, @VXLLAIN.MP3.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 29 | `4_00 A.M(MP3_320K).mp3` | `Taeko Onuki - 4 -00 A.M..mp3` | iTunes | 95.0% | RENAMED |
| 30 | `50 Cent - In Da Club (Official Music Video)(MP3_320K).mp3` | `50 Cent - In Da Club.mp3` | iTunes | 95.0% | RENAMED |
| 31 | `50 Cent - Window Shopper.mp3` | `50 Cent - Window Shopper.mp3` | iTunes | 95.0% | RENAMED |
| 32 | `505 - Arctic Monkeys (Tradução_Letra)(MP3_320K).mp3` | `Arctic Monkeys - 505.mp3` | iTunes | 95.0% | RENAMED |
| 33 | `52 - Ivan Peter - Tchau Tchau Amor.mp3` | `Ivan Peter - Tchau Tchau Amor.mp3` | iTunes | 95.0% | RENAMED |
| 34 | `6. 10CC - I_m Not in Love(MP3_320K).mp3` | `10cc - I'm Not in Love.mp3` | iTunes | 95.0% | RENAMED |
| 35 | `707_hrtz(MP3_320K).mp3` | `XEOE & HR - 707_hrtz.mp3` | iTunes | 95.0% | RENAMED |
| 36 | `8pm in brazil but it_s brazilian funk - (prod. adturnup)(MP3_320K).mp3` | `8pm in brazil but it_s brazilian funk - (prod. adturnup).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 37 | `916frosty - birthday party(MP3_320K).mp3` | `916frosty - birthday party.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 38 | `916frosty - more(MP3_320K).mp3` | `916frosty - more.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 39 | `916frosty - waiting(MP3_320K).mp3` | `916frosty - waiting.mp3` | MusicBrainz | 92.0% | RENAMED |
| 40 | `A Flock Of Seagulls - I Ran (So Far Away).mp3` | `A Flock of Seagulls - I Ran (So Far Away).mp3` | iTunes | 95.0% | RENAMED |
| 41 | `A LUA CHEIA ILUMINA A FAVELA - MC Fefe Original (DJ Nog_ DJ Lobão ZL e DJ GH7)(MP3_320K).mp3` | `A LUA CHEIA ILUMINA A FAVELA - MC Fefe Original (DJ Nog_ DJ Lobão ZL e DJ GH7).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 42 | `A Loba(MP3_320K).mp3` | `Alcione - A Loba.mp3` | iTunes | 90.0% | RENAMED |
| 43 | `A Wood Which Blackbirds Guard(MP3_320K).mp3` | `DIM - A Wood Which Blackbirds Guard.mp3` | iTunes | 95.0% | RENAMED |
| 44 | `A-ha - I_ve been losing you.mp3` | `a-ha - I've Been Losing You.mp3` | iTunes | 95.0% | RENAMED |
| 45 | `ABBA - Dancing Queen.mp3` | `ABBA - Dancing Queen.mp3` | iTunes | 95.0% | RENAMED |
| 46 | `ABBA - Gimme_ Gimme_ Gimme_ (A Man After Midnight)(MP3_320K).mp3` | `ABBA - Gimme! Gimme! Gimme! (A Man After Midnight).mp3` | iTunes | 95.0% | RENAMED |
| 47 | `ACIDO (Alt Ver_ Super Slowed)(MP3_320K).mp3` | `ACIDO - Super Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 48 | `ADTurnUp - raining in chicago.mp3` | `ADTurnUp - raining in chicago.mp3` | iTunes | 95.0% | RENAMED |
| 49 | `ADTurnUp - space coupe (jersey club) - prod. adturnup.mp3` | `ADTurnUp - space coupe (jersey club) - prod. adturnup.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 50 | `ADTurnUp, mikeeysmind - Palace (No drums) - Slowed.mp3` | `ADTurnUp & mikeeysmind - Palace (No drums) [Slowed].mp3` | iTunes | 95.0% | RENAMED |
| 51 | `AMV Bleach_ Shinji Hirako VS Grimmjow(MP3_320K).mp3` | `AMV Bleach - Shinji Hirako VS Grimmjow.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 52 | `ANTXRES - PLAIN JANE w_ SCXR SOUL (Official Music Video)(MP3_320K).mp3` | `ANTXRES - PLAIN JANE w_ SCXR SOUL.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 53 | `ARCHANGEL x HER EYES [ULTRA SLOWED   REVERB] __(MP3_320K).mp3` | `RedstarMusic - ARCHANGEL x HER EYES [ULTRA SLOWED + REVERB].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 54 | `ASTRA (ULTRA SLOWED)(MP3_320K).mp3` | `BOLADA - ULTRA SLOWED.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 55 | `AZALEA - 卒業ですね (Sewerslvt Remix)(MP3_320K).mp3` | `AZALEA - 卒業ですね (Sewerslvt Remix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 56 | `Aaron Smith - Dancin (KRONO Remix)(MP3_320K).mp3` | `Aaron Smith - Dancin (feat. Luvli) [Krono Remix].mp3` | iTunes | 95.0% | RENAMED |
| 57 | `Absolute in doubt(MP3_320K).mp3` | `ＴＲＡＳＨ 新 ドラゴン - Absolute in doubt.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 58 | `Abstract Love(MP3_320K).mp3` | `𝐒𝐡𝐢𝐧𝐧𝐨𝐛𝐮 - Abstract Love.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 59 | `Abyssic Hate - Depression (Part I)(MP3_320K).mp3` | `Abyssic Hate - Depression, Part I.mp3` | MusicBrainz | 92.0% | RENAMED |
| 60 | `Activa - Daydreaming(MP3_160K).mp3` | `Activa - Daydreaming.mp3` | iTunes | 95.0% | RENAMED |
| 61 | `Adam Lambert - _Ghost Town_ [Official Music Video](MP3_320K).mp3` | `Adam Lambert - Ghost Town.mp3` | iTunes | 95.0% | RENAMED |
| 62 | `Adele - Skyfall (Lyric Video)(MP3_320K).mp3` | `Adele - Skyfall.mp3` | iTunes | 95.0% | RENAMED |
| 63 | `Adele - Someone Like You (Official Music Video)(MP3_320K).mp3` | `Adele - Someone Like You.mp3` | iTunes | 95.0% | RENAMED |
| 64 | `Adorável Clichê - Crescer(MP3_320K).mp3` | `Adorável Clichê - Crescer.mp3` | iTunes | 95.0% | RENAMED |
| 65 | `Adorável Clichê - Eu Invisível(MP3_320K).mp3` | `Adorável Clichê - Eu Invisível.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 66 | `Adorável Clichê - Nada a Dizer(MP3_320K).mp3` | `Adorável Clichê - Nada a dizer.mp3` | MusicBrainz | 92.0% | RENAMED |
| 67 | `Adorável Clichê - Poluição.mp3` | `Adorável Clichê - Poluição.mp3` | iTunes | 95.0% | RENAMED |
| 68 | `Adorável Clichê - Simpatia(MP3_320K).mp3` | `Adorável Clichê - Simpatia.mp3` | MusicBrainz | 92.0% | RENAMED |
| 69 | `Adorável Clichê - Topic - Artificial.mp3` | `Adorável Clichê - Artificial.mp3` | iTunes | 95.0% | RENAMED |
| 70 | `Adorável Clichê - Topic - Eu Só Queria Que Tudo Tivesse um Fim.mp3` | `Adorável Clichê - Eu Só Queria Que Tudo Tivesse um Fim.mp3` | iTunes | 95.0% | RENAMED |
| 71 | `Adorável Clichê - amarga.mp3` | `Adorável Clichê - amarga.mp3` | iTunes | 95.0% | RENAMED |
| 72 | `Adrian Gurvitz - Classic - Original Radio Version 96 - Remastered.mp3` | `Adrian Gurvitz - Classic - Original Radio Version 96 - Remastered.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 73 | `After Dark - Mr.Kitty (legendado)(MP3_320K).mp3` | `After Dark - Mr.Kitty (legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 74 | `After Dark x Sweater Weather (slowed and reverb)(MP3_320K).mp3` | `Slo, Twilight & Tazzy - After Dark x Sweater Weather - Slowed + Reverb.mp3` | iTunes | 90.0% | RENAMED |
| 75 | `Airiel - Airiel - In Your Room (Official Audio).mp3` | `Airiel - In Your Room.mp3` | iTunes | 95.0% | RENAMED |
| 76 | `Aizen Yokaso x Prince of Darkness(MP3_320K).mp3` | `lalalavinià mlbb - Aizen Yokaso x Prince of Darkness.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 77 | `Al Stewart - Year of the Cat (Official Audio)(MP3_70K).mp3` | `Al Stewart - Year of the Cat.mp3` | iTunes | 95.0% | RENAMED |
| 78 | `Alceu Valença - Coração Bobo(MP3_128K).mp3` | `Alceu Valença - Coração Bobo.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 79 | `Alec Benjamin - Let Me Down Slowly.mp3` | `Alec Benjamin - Let Me Down Slowly.mp3` | iTunes | 95.0% | RENAMED |
| 80 | `Aleff Nascimento - Masters at work - Work.mp3` | `Aleff Nascimento - Masters at work - Work.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 81 | `Alex LeMirage - Kratos (A Little Closer).mp3` | `Alex LeMirage - Kratos (A Little Closer).mp3` | iTunes | 95.0% | RENAMED |
| 82 | `Alexandra Stan - Crazy(MP3_320K).mp3` | `Alexandra Stan - Crazy.mp3` | iTunes | 95.0% | RENAMED |
| 83 | `Alice Deejay - Better Off Alone (Official Video)(MP3_320K).mp3` | `Alice DeeJay - Better Off Alone.mp3` | MusicBrainz | 92.0% | RENAMED |
| 84 | `All Around the World (Remastered)(MP3_320K).mp3` | `All Around the World - Remastered.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 85 | `All By MySelf by Eric Carmen.mp3` | `Bryant Duty - All By MySelf by Eric Carmen.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 86 | `All tomorrow_s parties - Velvet Underground and Ni.mp3` | `The Velvet Underground & Nico - All Tomorrow's Parties.mp3` | iTunes | 95.0% | RENAMED |
| 87 | `Alok - Hear Me Now - (Samuel Rhein REMIX).mp3` | `Alok - Hear Me Now - (Samuel Rhein REMIX).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 88 | `Alok_ ALOTT _ Apophis - Alone (Official Audio)(MP3_320K).mp3` | `Alok, ALOTT & Apophis - Alone.mp3` | iTunes | 95.0% | RENAMED |
| 89 | `Alphaville - Forever Young (2019 Remastered Audio)(MP3_320K).mp3` | `Alphaville - Forever Young (2019 Remastered Audio).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 90 | `Altars(MP3_320K).mp3` | `Foxes In Fiction - Altars.mp3` | iTunes | 95.0% | RENAMED |
| 91 | `Altogether(MP3_320K).mp3` | `Slowdive - Altogether.mp3` | iTunes | 95.0% | RENAMED |
| 92 | `Am I in Love(MP3_320K).mp3` | `Kon Kan - Am I In Love.mp3` | iTunes | 95.0% | RENAMED |
| 93 | `American Horror Story Freak Show Jessica Lange Gods and Monsters(MP3_70K).mp3` | `American Horror Story Cast - American Horror Story Freak Show Jessica Lange Gods and Monsters.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 94 | `American(MP3_320K).mp3` | `American.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 95 | `Amity(MP3_320K).mp3` | `Elliott Smith - Amity.mp3` | iTunes | 90.0% | RENAMED |
| 96 | `Analog Park(MP3_320K).mp3` | `The Gathering - Analog Park.mp3` | iTunes | 90.0% | RENAMED |
| 97 | `Anar - Bero 00.mp3` | `Anar - Bero 00.mp3` | iTunes | 95.0% | RENAMED |
| 98 | `Andrea Bocelli - Con Te Partirò.mp3` | `Andrea Bocelli - Con Te Partiro.mp3` | iTunes | 95.0% | RENAMED |
| 99 | `Angel Radio(MP3_320K).mp3` | `XEOE - Angel Radio.mp3` | iTunes | 95.0% | RENAMED |
| 100 | `Angeli Hierusalem(MP3_320K).mp3` | `ARGÁTA RECORDS - Angeli Hierusalem.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 101 | `Angus Stone - Wooden Chair Official Video(MP3_70K).mp3` | `Angus Stone - Wooden Chair Official Video.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 102 | `Anonymous_ Per omnia saecula saeculorum - Pater noster(MP3_320K).mp3` | `Anonymous_ Per omnia saecula saeculorum - Pater noster.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 103 | `Another Life (Afro House Edit) - Naomi Sharon x Adriel Arduino(MP3_320K).mp3` | `Another Life (Afro House Edit) - Naomi Sharon x Adriel Arduino.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 104 | `Antdot - Antdot, Maz, Dougwav - I See The Sun.mp3` | `Antdot - Antdot, Maz, Dougwav - I See The Sun.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 105 | `Antdot, Tato, soa - Morar No Mar.mp3` | `Antdot, Tato & soa - Morar No Mar.mp3` | iTunes | 95.0% | RENAMED |
| 106 | `Antdot_ Paulo Novaes_ Nina Oliveira - Viagem Ao Centro Do Eu (Coragem)(MP3_320K).mp3` | `Antdot, Paulo Novaes & Nina Oliveira - Viagem Ao Centro Do Eu (Coragem).mp3` | iTunes | 95.0% | RENAMED |
| 107 | `Anti-Flag - MODERN META MEDICINE ft. Jesse Leach(MP3_320K).mp3` | `Anti-Flag - MODERN META MEDICINE ft. Jesse Leach.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 108 | `Anti-Life(MP3_320K).mp3` | `Decalius - Anti - Life.mp3` | iTunes | 95.0% | RENAMED |
| 109 | `Apati - Morgondagen Legendado em PT-BR(MP3_320K).mp3` | `Apati - Morgondagen Legendado em PT-BR.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 110 | `Apati - Syndafloden Legendado em PT-BR(MP3_320K).mp3` | `Apati - Syndafloden Legendado em PT-BR.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 111 | `Aphex Twin - Xtal.mp3` | `Aphex Twin - Xtal.mp3` | iTunes | 95.0% | RENAMED |
| 112 | `Aphrodite_s Child - Rain and Tears (HQ)(MP3_320K).mp3` | `Aphrodite's Child - Rain and Tears.mp3` | iTunes | 95.0% | RENAMED |
| 113 | `Apocalypse - Cigarettes After Sex(MP3_70K).mp3` | `Cigarettes After Sex - Apocalypse.mp3` | iTunes | 95.0% | RENAMED |
| 114 | `Arabian Trap Music l Desert Trap Mix l Car Music M.mp3` | `Arabic Trap جبهة العربية - Arabian Trap Music l Desert Trap Mix l Car Music M.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 115 | `Arc North - Symphony (feat. Donna Tella) s-l-o-w  a-n-d  r-e-v-e-r-b _BASS BOOSTED_(MP3_160K).mp3` | `Arc North - Symphony (feat. Donna Tella) s-l-o-w a-n-d r-e-v-e-r-b _BASS BOOSTED.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 116 | `Arca - Reverie(MP3_320K).mp3` | `Arca - Reverie.mp3` | iTunes | 95.0% | RENAMED |
| 117 | `Arctic Monkeys - Do I Wanna Know_ (Official Video).mp3` | `Arctic Monkeys - Do I Wanna Know.mp3` | iTunes | 95.0% | RENAMED |
| 118 | `Arctic Monkeys - Snap Out Of It (Official Audio).mp3` | `Arctic Monkeys - Snap Out of It.mp3` | iTunes | 95.0% | RENAMED |
| 119 | `Argumentum Ad Nauseam(MP3_320K).mp3` | `Lamúria Abissal - Argumentum Ad Nauseam.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 120 | `Ariana Grande - bye [Altare Remix](MP3_320K).mp3` | `Ariana Grande - bye [Altare Remix].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 121 | `Asenssia_ VSN7  - Приворот [tradução __ legendado pt-br](MP3_320K).mp3` | `Asenssia_ VSN7 - Приворот.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 122 | `Asilo - 5X30 5 MIN_DAY ‍️ (ELA VIRA MORTAL) - DJ VILAO DS, MC ZUDO BOLADAO, DJ MAGRIN DA DZ7 - Slowed...mp3` | `Asilo - 5X30 5 MIN_DAY ‍️ (ELA VIRA MORTAL) - DJ VILAO DS, MC ZUDO BOLADAO, DJ MAGRIN DA DZ7 - Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 123 | `Asilo - Ultraphunk x David Goggins (I Dont Live Off That Hope....).mp3` | `Asilo - Ultraphunk x David Goggins (I Dont Live Off That Hope....).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 124 | `Athalyba E A Firma - Feminina (Letra_Legendado)(MP3_320K).mp3` | `Athalyba E A Firma - Feminina (Letra_Legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 125 | `Audiobook - A Energia do Silêncio - E .AL. ROPER(M4A_128K).m4a.m4a` | `Audiobook - A Energia do Silêncio - E .AL. ROPER(M4A_128K).m4a.m4a` | LocalHeuristic | 85.0% | RENAMED |
| 126 | `Automotivo da Zona Sul 4 (Slowed)(MP3_320K).mp3` | `MC MENOR DA ALVORADA - Automotivo da Zona Sul 4 (Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 127 | `Ave Maria - Gregorian(MP3_320K).mp3` | `Ave Maria - Gregorian.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 128 | `Avicii - Hey Brother.mp3` | `Avicii - Hey Brother.mp3` | iTunes | 95.0% | RENAMED |
| 129 | `Avicii -Wake Me Up (Audio).mp3` | `Avicii -Wake Me Up.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 130 | `Avril Lavigne - Hello Kitty.mp3` | `Avril Lavigne - Hello Kitty.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 131 | `Azathoth - H.P. Lovecraft.mp3` | `Azathoth - H.P. Lovecraft.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 132 | `BAIXO TECLAS 2 (Slowed)(MP3_320K).mp3` | `DJ Nexus8, -Prey - BAIXO TECLAS (Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 133 | `BANG_(MP3_320K).mp3` | `Trippie Redd - BANG!.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 134 | `BEACH HOUSE - SUPERSTAR (LYRIC ANIMATION)(MP3_320K).mp3` | `BEACH HOUSE - SUPERSTAR (LYRIC ANIMATION).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 135 | `BELCHIOR - TUDO OUTRA VEZ(MP3_320K).mp3` | `Belchior - Tudo Outra Vez.mp3` | iTunes | 95.0% | RENAMED |
| 136 | `BICEP _ ATLAS(MP3_70K).mp3` | `Bicep - BICEP - ATLAS.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 137 | `BLUFF (Super Slowed)(MP3_320K).mp3` | `BLUFF - Super Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 138 | `BOUNTY-HUNTER Woops (Ultra-Slowed)(MP3_320K).mp3` | `Neón-music - BOUNTY-HUNTER Woops (Ultra-Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 139 | `BOUNTYHUNTER - WHOOPS (SLOWED_REVERB)(MP3_320K).mp3` | `Bountyhunter - Woops (Slowed + Reverb).mp3` | iTunes | 95.0% | RENAMED |
| 140 | `BREIER SOFRE HATE PESADO MAS OLHA REAÇÃO DELE _breier  _gabrielbreier  _cortesdobreier  _estetica(MP3_160K).mp3` | `BREIER SOFRE HATE PESADO MAS OLHA REAÇÃO DELE #breier #gabrielbreier #cortesdobreier #estetica.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 141 | `BUSINESSMAN - Winning Business Mindset _ Subconscious Programming(MP3_320K).mp3` | `BUSINESSMAN - Winning Business Mindset _ Subconscious Programming.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 142 | `Bad Movie Scene(MP3_320K).mp3` | `The Gathering - Bad Movie Scene.mp3` | iTunes | 90.0% | RENAMED |
| 143 | `Baile do Coqueiro 5.0(MP3_320K).mp3` | `DJ Vilão DS, DJ WAAN, DJ WOODY ORIGINAL - Baile do Coqueiro 5.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 144 | `Baixo Cristal Teclas(MP3_320K).mp3` | `DJ Nexus8 - Baixo Cristal Teclas.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 145 | `Ballad Of Sister Sue(MP3_320K).mp3` | `Slowdive - Ballad of Sister Sue.mp3` | iTunes | 95.0% | RENAMED |
| 146 | `Ballroom_Vogue House_C_nt Beats Battle Mix(MP3_320K).mp3` | `Pestario - Ballroom - Vogue House - Cnt Beats Battle Mix.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 147 | `Bananarama - Venus (OFFICIAL MUSIC VIDEO)(MP3_128K).mp3` | `Bananarama - Venus.mp3` | iTunes | 95.0% | RENAMED |
| 148 | `Bandit(MP3_320K).mp3` | `Juice WRLD & YoungBoy Never Broke Again - Bandit.mp3` | iTunes | 95.0% | RENAMED |
| 149 | `Barbara Mason - Yes_ I_m Ready (1965)(MP3_320K).mp3` | `Barbara Mason - Yes, I'm Ready.mp3` | iTunes | 95.0% | RENAMED |
| 150 | `Bardeux - Bleeding Heart (freestyle).mp3` | `Bardeux - Bleeding Heart (freestyle).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 151 | `Barry Manilow - Mandy • TopPop(MP3_320K).mp3` | `Barry Manilow - Mandy • TopPop.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 152 | `Barry White-Just The Way You Are(MP3_320K).mp3` | `Barry WhiteBarry White - Barry White-Just The Way You Are.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 153 | `Beach Bunny - Prom Queen.mp3` | `Beach Bunny - Prom Queen.mp3` | iTunes | 95.0% | RENAMED |
| 154 | `Beach House - Somewhere tonight(MP3_70K).mp3` | `Beach House - Somewhere Tonight.mp3` | iTunes | 95.0% | RENAMED |
| 155 | `Beach House - Space Song(MP3_70K).mp3` | `Beach House - Space Song.mp3` | iTunes | 95.0% | RENAMED |
| 156 | `Beautiful War(MP3_320K).mp3` | `Kings of Leon - Beautiful War.mp3` | iTunes | 90.0% | RENAMED |
| 157 | `Bedroom - In My Head (Official Audio)(MP3_320K).mp3` | `Bedroom - In My Head.mp3` | iTunes | 95.0% | RENAMED |
| 158 | `Beijinho no Ombro(MP3_320K).mp3` | `Valesca Popozuda - Beijinho no Ombro.mp3` | iTunes | 90.0% | RENAMED |
| 159 | `Bela Infanta - Bela Infanta - Apenas Cinco - 05 - Constantina.mp3` | `Bela Infanta - Bela Infanta - Apenas Cinco - 05 - Constantina.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 160 | `Ben E. King - Stand by Me.mp3` | `Ben E. King - Stand By Me.mp3` | iTunes | 95.0% | RENAMED |
| 161 | `Benjamin Orr - Stay the Night (Official Music Video)(MP3_320K).mp3` | `Benjamin Orr - Stay the Night.mp3` | iTunes | 95.0% | RENAMED |
| 162 | `Best of Mental Minority(MP3_320K).mp3` | `Best of Mental Minority.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 163 | `Beverly Glenn-Copeland - La Vita (Official Video)(MP3_320K).mp3` | `Beverly Glenn-Copeland - La Vita.mp3` | iTunes | 95.0% | RENAMED |
| 164 | `Beyoncé - Haunted (Official) - Audio.mp3` | `Beyoncé - Haunted (Official) - Audio.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 165 | `Beyoncé - Pretty Hurts (Video)(MP3_320K).mp3` | `Beyoncé - Pretty Hurts.mp3` | iTunes | 95.0% | RENAMED |
| 166 | `Billie Holiday Vs Sebastian Tellier - Lulu Rouge Bootleg(MP3_320K).mp3` | `Billie Holiday Vs Sebastian Tellier - Lulu Rouge Bootleg.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 167 | `Billie Holiday-Speak Low(Bent Remix)(MP3_320K).mp3` | `Billie Holiday-Speak Low(Bent Remix).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 168 | `Billy Idol - Dancing With Myself.mp3` | `Billy Idol & Generation X - Dancing With Myself (EP Version).mp3` | iTunes | 95.0% | RENAMED |
| 169 | `Billy Idol - Eyes Without A Face (slowed   reverb)(MP3_320K).mp3` | `Billy Idol - Eyes Without A Face (Remastered 1999).mp3` | iTunes | 95.0% | RENAMED |
| 170 | `Billy Idol - Eyes Without A Face.mp3` | `Billy Idol - Eyes Without a Face.mp3` | iTunes | 95.0% | RENAMED |
| 171 | `Black Lodge(MP3_320K).mp3` | `Cult Member - Black Lodge.mp3` | iTunes | 95.0% | RENAMED |
| 172 | `Black Wing - Bollywood Apologetics(MP3_320K).mp3` | `Black Wing - Bollywood Apologetics.mp3` | iTunes | 95.0% | RENAMED |
| 173 | `BlackDynamite(MP3_320K).mp3` | `BONES - BlackDynamite.mp3` | MusicBrainz | 92.0% | RENAMED |
| 174 | `Blair Witch - Carter Tomorrow [Official Music Video](MP3_320K).mp3` | `Blair Witch - Carter Tomorrow.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 175 | `Blastoyz - Mandala (Original Mix).mp3` | `Blastoyz - Mandala (Original Mix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 176 | `Bleach - Asterisk(MP3_70K).mp3` | `Bleach - Asterisk.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 177 | `Bleach AMV _•Shunsui Bankai Edit• _ 春水卍解 _ °The Theatre Suicide°(MP3_320K).mp3` | `Yoruichi-san - 夜一さん - Bleach AMV - •Shunsui Bankai Edit• - 春水卍解 - °The Theatre Suicide°.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 178 | `Bleak - Forgotten Days(MP3_70K).mp3` | `Bleak - Forgotten Days.mp3` | MusicBrainz | 92.0% | RENAMED |
| 179 | `Blondie - Call me(MP3_320K).mp3` | `Blondie - Call Me.mp3` | MusicBrainz | 92.0% | RENAMED |
| 180 | `Blondie - Heart Of Glass(MP3_320K).mp3` | `Blondie - Heart of Glass.mp3` | MusicBrainz | 92.0% | RENAMED |
| 181 | `Bloodsport (Suite)(MP3_320K).mp3` | `Bloodsport (Suite).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 182 | `Bloodsport - Fight To Survive by Stan Bush (Extended Studio Version_ VERY RARE)(MP3_320K).mp3` | `Bloodsport - Fight To Survive by Stan Bush (Extended Studio Version_ VERY RARE).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 183 | `Blue Magic - In the Rain(MP3_320K).mp3` | `Blue Magic - In the Rain.mp3` | iTunes | 95.0% | RENAMED |
| 184 | `Blue Magic - Magic _(MP3_320K).mp3` | `Blue Magic - Magic #.mp3` | MusicBrainz | 92.0% | RENAMED |
| 185 | `Blue Magic - Sideshow (Vinyl Visualizer)(MP3_320K).mp3` | `Blue Magic - Sideshow (Vinyl Visualizer).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 186 | `Blue Magic - Since You_ve Been Gone(MP3_320K).mp3` | `Blue Magic - Since You've Been Gone.mp3` | iTunes | 95.0% | RENAMED |
| 187 | `Blue Oyster Cult - (Don_t Fear) The Reaper (Audio)(MP3_320K).mp3` | `Blue Öyster Cult - (Don't Fear) The Reaper.mp3` | iTunes | 95.0% | RENAMED |
| 188 | `Bob Marley - Could You Be Loved (Legendado - PT_BR)(MP3_320K).mp3` | `Bob Marley - Could You Be Loved (Legendado - PT_BR).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 189 | `Bones_ Xavier Wulf _ Chris Travis - WeDontBelieveYou(MP3_320K).mp3` | `Bones_ Xavier Wulf _ Chris Travis - WeDontBelieveYou.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 190 | `Bonnie Tyler - Total Eclipse of the Heart (Video).mp3` | `Bonnie Tyler - Total Eclipse of the Heart (Single Version).mp3` | iTunes | 95.0% | RENAMED |
| 191 | `Brahmacarya God - NoFap Semen Retention and Transmutation _ Energetically Programmed Audio(MP3_320K).mp3` | `Brahmacarya God - NoFap Semen Retention and Transmutation _ Energetically Programmed Audio.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 192 | `Brain Regeneration (Morphic and Energetic Programming) Experimental(MP3_320K).mp3` | `Brain Regeneration (Morphic and Energetic Programming) Experimental.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 193 | `Breathe(MP3_320K).mp3` | `Télépopmusik, Angela McCluskey - Breathe.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 194 | `Brian is the Most Beautiful(MP3_320K).mp3` | `Memo Boy - Brian is the Most Beautiful.mp3` | iTunes | 95.0% | RENAMED |
| 195 | `Bring Me The Horizon - Can You Feel My Heart(MP3_320K).mp3` | `Bring Me The Horizon - Can You Feel My Heart.mp3` | iTunes | 95.0% | RENAMED |
| 196 | `Bronski Beat - Smalltown Boy (Official Video).mp3` | `Bronski Beat - Smalltown Boy.mp3` | iTunes | 95.0% | RENAMED |
| 197 | `Bryan Adams - Heaven (Official Music Video)(MP3_70K).mp3` | `Bryan Adams - Heaven.mp3` | iTunes | 95.0% | RENAMED |
| 198 | `Bryan Adams - Straight From The Heart (2020)(MP3_320K).mp3` | `Bryan Adams - Straight from the Heart.mp3` | iTunes | 95.0% | RENAMED |
| 199 | `Buddha_s Eagle • Paul Hertzog • Kickboxer OST(MP3_320K).mp3` | `Buddha's Eagle • Paul Hertzog • Kickboxer OST.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 200 | `CASTLEBEAT - Change Your Mind(MP3_70K).mp3` | `CASTLEBEAT - Change Your Mind.mp3` | iTunes | 95.0% | RENAMED |
| 201 | `CASTLEBEAT - Heart Still Beats (Music Video)(MP3_70K).mp3` | `CASTLEBEAT - Heart Still Beats.mp3` | iTunes | 95.0% | RENAMED |
| 202 | `CASTLEBEAT - Topic - Dreamgaze.mp3` | `CASTLEBEAT - Dreamgaze.mp3` | iTunes | 95.0% | RENAMED |
| 203 | `CASTLEBEAT - Topic - East Coast.mp3` | `CASTLEBEAT - East Coast.mp3` | iTunes | 95.0% | RENAMED |
| 204 | `CÁLICE   Chico Buarque y Milton Nascimento.mp3` | `parbrigd pg mine - CÁLICE Chico Buarque y Milton Nascimento.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 205 | `CClassicRapMusicc - 187 Family - Real Niggas Thick.mp3` | `CClassicRapMusicc - 187 Family - Real Niggas Thick.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 206 | `CD Summer Eletrohits Vol. 1 (2004) Completo(MP3_70K).mp3` | `CD Summer Eletrohits Vol. 1 (2004) Completo.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 207 | `CD Summer Eletrohits Vol. 2 (2005) COMPLETO(MP3_70K).mp3` | `CD Summer Eletrohits Vol. 2 (2005) COMPLETO.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 208 | `CHAMA O COVEIRO - MC DELUX (DJ GUIH DA Z_O)(MP3_320K).mp3` | `CHAMA O COVEIRO - MC DELUX (DJ GUIH DA Z_O).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 209 | `CHÁ DE ROCK PESADO _ MC GW _ MC DIGUINHO _ DJ CAPONE O MLK DOS MANDELA _ DJ YOSHIDA(MP3_320K).mp3` | `DJ CAPONE O MLK DOS MANDELA, Mc Gw & DJ Yoshida - Chá de Rock Pesado.mp3` | iTunes | 95.0% | RENAMED |
| 210 | `CJ Bolland - There Can Only Be One(M4A_128K).m4a.m4a` | `CJ Bolland - There Can Only Be One(M4A_128K).m4a.m4a` | LocalHeuristic | 85.0% | RENAMED |
| 211 | `CLUB HOUSE   _ Deep In My Heart _   1991(MP3_320K).mp3` | `TheMikkehouse - CLUB HOUSE '' Deep In My Heart '' 1991.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 212 | `COMO LIDAR COM A ANSIEDADE E CULPA_ _ Dr. Lair Ribeiro _shorts(MP3_320K).mp3` | `COMO LIDAR COM A ANSIEDADE E CULPA - Dr. Lair Ribeiro #shorts.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 213 | `CRASPORE - Flashbacks (Slowed _ Reverb _ Bass Boosted ) Tik Tok(MP3_320K).mp3` | `CRASPORE - Flashbacks (Slowed _ Reverb _ Bass Boosted ) Tik Tok.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 214 | `CRINGUXA37 - crystal castles - kerosene (tiktok version - speed up).mp3` | `CRINGUXA37 - crystal castles - kerosene (tiktok version - speed up).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 215 | `CRYING (Don McLean)(MP3_320K).mp3` | `Don McLean - CRYING (Don McLean).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 216 | `CRYING (Don McLean).mp3` | `SandroTorricelli - CRYING (Don McLean).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 217 | `CRYST4L(MP3_320K).mp3` | `DARKXHAWK - CRYST4L.mp3` | iTunes | 95.0% | RENAMED |
| 218 | `CUTE (Sped Up)(MP3_320K).mp3` | `CUTE - Sped Up.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 219 | `CYREX - AFTERLIFE (OFFICIAL AUDIO)(MP3_320K).mp3` | `Cyrex - AFTERLIFE.mp3` | MusicBrainz | 92.0% | RENAMED |
| 220 | `CYREX - DISTANT.mp3` | `CYREX - DISTANT.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 221 | `CYREX - NEW DAWN(MP3_320K).mp3` | `Cyrex - NEW DAWN.mp3` | MusicBrainz | 92.0% | RENAMED |
| 222 | `Caetano Veloso - Língua(MP3_128K).mp3` | `Caetano Veloso - Língua.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 223 | `Caetano Veloso Podres Poderes.mp3` | `Luiz Castilho - Caetano Veloso Podres Poderes.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 224 | `Calcinha Preta - Mágica.mp3` | `Calcinha Preta - Mágica.mp3` | iTunes | 95.0% | RENAMED |
| 225 | `California World Sped Up(MP3_320K).mp3` | `Gniyrc - California World Sped Up.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 226 | `Calvin Harris _ Disciples - How Deep Is Your Love(MP3_320K).mp3` | `Calvin Harris, Disciples - How Deep Is Your Love.mp3` | iTunes | 95.0% | RENAMED |
| 227 | `Calvin Harris_ Rihanna - This Is What You Came For (Official Video) ft. Rihanna(MP3_320K).mp3` | `Calvin Harris & Rihanna - This Is What You Came For.mp3` | iTunes | 95.0% | RENAMED |
| 228 | `Camisa de Vênus - Só O Fim - Clip Original Remaste.mp3` | `Camisa de Vênus - Só O Fim - Clip Original Remaste.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 229 | `Can We Share a Dream(MP3_320K).mp3` | `Blue Magic - Can We Share a Dream.mp3` | iTunes | 95.0% | RENAMED |
| 230 | `Cannibal Corpse - Hammer Smashed Face(MP3_320K).mp3` | `Cannibal Corpse - Hammer Smashed Face.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 231 | `Cannibal Corpse - Priests Of Sodom (OFFICIAL VIDEO)(MP3_320K).mp3` | `Cannibal Corpse - Priests Of Sodom.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 232 | `Cannibal Corpse - Violence Unimagined (FULL ALBUM)(MP3_320K).mp3` | `Cannibal Corpse - Violence Unimagined.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 233 | `Captain Hollywood Project - Impossible (Official Video)(MP3_320K).mp3` | `Captain Hollywood Project - Impossible.mp3` | MusicBrainz | 92.0% | RENAMED |
| 234 | `Captain Hollywood Project - More and More (Official Video)(MP3_320K).mp3` | `Captain Hollywood Project - More and More.mp3` | MusicBrainz | 92.0% | RENAMED |
| 235 | `Captain Hollywood Project - More and More [Instrumental] Eurodance (1992)(MP3_320K).mp3` | `Captain Hollywood Project - More and More [Instrumental] Eurodance.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 236 | `Captain Hollywood Project - Only With You (Official Video)(MP3_320K).mp3` | `Captain Hollywood Project - Only With You.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 237 | `Carla Bruni - Quelqu_un M_a Dit (Legendado).mp3` | `Carla Bruni - Quelqu_un M_a Dit (Legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 238 | `Carlinhos(MP3_320K).mp3` | `Não ao Futebol Moderno - Carlinhos.mp3` | iTunes | 95.0% | RENAMED |
| 239 | `Carly Simon - Coming Around Again - Remastered 2004.mp3` | `Carly Simon - Coming Around Again - Remastered 2004.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 240 | `Carly Simon - You_re So Vain(MP3_320K).mp3` | `Carly Simon - You_re So Vain.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 241 | `Carter Tomorrow - Hideout (Feat. Mariah)(MP3_320K).mp3` | `Carter Tomorrow - Hideout (Feat. Mariah).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 242 | `Carter Tomorrow - Hold Me Close(MP3_320K).mp3` | `Carter Tomorrow - Hold Me Close.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 243 | `Carter Tomorrow - Lucy(MP3_320K).mp3` | `Carter Tomorrow - Lucy.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 244 | `Cathedral Bells - Dayflower.mp3` | `Cathedral Bells - Dayflower.mp3` | iTunes | 95.0% | RENAMED |
| 245 | `Celine Dion - My Heart Will Go On.mp3` | `Céline Dion - My Heart Will Go On.mp3` | MusicBrainz | 92.0% | RENAMED |
| 246 | `Charli XCX - Constant Repeat (yaego remix)(MP3_320K).mp3` | `Charli XCX - Constant Repeat (yaego remix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 247 | `Charlie Brown Jr. - Dias De Luta_ Dias De Glória(MP3_320K).mp3` | `Charlie Brown Jr. - Dias de Luta, Dias de Gloria.mp3` | iTunes | 95.0% | RENAMED |
| 248 | `Chase Atlantic - Into It.mp3` | `Chase Atlantic - Into It.mp3` | MusicBrainz | 92.0% | RENAMED |
| 249 | `Cherish the Day(MP3_320K).mp3` | `Sade - Cherish the Day.mp3` | iTunes | 95.0% | RENAMED |
| 250 | `Chernikovskaya Hata - stavlju na zero(MP3_320K).mp3` | `Chernikovskaya Hata - Stavlju Na Zero.mp3` | MusicBrainz | 92.0% | RENAMED |
| 251 | `Chico Buarque - Vai Passar - Letra (Vídeo Clipe)(MP3_320K).mp3` | `Chico Buarque - Vai Passar - Letra (Vídeo Clipe).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 252 | `Children Of The Corn - Devil Shyt(MP3_320K).mp3` | `Children of the Corn - Devil Shyt.mp3` | MusicBrainz | 92.0% | RENAMED |
| 253 | `Chips - Azealia Banks(MP3_320K).mp3` | `Chips - Azealia Banks.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 254 | `Christopher Cross - Ride Like The Wind(MP3_320K).mp3` | `Christopher Cross - Ride Like the Wind (2019 Remaster).mp3` | iTunes | 95.0% | RENAMED |
| 255 | `Cidade Dormitório - Agora o Meu Coração é Um Lixeiro Azul Vazio Escroto(MP3_320K).mp3` | `Cidade Dormitório - Agora o Meu Coração É um Lixeiro Azul Vazio Escroto (Ao Vivo).mp3` | iTunes | 95.0% | RENAMED |
| 256 | `Cidade Dormitório - Relacionamentos são extremamente complicados e meu cachorro sabe disso(MP3_320K).mp3` | `Cidade Dormitório - Relacionamentos São Extremamente Complicados e Meu Cachorro Sabe Disso (Ao Vivo).mp3` | iTunes | 95.0% | RENAMED |
| 257 | `Clara La San - In This Darkness.mp3` | `Clara La San - In This Darkness.mp3` | iTunes | 95.0% | RENAMED |
| 258 | `Clara Nunes - Canto Das Três Raças.mp3` | `Clara Nunes - Canto Das Três Raças.mp3` | iTunes | 95.0% | RENAMED |
| 259 | `Close Your Mind(MP3_320K).mp3` | `Epure Oleandru - Close Your Mind.mp3` | iTunes | 95.0% | RENAMED |
| 260 | `Cocteau Twins, Harold Budd - Sea, Swallow Me.mp3` | `Cocteau Twins & Harold Budd - Sea, Swallow Me.mp3` | iTunes | 95.0% | RENAMED |
| 261 | `Cold Blood(MP3_320K).mp3` | `Wilee - Cold Blood.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 262 | `Coldplay _ Rihanna - Princess of China (Tradução) (Legendado) (Clipe Oficial)(MP3_320K).mp3` | `Coldplay _ Rihanna - Princess of China (Tradução) (Legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 263 | `Colin Stetson - The righteous wrath of an honorable man.mp3` | `Colin Stetson - The Righteous Wrath of an Honorable Man.mp3` | iTunes | 95.0% | RENAMED |
| 264 | `Colorado Incident(MP3_320K).mp3` | `The Gathering - Colorado Incident.mp3` | iTunes | 90.0% | RENAMED |
| 265 | `ComME 54 Chanel - “ 7 weeks & 3 days ” intro loop (Luigi version) [ Slowed + reverb ].mp3` | `ComME 54 Chanel - “ 7 weeks & 3 days ” intro loop (Luigi version) [ Slowed + reverb].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 266 | `Come Undone - Duran Duran (slow   reverb) _)(MP3_160K).mp3` | `Come Undone - Duran Duran (slow reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 267 | `Compressa(MP3_320K).mp3` | `Adorável Clichê - Compressa.mp3` | iTunes | 95.0% | RENAMED |
| 268 | `Confirmbackup - Spacewave.mp3` | `Confirmbackup - Spacewave.mp3` | iTunes | 95.0% | RENAMED |
| 269 | `Conhecendo o Antigravity - AiVerso.mp3` | `Conhecendo o Antigravity - AiVerso.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 270 | `Conquer (Slowed)(MP3_320K).mp3` | `Conquer - Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 271 | `Corpo e Canção (Club Mix)(MP3_320K).mp3` | `Corpo e Canção - Club Mix.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 272 | `Crave (MNEK Remix)(MP3_320K).mp3` | `Madonna - Crave (MNEK Remix).mp3` | iTunes | 95.0% | RENAMED |
| 273 | `Crazy for You (Alternative Version (Demo Version))(MP3_320K).mp3` | `Slowdive - Crazy for You (Alternative Version - Demo Version).mp3` | iTunes | 95.0% | RENAMED |
| 274 | `Crowded House - Don_t Dream It_s Over.mp3` | `Crowded House - Don't Dream It's Over.mp3` | iTunes | 95.0% | RENAMED |
| 275 | `Crystal Castles - Empathy(MP3_320K).mp3` | `Crystal Castles - Empathy.mp3` | iTunes | 95.0% | RENAMED |
| 276 | `CtrlAltDelete(MP3_320K).mp3` | `BONES - CtrlAltDelete.mp3` | MusicBrainz | 92.0% | RENAMED |
| 277 | `Cult Member - ten(MP3_320K).mp3` | `Cult Member - ten.mp3` | iTunes | 95.0% | RENAMED |
| 278 | `Cut Off Your Hands - You Should Do Better.mp3` | `Cut Off Your Hands - You Should Do Better.mp3` | iTunes | 95.0% | RENAMED |
| 279 | `Cyberion - None Of Them Knew(MP3_320K).mp3` | `Cyberion - None Of Them Knew.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 280 | `Cyndi Lauper - Girls Just Want To Have Fun (Offici.mp3` | `Cyndi Lauper - Girls Just Want to Have Fun.mp3` | iTunes | 95.0% | RENAMED |
| 281 | `Cyndi Lauper - What_s Going On(MP3_128K).mp3` | `Cyndi Lauper - What_s Going On.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 282 | `DARK TRIAD EMBODIMENT (High Functioning Psycho_ Extrovert_ Narcissist_ Machiavellism) _ Mind Doping(MP3_320K).mp3` | `DARK TRIAD EMBODIMENT (High Functioning Psycho, Extrovert, Narcissist, Machiavellism) - Mind Doping.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 283 | `DEATH PLUS x Lil Peep - Piss (lyrics)(MP3_320K).mp3` | `DEATH PLUS x Lil Peep - Piss.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 284 | `DEATHWISH (SLOWED)(MP3_320K).mp3` | `Leo Playa - DEATHWISH (SLOWED).mp3` | iTunes | 95.0% | RENAMED |
| 285 | `DESIRELESS _ L_EXPERIENCE HUMAINE(MP3_128K).mp3` | `desirelessclo - DESIRELESS - L'EXPERIENCE HUMAINE.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 286 | `DJ BilLRemixer NBSPLV - Cold Waves (Bass Boosted Remix)(MP3_70K).mp3` | `DJ BilLRemixer NBSPLV - Cold Waves (Bass Boosted Remix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 287 | `DJ FKU - MTG - VINGANÇA (Slowed + Reverb).mp3` | `DJ FKU - MTG - VINGANÇA (Slowed + Reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 288 | `DJ P7 - Topic - No Pique do Atabaque.mp3` | `DJ P7 - No Pique do Atabaque.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 289 | `DNA feat. Suzanne Vega - Tom_s Diner (7_ Version)(MP3_320K).mp3` | `DNA feat. Suzanne Vega - Tom_s Diner (7_ Version).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 290 | `DREAMSYSTEM(MP3_320K).mp3` | `Yaego - DREAMSYSTEM.mp3` | iTunes | 95.0% | RENAMED |
| 291 | `DURO SEM DINHEIRO_ SOU FEIO IGUAL O DIABO - TIK TOK - MC Danflin e MC RD (DJ Luan PJ _ Maninho ZK)(MP3_320K).mp3` | `DURO SEM DINHEIRO_ SOU FEIO IGUAL O DIABO - TIK TOK - MC Danflin e MC RD (DJ Luan PJ _ Maninho ZK).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 292 | `Daegho - I WANT U.mp3` | `Daegho - I WANT U.mp3` | MusicBrainz | 92.0% | RENAMED |
| 293 | `Danny  Tenaglia - OhNo -  Danny_s  Twisted  Realness  Mix.    1996.         (HD)(MP3_70K).mp3` | `Danny Tenaglia - ohno - Danny's TWISTED Realness Mix.mp3` | iTunes | 95.0% | RENAMED |
| 294 | `Dark Atmospheric Music from the Shadowlands(MP3_320K).mp3` | `Cryo Chamber - Dark Atmospheric Music from the Shadowlands.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 295 | `Dark Gate(MP3_320K).mp3` | `Epure Oleandru - Dark Gate.mp3` | iTunes | 95.0% | RENAMED |
| 296 | `David Bowie - Let_s Dance.mp3` | `David Bowie - LET`S DANCE.mp3` | MusicBrainz | 92.0% | RENAMED |
| 297 | `David Guetta - Play Hard ft. Ne-Yo_ Akon (Official Video)(MP3_320K).mp3` | `David Guetta - Play Hard (feat. Akon & Ne-Yo).mp3` | iTunes | 95.0% | RENAMED |
| 298 | `Dayglow - Can I Call You Tonight_(MP3_320K).mp3` | `Dayglow - Can I Call You Tonight.mp3` | iTunes | 95.0% | RENAMED |
| 299 | `Death - Trapped In A Corner (HQ)(MP3_320K).mp3` | `Death - Trapped In a Corner.mp3` | iTunes | 95.0% | RENAMED |
| 300 | `Death Lotto (Instrumental)(MP3_320K).mp3` | `ovg! & Grioten - Death Lotto (Instrumental).mp3` | iTunes | 95.0% | RENAMED |
| 301 | `Deaths - Old Town(MP3_320K).mp3` | `Deaths - Old Town.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 302 | `Deep Forest - Forest Hymn_1.mp3` | `Deep Forest - Forest Hymn.mp3` | iTunes | 95.0% | RENAMED |
| 303 | `Deep Forest - Sweet Lullaby (Original Completo).mp3` | `Deep Forest - Sweet Lullaby (Original Completo).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 304 | `Deep Purple-Child in Time(MP3_320K).mp3` | `shotguy1 - Deep Purple-Child in Time.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 305 | `Demis Roussos - Forever and Ever.mp3` | `Demis Roussos - Forever and Ever.mp3` | iTunes | 95.0% | RENAMED |
| 306 | `Demis Roussos - We Shall Dance(MP3_320K).mp3` | `Demis Roussos - We Shall Dance.mp3` | iTunes | 95.0% | RENAMED |
| 307 | `Demis Roussos Best Songs - Demis Roussos Greatest Hits Full Album(MP3_320K).mp3` | `Demis Roussos Best Songs - Demis Roussos Greatest Hits Full Album.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 308 | `Denov - Se Essa Noite Eu Morrer Pt. 2 (Clipe Oficial)(MP3_70K).mp3` | `Denov - Se Essa Noite Eu Morrer, Pt. 2.mp3` | iTunes | 95.0% | RENAMED |
| 309 | `Denov - Se Essa Noite Eu Morrer part. 3 Feat. Sidoka《letra》(MP3_70K).mp3` | `Denov - Se Essa Noite Eu Morrer part. 3 Feat. Sidoka《letra》.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 310 | `Depeche Mode - Strangelove (Remastered Video).mp3` | `Depeche Mode - Strangelove (Remastered Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 311 | `Depeche Mode - Stripped (Official Video)(MP3_320K).mp3` | `Depeche Mode - Stripped.mp3` | MusicBrainz | 92.0% | RENAMED |
| 312 | `Derek Pope - Awake (Official Music Video)(MP3_320K).mp3` | `Derek Pope - Awake.mp3` | MusicBrainz | 92.0% | RENAMED |
| 313 | `Derrix - Robot (Original Mix).mp3` | `Derrix - Robot (Original Mix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 314 | `Desire - Under Your Spell(MP3_70K).mp3` | `Desire - Under Your Spell.mp3` | iTunes | 95.0% | RENAMED |
| 315 | `Desireless - Hari om Ramakrishna.mp3` | `Desireless - Hari Ôm Ramakrishna.mp3` | iTunes | 95.0% | RENAMED |
| 316 | `Desireless - John (new version) ft Operation Of Th(MP3_128K).mp3` | `Desireless - John (new version) ft Operation Of Th.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 317 | `Desireless - Qui sommes nous _(MP3_128K).mp3` | `Desireless - Qui sommes nous.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 318 | `Desireless - Voyage Voyage.mp3` | `Desireless - Voyage voyage.mp3` | iTunes | 95.0% | RENAMED |
| 319 | `Desireless john.mp3` | `rurkano - Desireless john.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 320 | `Desireless-Oublie -Les Oublie.mp3` | `XLXIXZ - Desireless-Oublie -Les Oublie.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 321 | `Desireless◆Animal.mp3` | `xMUGIx - Desireless◆Animal.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 322 | `Desireless◆Les commencements.mp3` | `xMUGIx - Desireless◆Les commencements.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 323 | `Devaneios _ Te Odeio... Te Amo _ Hey(MP3_320K).mp3` | `Devaneios - Te Odeio... Te Amo - Hey.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 324 | `DevilDriver - End Of The Line [OFFICIAL VIDEO].mp3` | `DevilDriver - End of the Line.mp3` | iTunes | 95.0% | RENAMED |
| 325 | `Devilish Collector - Kingpin Skinny Pimp - Nobody Crosses Me.mp3` | `Devilish Collector - Kingpin Skinny Pimp - Nobody Crosses Me.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 326 | `Diamondz n Roses (Back It Up_) [Slowed _ Reverbed] - VaporGod(MP3_320K).mp3` | `VaporGod - Diamondz n Roses (Back It Up!) [Slowed & Reverbed].mp3` | iTunes | 95.0% | RENAMED |
| 327 | `Did it all for Love _ Phenomena II  - Sucesso de 1(MP3_128K).mp3` | `Did it all for Love _ Phenomena II - Sucesso de 1.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 328 | `Dido - Thank You (Lyrics)(MP3_320K).mp3` | `Dido - Thank You.mp3` | iTunes | 95.0% | RENAMED |
| 329 | `Dido - Thank you (Slowed   Reverb)(MP3_320K).mp3` | `Dido - Thank you (Slowed Reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 330 | `Dimitris Athanasiou -  The Train Station(MP3_320K).mp3` | `Dimitris Athanasiou - The Train Station.mp3` | iTunes | 95.0% | RENAMED |
| 331 | `Dimuthzd - HXVRMXN (Tension slowed   reverb)(MP3_320K).mp3` | `Dimuthzd - HXVRMXN (Tension slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 332 | `Dimuthzd - Hensonn (Galaxy slowed   reverb)(MP3_320K).mp3` | `Dimuthzd - Hensonn (Galaxy slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 333 | `Dionne Warwick - Heartbreaker [Remastered](MP3_320K).mp3` | `Dionne Warwick - Heartbreaker (Remastered).mp3` | iTunes | 95.0% | RENAMED |
| 334 | `Dionnysuss - Fangs (slowed   reverb)(MP3_320K).mp3` | `Dionnysuss - Fangs (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 335 | `Dj Gecko - Mienteme Tribal.mp3` | `Dj Gecko - Mienteme Tribal.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 336 | `Do Ya Like x Resonance Mashup(MP3_160K).mp3` | `marcella - Do Ya Like x Resonance Mashup.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 337 | `Dol drums - The Rare Occasions - Notion.mp3` | `Dol drums - The Rare Occasions - Notion.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 338 | `Don McLean - American Pie (Lyric Video)(MP3_320K).mp3` | `Don McLean - American Pie.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 339 | `Don_t Wanna Be By Myself(MP3_320K).mp3` | `Blue Magic - Don't Wanna Be By Myself.mp3` | iTunes | 95.0% | RENAMED |
| 340 | `Doruksen - Intoxicated (Super Slowed).mp3` | `Doruksen - Intoxicated (Super Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 341 | `Douzi - Ana Maghrabi (Exclusive New Version) _ (الدوزي - أنا مغربي (حصرياً(MP3_320K).mp3` | `Douzi - Ana Maghrabi (Exclusive New Version) _ (الدوزي - أنا مغربي (حصرياً)).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 342 | `Drab Majesty - _Ellipsis_ (Official Video)(MP3_320K).mp3` | `Drab Majesty - Ellipsis.mp3` | iTunes | 95.0% | RENAMED |
| 343 | `Dream_ Ivory - welcome and goodbye (Official Video)(MP3_320K).mp3` | `Dream, Ivory - Welcome and Goodbye.mp3` | iTunes | 95.0% | RENAMED |
| 344 | `Dreams(MP3_320K).mp3` | `Gabriela Márcia - Dreams.mp3` | MusicBrainz | 92.0% | RENAMED |
| 345 | `Drop Nineteens - _Shannon Waves_(MP3_320K).mp3` | `Drop Nineteens - Shannon Waves.mp3` | iTunes | 95.0% | RENAMED |
| 346 | `Drowning Myself(MP3_320K).mp3` | `Nocturnal Depression - Drowning Myself.mp3` | iTunes | 95.0% | RENAMED |
| 347 | `Dua Lipa - Be The One (Official Music Video).mp3` | `Dua Lipa - Be the One.mp3` | iTunes | 95.0% | RENAMED |
| 348 | `Dude Vs.  Killa (But its actually good)(MP3_320K).mp3` | `Dude Vs. Killa (But its actually good) - Dude Vs. Killa (But its actually good).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 349 | `Dude vs. Killa(MP3_320K).mp3` | `Killa Dude - Dude vs. Killa.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 350 | `Dur-Dur Band Sahra Dawo - Gorof (Elixir).mp3` | `Dur-Dur Band Sahra Dawo - Gorof (Elixir).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 351 | `Dur-Dur Band, Sahra Dawo - Gorof (Elixir).mp3` | `Dur-Dur Band, Sahra Dawo - Gorof (Elixir).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 352 | `Duran Duran - A Matter Of Feeling(MP3_128K).mp3` | `Duran Duran - A Matter of Feeling.mp3` | iTunes | 95.0% | RENAMED |
| 353 | `Duran Duran - Come Undone.mp3` | `Duran Duran - Come Undone.mp3` | iTunes | 95.0% | RENAMED |
| 354 | `Duran Duran - Save A Prayer.mp3` | `Duran Duran - Save a Prayer.mp3` | iTunes | 95.0% | RENAMED |
| 355 | `Duran Duran - The Reflex.mp3` | `Duran Duran - The Reflex.mp3` | MusicBrainz | 92.0% | RENAMED |
| 356 | `EEYUH_ x Fluxxwave (Slowed   Reverb)(MP3_320K).mp3` | `Clovis Reyes, HR & Irokz - EEYUH! x Fluxxwave (Slowed + Reverb).mp3` | iTunes | 95.0% | RENAMED |
| 357 | `ELEVEN - deserve it (now on spotify) (Official Audio)(MP3_320K).mp3` | `ELEVEN - deserve it (now on spotify).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 358 | `ELEVEN - eat it up (Official Audio) (prod. lmg)(MP3_320K).mp3` | `ELEVEN - eat it up (prod. lmg).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 359 | `ELEVEN - enslaved to humanity (now on spotify) (Official Audio) (prod. lmg x thep4x)(MP3_320K).mp3` | `ELEVEN - enslaved to humanity (now on spotify) (prod. lmg x thep4x).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 360 | `ELEVEN - flood with scars (Official Audio) (prod. tenoji)(MP3_320K).mp3` | `ELEVEN - flood with scars (prod. tenoji).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 361 | `ELEVEN - gloomy love (now on spotify) (Official Audio)(MP3_320K).mp3` | `ELEVEN - gloomy love (now on spotify).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 362 | `ELEVEN - gothic ballroom (Official Audio) (prod. grayskies)(MP3_320K).mp3` | `ELEVEN - gothic ballroom (prod. grayskies).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 363 | `ELEVEN - kindness is weakness (Official Audio) (prod. yamis sin)(MP3_320K).mp3` | `ELEVEN - kindness is weakness (prod. yamis sin).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 364 | `ELEVEN - midnight express (Official Audio) (prod. jUdAh)(MP3_320K).mp3` | `ELEVEN - midnight express (prod. jUdAh).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 365 | `ELEVEN - sandcastle (Official Audio) (on spotify now) (prod. anticon)(MP3_320K).mp3` | `ELEVEN - sandcastle (on spotify now) (prod. anticon).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 366 | `ELEVEN - shackles (Official Audio) (prod. flex dolph)(MP3_320K).mp3` | `ELEVEN - shackles (prod. flex dolph).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 367 | `ELEVEN - shadows in my room (Official Audio) (prod. beatzbyluc)(MP3_320K).mp3` | `ELEVEN - shadows in my room (prod. beatzbyluc).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 368 | `ELEVEN - so much for that (Official Audio) (prod. dan darmawan)(MP3_320K).mp3` | `ELEVEN - so much for that (prod. dan darmawan).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 369 | `ERA - Ameno.mp3` | `ERA - Ameno.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 370 | `ERA - Divano.mp3` | `Era - Divano.mp3` | MusicBrainz | 92.0% | RENAMED |
| 371 | `ERA - Enae Volare Mezzo.mp3` | `ERA - Enae Volare Mezzo (Remix).mp3` | iTunes | 95.0% | RENAMED |
| 372 | `ERA - Infanati.mp3` | `Era - Infanati.mp3` | MusicBrainz | 92.0% | RENAMED |
| 373 | `ERA - Reborn.mp3` | `Era - Reborn.mp3` | MusicBrainz | 92.0% | RENAMED |
| 374 | `ERA - The Mass.mp3` | `Era - The Mass.mp3` | MusicBrainz | 92.0% | RENAMED |
| 375 | `ERA - don_t you forget about me (HD).mp3` | `ERA - don_t you forget about me.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 376 | `ESPANCA OUVIDO INTERPLANETARIO - EU TO CHAPADA - (DJ GHR) - MC EVELLYN [SLOWED] [RIN _ SAE](MP3_320K).mp3` | `ESPANCA OUVIDO INTERPLANETARIO - EU TO CHAPADA - (DJ GHR) - MC EVELLYN [SLOWED] [RIN _ SAE].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 377 | `EU NÃO QUERO TE ILUDIR VS TOMA PAU (DJ VINI ZS)(MP3_320K).mp3` | `DJ VINI ZS - EU NÃO QUERO TE ILUDIR VS TOMA PAU (DJ VINI ZS).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 378 | `EUROPA(MP3_320K).mp3` | `Yaego - EUROPA.mp3` | iTunes | 95.0% | RENAMED |
| 379 | `EYEDRESS - SOMETHING ABOUT YOU (FEAT. DENT MAY) (OFFICIAL VIDEO)(MP3_320K).mp3` | `Eyedress & Dent May - Something About You.mp3` | iTunes | 95.0% | RENAMED |
| 380 | `Earth Hears No Hurtle(MP3_320K).mp3` | `DIM - Earth Hears No Hurtle.mp3` | iTunes | 95.0% | RENAMED |
| 381 | `Echosmith - Cool Kids (Jesse Bloch Bootleg).mp3` | `Echosmith - Cool Kids (Jesse Bloch Bootleg).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 382 | `Ed Sheeran - Photograph (Official Music Video)(MP3_320K).mp3` | `Ed Sheeran - Photograph.mp3` | iTunes | 95.0% | RENAMED |
| 383 | `Edi Rock - That_s My Way (Audio Oficial) feat. Seu Jorge(MP3_320K).mp3` | `Edi Rock - That_s My Way (Audio Oficial) feat. Seu Jorge.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 384 | `Eiffel 65 - Blue (Da Ba Dee) [Gabry Ponte Ice Pop Mix] (Original Video with subtitles)(MP3_320K).mp3` | `Eiffel 65 - Blue (Da Ba Dee) [Gabry Ponte Ice Pop Mix] (Original Video with subtitles).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 385 | `Ela Fode na Dz7(MP3_320K).mp3` | `MC MENOR DA ALVORADA - Ela Fode na Dz7.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 386 | `Eleanor(MP3_320K).mp3` | `Tristan Trincado - Eleanor.mp3` | iTunes | 90.0% | RENAMED |
| 387 | `Elza Soares - Mulher do Fim do Mundo (Clipe Oficia.mp3` | `Elza Soares - Mulher do Fim do Mundo (Clipe Oficia).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 388 | `Elza Soares e Pitty - Na Pele (Videoclipe Oficial).mp3` | `Elza Soares & Pitty - Na Pele.mp3` | iTunes | 95.0% | RENAMED |
| 389 | `Em Nossa Miséria E Decadência(MP3_320K).mp3` | `Lamúria Abissal - Em Nossa Miséria E Decadência.mp3` | iTunes | 95.0% | RENAMED |
| 390 | `Emin - Walk Through Walls (Official Video).mp3` | `EMIN - Walk Through Walls.mp3` | iTunes | 95.0% | RENAMED |
| 391 | `Encontrou o filho em coma alcoólico _ Andrea Vermont no Podcast 3 irmãos(MP3_320K).mp3` | `trechosdynamic - Encontrou o filho em coma alcoólico - Andrea Vermont no Podcast 3 irmãos.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 392 | `End of the World (Slowed)(MP3_320K).mp3` | `End of the World - Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 393 | `Enigma - Beyond The Invisible (Celestial Mix)(MP3_320K).mp3` | `Enigma - Beyond The Invisible (Celestial Mix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 394 | `Enigma - Beyond The Invisible (NG Remix)(MP3_320K).mp3` | `Enigma - Beyond the Invisible.mp3` | iTunes | 95.0% | RENAMED |
| 395 | `Enigma - Beyond The Invisible (Official Video)(MP3_320K).mp3` | `Enigma - Beyond The Invisible.mp3` | iTunes | 95.0% | RENAMED |
| 396 | `Enigma - Dreaming Of Andromeda.mp3` | `Enigma - Dreaming Of Andromeda.mp3` | iTunes | 95.0% | RENAMED |
| 397 | `Enigma - Gravity Of Love (Greatest Hits)(MP3_320K).mp3` | `Enigma - Gravity Of Love.mp3` | iTunes | 95.0% | RENAMED |
| 398 | `Enigma - Mea Culpa (Official Video)(MP3_320K).mp3` | `Enigma - Mea Culpa.mp3` | iTunes | 95.0% | RENAMED |
| 399 | `Enigma - Return To Innocence.mp3` | `Enigma - Return To Innocence.mp3` | iTunes | 95.0% | RENAMED |
| 400 | `Enigma - Sadeness (Full Version)(MP3_70K).mp3` | `Enigma - Sadeness (Full Version).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 401 | `Enigma - The Child In Us(MP3_70K).mp3` | `Enigma - The Child In Us.mp3` | iTunes | 95.0% | RENAMED |
| 402 | `Enigma - The Eyes Of Truth (Official Video)(MP3_320K).mp3` | `Enigma - The Eyes Of Truth.mp3` | iTunes | 95.0% | RENAMED |
| 403 | `Enigma - Why [HQ](MP3_320K).mp3` | `Enigma - Why.mp3` | MusicBrainz | 92.0% | RENAMED |
| 404 | `Enigmatic(MP3_320K).mp3` | `celes.wav - Enigmatic.mp3` | iTunes | 95.0% | RENAMED |
| 405 | `Enya - Only Time (Official 4K Music Video)(MP3_320K).mp3` | `Enya - Only Time (Official 4K Music Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 406 | `Equanimity(MP3_320K).mp3` | `Tenno - Equanimity.mp3` | iTunes | 95.0% | RENAMED |
| 407 | `Equils-2 - Bring You Back To Me [FB](MP3_320K).mp3` | `Equils-2 - Bring You Back To Me [FB].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 408 | `Era - Angel.mp3` | `Era - Angel.mp3` | MusicBrainz | 92.0% | RENAMED |
| 409 | `Erasure - A Little Respect (Official Video).mp3` | `Erasure - A Little Respect.mp3` | iTunes | 95.0% | RENAMED |
| 410 | `Erasure - Blue Savannah (Official Video)(MP3_128K).mp3` | `Erasure - Blue Savannah.mp3` | iTunes | 95.0% | RENAMED |
| 411 | `Eric Carmen - All by Myself (Audio)(MP3_320K).mp3` | `Eric Carmen - All By Myself.mp3` | iTunes | 95.0% | RENAMED |
| 412 | `Erika Lundmoen - yad __ slowed(MP3_320K).mp3` | `Erika Lundmoen - yad __ slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 413 | `Eternal Source of Light Divine(MP3_70K).mp3` | `Eternal Source of Light Divine.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 414 | `Ethereal (Slowed)(MP3_320K).mp3` | `Txmy - Ethereal (Slowed).mp3` | iTunes | 95.0% | RENAMED |
| 415 | `Ethiopia - Vazio(MP3_320K).mp3` | `Ethiopia - Vazio.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 416 | `Eurythmics - Sweet Dreams (Are Made of This) [The.mp3` | `Eurythmics - Sweet Dreams (Are Made of This).mp3` | iTunes | 95.0% | RENAMED |
| 417 | `Eurythmics - When Tomorrow Comes (Official Video).mp3` | `Eurythmics - When Tomorrow Comes.mp3` | iTunes | 95.0% | RENAMED |
| 418 | `Everything But The Girl - Missing (Todd Terry Remix) [Official Music Video](MP3_320K).mp3` | `Everything But the Girl & Todd Terry - Missing (Todd Terry Club Mix - Us Radio Edit).mp3` | iTunes | 95.0% | RENAMED |
| 419 | `Everything but the girl - Missing (original lyrics.mp3` | `Everything but the girl - Missing (original lyrics).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 420 | `Experimental Aircraft - Stellar(MP3_320K).mp3` | `Experimental Aircraft - Stellar.mp3` | MusicBrainz | 92.0% | RENAMED |
| 421 | `Experimental Aircraft - With a Gun(MP3_320K).mp3` | `Experimental Aircraft - With a Gun.mp3` | iTunes | 95.0% | RENAMED |
| 422 | `Exxxit(MP3_320K).mp3` | `Cult Member - Exxxit.mp3` | iTunes | 95.0% | RENAMED |
| 423 | `Eyedress _ Dent May - Something About You(MP3_320K).mp3` | `Eyedress & Dent May - Something About You.mp3` | iTunes | 95.0% | RENAMED |
| 424 | `Eyes (Slowed)(MP3_320K).mp3` | `Eyes - Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 425 | `Ezekiel - help_urself (Phonk version)(MP3_320K).mp3` | `Ezekiel - help_urself (Phonk version).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 426 | `Ezekiel - help_urself (SLOWED REVERB)(MP3_320K).mp3` | `Ezekiel - help_urself (SLOWED REVERB).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 427 | `Ezekiel - help_urself (slowed)(MP3_320K) (2).mp3` | `Ezekiel - help_urself (slowed).mp3` | iTunes | 95.0% | RENAMED |
| 428 | `Ezekiel – help_urself [tradução_legendado](MP3_320K).mp3` | `adohnys - Ezekiel – help_urself [tradução - legendado].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 429 | `Éléonore _ Desireless _ Operation Of The Sun(MP3_128K).mp3` | `m.youtube.com - Éléonore - Desireless & Operation Of The Sun.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 430 | `FOREST STREAM - Black Swans (demo)(MP3_320K).mp3` | `FOREST STREAM - Black Swans (demo).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 431 | `FREE_ crystal castles   father2006   synthwave type beat (prod. christian)(MP3_320K).mp3` | `christian - FREE crystal castles + father2006 + synthwave type beat (prod. christian).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 432 | `FUNK ABNORMAL (Ultra Slowed   reverb) __ _phonk _funk _slowed(MP3_320K).mp3` | `Phonk Player - FUNK ABNORMAL (Ultra Slowed + reverb) - - #phonk #funk #slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 433 | `FUNK TGIF(MP3_320K).mp3` | `Young Madz - FUNK TGIF.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 434 | `Fabio Akvan - Lamúria Abissal ⸸ lavrando Defuntos.mp3` | `Fabio Akvan - Lamúria Abissal ⸸ lavrando Defuntos.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 435 | `False memory syndrome throughout Everywhere at the end of time(MP3_320K).mp3` | `False memory syndrome throughout Everywhere at the end of time.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 436 | `Fantastic Life(MP3_320K).mp3` | `Cult Member - Fantastic Life.mp3` | iTunes | 95.0% | RENAMED |
| 437 | `Fat Burning Genetic Advantage (energetically programmed audio)(MP3_320K).mp3` | `Fat Burning Genetic Advantage (energetically programmed audio).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 438 | `Fe en Rebelión(MP3_320K).mp3` | `yaego - Fe en Rebelión.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 439 | `Fear the Sea(MP3_320K).mp3` | `The Gathering - Fear the Sea.mp3` | iTunes | 90.0% | RENAMED |
| 440 | `Feist - Century.mp3` | `Feist - Century.mp3` | iTunes | 95.0% | RENAMED |
| 441 | `Fergie - Glamorous ft. Ludacris.mp3` | `Fergie - Glamorous (feat. Ludacris).mp3` | iTunes | 95.0% | RENAMED |
| 442 | `Fernanda Abreu - Rio 40 Graus.mp3` | `Fernanda Abreu - Rio 40 Graus.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 443 | `Filipe Ret - Invicto (prod. Duani e MãoLee)(MP3_320K).mp3` | `Filipe Ret - Invicto (prod. Duani e MãoLee).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 444 | `Filipe Ret - Isso Que é Vida (prod. Reeo Mix e Mãolee)(MP3_320K).mp3` | `Filipe Ret - Isso Que é Vida (prod. Reeo Mix e Mãolee).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 445 | `Filipe Ret - Só Pra Você Lembrar.mp3` | `Filipe Ret - Só Pra Você Lembrar.mp3` | iTunes | 95.0% | RENAMED |
| 446 | `Fina Arte(MP3_320K).mp3` | `Charlie Brown Jr. - Fina Arte.mp3` | iTunes | 95.0% | RENAMED |
| 447 | `Finis Africae - Armadilha(MP3_320K).mp3` | `Finis Africae - Armadilha.mp3` | iTunes | 95.0% | RENAMED |
| 448 | `Fink - Looking Too Closely (Official Music Video).mp3` | `Fink - Looking Too Closely.mp3` | iTunes | 95.0% | RENAMED |
| 449 | `Fjaer - 11 Days(MP3_320K).mp3` | `Fjaer - 11 Days.mp3` | MusicBrainz | 92.0% | RENAMED |
| 450 | `Flo Rida - Good Feeling [Official Video](MP3_320K).mp3` | `Flo Rida - Good Feeling.mp3` | iTunes | 95.0% | RENAMED |
| 451 | `Flower of Memories(MP3_320K).mp3` | `Tenno - Flower of Memories.mp3` | iTunes | 95.0% | RENAMED |
| 452 | `Foo Fighters - Best Of You (Official Music Video)(MP3_320K).mp3` | `Foo Fighters - Best of You.mp3` | iTunes | 95.0% | RENAMED |
| 453 | `Foster The People - Best Friend.mp3` | `Foster the People - Best Friend.mp3` | iTunes | 95.0% | RENAMED |
| 454 | `Foxes In Fiction - Ontario Gothic (Alternate Version)(MP3_128K).mp3` | `Foxes in Fiction - Ontario Gothic (alternate version).mp3` | MusicBrainz | 92.0% | RENAMED |
| 455 | `Foxes in Fiction - Ontario Gothic(MP3_320K).mp3` | `Foxes in Fiction - Ontario Gothic.mp3` | MusicBrainz | 92.0% | RENAMED |
| 456 | `Frances Cone - Unraveling.aac` | `Frances Cone - Unraveling.aac` | iTunes | 95.0% | RENAMED |
| 457 | `Francisco_ El Hombre - Triste_ Louca ou Má (AudioA.mp3` | `Francisco_ El Hombre - Triste_ Louca ou Má (AudioA).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 458 | `Françoise Hardy - Le Temps de l_Amour(MP3_320K).mp3` | `Françoise Hardy - Le temps de l'amour (Fox Medium).mp3` | iTunes | 95.0% | RENAMED |
| 459 | `French Montana - Unforgettable ft. Swae Lee(MP3_320K).mp3` | `French Montana - Unforgettable (feat. Swae Lee).mp3` | iTunes | 95.0% | RENAMED |
| 460 | `Funeral Depression - Dark_ Cold Feeling(MP3_70K).mp3` | `Funeral Depression - Dark_ Cold Feeling.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 461 | `Funesto - Meu Suicídio (DSBM)(MP3_70K).mp3` | `Funesto - Meu Suicídio (DSBM).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 462 | `Fátima(MP3_320K).mp3` | `Capital Inicial - Fátima.mp3` | iTunes | 95.0% | RENAMED |
| 463 | `GHOSTEMANE - Mercury(MP3_320K).mp3` | `GHOSTEMANE - Mercury.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 464 | `Gabriel o Pensador - Até Quando_ (Clipe Oficial)(MP3_128K).mp3` | `Gabriel o Pensador - Até Quando.mp3` | iTunes | 95.0% | RENAMED |
| 465 | `Gal Costa - Lágrimas Negras(MP3_320K).mp3` | `Gal Costa - Lágrimas Negras (Ao Vivo).mp3` | iTunes | 95.0% | RENAMED |
| 466 | `Galadriel e Frodo   O Senhor dos Anis   Sociedade do Anel(MP3_320K).mp3` | `Navi_Hero - Galadriel e Frodo O Senhor dos Anis Sociedade do Anel.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 467 | `Garota De Ipanema(MP3_320K).mp3` | `Garota De Ipanema.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 468 | `Gatekeeper of Thoughts(MP3_320K).mp3` | `Tenno - Gatekeeper of Thoughts.mp3` | iTunes | 95.0% | RENAMED |
| 469 | `Gats(MP3_320K).mp3` | `Susumu Hirasawa - Gats.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 470 | `Genesis - Mama (Official Music Video).mp3` | `Genesis - Mama.mp3` | iTunes | 95.0% | RENAMED |
| 471 | `George Kaplan - Me Chama - Marina Lima (1984).mp3` | `George Kaplan - Me Chama - Marina Lima.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 472 | `George McCrae - Rock Your Baby.mp3` | `George McCrae - Rock Your Baby.mp3` | iTunes | 95.0% | RENAMED |
| 473 | `George Michael - Jesus To A Child.mp3` | `George Michael - Jesus to a Child.mp3` | iTunes | 95.0% | RENAMED |
| 474 | `Gerry Rafferty - Baker Street (UK).mp3` | `Gerry Rafferty - Baker Street.mp3` | iTunes | 95.0% | RENAMED |
| 475 | `Get A Way (2AM Club Mix)(MP3_320K).mp3` | `Maxx - Get a Way (2AM Club Mix).mp3` | iTunes | 95.0% | RENAMED |
| 476 | `Get Up (Before The Night Is Over)(MP3_320K).mp3` | `Technotronic - Get Up (Before the Night Is Over).mp3` | iTunes | 95.0% | RENAMED |
| 477 | `Gigi DAgostino - La Passion (angeli In Festa).mp3` | `Gigi D'Agostino - La Passion (Angeli In Festa).mp3` | iTunes | 95.0% | RENAMED |
| 478 | `Gigi Perez - Sailor Song.mp3` | `Gigi Perez - Sailor Song.mp3` | iTunes | 95.0% | RENAMED |
| 479 | `Gimisum Family - I Told Ya (1994)(MP3_320K).mp3` | `Gimisum Family - I Told Ya.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 480 | `Gino Vannelli - It Hurts to be Love(MP3_320K).mp3` | `Gino Vannelli - Hurts to Be In Love.mp3` | iTunes | 95.0% | RENAMED |
| 481 | `Glenn Medeiros - Nothing_s Gonna Change My Love for You(MP3_320K).mp3` | `Glenn Medeiros - Nothing's Gonna Change My Love for You.mp3` | iTunes | 95.0% | RENAMED |
| 482 | `Gloria Gaynor - I Will Survive (Official Video).mp3` | `Gloria Gaynor - I Will Survive.mp3` | iTunes | 95.0% | RENAMED |
| 483 | `Glue Trip - Fancy (Official Video)(MP3_320K).mp3` | `Glue Trip - Fancy.mp3` | iTunes | 95.0% | RENAMED |
| 484 | `Go Flex(MP3_320K).mp3` | `Post Malone - Go Flex.mp3` | iTunes | 95.0% | RENAMED |
| 485 | `God_s Revenge(MP3_160K).mp3` | `Feerix - God's Revenge.mp3` | iTunes | 95.0% | RENAMED |
| 486 | `Gods _ Monsters(MP3_70K).mp3` | `Gods & Monsters.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 487 | `Gotye - Somebody That I Used To Know (feat. Kimbra_1.mp3` | `Gotye - Somebody That I Used to Know (feat. Kimbra).mp3` | iTunes | 95.0% | RENAMED |
| 488 | `Gotye feat. Kimbra 1988 _ Somebody That I Used To Know music video(MP3_320K).mp3` | `Gotye feat. Kimbra 1988 - Somebody That I Used To Know music video.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 489 | `Grace(MP3_320K).mp3` | `Tenno - Grace.mp3` | iTunes | 95.0% | RENAMED |
| 490 | `Gregorian - Gregorian - Everybody Gotta Learn Sometimes (Masters Of Chant - Moments Of Peace In Ireland).mp3` | `Gregorian - Gregorian - Everybody Gotta Learn Sometimes (Masters Of Chant - Moments Of Peace In Ireland).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 491 | `Gregorian - Masters of Chant Chapter II(MP3_320K).mp3` | `Gregorian - Masters of Chant Chapter II.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 492 | `Gregorian - My Immortal - Fanvideo (Evanescence)(MP3_320K).mp3` | `Gregorian - My Immortal - Fanvideo (Evanescence).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 493 | `Gregorian Chant_ Dominus vobiscum - Et cum spiritu tuo - Adiutorium nostrum _ Benedicat vos(MP3_320K).mp3` | `Gregorian Chant_ Dominus vobiscum - Et cum spiritu tuo - Adiutorium nostrum _ Benedicat vos.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 494 | `Gregorian Chant_ Formula salutationis et actus paenitentialis - In nomine Patris _ Confiteor(MP3_320K).mp3` | `Gregorian Chant_ Formula salutationis et actus paenitentialis - In nomine Patris _ Confiteor.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 495 | `Gregorian _ Amelia Brightman - Join Me HD(MP3_320K).mp3` | `Gregorian _ Amelia Brightman - Join Me HD.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 496 | `Gregorian_ Moment of Peace(MP3_320K).mp3` | `Gregorian - Moment of Peace.mp3` | iTunes | 95.0% | RENAMED |
| 497 | `Gregory Dillon_ frutiger dillon - Windows98 (Official Music Video)(MP3_320K).mp3` | `Gregory Dillon & frutiger dillon - Windows98.mp3` | iTunes | 95.0% | RENAMED |
| 498 | `Grimes - Oblivion(MP3_320K).mp3` | `Grimes - Oblivion.mp3` | iTunes | 95.0% | RENAMED |
| 499 | `Grimes - World Princess part II.mp3` | `Grimes - World Princess, Pt. II.mp3` | iTunes | 95.0% | RENAMED |
| 500 | `Grouper - Alien Observer.mp3` | `Grouper - Alien Observer.mp3` | iTunes | 95.0% | RENAMED |
| 501 | `Grupo Sonador - El Gigante De Hierro.mp3` | `Grupo Sonador - El Gigante de Hierro.mp3` | iTunes | 95.0% | RENAMED |
| 502 | `Guccin - Natural Pra Cavalo(MP3_320K).mp3` | `Guccin - Natural Pra Cavalo.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 503 | `Guess Who (2007 Remaster)(MP3_320K).mp3` | `Blue Magic - Guess Who (2007 Remaster).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 504 | `Gum Regeneration (Energetically Programmed Audio)(MP3_320K).mp3` | `Gum Regeneration (Energetically Programmed Audio).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 505 | `Guns N_ Roses - Patience.mp3` | `Guns N' Roses - Patience.mp3` | iTunes | 95.0% | RENAMED |
| 506 | `Gwen Stefani - Baby Don_t Lie.mp3` | `Gwen Stefani - Baby Don't Lie.mp3` | iTunes | 95.0% | RENAMED |
| 507 | `Gynecomastia Removal _ Bodyfat Shredder (WORKS 100_)(MP3_320K).mp3` | `Gynecomastia Removal + Bodyfat Shredder (WORKS 100%).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 508 | `Gynecomastia Treatment (Energetically Programmed Audio)(MP3_320K).mp3` | `Gynecomastia Treatment (Energetically Programmed Audio).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 509 | `HAHA(MP3_320K).mp3` | `Ogryzek - Haha.mp3` | iTunes | 95.0% | RENAMED |
| 510 | `HAIX - Afraid(MP3_320K).mp3` | `HAIX - Afraid.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 511 | `HAIX - Enough(MP3_320K).mp3` | `HAIX - Enough.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 512 | `HAIX - Eyes(MP3_320K).mp3` | `HAIX - Eyes.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 513 | `HAIX - FLARE(MP3_320K).mp3` | `HAIX - FLARE.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 514 | `HAIX - Faith(MP3_320K).mp3` | `HAIX - Faith.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 515 | `HAIX - Fallen(MP3_320K).mp3` | `HAIX - Fallen.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 516 | `HAIX - Fragile(MP3_320K).mp3` | `HAIX - Fragile.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 517 | `HAIX - Lucid(MP3_320K).mp3` | `HAIX - Lucid.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 518 | `HAIX - Reverie(MP3_320K).mp3` | `HAIX - Reverie.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 519 | `HAIX_ Wilee - Closer(MP3_320K).mp3` | `HAIX_ Wilee - Closer.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 520 | `HAIX_ Wilee - sorrow(MP3_320K).mp3` | `HAIX_ Wilee - sorrow.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 521 | `HEART STOPPER(MP3_320K).mp3` | `Yaego - HEART STOPPER.mp3` | iTunes | 95.0% | RENAMED |
| 522 | `HGH (feat. Vakkuum)(MP3_320K).mp3` | `HGH (feat. Vakkuum).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 523 | `HOME - Resonance (Relayer Travel Mix)(MP3_320K).mp3` | `HOME - Resonance (Relayer Travel Mix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 524 | `HUGEL, SOLTO (FR) - Jamaican (Bam Bam).mp3` | `HUGEL & SOLTO (FR) - Jamaican (Bam Bam).mp3` | iTunes | 95.0% | RENAMED |
| 525 | `HXVRMXN - South - Slowed + reverb.mp3` | `HXVRMXN - South - Slowed + reverb.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 526 | `HXVRMXN - スピードデーモン(MP3_320K).mp3` | `HXVRMXN - スピードデーモン.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 527 | `Hacker Music(MP3_320K).mp3` | `YTCracker - Hacker Music.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 528 | `Hanging With Wolves(MP3_320K).mp3` | `Lil Durk - Hanging With Wolves.mp3` | iTunes | 95.0% | RENAMED |
| 529 | `Hardcore - Artificial Intelligence - Best Part + Super Slowed + Reverb.mp3` | `Hardcor-e - Artificial Intelligence (Best Part + Super Slowed + Reverb).mp3` | iTunes | 95.0% | RENAMED |
| 530 | `Harsh Symmetry - Mirror Twin (Darkwave 2022)(MP3_320K).mp3` | `Harsh Symmetry - Mirror Twin (Darkwave 2022).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 531 | `Haunt Me - Youre My Favorite Work Of Art.mp3` | `Haunt Me - You're My Favorite Work of Art.mp3` | iTunes | 95.0% | RENAMED |
| 532 | `Heart of the Mind(MP3_320K).mp3` | `Tenno - Heart of the Mind.mp3` | iTunes | 95.0% | RENAMED |
| 533 | `Herbal Movement(MP3_320K).mp3` | `The Gathering - Herbal Movement.mp3` | iTunes | 90.0% | RENAMED |
| 534 | `Herculean Autoworkout   Workout Amplifier ft VnMx Subs _ Supreme Muscle Builder(MP3_320K).mp3` | `Herculean Autoworkout + Workout Amplifier ft VnMx Subs - Supreme Muscle Builder.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 535 | `Hey_ Love(MP3_320K).mp3` | `The Delfonics - Hey! Love.mp3` | iTunes | 95.0% | RENAMED |
| 536 | `Highway (Feat. Shmaxwell)(MP3_320K).mp3` | `Carter Tomorrow - Highway (Feat. Shmaxwell).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 537 | `Hikari (Super Slowed)(MP3_320K).mp3` | `Clovis Reyes - Hikari (Super Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 538 | `Hikari - Clovis Reyes _ Vdycd (_are you my enemy or my ally_   _do you want to fight_   _INSTINCT_)(MP3_320K).mp3` | `Hikari - Clovis Reyes _ Vdycd (_are you my enemy or my ally_ _do you want to fight_ _INSTINCT).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 539 | `Hiroyuki SAWANO - Topic - 進撃gt20130218巨人.mp3` | `Hiroyuki SAWANO - 進撃gt20130218巨人.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 540 | `Hollow Strange - Topic - All My Dreams Got Marked as Spam.mp3` | `Hollow Strange - All My Dreams Got Marked as Spam.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 541 | `Home Influence(MP3_320K).mp3` | `Knowledge Veal Jackson - Home Influence.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 542 | `Home(MP3_320K).mp3` | `Tenno - Home.mp3` | iTunes | 95.0% | RENAMED |
| 543 | `Homelander x Ezekiel - help_urself (Slowed)(MP3_320K).mp3` | `Homelander x Ezekiel - help_urself (Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 544 | `Hong Kong Garden_ Siouxsie and the Banshees.mp3` | `nadaz - Hong Kong Garden - Siouxsie and the Banshees.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 545 | `Hormone Regulation (reduce estrogen) Energetically Programmed Audio(MP3_320K).mp3` | `Hormone Regulation (reduce estrogen) Energetically Programmed Audio.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 546 | `Hot Oasis - El Mazena(MP3_320K).mp3` | `Hot Oasis - El Mazena.mp3` | iTunes | 95.0% | RENAMED |
| 547 | `House Music (Original Mix)(MP3_320K).mp3` | `321 - Original Mix.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 548 | `Hued Sunbeam(MP3_320K).mp3` | `DIM - Hued Sunbeam.mp3` | iTunes | 95.0% | RENAMED |
| 549 | `Hurling Haven(MP3_320K).mp3` | `DIM - Hurling Haven.mp3` | iTunes | 95.0% | RENAMED |
| 550 | `Hypnotic Eyes(MP3_320K).mp3` | `Shinnobu - Hypnotic Eyes.mp3` | iTunes | 95.0% | RENAMED |
| 551 | `I Can_t Save You (Interlude)(MP3_320K).mp3` | `Metro Boomin & Future - I Can't Save You (Interlude) [feat. Don Toliver].mp3` | iTunes | 95.0% | RENAMED |
| 552 | `I Cum Blood(MP3_320K).mp3` | `BLOOD COURT - I Cum Blood.mp3` | iTunes | 90.0% | RENAMED |
| 553 | `I Feel You Tonight (One Groove Version)(MP3_320K).mp3` | `G.E.M - I Feel You Tonight (One Groove Version).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 554 | `I wish to have a happy end(MP3_320K).mp3` | `イア - ia - I Wish To Have a Happy End.mp3` | iTunes | 95.0% | RENAMED |
| 555 | `I(MP3_320K).mp3` | `DIM - I.mp3` | MusicBrainz | 92.0% | RENAMED |
| 556 | `II(MP3_320K).mp3` | `DIM - II.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 557 | `III(MP3_320K).mp3` | `DIM - III.mp3` | iTunes | 95.0% | RENAMED |
| 558 | `IN MIND (ECSTASY) [feat. Tamashī _ skrta](MP3_320K).mp3` | `Yaego - IN MIND (ECSTASY) [feat. Tamashī & skrta].mp3` | iTunes | 95.0% | RENAMED |
| 559 | `IN MY SOUL(MP3_320K).mp3` | `DIEGO什麼 - In My Soul.mp3` | iTunes | 95.0% | RENAMED |
| 560 | `INFINITY FUNK (Slowed   Reverb)(MP3_320K).mp3` | `Prey - INFINITY FUNK (Slowed + Reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 561 | `IORIGUN - Wild Dive(MP3_320K).mp3` | `IORIGUN - Wild Dive.mp3` | iTunes | 95.0% | RENAMED |
| 562 | `I_M VENGANCE. - Batman x Yeat - Talk (Guitar Remix) (Slowed   Reverb) (Alt intro)(MP3_320K).mp3` | `I_M VENGANCE. - Batman x Yeat - Talk (Guitar Remix) (Slowed + Reverb) (Alt intro).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 563 | `I_ll Fly with You (Original _ Lyrics Video) von Gigi D_Agostino(MP3_320K).mp3` | `zyxdance - I'll Fly with You (Original - Lyrics Video) von Gigi D'Agostino.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 564 | `I_ve Got My Heart Set on You(MP3_320K).mp3` | `Blue Magic - I've Got My Heart Set on You.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 565 | `Iann Dior - Emotions (slowed reverb)(MP3_320K).mp3` | `Iann Dior - Emotions (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 566 | `Ice Cream Boy -  Changing(MP3_320K).mp3` | `Ice Cream Boy - Changing.mp3` | iTunes | 95.0% | RENAMED |
| 567 | `Ice Cube - You Know How We Do It (Official Music Video)(MP3_320K).mp3` | `Ice Cube - You Know How We Do It.mp3` | iTunes | 95.0% | RENAMED |
| 568 | `Ice Cube - You Know How We Do It [Slowed to perfection   Reverb](MP3_320K).mp3` | `Ice Cube - You Know How We Do It [Slowed to perfection Reverb].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 569 | `Icehouse - Crazy (International Version)(MP3_70K)(MP3_320K).mp3` | `ICEHOUSE - Crazy (12'' Version).mp3` | iTunes | 95.0% | RENAMED |
| 570 | `Icehouse - Electric Blue(MP3_70K).mp3` | `ICEHOUSE - Electric Blue.mp3` | iTunes | 95.0% | RENAMED |
| 571 | `Icehouse - No Promises (Aus Version)(MP3_70K).mp3` | `Icehouse - No Promises (Aus Version).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 572 | `Icehouse - No Promises - Legendas em português.mp3` | `Icehouse - No Promises - Legendas em português.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 573 | `Idina Menzel - No Good Deed.mp3` | `Idina Menzel - No Good Deed.mp3` | iTunes | 95.0% | RENAMED |
| 574 | `Imagine Dragons - Thunder.mp3` | `Imagine Dragons - Thunder.mp3` | iTunes | 95.0% | RENAMED |
| 575 | `Imagine Mars - Imagine Mars & Akasha - Collective Vision.mp3` | `Imagine Mars - Imagine Mars & Akasha - Collective Vision.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 576 | `Immediate Music - Lacrimosa Dominae(MP3_320K).mp3` | `Immediate Music - Lacrimosa Dominae.mp3` | MusicBrainz | 92.0% | RENAMED |
| 577 | `Imperius (Slowed)(MP3_320K).mp3` | `Caleb Bryant - Imperius (Slowed).mp3` | iTunes | 95.0% | RENAMED |
| 578 | `Impossible (Extended Version)(MP3_320K).mp3` | `Captain Hollywood Project - Impossible (Extended Version).mp3` | iTunes | 95.0% | RENAMED |
| 579 | `In Loving Memory of Kentaro Miura  - Berserk OST - Guts Piano Cover(MP3_320K).mp3` | `In Loving Memory of Kentaro Miura - Berserk OST - Guts Piano Cover.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 580 | `In Motion _1(MP3_320K).mp3` | `The Gathering - In Motion #1.mp3` | iTunes | 90.0% | RENAMED |
| 581 | `In Motion _2(MP3_320K).mp3` | `In Motion #2.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 582 | `In Power We Entrust The Love Advocated - Dead Can.mp3` | `Dead Can Dance - In Power We Entrust the Love Advocated.mp3` | iTunes | 95.0% | RENAMED |
| 583 | `In the Haze(MP3_320K).mp3` | `NBSPLV - In the Haze.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 584 | `Indila - Dernière Danse (Clip Officiel)(MP3_320K).mp3` | `Indila - Dernière danse.mp3` | iTunes | 95.0% | RENAMED |
| 585 | `Infernal Male Beauty ft Nameless_ Exilean_ Rafay _ Ultimate Male Combo(MP3_320K).mp3` | `Infernal Male Beauty ft Nameless, Exilean, Rafay - Ultimate Male Combo.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 586 | `Infernal Male Beauty v2 _ Dark Triad Face(MP3_320K).mp3` | `FK Subs - Infernal Male Beauty v2 - Dark Triad Face.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 587 | `Infinite And Unlimited Height Growth V1(MP3_320K).mp3` | `Infinite And Unlimited Height Growth V1.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 588 | `Information Society - Repetition(MP3_128K).mp3` | `Information Society - Repetition.mp3` | MusicBrainz | 92.0% | RENAMED |
| 589 | `Interlinked(MP3_320K).mp3` | `Lonely Lies & GOLDKID$ - Interlinked.mp3` | MusicBrainz | 92.0% | RENAMED |
| 590 | `International Dream Pop__Shoegaze Compilation(MP3_320K).mp3` | `Tabatha Mustang - International Dream Pop - - Shoegaze Compilation.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 591 | `Introvert(MP3_320K).mp3` | `Tenno - Introvert.mp3` | iTunes | 95.0% | RENAMED |
| 592 | `Irma Thomas - Straight from the heart _ (tradução_português)(MP3_320K).mp3` | `Irma Thomas - Straight from the heart _ (tradução_português).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 593 | `Irokz - ULTIMATE MEGAMIX __ by Xxpace (FUNK UNIVERSO_ EEYUH__ Goodbye etc) (slowed   reverb)(MP3_320K).mp3` | `Irokz - ULTIMATE MEGAMIX __ by Xxpace (FUNK UNIVERSO_ EEYUH__ Goodbye etc) (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 594 | `It_s Ok_ You_re Ok - Bonjr(MP3_70K).mp3` | `It_s Ok_ You_re Ok - Bonjr.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 595 | `It_s so Nice to Be with You(MP3_320K).mp3` | `Blue Magic - It's So Nice To Be With You.mp3` | iTunes | 95.0% | RENAMED |
| 596 | `J. Cole - Intro(MP3_320K).mp3` | `J. Cole - Intro.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 597 | `J. Cole - m y . l i f e  feat. 21 Savage_ Morray (Official Audio)(MP3_320K).mp3` | `J. Cole - m y . l i f e feat. 21 Savage_ Morray.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 598 | `JOY - JR - AAYUH!.mp3` | `JOY - JR - AAYUH!.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 599 | `Jack Jones_ Wives and Lovers (Bacharach_ David_ 19.mp3` | `davidhertzberg1 - Jack Jones - Wives and Lovers (Bacharach, David, 19).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 600 | `Jack Ripson Music - Nope your too late i already died Remix Full Mashup.mp3` | `Jack Ripson Music - Nope your too late i already died Remix Full Mashup.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 601 | `Jack Stauber - Buttercup _ music video(MP3_320K).mp3` | `Jack Stauber - Buttercup _ music video.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 602 | `Janis Joplin - I Need A Man To Love.mp3` | `Janis Joplin - I Need a Man to Love.mp3` | MusicBrainz | 92.0% | RENAMED |
| 603 | `Jason Sanders - Telan Devik - Carly doesnt know why.mp3` | `Jason Sanders - Telan Devik - Carly doesnt know why.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 604 | `Jay Willz - Topic - What We Need.mp3` | `Jay Willz - What We Need.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 605 | `Jay-Z feat. Alicia Keys - Empire State of Mind (Official Music Video)(MP3_320K).mp3` | `Jay-Z feat. Alicia Keys - Empire State of Mind.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 606 | `Jazemos Desde O Útero(MP3_320K).mp3` | `Lamúria Abissal - Jazemos Desde O Útero.mp3` | iTunes | 95.0% | RENAMED |
| 607 | `Jeff The Killer  -  Cicatrizes da Corrupção(MP3_70K).mp3` | `Jeff The Killer - Cicatrizes da Corrupção.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 608 | `Joan Osborne - One Of Us [Legendado_Tradução](MP3_160K).mp3` | `Joan Osborne - One Of Us [Legendado_Tradução].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 609 | `Joe Farren - American Dream.mp3` | `Joe Farren - American Dream.mp3` | iTunes | 95.0% | RENAMED |
| 610 | `Johann Pachelbel Canon Piano (George Winston).mp3` | `戚步凯 - Johann Pachelbel Canon Piano (George Winston).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 611 | `Johnny Cash - Hurt (Official Video) HD.mp3` | `Johnny Cash - Hurt HD.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 612 | `Joint Regeneration (Morphic_Energetically Programmed Audio)(MP3_320K).mp3` | `Sapien Medicine - Joint Regeneration (Morphic - Energetically Programmed Audio).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 613 | `Joji - YEAH RIGHT(MP3_320K).mp3` | `Joji - YEAH RIGHT.mp3` | iTunes | 95.0% | RENAMED |
| 614 | `Jon Secada - Just Another Day HQ(MP3_70K).mp3` | `Jon Secada - Just Another Day.mp3` | MusicBrainz | 92.0% | RENAMED |
| 615 | `Jon Secada - Just another day [1992]  [magnums extended mix](MP3_320K).mp3` | `Jon Secada - Just another day [1992] [magnums extended mix].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 616 | `Jon and Vangelis - I Hear You Now - Lyrics Below.mp3` | `Jon and Vangelis - I Hear You Now - Lyrics Below.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 617 | `Jose - Welcome And Goodbye Slowed Down To Perfection.mp3` | `Jose - Welcome And Goodbye Slowed Down To Perfection.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 618 | `João Edson - nãopenseiemumnomepraesseálbum (GOREGRIND)(MP3_320K).mp3` | `João Edson - nãopenseiemumnomepraesseálbum (GOREGRIND).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 619 | `Jtbazz - Love on me - Sped Up.mp3` | `Jtbazz - Love on me - Sped Up.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 620 | `Juice WRLD - Lean Wit Me (Official Audio)(MP3_320K).mp3` | `Juice WRLD - Lean Wit Me.mp3` | iTunes | 95.0% | RENAMED |
| 621 | `Juice WRLD - Lucid Dreams (Directed by Cole Bennett)(MP3_160K).mp3` | `Juice WRLD - Lucid Dreams (Directed by Cole Bennett).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 622 | `Juice WRLD - Robbery (Directed by Cole Bennett)(MP3_320K).mp3` | `Juice WRLD - Robbery (Directed by Cole Bennett).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 623 | `Juice WRLD, Lil Uzi Vert - Wasted.mp3` | `Juice WRLD, Lil Uzi Vert - Wasted.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 624 | `Jump (JumpStyle TikTok) (Slowed)(MP3_320K).mp3` | `Aiden Music - Jump (JumpStyle TikTok) [Slowed].mp3` | iTunes | 95.0% | RENAMED |
| 625 | `Jungle - Busy Earnin_(MP3_320K).mp3` | `Jungle - Busy Earnin'.mp3` | iTunes | 95.0% | RENAMED |
| 626 | `Just The Shoulders(MP3_320K).mp3` | `Sapien Medicine - Just The Shoulders.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 627 | `Just the Knees(MP3_320K).mp3` | `Just the Knees.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 628 | `K Suave - Sexually Active feat. Trippie Redd (OFFICIAL MUSIC VIDEO)(MP3_320K).mp3` | `K Suave - Sexually Active feat. Trippie Redd.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 629 | `K suave mix(plugnb type songs)(MP3_320K).mp3` | `Undergroundmix - K suave mix(plugnb type songs).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 630 | `KAK MOMMY - INSTASAMKA (Sped up   reverb) [Dimuthzd](MP3_320K).mp3` | `KAK MOMMY - INSTASAMKA (Sped Up + Reverb) [Dimuthzd].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 631 | `KILLXR(MP3_320K).mp3` | `XEOE & HR - KILLXR.mp3` | iTunes | 95.0% | RENAMED |
| 632 | `KOALAS(MP3_320K).mp3` | `Yaego - Koalas.mp3` | iTunes | 95.0% | RENAMED |
| 633 | `KORDHELL - MURDER IN MY MIND(MP3_320K).mp3` | `Kordhell - Murder in My Mind.mp3` | MusicBrainz | 92.0% | RENAMED |
| 634 | `KREZUS, LXKERSON - BOLADA - ULTRA SLOWED.mp3` | `KREZUS & LXKERSON - BOLADA (ULTRA SLOWED).mp3` | iTunes | 95.0% | RENAMED |
| 635 | `Ka_tro - In Essence(MP3_320K).mp3` | `Ka$tro - In Essence (Slowed).mp3` | iTunes | 95.0% | RENAMED |
| 636 | `Kali uchis - Moonlight [Perfectly Slowed × Reverb](MP3_320K).mp3` | `Kali uchis - Moonlight [Perfectly Slowed × Reverb].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 637 | `Kamala - 07 - In Others Mind.mp3` | `Kamala - 07 - In Others Mind.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 638 | `Kansas - Dust in the Wind (Official Video)(MP3_320K).mp3` | `Kansas - Dust In the Wind.mp3` | iTunes | 95.0% | RENAMED |
| 639 | `Kanye West - Closed On Sunday (Official Video)(MP3_320K).mp3` | `Kanye West - Closed on Sunday.mp3` | iTunes | 95.0% | RENAMED |
| 640 | `Kanye West - Flashing Lights.mp3` | `Kanye West - Flashing Lights.mp3` | MusicBrainz | 92.0% | RENAMED |
| 641 | `Karol Conka - Tombei feat. Tropkillaz (KondZilla)(MP3_320K).mp3` | `Karol Conka - Tombei feat. Tropkillaz (KondZilla).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 642 | `Karunesh - Inshallah(MP3_320K).mp3` | `Karunesh - Inshallah.mp3` | iTunes | 95.0% | RENAMED |
| 643 | `Kate Bush - Running Up That Hill - Official Music Video(MP3_320K).mp3` | `Kate Bush - Running Up That Hill - Official Music Video.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 644 | `Kathleen Battle _ Wynton Marsalis_ _Eternal Source of Light Divine_ (G. F. Haendel)(MP3_320K).mp3` | `Kathleen Battle & Wynton Marsalis, 'Eternal Source of Light Divine' (G. F. Haendel).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 645 | `Katy Perry - Dark Horse (Lyrics) ft. Juicy J(MP3_320K).mp3` | `Katy Perry - Dark Horse (feat. Juicy J).mp3` | iTunes | 95.0% | RENAMED |
| 646 | `Kevin MacLeod - Beach Bum.mp3` | `Kevin MacLeod - Beach Bum.mp3` | iTunes | 95.0% | RENAMED |
| 647 | `Kevin MacLeod - Niles Blues.mp3` | `Kevin MacLeod - Niles Blues.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 648 | `Kickboxer Advanced Training remix ( Synthwave )(MP3_320K).mp3` | `Kickboxer Advanced Training remix ( Synthwave).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 649 | `Kickboxer Style ( Fightwave - Synthwave )(MP3_320K).mp3` | `Kickboxer Style ( Fightwave - Synthwave).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 650 | `Kickboxer Style - Always Believe In Yourself ( Fightwave )(MP3_320K).mp3` | `Kickboxer Style - Always Believe In Yourself ( Fightwave).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 651 | `Kickboxer Style Music -  I Am Powerful  ( Fightwave )(MP3_320K).mp3` | `Kickboxer Style Music - I Am Powerful ( Fightwave).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 652 | `Kid Abelha - Amanhã é 23(MP3_320K).mp3` | `Kid Abelha - Amanhã é 23.mp3` | iTunes | 95.0% | RENAMED |
| 653 | `Kill Eva _ ENCASSATOR - Psycho Dreams (Sped Up)(MP3_320K).mp3` | `Kill Eva _ ENCASSATOR - Psycho Dreams (Sped Up).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 654 | `Killdeer - Are We On.mp3` | `Killdeer - Are We On.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 655 | `Kingpin Skinny Pimp _ 211 - Pimpin _ Robbin (1994)(MP3_320K).mp3` | `Kingpin Skinny Pimp _ 211 - Pimpin _ Robbin.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 656 | `Knights In Shining Armor(MP3_320K).mp3` | `Glenn Diamond - Knights In Shining Armor.mp3` | iTunes | 90.0% | RENAMED |
| 657 | `Koda - Weightless.mp3` | `Koda - Weightless.mp3` | MusicBrainz | 92.0% | RENAMED |
| 658 | `Kon Kan - Arts in  D Minor (Harry Houdini)(MP3_128K).mp3` | `Kon Kan - Arts In D Minor - Harry Houdini.mp3` | iTunes | 95.0% | RENAMED |
| 659 | `Kordhell - Killers From The Northside.mp3` | `Kordhell - Killers From The Northside.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 660 | `Kordhell - MURDER PLOT (Slowed_ Extended Best Part)(MP3_320K).mp3` | `Kordhell - MURDER PLOT (Slowed_ Extended Best Part).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 661 | `Kraftwerk - Boing Boom Tschak _ Musik Non Stop _ Techno Pop (Continuous Mix)(MP3_320K).mp3` | `Kraftwerk - Boing Boom Tschak _ Musik Non Stop _ Techno Pop (Continuous Mix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 662 | `Kraftwerk - The Model (official video)(MP3_320K).mp3` | `Kraftwerk - The Model.mp3` | iTunes | 95.0% | RENAMED |
| 663 | `Krxziol - Topic - The feeling of a dark cold winter outside.mp3` | `Krxziol - The Feeling of a Dark Cold Winter Outside.mp3` | iTunes | 95.0% | RENAMED |
| 664 | `LIL PEEP - STAR SHOPPING (SLOWED   REVERB)(MP3_320K).mp3` | `LIL PEEP - STAR SHOPPING (SLOWED REVERB).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 665 | `LOVE U(MP3_320K).mp3` | `DIEGO什麼 - LOVE U.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 666 | `LUTRA - Pitter  [Indian Vocal Trance].mp3` | `LUTRA - Pitter [Indian Vocal Trance].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 667 | `La maison où j_ai grandi(MP3_320K).mp3` | `Françoise Hardy - La maison où j'ai grandi.mp3` | iTunes | 95.0% | RENAMED |
| 668 | `Lacrimosa Dominae(MP3_320K).mp3` | `Trailerhead - Lacrimosa Dominae.mp3` | iTunes | 95.0% | RENAMED |
| 669 | `Lady Gaga - Applause (Official).mp3` | `Lady Gaga - Applause (Official).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 670 | `Lady Gaga - Marry The Night (Audio).mp3` | `Lady Gaga - Marry the Night.mp3` | iTunes | 95.0% | RENAMED |
| 671 | `Lady Gaga - Paparazzi (Alximo_s dubstep remix).mp3` | `Lady Gaga - Paparazzi (Alximo_s dubstep remix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 672 | `Lady Gaga - Paparazzi (Lyrics).mp3` | `Lady Gaga - Paparazzi.mp3` | MusicBrainz | 92.0% | RENAMED |
| 673 | `Lady Gaga - Perfect Illusion.mp3` | `Lady Gaga - Perfect Illusion.mp3` | MusicBrainz | 92.0% | RENAMED |
| 674 | `Lady Gaga - Poker Face.mp3` | `Lady Gaga - Poker Face.mp3` | MusicBrainz | 92.0% | RENAMED |
| 675 | `Lady Gaga - Venus (Audio).mp3` | `Lady Gaga - Venus.mp3` | iTunes | 95.0% | RENAMED |
| 676 | `Lamb - Topic - Lusty.mp3` | `Lamb - Lusty.mp3` | iTunes | 95.0% | RENAMED |
| 677 | `Lamuria Abissal - Depressivo e Suicida(MP3_320K).mp3` | `Lamuria Abissal - Depressivo e Suicida.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 678 | `Lamúria Abissal - Antes Que Eu Morra(MP3_70K).mp3` | `Lamúria Abissal - Antes Que Eu Morra.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 679 | `Lamúria Abissal - Chorosas Árvores(MP3_320K).mp3` | `Lamúria Abissal - Chorosas Árvores.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 680 | `Lamúria Abissal - Desde que Você Morreu Pra Mim(MP3_70K).mp3` | `Lamúria Abissal - Desde que Você Morreu Pra Mim.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 681 | `Lamúria Abissal - Esmorecido Solsitcio Da Morte(MP3_70K).mp3` | `Lamúria Abissal - Esmorecido Solsitcio Da Morte.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 682 | `Lamúria Abissal - O Fantasma de um Rancoroso Passado (Legendado BR)(MP3_70K)(MP3_320K).mp3` | `Lamúria Abissal - O Fantasma de um Rancoroso Passado (Legendado BR).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 683 | `Lamúria Abissal - Orquídea Sangrenta(MP3_70K).mp3` | `Lamúria Abissal - Orquídea Sangrenta.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 684 | `Lamúria Abissal - Ressentimento Enraizado(MP3_70K).mp3` | `Lamúria Abissal - Ressentimento Enraizado.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 685 | `Lamúria Abissal - Solidão(MP3_70K).mp3` | `Lamúria Abissal - Solidão.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 686 | `Lamúria Abissal - me afogando em lâminas e comprimidos(MP3_70K).mp3` | `Lamúria Abissal - Me Afogando Em Lâminas E Comprimidos.mp3` | MusicBrainz | 92.0% | RENAMED |
| 687 | `Lamúria Abissal - Ósculo da Morte (Legendado BR)(MP3_320K).mp3` | `Lamúria Abissal - Ósculo da Morte (Legendado BR).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 688 | `Lana Del Rey - Born To Die Symphonic Orchestra Cover(MP3_320K).mp3` | `Lana Del Rey - Born To Die Symphonic Orchestra Cover.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 689 | `Lana Del Rey - Born To Die.mp3` | `Lana Del Rey - Born to Die.mp3` | iTunes | 95.0% | RENAMED |
| 690 | `Lana Del Rey - Brooklyn Baby (Official Audio).mp3` | `Lana Del Rey - Brooklyn Baby.mp3` | MusicBrainz | 92.0% | RENAMED |
| 691 | `Lana Del Rey - Chemtrails Over The Country Club (Lyrics)(MP3_70K).mp3` | `Lana Del Rey - Chemtrails Over The Country Club.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 692 | `Lana Del Rey - Dark Paradise - Lyrics.mp3` | `Lana Del Rey - Dark Paradise - Lyrics.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 693 | `Lana Del Rey - Doin_ Time(MP3_70K).mp3` | `Lana Del Rey - Doin_ Time.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 694 | `Lana Del Rey - Freak (Audio).mp3` | `Lana Del Rey - Freak.mp3` | MusicBrainz | 92.0% | RENAMED |
| 695 | `Lana Del Rey - Love.mp3` | `Lana Del Rey - Love.mp3` | MusicBrainz | 92.0% | RENAMED |
| 696 | `Lana Del Rey - Lust For Life (Official Video) ft.mp3` | `Lana Del Rey - Lust For Life ft.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 697 | `Lana Del Rey - Music To Watch Boys To.mp3` | `Lana Del Rey - Music to Watch Boys To.mp3` | MusicBrainz | 92.0% | RENAMED |
| 698 | `Lana Del Rey - Summertime Sadness (Official Music Video)(MP3_70K).mp3` | `Lana Del Rey - Summertime Sadness.mp3` | iTunes | 95.0% | RENAMED |
| 699 | `Lana Del Rey - Summertime Sadness.mp3` | `Lana Del Rey - Summertime Sadness.mp3` | iTunes | 95.0% | RENAMED |
| 700 | `Lana Del Rey - Video Games.mp3` | `Lana Del Rey - Video Games.mp3` | iTunes | 95.0% | RENAMED |
| 701 | `Lana Del Rey - White Mustang (Official Video).mp3` | `Lana Del Rey - White Mustang.mp3` | iTunes | 95.0% | RENAMED |
| 702 | `Lana Del Rey - Young and Beautiful (Official Music Video)(MP3_320K).mp3` | `Lana Del Rey - Young and Beautiful.mp3` | MusicBrainz | 92.0% | RENAMED |
| 703 | `Lana Del Rey - Young and Beautiful Symphonic Orchestra Cover(MP3_320K).mp3` | `Lana Del Rey - Young and Beautiful Symphonic Orchestra Cover.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 704 | `Lana Del Rey vs Cedric Gervais - Young _ Beautiful.mp3` | `Lana Del Rey vs Cedric Gervais - Young _ Beautiful.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 705 | `Land of Make Believe(MP3_320K).mp3` | `Blue Magic - Land of Make Believe.mp3` | MusicBrainz | 92.0% | RENAMED |
| 706 | `Las Bibas From Vizcaya feat. Katuxa Close _ Natasha Simonini - BUONASERA (Lyric Video)(MP3_320K).mp3` | `Las Bibas From Vizcaya feat. Katuxa Close _ Natasha Simonini - BUONASERA.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 707 | `Las Bibas From Vizcaya feat. Xuxeta - Vai Patrícia Vai _ (Diego Santander 2021 Remix)(MP3_320K).mp3` | `Las Bibas From Vizcaya feat. Xuxeta - Vai Patrícia Vai _ (Diego Santander 2021 Remix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 708 | `Late Arcane _ non-canon(MP3_320K).mp3` | `Vapor Memory - Late Arcane - non-canon.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 709 | `Latin Exorcism Rite part I - Motivation with Reality(MP3_320K).mp3` | `Latin Exorcism Rite part I - Motivation with Reality.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 710 | `Latin Exorcism Rite part II - Motivation with Reality(MP3_320K).mp3` | `Latin Exorcism Rite part II - Motivation with Reality.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 711 | `Laura Branigan - Self Control (1984) __Good Audio.mp3` | `Laura Branigan - Self Control (1984) __Good Audio.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 712 | `Lazy Room - Take Me Home(MP3_320K).mp3` | `Lazy Room - Take Me Home.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 713 | `Leaves(MP3_320K).mp3` | `Leaves.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 714 | `Left Ear Duvet_ Right Ear Linger(MP3_320K).mp3` | `bôa - Duvet.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 715 | `Legião Urbana - Andrea Doria.mp3` | `Legião Urbana - Andrea Doria.mp3` | iTunes | 95.0% | RENAMED |
| 716 | `Legião Urbana - Geração Coca-Cola.mp3` | `Legião Urbana - Geração Coca-Cola.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 717 | `Lemurian Dreams(MP3_320K).mp3` | `Shinnobu - Lemurian Dreams.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 718 | `Lenar_ Leonardo P - MONTAGEM MIAU _ Ay Mi Gatito_ Miau_ Miau (Letra)(MP3_320K).mp3` | `Lenar_ Leonardo P - MONTAGEM MIAU _ Ay Mi Gatito_ Miau_ Miau (Letra).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 719 | `Leo Jaime - A vida não presta(MP3_320K).mp3` | `Leo Jaime - A vida não presta.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 720 | `Leo Rojas - El Condor Pasa (Videoclip).mp3` | `Leo Rojas - El Condor Pasa (Videoclip).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 721 | `Les(MP3_320K).mp3` | `Childish Gambino - Les.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 722 | `Lewis Hanton - Meant To Be - Slowed.mp3` | `Lewis Hanton - Meant To Be (Slowed).mp3` | iTunes | 95.0% | RENAMED |
| 723 | `LiL PEEP - Bitch i_ma kill you (ONLY PEEP)(MP3_320K).mp3` | `LiL PEEP - Bitch i_ma kill you (ONLY PEEP).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 724 | `LiL PEEP - Star Shopping ( TRADUÇÃO )(MP3_320K).mp3` | `LiL PEEP - Star Shopping ( TRADUÇÃO).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 725 | `LiL PEEP - beat it ( Slowed to perfection )(MP3_320K).mp3` | `LiL PEEP - beat it ( Slowed to perfection).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 726 | `LiL PEEP - i crash_ u crash (ft. Lil Tracy) [prod. Jayyeah](MP3_320K).mp3` | `LiL PEEP - i crash_ u crash (ft. Lil Tracy) [prod. Jayyeah].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 727 | `LiL PEEP - praying to the sky ( Slowed to perfection )(MP3_320K).mp3` | `LiL PEEP - praying to the sky ( Slowed to perfection).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 728 | `Life Goes On (Above Everybody)(MP3_320K).mp3` | `rackeduproy - Life Goes On (Above Everybody).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 729 | `Lifelorn - See You(MP3_320K).mp3` | `Lifelorn - See You.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 730 | `Lifelorn - See You(MP3_70K).mp3` | `Lifelorn - See You.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 731 | `Liga pro Samu(MP3_320K).mp3` | `Liga pro Samu.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 732 | `Light Blue Lawrence - Light Blue Lawrence - Good Where I Am (Official Lyric Video).mp3` | `Light Blue Lawrence - Light Blue Lawrence - Good Where I Am (Official Lyric Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 733 | `Light Entries(MP3_320K).mp3` | `DIM - Light Entries.mp3` | MusicBrainz | 92.0% | RENAMED |
| 734 | `Lighthouse Family - Be Happy.mp3` | `Lighthouse Family - Be Happy.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 735 | `Like Em Real(MP3_320K).mp3` | `Nextale Nailze - Like Em Real.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 736 | `Lil Durk - Hanging With Wolves (Official Video)(MP3_320K).mp3` | `Lil Durk - Hanging With Wolves.mp3` | iTunes | 95.0% | RENAMED |
| 737 | `Lil Peep - Awful Things feat. Lil Tracy (Official Video)(MP3_320K).mp3` | `Lil Peep - Awful Things feat. Lil Tracy.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 738 | `Lil Peep - Beamer Boy  ( slowed   reverb )(MP3_160K).mp3` | `Lil Peep - Beamer Boy ( slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 739 | `Lil Peep - Come Around (Official Video)(MP3_320K).mp3` | `LiL PEEP - come around.mp3` | MusicBrainz | 92.0% | RENAMED |
| 740 | `Lil Peep - Crybaby(MP3_320K).mp3` | `LiL PEEP - crybaby.mp3` | MusicBrainz | 92.0% | RENAMED |
| 741 | `Lil Peep - Downtown (Extended Lyrics)(MP3_320K).mp3` | `Lil Peep - Downtown (Extended Lyrics).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 742 | `Lil Peep - Drugz (Official Video)(MP3_320K).mp3` | `Lil Peep - Drugz.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 743 | `Lil Peep - Life Is Beautiful(MP3_320K).mp3` | `Lil Peep - Life Is Beautiful.mp3` | MusicBrainz | 92.0% | RENAMED |
| 744 | `Lil Peep - M.O.S. [battery full] (Clipe Legendado PT-BR)(MP3_320K).mp3` | `Lil Peep - M.O.S. [battery full] (Clipe Legendado PT-BR).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 745 | `Lil Peep - PAIN ( SLOWED TO PERFECTION )(MP3_320K).mp3` | `Lil Peep - PAIN ( SLOWED TO PERFECTION).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 746 | `Lil Peep - Problems [Audio](MP3_320K).mp3` | `Lil Peep - Problems.mp3` | MusicBrainz | 92.0% | RENAMED |
| 747 | `Lil Peep - Rockstarz (feat. Gab3) (Official Audio)(MP3_320K).mp3` | `Lil Peep - Rockstarz (feat. Gab3).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 748 | `Lil Peep - Save That Shit [Audio](MP3_320K).mp3` | `Lil Peep - Save That Shit.mp3` | MusicBrainz | 92.0% | RENAMED |
| 749 | `Lil Peep - Tonight (Extended)(MP3_320K).mp3` | `Lil Peep - Tonight (Extended).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 750 | `Lil Peep - Waste Of Time (Extended Lyrics)(MP3_320K).mp3` | `Lil Peep - Waste Of Time (Extended Lyrics).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 751 | `Lil Peep - Watch (Extended)(MP3_320K).mp3` | `Lil Peep - Watch (Extended).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 752 | `Lil Peep - absolute in doubt (feat. wicca phase springs eternal) (Official Audio)(MP3_320K).mp3` | `Lil Peep - absolute in doubt (feat. wicca phase springs eternal).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 753 | `Lil Peep - beamer boy (Official Video)(MP3_320K).mp3` | `LiL PEEP - beamer boy.mp3` | MusicBrainz | 92.0% | RENAMED |
| 754 | `Lil Peep - california world (feat. Craig Xen) (Official Video)(MP3_320K).mp3` | `Lil Peep - california world (feat. Craig Xen).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 755 | `Lil Peep - cobain (feat. Lil Tracy) (Official Video)(MP3_320K).mp3` | `Lil Peep - Awful Things (feat. Lil Tracy).mp3` | iTunes | 95.0% | RENAMED |
| 756 | `Lil Peep - drive by (feat. xavier wulf) (Official Audio)(MP3_320K).mp3` | `Lil Peep - drive by (feat. xavier wulf).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 757 | `Lil Peep - flannel (Official Audio)(MP3_320K).mp3` | `LiL PEEP - flannel.mp3` | MusicBrainz | 92.0% | RENAMED |
| 758 | `Lil Peep - haunt u (Official Audio)(MP3_320K).mp3` | `LiL PEEP - haunt u.mp3` | MusicBrainz | 92.0% | RENAMED |
| 759 | `Lil Peep - idgaf (og version) (Official Audio)(MP3_320K).mp3` | `Lil Peep - idgaf (og version).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 760 | `Lil Peep - lil kennedy (Official Video)(MP3_320K).mp3` | `LiL PEEP - lil kennedy.mp3` | MusicBrainz | 92.0% | RENAMED |
| 761 | `Lil Peep - mirror_ mirror (Official Audio)(MP3_320K).mp3` | `LiL PEEP - mirror, mirror.mp3` | MusicBrainz | 92.0% | RENAMED |
| 762 | `Lil Peep - nose ring (Official Audio)(MP3_320K).mp3` | `LiL PEEP - Nose Ring.mp3` | MusicBrainz | 92.0% | RENAMED |
| 763 | `Lil Peep - vibe (Official Audio)(MP3_320K).mp3` | `LiL PEEP - vibe.mp3` | MusicBrainz | 92.0% | RENAMED |
| 764 | `Lil Peep - we think too much (Official Audio)(MP3_320K).mp3` | `LiL PEEP - We Think Too Much.mp3` | MusicBrainz | 92.0% | RENAMED |
| 765 | `Lil Peep _ Boy Froot - Goth Queen [lyrics](MP3_320K).mp3` | `Lil Peep _ Boy Froot - Goth Queen.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 766 | `Lil Peep _ Lil Tracy - dying out west (Official Audio)(MP3_320K).mp3` | `Lil Peep _ Lil Tracy - dying out west.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 767 | `Lil Peep _ Lil Tracy - your favorite dress (Official Video)(MP3_320K).mp3` | `Lil Peep _ Lil Tracy - your favorite dress.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 768 | `Lil Peep _ Lil Tracy – GODS ( Slowed to perfection )(MP3_160K).mp3` | `Len Tao - Lil Peep & Lil Tracy – GODS ( Slowed to perfection).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 769 | `Lil Peep x Boy Froot-Turnin Up In The Back(Prod. By DIETRICH)(MP3_320K).mp3` | `MidniteMusik - Lil Peep x Boy Froot-Turnin Up In The Back(Prod. By DIETRICH).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 770 | `Lil Peep x ILoveMakonnen - I_ve Been Waiting (OG Version) (Official Audio)(MP3_320K).mp3` | `Lil Peep x ILoveMakonnen - I_ve Been Waiting (OG Version).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 771 | `Lil Peep x Lil Tracy - Castles ( Slowed to perfection )(MP3_320K).mp3` | `Lil Peep x Lil Tracy - Castles ( Slowed to perfection).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 772 | `Lil Peep x Lil Tracy - White Wine (OG Music Video)(MP3_320K).mp3` | `Lil Peep x Lil Tracy - White Wine (OG Music Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 773 | `Lil Peep – Driveway ( Slowed to perfection )(MP3_320K).mp3` | `Len Tao - Lil Peep – Driveway ( Slowed to perfection).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 774 | `Lil Skies - Nowadays ft. Landon Cube (Directed by Cole Bennett)(MP3_320K).mp3` | `Lil Skies - Nowadays ft. Landon Cube (Directed by Cole Bennett).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 775 | `Lil Uzi Vert - 20 Min(MP3_320K).mp3` | `Lil Uzi Vert - 20 Min.mp3` | MusicBrainz | 92.0% | RENAMED |
| 776 | `Lil Uzi Vert - P2 [Official Audio](MP3_320K).mp3` | `Lil Uzi Vert - P2.mp3` | MusicBrainz | 92.0% | RENAMED |
| 777 | `Lil Uzi Vert - Red Moon [Official Music Video](MP3_320K).mp3` | `Lil Uzi Vert - Red Moon.mp3` | iTunes | 95.0% | RENAMED |
| 778 | `Lil Uzi Vert - XO Tour Llif3 (slowed   reverb)(MP3_320K).mp3` | `Lil Uzi Vert - XO Tour Llif3 (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 779 | `Lil Yachty - sAy sOMETHINg (Official Audio)(MP3_320K).mp3` | `Lil Yachty - sAy sOMETHINg.mp3` | MusicBrainz | 92.0% | RENAMED |
| 780 | `Lil Yachty - the BLACK seminole. (Official Audio)(MP3_320K).mp3` | `Lil Yachty - the BLACK seminole.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 781 | `Lil peep - Ghost Girl ( Slowed to perfection )(MP3_320K).mp3` | `Lil peep - Ghost Girl ( Slowed to perfection).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 782 | `Lil peep - Hate Me (legendado)(MP3_320K).mp3` | `Lil peep - Hate Me (legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 783 | `Lilás - Djavan.mp3` | `Djavan - Lilás.mp3` | iTunes | 95.0% | RENAMED |
| 784 | `Linda Música Chinesa -  Flauta de Bambu.mp3` | `Linda Música Chinesa - Flauta de Bambu.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 785 | `Linkin Park - Faint.mp3` | `Linkin Park - Faint.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 786 | `Linn da Quebrada - Dedo Nucué ft. Mulher Pepita (Á.mp3` | `Linn da Quebrada - Dedo Nucué ft. Mulher Pepita (Á).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 787 | `Lionel   Richie     --    Say   You   Say   Me   [.mp3` | `LakeParadiseMusic1 - Lionel Richie -- Say You Say Me.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 788 | `Lohka(MP3_320K).mp3` | `KTrek - Lohka.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 789 | `Long Time (Intro)(MP3_320K).mp3` | `Playboi Carti - Long Time (intro).mp3` | MusicBrainz | 92.0% | RENAMED |
| 790 | `Lord Infamous - Scarecrow Melody [432Hz](MP3_320K).mp3` | `Lord Infamous - Scarecrow Melody [432Hz].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 791 | `Lost Years - Shotgun(MP3_320K)_1.mp3` | `Lost Years - Shotgun.mp3` | iTunes | 95.0% | RENAMED |
| 792 | `Lou Rawls - Youll Never Find Another Love Like Mine.mp3` | `Lou Rawls - You'll Never Find Another Love Like Mine.mp3` | iTunes | 95.0% | RENAMED |
| 793 | `Louis Armstrong - What A Wonderful World(MP3_70K).mp3` | `Louis Armstrong - What A Wonderful World.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 794 | `Louis Rottemburg - Your Love Is My Drug.mp3` | `Louis Rottemburg - Your Love Is My Drug.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 795 | `Love To Hate(MP3_320K).mp3` | `Carter Tomorrow - Love To Hate.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 796 | `Love Yourz(MP3_320K).mp3` | `J. Cole - Love Yourz.mp3` | iTunes | 95.0% | RENAMED |
| 797 | `Ludovico Einaudi - Experience (Slowed)(MP3_320K).mp3` | `Ludovico Einaudi - Experience (Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 798 | `Ludovico Einaudi - Experience(MP3_320K).mp3` | `Ludovico Einaudi - Experience.mp3` | MusicBrainz | 92.0% | RENAMED |
| 799 | `Ludovico Einaudi - Experience(MP3_320K)_1.mp3` | `Ludovico Einaudi - Experience_1.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 800 | `Lugar Ao Sol(MP3_320K).mp3` | `Charlie Brown Jr. - Lugar Ao Sol.mp3` | MusicBrainz | 92.0% | RENAMED |
| 801 | `Lumi athena icewhore.mp3` | `𝙀𝙜𝙤𝙞𝙨𝙪𝙩𝙤 - エゴイスト - lumi athena icewhore.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 802 | `Lupercais - O Homem das Costas Pesadas(MP3_320K).mp3` | `Lupercais - O Homem Das Costas Pesadas.mp3` | MusicBrainz | 92.0% | RENAMED |
| 803 | `LÁGRIMAS NEGRAS - GAL COSTA - JORGE MAUTNER(MP3_320K).mp3` | `LÁGRIMAS NEGRAS - GAL COSTA - JORGE MAUTNER.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 804 | `MARINA SENA - POR SUPUESTO (VISUALIZER)(MP3_320K).mp3` | `Marina Sena - Por Supuesto.mp3` | iTunes | 95.0% | RENAMED |
| 805 | `MASCULINE BEAUTY - Warrior Skull _ Mesomorph Body(MP3_320K).mp3` | `MASCULINE BEAUTY - Warrior Skull _ Mesomorph Body.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 806 | `MATRANG - Медуза(MP3_320K).mp3` | `MATRANG - Медуза.mp3` | iTunes | 95.0% | RENAMED |
| 807 | `MC Cabelinho, Dallass - O PREÇO.mp3` | `MC Cabelinho, Dallass - O PREÇO.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 808 | `MC Carol - Tô Usando Crack (Audio)(MP3_320K).mp3` | `Mc Carol - Tô usando crack.mp3` | MusicBrainz | 92.0% | RENAMED |
| 809 | `MC Est*pro Oficial - MC Estupro - Criminoso Sexual (Remix by_ DJ Molestadinho).mp3` | `MC Estpro Oficial - MC Estupro - Criminoso Sexual (Remix by_ DJ Molestadinho).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 810 | `MC Gui - Sonhar.mp3` | `MC Gui - Sonhar.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 811 | `MC PH x Kyan - Frutos (Vídeo Clipe Oficial)(MP3_320K).mp3` | `MC PH x Kyan - Frutos (Vídeo Clipe Oficial).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 812 | `MC Pedrinho - To Focado Pra Ficar Milionário (Áudio Oficial) Feat. Dardengo(MP3_320K).mp3` | `MC Pedrinho - To Focado Pra Ficar Milionário (Áudio Oficial) Feat. Dardengo.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 813 | `MCMXC a.D(MP3_320K).mp3` | `MCMXC a.D.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 814 | `MEGA AGUDO - BOLINHA DE GOLF 2 - MC GW ( DJ_S  MENO 011_ LUKINHAS 011_ GUSTAVO DE OZ _ MENOR 3K )(MP3_320K).mp3` | `MEGA AGUDO - BOLINHA DE GOLF 2 - MC GW ( DJ_S MENO 011_ LUKINHAS 011_ GUSTAVO DE OZ _ MENOR 3K).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 815 | `MGMT - Little Dark Age(MP3_320K).mp3` | `MGMT - Little Dark Age.mp3` | iTunes | 95.0% | RENAMED |
| 816 | `MGMT - Little Dark Age.mp3` | `MGMT - Little Dark Age.mp3` | iTunes | 95.0% | RENAMED |
| 817 | `MGMT - Me and Michael.mp3` | `MGMT - Me and Michael.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 818 | `MIQUIZTLI - Om Namah Shivaya -180bpm-.mp3` | `Miquiztli - Om Namah Shivaya -180.mp3` | iTunes | 95.0% | RENAMED |
| 819 | `MISS THE RIGHTEOUS - Mo Beats x Trippie Redd x Playboi Carti x Mario Judah (Pepe Lore)(MP3_320K).mp3` | `MISS THE RIGHTEOUS - Mo Beats x Trippie Redd x Playboi Carti x Mario Judah (Pepe Lore).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 820 | `MONTAGEM ALQUIMIA (Slowed)(MP3_320K).mp3` | `SUKA - MONTAGEM ALQUIMIA (Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 821 | `MONTAGEM COZES ABECE (Slowed)(MP3_320K).mp3` | `MONTAGEM COZES ABECE - Super Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 822 | `MONTAGEM JACARÉ (Ultra Slowed)(MP3_320K).mp3` | `Release - MONTAGEM JACARÉ (Ultra Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 823 | `MV Bill - Estilo Vagabundo(MP3_320K).mp3` | `MV Bill - Estilo vagabundo.mp3` | MusicBrainz | 92.0% | RENAMED |
| 824 | `MVKO x JUPILUXE - DREAMS OF DEMONS (AMV) __ edit by ruczu(MP3_320K).mp3` | `MVKO x JUPILUXE - DREAMS OF DEMONS (AMV) __ edit by ruczu.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 825 | `MY HERO FUNK - (SLOWED _ REVERB)(MP3_320K).mp3` | `MY HERO FUNK - (SLOWED _ REVERB).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 826 | `M_R_M - Survive [Official Videoclip](MP3_320K).mp3` | `M_R_M - Survive [Official Videoclip].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 827 | `Machine Girl - MG1(MP3_320K).mp3` | `Machine Girl - Mg1.mp3` | iTunes | 95.0% | RENAMED |
| 828 | `Machine Girl - WLFGRL [Full Album](MP3_320K) (2).mp3` | `Machine Girl - WLFGRL.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 829 | `Machine Gun(MP3_320K).mp3` | `Slowdive - Machine Gun.mp3` | iTunes | 95.0% | RENAMED |
| 830 | `Mackx Fresco, Monie$ - What We Need Freestyle.mp3` | `Mackx Fresco, Monie$ - What We Need Freestyle.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 831 | `Madison Beer - Make You Mine.mp3` | `Madison Beer - Make You Mine.mp3` | MusicBrainz | 92.0% | RENAMED |
| 832 | `Madonna - Miles away.mp3` | `Madonna - Miles Away.mp3` | MusicBrainz | 92.0% | RENAMED |
| 833 | `Madonna - Papa Don_t Preach (Official Video) [HD](MP3_320K).mp3` | `Madonna - Papa Don_t Preach.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 834 | `Maesthetic Ascension ft Curio _ Sandmaxxed _ Supreme Male Beauty(MP3_320K).mp3` | `Kabus - Maesthetic Ascension ft Curio & Sandmaxxed - Supreme Male Beauty.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 835 | `Mahou Shoujo(MP3_320K).mp3` | `GHOST DATA - Mahou Shoujo.mp3` | MusicBrainz | 92.0% | RENAMED |
| 836 | `Mais um Adeus - Vinicius de Moraes(MP3_320K).mp3` | `Mais um Adeus - Vinicius de Moraes.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 837 | `Majestic(MP3_160K).mp3` | `NBSPLV - Majestic.mp3` | MusicBrainz | 92.0% | RENAMED |
| 838 | `Malory - Space In Your Mind(MP3_320K).mp3` | `Malory - Space in Your Mind.mp3` | MusicBrainz | 92.0% | RENAMED |
| 839 | `Malory - Take Me Down(MP3_320K).mp3` | `Malory - take Me Down.mp3` | iTunes | 95.0% | RENAMED |
| 840 | `Mamy Blue - Demis Roussos.mp3` | `Mamy Blue - Demis Roussos.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 841 | `Man Down - Rihanna(MP3_128K).mp3` | `Man Down - Rihanna.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 842 | `Mandylion(MP3_320K).mp3` | `The Gathering - Mandylion.mp3` | iTunes | 90.0% | RENAMED |
| 843 | `Marcelo Falcão (Senhor fazei de mim)(MP3_320K).mp3` | `Marcelo Oliveira - Marcelo Falcão (Senhor fazei de mim).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 844 | `Marcelo Gallo - Desert Star(MP3_160K).mp3` | `Marcelo Gallo - Desert Star.mp3` | MusicBrainz | 92.0% | RENAMED |
| 845 | `Marconi Union - Weightless (Official Video)(MP3_70K).mp3` | `Marconi Union - Weightless.mp3` | iTunes | 95.0% | RENAMED |
| 846 | `Marconi Union - Weightless Part 5(MP3_70K).mp3` | `Marconi Union - Weightless, Part 5.mp3` | MusicBrainz | 92.0% | RENAMED |
| 847 | `Marisa Monte, Laurie Anderson - Enquanto Isso.mp3` | `Marisa Monte, Laurie Anderson - Enquanto Isso.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 848 | `Maroon 5 - Maps (Explicit) (Official Music Video)(MP3_320K).mp3` | `Maroon 5 - Maps (Explicit).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 849 | `Mars 144_ 72 Hz(MP3_70K).mp3` | `Mars 144, 72 Hz.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 850 | `Martin Dupont - Dominus Vobis Cum(MP3_320K).mp3` | `Martin Dupont - Dominus Vobis Cum.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 851 | `Mask and Da Glock(MP3_320K).mp3` | `Three 6 Mafia - Mask And Da Glock.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 852 | `Massive Attack - Voodoo In My Blood.mp3` | `Massive Attack - Voodoo in My Blood.mp3` | MusicBrainz | 92.0% | RENAMED |
| 853 | `Masters at Work - The Ha Dance (Ken_Lou Mixx) [1991](MP3_320K).mp3` | `Masters At Work - The Ha Dance (Ken - Lou Mixx).mp3` | iTunes | 95.0% | RENAMED |
| 854 | `Max s Song - Kowbra.m4a` | `Max s Song - Kowbra.m4a` | LocalHeuristic | 85.0% | RENAMED |
| 855 | `Maz Antdot Jéssica Gaspar - Brisa.mp3` | `Maz Antdot Jéssica Gaspar - Brisa.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 856 | `Mc Linn da Quebrada - Bixa Preta (Áudio Oficial)(MP3_128K).mp3` | `Mc Linn da Quebrada - Bixa Preta (Áudio Oficial).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 857 | `Me Serve Vadia(MP3_320K).mp3` | `Shakers - Me Serve Vadia.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 858 | `Medasin MAE.SUN - magic.mp3` | `Medasin - Magic.mp3` | iTunes | 95.0% | RENAMED |
| 859 | `Medley Nº 3_ O Velho E A Flor _ Veja Você _ Mais Um Adeus(MP3_320K).mp3` | `Medley Nº 3 - O Velho E A Flor - Veja Você - Mais Um Adeus.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 860 | `Melly Mike - Young Black & Rich - Slowed.mp3` | `Melly Mike - Young Black & Rich (Slowed Radio Edit).mp3` | iTunes | 95.0% | RENAMED |
| 861 | `Melodia Do Argentino Funk (Super Slowed)(MP3_320K).mp3` | `Melodia Do Argentino Funk - Super Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 862 | `Melon Yellow(MP3_320K).mp3` | `Slowdive - Melon Yellow.mp3` | MusicBrainz | 92.0% | RENAMED |
| 863 | `Memento Mori(MP3_320K).mp3` | `Lamúria Abissal - Memento Mori.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 864 | `Memo Boy - Bucket(MP3_320K).mp3` | `Memo Boy - Bucket.mp3` | iTunes | 95.0% | RENAMED |
| 865 | `Memo boy - Insomniac (tradução)(MP3_320K).mp3` | `Memo boy - Insomniac (tradução).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 866 | `Memory Reboot (Over Slowed)(MP3_320K).mp3` | `VØJ & Narvent - Memory Reboot (Over Slowed).mp3` | iTunes | 95.0% | RENAMED |
| 867 | `Memory Reboot but sadder(MP3_320K).mp3` | `CXRRUPTPLXYX - Memory Reboot but sadder.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 868 | `Memphis Cult_ GORMCORPSX_ Phonkyrie_ SPLYXER - Laidback (Slowed   reverb)(MP3_320K).mp3` | `Memphis Cult_ GORMCORPSX_ Phonkyrie_ SPLYXER - Laidback (Slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 869 | `Memphis Revived - Bud Keeps Me Fiendin Pt 3 - N.O.D. - Enhanced Version.mp3` | `Memphis Revived - Bud Keeps Me Fiendin Pt 3 - N.O.D. - Enhanced Version.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 870 | `Memphis Revived - Fugative - N.O.D. - Enhanced Version.mp3` | `Memphis Revived - Fugative - N.O.D. - Enhanced Version.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 871 | `Memphis Revived - Tiny Lame - N.O.D. - Enhanced Version.mp3` | `Memphis Revived - Tiny Lame - N.O.D. - Enhanced Version.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 872 | `Men At Work - Down Under (Video).mp3` | `Men At Work - Down Under (Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 873 | `Men At Work - It_s a Mistake.mp3` | `Men At Work - It_s a Mistake.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 874 | `Mental Minority - Collected [Full Album](MP3_320K).mp3` | `Mental Minority - Collected.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 875 | `Mental Minority - Dystopia Now (Full Album)(MP3_320K).mp3` | `Mental Minority - Dystopia Now.mp3` | MusicBrainz | 92.0% | RENAMED |
| 876 | `Metropolis(MP3_320K).mp3` | `Kraftwerk - Metropolis.mp3` | MusicBrainz | 92.0% | RENAMED |
| 877 | `Miasma De Negatividade(MP3_320K).mp3` | `Lamúria Abissal - Miasma De Negatividade.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 878 | `Mica Paris - My One Temptation (1988).mp3` | `Mica Paris - My One Temptation.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 879 | `Michael Bishop - Steal The Night(M4A_128K).m4a.m4a` | `Michael Bishop - Steal The Night(M4A_128K).m4a.m4a` | LocalHeuristic | 85.0% | RENAMED |
| 880 | `Michael Jackson - Beat It (Official Video).mp3` | `Michael Jackson - Beat It.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 881 | `Michael Jackson Thriller [Audio HQ].mp3` | `Diana Yassine - Michael Jackson Thriller [Audio].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 882 | `Michel Cleis, Totó La Momposina, Charles Websters - La Mezcla - Charles Websters Club Mix.mp3` | `Michel Cleis, Totó La Momposina, Charles Websters - La Mezcla - Charles Websters Club Mix.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 883 | `Midnight Cowboy(MP3_320K).mp3` | `Modern Heaven - Midnight Cowboy.mp3` | MusicBrainz | 92.0% | RENAMED |
| 884 | `Midnight in Hel(MP3_320K).mp3` | `Cult Member - Midnight In Hel.mp3` | MusicBrainz | 92.0% | RENAMED |
| 885 | `Mike Posner - I Took A Pill In Ibiza (SeeB Remix).mp3` | `Mike Posner - I Took a Pill in Ibiza (SeeB remix).mp3` | MusicBrainz | 92.0% | RENAMED |
| 886 | `Mike _ The Mechanics - Silent running.mp3` | `Mike _ The Mechanics - Silent running.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 887 | `Milky Chance - Cocoon (Official Video).mp3` | `Milky Chance - Cocoon.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 888 | `Milton Nascimento e RPM - Feito Nós.mp3` | `Milton Nascimento e RPM - Feito Nós.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 889 | `Minha Alma ( A Paz Que Eu Não Quero ) [Eletronic V.mp3` | `Warner Music Brasil - Minha Alma ( A Paz Que Eu Não Quero ) [Eletronic V].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 890 | `Mirrors(MP3_320K).mp3` | `Mirrors.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 891 | `Miserere(MP3_320K).mp3` | `Miserere.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 892 | `Misora Hibari(美空．ひばり) - Kawa no nagare no you ni(川.mp3` | `Misora Hibari(美空．ひばり) - Kawa no nagare no you ni(川).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 893 | `Missing (Todd Terry Remix)(MP3_320K).mp3` | `Everything But The Girl - Missing (Todd Terry Remix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 894 | `Mixmasters feat Mc Action - In The Mix (Fast Eddie Mix)(MP3_320K).mp3` | `Mixmasters feat Mc Action - In The Mix (Fast Eddie Mix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 895 | `MoBlack Records - Hugel, SOLTO (FR) - Jamaican (Bam Bam) (Extended Mix).mp3` | `MoBlack Records - Hugel, SOLTO (FR) - Jamaican (Bam Bam) (Extended Mix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 896 | `Modern Talking - Cheri Cheri Lady (Official Music Video)(MP3_320K).mp3` | `Modern Talking - Cheri Cheri Lady.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 897 | `Mofe. - prince of egypt.mp3` | `Mofe. - prince of egypt.mp3` | iTunes | 95.0% | RENAMED |
| 898 | `Molchat Doma - Volny (Official Lyrics Video) молчат дома - волны(MP3_320K).mp3` | `Molchat Doma - Volny (Official Lyrics Video) молчат дома - волны.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 899 | `Molchat Doma _ MENT x ETEP Session(MP3_320K).mp3` | `Molchat Doma - MENT x ETEP Session.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 900 | `Molchat doma - Kletka(MP3_320K).mp3` | `Molchat doma - Kletka.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 901 | `Molly Nilsson - I Hope You Die(MP3_320K).mp3` | `Molly Nilsson - I Hope You Die.mp3` | iTunes | 95.0% | RENAMED |
| 902 | `Mons Vi - Topic - in my fantasy.mp3` | `Mons Vi - in my fantasy.mp3` | MusicBrainz | 92.0% | RENAMED |
| 903 | `Montagem Briza Aurática(MP3_320K).mp3` | `DJ Brabox 013, DJ Math Original, MC BM OFICIAL, MC VN Cria - Montagem Briza Aurática.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 904 | `Montagem do Batidão Viciante - Slowed(MP3_320K).mp3` | `Montagem do Batidão Viciante - Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 905 | `Moony - I Don´t Know Why(MP3_320K).mp3` | `Moony - I Don´t Know Why.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 906 | `Morituri Mortuis(MP3_320K).mp3` | `Lamúria Abissal - Morituri Mortuis.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 907 | `Morphias Waltz(MP3_320K).mp3` | `Morphias Waltz.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 908 | `Mors Omnia(MP3_320K).mp3` | `Lamúria Abissal - Mors Omnia.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 909 | `Mother_ hold my hand(MP3_320K).mp3` | `イア - ia - Mother, hold my hand.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 910 | `Mr Krimes - Akiarua Deathwish (Slowed).mp3` | `Mr Krimes - Akiarua Deathwish (Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 911 | `Mr. Kitty - After Dark (Synthwave _ Blade Runner ambience cover)(MP3_320K).mp3` | `Mr. Kitty - After Dark (Synthwave _ Blade Runner ambience cover).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 912 | `Mr.Kitty - Everything Will Be Okay 「slowed down」(MP3_320K).mp3` | `Mr.Kitty - Everything Will Be Okay 「slowed down」.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 913 | `Mr.Kitty - From Liquid(MP3_320K).mp3` | `Mr.Kitty - From Liquid.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 914 | `Mr.Kitty • After Dark __ Jennifer Connelly • Career Opportunities(MP3_320K).mp3` | `JenniferConnelly80s - Mr.Kitty • After Dark - - Jennifer Connelly • Career Opportunities.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 915 | `Musica de terrorista.mp3` | `Øřłăņđø シ - Musica de terrorista.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 916 | `Música Árabe -  Khaled - El Arbi - ( Eu Sou o Árab.mp3` | `Música Árabe - Khaled - El Arbi - ( Eu Sou o Árab).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 917 | `Música Árabe.mp3` | `Ale Nigre - Música Árabe.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 918 | `Música Chinesa Flauta de Bambu Tranquila.mp3` | `MúsicasParaRelaxareSeSentirBem - Música Chinesa Flauta de Bambu Tranquila.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 919 | `Música chinesa - flauta de bambu.mp3` | `Música chinesa - flauta de bambu.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 920 | `My Whole World_s Coming Apart(MP3_320K).mp3` | `John Maus - My Whole World's Coming Apart.mp3` | iTunes | 95.0% | RENAMED |
| 921 | `Myuu - Outsider.mp3` | `Myuu - Outsider.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 922 | `Máquinas(MP3_320K).mp3` | `Finis Africae - Máquinas.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 923 | `N2SC4RVideos - Playstation 2 Startup Intro (PS2).mp3` | `N2SC4RVideos - Playstation 2 Startup Intro (PS2).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 924 | `NBSPLV -  Wakeful(MP3_320K).mp3` | `NBSPLV - Wakeful.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 925 | `NBSPLV - Algorithm(MP3_320K).mp3` | `NBSPLV - Algorithm.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 926 | `NBSPLV - Breaking Ice(MP3_320K).mp3` | `NBSPLV - Breaking Ice.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 927 | `NBSPLV - Cold Waves(MP3_70K).mp3` | `NBSPLV - Cold Waves.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 928 | `NBSPLV - Flame(MP3_320K).mp3` | `NBSPLV - Flame.mp3` | MusicBrainz | 92.0% | RENAMED |
| 929 | `NBSPLV - Load Up On Guns(MP3_70K).mp3` | `NBSPLV - Load Up On Guns.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 930 | `NBSPLV - Quiet Thunder(MP3_320K).mp3` | `NBSPLV - Quiet Thunder.mp3` | iTunes | 95.0% | RENAMED |
| 931 | `NBSPLV - Semantics(MP3_320K).mp3` | `NBSPLV - Semantics.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 932 | `NBSPLV - Sender(MP3_320K).mp3` | `NBSPLV - Sender.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 933 | `NBSPLV - Shining Star(MP3_320K).mp3` | `NBSPLV - Shining Star.mp3` | MusicBrainz | 92.0% | RENAMED |
| 934 | `NBSPLV - Soulful Night _ TOKYO Night Drive(MP3_320K).mp3` | `NBSPLV - Soulful Night _ TOKYO Night Drive.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 935 | `NBSPLV - Stolen Kisses(MP3_320K).mp3` | `NBSPLV - Stolen Kisses.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 936 | `NBSPLV - Summer 4091(MP3_320K).mp3` | `NBSPLV - Summer 4091.mp3` | iTunes | 95.0% | RENAMED |
| 937 | `NBSPLV - The Hateful Eight(MP3_70K).mp3` | `NBSPLV - The Hateful Eight.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 938 | `NBSPLV - The Lost Soul Down - Slowed & Reverb.mp3` | `NBSPLV - The Lost Soul Down - Slowed & Reverb.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 939 | `NBSPLV - The Lost Soul Down(MP3_70K).mp3` | `NBSPLV - The Lost Soul Down.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 940 | `NBSPLV - Wisdom(MP3_320K).mp3` | `NBSPLV - Wisdom.mp3` | iTunes | 95.0% | RENAMED |
| 941 | `NEW VICE(MP3_320K).mp3` | `Yaego - NEW VICE.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 942 | `NO PULE ESSA AULA - AiVerso.mp3` | `NO PULE ESSA AULA - AiVerso.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 943 | `NUEKI_ TOLCHONOV_ glichery - TIRED OF PROBLEMS (SLOWED)(MP3_320K).mp3` | `NUEKI_ TOLCHONOV_ glichery - TIRED OF PROBLEMS (SLOWED).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 944 | `NX Zero - Uma Gota No Oceano (Lyric Video)(MP3_70K).mp3` | `NX Zero - Uma Gota no Oceano.mp3` | iTunes | 95.0% | RENAMED |
| 945 | `NX Zero - Vamos Seguir (Lyric Video)(MP3_70K).mp3` | `NX Zero - Vamos Seguir.mp3` | iTunes | 95.0% | RENAMED |
| 946 | `NXZero - Razões e emoções(MP3_70K).mp3` | `NX Zero - Razões e Emoções (Ao Vivo).mp3` | iTunes | 95.0% | RENAMED |
| 947 | `Nabil Alwaked - Nabil Alwaked - “ VØJ, Narvent - Memory Reboot ”.mp3` | `Nabil Alwaked - Nabil Alwaked - “ VØJ, Narvent - Memory Reboot ”.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 948 | `Nação Zumbi - Um Sonho.mp3` | `Nação Zumbi - Um Sonho.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 949 | `Naruto Shippuden - Girei (Pain_s Theme Song)(MP3_320K).mp3` | `Naruto Shippuden - Girei (Pain_s Theme Song).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 950 | `Narvent_ 7vvch - HAUNTED (4K Music Video)(MP3_160K).mp3` | `Narvent_ 7vvch - HAUNTED (4K Music Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 951 | `Narvent_ Luneex - Calm Night (4K Music Video)(MP3_320K).mp3` | `Narvent_ Luneex - Calm Night (4K Music Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 952 | `Natasha Princess Ft. Luiz Santys - Então Tá Bom (Visualizer)(MP3_320K).mp3` | `Natasha Princess Ft. Luiz Santys - Então Tá Bom.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 953 | `Nature_s Temple(MP3_320K).mp3` | `Tenno - Nature's Temple.mp3` | iTunes | 95.0% | RENAMED |
| 954 | `Naughty Boy_ Arrow Benjamin_ Beyoncé - Runnin_ (Legendado)(MP3_320K).mp3` | `Naughty Boy_ Arrow Benjamin_ Beyoncé - Runnin_ (Legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 955 | `Ne Obliviscaris - Of The Leper Butterflies.mp3` | `Ne Obliviscaris - Of the Leper Butterflies.mp3` | MusicBrainz | 92.0% | RENAMED |
| 956 | `Necropedophile(MP3_320K).mp3` | `Necropedophile.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 957 | `Nelly Furtado - Maneater (Slowed_ no reeverb_ perfectly looped) [only the best Part](MP3_320K).mp3` | `Nelly Furtado - Maneater (Slowed_ no reeverb_ perfectly looped) [only the best Part].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 958 | `Nelly Furtado - Say It Right (Official Music Video)(MP3_320K).mp3` | `Nelly Furtado - Say It Right.mp3` | MusicBrainz | 92.0% | RENAMED |
| 959 | `Neoprene(MP3_320K).mp3` | `BONES - Neoprene.mp3` | MusicBrainz | 92.0% | RENAMED |
| 960 | `Nervous Hands(MP3_320K).mp3` | `Ritual Howls - Nervous Hands.mp3` | iTunes | 95.0% | RENAMED |
| 961 | `Never Like U(MP3_320K).mp3` | `NBSPLV - Never Like U.mp3` | MusicBrainz | 92.0% | RENAMED |
| 962 | `Nibana - I Am a Soul(MP3_320K).mp3` | `Nibana - I Am a Soul.mp3` | iTunes | 95.0% | RENAMED |
| 963 | `Night Lovell - Polozhenie(MP3_320K).mp3` | `Night Lovell - Polozhenie.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 964 | `Night swim(MP3_320K).mp3` | `VIQ - Night swim.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 965 | `Nightcore - Cold Waves [NBSPLV](MP3_320K).mp3` | `Nightcore - Cold Waves [NBSPLV].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 966 | `Ninja das Automações - Prospecção Automática.mp3` | `Ninja das Automações - Prospecção Automática.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 967 | `Nirvana - Smells Like Teen Spirit (Doomer Wave)(MP3_320K).mp3` | `Nirvana - Smells Like Teen Spirit (Doomer Wave).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 968 | `Nirvana - Smells Like Teen Spirit (Official Music Video)(MP3_320K).mp3` | `Nirvana - Smells Like Teen Spirit.mp3` | iTunes | 95.0% | RENAMED |
| 969 | `Nirvana - Smells Like Teen Spirit (slowed_reverb)(MP3_320K).mp3` | `Nirvana - Smells Like Teen Spirit.mp3` | iTunes | 95.0% | RENAMED |
| 970 | `Nitric Oxide Boost (Morphogenic_ Energetic Programming)(MP3_320K).mp3` | `Nitric Oxide Boost (Morphogenic - Energetic Programming).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 971 | `No Good for Me(MP3_320K).mp3` | `The Corrs - No Good for Me.mp3` | iTunes | 95.0% | RENAMED |
| 972 | `No Role Modelz(MP3_320K)_1.mp3` | `J. Cole - No Role Modelz.mp3` | iTunes | 95.0% | RENAMED |
| 973 | `Nocturnal Depression   Host Autumn   legendado en pt(MP3_320K).mp3` | `Graziele Linhares - Nocturnal Depression Host Autumn legendado en pt.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 974 | `Nostalgia(MP3_320K).mp3` | `Nocturnal Depression - Nostalgia.mp3` | MusicBrainz | 92.0% | RENAMED |
| 975 | `Not Flesh But Spirit_(MP3_320K).mp3` | `DIM - Not Flesh But Spirit!.mp3` | iTunes | 95.0% | RENAMED |
| 976 | `Numa Sala de Reboco (feat. Luiz Gonzaga)(MP3_320K).mp3` | `Dominguinhos, Luiz Gonzaga - Numa Sala de Reboco (feat. Luiz Gonzaga).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 977 | `Não Sei Dançar(MP3_320K).mp3` | `Marina Lima - Não sei dançar.mp3` | MusicBrainz | 92.0% | RENAMED |
| 978 | `O PODER DO SILÊNCIO - Eckhart Tolle - Áudio Completo(M4A_128K).m4a.m4a` | `O PODER DO SILÊNCIO - Eckhart Tolle - Áudio Completo(M4A_128K).m4a.m4a` | LocalHeuristic | 85.0% | RENAMED |
| 979 | `O Rappa - Mar de gente(MP3_128K).mp3` | `O Rappa - Mar de gente.mp3` | MusicBrainz | 92.0% | RENAMED |
| 980 | `O Teatro Mágico - Deixa Ser.mp3` | `O Teatro Mágico - Deixa Ser.mp3` | iTunes | 95.0% | RENAMED |
| 981 | `O bêbado e a equilibrista(MP3_320K).mp3` | `Elis Regina - O bêbado e a equilibrista.mp3` | MusicBrainz | 92.0% | RENAMED |
| 982 | `ODETARI  - KEEP UP [Official Music Video](MP3_320K).mp3` | `Odetari - KEEP UP.mp3` | MusicBrainz | 92.0% | RENAMED |
| 983 | `OMI - Cheerleader (Felix Jaehn Remix) (Official Video) [Ultra Records](MP3_320K).mp3` | `Omi - Cheerleader (Felix Jaehn Remix) [Radio Edit].mp3` | iTunes | 95.0% | RENAMED |
| 984 | `ON LIVË-(guitar remix   Zangetsu)(MP3_320K).mp3` | `R U K I A - ON LIVË-(guitar remix + Zangetsu).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 985 | `OURO PRETO TEKK(MP3_320K).mp3` | `OURO PRETO TEKK - Super Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 986 | `Oasis - Wonderwall - Remastered.mp3` | `Oasis - Wonderwall - Remastered.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 987 | `Odd Behavior - forever 3am..mp3` | `Odd Behavior - forever 3am.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 988 | `Of Molten Stars(MP3_320K).mp3` | `DIM - Of Molten Stars.mp3` | iTunes | 95.0% | RENAMED |
| 989 | `Oh my Angel (slowed to perfection)(MP3_320K).mp3` | `Rihanna Riri - Oh my Angel (slowed to perfection).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 990 | `Oh_ Pretty Woman(MP3_70K).mp3` | `Oh, Pretty Woman.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 991 | `Old Money(MP3_320K).mp3` | `Lana Del Rey - Old Money.mp3` | iTunes | 90.0% | RENAMED |
| 992 | `On a Crowded Street(MP3_320K).mp3` | `Blue Magic - On a Crowded Street.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 993 | `Oneohtrix Point Never _ _Zones Without People_(MP3_320K).mp3` | `BC LA - Oneohtrix Point Never - ''Zones Without People''.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 994 | `Only by Man (Platinum)(MP3_320K).mp3` | `Shinnobu - Only by Man (Platino).mp3` | MusicBrainz | 92.0% | RENAMED |
| 995 | `Ooops Up (7_ Edit)(MP3_320K).mp3` | `Snap! - Ooops Up (7'' Edit).mp3` | iTunes | 95.0% | RENAMED |
| 996 | `Os Paralamas   Do Sucesso A Novidade.mp3` | `adealforyou - Os Paralamas Do Sucesso A Novidade.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 997 | `Os Paralamas Do Sucesso - Lanterna Dos Afogados (A.mp3` | `Os Paralamas Do Sucesso - Lanterna Dos Afogados (A).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 998 | `Os Paralamas Do Sucesso, Marisa Monte - O Amor Não Sabe Esperar.mp3` | `Os Paralamas do Sucesso - O Amor Não Sabe Esperar (feat. Marisa Monte).mp3` | iTunes | 95.0% | RENAMED |
| 999 | `Os sons do Silencio.Flauta de pan.- By vitinhamend.mp3` | `Viktor Mendes Assunção - Os sons do Silencio.Flauta de pan.- By vitinhamend.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1000 | `Ov Dreams(MP3_320K).mp3` | `Cult Member - Ov Dreams.mp3` | iTunes | 95.0% | RENAMED |
| 1001 | `PIXY - LEGACY (Slowed down)(MP3_320K).mp3` | `PIXY - LEGACY (Slowed down).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1002 | `PONTINHO PSICODÉLICO 2 😵‍💫 - MC GUTO VGS (DJ PATRICK R E DJ KLEY)(MP3_320K).mp3` | `PONTINHO PSICODÉLICO 2 😵‍💫 - MC GUTO VGS (DJ PATRICK R E DJ KLEY).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1003 | `POWERFUL GOOD LUCK ENERGY_ Attract Good Fortune and Miracles W_ Law of Attraction Vibration(MP3_320K).mp3` | `POWERFUL GOOD LUCK ENERGY - Attract Good Fortune and Miracles W - Law of Attraction Vibration.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1004 | `POiSON GiRL FRiEND - HARDLY EVER SMILE(without you).mp3` | `POiSON GiRL FRiEND - HARDLY EVER SMILE (without you).mp3` | MusicBrainz | 92.0% | RENAMED |
| 1005 | `PYPY (Slowed)(MP3_320K).mp3` | `Ogryzek - PYPY (Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1006 | `Pacific Plaza - vcr-classique - fiji babe (Music Video).mp3` | `Pacific Plaza - vcr-classique - fiji babe (Music Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1007 | `Pain Control (Experimental)(MP3_320K).mp3` | `Pain Control (Experimental).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1008 | `Pain(MP3_320K).mp3` | `Ac - Pain.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1009 | `Papi Eu Sou Bonita(MP3_320K).mp3` | `Las Bibas From Vizcaya - Papi Eu Sou Bonita.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1010 | `Paradis - Garde Le Pour Toi(MP3_70K).mp3` | `Paradis - Garde le pour toi.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1011 | `Party Funk (Super Slowed)(MP3_320K).mp3` | `Party Funk - Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1012 | `Past Day _ Russian Summer(MP3_320K).mp3` | `Past Day - Russian Summer.mp3` | iTunes | 95.0% | RENAMED |
| 1013 | `Past Day _ Дорога домой(MP3_320K).mp3` | `Past Day - Дорога домой.mp3` | iTunes | 95.0% | RENAMED |
| 1014 | `Past Day _ Ушедшее лето(MP3_320K).mp3` | `Past Day - Ушедшее лето.mp3` | iTunes | 95.0% | RENAMED |
| 1015 | `Pastora Nadir na casa do primo(MP3_320K).mp3` | `Jander Mello - Pastora Nadir na casa do primo.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1016 | `Pater Noster cantato da Benedetto XVI(MP3_320K).mp3` | `ZrinjskiPetar - Pater Noster cantato da Benedetto XVI.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1017 | `Pathetic - dreamcore__ official audio(MP3_320K).mp3` | `Pathetic - dreamcore__ official audio.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1018 | `Patrick Swayze - She_s Like The Wind ft. Wendy Fraser(MP3_70K).mp3` | `Patrick Swayze - She's Like the Wind (feat. Wendy Fraser).mp3` | iTunes | 95.0% | RENAMED |
| 1019 | `Paul Hertzog - Bloodsport - Second day(MP3_320K).mp3` | `Paul Hertzog - Bloodsport - Second day.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1020 | `Paul Hertzog - Flashback Montage(MP3_320K).mp3` | `Paul Hertzog - Flashback Montage.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1021 | `Paul Hertzog - On My Own - Alone(MP3_70K).mp3` | `Paul Hertzog - On My Own – Alone.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1022 | `Paul Hertzog - Triumph(MP3_320K).mp3` | `Paul Hertzog - Triumph.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1023 | `Pax Vobis _ Ego Sum Alpha et Omega - Ensemble Organum(MP3_320K).mp3` | `Pax Vobis _ Ego Sum Alpha et Omega - Ensemble Organum.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1024 | `Peaches _ Herb - Reunited (1978)(MP3_320K).mp3` | `Peaches & Herb - Reunited.mp3` | iTunes | 95.0% | RENAMED |
| 1025 | `Perfect - Carter Tomorrow _ Aiden Hilton [Official Video](MP3_320K).mp3` | `Perfect - Carter Tomorrow _ Aiden Hilton.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1026 | `Perturbator - Venger (feat. Greta Link) 「 AMV 」 Ghost in the Shell(MP3_320K).mp3` | `Perturbator - Venger (feat. Greta Link) 「 AMV 」 Ghost in the Shell.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1027 | `Pet Shop Boys - Being Boring.mp3` | `Pet Shop Boys - Being Boring.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1028 | `Pet Shop Boys - Domino Dancing.mp3` | `Pet Shop Boys - Domino Dancing.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1029 | `Pet Shop Boys - It_s A Sin.mp3` | `Pet Shop Boys - It_s A Sin.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1030 | `Pet Shop Boys - It_s Alright(MP3_320K).mp3` | `Pet Shop Boys - It_s Alright.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1031 | `Pet Shop Boys - Leaving [Official Music Video](MP3_70K).mp3` | `Pet Shop Boys - Leaving.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1032 | `Pet Shop Boys - Love Comes Quickly(MP3_320K).mp3` | `Pet Shop Boys - Love Comes Quickly.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1033 | `Pet Shop Boys - Opportunities (Let_s Make Lots of Money) (Version 2) (HD)(MP3_320K).mp3` | `Pet Shop Boys - Opportunities (Let_s Make Lots of Money) (Version 2).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1034 | `Pet Shop of Horrors  ED Full - Legolgel  Melody.wmv(MP3_320K).mp3` | `Pet Shop of Horrors ED Full - Legolgel Melody.wmv.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1035 | `Pet Shop of horrors Opening Full(MP3_320K).mp3` | `Pet Shop of horrors Opening Full.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1036 | `Petite Météorite_ Past Day _ Ocean Sparks (Slowed and Reverb) _ Russian Post-Punk Mix(MP3_320K).mp3` | `Past Day - Petite Météorite, Past Day — Ocean Sparks (Slowed and Reverb) - Russian Post-Punk Mix.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1037 | `Ph Sheik, Mc Magrinho - PUTARIA NO PIQUE DO ATABAQUE.mp3` | `Ph Sheik, Mc Magrinho - PUTARIA NO PIQUE DO ATABAQUE.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1038 | `Phantom of the Opera - Sierra Boggess _ Ramin Karimloo (Classic BRIT Awards 2012)(MP3_320K).mp3` | `Phantom of the Opera - Sierra Boggess _ Ramin Karimloo (Classic BRIT Awards 2012).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1039 | `Phonkha - HATRED - Slowed.mp3` | `Phonkha - HATRED - Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1040 | `Pipoca Com Sal (Live) - Palhaço Caçarola.m4a` | `Pipoca Com Sal (Live) - Palhaço Caçarola.m4a` | LocalHeuristic | 85.0% | RENAMED |
| 1041 | `Pitty - Máscara.mp3` | `Pitty - Máscara.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1042 | `Pitty - Na Sua Estante (Clipe Oficial)(MP3_320K).mp3` | `Pitty - Na Sua Estante.mp3` | iTunes | 95.0% | RENAMED |
| 1043 | `Playa Hataz(MP3_320K).mp3` | `Three 6 Mafia - Playa Hataz.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1044 | `PlayaPhonk - PHONKY TOWN (Official Audio)(MP3_320K).mp3` | `PlayaPhonk - Phonky Town.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1045 | `Playboi Carti - Goin_ Outta Style (remaster)(MP3_320K).mp3` | `Playboi Carti - Goin_ Outta Style (remaster).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1046 | `Playboi Carti - Miss the rage (slowed   reverb)(MP3_320K).mp3` | `Playboi Carti - Miss the rage (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1047 | `Playboi Carti - bando (prod.ta2cute x yugen)(MP3_320K).mp3` | `Playboi Carti - bando (prod.ta2cute x yugen).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1048 | `Playboi Carti 5AM _ [prod. Adrian]  (slowed   reverb)(MP3_320K).mp3` | `desire - Playboi Carti 5AM ~ [prod. Adrian] (slowed + reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1049 | `Please Stay(MP3_320K).mp3` | `Haunt Me - Please Stay.mp3` | iTunes | 95.0% | RENAMED |
| 1050 | `Pleasure Symbols - Image Reflected(MP3_320K).mp3` | `Pleasure Symbols - Image Reflected.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1051 | `Poison Tree(MP3_320K).mp3` | `Grouper - Poison Tree.mp3` | iTunes | 95.0% | RENAMED |
| 1052 | `Portal do Universo - Chapeleiro_ Samantha Machado ft. Sandrão RZO_ Nego Jam_ Valente(MP3_320K).mp3` | `Portal do Universo - Chapeleiro_ Samantha Machado ft. Sandrão RZO_ Nego Jam_ Valente.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1053 | `Poseidon_s Creation(MP3_320K).mp3` | `Eloy - Poseidon’s Creation.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1054 | `Possession(MP3_320K).mp3` | `PASTEL GHOST - Possession.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1055 | `Post Malone - Congratulations ft. Quavo(MP3_320K).mp3` | `Post Malone - Congratulations (feat. Quavo).mp3` | iTunes | 95.0% | RENAMED |
| 1056 | `Post Malone ft. 21 Savage - rockstar (Official Music Video)(MP3_320K).mp3` | `Post Malone ft. 21 Savage - rockstar.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1057 | `Post Malone_ Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse)(MP3_320K).mp3` | `Post Malone & Swae Lee - Sunflower (Spider-Man - Into the Spider-Verse).mp3` | iTunes | 95.0% | RENAMED |
| 1058 | `Powerwolf - Army of the Night.m4a` | `Powerwolf - Army of the Night.m4a` | iTunes | 95.0% | RENAMED |
| 1059 | `Pra não dizer que não falei das flores - Geraldo V.mp3` | `Pra não dizer que não falei das flores - Geraldo V.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1060 | `Prefab Sprout - When Love Breaks Down(MP3_128K).mp3` | `Prefab Sprout - When Love Breaks Down.mp3` | iTunes | 95.0% | RENAMED |
| 1061 | `Prefacio_ Per omnia secula saeculorum(MP3_320K).mp3` | `Choeur de Chambre de Namur - Prefacio - Per omnia secula saeculorum.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1062 | `Prefazio Solenne del Corpus Domini cantato da Benedetto XVI(MP3_320K).mp3` | `ZrinjskiPetar - Prefazio Solenne del Corpus Domini cantato da Benedetto XVI.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1063 | `Prefazio Solenne del Pentecoste cantato da Benedetto XVI(MP3_320K).mp3` | `ZrinjskiPetar - Prefazio Solenne del Pentecoste cantato da Benedetto XVI.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1064 | `Pretty Hunts - Beyoncé (Lyrics)(MP3_320K).mp3` | `Pretty Hunts - Beyoncé.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1065 | `Probability Alteration and Luck(MP3_320K).mp3` | `Probability Alteration and Luck.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1066 | `ProdZK - CCB Hino 411 - O vitupério de Jesus (slowed + reverb + 432Hz).mp3` | `ProdZK - CCB Hino 411 - O vitupério de Jesus (slowed + reverb + 432Hz).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1067 | `Psychalgia - Cold Alienation (Instrumental Demo)(MP3_320K).mp3` | `Psychalgia - Cold Alienation (Instrumental Demo).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1068 | `Psychedelic Goa trance.mp3` | `FTN86 - Psychedelic Goa trance.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1069 | `Psytrance 2015 - Trancentral_s Magic Moments ___.mp3` | `Psytrance 2015 - Trancentral_s Magic Moments.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1070 | `Pullovers - Tudo Que Eu Sempre Sonhei(MP3_320K).mp3` | `Pullovers - Tudo Que Eu Sempre Sonhei.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1071 | `Pump (Slowed)(MP3_320K).mp3` | `T I H H & Dj tahh - Pump (Slowed).mp3` | iTunes | 95.0% | RENAMED |
| 1072 | `Punjab _ Karunesh(MP3_70K).mp3` | `Punjab - Karunesh.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1073 | `Pústulas Do Leprosário(MP3_320K).mp3` | `Lamúria Abissal - Pústulas Do Leprosário.mp3` | iTunes | 95.0% | RENAMED |
| 1074 | `Q Lazzarus - Goodbye Horses (7__ Version) _Remastered Audio_(MP3_320K).mp3` | `Q Lazzarus - Goodbye Horses (7__ Version) _Remastered Audio.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1075 | `Quase Jr(MP3_320K).mp3` | `Não Ao Futebol Moderno - Quase Jr..mp3` | MusicBrainz | 92.0% | RENAMED |
| 1076 | `Que Pais E Este CD 1 TRACK 1.mp3` | `Legião Urbana - Que pais é este.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1077 | `Queen - The Show Must Go On (Official Video).mp3` | `Queen - The Show Must Go On.mp3` | iTunes | 95.0% | RENAMED |
| 1078 | `Queen – Bohemian Rhapsody (Official Video Remastered)(MP3_320K).mp3` | `Queen - Queen – Bohemian Rhapsody (Official Video Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1079 | `Quest - Finestra atmosferica(MP3_320K).mp3` | `Quest - Finestra atmosferica.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1080 | `Quest for the Illuminated Marsh(MP3_320K).mp3` | `DIM - Quest for the Illuminated Marsh.mp3` | iTunes | 95.0% | RENAMED |
| 1081 | `Quod Sumus Hoc Eritis(MP3_320K).mp3` | `Lamúria Abissal - Quod Sumus Hoc Eritis.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1082 | `R.A.W. - Unbe (Erick More Mix).mp3` | `R.A.W. - Unbe (Erick 'More' Mix).mp3` | iTunes | 95.0% | RENAMED |
| 1083 | `RANDOM SHADOW - El Paso Del Gigante ( Rebajada Slowed ).mp3` | `RANDOM SHADOW - El Paso Del Gigante ( Rebajada Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1084 | `RECADO IMPORTANTE_ ISSO É SÉRIO ⚠️(MP3_320K).mp3` | `RECADO IMPORTANTE, ISSO É SÉRIO ⚠.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1085 | `ROTTING CHRIST-For A Voice Like Thunder-(Official.mp3` | `Rotting Christ TV - ROTTING CHRIST-For A Voice Like Thunder.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1086 | `RXDXVIL_ DJ FKU _MTG - CYBERFUNK TOMA_(MP3_320K).mp3` | `RXDXVIL_ DJ FKU _MTG - CYBERFUNK TOMA.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1087 | `Radio(MP3_70K)_1.mp3` | `Radio.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1088 | `Radiohead - Climbing Up the Walls.mp3` | `Radiohead - Climbing Up the Walls.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1089 | `Rafael Mordente - Capetanás (Quimera).mp3` | `Rafael Mordente - Capetanás (Quimera).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1090 | `Rafael Mordente - Coliseu (Quimera).mp3` | `Rafael Mordente - Coliseu (Quimera).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1091 | `Raul seixas- Metamorfose ambulante.mp3` | `lehbianchi2010 - Raul seixas- Metamorfose ambulante.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1092 | `Raça Negra - Quando Te Encontrei (Raça Negra_ Vol. 4) [Áudio Oficial](MP3_320K).mp3` | `Raça Negra - Quando Te Encontrei (Raça Negra_ Vol. 4) [Áudio Oficial].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1093 | `Real Life - Send Me An Angel _89.mp3` | `Real Life - Send Me an Angel ’89.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1094 | `Reality Check(MP3_320K).mp3` | `Swae Lee - Reality Check.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1095 | `Regain Masculinity v3 Calm(MP3_320K).mp3` | `FK Subs - Regain Masculinity v3 Calm.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1096 | `Release the Kraken(MP3_320K).mp3` | `The Daysleepers - Release the Kraken.mp3` | iTunes | 95.0% | RENAMED |
| 1097 | `Remember That Song (Original Version) - F.L.K (UK) Original Music Name_ Destructoid - MK2(MP3_320K).mp3` | `Remember That Song (Original Version) - F.L.K (UK) Original Music Name_ Destructoid - MK2.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1098 | `Revelação_Velocidade da luz(MP3_320K).mp3` | `souandre - Revelação -Velocidade da luz.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1099 | `Rider of Death - Shinnobu - Deus Misere.mp3` | `Rider of Death - Shinnobu - Deus Misere.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1100 | `Right Here Waiting(MP3_320K).mp3` | `Richard Marx - Right Here Waiting.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1101 | `Righteous Brothers - Unchained Melody [Live - Best Quality] (1965)(MP3_70K).mp3` | `Righteous Brothers - Unchained Melody [Live - Best Quality].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1102 | `Rihanna - American Oxygen.mp3` | `Rihanna - American Oxygen.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1103 | `Rihanna - Diamonds(MP3_128K).mp3` | `Rihanna - Diamonds.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1104 | `Rihanna - Rude Boy(MP3_128K).mp3` | `Rihanna - Rude Boy.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1105 | `Rihanna - Stay ft. Mikky Ekko(MP3_320K).mp3` | `Rihanna - Stay (feat. Mikky Ekko).mp3` | iTunes | 95.0% | RENAMED |
| 1106 | `Rihanna - What_s My Name_ ft. Drake(MP3_320K).mp3` | `Rihanna - What_s My Name_ ft. Drake.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1107 | `Rihanna, Calvin Harris - We Found Love.mp3` | `Rihanna, Calvin Harris - We Found Love.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1108 | `Rir Para Não Chorar(MP3_320K).mp3` | `Lamúria Abissal - Rir Para Não Chorar.mp3` | iTunes | 95.0% | RENAMED |
| 1109 | `Rita Lee - Caso Sério.mp3` | `Rita Lee - Caso sério.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1110 | `Rob Dougan - Clubbed to Death - Kurayamino Variation.mp3` | `Rob Dougan - Clubbed to Death - Kurayamino Variation.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1111 | `RobergeVideo - Virgem - Marina Lima - Versão original 1987.mp3` | `RobergeVideo - Virgem - Marina Lima - Versão original 1987.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1112 | `Roberta Flack - Killing Me Softly(MP3_320K).mp3` | `Roberta Flack - Killing Me Softly.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1113 | `Roberto Carlos_O progresso.mp3` | `carlenebrasil - Roberto Carlos_O progresso.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1114 | `Robin S - Show Me Love (Official Music Video) [1993](MP3_320K).mp3` | `Robin S - Show Me Love [1993].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1115 | `Roller Derby Band - Roller Derby - Last Night (Official Video).mp3` | `Roller Derby Band - Roller Derby - Last Night.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1116 | `Rollercoaster(MP3_320K).mp3` | `Rollercoaster.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1117 | `Roman Holiday(MP3_320K).mp3` | `Nicki Minaj - Roman Holiday.mp3` | iTunes | 95.0% | RENAMED |
| 1118 | `Romerium - Topic - Sequence-Seven.mp3` | `Romerium - Sequence-Seven.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1119 | `Rory Ryan - Keeping My Mind Quiet (Lyric Video)(MP3_320K).mp3` | `Rory Ryan - Keeping My Mind Quiet.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1120 | `Rukia Kuchiki X U Weren_t Here I Really Miss You(MP3_320K).mp3` | `Lits - Rukia Kuchiki X U Weren't Here I Really Miss You.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1121 | `Running(MP3_320K).mp3` | `Information Society - Running.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1122 | `Russ - Ain_t Goin Back_(Lyrics)(MP3_320K).mp3` | `Russ - Ain_t Goin Back.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1123 | `Röyksopp - What Else Is There _(MP3_320K).mp3` | `Röyksopp - What Else Is There.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1124 | `S0N6F0RMYD34TH (Ultra Slowed)(MP3_320K).mp3` | `S0N6F0RMYD34TH - Ultra Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1125 | `SAPFIR - NO MERCY.mp3` | `SAPFIR - NO MERCY.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1126 | `SAY3AM - JUDAS (SLOWED TO PERFECTION)(MP3_320K).mp3` | `SAY3AM - JUDAS (SLOWED TO PERFECTION).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1127 | `SAYGRACE, G-Eazy - You Dont Own Me (feat. G-Eazy).mp3` | `SAYGRACE - You Don't Own Me (feat. G-Eazy) [Candyland Remix].mp3` | iTunes | 95.0% | RENAMED |
| 1128 | `SE QUISER PREFERÊNCIA BOTA O ANEL _ EU TÔ OFF PRO AMOR - MC VIGARISTA (DJ GRAFXP) Club Dz7(MP3_320K).mp3` | `SE QUISER PREFERÊNCIA BOTA O ANEL _ EU TÔ OFF PRO AMOR - MC VIGARISTA (DJ GRAFXP) Club Dz7.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1129 | `SE TU NÃO QUER_ PASSA A VEZ - MC DELUX (DJ Guih Da ZO) Club Dz7(MP3_320K).mp3` | `SE TU NÃO QUER_ PASSA A VEZ - MC DELUX (DJ Guih Da ZO) Club Dz7.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1130 | `SEDUCENTSTALLION - SEDUCENTSTALLION - Morning Shine (Slowed & Reverb).mp3` | `SEDUCENTSTALLION - SEDUCENTSTALLION - Morning Shine (Slowed & Reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1131 | `SEEK PHONK (Super Slowed)(MP3_320K).mp3` | `SEEK PHONK - Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1132 | `SENSEI_ Razihel x Sadfriendd (Rukia)(MP3_320K).mp3` | `R U K I A - SENSEI! Razihel x Sadfriendd (Rukia).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1133 | `SET 5K_(MP3_320K).mp3` | `DJ Nexus8 - SET 5K!.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1134 | `SEXY_VIP(MP3_320K).mp3` | `Yaego - Sexy - Vip.mp3` | iTunes | 95.0% | RENAMED |
| 1135 | `SHE SO SEXY(MP3_160K).mp3` | `LVTE BLOOMER - SHE SO SEXY.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1136 | `SHINNOBU • Buried in Your Past(MP3_320K).mp3` | `Shinnobu - Buried in Your Past.mp3` | iTunes | 95.0% | RENAMED |
| 1137 | `SHINNOBU • Kissing The Moon(MP3_320K).mp3` | `REVVAT - SHINNOBU • Kissing The Moon.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1138 | `SNAP_ - The Power (Official Video)(MP3_320K).mp3` | `Snap! - The Power.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1139 | `SNJ - Pensamentos (Clássico)(MP3_320K).mp3` | `SNJ - Pensamentos (Clássico).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1140 | `SPACYBOI - Last Memory (2023)(MP3_320K).mp3` | `Spacyboi - Last Memory.mp3` | iTunes | 95.0% | RENAMED |
| 1141 | `SRB - Pianofuck(MP3_320K).mp3` | `SRB - Pianofuck.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1142 | `STAKILLAZ - я не счастлив.mp3` | `STAKILLAZ - я не счастлив.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1143 | `STAYIN DINE(MP3_320K).mp3` | `JUNTMANE - STAYIN DINE.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1144 | `SUKA. - Sayfalse, Junior RCE - FUNK MI CAMINO.mp3` | `SUKA. - Sayfalse, Junior RCE - FUNK MI CAMINO.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1145 | `SUPERDROL - Advanced Audio Doping(M4A_128K).m4a.m4a` | `SUPERDROL - Advanced Audio Doping(M4A_128K).m4a.m4a` | LocalHeuristic | 85.0% | RENAMED |
| 1146 | `SWAMPHEAD x Yung Oni - SheWannaGet2KnowMe(MP3_320K).mp3` | `SWAMPHEAD x Yung Oni - SheWannaGet2KnowMe.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1147 | `SWAMPHEAD x Yung Oni - SheWannaGet2KnowMe(MP3_320K)_1.mp3` | `SWAMPHEAD x Yung Oni - SheWannaGet2KnowMe_1.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1148 | `SYMBIOTE (SLOWED)(MP3_320K).mp3` | `SYMBIOTE - SLOWED.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1149 | `Saba Lou - Good Habits (and Bad).mp3` | `Saba Lou - Good Habits (and Bad).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1150 | `Sacred Technology - Sonic Species & Imagine Mars - Fly Machine - Official.mp3` | `Sacred Technology - Sonic Species & Imagine Mars - Fly Machine.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1151 | `Sad Movies(MP3_320K).mp3` | `Still Corners - Sad Movies.mp3` | iTunes | 95.0% | RENAMED |
| 1152 | `Sadeness_ Pt. 1. (Atmospheric Choral Version)(MP3_320K).mp3` | `Cynosure - Sadeness, Pt. 1. (Atmospheric Choral Version).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1153 | `SahBabii - Giraffes _ Elephants (Official Art Track)(MP3_320K).mp3` | `SahBabii - Giraffes _ Elephants (Official Art Track).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1154 | `Saia(MP3_320K).mp3` | `Não ao Futebol Moderno - Saia.mp3` | iTunes | 95.0% | RENAMED |
| 1155 | `Sakasama no Chou by SNoW (with lyrics eng lyrics)(MP3_320K).mp3` | `Sakasama no Chou by SNoW (with lyrics+eng lyrics).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1156 | `San Francisco - Scott McKenzie.mp3` | `San Francisco - Scott McKenzie.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1157 | `Sand and Mercury(MP3_320K).mp3` | `Sand and Mercury.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1158 | `Sandra - Secret Land (NG Remix)(MP3_320K).mp3` | `Sandra - Secret Land (NG Remix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1159 | `Sandrão DJ - Antony Well - At Night.mp3` | `Sandrão DJ - Antony Well - At Night.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1160 | `Sapão feat. Mc Guimê e Mr Catra - Rei do Baile (Clipe Oficial)(MP3_70K).mp3` | `Sapão feat. Mc Guimê e Mr Catra - Rei do Baile.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1161 | `Satisfaction (Slowed)(MP3_320K).mp3` | `DJ TAIYO - Satisfaction (Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1162 | `Satisfaction (Speed Up)(MP3_320K).mp3` | `DJ TAIYO - Satisfaction (Speed Up).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1163 | `Satisfaction(MP3_320K).mp3` | `DJ TAIYO - Satisfaction.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1164 | `Saturnine(MP3_320K).mp3` | `Mystery Jets - Saturnine.mp3` | iTunes | 90.0% | RENAMED |
| 1165 | `Saviour of the Soul(MP3_320K).mp3` | `Daniel Savio - Saviour of the Soul.mp3` | iTunes | 90.0% | RENAMED |
| 1166 | `Scorpions - Still Loving You.mp3` | `Scorpions - Still Loving You.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1167 | `Scourge of Iron(MP3_320K).mp3` | `Scourge of Iron.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1168 | `Scythermane, NXGHT! - NUNCA MUDA? - Edit Slowed.mp3` | `Scythermane, NXGHT! & MC Fabinho da Osk - NUNCA MUDA (Edit Slowed).mp3` | iTunes | 95.0% | RENAMED |
| 1169 | `Se Essa Noite Eu Morrer(MP3_70K).mp3` | `Se Essa Noite Eu Morrer.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1170 | `Seja foda_ -Audio Book- por Caio Carneiro(M4A_128K).m4a.m4a` | `DHuMaN - Seja foda! -Audio Book- por Caio Carneiro.m4a` | LocalHeuristic | 85.0% | RENAMED |
| 1171 | `Sem Prévio Aviso(MP3_320K).mp3` | `Lamúria Abissal - Sem Prévio Aviso.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1172 | `Sempre Livre - Eu sou free (Áudio HQ).mp3` | `Sempre Livre - Eu sou free (Áudio).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1173 | `Seneca Said(MP3_320K).mp3` | `Late Arcane - Seneca Said.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1174 | `Sepultura - Roots Bloody Roots [OFFICIAL VIDEO].mp3` | `Sepultura - Roots Bloody Roots.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1175 | `Serial Experiments Lain - Duvet Extended(MP3_320K).mp3` | `Serial Experiments Lain - Duvet Extended.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1176 | `Set Fire To The Rain x Another Love - PT_EN(MP3_320K).mp3` | `Set Fire To The Rain x Another Love - PT_EN.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1177 | `Seu Som e Uma Porcaria mc Loirinha(MP3_320K).mp3` | `Seu Som e Uma Porcaria mc Loirinha.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1178 | `Seven Year Storm_Meditation And Training - David Michael Frank - Hard To Kill(MP3_160K).mp3` | `Seven Year Storm_Meditation And Training - David Michael Frank - Hard To Kill.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1179 | `Sewerslvt - Existing Everywhere.mp3` | `Sewerslvt - Existing Everywhere.mp3` | iTunes | 95.0% | RENAMED |
| 1180 | `Sewerslvt - Pretty Cvnt.mp3` | `Sewerslvt - Pretty Cvnt.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1181 | `Sewerslvt - Was It Weird I Listened To Im God By Clams Casino_s When I Lost My Virginity (reupload)(MP3_320K).mp3` | `Sewerslvt - Was It Weird I Listened To Im God By Clams Casino_s When I Lost My Virginity (reupload).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1182 | `Sewerslvt - the last thing she sent me.mp3` | `Sewerslvt - the last thing she sent me.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1183 | `Shadow Lady(MP3_320K).mp3` | `Portwave - Shadow Lady.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1184 | `She Past Away - Disko Anksiyete (Official Audio)(MP3_320K).mp3` | `She Past Away - Disko Anksiyete.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1185 | `She Past Away - Durdu Dünya (Official Audio)(MP3_320K).mp3` | `She Past Away - Durdu Dünya.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1186 | `She Past Away - Yükseliyor Deniz (Official Audio)(MP3_320K).mp3` | `She Past Away - Yükseliyor Deniz.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1187 | `Sherine - Kalam Eneih.mp3` | `Sherine - Kalam Eneih.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1188 | `Shina No Yoru   Misora Hibari.mp3` | `Tia Tanaka - Shina No Yoru Misora Hibari.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1189 | `Shinnobu - After Of My Life (Original Song)(MP3_70K).mp3` | `Shinnobu - After Of My Life (Original Song).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1190 | `Shinnobu - Forever With You(MP3_320K).mp3` | `Shinnobu - Forever With You.mp3` | iTunes | 95.0% | RENAMED |
| 1191 | `Shinnobu - Tears Of Sadness (Memories of Enigma)(MP3_320K).mp3` | `Shinnobu - Tears Of Sadness (Memories of Enigma).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1192 | `Shinnobu - Topic - Gods Of Love.mp3` | `Shinnobu - Gods Of Love.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1193 | `Shinnobu - Topic - Mirages.mp3` | `Shinnobu - Mirages.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1194 | `Shinnobu - Topic - 只有透過愛.mp3` | `Shinnobu - 只有透過愛.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1195 | `Shinnobu Videos - Entsu - Deus Misere Shinnobu.mp3` | `Shinnobu Videos - Entsu - Deus Misere Shinnobu.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1196 | `Shinnobu, Ⲉntsury - Wait for Me.mp3` | `Shinnobu, Ⲉntsury - Wait for Me.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1197 | `Shook.mp16 - The Everly Brothers - All I have to do is dream (slowed down).mp3` | `Shook.mp16 - The Everly Brothers - All I have to do is dream (slowed down).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1198 | `Shot to Pieces(MP3_320K).mp3` | `Shot to Pieces.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1199 | `Sia - Cheap Thrills (Official Lyric Video) ft. Sean Paul(MP3_320K).mp3` | `Sia - Cheap Thrills (Official Lyric Video) ft. Sean Paul.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1200 | `Sidewise - This Time [HD](MP3_320K).mp3` | `Sidewise - This Time.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1201 | `Sigur Rós - Untitled #9 - Smáskifa 1.mp3` | `Sigur Rós - Untitled #9 (Smáskífa 1).mp3` | iTunes | 95.0% | RENAMED |
| 1202 | `Silence Must Be Heard(MP3_320K).mp3` | `Silence Must Be Heard.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1203 | `Silver Richards - Nervous(MP3_320K).mp3` | `Silver Richards - Nervous.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1204 | `Silver Richards - Sunset(MP3_320K).mp3` | `Silver Richards - Sunset.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1205 | `Simon _ Garfunkel - The Boxer (Audio).mp3` | `Simon & Garfunkel - The Boxer.mp3` | iTunes | 95.0% | RENAMED |
| 1206 | `Simple Minds - Alive And Kicking(MP3_128K).mp3` | `Simple Minds - Alive And Kicking.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1207 | `Simple Minds - Don_t You (Forget About Me)(MP3_128K).mp3` | `Simple Minds - Don_t You (Forget About Me).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1208 | `Sinéad O_Connor - Nothing Compares 2U _ Nada Se Compara A Você  (Portuguese Subtitles)(MP3_320K).mp3` | `Sinéad O_Connor - Nothing Compares 2U _ Nada Se Compara A Você (Portuguese Subtitles).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1209 | `Siouxsie And The Banshees  - Spellbound.mp3` | `Siouxsie and the Banshees - Spellbound.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1210 | `Siouxsie And The Banshees - Candyman.mp3` | `Siouxsie and The Banshees - Candyman.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1211 | `Siouxsie And The Banshees - Cities In Dust.mp3` | `Siouxsie And The Banshees - Cities In Dust.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1212 | `Siouxsie And The Banshees - Dear Prudence.mp3` | `Siouxsie & The Banshees - Dear Prudence.mp3` | iTunes | 95.0% | RENAMED |
| 1213 | `Siouxsie And The Banshees - _Dazzle_.mp3` | `Siouxsie And The Banshees - Dazzle.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1214 | `Siouxsie _ the Banshees - Kiss Them for Me [480p).mp3` | `Siouxsie _ the Banshees - Kiss Them for Me [480p].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1215 | `Siouxsie and the Banshees - Arabian Knights.mp3` | `Siouxsie and the Banshees - Arabian Knights.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1216 | `Siouxsie and the Banshees - Forever.mp3` | `Siouxsie and the Banshees - Forever.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1217 | `Siouxsie and the Banshees - Israel.mp3` | `Siouxsie & The Banshees - Israel.mp3` | iTunes | 95.0% | RENAMED |
| 1218 | `Siouxsie and the Banshees She_s a Carnival.mp3` | `Leeynnad - Siouxsie and the Banshees She's a Carnival.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1219 | `Slomo(MP3_320K).mp3` | `Slowdive - Slomo.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1220 | `Slowdive - Alison (Video)(MP3_320K).mp3` | `Slowdive - Alison (Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1221 | `Slowdive - Avalyn 1 _ 2(MP3_320K).mp3` | `Slowdive - Avalyn 1 _ 2.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1222 | `Slowdive - Bleed(MP3_320K).mp3` | `Slowdive - Bleed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1223 | `Slowdive - Dagger (electric)(MP3_320K).mp3` | `Slowdive - Dagger (electric).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1224 | `Slowdive - Dagger(MP3_320K).mp3` | `Slowdive - Dagger.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1225 | `Slowdive - Demos(MP3_320K).mp3` | `Slowdive - Demos.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1226 | `Slowdive - Facto (Pygmalion Demo) (Noise Reduction)(MP3_320K).mp3` | `Slowdive - Facto (Pygmalion Demo) (Noise Reduction).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1227 | `Slowdive - Hide Your Eyes (Demo Re-equalized)(MP3_320K).mp3` | `Slowdive - Hide Your Eyes (Demo Re-equalized).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1228 | `Slowdive - Hide yer eyes alternative (slowed   reverb)(MP3_320K).mp3` | `Slowdive - Hide yer eyes alternative (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1229 | `Slowdive - I Believe(MP3_320K).mp3` | `Slowdive - I Believe.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1230 | `Slowdive - Jazz Odeon (NOT _SONG 1_)(MP3_320K).mp3` | `Slowdive - Jazz Odeon (NOT _SONG 1).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1231 | `Slowdive - Like Up(MP3_128K).mp3` | `Slowdive - Like Up.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1232 | `Slowdive - Money(MP3_320K).mp3` | `Slowdive - Money.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1233 | `Slowdive - No Longer Making Time(MP3_320K).mp3` | `Slowdive - No Longer Making Time.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1234 | `Slowdive - On The Horizon(MP3_320K).mp3` | `Slowdive - On the Horizon.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1235 | `Slowdive - Shine (Video)(MP3_320K).mp3` | `Slowdive - Shine (Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1236 | `Slowdive - Sleep(MP3_320K).mp3` | `Slowdive - Sleep.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1237 | `Slowdive - Summer Day(MP3_320K).mp3` | `Slowdive - Summer Day.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1238 | `Slowdive - Unreleased Songs [collection of demos](MP3_320K).mp3` | `Slowdive - Unreleased Songs [collection of demos].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1239 | `Slowdive - When The Sun Hits (Demo)(MP3_320K).mp3` | `Slowdive - When the Sun Hits (demo).mp3` | MusicBrainz | 92.0% | RENAMED |
| 1240 | `Slowdive – 40 Days (Demo) (2020 Remastered)(MP3_320K).mp3` | `No one's land - Slowdive – 40 Days (Demo) (2020 Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1241 | `Slowdive – I Saw the Sun (2020 Remastered)(MP3_320K).mp3` | `No one's land - Slowdive – I Saw the Sun (2020 Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1242 | `Slowdive – I Thought I Saw (2020 Remastered)(MP3_320K).mp3` | `No one's land - Slowdive – I Thought I Saw (2020 Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1243 | `Slowdive – Instrumental Take One (2020 Remastered)(MP3_320K).mp3` | `No one's land - Slowdive – Instrumental Take One (2020 Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1244 | `Slowdive – Joy (2020 Remastered)(MP3_320K).mp3` | `No one's land - Slowdive – Joy (2020 Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1245 | `Slowdive – Joy (Drum Machine Demo) (2020 Remastered)(MP3_320K).mp3` | `No one's land - Slowdive – Joy (Drum Machine Demo) (2020 Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1246 | `Slowdive – One Hundred Times (2020 Remastered)(MP3_320K).mp3` | `No one's land - Slowdive – One Hundred Times (2020 Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1247 | `Slowdive – Richard (2021 Remastered)(MP3_320K).mp3` | `No one's land - Slowdive – Richard (2021 Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1248 | `Slowdive – Silver Screen (2020 Remastered)(MP3_320K).mp3` | `No one's land - Slowdive – Silver Screen (2020 Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1249 | `Slowdive – Song _1 (2020 Remastered)(MP3_320K).mp3` | `No one's land - Slowdive – Song #1 (2020 Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1250 | `Slowdive – Stars That Shine (2020 Remastered)(MP3_320K).mp3` | `No one's land - Slowdive – Stars That Shine (2020 Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1251 | `Smile_-Vitas-Songs of My Mother_Russian_English subs(MP3_70K).mp3` | `Витас - Smile!-Vitas-Songs of My Mother_Russian&English subs.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1252 | `Smith Connection - Topic - Under My Wings.mp3` | `Smith Connection - Under My Wings.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1253 | `Smoke Dat Weed(MP3_320K).mp3` | `Roland Jones - Smoke Dat Weed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1254 | `Smokin_ Love(MP3_320K).mp3` | `Stick Figure - Smokin' Love.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1255 | `SnapTube Audio - Daisy daisy... daisy daisydaisy 1600 sla traduçõesaesthetics musicasemingles tradução doce fyp fyyyyy fy(MP3).mp3` | `SnapTube Audio - Daisy daisy... daisy daisydaisy 1600 sla traduçõesaesthetics musicasemingles tradução doce fyp fyyyyy fy(MP3).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1256 | `SnapTube Audio - Spotify playlist in my bio viral lyrics trending speedsongs slowedsongs fyp song foryou dreamoin 0(MP3).mp3` | `SnapTube Audio - Spotify playlist in my bio viral lyrics trending speedsongs slowedsongs fyp song foryou dreamoin 0(MP3).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1257 | `SnapTube Audio - update. y2k 2000s frutigeraero nostalgia genxsoftclub(MP3).aac` | `SnapTube Audio - update. y2k 2000s frutigeraero nostalgia genxsoftclub(MP3).aac` | LocalHeuristic | 85.0% | RENAMED |
| 1258 | `Sobre Cair de Bicicleta(MP3_320K).mp3` | `Adorável Clichê - Sobre Cair de Bicicleta.mp3` | iTunes | 95.0% | RENAMED |
| 1259 | `Sophie Woodhouse ♡ - Sophie Woodhouse - Rosewater (Official Lyric Video ).mp3` | `Sophie Woodhouse ♡ - Sophie Woodhouse - Rosewater (Official Lyric Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1260 | `Sou Gay(M4A_128K).m4a.m4a` | `Sou Gay.m4a` | LocalHeuristic | 50.0% | RENAMED |
| 1261 | `Sou um milagre - Voz da Verdade(MP3_320K).mp3` | `Voz da Verdade - Sou um Milagre.mp3` | iTunes | 95.0% | RENAMED |
| 1262 | `SouldjahFromTheNorth - 187 Family - Drinking (1996).mp3` | `SouldjahFromTheNorth - 187 Family - Drinking.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1263 | `SouldjahFromTheNorth - Children Of The Corn - Droppin Bustaz By The Packs (1996).mp3` | `SouldjahFromTheNorth - Children Of The Corn - Droppin Bustaz By The Packs.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1264 | `SouldjahFromTheNorth - DJ Squeeky - Orange Mound Veteran.mp3` | `SouldjahFromTheNorth - DJ Squeeky - Orange Mound Veteran.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1265 | `SouldjahFromTheNorth - Eightball & MJG - Gots To Be Real (Rare Classic).mp3` | `SouldjahFromTheNorth - Eightball & MJG - Gots To Be Real (Rare Classic).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1266 | `SouldjahFromTheNorth - Tom Skee Mask - Niggas Watch Your Back (1994).mp3` | `SouldjahFromTheNorth - Tom Skee Mask - Niggas Watch Your Back.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1267 | `Souvlaki Space Station(MP3_320K).mp3` | `Slowdive - Souvlaki Space Station.mp3` | iTunes | 95.0% | RENAMED |
| 1268 | `Soviet Soviet - Change with the sun (Official Video)(MP3_320K).mp3` | `Soviet Soviet - Change with the Sun.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1269 | `Soviet Soviet - _No Lesson_(MP3_160K).mp3` | `Soviet Soviet - No Lesson.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1270 | `Sport Plus - vcr-classique - dancing.mp3` | `Sport Plus - vcr-classique - dancing.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1271 | `Stamina(MP3_320K).mp3` | `Bestrack - Stamina.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1272 | `Starship - Sara(MP3_128K).mp3` | `Starship - Sara.mp3` | iTunes | 95.0% | RENAMED |
| 1273 | `Stay in Head(MP3_320K).mp3` | `Epure Oleandru - Stay in Head.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1274 | `Stem Cells and Scar Tissue Removal(MP3_320K).mp3` | `Stem Cells and Scar Tissue Removal.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1275 | `Sterling Angel - Reach(MP3_320K).mp3` | `Sterling Angel - Reach.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1276 | `Stick Figure – _Above the Storm_ (Official Music Video)(MP3_320K).mp3` | `Stick Figure - Stick Figure – ''Above the Storm''.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1277 | `Still Corners - Slow Air - full album (2018)(MP3_160K).mp3` | `Still Corners - Slow Air - full album.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1278 | `Still Corners - The Message (OFFICIAL VIDEO)(MP3_320K).mp3` | `Still Corners - The Message.mp3` | iTunes | 95.0% | RENAMED |
| 1279 | `Still Corners - The Trip(MP3_320K).mp3` | `Still Corners - The Trip.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1280 | `Sting - Englishman In New York(MP3_128K).mp3` | `Sting - Englishman In New York.mp3` | iTunes | 95.0% | RENAMED |
| 1281 | `Sting - Fragile.mp3` | `Sting - Fragile.mp3` | iTunes | 95.0% | RENAMED |
| 1282 | `Stive Morgan - The Master Of Souls(MP3_320K).mp3` | `Stive Morgan - The Master Of Souls.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1283 | `Stomach Shrinking and Toning (Psychic_Morphic programmed audio)(MP3_320K).mp3` | `Stomach Shrinking and Toning (Psychic - Morphic programmed audio).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1284 | `Stop Procrastinating Energy Frequency- Supercharge your Willpower_(MP3_320K).mp3` | `Stop Procrastinating Energy Frequency- Supercharge your Willpower!.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1285 | `Strange Machines(MP3_320K).mp3` | `Strange Machines.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1286 | `Stromae - Papaoutai (Official Music Video)(MP3_70K).mp3` | `Stromae - Papaoutai.mp3` | iTunes | 95.0% | RENAMED |
| 1287 | `SubMorphic Inc. - Stomach Toning Protocol (Unisex) - Morphic Field.mp3` | `SubMorphic Inc. - Stomach Toning Protocol (Unisex) - Morphic Field.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1288 | `Subconscious Limits (Removal) Ver 2.0 (Energy Programmed)(MP3_320K).mp3` | `Subconscious Limits (Removal) Ver 2.0 (Energy Programmed).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1289 | `Subconsciousness Beliefs Clearing _ Energetically Programmed Audio(MP3_320K).mp3` | `Subconsciousness Beliefs Clearing - Energetically Programmed Audio.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1290 | `Suisside - My Last Days ft. Lil Peep (Edit)(MP3_320K).mp3` | `Suisside - My Last Days ft. Lil Peep (Edit).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1291 | `Sultans of Swing - Dire Straits [Remastered](MP3_320K).mp3` | `Sultans of Swing - Dire Straits [Remastered].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1292 | `Summer Eletrohits VOL. 3 [ 2006 ](MP3_70K).mp3` | `Summer Eletrohits VOL. 3 [ 2006].mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1293 | `Summer Jam (Radio Edit)(MP3_320K).mp3` | `The Underdog Project - Summer Jam (Radio Edit).mp3` | iTunes | 95.0% | RENAMED |
| 1294 | `Summer Jam (Radio Edit)(MP3_320K)_1.mp3` | `The Underdog Project - Summer Jam (Radio Edit).mp3` | iTunes | 95.0% | RENAMED |
| 1295 | `Summer Love [Official Music Video](MP3_320K).mp3` | `Justin Timberlake - Summer Love.mp3` | iTunes | 90.0% | RENAMED |
| 1296 | `Superheaven - _Youngest Daughter_ (Official Visualizer)(MP3_320K).mp3` | `Superheaven - Youngest Daughter_ (Official Visualizer).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1297 | `Superhuman Genius (Energetically Programmed)(MP3_320K).mp3` | `Superhuman Genius (Energetically Programmed).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1298 | `Surf Curse - Freaks (Doomer)(MP3_320K).mp3` | `Surf Curse - Freaks (Doomer).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1299 | `Swiss Portrait - Swiss Portrait - Find My Way.mp3` | `Swiss Portrait - Swiss Portrait - Find My Way.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1300 | `SymphoCat - Long Whale Song.mp3` | `SymphoCat - Long Whale Song.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1301 | `Symphonix_ Interactive Noise - Instant Moment (Extended Version) - Official(MP3_320K).mp3` | `Symphonix & Interactive Noise - Instant Moment (Extended Version).mp3` | iTunes | 95.0% | RENAMED |
| 1302 | `T0TALREIGN(MP3_320K).mp3` | `XEOE - T0TALREIGN.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1303 | `TAKTSTÖRER - 141 Schneeschieber - Slowed Version.mp3` | `TAKTSTÖRER - 141 Schneeschieber - Slowed Version.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1304 | `TASH SULTANA - JUNGLE (LIVE BEDROOM RECORDING)(MP3_320K).mp3` | `TASH SULTANA - JUNGLE (LIVE BEDROOM RECORDING).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1305 | `TENGGER CAVALRY - Electric Shaman (Official Video).mp3` | `Tengger Cavalry - Electric Shaman.mp3` | iTunes | 95.0% | RENAMED |
| 1306 | `TENNESSEE(MP3_320K).mp3` | `valtis - TENNESSEE.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1307 | `TH Express - I_m On Your Side (Factory Team Remix)(MP3_320K).mp3` | `T.H. Express - (I'm) On Your Side [Factory Team Edit].mp3` | iTunes | 95.0% | RENAMED |
| 1308 | `THE ARCHIES - SUGAR SUGAR(MP3_320K).mp3` | `The Archies - Sugar Sugar.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1309 | `THE GATHERING - How To Measure A Planet_ (full track)(MP3_320K).mp3` | `THE GATHERING - How To Measure A Planet_ (full track).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1310 | `THE PACHEC - PROSTIBUILDER. PLAYLIST COMPLETA(MP3_320K).mp3` | `THE PACHEC - PROSTIBUILDER. PLAYLIST COMPLETA.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1311 | `TOMA VUKADÃO Slowed Reverb(MP3_320K).mp3` | `PatoQuack - TOMA VUKADÃO Slowed+Reverb.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1312 | `TONY SHHNOW - KILLAMANJARO [OFFICIAL VIDEO](MP3_320K).mp3` | `Tony Shhnow - Killamanjaro.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1313 | `TONY SHHNOW - WHY U MAD [OFFICIAL VIDEO](MP3_320K).mp3` | `Tony Shhnow - Why U Mad.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1314 | `TRESMOB Prod. - CÉREBRO PLÁSTICO \| VAPORWAVE \| PROD. TRESMOB \|.mp3` | `TRESMOB Prod. - CÉREBRO PLÁSTICO - VAPORWAVE - PROD. TRESMOB.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1315 | `TRIPPLEX 2 (SLOWED)(MP3_320K).mp3` | `TRIPPLEX 2 - MEGA SLOWED.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1316 | `TROQUEI MINHA ALIANÇA EM UM LITRO DE LANÇA - MC Delux e MC VR (DJ Maguima e DJ Pavanello)  Club dz7(MP3_320K).mp3` | `TROQUEI MINHA ALIANÇA EM UM LITRO DE LANÇA - MC Delux e MC VR (DJ Maguima e DJ Pavanello) Club dz7.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1317 | `TV Girl - Cigarettes out the Window.mp3` | `TV Girl - Cigarettes Out the Window.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1318 | `Tabibito(MP3_320K).mp3` | `Tenno - Tabibito.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1319 | `Taio Cruz - Hangover (Official Video) ft. Flo Rida(MP3_320K).mp3` | `Taio Cruz - Hangover ft. Flo Rida.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1320 | `Tanin Jazz, Tania Haroshka - Virtual Love - Slowed Remix.mp3` | `Tanin Jazz, Tania Haroshka - Virtual Love - Slowed Remix.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1321 | `Tank Triad (Slowed)(MP3_320K).mp3` | `Tank Triad - Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1322 | `Tear da Club Up _97 (Explicit)(MP3_320K).mp3` | `Three 6 Mafia - Tear da Club Up ’97.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1323 | `Tears For Fears - Shout.mp3` | `Tears for Fears - Shout.mp3` | iTunes | 95.0% | RENAMED |
| 1324 | `Tears For Fears - Woman In Chains(MP3_128K).mp3` | `Tears for Fears - Woman in Chains.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1325 | `Tears for Fears - Change(MP3_70K).mp3` | `Tears for Fears - Change.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1326 | `Teeth Regeneration Ver 2.0(MP3_320K).mp3` | `Teeth Regeneration Ver 2.0.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1327 | `Tekila Loca(MP3_160K).mp3` | `Luiz Santys - Tekila Loca.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1328 | `Tell Em Instrumental (slowed to perfection)(MP3_320K).mp3` | `Kotatsku - Tell Em Instrumental (slowed to perfection).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1329 | `Temples - Colours To Life.mp3` | `Temples - Colours to Life.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1330 | `Tempo Perdido(MP3_320K).mp3` | `Legião Urbana - Tempo Perdido.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1331 | `Tender Days(MP3_320K).mp3` | `Wolfsheim - Tender Days.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1332 | `Tengger Cavalry - Hero (Audio).mp3` | `Tengger Cavalry - Hero.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1333 | `Tengger Cavalry - The Wolf Ritual (Audio).mp3` | `Tengger Cavalry - The Wolf Ritual.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1334 | `TerraBlue - Stickerbush Symphony Restored to HD.mp3` | `TerraBlue - Stickerbush Symphony Restored to HD.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1335 | `Testament - The Gathering (1999) [Full Album] HQ(MP3_320K).mp3` | `Testament - The Gathering (1999).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1336 | `Testosterone Boost ver 2.5(MP3_320K).mp3` | `Testosterone Boost ver 2.5.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1337 | `Thalles - Sad Boys Club (Official Video).mp3` | `Thalles Cabral - Sad Boys Club.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1338 | `The All Purpose Anxiety Removal(MP3_320K).mp3` | `The All Purpose Anxiety Removal.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1339 | `The Beatles - Let It Be - Remastered 2009.mp3` | `The Beatles - Let It Be - Remastered 2009.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1340 | `The Byrds   Mr Tambourine Man Remastered.mp3` | `DFF1234 - The Byrds Mr Tambourine Man Remastered.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1341 | `The Caretaker - E1 - Back there Benjamin.mp3` | `The Caretaker - E1 - Back there Benjamin.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1342 | `The Caretaker - Libets delay.mp3` | `The Caretaker - Libet's delay.mp3` | iTunes | 95.0% | RENAMED |
| 1343 | `The Caretaker - What does it matter how my heart breaks(MP3_320K).mp3` | `The Caretaker - What Does It Matter How My Heart Breaks.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1344 | `The Caretaker - false memory syndrome(M4A_128K).m4a.m4a` | `The Caretaker - false memory syndrome(M4A_128K).m4a.m4a` | LocalHeuristic | 85.0% | RENAMED |
| 1345 | `The Chainsmokers _ Colplay - Something Just Like T(MP3_128K).mp3` | `The Chainsmokers _ Colplay - Something Just Like T.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1346 | `The Cranberries - Linger(MP3_320K).mp3` | `The Cranberries - Linger.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1347 | `The Cranberries - Ode To My Family (Tradução_Legendado)(MP3_320K).mp3` | `The Cranberries - Ode To My Family (Tradução_Legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1348 | `The Cranberries - Zombie (Official Music Video)(MP3_160K).mp3` | `The Cranberries - Zombie.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1349 | `The Cranberries - Zombie (Official Music Video)(MP3_320K).mp3` | `The Cranberries - Zombie.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1350 | `The Delfonics - Topic - Lying To Myself (Digitally Remastered 1997).mp3` | `The Delfonics - Lying To Myself (Digitally Remastered 1997).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1351 | `The Eagle Lands(MP3_70K).mp3` | `Paul Hertzog - The Eagle Lands.mp3` | iTunes | 90.0% | RENAMED |
| 1352 | `The Everly Brothers - All I Have to Do Is Dream.mp3` | `The Everly Brothers - All I Have to Do Is Dream.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1353 | `The Everly Brothers - Topic - All I Have to Do Is Dream (Remastered).mp3` | `The Everly Brothers - All I Have to Do Is Dream (Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1354 | `The Farewell(MP3_320K).mp3` | `Alexey Omelchuk - The Farewell.mp3` | iTunes | 90.0% | RENAMED |
| 1355 | `The Fault In Our Stars - Charli XCX - Boom Clap.mp3` | `The Fault In Our Stars - Charli XCX - Boom Clap.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1356 | `The Gathering  - Souvenirs Full Album(MP3_320K).mp3` | `The Gathering - Souvenirs Full Album.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1357 | `The Gathering - Frail (You Might As Well Be Me)(MP3_320K).mp3` | `The Gathering - Frail (You Might as Well Be Me).mp3` | MusicBrainz | 92.0% | RENAMED |
| 1358 | `The Gathering - Great Ocean Road(MP3_320K).mp3` | `The Gathering - Great Ocean Road.mp3` | iTunes | 95.0% | RENAMED |
| 1359 | `The Gathering - Illuminating(MP3_320K).mp3` | `The Gathering - Illuminating.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1360 | `The Gathering - Liberty Bell(MP3_320K).mp3` | `The Gathering - Liberty Bell.mp3` | iTunes | 95.0% | RENAMED |
| 1361 | `The Gathering - Locked Away(MP3_320K).mp3` | `The Gathering - Locked Away.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1362 | `The Gathering - Marooned(MP3_320K).mp3` | `The Gathering - Marooned.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1363 | `The Gathering - My Electricity(MP3_320K).mp3` | `The Gathering - My Electricity.mp3` | iTunes | 95.0% | RENAMED |
| 1364 | `The Gathering - Nighttime Birds (full album)(MP3_320K).mp3` | `The Gathering - Nighttime Birds.mp3` | iTunes | 95.0% | RENAMED |
| 1365 | `The Gathering - Rescue Me(MP3_320K).mp3` | `The Gathering - Rescue Me.mp3` | iTunes | 95.0% | RENAMED |
| 1366 | `The Gathering - South American Ghost Ride(MP3_320K).mp3` | `The Gathering - South American Ghost Ride.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1367 | `The Gathering - The Big Sleep(MP3_320K).mp3` | `The Gathering - The Big Sleep.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1368 | `The Gathering _When The Sun Hits (Slowdive Cover)_.mp3` | `xTNTArea - The Gathering When The Sun Hits (Slowdive Cover).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1369 | `The Highlander - Emotional Overload (Dj Tandu Orginal 95 Mix)(MP3_160K).mp3` | `The Highlander - Emotional Overload (Dj Tandu Orginal 95 Mix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1370 | `The Hollies  _The Air That I Breathe_(MP3_320K).mp3` | `The Hollies - The Hollies ''The Air That I Breathe''.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1371 | `The Host of Seraphim (Remastered)(MP3_320K).mp3` | `Dead Can Dance - The Host of Seraphim (Remastered).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1372 | `The Kid LAROI - Not Sober (Lyrics) ft. Polo G(MP3_320K).mp3` | `The Kid LAROI - NOT SOBER (feat. Polo G & Stunna Gambino).mp3` | iTunes | 95.0% | RENAMED |
| 1373 | `The Killer_s Song (The Killer_s Song Extended)(MP3_320K).mp3` | `The Killer's Song - The Killer's Song Extended.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1374 | `The Legend(MP3_320K).mp3` | `Jerry Reed & Bill Justis - The Legend.mp3` | iTunes | 90.0% | RENAMED |
| 1375 | `The Lost Soul Down x Lost Soul - NBSPLV _ Edit(MP3_320K).mp3` | `The Lost Soul Down x Lost Soul - NBSPLV _ Edit.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1376 | `The Mamas _ the Papas - California Dreamin_(MP3_320K).mp3` | `The Mamas _ the Papas - California Dreamin.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1377 | `The Marmalade - Rainbow.mp3` | `Marmalade - Rainbow.mp3` | iTunes | 95.0% | RENAMED |
| 1378 | `The Mirrors - Ill Stay.mp3` | `The Mirrors - Ill Stay.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1379 | `The Moments - Topic - Whats Your Name.mp3` | `The Moments - Whats Your Name.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1380 | `The Neverending Story • Theme Song • Limahl(MP3_320K).mp3` | `The Neverending Story • Theme Song • Limahl.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1381 | `The Robots(MP3_320K).mp3` | `Kraftwerk - The Robots.mp3` | iTunes | 95.0% | RENAMED |
| 1382 | `The Silver Screen Orchestra - Topic - Raindrops Keep Falling on My Head (Tema principal de Dos hombres y un destino, 1969).mp3` | `The Silver Screen Orchestra - Raindrops Keep Falling on My Head (Tema principal de Dos hombres y un destino, 1969).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1383 | `The Smiths - Heaven Knows Im Miserable Now.mp3` | `The Smiths - Heaven Knows Im Miserable Now.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1384 | `The Smiths - The Boy With The Thorn In His Side (O.mp3` | `The Smiths - The Boy With The Thorn In His Side (O).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1385 | `The Smiths - There Is A Light That Never Goes Out(MP3_128K).mp3` | `The Smiths - There Is a Light That Never Goes Out.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1386 | `The Stylistics - Betcha By Golly Wow 1975.mp3` | `The Stylistics - Betcha By Golly Wow 1975.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1387 | `The Stylistics - Betcha By Golly_ Wow (Official Lyric Video)(MP3_320K).mp3` | `The Stylistics - Betcha By Golly_ Wow (Official Lyric Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1388 | `The Underdog Project - Saturday Night(MP3_320K).mp3` | `The Underdog Project - Saturday Night.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1389 | `The Voice In Fashion Give Me Your Love Video.mp3` | `David Hanono - The Voice In Fashion Give Me Your Love Video.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1390 | `The Weather Girls - It_s Raining Men (Video).mp3` | `The Weather Girls - It_s Raining Men (Video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1391 | `The Weeknd - The Hills(MP3_320K).mp3` | `The Weeknd - The Hills.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1392 | `The Whatnauts - I Cant Stand to See You Cry.mp3` | `The Whatnauts - I Cant Stand to See You Cry.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1393 | `The Whatnauts - Topic - I Cant Stand to See You Cry.mp3` | `The Whatnauts - I Cant Stand to See You Cry.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1394 | `They Wish(MP3_320K).mp3` | `GIJS - They Wish.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1395 | `Things U Should Do [EmptyPartyCollective](MP3_320K).mp3` | `Carter Tomorrow - Things U Should Do [EmptyPartyCollective].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1396 | `This Feeling (Slowed _ Reverb)(MP3_320K).mp3` | `my!lane - This Feeling (Slowed & Reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1397 | `Thompson Twins - Hold Me Now.mp3` | `Thompson Twins - Hold Me Now.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1398 | `Three 6 Mafia - Body Parts.mp3` | `Three 6 Mafia - Body Parts.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1399 | `Three 6 Mafia - Break Da Law 95.mp3` | `Three 6 Mafia - Break Da Law 95.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1400 | `Three 6 Mafia - Topic - Grab Tha Gauge.mp3` | `Three 6 Mafia - Grab Tha Gauge.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1401 | `Three 6 Mafia - Try To Run B_W Scopin With That Red Dot (1995) [432Hz](MP3_320K).mp3` | `Three 6 Mafia - Try To Run B_W Scopin With That Red Dot (1995) [432Hz].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1402 | `ThxSoMch - SPIT IN MY FACE_ (Official Audio)(MP3_320K).mp3` | `ThxSoMch - SPIT IN MY FACE!.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1403 | `Thy Light - Wanderer of Solitude(MP3_70K).mp3` | `Thy Light - Wanderer of Solitude.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1404 | `Til We Meet Again(MP3_320K).mp3` | `BΔESIDE - Til We Meet Again.mp3` | iTunes | 95.0% | RENAMED |
| 1405 | `Till West _ Dj Delicious - Same Man (Extended Vocal Mix)(MP3_320K).mp3` | `Till West _ Dj Delicious - Same Man (Extended Vocal Mix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1406 | `Time (Clock Of The Heart) (Remastered 2003)(MP3_320K).mp3` | `Culture Club - Time (Clock Of The Heart) (Remastered 2003).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1407 | `Timecop1983 - On the Run(MP3_320K).mp3` | `Timecop1983 - On the Run.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1408 | `Tina Turner - What_s Love Got To Do With It.mp3` | `Tina Turner - What_s Love Got To Do With It.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1409 | `To the Moon(MP3_320K).mp3` | `Brennan Savage - To the Moon.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1410 | `Tolling Iron Bells(MP3_320K).mp3` | `DIM - Tolling Iron Bells.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1411 | `Tom Platz X Memory Reboot (epic)(slowed)(MP3_320K).mp3` | `shxos 音楽 - Tom Platz X Memory Reboot (epic)(slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1412 | `Toquinho - Aquarela(MP3_320K).mp3` | `Toquinho - Aquarela.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1413 | `Torran - Mii Editor - Mii Maker (Wii U) Music.mp3` | `Torran - Mii Editor - Mii Maker (Wii U) Music.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1414 | `Tove Lo - Habits (Stay High).mp3` | `Tove Lo - Habits (Stay High).mp3` | MusicBrainz | 92.0% | RENAMED |
| 1415 | `Tove Lo - Stay High ft. Hippie Sabotage (U_IK Trap.mp3` | `Tove Lo - Stay High ft. Hippie Sabotage (U_IK Trap).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1416 | `Tove Lo - Talking Body(MP3_320K).mp3` | `Tove Lo - Talking Body.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1417 | `Tranceparence - Enigma cover - Beyond the Invisible(MP3_320K).mp3` | `Tranceparence - Enigma cover - Beyond the Invisible.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1418 | `Transform Fat to Stem Cells (Energetic_ Psychic Programmed Audio)(MP3_320K).mp3` | `Transform Fat to Stem Cells (Energetic - Psychic Programmed Audio).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1419 | `Trap Queen(MP3_320K).mp3` | `Fetty Wap - Trap Queen.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1420 | `Trauma Release and Healing(MP3_320K).mp3` | `Sapien Medicine - Trauma Release and Healing.mp3` | iTunes | 90.0% | RENAMED |
| 1421 | `Travis Scott - TOPIA TWINS (Official Music Video) ft. Rob49_ 21 Savage(MP3_320K).mp3` | `Travis Scott - TOPIA TWINS ft. Rob49_ 21 Savage.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1422 | `Travis Scott - sdp interlude.mp3` | `Travis Scott - sdp interlude.mp3` | iTunes | 95.0% | RENAMED |
| 1423 | `Tren Twins X The Lost Soul Down _ Bass Boosted x Edit x Slowed(MP3_320K).mp3` | `Sigma Far - Tren Twins X The Lost Soul Down - Bass Boosted x Edit x Slowed.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1424 | `Trenches(MP3_320K).mp3` | `Josh A - Trenches.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1425 | `Trevor Something - Summer Love(MP3_320K).mp3` | `Trevor Something - Summer Love.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1426 | `Triple Six Mafia - Da Summa (REMIX) With Lyrics(MP3_320K).mp3` | `Triple Six Mafia - Da Summa (REMIX) With Lyrics.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1427 | `Trippie Redd - BANG_ [slowed to perfection](MP3_320K).mp3` | `Trippie Redd - BANG_ [slowed to perfection].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1428 | `Trippie Redd - The Grinch(MP3_320K).mp3` | `Trippie Redd - The Grinch.mp3` | iTunes | 95.0% | RENAMED |
| 1429 | `Trippie Redd - _Love Scars_ Official Music Video _ Pigeons _ Planes Premiere(MP3_320K).mp3` | `Trippie Redd - Love Scars_ Official Music Video _ Pigeons _ Planes Premiere.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1430 | `Tristitia Romana(MP3_320K).mp3` | `Lamúria Abissal - Tristitia Romana.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1431 | `Tsugaru - Uttara Kuru _ Samurai Collection (Official Audio)(MP3_320K).mp3` | `Tsugaru - Uttara Kuru _ Samurai Collection.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1432 | `Tudo que vai - Capital Inicial .wmv(MP3_320K).mp3` | `Tudo que vai - Capital Inicial .wmv.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1433 | `U Weren_t Here I Really Miss You(MP3_320K).mp3` | `Cult Member - U Weren't Here I Really Miss You.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1434 | `U2 - Sunday Bloody Sunday.mp3` | `U2 - Sunday Bloody Sunday.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1435 | `ULTIMATE - Paul Hertzog(MP3_70K).mp3` | `ULTIMATE - Paul Hertzog.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1436 | `UNAVERAGE GANG X SCHIZO - CRYSTAL LAKE(MP3_320K).mp3` | `UNAVERAGE GANG X SCHIZO - CRYSTAL LAKE.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1437 | `UNDGND Inc. - H.O.H. – Ghetto Heat.mp3` | `UNDGND Inc. - H.O.H. – Ghetto Heat.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1438 | `UTTARA-KURU　_MENDICANT PRIEST_(MP3_320K).mp3` | `UTTARA-KURU ''MENDICANT PRIEST''.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1439 | `Ultima Ascension V1 Calm(MP3_320K).mp3` | `FK Subs - Ultima Ascension V1 Calm.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1440 | `Unstoppable Willpower(MP3_320K).mp3` | `Unstoppable Willpower.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1441 | `Urias - Diaba(MP3_70K).mp3` | `Urias - Diaba.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1442 | `Uruma muzzik - Meet Her At The Love Parade (Beuk Mix) (slowed x reward).mp3` | `Uruma muzzik - Meet Her At The Love Parade (Beuk Mix) (slowed x reward).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1443 | `Uttara-Kuru - Tsugaru(MP3_320K).mp3` | `Uttara-Kuru - Tsugaru.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1444 | `Uttara-Kuru_ Neyuki(MP3_320K).mp3` | `Uttara-Kuru - Uttara-Kuru - Neyuki.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1445 | `Uttara-Kuru_ Winter Dance(MP3_320K).mp3` | `Uttara-Kuru - Uttara-Kuru - Winter Dance.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1446 | `VAMO AGIR HEIN_ NÃO SE DORME NA EUROPA. NÃO SE DORME_ GATINHA(MP3_320K).mp3` | `Henrique - VAMO AGIR HEIN NÃO SE DORME NA EUROPA. NÃO SE DORME, GATINHA.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1447 | `VIDEOCLUB – Roi (Clip officiel)(MP3_320K).mp3` | `VIDEOCLUB - VIDEOCLUB – Roi.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1448 | `VLADIST - Mosaic(MP3_320K).mp3` | `VLADIST - Mosaic.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1449 | `VOCÊ ACHA QUE O SEU SOM É BOM_ (COM GRAVE)(MP3_320K).mp3` | `VOCÊ ACHA QUE O SEU SOM É BOM (COM GRAVE).mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1450 | `VVV(MP3_320K).mp3` | `mikeeysmind - VVV.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1451 | `VXLLAIN, iGRES, ENXK - Crystal Skies.mp3` | `VXLLAIN, iGRES, ENXK - Crystal Skies.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1452 | `Vai Toma No Cu - Cris Nicolotti.mp3` | `Vai Toma No Cu - Cris Nicolotti.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1453 | `Vance Joy - _Riptide_ Official Video(MP3_320K).mp3` | `Vance Joy - Riptide_ Official Video.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1454 | `VaporGod - Diamondz n Roses (slowed   reverb)(MP3_320K).mp3` | `VaporGod - Diamondz n Roses (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1455 | `Vaults One last night(MP3_320K).mp3` | `Yanny Silvinha - Tradução em português - Vaults - One last night - Fifty shades of grey.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1456 | `Vee Brondi _ Marcelo Sa - Best Of You (Official Video)(MP3_320K).mp3` | `Vee Brondi _ Marcelo Sa - Best Of You.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1457 | `Velum(MP3_70K).mp3` | `Velum.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1458 | `Vendredi sur Mer -  L_Amour avec Toi(MP3_70K).mp3` | `Vendredi sur Mer - L'amour avec toi.mp3` | iTunes | 95.0% | RENAMED |
| 1459 | `Vendredi sur Mer - Comment tu vas finir (Audio)(MP3_70K).mp3` | `Vendredi sur Mer - Comment tu vas finir.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1460 | `Vendredi sur Mer - La Femme à la Peau Bleue(MP3_70K).mp3` | `Vendredi sur Mer - La Femme à la peau bleue.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1461 | `Vendredi sur Mer - Le Lac (Clip officiel)(MP3_70K).mp3` | `Vendredi sur Mer - Le Lac.mp3` | iTunes | 95.0% | RENAMED |
| 1462 | `Vendredi sur Mer - Les Filles Désir(MP3_70K).mp3` | `Vendredi sur Mer - Les filles désir.mp3` | iTunes | 95.0% | RENAMED |
| 1463 | `Vendredi sur Mer - Écoute chérie (Clip officiel)(MP3_70K).mp3` | `Vendredi sur Mer - Écoute Chérie.mp3` | iTunes | 95.0% | RENAMED |
| 1464 | `Vendredi sur Mer _ Larme à Gauche(MP3_70K).mp3` | `Vendredi sur Mer - Vendredi sur Mer — Larme à Gauche.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1465 | `Video Not Available(MP3_320K).mp3` | `YouTube Viewers - Video Not Available.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1466 | `Vidro Fumê - MC TH.mp3` | `Vidro Fumê - MC TH.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1467 | `Village People - Y.M.C.A..mp3` | `Village People - Y.M.C.A..mp3` | MusicBrainz | 92.0% | RENAMED |
| 1468 | `Vin One - Power of Sounds (Original Mix) L.S.D MUS.mp3` | `Vin One - Power of Sounds (Original Mix) L.S.D MUS.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1469 | `Vini Vici _ Astrix - Adhana.mp3` | `Vini Vici & Astrix - Adhana.mp3` | iTunes | 95.0% | RENAMED |
| 1470 | `Vitas   7th Element Legendado PT Brasil(MP3_70K).mp3` | `Vitаs - Vitas 7th Element Legendado PT Brasil.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1471 | `Você Vai Entender - Pablo Martins_ Morgado_ NaBrisa_ Baviera (Prod. RastaBeats)(MP3_320K).mp3` | `Você Vai Entender - Pablo Martins_ Morgado_ NaBrisa_ Baviera (Prod. RastaBeats).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1472 | `Você é Meu Mô (Ao Vivo) - KAMISA 10 feat. Grupo Menos É Mais.m4a` | `Você é Meu Mô (Ao Vivo) - KAMISA 10 feat. Grupo Menos É Mais.m4a` | LocalHeuristic | 85.0% | RENAMED |
| 1473 | `Voraz(MP3_320K).mp3` | `Yaego, wzrdd & skrta - Voraz.mp3` | iTunes | 95.0% | RENAMED |
| 1474 | `Vou Desafiar Você(MP3_320K).mp3` | `MC Sapão - Vou Desafiar Você.mp3` | iTunes | 90.0% | RENAMED |
| 1475 | `VØJ_ Narvent - Memory Reboot (Music Video)(MP3_320K).mp3` | `VØJ & Narvent - Memory Reboot.mp3` | iTunes | 95.0% | RENAMED |
| 1476 | `WINDY CITY - just for you (_1980_) (_kelli-arts records_)(MP3_320K).mp3` | `WINDY CITY - just for you (_1980_) (_kelli-arts records).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1477 | `Wadaiko Matsuriza - Kabuki Gomen-Jyo [Japanese drums](MP3_320K).mp3` | `Wadaiko Matsuriza - Kabuki Gomen-Jyo [Japanese drums].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1478 | `Wakanda Great Spirit (Dimitri Vegas _ Like Mike Ed.mp3` | `Vercetti - Wakanda Great Spirit (Dimitri Vegas & Like Mike Ed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1479 | `Warriyo - Mortals (feat. Laura Brehm) s-l-o-w a-n-d r-e-v-e-r-b _Bass Boosted_(MP3_320K).mp3` | `Warriyo - Mortals (feat. Laura Brehm) s-l-o-w a-n-d r-e-v-e-r-b _Bass Boosted.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1480 | `Weight Gainer(MP3_320K).mp3` | `Sapien Medicine - Weight Gainer.mp3` | iTunes | 90.0% | RENAMED |
| 1481 | `Westkust - _Rush_ (Official Audio)(MP3_320K).mp3` | `Westkust - Rush.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1482 | `What_s Come over Me(MP3_320K).mp3` | `Blue Magic - What's Come over Me.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1483 | `WhatsApp Audio - AUD 20250720 WA0005.opus` | `WhatsApp Audio - AUD 20250720 WA0005.opus` | LocalHeuristic | 85.0% | RENAMED |
| 1484 | `WhatsApp Audio - AUD 20250906 WA0001.opus` | `WhatsApp Audio - AUD 20250906 WA0001.opus` | LocalHeuristic | 85.0% | RENAMED |
| 1485 | `WhatsApp Audio - AUD 20260416 WA0018.opus` | `WhatsApp Audio - AUD 20260416 WA0018.opus` | LocalHeuristic | 85.0% | RENAMED |
| 1486 | `WhatsApp Audio - AUD 20260507 WA0005.opus` | `WhatsApp Audio - AUD 20260507 WA0005.opus` | LocalHeuristic | 85.0% | RENAMED |
| 1487 | `WhatsApp Audio - psy.mp3` | `WhatsApp Audio - psy.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1488 | `Where Springs Not Fail(MP3_320K).mp3` | `DIM - Where Springs Not Fail.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1489 | `White Lion - When The Children Cry.mp3` | `White Lion - When the Children Cry.mp3` | iTunes | 95.0% | RENAMED |
| 1490 | `Whitesnake - Is This Love (Official Music Video)(MP3_160K).mp3` | `Whitesnake - Is This Love.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1491 | `Why - Carly Simon(MP3_320K).mp3` | `Carly Simon - Why.mp3` | iTunes | 95.0% | RENAMED |
| 1492 | `Wilee - Night Drive (Slowed   Reverb)(MP3_320K).mp3` | `Wilee - Night Drive (Slowed Reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1493 | `Wilee - Night Drive(MP3_320K).mp3` | `Wilee - Night Drive.mp3` | iTunes | 95.0% | RENAMED |
| 1494 | `Windowz3.1 - Mirror Images(MP3_320K).mp3` | `Windowz3.1 - Mirror Images.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1495 | `Winglet of the Fairy(MP3_320K).mp3` | `DIM - Winglet of the Fairy.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1496 | `Wings of the Eagle - Uttara Kuru _ Samurai Collection (Official Audio)(MP3_320K).mp3` | `Wings of the Eagle - Uttara Kuru _ Samurai Collection.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1497 | `Wit and Wisdom of Their King(MP3_320K).mp3` | `DIM - Wit and Wisdom of Their King.mp3` | iTunes | 95.0% | RENAMED |
| 1498 | `Woops - DJ Bountyhunter (Slowed and Reverb)(MP3_320K).mp3` | `Woops - DJ Bountyhunter (Slowed and Reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1499 | `Wutiwant - Saraunh0ly (Slowed to Perfection )(MP3_320K).mp3` | `Wutiwant - Saraunh0ly (Slowed to Perfection).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1500 | `X Ambassadors - Renegades (Lyric Video).mp3` | `X Ambassadors - Renegades.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1501 | `XXXTENTACION _ Heartbroken _ Misspoken _ King Remix(MP3_320K).mp3` | `Whatever Forever - XXXTENTACION - Heartbroken - Misspoken - King Remix.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1502 | `Xcho - Ты и Я _ Tik Tok Remix(MP3_320K).mp3` | `Xcho - Ты и Я _ Tik Tok Remix.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1503 | `Yellow Productions - Africanism - Martin Solveig - Edony.mp3` | `Yellow Productions - Africanism - Martin Solveig - Edony.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1504 | `Yung Gud - Numb(MP3_320K).mp3` | `Yung Gud - Numb.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1505 | `Yung Lean - Ginseng Strip 2002.mp3` | `Yung Lean - Ginseng Strip 2002.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1506 | `Yuni Wa - The Future(MP3_320K).mp3` | `Yuni Wa - The Future.mp3` | iTunes | 95.0% | RENAMED |
| 1507 | `Yvetzal - Cataclysm(MP3_320K).mp3` | `Yvetzal - Cataclysm.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1508 | `Z3USX, DJ L7 da ZN - ASSOMBRA MATRIX 9 - SPEED UP.mp3` | `Z3USX, DJ L7 da ZN - ASSOMBRA MATRIX 9 - SPEED UP.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1509 | `ZAYN - PILLOWTALK(MP3_320K).mp3` | `ZAYN - PILLOWTALK.mp3` | iTunes | 95.0% | RENAMED |
| 1510 | `ZIG ZIGLAR - OS SEGREDOS  DO SUCESSO (ÁUDIO)(M4A_128K).m4a.m4a` | `ZIG ZIGLAR - OS SEGREDOS DO SUCESSO (ÁUDIO)(M4A_128K).m4a.m4a` | LocalHeuristic | 85.0% | RENAMED |
| 1511 | `ZYZZMODE, ZYZZ HARDSTYLE, Tazzy - TEK IT - HARDSTYLE.mp3` | `ZYZZMODE, Zyzz Hardstyle & Tazzy - Sofia - Hardstyle.mp3` | iTunes | 95.0% | RENAMED |
| 1512 | `Zanka no Tachi East - Yamamoto_s Bankai Theme - Bleach TYBW Episode 6 OST (HQ Cover)(MP3_320K).mp3` | `Zanka no Tachi East - Yamamoto_s Bankai Theme - Bleach TYBW Episode 6 OST ( Cover).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1513 | `Zeca Baleiro - Bandeira(MP3_320K).mp3` | `Zeca Baleiro - Bandeira.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1514 | `Zoe.LeelA - Pop Up.mp3` | `Zoe.LeelA - Pop Up.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1515 | `Zonaverdi - lady in red but theres nobody here.mp3` | `Zonaverdi - lady in red but theres nobody here.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1516 | `[1990] Hard To Kill - David Michael Frank - 05 - __Meditation And Training__(MP3_128K).mp3` | `1990] Hard To Kill - David Michael Frank - 05 - __Meditation And Training.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1517 | `[FREE] deftones x alternative rock x heavy shoegaze type beat - _existence_(MP3_320K).mp3` | `FREE] deftones x alternative rock x heavy shoegaze type beat - existence.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1518 | `[SOLD] HARD FREDDIE DREDD_ SUICIDEBOYS_ MEMPHIS TYPE BEAT - _TESLA_(MP3_320K).mp3` | `SOLD] HARD FREDDIE DREDD_ SUICIDEBOYS_ MEMPHIS TYPE BEAT - TESLA.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1519 | `[free for profit] sematary x ghost mountain type beat - _gaze_(MP3_320K).mp3` | `free for profit] sematary x ghost mountain type beat - gaze.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1520 | `_2024_ prod. ojivolta_ earlonthebeat_ and Kanye West(MP3_320K).mp3` | `Playboi Carti - ''2024'' prod. ojivolta, earlonthebeat, and Kanye West.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1521 | `_BANKAI_ -GHOST_ phonk.me _ KIIXSHI (Sped Up   Ikkaku)(MP3_320K).mp3` | `R U K I A - “BANKAI” -GHOST! phonk.me & KIIXSHI (Sped Up + Ikkaku).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1522 | `_Eerroorr_(MP3_320K).mp3` | `Epure Oleandru - Eerroorr.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1523 | `_Hardy Boyz_ (sped up   Aizen)(MP3_320K).mp3` | `R U K I A - “Hardy Boyz” (sped up + Aizen).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1524 | `_Ma Baker_ by Boney M (1976) The True Story of Ma.mp3` | `David James - ''Ma Baker'' by Boney M (1976) The True Story of Ma.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1525 | `_UICIDEBOY_ - Avalon [Slowed](MP3_160K).mp3` | `UICIDEBOY - Avalon [Slowed].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1526 | `_UICIDEBOY_ x POUYA - RUNNIN_ THRU THE 7TH WITH MY WOADIES(MP3_320K).mp3` | `UICIDEBOY_ x POUYA - RUNNIN_ THRU THE 7TH WITH MY WOADIES.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1527 | `_UICIDEBOY_ ⊷ Avalon (Slowed   Reverb)(MP3_320K).mp3` | `PsychØ サイコ - $UICIDEBOY$ ⊷ Avalon (Slowed + Reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1528 | `_uicideBoy_ – ...And To Those I Love_ Thanks For Sticking Around (Lyric Video)(M4A_128K).m4a.m4a` | `$uicideBoy$ – ...And To Those I Love, Thanks For Sticking Around.m4a` | LocalHeuristic | 50.0% | RENAMED |
| 1529 | `_uicideboy_  – That Just Isn_t Empirically Possible (Lyric Video)(MP3_320K).mp3` | `$uicideboy$ - That Just Isn't Empirically Possible.mp3` | iTunes | 95.0% | RENAMED |
| 1530 | `a devis - Topic - Dreams of Peace.mp3` | `a devis - Dreams of Peace.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1531 | `a-ha - Crying In The Rain.mp3` | `a‐ha - Crying in the Rain.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1532 | `a-ha - Stay On These Roads (Video)(MP3_128K).mp3` | `a-ha - Stay On These Roads (2015 Remastered).mp3` | iTunes | 95.0% | RENAMED |
| 1533 | `a-ha - Take On Me (Official Music Video).mp3` | `a-ha - Take On Me.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1534 | `a-ha - Touchy_.mp3` | `a-ha - Touchy.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1535 | `accessory(MP3_320K).mp3` | `Benedixhion - accessory.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1536 | `akiaura_ LONOWN_ STM - Destruction Age (Official Visualizer)(MP3_320K).mp3` | `akiaura_ LONOWN_ STM - Destruction Age (Official Visualizer).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1537 | `alien girl observer - Alien Observer - Grouper (𝐬𝐥𝐨𝐰𝐞𝐝 𝐧 𝐫𝐞𝐯𝐞𝐫𝐛) with lyrics 𖨆︎𖨆.mp3` | `alien girl observer - Alien Observer - Grouper (𝐬𝐥𝐨𝐰𝐞𝐝 𝐧 𝐫𝐞𝐯𝐞𝐫𝐛) with lyrics 𖨆︎𖨆.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1538 | `another day in lore - yui rocha ゆいロック [post-punk](MP3_320K).mp3` | `another day in lore - yui rocha ゆいロック [post-punk].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1539 | `antihoney - Dove - Doll Ver.mp3` | `antihoney - Dove (Doll Ver).mp3` | iTunes | 95.0% | RENAMED |
| 1540 | `asanrap - вот как то так (Slowed).mp3` | `asanrap - вот как то так (Slowed).mp3` | iTunes | 95.0% | RENAMED |
| 1541 | `aylou - she’s green - smile again.mp3` | `aylou - she’s green - smile again.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1542 | `b a d  r o m a n c e _ ( slowed   reverb )(MP3_320K).mp3` | `CKMONA - b a d r o m a n c e - ( slowed + reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1543 | `b e g o t t e n 自杀 - (depression) - 蕭條_ remix by دل(MP3_320K).mp3` | `b e g o t t e n 自杀 - (depression) - 蕭條_ remix by دل.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1544 | `b e g o t t e n 自杀 - (disintegrate) - 瓦解_ remix by Sangam(MP3_320K).mp3` | `b e g o t t e n 自杀 - (disintegrate) - 瓦解_ remix by Sangam.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1545 | `b e g o t t e n 自杀 - (invisible) - 无形_ remix by MindSpring Memories(MP3_320K).mp3` | `b e g o t t e n 自杀 - (invisible) - 无形_ remix by MindSpring Memories.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1546 | `b e g o t t e n 自杀 - (lapis lazuli) - 青金石_ remix by Electric Specter 電妖怪 (snowfall version)(MP3_320K).mp3` | `b e g o t t e n 自杀 - (lapis lazuli) - 青金石_ remix by Electric Specter 電妖怪 (snowfall version).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1547 | `b e g o t t e n 自杀 - (longing) - 渴望_ remix by Ｓｐｏｒｔ３０００(MP3_320K).mp3` | `b e g o t t e n 自杀 - (longing) - 渴望_ remix by Ｓｐｏｒｔ３０００.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1548 | `b e g o t t e n 自杀 - (pain) - 翅膀_ remix by desert sand feels warm at night(MP3_320K).mp3` | `b e g o t t e n 自杀 - (pain) - 翅膀_ remix by desert sand feels warm at night.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1549 | `b e g o t t e n 自杀 - (perpetual love) - 永动的_ remix by Lucid Sound Driver (LSD)(MP3_320K).mp3` | `b e g o t t e n 自杀 - (perpetual love) - 永动的_ remix by Lucid Sound Driver (LSD).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1550 | `bLase - Hardcore-E - artificial intelligence (SLOWED-REVERB, POWER 200).mp3` | `bLase - Hardcore-E - artificial intelligence (SLOWED-REVERB, POWER 200).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1551 | `baby doll x the perfect girl (Lyrics) Tiktok Remix _ Ari Abdul x Mareux(MP3_320K).mp3` | `𝙪𝙣𝙝𝙖𝙥𝙥𝙞𝙚𝙧 - baby doll x the perfect girl Tiktok Remix - Ari Abdul x Mareux.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1552 | `beach house - space song (slowed   reverb)(MP3_320K).mp3` | `beach house - space song (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1553 | `benjyfifteen - Miss The Rage x Sexually Active (SLOWED_REVERB) (SEAMLESS TRANSITION).mp3` | `benjyfifteen - Miss The Rage x Sexually Active (SLOWED_REVERB) (SEAMLESS TRANSITION).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1554 | `billy idol - eyes without a face (slowed _ reverb)(MP3_320K).mp3` | `Billy Idol - Eyes Without A Face (Remastered 1999).mp3` | iTunes | 95.0% | RENAMED |
| 1555 | `billy idol - eyes without a face (speed up   reverb)(MP3_320K).mp3` | `Billy Idol - Eyes Without a Face.mp3` | iTunes | 95.0% | RENAMED |
| 1556 | `bryson tiller - bad timing [slowed   reverb](MP3_320K).mp3` | `bryson tiller - bad timing [slowed reverb].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1557 | `bryson tiller - she don_t want it [slowed   reverb](MP3_320K).mp3` | `bryson tiller - she don_t want it [slowed reverb].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1558 | `chAngE - Miwa(MP3_320K).mp3` | `chAngE - Miwa.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1559 | `choccymilc - elias - gimme love (slowed & reverb).mp3` | `choccymilc - elias - gimme love (slowed & reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1560 | `cult member - ov dreams (slowed x reverb)(MP3_320K).mp3` | `cult member - ov dreams (slowed x reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1561 | `cult member - the ravedeath still hurts (slowed x reverb)(MP3_320K).mp3` | `cult member - the ravedeath still hurts (slowed x reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1562 | `cult member - three (slowed x reverb)(MP3_320K).mp3` | `cult member - three (slowed x reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1563 | `d4vd - Romantic Homicide(MP3_320K).mp3` | `d4vd - Romantic Homicide.mp3` | iTunes | 95.0% | RENAMED |
| 1564 | `dannow - Ewoe(MP3_320K).mp3` | `dannow - Ewoe.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1565 | `dark trance 190 bpm melodic (goa psy trance).mp3` | `poweroflsd123 - dark trance 190 bpm melodic (goa psy trance).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1566 | `death_s dynamic shroud.wmv - STARALGIA(MP3_320K).mp3` | `death_s dynamic shroud.wmv - STARALGIA.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1567 | `death_s dynamic shroud.wmv - _☗✧脳死✧☗_(MP3_320K).mp3` | `death_s dynamic shroud.wmv - ☗✧脳死✧☗.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1568 | `death_s dynamic shroud.wmv - ƤROℳISE ƦINǤ(MP3_320K).mp3` | `death_s dynamic shroud.wmv - ƤROℳISE ƦINǤ.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1569 | `death_s dynamic shroud.wmv - 無限CIGARℇƬƬℇ(MP3_320K).mp3` | `death_s dynamic shroud.wmv - 無限CIGARℇƬƬℇ.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1570 | `deftones - entombed (slowed   reverb)(MP3_320K).mp3` | `deftones - entombed (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1571 | `deprezz - Versatile.mp3` | `Deprezz & finest - Versatile.mp3` | iTunes | 95.0% | RENAMED |
| 1572 | `desmond doom _ true love will find you in the end (legendado)(MP3_320K).mp3` | `leaveya - desmond doom — true love will find you in the end (legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1573 | `didica - adorável clichê - traços (slowed + reverb).mp3` | `didica - adorável clichê - traços (slowed + reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1574 | `drake - god_s plan﹝slowed   reverb﹞(MP3_320K).mp3` | `drake - god_s plan﹝slowed reverb﹞.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1575 | `eRa - Madona.mp3` | `Era - Madona.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1576 | `ecsatsis. - 𝙣𝙤 𝙢𝙤𝙧𝙚 𝙚𝙭𝙘𝙪𝙨𝙚𝙨 (𝙞𝙣 𝙛𝙤𝙧 𝙞𝙩)  𝙭𝙤𝙙𝙙𝙞𝙖𝙘 (𝙨𝙡𝙤𝙬𝙚𝙙  𝙧𝙚𝙫𝙚𝙧𝙗).mp3` | `ecsatsis. - 𝙣𝙤 𝙢𝙤𝙧𝙚 𝙚𝙭𝙘𝙪𝙨𝙚𝙨 (𝙞𝙣 𝙛𝙤𝙧 𝙞𝙩) 𝙭𝙤𝙙𝙙𝙞𝙖𝙘 (𝙨𝙡𝙤𝙬𝙚𝙙 𝙧𝙚𝙫𝙚𝙧𝙗).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1577 | `ecstasyxyn - under your spell — Snow Strippers \| slowed reverb \| tiktok version.mp3` | `ecstasyxyn - under your spell — Snow Strippers - slowed reverb - tiktok version.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1578 | `eliminadorzinho - das vezes que conversamos na cama e acabamos dormindo(MP3_320K).mp3` | `Eliminadorzinho - Das Vezes Que Conversamos na Cama e Acabamos Dormindo.mp3` | iTunes | 95.0% | RENAMED |
| 1579 | `eliminadorzinho - eliminadorzinho - Baixo Astral.mp3` | `eliminadorzinho - eliminadorzinho - Baixo Astral.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1580 | `eliminadorzinho - lar(MP3_320K).mp3` | `eliminadorzinho - lar.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1581 | `ellktro - Topic - People Net.mp3` | `ellktro - People Net.mp3` | iTunes | 95.0% | RENAMED |
| 1582 | `empty phases - mr.kitty (slowed and reverb)(MP3_320K).mp3` | `empty phases - mr.kitty (slowed and reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1583 | `emulated - Elixir Of Masculinity Subliminal.mp3` | `emulated - Elixir Of Masculinity Subliminal.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1584 | `emulated - Fat to Stem Cells to Muscle \| Powerful Subliminal.mp3` | `emulated - Fat to Stem Cells to Muscle - Powerful Subliminal.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1585 | `emulated - INTENSE MASCULINITY+ANDROSTENOL BOOSTER(subliminal_frequency_biokinesis).mp3` | `emulated - INTENSE MASCULINITY+ANDROSTENOL BOOSTER(subliminal_frequency_biokinesis).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1586 | `emulated - Masculine Square Chest & Banish Gynecomastia \| Powerful Subliminal.mp3` | `emulated - Masculine Square Chest & Banish Gynecomastia - Powerful Subliminal.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1587 | `emulated - Reject Modernity, Embrace Masculinity Zyzz Subliminal. We Are All Gonna Make It Brahs!.mp3` | `emulated - Reject Modernity, Embrace Masculinity Zyzz Subliminal. We Are All Gonna Make It Brahs!.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1588 | `emulated - Ultimate Fighter Combo \| Powerful Subliminal.mp3` | `emulated - Ultimate Fighter Combo - Powerful Subliminal.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1589 | `endora(MP3_320K).mp3` | `Malory - endora.mp3` | iTunes | 95.0% | RENAMED |
| 1590 | `erhu ii(MP3_320K).mp3` | `이누야샤(犬夜叉) OST - 시대를 초월한 마음 時代を越える想いㅣ얼후(二胡) 아티스트 이비 커버 ㅣ Inuyasha erhu cover a timeless mind.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1591 | `erhu(MP3_320K).mp3` | `雨碎江南 二胡版 Rain in Jiang Nan_Erhu Cover.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1592 | `erisence - shibuyacyberpunkaestheticbladerunneraesthetictokyoaestheticvideobackgroundvideocyberpunkneonfuturisticcityscapeserisenceaestheticrealcultmemberyouwerenthereireallymissyounightaesthetic.mp3` | `erisence - shibuyacyberpunkaestheticbladerunneraesthetictokyoaestheticvideobackgroundvideocyberpunkneonfuturisticcityscapeserisenceaestheticrealcultmemberyouwerenthereireallymissyounightaesthetic.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1593 | `escute isso sempre que precisar(MP3_320K).mp3` | `TENHA CORAGEM DE MUDAR DE VIDA E VIVER O EXTRAORDINÁRIO. VOCÊ PODE FAZER! - MOTIVACIONAL (MOTIVAÇÃO).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1594 | `everyone knows - slowdive (slowed _ reverb)(MP3_320K).mp3` | `everyone knows - slowdive (slowed _ reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1595 | `fall in love (music video)(MP3_320K).mp3` | `yaego - fall in love (music video).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1596 | `firstclassblvd - playboi carti x adrian type beat - scenery (prod. adturnup) (slowed + reverb).mp3` | `firstclassblvd - playboi carti x adrian type beat - scenery (prod. adturnup) (slowed + reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1597 | `foreveragain (Slowed)(MP3_320K).mp3` | `XEOE - foreveragain (Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1598 | `frutiger dillon_ Gregory Dillon - solar angel (Official Music Video)(MP3_320K).mp3` | `frutiger dillon_ Gregory Dillon - solar angel.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1599 | `g3ox_em - GigaChad Theme (Phonk House Version)(MP3_320K).mp3` | `g3ox_em - GigaChad Theme (Phonk House Version) [Sped Up].mp3` | iTunes | 95.0% | RENAMED |
| 1600 | `gelowler - Afterimage.mp3` | `gelowler - Afterimage.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1601 | `ginseng(MP3_160K).mp3` | `Ahura Mazda - ginseng.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1602 | `girl in red - we fell in love in october(MP3_320K).mp3` | `girl in red - we fell in love in october.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1603 | `glass animals - heat waves ( slowed to perfection   reverb )(MP3_320K).mp3` | `glass animals - heat waves ( slowed to perfection reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1604 | `glichery _Sea Of Problems (Slowed   Reverb)_(MP3_320K).mp3` | `PHONK DOMAIN - glichery ''Sea Of Problems (Slowed + Reverb)''.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1605 | `gorduratrans - você não sabe quantas horas eu passei olhando pra você (clipe)(MP3_320K).mp3` | `Gorduratrans - Você Não Sabe Quantas Horas Eu Passei Olhando pra Você.mp3` | iTunes | 95.0% | RENAMED |
| 1606 | `gunna ft. travis scott - top floor [slowed   reverb](MP3_320K).mp3` | `gunna ft. travis scott - top floor [slowed reverb].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1607 | `hey_ are you okay_ • yves tumor - limerence (slowed   reverb   rain   distant sirens)(MP3_320K).mp3` | `hey_ are you okay_ • yves tumor - limerence (slowed reverb rain distant sirens).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1608 | `hold0ns editing - Travis Scott - BUTTERFLY EFFECT (slowed+reverb).mp3` | `hold0ns editing - Travis Scott - BUTTERFLY EFFECT (slowed+reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1609 | `howl.edit - tiptoe thru the tulips \| a musica;️ a tradução; #lyrics #traducao #musica #fy #fyp #foryou #scarrysongs.mp3` | `howl.edit - tiptoe thru the tulips - a musica;️ a tradução; #lyrics #traducao #musica #fy #fyp #foryou #scarrysongs.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1610 | `iann dior - emotions (Official Music Video)(MP3_320K).mp3` | `iann dior - emotions.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1611 | `in your arms _ mr kitty (slowed _ reverb)(MP3_320K).mp3` | `edgerunner - in your arms — mr kitty (slowed & reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1612 | `internetexplorer.1101 - mi sueño es ser rubius en japón en el 2009 #rubius #rubiusjapon2009 #uwerentreallyhereimissyou #fyp #japon #japan #anime.mp3` | `internetexplorer.1101 - mi sueño es ser rubius en japón en el 2009 #rubius #rubiusjapon2009 #uwerentreallyhereimissyou #fyp #japon #japan #anime.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1613 | `iorigun _ in the edge of something big (legendado)(MP3_160K).mp3` | `leaveya - iorigun — in the edge of something big (legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1614 | `iorigun _ wild dive (legendado)(MP3_160K).mp3` | `leaveya - iorigun — wild dive (legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1615 | `j. cole _ no role modelz ﾉ slowed   reverb ﾉ(MP3_320K).mp3` | `rum world - j. cole ~ no role modelz ﾉ slowed + reverb ﾉ.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1616 | `jnhygs, 9lives - XTAYALIVE - Slowed + Reverb.mp3` | `jnhygs & 9lives - XTAYALIVE (Slowed + Reverb).mp3` | iTunes | 95.0% | RENAMED |
| 1617 | `joji - will he(MP3_320K).mp3` | `Joji - Will He.mp3` | iTunes | 95.0% | RENAMED |
| 1618 | `juice wrld - legends (slowed   reverb)(MP3_160K).mp3` | `juice wrld - legends (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1619 | `k00pstaknicca - Koopsta Knicca - Lay It Down ft. Paul, Skinny, Gin & Lord.mp3` | `k00pstaknicca - Koopsta Knicca - Lay It Down ft. Paul, Skinny, Gin & Lord.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1620 | `ka_tro - in essence (slowed n reverb   looped)(MP3_320K).mp3` | `ka_tro - in essence (slowed n reverb looped).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1621 | `kkrashed - akiaura - deathwish (perfectly slowed + reverb) #tiktok.mp3` | `kkrashed - akiaura - deathwish (perfectly slowed + reverb) #tiktok.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1622 | `last days of summer(MP3_320K).mp3` | `vcr‐classique - last days of summer.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1623 | `lil peep - Veins ( Slowed to perfection )(MP3_320K).mp3` | `lil peep - Veins ( Slowed to perfection).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1624 | `lil peep - benz truck (prod. smokeasac)(MP3_320K).mp3` | `lil peep - benz truck (prod. smokeasac).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1625 | `lil peep X lil tracy - Favorite Dress (slowed reverb)(MP3_320K).mp3` | `lil peep X lil tracy - Favorite Dress (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1626 | `lil peep x atoms - body (instrumental)(MP3_320K).mp3` | `lil peep x atoms - body (instrumental).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1627 | `lil peep – idgaf (legendado)(MP3_320K).mp3` | `Lil Peep - IDGAF.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1628 | `lil uzi vert - xo tour life   p2 [slowed   reverb](MP3_320K).mp3` | `lil uzi vert - xo tour life p2 [slowed reverb].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1629 | `lilbubblegum - Topic - af1 (slowed and reverbed).mp3` | `lilbubblegum - af1 (slowed and reverbed).mp3` | MusicBrainz | 92.0% | RENAMED |
| 1630 | `link do zap_ pluglip _ a última dança [legendado] (slowed   reverb_tiktok viral)(MP3_320K).mp3` | `Link do Zap & pluglip - A última dança.mp3` | iTunes | 95.0% | RENAMED |
| 1631 | `liza v posteli - poison tree [lyrics](MP3_320K).mp3` | `liza v posteli - poison tree.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1632 | `lost liars _ last life (legendado)(MP3_320K).mp3` | `leaveya - lost liars — last life (legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1633 | `love nwantiti (feat. ElGrande Toto) (North African Remix)(MP3_320K).mp3` | `CKay - love nwantiti (feat. ElGrande Toto) [North African Remix].mp3` | iTunes | 90.0% | RENAMED |
| 1634 | `lumisoun - found peace on an empty street (slowed)(MP3_320K).mp3` | `lumisoun - found peace on an empty street (slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1635 | `lumisoun - loud room - slowed.mp3` | `lumisoun - loud room (slowed).mp3` | iTunes | 95.0% | RENAMED |
| 1636 | `líue - Suffer With Me (slowed).mp3` | `líue - Suffer With Me (slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1637 | `maccripdre - Triple 6 Mafia - Body Parts (1-4).mp3` | `maccripdre - Triple 6 Mafia - Body Parts (1-4).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1638 | `mareux - lovers from the past (slowed   reverb)(MP3_320K).mp3` | `Mareux - Lovers From The Past.mp3` | iTunes | 95.0% | RENAMED |
| 1639 | `maroon bat Takeshi Abo - lease.mp3` | `maroon bat Takeshi Abo - lease.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1640 | `melancholic32(MP3_320K).mp3` | `Cult Member - melancholic32.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1641 | `men at work - Land down under instrumental.mp3` | `men at work - Land down under instrumental.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1642 | `moistbreezy - Topic - Serendipity.mp3` | `moistbreezy - Serendipity.mp3` | iTunes | 95.0% | RENAMED |
| 1643 | `my_lane - This Feeling(MP3_320K).mp3` | `my_lane - This Feeling.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1644 | `n u a g e s - closer(MP3_320K).mp3` | `n u a g e s - closer.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1645 | `nbsplv - Whisper(MP3_320K).mp3` | `nbsplv - Whisper.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1646 | `nestybeats - Make it rock.mp3` | `Nestybeats - Make it rock.mp3` | iTunes | 95.0% | RENAMED |
| 1647 | `night things _ sleeping beauty (legendado)(MP3_160K).mp3` | `leaveya - night things — sleeping beauty (legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1648 | `nirvana - smells like teen spirit ( slowed   reverb )(MP3_320K).mp3` | `Nirvana - Smells Like Teen Spirit.mp3` | iTunes | 95.0% | RENAMED |
| 1649 | `niteboi - u(MP3_320K) (2).mp3` | `Niteboi - U..mp3` | iTunes | 95.0% | RENAMED |
| 1650 | `nobody here(MP3_320K).mp3` | `Sunsetcorp - Nobody Here.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1651 | `noevdv - want u - slowed + reverb.mp3` | `noevdv - Want U (slowed + reverb).mp3` | iTunes | 95.0% | RENAMED |
| 1652 | `off the menu _ lovers in seoul (legendado)(MP3_160K).mp3` | `leaveya - off the menu — lovers in seoul (legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1653 | `onimanxd - Struggle(MP3_320K).mp3` | `onimanxd - Struggle.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1654 | `pastel ghost slowed _ muffled playlist(MP3_320K).mp3` | `illusion thing - pastel ghost slowed & muffled playlist.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1655 | `peach tinted - Not Alone.mp3` | `peach tinted - Not Alone.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1656 | `playboi carti - bando [prod. ta2cute _ yugen] (slowed   432Hz   reverb)(MP3_320K).mp3` | `playboi carti - bando [prod. ta2cute _ yugen] (slowed 432Hz reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1657 | `playboi carti - iloveuihateu (slowed   reverb)(MP3_320K).mp3` | `playboi carti - iloveuihateu (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1658 | `playboi carti - midsummer nights (slowed down)(MP3_160K).mp3` | `playboi carti - midsummer nights (slowed down).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1659 | `pnb rock _ aboogie - x factor [slowed   reverb](MP3_320K).mp3` | `pnb rock _ aboogie - x factor [slowed reverb].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1660 | `purple butterfly - b последний раз (for the last time) - jeanette (slowed n reverb).mp3` | `purple butterfly - b последний раз (for the last time) - jeanette (slowed n reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1661 | `qyurisuu_ Cult Member_ Mia Martina - it_s like u weren_t really here (Remix)(MP3_320K).mp3` | `qyurisuu_ Cult Member_ Mia Martina - it_s like u weren_t really here (Remix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1662 | `r1naq - fairys cry - slowed.mp3` | `r1naq - fairy's cry - slowed.mp3` | iTunes | 95.0% | RENAMED |
| 1663 | `reggiebob - Nope Youre Too Late Im Already Dad (HIGHEST QUALITY VERSION).mp3` | `reggiebob - Nope Youre Too Late Im Already Dad (HIGHEST QUALITY VERSION).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1664 | `richarddeberryofficial - Astral Fortress - The Longing (Drowning The Light) #guitar#black#metal#dsbm#atmosphere#dungeon#synth#goth#cover.mp3` | `richarddeberryofficial - Astral Fortress - The Longing (Drowning The Light) #guitar#black#metal#dsbm#atmosphere#dungeon#synth#goth#cover.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1665 | `rod wave - thief in the night [slowed   reverb](MP3_320K).mp3` | `rod wave - thief in the night [slowed reverb].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1666 | `rum world - travis scott ~ butterfly effectﾉ slowed + reverb ﾉ.mp3` | `rum world - travis scott ~ butterfly effectﾉ slowed + reverb ﾉ.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1667 | `ryan(MP3_320K).mp3` | `Catholic Lofi - ryan.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1668 | `salvia palth - (dream).mp3` | `salvia palth - (dream).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1669 | `samurai_amv - Old Bleach... anime bleach ichigo aizen rukiya yoruichi urahara ulquiorra bankai naruto.mp3` | `samurai_amv - Old Bleach... anime bleach ichigo aizen rukiya yoruichi urahara ulquiorra bankai naruto.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1670 | `secondscene - Tender Touch – Can I See You Tomorrow (1973).mp3` | `secondscene - Tender Touch – Can I See You Tomorrow.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1671 | `self destruction worldwide broadcast(MP3_160K).mp3` | `Sewerslvt - self destruction worldwide broadcast.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1672 | `slowdive - alison (slowed   reverb)(MP3_320K).mp3` | `slowdive - alison (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1673 | `slowdive - when the sun hits [sped up muffled](MP3_320K).mp3` | `slowdive - when the sun hits [sped up muffled].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1674 | `slzy(MP3_320K).mp3` | `strach z búrky - slzy.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1675 | `snow strippers - under your spell - slowed and reverb(MP3_320K).mp3` | `snow strippers - under your spell - slowed and reverb.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1676 | `so what_(MP3_320K).mp3` | `Yaego & jsn - so what.mp3` | iTunes | 95.0% | RENAMED |
| 1677 | `something about you - eyedress ft. dent may (slowed n reverbed)(MP3_320K).mp3` | `something about you - eyedress ft. dent may (slowed n reverbed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1678 | `sped up nightcore - Watch This (Lil Uzi Vert) [ARIZONATEARS Pluggnb Remix](MP3_320K).mp3` | `sped up nightcore - Watch This (Lil Uzi Vert) [ARIZONATEARS Pluggnb Remix].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1679 | `spit in my face __ slowed x patrick bateman(MP3_320K).mp3` | `willis cuts - spit in my face - - slowed x patrick bateman.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1680 | `storage - log.mp3` | `storage - log.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1681 | `t.A.T.u. - All The Things She Said (Official Music Video)(MP3_320K).mp3` | `t.A.T.u. - All the Things She Said.mp3` | iTunes | 95.0% | RENAMED |
| 1682 | `tame impala - the less i know the better (tradução)(MP3_320K).mp3` | `tame impala - the less i know the better (tradução).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1683 | `terraplana - interlúdio(MP3_320K).mp3` | `terraplana - interlúdio.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1684 | `terraplana - lamento(MP3_320K).mp3` | `terraplana - Lamento.mp3` | iTunes | 95.0% | RENAMED |
| 1685 | `terraplana - terraplana - olhar pra trás.mp3` | `terraplana - terraplana - olhar pra trás.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1686 | `terraplana - virou crime(MP3_320K).mp3` | `terraplana - virou crime.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1687 | `the Gathering - Probably Built in the Fifties(MP3_320K).mp3` | `The Gathering - Probably Built in the Fifties.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1688 | `the sylvers - remember the rain legendado(MP3_160K).mp3` | `the sylvers - remember the rain legendado.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1689 | `the weeknd _ playboi carti - timeless (slowed   reverb)(MP3_320K).mp3` | `the weeknd _ playboi carti - timeless (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1690 | `thechaneldiet - diogos short video with original sound.mp3` | `thechaneldiet - diogos short video with original sound.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1691 | `tngusrk - Je Te Laisserai Des Mots (Extended).mp3` | `tngusrk - Je Te Laisserai Des Mots (Extended).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1692 | `travis scott _ kendrick lamar _ goosebumps ﾉ slowed   reverb ﾉ(MP3_320K).mp3` | `rum world - travis scott & kendrick lamar ~ goosebumps ﾉ slowed + reverb ﾉ.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1693 | `travis scott_ playboi carti - fe_n (slowed   reverb)(MP3_320K).mp3` | `travis scott_ playboi carti - fe_n (slowed reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1694 | `upside down (slowed   reverb)(MP3_320K).mp3` | `afterprty - upside down (slowed + reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1695 | `vague003 - drowning (slowed down   Ichigo)(MP3_320K).mp3` | `vague003 - drowning (slowed down Ichigo).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1696 | `vaporgod ft. Irokz - reverse roses (slowed to perfection)(MP3_320K).mp3` | `vaporgod ft. Irokz - reverse roses (slowed to perfection).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1697 | `velvet underground - venus in furs.mp3` | `The Velvet Underground & Nico - Venus In Furs.mp3` | iTunes | 95.0% | RENAMED |
| 1698 | `vyrval - H+3+ЯД7luCJIo0T6... (Super Slowed).mp3` | `vyrval - H+3+ЯД7luCJIo0T6... (Super Slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1699 | `wifiskeleton - nope your too late i already died 💔 (slowed _ reverb)(MP3_320K).mp3` | `wifiskeleton - nope your too late i already died 💔 (slowed _ reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1700 | `witch.tape(MP3_320K).mp3` | `SARCOMA HORROR - witch.tape.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1701 | `woest - surround me.mp3` | `woest - Surround Me.mp3` | iTunes | 95.0% | RENAMED |
| 1702 | `xxxtentacion - hope﹝slowed   reverb﹞(MP3_320K).mp3` | `xxxtentacion - hope﹝slowed reverb﹞.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1703 | `yaego_ kučka - ketamina (slowed version)(MP3_320K).mp3` | `yaego_ kučka - ketamina (slowed version).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1704 | `yot club _ japan (legendado)(MP3_320K).mp3` | `leaveya - yot club — japan (legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1705 | `yui rocha ゆいロック - cidade sem cor - yui rocha ゆいロック [post-punk br] (áudio oficial).mp3` | `yui rocha ゆいロック - cidade sem cor - yui rocha ゆいロック [post-punk br] (áudio oficial).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1706 | `yui rocha ゆいロック - vagamente (official video)(MP3_320K).mp3` | `yui rocha ゆいロック - vagamente.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1707 | `ziah150-NINJAS JUMP AROUND (Slowed   Reverb)_ (jersey club remix)(MP3_320K).mp3` | `Keysza⭐ - ziah150-NINJAS JUMP AROUND (Slowed + Reverb) - (jersey club remix).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1708 | `zindor - DJ wdieei - munchasen Syndrome HARDSTYLE (Super slowed).mp3` | `zindor - DJ wdieei - munchasen Syndrome HARDSTYLE (Super slowed).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1709 | `± SOLTER ± - E҉ v҉ i҉ l҉(MP3_320K).mp3` | `± SOLTER ± - E҉ v҉ i҉ l҉.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1710 | `É os raoul estelionatário (slowed   reverb) tiktok version(MP3_320K).mp3` | `PARADISE MUSIC - É os raoul estelionatário (Slowed + Reverb) tiktok version.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1711 | `Øfdream_ Thelema (Slowed _ Bass Boosted)(MP3_320K).mp3` | `Øfdream - Øfdream - Thelema (Slowed & Bass Boosted).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1712 | `Øneheart reidenshi - snowfall.mp3` | `Øneheart & reidenshi - Snowfall.mp3` | iTunes | 95.0% | RENAMED |
| 1713 | `ʟᴏᴠᴇʟʟ - ʟᴏᴄᴀᴛɪᴏɴ __ Night lovell - location(MP3_320K).mp3` | `ʟᴏᴠᴇʟʟ - ʟᴏᴄᴀᴛɪᴏɴ __ Night lovell - location.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1714 | `Клетка(MP3_320K).mp3` | `Клетка.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1715 | `Мать Тереза - Память.mp3` | `Мать Тереза - Память.mp3` | iTunes | 95.0% | RENAMED |
| 1716 | `Маяк - Река(MP3_320K).mp3` | `Маяк - Река.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1717 | `На Дне(MP3_320K).mp3` | `Molchat Doma - На Дне.mp3` | iTunes | 95.0% | RENAMED |
| 1718 | `ॐ ESSA VIBE VAI MUDAR A SUA VIDA ॐ  HILIGHT TRIBE.mp3` | `L.S.D MUSIC ॐ - ॐ ESSA VIBE VAI MUDAR A SUA VIDA ॐ HILIGHT TRIBE.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1719 | `• Luxxid Diamondz •(Ultra Slowed   reverb   looped)(MP3_320K).mp3` | `VaporGod - Luxxid Diamondz (Slowed).mp3` | MusicBrainz | 92.0% | RENAMED |
| 1720 | `♫♪♩·.¸¸.·é uma obra divina [север - vsn7_ asenssia]♫♪♩·.¸¸.·(MP3_320K).mp3` | `é uma obra divina [север - vsn7_ asenssia].mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1721 | `❝NINJA❞_ martial arts master subliminal(MP3_320K).mp3` | `❝NINJA❞; martial arts master subliminal.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1722 | `ミツメ (mitsume) _ 煙突 (chimney) (legendado)(MP3_160K).mp3` | `leaveya - ミツメ (mitsume) — 煙突 (chimney) (legendado).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1723 | `世界は80年代に終了しました - Incommunicado(MP3_320K).mp3` | `世界は80年代に終了しました - Incommunicado.mp3` | MusicBrainz | 92.0% | RENAMED |
| 1724 | `世界は80年代に終了しました - こんにちは友人 - Hello Friend(MP3_320K).mp3` | `世界は80年代に終了しました - こんにちは友人 - Hello Friend.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1725 | `世界は80年代に終了しました - ジェットセット - The Jet Set(MP3_320K).mp3` | `世界は80年代に終了しました - ジェットセット - The Jet Set.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1726 | `世界は80年代に終了しました - 大西洋横断の恋愛 - Transatlantic Love Affair(MP3_320K).mp3` | `世界は80年代に終了しました - 大西洋横断の恋愛 - Transatlantic Love Affair.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1727 | `世界は80年代に終了しました - 最長の日 - The Longest Day(MP3_320K).mp3` | `世界は80年代に終了しました - 最長の日 - The Longest Day.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1728 | `世界は80年代に終了しました - 月光したファントム - Moonkissed Phantoms(MP3_320K).mp3` | `世界は80年代に終了しました - 月光したファントム - Moonkissed Phantoms.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1729 | `世界は80年代に終了しました - 電気青 - Electric Blue(MP3_320K).mp3` | `世界は80年代に終了しました - 電気青 - Electric Blue.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1730 | `世界は80年代に終了しました - ２１世紀の心痛 - 21st Century Heartache(MP3_320K).mp3` | `世界は80年代に終了しました - ２１世紀の心痛 - 21st Century Heartache.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1731 | `아버지 - loosing everything(MP3_320K).mp3` | `아버지 - loosing everything.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1732 | `아버지 _ reflection(MP3_320K).mp3` | `아버지 - reflection.mp3` | LocalHeuristic | 50.0% | RENAMED |
| 1733 | `𝐒𝐎𝐌𝐄 𝐌𝐔𝐒𝐈𝐂 - Melodia Extraordinária - DJ LE4K (Slowed & Reverb).mp3` | `𝐒𝐎𝐌𝐄 𝐌𝐔𝐒𝐈𝐂 - Melodia Extraordinária - DJ LE4K (Slowed & Reverb).mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1734 | `𝖑 𝖔 𝖘 𝖙 𝖜 𝖔 𝖗 𝖑 𝖉 - KUTE - AVOID ME 1,2,3 (All Songs).mp3` | `KUTE - AVOID ME 1,2,3.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1735 | `🦍  GORILLA STACK 3.0 _ ULTIMATE BULKING PROTOCOL _ Massive Muscle Growth(MP3_320K).mp3` | `Dąniel Subs 🔱 - GORILLA STACK 3.0 - ULTIMATE BULKING PROTOCOL - Massive Muscle Growth.mp3` | LocalHeuristic | 85.0% | RENAMED |
| 1736 | `🦴[ 70 Benefits] FRAMEDOORSMAXXING PROTOCOL _ Massive _ Muscular Frame_ Huge Rib Cage and More_(MP3_320K).mp3` | `Dąniel Subs 🔱 - +70 Benefits] FRAMEDOORSMAXXING PROTOCOL - Massive & Muscular Frame, Huge Rib Cage and More!.mp3` | LocalHeuristic | 85.0% | RENAMED |
