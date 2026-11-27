# 3D model review: round 2 implementation, Cầu Thượng Cát (2026-11-27)

Brief: `research/model-review/brief-round2-thuong-cat.md`. The user confirmed the spans 120 + 270 + 270 + 120 m, and they replace the "client-confirmed 2026-11-25" 4 × 195 m. Round-1 work is unchanged, and nothing is committed.

Renders are in `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/views-r2/`:
- the standard views: side, front, three_quarter, foot and top
- `custom-az5-el3-unit`, compared with TEDI CTC_1
- `custom-az90-el2-pylon0`, the along-deck view, compared with CTC_2

Checks: `npm run typecheck`, `npm run lint`, `npm test` (71 tests) and `npm run build` all pass. One run done while renders were running failed: the existing bounding-box data test took 7.6 s and hit vitest's 5 s timeout. A clean rerun passed in 2.8 s, so this was machine load, not a geometry problem.

## Changes

| Where | What |
|---|---|
| `scripts/gen_bridges.py` `add(cau-thuong-cat)` | Bridge-level fields:<br>• `main_span_m` 270; `cable_stayed_spans` 2; `width_m` 35<br>• `span_arrangement` "120 + 2 × 270 + 120 m (780 m cable-stayed main bridge)"<br>• Sources: Báo Đấu thầu, Dân Việt (ground-breaking), VTV, TEDI, VOV, Soha, CafeF 4/2024, Dân Trí, mekongasean, plus the earlier Dân Việt / VTC / OSM entries. The "client-confirmed" provenance string is removed.<br>• Notes: they cite the ground-breaking figures and the user's confirmation on 2026-11-27, record that this supersedes 4 × 195 m, and keep the 2024 competition scheme (100 + 2 × 200 + 100 m). They also cover the deck, the pylon concept, heights and construction status. |
| `scripts/gen_bridges.py` `M3D` | Placeholder updated to the new spans and heights (the shape file replaces it). |
| `scripts/gen_bridges.py` `EXPECT_R1` | Asserts the spans, [70,80,70] above_deck, deck 35 m concrete, `deck_elevation_m` 25 and 11 stays per side. |
| `research/shapes/cau-thuong-cat.json` | `model3d` follows brief §3, with one deviation (the pier block, below):<br>• `pylon_shape` "other"; 2 planes, semi_fan, 11 stays per side<br>• deck 35 m concrete, `deck_elevation_m` 25, `deck_crest_m` 3<br>• white pylons and stays<br>• `pylon_custom`: two dove-wing blades from z ±9 at the waterline through ±19.5 at deck level to ±41.5 at y 80 (≈15° outward lean, slight curve), tapering 3.5 → 1.2 m across and 12 → 1.5 m along the bridge; under-deck crossbeam at −3 m; anchor zones 40–77 m on each blade; mirrored<br>• `pylons_vi` / `pylons_en` from the brief; review and notes updated |
| `src/lib/data.test.ts` | New Thượng Cát test:<br>• pylons at 120 / 390 / 660 m, deck at 25 m, heights 70 / 80 / 70 m<br>• no member above the deck<br>• blade tips more than 15 m outside the deck edges<br>• every stay runs from a deck edge (±17.5 m) outward to a blade on the same side |
| `research/candidates.md`, `research/questions.md` | 4 × 195 m marked as superseded by 120 + 2 × 270 + 120 m. |

No engine changes. Round-1 G1 (`deck_elevation_m`), G4 (per-pylon custom heights) and the separate-leg `pylon_custom` cover this bridge. G4 scales the side pylons by 70/80, which also lowers their anchor zones and tips.

**Deviation: pier block.** The brief's strut is a horizontal member at the waterline from z −9 to +9, 6 m wide. In the foot view it read as a thin bar between two separate feet, not one pier. I replaced it with a vertical block from y −25 to −18, 20 m square. Both blades now rise out of one pile-cap block, which matches the Soha / VTC photo of two rebar cages diverging from one block.

## Render review

1. **Side / az5:**
   - 3 pylons at 120, 390 and 660 m; the centre pylon is visibly taller.
   - No crossbeam above the deck.
   - The az5 view matches CTC_1: the side pylons show their two blades splayed apart in perspective, and the centre one reads as a single blade.
2. **Front / along-deck (az90):**
   - Each pylon is an open V of two separate blades from one pier, passing just outside the 35 m deck.
   - The blades lean outward with pointed tips about 83 m apart on the centre pylon.
   - There is a crossbeam under the deck.
   - The stays rise outward from the deck edges to the blades, like CTC_2.
3. **Foot:** both blades rise from one pier block at the waterline; the deck is 25 m above water.
4. **Labels:** 70 / 80 m above deck (the data uses `above_deck`), 11 stays per half-fan per plane, white pylons, visible light stays.

## Known limits (from brief §4, not changed)

- The blades taper linearly. The real wing outline is widest a little above the deck.
- Under-construction bridges are drawn with full pylons and 60% cantilevers, as for every other under-construction bridge. In reality the towers are at segment 3–6 of 32 and P30 has no tower yet. The cantilever form travellers also dominate the close front view.

## Round 2b (feedback-round2.md, 2026-11-27)

All three items are done, including the optional P2. No engine change.

| Item | Change |
|---|---|
| P0-1 pylon | `research/shapes/cau-thuong-cat.json` `pylon_custom` replaced by the feedback geometry:<br>• Legs 0–1: lower flared segments from the waterline (±8 m) to deck level (±20.5 m). 14 m along the bridge at the waterline, 6.5 m at the deck; 7 m across at the waterline, 10 m at the deck.<br>• Legs 2–3: upper blades from ±20.5 m to ±38 m at y 80, leaning ≈12.5°. 6.5 m along the bridge at the deck, 4 m at the blunt top; 10 m across at the deck, 1 m at the tip.<br>• `crossbeams_y_m` dropped.<br>• The 20 m block from round 2 is replaced by a 24 × 24 m pile cap spanning ±2 m around the waterline (y −27 → −23).<br>• Anchor zones are 33–63 m on legs 2 and 3, which leaves the top fifth of each blade bare. |
| P1-2 | `cables_per_side` 13, in the shape file and in the generator's regression asserts. |
| P2-3 | Curved under-deck "bird body" beam added as a 5th leg (centreline from ±16 m at y −2 down to y −11 at the centre; 3 m wide, 6 m along the bridge), and the y −3 strut removed. Its mean z is 0, so it never takes stays. |
| Tests | The Thượng Cát data test now also checks:<br>• 5 legs, with anchor zones on legs 2 and 3<br>• no `crossbeams_y_m`<br>• 13 stays per side<br>• every stay anchor between 0.39 and 0.81 of the pylon height<br>• every member either within 2.5 m of the waterline (the cap; the tolerance covers the deck crest lift) or just under the deck<br>The existing tests (V lean, tips outside the deck, outward stays, centre pylon taller, no member above the deck) still pass. Typecheck, lint, test (71) and build pass. |

Renders are in `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/views-r2b/`: the standard views plus `custom-az5-el3-unit` and `custom-az90-el2-pylon0`. Compared with the TEDI references in `ref/tc/`:
- **Low side view (az 5) vs CTC_1:**
  - The centre pylon reads as one slender, near-parallel band with a blunt top and a trumpet flare into the water.
  - The side pylons show two diverging bands.
  - There is no tall block above the water, only the low cap.
- **Along-deck view (az 90) vs CTC_2:**
  - Wide wing faces taper to pointed tips, and the inner edge leans out more than the outer edge.
  - The blades start just outside the carriageway.
  - The curved under-deck beam is visible below the deck.
- **Front and foot:** a V from one low pile cap, the curved beam under the deck, and nothing joining the blades above it.
- **Stays (13 per half-fan per plane):** the highest anchors are at ≈0.79 of the height, and the top fifth is bare (asserted in the test).
  - In the default renders the stays appear to stop around 0.55 of the height. That is the global under-construction convention: stays are drawn only to the 60% cantilevers, so the outer, highest stays are not drawn yet.
  - With `status: completed` the full fan reaches the 0.79 height.
- **Joint at deck level:** the lower and upper segments meet with matching 10 × 6.5 m sections. There is a slight change of direction at deck level, but it is hidden by the deck in every standard view, so the optional per-leg `sections` engine feature is not needed now.

## Round 3 (feedback-round3.md, 2026-11-27)

Data only, no engine change. I did both P1-1 and the optional P2-2.

| Item | Change in `research/shapes/cau-thuong-cat.json` → `pylon_custom.legs` |
|---|---|
| P1-1 flare (legs 0, 1) | Along the bridge: 14 → 6.5 m becomes **10 → 4.5 m**. Across the bridge: 7 → 10 m, unchanged. |
| P1-1 blades (legs 2, 3) | Along the bridge: 6.5 → 4 m becomes **4.5 → 3 m**. Across: 10 → 1 m wing, unchanged. The deck-level joint still matches: 10 × 4.5 m on both sides. |
| P1-1 bird-body beam (leg 4) | Along the bridge: 6 m becomes **4.5 m**. |
| P2-2 tip flick | Upper-blade centreline changed to [y 0 z 20.5], [25, 25.0], [55, 31.0], [70, 35.0], [80, 39.5], mirrored. Anchor zone stays at 33–63 m. |
| Regression | Generator assert: blade depths [10, 10, 4.5, 4.5], wing 10 → 1 m, anchors on legs 2 and 3. Data test: height / along-bridge width at the deck between 17 and 22, flare / shaft between 2 and 2.5, and the joint sections match. |

Typecheck, lint, test (71) and build pass.

Renders are in `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/views-r3-impl/`: the standard views plus `custom-az5-el3-unit`, `custom-az90-el2-pylon0` and the close elevation `custom-az0-el1-pylon0`.

Measured on the close elevation (1200 × 800). Both blades are seen edge-on and overlap, and the nearer one sets the silhouette.
- The blade stands ≈524 px above the deck.
- Widths along the bridge: ≈30 px at the deck, ≈24 px at mid-height, ≈22 px near the top.
- Height / width is therefore **≈17.5 at the deck** and **≈22 at mid-height**. Round 2b was ≈12. The nominal ratio is 80 / 4.5 = 17.8.
- The flare reaches ≈61 px near the waterline, **≈2.0 × the shaft**.

The deck-level ratio sits just under the 18–22 target. That follows directly from the specified 4.5 m, so I kept the brief's value and did not slim it further. Taking the blade base to 4.0 m would give ≈20.

**Along the deck (az 90):** the wing faces and pointed tips are unchanged. The tips now flick outward in the top third, closer to the feather shape in CTC_2.

**Az 5, front and foot:** slimmer bands in elevation, the same V from the low pile cap, the curved beam under the deck, and nothing above it.
