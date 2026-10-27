# Graph Report - feishin  (2026-10-27)

## Corpus Check
- 17 files · ~100,951 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2344 nodes · 5384 edges · 105 communities (50 shown, 50 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 338 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d73f5a28`
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
- ec
- ws
- 🚀 Customizações Incluídas
- ke
- ls
- music-analytics.js
- .applyMatrix4
- .update
- Lt
- vt
- Lc
- eh
- St
- sn
- be
- e
- en
- apply_customizations.py
- nl
- patch_bundle.py
- install.sh
- restore.sh
- ys
- .addVectors
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
- .dispatchEvent
- Ce
- Wn
- pt
- .constructor
- kl
- je
- .copy
- .updateProjectionMatrix
- .toJSON
- bl
- tn
- sr
- mr
- jt
- Ll
- Al
- constructor
- re
- Et
- update
- fl
- .rotateOnAxis
- yo
- rt
- la
- q
- yt
- vl
- Na
- .translateOnAxis
- ._update
- ge
- Rl
- ic
- Wl
- .fromJSON
- Xe
- nc
- tc
- rc
- copy
- main
- el
- ml
- dn
- bind
- mc
- .equals
- gt
- Zc
- parseObject

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
- `et()` --indirect_call--> `S()`  [INFERRED]
  customizations/assets/ogl.js → customizations/assets/three.min.js
- `et()` --indirect_call--> `Y()`  [INFERRED]
  customizations/assets/ogl.js → customizations/assets/three.min.js

## Import Cycles
- None detected.

## Communities (105 total, 50 thin omitted)

### Community 0 - "webgl-backgrounds.js"
Cohesion: 0.06
Nodes (60): buildStrandsPalette(), easePower2InOut(), getOptimizedDPR(), hexToRgb(), hexToRgbArr(), initAcidSquares(), initAntigravity(), initAurora() (+52 more)

### Community 1 - "_"
Cohesion: 0.03
Nodes (49): _, ae(), at, bs(), bt(), ce(), ct(), dt (+41 more)

### Community 2 - "ar"
Cohesion: 0.13
Nodes (4): ar, dr(), pr(), _r

### Community 3 - "U"
Cohesion: 0.05
Nodes (15): ai(), di(), fi(), gi(), hi(), ii(), li(), mi() (+7 more)

### Community 4 - "three.min.js"
Cohesion: 0.03
Nodes (34): Vr(), bi(), bs, $c(), er(), Ga, Hi(), hr() (+26 more)

### Community 5 - "ks"
Cohesion: 0.05
Nodes (5): en, ge(), gr, ks, sn

### Community 7 - "tn"
Cohesion: 0.14
Nodes (7): fr(), A(), E(), m(), p(), ns(), tn

### Community 9 - ".z"
Cohesion: 0.08
Nodes (4): Gs(), Hs(), qs(), Xs()

### Community 10 - "V"
Cohesion: 0.08
Nodes (4): De(), ji(), qi(), V

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
Cohesion: 0.09
Nodes (8): bi(), _i(), pn, pt, Se(), Si(), Ti(), vi()

### Community 16 - "ws"
Cohesion: 0.15
Nodes (12): C(), f(), oi(), setValue(), ws(), At(), Ct(), Dt() (+4 more)

### Community 17 - "🚀 Customizações Incluídas"
Cohesion: 0.11
Nodes (17): 1. 🌌 Arquitetura Personal OS (2-Pane Floating Glass Island), 2. 🔮 33 Shaders WebGL Interativos em Tempo Real, 3. 🇧🇷 Localização Integral em Português do Brasil (100% PT-BR), 4. ⚡ Deep UX: Expansão da Tela da Música ao Clicar na Barra, 5. ⚙️ macOS Window Bar & Preferences, 6. 🍎 Mini Painel da Barra de Menus em Vidro Apple (Apple Glassmorphism Popover), 7. 🎵 Faixas (Tracks) como Página Inicial Padrão do Sistema, 8. ⚡ Ação Rápida: Botão "Tocar a seguir" no Menu Principal do Clique Direito sobre a Faixa (+9 more)

### Community 18 - "ke"
Cohesion: 0.11
Nodes (7): er, v(), ke, tr, R(), ue(), we()

### Community 20 - "music-analytics.js"
Cohesion: 0.10
Nodes (38): applyShader(), ensureShaderContainer(), initEngine(), initFullScreenFreeSpaceDismiss(), initPlayerSplitQueue(), initTrayBridge(), broadcastState(), getCoverUrl() (+30 more)

### Community 21 - ".applyMatrix4"
Cohesion: 0.11
Nodes (4): ri(), ai, Ea(), h()

### Community 22 - ".update"
Cohesion: 0.13
Nodes (5): cs, Fs(), is, rr, Ys()

### Community 25 - "Lc"
Cohesion: 0.08
Nodes (4): bc, getInput(), getOutput(), Lc

### Community 28 - "sn"
Cohesion: 0.05
Nodes (10): an, cn, fn, hn, ln, on, pn, sn (+2 more)

### Community 29 - "be"
Cohesion: 0.19
Nodes (7): be(), gt, nn(), rn, l(), h(), l()

### Community 30 - "e"
Cohesion: 0.08
Nodes (21): cl, hl, ii, il(), load(), oc, ol, or() (+13 more)

### Community 31 - "en"
Cohesion: 0.09
Nodes (7): Da, v(), en, mn, i(), p(), yn()

### Community 32 - "apply_customizations.py"
Cohesion: 0.67
Nodes (3): main(), Feishin for macOS — Customization Engine & Installer Aplica automaticamente…, run_cmd()

### Community 41 - "se"
Cohesion: 0.07
Nodes (3): as(), ia, se

### Community 42 - "bt"
Cohesion: 0.14
Nodes (4): Aa, bt, li(), Ra

### Community 48 - "ya"
Cohesion: 0.09
Nodes (19): Ah, ao(), co(), eo(), fh, ho(), io(), ja() (+11 more)

### Community 49 - ".multiplyScalar"
Cohesion: 0.13
Nodes (3): S(), A(), setFromCamera()

### Community 51 - ".dispatchEvent"
Cohesion: 0.17
Nodes (3): Re(), ts(), v()

### Community 53 - "Wn"
Cohesion: 0.13
Nodes (21): _allocateTargets(), _applyPMREM(), _blur(), _cleanup(), compileCubemapShader(), compileEquirectangularShader(), _compileMaterial(), fromCubemap() (+13 more)

### Community 55 - ".constructor"
Cohesion: 0.14
Nodes (17): d(), u(), y(), gi(), v(), mi(), g(), m() (+9 more)

### Community 56 - "kl"
Cohesion: 0.15
Nodes (3): kl, Ql, Yl

### Community 58 - ".copy"
Cohesion: 0.12
Nodes (6): Ie(), Ne(), or, ui(), ye(), zt

### Community 60 - ".toJSON"
Cohesion: 0.14
Nodes (3): ac, r(), sc

### Community 62 - "tn"
Cohesion: 0.05
Nodes (10): bo, dt(), $e(), is(), Ke(), ms(), Qe(), ss() (+2 more)

### Community 63 - "sr"
Cohesion: 0.09
Nodes (11): cr, he(), ki(), Lt, sr(), C(), et(), N() (+3 more)

### Community 64 - "mr"
Cohesion: 0.12
Nodes (5): kt(), mr, Ot, Ut(), yr

### Community 68 - "constructor"
Cohesion: 0.18
Nodes (18): ze, br(), constructor(), i(), t(), l(), o(), i() (+10 more)

### Community 71 - "update"
Cohesion: 0.08
Nodes (22): ci, dispose(), ei, s(), fi(), gn(), a(), o() (+14 more)

### Community 75 - "yo"
Cohesion: 0.14
Nodes (3): jo, qo, yo

### Community 78 - "q"
Cohesion: 0.08
Nodes (9): As(), br, ci(), K, kr, nr, q, zi() (+1 more)

### Community 79 - "yt"
Cohesion: 0.05
Nodes (6): ct(), es(), ns(), qc, Mt(), yt

### Community 81 - "Na"
Cohesion: 0.20
Nodes (5): Ba, Ko, Na, _o, to()

### Community 88 - ".fromJSON"
Cohesion: 0.08
Nodes (7): bindSkeletons(), n(), dl, parseShapes(), parseSkeletons(), pl, zl

### Community 89 - "Xe"
Cohesion: 0.09
Nodes (9): _a, ca, cs, Do, go, hh, uh(), Xe() (+1 more)

### Community 93 - "copy"
Cohesion: 0.05
Nodes (12): _e(), clone(), copy(), hs, qn, _s(), n(), _sceneToCubeUV() (+4 more)

### Community 105 - ".equals"
Cohesion: 0.11
Nodes (4): fo(), mo(), l(), po

### Community 108 - "gt"
Cohesion: 0.11
Nodes (32): j(), L(), tt(), ds(), F(), G(), k(), V() (+24 more)

### Community 115 - "parseObject"
Cohesion: 0.12
Nodes (6): fa, $l, parseObject(), Rs, ta, Vs

## Knowledge Gaps
- **46 isolated node(s):** `fe`, `Ei`, `J`, `H`, `ir` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 671 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_` connect `_` to `webgl-backgrounds.js`, `ar`, `U`, `three.min.js`, `ks`, `tn`, `le`, `.z`, `V`, `W`, `At`, `pt`, `ke`, `.applyMatrix4`, `.update`, `be`, `.dispatchEvent`, `.copy`, `sr`, `mr`, `constructor`, `.rotateOnAxis`, `q`, `.translateOnAxis`, `copy`?**
  _High betweenness centrality (0.377) - this node is a cross-community bridge._
- **Why does `ws()` connect `ws` to `three.min.js`, `ke`, `.applyMatrix4`, `Lt`, `vt`, `St`, `en`, `se`, `bt`, `.multiplyScalar`, `.dispatchEvent`, `.constructor`, `tn`, `constructor`, `update`, `yo`, `yt`, `.fromJSON`, `Xe`, `copy`, `gt`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `R()` connect `ke` to `ws`, `_`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `ws()` (e.g. with `L()` and `R()`) actually correct?**
  _`ws()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fe`, `Ei`, `J` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `webgl-backgrounds.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06288568909785483 - nodes in this community are weakly interconnected._
- **Should `_` be split into smaller, more focused modules?**
  _Cohesion score 0.033793711431090216 - nodes in this community are weakly interconnected._