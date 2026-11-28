# Feedback r12, Cầu Cửa Hội (`cau-cua-hoi`), iteration 1 — 2026-11-28

Commit `6a705bc` on branch `worktree-agent-a6213232f2171fd7e`.

I re-rendered it on my own server (:5822) into `scratchpad/views-ch-r1/`. The two acceptance cameras (`--az 30 --el 1 --target unit` and `--az 0 --el 2 --target unit`) are byte-identical to my `chwork/r3/` target. The implementation is therefore faithful to the brief.

**Verdict: one change required (P1), in the pylon head.** Everything else is accepted as is, so do not touch it:
- spans, deck 26 + crest 2.6, haunch {5, 60};
- 24.5 m navigation clearance, pier and cap;
- stays (11, semi-fan, [14, 58]) and vivid colour;
- text, sources, allow-lists and tests.

The fault is in my brief, not in the implementation. The brief's bud and shaft dimensions are too fat. That is why the engineer correctly saw a "squat rectangular lantern".

## Required change (P1): slimmer shaft, gradual lotus bud

**What the photos show.** I re-measured the head on higher-resolution crops:
- `ref/ch/nq1_pyl.png`, the completed bridge at 3×. Pylon 208 px = 29 m, so 7.2 px/m.
- `ns3_p.png`, a drone view along the bridge.
- `ns4_p.png`, from the deck.

| Feature | `nq1` | Model (iteration 1) |
|---|---|---|
| Shaft width | ≈2.5 m at the deck, ≈2.9 m just under the bud | 3.4–4.0 × 4.2–5.0 m |
| Bud / shaft width ratio (`nq1`, `ns3`, `ns4`) | **≈1.7–1.9** | ≈1.2–1.5 |
| Bud swell | **gradual**, from ≈18 m up to its widest at ≈23.5–25 m | short and abrupt, 19 → 21.5 m |
| Above the widest point | a **rounded shoulder** at ≈25.5–26.8 m, then a **pink-red cone** of ≈2.2 m from ≈26.8 to 29 m (a ≈2 m finial on top) | a tall straight 6 × 6 block (21.5–24.5 m), then a long white taper |

The `ns7` top view gives the bud as ≈6 m, but the bud is ≈25 m closer to the drone than the deck it was scaled against. It is therefore ≈5–5.5 m wide.

The early `vtv` value of a 4.2 m shaft was a 13 px blur at 3 px/m. It was wrong.

**Fix with existing features.** In the shape file, replace `pylon_custom.legs[0..4]` with the legs below. Leg 5, the pier, is unchanged.

```json
{"centerline": [[0, -0.5, 0], [0, 9.0, 0], [0, 18.5, 0]],
 "width_base_m": 3.0, "width_top_m": 3.2, "depth_base_m": 3.2, "depth_top_m": 3.4},
{"centerline": [[0, 18.5, 0], [0, 21.0, 0], [0, 23.5, 0]],
 "width_base_m": 3.2, "width_top_m": 5.5, "depth_base_m": 3.4, "depth_top_m": 5.5},
{"centerline": [[0, 23.5, 0], [0, 24.5, 0], [0, 25.5, 0]],
 "width_base_m": 5.5, "width_top_m": 5.0, "depth_base_m": 5.5, "depth_top_m": 5.0},
{"centerline": [[0, 25.5, 0], [0, 26.15, 0], [0, 26.8, 0]],
 "width_base_m": 5.0, "width_top_m": 2.6, "depth_base_m": 5.0, "depth_top_m": 2.6},
{"centerline": [[0, 26.8, 0], [0, 27.9, 0], [0, 29.0, 0]],
 "width_base_m": 2.6, "width_top_m": 0.3, "depth_base_m": 2.6, "depth_top_m": 0.3, "colour": "#c8505a"}
```

I prototyped exactly this in `chwork/repo`. It generates with no warnings, and the anchor zone of 7–18.5 m still lies on leg 0 (0 to 18.5). The renders are in `chwork/r4/`, and the comparison sheet is `chwork/r4/sheet.png`. The head now reads as a slim stem with a swelling bud, a shoulder and a pink cone, which matches `nq1` far better than the lantern.

Also update the text to match:
- `pylon_custom.description`: "≈3.0 m across × 3.2 m along at the deck, ≈3.2 × 3.4 m at 18.5 m; the bud swells gradually to ≈5.5 m at 23.5 m, rounds over a shoulder at 25.5–26.8 m and ends in a pink-red cone to 29 m".
- `model3d.notes`: change "≈6 m across" to "≈5.5 m across". Do the same in `pylons_*` and `colour` if they give the size.
- Adjust any new test and assert values that encode the old leg widths or the old bud breakpoints. "Every sweep within 4 m of the centreline" still holds.

## Engineer question 2: top stay anchors

On `nq1_pyl.png`, the stays meet the shaft between ≈7 m and **≈17 m** above the deck. `ns2` gives 7.1–18.6 m. The top anchor is therefore not higher than 18.5 m; if anything it is slightly lower. **Keep the 7–18.5 m anchor zone.** No change is needed.

## Acceptance for iteration 2

Run the same cameras as the brief (§8):
- `--az 30 --el 1 --target unit` and `top` must show:
  - a stem clearly narrower than the bud (ratio ≈1.7);
  - a bud widest at ≈0.8 H;
  - a short pink cone of ≈2.2 m;
  - no tall straight-sided block.
- All other brief §8 checks must still pass, with no warnings.
- `npm test`, `npm run typecheck` and the generator asserts must pass.
