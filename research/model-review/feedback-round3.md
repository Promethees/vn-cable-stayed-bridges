# Feedback, round 3: Cầu Thượng Cát (`cau-thuong-cat`), 2026-11-27

I re-rendered the model myself into scratchpad `views-r3/`: the standard views plus three custom cameras, `az5 el3 unit` (matches CTC_1), `az0 el1 pylon0` (close elevation) and `az90 el2 pylon0` (along the deck, matches CTC_2). I compared them with `ref/tc/CTC_1-scaled.jpg` and `CTC_2-scaled.jpg`, measuring at full resolution.

Verdict: **almost there.** The form is now right: a V of two blades from a low pile cap, wide wing faces in the along-deck view tapering to pointed tips, blunt tops in elevation, a flare into the water, the curved "bird body" beam under the deck, nothing above the deck, and bare blade tops. One dimensional fix remains. It is data only and comes from my own over-estimate in feedback-round2.

## P1-1: Blades too thick along the bridge, and the flare too wide

**Measured on CTC_1 (centre pylon, seen exactly edge-on):**
- The blade is **≈18 px wide** at mid-height and ≈17–20 px just above the deck.
- The deck edge girder is ≈17 px deep, and the blade stands ≈380 px above the deck.
- So the blade height-to-width ratio is ≈21 at the deck and ≈25 at mid-height. That makes the blade ≈4.5 m along the bridge at deck level and ≈3 m at the top, for 80 m above deck.
- Below the deck the trumpet reaches ≈2.8× the shaft width at the waterline, ≈10 m.

**The model is** 6.5 m at the deck, 4 m at the top and 14 m at the waterline. In my `az0 el1` render the blade reads ≈1.6× too stout compared with CTC_1.

The across-bridge wing face (10 m at the deck tapering to 1 m) **matches** CTC_2: the middle-distance blades show a base face of ≈0.15–0.2 × their height. Keep it.

Change in `research/shapes/cau-thuong-cat.json` → `pylon_custom.legs` (depth = along the bridge):

| Leg | Field | Now | Expected |
|---|---|---|---|
| 0, 1 (lower, flare) | `depth_base_m` / `depth_top_m` | 14.0 / 6.5 | **10.0 / 4.5** |
| 2, 3 (upper blades) | `depth_base_m` / `depth_top_m` | 6.5 / 4.0 | **4.5 / 3.0** |
| 0–3 | width (across) | 7→10 / 10→1 | unchanged |
| 4 (bird-body beam) | depth | 6.0 | **4.5** (match the blade) |

Keep the joint at deck level matched: lower top = upper base = 10 × 4.5 m.

## P2-2 (optional): a little more outward flick at the tip
In CTC_2 the blade tips sweep outward more strongly in the top third (a feather shape). Optionally move the upper-blade points from [y 25 z 25.5, y 55 z 32, y 80 z 38] to **[y 25 z 25.0, y 55 z 31.0, y 70 z 35.0, y 80 z 39.5]**, mirrored for leg 3. Keep the anchor zone at 33–63 m. This is not required for approval.

## Engineer's open points, decided
1. **Stays appear to stop at ≈0.55 of the height:** accepted. This is the global under-construction convention (stays only to the 60% cantilevers), applied the same way to every under-construction bridge. With the status completed the anchors reach ≈0.79 and the top fifth stays bare, as the test asserts. No change.
2. **Slight kink at deck level:** accepted. It is hidden by the deck in every view I rendered, including the close `az0 el1` elevation and the foot view.

## Acceptance for round 3
- In `az0 el1 pylon0`, blade height-to-width at the deck is ≈18–22 (it is ≈12 now), and the flare at the waterline is ≈2–2.5× the shaft width.
- Everything else as in round 2b is unchanged; `npm test` passes.

If P1-1 is done as specified, I will approve.
