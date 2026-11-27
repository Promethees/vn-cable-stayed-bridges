# 3D model review: round 7 implementation, Cầu Rạch Miễu 2 (2026-11-28)

Brief: `research/model-review/brief-r7-rach-mieu-2.md`. Everything in the brief is implemented: the P0/P1/P2 data changes, the required engine gap **G9**, and the optional **G10** (`crossbeam_depth_m`).

Checks: `npm run typecheck`, `npm run lint`, `npm test` (87 tests) and `npm run build` all pass.

## Engine

### G9: navigation floor at the main-span centre, including the crest

`src/lib/bridge3d.ts`:
- `centre`, `crest` and `crestAt` are now computed before the deck elevation. The widest-main-span index `mi` is also computed there, and the clearance envelope reuses it.
- **Elevation:** `E = max(givenE ?? heuristic, navMin − crestAt(cMain))`, where `cMain` is the centre of the widest main span.
- **Warning:** "deck_elevation_m below navigation clearance" only when `givenE + crestMain < navMin`.
- **Labels:**
  - Custom pylons with `pylon_height_ref` "total": `labelHeight = tip + E + crestAt(x)`. The plan mapping lifts the pylon by the crest at its station, so the label is now the drawn water-to-tip.
  - Built-in pylons: `above = given − E − crestAt(x)`, so the drawn tip equals the given total.
- **Docs:** `docs/data-schema.md` and `docs/design-3d.md` describe the new rule.

### G10: `pylon_custom.crossbeam_depth_m`

| File | Change |
|---|---|
| `src/types.ts` | New field. |
| `src/lib/validate.ts` | Field must be > 0. |
| `docs/data-schema.md` | Documented. |
| `src/lib/bridge3d.ts` | `Member.depth?` is set on the `crossbeams_y_m` members. |
| `src/three/engine.ts` | When `depth` is set, the box is oriented so its depth axis is as vertical as possible: basis (dir × up, dir, side × dir). Members without `depth` render exactly as before. |

### Tests

- **`bridge3d.test.ts`**, new describe block:
  - With the crest, E stays at 36, the deck is 42 at mid-span and there is no warning.
  - A too-low given E is raised by exactly navMin − crest, with the warning.
  - The heuristic E is lowered by the crest.
  - Without a crest the floor is unchanged.
  - Custom and built-in labels include the crest at the pylon.
  - Crossbeam depth is carried on the members.
- **`data.test.ts`**:
  - New Rạch Miễu 2 test, skipped on the sample file: spans, no aux piers, E 36, mid-span deck 42, the 37.5 m envelope cleared, deck ≈40 at the pylons, 66 m above the deck, ratio 1.55–1.75, label 105–108, pile cap, crossbeams at −3 and ≈0.53 × above-deck with depth 5, 14 × 2 × 2 stays anchored 30–62 m above the deck, white stays.
  - The existing per-vertex bounding-box test now has a 20 s timeout. It ran ≈4.8 s on the loaded machine, against the 5 s default.

## Data

`research/shapes/cau-rach-mieu-2.json`:
- `model3d` is as in brief §3.1, plus `crossbeam_depth_m` 5.
- `auxiliary_piers_m_from_end` is deleted.
- `pylons_vi` / `pylons_en`, `notes`, `review` and `checklist` are updated.

`scripts/gen_bridges.py`:
- **Seed:** the `m3d` seed spans are now [120, 270, 120] and its notes are updated.
- **Aux piers:** the `auxiliary_piers_m` entry is removed from PHASE6 and from EXPECT_R1. The REVIEW_R1 entry keeps 116.5 m and the nav; only its pylon text changed.
- **Bridge record:**
  - `span_arrangement` "120 + 270 + 120 m"; new `pylons` text (VI and EN, via REVIEW_R1).
  - Sources: Tạp chí GTVT and Trung Nam added.
  - Notes: "No free image found" dropped; spans, height, 112 stays and the 17.5 / 21.5 m width alternatives added.
- **Regression asserts:** spans, no aux piers, 14 stays, white, E 36 + crest 6, width 17.5, crossbeams [−3, 35] with depth 5, tips at 66, columns on the cap top, anchor zones 31–61, rectangular cap, span_arrangement, notes and pylons text.
- **Regeneration:** `data/bridges.json` is regenerated. Only this bridge's record changed.

## Renders and comparison

Renders are in `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/views-rm2-impl/`: side, front, foot, three_quarter, top, `custom-az0-el0-unit`, `custom-az-40-el35-pylon0` and `custom-az40-el35-pylon0`.

1. **H form.** The front view and both aerials read as an H:
   - two vertical columns outside the deck edges;
   - a deep 5 m strut at ≈53 % of the above-deck height;
   - the lower crossbeam under the girder;
   - flat heads.

   This matches `v_pyl.jpg` and `vnx_dsc.jpg`. The real strut has curved haunches, which are not modelled.
2. **Elevation (az 0) vs `commons.jpg`.**
   - Two end piers only, with the stays ending at them; no aux piers.
   - The pylon-to-deck ratio matches.
   - The deck visibly crests to mid-span.
3. **Stays.** White (rendered as a muted light grey-beige), semi-fan, two planes at the deck edges, 14 per side per plane.
4. **Foot.** A rectangular 22 × 34 m cap just above the water, with both columns on it.
5. **Clearance.** E = 36, mid-span soffit 39.75 m, no warning.

## G9 effect on the other crested bridges

Re-rendered side and foot views are in `.../scratchpad/views-rm2-crest/`. All look right.

| Bridge | Crest | E before → after | Label before → after | Comment |
|---|---|---|---|---|
| cau-bai-chay | 8 | 54.63 → **46.63** (−8.0) | 91.5 (above deck, unchanged) | Navigation (50 m) had forced E. The mid-span deck is now 54.6 m (was 62.6), with the soffit just above 50 + 1. |
| cau-my-thuan | 6 | 41.42 → **35.42** (−6.0) | 123.4 → 121.7 | Navigation (37.5 m) had forced E. The mid-span deck is now 41.4 m. The label is closer to the data's 120 m. |
| cau-long-hung | 6 | 35.00 (unchanged) | 175.0 → **179.5** | No nav. The geometry is unchanged; the label now reports the drawn tip, which includes the 4.5 m crest at the pylon. A follow-up could scale its custom pylon by ≈0.975 to draw 175 m. Not done here because it is another bridge. |
| cau-nguyen-trai | 4 | 30.00 (unchanged) | 109.5 → 112.3 | Same as Long Hưng: label only. Still within its data test (105–113); the data says 111. |
| cau-thuong-cat | 3 | 25.00 (unchanged) | unchanged (above deck) | none |

## Deviations and open points

- **Confidence:** `model3d.confidence` stays "estimated", because the generator forces it for shape-file bridges. The brief allowed "verified".
- **Deck width:** kept at 17.5 m. 21.5 m is mentioned in both notes, with the change it would need (columns to z = ±13).
- **Validation file:** the brief's "docs/validate.ts" is `src/lib/validate.ts`.
