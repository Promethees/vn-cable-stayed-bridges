# 3D model review: round 12, Cầu Cửa Hội (`cau-cua-hoi`), 2026-11-28

The user says the model needs revision. Round 1 only added white pylons, red stays and a harp pattern. Everything was re-verified from scratch against press photos: a side-on construction elevation (VTV), a completed low oblique view (Người Quan Sát), and drone stills (Ngôi Sao / VnExpress, Tiền Phong / CafeBiz). The current model differs from the real bridge as follows:

1. **The pylon is not a plain 18 m mast.** It is a **lotus-bud pylon ("búp sen")**:
   - a white concrete shaft in the median, rising ≈19 m above the deck and widening slightly upward;
   - a bud, ≈6 m across, that closes to a point at **≈29 m above the deck** (kinhtedothi 12/2019: "khoảng 25/29 m tháp"; side photos ≈28–29 m);
   - a pink-red tip with a small finial.
2. **The deck is too low and is drawn flat.** The deck is ≈28 m above the water at the pylons, with a slight crest. It must clear the **24.5 m** navigation clearance, which is published but missing from the model. The girder is a haunched PSC box: ≈5 m deep at the pylons and ≈3 m at mid-span.
3. **The stays are not a harp.** They form one central plane of **11 red stays per side** (each one a pair of strands). They anchor on the shaft between ≈7 and 18.5 m above the deck and land 14–58 m from the pylon. The slopes run from ≈0.32 (outer) to ≈0.5 (inner), so the pattern is a semi-fan, not parallel.
4. **There is no pier and no pile cap.** Below the deck there is a rectangular pier (≈6 × 8 m) standing on a chamfered pile cap (≈12 × 23 m) just above the water.

**Flag: no client-confirmed value is contradicted.** `gen_bridges.py` has no `client-confirmed` marker for this bridge. Two other points:

- **Brief vs sources: the user's brief says "completed 2023".** Every source gives **opening 14/3/2021** (temporary use from 6/2/2021; closure 13/10/2020; ground-breaking 15/2/2019). The only 2023 event is the **approval of the decorative lighting** (VnExpress 17/8/2023, Tuổi Trẻ 18/8/2023: 65 tỷ for lighting the pylons, the "búp sen đỉnh tháp" and the stays). Keep `opened=2021`. Mention the 2023 lighting in the notes. Do not change the year unless the user confirms.
- **Round-1 values kept:** spans 86 + 153 + 86 and width 18.5 [C]; white pylons and red stays [C]. The pylon height was "unpublished, keep 18 m [E]". It is replaced by **29 m** (kinhtedothi plus photos).

Confidence tags: **[C]** confirmed by a source · **[P]** measured on photos · **[E]** estimated.

## 0. References

All files are in `scratchpad/ref/ch/`. The session scratchpad is `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/`. The images are comparison material only; their licences are unknown.

| File | What it is | Used for |
|---|---|---|
| `vtv.png` (1200×675) | VTV, construction 2020: **near-true side elevation** of the whole unit. The left pylon is finished up to a temporary pointed cap; the right is still in scaffolding. | Span scale (153 m = 477 px → 3.12 px/m), pylon/deck heights, stay fan, haunch. Zooms: `vtv_left.png`, `vtv_right.png`, `vtv_stays.png` |
| `nq1.jpg` (1326×836) | Người Quan Sát 2025, **completed bridge**, low oblique from the shore. Near pylon on the right. | Bud shape, colours, pier, cap, crest, haunch. **Camera match: az 30, el 1** |
| `nq2.jpg` | The same source, road-level view | Bud and stays from the deck |
| `ns1.jpg`–`ns12.jpg` | Ngôi Sao / VnExpress 12/2020, drone stills | `ns1`: pier and chamfered cap (zoom `ns1_p.png`). `ns2`: elevated elevation with both pylons; stay count (zoom `ns2_fan.png`). `ns4`: bud under scaffolding, fan of paired stays. `ns5`: stay anchors in the box (pairs). `ns7`: **top view** of the pylon (deck 18.5 m = 390 px; bud ≈6 m; paired stays; cap protruding ≈2 m beyond the deck edges) |
| `cb0.jpg`–`cb8.jpg` | Tiền Phong / CafeBiz 2/2021, aerials | `cb0`, `cb1`, `cb7`: red single-plane fans. `cb3`: bud from the road |
| `kt0.png`–`kt9.png` | Kinh tế & Đô thị, 12/2019 construction | `kt2`, `kt9`: pier and cap before the deck |
| `s1.png`–`s6.png` | Contact sheets | |

Current-model renders are in `views-ch/`. The target was prototyped in a scratch copy of the repo (`chwork/repo`); the project itself is untouched:

- **Renders:** `chwork/r3/`, the final target (vivid). `chwork/r1/` holds the standard views with muted stays.
- **Side-by-side comparison:** `chwork/cmp.png`.
- **Exact target `model3d`:** `chwork/target_shape_model3d.json`.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Type | Extradosed: prestressed-concrete continuous box girder, balanced cantilever, stays from a lotus-bud tower ("dây văng đúc hẫng cân bằng Extradosed") | [C] | infra.global, VietnamPlus/TTXVN, CafeBiz |
| Spans | **86 + 153 + 86 m** (325 m unit). 153 m was the longest extradosed span in VN at opening | [C] | infra.global. The 153 m figure is also in VnExpress, Ngôi Sao, CafeBiz and Người Quan Sát |
| Designer / client | **TEDI** / Ban QLDA 6 (Bộ GTVT) | [C] | infra.global, VnExpress |
| Bridge length | **1,728 m** (main bridge incl. approaches); the route is 5.271 km | [C] | VTV, Kinh tế & Đô thị, vi.wikipedia |
| Width / lanes | **18.5 m** main bridge, 16 m approaches; 2 motor + 2 mixed lanes; 80 km/h | [C] | VTV, CafeBiz |
| Approaches | Super-T girders (85 girders, 22 piers per Ngôi Sao; "37 nhịp" per KT&ĐT) | [C] | infra.global, Ngôi Sao |
| Navigation | **120 × 20.5 m; 24.5 m within 40 m either side of the channel centreline**; 2,000 DWT | [C] | VTV 14/3/2021, Người Quan Sát |
| Pylons | 2 concrete columns topped by a lotus bud ("hai cột bê tông tạo hình chóp búp sen"); the stays anchor in the column | [C] | Ngôi Sao, VietnamPlus, Người Quan Sát |
| Pylon height | **≈29 m** above the deck to the bud tip ("2 trụ chính … đúc hẫng đến K6, khoảng 25/29 m tháp"), plus a ≈2 m finial | [C]/[P] | Kinh tế & Đô thị 24/12/2019. Side photo (vtv): 28 m to the temporary top, before the bud |
| Stays | Red, **one central plane**, 11 positions per side per pylon, each a **pair** of strands ≈1 m apart (`ns5`, `ns7`); sheath Ø15 cm; anchored in a maintenance gallery inside the box | [C] Ø15 / [P] count | Ngôi Sao; `ns2` peak count (11 left, 11 right) |
| Cost | 950 tỷ VND; decorative lighting > 65 tỷ approved 8/2023 | [C] | VTV, VnExpress 17/8/2023 |
| Dates | Ground-breaking 15/2/2019; closure 13/10/2020; temporary use 6/2/2021; **opened 14/3/2021** | [C] | Wikipedia, VnExpress, VTV |

## 2. Measurements (photos)

**Side elevation (`vtv.png`, 3.12 px/m from the 153 m span).**

| Item | px | m |
|---|---|---|
| Left pylon top (temporary cap, bud not yet built) | y 306 | 28.2 m above the deck |
| Deck top at the left pylon | 394 | — |
| Water at the left pylon | 470 | Deck **24.4 m** above that day's water |
| Deck top / water at the right pylon | 391 / 472 | **26 m** |
| Girder depth at the right pylon | 16 px | **5.1 m** |
| Girder depth near the closure | 9 px | **2.9 m** |
| Pier width along the bridge, below the deck | 18 px | **5.8 m** |
| Stay anchors on the pylon | 20–56 px above the deck | **6.4–18 m** |
| Deck anchors from the pylon | 36–59 px … 182 px | Inner **11.5–18 m**, outer **58 m** (both sides) |

**Drone elevation (`ns2.jpg`).** Anchors span 0.25–0.64 of the pylon height (bud tip), i.e. 7.1–18.6 m with H = 29. A red-peak count on columns just left and right of the pylon gives **11 stays per side**.

**Completed oblique (`nq1.jpg`).** Pylon above the deck ≈ 210 px and deck above the cap top ≈ 200 px, so the ratio is ≈1.05. Taking `vtv` and `ns2` into account as well, the ratio is ≈1.05–1.2. The bud:
- starts to swell at ≈0.62 H (18 m);
- is fullest at ≈0.78–0.85 H (22.5–24.5 m), ≈1.6× the shaft width;
- closes to the tip at 29 m.

The pink tip is the top ≈1.7 m, and the finial adds ≈2 m.

**Top view (`ns7.jpg`, 21 px/m at the deck).**
- The bud is ≈6 m in diameter.
- The paired stay lines are ≈1 m apart.
- The pile cap shows ≈2 m beyond each deck edge as chamfered hexagons. The cap is therefore ≈23 m across the bridge, and the chamfers make it narrow at the ends.

`ns1` shows an elongated octagonal cap with its long axis across the bridge (≈2 : 1).

**Heights.** I adopted:
- **E = 26.0** at the unit ends and **crest 2.6 m**;
- crest at the pylons = 2.6 × (1 − (76.5/162.5)²) = 2.02, so the **deck at the pylons is 28.0 m** and at **mid-span 28.6 m**;
- navigation check: 26.0 + 2.6 = 28.6 ≥ 24.5 + 3.0 + 1 = 28.5. This passes, so E is not raised and there is no warning (verified).

The photos give 24.4–26 m above that day's water at the pylons (vtv) and ≈27–30 m (nq1 ratio). The 28 m used is inside that range and is the minimum that fits the published 24.5 m under a 3 m girder. The tip is at 28.0 + 29 = **57 m above the water**.

**Cap in local y.** Below the deck, local y is folded by (1 + 2.02/26) = 1.0778 (see brief-r10-thuan-an §4). A cap top 2.5 m above the water is therefore at local **−23.7** (2.5/1.0778 − 26). Do not "correct" it.

## 3. Current model vs reality (prioritised)

| P | Field | Current | Target | Conf |
|---|---|---|---|---|
| P0 | `pylon_custom` | none (built-in `single` mast) | Lotus-bud shaft + bud + pink tip, pier below the deck, chamfered cap. JSON in §4 | [C] form / [P] dims |
| P0 | `pylon_heights_m` | [18, 18] | **[29, 29]** above the deck | [C]/[P] |
| P0 | `deck_elevation_m` / `deck_crest_m` | none (heuristic, flat) | **26.0 / 2.6** (28.0 at the pylons, 28.6 at mid-span) | [P]+[C] |
| P0 | `nav_clearance` | none | **`nav(24.5, 80, …, VTV)`** | [C] |
| P0 | stays | `harp`, default count | **`semi_fan`, `cables_per_side: 11`, anchor zone 7–18.5 m on the shaft, `main_stay_deck_m` = `back_stay_deck_m` = [14, 58]** (G15 allow-list) | [P] |
| P1 | girder | default depth (3.6 m for extradosed), no haunch | **`deck_depth_m: 3.0`, `deck_haunch: {5.0, 60}`** (G17 allow-list) | [P] |
| P1 | colours | white / "red" (muted, faint 1-px lines) | white pylon, pink-red tip (leg colour), **stays `#d0313d` with `colour_mode: "vivid"`** (VIVID_OK). The red stay curtain is the bridge's signature in every photo; muted red nearly vanishes | [C] |
| P1 | seed text | "2 low single-column pylons (extradosed), red stays"; notes say 153 m is "single source … borderline" | §6 | [C] |
| P2 | seed fields | no `total_length_m` / `lanes` / `cost` / `investor` | `total_length_m=1728`, `lanes=4`, `cost="950 tỷ VND"`, `investor="Ban QLDA 6 (Bộ GTVT)"` | [C] |
| P2 | sources / images | 3 sources, 1 image | add VTV, Ngôi Sao, CafeBiz/Tiền Phong, Kinh tế & Đô thị, Người Quan Sát, VnExpress (lighting), Wikipedia. Images: §6 | [C] |
| P2 | not modelled | — | Finial; round bud section (the engine has rectangular sweeps only); paired strands; the lens-shaped curb around the pylon foot (`ns7`); long Super-T approach viaducts (the engine draws short generic ramps) | |

## 4. Target `model3d` (complete; replaces `model3d` in `research/shapes/cau-cua-hoi.json`)

This is exactly what was prototyped and rendered. The generator runs with no warnings: `warnings: []`, derived only "approach length". E is not raised.

```json
{
  "spans_m": [86, 153, 86],
  "pylon_shape": "single",
  "pylon_heights_m": [29, 29],
  "pylon_height_ref": "above_deck",
  "deck_elevation_m": 26.0,
  "deck_crest_m": 2.6,
  "deck_depth_m": 3.0,
  "deck_haunch": {"depth_at_pylon_m": 5.0, "length_m": 60},
  "cable_planes": 1,
  "cable_pattern": "semi_fan",
  "cables_per_side": 11,
  "main_stay_deck_m": [14, 58],
  "back_stay_deck_m": [14, 58],
  "deck_width_m": 18.5,
  "deck_type": "concrete",
  "extradosed": true,
  "pylon_colour": "white",
  "stay_colour": "#d0313d",
  "colour_mode": "vivid",
  "confidence": "estimated",
  "notes": "Extradosed unit 86 + 153 + 86 m (infra.global; designer TEDI, client PMU 6), the 153 m span the longest extradosed span in Viet Nam when it opened (press). Prestressed-concrete continuous box girder built by balanced cantilever, haunched (≈5 m deep at the pylons, ≈3 m at mid-span, read from a side-on construction photo; drawn with deck_haunch, G17); main-bridge deck 18.5 m (16 m on the Super-T approaches), 2 motor + 2 mixed lanes. Navigation clearance 120 × 20.5 m, 24.5 m within 40 m of the channel centreline, 2,000 DWT (VTV). Pylons: a single white concrete shaft in the median ('cột bê tông') rising ≈19 m above the deck and widening slightly upward, crowned by a lotus bud ('chóp búp sen', ≈6 m across, white with a pink-red tip and a ≈2 m finial) to ≈29 m above the deck (kinhtedothi 12/2019: 'khoảng 25/29 m tháp'; side photos ≈28–29 m). One central plane of red stays (each position a pair of strands ≈1 m apart, 15 cm sheaths; anchors in a maintenance gallery in the box), 11 per side per pylon, anchored on the shaft over ≈7–18.5 m and on the median ≈14–58 m from the pylon. Below the deck a rectangular pier (≈6 × 8 m) on a chamfered pile cap ≈12 × 23 m just above the water. Deck ≈26 m above the water at the unit ends, ≈28 m at the pylons, ≈28.6 m at mid-span (crest 2.6 m; heights from side photos, set so that the 24.5 m clearance fits under a 3 m girder).",
  "pylon_custom": {
    "description": "Lotus-bud pylon ('búp sen'): one concrete shaft on the deck centreline, ≈3.4 m across × 4.2 m along the bridge at the deck, widening to ≈4 × 5 m at ≈19 m, then a bud that swells to ≈6 m (19–21.5 m), stays full (21.5–24.5 m) and closes to a point at 29 m above the deck; the top ≈1.7 m is pink-red (finial not modelled). Stays: one central plane anchored on the shaft over 7–18.5 m. Below the deck a rectangular pier ≈6 m along × 8 m across the bridge on a chamfered pile cap ≈12 × 23 m whose top is ≈2.5 m above the water.",
    "legs": [
      {"centerline": [[0, -0.5, 0], [0, 9.0, 0], [0, 19.0, 0]],
       "width_base_m": 3.4, "width_top_m": 4.0, "depth_base_m": 4.2, "depth_top_m": 5.0},
      {"centerline": [[0, 19.0, 0], [0, 20.25, 0], [0, 21.5, 0]],
       "width_base_m": 4.0, "width_top_m": 6.0, "depth_base_m": 5.0, "depth_top_m": 6.0},
      {"centerline": [[0, 21.5, 0], [0, 23.0, 0], [0, 24.5, 0]],
       "width_base_m": 6.0, "width_top_m": 6.0, "depth_base_m": 6.0, "depth_top_m": 6.0},
      {"centerline": [[0, 24.5, 0], [0, 26.0, 0], [0, 27.3, 0]],
       "width_base_m": 6.0, "width_top_m": 2.0, "depth_base_m": 6.0, "depth_top_m": 2.0},
      {"centerline": [[0, 27.3, 0], [0, 28.2, 0], [0, 29.0, 0]],
       "width_base_m": 2.0, "width_top_m": 0.3, "depth_base_m": 2.0, "depth_top_m": 0.3, "colour": "#c8505a"},
      {"centerline": [[0, -23.7, 0], [0, -12.0, 0], [0, -1.0, 0]],
       "width_base_m": 8.0, "width_top_m": 8.0, "depth_base_m": 6.0, "depth_top_m": 6.0}
    ],
    "crown": "pointed",
    "pile_cap": {"length_x_m": 12, "width_z_m": 23, "top_y_m": -23.7, "thickness_m": 4.0, "chamfer_m": 3.5},
    "anchor_zone": [
      {"y_from_m": 7.0, "y_to_m": 18.5, "leg": 0}
    ],
    "mirror_for_other_pylons": true,
    "reference_images": [
      "https://cdn-images.vtv.vn/thumb_w/1200/2021/3/14/cau-cua-hoi-vgp-161566274594474766141.jpg",
      "https://ngoisao.vnexpress.net/cau-gan-1-000-ty-dong-vuot-song-lam-4205350.html",
      "https://nguoiquansat.vn/cau-dep-nhat-bac-mien-trung-kien-truc-bup-sen-an-tuong-cua-ngo-ket-noi-2-tinh-nghe-tinh-244543.html",
      "https://cafebiz.vn/nhin-tu-tren-cao-cay-cau-950-ty-dong-noi-nghe-an-va-ha-tinh-20210206135616766.chn"
    ]
  }
}
```

**Legs.** Width is across the bridge (z) and depth is along x.

| Leg | Role | Section |
|---|---|---|
| 0 | Shaft, deck to 19 m; carries the anchor zone | 3.4 × 4.2 → 4 × 5 |
| 1 | Bud swell, 19–21.5 m | 4 × 5 → 6 × 6 |
| 2 | Full bud, 21.5–24.5 m | 6 × 6 |
| 3 | Bud closing, 24.5–27.3 m | 6 × 6 → 2 × 2 |
| 4 | Pink-red tip, 27.3–29 m | 2 × 2 → 0.3 |
| 5 | Pier below the deck | 8 × 6 |

- The tips of legs 0–4 are ≥ 1.5 m apart, so no crown merging is triggered.
- Each leg has ≥ 3 centreline points, as the generator requires.
- The pier top is at −1.0, inside the 5 m haunched girder at the pylon. Its base, at −23.7, sits on the cap top.

**Cables.** The prototype has 44 stay lines (11 × 2 sides × 2 pylons). The first anchor is 7 m above the deck at the pylon (local 35.02 = 28.02 + 7). The deck stations are 14–58 m from the pylon on both sides: main reach 76.5, back reach 81.7. Nothing is clamped.

### Shape-file top-level fields

- `pylons_vi` / `pylons_en`: see §6.
- `colour`: "white lotus-bud pylons with a pink-red tip; red stays (one central plane); grey concrete deck and piers".
- `notes`: "Single central plane of red stays from two white lotus-bud ('búp sen') pylons ≈29 m above the deck."
- `review`: add "Round 12: lotus-bud shaft and bud to 29 m, pier and chamfered cap; deck 26 + crest 2.6, haunch 5 → 3 m; 24.5 m clearance; semi-fan 11 per side, 7–18.5 m on the shaft, 14–58 m on the deck; vivid red stays".
- `checklist`:
  - "pass (photos)": foot below deck, legs at deck, merge height ("n/a, single shaft"), crossbeams ("none, correct"), proportions, stays, deck / aux piers ("no aux piers, correct"), colour;
  - head: "pass (bud approximated by rectangular sweeps; finial not modelled)".
- `compare`: "VTV side elevation (2020) and Người Quan Sát oblique (2025); renders brief-r12".
- Keep `pass2: true`.

## 5. Generator edits (`scripts/gen_bridges.py`) and tests

1. **Shape file.** Replace `model3d` as in §4; it is authoritative.
2. **M3D fallback (line ≈454).** Bring it in step: `m3d([86, 153, 86], "single", [29, 29], "above_deck", 1, "semi_fan", 18.5, "concrete", cps=11, extradosed=True, notes="Fallback; see research/shapes/cau-cua-hoi.json (round 12: lotus-bud pylons 29 m above the deck, deck 26 + crest 2.6, 24.5 m clearance).")`. Put the usual comment above it: "fallback only: research/shapes/cau-cua-hoi.json (pass 2) wins; kept in step with it (round 12)".
3. **NAV.** Add `"cau-cua-hoi": nav(24.5, 80, "navigation opening 120 m × 20.5 m; 24.5 m within 40 m either side of the channel centreline; 2,000 DWT", "https://vtv.vn/xa-hoi/cau-cua-hoi-chinh-thuc-duoc-dua-vao-su-dung-tu-ngay-15-3-2021031402344628.htm")`. The 80 m width is the 24.5 m-high zone; the 120 m × 20.5 m opening is in `reference`.
4. **EXPECT_R1 (line ≈1042).** Change it to `"cau-cua-hoi": {"pylon_colour": "white", "stay_colour": "#d0313d", "colour_mode": "vivid", "deck_elevation_m": 26.0, "deck_crest_m": 2.6, "cables_per_side": 11, "cable_pattern": "semi_fan"}`. The current `"stay_colour": "red"` entry makes the generator assert-fail with the new colour.
5. **PHASE6 (line ≈852).** `"cau-cua-hoi": {"pylon_colour": "white", "stay_colour": "red"}` can stay, because shape-file keys win. Updating it to `"#d0313d"` is tidier.
6. **Allow-lists:**
   - `VIVID_OK` gets `"cau-cua-hoi"` (G14).
   - `G15_OK` gets `"cau-cua-hoi"` (main_stay_deck_m).
   - The G17 `deck_haunch` assert becomes `b["id"] in ("cau-thuan-an", "cau-cua-hoi")`.
   - The G18 `chamfer_m` assert becomes `b["id"] in ("cau-dai-ngai-1", "cau-cua-hoi")`.
7. **Round-12 assert block**, modelled on Thuận An / Đại Ngãi:
   - `spans_m == [86, 153, 86]`, `pylon_heights_m == [29, 29]`, `above_deck`.
   - `deck_elevation_m == 26.0`, `deck_crest_m == 2.6`, `deck_depth_m == 3.0`, `deck_haunch == {"depth_at_pylon_m": 5.0, "length_m": 60}`.
   - `cable_planes == 1`, `semi_fan`, `cables_per_side == 11`, `main_stay_deck_m == back_stay_deck_m == [14, 58]`.
   - `len(pc["legs"]) == 6`, and all legs have z = 0 everywhere.
   - `max(p[1] for l in legs for p in l["centerline"]) == 29`.
   - Leg 4 has `colour`, and the pier leg starts at `[0, -23.7, 0]`.
   - `pile_cap == {"length_x_m": 12, "width_z_m": 23, "top_y_m": -23.7, "thickness_m": 4.0, "chamfer_m": 3.5}`.
   - `anchor_zone == [{"y_from_m": 7.0, "y_to_m": 18.5, "leg": 0}]`.
   - `nav_clearance.height_m == 24.5` and `"vtv.vn" in source`.
   - `"búp sen" in b["pylons"]` and `"lotus" in b["pylons_en"]`.
   - `"14/3/2021" in b["notes"]` and `"single source" not in b["notes"]`.
   - `b["opened"] == 2021`, `total_length_m == 1728`, `lanes == 4`.
   - No `deck_closed`, no `auxiliary_piers_m`.
8. **`src/lib/data.test.ts` allow-list expectations.** Both lists are verified failing until updated:
   - Line ≈507 (vivid list) becomes `['cau-cua-hoi', 'cau-dai-ngai-1', 'cau-ngoc-hoi', 'cau-vam-cong']`.
   - Line ≈787 (main_stay_deck_m list) becomes `['cau-cat-lai', 'cau-cua-hoi', 'cau-phuoc-an', 'cau-thuan-an']`.
   - If similar lists exist for `deck_haunch` or `chamfer_m`, extend them the same way.
   - Optionally add an `it('Cửa Hội (round 12) …')` block mirroring the asserts in item 7.

   With items 1–6 and these two test edits applied in the scratch copy, `npx vitest run --testTimeout 200000` gives 139 passed and 2 failed. The 2 failures are exactly these two lists.
9. **Seed `add()`:**
   - `pylons="2 tháp búp sen (cột bê tông giữa, chóp búp sen) cao ≈29 m trên mặt cầu, dây văng đỏ một mặt phẳng"`.
   - `total_length_m=1728`, `lanes=4`, `cost="950 tỷ VND"`, `investor="Ban QLDA 6 (Bộ GTVT)"`. Check the field name used by other entries.
   - Keep `construction_start=2019` and `opened=2021`.
   - Sources: add VTV (URL above), `https://ngoisao.vnexpress.net/cau-gan-1-000-ty-dong-vuot-song-lam-4205350.html`, `https://cafebiz.vn/nhin-tu-tren-cao-cay-cau-950-ty-dong-noi-nghe-an-va-ha-tinh-20210206135616766.chn`, `https://kinhtedothi.vn/can-canh-cong-truong-cau-cua-hoi-noi-nghe-an-ha-tinh.html`, `https://nguoiquansat.vn/cau-dep-nhat-bac-mien-trung-kien-truc-bup-sen-an-tuong-cua-ngo-ket-noi-2-tinh-nghe-tinh-244543.html`, `https://vnexpress.net/hon-65-ty-dong-trang-tri-cau-cua-hoi-4642773.html`, `https://vi.wikipedia.org/wiki/C%E1%BA%A7u_C%E1%BB%ADa_H%E1%BB%99i`.
   - `notes`: "EXTRADOSED. 86 + 153 + 86 m (infra.global; 153 m in VnExpress, Ngôi Sao, CafeBiz). Designer TEDI, client Ban QLDA 6. Bridge 1,728 m (route 5.271 km), 18.5 m main / 16 m approaches (Super-T). Navigation 120 × 20.5 m, 24.5 m within 40 m of the channel centreline (2,000 DWT). Ground-breaking 15/2/2019, closure 13/10/2020, temporary use 6/2/2021, opened 14/3/2021. Lotus-bud pylons ≈29 m above the deck (Kinh tế & Đô thị: 'khoảng 25/29 m tháp'). Decorative lighting of pylons, buds and stays (> 65 tỷ) approved 8/2023."
   - Images: add `press("https://cdn-images.vtv.vn/thumb_w/1200/2021/3/14/cau-cua-hoi-vgp-161566274594474766141.jpg", "VTV", "<VTV url>", "side elevation during construction (2020)")` and `press("https://nqs.1cdn.vn/2025/09/21/250921202902055_cau-cua-hoi-1-1758448014694782117873.jpg", "Người Quan Sát", "<NQS url>", "completed bridge, lotus-bud pylons")`. The Ngôi Sao 1200-px URLs are signed (`?w=1200…&s=…`); use them only if `press()` keeps query strings.
10. Run `python3 scripts/gen_bridges.py data/bridges.json`, `npm test` (or `npx vitest run --testTimeout 200000`) and `npm run typecheck`.

## 6. Text

- `pylons_vi`: "2 tháp búp sen: cột bê tông màu trắng giữa dải phân cách, cao ≈29 m trên mặt cầu, đỉnh là búp sen (đầu hồng đỏ); dây văng đỏ một mặt phẳng giữa, 11 dây mỗi bên, dạng nửa rẻ quạt"
- `pylons_en`: "2 white lotus-bud pylons: one median concrete shaft ≈29 m above the deck crowned by a lotus bud with a pink-red tip; one central plane of red semi-fan stays, 11 per side"

## 7. Engine gaps

None is needed for acceptance; the target uses only existing features. Nice-to-haves, both P2:

- **Round or elliptical sweep sections** (`section: "round" | "ellipse"` per leg). Lotus buds and drop-shaped shafts (Cửa Hội, and the búp sen bridges at Nam Định and Sông Hiếu if they are ever added) would read better. Spec: the sweep uses an N-gon (N = 16) with semi-axes width/2 and depth/2 instead of the rectangle. Without the key, nothing changes.
- **Approach viaduct option.** The 1.7 km bridge has ≈700 m of approach viaduct on each side, but the engine draws a short ramp to a 4 m bank (≤ 0.2 × unit). This is project-wide and not for this round.

## 8. Acceptance criteria

Render with your own server (`npx vite --host 127.0.0.1 --port <p> --strictPort`, then `--url`). There must be no warnings for this bridge: no navigation raise, no clamps, no haunch clamp.

1. **`--az 30 --el 1 --target unit`** (matches `nq1.jpg`: near pylon on the right). Check:
   - two white shafts with a fat bud and a pointed pink-red tip;
   - pylon above the deck ≈ the deck above the cap top (ratio 0.95–1.2);
   - red single-plane fans ending ≈58 m from each pylon on both sides;
   - visibly haunched girder at the piers and a slight crest over the main span;
   - rectangular piers on low chamfered caps.
2. **`--az 0 --el 2 --target unit`** (matches `vtv.png`). Check:
   - pylon above the deck : main span ≈ 0.19 (0.17–0.21);
   - deck above the water at the pylons : main span ≈ 0.18 (0.15–0.20);
   - no auxiliary piers;
   - outer stays land ≈0.38 × 153 m from the pylon, inner ≈0.09.
3. **`front`.** A single median shaft and bud, the stays in one central plane, a pier narrower than the deck, and a cap ≈23 m wide (wider than the 18.5 m deck).
4. **`top`.** The bud swells to ≈1.5× the shaft just under the tip, then closes to a pink-red point. No separate mast or spike above 29 m.
5. **`side`.** 11 stays per side, not parallel: inner stays steeper (slope ≈0.5) than outer (≈0.32). Anchors between 7 and 18.5 m on the shaft.
6. **Data checks** (`data/bridges.json`):
   - `pylon_heights_m` [29, 29], `deck_elevation_m` 26, `deck_crest_m` 2.6, `deck_depth_m` 3, `deck_haunch` {5, 60};
   - `cables_per_side` 11, `semi_fan`, `colour_mode` "vivid";
   - `nav_clearance.height_m` 24.5;
   - `opened` 2021, `total_length_m` 1728, `lanes` 4;
   - the notes no longer call 153 m "single source";
   - drawn tip ≈57 m above the water.
7. `npm test` and `npm run typecheck` pass.

## 9. Sources

- VTV, 14/3/2021: https://vtv.vn/xa-hoi/cau-cua-hoi-chinh-thuc-duoc-dua-vao-su-dung-tu-ngay-15-3-2021031402344628.htm. Main bridge 1.728 km, 18.5 / 16 m, 2,000 DWT, 120 × 20.5 m and 24.5 m within 40 m of the channel centreline, ground-breaking 15/2/2019, temporary use 6/2. Side-elevation photo (`vtv.png`).
- infra.global: https://infra.global/projects/cua-hoi-bridge/. "span layout of 86m, 153m, 86m"; PSC continuous, balanced cantilever; Super-T approaches; "towers … in the shape lotus bud"; TEDI; PMU 6.
- Kinh tế & Đô thị, 24/12/2019: https://kinhtedothi.vn/can-canh-cong-truong-cau-cua-hoi-noi-nghe-an-ha-tinh.html. "2 trụ chính của cầu đã đúc hẫng đến K6, khoảng 25/29m tháp"; 37 spans; 2 packages.
- Ngôi Sao (VnExpress), 12/12/2020: https://ngoisao.vnexpress.net/cau-gan-1-000-ty-dong-vuot-song-lam-4205350.html. "hai cột bê tông tạo hình chóp búp sen"; stay Ø15 cm; gallery for the stay anchors; 22 piers, 85 Super-T; closure 13/10. Photos `ns1`–`ns12`.
- Tiền Phong / CafeBiz, 6/2/2021: https://cafebiz.vn/nhin-tu-tren-cao-cay-cau-950-ty-dong-noi-nghe-an-va-ha-tinh-20210206135616766.chn. 5.271 km route, 1.728 km bridge, 18.5 / 16 m, 153 m extradosed. Photos `cb0`–`cb8`.
- VietnamPlus/TTXVN: https://www.vietnamplus.vn/an-tuong-nhung-cay-cau-vuot-song-lam-noi-nghe-an-ha-tinh-post964783.vnp. "biểu tượng hình búp sen" on top of the concrete column.
- Người Quan Sát, 9/2025: https://nguoiquansat.vn/cau-dep-nhat-bac-mien-trung-kien-truc-bup-sen-an-tuong-cua-ngo-ket-noi-2-tinh-nghe-tinh-244543.html. Clearance 24.5 m, 120 × 20.5 m; photos `nq1`, `nq2`.
- VnExpress, 17/8/2023: https://vnexpress.net/hon-65-ty-dong-trang-tri-cau-cua-hoi-4642773.html. Lighting > 65 tỷ for "trụ tháp, trụ chính, búp sen đỉnh tháp, dây văng"; opened 14/3/2021. Tuổi Trẻ 18/8/2023 has the same story.
- vi.wikipedia "Cầu Cửa Hội": 1,728 m, 3-span main bridge with 2 lotus-bud pylons, 15/2/2019 → 14/3/2021.
- **Not found:** the official pylon drawing, the exact stay count, and the deck and soffit levels. The pylon height of 29 m rests on one construction report plus photo measurement; the stay count and all dimensions are [P].
