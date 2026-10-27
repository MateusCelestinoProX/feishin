# Graph Report - feishin  (2026-10-27)

## Corpus Check
- 21 files · ~102,778 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2363 nodes · 5407 edges · 115 communities (61 shown, 48 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 338 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f5bd3808`
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
- n
- 🚀 Customizações Incluídas
- .applyMatrix4
- ls
- music-analytics.js
- ke
- .update
- Lt
- vt
- Lc
- eh
- St
- sn
- .invert
- e
- en
- apply_customizations.py
- nl
- patch_bundle.py
- install.sh
- restore.sh
- sr
- be
- se
- bt
- Kn
- jc
- Ne
- xc
- patch_main.py
- ya
- .multiplyScalar
- yc
- ys
- Ce
- _sceneToCubeUV
- pt
- .constructor
- us
- ds
- zt
- K
- .toJSON
- bl
- tn
- .copy
- mr
- jt
- en
- wo
- constructor
- re
- .x
- update
- fl
- es
- yo
- clone
- .fromArray
- mc
- yt
- gr
- Na
- q
- FeishinCDP
- ps
- fo
- ic
- qc
- .fromJSON
- Xe
- nc
- ct
- rc
- updateMatrixWorld
- main
- el
- ml
- Y
- Al
- ge
- Rl
- ol
- bind
- rh
- gt
- qo
- ws
- main
- ss
- main
- Zc
- fn
- on

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

## Communities (115 total, 48 thin omitted)

### Community 0 - "webgl-backgrounds.js"
Cohesion: 0.06
Nodes (60): buildStrandsPalette(), easePower2InOut(), getOptimizedDPR(), hexToRgb(), hexToRgbArr(), initAcidSquares(), initAntigravity(), initAurora() (+52 more)

### Community 1 - "_"
Cohesion: 0.03
Nodes (50): _, ae(), at, bs(), bt(), ce(), ct(), dt (+42 more)

### Community 2 - "ar"
Cohesion: 0.13
Nodes (4): ar, dr(), pr(), _r

### Community 3 - "U"
Cohesion: 0.06
Nodes (14): ai(), di(), fi(), gi(), hi(), ii(), li(), mi() (+6 more)

### Community 4 - "three.min.js"
Cohesion: 0.03
Nodes (38): Vr(), bs, $c(), compileCubemapShader(), compileEquirectangularShader(), _compileMaterial(), Ga, Hi() (+30 more)

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
Nodes (17): bindTracklistEvents(), checkAndInjectTagsMenuItem(), renderSubmenuItems(), ensureTagsPageMounted(), filterSongs(), findSongFromReactFiber(), formatDuration(), getActiveTargetSong() (+9 more)

### Community 13 - "At"
Cohesion: 0.06
Nodes (4): me(), pe, At, fe

### Community 14 - "pt"
Cohesion: 0.08
Nodes (9): bi(), Fs(), _i(), pn, pt, Si(), Ti(), vi() (+1 more)

### Community 15 - "copy"
Cohesion: 0.06
Nodes (5): Aa, copy(), ec, sc, tc

### Community 16 - "n"
Cohesion: 0.23
Nodes (6): ze, er(), je, oi(), r(), n()

### Community 17 - "🚀 Customizações Incluídas"
Cohesion: 0.11
Nodes (17): 1. 🌌 Arquitetura Personal OS (2-Pane Floating Glass Island), 2. 🔮 33 Shaders WebGL Interativos em Tempo Real, 3. 🇧🇷 Localização Integral em Português do Brasil (100% PT-BR), 4. ⚡ Deep UX: Expansão da Tela da Música ao Clicar na Barra, 5. ⚙️ macOS Window Bar & Preferences, 6. 🍎 Mini Painel da Barra de Menus em Vidro Apple (Apple Glassmorphism Popover), 7. 🎵 Faixas (Tracks) como Página Inicial Padrão do Sistema, 8. ⚡ Ação Rápida: Botão "Tocar a seguir" no Menu Principal do Clique Direito sobre a Faixa (+9 more)

### Community 18 - ".applyMatrix4"
Cohesion: 0.06
Nodes (8): qs(), ri(), Ys(), ai, Ea(), jn(), b(), Xn()

### Community 20 - "music-analytics.js"
Cohesion: 0.10
Nodes (38): applyShader(), ensureShaderContainer(), initEngine(), initFullScreenFreeSpaceDismiss(), initPlayerSplitQueue(), initTrayBridge(), broadcastState(), getCoverUrl() (+30 more)

### Community 21 - "ke"
Cohesion: 0.10
Nodes (8): er, v(), ji(), ke, j(), tr, R(), ue()

### Community 22 - ".update"
Cohesion: 0.17
Nodes (3): cs, is, rr

### Community 25 - "Lc"
Cohesion: 0.08
Nodes (4): bc, getInput(), getOutput(), Lc

### Community 28 - "sn"
Cohesion: 0.05
Nodes (9): an, cn, dn, hn, ln, pn, sn, un (+1 more)

### Community 29 - ".invert"
Cohesion: 0.14
Nodes (4): _e(), we(), yi(), qn

### Community 30 - "e"
Cohesion: 0.20
Nodes (10): br(), cl, i(), hl, il(), load(), parse(), parseImages() (+2 more)

### Community 31 - "en"
Cohesion: 0.08
Nodes (8): ca, co(), Da, en, v(), mn, i(), yn()

### Community 32 - "apply_customizations.py"
Cohesion: 0.67
Nodes (3): main(), Feishin for macOS — Customization Engine & Installer Aplica automaticamente…, run_cmd()

### Community 39 - "sr"
Cohesion: 0.14
Nodes (7): he(), Lt, sr(), C(), N(), ur(), xn

### Community 40 - "be"
Cohesion: 0.15
Nodes (8): be(), gt, nn(), rn, l(), Se(), h(), l()

### Community 42 - "bt"
Cohesion: 0.10
Nodes (12): bt, ei, s(), gn(), i(), a(), o(), ii (+4 more)

### Community 43 - "Kn"
Cohesion: 0.12
Nodes (4): fs, Jl, Kn, vl()

### Community 48 - "ya"
Cohesion: 0.08
Nodes (18): Ah, ao(), eo(), fh, ho(), io(), ja(), lo() (+10 more)

### Community 49 - ".multiplyScalar"
Cohesion: 0.12
Nodes (5): as(), is(), os(), setDirection(), setFromCamera()

### Community 51 - "ys"
Cohesion: 0.24
Nodes (3): vs(), gs, ys

### Community 52 - "Ce"
Cohesion: 0.06
Nodes (12): Ee(), Re(), Te(), xe(), Ce, fa, $l, parseObject() (+4 more)

### Community 53 - "_sceneToCubeUV"
Cohesion: 0.11
Nodes (21): _allocateTargets(), _applyPMREM(), _blur(), _cleanup(), Et, fromCubemap(), fromEquirectangular(), fromScene() (+13 more)

### Community 55 - ".constructor"
Cohesion: 0.10
Nodes (14): d(), u(), v(), y(), mi(), f(), g(), m() (+6 more)

### Community 56 - "us"
Cohesion: 0.23
Nodes (3): kl, Ql, us()

### Community 57 - "ds"
Cohesion: 0.20
Nodes (9): ds(), F(), G(), k(), V(), z(), F(), z() (+1 more)

### Community 58 - "zt"
Cohesion: 0.21
Nodes (4): Ie(), Ne(), or, zt

### Community 59 - "K"
Cohesion: 0.13
Nodes (5): br, K, kr, nr, zr

### Community 60 - ".toJSON"
Cohesion: 0.09
Nodes (3): ac, r(), dl

### Community 62 - "tn"
Cohesion: 0.06
Nodes (6): bo, dt(), $e(), Qe(), tn, ut()

### Community 63 - ".copy"
Cohesion: 0.10
Nodes (5): ci(), cr, ki(), ui(), ye()

### Community 64 - "mr"
Cohesion: 0.12
Nodes (5): kt(), mr, Ot, Ut(), yr

### Community 67 - "wo"
Cohesion: 0.20
Nodes (3): jo, wo, xo

### Community 68 - "constructor"
Cohesion: 0.24
Nodes (17): constructor(), t(), gi(), l(), o(), ka(), c(), p() (+9 more)

### Community 71 - "update"
Cohesion: 0.14
Nodes (12): ci, dispose(), ni, pi(), p(), Si(), ti, update() (+4 more)

### Community 76 - "clone"
Cohesion: 0.13
Nodes (3): clone(), ts(), Tt

### Community 77 - ".fromArray"
Cohesion: 0.12
Nodes (5): S(), hh, la, M(), b()

### Community 78 - "mc"
Cohesion: 0.23
Nodes (3): dc, mc(), pc

### Community 79 - "yt"
Cohesion: 0.08
Nodes (3): vi(), h(), yt

### Community 81 - "Na"
Cohesion: 0.20
Nodes (5): Ba, Ko, Na, _o, to()

### Community 84 - "ps"
Cohesion: 0.31
Nodes (8): ps(), B(), I(), N(), V(), W(), X(), z()

### Community 85 - "fo"
Cohesion: 0.24
Nodes (4): fo(), mo(), l(), po

### Community 88 - ".fromJSON"
Cohesion: 0.14
Nodes (4): n(), parseShapes(), Yl, zl

### Community 89 - "Xe"
Cohesion: 0.08
Nodes (10): _a, cs, Do, go, hs, Rs, w(), Vs (+2 more)

### Community 93 - "updateMatrixWorld"
Cohesion: 0.14
Nodes (3): _s(), n(), updateMatrixWorld()

### Community 97 - "Y"
Cohesion: 0.40
Nodes (5): et(), L(), tt(), xs(), Y()

### Community 101 - "ol"
Cohesion: 0.09
Nodes (8): oc, ol, parseGeometries(), pl, setTexturePath(), uc, ul, vc

### Community 103 - "bind"
Cohesion: 0.29
Nodes (5): bind(), bindSkeletons(), getValue(), parseSkeletons(), setValue()

### Community 106 - "gt"
Cohesion: 0.18
Nodes (8): bi(), fi(), li(), ms(), K(), Q(), gt(), _t()

### Community 108 - "ws"
Cohesion: 0.13
Nodes (17): s(), A(), C(), G(), H(), O(), U(), J() (+9 more)

### Community 111 - "main"
Cohesion: 0.67
Nodes (3): main(), evaluate(), send()

## Knowledge Gaps
- **46 isolated node(s):** `fe`, `Ei`, `J`, `H`, `ir` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 677 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_` connect `_` to `webgl-backgrounds.js`, `ar`, `U`, `three.min.js`, `ks`, `tn`, `le`, `.z`, `V`, `W`, `At`, `pt`, `n`, `.applyMatrix4`, `ke`, `.update`, `.invert`, `sr`, `be`, `ys`, `Ce`, `zt`, `K`, `.copy`, `mr`, `en`, `.x`, `gr`, `q`?**
  _High betweenness centrality (0.374) - this node is a cross-community bridge._
- **Why does `ws()` connect `ws` to `three.min.js`, `copy`, `n`, `.applyMatrix4`, `ke`, `Lt`, `vt`, `St`, `.invert`, `en`, `se`, `bt`, `xc`, `.multiplyScalar`, `_sceneToCubeUV`, `.constructor`, `ds`, `tn`, `constructor`, `update`, `yo`, `ps`, `Xe`, `nc`, `ct`, `updateMatrixWorld`, `Y`, `bind`, `gt`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `R()` connect `ke` to `_`, `ws`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `ws()` (e.g. with `L()` and `R()`) actually correct?**
  _`ws()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fe`, `Ei`, `J` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `webgl-backgrounds.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06288568909785483 - nodes in this community are weakly interconnected._
- **Should `_` be split into smaller, more focused modules?**
  _Cohesion score 0.03283173734610123 - nodes in this community are weakly interconnected._