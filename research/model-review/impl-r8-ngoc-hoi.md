# 3D model review: round 8 implementation, Cầu Ngọc Hồi (2026-11-28)

Brief: `research/model-review/brief-r8-ngoc-hoi.md`. Everything in the brief is implemented: the P0/P1/P2 data changes and the two required engine gaps, **G12** (per-member pylon colours) and **G13** (`pylon_custom.panels`). The G13 fallback (extra swept legs) was not needed. The optional `crossbeam_colour` was not added, because no bridge uses it.

Checks: `npm run typecheck`, `npm run lint`, `npm test` (108 tests) and `npm run build` all pass.

## Engine

### G12: per-member colours

| File | Change |
|---|---|
| `src/types.ts` | Optional `colour` on `PylonCustom.legs[i]`, `struts[i]` and `panels[i]`. |
| `src/lib/validate.ts` | Each `colour` must be a named or `#rrggbb` colour (`isColour`). |
| `src/lib/bridge3d.ts` | `Member.colour?` is set on struts. New `PylonSweep = SweepMesh & { colour? }`, and `Pylon.sweeps` is now `PylonSweep[]`. The leg sweeps carry the leg colour. The world mapping keeps the field (`{ ...sw, positions }`). The field is only added when a colour is given. |
| `src/three/engine.ts` | `matFor(colour)` returns `pylonMat` when no colour is set. Otherwise it returns a per-colour `tinted(M.concrete, colour)`, cached per build and disposed through `extraMats`. Pile caps stay plain concrete. |

### G13: `pylon_custom.panels`

`{ top, bottom: [z, y][]; depth_m; x_m?; colour? }`

- **Mesh** (`src/lib/sweep.ts`, `panelMesh`):
  - Columns sit at the union of the breakpoints of both curves. A vertical step (two points at the same z) gives two columns: `panelYAt(c, z, ±1)` returns the left-hand or right-hand value.
  - Each interval is split into 6 parts. The intermediate columns use `panelSmoothAt`, a shape-preserving cubic (PCHIP with Fritsch–Butland tangents). The edges still pass through every data point, but the U has a flat bottom and the arch a round crown, with no overshoot.
  - The first linear version showed visible kinks at the 11 top points, and a "V" at the low point.
  - The top is clamped to be at least the bottom.
  - The mesh is the two faces, the walls along both curves, and the two end caps.
- **Placement** (`src/lib/bridge3d.ts`):
  - Vertices go through the pylon's `toStation`: they are mirrored with `dir`, and above-deck y is scaled by `pylonScale`.
  - The panel meshes are appended to `Pylon.sweeps` after the legs. They are therefore included in the unit bounds, the data tests' bounding-box and NaN checks, and the renderer.
  - The tip, the height dimension, the anchors and the crossbeams all still come from the legs.
- **Validation** (`src/lib/validate.ts`):
  - Each curve has at least 2 points and z is non-decreasing.
  - Both curves start and end at the same z, with z1 > z0.
  - The top is never below the bottom at any breakpoint, checked from both sides.
  - `depth_m` is greater than 0.
  - `x_m` is a number and `colour` is a valid colour.
- **Generator** (`scripts/gen_bridges.py`, `check_panels`): a malformed panel is skipped, with a warning on stderr.

### Docs

- `docs/data-schema.md`: the `PylonCustom` block has `legs[].colour`, `struts[].colour` and `panels`.
- `docs/design-3d.md`: two new geometry-rule bullets, G12 and G13.

## Data (`research/shapes/cau-ngoc-hoi.json`, `scripts/gen_bridges.py`)

- The `model3d` follows brief §3.1 exactly:
  - 165 + 350 + 165, E 24.5, crest 4;
  - 2 planes, semi-fan, 16 per side;
  - deck 38.3 m, stays `#d4a24c`.
- `pylon_custom` also follows §3.1:
  - 4 legs: red inner posts at z ±20.25 and concrete outer skins at ±22.5, tips at 98.5;
  - 4 splayed concrete struts from (±8, −23.5) to (0, 21);
  - one red gate panel, 5 m deep;
  - anchor zones 36–87 on legs 0 and 1;
  - a 24 × 50 m rectangular cap with its top at −23.5.
- The shape file's `review`, `checklist`, `notes` ("r8: …") and `compare` are updated.
- Bridge fields:
  - `width_m` 38.3;
  - `span_arrangement` "165 + 350 + 165 m";
  - `investor`;
  - 4 new sources (vncnec, Báo Xây dựng, Nhân Dân, Kenh14);
  - `notes` say 32.3 m between parapets / 38.3 m overall / approaches 33 m, plus the architecture-competition and pile facts;
  - `pylons` / `pylons_en` come from the shape file.
- The `m3d` seed notes no longer say "side spans are derived".
- **Regression asserts** in the generator cover spans, E, crest, width, stays, colours, leg colours, tips, struts on the cap, the panel extremes (27.9 / 23.2), anchor zones, the cap size, the bridge fields, and the notes.
- **Not done:** the optional official aerial image. The brief gives only the image URL, not a source page.
- `data/bridges.json` was regenerated. Only `cau-ngoc-hoi` changed, which was checked by comparing every record against HEAD.

## Tests

- **`bridge3d.test.ts`**, two new describe blocks:
  - **G12:** one coloured leg gives exactly one coloured sweep. Strut colours are carried, and uncoloured pylons have no `colour` field.
  - **G13:**
    - one panel per pylon after the legs, with the x extent equal to `depth_m`;
    - top 70 and bottom 0 above the deck, and an opening of 23 → 28 at z = 0;
    - inside the bounds, and the tip still comes from the legs;
    - the smoothed U is flat near its low point and never below the data;
    - the per-pylon height scale applies.
  - **Validation:** accepted and rejected colours and panels, and `panelYAt` / `panelSmoothAt`.
- **`data.test.ts`**:
  - New Ngọc Hồi test:
    - E 24.5, no aux piers, pylons at 165 / 515;
    - deck ≈27.4 at the pylons, 98.5 above the deck, label 126;
    - 5 sweeps with colours `[red, red, —, —, red]` and 4 concrete struts;
    - gate top ≈72, opening 23.2 → 27.9 at the centreline, no NaN;
    - strut feet ±8 m along x, about 1 m above the water, with a cap;
    - 16 × 2 × 2 golden stays anchored 35–88 m above the deck on the inner legs.
  - New check that `pylon_custom` (including legs, struts and panels) has only schema keys.

## Renders

Renders are in `scratchpad/views-nh-impl/`: the 5 presets plus `az55 el38 unit`, `az55 el35 pylon0`, `az10 el2 unit` and `az25 el5 pylon0`.

- **Front vs `bxd_9`:** matches. Two free posts rise to flat tips at the same height, with no top beam. The smooth U is lowest at ≈28 m, the round-headed arch has its crown at ≈23 m, and the spandrels reach the deck.
- **`az55 el38 unit` vs the user render:** the composition matches, with the bridge running upper-left to lower-right and the near pylon at lower right. The posts and gate read red from above, the outer skin and split legs read concrete, and the stays read golden. The deck is drawn as partial cantilevers because the bridge is under construction (expected, brief §6).
- **`az25 el5 pylon0` vs `bxd_3`:** matches. The posts split ≈21 m above the deck into concrete inverted-V legs on the cap at the waterline. The red inner face and concrete outer face are visible.
- **Elevation and foot:** spans 165 / 350 / 165 with no aux piers. All four legs stand on the 24 × 50 m cap.
- **Deviation (engine style):** colours are muted by `mutedColour`, which caps saturation at 0.45. The copper therefore reads as a brick-brown red rather than the vivid orange of the render, and the stays read pale amber. I left it that way so that every bridge keeps the same study-model palette.
- **Regression (G12):**
  - Front and three-quarter views of `cau-thuong-cat`, `cau-ben-rung`, `cau-nguyen-trai` and `cau-rach-mieu-2` were rendered from HEAD (a `git archive` copy) and from this branch.
  - All 8 PNGs are **byte-identical**.
