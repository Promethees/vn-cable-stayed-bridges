# 3D model review: round 7 implementation, Cầu Trần Thị Lý (2026-11-28)

Brief: `research/model-review/brief-r7-tran-thi-ly.md`. Everything in the brief is implemented. The brief calls its engine gap "G9", but that name is already taken by another engineer's change, so this one is named **G11** in the code, docs and notes.

Checks: `npm run typecheck`, `npm run lint`, `npm test` (84 tests) and `npm run build` all pass, and the generator runs clean.

## Engine: G11, back-stay count and deck range

| File | Change |
|---|---|
| `src/types.ts` | Optional `back_stay_count?: number` and `back_stay_deck_m?: [number, number]` on `Model3D`. |
| `src/lib/bridge3d.ts` | **Count:** on a back side (`isBackSide`), the stays per plane are `back_stay_count ?? perSide`.<br>**Deck range:** when `back_stay_deck_m` is set and the pattern is not harp, stay `t` lands at `p.x + side · (d0 + (d1 − d0) · t)`. `t = 0` is the lowest pylon anchor, so the fan nests without crossings. Both ends are clamped to [1, distance to the unit end − 1]. There is no `AUX_SNAP` snapping.<br>**Edge cases:** `d0 > d1` is swapped with a warning. Harp ignores the range and warns.<br>**Main sides** are unchanged. Without the fields, the code path is identical to before. |
| `src/lib/validate.ts` | `back_stay_count` must be an integer from 1 to 60. `back_stay_deck_m` must be two finite numbers ≥ 0. |
| `docs/data-schema.md`, `docs/design-3d.md` | Both fields documented as G11. |
| `src/lib/data.test.ts` | Both keys added to the allowed model3d key list. |

There is no model3d key *whitelist* in the generator. It only has the `NON_SCHEMA` drop list, so nothing needed adding there. The keys are guarded by the `data.test.ts` key list and the new generator asserts instead.

## Data

The brief §3 values are set in all of these, so they agree with each other:
- `research/shapes/cau-tran-thi-ly.json`
- the `REVIEW_R1["cau-tran-thi-ly"]` `set`
- the `m3d` seed
- the `PYLON` seed

The pylon geometry is defined once, as `TTL_PYLON` in `scripts/gen_bridges.py`, and reused by REVIEW_R1 and PYLON. The shape file holds a copy of the same values.

The values:
- **Spans:** `spans_m` [200, 230], `auxiliary_piers_m` [50, 100, 150].
- **Deck:** `deck_elevation_m` 11, deck 34.5 m.
- **Stays:** semi-fan; 33 main stays (`cables_per_side`); `back_stay_count` 15; `back_stay_deck_m` [181, 195].
- **Mast (leg 0):** tip at (−28.5, 134), depth 11 → 4.5 m, width 6 → 4 m.
- **S5 pier (leg 1):** 15 × 12 m, from y −10.5 to −2.
- **Anchor zones:** main 48–126 m, back 68–126 m.
- **Pile cap:** 22 × 30 × 3 m, top −10.5, rounded ends.
- **Colours:** white mast and main stays, red back stays.
- **Confidence:** `verified`.

Bridge fields:
- `width_m` 34.5.
- New `span_arrangement`.
- `pylons` / `pylons_en` per the brief.
- VECC, DCCD, ITST, danang.gov.vn and vi.wikipedia added to `sources`.
- Bridge `confidence` set to `verified`.
- The notes are rewritten: there is no "120 m back span" or "Geometry unchanged" text left.

`nav_clearance` is 7 × 50 m (VECC). `EXPECT_R1` and a new regression block assert all of this.

## Tests

- **`bridge3d.test.ts`, G11 (3 tests).** The Trần Thị Lý-like model gives:
  - 33 main stays at z = 0, with deck anchors at 200 + [17, 219].
  - 30 back stays: 15 at −hw and 15 at +hw, leaving the mast faces.
  - Back deck anchors at stations 5–19 ± 0.5 and back pylon anchors at 68–126 m.
  - No crossings.

  It also covers:
  - the swap warning, clamping to the unit end, and the harp warning;
  - without the fields, 66 back stays spread over the reach; with the count alone, 30.

  The existing `back_stay_planes` tests are unchanged and green.
- **`data.test.ts`, Trần Thị Lý.** Checks:
  - deck 11 m, aux piers 50/100/150, pylon at 200, label 142–148 m, one pile cap;
  - a 12° lean, 33 + 30 stays, back deck anchors at ±17.25 m within 5–19 m;
  - nothing landing over S2–S4, and no warnings.

## Renders vs the references

Renders are in `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/views-ttl-impl/`. They cover the five standard views and the brief's six cameras.

1. **az 0 el 0 vs the VECC elevation.** This matches the drawing closely:
   - Four 50 m spans with piers S2–S4, then 230 m to S6.
   - The mast leans back over the side spans.
   - A thin red reverse fan converges on the last ≈15 m at S1, and nothing lands over S2–S4.
   - The white semi-fan runs nearly to S6.
2. **az 180 el 3 vs c3 / c5.** The main span is on the left and the mast leans right. The dense red wedge converges at the right-hand end at deck level. The proportions match c3.
3. **az 200 el 12 vs c1.** This shows the same wedge from high up. The red back planes read as a twisted ribbon.
4. **az −90 el 2 / el 25 vs c7 / s4.** These show the "tent": two red planes from the deck edges (±17.25 m) to the faces of the slender central mast. The main stays stay hidden on the centreline behind the mast.
5. **Foot.** The tapering blade (≈11 m at the deck) sits on a wider pier block on a low rounded pile cap at the waterline.

**Differences and notes:**
- The S5 pier is a rectangular 15 × 12 m block. The swept legs have rectangular sections, so it cannot be a true oval. The pile cap does have rounded ends.
- The V-section of the mast and the lantern and antennas on top are not modelled. The top is flat.
- The night lighting is not modelled.
