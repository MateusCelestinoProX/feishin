# 🎵 Feishin for macOS — Customizações Profundas & Personal OS

Repositório oficial contendo todas as customizações avançadas de interface, shaders WebGL interativos, tradução integral para Português do Brasil e refinamentos profundos de UX desenvolvidos para o **Feishin** (cliente de streaming de música moderno compatível com Navidrome, Subsonic e Jellyfin) no **macOS**.

---

## 🚀 Customizações Incluídas

### 1. 🌌 Arquitetura Personal OS (2-Pane Floating Glass Island)
- **Glassmorphism de Alta Fidelidade**: Superfícies translúcidas em vidro escuro fosco (`backdrop-filter: blur(28px) saturate(190%)`), iluminação sutil de borda superior e sombras orgânicas em camadas.
- **Estrutura Flutuante de 2 Painéis**: Separação limpa entre barra lateral de navegação e área de conteúdo principal flutuante sobre o plano de fundo.
- **Tipografia Moderna**: Integração nativa de fontes *Plus Jakarta Sans* e *Outfit*.
- **Scrollbars & Inputs Sleek**: Barras de rolagem ultra-finas e campos de pesquisa com foco suave e iluminação violeta.

### 2. 🔮 33 Shaders WebGL Interativos em Tempo Real
Motor gráfico em tempo real renderizado sobre OGL (`ogl.js` + `webgl-backgrounds.js` + `feishin-personal-os.js`):
- **🌌 Cósmico & Etéreo**: Aurora Borealis, Soft Aurora, Antigravity, Prism Light, Prismatic Burst, Liquid Ether, Luminous Orb.
- **⚡ Energia & Ondas**: Plasma Wave, Core Plasma, Neon Strands, Side Rays, Beams Flow, Lightning Storm, Line Waves.
- **🧪 Fluidos & Orgânico**: Ferrofluid, Liquid Chrome, Pure Silk, Floating Lines, Ghost Fibers, Web Threads.
- **🎮 Cyber & Arcade**: Retro Grid, Digital Matrix, Cyber Glitch, Hex Grid, Neon Rings.
- **✨ Partículas & Fogo**: Starfield, Deep Fire, Ember Drift, Stardust.
- **Modal de Controle Flutuante**: Seletor rápido de shaders na interface, botão **Eco Mode** para economia de bateria e **Modo Rotativo** automático.
- **Gestão Térmica e de Bateria**: Auto-pausa quando o Feishin é minimizado ou fica em segundo plano (`visibilitychange`).

### 3. 🇧🇷 Localização Integral em Português do Brasil (100% PT-BR)
- Injeção profunda no motor **i18next** (`window.__PT_BR_FULL__` + `pt-br-full.js`).
- Cobertura de 100% dos textos: Reprodutor, Menus, Modais, Configurações de MPV, Visualizadores de Áudio, Listas de Reprodução e Metadados.
- Scripts automatizados de compilação e enriquecimento de vocabulário (`scripts/build_full_pt_br.py`).

### 4. ⚡ Deep UX: Expansão da Tela da Música ao Clicar na Barra
- Clique em qualquer espaço livre da barra inferior alterna instantaneamente entre o player normal e a **Tela da Música** (`FullScreenPlayer`).
- **Proteção Cirúrgica de Controles**: Play/Pause, barra de progresso (scrubber), controle de volume, links de artista/álbum, botões de ação e arrasto mantêm 100% de integridade sem acionamento acidental.
- Affordance visual com `cursor: pointer` na área livre do player bar container.

### 5. ⚙️ macOS Window Bar & Preferences
- Configuração pré-otimizada em `config/macos-config.json` para barra de títulos estilo nativo macOS, hotkeys globais e integração de bandeja.

---

## 📂 Estrutura do Repositório

```text
feishin/
├── customizations/
│   ├── assets/
│   │   ├── feishin-personal-os.css   # Estilo Master Glassmorphism & 2-Pane Island
│   │   ├── feishin-personal-os.js    # UI Switcher de Shaders, atalhos e ciclo de vida
│   │   ├── webgl-backgrounds.js      # Motor com os 33 shaders WebGL em tempo real
│   │   ├── ogl.js                    # Micro-biblioteca WebGL ultra-eficiente
│   │   └── pt-br-full.js             # Dicionário e runtime injector de PT-BR
│   ├── i18n/
│   │   └── feishin_pt_full.json      # Dataset completo de traduções em formato JSON
│   ├── patches/
│   │   └── patch_bundle.py           # Patch cirúrgico do bundle React (i18n + click bar)
│   └── index.html                    # Template HTML modificado com containers WebGL
├── scripts/
│   ├── apply_customizations.py       # Engine autônoma de patch e injeção no app.asar
│   ├── install.sh                    # Script de instalação com 1 clique para macOS
│   ├── restore.sh                    # Script de restauração (rollback para stock)
│   └── build_full_pt_br.py           # Compilador do dicionário de idiomas PT-BR
└── config/
    └── macos-config.json             # Preferências recomendadas do Feishin no macOS
```

---

## 🛠️ Como Instalar no macOS

### Requisitos
- macOS com Feishin instalado em `/Applications/Feishin.app`
- Node.js instalado (para o utilitário `@electron/asar`)
- Python 3

### Instalação em 1 Comando
```bash
./scripts/install.sh
```

O script irá:
1. Criar um backup automático (`app.asar.bak`) se ainda não existir.
2. Desempacotar o `app.asar` em área temporária.
3. Injetar todos os assets visuais, shaders e a tradução PT-BR.
4. Aplicar os patches no bundle JavaScript React.
5. Reempacotar e aplicar o novo `app.asar`.
6. Re-assinar o binário no macOS via `codesign` ad-hoc.
7. Reiniciar o Feishin para exibir as novidades imediatamente.

---

## 🔄 Como Desinstalar (Restaurar Original)

Para retornar ao Feishin de fábrica sem customizações:
```bash
./scripts/restore.sh
```

---

## 👤 Autor & Identidade Git
- **Mantenedor Oficial**: Mateus Celestino (`202405039459@alunos.estacio.br`)
- **Conta GitHub**: [@MateusCelestinoProX](https://github.com/MateusCelestinoProX)
