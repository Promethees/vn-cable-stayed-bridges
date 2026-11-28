# 3D model review: round 10, Cầu Cát Lái (`cau-cat-lai`), 2026-11-28

The user asked for another review. **The pylon is topologically wrong.**

The model puts two thin legs in the **median, inside the deck**: ±9.5 m at deck level, touching at 44 m, with an eye and a rounded crown at 117 m. The deck runs *outside* them. The official design is TEDI's competition entry **SD01, "Vươn tầm cao mới"** (first prize, approved by UBND Đồng Nai on 26/1/2026). Its pylons are the **"giọt nước" (water drop)**, and the deck passes **between** the legs:

- **At deck level** the two blade legs stand just **outside the deck edges**. A deep beam with an arched soffit carries the girder between them.
- **Below the deck** the legs bow outward and sweep together into a **round-bottomed loop** on one footing. This is the belly of the drop, and the most recognisable feature in every render.
- **Above the deck** the legs converge to a **waist at ≈0.6 of the above-deck height**, joined by a web with an arched soffit. They continue as two close parallel blades around a **tall slot**, are tied by a **short link with an arched soffit** near the top, and end in **two separate tips flaring slightly apart**. There is no crown, so the `crown: "rounded"` must go.
- **Stays**: two inclined planes, semi-fan, from the slot section to the deck edges. White stays, white pylons.

**No client-confirmed conflict.** No Cát Lái value in `gen_bridges.py` is marked client-confirmed.

**No competing design schemes, but two caveats.**

- **Round 1 mix-up.** The "song kiếm hợp bích" (twin swords) description belongs to **Long Hưng**, not Cát Lái. Round 1 already assigned it there correctly. The press mixes the two bridges (one search digest attributes Long Hưng's 175 m / 37 m to Cát Lái), so their numbers must not be crossed.
- **Older pre-feasibility scheme.** A 2025 report describes a **PC concrete box by balanced cantilever** and a 33.5 m deck. The 2026 design press (1thegioi, Dân Trí, groundbreaking 29/9/2026) says **"dầm thép liên hợp kháng gió động"** (composite steel girder). Composite is kept.

Reference images are in scratchpad `ref/cl/` (`/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/ref/cl/`):

| File | What it is |
|---|---|
| `vne3.jpg` | VnExpress 29/1/2026 (Sở XD Đồng Nai render), **close-up of one pylon**: loop below the deck on a plinth, under-deck arched beam, waist web with arched soffit, slot, top link, two tips. **Primary form reference** |
| `tt2.jpg`, crop `tt2_crop.png` | Tuổi Trẻ 1/2026, deck-level view **along the axis**: waist at ≈0.56–0.60 H, slot to ≈0.85 H, link at 0.85–0.89 H, tips flaring. Legs land at the deck edges. 6 + 2 lanes with a central barrier. **Primary above-deck proportion reference** |
| `bxd_2-1769673843290160434896.png`, crops `bxd2_left.png`, `bxd2_right.png` | Báo Xây dựng 1/2026, **near side elevation** at sunset. **Primary height / deck-level reference** (§1.2) |
| `tt1.jpg` (= `mtg1.jpg` at a larger crop), crops `tt1_crop.png`, `mtg1_crop.png`, `mtg1_side.png` | Tuổi Trẻ / 1thegioi groundbreaking render 9/2026, three-quarter view. **Twin-column auxiliary pier inside each side span**, end pier, approach piers. Deck crest |
| `bxd_3-…png` | Night render, oblique; loop and blades |
| `bxd_1-…png` | Oblique day render from the bank |
| `bdn2.jpg` | Báo Đồng Nai, axis view (same as tt2) |
| `vne1.jpg`, `bdn6.jpg` | Aerial (alignment, 2 pylons in the river) |

Renders:
- **Current model:** scratchpad `views-cl/`.
- **Prototype of the target:** scratchpad `clwork/r2/`, with views `front`, `side`, `foot`, `top`, `three_quarter`, `custom-az70-el5-pylon0`, `custom-az88-el1-pylon0` and `custom-az35-el6-unit`; also `clwork/r1/custom-az8-el2-unit`. It was rendered from a scratch copy of the repo (`clwork/repo`); the project itself is untouched. The exact JSON is in `clwork/target.json` and the script that applies it is `clwork/target.py`. Generation passes (after the G15 assertion change in §3.2) and the render shows no warnings.

Confidence tags: **[C]** confirmed by a source · **[P]** measured on renders · **[E]** estimated.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Design | TEDI, competition entry SD01 "Vươn tầm cao mới", first prize, approved 26/1/2026 (some reports say 29/1) | [C] | [VnExpress EN](https://e.vnexpress.net/photo/traffic/vietnam-unveils-794m-cable-bridge-design-linking-ho-chi-minh-city-to-long-thanh-airport-corridor-5015145.html), [Báo Đồng Nai](https://baodongnai.com.vn/kinh-te/ha-tang-du-an/202601/chum-anh-kien-truc-cau-cat-lai-voi-y-tuong-vuon-tam-cao-moi-e6509d9/) |
| Pylon form | "Hai trụ tháp chính … lấy cảm hứng từ **giọt nước**, kết hợp đường nét mềm mại" (two main pylons inspired by a water drop, with soft lines). Geometry in §1.1 | [C] form, [P] geometry | [Dân Trí 29/9/2026](https://dantri.com.vn/thoi-su/dong-nai-khoi-cong-2-cau-noi-tphcm-gan-37000-ty-dong-20260929111134692.htm), [1thegioi](https://1thegioi.vn/cau-cat-lai-va-cau-long-hung-cong-nghe-gap-ngon-ngu-kien-truc-258897.html), [nhipsongkinhdoanh](https://nhipsongkinhdoanh.vn/cau-cat-lai-va-long-hung--phuc-tap-ra-sao-ve-mat-ky-thuat-33595.htm) |
| Spans | **190 + 450 + 190 = 830 m**, continuous cable-stayed | [C] | [cafeland 150238](https://cafeland.vn/tin-tuc/toan-canh-noi-xay-cau-cat-lai-sau-dong-tho-khu-vuc-nay-dang-ra-sao-150238.html), [tapchicongthuong](https://tapchicongthuong.vn/dong-nai--dong-tho-du-an-cau-cat-lai--mo-ra-khong-gian-phat-trien-moi-400579.htm); main span 450 m in all 2026 reports |
| Auxiliary piers | A **twin-column pier inside each side span**, ≈115–130 m from the pylon, so ≈60–75 m from the unit end. Seen in the 9/2026 groundbreaking render. Not visible in the blurry 1/2026 sunset elevation (bxd_2) | [P], low | mtg1_side.png (perspective solve, approach spacing 50–70 m) |
| Navigation | ≥ **230 × 55 m**, 60,000 DWT container ships | [C] | cafeland, Dân Trí, Thanh Niên |
| Deck | **33.5 m** cross-section on the main bridge. 8 lanes (6 motor + 2 non-motorised), 80 km/h, central barrier | [C] | [cafeland 152342 (Đồng Nai HĐND adjustment, 6/2026)](https://cafeland.vn/tin-tuc/quy-mo-moi-cua-cau-cat-lai-noi-tphcm-voi-dong-nai-vua-duoc-dieu-chinh-152342.html); tt2. **37 m is Long Hưng** |
| Girder | **Composite steel girder, wind-resistant ("kháng gió động")**. Renders show a streamlined box, ≈3.5 m deep [E]. The older pre-FS scheme was PC balanced cantilever (superseded) | [C] | 1thegioi, Dân Trí; tapchicongthuong (old) |
| Stays | **2 planes** [C]. Semi-fan from the slot section (≈0.62–0.88 of the above-deck height). Dense: ≈22 per side per plane [E]. White | [C] planes, [P]/[E] rest | Tuổi Trẻ, Báo Xây dựng; renders |
| Pylon height | **Not published.** About **175 m** above water, measured on the side elevation (§1.2), ±8 m | [P] | bxd_2 |
| Deck level | ≈50 m at the unit ends, ≈58 m at the pylons, ≈62 m at mid-span. Clear crest in every render | [P] | bxd_2, mtg1 |
| Foundations | "hệ móng cọc siêu sâu" (ultra-deep piles). A low chamfered plinth just above the water is visible under each pylon | [C] piles, [P] plinth | 1thegioi; vne3 |
| Lengths / cost | Project 11.6 km; main bridge + approaches ≈3.5–3.65 km. Cost adjusted from 20,614 to **24,003 tỷ** (HĐND 11/6/2026); sub-project 2 (bridge, PPP-BT) ≈14,920 tỷ | [C] | cafeland 152342, Dân Trí |
| Investor / status | CC1-led JV (project company CC1 Cát Lái). **Groundbreaking (động thổ) 15/1/2026; construction start (khởi công) of sub-project 2 on 29/9/2026.** Completion 2029 (some say end-2028). No pylon or pile progress reported by 11/2026 | [C] | Tuổi Trẻ, Dân Trí, nhipsongkinhdoanh |
| Wind tunnel | Tests in the USA and Denmark | [C] | nhipsongkinhdoanh |

### 1.1 Pylon geometry (from vne3 / tt2 / tt1)

Frame: pylon-local, x along the bridge, y up from E (= 50), z across.

Engine note: crestAt(pylon) = 11 × (1 − (225/415)²) = 7.77. Points above local 0 are lifted by 7.77. Points below are stretched by 1 + 7.77/50 = 1.155, so real height above water = (y + 50) × 1.155.

| Element | Observation | Model value (local) |
|---|---|---|
| Legs at deck | Legs just outside the deck edges. The deck (±16.75) passes between them. Axis view: c/c at deck ≈ 0.30 × the above-deck height | z ±19.5 at y 0 (inner face ≈ ±16.9) |
| Loop below deck | Legs bow out to ≈1.2 × the deck-level c/c about 40 % of the way down, then sweep in. Inner opening bottom ≈10 m above water. Solid knot on a low plinth (in the render the legs cross/twist there) | (−10, ±21.5), (−20, ±22), (−30, ±19), (−38, ±13), (−43, ±7), (−46, ±2.5). Base panel fills the knot up to −40.6 |
| Under-deck beam | Deep beam under the girder, arched soffit haunched into the legs | panel top −3.5, soffit −7 at the centre, −13 at the legs, 7 m along x |
| Upper legs | Straight-ish convergence, curving to vertical by the waist | (20, ±15.5), (40, ±10.5), (56, ±6.5), (68, ±4.8) |
| Waist web | Arched soffit apex at 0.56 H; slot bottom (round) at 0.60 H | panel: soffit 57 → 65.5 apex; top 70 at the centre (round slot bottom) |
| Slot | Clear width ≈ leg width (≈4 m), 0.60–0.85 H | legs ±4.6 from 84 to 100 |
| Top link | 0.85–0.89 H, arched soffit, notched top between the tips | panel: soffit 94 → 99.5, top 103.6 at the centre, 107 at the legs |
| Tips | Two separate blades flaring outward, square-cut | (108, ±5.8), (117, ±7.2). **No crown** |
| Section | Blades, deeper along x than across | across 6 → 4, along 9 → 6 |
| Anchors | Slot section | y 74 → 103 on both legs |
| Plinth | Low, wide, chamfered, just above the water | `pile_cap` 30 × 36, top −48.3 (real +2.0 m), 4 thick |

### 1.2 Measurements on the side elevation (bxd_2)

- **Scale.** Pylons are 467 px apart for 450 m, and each side span is ≈199 px for 190 m, giving ≈1.04 px/m.
- **Water to tip** ≈ 184 px = **177 m**.
- **Deck top** ≈ 58.7 m at the pylon, ≈50 m at the unit-end pier, ≈62.5 m at mid-span.
- **Cross-checks.** In vne3 the deck/total ratio is 0.322; in tt1 it is 0.33. With the deck at ≈57.8 m, both imply ≈175–180 m.
- **Rounding.** I use **175** (round, ±8). It is unrelated to Long Hưng's published 175 m.

## 2. Current vs reality

| P | Problem | Current | Expected |
|---|---|---|---|
| **P0** | Legs in the median **inside the deck**, deck outside them. Legs touch at 44 m, rounded crown. Nothing below the deck except two thin stubs to −40 | shape file `pylon_custom` | Water-drop pylon of §1.1: legs straddle the deck at ±19.5, loop below the deck, waist web, slot, top link, two separate tips (§3.1) |
| **P0** | `crown: "rounded"` (shape file and PHASE6 l.830) | | Remove both (tips do not meet) |
| P1 | Deck width 38 | | **33.5** [C] |
| P1 | No deck elevation or crest; deck depth derived. The deck sits ≈45 m high with no crest | | `deck_elevation_m 50`, `deck_crest_m 11`, `deck_depth_m 3.5` → 57.8 at the pylons, 61 at mid-span ≥ 55 + 3.5 + 1 = 59.5 (no warning) |
| P1 | Height 170 | | **175** (label = tip 117 + 50 + 7.77 = 174.8) |
| P1 | Stays fan from 62–110 on the legs; teal default colour | | `semi_fan`, anchors 74–103, `cables_per_side 22`, `stay_colour "white"` |
| P1 | No under-deck beam panel, no plinth | `crossbeams_y_m [-3]` | Panels per §3.1. **Drop `crossbeams_y_m`** |
| P2 | No auxiliary piers | | `auxiliary_piers_m [70, 760]` [P, low] |
| P2 | Stay deck ranges derived | | `back_stay_deck_m [22, 186]`, `main_stay_deck_m [22, 218]` (G15, needs the opt-in assertion change) |
| P2 | Texts: `pylons` "twin-leg … rounded arch ≈170 m"; seed has no `width_m` / `span_arrangement`; cost/sources/notes stale; `review`/`checklist` in the shape file | | §3.2 / §3.3 |

## 3. Data changes

### 3.1 Target `model3d`

This replaces the shape file's `model3d`; it is identical to scratchpad `clwork/target.json`.

```json
{
  "spans_m": [190, 450, 190],
  "auxiliary_piers_m": [70, 760],
  "pylon_shape": "other",
  "pylon_heights_m": [175, 175],
  "pylon_height_ref": "total",
  "deck_elevation_m": 50, "deck_crest_m": 11, "deck_depth_m": 3.5,
  "cable_planes": 2,
  "cable_pattern": "semi_fan",
  "cables_per_side": 22,
  "back_stay_deck_m": [22, 186],
  "main_stay_deck_m": [22, 218],
  "deck_width_m": 33.5,
  "deck_type": "composite",
  "pylon_colour": "white",
  "stay_colour": "white",
  "confidence": "estimated",
  "notes": "TEDI design SD01 (competition 1st prize, approved 26/1/2026). Spans 190 + 450 + 190 m, ≥230 × 55 m clearance (Báo Đồng Nai / cafeland). Deck 33.5 m, 8 lanes, composite steel girder (Đồng Nai 6/2026 scale; 1thegioi / Dân Trí). 'Water drop' pylons read from the official renders. Pylon ≈175 m above water, deck ≈58 m at the pylons and ≈61 m at mid-span, auxiliary pier ≈120 m from each pylon and 22 stays per side per plane are measured or estimated from renders.",
  "pylon_custom": {
    "description": "'Water drop' (giọt nước) pylon, TEDI competition design SD01: two blade legs stand just outside the deck edges at deck level; below the deck they bow outward and sweep together into a round-bottomed loop on a single footing (the belly of the drop); a deep beam with an arched soffit carries the deck between the legs. Above the deck the legs converge to a waist at ≈0.6 of the above-deck height, joined by a web with an arched soffit, run up as two close parallel blades around a tall slot (eye), are tied by a short link with an arched soffit near the top and end in two separate tips flaring slightly apart. Two inclined stay planes from the slot section to the deck edges.",
    "legs": [
      {"centerline": [[0,-46,-2.5],[0,-43,-7],[0,-38,-13],[0,-30,-19],[0,-20,-22],[0,-10,-21.5],[0,0,-19.5],[0,20,-15.5],[0,40,-10.5],[0,56,-6.5],[0,68,-4.8],[0,84,-4.6],[0,100,-4.8],[0,108,-5.8],[0,117,-7.2]],
       "width_base_m": 6.0, "width_top_m": 4.0, "depth_base_m": 9.0, "depth_top_m": 6.0},
      {"centerline": [[0,-46,2.5],[0,-43,7],[0,-38,13],[0,-30,19],[0,-20,22],[0,-10,21.5],[0,0,19.5],[0,20,15.5],[0,40,10.5],[0,56,6.5],[0,68,4.8],[0,84,4.6],[0,100,4.8],[0,108,5.8],[0,117,7.2]],
       "width_base_m": 6.0, "width_top_m": 4.0, "depth_base_m": 9.0, "depth_top_m": 6.0}
    ],
    "panels": [
      {"top": [[-19,-3.5],[19,-3.5]],
       "bottom": [[-19,-13],[-16,-9],[-10,-7.4],[0,-7],[10,-7.4],[16,-9],[19,-13]],
       "depth_m": 7.0},
      {"top": [[-5.5,76],[-4.6,73],[-3.5,71.2],[-2,70.3],[0,70],[2,70.3],[3.5,71.2],[4.6,73],[5.5,76]],
       "bottom": [[-5.5,57],[-4.5,61.5],[-3,64.3],[0,65.5],[3,64.3],[4.5,61.5],[5.5,57]],
       "depth_m": 6.0},
      {"top": [[-5.5,107],[-4.6,105],[-2.5,104],[0,103.6],[2.5,104],[4.6,105],[5.5,107]],
       "bottom": [[-5.5,94],[-4.6,97],[-3.5,98.6],[-2,99.3],[0,99.5],[2,99.3],[3.5,98.6],[4.6,97],[5.5,94]],
       "depth_m": 5.5},
      {"top": [[-9,-44.5],[-6.5,-42.2],[-3.5,-41],[0,-40.6],[3.5,-41],[6.5,-42.2],[9,-44.5]],
       "bottom": [[-9,-48.3],[9,-48.3]],
       "depth_m": 9.0}
    ],
    "pile_cap": {"length_x_m": 30, "width_z_m": 36, "top_y_m": -48.3, "thickness_m": 4, "rounded_ends": false},
    "anchor_zone": [
      {"y_from_m": 74, "y_to_m": 103, "leg": 0},
      {"y_from_m": 74, "y_to_m": 103, "leg": 1}
    ],
    "mirror_for_other_pylons": true,
    "reference_images": [
      "https://i1-vnexpress.vnecdn.net/2026/01/29/gen-h-z7480267914791-aca5fbb4a84f33cf6c6299b10ddb3b1b-1769679190.jpg",
      "https://cdn2.tuoitre.vn/471584752817336320/2026/1/29/cau-cat-lai-3-1769696367163316351776.jpg",
      "https://cdn2.tuoitre.vn/471584752817336320/2026/9/29/phoi-canh-cau-cat-lai-1-17906548892801634837356.jpg",
      "https://baoxaydung.mediacdn.vn/603483875699699712/2026/1/29/2-1769673843290160434896.png"
    ]
  }
}
```

Notes on the JSON:

- **Label.** tip + E + crestAt(190) = 117 + 50 + 7.77 = **174.8 → "175 m"**.
- **Clearance.** E + crest = 61 ≥ 55 + 3.5 + 1 = 59.5, so there is no raise and no warning. End grade = 2 × 11 / 415 = 5.3 %. That is steep, but the renders show a marked crest; 9–10 would also be acceptable if the engineer wants a gentler grade, as long as E + crest ≥ 59.5.
- **Below the deck.** Real height = (y + 50) × 1.155. The plinth top at −48.3 is at +2.0 m. The inner loop bottom (≈ −40.6) is ≈ 11 m above the water, matching vne3.
- **Panels in place of `crossbeams_y_m`.** Do **not** add `crossbeams_y_m`, or a straight bar would cut the under-deck arch.
- **Panel ends** (±19 / ±5.5 / ±9) sit inside the legs, so the joints close.
- **No `crown`.** The tips are 14.4 m apart, so the crown logic does not trigger. The key must be absent (assert it).
- **Under construction.** The deck is drawn as balanced cantilevers (status convention). **Do not set `deck_closed`**: nothing is built yet.

### 3.2 Generator (`scripts/gen_bridges.py`) and shape file

- **`research/shapes/cau-cat-lai.json`.**
  - Replace `model3d` with §3.1.
  - `pylons_vi`: "2 tháp hình giọt nước: hai chân ôm mặt cầu, khép thành vòng tròn dưới mặt cầu, thu lại trên cao thành hai lưỡi song song có khe, hai đỉnh tách; cao ≈175 m (ước tính)".
  - `pylons_en`: "2 'water drop' pylons: legs straddle the deck, loop together below it on one footing, and narrow above into two slotted parallel blades with separate tips; ≈175 m (estimated)".
  - Rewrite `review` / `checklist` accordingly. For example: legs at deck "fixed (outside the deck edges; deck between the legs)", head "fixed (slot + top link + two tips, no crown)", foot below deck "fixed (drop-shaped loop on a plinth)".
  - `notes`: "Official renders (VnExpress / Tuổi Trẻ / Báo Xây dựng, 2026)".
- **PHASE6 l.830.** **Delete** `"cau-cat-lai": {"pylon_custom": {"crown": "rounded"}},`.
- **l.243 `add(...)`.**
  - Add `width_m=33.5` and `span_arrangement="190 + 450 + 190 m"`.
  - `pylons=` the VI text above, plus a `pylons_en=` key if the `add` signature carries it. Otherwise the shape file provides it.
  - `cost="≈24,000 tỷ VND (24,003 tỷ after the 6/2026 adjustment; bridge sub-project ≈14,920 tỷ, PPP-BT)"`.
  - `investor="Liên danh CC1 (doanh nghiệp dự án CC1 Cát Lái); thiết kế TEDI"`.
  - Add sources: Dân Trí 29/9/2026, Tuổi Trẻ 29/9/2026, 1thegioi, Báo Đồng Nai 1/2026, cafeland 152342.
  - Notes: "Groundbreaking (động thổ) 15/1/2026; construction of the bridge sub-project started 29/9/2026, completion 2029. TEDI design 'Vươn tầm cao mới' (SD01, competition 1st prize, approved 26/1/2026): two 'water drop' pylons. Main bridge 190 + 450 + 190 m, 33.5 m, 8 lanes, composite steel girder (an older pre-feasibility scheme had a PC box built by balanced cantilever). Total 11.6 km includes the approach roads (bridge + approaches ≈3.65 km). 55 m clearance. Pylon height not published (≈175 m from renders; 175 m / 37 m / 'twin swords' in some articles are Long Hưng's). Coordinates are the OSM proposed alignment."
- **l.444 `M3D`.** Keep consistent: `m3d([190, 450, 190], "other", [175, 175], "total", 2, "semi_fan", 33.5, "composite", cps=22, notes=…)` (the shape file wins anyway).
- **l.483 `PRESS`.**
  - Add `press("https://i1-vnexpress.vnecdn.net/2026/01/29/gen-h-z7480267914791-aca5fbb4a84f33cf6c6299b10ddb3b1b-1769679190.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=5QSvcQadK4N2YWCVCd6nSw", "VnExpress (Sở Xây dựng Đồng Nai render)", <VnExpress EN url>, "render (pylon close-up)")`.
  - Add `press("https://cdn2.tuoitre.vn/thumb_w/730/471584752817336320/2026/9/29/phoi-canh-cau-cat-lai-1-17906548892801634837356.jpg", "Tuổi Trẻ", "https://tuoitre.vn/khoi-cong-cau-cat-lai-va-cau-long-hung-noi-dong-nai-voi-tphcm-100260929111812275.htm", "render (groundbreaking 9/2026)")`.
- **G15 assertion (~l.1240).** `assert b["id"] == "cau-phuoc-an" or not ({"deck_closed", "main_stay_deck_m"} & set(m))` must allow `main_stay_deck_m` for `cau-cat-lai` (but not `deck_closed`). As in the prototype:
  ```python
  G15_OK = {"cau-phuoc-an", "cau-cat-lai"}   # G15 main_stay_deck_m opt-in
  assert b["id"] in G15_OK or "main_stay_deck_m" not in m, (b["id"], "G15 opt-in")
  assert b["id"] == "cau-phuoc-an" or "deck_closed" not in m, (b["id"], "G16 opt-in")
  ```
  Alternatively, drop `main_stay_deck_m` from §3.1: the engine default lands at ≈18 → 225, which is visually close. Either is acceptable.
- **Optional regression check.** Add `EXPECT_R1["cau-cat-lai"] = {"deck_width_m": 33.5, "cables_per_side": 22, "deck_elevation_m": 50}`, plus an assertion that `"crown" not in m["pylon_custom"]` and that the leg z at y = 0 is ≥ 17 (legs outside the deck).
- **NAV (l.643).** Unchanged.

## 4. Engine gaps

**None.** The prototype uses existing features only: legs with depth, G13 panels, `pile_cap`, `deck_elevation_m` / `deck_crest_m` / `deck_depth_m`, G11 `back_stay_deck_m` and G15 `main_stay_deck_m`. The only code change is the generator assertion.

Cosmetic, P2, do not block:

- **Twisted base.** In the render the two legs cross and twist into each other at the base. The base panel approximates it as a rounded knot.
- **Twin-column auxiliary piers.** They are drawn as the engine's standard single pier.

## 5. Acceptance criteria (I will re-render)

Cameras:

- `--views front,side,foot,top,three_quarter`
- **`--az 70 --el 5 --target pylon0`**: compare with `vne3.jpg`.
- **`--az 88 --el 1 --target pylon0`**: compare with `tt2_crop.png` / `bdn2.jpg`.
- `--az 35 --el 6 --target unit`: compare with `tt1.jpg`.
- `--az 8 --el 2 --target unit`: compare with `bxd_2`.

Criteria:

1. **Topology (P0).** The deck passes **between** the legs. Leg centres are at ±19.5 at deck level (inner faces outside ±16.75). Nothing stands in the median.
2. **Below the deck.**
   - A closed, round-bottomed loop (legs bow out to about ±22, then meet) on a low plinth just above the water.
   - The under-deck beam has an arched soffit.
   - No straight crossbeam bar.
3. **Above the deck.**
   - The legs converge to a waist web with an arched soffit (apex ≈65.5, slot bottom 70).
   - A tall slot runs from 70 to ≈99.5.
   - A top link with an arched soffit, notched top.
   - **Two separate tips** at 117, ≈14 m apart c/c. **No rounded or any crown.**
4. **Height.**
   - Label **175 m**.
   - Deck ≈57.8 at the pylons, 61 at mid-span, with a visible crest in the side view.
   - No clearance warning.
5. **Stays.**
   - White, 2 inclined planes, semi-fan from y 74–103 on each leg to the deck edges, 22 per side per plane.
   - Back stays land 22–186 m from the pylon; main stays 22–218 m.
6. **Piers and data.**
   - Auxiliary piers at 70 / 760.
   - Deck 33.5 m.
   - No `crown` key; PHASE6 line removed.
   - Texts, sources and notes updated.
   - `python3 scripts/gen_bridges.py data/bridges.json` passes, `npm test` passes, and no other bridge changes.

## 6. Open points (no user decision needed)

- **Pylon height** is unpublished. 175 ± 8 m is measured on renders. If an official figure appears, re-solve the tip: tip = H − 50 − 7.77.
- **Auxiliary pier position** is from a perspective solve of one render ([P], ±15 m). The older 1/2026 elevation shows none, so it could be dropped (P2) if the user prefers that render.
- **Stay count** of 22 per side per plane is [E]. The renders show a dense, uniform fan.
- **Girder.** Composite per the 2026 press. If the feasibility study turns out to keep the PC box, only `deck_type` changes.
