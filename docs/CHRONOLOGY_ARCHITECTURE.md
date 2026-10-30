# 🧭 Samsung Music Chronology Engine — Arquitetura de Preservação Perpétua

> **Documento Oficial de Engenharia — Feishin Mobile Pro & Desktop Personal OS**  
> **Proprietário & Arquiteto:** Mateus Celestino Pro  
> **Status:** Ativo, Imutável e Integrado ao Git

---

## 📌 1. Princípio Fundamental & Origem Histórica

No aplicativo **Samsung Music**, a aba **"Adicionadas recentemente"** não se baseia nas tags ID3 voláteis de lançamento ou ano do álbum (`year` ou `releaseDate`). Ela é governada estritamente pelo campo `date_modified` do banco de dados SQLite do **Android MediaStore** (`/data/data/com.android.providers.media/databases/external.db`).

Em termos práticos e factuais:
> **A ordem do Samsung Music é exatamente a cronologia em que cada arquivo de áudio foi baixado, recebido ou gravado no armazenamento do smartphone Android por Mateus Celestino.**

Essa ordem reflete a história viva da biblioteca musical e deve ser preservada perpetuamente, independentemente de futuros dispositivos, reinstalações, formatações ou mesmo se o Samsung Music deixar de existir.

---

## 🏛️ 2. Preservação no Repositório (Base Imutável no Git)

Para garantir que a biblioteca nunca dependa de um app específico ou de conexões efêmeras, a cronologia foi extraída via Android ADB diretamente do MediaStore físico e consolidada em dois artefatos centrais versionados no repositório:

1. **[`samsung-music-chronology.json`](../app/src/main/assets/assets/samsung-music-chronology.json)**:
   - Dicionário de 1.741 registros mapeados pelo ID permanente do Navidrome.
   - Cada entrada contém:
     - `rank`: Posição ordinal exata no Samsung Music (de `0` para a mais recente a `1744` para a mais antiga).
     - `date_modified`: Timestamp Unix em segundos da gravação física no Android.
     - `isoDate`: Timestamp ISO-8601 (`YYYY-MM-DDTHH:mm:ss`).
     - `formatted`: Data formatada para a interface brasileira (`DD/MM/YYYY às HH:mm`).
     - `filename`: Nome original do arquivo físico no disco.

2. **[`samsung-music-chronology.js`](../app/src/main/assets/assets/samsung-music-chronology.js)**:
   - Exportação em JavaScript nativo contendo:
     - `window.__SAMSUNG_MUSIC_CHRONOLOGY__`: Mapeamento por ID nativo.
     - `window.__SAMSUNG_MUSIC_BY_TITLE__`: Mapeamento por normalização de título e nome de arquivo (resiliência total contra reindexações no servidor que alterem IDs).

### Marco de Corte do Snapshot Histórico (Baseline):
- **Faixa nº 1 do Samsung Music (`rank: 0`):** `187 Family - "Drinking" (Remastered)` — *MemphisRapRemastered* (`27/10/2026 às 23:45:29` / `1793155529` Unix).
- **Faixa nº 2 do Samsung Music (`rank: 1`):** `Only by Man (Platino)` — *Shinnobu* (`23/10/2026 às 12:32:16` / `1792769536` Unix).
- **Cutoff Oficial da Baseline:** `1793155530000` ms (27/10/2026 às 23:45:30).

---

## ⚡ 3. Algoritmo Dinâmico para Novas Músicas (Forward Compatibility)

Todas as faixas que entrarem no acervo a partir do marco de corte seguem a mesma regra imutável: **a ordem de chegada dita a posição temporal.**

O motor de ordenação em [`feishin-recently-added.js`](../app/src/main/assets/assets/feishin-recently-added.js) opera sob a seguinte lógica determinística:

```javascript
function sortChronologically(songs) {
  songs.sort((a, b) => {
    const aIsNew = !a.isSamsungOrder && a.sortTimestamp > SAMSUNG_BASELINE_CUTOFF_MS;
    const bIsNew = !b.isSamsungOrder && b.sortTimestamp > SAMSUNG_BASELINE_CUTOFF_MS;

    // 1. Novas faixas adicionadas após a baseline ganham o topo absoluto
    if (aIsNew && bIsNew) {
      return b.sortTimestamp - a.sortTimestamp;
    }
    if (aIsNew) return -1;
    if (bIsNew) return 1;

    // 2. Faixas do baseline Samsung Music ordenadas estritamente pelo rank ordinal
    if (a.isSamsungOrder && b.isSamsungOrder) {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return b.sortTimestamp - a.sortTimestamp;
    }
    if (a.isSamsungOrder && a.rank < 999999) return -1;
    if (b.isSamsungOrder && b.rank < 999999) return 1;

    // 3. Faixas residuais sem ranking
    return b.sortTimestamp - a.sortTimestamp;
  });
}
```

### Comportamento Resultante:
1. **Novas Músicas Adicionadas (Hoje / Futuro):**
   - Recebem `sortTimestamp = new Date(creationTime).getTime()` a partir do atributo `created` ou data de criação do arquivo de áudio.
   - Como sua data é posterior a 23/10/2026 (`> 1792769536000`), elas **assumem automaticamente o topo da aba Recentes**, à frente da faixa `rank: 0`.
   - Se múltiplas novas faixas forem adicionadas, elas são ordenadas entre si da mais nova para a mais antiga.
2. **Faixas Históricas (Snapshot Samsung):**
   - Mantêm sua sequência imutável garantida pelo `rank` (0, 1, 2, ..., 1743).
3. **Faixas Não Catalogadas no Snapshot Anterior:**
   - São acomodadas suavemente na sua respectiva janela temporal com base na data de arquivo do servidor.

---

## 🎨 4. Agrupamento Hierárquico Visual

A interface visual decompõe as faixas cronologicamente em cartões translúcidos (Liquid Glass):
- **"Hoje" / "Ontem":** Faixas recém-adicionadas recebem destaque imediato com ícone de energia (`⚡`) e horário de importação.
- **Dias Específicos do Mês Atual (`DD de Mês de AAAA`):** Agrupamento diário com indicação do dia da semana (ex: *"Sexta-feira • Adicionadas recentemente no dispositivo"*).
- **Meses & Anos Anteriores (`Mês de AAAA` e `Ano de 2025`):** Agrupamento de arquivo histórico de alta densidade com total de faixas por período.

---

## 🔒 5. Garantia de Longo Prazo

Mesmo que o dispositivo Android seja trocado, formatado ou o ecossistema Samsung não esteja mais em uso:
1. Os dados da cronologia residem de forma definitiva neste repositório Git.
2. A aplicação consulta o banco local estático antes de qualquer chamada de rede.
3. Todas as plataformas futuras (Feishin Mobile, Desktop macOS ou Web) herdam essa inteligência sem risco de desordenação.
