# Feedback, round 2: Cầu Thượng Cát (`cau-thuong-cat`), 2026-11-27

Verdict: **not approved yet. The pylon shape must be fixed.** Everything else passes:
- spans 120 + 270 + 270 + 120 (user-confirmed); main span 270; deck 35 m concrete at 25 m; heights 70 / 80 / 70
- 3 pylons in the right places; a V of two separate outward-leaning blades from one pier; no member above the deck
- white pylons; sources and notes; tests

**The error is in my brief (§3), not in the engineer's implementation.** The engineer built exactly the section I specified. A close crop of TEDI's elevation render CTC_1 at full resolution (comparison crop: scratchpad `sheets-r2/ctc1_crop.jpg`), checked against the deck-level render CTC_2, shows that I swapped the blade's proportions:

| View | Reference (TEDI) | Current model |
|---|---|---|
| Elevation, looking across the river (CTC_1; the centre pylon is seen exactly edge-on) | Each blade is a **slender band of almost constant width along the bridge**: about 6.5 m at deck level, about 4 m at the tip. The top is **blunt or chiselled, not pointed**. Below the deck it **flares like a trumpet** to about 14 m at the waterline. | A sharp triangle, 12 m at the base to 1.5 m at the tip (`depth_base_m 12 → depth_top_m 1.5`), so the side view reads as a pointed spike. |
| Looking along the deck (CTC_2) | Each blade shows a **wide wing face across the bridge**: about 10 m at deck level, tapering to a **pointed tip** (the inner edge leans out more steeply than the outer edge). | A thin 3.5 → 1.2 m stick (`width_base_m 3.5 → width_top_m 1.2`). |
| Stay anchors (CTC_1 centre pylon) | Stays attach from about 0.41 to 0.78 of the above-deck height. **The top ~20% of each blade is bare.** | Anchor zone 40–77 of 80 (0.50–0.96); stays run up to the tip. |
| Pier (CTC_1 and site photo) | The blades run into the water with a flare; between them is a low pile cap with an arched recess, about at the waterline. No tall block shows above water. | A 20 × 20 m block rising to **7 m above water** (y −25 → −18). It is visible as a box in the foot and side views. |

The linear taper (the engineer's question): **not acceptable as built**, because the taper runs in the wrong direction. A linear taper **is** acceptable once it is applied to the correct axis. Use separate lower and upper segments (P0-1) to get the flare-plus-shaft profile with no engine change.

## P0-1: Replace `pylon_custom` with a 4-leg blade (each blade split at deck level)

The pylon-local frame is unchanged: deck at y = 0, waterline at y = −25 (`deck_elevation_m` 25), deck edges at z = ±17.5. Recall the sweepRect axes for a leg in the y–z plane: **`width_*` = across the bridge (z)** and **`depth_*` = along the bridge (x)**. The geometry below is for the centre pylon (80 m); G4 scales the side pylons to 70/80.

```json
"pylon_custom": {
  "description": "Dove-wing V pylon: two separate blades rise from one low pile cap and lean outward about 12°, curving slightly. In elevation each blade is a slender band (≈6.5 m wide, ≈4 m at the blunt top) flaring to ≈14 m at the waterline. Seen along the deck, each blade is a wide wing (≈10 m at deck level) tapering to a pointed tip. Stays anchor between ≈0.4 and 0.8 of the height; the top ≈20% is bare. A beam under the deck; nothing above it. The centre pylon is about 10 m taller.",
  "legs": [
    {"centerline": [[0,-25,-8],[0,-15,-12],[0,-6,-16.5],[0,0,-20.5]],
     "width_base_m": 7.0, "width_top_m": 10.0, "depth_base_m": 14.0, "depth_top_m": 6.5},
    {"centerline": [[0,-25,8],[0,-15,12],[0,-6,16.5],[0,0,20.5]],
     "width_base_m": 7.0, "width_top_m": 10.0, "depth_base_m": 14.0, "depth_top_m": 6.5},
    {"centerline": [[0,0,-20.5],[0,25,-25.5],[0,55,-32],[0,80,-38]],
     "width_base_m": 10.0, "width_top_m": 1.0, "depth_base_m": 6.5, "depth_top_m": 4.0},
    {"centerline": [[0,0,20.5],[0,25,25.5],[0,55,32],[0,80,38]],
     "width_base_m": 10.0, "width_top_m": 1.0, "depth_base_m": 6.5, "depth_top_m": 4.0}
  ],
  "anchor_zone": [{"y_from_m": 33, "y_to_m": 63, "leg": 2}, {"y_from_m": 33, "y_to_m": 63, "leg": 3}],
  "struts": [
    {"a": [0,-3,-16], "b": [0,-3,16], "width": 3.0},
    {"a": [0,-27,0], "b": [0,-23,0], "width": 24.0}
  ],
  "mirror_for_other_pylons": true
}
```

Notes for the engineer:
- **Drop `crossbeams_y_m`.** With 4 legs, the engine joins *consecutive* legs, which would draw diagonal and over-deck beams. Use the first strut (y −3, 3 m) as the under-deck beam.
- **Pile cap.** The second strut is a 24 × 24 m block from 2 m below to 2 m above the waterline. It replaces the 7 m tall block. Your deviation (one block rather than a thin bar) was right in principle; only its height was wrong against CTC_1. In the site photo the cap with the arched recess sits at low water.
- **Inner face.** At deck level the inner face of each upper blade is at ±15.5 m (centre ±20.5, half-width 5). That is the 31 m approach carriageway edge, consistent with the 35 m main deck including 2 m blade and anchor strips. The stay deck anchors stay at ±17.5 m.
- **Lean.** The upper centreline leans about 12.5° (slightly increasing). Combined with the 10 → 1 m taper, the inner edge leans about 16° and the outer edge about 9°, as in CTC_2.
- **Joint.** The lower and upper legs meet at y = 0 with matching sections (10 × 6.5 m). The tips do not meet, so no crown logic is triggered. `customAnchor` still picks legs 2 and 3 by the sign of z.
- **Tests.** Update the data test for the new leg indices (blades = legs 2 and 3) and the anchor-zone range.

## P1-2: `cables_per_side` 11 → **13** [E]
CTC_1 shows about 13 stays per half-fan per plane on the centre pylon. They are spread over the 33–63 m zone; with semi_fan the outer stays anchor highest.

## P2-3 (optional): curved under-deck "smile"
The concept sketch (TEDI CTC_) and CTC_1 show a downward-curving U joining the blades just under the deck (the "bird body"). If you want it, add a 5th leg with centreline [[0,-2,-16],[0,-9,-8],[0,-11,0],[0,-9,8],[0,-2,16]], width 3, depth 6, and delete the y −3 strut. Its mean z is 0, so it never matches an anchor zone. This is not required for approval.

## No engine change required
If the joint at y = 0 shows a visible kink, a later improvement would be an optional per-leg `sections: [{s, width, depth}]` list, interpolated along the arc length. Not needed now.

## Acceptance (I will re-render and check)
1. **Az 5 / el 3 versus CTC_1:**
   - Blades read as slender, parallel-sided bands with blunt tops, about 6.5 m wide at the deck in elevation.
   - The centre pylon is a single band with a trumpet flare into the water.
   - The side pylons show two diverging bands.
   - No 7 m box above the water.
2. **Az 90 (along the deck) versus CTC_2:**
   - Wide wing faces (about 10 m at the deck) tapering to pointed tips.
   - The inner edge leans out more than the outer edge.
   - Blades start just outside the 31 m carriageway.
3. **Stays:** none above about 0.8 of each blade's height; 13 per half-fan per plane in full screen.
4. **Front and foot:** the V from one low pile cap; the under-deck beam; nothing joining the blades above the deck.
5. **Unchanged:** heights 70/80/70 above deck, spans, deck 35 m at 25 m, white colour; `npm test` passes.
