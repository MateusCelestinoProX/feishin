# Graph Report - feishin  (2026-10-27)

## Corpus Check
- 15 files · ~96,667 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2303 nodes · 5281 edges · 104 communities (54 shown, 42 thin omitted)
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
- ke
- ls
- music-analytics.js
- en
- .update
- Lt
- vt
- Lc
- eh
- St
- sn
- be
- ol
- constructor
- apply_customizations.py
- nl
- patch_bundle.py
- install.sh
- restore.sh
- .constructor
- se
- yt
- Kn
- jc
- Ne
- xc
- patch_main.py
- no
- .multiplyScalar
- yc
- pl
- Ce
- Wn
- pt
- mi
- us
- n
- zt
- .updateProjectionMatrix
- .toJSON
- bl
- tn
- .computeFrenetFrames
- .copy
- jt
- Ll
- Al
- e
- re
- Tt
- pi
- ya
- fl
- ia
- yo
- la
- K
- bt
- vl
- Na
- wo
- fr
- .x
- .fromArray
- .fromJSON
- Xe
- nc
- q
- .applyMatrix4
- el
- ml
- .addAttribute
- bind
- mc
- qo
- gt
- Zc
- parseObject
- ss

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

## Communities (104 total, 42 thin omitted)

### Community 0 - "webgl-backgrounds.js"
Cohesion: 0.06
Nodes (61): gt, buildStrandsPalette(), easePower2InOut(), getOptimizedDPR(), hexToRgb(), hexToRgbArr(), initAcidSquares(), initAntigravity() (+53 more)

### Community 1 - "_"
Cohesion: 0.04
Nodes (47): _, ae(), at, bs(), bt(), ce(), ct(), dt (+39 more)

### Community 2 - "ar"
Cohesion: 0.08
Nodes (5): ar, kt(), mr, Ut(), yr

### Community 3 - "U"
Cohesion: 0.05
Nodes (17): ai(), ci(), di(), fi(), gi(), hi(), ii(), li() (+9 more)

### Community 4 - "three.min.js"
Cohesion: 0.03
Nodes (34): Vr(), bs, $c(), Ga, Hi(), hr(), intersectObject(), intersectObjects() (+26 more)

### Community 9 - ".z"
Cohesion: 0.08
Nodes (4): Gs(), Hs(), qs(), Xs()

### Community 10 - "V"
Cohesion: 0.09
Nodes (3): De(), qi(), V

### Community 12 - "sr"
Cohesion: 0.11
Nodes (12): v(), nn(), sr(), C(), et(), j(), L(), N() (+4 more)

### Community 13 - "At"
Cohesion: 0.06
Nodes (5): me(), pe, At, fe, ge

### Community 14 - "W"
Cohesion: 0.06
Nodes (14): bi(), Fs(), _i(), on, pn, pt, Si(), un (+6 more)

### Community 15 - "copy"
Cohesion: 0.07
Nodes (4): clone(), copy(), ec, b()

### Community 16 - "ws"
Cohesion: 0.09
Nodes (17): dispose(), ei, s(), t(), C(), ii, parseTextures(), M() (+9 more)

### Community 17 - "🚀 Customizações Incluídas"
Cohesion: 0.11
Nodes (17): 1. 🌌 Arquitetura Personal OS (2-Pane Floating Glass Island), 2. 🔮 33 Shaders WebGL Interativos em Tempo Real, 3. 🇧🇷 Localização Integral em Português do Brasil (100% PT-BR), 4. ⚡ Deep UX: Expansão da Tela da Música ao Clicar na Barra, 5. ⚙️ macOS Window Bar & Preferences, 6. 🍎 Mini Painel da Barra de Menus em Vidro Apple (Apple Glassmorphism Popover), 7. 🎵 Faixas (Tracks) como Página Inicial Padrão do Sistema, 8. ⚡ Ação Rápida: Botão "Tocar a seguir" no Menu Principal do Clique Direito sobre a Faixa (+9 more)

### Community 18 - "ke"
Cohesion: 0.11
Nodes (6): er, ji(), ke, ue(), we(), ye()

### Community 20 - "music-analytics.js"
Cohesion: 0.10
Nodes (38): applyShader(), ensureShaderContainer(), initEngine(), initFullScreenFreeSpaceDismiss(), initPlayerSplitQueue(), initTrayBridge(), broadcastState(), getCoverUrl() (+30 more)

### Community 22 - ".update"
Cohesion: 0.16
Nodes (4): cs, is, rr, Ys()

### Community 25 - "Lc"
Cohesion: 0.08
Nodes (4): bc, getInput(), getOutput(), Lc

### Community 28 - "sn"
Cohesion: 0.05
Nodes (11): an, cn, dn, fn, hn, ln, on, pn (+3 more)

### Community 29 - "be"
Cohesion: 0.21
Nodes (6): be(), rn, l(), Se(), h(), l()

### Community 30 - "ol"
Cohesion: 0.07
Nodes (15): cl, ic, load(), oc, ol, parse(), parseAnimations(), parseGeometries() (+7 more)

### Community 31 - "constructor"
Cohesion: 0.10
Nodes (8): ca, constructor(), Da, v(), en, mn, update(), wh()

### Community 32 - "apply_customizations.py"
Cohesion: 0.67
Nodes (3): main(), Feishin for macOS — Customization Engine & Installer Aplica automaticamente…, run_cmd()

### Community 39 - ".constructor"
Cohesion: 0.18
Nodes (5): gs, oi(), r(), v(), ys

### Community 43 - "Kn"
Cohesion: 0.16
Nodes (3): fs, Kn, Yl

### Community 45 - "Ne"
Cohesion: 0.09
Nodes (3): ri(), ai, Ne

### Community 48 - "no"
Cohesion: 0.14
Nodes (12): ao(), eo(), ho(), io(), ja(), no(), oo(), ro() (+4 more)

### Community 49 - ".multiplyScalar"
Cohesion: 0.11
Nodes (3): S(), A(), ht()

### Community 52 - "Ce"
Cohesion: 0.06
Nodes (7): Ee(), Re(), Te(), xe(), Ce, sh, Wl

### Community 53 - "Wn"
Cohesion: 0.13
Nodes (20): _allocateTargets(), _applyPMREM(), _blur(), _cleanup(), compileCubemapShader(), compileEquirectangularShader(), _compileMaterial(), fromCubemap() (+12 more)

### Community 55 - "mi"
Cohesion: 0.13
Nodes (20): d(), u(), y(), gi(), v(), c(), mi(), f() (+12 more)

### Community 56 - "us"
Cohesion: 0.23
Nodes (3): kl, Ql, us()

### Community 57 - "n"
Cohesion: 0.23
Nodes (5): ze, er(), je, jn(), n()

### Community 58 - "zt"
Cohesion: 0.14
Nodes (7): Ds(), Ie(), Ne(), or, Os(), Rt(), zt

### Community 60 - ".toJSON"
Cohesion: 0.11
Nodes (4): ac, r(), sc, ts()

### Community 62 - "tn"
Cohesion: 0.05
Nodes (9): bo, dt(), $e(), is(), Ke(), ms(), Qe(), tn (+1 more)

### Community 63 - ".computeFrenetFrames"
Cohesion: 0.14
Nodes (4): cr, dr(), ki(), pr()

### Community 64 - ".copy"
Cohesion: 0.14
Nodes (5): he(), Lt, Ot, Ti(), ur()

### Community 68 - "e"
Cohesion: 0.14
Nodes (18): br(), i(), hl, l(), o(), i(), a(), ka() (+10 more)

### Community 69 - "re"
Cohesion: 0.11
Nodes (3): Ea(), re, rh

### Community 70 - "Tt"
Cohesion: 0.40
Nodes (3): Et, Tt(), Zh()

### Community 71 - "pi"
Cohesion: 0.14
Nodes (10): ci, ni, i(), pi(), p(), Si(), ti, Xn() (+2 more)

### Community 72 - "ya"
Cohesion: 0.14
Nodes (8): Ah, co(), fh, hh, lo(), Mh, uo(), ya

### Community 78 - "K"
Cohesion: 0.13
Nodes (5): br, K, kr, nr, zr

### Community 79 - "bt"
Cohesion: 0.05
Nodes (11): Aa, bt, ct(), es(), li(), ns(), qc, Ra (+3 more)

### Community 81 - "Na"
Cohesion: 0.20
Nodes (5): Ba, Ko, Na, _o, to()

### Community 83 - "wo"
Cohesion: 0.18
Nodes (3): jo, wo, xo

### Community 85 - "fr"
Cohesion: 0.60
Nodes (5): fr(), A(), E(), m(), p()

### Community 88 - ".fromJSON"
Cohesion: 0.16
Nodes (3): n(), parseShapes(), zl

### Community 89 - "Xe"
Cohesion: 0.11
Nodes (7): _a, cs, Do, fo(), go, Xe(), zo

### Community 91 - "q"
Cohesion: 0.20
Nodes (3): As(), gr, q

### Community 93 - ".applyMatrix4"
Cohesion: 0.07
Nodes (12): _e(), as(), hs, qn, _s(), n(), _sceneToCubeUV(), setFromCamera() (+4 more)

### Community 103 - "bind"
Cohesion: 0.40
Nodes (4): bind(), bindSkeletons(), getValue(), setValue()

### Community 108 - "gt"
Cohesion: 0.09
Nodes (35): bi(), ds(), F(), G(), k(), V(), z(), fi() (+27 more)

### Community 115 - "parseObject"
Cohesion: 0.10
Nodes (7): fa, $l, parseObject(), Rs, ta, tc, Vs

## Knowledge Gaps
- **46 isolated node(s):** `fe`, `Ei`, `J`, `H`, `ir` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 669 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_` connect `_` to `webgl-backgrounds.js`, `ar`, `U`, `three.min.js`, `ks`, `tn`, `le`, `.z`, `V`, `it`, `sr`, `At`, `W`, `ke`, `en`, `.update`, `be`, `Ne`, `Ce`, `n`, `zt`, `.computeFrenetFrames`, `.copy`, `K`, `fr`, `.x`, `q`, `.applyMatrix4`, `.addAttribute`?**
  _High betweenness centrality (0.355) - this node is a cross-community bridge._
- **Why does `ws()` connect `ws` to `three.min.js`, `sr`, `copy`, `Lt`, `vt`, `St`, `constructor`, `.constructor`, `se`, `Ne`, `.multiplyScalar`, `mi`, `tn`, `jt`, `e`, `Tt`, `ia`, `yo`, `bt`, `Xe`, `nc`, `.applyMatrix4`, `gt`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `R()` connect `sr` to `ws`, `_`, `ke`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `ws()` (e.g. with `L()` and `R()`) actually correct?**
  _`ws()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fe`, `Ei`, `J` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `webgl-backgrounds.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06050420168067227 - nodes in this community are weakly interconnected._
- **Should `_` be split into smaller, more focused modules?**
  _Cohesion score 0.035298035298035296 - nodes in this community are weakly interconnected._