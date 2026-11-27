# 3D model review: round 5 implementation, Cầu Bến Rừng (2026-11-27)

Brief: `research/model-review/brief-round5-ben-rung.md` (the user reported that the pylons have no foundation). Everything is implemented, including engine gap G7 (`pylon_custom.pile_cap`); the brief's stacked-strut fallback was not needed. Thượng Cát now uses `pile_cap` too.

Nothing is committed. The user's uncommitted UI changes (`src/components/Chrome.tsx`, `src/lib/i18n.ts`, `src/styles.css`) were not touched.

Checks: `npm run typecheck`, `npm run lint`, `npm test` (75 tests) and `npm run build` all pass.

## Engine: G7 `pylon_custom.pile_cap`

| File | Change |
|---|---|
| `src/types.ts` | New `PileCap` type (`length_x_m`, `width_z_m`, `top_y_m`, `thickness_m`, `rounded_ends?`) and `PylonCustom.pile_cap?`. |
| `src/lib/bridge3d.ts` | **`pileCapMesh(L, W, y0, y1, rounded)`** builds a prism: a box, or a stadium plan whose semicircular ends (diameter L) sit on the ±z ends, with 12 segments per end.<br>**Placement:** a cap is built at every custom pylon through the same `toStation` path as the legs. It is therefore mirrored and scaled with the pylon, and mapped through `plan()` so it follows a plan curve or deck crest. Cap y values are ≤ 0, so per-pylon height scaling leaves them alone.<br>**Output:** caps are returned as `Pylon.caps` and included in the world bounds. |
| `src/three/engine.ts` | Caps are rendered with the plain **concrete** material, whatever `pylon_colour` is. |
| `src/lib/validate.ts` | `pile_cap` requires positive sizes, a numeric `top_y_m ≤ 0`, and a boolean `rounded_ends` if present. The brief's "top_y ≥ −E − 10" check is **not** in `validate.ts`, because E can be raised by the navigation clearance at build time and the validator doesn't know it. The data test checks the real cap position against the waterline instead. |
| `docs/data-schema.md`, `docs/design-3d.md` | `pile_cap` is documented. design-3d also notes that pylon supports get no automatic pier, so custom legs or struts must reach the foundation. |

## Data

`research/shapes/cau-ben-rung.json` follows brief §3 exactly:
- **Deck and stays:** `deck_elevation_m` 22, `cables_per_side` 12, `cable_pattern` "semi_fan".
- **Legs:** one continuous sweep each from the cap top (y −20, z ±11; vertical columns 2.5 m across × 5 m along) to blades leaning ≈25° (tips at ±20.6, 18 m above deck; 2.0 × 5.5 m at the top).
- **Struts:** tie beam at y −11, under-deck crossbeam at y −4.5.
- **Pile cap:** 20 × 32 × 5 m stadium, top at y −20, i.e. 2 m above water.
- **Anchor zones:** 6–17 m on each blade.
- **Colours:** white pylons and red stays still come from PHASE6.
- **Text:** VI/EN pylon text and notes updated.

`research/shapes/cau-thuong-cat.json`: the 24 × 24 m square strut from y −27 to −23 is replaced by `pile_cap {24, 24, top −23, thickness 4}`. The geometry is the same block, but it is now plain concrete instead of white. That matches the grey cap in the site photo, and the approved look is otherwise unchanged.

`scripts/gen_bridges.py`: new regression asserts.
- **Bến Rừng:** deck 22, 12 stays, semi-fan, cap top −20 and rounded, both legs starting on the cap top, white / red.
- **Any `pile_cap`:** positive sizes and top ≤ 0.

## Tests

- **`bridge3d.test.ts`:**
  - Box and stadium caps have the right x / y / z extents and valid indices, and the stadium has no corner points.
  - Caps are drawn at every custom pylon at the right world height and station, included in the bounds, and absent from plain pylons.
- **`data.test.ts` (Bến Rừng):**
  - Every pylon has one cap whose top is within ±3 m of the waterline.
  - The legs reach down to the cap.
  - Deck at 22 m, still clearing the 11 m navigation height.
  - Blade lean between 22° and 28°.
  - 12 stays per side, semi-fan.

## Renders and comparison

Renders are in `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/views-br-impl/`: side, front, foot, three_quarter, top, `custom-az0-el2-pylon0`, `custom-az2-el8-unit`, `custom-az90-el25-pylon0` and `custom-az40-el20-pylon0`, plus `cau-thuong-cat-foot` to check the switched cap.

1. **Foundation.**
   - Each of the 3 piers stands on a rounded-end cap at the waterline.
   - Two separate vertical columns rise to the deck edges, joined by the tie beam halfway up and the crossbeam under the girder.
   - Nothing floats: the foot, front and az40 views match `vnx1_zoom` / `tt11`.
2. **Elevation (az0 el2) vs `tt9_centre`.**
   - The blade above the deck is about as tall as the column below it.
   - Blade and column read as one ≈5 m band.
   - The cap is ≈4× the column width, with rounded ends.
3. **Front / az90 vs `vtc5`.**
   - The V opens ≈25° each side, with tips ≈41 m apart.
   - The red stays run up and outward from the deck edges to the blades in a visible fan.
4. **Stays.** 12 per half-fan, 2 planes, red.

Not done, as the brief says: the red inner face of the blades. Per-face colour would need an engine feature.
