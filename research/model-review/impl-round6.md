# 3D model review: round 6 implementation, Cầu Nguyễn Trãi (2026-11-27)

Brief: `research/model-review/brief-round6-nguyen-trai.md`. The authoritative configuration is the official render the user supplied (`ref/nt/user-official-render.png`). Everything in the brief is implemented, including engine gap G8 (per-side anchor zones) and the optional bracing diagonals.

Nothing is committed (the base is `bd2f459`). Checks: `npm run typecheck`, `npm run lint`, `npm test` (79 tests) and `npm run build` all pass.

## Engine: G8, per-side anchor zones

| File | Change |
|---|---|
| `src/types.ts` | `anchor_zone[i].side?: 'main' \| 'back'`. |
| `src/lib/bridge3d.ts` | When any zone has a `side`, each side's stays use only the zones for that side; zones without a side serve both.<br>**Two-plane side** (the split back side, or `cable_planes` 2): pick the zone whose leg's mean z sign matches the plane.<br>**Single-plane side:** use the first matching zone.<br>**Anchor z:** the leg's real z, not forced to 0. The old "split back stays on the faces of one mast" offset is skipped. Deck anchors stay at z = 0 on a single-plane side and ±hw on a two-plane side.<br>Harp and semi-fan logic is unchanged. Bridges without `side` behave exactly as before; all earlier tests pass unchanged. |
| `src/lib/validate.ts` | `side` must be "main" or "back". |
| `docs/data-schema.md`, `docs/design-3d.md` | `side` documented. |

## Data

`research/shapes/cau-nguyen-trai.json`, as in the brief §2:
- **Spans and pattern:** 125 + 300 + 125 m; `cable_planes` 1 + `back_stay_planes` 2; semi-fan, 20 per side.
- **Deck:** 26.5 m concrete, `deck_elevation_m` 30, `deck_crest_m` 4.
- **Colours:** white pylons and stays.
- **Heights:** [111, 111] total. The label comes from the geometry, ≈109.5 m.
- **Legs**, in the order [rear −z, mast, rear +z], so the crossbeams at −4 / 22 / 42 / 60 m form the under-deck portal plus three rungs:
  - **Mast:** curved, convex toward the main span, tip leaning back to x −4 at 79.5 m above deck.
  - **Rear columns:** set back at x −9 under the deck edges, leaning inward to ±2 at 67 m, 12.5 m below the mast tip.
- **Diagonals:** the optional bracing diagonals are added as 4 struts, 1.2 m (mast y 32 → rear y 12, mast y 52 → rear y 32).
- **Anchor zones:**
  - main: mast, 30–76 m
  - back: rear columns, 24–64 m
- **Pile cap:** 32 × 34 × 5 m, top at y −28 (2 m above water). The mast and rear columns run down to it as the pier columns.

`scripts/gen_bridges.py`:
- **Fields:** `lanes` 6; the `pylons` seed text updated (the shape file's VI / EN text is what the data uses).
- **Sources:** TEDI (designer), vietnam.vn, Báo Lâm Đồng, Dân Trí and Duyên Hải Land added; existing sources kept.
- **Notes:** the "geometry unchanged / placeholder" wording is replaced with the confirmed facts.
- **Regression asserts:** spans, planes, 20 stays, deck 30 m + 4 m crest, 3 legs and the crossbeam levels, zone legs and sides, cap top −28, lanes 6.

Bridge fields `main_span_m` 300, `span_arrangement` and `width_m` are unchanged (they matched the official figures).

## Tests

- **`bridge3d.test.ts` (G8):**
  - Main-span stays anchor on the mast at z = 0, with deck anchors at z = 0 and anchors 30 m or more above the deck.
  - Back-span stays anchor on the rear column of the same side, with deck anchors at ±13.25.
  - Counts: 20 main and 40 back per pylon.
  - Rear anchors sit behind the mast and mast anchors in front of the rear columns.
  - Without `side`, the old centreline behaviour holds.
- **`data.test.ts` (Nguyễn Trãi):**
  - Deck at 30 m, clearing the 25 m channel; pylons at 125 and 425 m.
  - Label between 105 and 113 m (total); one pile cap per pylon.
  - 20 main stays in the central plane and 40 back stays on the matching side, per pylon.
  - The existing "every stay anchors on a swept leg" and "bounding box" data tests also pass for the new pylon.

## Renders and comparison

Renders are in `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/views-nt-impl/`: side, front, foot, three_quarter, top, `custom-az55-el25-unit`, `custom-az15-el3-pylon0` and `custom-az90-el5-pylon0`.

1. **az 55 vs the user render.**
   - Two pylons ≈300 m apart, near one lower right.
   - Each reads as a sail: a tall curved front mast with the apex, two shorter rear columns and rungs between them.
   - The near-pylon crop matches `user_near.jpg` in arrangement.
2. **Along the axis (az 90) vs the stage screen.** A central vertical mast, flanked by two rear columns that lean inward and stop below its tip, with three crossbeams.
3. **Elevation (az 15) vs TEDI r2.**
   - The mast bows toward the main span with its tip back over the side span.
   - ≈17 m between mast and rear columns at the deck.
   - Rungs and diagonals between them.
   - Pier columns down to the cap at the waterline.
4. **Stays.**
   - Main span: one central plane from the mast to the median.
   - Side spans: two planes from the rear columns to the deck edges.
   - White, made visible by the stay-lightness clamp.
   - Only stays reaching the 60% cantilevers are drawn, which is the global under-construction convention.
5. **Deck.** 30 m above water with the ≈4 m crest; clears 165 × 25 m.

**Differences and notes:**
- The pylons read light grey rather than bright white. That is the muted "white" tint under the model lighting, the same as on the other white pylons.
- The rungs are straight members. In the render they read as slightly arched, which the brief accepts.
- The night lighting is not modelled.
