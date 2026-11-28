# 3D model review: round 9, Cầu Hòa Sơn (`cau-hoa-son`), 2026-11-28

The user asked for a revision and supplied the **official render**, which is authoritative for the design. **The current model is wrong in three ways:**

1. **The pylon.** The model uses the built-in `inverted_Y`: two thin legs meet low, and a plain box mast stands on a splayed foot. The real pylon is a tall **"mountain peak" inverted Y**:
   - Two legs straddle the deck and merge at **≈ 59 %** of the above-deck height into one tapered mast.
   - The mast carries both stay planes and ends in a **pointed obelisk spire**.
   - Under the deck, the legs turn inward through a solid **"cup"** (chalice) and continue down to the water as one grooved stem.
2. **The spans.** The real layout is **40 + 40 + 150 + 550 + 150 + 40 + 40 m** (L = 1,010 m), the same as Cần Thơ. The model has 220 + 550 + 220 m.
3. **The stays.** They should be light (white / pale blue-grey), not red.

**No client-confirmed conflict.** Nothing on this record is marked `client-confirmed` in `scripts/gen_bridges.py`. The only values that change are estimates from round 1 or the shape pass:

- spans 220 / 550 / 220, from the renders;
- `deck_elevation_m` 40 [E];
- red stays, read from one press render (the red-stay aerial render is an alternative colour scheme; see §1).

Main span 550 m, pylon height 187 m and deck width 21.0 m are all confirmed and kept.

Reference images are in scratchpad `ref/hs/` (`/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/ref/hs/`):

| File | What it is |
|---|---|
| `user-official-render.png` | **The user's official render. Authoritative.** Low view from the water near the bank: near pylon right of centre, seen nearly side-on (its A reads as one mast with an S-curved stem below the deck); far pylon on the left, seen more along the axis (its A legs show); approach viaduct on tall single-column piers on the right. It is a 596 px copy of the top-left panel of `tedi_hoason.jpg`. |
| `tedi_hoason.jpg` | TEDI (the designer) contract page, 3 panels. Crops in scratchpad `crops/`: `deckview.png` (from the carriageway: two legs straddle the deck and merge into the mast, stays in two planes to the deck edges) and `nearpy.png` (near pylon: merge point, cup under the deck, stem) |
| `6-1749027348791887960772.jpg` | Báo Xây dựng render, **near-true elevation from mid-river**. Used for the proportions. Crops: `crops/e_left.png`, `crops/e_right.png`, `crops/e_backL.png` |
| `5-174902734880962060185.jpg` | Báo Xây dựng render, the same scene as the TEDI bottom panel (near pylon, back span, approach piers) |
| `7-…jpg`, `img_1f76fbd0.png`, `nqs_render.jpg` | Aerial / distant renders. These show an **alternative red-orange stay scheme**; the user's render and TEDI show light stays |
| `site_photo.jpg`, `site2.png` | Construction 6/2026: bored-pile casings of the pylon foundation near the bank at low reservoir level |

Baseline renders (current model): scratchpad `views-hs/`, including `cau-hoa-son-custom-az-120-el2-pylon0.png`.

Prototype of the target, rendered from a scratch copy of the repo (the project is untouched): scratchpad `hswork/r2/`. The exact JSON is `hswork/target.json`. The generator runs clean, with no warnings for this bridge.

Confidence tags: **[C]** confirmed by a source · **[R]** measured on official renders · **[E]** estimated.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Location / chainage | Km40+750 – Km41+989 of the Hòa Bình – Mộc Châu expressway, about 1.24 km in all. It runs between Tiền Phong commune (former Đà Bắc district) and Tân Thành commune (former Mai Châu district), crossing the Đà river in the upper Hòa Bình reservoir | [C] | [TEDI-GIC](https://tedi-gic.vn/cau-hoa-son-km40750-km41989-va-cao-toc-hoa-binh-moc-chau-doan-tu-km46000-km47500-tren-dia-ban-tinh-hoa-binh-tkkt/) |
| Main bridge | Cable-stayed, **(40 + 40 + 150 + 550 + 150 + 40 + 40) m, L = 1,010 m**. Two stay planes, **fan** ("nan quạt") | [C] | [TEDI contract page](https://tedi.vn/le-ky-ket-hop-dong-goi-thau-goi-thautu-van-khao-sat-lap-thiet-ke-ky-thuat-va-du-toan-xay-dung-cong-trinh-cau-hoa-son-thuoc-du-an-cao-toc-hoa-binh-moc-chau-doan-tu-km19000-km53000-tre/), TEDI-GIC |
| Press figures | 550 m main span (equal to Cần Thơ, the joint longest in Vietnam); **187 m pylon, the tallest in Vietnam**; "≈ 1.2 km" | [C] | [Báo Xây dựng 6/2025](https://baoxaydung.vn/lap-dat-sa-lan-lon-thi-cong-cau-co-2-ky-luc-tren-cao-toc-hoa-binh-moc-chau-192250604161040171.htm), [Người Quan Sát](https://nguoiquansat.vn/cau-day-vang-co-nhip-chinh-dai-nhat-tru-thap-cao-nhat-viet-nam-se-duoc-xay-tren-tuyen-cao-toc-10-000-ty-dau-tien-cua-tinh-hoa-binh-164255.html) |
| Deck | **Bc = 21.0 m including 2 × 1.75 m stay-anchor / maintenance strips**; 17.5 m between railings. Stage 1: 4 lanes (4 × 3.5); final stage: 6 lanes. Approaches: 17.5 m, Super-T girders | [C] | TEDI, TEDI-GIC |
| Girder | Hybrid: **prestressed-concrete box near the pylons and in the side spans; steel box composite with an RC slab in the central main span**. The concrete is built by balanced cantilever and the steel is erected by cantilever from the pylons. Schema value: `composite` | [C] | TEDI, TEDI-GIC |
| Pylons | **"Chữ Y ngược"** (inverted Y), cast-in-place RC / prestressed concrete. Concept: mountain peaks, "tapers to a point at the top"; stylised brocade (thổ cẩm) patterns on the surface (the blue grooves in the TEDI renders) | [C] | TEDI; Người Quan Sát (concept) |
| Anchor piers | Two-column (P7 / P10, 150 m from the pylons), on D1.5 m bored piles | [C] | TEDI |
| Pylon foundations | P8 (Đà Bắc bank) and P9 (Mai Châu bank), **45 bored piles D2.2 m, up to 85 m long**, into hard rock, in **> 40 m of water** | [C] | [Báo Lâm Đồng 6/2026](https://baolamdong.vn/cau-hoa-son-tren-cao-toc-hoa-binh-moc-chau-cau-day-vang-nhip-chinh-dai-nhat-viet-nam-449235.html), [NQS 20/6/2026](https://nguoiquansat.vn/huy-dong-thiet-bi-sieu-khong-lo-viet-nam-sap-hoan-thanh-cay-cau-day-vang-dai-nhat-ca-nuoc-nam-tren-tuyen-cao-toc-10-000-ty-o-khu-vuc-tay-bac-298966.html) |
| Navigation | Inland waterway class III, **B × H = 50 × 7 m** (unlabelled on the page; read as width × height) | [C] (medium) | TEDI-GIC |
| Status | Bridge started **15/4/2025**; target end of 2028. Mid-6/2026: P8 42/45 piles, P9 43/45 piles; work moving to the pile caps. No pylon above water yet. Water-level swings in the reservoir repeatedly pause the work | [C] | Báo Lâm Đồng, NQS |
| Parties | Investor: Ban QLDA các công trình giao thông tỉnh Hòa Bình. Designer: **TEDI** (TKKT contract 23/5/2024). Contractor: **Trung Chính** Construction. Bridge package about 3,100 billion VND | [C] | TEDI, Báo Xây dựng, NQS |
| Earlier options | A 2020 study had sites 1A (≈ 650 m span) and 1B (≈ 720 m span); not built | [C] | NQS |
| Colours | **White pylons**; stays light. The user's render shows them white / pale blue-grey; TEDI tints them blue → green. Some press aerial renders show red-orange stays, an alternative scheme superseded by the user's render | [R] | user render, TEDI |

### 1.1 Pylon geometry (pylon-local frame: x along the bridge, + toward the main span; y up from the deck; z across, deck edges at ±10.5)

Proportions come from the near-elevation render `6-…jpg`. In it the main span is 556 px for 550 m (≈ 1 m/px), and both pylons were measured:

| Measure | Left | Right | Adopted |
|---|---|---|---|
| Tip above deck (px) | 145 | 137 | — |
| Deck above water (px) | 69 | 59 | — |
| Deck / (water→tip) | 0.32 | 0.30 | **0.29–0.31** |
| Leg merge / above-deck height | 0.60 | 0.61 | **0.59** (TEDI deck view 0.57, `nearpy` 0.57) |
| Highest stay anchor / above-deck height | ≈ 0.87 | ≈ 0.88 | **0.90** (zone top 119 of 132) |
| Lowest stay anchor | just above the merge | | **84** (0.64) |

The deck-to-tip split rests on the 187 m [C] total. In the model the water is at full reservoir level (the renders' level) and the label reads the total. So **E = 55, tip = 132 above the deck, label 55 + 132 = 187.** The render's absolute scale (≈ 60 + 140 m) suggests the 187 m may be measured from a pile cap below full-pool level; the ratio is what matters, and it is kept.

| Element | Observation | Model value |
|---|---|---|
| Legs above the deck | Two straight legs pass just outside the 21 m deck (outside the stay-anchor strips) and lean in to merge | (±14.5, −2) → (±9.5, 30) → (±4.5, 60) → (±1.5, 78); section 8 → 5.5 across × 11 → 8 along |
| Merge / mast | One tapered mast from the merge to the spire, slightly wider than the two legs together | leg 2: y 76 → 123, 9 → 6.5 across, 9 → 7 along |
| Spire | Pointed obelisk cap, ≈ 9 m | leg 3: y 123 → 132, 6.5 → 0.6 (tapers to a point) |
| Below the deck | The legs curve **inward** right under the deck (an S-curve in the side view), forming a solid **cup** under the girder (blue V-inset in TEDI). Then a **single grooved stem** (two columns side by side) runs to the water. Stem width ≈ 0.65 × the leg spread at the deck | legs (±14.5, −2) → (±9.5, −9) → (±6, −18) → (±5.5, −35) → (±5.5, −57); cup + stem infill = **G13 panel** 9 m deep (thinner than the 11 m legs, so a groove shows on the side faces) |
| Stays | Two planes, from the **two faces of the mast** to the deck edges, over the mast between the merge and ≈ 0.9 H | anchor zone on leg 2 only, y 84 → 119 (one leg serving both planes ⇒ the engine anchors on its faces, ±3.25) |
| Pile cap | Submerged in > 40 m of water, 45 × D2.2 piles | 36 × 60 m, rounded ends, top at local −57 (2 m below full-pool water), 7 m thick [E] |

### 1.2 Stays [R/E]

You cannot count the stays individually on the renders; both planes overlap in perspective. Main side: the deck anchors run to the mid-span at about 12 m spacing, so **22 per side per plane** ((275 − 22) / 21 ≈ 12 m). Back side: the stays are visibly denser and land along almost the whole 150 m concrete side span, from about 11 to 140 m behind the pylon, before the anchor pier. Use **22 per plane, deck range [14, 142] m**. That gives 22 × 2 sides × 2 planes × 2 pylons = **176 stays**. [E]

## 2. Current vs reality

| P | Problem | Current | Expected |
|---|---|---|---|
| **P0** | Pylon form: built-in inverted Y. Thin legs meet low, a plain square mast, a flat top, a splayed foot reaching the water outside the deck, and no cup or stem | built-in `inverted_Y`, no `pylon_custom` | `pylon_custom` §3: legs merge at 0.59 H, tapered mast, obelisk spire, cup plus grooved stem |
| **P0** | Spans | [220, 550, 220] | **[40, 40, 150, 550, 150, 40, 40]**; the auxiliary piers at 40, 80, 930, 970 come automatically from the interior supports |
| P1 | Stays red | `stay_colour: "red"` | `"#cfdbe6"` (pale blue-white) |
| P1 | Deck elevation 40 [E] | `REVIEW_R1` set 40 | **55** (gives 0.29 deck / total; label 187) |
| P1 | Stay counts derived, back stays reaching 0.95 × 230 m across the anchor-pier spans | derived | `cables_per_side: 22`, `back_stay_count: 22`, `back_stay_deck_m: [14, 142]` |
| P1 | No pile cap | none | §3 |
| P2 | `deck_type` missing | — | `composite` (hybrid PC box / steel composite) |
| P2 | `approach_length_m` derived | 0.15 × L | 200 (the cap is 0.2 × L = 202; the ramp from bank level is an engine convention) |
| P2 | NAV missing | — | nav(7, 50, …) §3.3 |
| P2 | Bridge text fields (`span_arrangement`, `width_m`, `lanes`, `pylons*`, notes, sources) | partial | §3.4 |

## 3. Data changes

### 3.1 Target `model3d`

Put this in `research/shapes/cau-hoa-son.json` → `model3d`, replacing it whole. It was verified in a scratch copy: the generator passes and the renders look right.

```json
"spans_m": [40, 40, 150, 550, 150, 40, 40],
"pylon_shape": "inverted_Y",
"pylon_heights_m": [187, 187],
"pylon_height_ref": "total",
"deck_elevation_m": 55,
"cable_planes": 2,
"cable_pattern": "fan",
"cables_per_side": 22,
"back_stay_count": 22,
"back_stay_deck_m": [14, 142],
"deck_width_m": 21.0,
"deck_type": "composite",
"approach_length_m": 200,
"pylon_colour": "white",
"stay_colour": "#cfdbe6",
"confidence": "estimated",
"pylon_custom": {
  "description": "Inverted Y ('mountain peak'): two legs straddle the deck just outside its edges and lean inward to merge ≈59 % of the above-deck height into one tall tapered mast that carries both stay planes on its faces and ends in a pointed obelisk spire. Just below the deck the legs turn inward through a solid 'cup' (chalice) under the girder and continue down as two closely spaced columns that read as a single grooved stem to the water.",
  "legs": [
    {"centerline": [[0,-57,-5.5],[0,-35,-5.5],[0,-18,-6.0],[0,-9,-9.5],[0,-2,-14.5],[0,30,-9.5],[0,60,-4.5],[0,78,-1.5]],
     "width_base_m": 8.0, "width_top_m": 5.5, "depth_base_m": 11.0, "depth_top_m": 8.0},
    {"centerline": [[0,-57,5.5],[0,-35,5.5],[0,-18,6.0],[0,-9,9.5],[0,-2,14.5],[0,30,9.5],[0,60,4.5],[0,78,1.5]],
     "width_base_m": 8.0, "width_top_m": 5.5, "depth_base_m": 11.0, "depth_top_m": 8.0},
    {"centerline": [[0,76,0],[0,100,0],[0,123,0]],
     "width_base_m": 9.0, "width_top_m": 6.5, "depth_base_m": 9.0, "depth_top_m": 7.0},
    {"centerline": [[0,123,0],[0,127.5,0],[0,132,0]],
     "width_base_m": 6.5, "width_top_m": 0.6, "depth_base_m": 7.0, "depth_top_m": 0.6}
  ],
  "panels": [
    {"top": [[-14.5,-2.0],[14.5,-2.0]],
     "bottom": [[-14.5,-2.0],[-9.5,-9.0],[-6.0,-18.0],[-5.5,-30.0],[-5.5,-57.0],[5.5,-57.0],[5.5,-30.0],[6.0,-18.0],[9.5,-9.0],[14.5,-2.0]],
     "depth_m": 9.0}
  ],
  "crown": "pointed",
  "anchor_zone": [{"y_from_m": 84, "y_to_m": 119, "leg": 2}],
  "pile_cap": {"length_x_m": 36, "width_z_m": 60, "top_y_m": -57, "thickness_m": 7, "rounded_ends": true},
  "mirror_for_other_pylons": true,
  "reference_images": [
    "https://tedi.vn/wp-content/uploads/2024/05/hoason.jpg",
    "https://baoxaydung.mediacdn.vn/603483875699699712/2025/6/4/6-1749027348791887960772.jpg",
    "https://baoxaydung.mediacdn.vn/603483875699699712/2025/6/4/5-174902734880962060185.jpg"
  ]
},
"notes": "Main bridge (40 + 40 + 150 + 550 + 150 + 40 + 40) m, L = 1,010 m (TEDI technical design); 550 m main span and 187 m pylons (press). Deck 21.0 m incl. 2 × 1.75 m stay-anchor strips; hybrid girder: PC box near the pylons / side spans, steel–concrete composite box in the central main span. Inverted-Y 'mountain peak' pylons per the official render (TEDI): legs merge at ≈59 % of the above-deck height into a tapered mast with an obelisk spire; below the deck a solid cup and a single grooved stem. Proportions from the near-elevation render (deck ≈0.30 of the water-to-tip height): deck 55 m above full-pool water, tip 132 m above the deck. Two fan planes from the mast faces; 22 stays per side per plane (count estimated). White pylons, light stays (red-orange stays in some aerial renders are an alternative scheme). Pylon foundations: 45 bored piles D2.2 m, ≈85 m, in > 40 m of water."
```

Notes on the JSON:

- **Why the mast is a separate leg (2) with the only anchor zone.** With two planes and one zone on a leg whose average z is 0, `customZone` falls back to "one leg serving both planes" and anchors on its two faces (±w/2). Do not put zones on legs 0 and 1: the stays would then start below the merge.
- **Leg 3 is the spire**, tapering 6.5 → 0.6 m over 9 m. Its tip sets the drawn tip (132), so the label is 55 + 132 = **187**.
- **Panel = cup plus stem infill.** It fills the space between the leg centrelines from just under the deck (y −2) to the cap top (−57). Its 9 m depth is less than the legs' 11 m, so the side faces show a groove, as the brocade grooves do in the renders. The bottom curve has vertical steps (z −5.5 → −5.5), which G13 allows.
- **Do not use `crossbeams_y_m`.** It would join legs 0 → 1 → 2 → 3 in order.
- **Pile cap.** It sits below the full-pool waterline (local −55). It is hidden in most views and visible through the translucent `front` view.
- **Deck / clearance.** E = 55 is far above the 7 m navigation box. There should be no warning, and E stays 55.

### 3.2 Generator (`scripts/gen_bridges.py`)

- **`M3D["cau-hoa-son"]` (~l.425).** This is a fallback only, because the shape file wins. Update it anyway to `m3d([40, 40, 150, 550, 150, 40, 40], "inverted_Y", [187, 187], "total", 2, "fan", 21.0, "composite", cps=22, notes=…)` so that the two do not disagree.
- **`PHASE6` colours (~l.818).** Change `"cau-hoa-son": {"pylon_colour": "white", "stay_colour": "red"}` to `"#cfdbe6"` stays and replace the comment with: "white pylons, light stays per the official render (TEDI); red stays = alternative aerial scheme".
- **`REVIEW_R1["cau-hoa-son"]` (~l.953).** Change it to `{"set": {"deck_elevation_m": 55}, "note": "r9: deck 55 m above full-pool water (deck ≈0.30 of the 187 m water-to-tip height in the official elevation render)."}`. Otherwise it overrides the shape file with 40.
- **The `add(id="cau-hoa-son", …)` seed (~l.205):**
  - add `span_arrangement="40 + 40 + 150 + 550 + 150 + 40 + 40 m (main bridge 1,010 m)"`, `width_m=21`, `lanes=4`;
  - keep `total_length_m=1200`, or use 1239 (scope Km40+750 – Km41+989); either is defensible, so say which in the notes;
  - `pylons="2 inverted-Y 'mountain peak' pylons, 187 m"`;
  - sources: add the TEDI, TEDI-GIC, Báo Xây dựng and NQS (20/6/2026) URLs from §1;
  - notes: append "Designer TEDI; contractor Trung Chính. Mid-6/2026: pylon foundations P8 42/45, P9 43/45 bored piles (D2.2 m, ≈85 m, in > 40 m of water). Stage 1: 4 lanes on a 21 m deck (final 6 lanes)."
  - Coordinates are still approximate. The site is between Tiền Phong (Đà Bắc) and Tân Thành (Mai Châu) communes. Refine only if a map source is found (P2, out of scope).
- **`PRESS["cau-hoa-son"]` (~l.458).** Optionally add the TEDI render (`https://tedi.vn/wp-content/uploads/2024/05/hoason.jpg`, "render"). The current two press images (red-stay aerial renders) can stay, but the first image shown should preferably be a light-stay render.

### 3.3 NAV

`"cau-hoa-son": nav(7, 50, "inland waterway class III, B × H = 50 × 7 m (TEDI-GIC technical-design summary; reference level not stated)", "https://tedi-gic.vn/cau-hoa-son-km40750-km41989-va-cao-toc-hoa-binh-moc-chau-doan-tu-km46000-km47500-tren-dia-ban-tinh-hoa-binh-tkkt/")`

### 3.4 Shape file text

- `pylons_vi`: "2 tháp chữ Y ngược hình đỉnh núi, cao 187 m: hai chân nhập thành một thân thon nhọn mũi, dưới mặt cầu là thân trụ đơn có khấc"
- `pylons_en`: "2 inverted-Y 'mountain peak' pylons, 187 m: legs merge into a tapered mast with a pointed spire; a single grooved stem below the deck"
- `colour`: "white pylons, light stays"
- `review` / `checklist`: update the entries to say the following:
  - foot: cup plus stem, pile cap submerged;
  - merge: 0.59 H;
  - stays: light, 2 planes from the mast faces;
  - spans: TEDI 40 + 40 + 150 + 550 + 150 + 40 + 40;
  - compare: the user's official render, camera §5.

## 4. Engine gaps

**None required.** The target uses only existing features: custom legs with depth, G13 `panels`, `pile_cap`, the anchor zone on a single leg, `back_stay_count` / `back_stay_deck_m`, `deck_elevation_m`, the auxiliary piers derived from the spans, and colours.

Optional, P2, do not block on these:

- **G15 `bank_height_m?: number`** (default 4). Use it for gorge and reservoir crossings: the banks are drawn this high, and the approach ramps rise from this height to E. Here the deck runs into steep forested hillsides at ≈ 55 m. Today the default 4 m banks give a 25 % ramp. With `bank_height_m: 45`, the banks would read as hillsides and the ramps as nearly level viaducts. Acceptance: in the `side` view the approaches are near level, with no steep wedges.
- **Under-construction state.** The engine draws balanced cantilevers to 60 % of each reach for every `under_construction` bridge. In reality Hòa Sơn is only at the foundations (no pylon above water yet). This is a global convention, so no change; note it only.

## 5. Acceptance criteria (I will re-render)

Cameras:

- `--views front,side,foot,top,three_quarter`
- **`--az -120 --el 2 --target pylon0`**: this matches the user's render. The near pylon is right of centre and nearly side-on, with its back span and anchor piers to the right; the far pylon is on the left, with its A legs visible. The baseline is `views-hs/cau-hoa-son-custom-az-120-el2-pylon0.png`; the prototype is `hswork/r2/cau-hoa-son-custom-az-120-el2-pylon0.png`.
- `--az -135 --el 2 --target pylon0`: the near pylon more side-on (the single-mast look with the S-curved stem).

Criteria:

1. **Pylon form (P0)**, in the front, foot and user-render cameras:
   - two legs pass **outside** the deck edges at the deck (centre z ±14.5);
   - they merge at y 78 ± 4 (0.57–0.62 of the above-deck height) into one tapered mast;
   - the mast ends in a pointed spire, with the tip at local 132;
   - under the deck there is a solid cup narrowing to a single stem (two columns with a groove, no open slot) down to the water;
   - nothing remains of the old splayed built-in foot or the flat-topped box mast.
2. **Height.** The pylon label reads **187 m**; E = 55; there is no clearance warning.
3. **Spans.** 40 + 40 + 150 + 550 + 150 + 40 + 40; auxiliary / anchor piers at stations 40, 80, 930 and 970.
4. **Stays.**
   - Light (pale blue-white), **not red**.
   - Two planes, anchored on the **faces of the single mast** between y 84 and 119, running to the deck edges.
   - None anchor on the legs below the merge.
   - 22 per side per plane.
   - Back stays land 14–142 m behind each pylon, i.e. not beyond the anchor pier at 150 m. In the under-construction state, those beyond the built cantilever are dropped; that is expected.
5. **Colour.** White pylons. The pile cap is plain concrete and submerged.
6. **Proportion vs the renders**, in the `side` view:
   - deck height / water-to-tip ≈ 0.29 (± 0.03);
   - merge / above-deck height ≈ 0.59 (± 0.03);
   - main span / tip-above-deck ≈ 4.2 (render 550 / 140 ≈ 3.9; ± 0.4).
7. **Data.**
   - `REVIEW_R1` deck elevation is 55 (not 40).
   - `PHASE6` stays are no longer red.
   - The M3D fallback, seed fields (`span_arrangement`, `width_m`, `lanes`, `pylons`), sources, notes and NAV are updated.
   - The generator runs with no warnings for this bridge, and `npm test` passes.

## 6. Open points (no user decision required)

- **Datum of the 187 m.** The press gives no reference level. The reservoir swings between ≈ 80 and 117 m (dead to normal level). The model puts the water at full pool and the label at 187 m. If a drawing appears with a pile-cap level, revisit E (between 50 and 60) and the tip.
- **Stay count.** 22 per side per plane is an estimate (§1.2). The form does not depend on it.
- **Blue brocade trim.** The TEDI renders show blue grooves on the white pylons; the user's render hardly shows them. Optional: give the panel (cup plus stem infill) `colour: "#2f5fb3"` with `colour_mode: "vivid"` to hint at the blue cup. Not required.
