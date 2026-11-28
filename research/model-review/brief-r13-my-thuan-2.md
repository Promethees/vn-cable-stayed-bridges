# 3D model review: round 13, Cầu Mỹ Thuận 2 (`cau-my-thuan-2`), 2026-11-29

The user says Mỹ Thuận 2 needs revision. Everything was re-verified from scratch. The sources are the designer (TEDI: project page, BIM figure, a sharp low oblique photo), Tecco1 (12 full-resolution 2000-px drone photos, including a near-elevation and a view straight along the deck axis), Trung Nam, VnExpress, Tiền Phong, Người Quan Sát, Dân trí, Báo Chính phủ and Commons.

**The current model gets the pylon form wrong.** It draws two legs that merge **≈45 m above the deck** into a **≈40 m single mast** carrying one stay zone. The real pylon is an **A / inverted-Y**:

- Two straight legs straddle the deck and lean inward to a narrow **flat-topped slot at ≈0.8 of the above-deck height (≈70 m)**.
- Above the slot is a **short solid head** (≈18 m) that tapers to a flat top.
- Below the deck the legs converge again to the cap (the "diamond" foot), with a deep cross-beam under the girder.
- The stays form **two inclined planes**, anchored over ≈50–84 m on the upper legs and the head (TEDI BIM: the anchorage segment is the top ≈45 %).

The deck is also flat at a heuristic level, although the real deck has a pronounced crest. The main-span stays meet at mid-span; in reality there is an ≈15 m gap. The pile cap is missing; the real one is an elongated hexagon pointed across the river. The stays are muted.

**Flag: no client-confirmed value is contradicted.** No Mỹ Thuận 2 value in `gen_bridges.py` uses `CC` / "client-confirmed". Round-1 values re-checked:

- **16 stays per side per plane: confirmed.** 128 = 2 pylons × 2 planes × 2 sides × 16 (VnExpress "128 bó cáp văng").
- **125.5 m: confirmed, but it is the tip elevation above datum** ("đỉnh trụ cao 125,5m so với mực nước biển", Tiền Phong 1/2023). It is not the height above the cap. Người Quan Sát gives **119.5 m from the top of the pile cap to the tip**, so the cap top is at ≈+6 m.
- **`scale_y 0.967` must go.** The new shape file carries the measured geometry at real scale, and its tip gives the 125.5 m label directly.

Confidence tags: **[C]** confirmed by a source · **[P]** measured on photos · **[E]** estimated · **[I]** inferred.

## 0. References

All files are in `scratchpad/ref/mt2/`. The scratchpad is `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/`. The images are comparison material only; their licences are unknown except Commons.

| File | What it is | Used for |
|---|---|---|
| `tedi1.jpg` (1024×573), zoom `tedi1_pylon.png` | TEDI project page, **sharp low oblique of the completed T16 pylon** from the water | A form, slot, diamond foot, under-deck cross-beam, hexagonal cap. Above-deck : deck-to-cap ≈ 2.2–3.2, depending on the lens tilt. **Camera: az 35, el 0, pylon0** |
| `tc06.jpg` (2000×1332), zooms `tc06_top/_mid/_low/_ll/_rl/_far.png` | Tecco1, drone **on the deck axis** looking at the near pylon, with the far pylon behind | Transverse geometry: slot top at 0.80 H; head ≈0.20 H, flat-topped slot ≈5 m; leg ≈6.4 m wide across at the deck, inner faces just outside the deck; anchors start ≈4 m below the tip. **Camera: preset `front`** |
| `tc12.jpg` (2000×1332), zooms `tc12_L/_R/_Rz/_deck/_deckstretch/_anch/_midgap.png` | Tecco1, elevated **near-elevation** of the whole unit, MT1 behind | Span scale (350 m = 1405 px → 4.01 px/m); deck crest (rise from pylon to mid-span ≈14 px ≈3.9 m after the 27° foreshortening); main-stay deck anchors (innermost ≈18 m, outermost ≈7.5 m short of mid-span); elongated-hexagon caps. **Camera: az 0, el 25, unit** |
| `tc11.jpg`, `tc01`–`tc13` (sheet `sheet_tc.png`) | Tecco1 drone set (2023) | Cap plan (`tc11_cap.png`), colours (blue stays, light-grey concrete) |
| `bim2.png`, `bim3.png`, `bim4.png` | TEDI opening article: **BIM model** of the main bridge; top-anchorage study ("neo đỉnh trụ") | Anchorage segment ≈ top 45 % of the above-deck height; A legs; under-deck beam; hexagonal caps; head with two anchorage boxes |
| `tn1`–`tn4.jpg` (510 px) | Trung Nam project page | `tn4`: low night elevation. Near pylon above-deck : deck-to-cap ≈ 2.7 |
| `c12.jpg` | Commons "Cầu Mỹ Thuận 1 và 2" (AnhNguyen, CC BY-SA 4.0), MT2 under construction | Diamond foot, cap (`c12_cap.png`, `c12_p2.png`) |
| `cct.jpg` | Commons "Cao tốc mỹ thuận cần thơ" (Letrieuvy2002), from the road | Slot with a flat soffit; legs converging; far pylon outline |
| `sggp.webp`, `tedi2/3.jpg` | Press / TEDI aerials | Overall form |

Current-model renders are in `views-mt2/`. The prototype is in `mt2work/`:

- **Scratch repo:** `mt2work/repo`. The project itself is untouched.
- **Exact JSON:** `mt2work/target_model3d.json`.
- **Renders:** `mt2work/r1/`.
- **Comparison sheet:** `mt2work/cmp.png`. Rows: TEDI vs az35/el0/pylon0; tc12 vs az0/el25/unit; tc06 vs front.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Main bridge | **150 + 350 + 150 m**. "650 m" in the press is the whole stayed unit, not the main span. No auxiliary piers; anchor piers T14/T17 at the unit ends | [C] | TEDI ("khẩu độ 350m"), Trung Nam, VnExpress, Dân trí ("nhịp chính 350 m… phần dây văng 650 m"); BIM `bim2` |
| Bridge / route | River crossing **1,906 m** (vi.wiki, Dân trí; "hơn 1,9 km"); route 6.61 km; approaches 4.7 km (4.3 Tiền Giang + 0.4 Vĩnh Long) | [C] | vi.wiki, VnExpress, NQS |
| Deck | **28 m** (VnExpress 2024 gives 28.3 m), **6 lanes**, 80 km/h. **Reinforced-concrete girder with a "Pi" section** (two edge girders plus cross-beams), cast in balanced cantilever: 32 main-span and 28 side-span segments; closure segment 8 m long × 28 m wide | [C] | TEDI, Tecco1 ("mặt cắt chữ Pi"), VnExpress 10/2023 and 1/2024 |
| Navigation | **37.5 m** above the highest water. Channel width not published | [C] | TEDI, VnExpress, Báo Chính phủ |
| Deck level | "kết cấu dầm… cao hơn mặt sông khoảng 38 m" (NQS). Strong vertical crest visible in every elevation | [C]/[P] | NQS; `tc12` |
| Pylons | **2 pylons, "hình chữ A"** (Tiền Phong 1/2023; Tecco1 "2 trụ tháp dạng chữ A cao hơn 125m"); "hình kim cương" (Dân trí 12/2022: diamond, from the lower legs); 33 lifts of ≈4 m (VnExpress 9/2022); top anchorage studied in BIM, two options (TEDI) | [C] | as listed |
| Pylon height | **Tip +125.5 m above datum** (Tiền Phong, VnExpress); **119.5 m from the cap top to the tip** (NQS; Tiền Phong "hơn 119m"); 28 m "chân trụ chìm" (submerged foundation); "6 m higher than Mỹ Thuận 1" (Tuổi Trẻ 1/2023) | [C] | as listed |
| Foundations | **26 bored piles D2.5 m per pylon, 110–116 m deep** (deepest in Viet Nam at the time); cap 4,800 m³ concrete + 800 t steel each. Cap plan: **elongated hexagon pointed across the river** | [C] piles / [P] shape | VnExpress 1/2024, Tecco1 (113 m), Tiền Phong; `tc11`, `tc12`, `c12`, BIM |
| Stays | **128 = 16 per side per plane**, two planes; **blue sheaths** ("có màu xanh") | [C] | VnExpress, Dân trí |
| People | Client **Ban QLDA 7 (Bộ GTVT)**; designer **TEDI**; main-bridge package XL03B **Trung Nam E&C – Trung Chính – VNCN E&C JV** | [C] | Báo Chính phủ, TEDI, Bd&e, Dân trí |
| Dates | Approaches started 27/2/2020; main bridge started 19/8/2020 (official ground-breaking 16/3/2020); closure **14/10/2023**; **opened 24/12/2023** | [C] | vi.wiki, Báo Chính phủ, TEDI |
| Cost | 5,003 tỷ VND (state budget) | [C] | vi.wiki, Báo Chính phủ |

## 2. Measurements and levels

**Water datum.** The model water is datum 0, so the 125.5 m tip elevation becomes the label directly. Mean water at Mỹ Thuận is ≈+0.3–0.5 m. The design high water (≈+1.8) is inside the margin the engine's nav check adds.

**Levels adopted:**

| Item | Value |
|---|---|
| Tip | **125.5 m** above the water [C] |
| Cap top | **+6.0** (125.5 − 119.5) [C] |
| Deck, mid-span | **42.0 m**. Engine minimum 37.5 + 2.5 + 1 = 41; NQS "≈38 m" is the girder, i.e. soffit ≈39.5 |
| Deck, pylons | **38.09 m** |
| Deck, unit ends | **28.5 m**, crest **13.5 m** (parabola over the 650 m unit) |

Why a 13.5 m crest:

- `tc12` gives a rise from the pylons to mid-span of ≈3.9 m [P]. The engine parabola gives 13.5 × (175/325)² = 3.91.
- The side spans then fall ≈2.5 m in the first 49 m. `tc12` shows ≈2 m, which agrees.
- Lens distortion would only *flatten* the measured arch (the deck lies below the image centre), so 3.9 m is a lower bound.

**Pylon above the deck = 125.5 − 38.09 = 87.4 m. Cap top to deck = 32.1 m.** The ratio 2.72 sits between `tn4` (2.7), `tedi1` with no tilt (2.2) and `tedi1` with drone tilt (3.2). `tc12`, corrected for the 27° view, gives ≈84 m above the deck. Compare Mỹ Thuận 1, drawn at 83.5 m above a 37.5 m deck: MT2 is 6 m higher at the tip and slightly higher at the deck.

**Fold below the deck** (see brief-r10-thuan-an §4). The crest at the pylons is 9.586, so local y below the deck = real / (1 + 9.586/28.5) = real / 1.3363. The cap top 6 m above the water therefore sits at local (6/1.3363) − 28.5 = **−24.0**. Do not "correct" it to −32.

**Transverse geometry** (`tc06` near and far pylons, `tedi1`, BIM):

| Item | px | m |
|---|---|---|
| Slot top / height above deck | 0.80 (near: tip 65, slot 222, deck ≈835; far: tip 581, slot 631) | **69.6** |
| Head height to slot | 0.20 H | 17.8 |
| Head width at the top / at the slot ÷ leg outer spread at the deck | 65 / 100 px ÷ 327 px → 0.20 / 0.31 | **7.6 / 12.4** |
| Slot width at the top | 45 px of a 100 px head | ≈5.0 |
| Leg at the deck: width across, inner face | ≈50 px; inner gap ≈ barrier-to-barrier + 1 m | **≈6.4 wide, inner faces ±14.6** (deck ±14.0); centres ±17.8 |
| Foot spread ÷ deck spread | `tedi1` 0.68, BIM 0.64 | feet **±11.5** at the cap |
| Under-deck cross-beam | `tedi1` | **≈5 m deep** under the girder (local −2.5 → −7.5) |
| Leg depth along the bridge | `tc12` side | ≈8 at the cap → ≈5–5.5 at the top |
| Anchorage zone | BIM brown segment ≈ top 46 %; `tedi1` stays reach the pylon over 53–85 m; `tc06` first anchor ≈4 m below the tip | **50 → 84 m** |
| Main-stay deck anchors | `tc12`: innermost ≈18 m from the pylon; outermost 7.5 m short of mid-span (gap ≈15 m, closure 8 m) | **[17, 167]** |
| Back-stay deck anchors | 28 side-span segments; innermost ≈15 m (`tc12_anch`) | **[17, 145]** [P]/[E] |
| Pile cap | `tc11` / `tc12` plan: long axis across, pointed ends; volume check: (24 × 52 − 4 × ½ × 12²) × 5 = 4,800 m³, which equals the published 4,800 m³ | **24 × 52, chamfer 12 (pointed hexagon), 6 thick** |

## 3. Current model vs reality (prioritised)

| P | Field | Current | Target | Conf |
|---|---|---|---|---|
| P0 | `pylon_custom` legs | Legs merge at ≈45 m above the deck into a ≈40 m single mast (leg 2). Anchor zone on the mast only, 53–82 m | **A legs to a flat-topped slot at 69.6 m, solid head 69.6 → 87.4 m (12.4 → 7.6 wide), legs continuing inside the head to 85.5. Anchor zones on legs 0 and 1, 50–84 m** (two inclined planes). JSON in §4 | [C] form / [P] dims |
| P0 | `REVIEW_R1["cau-my-thuan-2"]` | `scale_y 0.967`, sets 16 per side and [125.5, 125.5] | **Delete the entry.** The shape file holds both values and real-scale geometry (tip local 87.4, label 125.49) | [C] |
| P0 | `deck_elevation_m` / `deck_crest_m` / `deck_depth_m` | none (heuristic 35, flat; nav raise) | **28.5 / 13.5 / 2.5** (38.1 at the pylons, 42.0 at mid-span) | [P]+[C] |
| P0 | stays | default reach: main stays meet at mid-span | **`main_stay_deck_m: [17, 167]`** (G15 allow-list), **`back_stay_deck_m: [17, 145]`** | [P] |
| P1 | pile cap | none | **`{"length_x_m": 24, "width_z_m": 52, "top_y_m": -24.0, "thickness_m": 6.0, "chamfer_m": 12}`** (G18 allow-list) | [C] volume / [P] |
| P1 | under-deck beam | `crossbeams_y_m: [-3]` (default size) | **Panel** −2.5 … −7.5, z ±15, depth 6. Not `crossbeams_y_m`: with the head as leg 2, the generator would also bridge legs 1 → 2 | [P] |
| P1 | colours | default grey / default stays (muted) | `pylon_colour "#d9d5cc"`, **`stay_colour "#2f80c8"` + `colour_mode "vivid"`** (VIVID_OK). The saturated blue curtain is the signature in every photo and distinguishes MT2 from MT1's pale blue (`#7aa6cc`, muted) | [C] blue / [P] hue |
| P1 | text | "2 tháp chữ Y ngược… cao ≈125 m"; notes "Pylon height not published" | §6 | [C] |
| P2 | NAV source | SGGP | TEDI project page; width unknown (keep `None`) | [C] |
| P2 | seed | no investor / designer; notes lack the dates and the 350/650 explanation detail | §5 item 6 | [C] |
| P2 | not modelled | — | Pi section (the engine draws a box); two anchorage boxes in the head; the flat-topped slot has a small chamfer; anchor-pier columns; long Super-T / cantilever approaches | |

## 4. Target `model3d` (complete; replaces `model3d` in `research/shapes/cau-my-thuan-2.json`)

This is exactly what was prototyped. Results:

- Generator: OK. Engine `warnings: []`; derived only "approach length".
- E = 28.5, not raised.
- 128 stay lines.
- Pylon decks 38.086; mid-span 42.0; labels 125.49.
- Vitest: 143/143 after the two list edits in §5. Typecheck: clean.

```json
{
  "spans_m": [150, 350, 150],
  "pylon_shape": "inverted_Y",
  "pylon_heights_m": [125.5, 125.5],
  "pylon_height_ref": "total",
  "deck_elevation_m": 28.5,
  "deck_crest_m": 13.5,
  "deck_depth_m": 2.5,
  "cable_planes": 2,
  "cable_pattern": "semi_fan",
  "cables_per_side": 16,
  "main_stay_deck_m": [17, 167],
  "back_stay_deck_m": [17, 145],
  "deck_width_m": 28.0,
  "deck_type": "concrete",
  "pylon_colour": "#d9d5cc",
  "stay_colour": "#2f80c8",
  "colour_mode": "vivid",
  "confidence": "estimated",
  "notes": "r13: Spans 150 + 350 + 150 m (TEDI, Trung Nam, VnExpress; press '650 m' is the whole stayed unit), no auxiliary piers. Two A / inverted-Y pylons ('hình chữ A', Tiền Phong, Tecco1; 'hình kim cương', Dân trí): pylon top +125.5 m above datum (Tiền Phong, VnExpress), 119.5 m from the pile-cap top to the tip (Người Quan Sát), 33 pylon lifts. Drawn with the water at datum: tip 125.5 m, cap top 6 m above the water, deck 28.5 m at the unit ends, ≈38.1 m at the pylons and 42.0 m at mid-span (crest 13.5 m, rise pylon→mid-span ≈3.9 m measured on a Tecco1 drone elevation), so ≈87.4 m of pylon above the deck. Navigation clearance 37.5 m (TEDI). Legs: straight, ≈6.4 m wide across at the deck with inner faces just outside the 28 m deck (±14.6 m), leaning in to a flat-topped slot ≈5 m wide at ≈69.6 m (0.8 of the above-deck height), then a solid head ≈12 → 7.6 m wide to the tip; below the deck the legs converge to the cap (diamond foot, feet ≈±11.5 m) with a ≈5 m deep cross-beam under the girder. Pile cap an elongated hexagon pointed across the river (≈24 × 52 m, 26 bored piles D2.5 m, 110–116 m deep). 128 blue stays = 16 per side per plane, two inclined planes anchored over ≈50–84 m on the legs and head; deck anchors ≈17–167 m (main) and 17–145 m (side) from the pylon (closure 8 m at mid-span). Concrete Pi-section girder (two edge girders), 28 m (28.3 m) deck, 6 lanes. Geometry measured on TEDI and Tecco1 photos (brief-r13-my-thuan-2.md).",
  "pylon_custom": {
    "description": "A / inverted-Y pylon (Mỹ Thuận 2): two straight legs straddle the deck (inner faces just outside it) and lean in to a narrow flat-topped slot at ≈0.8 of the above-deck height, above which they are joined in one solid head tapering to a flat top; below the deck the legs converge again to a hexagonal pile cap (diamond foot), with a deep cross-beam under the girder. Stays in two inclined planes anchored on the upper legs and the head.",
    "legs": [
      {"centerline": [[0, -24.0, -11.5], [0, -12.0, -14.65], [0, -3.0, -17.01], [0, 0, -17.8], [0, 3.0, -17.22], [0, 35.0, -11.01], [0, 69.6, -4.3], [0, 78.0, -3.0], [0, 85.5, -2.4]],
       "width_base_m": 7.4, "width_top_m": 3.0, "depth_base_m": 8.0, "depth_top_m": 5.0},
      {"centerline": [[0, -24.0, 11.5], [0, -12.0, 14.65], [0, -3.0, 17.01], [0, 0, 17.8], [0, 3.0, 17.22], [0, 35.0, 11.01], [0, 69.6, 4.3], [0, 78.0, 3.0], [0, 85.5, 2.4]],
       "width_base_m": 7.4, "width_top_m": 3.0, "depth_base_m": 8.0, "depth_top_m": 5.0},
      {"centerline": [[0, 69.6, 0], [0, 78.5, 0], [0, 87.4, 0]],
       "width_base_m": 12.4, "width_top_m": 7.6, "depth_base_m": 6.2, "depth_top_m": 5.4}
    ],
    "panels": [
      {"top": [[-15.0, -2.5], [15.0, -2.5]], "bottom": [[-15.0, -7.5], [15.0, -7.5]], "depth_m": 6.0}
    ],
    "pile_cap": {"length_x_m": 24, "width_z_m": 52, "top_y_m": -24.0, "thickness_m": 6.0, "chamfer_m": 12},
    "anchor_zone": [
      {"y_from_m": 50, "y_to_m": 84, "leg": 0},
      {"y_from_m": 50, "y_to_m": 84, "leg": 1}
    ],
    "mirror_for_other_pylons": true,
    "reference_images": [
      "https://tedi.vn/wp-content/uploads/2024/11/Mythuan2_1-1024x573.jpg",
      "https://tecco1.vn/upload/source/cau-my-thuan-06.jpg",
      "https://tecco1.vn/upload/source/cau-my-thuan-12.jpg",
      "https://tedi.vn/wp-content/uploads/2023/12/mt2_2.png",
      "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_1_v%C3%A0_2.jpg"
    ]
  }
}
```

**Legs.** Width is across the bridge (z); depth is along it (x).

| Leg | Role | Geometry |
|---|---|---|
| 0, 1 | A legs | Straight below the deck from the cap (±11.5, −24) to the deck (±17.8, 0); the extra points at ±3 m keep the diamond kink tight. Straight above to the slot top (±4.3, 69.6), then bending to near-vertical inside the head (±3.0 at 78, ±2.4 at 85.5). Width 7.4 → 3.0 by arc length: ≈6.4 at the deck (inner face ±14.6, clear of the ±14.0 deck), ≈3.6 at the slot (inner faces ±2.5, so the slot is ≈5 m) |
| 2 | Solid head | 69.6 → 87.4 m, 12.4 → 7.6 × 6.2 → 5.4. Its flat underside forms the slot soffit. The legs stay inside it (checked at 69.6, 78 and 85.5 m) |

- Tips: 85.5 / 85.5 / 87.4 m. Leg 2's tip is ≥ 3 m from the others, so no crown merge is triggered.
- The legs end below the head's top, so they never poke out.

**Panel.** The under-deck cross-beam: the girder soffit is at −2.5 and the beam is 5 m deep, between the legs (inner faces ≈±13 at y −5). Its ends run into the legs.

**Cap.** `chamfer_m` 12 = `length_x_m` / 2 gives an elongated hexagon pointed at ±z. The legs stand on it at local −24.0.

### Shape-file top-level fields

- `pylons_vi` / `pylons_en`: see §6.
- `notes`: "A / inverted-Y pylons (legs to a flat-topped slot at ≈0.8 of the above-deck height, short solid head) on hexagonal caps; 128 blue stays in two inclined planes; deck crest ≈4 m over the main span."
- `review`: add "Round 13: A legs to a slot at 69.6 m + solid head to 87.4 m (tip 125.5 m above datum), diamond foot on a pointed-hexagon cap (G18), under-deck beam panel; deck 28.5 + crest 13.5 (38.1 at the pylons, 42 mid-span); 16 stays per side per plane at 17–167 / 17–145 m; vivid blue stays".
- `checklist`:
  - foot below deck: "pass (diamond, feet ±11.5 on a hexagonal cap)";
  - legs at deck: "pass (inner faces just outside the deck, under-deck beam)";
  - merge height: "pass (slot top 0.80 H, 69.6 m)";
  - crossbeams: "pass (one under the deck; none above, the head is solid)";
  - head: "pass (≈0.2 H, 12.4 → 7.6 m)";
  - proportions: "pass (119.5 m cap-to-tip, 125.5 m tip, 87.4 m above deck)";
  - stays: "pass (2 inclined planes, 16 per side, mid-span gap ≈15 m)";
  - deck / aux piers: "pass (none; crest)";
  - colour: "pass (vivid blue stays, light-grey concrete)".
- `compare`: "TEDI low oblique + Tecco1 near-elevation and deck-axis views; renders brief-r13".
- Keep `pass2: true`.

## 5. Generator edits (`scripts/gen_bridges.py`) and tests

1. **Shape file.** Replace `model3d` as in §4 and update the top-level fields as listed there.
2. **REVIEW_R1 (line ≈973).** Delete the whole `"cau-my-thuan-2"` entry (`scale_y 0.967`, set, note). Leave a comment like the others: `# round 13 (brief-r13-my-thuan-2.md): scale_y 0.967 removed; tip local 87.4 is the 125.5 m label`.
3. **M3D fallback (line ≈439).** Keep it in step:

   ```python
   m3d([150, 350, 150], "inverted_Y", [125.5, 125.5], "total", 2, "semi_fan", 28.0, "concrete", cps=16,
       notes="Fallback; see research/shapes/cau-my-thuan-2.json (round 13: A pylons, tip 125.5 m above datum, 119.5 m above the cap; deck 28.5 + crest 13.5; 128 stays).")
   ```

   Comment: "fallback only: research/shapes/cau-my-thuan-2.json (pass 2) wins; kept in step with it (round 13)". Check the `m3d` signature for the `cps` keyword.
4. **NAV (line ≈821).** `nav(37.5, None, "navigation clearance 37.5 m above the highest water (channel width not published)", "https://tedi.vn/project/my-thuan-2-bridge/?lang=en")`. Match the argument order of the existing call.
5. **Allow-lists:**
   - `VIVID_OK` gets `"cau-my-thuan-2"` (G14).
   - `G15_OK` gets `"cau-my-thuan-2"` (main_stay_deck_m).
   - The G18 `chamfer_m` assert becomes `b["id"] in ("cau-dai-ngai-1", "cau-cua-hoi", "cau-my-thuan-2")`.
   - No G17 change: no haunch.
6. **Seed `add()` (line ≈81):**
   - `pylons="2 tháp chữ A (Y ngược): hai chân nghiêng vào nhau tới khe hẹp ở ≈0,8 chiều cao, đầu tháp đặc; chân kim cương dưới mặt cầu; đỉnh +125,5 m, 119,5 m từ đỉnh bệ"`.
   - `investor="Ban QLDA 7 (Bộ GTVT)"`. Check the field name used elsewhere.
   - Keep `construction_start=2020`, `opened=2023`, `total_length_m=1906`, `width_m=28`, `lanes=6`, `cost`.
   - Sources: add `https://tedi.vn/project/my-thuan-2-bridge/?lang=en`, `https://tedi.vn/khanh-thanh-cau-my-thuan-2-cau-day-vang-lon-nhat-cho-den-thoi-diem-hien-tai-do-tedi-thiet-ke/`, `https://tecco1.vn/xem-du-an/cau-my-thuan-2`, `https://tienphong.vn/hinh-hai-du-an-cau-day-vang-tru-chu-a-cao-nhat-vung-tay-nam-bo-post1504457.tpo`, `https://nguoiquansat.vn/chiem-nguong-cay-cau-5-000-ty-noi-2-do-thi-lon-nhat-nam-bo-106606.html`, `https://vnexpress.net/cau-noi-cao-toc-my-thuan-can-tho-truoc-2-thang-thong-xe-4670076.html`, `https://vnexpress.net/nguoi-viet-lam-chu-cong-nghe-xay-cau-day-vang-4705799.html`, `https://baochinhphu.vn/hop-long-cau-my-thuan-2-cay-cau-cap-dac-biet-trong-diem-quoc-gia-mang-thuong-hieu-viet-102231014173751805.htm`, `https://trungnamgroup.com.vn/du-an/ha-tang-2/cau-my-thuan-2`.
   - `confidence`: "verified" is now defensible (spans, height, stays, clearance, width all from the designer or several press sources). The geometry stays `"estimated"` in `model3d`.
   - `notes`: "Main span 350 m in a 150 + 350 + 150 m stayed unit (TEDI); vi-Wikipedia and press '650 m' is the whole unit. River crossing 1,906 m, route 6.61 km. Designer TEDI, client Ban QLDA 7, main bridge by a Trung Nam E&C-led JV. A-shaped pylons, tip +125.5 m (119.5 m above the pile cap), 128 blue stays, Pi-section concrete girder 28 m wide, clearance 37.5 m; 26 bored piles D2.5 m up to 116 m deep per pylon. Approaches started 27/2/2020, main bridge 19/8/2020, closure 14/10/2023, opened 24/12/2023."
   - Images: add `press("https://tedi.vn/wp-content/uploads/2024/11/Mythuan2_1-1024x573.jpg", "TEDI", "https://tedi.vn/project/my-thuan-2-bridge/?lang=en", "completed pylon T16")` (press, licence unknown). Optionally add Tecco1 `cau-my-thuan-12.jpg` (elevation).
7. **Round-13 assert block**, modelled on Mỹ Thuận 1:
   - `spans_m == [150, 350, 150]`, no `auxiliary_piers_m`.
   - `pylon_heights_m == [125.5, 125.5]`, `total`.
   - `M3D["cau-my-thuan-2"]["pylon_heights_m"] == [125.5, 125.5]`.
   - `deck_elevation_m == 28.5`, `deck_crest_m == 13.5`, `deck_depth_m == 2.5`, no `deck_haunch`.
   - `cables_per_side == 16`, `cable_planes == 2`, `semi_fan`.
   - `main_stay_deck_m == [17, 167]` and `back_stay_deck_m == [17, 145]`.
   - `colour_mode == "vivid"`, `stay_colour == "#2f80c8"`.
   - `len(pc["legs"]) == 3`.
   - `[l["centerline"][-1] for l in pc["legs"]] == [[0, 85.5, -2.4], [0, 85.5, 2.4], [0, 87.4, 0]]` (not rescaled).
   - `[l["centerline"][0] for l in pc["legs"][:2]] == [[0, -24.0, -11.5], [0, -24.0, 11.5]]`.
   - `pc["legs"][2]["centerline"][0][1] == 69.6`.
   - `pc["pile_cap"] == {"length_x_m": 24, "width_z_m": 52, "top_y_m": -24.0, "thickness_m": 6.0, "chamfer_m": 12}`.
   - `"crossbeams_y_m" not in pc`, `len(pc["panels"]) == 1`.
   - `[(z["leg"], z["y_from_m"], z["y_to_m"]) for z in pc["anchor_zone"]] == [(0, 50, 84), (1, 50, 84)]`.
   - `b["nav_clearance"]["height_m"] == 37.5` and `"tedi.vn" in source`.
   - `"chữ A" in b["pylons"]` and `"125.5" in b["pylons_en"]`.
   - `"cau-my-thuan-2" not in REVIEW_R1`.
   - `"r13:" in m["notes"]` and `"not published" not in m["notes"]`.
8. **`src/lib/data.test.ts`.** Both lists are verified failing until updated:
   - Line ≈507 (vivid) becomes `['cau-cua-hoi', 'cau-dai-ngai-1', 'cau-my-thuan-2', 'cau-ngoc-hoi', 'cau-vam-cong']`.
   - Line ≈787 (main_stay_deck_m) becomes `['cau-cat-lai', 'cau-cua-hoi', 'cau-my-thuan-2', 'cau-phuoc-an', 'cau-thuan-an']`.
   - With items 1, 2 and 5 plus these two edits in the scratch copy: **143 passed**, typecheck clean.
   - Add an `it('Mỹ Thuận 2 (round 13) …')` block mirroring item 7, plus engine checks:
     - `g.warnings` is `[]`;
     - `g.deckElevation` is 28.5;
     - `g.deckY(150) ≈ 38.09`;
     - `g.deckY(325) == 42`;
     - each `p.heightAboveDeck` is 87.4;
     - `labelHeight ≈ 125.5` (±0.05);
     - 128 cables;
     - `g.colours.vivid` is true.
9. Run `python3 scripts/gen_bridges.py data/bridges.json`, `npx vitest run --testTimeout 200000` and `npm run typecheck`.

## 6. Text

- `pylons_vi`: "2 tháp chữ A (Y ngược) bê tông: hai chân thẳng ôm ngoài mặt cầu, nghiêng vào nhau tới khe hẹp đỉnh bằng ở ≈0,8 chiều cao rồi liền thành đầu tháp đặc; dưới mặt cầu chân thu lại về bệ cọc lục giác (chân kim cương), có dầm ngang dưới dầm chủ; đỉnh tháp +125,5 m, cao 119,5 m từ đỉnh bệ (≈87 m trên mặt cầu); 128 dây văng màu xanh, 2 mặt phẳng nghiêng, 16 dây mỗi bên"
- `pylons_en`: "2 concrete A / inverted-Y pylons: straight legs straddling the deck lean in to a narrow flat-topped slot at ≈0.8 of the height and join in a solid head; below the deck they converge to a hexagonal pile cap (diamond foot), with a cross-beam under the girder; tip +125.5 m, 119.5 m above the cap (≈87 m above the deck); 128 blue stays in two inclined planes, 16 per side"

## 7. Engine gaps

None is needed for acceptance; the target uses only existing features. Nice-to-haves (P2):

- **Generator: crossbeams between chosen legs only** (`crossbeams: [{y, legs: [0, 1], depth}]`). Today `crossbeams_y_m` joins every consecutive pair of legs, so any pylon whose head is a separate leg must use a panel for its lower beam (this one, and the old MT2 model). Spec: optional `legs` pair; absent, behaviour is unchanged.
- **Pi-section girder** (`deck_section: "pi"`: two edge girders plus slab). This applies to both Mỹ Thuận bridges. Not needed for the silhouette.

## 8. Acceptance criteria

Render with your own server (`npx vite --host 127.0.0.1 --port <p> --strictPort`, then `--url`). There must be **no warnings** for this bridge: no navigation raise, no clamps.

1. **`--az 35 --el 0 --target pylon0`** (matches `tedi1.jpg`). Check:
   - an A pylon: legs straddling the deck, meeting under a short solid head with a visible slot;
   - legs converging below the deck to a pointed-hexagon cap, with a cross-beam under the girder;
   - blue stays converging on the upper legs and head.
2. **`--az 0 --el 25 --target unit`** (matches `tc12.jpg`). Check:
   - main span visibly arched (≈4 m from the pylons to mid-span);
   - a clear gap between the two fans at mid-span (≈15 m, not touching);
   - no auxiliary piers;
   - pointed caps.
3. **`front`** (matches `tc06.jpg`). Check:
   - slot top at 0.78–0.82 of the deck-to-tip height;
   - head width at the slot ÷ leg outer spread at the deck ≈ 0.30 (0.26–0.34);
   - slot ≈ 0.4 of the head width;
   - inner leg faces just outside the deck edges;
   - two inclined stay planes.
4. **`side` / `--az 0 --el 0`:**
   - pylon above the deck : main span ≈ 0.25 (0.23–0.27);
   - deck above the water at the pylons : main span ≈ 0.11;
   - 16 stays per side per plane.
5. **`top`.** Solid flat-topped head ≈ 7.6 m wide, no mast or spike above 87.4 m local.
6. **Data checks** (`data/bridges.json`):
   - `pylon_heights_m` [125.5, 125.5] total;
   - `deck_elevation_m` 28.5, `deck_crest_m` 13.5, `deck_depth_m` 2.5;
   - `cables_per_side` 16, `main_stay_deck_m` [17, 167], `back_stay_deck_m` [17, 145];
   - `colour_mode` "vivid";
   - `nav_clearance.height_m` 37.5 (TEDI);
   - the label is 125.5 ± 0.1;
   - REVIEW_R1 has no MT2 entry.
7. `npx vitest run` and `npm run typecheck` pass.

## 9. Sources

- TEDI project page: https://tedi.vn/project/my-thuan-2-bridge/?lang=en. 350 m, 37.5 m, 28 m, 6 lanes, opened 24/12/2023; photos `tedi1`–`tedi3`.
- TEDI opening article: https://tedi.vn/khanh-thanh-cau-my-thuan-2-cau-day-vang-lon-nhat-cho-den-thoi-diem-hien-tai-do-tedi-thiet-ke/. TEDI as designer; BIM figures (`bim2`–`bim4`); top-anchorage study.
- Tecco1: https://tecco1.vn/xem-du-an/cau-my-thuan-2. "2 mặt phẳng dây", "dầm… mặt cắt chữ Pi", "2 trụ tháp dạng chữ A cao hơn 125m", piles D2.5 m to 113 m; 12 photos `tc*.jpg`.
- Tiền Phong, 19/1/2023: https://tienphong.vn/hinh-hai-du-an-cau-day-vang-tru-chu-a-cao-nhat-vung-tay-nam-bo-post1504457.tpo. "thiết kế hình chữ A", "đỉnh trụ cao 125,5m so với mực nước biển", "từ bệ tháp phần nổi lên đỉnh là hơn 119m", 4,800 m³ / 800 t per cap.
- Người Quan Sát, 12/2023: https://nguoiquansat.vn/chiem-nguong-cay-cau-5-000-ty-noi-2-do-thi-lon-nhat-nam-bo-106606.html. "tính từ đỉnh bệ đến đỉnh trụ là 119,5m"; girder "cao hơn mặt sông khoảng 38m".
- VnExpress 10/2023: https://vnexpress.net/cau-noi-cao-toc-my-thuan-can-tho-truoc-2-thang-thong-xe-4670076.html ("rộng 28 m, hai trụ tháp cao 125,5 m; 128 bó cáp văng và 32 đốt đúc", 37.5 m). VnExpress 1/2024: https://vnexpress.net/nguoi-viet-lam-chu-cong-nghe-xay-cau-day-vang-4705799.html (26 piles D2.5 m, 110–116 m; 32 + 28 segments; 28.3 m). VnExpress 9/2022: https://vnexpress.net/hien-trang-cau-my-thuan-2-sau-30-thang-xay-dung-4506550.html (33 pylon lifts of ≈4 m). VnExpress closure: https://vnexpress.net/hop-long-cau-my-thuan-2-bac-qua-song-tien-4664659.html (closure segment 8 × 28 m).
- Dân trí, 12/2022: https://dansinh.dantri.com.vn/dien-dan-dan-sinh/cang-cap-day-vang-dau-tien-tai-du-an-cau-my-thuan-2-20221206133546000.htm. "2 trụ tháp chính hình kim cương", 128 blue stays, 350 / 650 m, XL03B Trung Nam JV.
- Tuổi Trẻ, 1/2023: https://tuoitre.vn/toan-canh-va-can-canh-lam-dot-cao-nhat-tru-chinh-cong-trinh-cau-my-thuan-2-20230101143246562.htm. 33 lifts, "cao hơn 6m" than MT1.
- Báo Chính phủ, 14/10/2023: https://baochinhphu.vn/hop-long-cau-my-thuan-2-cay-cau-cap-dac-biet-trong-diem-quoc-gia-mang-thuong-hieu-viet-102231014173751805.htm. Ban QLDA 7, 5,003 tỷ, closure.
- Trung Nam Group: https://trungnamgroup.com.vn/du-an/ha-tang-2/cau-my-thuan-2. 2 pylons 125 m, 27/2/2020 → 24/12/2023; photos `tn1`–`tn4`.
- vi.wikipedia "Cầu Mỹ Thuận 2": 1,906 m, dates, cost. Commons "Cầu Mỹ Thuận 1 và 2" (AnhNguyen), "Cao tốc mỹ thuận cần thơ" (Letrieuvy2002).
- Bridge Design & Engineering: https://www.bridgeweb.com/My-Thuan-2-Bridge-on-track-in-Mekong-Delta/9176. TEDI designer, JV builder.
- **Not found:** general-arrangement drawing, deck / soffit levels, girder depth (2.5 m is [E]), channel width, side-span stay layout ([17, 145] is [P]/[E]), exact pylon section dimensions (all [P] ±15 %).
