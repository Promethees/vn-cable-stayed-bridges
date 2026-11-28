# 3D model review: round 11, Cầu Đại Ngãi 1 (`cau-dai-ngai-1`), 2026-11-28

The user says the model needs revision and supplied the **official render** (authoritative for the design):
`scratchpad/ref/dn/user-official-render.png`. Compared with the current model, the main problems are:

1. **Pylon proportions and form.** The render shows an inverted Y / A in the cross-bridge plane:
   - Two straight, stout legs stand on a large chamfered pile cap, each on a square plinth.
   - Below the deck, the legs are ≈40 m apart (centres) at the cap and ≈28 m apart at the deck. A ≈5 m deep crossbeam sits directly under the girder.
   - Above the deck, the legs converge to a near-touching pair at **≈0.62 of the height (≈68 m above deck)**. A small dark "eye" marks the link there.
   - Above that, they rise as **two parallel blades with a narrow slot** to a capital at ≈98 m (the second dark opening). Above the capital is a **pierced crown/finial**, and a spike reaches 110 m.

   The current model is different. Its legs bow outward below the deck (z ±13 → ±11 at the foot, so they splay *inward* to the footing), they merge at 78 m, and a separate solid 5 m mast runs to 110 m. There is no pile cap, no plinths and no deck-level crossbeam.
2. **Heights.** The current model draws the deck with the default clamp, `E = 45` (0.1 × 450 m), on a flat deck. There is no `nav_clearance`. The confirmed **45 m navigation clearance (160 × 45 m)** is missing. The render also shows a crested deck.
3. **Stays.** The current model has a pure fan anchored over 70–108 m on one mast with the default count. The render shows a semi-fan anchored over the blades between ≈63 and 97 m, and ≈20 per side per plane.
4. **Side spans.** The render shows one auxiliary pier in each 210 m back span, ≈60 m from the unit end. The model has none.
5. **Colour.** The model has grey concrete pylons. The render has **white** pylons and red stays. The girder is grey with red steel edge girders (see the engine gap note in §5).

**Flag: no client-confirmed value is contradicted.** `gen_bridges.py` has no `client-confirmed` marker for this bridge. All of the following are kept:
- Round 1's [C] tags: 210 + 450 + 210, "chữ A", 110 m above the deck and 21.5 m width.
- Status `under_construction`.
- `opened` 2028.

The target keeps `pylon_shape: "inverted_Y"`, which the round-1 brief already equated with the press term "chữ A". The **164 m** figure (SGGP) is explained, not contradicted: it is the full tower height, cap to tip, see §2.

Confidence tags: **[C]** confirmed by a source · **[R]** read from the official render · **[E]** estimated.

## 0. References

All files are in `scratchpad/ref/dn/` (session scratchpad `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/`). They are comparison material only; the licences are unknown.

| File | What it is |
|---|---|
| `user-official-render.png` | **The authority.** 1920 × 1080 official render, low three-quarter view from the river. Near pylon right of centre (back span toward the camera on the right), far pylon on the left. |
| `grid_near.png`, `grid_far.png` | The render with a 20 px / 100 px grid (scale 1.5 and 2). Used for every height ratio below |
| `crop_base.png`, `crop_head.png`, `crop_far.png`, `mast_zoom.png` | Zooms of the cap and legs, the head, the far pylon, and the anchor serrations (contrast ×2.5) |
| `deck_back.png`, `backfan.png` | Back span, auxiliary pier, transition pier and the red edge girders |
| `photos/tt1.jpg`, `photos/tt2.jpg`, `photos/tt4.jpg` | Tuổi Trẻ construction photos, 27/11/2026. Two inclined legs converging (A), with temporary struts. P23 at segment 25, P24 at segment 18 |

Current-model renders are in `views-dn/`. The prototype of the target was built in a scratch copy of the repo (`dnwork/repo`); the project is untouched. Its renders:
- `dnwork/r2/`: standard views, plus `custom-az-125-el1-pylon0` with `deck_closed` forced on for comparison only.
- `dnwork/r3/`: the real under-construction state, `side`, `three_quarter`, `front` and `custom-az-125-el1-pylon0`.

The exact shape file is `dnwork/target_shape.json`.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Span arrangement | **210 + 450 + 210 m** (870 m stayed unit); 450 m is the 2nd-longest span in VN after Cần Thơ | [C] | CafeF 21/11/2026, Báo Đầu tư, Tuổi Trẻ |
| Bridge length | ≈2,559.6 m (Đại Ngãi 1 bridge); "main bridge ≈2.6 km", total incl. roads > 3 km | [C] | Báo Đầu tư (KTNN audit article), VnExpress, Tuổi Trẻ |
| Deck | **21.5 m** on the cable-stayed bridge (17.5 m elsewhere), 4 lanes | [C] | vi.wikipedia, VnExpress, Tuổi Trẻ |
| Girder | **Steel–concrete composite** ("dầm thép liên hợp"), two stay planes | [C] | Báo Đầu tư (KTNN). Render: twin red steel edge girders under a grey slab, white web stiffeners |
| Navigation | **Tĩnh không 160 × 45 m** (B × H); the 2019 project brief gave H 45 m and B ≥ 300 m for 10,000 t ships over the Định An channel | [C] | Báo Đầu tư / tinnhanhchungkhoan (23/7/2026), Báo Tây Ninh / ITST (2019) |
| Pylon | 2 "chữ A" pylons, **110 m above the deck** [C]; **164 m tower** (SGGP); first such pylon designed by a domestic consultant (wind tunnel abroad) | [C] | VnExpress, Tuổi Trẻ, GD&TĐ, SGGP |
| Pylon form | Cross-bridge A / inverted Y, as described in the summary above | [R] | render; legs confirmed by `tt1` |
| Foundations | 32 bored piles Ø2.5 m, up to 116 m deep per pylon; pylon cap > 9,000 m³ | [C] | Đèo Cả, Báo Xây dựng, search excerpts |
| Stays | Red, 2 planes, semi-fan; ≈20 per side per plane (≈160 total) | [R]/[E] | render (anchor serrations ≈1.45 m apart over ≈63–97 m) |
| Piers | Pylons P23 (Trà Vinh/Vĩnh Long side) and P24; approaches: 42 piers/abutments on paired columns with cap beams; one auxiliary pier per back span | [C] names / [R] layout | Tuổi Trẻ, render |
| Status 27/11/2026 | ≈65 % of contract; P23 at segment 25, P24 at 18 (tower item ≈81 %); towers done 4/2027, stays from 5/2027, closure end-2027, contract completion 6/2028 (Minister asked for 6 months earlier) | [C] | Tuổi Trẻ 27/11/2026, CafeF 21/11/2026, Người Quan Sát |

## 2. Heights, as measured on the render

The camera is level (verticals are vertical), so vertical ratios on one pylon are reliable. Values in render px:

| Pylon | Tip (spike) | Capital / upper opening | Lower "eye" (merge) | Deck top at pylon | Cap top (leg base) | Waterline below leg |
|---|---|---|---|---|---|---|
| Near | 30 | 112 | 285 | 705 | 955 | ≈986 |
| Far | 367 | 397 | 485 | 685 | 812 | ≈826 |

The ratios:

- **Merge height.** (705 − 285)/675 = 0.62 near and (685 − 485)/318 = 0.63 far, so the merge is at **≈68 m** above the deck.
- **Capital.** 0.88 and 0.91 of the height, so **≈98 m**. The crown and spike run from ≈99 to 110 m.
- **Deck above water.** Scaling with 110 m above the deck: (986 − 705) × 0.163 ≈ 46 m near and (826 − 685) × 0.346 ≈ 49 m far. That gives **≈47 m at the pylons**.
- **Cap top** is ≈4–5 m above the water.
- **Total height.** Cap top to tip is ≈152 m and water to tip ≈157 m. The press "164 m" is most plausibly the tower from the cap's base level, so it is compatible.

**Deck in engine terms:**

- E (unit ends) = **41.0**, crest **8.5**.
- Crest at the pylons = 8.5 · (1 − (225/435)²) = 6.23, so the deck at the pylons is **47.2 m**.
- Mid-span deck is **49.5 m**.
- Tip = 41 + 6.23 + 110 = **157.2 m** above the water.
- Navigation check: 49.5 ≥ 45 + 3.0 + 1 = 49.0, so E is **not raised** (verified, no warning).

The render clearly shows the crest. The deck descends both ways off the main span to the approach viaducts.

**Cap in local y.** Below-deck local y is folded by (1 + crest_p/E) = 1.152 (see brief-r10-thuan-an §4). A cap top 4 m above the water is therefore at local **−37.5** (4/1.152 − 41). Do not "correct" it.

**Cross-bridge.** The render shows the far leg displaced right of the near leg. The leg spacing at the deck : at the cap is 123 : 173 px = 0.71. Combined with the requirement that the legs clear the 21.5 m deck, this gives:
- leg centres **z ±20 at the cap** and **±14 at the deck** (inner face ≈11.5 m, so the deck passes between the legs);
- blades **z ±2.0–2.1** from 68 to 99 m (slot ≈1.2 m).

**Back span.** I solved a 1-D projective map from the far pylon (−450 m), the near pylon (0) and the transition pier (+210 m). The paired-column pier at image x ≈1340/1480 (centre 1410) then lands **≈156 m from the pylon, i.e. ≈55–60 m from the unit end**. The outermost back stays land just short of the transition pier, which matches the engine default reach of 0.95.

## 3. Current model vs reality (prioritised)

| P | Field | Current | Target | Conf |
|---|---|---|---|---|
| P0 | `pylon_custom` | Legs z ±11 (−35) → ±13 (0) → ±1.5 (78) + separate 5 m mast 78–110, crossbeam −3, no cap | **Straight A legs** z ±20 at cap → ±14 at deck → ±2.1 at 68 m, **parallel blades with a slot** to 99 m, converging to a pointed tip at 110 m; link strut at 68 m, capital strut at 98.5 m, deck-level crossbeam (centre −5.5, 5 m deep), leg plinths, **pile cap 60 × 30 m**. JSON in §4 | [R] |
| P0 | `deck_elevation_m` / `deck_crest_m` | none (E = 45 by clamp, flat) | **41.0 / 8.5** (47.2 m at the pylons, 49.5 m at mid-span) | [R]+[C] |
| P0 | `nav_clearance` | none | **NAV: `nav(45, 160, "160 × 45 m (B × H); 10,000 DWT, Định An channel", <Báo Đầu tư URL>)`** | [C] |
| P1 | stays | `fan`, default count, anchors 70–108 m on the mast | **`semi_fan`, `cables_per_side: 20`**, anchor zones 63–97 m on both legs (two planes to the deck edges) | [R]/[E] |
| P1 | `pylon_colour` | grey (default) | **white** (stays stay red) | [R] |
| P1 | `deck_depth_m` | default | **3.0** (composite twin-girder; render ≈3–3.7 incl. barrier) | [R]/[E] |
| P1 | `auxiliary_piers_m` | none | **[60, 810]** (±10 m) | [R] |
| P2 | text | `pylons` "chữ Y ngược, đầu cao … 110 m"; notes "110 vs 164 m disagree"; no width / lanes / length / span_arrangement | §6 | [C] |
| P2 | sources / images | 3 sources | add Tuổi Trẻ 27/11/2026, Báo Đầu tư (KTNN), SGGP, VnExpress (khởi công), CafeF 21/11/2026, Báo Tây Ninh (2019 brief) | [C] |
| P2 | not modelled | — | chamfered (hexagon-ended) cap, pierced crown with slots, red edge girders, paired-column approach piers, construction stage (towers only, no deck yet). See §5 | |

## 4. Target `model3d` (complete; replaces `model3d` in `research/shapes/cau-dai-ngai-1.json`)

I prototyped and rendered exactly this. It generates with no warnings, and E is not raised.

```json
{
  "spans_m": [210, 450, 210],
  "pylon_shape": "inverted_Y",
  "pylon_heights_m": [110, 110],
  "pylon_height_ref": "above_deck",
  "deck_elevation_m": 41.0,
  "deck_crest_m": 8.5,
  "deck_depth_m": 3.0,
  "cable_planes": 2,
  "cable_pattern": "semi_fan",
  "cables_per_side": 20,
  "deck_width_m": 21.5,
  "deck_type": "composite",
  "auxiliary_piers_m": [60, 810],
  "pylon_colour": "white",
  "stay_colour": "red",
  "confidence": "estimated",
  "notes": "Cable-stayed unit 210 + 450 + 210 m (2nd-longest span in Viet Nam), steel–concrete composite girder (twin red steel edge girders under a concrete slab), two stay planes, deck 21.5 m (4 lanes). Navigation clearance 160 × 45 m (Báo Đầu tư / KTNN; 2019 brief: H 45 m, B ≥ 300 m, 10,000 t). Pylons P23/P24 per the official render: white 'chữ A' / inverted-Y towers, 110 m above the deck (press); the legs stand on square plinths on a chamfered pile cap (≈60 × 30 m, 32 Ø2.5 m piles up to 116 m), pass outside the deck edges with a deck-level crossbeam under the girder, converge at ≈68 m above the deck and rise as two blades with a narrow slot to a capital at ≈98 m, topped by a pierced crown and spike. SGGP's 164 m is the whole tower from the cap (render: ≈152 m cap top to tip, deck ≈47 m above the water at the pylons). Red semi-fan stays, ≈20 per side per plane (read from the render), anchored over ≈63–97 m. One auxiliary pier per back span ≈60 m from each unit end (render). Deck ≈41 m above the water at the unit ends, ≈47.2 m at the pylons, ≈49.5 m at mid-span (crest 8.5 m).",
  "pylon_custom": {
    "description": "Inverted Y / 'chữ A' across the bridge (official render): two straight legs on square plinths on a chamfered pile cap, z ±20 m at the cap, passing outside the 21.5 m deck at z ±14 with a 5 m deep crossbeam under the girder; they converge to ±2.1 m at ≈68 m above the deck (small link, the dark 'eye'), rise as two parallel blades with a ≈1.2 m slot to a capital at ≈98.5 m, and close into a pointed crown at 110 m (the real crown is pierced, with a spike). Stays anchor on both blades in two planes running to the deck edges.",
    "legs": [
      {"centerline": [[0, -37.5, -20.0], [0, 0, -14.0], [0, 40, -6.9], [0, 68, -2.1], [0, 84, -2.0], [0, 99, -2.0], [0, 110, -0.2]],
       "width_base_m": 7.0, "width_top_m": 1.2, "depth_base_m": 10.0, "depth_top_m": 4.0},
      {"centerline": [[0, -37.5, 20.0], [0, 0, 14.0], [0, 40, 6.9], [0, 68, 2.1], [0, 84, 2.0], [0, 99, 2.0], [0, 110, 0.2]],
       "width_base_m": 7.0, "width_top_m": 1.2, "depth_base_m": 10.0, "depth_top_m": 4.0}
    ],
    "crown": "pointed",
    "crossbeams_y_m": [-5.5],
    "crossbeam_depth_m": 5.0,
    "struts": [
      {"a": [0, 68, -2.1], "b": [0, 68, 2.1], "width": 2.5},
      {"a": [0, 98.5, -2.0], "b": [0, 98.5, 2.0], "width": 3.5},
      {"a": [0, -37.5, -20.0], "b": [0, -35.0, -20.0], "width": 11.0},
      {"a": [0, -37.5, 20.0], "b": [0, -35.0, 20.0], "width": 11.0}
    ],
    "pile_cap": {"length_x_m": 30, "width_z_m": 60, "top_y_m": -37.5, "thickness_m": 6.0},
    "anchor_zone": [
      {"y_from_m": 63, "y_to_m": 97, "leg": 0},
      {"y_from_m": 63, "y_to_m": 97, "leg": 1}
    ],
    "mirror_for_other_pylons": true,
    "reference_images": [
      "official render supplied by the user (2026-11-28)",
      "https://tuoitre.vn/cau-dai-ngai-1-dan-thanh-hinh-nhip-chinh-lon-thu-hai-viet-nam-100261127102308467.htm",
      "https://baodautu.vn/he-lo-nha-thau-thi-cong-sieu-cau-day-vang-dai-ngai-1-tri-gia-3900-ty-dong-d231683.html"
    ]
  }
}
```

Notes on the JSON:

- **Leg orientation.** Width is across the bridge (z) and depth is along x. The base is 7 × 10 m, tapering to 1.2 × 4 m at the tip. The blades at 68–99 m come out ≈2.8 × 5.5 m, which leaves a ≈1.2 m slot. The tips are 0.4 m apart, so they form the pointed crown, and the drawn tip is **110.0** (label = `above_deck` 110).
- **Struts.**
  - Strut 1 is the link at the merge (the lower dark "eye").
  - Strut 2 is the capital and head beam (the upper dark opening).
  - Struts 3–4 are the square leg plinths, 11 × 11 × 2.5 m.
  - Use struts here, not `crossbeams_y_m`. Only the deck-level beam is a crossbeam, because it needs `crossbeam_depth_m`.
- **Crossbeam.** Its centre is at −5.5 with a depth of 5, so its top touches the soffit at −3.0.
- **Pile cap.** 60 × 30 × 6 m ≈ 10,800 m³ less the chamfers, consistent with "> 9,000 m³" and with 32 Ø2.5 m piles (a 4 × 8 grid at 2.5 D). The render cap is chamfered; see the G18 note in §5.
- **Anchors.** Each zone's leg sits on one side (z < 0 / z > 0), so plane 0 uses leg 0 and plane 1 uses leg 1. The stays run from the blades to the matching deck edge.
- **The keys removed** relative to the current shape file are the old third "mast" leg, the crossbeam at −3 and the single anchor zone on leg 2.

### Shape-file top-level fields

- `pylons_vi` / `pylons_en`: see §6.
- `colour`: "white pylons; grey deck with red steel edge girders; red stays (official render)".
- `review`: add "Round 11: official render. Straight A legs on a chamfered cap, merge ≈68 m, slotted blades to a capital at ≈98 m, pierced crown 110 m; deck 41 + crest 8.5; 160 × 45 m clearance; semi-fan 20/side; aux pier 60 m from each end".
- `checklist`: the following become "pass (official render)": foot below deck, legs at deck, merge height (68 m), crossbeams, proportions (110 above / ≈47 below deck), stays (semi-fan, 20), deck / aux piers, and colour. Head becomes "limited (pierced crown and spike approximated by a pointed tip)".
- `notes` / `compare`: mention the official render.

## Generator edits (`scripts/gen_bridges.py`)

1. **Shape file.** Replace `model3d` as in §4. It is authoritative (`pass2`).
2. **M3D fallback** (line ≈455). Bring it in step: `m3d([210, 450, 210], "inverted_Y", [110, 110], "above_deck", 2, "semi_fan", 21.5, "composite", cps=20, notes="Fallback; see research/shapes/cau-dai-ngai-1.json (round 11: official render, A legs merging at ≈68 m, deck 41 + crest 8.5).")`. Put a "fallback only … kept in step (round 11)" comment above it, as for the others.
3. **PHASE6** `"cau-dai-ngai-1": {"stay_colour": "red"}`. Keep it, or extend it to `{"pylon_colour": "white", "stay_colour": "red"}`. The shape file sets both anyway.
4. **NAV.** Add `"cau-dai-ngai-1": nav(45, 160, "160 × 45 m (B × H); 2019 brief: H 45 m, B ≥ 300 m for 10,000 t ships (Định An channel)", "https://baodautu.vn/nhat-san-tai-du-an-cau-dai-ngai-d648135.html")`.
5. **Seed `add()`**, all [C]:
   - `pylons="2 tháp chữ A (Y ngược) màu trắng, cao 110 m trên mặt cầu (tháp 164 m)"`
   - `pylons_en`, as in §6
   - `span_arrangement="210 + 450 + 210 m"`, `width_m=21.5`, `lanes=4`, `total_length_m=2560`
   - Add sources: Tuổi Trẻ 27/11/2026, `https://baodautu.vn/nhat-san-tai-du-an-cau-dai-ngai-d648135.html`, SGGP `https://www.sggp.org.vn/cau-dai-ngai-1-lui-tien-do-2-nam-do-phu-thuoc-tu-van-nuoc-ngoai-post780870.html`, VnExpress `https://vnexpress.net/khoi-cong-cau-day-vang-4-000-ty-vuot-song-hau-4825716.html`, CafeF `https://cafef.vn/viet-nam-dang-xay-cau-day-vang-cap-dac-biet-nhip-chinh-dai-thu-2-ca-nuoc-tru-thap-cao-ngang-toa-nha-35-tang-tong-von-hang-nghin-ty-dong-188261121192312191.chn`.
   - **`notes`:**
     - Replace "Sources disagree on pylon height (110 m vs 164 m)" with "110 m above the deck (press) and 164 m for the whole tower (SGGP) are consistent: the render puts the deck ≈47 m above the water at the pylons."
     - Add the progress: 27/11/2026 ≈65 %, P23 at segment 25, P24 at 18; towers done 4/2027, stays from 5/2027, closure end-2027, contract completion 6/2028.
     - Add the 32 Ø2.5 m piles up to 116 m.
     - Keep the Commons-licence remark.
   - Keep `opened=2028` and `status="under_construction"`. Do **not** set `deck_closed`: the towers are not finished and no deck segment is erected.
6. **EXPECT_R1 / round-11 assert block**, modelled on the Thuận An block:
   - `EXPECT_R1["cau-dai-ngai-1"] = {"pylon_colour": "white", "stay_colour": "red", "deck_elevation_m": 41.0, "deck_crest_m": 8.5, "cables_per_side": 20, "cable_pattern": "semi_fan", "auxiliary_piers_m": [60, 810]}`
   - Assert two legs with base z ±20 at y −37.5 and tips at y 110.
   - Assert the merge points `[0, 68, ±2.1]`.
   - Assert `pile_cap` (30, 60, −37.5).
   - Assert anchor zones `[(0, 63, 97), (1, 63, 97)]`.
   - Assert `nav_clearance.height_m == 45`.
   - Assert no `main_stay_deck_m` and no `deck_closed`. The G15/G16/G17 allow-lists stay unchanged: this bridge needs **none** of G15 `main_stay_deck_m`, G16 `deck_closed`, G17 `deck_haunch` or G14 `vivid`.
   - Assert `"164" in b["notes"]`, and that `"chữ A" in b["pylons"]`.
7. **Test check.** Run `python3 scripts/gen_bridges.py data/bridges.json` and `npm test`. With the target data in the scratch copy, `npx vitest run --testTimeout 200000` passes: 134/134. Under the default timeout, the heavy "custom pylons … bounding box" test timed out once while renders ran in parallel. That was a timeout, not an assertion failure.

## 5. Engine gaps

None is needed for acceptance. The target uses only existing features. Nice-to-haves, in priority order:

- **G18 (P2): `pile_cap.chamfer_m`.** It cuts the four plan corners at 45° by `chamfer_m` along each axis, clamped to ≤ min(L, W)/2. `chamfer_m = length_x_m/2` gives the elongated hexagon in the render (pointed ±z ends). The same key makes Thuận An's octagon. Draw it in plain concrete like the box cap. It must have no effect when absent.
- **Deck fascia colour (P2): `deck_edge_colour`.** This colours only the two outer girder side faces (the vertical faces of the deck box), so the composite twin-girder reads as "grey slab, red edge girders". `deck_colour` must stay the whole deck.
- **Pierced crown / finial (P2).** This would be a `crown: "finial"` or a generic thin spike above the apex, without changing the label tip. It is low value at card scale.
- **Construction stage (P2, project-wide).** `under_construction` always draws 60 % cantilevers with stays. Đại Ngãi in 11/2026 has towers only, at segments 25 and 18, with no girder or stays. An optional `construction_stage: "towers" | "cantilevers"` would let it show truthfully. Do not do this in this round.

## 6. Text

- `pylons_vi` (shape file) / seed `pylons`: "2 tháp chữ A (Y ngược) màu trắng, cao 110 m trên mặt cầu (≈164 m toàn tháp): hai chân đứng trên bệ cọc, giao nhau ở ≈68 m rồi vươn thành hai bản song song có khe hẹp đến đỉnh tháp xuyên lỗ; dây văng đỏ hai mặt phẳng, dạng nửa rẻ quạt"
- `pylons_en`: "2 white 'A' (inverted-Y) pylons, 110 m above the deck (≈164 m overall): legs on a large pile cap meet at ≈68 m and continue as two slotted blades to a pierced crown; red semi-fan stays in two planes"

## 7. Acceptance criteria

Render with your own server (`npx vite --host 127.0.0.1 --port <p> --strictPort`, `--url`). There must be no new warnings for this bridge (no nav raise, no clamps).

1. **`--az -125 --el 1 --target pylon0`.** This camera matches the user's render: back span to the right toward the camera, main span and the far pylon receding to the left, and the far pylon ≈0.47× the near one. For a like-for-like look, an extra render with `deck_closed` injected into a scratch copy of `data/bridges.json` is fine, but never commit it. Check:
   - **Legs.** Two straight legs on plinths on a cap clearly wider than the leg spread. The deck passes between the legs with a deep crossbeam under it.
   - **Merge.** The legs meet at ≈0.62 of the height above the deck (0.57–0.67), and slotted blades continue to a capital at ≈0.9.
   - **Tip.** A pointed tip at 110 m above the deck.
   - **Height ratio.** Pylon above deck : deck above the cap top is ≈2.6 (2.3–2.9).
   - **Leg spacing.** The near/far leg spacing at the deck : at the cap is ≈0.7.
   - **Stays.** Red stays in two planes leave the blades between ≈0.57 and 0.88 of the height.
2. **`front`.** An A from the cap to ≈68 m, then a narrow slotted shaft. The legs stand outside the deck edges at deck level, and the cap is ≈60 m wide.
3. **`side`.** A crested deck (mid-span higher than the pylons), one auxiliary pier in each back span ≈60 m from the ends, and a semi-fan of 20 stays per side.
4. **`top`.** The parallel blades with a slot, the capital beam at ≈98.5 m and the converging tip. There must be no separate mast.
5. **Data checks** (`data/bridges.json`):
   - `deck_elevation_m` 41, `deck_crest_m` 8.5, `deck_depth_m` 3, `cables_per_side` 20, `cable_pattern` "semi_fan", `pylon_colour` "white", `auxiliary_piers_m` [60, 810];
   - `nav_clearance` {height 45, width 160};
   - `span_arrangement` "210 + 450 + 210 m", `width_m` 21.5, `lanes` 4;
   - status `under_construction`, no `deck_closed`;
   - drawn tip ≈157 m above the water (41 + 6.23 + 110);
   - the notes no longer say the 110/164 figures "disagree".
6. `npm test` and `npm run typecheck` pass (see §4 item 7 on the timeout).

## 8. Sources

- Tuổi Trẻ, 27/11/2026: https://tuoitre.vn/cau-dai-ngai-1-dan-thanh-hinh-nhip-chinh-lon-thu-hai-viet-nam-100261127102308467.htm. 450 m, 21.5 m, 2 A-pylons 110 m above the deck, 65 %, P23 segment 25 / P24 segment 18, towers 4/2027, stays 5/2027, closure end-2027. Photos `tt1`–`tt4`.
- Báo Đầu tư / Tinnhanhchungkhoan (KTNN audit), 23/7/2026: https://baodautu.vn/nhat-san-tai-du-an-cau-dai-ngai-d648135.html. "tổng chiều dài khoảng 2.559,6 m; … dây văng hai mặt phẳng dây, dầm thép liên hợp, trụ tháp chữ A và bảo đảm tĩnh không thông thuyền 160 x 45 m".
- SGGP: https://www.sggp.org.vn/cau-dai-ngai-1-lui-tien-do-2-nam-do-phu-thuoc-tu-van-nuoc-ngoai-post780870.html. "trụ tháp cao 164m"; domestic designer; wind tunnel by a foreign consultant.
- VnExpress (ground-breaking): https://vnexpress.net/khoi-cong-cau-day-vang-4-000-ty-vuot-song-hau-4825716.html. 2.6 km, 21.5 m, A pylons 110 m above the deck, 300 m navigation width, 1,250 days → 6/2028.
- CafeF, 21/11/2026: https://cafef.vn/viet-nam-dang-xay-cau-day-vang-cap-dac-biet-nhip-chinh-dai-thu-2-ca-nuoc-tru-thap-cao-ngang-toa-nha-35-tang-tong-von-hang-nghin-ty-dong-188261121192312191.chn. 210 + 450 + 210, tower item ≈81 %, P23 cap finished 1/2026, piles 5–11/2025, package 15-XL ≈3,868 tỷ.
- vi.wikipedia "Cầu Đại Ngãi": 4 lanes, 17.5 m (21.5 m on the cable-stayed part), started 9/12/2024.
- Báo Tây Ninh / ITST (2019 project start): https://baotayninh.vn/dau-tu-5-800-ty-dong-xay-cau-dai-ngai-noi-tra-vinh-soc-trang-69238.html. Clearance H 45 m, B ≥ 300 m, 10,000 t.
- Đèo Cả / Báo Xây dựng: piles Ø2.5 m up to 116 m (32 per pylon, from a search excerpt); cap > 9,000 m³ (from a search excerpt, not re-read verbatim).
- **Not found:** the official stay count and the designer's drawings. The stay count (20/side/plane) and all geometry below the 110 m figure are read from the render [R]/[E].
