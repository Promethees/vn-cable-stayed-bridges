# 3D model review: round 9 implementation, Cầu Hòa Sơn (2026-11-28)

Brief: `research/model-review/brief-r9-hoa-son.md`. All P0/P1/P2 data changes in the brief are implemented. No engine change (the brief needed none; the optional G15 `bank_height_m` and blue brocade trim were not done).

Checks: `npm run typecheck`, `npm run lint`, `npm test` (114 tests) and `npm run build` all pass. The generator runs with no warnings. The generated `model3d` is identical to the researcher's `hswork/target.json` for every key except `notes` (the target had a placeholder; the generated notes are the brief's §3.1 text plus the shape file's colour/notes suffix). In `data/bridges.json` only the `cau-hoa-son` record changed.

## Data

`research/shapes/cau-hoa-son.json` (pass 2, so it wins over `M3D`): `model3d` replaced whole by the §3.1 target (7 spans, E 55, 22 stays per side per plane, back stays [14, 142], composite 21 m deck, approach 200, white / #cfdbe6, `pylon_custom` with legs + mast + spire, cup/stem panel, mast-only anchor zone, submerged pile cap); `pylons_vi` / `pylons_en` / `colour` per §3.4; `review`, `checklist` and `compare` rewritten (cup + stem, merge 0.59 H, light stays from the mast faces, TEDI spans, user-render camera).

`scripts/gen_bridges.py`:

| Where | Change |
|---|---|
| `add(id="cau-hoa-son")` | `width_m=21`, `lanes=4`, `span_arrangement` "40 + 40 + 150 + 550 + 150 + 40 + 40 m (main bridge 1,010 m)", `pylons` "2 inverted-Y 'mountain peak' pylons, 187 m" (overridden by the shape file's Vietnamese text, as for every pass-2 bridge); sources + TEDI, TEDI-GIC, Báo Xây dựng, NQS 20/6/2026, Báo Lâm Đồng 6/2026; notes: communes, why total_length stays 1,200 (press ≈1.2 km; TEDI scope ≈1,239 m; main bridge 1,010 m), TEDI / Trung Chính, mid-6/2026 pile progress, stage-1 lanes |
| `M3D` | Fallback brought in step: 7 spans, composite, `cps=22`, new notes |
| `PRESS` | TEDI official render added first (light stays); the two red-stay press renders kept after it |
| `PHASE6` | stays `#cfdbe6`, comment per the brief |
| `REVIEW_R1` | `deck_elevation_m` 40 → 55 |
| `NAV` | 7 × 50 m, inland waterway class III (TEDI-GIC) |
| Regression asserts | spans (sum 1,010) and fallback in step; E 55, 21 m composite; 22 / 22 / [14, 142]; colours, approach 200, 187 total; 4 legs, no `crossbeams_y_m`, pointed crown; leg tips [78, 78, 123, 132]; legs at ±14.5 at the deck; spire tapers to ≤ 1 m; single anchor zone (leg 2, 84–119); one panel; cap top −57 with feet on it; NAV; span_arrangement / width / lanes; pylon texts; no "Review r1" in notes, "Trung Chính" in notes; TEDI-GIC source; TEDI image first |

## Tests

`src/lib/data.test.ts`, new "Hòa Sơn (round 9)" test (skipped on the sample file), built as `completed`: no warnings; E 55; aux piers [40, 80, 930, 970] (derived from the spans); pylons at 230 / 780; colours white / #cfdbe6; NAV 7 × 50; legs at ±14.5 at the deck, merge 78/132 ≈ 0.59, spire continues the mast and tapers < 1 m. Per pylon: 132 above deck, label 187, deck/label ≈ 0.29, 550/132 ≈ 4.2, 4 leg sweeps + 1 panel, no members, one cap; 22 × 2 × 2 stays all anchored 83–120 m above deck within |z| < 5 (mast faces), on the same side as their deck end; back fan lands 14–142 m behind the pylon.

## Renders and comparison

Scratchpad `views-hs-impl/`: front, side, foot, top, three_quarter, `--az -120 --el 2 --target pylon0` and `--az -135 --el 2 --target pylon0`.

Against the user's official render (az −120, el 2):
- Near pylon right of centre, nearly side-on: one slender mast with a pointed spire, the S-curved stem below the deck dropping as a single grooved shaft to the water; far pylon on the left with its A legs visible. Approach piers on the right. Matches the render's composition and the researcher's prototype (`hswork/r2/`).
- Front view: legs straddle the deck, merge ≈0.59 H into the mast, spire on top; cup narrows into a two-column stem with a groove, on the submerged rounded pile cap. Nothing of the built-in splayed foot or flat box mast remains.
- Stays pale blue-white, two planes from the mast faces only.
- Side view: deck / water-to-tip ≈ 0.29.
- The record is `under_construction`, so the views show balanced cantilevers (global convention; in reality only the foundations exist).

## Deviations

- The `REVIEW_R1` `note` suggested in §3.2 was not added, to avoid a "Review r1: r9: …" prefix; the same explanation is in the shape-file notes and a code comment (as done for Tứ Liên in round 8).
- `total_length_m` kept at 1,200 (press figure); the notes explain the 1,239 m scope and the 1,010 m main bridge.
- Remaining visual differences vs the render are the known optional gap G15 (4 m banks give steep approach ramps instead of hillside viaducts).
