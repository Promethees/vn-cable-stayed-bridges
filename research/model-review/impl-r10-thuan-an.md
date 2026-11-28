# 3D model review: round 10 implementation, Cầu vượt cửa biển Thuận An (2026-11-28)

Brief: `research/model-review/brief-r10-thuan-an.md`. The P0, P1 and P2 data changes and engine gap **G17** (`deck_haunch`) are implemented. The `model3d` is the brief's §4 / `tawork/target_model3d.json` plus `deck_haunch: {depth_at_pylon_m: 9.5, length_m: 85}`. The optional extras were skipped as instructed: the octagonal cap chamfer, the lightning mast and paired stays.

Checks: `npm run typecheck`, `npm run lint`, `npm test` (128 tests) and `npm run build` all pass.

## Engine: G17 `model3d.deck_haunch?: {depth_at_pylon_m, length_m}`

| File | Change |
|---|---|
| `src/lib/bridge3d.ts` | Adds `deckDepthAt(x)`, also exposed on `BridgeGeometry`. At distance s < L from a pylon station the girder depth is `deckDepth + (depth_at_pylon − deckDepth)·(1 − s/L)²`. L is clamped per side to half-way to the next pylon or to the unit end, with the warning `deck_haunch clamped: it reaches mid-span or the unit end`. The deck top, E, the stays and the labels are unchanged. With a haunch, the deck is drawn as the continuous mesh even on a flat, straight deck. Rings are spaced every 2.5 m, with one ring exactly at each pylon station so the peak depth is hit. Each face gets its own vertex strip, because shared corners made smooth normals band the deck top near the pylon (seen in the first render). Abutment and auxiliary pier tops use `deckDepthAt`. Truss decks ignore the haunch (warning). A `depth_at_pylon_m` that is not deeper than the deck is also ignored (warning). Approaches are not haunched, and the nav check still uses `deck_depth_m`. |
| `src/types.ts`, `src/lib/validate.ts` | New optional object. Both keys must be positive and no other keys are allowed. |
| `docs/data-schema.md`, `docs/design-3d.md` | New "Haunched girder (G17)" rule. |
| `src/lib/bridge3d.test.ts` | Four tests: the parabola values, soffit = deckY − 9.5 at the pylons, deck top and cables identical to the same bridge without a haunch, the mesh on a flat deck, clamping with its warning, the truss and too-shallow cases, validation, and under construction. |

Bridges without the field take the old code paths: the same sample points and the same 4-vertex rings. `data/bridges.json` changes only for `cau-thuan-an`. `cau-vam-cong` and `cau-rach-mieu-2` (5 standard views each) render **byte-identical** from HEAD and from this branch.

## Data (`research/shapes/cau-thuan-an.json`, `scripts/gen_bridges.py`)

- **Shape file:** the target `model3d` plus `deck_haunch`, new `pylons_vi`/`pylons_en` (§6), `colour`, `review` and `checklist`. The notes mention G17 and keep the press figures of 32 m and 34 m.
- **REVIEW_R1:** the `cau-thuan-an` entry, its transverse-A/king-post `pylon_custom` block and the `del` are removed. That override no longer overwrites the deck (40) or the pylon.
- **EXPECT_R1:** now white/red, deck 40.5, crest 5.0, 17 stays per side, semi_fan, `main_stay_deck_m` [26, 89].
- **Opt-in asserts:** the combined G15/G16 assert is split. `deck_closed` is allowed for Phước An only. `main_stay_deck_m` is allowed for Phước An and Thuận An. New: `deck_haunch` is allowed for Thuận An only. `data.test.ts` mirrors the first two.
- **NAV:** `cau-thuan-an`: 40 m, "5,000 DWT; 218 m navigation span", from Đạt Phương.
- **M3D fallback:** brought in step with the shape file (A, [27.5, 27.5], semi_fan, cps 17).
- **Seed:** `pylons` now reads "2 white median pylons, A along the bridge axis, 72 m from the water". `span_arrangement` is "120 + 218 + 120 m". Added sources: Tiền Phong, Báo Xây dựng, Đạt Phương, VnExpress 5068581 and Người Quan Sát 240880. The notes now give T26/T27, the start on 26/3/2022, the closure on 30/4/2025, the **technical opening on 2/9/2025**, the route opening on 30/4/2026, official operation on 30/7/2026, and the press pylon figures of 32 m and 34 m against ≈27.5 m from photos. `opened` stays 2026.
- **Regression asserts:** a round-10 block checks the spans, heights, deck, haunch, stays, legs in the median (z = 0), the A legs at x ±3.1 → tip [0, 27.5, 0], the twin walls on the cap at −36.7, the fill strut, the anchor zones, no king-post or "Review r1", nav 40, the text and the sources.
- **`data.test.ts`:** a new Thuận An test. It checks that there are no warnings; E = 40.5 and is not raised; the deck is ≈44.37 at the pylons and 45.5 at mid-span; the haunch is 9.5 at the pylons and 4 at 85 m out; the drawn tip is ≈71.9 m; pylon : deck ≈0.62; every sweep has |z| ≤ 4; the cap top is 3–5.5 m above the water; there are 17 + 17 stays per pylon in the central plane, 26–89 m out, anchored 6.9–20.1 m up the pylon; and the unstayed gap is 40 m. `deck_haunch` is added to the allowed-key list.

### Deviations

- **`construction_start=2022`** is added to the seed. The brief confirms 26/3/2022 [C]; the old note said "not confirmed".
- The model notes are the target JSON's text verbatim. They say a "3 × 5 m opening", while the description says 3 × 4.6 m. I left this as written.

## Renders (scratchpad `views-ta-impl/`, own server on 127.0.0.1:5784)

1. **`custom-az0-el3-pylon0` vs `tp-4-1`:** a narrow A with a small deck-level opening and a solid shaft to a flat tip. Twin wall piers with a narrow gap stand on a cap about 4 m above the water. The girder visibly deepens to about 9.5 m over the pier and blends out over about 85 m, which matches the photo's haunch. There are 17 red stays per side.
2. **`custom-az90-el3-unit` vs `nqs11`:** a slim median column, one stay plane, no legs at the deck edges.
3. **`custom-az160-el30-pylon0` vs `nqs13`:** the stays land on the median centreline, and the cap is wider than the piers. After the per-face strip fix the haunch reads cleanly, with no shading crease.
4. **`custom-az325-el12-unit` and `side` vs `vne_thongxe` and `tp-2`:** two A-shafts with red single-plane fans, about 40 m unstayed at mid-span, and a gently crested deck.

Remaining differences, all P2 and not modelled:
- The cap is a rectangle, but the real one is octagonal.
- There is no lightning mast.
- The opening is drawn without its chamfered top.

## Open

- **P2:** `pile_cap.chamfer_m`, a lightning mast, and twin stays per level (uncertain).
