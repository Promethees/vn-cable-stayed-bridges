# 3D model review: round 7, Cầu Phước Khánh (`cau-phuoc-khanh`), 2026-11-27

The user said the model needs improvement. **Confirmed.** The plan form is right: two H pylons, two planes, 300 m main span. The pylon itself is wrong in the ways that are most visible:

1. **The pylon is about 30 m too tall.** The model draws 96.5 m above the deck and 155 m in total. Round 1 took **155 m** from the press, but that is **Bình Khánh's** height. VEC (Vietnam Expressway Engineering Consultants), the consultant, gives Phước Khánh's tower as **135.8 m from foundations** and Bình Khánh's as 155 m. Measured from photos, the real pylon is about **67 m above the deck** and about 128 m from water to tip.
2. **The upper crossbeam is in the wrong place.** The model puts it at the top. In reality it sits at about **63 % of the above-deck height**, and the legs above it are free-standing posts that carry all the stays.
3. **The stays anchor in the wrong zone.** The real anchorage is short and concentrated at the top, above the crossbeam (saddle anchorages). The model spreads it over 40 m and starts it low.
4. **Other gaps:**
   - the stays are white, not the default teal;
   - there is no pile cap;
   - the legs are too thin along the bridge (the lower legs are clearly deeper).

**Client-confirmed values:** no conflict. Nothing in the record is marked client-confirmed. Two values do change:
- the round-1 REVIEW_R1 decision `scale_y 0.877` (to 155 m) must be **removed**;
- the `pylons` / `pylons_en` text ("≈155 m", "top cross-beam") is wrong.

Reference images are saved in the scratchpad (`…/scratchpad/ref/pk/`). Current-model renders are in `…/scratchpad/views-pk/`.

| File | What it shows | Use |
|---|---|---|
| `dt2.jpg` | Dân Trí 9/2026, drone above the main span looking along the axis at a pylon (completed) | **Primary front reference**: H portal, crossbeam ~63 % up, free posts above, stays anchored only above the beam, white stays |
| `dt6.jpg`, crop `dt6_right.jpg` | Dân Trí 9/2026, near-broadside panorama of the whole unit from downstream | **Primary elevation**: proportions, deck height, crossbeam height, pile cap / tie at the waterline |
| `vnn12.jpg`, crop `vnn12_c.jpg` | VietnamNet 6/2026, near top-down | Spans; no auxiliary piers; the 41 m approach span after each end pier |
| `vnn8.jpg`, `vnn5.jpg` | VietnamNet 6/2026, before closure | Lower legs deeper than the upper legs; lower crossbeam under the deck; PC deck with edge ribs and cross ribs |
| `tp5.jpg`, crop `tp5_near.jpg` | Tiền Phong 9/2026 aerial | Crossbeam ~63 % up; semi-fan anchorage at the top |
| `cafef.jpg` | CafeF 9/2026 (the record's press image) | Oblique three-quarter view, completed span |
| `commons2017.jpg` | Commons 2017 (the record's photo) | Construction: lower crossbeam with haunches, pile cap / plinth just above water |

Confidence tags: **[C]** confirmed by a document · **[I]** inferred from photos · **[E]** estimated (measured on photos).

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Cable-stayed unit | **149.5 + 300 + 149.5 = 599 m**, 3-span, no auxiliary piers | [C] | [VEC](https://vecc.com.vn/project/duong-cao-toc-ben-luc-long-thanh/?lang=en) ("main span: (149.5+300+149.5)m"); [JICA PSR/monitoring report 2026Q2](https://www.jica.go.jp/english/about/policy/environment/id/asia/southeast/a_b_fi/vietnam/__icsFiles/afieldfile/2026/09/29/Result_of_Environmental_Monitoring_(2026Q2).pdf) (Phuoc Khanh 599 m; Pkg3 L = 3,186 m); [vi-Wikipedia](https://vi.wikipedia.org/wiki/C%E1%BA%A7u_Ph%C6%B0%E1%BB%9Bc_Kh%C3%A1nh); no piers in the side spans in vnn12 / cafef |
| Approaches | 41 + 11 × 70 + 41 m on each side (balanced-cantilever viaduct) | [C] | vi-Wikipedia; vnn12 shows a ≈40 m span after the end pier |
| **Pylon height** | **135.8 m "from foundations"**. Bình Khánh: 155 m from foundations. The press "155 m" for Phước Khánh (VnExpress, VietnamNet, Dân Trí) mixes up the two bridges; vi-Wikipedia and Lao Động give 135 m. | [C] | VEC (same page, both bridges) |
| Pylon above deck | **≈67 m (±4)**; water to tip ≈128 m. "Foundations" therefore means about 8 m below the waterline (pile-cap underside). | [E] | dt6: above-deck / below-deck pixel ratio 1.08 (two legs measured). Panorama geometry: main span 900 px against pylon 192–202 px gives 65–69 m for any camera distance 200–500 m. Cross-check: the same photo gives water→deck ≈61 m, matching 55 m clearance + girder. |
| Pylon form | **H portal of two vertical legs** (no inclination in either plane) | [C] | VnExpress "trụ tháp hình chữ H"; dt2 / vnn8 / dt6 |
| | **One upper crossbeam at ≈63 % of the above-deck height** (≈43 m), ≈5 m deep | [I] | dt2 (0.66), tp5 (0.63), dt6 (0.61) |
| | Above it the legs are **free-standing posts with flat tops** (railing and lightning rod only, **no top beam**) | [I] | dt2 |
| | **Lower crossbeam directly under the deck**, deep (≈6 m), with haunches | [I] | dt7, commons2017, vnn5 |
| | Legs ≈3.5 m wide across the bridge above the deck. Along the bridge: ≈4–4.5 m above the deck, ≈6–7 m below it. | [E] | dt2, dt6_right, vnn5 |
| | Legs sit just outside the deck edges, centres **≈ ±13 m** (clear width between legs ≈23 m) | [E] | dt2 (beam clear span / leg width ≈ 6.6) |
| Foundation | Both legs on one **pile cap / plinth whose top is ≈3–4 m above water**, ≈36 × 22 m in plan | [E] | commons2017, dt6_right, vnn8 |
| Stays | **56 cables in total** ("56 bó cáp"), two planes, fan type. Each runs continuously over a **saddle** ("neo yên ngựa") at the pylon, with both ends anchored in the girder. That makes 56 / 2 pylons / 2 planes = **14 per side per plane**. | [C] count, [I] split | [VnExpress "Thiết kế đặc biệt…"](https://vnexpress.net/thiet-ke-dac-biet-cua-hai-cau-day-vang-cao-nhat-viet-nam-5092605.html); about 14 counted per side in vnn8 |
| Anchorage on the pylon | A **short zone near the top**, from just above the crossbeam to just under the tip: **y ≈ 47 → 66 m** | [I] | dt2, tp5_near, dt6_right |
| Deck | 21.75 m; 4 lanes + 2 emergency lanes; **PC concrete**: twin edge ribs with transverse ribs, slender (≈2.5 m) | [C] width, [I] section | VEC, vi-Wikipedia; vnn5 underside |
| Navigation | **55 m high × 242 m wide** | [C] | VEC; JICA |
| Colours | Pylons and deck in raw concrete grey; **stays white** | [C] | all 2026 photos |
| Contractors | Sumitomo Mitsui Construction + Cienco 4 (J3, 2015–2022, terminated at about 80 %); completed by Bắc Trung Nam + Freyssinet Việt Nam (from 4/2025) | [C] | vi-Wikipedia; VnExpress |

## 2. Current model and reality

| Item | Current (`data/bridges.json`) | Reality |
|---|---|---|
| spans | 150 / 300 / 150 | 149.5 / 300 / 149.5 |
| pylon above deck | 96.5 m (custom tip, after `scale_y 0.877`) | **≈67–68 m** |
| total label | 155 m | ≈128 m water→tip (135.8 m from foundation) |
| upper crossbeam | at the top (y 91) | **y ≈ 43**, legs continue 25 m above it as free posts |
| lower crossbeam | y −3, thin (2.8 m) | under the deck, ≈6 m deep |
| anchor zone | y 52.6 → 93 (40 m) | **y 47 → 66** (19 m) |
| leg section | 5 → 3.5 square | width (z) 4.5 → 3.3; depth (x) 7 → 4.5 |
| leg z | ±12 | ±13 |
| pile cap | none (legs run into the water) | cap top ≈ +3.5 m above water |
| stays | teal (default), "fan" | **white**, semi-fan at the top |
| deck | concrete, default elevation 58.5 | same; slight vertical curve |

## 3. Changes, by priority

### P0: pylon geometry (replace `pylon_custom` in `research/shapes/cau-phuoc-khanh.json`)

Coordinates are local (x along the bridge toward the main span, y above the deck surface, z across). E = 58.5, so the waterline is at y = −58.5.

```json
"pylon_custom": {
  "description": "H portal: two vertical concrete legs just outside the deck edges on one pile cap; a deep lower crossbeam under the deck and one upper crossbeam at about 63% of the height above deck; above it the legs rise as free-standing posts with flat tops that carry the saddle-anchored stays.",
  "legs": [
    {"centerline": [[0,-55,-13],[0,0,-13],[0,43,-13],[0,68,-13]],
     "width_base_m": 4.5, "width_top_m": 3.3, "depth_base_m": 7.0, "depth_top_m": 4.5},
    {"centerline": [[0,-55,13],[0,0,13],[0,43,13],[0,68,13]],
     "width_base_m": 4.5, "width_top_m": 3.3, "depth_base_m": 7.0, "depth_top_m": 4.5}
  ],
  "crossbeams_y_m": [],
  "struts": [
    {"a": [0,43,-13], "b": [0,43,13], "width": 4.5},
    {"a": [0,-5.5,-13], "b": [0,-5.5,13], "width": 6.0}
  ],
  "anchor_zone": [
    {"y_from_m": 47, "y_to_m": 66, "leg": 0},
    {"y_from_m": 47, "y_to_m": 66, "leg": 1}
  ],
  "pile_cap": {"length_x_m": 22, "width_z_m": 36, "top_y_m": -55, "thickness_m": 8},
  "mirror_for_other_pylons": true,
  "reference_images": [
    "https://cdnphoto.dantri.com.vn/I8TtJ-2qxvYcQmo_ZyTOilwPlHU=/thumb_w/1920/2026/09/12/djifly2026091010270803901789022653901photo-1789232067058.jpg",
    "https://dantri.com.vn/thoi-su/hai-cau-day-vang-cao-nhat-viet-nam-sap-noi-doi-bo-20260913000004022.htm",
    "https://vietnamnet.vn/cau-day-vang-cao-nhat-viet-nam-tren-tuyen-ben-luc-long-thanh-sap-hop-long-2517148.html",
    "https://commons.wikimedia.org/wiki/File:Cầu_Phước_Khánh_2017.jpg"
  ]
}
```

Notes:
- **Crossbeams as struts.** The two crossbeams are given as `struts` (`width` 4.5 and 6) so they read deep enough. `crossbeams_y_m` would size them at `max(1.5, 0.8·width_top)` = 2.6 m, half the real depth. If the engineer prefers `crossbeams_y_m: [-5.5, 43]`, that is acceptable (P2 look difference only). Do not use both. The strut ends sit on the leg centrelines because the legs are vertical.
- **Check the dt2 photo for the strut.** If the photo / dt2 match shows the strut hiding the leg faces oddly, shift the ends to z ±11.4 (the inner faces). That is a cosmetic choice.
- **Pile cap.** It is plain concrete, 3.5 m above water and 8 m thick (mostly submerged). The leg bases start on its top.

### P0: remove the round-1 rescale
In `scripts/gen_bridges.py`, `REVIEW_R1["cau-phuoc-khanh"]`:
- drop `"scale_y": 0.877`, otherwise the new geometry is shrunk to 59.6 m;
- keep `cables_per_side 14` and `deck_type "concrete"` (or move them into the shape file);
- update the note to: "Pylon 135.8 m from foundations (VEC); 155 m in the press is Bình Khánh's."

### P1: `model3d` scalar fields

| Field | Current | Expected | Conf |
|---|---|---|---|
| `spans_m` | [150, 300, 150] | **[149.5, 300, 149.5]** | [C] VEC / JICA / vi-WP |
| `pylon_heights_m` | [155, 155] | **[135.8, 135.8]**, `pylon_height_ref` "total". The custom geometry drives the drawing and the label (≈127 m water→tip). Notes must say that 135.8 is measured from the foundation. | [C] VEC |
| `cable_pattern` | "fan" | **"semi_fan"**, which describes it better. The anchor zone drives the geometry either way. | [I] |
| `cables_per_side` | 14 | 14 (keep) | [C]/[I] |
| `stay_colour` | default (teal) | **"white"** | [C] photos |
| `pylon_colour` / `deck_colour` | default | "grey" for both, or leave the default if it is already concrete grey | [C] |
| `deck_elevation_m` | unset (58.5 derived) | **58.5** (explicit) | [E] dt6 + nav 55 m |
| `deck_crest_m` | unset | **2.5** (gentle vertical curve, highest at mid-span) | [E] |
| `deck_type` | concrete | concrete (keep). `deck_section` stays the default box; the depth is the default 2.5 m. | [I] vnn5 |
| `auxiliary_piers_m` | none | none (confirmed none) | [I] vnn12 |
| `confidence` | "estimated" | "estimated". Spans, height and stay count are now documented; the pylon proportions are photo-measured. | — |
| `notes` | … | Rewrite: spans and 135.8 m per VEC; 155 m is Bình Khánh; above-deck ≈67 m and crossbeam ≈43 m measured on Dân Trí 9/2026 photos; 56 saddle stays → 14/side/plane. | — |

### P1: bridge record text
- `pylons` (VI): "2 tháp chữ H (2 cột đứng, 1 xà ngang trên ở khoảng 2/3 chiều cao), cao 135,8 m tính từ móng"
- `pylons_en`: "2 H-shaped pylons (two vertical legs, one upper crossbeam about two-thirds up), 135.8 m from the foundation"
- In the `add(...)` seed, set `pylons=` to the same VI text. The shape-file value wins today; keep them consistent.
- `nav(...)`: add **width 242** (`nav(55, 242, None, <VEC url>)`). Source: VEC.
- `sources`: add the VEC project page and the JICA report URL.
- Shape-file `review` / `checklist` lines that say "top beam" are wrong: crossbeams should read "upper beam ≈63 % up + under-deck beam".

### P2
- `total_length_m` 3186 is right for the whole J3 package ([C] JICA Pkg3 L = 3,186 m). Keep it.

## 4. Engine gaps

**None required.** Everything above uses existing fields:
- custom legs with `depth_*`;
- `struts`;
- `pile_cap`;
- `anchor_zone`;
- `deck_elevation_m` / `deck_crest_m`;
- `stay_colour`.

Optional (P2, not needed for approval): a `crossbeams` object form, `{y_m, depth_m}`, so that crossbeam depth can be set without `struts`.

## 5. Acceptance criteria (I will re-render)

Cameras:
- `--views side,front,foot,three_quarter,top`;
- `--az 0 --el 4 --target unit` (compare `dt6.jpg`);
- `--az 10 --el 3 --target pylon0` (compare `dt6_right.jpg`);
- `--az 60 --el 22 --target unit` (compare `cafef.jpg` / `tp5.jpg`).

The default `front` view is the comparison for `dt2.jpg`.

1. **Proportions (side / az 0).**
   - Pylon tip ≈ 68 m above the deck; **tip-above-deck ÷ water-to-deck = 1.1–1.2** (photo 1.08–1.13). The present ratio is 1.65, which fails.
   - Water-to-tip label ≈ 126–129 m, not 155.
2. **Front view vs dt2.**
   - Two vertical legs, about 23 m clear between them, just outside the deck edges.
   - **One crossbeam at 60–66 % of the above-deck height**, clearly deeper than the leg width × 0.8 (about 4–5 m).
   - **No beam at the top**: the legs end as two free posts with flat tops.
   - All stays attach **above** the crossbeam.
3. **Anchorage.**
   - The stays fan from a short zone (≈ y 47–66) at the top of each leg.
   - 14 per side per plane, 112 stays drawn in total.
   - White.
   - Outer stays reach about 95 % of the side span and the middle of the main span.
4. **Below the deck (foot view / dt6_right).**
   - A deep lower crossbeam sits just under the deck.
   - The legs are visibly deeper along the bridge below the deck than at the top.
   - Both legs stand on one pile cap whose top is about 3.5 m above water.
5. **Spans.** 149.5 + 300 + 149.5, no auxiliary piers. The deck has a slight crest (≈2.5 m) and clears 55 × 242 m without warnings.
6. **Data and tests.**
   - `scale_y` is removed from REVIEW_R1.
   - `pylons` / `pylons_en`, notes, sources and `nav` width are updated.
   - `python3 scripts/gen_bridges.py data/bridges.json` passes its asserts.
   - `npm test` passes.
