<img src="assets/icons/icon.png" alt="logo" title="feishin" align="right" height="60px" width="60px" />

# 🎵 Feishin — Full Source Code & Personal OS Edition

Repositório completo contendo todo o **código-fonte oficial do Feishin (TypeScript / React / Electron)** integrado com a suíte profunda de customizações **Personal OS**: interface Glassmorphism flutuante, 33 Shaders WebGL interativos em tempo real, Mini Player Apple Glass no menu bar do macOS, Sistema de Tags, Página de Music Analytics, Tradução Integral PT-BR, Watchdog Auto-Recovery e mecanismos de resiliência ativa contra falhas.

---

## 🚀 Arquitetura & Customizações Integradas

### 1. 🌌 Arquitetura Personal OS (2-Pane Floating Glass Island)
- **Glassmorphism de Alta Fidelidade**: Superfícies translúcidas em vidro escuro fosco (`backdrop-filter: blur(28px) saturate(190%)`), iluminação sutil de borda superior e sombras orgânicas em camadas.
- **Estrutura Flutuante de 2 Painéis**: Separação limpa entre barra lateral de navegação e área de conteúdo principal flutuante sobre o plano de fundo.
- **Tipografia Moderna**: Integração nativa de fontes *Plus Jakarta Sans* e *Outfit*.

### 2. 🔮 33 Shaders WebGL Interativos em Tempo Real
Motor gráfico em tempo real renderizado sobre OGL (`ogl.js` + `webgl-backgrounds.js`):
- **🌌 Cósmico & Etéreo**: Aurora Borealis, Soft Aurora, Antigravity, Prism Light, Prismatic Burst, Liquid Ether, Luminous Orb.
- **⚡ Energia & Ondas**: Plasma Wave, Core Plasma, Neon Strands, Side Rays, Beams Flow, Lightning Storm, Line Waves.
- **🧪 Fluidos & Orgânico**: Ferrofluid, Liquid Chrome, Pure Silk, Floating Lines, Ghost Fibers, Web Threads.
- **🎮 Cyber & Arcade**: Retro Grid, Digital Matrix, Cyber Glitch, Hex Grid, Neon Rings.
- **✨ Partículas & Fogo**: Starfield, Deep Fire, Ember Drift, Stardust.
- **Painel Quadrado em 4 Colunas (Grid Mode)**: Modal com geometria rigorosamente quadrada (`aspect-ratio: 1 / 1`), grid de 4 colunas exibindo 1 shader por espaço disponível e filtros dinâmicos de categoria.
- **Controles Deslizantes**: Sliders em tempo real para ajuste de desfoque (`--personal-os-glass-blur: 0px` a `60px`) e escurecimento do fundo WebGL (`--personal-os-shader-dim: 0%` a `90%`).
- **Eco Mode & Auto-Pause**: Auto-pausa quando a janela fica minimizada ou em segundo plano via `visibilitychange`.

### 3. 🇧🇷 Localização Integral em Português do Brasil (100% PT-BR)
- Injeção profunda no motor **i18next** (`src/i18n` + `customizations/assets/pt-br-full.js`).
- Cobertura de 100% dos textos: Reprodutor, Menus, Modais, Configurações de MPV, Visualizadores de Áudio, Listas de Reprodução e Metadados.

### 4. ⚡ Deep UX: Expansão da Tela da Música ao Clicar na Barra
- Clique em qualquer espaço livre da barra inferior alterna instantaneamente entre o player normal e a **Tela da Música** (`FullScreenPlayer`).
- **Proteção Cirúrgica de Controles**: Play/Pause, barra de progresso, volume e links mantêm integridade sem acionamento acidental.

### 5. 🍎 Mini Painel da Barra de Menus em Vidro Apple (Apple Glass Popover)
- **Design Autêntico Apple Popover**: Janela flutuante no menu bar com `vibrancy: "popover"`, cantos curvos de 12px e hairline border translúcida.
- **Controles de Reprodução Ordenados**: `[ ⏮ ]` `[ -3s ]` `[ ▶ / ⏸ ]` `[ +3s ]` `[ ⏭ ]`.
- **Fila em Tempo Real**: Listagem interativa com equalizador animado na faixa atual e salto direto de faixas.
- **Ponte IPC Bidirecional**: Sincronização em tempo real entre o processo Electron Main (`src/main`), o Mini Player (`tray-panel.html`) e a store do Feishin.

### 6. 🎵 Faixas (Tracks) como Rota Inicial Padrão & Purga de Início/Álbuns
- Redirecionamento instantâneo para `/library/songs` na inicialização raiz.
- Remoção completa das páginas de Início e Álbuns da interface e do roteamento para uma experiência focada em streaming de faixas.

### 7. ⚡ Ação Rápida: Botão "Tocar a seguir" no Clique Direito
- Adiciona a ação "Tocar a seguir" diretamente no primeiro nível do menu de contexto de faixas, sem exigir a navegação por submenus.

### 8. 🛑 Kill Switch da Reprodução (Botão X no Canto Direito + Atalho Esc 2x + Dialog Box Glass)
- **Botão no Extremo Canto Direito**: Botão `✕` estilizado e integrado ao extremo canto direito da barra do player (após o controle de volume).
- **Atalho de Teclado (Esc 2x)**: Pressionar `Esc` 2 vezes consecutivas com áudio em andamento abre o dialog box glass de confirmação.
- **Navegação no Dialog Box**: Tecla `Esc` fecha o modal (cancela) e tecla `Enter` confirma como "Sim", encerrando a reprodução.
- **Encerramento Cirúrgico**: Interrupção imediata de áudio, limpeza completa da fila/playlist (`clearQueue()`) e sincronização instantânea com o Mini Painel.

### 9. 🏷️ Sistema de Tags & Menu de Contexto Dinâmico
- Motor autônomo em `feishin-tags-engine.js` para categorização inteligente de faixas por tags e metadados.

### 10. 📊 Página & Widget de Music Analytics
- Painel interativo com métricas de audição, histórico, tempo total reproduzido, distribuição por artistas e visualizadores gráficos responsivos.

### 11. 🛡️ Watchdog Auto-Recovery & SafeGuard Anti-Crash
- **Auto-Recovery no Processo Principal (`src/main/index.ts`)**: Intercepta eventos `render-process-gone` (ex: `SIGTRAP / exitCode 5`, OOM) e recupera automaticamente a janela do renderer em 300ms, eliminando a ocorrência de janelas em branco/transparentes.
- **SafeGuard WebGL Prototype**: Intercepta eventos `webglcontextlost` com `event.preventDefault()` em nível de canvas prototype para impedir que falhas de GPU encerrem o processo Chromium.
- **Troca Atômica de ASAR**: Utiliza chamada atômica do kernel (`os.replace` / `rename(2)`) no instalador, prevenindo corrupção de memória durante patches.

### 12. ⏳ Motor de Cronologia Perpétua (Samsung Music Chronology Engine)
- **Preservação de Chegada Real no Android**: Respeita rigorosamente a cronologia factual de gravação dos arquivos de áudio (`date_modified`), mapeada e documentada em [`docs/CHRONOLOGY_ARCHITECTURE.md`](docs/CHRONOLOGY_ARCHITECTURE.md).
- **Ingestão Subsonic Contínua & Forward-Compatibility**: Novas faixas adicionadas ao Navidrome são inseridas diretamente no topo via data de criação/upload com agrupamento inteligente de datas.

---

## 📂 Estrutura do Repositório

```text
feishin/
├── src/                          # CÓDIGO-FONTE COMPLETO (TypeScript / React)
│   ├── main/                     # Processo Electron Main com Auto-Recovery e Tray IPC
│   ├── preload/                  # Scripts de Preload e ponte segura IPC
│   ├── renderer/                 # Interface React + Mantine + Zustand + Shaders
│   │   ├── assets/custom/        # Módulos Personal OS, Shaders WebGL, Tags, Analytics
│   │   ├── components/           # Componentes UI (Playerbar, Sidebar, ContextMenu)
│   │   ├── features/             # Módulos de funcionalidades (Player, Lyrics, Visualizer)
│   │   └── main.tsx              # Ponto de entrada React com SafeGuard WebGL
│   ├── remote/                   # Servidor de controle remoto web
│   └── i18n/                     # Sistema de internacionalização com dataset PT-BR
├── customizations/               # Pacote modular de injeção em binários
│   ├── assets/                   # CSS, JS, Shaders WebGL, HTML e Mini Painel
│   ├── patches/                  # Patchers cirúrgicos em Python (bundle & main)
│   └── index.html                # Template HTML pré-configurado com containers WebGL
├── scripts/                      # Scripts de automação e utilitários
│   ├── apply_customizations.py   # Instalador autônomo seguro com atomic swap
│   ├── install.sh                # Executável de 1 clique para instalação no macOS
│   ├── restore.sh                # Script de reversão para versão de fábrica
│   └── build_full_pt_br.py       # Compilador do dicionário PT-BR
├── config/                       # Arquivos de configuração de janela e preferências macOS
└── package.json                  # Dependências, scripts de build (Electron-Vite)
```

---

## 🛠️ Como Executar e Compilar

### 1. Instalação de Dependências
```bash
pnpm install
```

### 2. Execução em Modo de Desenvolvimento
```bash
pnpm dev
```

### 3. Compilação para macOS (Binário `.dmg` / `.app`)
```bash
pnpm build:mac
```

### 4. Instalação Direta no Feishin Instalado no macOS
Se você já possui o `/Applications/Feishin.app` instalado, aplique todas as customizações instantaneamente:
```bash
./scripts/install.sh
```

---

## 👤 Autor & Identidade Git
- **Mantenedor Oficial**: Mateus Celestino (`202405039459@alunos.estacio.br`)
- **Conta GitHub**: [@MateusCelestinoProX](https://github.com/MateusCelestinoProX)
- **Repositório Oficial**: [github.com/MateusCelestinoProX/feishin](https://github.com/MateusCelestinoProX/feishin)
