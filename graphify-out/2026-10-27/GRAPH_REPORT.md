# Graph Report - feishin  (2026-10-27)

## Corpus Check
- 14 files · ~92,151 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2280 nodes · 5235 edges · 122 communities (57 shown, 57 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 337 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `67b6e3f5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- webgl-backgrounds.js
- _
- ar
- U
- three.min.js
- ks
- ls
- tn
- le
- .z
- V
- it
- sr
- At
- W
- copy
- ws
- 🚀 Customizações Incluídas
- .constructor
- es
- feishin-personal-os.js
- en
- .update
- Lt
- vt
- Lc
- eh
- St
- sn
- .constructor
- e
- en
- apply_customizations.py
- nl
- patch_bundle.py
- install.sh
- restore.sh
- .constructor
- pt
- se
- yt
- Kn
- jc
- .normalize
- xc
- patch_main.py
- no
- yc
- pl
- Ce
- _sceneToCubeUV
- pt
- constructor
- kl
- je
- zt
- gt
- .toJSON
- bl
- tn
- ke
- .copy
- jt
- Hi
- .subVectors
- update
- re
- mr
- .removeEventListener
- ya
- fl
- ia
- yo
- ct
- .fromArray
- K
- bt
- qc
- Na
- yr
- wo
- .getRenderList
- q
- .x
- clone
- .fromJSON
- fo
- nc
- gr
- .invert
- ge
- el
- ml
- mi
- .applyMatrix4
- .addAttribute
- .apply
- dc
- .equals
- qo
- .setHSL
- ds
- Rl
- rc
- Zc
- Vs
- ms
- ss
- qh
- xs
- _a
- Do
- .copyLinearToSRGB
- bo

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
- `tt()` --indirect_call--> `Y()`  [INFERRED]
  customizations/assets/ogl.js → customizations/assets/three.min.js
- `gt()` --indirect_call--> `tt()`  [INFERRED]
  customizations/assets/three.min.js → customizations/assets/ogl.js

## Import Cycles
- None detected.

## Communities (122 total, 57 thin omitted)

### Community 0 - "webgl-backgrounds.js"
Cohesion: 0.06
Nodes (61): gt, buildStrandsPalette(), easePower2InOut(), getOptimizedDPR(), hexToRgb(), hexToRgbArr(), initAcidSquares(), initAntigravity() (+53 more)

### Community 1 - "_"
Cohesion: 0.03
Nodes (47): _, ae(), at, bs(), bt(), ce(), ct(), dt (+39 more)

### Community 3 - "U"
Cohesion: 0.05
Nodes (17): ai(), ci(), di(), _e(), fi(), gi(), hi(), ii() (+9 more)

### Community 4 - "three.min.js"
Cohesion: 0.04
Nodes (18): bi(), br(), bs, $c(), fi(), intersectObject(), intersectObjects(), ir() (+10 more)

### Community 7 - "tn"
Cohesion: 0.15
Nodes (6): fr(), A(), E(), m(), ns(), tn

### Community 9 - ".z"
Cohesion: 0.07
Nodes (7): Gs(), Hs(), Os(), Ps(), qs(), Rt(), Xs()

### Community 10 - "V"
Cohesion: 0.08
Nodes (4): De(), ji(), qi(), V

### Community 11 - "it"
Cohesion: 0.17
Nodes (3): Ds(), it, St

### Community 12 - "sr"
Cohesion: 0.18
Nodes (7): sr(), C(), et(), L(), N(), tt(), xs()

### Community 13 - "At"
Cohesion: 0.06
Nodes (4): pe, xe(), At, fe

### Community 14 - "W"
Cohesion: 0.08
Nodes (13): be(), Fs(), nn(), on, pn, rn, l(), un (+5 more)

### Community 15 - "copy"
Cohesion: 0.10
Nodes (4): ai, copy(), cs, ec

### Community 16 - "ws"
Cohesion: 0.16
Nodes (13): A(), C(), f(), m(), mt(), _t, ws(), At() (+5 more)

### Community 17 - "🚀 Customizações Incluídas"
Cohesion: 0.12
Nodes (15): 1. 🌌 Arquitetura Personal OS (2-Pane Floating Glass Island), 2. 🔮 33 Shaders WebGL Interativos em Tempo Real, 3. 🇧🇷 Localização Integral em Português do Brasil (100% PT-BR), 4. ⚡ Deep UX: Expansão da Tela da Música ao Clicar na Barra, 5. ⚙️ macOS Window Bar & Preferences, 6. 🍎 Mini Painel da Barra de Menus em Vidro Apple (Apple Glassmorphism Popover), 7. 🎵 Faixas (Tracks) como Página Inicial Padrão do Sistema, 👤 Autor & Identidade Git (+7 more)

### Community 20 - "feishin-personal-os.js"
Cohesion: 0.20
Nodes (19): applyShader(), ensureShaderContainer(), initEngine(), initFullScreenFreeSpaceDismiss(), initPlayerSplitQueue(), initTrayBridge(), broadcastState(), getCoverUrl() (+11 more)

### Community 22 - ".update"
Cohesion: 0.15
Nodes (4): cs, is, rr, Ys()

### Community 25 - "Lc"
Cohesion: 0.07
Nodes (6): bc, getInput(), getOutput(), ic, Lc, parseMaterials()

### Community 28 - "sn"
Cohesion: 0.05
Nodes (11): an, cn, dn, fn, hn, ln, on, pn (+3 more)

### Community 29 - ".constructor"
Cohesion: 0.40
Nodes (3): v(), tr, R()

### Community 30 - "e"
Cohesion: 0.09
Nodes (20): cl, i(), hl, ii, il(), load(), oc, ol (+12 more)

### Community 31 - "en"
Cohesion: 0.08
Nodes (13): ca, ci, v(), en, Ga, hs, mn, i() (+5 more)

### Community 32 - "apply_customizations.py"
Cohesion: 0.67
Nodes (3): main(), Feishin for macOS — Customization Engine & Installer Aplica automaticamente…, run_cmd()

### Community 39 - ".constructor"
Cohesion: 0.09
Nodes (16): Re(), S(), gs, oi(), r(), pi(), p(), us() (+8 more)

### Community 40 - "pt"
Cohesion: 0.12
Nodes (6): bi(), _i(), pt, Si(), Ti(), vi()

### Community 41 - "se"
Cohesion: 0.07
Nodes (4): as(), is(), os(), se

### Community 42 - "yt"
Cohesion: 0.09
Nodes (3): vi(), h(), yt

### Community 43 - "Kn"
Cohesion: 0.11
Nodes (4): fs, Jl, Kn, vl()

### Community 48 - "no"
Cohesion: 0.14
Nodes (12): ao(), eo(), ho(), io(), ja(), no(), oo(), ro() (+4 more)

### Community 52 - "Ce"
Cohesion: 0.07
Nodes (5): Ee(), Se(), Te(), Ce, sh

### Community 53 - "_sceneToCubeUV"
Cohesion: 0.16
Nodes (15): _allocateTargets(), _applyPMREM(), _blur(), _cleanup(), fromCubemap(), fromEquirectangular(), fromScene(), _fromTexture() (+7 more)

### Community 55 - "constructor"
Cohesion: 0.15
Nodes (26): constructor(), d(), u(), y(), t(), gi(), l(), o() (+18 more)

### Community 58 - "zt"
Cohesion: 0.24
Nodes (4): Ie(), Ne(), or, zt

### Community 59 - "gt"
Cohesion: 0.20
Nodes (12): j(), ps(), I(), J(), K(), N(), Q(), V() (+4 more)

### Community 60 - ".toJSON"
Cohesion: 0.11
Nodes (4): ac, r(), go, tc

### Community 63 - "ke"
Cohesion: 0.09
Nodes (7): cr, dr(), er, ke, ki(), pr(), Mt()

### Community 64 - ".copy"
Cohesion: 0.13
Nodes (5): Lt, Ot, ui(), ur(), ye()

### Community 66 - "Hi"
Cohesion: 0.12
Nodes (14): Vr(), er(), Hi(), ji(), Jr(), ki(), kr(), nr() (+6 more)

### Community 67 - ".subVectors"
Cohesion: 0.11
Nodes (3): he(), jn(), rh

### Community 68 - "update"
Cohesion: 0.12
Nodes (11): ei, s(), i(), a(), o(), ka(), s(), update() (+3 more)

### Community 70 - "mr"
Cohesion: 0.22
Nodes (3): kt(), mr, Ut()

### Community 71 - ".removeEventListener"
Cohesion: 0.15
Nodes (9): dispose(), Et, ni, G(), U(), Tt(), wt(), yi() (+1 more)

### Community 72 - "ya"
Cohesion: 0.11
Nodes (9): Ah, co(), fa, fh, hh, lo(), Mh, uo() (+1 more)

### Community 74 - "ia"
Cohesion: 0.19
Nodes (3): Da, ia, ta

### Community 78 - "K"
Cohesion: 0.22
Nodes (3): br, K, kr

### Community 79 - "bt"
Cohesion: 0.12
Nodes (5): bt, li(), Ra, rt, Tt

### Community 81 - "Na"
Cohesion: 0.20
Nodes (5): Ba, Ko, Na, _o, to()

### Community 83 - "wo"
Cohesion: 0.18
Nodes (3): jo, wo, xo

### Community 85 - "q"
Cohesion: 0.23
Nodes (3): p(), q, zi()

### Community 87 - "clone"
Cohesion: 0.10
Nodes (5): clone(), dl, ts(), Wl, Xn()

### Community 88 - ".fromJSON"
Cohesion: 0.15
Nodes (3): n(), parseShapes(), zl

### Community 89 - "fo"
Cohesion: 0.24
Nodes (4): fo(), mo(), l(), po

### Community 93 - ".invert"
Cohesion: 0.13
Nodes (5): we(), qn, _s(), n(), updateMatrixWorld()

### Community 97 - "mi"
Cohesion: 0.29
Nodes (3): mi(), y(), x()

### Community 103 - ".apply"
Cohesion: 0.14
Nodes (7): bind(), bindSkeletons(), getValue(), parseSkeletons(), pc, setValue(), uh()

### Community 107 - ".setHSL"
Cohesion: 0.33
Nodes (3): dt(), Qe(), ut()

### Community 108 - "ds"
Cohesion: 0.22
Nodes (16): ds(), G(), k(), V(), z(), s(), F(), G() (+8 more)

### Community 123 - "qh"
Cohesion: 0.33
Nodes (7): compileCubemapShader(), compileEquirectangularShader(), _compileMaterial(), $h(), Kh(), qh(), tu()

## Knowledge Gaps
- **44 isolated node(s):** `fe`, `Ei`, `J`, `H`, `ir` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 666 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **57 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_` connect `_` to `webgl-backgrounds.js`, `ar`, `U`, `ks`, `tn`, `le`, `.z`, `V`, `it`, `sr`, `At`, `W`, `en`, `.update`, `.constructor`, `.constructor`, `pt`, `Ce`, `je`, `zt`, `ke`, `.copy`, `Hi`, `.subVectors`, `mr`, `K`, `yr`, `.getRenderList`, `q`, `.x`, `gr`, `.invert`, `.applyMatrix4`, `.addAttribute`?**
  _High betweenness centrality (0.343) - this node is a cross-community bridge._
- **Why does `ws()` connect `ws` to `_a`, `three.min.js`, `sr`, `copy`, `Lt`, `vt`, `St`, `.constructor`, `en`, `.constructor`, `se`, `.multiplyScalar`, `Ce`, `constructor`, `gt`, `tn`, `ke`, `update`, `.removeEventListener`, `ia`, `yo`, `bt`, `.invert`, `.applyMatrix4`, `.apply`, `ds`, `xs`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Why does `R()` connect `.constructor` to `ws`, `_`, `ke`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `ws()` (e.g. with `L()` and `R()`) actually correct?**
  _`ws()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fe`, `Ei`, `J` to the rest of the system?**
  _44 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `webgl-backgrounds.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06050420168067227 - nodes in this community are weakly interconnected._
- **Should `_` be split into smaller, more focused modules?**
  _Cohesion score 0.0347289840960727 - nodes in this community are weakly interconnected._