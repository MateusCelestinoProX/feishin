# Graph Report - feishin  (2026-10-27)

## Corpus Check
- 19 files · ~104,943 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2371 nodes · 5433 edges · 116 communities (57 shown, 50 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 338 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `be5bb65c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- webgl-backgrounds.js
- _
- ar
- U
- three.min.js
- ks
- tn
- le
- .z
- V
- W
- TagsEngine
- At
- pt
- copy
- constructor
- 🚀 Customizações Incluídas
- sr
- ec
- music-analytics.js
- ws
- .update
- Lt
- vt
- Lc
- feishin-personal-os.js
- St
- sn
- ai
- e
- en
- apply_customizations.py
- nl
- patch_bundle.py
- install.sh
- restore.sh
- pt
- .copy
- se
- Tt
- Kn
- jc
- Ne
- xc
- patch_main.py
- no
- .multiplyScalar
- yc
- .constructor
- ya
- _sceneToCubeUV
- eh
- gt
- kl
- Ce
- .distanceTo
- K
- .fromArray
- bl
- tn
- .intersectMeshes
- ls
- jt
- en
- wo
- ms
- re
- .x
- updateMatrixWorld
- be
- .apply
- Et
- yo
- Xe
- ia
- .getRenderList
- yt
- gr
- Na
- q
- FeishinCDP
- ds
- rh
- parse
- .fromJSON
- je
- nc
- fl
- rc
- es
- qc
- ml
- .invert
- ct
- Jr
- bt
- ol
- .updateMatrices
- cn
- parseObject
- .addAttribute
- un
- main
- Zc
- .toJSON
- qo
- dl

## God Nodes (most connected - your core abstractions)
1. `_` - 208 edges
2. `Lt` - 135 edges
3. `copy()` - 128 edges
4. `vt` - 90 edges
5. `ws()` - 70 edges
6. `tn` - 65 edges
7. `St` - 60 edges
8. `Ce` - 59 edges
9. `sn` - 53 edges
10. `se` - 49 edges

## Surprising Connections (you probably didn't know these)
- `xi()` --indirect_call--> `f()`  [INFERRED]
  customizations/assets/ogl.js → customizations/assets/three.min.js
- `ws()` --indirect_call--> `R()`  [INFERRED]
  customizations/assets/three.min.js → customizations/assets/ogl.js
- `ws()` --indirect_call--> `L()`  [INFERRED]
  customizations/assets/three.min.js → customizations/assets/ogl.js
- `j()` --indirect_call--> `Y()`  [INFERRED]
  customizations/assets/ogl.js → customizations/assets/three.min.js
- `gt()` --indirect_call--> `j()`  [INFERRED]
  customizations/assets/three.min.js → customizations/assets/ogl.js

## Import Cycles
- None detected.

## Communities (116 total, 50 thin omitted)

### Community 0 - "webgl-backgrounds.js"
Cohesion: 0.06
Nodes (60): buildStrandsPalette(), easePower2InOut(), getOptimizedDPR(), hexToRgb(), hexToRgbArr(), initAcidSquares(), initAntigravity(), initAurora() (+52 more)

### Community 1 - "_"
Cohesion: 0.03
Nodes (50): _, ae(), at, bs(), bt(), ct(), dt, Ei (+42 more)

### Community 2 - "ar"
Cohesion: 0.08
Nodes (8): ar, dr(), kt(), mr, Ot, pr(), Ut(), yr

### Community 3 - "U"
Cohesion: 0.05
Nodes (15): ai(), ci(), di(), fi(), gi(), hi(), ii(), li() (+7 more)

### Community 4 - "three.min.js"
Cohesion: 0.04
Nodes (31): bi(), br(), bs, $c(), compileCubemapShader(), compileEquirectangularShader(), _compileMaterial(), er() (+23 more)

### Community 7 - "tn"
Cohesion: 0.15
Nodes (6): fr(), A(), E(), m(), ns(), tn

### Community 10 - "V"
Cohesion: 0.09
Nodes (3): De(), qi(), V

### Community 11 - "W"
Cohesion: 0.11
Nodes (6): Ds(), it, on, St, un, W

### Community 12 - "TagsEngine"
Cohesion: 0.14
Nodes (18): bindTracklistEvents(), checkAndInjectTagsMenuItem(), renderSubmenuItems(), ensureTagsPageMounted(), filterSongs(), findSongFromReactFiber(), formatDuration(), getActiveTargetSong() (+10 more)

### Community 13 - "At"
Cohesion: 0.05
Nodes (5): me(), pe, At, fe, ge

### Community 14 - "pt"
Cohesion: 0.10
Nodes (7): bi(), _i(), pn, pt, Si(), Ti(), vi()

### Community 15 - "copy"
Cohesion: 0.11
Nodes (3): Aa, copy(), sc

### Community 16 - "constructor"
Cohesion: 0.17
Nodes (18): constructor(), t(), l(), o(), ht(), i(), a(), ka() (+10 more)

### Community 17 - "🚀 Customizações Incluídas"
Cohesion: 0.11
Nodes (18): 10. 🛑 Kill Switch da Reprodução (Botão X + Dialog Box Glass), 1. 🌌 Arquitetura Personal OS (2-Pane Floating Glass Island), 2. 🔮 33 Shaders WebGL Interativos em Tempo Real, 3. 🇧🇷 Localização Integral em Português do Brasil (100% PT-BR), 4. ⚡ Deep UX: Expansão da Tela da Música ao Clicar na Barra, 5. ⚙️ macOS Window Bar & Preferences, 6. 🍎 Mini Painel da Barra de Menus em Vidro Apple (Apple Glassmorphism Popover), 7. 🎵 Faixas (Tracks) como Página Inicial Padrão do Sistema (+10 more)

### Community 18 - "sr"
Cohesion: 0.07
Nodes (15): er, he(), ji(), ke, Lt, sr(), C(), et() (+7 more)

### Community 20 - "music-analytics.js"
Cohesion: 0.19
Nodes (22): applyTabVisibility(), ensureSidebarAnalyticsItem(), fetchAnalyticsData(), formatDuration(), formatPlayTime(), getCoverUrl(), getCurrentPlayingSong(), getHomeStack() (+14 more)

### Community 21 - "ws"
Cohesion: 0.07
Nodes (21): dispose(), ei, s(), fi(), ni, i(), oi(), U() (+13 more)

### Community 22 - ".update"
Cohesion: 0.16
Nodes (4): cs, is, rr, Ys()

### Community 25 - "Lc"
Cohesion: 0.08
Nodes (4): bc, getInput(), getOutput(), Lc

### Community 26 - "feishin-personal-os.js"
Cohesion: 0.15
Nodes (26): applyShader(), ensureShaderContainer(), initEngine(), initFullScreenFreeSpaceDismiss(), initPlayerKillSwitch(), executeKillSwitch(), mountKillButton(), openKillSwitchGlassDialog() (+18 more)

### Community 28 - "sn"
Cohesion: 0.05
Nodes (9): an, dn, fn, hn, ln, on, pn, sn (+1 more)

### Community 30 - "e"
Cohesion: 0.18
Nodes (7): ze, cl, i(), load(), or(), e(), o()

### Community 31 - "en"
Cohesion: 0.10
Nodes (7): ca, co(), Da, v(), en, mn, p()

### Community 32 - "apply_customizations.py"
Cohesion: 0.60
Nodes (4): is_feishin_running(), main(), Feishin for macOS — Customization Engine & Installer Aplica automaticamente…, run_cmd()

### Community 34 - "nl"
Cohesion: 0.09
Nodes (3): il(), Ll, nl

### Community 40 - ".copy"
Cohesion: 0.09
Nodes (10): v(), Ie(), Ne(), or, j(), tr, R(), ui() (+2 more)

### Community 41 - "se"
Cohesion: 0.07
Nodes (5): ce(), as(), is(), os(), se

### Community 43 - "Kn"
Cohesion: 0.15
Nodes (3): fs, Jl, Kn

### Community 48 - "no"
Cohesion: 0.15
Nodes (12): ao(), eo(), ho(), io(), ja(), no(), oo(), ro() (+4 more)

### Community 49 - ".multiplyScalar"
Cohesion: 0.09
Nodes (5): clone(), A(), setDirection(), setFromCamera(), wh()

### Community 51 - ".constructor"
Cohesion: 0.11
Nodes (10): Re(), S(), gn(), gs, o(), G(), M(), b() (+2 more)

### Community 52 - "ya"
Cohesion: 0.17
Nodes (6): Ah, fh, lo(), Mh, uo(), ya

### Community 53 - "_sceneToCubeUV"
Cohesion: 0.16
Nodes (16): _applyPMREM(), _blur(), _cleanup(), fromCubemap(), fromEquirectangular(), fromScene(), _fromTexture(), $h() (+8 more)

### Community 55 - "gt"
Cohesion: 0.10
Nodes (28): _allocateTargets(), ci, d(), u(), y(), gi(), v(), mc() (+20 more)

### Community 57 - "Ce"
Cohesion: 0.08
Nodes (5): Ee(), Te(), xe(), Ce, sh

### Community 59 - "K"
Cohesion: 0.22
Nodes (3): br, K, kr

### Community 62 - "tn"
Cohesion: 0.06
Nodes (7): bo, dt(), $e(), Qe(), ss(), tn, ut()

### Community 63 - ".intersectMeshes"
Cohesion: 0.14
Nodes (3): cr, Fs(), ki()

### Community 67 - "wo"
Cohesion: 0.18
Nodes (3): jo, wo, xo

### Community 71 - "updateMatrixWorld"
Cohesion: 0.11
Nodes (6): _s(), n(), Si(), ti, updateMatrixWorld(), Wn

### Community 72 - "be"
Cohesion: 0.21
Nodes (7): be(), gt, nn(), rn, l(), h(), l()

### Community 73 - ".apply"
Cohesion: 0.17
Nodes (5): bind(), getValue(), pc, setValue(), uh()

### Community 76 - "Xe"
Cohesion: 0.08
Nodes (9): _a, cs, Do, fo(), go, hs, Rs, Xe() (+1 more)

### Community 79 - "yt"
Cohesion: 0.07
Nodes (4): hh, vi(), h(), yt

### Community 81 - "Na"
Cohesion: 0.18
Nodes (5): Ba, Ko, Na, _o, to()

### Community 82 - "q"
Cohesion: 0.23
Nodes (3): p(), q, zi()

### Community 84 - "ds"
Cohesion: 0.10
Nodes (31): ds(), F(), G(), k(), V(), z(), s(), C() (+23 more)

### Community 86 - "parse"
Cohesion: 0.19
Nodes (8): bindSkeletons(), ic, oc, parse(), parseAnimations(), parseGeometries(), parseMaterials(), parseSkeletons()

### Community 88 - ".fromJSON"
Cohesion: 0.14
Nodes (4): Al, n(), parseShapes(), zl

### Community 96 - "ml"
Cohesion: 0.10
Nodes (3): el, ml, Rl

### Community 97 - ".invert"
Cohesion: 0.14
Nodes (5): _e(), Se(), we(), yi(), qn

### Community 99 - "Jr"
Cohesion: 0.22
Nodes (7): Vr(), Jr(), kr(), nr(), qr(), vr(), zr()

### Community 100 - "bt"
Cohesion: 0.13
Nodes (8): bt, hl, ii, li(), parseImages(), parseTextures(), Ra, sl

### Community 102 - "ol"
Cohesion: 0.10
Nodes (6): ol, pl, setTexturePath(), uc, ul, vc

### Community 106 - "parseObject"
Cohesion: 0.10
Nodes (6): fa, $l, parseObject(), ta, Vs, Wl

### Community 111 - "main"
Cohesion: 0.67
Nodes (3): main(), evaluate(), send()

### Community 115 - ".toJSON"
Cohesion: 0.12
Nodes (4): ac, r(), tc, ts()

## Knowledge Gaps
- **47 isolated node(s):** `fe`, `Ei`, `J`, `H`, `ir` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 675 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_` connect `_` to `webgl-backgrounds.js`, `ar`, `U`, `ks`, `tn`, `le`, `.z`, `V`, `W`, `At`, `pt`, `sr`, `.update`, `ai`, `e`, `.copy`, `se`, `.constructor`, `Ce`, `K`, `.intersectMeshes`, `en`, `.x`, `be`, `.getRenderList`, `gr`, `q`, `.invert`, `Jr`, `.addAttribute`?**
  _High betweenness centrality (0.365) - this node is a cross-community bridge._
- **Why does `ws()` connect `ws` to `three.min.js`, `copy`, `constructor`, `sr`, `Lt`, `vt`, `St`, `ai`, `en`, `.copy`, `se`, `xc`, `.multiplyScalar`, `.constructor`, `gt`, `.distanceTo`, `tn`, `updateMatrixWorld`, `.apply`, `yo`, `Xe`, `ia`, `ds`, `parse`, `.applyMatrix4`, `ct`, `bt`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Why does `R()` connect `.copy` to `_`, `sr`, `ws`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `ws()` (e.g. with `L()` and `R()`) actually correct?**
  _`ws()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fe`, `Ei`, `J` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `webgl-backgrounds.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06288568909785483 - nodes in this community are weakly interconnected._
- **Should `_` be split into smaller, more focused modules?**
  _Cohesion score 0.03349985307081987 - nodes in this community are weakly interconnected._