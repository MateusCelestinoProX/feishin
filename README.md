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
- **Painel Quadrado em 4 Colunas (Grid Mode)**: Modal com geometria rigorosamente quadrada (`aspect-ratio: 1 / 1`), grid de 4 colunas exibindo 1 shader por espaço disponível e filtros dinâmicos de categoria.
- **Controle Deslizante de Blur do Vidro**: Slider em tempo real ajustando o desfoque de todos os painéis glassmorphic (`--personal-os-glass-blur: 0px` a `60px`).
- **Controle Deslizante de Escurecimento do Shader**: Slider em tempo real atenuando o background WebGL (`--personal-os-shader-dim: 0%` a `90%`).
- **Gestão Térmica e de Bateria**: Auto-pausa quando o Feishin é minimizado ou fica em segundo plano (`visibilitychange`), além dos botões **Eco Mode** e **Modo Rotativo** automático.

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

### 6. 🍎 Mini Painel da Barra de Menus em Vidro Apple (Apple Glassmorphism Popover)
- **Design Autêntico Apple Popover**: Janela flutuante no menu bar com `vibrancy: "popover"`, transparência real, cantos curvos de 12px, hairline border translúcida e design monocromático ultra-minimal sem opacidades sólidas ou gradientes.
- **Controles de Reprodução Ordenados**: Ordem cirúrgica de controles: `[ ⏮ Retroceder ]` `[ -3s ]` `[ ▶ / ⏸ Play/Pause ]` `[ +3s ]` `[ ⏭ Avançar ]`.
- **Fila de Reprodução em Tempo Real**: Listagem interativa da playlist ou fila de reprodução tocando no momento com indicação animada de equalizador na faixa atual e clique direto para pular faixas.
- **Arquitetura IPC Bidirecional**: Sincronização em tempo real entre o processo Electron Main (`patch_main.py`), a janela do Mini Player (`tray-panel.html`) e o store Zustand do Feishin via ponte injetada (`feishin-personal-os.js`).
- **Integração de Bandeja Nativa**: Clique com o botão esquerdo no ícone da barra de menus abre o popover; clique com o botão direito preserva o menu de contexto nativo do macOS.

### 7. 🎵 Faixas (Tracks) como Página Inicial Padrão do Sistema
- **Inicialização Direta em Faixas**: Redirecionamento instantâneo para `/library/songs` no carregamento raiz sem flicker, garantindo acesso imediato à biblioteca completa de faixas.
- **Roteamento e Integridade Total**: Roteamento inicial index via `<Navigate to="/library/songs" replace />`, garantindo que a barra lateral mantenha o item "Faixas" ativado por padrão e preserve o acesso a "Início" em `/home`.

### 8. ⚡ Ação Rápida: Botão "Tocar a seguir" no Menu Principal do Clique Direito sobre a Faixa
- **Acesso Direto Sem Submenus**: Adiciona a ação "Tocar a seguir" (ícone `mediaPlayNext`) diretamente na lista principal do menu de contexto ao clicar com o botão direito sobre qualquer faixa (`he.SONG`, `he.PLAYLIST_SONG`, `he.QUEUE_SONG`).
- **Ergonomia e Alta Densidade de Ação**: Elimina a necessidade de abrir o submenu "Tocar >" para enfileirar uma faixa para reprodução imediata a seguir.
- **Suporte Multi-Seleção**: Suporta seleção individual ou múltipla de faixas com adição instantânea à fila via `addToQueueByData` / `addToQueueByFetch`.

### 9. 🚫 Remoção Completa da Página de Álbuns (Interface e Código)
- **Eliminação Visual da Barra Lateral**: Remoção definitiva do item "Álbuns" do menu de navegação da biblioteca (sidebar padrão e sidebar recolhida/mobile).
- **Roteamento Cirúrgico com Redirecionamento**: Substituição da rota `/library/albums` por `<Navigate to="/library/songs" replace />`, garantindo que qualquer link residual redirecione instantaneamente para Faixas.
- **Sanitização de Configurações e Paleta de Comandos**: Purga de `Albums` das preferências de reordenação de itens de barra lateral (`Hle`), da paleta de atalhos e do armazenamento persistente (`store_settings`).

---

## 📂 Estrutura do Repositório

```text
feishin/
├── customizations/
│   ├── assets/
│   │   ├── feishin-personal-os.css   # Estilo Master Glassmorphism & 2-Pane Island
│   │   ├── feishin-personal-os.js    # UI Switcher, ponte IPC do Tray e ciclo de vida
│   │   ├── tray-panel.html           # Mini painel popover da bandeja em Apple Glassmorphism
│   │   ├── webgl-backgrounds.js      # Motor com os 33 shaders WebGL em tempo real
│   │   ├── ogl.js                    # Micro-biblioteca WebGL ultra-eficiente
│   │   └── pt-br-full.js             # Dicionário e runtime injector de PT-BR
│   ├── i18n/
│   │   └── feishin_pt_full.json      # Dataset completo de traduções em formato JSON
│   ├── patches/
│   │   ├── patch_bundle.py           # Patch cirúrgico do bundle React (i18n, player store e click bar)
│   │   └── patch_main.py             # Patch do Electron Main e Preload para janela e IPC do Tray
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
