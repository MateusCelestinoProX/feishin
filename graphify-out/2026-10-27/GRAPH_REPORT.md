# Graph Report - feishin  (2026-10-27)

## Corpus Check
- 18 files · ~101,271 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2348 nodes · 5388 edges · 114 communities (57 shown, 48 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 338 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bc8b526a`
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
- .add
- 🚀 Customizações Incluídas
- en
- ls
- music-analytics.js
- .raycast
- .update
- Lt
- vt
- Lc
- eh
- St
- sn
- .setFromMatrixPosition
- ol
- .setAttribute
- apply_customizations.py
- nl
- patch_bundle.py
- install.sh
- restore.sh
- .copy
- ya
- se
- bt
- Kn
- jc
- Ne
- xc
- patch_main.py
- no
- .subVectors
- yc
- .dispatchEvent
- Ce
- Wn
- pt
- mi
- us
- zt
- K
- .toJSON
- bl
- tn
- sr
- mr
- jt
- en
- wo
- e
- re
- .x
- ti
- fl
- es
- yo
- .constructor
- la
- .getRenderList
- yt
- gr
- Na
- q
- constructor
- as
- parse
- qc
- .fromJSON
- Xe
- nc
- ct
- rc
- .invert
- main
- el
- ml
- ia
- .addAttribute
- xs
- pl
- bind
- .parse
- rh
- ms
- qo
- ws
- ss
- main
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
- `ws()` --indirect_call--> `L()`  [INFERRED]
  customizations/assets/three.min.js → customizations/assets/ogl.js
- `tt()` --indirect_call--> `Y()`  [INFERRED]
  customizations/assets/ogl.js → customizations/assets/three.min.js
- `gt()` --indirect_call--> `tt()`  [INFERRED]
  customizations/assets/three.min.js → customizations/assets/ogl.js
- `et()` --indirect_call--> `S()`  [INFERRED]
  customizations/assets/ogl.js → customizations/assets/three.min.js

## Import Cycles
- None detected.

## Communities (114 total, 48 thin omitted)

### Community 0 - "webgl-backgrounds.js"
Cohesion: 0.06
Nodes (61): gt, buildStrandsPalette(), easePower2InOut(), getOptimizedDPR(), hexToRgb(), hexToRgbArr(), initAcidSquares(), initAntigravity() (+53 more)

### Community 1 - "_"
Cohesion: 0.03
Nodes (48): _, ae(), at, bs(), bt(), ce(), ct(), dt (+40 more)

### Community 2 - "ar"
Cohesion: 0.16
Nodes (3): ar, dr(), pr()

### Community 3 - "U"
Cohesion: 0.05
Nodes (16): ai(), ci(), di(), fi(), gi(), hi(), ii(), li() (+8 more)

### Community 4 - "three.min.js"
Cohesion: 0.04
Nodes (31): Vr(), bi(), bs, $c(), fi(), Hi(), hr(), intersectObject() (+23 more)

### Community 7 - "tn"
Cohesion: 0.14
Nodes (7): fr(), A(), E(), m(), p(), ns(), tn

### Community 9 - ".z"
Cohesion: 0.07
Nodes (6): Gs(), Hs(), Os(), qs(), Rt(), Xs()

### Community 10 - "V"
Cohesion: 0.09
Nodes (4): De(), ji(), qi(), V

### Community 11 - "W"
Cohesion: 0.11
Nodes (6): Ds(), it, on, St, un, W

### Community 12 - "TagsEngine"
Cohesion: 0.14
Nodes (17): bindTracklistEvents(), checkAndInjectTagsMenuItem(), renderSubmenuItems(), ensureTagsPageMounted(), filterSongs(), findSongFromReactFiber(), formatDuration(), getActiveTargetSong() (+9 more)

### Community 13 - "At"
Cohesion: 0.06
Nodes (5): me(), pe, xe(), At, fe

### Community 14 - "pt"
Cohesion: 0.10
Nodes (9): bi(), _i(), pn, pt, Si(), Ti(), vi(), zi() (+1 more)

### Community 15 - "copy"
Cohesion: 0.10
Nodes (4): ai, copy(), ec, sc

### Community 16 - ".add"
Cohesion: 0.14
Nodes (11): br(), i(), er(), je, jn(), oi(), r(), n() (+3 more)

### Community 17 - "🚀 Customizações Incluídas"
Cohesion: 0.11
Nodes (17): 1. 🌌 Arquitetura Personal OS (2-Pane Floating Glass Island), 2. 🔮 33 Shaders WebGL Interativos em Tempo Real, 3. 🇧🇷 Localização Integral em Português do Brasil (100% PT-BR), 4. ⚡ Deep UX: Expansão da Tela da Música ao Clicar na Barra, 5. ⚙️ macOS Window Bar & Preferences, 6. 🍎 Mini Painel da Barra de Menus em Vidro Apple (Apple Glassmorphism Popover), 7. 🎵 Faixas (Tracks) como Página Inicial Padrão do Sistema, 8. ⚡ Ação Rápida: Botão "Tocar a seguir" no Menu Principal do Clique Direito sobre a Faixa (+9 more)

### Community 18 - "en"
Cohesion: 0.09
Nodes (3): en, Ga, setFromCamera()

### Community 20 - "music-analytics.js"
Cohesion: 0.10
Nodes (38): applyShader(), ensureShaderContainer(), initEngine(), initFullScreenFreeSpaceDismiss(), initPlayerSplitQueue(), initTrayBridge(), broadcastState(), getCoverUrl() (+30 more)

### Community 22 - ".update"
Cohesion: 0.10
Nodes (6): cs, Fs(), is, rr, xn, Ys()

### Community 25 - "Lc"
Cohesion: 0.08
Nodes (4): bc, getInput(), getOutput(), Lc

### Community 28 - "sn"
Cohesion: 0.05
Nodes (11): an, cn, dn, fn, hn, ln, on, pn (+3 more)

### Community 29 - ".setFromMatrixPosition"
Cohesion: 0.12
Nodes (7): be(), _e(), Se(), we(), yi(), qn, b()

### Community 30 - "ol"
Cohesion: 0.11
Nodes (10): cl, hl, load(), ol, parseImages(), setTexturePath(), sl, uc (+2 more)

### Community 31 - ".setAttribute"
Cohesion: 0.10
Nodes (8): ca, v(), g(), mn, Pa, p(), setDirection(), uh()

### Community 32 - "apply_customizations.py"
Cohesion: 0.67
Nodes (3): main(), Feishin for macOS — Customization Engine & Installer Aplica automaticamente…, run_cmd()

### Community 34 - "nl"
Cohesion: 0.11
Nodes (3): il(), Ll, nl

### Community 39 - ".copy"
Cohesion: 0.16
Nodes (4): Lt, Ot, ur(), ye()

### Community 40 - "ya"
Cohesion: 0.15
Nodes (7): Ah, co(), fh, lo(), Mh, uo(), ya

### Community 42 - "bt"
Cohesion: 0.12
Nodes (7): bt, ei, ii, li(), parseTextures(), Ra, rt

### Community 43 - "Kn"
Cohesion: 0.09
Nodes (5): fs, Jl, Kn, vl(), Yl

### Community 48 - "no"
Cohesion: 0.14
Nodes (12): ao(), eo(), ho(), io(), ja(), no(), oo(), ro() (+4 more)

### Community 51 - ".dispatchEvent"
Cohesion: 0.13
Nodes (6): Re(), s(), gs, o(), v(), ys

### Community 52 - "Ce"
Cohesion: 0.11
Nodes (4): Ee(), Te(), Ce, sh

### Community 53 - "Wn"
Cohesion: 0.11
Nodes (22): _allocateTargets(), _applyPMREM(), _blur(), _cleanup(), compileCubemapShader(), compileEquirectangularShader(), _compileMaterial(), fromCubemap() (+14 more)

### Community 55 - "mi"
Cohesion: 0.15
Nodes (10): d(), u(), dc, y(), mc(), mi(), p(), y() (+2 more)

### Community 56 - "us"
Cohesion: 0.16
Nodes (5): hs, kl, Ql, us(), w()

### Community 58 - "zt"
Cohesion: 0.13
Nodes (9): Ie(), Ne(), nn(), or, rn, l(), h(), l() (+1 more)

### Community 59 - "K"
Cohesion: 0.21
Nodes (3): br, K, kr

### Community 60 - ".toJSON"
Cohesion: 0.10
Nodes (4): ac, r(), dl, tc

### Community 62 - "tn"
Cohesion: 0.06
Nodes (6): bo, dt(), $e(), Qe(), tn, ut()

### Community 63 - "sr"
Cohesion: 0.07
Nodes (11): cr, er, ke, ki(), sr(), C(), et(), L() (+3 more)

### Community 64 - "mr"
Cohesion: 0.15
Nodes (4): kt(), mr, Ut(), yr

### Community 67 - "wo"
Cohesion: 0.18
Nodes (3): jo, wo, xo

### Community 68 - "e"
Cohesion: 0.19
Nodes (16): t(), gi(), l(), o(), i(), a(), ka(), c() (+8 more)

### Community 71 - "ti"
Cohesion: 0.15
Nodes (7): Et, ni, Si(), ti, Tt(), yi(), Zh()

### Community 76 - ".constructor"
Cohesion: 0.08
Nodes (4): Aa, clone(), ts(), Tt

### Community 79 - "yt"
Cohesion: 0.09
Nodes (3): vi(), h(), yt

### Community 81 - "Na"
Cohesion: 0.20
Nodes (5): Ba, Ko, Na, _o, to()

### Community 84 - "constructor"
Cohesion: 0.19
Nodes (12): ci, constructor(), S(), v(), pi(), p(), update(), M() (+4 more)

### Community 85 - "as"
Cohesion: 0.22
Nodes (3): as(), is(), os()

### Community 86 - "parse"
Cohesion: 0.16
Nodes (9): bindSkeletons(), ic, oc, parse(), parseAnimations(), parseGeometries(), parseMaterials(), parseSkeletons() (+1 more)

### Community 88 - ".fromJSON"
Cohesion: 0.11
Nodes (4): Al, n(), parseShapes(), zl

### Community 89 - "Xe"
Cohesion: 0.09
Nodes (8): _a, cs, Do, fo(), go, Rs, Xe(), zo

### Community 93 - ".invert"
Cohesion: 0.12
Nodes (4): hh, _s(), n(), updateMatrixWorld()

### Community 104 - ".parse"
Cohesion: 0.50
Nodes (3): i(), Xn(), yn()

### Community 108 - "ws"
Cohesion: 0.05
Nodes (54): v(), j(), tr, R(), dispose(), ds(), F(), G() (+46 more)

### Community 111 - "main"
Cohesion: 0.67
Nodes (3): main(), evaluate(), send()

### Community 115 - "parseObject"
Cohesion: 0.11
Nodes (6): fa, $l, parseObject(), ta, Vs, Wl

## Knowledge Gaps
- **46 isolated node(s):** `fe`, `Ei`, `J`, `H`, `ir` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 672 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_` connect `_` to `webgl-backgrounds.js`, `ar`, `U`, `three.min.js`, `ks`, `tn`, `le`, `.z`, `V`, `W`, `At`, `pt`, `.raycast`, `.update`, `.setFromMatrixPosition`, `.copy`, `.subVectors`, `.dispatchEvent`, `Ce`, `zt`, `K`, `sr`, `mr`, `en`, `.x`, `.getRenderList`, `gr`, `q`, `.addAttribute`, `ws`?**
  _High betweenness centrality (0.376) - this node is a cross-community bridge._
- **Why does `ws()` connect `ws` to `three.min.js`, `copy`, `.add`, `en`, `Lt`, `vt`, `St`, `.setAttribute`, `se`, `bt`, `.dispatchEvent`, `Ce`, `mi`, `tn`, `sr`, `e`, `ti`, `.multiplyScalar`, `yo`, `constructor`, `parse`, `Xe`, `ct`, `.invert`, `ia`, `xs`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `R()` connect `ws` to `_`, `sr`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `ws()` (e.g. with `L()` and `R()`) actually correct?**
  _`ws()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fe`, `Ei`, `J` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `webgl-backgrounds.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06050420168067227 - nodes in this community are weakly interconnected._
- **Should `_` be split into smaller, more focused modules?**
  _Cohesion score 0.033950617283950615 - nodes in this community are weakly interconnected._