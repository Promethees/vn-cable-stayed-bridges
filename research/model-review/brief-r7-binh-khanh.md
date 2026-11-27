# 3D model review: round 7, Cầu Bình Khánh (`cau-binh-khanh`), 2026-11-27

The user reported that the model needs improvement. **Confirmed.** The H form is right, but the current custom pylon has geometric errors you can see:

- **The legs float about 21 m above the water.** Leg feet are at local y −38, which was drawn for the old heuristic deck height of 37.5 m. The 55 m navigation clearance now raises the deck to ≈59 m.
- **The legs pierce the deck.** The legs sit at z ±12, but the girder is really **30.35 m wide**.
- **One crossbeam is in the wrong place, and one beam is missing.** The model has a "top" beam at 90 of 98 and an under-deck beam. The real pylon has neither. It has an upper beam at about **⅔ of the above-deck height** and a deep **tie beam at the waterline**.
- **The stays are the wrong colour.** They are the default blue; the real stays are white.

**No client-confirmed values are contradicted.** This record has no client-confirmed fields. The r1 values (spans 187.25 + 375 + 187.25, 155 m, 17 per side) are all re-confirmed below.

Reference images are saved in scratchpad `ref/bk/`:

| File | What it is |
|---|---|
| `s_p3.jpg`, crop `p3_near.jpg` | PLO aerial at inauguration (19/12/2025): whole unit, high three-quarter view. **Primary reference.** |
| `s_p1.jpg`, crops `p1_far.jpg` / `p1_near.jpg` | PLO aerial, 12/2025: both pylons close up. Upper beam, base tie beam, and no beam under the deck. |
| `vtc1_top.jpg` | VTC News, 8/2025: deck-level view along the axis. Leg spacing, beam height, and legs just outside the deck. |
| `bl2_c.jpg` | Sài Gòn Times, 2/2025: under-deck view during erection. **No crossbeam under the deck**; tie beam at the water. |
| `sgt.jpg`, crops `sgt_near.png` / `sgt_far.png` | Sài Gòn Times aerial at closure (7/2025), the existing `reference_images` URL |
| `commons1.jpg` | Commons construction photo (distant) |

Current-model renders are in scratchpad `views-bk/`. A trial render of the spec below is in `views-bk-try/`; I checked it in a throw-away copy, and the main repo is untouched.

Confidence tags: **[C]** confirmed by a published figure · **[P]** read directly off photos · **[E]** estimated from photo proportions.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Stayed unit | **187.25 + 375 + 187.25 = 749.5 m** | [C] | [VECC](https://vecc.com.vn/project/duong-cao-toc-ben-luc-long-thanh/?lang=en), [vi.wikipedia](https://vi.wikipedia.org/wiki/C%E1%BA%A7u_B%C3%ACnh_Kh%C3%A1nh), [TNCK opening article](https://www.tinnhanhchungkhoan.vn/khanh-thanh-cau-day-vang-binh-khanh-cau-co-tinh-khong-cao-nhat-viet-nam-post382393.html) |
| Auxiliary piers | **None.** Both side spans are clear from the pylon to the end pier. | [P] | p3, p1 |
| Girder | **2 PC edge girders, each a trapezoidal box ("2 dầm chủ biên dạng hộp hình thang"), 3 m deep**, 5.50 m bottom width, **24.85 m apart; total girder width 30.35 m** | [C] | TNCK (also Báo Pháp Luật and Báo Xây Dựng, opening day 19/12/2025) |
| Cross-section | 21.75 m "mặt cắt ngang" (4 lanes + 2 emergency lanes): the roadway, not the girder | [C] / [I] | VECC, vi.wiki; the reading "roadway" is mine |
| Navigation clearance | **55 m high, L = 242 m wide**; design vessel 20,000 DWT at 5 m/s on the 2 main piers | [C] | VECC; TNCK |
| Pylon | **H: two vertical, slightly tapered rectangular legs** just outside the deck edges. One **upper crossbeam at ≈0.66 of the above-deck height**. A **deep tie beam linking the leg feet just above the waterline**. **No crossbeam under the deck.** Flat leg heads with saddle housings. | [P] | p1, p3, vtc1, bl2 |
| Pylon height | **155 m "from foundations"** (VECC; VnExpress, TNCK "khoảng 155 m"). The 135 m figure (Người Quan Sát, Nhân Dân) is superseded: 135.8 m is **Phước Khánh's** height on the same VECC page. | [C] | VECC |
| Above-deck / below-deck height | Ratio ≈ 1.45–1.58 in three photos. With the deck ≈60 m above water, the tip is ≈87–95 m above the deck. | [E] | p1, p3, bl2 |
| Stays | **2 fan planes, 17 pairs per pylon, 68 cables in all.** They are continuous over **saddles** ("neo yên ngựa"): each cable gives one main-span stay and one back-span stay. Lengths deck→saddle **58.7–197.6 m**; 19–55 strands of 15.7 mm. | [C] | TNCK, VnExpress 5092605 |
| Saddle zone on the legs | Lowest saddle ≈0.55 H and top ≈0.96 H above deck. The anchor zone reaches below the upper beam. This is consistent with a shortest stay of 58.7 m. | [P] / [E] | sgt_near, p1_far; stay lengths |
| Colours | Pylons light-grey or off-white concrete. **Stays white** (HDPE). Deck grey concrete (a thin red fascia line, not modelled). | [P] | all photos |
| Contractor / supervision | Shimizu–Vinaconex JV; KEI–NE–OCG–TEDI JV; JICA STEP loan | [C] | Người Quan Sát, TNCK |

## 2. Discrepancies and target values

### P0

| Field | Current | Expected | Why |
|---|---|---|---|
| `model3d.deck_elevation_m` | (none → 59.1 from the nav rule) | **60** | Deck top = 55 m clearance + 3 m girder + ≈2 m. This fixes the leg geometry below. |
| `model3d.deck_depth_m` | (none → 3.1) | **3** | [C] |
| `model3d.deck_width_m` | 21.75 | **30.35** | [C] Overall girder width. The stays anchor on the edge boxes at the deck edges. Keep the bridge-level `width_m` 21.75 (the roadway) and explain the difference in the notes. Also add `deck_width_m: 30.35` to the `REVIEW_R1["cau-binh-khanh"]["set"]` entry. |
| Custom legs | z ±12, y −38 → 98, widths 5 / 3.5 | **z ±17.6, y −62 → 93**, see §3 | They float 21 m above water and pierce a 30 m deck |
| Crossbeams | `[-3, 90]` | **`[]`**; use **struts** for the upper beam (y 61, 5 m) and the base tie (y −53, 6 m), see §3 | [P] No under-deck beam. The beam is at ⅔ height, not the top. The tie beam sits at the water. |

### P1

| Field | Current | Expected | Conf |
|---|---|---|---|
| `anchor_zone` | 55–96 on both legs | **53–89 on legs 0 and 1** | [P] / [E] |
| `stay_colour` | (default blue) | **"white"** | [P] |
| `nav_clearance` | `nav(55, None, …)` | **`nav(55, 242, "VECC: 55 m, L = 242 m; 20,000 DWT design vessel", "https://vecc.com.vn/project/duong-cao-toc-ben-luc-long-thanh/?lang=en")`** | [C] |
| `pylons` / `pylons_en` | "2 tháp chữ H, dầm ngang đỉnh, cao 155 m" | VI: **"2 tháp chữ H hai cột đứng, dầm ngang ở khoảng 2/3 chiều cao trên mặt cầu, giằng chân sát mặt nước; dây neo yên ngựa; cao 155 m tính từ móng"**. EN: **"2 H pylons with two vertical legs, a crossbeam at ≈2/3 of the height above deck and a tie beam at the waterline; stays over saddles; 155 m from the foundations"** | [C] / [P] |
| `model3d.notes` | Stale text: "763 m … ≈194", "135 m", "joined near the top" | Replace with: "Spans 187.25 + 375 + 187.25 m (VECC). Two PC edge box girders 3 m deep, 24.85 m apart, 30.35 m overall (21.75 m = roadway). 155 m pylons from foundations (VECC; 135 m = Phước Khánh). H legs at ±17.6 m just outside the deck, upper beam at ≈2/3 of the above-deck height, tie beam at the waterline, no beam under the deck (photos 2025). 17 stay pairs per pylon side, 68 cables over saddles, 58.7–197.6 m. Deck ≈60 m above water (55 m clearance)." | |
| `sources` | — | Add the VECC project page and the TNCK opening article | |

### P2

- **Shape file.** Rewrite `research/shapes/cau-binh-khanh.json` `model3d.spans_m` to `[187.25, 375, 187.25]` and `pylon_heights_m` to `[155, 155]`, so the shape file no longer carries the stale 194 / 135 values that REVIEW_R1 overrides. Update `review` / `checklist`: "foot below deck" → pass, "deck / aux piers" → pass (none).
- **`cable_pattern`.** Keep `"fan"` (the press wording). With a custom anchor zone the engine spreads the saddles over 53–89 anyway, which matches the photos.
- **`confidence`.** Keep `"estimated"`, because the pylon proportions are read off photos.
- **Pile cap.** Not visible in the completed-state photos (it is submerged), so do not add `pile_cap`.

## 3. `research/shapes/cau-binh-khanh.json` → `model3d` (target)

```json
"spans_m": [187.25, 375, 187.25],
"pylon_shape": "H",
"pylon_heights_m": [155, 155], "pylon_height_ref": "total",
"deck_elevation_m": 60, "deck_depth_m": 3,
"deck_width_m": 30.35, "deck_type": "concrete",
"cable_planes": 2, "cable_pattern": "fan", "cables_per_side": 17,
"stay_colour": "white",
"pylon_custom": {
  "description": "H pylon: two vertical, slightly tapered rectangular legs just outside the 30.35 m deck, one crossbeam at about 2/3 of the height above deck, a deep tie beam linking the feet just above the waterline, no crossbeam under the deck; stays pass over saddles in the upper legs.",
  "legs": [
    {"centerline": [[0,-62,-17.6],[0,0,-17.6],[0,50,-17.6],[0,93,-17.6]],
     "width_base_m": 6.5, "width_top_m": 3.5, "depth_base_m": 9, "depth_top_m": 7},
    {"centerline": [[0,-62,17.6],[0,0,17.6],[0,50,17.6],[0,93,17.6]],
     "width_base_m": 6.5, "width_top_m": 3.5, "depth_base_m": 9, "depth_top_m": 7}
  ],
  "crossbeams_y_m": [],
  "struts": [
    {"a": [0, 61, -17.6], "b": [0, 61, 17.6], "width": 5},
    {"a": [0, -53, -17.6], "b": [0, -53, 17.6], "width": 6}
  ],
  "anchor_zone": [
    {"y_from_m": 53, "y_to_m": 89, "leg": 0},
    {"y_from_m": 53, "y_to_m": 89, "leg": 1}
  ],
  "mirror_for_other_pylons": true,
  "reference_images": [
    "https://cdn2.tuoitre.vn/plo/image/Uploaded/nhungoc/2025_12_19/cau-binh-khanh-4496-9552.jpg",
    "https://cdn2.tuoitre.vn/plo/image/Uploaded/nhungoc/2025_12_19/cau-binh-khanh-1-4106-3884.jpg",
    "https://cdn-i.vtcnews.vn/resize/ma/upload/2025/08/25/cau-binh-khanh-00092323.jpg",
    "https://cdn2.tuoitre.vn/thesaigontimes/uploads/2025/02/bl2.jpg",
    "https://cdn2.tuoitre.vn/thesaigontimes/uploads/2025/07/DJI_20250710151804_0781_D-1.jpg"
  ]
}
```

Derivation notes:

- **Leg position, z ±17.6.** In vtc1, the clear gap between the legs at deck level is about the deck width plus ~1 m (31.3 m), and the legs are ≈5.5 m wide there. That puts the inner faces at ±15.6 to ±16 and the centres at ≈±17.6. The leg widths follow the section convention in `sweepRect`: width runs across the bridge (z) and depth along it (x).
- **Tip, y 93.** With E 60 the tip is **153 m above water**, about the 155 m "from foundations" figure.
- **Upper beam, y 61.** That is 0.656 × 93. vtc1 measures 0.655 and p1 / bl2 measure 0.65–0.67.
- **Why struts.** I used struts rather than `crossbeams_y_m` because the engine sizes crossbeams at 0.8 × `width_top` (2.8 m), and both real beams are clearly deeper. vtc1 gives the upper beam as ≈5.4 m.
- **Tie beam, strut at y −53 (width 6).** p1 and p3 put it at about −54 to −44 above the waterline, i.e. y −60.
- **Leg feet, y −62.** The legs reach 2 m into the water.
- **Anchor zone, 53–89.** The lowest saddle is ≈0.55 H, which is consistent with the 58.7 m shortest stay. The top saddle is just under the head.
- **Trial render.** I rendered exactly this JSON (`views-bk-try/`), and it reads correctly against p3, p1 and vtc1.

**Engine gaps: none.** Everything above uses existing features: custom legs, struts, `deck_elevation_m`, `deck_depth_m` and anchor zones.

There is one optional nicety I am **not** requesting. The real stay planes run from the legs (±17.6) to the edge-box centres (±12.4), whereas the engine anchors at the deck edges (±15.2). The 2.8 m difference is not visible at card scale.

## 4. Acceptance criteria (I will re-render)

Cameras:
- `--views side,front,foot,three_quarter,top`
- `--az 50 --el 35 --target unit`: compare p3 (whole unit, high oblique)
- `--az 35 --el 30 --target pylon0`: compare p1_far / p3_near
- `--az 88 --el 4 --target pylon0`: along the axis at deck level, compare vtc1

1. **Legs reach the water.** Leg feet are at or below the waterline (y ≤ −60 local) in `foot` and in az 35. Nothing floats.
2. **Legs clear the deck.** Both legs stand fully outside the 30.35 m deck, with a gap of ≈0.5–1 m. In the `front` and az 88 views the deck fills the space between the legs, as in vtc1.
3. **Beams.**
   - One upper beam at 0.64–0.68 of the leg height above the deck, ≈5 m deep, with the leg heads continuing ≈32 m above it.
   - A tie beam ≈6 m deep a few metres above the water.
   - **No beam directly under the deck**, and no beam at the tip.
4. **Height.** Tip 151–157 m above water (label "Cao ≈153 m tổng"). Deck top 60 m above water. The `side` view shows the pylon above deck ≈1.5 × the part below deck.
5. **Stays.**
   - 2 planes, 17 per side per plane.
   - White.
   - Saddles spread over y ≈53–89 on each leg, so the lowest stays meet the leg below the upper beam.
   - Main-span stays meet at mid-span; back stays run to the end piers.
   - No auxiliary piers.
6. **Data.**
   - Spans 187.25 + 375 + 187.25, `deck_width_m` 30.35 (bridge `width_m` stays 21.75).
   - `nav_clearance` 55 × 242.
   - `pylons` / `pylons_en`, notes and sources updated as in §2.
   - Stale 194 / 135 values removed from the shape file.
   - `python3 scripts/gen_bridges.py data/bridges.json` regenerates cleanly, and `npm test` passes.
