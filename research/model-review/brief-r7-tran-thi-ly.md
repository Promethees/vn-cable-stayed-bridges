# 3D model review: round 7, Cầu Trần Thị Lý (`cau-tran-thi-ly`), 2026-11-27

The user said this model needs improvement. **Confirmed.** The colours and the "one plane in front, two at the back" idea are right. The geometry that gives this bridge its look is wrong:

1. **The back span and back-stay anchorage are wrong (the main issue).**
   - The real cable-stayed unit is **4 × 50 m + 230 m (430 m)**, with the pylon at S5.
   - All 30 back stays **converge into a ~15 m zone at the far west end, right at abutment S1**, about 180–195 m behind the pylon. That is the dense red "sail" wedge in every photo.
   - The model has a lumped 120 m back span with the red stays spread evenly along it, like an ordinary fan.
2. **The mast is too short above the deck, too slender in elevation, and the deck is too high.**
   - The mast should be 134 m above a deck about 11 m above water. The model has ~120 m above a deck at ~23 m.
   - The mast is a tapering blade about 11 m deep along the bridge at the deck and 4.5 m at the top. The model has 5 → 2 m.
3. **Stay counts and anchor heights are not the real ones.**
   - Main span: **33** stays in one plane, anchored 48–126 m up the mast.
   - Back span: **2 × 15** stays, anchored 68–126 m up the mast.
4. **Below the deck**, the model has a thin stub. The real support is a wide oval pier on a pile cap at the waterline.

**No client-confirmed value is contradicted.** Nothing on this record is marked client-confirmed, and the official sources confirm the 230 m span and the 731 m total.

Reference images are in scratchpad `ref/ttl/` (`/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/ref/ttl/`):

| File | What it is |
|---|---|
| `vecc_elevation.jpg` (zooms `vecc_elev_zoom.jpg`, `vecc_mast.jpg`, `vecc_s1.jpg`) | **Primary reference: the official general elevation** (VECC project page). It shows S1…S13, "MAIN BRIDGE 430 = 50+50+50+50+230", the pylon at S5, the expansion joint at S6, and all stays drawn. 640 px, low-res but to scale (≈3 px/m). |
| `c3.jpg` (crops `c3_back.jpg`, `c3_mast.jpg`, `c3_base.jpg`, `c3_top.jpg`) | Commons "Tran Thi Ly Brücke": a near-elevation from the north (river side). Main span to the left, red back stays converging to the right. **Best photo for proportions.** |
| `c1.jpg` (crop `c1_back.jpg`) | Commons "Trần Thị Lý Bridge at daytime": high viewpoint from the north |
| `c2.jpg` | Night elevation from the north (Commons) |
| `c5.jpg`, `c8.jpg` | Distant elevations from the north (Commons) |
| `c6.jpg` | From the south-west canal, showing the red back stays as a ribbon (Commons) |
| `c7.jpg` (crop `c7_mast.jpg`) | Deck level on the west approach looking east: two back-stay planes rising from the deck edges to the mast (Commons, "Cầu Trần Thị Lý.jpeg") |
| `s4_drone.jpg` | Drone along the axis from above the west end (UBND Đà Nẵng, via Soha) |
| `s1.png` | Night aerial from the south-west (Đại Việt Tourist, via Soha) |
| `s5_cienco.jpg` | Pylon at completion, 2012 (CIENCO 1, via Soha) |

Current-model baselines are in scratchpad `views-ttl/`: standard views plus `custom-az180-el3-unit`, `custom-az90-el20-unit` and `custom-az-90-el20-unit`.

Confidence tags:
- **[C]** confirmed by a designer, contractor or official source
- **[D]** measured off the official elevation drawing
- **[M]** measured off photos
- **[E]** estimated

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Layout | **(4×50 + 230) + 45 + 4×50 + 30 + 26 = 731 m**, S1 (west abutment) to S13. "Main bridge 430 m" = **4 × 50 m side spans + 230 m cable-stayed span**, expansion joint at S6. | [C] | [VECC (design consultant)](https://vecc.com.vn/project/cau-nguyen-van-troi-tran-thi-ly-thanh-pho-da-nang/?lang=en) incl. its elevation drawing; [DCCD (supervision)](https://www.dccd.com/project/tran-thi-ly-bridge/): "4 side spans of the main bridge at 50 m each… main span (cable-stayed) of 230 m"; [vi.wikipedia](https://vi.wikipedia.org/wiki/C%E1%BA%A7u_Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD); [ITST/MOST](https://itst.gov.vn/thanh-tuu-khcn-moi/doc-dao-cau-day-vang-ba-mat-phang/): "nhịp chính từ trụ S5–S6 (nhịp dây văng dài 230 m)" |
| Pylon position | **S5**, between the 4 × 50 m west spans and the 230 m east span. The main span runs east over the Hàn river; the back side runs west to abutment S1. | [C] | VECC drawing; [danang.gov.vn](https://danang.gov.vn/vi/w/cau-tran-thi-ly-canh-buom-cang-gio-ra-bien-lon-i): "tựa trên trụ S5" |
| Pylon height | **145 m above sea level, 134 m above the deck**, so the deck is ≈ **11 m** above water | [C] | DCCD; WSP release |
| Lean | **12° toward the west (S1)**, i.e. back, away from the main span. Tip ≈ 134 · tan 12° ≈ **28.5 m** behind the base. | [C] | VECC, ITST, vi.wikipedia |
| Pylon section | RC, **"V-shaped" cross-section**, section varying base → top ("nhỏ dần về phía đỉnh"); climbing formwork | [C] | VECC, ITST, Soha |
| Pylon form (elevation) | A straight tapering blade. Along the bridge it is **≈ 11 m deep just above the deck and ≈ 4.5 m at the top**. The flat top carries a small glass lantern (observation point) and two antenna masts. | [M]/[D] | c3 (0.235 m/px: 10.7 m → 4.6 m); VECC drawing (≈11.7 m at the deck) |
| Pylon across | Narrow, ≈ 6 → 4 m (no source; reads as a slender mast along the axis) | [E] | c7, s4 |
| Pylon support | Pylon rigid with the deck; the pylon and girder sit on pier S5 through a spherical bearing (25,000 t), so the pylon is "not fixed to its footing". **S5 is an oval RC pier** on bored piles (D 1.5 m). | [C] | danang.gov.vn, ITST, Soha |
| S5 proportions | Oval pier ≈ **15 m** along the bridge (wider than the mast) from the waterline to the deck soffit. Footing/pile cap at the waterline ≈ **22 m** along the bridge, low (~3 m), rounded. | [M] | c3_base |
| Stays | **Three planes**, asymmetric. East (main) side: **one central plane in the median**, **33 stays**. West (back) side: "twisted and split into two branches", **30 stays = 2 planes × 15**, "anchored from the pylon down to the main girder and the abutment". Stay length 100–280 m. DCCD calls it a "semi-harp". | [C] | ITST ("33 dây nhịp chính và 30 dây nhịp dẫn"), danang.gov.vn, VECC, DCCD |
| Main stays geometry | Mast anchors from **≈ 48 m to ≈ 126 m** above the deck. Deck anchors from **≈ 20 m to ≈ 216 m** east of S5, i.e. nearly to S6. Semi-fan. | [D]/[M] | VECC drawing (mast anchors 47 m → top; deck 21–216 m); c3_mast (lowest ≈ 55 m) |
| Back stays geometry | Mast anchors from **≈ 68 m to ≈ 126 m** above the deck. **All deck anchors are within ≈ 5–19 m of S1**, i.e. **≈ 181–195 m behind the pylon**: a reverse fan converging to the west end. The two planes run from the mast faces to the two deck edges, so each plane is a long, thin triangle. Seen along the axis (c7, s4) they form the "tent". Nothing is anchored over S2–S4. | [D]/[M] | VECC drawing (`vecc_s1.jpg`: 7.5 px/m); c1, c3, c6, s1 (red wedge at the far end) |
| Deck | **34.5 m** = 3.5 + 11.25 + 5.0 (median) + 11.25 + 3.5. Prestressed-concrete box girder (main span and approaches). Straight in plan, practically flat. | [C] | VECC, VietnamPlus, Soha (35.5 m in vi.wikipedia / danang.gov.vn does not add up: 6 × 3.75 + 2 × 3 + 5 = 33.5) |
| Navigation | **H ≥ 7 m, B ≥ 50 m** | [C] | VECC, vi.wikipedia |
| Colours | White/light-grey mast and deck; **main stays white**; **back stays red / orange-red**. Pixel check on c1/c3/c6: main-stay pixels are not red. The c7 photo shows one face of the mast dark red, perhaps the inside of the V; this is unverified and **not required**. Night lighting is purple, not modelled. | [M] | Commons photos |
| Designer / builder | WSP Finland (competition, architecture and detailed design); VECC; CIENCO 1 + VSL Vietnam; opened 29/3/2013 | [C] | WSP, vi.wikipedia, VECC |

Superseded: brief-round1's "back stays anchor over the 45 m span plus the first approach spans, so 120 is an acceptable lumped back span". This was wrong. The 45 m span is **east** of S6, outside the stayed unit, and the back stays run west over 4 × 50 m to S1.

## 2. Prioritised discrepancies

| P | Field | Current | Expected | Conf |
|---|---|---|---|---|
| **P0** | `spans_m` | `[230, 120]` | **`[200, 230]`** (S1 → S6, west → east; the pylon is the support between them) | [C] |
| **P0** | `auxiliary_piers_m` | — | **`[50, 100, 150]`** (S2, S3, S4) | [C] |
| **P0** | back-stay deck anchorage | spread 0.08–1.0 × 114 m | **converge at 181–195 m behind the pylon** (station 5–19 from S1), needs **G9** | [D] |
| **P0** | mast height and lean | tip local (−27, 120) | tip local **(−28.5, 134)**, straight at 12° | [C] |
| **P0** | `deck_elevation_m` | heuristic ≈ 23 | **11** | [C] (145 − 134) |
| **P1** | mast section | width 6→2.5, depth 5→2 | **depth (x, along the bridge) 11 → 4.5; width (z) 6 → 4** | [M]/[D] / [E] |
| **P1** | stay counts | derived, same both sides | **`cables_per_side: 33`** (main, 1 plane); **back 15 per plane** (needs **G9** `back_stay_count`) | [C] |
| **P1** | anchor zones | one zone 55–118 | **main 48–126 (`side: "main"`), back 68–126 (`side: "back"`)**, both on leg 0 | [D] |
| **P1** | S5 pier / foundation | thin mast stub to y = −8 | oval pier ≈ 15 m (x) × 12 m (z) from the cap to the deck soffit; pile cap 22 × 30 m at the waterline (see §3) | [M] / [E] |
| **P1** | `nav_clearance` | none | **`nav(7, 50, "navigation clearance BxH = 50 × 7 m", VECC URL)`** | [C] |
| P2 | `deck_width_m` / `width_m` | 35.5 | **34.5** | [C] |
| P2 | `cable_pattern` | `"fan"` | **`"semi_fan"`**. No geometric effect with custom anchor zones; it is for data accuracy. | [C] (DCCD "semi-harp") |
| P2 | bridge text | see §3 | update `pylons`, `pylons_en`, `sources`, `notes`, `confidence` | |

Unchanged and correct: `cable_planes: 1`, `back_stay_planes: 2`, `pylon_shape: "single"`, `pylon_heights_m: [145]` total, `deck_type: "concrete"`, `pylon_colour: "white"`, `stay_colour: "white"`, `back_stay_colour: "red"`, straight plan.

## 3. Target data

Update **both** `research/shapes/cau-tran-thi-ly.json` → `model3d` and the `REVIEW_R1["cau-tran-thi-ly"]` entry in `scripts/gen_bridges.py`, so they agree and the review-r1 `set` does not override anything. Also update the `m3d(...)` seed and the `pylon_custom` seed for consistency, and drop the stale "Geometry unchanged" / "120 m back span estimated" notes.

```json
"spans_m": [200, 230],
"auxiliary_piers_m": [50, 100, 150],
"pylon_shape": "single",
"pylon_heights_m": [145], "pylon_height_ref": "total",
"deck_elevation_m": 11,
"deck_width_m": 34.5, "deck_type": "concrete",
"cable_planes": 1, "back_stay_planes": 2,
"cable_pattern": "semi_fan",
"cables_per_side": 33,
"back_stay_count": 15,
"back_stay_deck_m": [181, 195],
"pylon_colour": "white", "stay_colour": "white", "back_stay_colour": "red",
"confidence": "verified",
"pylon_custom": {
  "description": "Single straight RC blade on the deck centreline at pier S5, leaning 12° west (back, away from the 230 m span); V-section tapering from ≈11 m deep along the bridge at deck level to ≈4.5 m at the flat top (glass lantern, 134 m above deck). Rigid with the deck, seated on a wide oval pier and pile cap at the waterline. Main span: one central plane of 33 white stays anchored 48–126 m up the mast. Back side: 2 × 15 red stays from the mast faces (68–126 m) to the two deck edges, all converging on the last ≈15 m of deck at abutment S1 (≈181–195 m behind the pylon) — the twisted red 'sail'.",
  "legs": [
    {"centerline": [[0.4, -2, 0], [-13.8, 65, 0], [-28.5, 134, 0]],
     "width_base_m": 6, "width_top_m": 4, "depth_base_m": 11, "depth_top_m": 4.5},
    {"centerline": [[0, -10.5, 0], [0, -6, 0], [0, -2, 0]],
     "width_base_m": 12, "width_top_m": 12, "depth_base_m": 15, "depth_top_m": 15}
  ],
  "anchor_zone": [
    {"y_from_m": 48, "y_to_m": 126, "leg": 0, "side": "main"},
    {"y_from_m": 68, "y_to_m": 126, "leg": 0, "side": "back"}
  ],
  "pile_cap": {"length_x_m": 22, "width_z_m": 30, "top_y_m": -10.5, "thickness_m": 3, "rounded_ends": true},
  "reference_images": [
    "https://vecc.com.vn/project/cau-nguyen-van-troi-tran-thi-ly-thanh-pho-da-nang/?lang=en (general elevation)",
    "https://commons.wikimedia.org/wiki/File:Tran_Thi_Ly_Br%C3%BCcke.jpeg",
    "https://commons.wikimedia.org/wiki/File:Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge_at_daytime.jpg",
    "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD.jpeg"
  ]
}
```

Notes:
- **Local frame.** Local +x points toward the main span, which is +station with `[200, 230]` (`towardMain`), so a negative x lean is west. The straight centreline has slope 28.9 / 136 ≈ 12.0°.
- **`width` and `depth`.** In `sweepRect`, `width` is across the bridge (z) and `depth` is along it (x). The 11 → 4.5 m blade taper is therefore `depth_*`.
- **Leg order matters.** Leg 0 is the mast; every anchor zone uses leg 0. Leg 1 is the S5 oval pier: a short block from the cap top to the girder soffit, wider than the mast as in c3_base. No `crossbeams_y_m`. The two tips are far apart, so there is no crown merge.
- **Back-stay planes.** With side zones on a single leg, `customZone` gives back stays `zOffset = ±w1/2` (±2 m), so the two back planes leave the mast faces and land at the deck edges (±17.25 m). Main stays stay at z = 0. Please verify this in the render; if the back stays collapse to z = 0, it is a bug.
- **Height.** `pylon_heights_m` stays `[145]` total; the geometry tip is 11 + 134 = 145.
- **Bridge fields:**
  - `width_m` → 34.5.
  - `pylons` → "1 tháp BTCT nghiêng 12° về phía Tây, tiết diện chữ V, cao 145 m (134 m trên mặt cầu); dây văng 3 mặt phẳng: 33 dây nhịp chính (1 mặt phẳng giữa), 30 dây neo sau màu đỏ (2 mặt phẳng) hội tụ về mố S1".
  - `pylons_en` → "1 RC pylon leaning 12° west, V-section, 145 m (134 m above deck); three stay planes: 33 main-span stays in one central plane, 30 red back stays in two planes converging on abutment S1".
  - Add `span_arrangement` "4 × 50 + 230 m (cầu chính 430 m); toàn cầu 4×50 + 230 + 45 + 4×50 + 30 + 26 = 731 m" if that field is used for other bridges.
  - Add VECC, DCCD, ITST and danang.gov.vn to `sources`.
  - Replace the note "230 m from a travel site" with the VECC / DCCD confirmation.
  - Bridge `confidence` → `"verified"`.

## 4. Engine gap

### G9. Back-stay count and deck anchorage range (`back_stay_count`, `back_stay_deck_m`): required, P0

Today every side uses `cables_per_side`, and back-side deck stations are `p.x + side · reach · (f0 + (f1 − f0)·t)`, spread over the whole back span. Trần Thị Lý has 33 main stays but 15 per back plane, and its back stays converge on a short zone at the far end. That convergence is the bridge's signature shape.

Spec:
- **Schema (`Model3D`).** Add two optional fields:
  - `back_stay_count?: number`: stays per plane on each back side (`isBackSide`). Defaults to `cables_per_side`.
  - `back_stay_deck_m?: [number, number]`: on back sides, deck anchors are distributed linearly in `t` from `d0` (t = 0, the lowest pylon anchor) to `d1` (t = 1, the highest). Both are station distances in metres from the pylon's station, measured toward the unit end.
- **Behaviour.**
  - Clamp both values to `[1, distance to the unit end − 1]`; when `d0 > d1`, swap them and warn.
  - This replaces the `reach · (f0…f1)` stations, and skips the `AUX_SNAP` aux-pier snapping, for non-harp patterns.
  - For `harp`, ignore it and push a warning. No other bridge needs it.
  - Main sides are unchanged.
- **Ordering.** Keep t = 0 ↔ the lowest anchor and the nearest deck point, so the back fan nests without crossings.
- **Wiring.** Add both keys to `validate.ts`:
  - `back_stay_count`: integer 1–60.
  - `back_stay_deck_m`: two finite numbers ≥ 0.

  Also add them to `docs/data-schema.md`, the allowed-key list in `src/lib/data.test.ts` (≈ line 226), and the generator's model3d key whitelist.
- **Tests (`bridge3d.test.ts`):**
  - The Trần Thị Lý-like model above gives 33 main cables at z = 0 and 30 back cables (15 at z = −hw, 15 at z = +hw).
  - Every back deck anchor is at a station in [5, 19] ± 0.5.
  - Back pylon anchors are at local heights 68–126.
  - Main deck anchors are at stations 200 + [17, 219].
  - Existing tests for `back_stay_planes` stay green.

Everything else uses existing features: `pile_cap` (G7), per-side anchor zones (G8), `deck_elevation_m` (G1), `back_stay_planes` (G3) and `auxiliary_piers_m`.

## 5. Acceptance criteria (I will re-render)

Cameras:
- `--views side,front,three_quarter,foot,top`
- `--az 180 --el 3 --target unit`: from the north, compare **c3 / c5**
- `--az 200 --el 12 --target unit`: high from the north, compare **c1**
- `--az -90 --el 2 --target pylon0`: deck level from the west end, compare **c7**
- `--az -90 --el 25 --target unit`: compare drone **s4**
- `--az 0 --el 0 --target unit`: true elevation, compare the **VECC drawing**

1. **Elevation vs the VECC drawing (side / az 0 el 0).**
   - Five spans: four 50 m spans with piers S2–S4, then 230 m to S6. The pylon is at the 200 m station.
   - The mast leans 12° away from the 230 m span. Its tip is ≈ 28 m behind the base and **134 m above a deck ≈ 11 m above water**. Height above deck ≈ 0.58 × the main span.
   - Main stays form a semi-fan from 48–126 m on the mast to 17–219 m along the main span.
   - **Back stays form a thin reverse fan from 68–126 m on the mast down to the last ≈ 15 m of deck next to S1. No back stay lands over S2–S4.**
2. **Mast.**
   - Reads as a tapering blade: ≈ 11 m deep at the deck and ≈ 4.5 m at the flat top, so the base looks clearly broader than the top in the side view, as in c3.
   - Below the deck sits a wider oval-ish pier (≈ 15 m) on a low rounded pile cap at the waterline.
3. **az 180 view vs c3 / c5.**
   - Main span to the left, the mast leaning right, the white main stays spreading left over the river.
   - The **red back stays form a dense wedge converging to the right end at deck level**, as in the photos.
4. **Along-axis views vs c7 / s4.**
   - From the west end, two red planes rise from the two deck edges (±17 m) to the faces of the slender central mast, forming the "tent" with a twisted look.
   - The main-span stays behind the mast stay on the centreline (median).
5. **Counts and colours.**
   - 33 white main stays in one plane; 2 × 15 red back stays.
   - White mast and grey deck.
   - Deck 34.5 m.
6. **Data and tests.**
   - The fields in §3 are set in both the shape file and REVIEW_R1, with the nav clearance 7 × 50 m.
   - The bridge text, sources and notes are updated; there is no leftover "120 m back span" text.
   - G9 is in the schema, `validate.ts`, docs and tests.
   - `npm test` passes, and the generator runs clean.
