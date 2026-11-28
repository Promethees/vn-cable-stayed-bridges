# Implementation: round 11, Cầu Đại Ngãi 1 (`cau-dai-ngai-1`), 2026-11-28

Implements `brief-r11-dai-ngai.md` against the user's official render (`scratchpad/ref/dn/user-official-render.png`), plus G18 `pile_cap.chamfer_m` and red stays.

## Changes

- **`research/shapes/cau-dai-ngai-1.json`**: `model3d` replaced by the brief's §4 JSON (A legs z ±20 at the cap at −37.5 → ±14 at the deck → ±2.1 at 68 m, slotted blades to 99 m, pointed tip at 110; eye link 68 m, capital 98.5 m, two plinths; 5 m deep crossbeam at −5.5; cap 30 × 60 × 6 m; anchors 63–97 m on both legs; deck 41 + crest 8.5, depth 3.0; semi-fan 20/side; aux piers [60, 810]; white pylons). Deviations from the brief:
  - `stay_colour` is `#c8262c` with `colour_mode: "vivid"` instead of the named `red`. The named palette red (`#B65A4E`) read brick/salmon as 1 px lines in the prototype; the render's stays are clearly red.
  - `pile_cap.chamfer_m: 9` (G18). The render's cap (`crop_base.png`) has cut corners with a visible flat end face, so it is an octagon, not the pointed hexagon (`chamfer_m = 15`) that the brief suggested.
  - `pylons_vi` / `pylons_en`, `colour`, `notes`, `review` (round-11 line), `checklist` (all "pass (official render)", head "limited") and `compare` were updated as specified.
- **`scripts/gen_bridges.py`**:
  - Seed: `pylons` "2 tháp chữ A (Y ngược) màu trắng …", `pylons_en`, `span_arrangement`, `width_m` 21.5, `lanes` 4, `total_length_m` 2560, plus the 5 new sources. The notes say 110/164 m are consistent and add the 27/11/2026 progress and the 32 Ø2.5 m piles up to 116 m. The Commons remark is kept. `status` stays `under_construction`, `opened` 2028, and there is no `deck_closed`.
  - The M3D fallback is kept in step (inverted_Y, semi_fan, cps 20).
  - PHASE6 is `{pylon_colour: white, stay_colour: #c8262c, colour_mode: vivid}`.
  - NAV is 45 × 160 (Báo Đầu tư).
  - EXPECT_R1 entry added, and the bridge is added to `VIVID_OK`.
  - New G18 opt-in assert: only this bridge may set `chamfer_m`.
  - Round-11 assert block covering:
    - legs, tips and the merge at 68;
    - crossbeam and struts;
    - the cap with chamfer;
    - anchor zones;
    - nav;
    - no `deck_closed`, `main_stay_deck_m` or `deck_haunch`;
    - text and sources.
- **G18 engine**:
  - `pileCapMesh(..., seg, chamfer)` draws a box with its four vertical corners cut at 45° by `min(c, L/2, W/2)`, dropping coincident vertices (an octagon, or a hexagon at c = L/2).
  - Wired from `pile_cap.chamfer_m`.
  - `PileCap.chamfer_m` added in `src/types.ts`.
  - `src/lib/validate.ts` rejects a value that is not a number, is ≤ 0, is > min(L, W)/2, or is combined with `rounded_ends: true`.
  - Documented in `docs/data-schema.md` and `docs/design-3d.md`.
- **Tests**:
  - `bridge3d.test.ts`: G18 block with 5 tests:
    - absent or 0 gives the identical box arrays;
    - octagon vertices and indices;
    - hexagon and clamping;
    - validation;
    - 8-sided caps at every pylon.
  - `data.test.ts`:
    - Round-11 Đại Ngãi test, run for both `under_construction` and `completed`: no warnings, E 41, deck ≈47.2 at the pylons and 49.5 at mid-span, tip ≈157.2 m above the water, 8-sided cap ≈4 m above the water and 60 m wide, height ratio 2.3–2.9, 20 × 2 × 2 stays per pylon anchored 63–97 m on the matching side, `#c8262c` vivid.
    - The vivid list now includes `cau-dai-ngai-1`.

## Checks

- `python3 scripts/gen_bridges.py data/bridges.json`: no assertion failures. Only `cau-dai-ngai-1` changed in `data/bridges.json`.
- `npm run typecheck`, `npm run lint`, `npm test` (141/141) and `npm run build` all pass.
- Renders from my own server (127.0.0.1:5811) are in `scratchpad/views-dn-impl/`: the standard views plus `custom-az-125-el1-pylon0`.
  - **az −125 / el 1 / pylon0**: two straight legs on plinths on an octagonal cap wider than the leg spread. The deck passes between the legs over the deep crossbeam. The legs meet at ≈0.62 of the height and continue as slotted blades to the capital, then the pointed tip. The red stays run in two planes from the blades. The far pylon recedes to the left, as in the render.
  - **front**: an A from the cap to 68 m, then the narrow slotted shaft with the capital. The legs are outside the deck edges and the stays are clearly red.
  - **side**: the crested deck, one auxiliary pier per back span, and the semi-fan.
  - **top**: slotted blades with the capital and the converging tip, and no separate mast.
  - No generator or geometry warnings.
- **Byte-identical regression**: `cau-vam-cong` and `cau-rach-mieu-2` (box pile caps) were rendered in all 5 standard views from the branch and from HEAD (HEAD's `bridge3d.ts`, `validate.ts`, `types.ts` and `bridges.json` served by the same server). All 10 PNGs are identical. As a control, the Đại Ngãi front view differs between the two.

## Known limits

- **Pylon colour**: the pylons use the palette `white` (`#E9EAE6`). Under the scene's Lambert lighting they read light grey rather than the render's bright white; the other "white" bridges look the same. A hex white under vivid would be darker (lightness is clamped to 0.80), so there is no data-only fix. Brighter whites would need a lighting or material change, which is out of scope.
- **Construction stage**: the `under_construction` state draws 60 % cantilevers with stays. The real bridge (11/2026) has towers only. This is the project-wide P2 item, not done here.
- **Not modelled (P2 extras skipped by instruction)**: the pierced crown and spike, the red edge girders (`deck_edge_colour`) and frustum-shaped plinths.
