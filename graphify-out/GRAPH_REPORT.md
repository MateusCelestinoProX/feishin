# Graph Report - feishin  (2026-10-27)

## Corpus Check
- 13 files · ~66,942 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 669 nodes · 1295 edges · 37 communities (23 shown, 11 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `687ca6f8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- webgl-backgrounds.js
- _
- ar
- U
- ks
- zt
- tn
- le
- .z
- V
- W
- .intersectMeshes
- ke
- pt
- .copy
- sr
- 🚀 Customizações Incluídas
- .addAttribute
- .sub
- feishin-personal-os.js
- q
- .update
- ct
- zs
- vt
- .constructor
- oe
- apply_customizations.py
- ue
- patch_bundle.py
- install.sh
- restore.sh
- patch_main.py
- .multiply

## God Nodes (most connected - your core abstractions)
1. `_` - 208 edges
2. `requestAnimationFrame()` - 39 edges
3. `U` - 35 edges
4. `V` - 33 edges
5. `getOptimizedDPR()` - 31 edges
6. `resize()` - 29 edges
7. `ks` - 25 edges
8. `tn` - 23 edges
9. `W` - 19 edges
10. `sr()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `he()` --calls--> `_`  [EXTRACTED]
  customizations/assets/ogl.js → customizations/assets/ogl.js  _Bridges community 1 → community 15_
- `ke` --calls--> `_`  [EXTRACTED]
  customizations/assets/ogl.js → customizations/assets/ogl.js  _Bridges community 1 → community 13_
- `sr()` --calls--> `_`  [EXTRACTED]
  customizations/assets/ogl.js → customizations/assets/ogl.js  _Bridges community 1 → community 16_
- `R()` --calls--> `_`  [EXTRACTED]
  customizations/assets/ogl.js → customizations/assets/ogl.js  _Bridges community 1 → community 29_
- `zs` --calls--> `le()`  [EXTRACTED]
  customizations/assets/ogl.js → customizations/assets/ogl.js  _Bridges community 8 → community 25_

## Import Cycles
- None detected.

## Communities (37 total, 11 thin omitted)

### Community 0 - "webgl-backgrounds.js"
Cohesion: 0.07
Nodes (57): buildStrandsPalette(), easePower2InOut(), getOptimizedDPR(), hexToRgb(), hexToRgbArr(), initAntigravity(), initAurora(), initBalatro() (+49 more)

### Community 1 - "_"
Cohesion: 0.04
Nodes (41): _, ae(), at, bs(), ce(), dt, Ei, Et (+33 more)

### Community 2 - "ar"
Cohesion: 0.08
Nodes (7): ar, dr(), kt(), mr, pr(), Ut(), yr

### Community 3 - "U"
Cohesion: 0.05
Nodes (17): ai(), ci(), di(), gi(), hi(), ii(), li(), mi() (+9 more)

### Community 5 - "ks"
Cohesion: 0.10
Nodes (3): ge(), ks, me()

### Community 6 - "zt"
Cohesion: 0.15
Nodes (9): be(), gt, Ie(), Ne(), nn(), l(), h(), l() (+1 more)

### Community 7 - "tn"
Cohesion: 0.14
Nodes (7): fr(), A(), E(), m(), p(), ns(), tn

### Community 9 - ".z"
Cohesion: 0.08
Nodes (4): Gs(), Hs(), qs(), Xs()

### Community 10 - "V"
Cohesion: 0.09
Nodes (4): De(), ji(), qi(), V

### Community 11 - "W"
Cohesion: 0.09
Nodes (8): Ds(), it, on, or, rn, St, un, W

### Community 12 - ".intersectMeshes"
Cohesion: 0.18
Nodes (3): cr, Ee(), ki()

### Community 13 - "ke"
Cohesion: 0.15
Nodes (4): er, ke, we(), xe()

### Community 14 - "pt"
Cohesion: 0.08
Nodes (10): bi(), _i(), pn, pt, Se(), Si(), Ti(), vi() (+2 more)

### Community 15 - ".copy"
Cohesion: 0.15
Nodes (5): v(), he(), Ot, j(), ye()

### Community 16 - "sr"
Cohesion: 0.21
Nodes (7): sr(), C(), et(), L(), N(), tt(), xs()

### Community 17 - "🚀 Customizações Incluídas"
Cohesion: 0.13
Nodes (14): 1. 🌌 Arquitetura Personal OS (2-Pane Floating Glass Island), 2. 🔮 33 Shaders WebGL Interativos em Tempo Real, 3. 🇧🇷 Localização Integral em Português do Brasil (100% PT-BR), 4. ⚡ Deep UX: Expansão da Tela da Música ao Clicar na Barra, 5. ⚙️ macOS Window Bar & Preferences, 6. 🍎 Mini Painel da Barra de Menus em Vidro Apple (Apple Glassmorphism Popover), 👤 Autor & Identidade Git, 🔄 Como Desinstalar (Restaurar Original) (+6 more)

### Community 20 - "feishin-personal-os.js"
Cohesion: 0.24
Nodes (16): applyShader(), ensureShaderContainer(), initEngine(), initTrayBridge(), broadcastState(), getCoverUrl(), getPlayerStore(), handleAction() (+8 more)

### Community 21 - "q"
Cohesion: 0.05
Nodes (12): As(), br, en, gr, K, kr, nr, q (+4 more)

### Community 22 - ".update"
Cohesion: 0.12
Nodes (5): cs, Fs(), is, rr, Ys()

### Community 23 - "ct"
Cohesion: 0.29
Nodes (3): ct(), fi(), ve

### Community 25 - "zs"
Cohesion: 0.33
Nodes (3): bt(), Tt(), zs

### Community 26 - "vt"
Cohesion: 0.33
Nodes (3): Es(), Ms(), vt()

### Community 32 - "apply_customizations.py"
Cohesion: 0.67
Nodes (3): main(), Feishin for macOS — Customization Engine & Installer Aplica automaticamente…, run_cmd()

## Knowledge Gaps
- **43 isolated node(s):** `fe`, `pe`, `Ei`, `J`, `H` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 180 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_` connect `_` to `webgl-backgrounds.js`, `ar`, `U`, `ks`, `zt`, `tn`, `le`, `.z`, `V`, `W`, `.intersectMeshes`, `ke`, `pt`, `.copy`, `sr`, `.addAttribute`, `.sub`, `q`, `.update`, `ct`, `zs`, `vt`, `.constructor`, `.computeBoundingSphere`, `oe`, `ue`, `.multiply`?**
  _High betweenness centrality (0.728) - this node is a cross-community bridge._
- **Why does `V` connect `V` to `webgl-backgrounds.js`, `_`, `ar`, `zt`, `W`, `.intersectMeshes`, `.copy`, `sr`, `.sub`, `.update`, `.computeBoundingSphere`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `ks` connect `ks` to `webgl-backgrounds.js`, `_`, `q`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `fe`, `pe`, `Ei` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `webgl-backgrounds.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06621226874391431 - nodes in this community are weakly interconnected._
- **Should `_` be split into smaller, more focused modules?**
  _Cohesion score 0.041742286751361164 - nodes in this community are weakly interconnected._
- **Should `ar` be split into smaller, more focused modules?**
  _Cohesion score 0.08232118758434548 - nodes in this community are weakly interconnected._