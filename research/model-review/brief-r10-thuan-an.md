# 3D model review: round 10, Cầu vượt cửa biển Thuận An (`cau-thuan-an`), 2026-11-28

The user asked for another review. **The round-1 reading of the pylon was wrong.** In round 1 the "chữ A" was read as an A across the bridge: two legs from the deck edges to an apex, plus a king-post. In reality the A runs **along the bridge axis** ("dạng chữ A theo phương dọc cầu"):

- Each pylon is **one narrow tapered concrete shaft in the median**.
- Seen from the side, it splits at deck level into two legs, fore and aft, with a small opening between them. Above the opening it is solid, up to a narrow flat tip with a lightning mast.
- Seen along the bridge, it is a slim column about 3 m wide.

Every side photo (Tiền Phong, VnExpress, Dân Việt) shows this clearly. Several other fields are also wrong. In order of size:

1. **Pylon form.** It is a longitudinal A in the median, not a transverse A with a king-post.
2. **Substructure.** There is no single 8 m column. The pier is **twin longitudinal wall piers** on a large **octagonal pile cap**, about 4 m above the water.
3. **Heights.** The tip is 72 m above the water [C]. Photos put the deck at about 44 m at the pylons and the pylon at about 27.5 m above the deck (see §2). The current model draws a 40 m deck and a 32 + 4 m head.
4. **Stays.** There are **17 per side** in one central plane (34 per pylon [C]). They are semi-fan: anchored over 6.9–20 m on the pylon and spread from 26 to 89 m along the median, leaving about 40 m of the main span unstayed. The current model has parallel harp stays and the default count.
5. **Deck profile and clearance.** The navigation clearance is **40 m** [C] and is missing. The deck has a vertical crest of about 5 m over the unit, and the girder is haunched.

**Flag: no client-confirmed value is contradicted.** The record has no `client-confirmed` field. The spans 120 + 218 + 120 are now confirmed [C], not estimated. The widths (20 m, 23.5 m on the main unit) are unchanged. The one notable conflict is with the **press pylon height (32 m Tiền Phong / Đạt Phương, 34 m Người Quan Sát)**. See §2: the target draws 27.5 m above the deck and keeps the press-confirmed 72 m water-to-tip.

Confidence tags: **[C]** confirmed by a source · **[R]** read from photos · **[E]** estimated.

## 0. References

The images are in the scratchpad at `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/ref/ta/`. They are press photos, licence unknown, and are for comparison only.

| File | What it is |
|---|---|
| `tp_tp-4-cau-day-do-vuot-cua-bien-dai-nhat-mien-trung-1.jpg` | **Main reference.** Tiền Phong, from the water, broadside to pylon T26/T27. Shows the A-shaft with its deck-level opening, the deep haunched box at the pier, the twin wall piers (small gap) and the octagonal cap. Ruler copy: `m_tp41.png`, `m_tp41_crop.png` |
| `tp_tp-4-cau-day-do-vuot-cua-bien-dai-nhat-mien-trung-2.jpg` | Close-up of the pylon head from the side: the opening (with a chamfered top), the solid tapered shaft, the flat tip with mast, and 17 stay levels per side |
| `tp_tp-2-cau-day-do-vuot-cua-bien-dai-nhat-mien-trung.jpg` | Far broadside of both pylons (ruler copy `m_tp2.png`). Used for the span-relative stay reach, the deck profile and the girder depths |
| `tp_tp-3a-cau-day-do-vuot-cua-bien-dai-nhat-mien-trung.jpg` | Low view from the water of both pylons, the piers and the caps (ruler copy `m_tp3a.png`). Second height-ratio measurement |
| `nqs13.png` (crop `c_nqs13.png`) | Dân Việt via Người Quan Sát, high oblique aerial (9/2025). Shows the median shaft, one stay plane landing on the median, the twin piers and the octagonal cap with a plinth |
| `nqs11.png` | View along the deck: the pylon is a slim column, with the stays entering a slot in its face |
| `vne_thongxe.jpg` | VnExpress drone shot (30/4/2026), three-quarter view: the whole unit, the red stay sheets, the twin piers and the octagonal caps |
| `sheet_tp.jpg` | Contact sheet of all 21 Tiền Phong photos |

Current-model renders are in scratchpad `views-ta/`.

The target prototype was rendered from a scratch copy of the repo, so the project is untouched. It is in scratchpad `tawork/r2/`: the standard views plus `custom-az0-el3-pylon0`, `custom-az325-el12-unit` and `custom-az160-el30-pylon0`. A first pass is in `tawork/r1/`. The exact JSON is in `tawork/target_model3d.json`.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Type | Extradosed: PSC box girder plus stays ("dầm Extradose", "dầm – cáp hỗn hợp"), built by balanced cantilever | [C] | VnExpress, Báo Tin tức/TTXVN, Người Quan Sát |
| Main unit | **120 + 218 + 120 m**, pylons on **T26, T27** | [C] | [Báo Xây dựng](https://baoxaydung.com.vn/thua-thien-hue-quyet-tam-thong-tuyen-cau-vuot-cua-bien-thuan-an-trong-nam-2024-370939.html) ("nhịp chính Extradosed (120+218+120)m"), plus press for 218 m |
| Rest of bridge | Cast-on-falsework spans (8.3 + 4×12 + 8.3), 2 cantilever units (55 + 90 + 55), 36 Super-T spans; 50 piers + 2 abutments; 2.36 km | [C] | Báo Xây dựng, Tiền Phong |
| Deck width | 20 m, **23.5 m on the main spans**, 4 lanes | [C] | VnExpress, Báo Tin tức |
| Navigation | **Clearance 40 m**, 218 m navigation span, 5,000 DWT | [C] | [Đạt Phương](https://datphuong.com.vn/tin-tuc/cau-thuan-an-thong-xe-ky-thuat-dau-an-nguoi-dat-phuong-tren-cong-trinh-vuot-bien-dai-nhat-mien-trung) ("khẩu độ thông thuyền lớn nhất lên tới 218m, tĩnh không cao 40m"), Báo Tin tức (5,000 t) |
| Pylon form | Single median shaft, **A along the bridge axis** | [C]+[R] | Search excerpt "dạng chữ A theo phương dọc cầu" (not re-found verbatim); unambiguous in all side photos (`tp-4-1`, `tp-4-2`, `tp-2`, `nqs13`) |
| Pylon height | Press: 32 m (Tiền Phong, Đạt Phương), 34 m (Người Quan Sát). **Water to tip ≈ 72 m** (Tiền Phong, Đạt Phương, Người Quan Sát) | [C] (conflicting) | see §2 |
| Pylon size | At the deck about 9.2 m along x, 3.4 m across. Narrow flat tip about 2.7 m. Deck-level opening about 3.0 × 4.6 m with a chamfered top. Lightning mast about 3 m | [R] | `tp-4-1`, `tp-4-2`, `nqs11` |
| Stays | One central plane anchored on the median; **34 per pylon** = 17 levels per side; red | [C] count, [R] layout | Người Quan Sát ("34 dây văng ở mỗi đầu nhịp"); pixel count of 17 levels per side in `tp-4-2` |
| Stay layout | Pylon anchors over 0.25–0.73 of the pylon height (about 6.9–20.1 m). Deck anchors about 26 → 89 m from the pylon on both sides. About 40 m unstayed at mid-span. Near-parallel but slightly fanned (semi-fan) | [R] | `tp-2` (outer stays 89.7 / 87.5 m from the pylons, span-relative so foreshortening cancels), `tp-4-1` |
| Possible twin stays | On one side of `tp-4-2` each stay level shows as a pair 7 px apart. They may be two stays side by side (z about ±0.5 m), or a highlight artefact. Not modelled | [R] low | |
| Girder | Single box with wide cantilevers, **haunched**: about 9.5 m deep at the pier, about 4 m at mid-span | [R] | `tp-4-1`, `tp-2` |
| Deck profile | About 2 % grade falling outward at the pylons; mid-span about 1.2 m above the pylon deck. This gives a parabola over the 458 m unit with a crest of about 5 m | [R] | `tp-2` |
| Pier | **Twin longitudinal wall piers**, each about 5 m (x) × about 8 m (z) [E for z], about 1.5 m apart | [R] | `tp-4-1`, `tp-2`, `nqs13` |
| Foundation | **34 bored piles Ø2 m, 83.7 m deep**. Octagonal (chamfered rectangle) cap of about 30 × 22 m with a low plinth, top about 4.2 m above the water | [C] piles, [R] cap | Đạt Phương, Báo Tin tức; `tp-4-1`, `tp-3a`, `nqs13` |
| Colours | White/light-grey concrete pylon, deck and piers; **red stays** (not red pylons, as the seed `pylons=` string says) | [C] | all photos |
| Dates | Started 26/3/2022; closure 30/4/2025; first technical opening 2/9/2025 (Báo Đầu tư); route opening 30/4/2026 (VnExpress); official operation 30/7/2026 (Báo Lâm Đồng) | [C] | as named |

## 2. Heights: why 27.5 m and not 32 m

There are two independent side photos taken from water level with vertical columns, so camera tilt is small. They give:

| Photo | Pylon above deck (px) | Deck at pylon → water (px) | Ratio |
|---|---|---|---|
| `tp-4-1` | 253 | 392 | 0.645 |
| `tp-3a` | 207 | 350 | 0.59 |

The press figures (32 + 40 = 72) imply a ratio of 0.8. The photos rule that out. Taking the robust 72 m water-to-tip [C] and a ratio of about 0.62 gives:

- **pylon ≈ 27.5 m above the deck**
- **deck ≈ 44.4 m at the pylons**

This agrees with the 40 m clearance [C]: mid-span deck 45.5 m − about 4 m girder ≈ 41.5 m soffit ≥ 40. It also agrees with `tp-2`, where the span-relative scale gives at most 31 m above the deck (an upper bound, because the view is a little oblique).

The press "40 m" is the navigation clearance, and "72 = 40 + 32" looks like a journalist's sum. Keep 32/34 m in the notes as press values.

**Deck in engine terms:**

- E (unit ends) = **40.5**, crest **5.0**.
- Crest at the pylons = 5 · (1 − (109/229)²) = 3.87, so the pylon deck is **44.4**.
- Mid-span deck is **45.5**.
- Tip = 40.5 + 3.87 + 27.5 = **71.9 m** ✓.
- Navigation check: 45.5 ≥ 40 + 4.0 + 1 = 45.0, so E is not raised.

## 3. Current model vs reality (prioritised)

| P | Field | Current | Target | Conf |
|---|---|---|---|---|
| P0 | `pylon_custom` | Transverse A (legs at z ±10 → apex 32) + king-post 16–36 + single 8 m pier column to −40 | **Longitudinal A median shaft** (legs at x ±3.1 → tip 27.5), solid fill strut above the opening, twin wall piers, pile cap (§4) | [C]/[R] |
| P0 | `pylon_heights_m` | 32 (drawn head 36) | **27.5** above deck (tip 72 m from water) | [C] total, [R] split |
| P0 | `cable_pattern` / count | harp, default count | **semi_fan, `cables_per_side: 17`**, `main_stay_deck_m` and `back_stay_deck_m` **[26, 89]**, anchor zones 6.9–20.1 m (main on the +x leg, back on the −x leg) | [C] count, [R] |
| P1 | `deck_elevation_m` | 40 (flat deck) | **40.5** | [R] |
| P1 | `deck_crest_m` | none | **5.0** | [R] |
| P1 | `nav_clearance` | none | **NAV `cau-thuan-an`: `nav(40, None, "5,000 DWT; 218 m navigation span", <Đạt Phương URL>)`** | [C] |
| P1 | `deck_depth_m` | default 3.6 | **4.0** (mid-span value; real haunch to about 9.5 m needs G17) | [R] |
| P1 | haunched girder | — | engine gap **G17** (§5) | [R] |
| P1 | pile cap | none (the engine's generic pier only) | `pile_cap` 30 × 22 m, top_y −36.7, thickness 5.5 (§4 note on the crest mapping) | [R] |
| P2 | text | `pylons=` "A-shaped red pylons, ≈40 m"; shape-file `pylons_vi/en` "A-topped, 32 m" | §6 strings | [C] |
| P2 | sources / images | 2 press links | add Tiền Phong, VnExpress (thông xe), Báo Xây dựng, Đạt Phương, Người Quan Sát; optionally `press()` image `tp-4-1` (cdn.tienphong.vn URL from the article) | |
| P2 | octagon cap, mast, twin stays | — | not modelled; possible engine nice-to-haves (§5) | |

## 4. Target `model3d` (complete; goes into `research/shapes/cau-thuan-an.json`)

I prototyped and rendered this exactly in the scratch copy.

```json
{
  "spans_m": [120, 218, 120],
  "pylon_shape": "A",
  "pylon_heights_m": [27.5, 27.5],
  "pylon_height_ref": "above_deck",
  "deck_elevation_m": 40.5,
  "deck_crest_m": 5.0,
  "deck_depth_m": 4.0,
  "cable_planes": 1,
  "cable_pattern": "semi_fan",
  "cables_per_side": 17,
  "main_stay_deck_m": [26, 89],
  "back_stay_deck_m": [26, 89],
  "deck_width_m": 23.5,
  "deck_type": "concrete",
  "extradosed": true,
  "pylon_colour": "white",
  "stay_colour": "red",
  "confidence": "estimated",
  "notes": "Main unit 120 + 218 + 120 m (pylons on T26/T27), extradosed PSC box girder, haunched (≈9.5 m deep at the pylons, ≈4 m at mid-span), deck 23.5 m on the main unit (20 m elsewhere), 4 lanes. Navigation clearance 40 m (5,000 DWT). Pylons: 'A along the bridge axis' — a single tapered concrete shaft in the median, splitting into two legs fore-and-aft with a ≈3 × 4.6 m opening at deck level, ≈27.5 m above the deck to the concrete tip (+≈3 m lightning mast); 72 m from the water to the tip (press). Press quotes 32 m (Tiền Phong / Đạt Phương) and 34 m (Người Quan Sát) for the pylon; two side photos give pylon : deck-above-water ≈ 0.6, which with the 72 m total puts the deck at ≈44.4 m at the pylons and the pylon at ≈27.5 m. One central plane of 17 red stays per side (34 per pylon, Người Quan Sát), anchored in the pylon over 6.9–20.1 m and on the median from 26 to 89 m from the pylon (≈40 m of the main span unstayed). Below the deck twin wall piers (longitudinal pair) on an octagonal cap of 34 Ø2 m bored piles (83.7 m). Deck ≈40.5 m above water at the unit ends, ≈44.4 m at the pylons, ≈45.5 m at mid-span.",
  "pylon_custom": {
    "description": "'Chữ A theo phương dọc cầu': each pylon is one tapered concrete shaft on the bridge centreline (median). Seen from the side it is an A: two legs fore and aft (x ≈ ±3.1 m at the deck, 3.0 m thick along the bridge, 3.4 m wide across) lean in to a narrow tip 27.5 m above the deck, with a 3 × 4.6 m opening at deck level; above the opening the shaft is solid. Seen along the bridge it is a narrow 3.4 → 2.6 m column. One central plane of red semi-fan stays anchors in the main-side and back-side faces. Below the deck, twin longitudinal wall piers (5 m along the bridge × 8 m across, 1.5 m apart) stand on an octagonal pile cap ≈30 × 22 m whose top is ≈4.2 m above the water.",
    "legs": [
      {"centerline": [[-3.1, -0.5, 0], [-2.05, 9.0, 0], [-1.03, 18.25, 0], [0, 27.5, 0]], "width_base_m": 3.4, "width_top_m": 2.6, "depth_base_m": 3.0, "depth_top_m": 2.6},
      {"centerline": [[3.1, -0.5, 0], [2.05, 9.0, 0], [1.03, 18.25, 0], [0, 27.5, 0]], "width_base_m": 3.4, "width_top_m": 2.6, "depth_base_m": 3.0, "depth_top_m": 2.6},
      {"centerline": [[-3.25, -36.7, 0], [-3.25, -20.0, 0], [-3.25, -2.0, 0]], "width_base_m": 8.0, "width_top_m": 8.0, "depth_base_m": 5.0, "depth_top_m": 5.0},
      {"centerline": [[3.25, -36.7, 0], [3.25, -20.0, 0], [3.25, -2.0, 0]], "width_base_m": 8.0, "width_top_m": 8.0, "depth_base_m": 5.0, "depth_top_m": 5.0}
    ],
    "struts": [
      {"a": [0, 4.6, 0], "b": [0, 27.5, 0], "width": 2.6}
    ],
    "pile_cap": {"length_x_m": 30, "width_z_m": 22, "top_y_m": -36.7, "thickness_m": 5.5},
    "anchor_zone": [
      {"y_from_m": 6.9, "y_to_m": 20.1, "leg": 1, "side": "main"},
      {"y_from_m": 6.9, "y_to_m": 20.1, "leg": 0, "side": "back"}
    ],
    "mirror_for_other_pylons": true,
    "reference_images": [
      "https://tienphong.vn/chiem-nguong-cau-day-do-vuot-cua-bien-dai-nhat-mien-trung-post1810259.tpo",
      "https://vnexpress.net/thong-xe-cau-vuot-cua-bien-dai-nhat-mien-trung-5068581.html",
      "https://nguoiquansat.vn/ngay-mai-cau-vuot-cua-bien-dai-nhat-mien-trung-chinh-thuc-thong-xe-240880.html"
    ]
  }
}
```

Notes on the JSON:

- **Leg orientation.** `sweepRect` puts *width* across the bridge (z) and *depth* in the x–y plane. So the A legs are 3.4 m across × 3.0 m along, and the pier walls are 8 m across × 5 m along.
- **The fill strut** (y 4.6 → 27.5, 2.6 m square) closes the gap between the legs above the opening. It also squares off the tip, so there is no V-notch at the apex. Its z-width of 2.6 is just under the legs' 3.4–2.6 m and reads as the shallow groove in the real shaft face.
- **Below-deck y values are local.** The engine folds the crest into below-deck y as `(E + ly)·(1 + crest_p/E)`. The waterline is therefore local −E = −40.5, and a real cap top 4.2 m above the water is local **−36.7**. I checked this in the render: the cap shows about 4 m of freeboard. Do not "correct" it to −40.2.
- **Anchors.** The per-side zones put main stays on leg 1 (+x, toward the main span) and back stays on leg 0. The legs' z is 0, so the stays stay in the single central plane. `mirror_for_other_pylons` handles T27.

### Generator changes this needs (`scripts/gen_bridges.py`)

1. **Remove the round-1 overrides.** These are the `REVIEW_R1["cau-thuan-an"]` entry, its `pylon_custom` assignment and the `del`. REVIEW_R1 is applied last. Its `set` would otherwise overwrite both `deck_elevation_m` (with 40) and the whole `pylon_custom` with the round-1 king-post, and it currently does exactly that. Move any note text into the shape file.
2. **`EXPECT_R1["cau-thuan-an"]`.** Change it to `{"pylon_colour": "white", "stay_colour": "red", "deck_elevation_m": 40.5, "deck_crest_m": 5.0, "cables_per_side": 17, "cable_pattern": "semi_fan", "main_stay_deck_m": [26, 89]}`, or add an equivalent round-10 assert block.
3. **G15/G16 opt-in assert** (`assert b["id"] == "cau-phuoc-an" or not ({"deck_closed", "main_stay_deck_m"} & set(m))`). Allow `cau-thuan-an` for `main_stay_deck_m` only. It must not get `deck_closed`, because it is `completed`.
4. **NAV.** Add `"cau-thuan-an": nav(40, None, "5,000 DWT; 218 m navigation span", "https://datphuong.com.vn/tin-tuc/cau-thuan-an-thong-xe-ky-thuat-dau-an-nguoi-dat-phuong-tren-cong-trinh-vuot-bien-dai-nhat-mien-trung")`.
5. **M3D fallback.** Bring it in step with the shape file: semi_fan, cps 17, `[27.5, 27.5]`, and a note pointing to the shape file.
6. **Seed `add()`.** Set `pylons="2 white median pylons, A along the bridge axis, 72 m from the water"` and `span_arrangement="120 + 218 + 120 m"`. Add sources: Tiền Phong, Báo Xây dựng, Đạt Phương, VnExpress 5068581, Người Quan Sát 240880. In `notes`, record the technical opening on 2/9/2025, the route opening on 30/4/2026 and official operation on 30/7/2026. `opened` stays 2026 per the client rule (`opened` = year opened to traffic); mention the 2025 bridge-only opening in the notes.

## 5. Engine gaps

**G17 (P1): haunched (variable-depth) box girder.** Extradosed girders here are about 2.4× deeper at the pylons than at mid-span. This is the most visible remaining difference in every side view (`tp-4-1`, `tp-2`). Spec:

- `deck_haunch?: { depth_at_pylon_m: number; length_m: number }`. For Thuận An: `{ "depth_at_pylon_m": 9.5, "length_m": 85 }`.
- For each pylon station p and each side, at distance s = |x − p| < `length_m` (clamped to half-way to the next pylon on the main side, and to the unit end on the back side), the girder depth is `deck_depth_m + (depth_at_pylon_m − deck_depth_m) · (1 − s/length_m)²`. The deck top is unchanged; only the soffit drops.
- Only the box section is affected. Truss decks ignore it with a warning.
- The nav check keeps using `deck_depth_m` at the centre of the widest main span (the haunch is 0 there whenever `length_m` ≤ half the span). Warn if the haunch reaches mid-span.
- Approach slabs are not haunched. Bounds/NaN checks as for other deck meshes.
- Acceptance: in an az 0 / el 3 view of pylon0, the soffit at the pier sits about 9.5 m below the deck top and blends smoothly to 4 m by about 85 m out.

**P2 nice-to-haves (do not block):**

- `pile_cap.chamfer_m` for octagonal caps.
- A thin lightning mast (a strut already approximates it, but struts may enlarge bounds and labels, so I left it out).
- Twin stays per level at z ±0.5 m in a single "plane" (uncertain; needs a better photo).

## 6. Text

- `pylons_vi`: "2 tháp bê tông trắng hình chữ A theo phương dọc cầu (một thân thon giữa dải phân cách, chân tách trước – sau), cao ≈27,5 m trên mặt cầu, 72 m từ mặt nước; dây văng đỏ một mặt phẳng"
- `pylons_en`: "2 white concrete pylons, an A along the bridge axis (one tapered median shaft with fore-and-aft legs), ≈27.5 m above the deck, 72 m above the water; one central plane of red stays"
- Shape-file `colour`: "white pylons and deck; red stays".
- `review` / `checklist`: update to reflect the side-photo review. The legs, merge height, stays, foundations and proportions are now "checked against Tiền Phong side photos".

## 7. Acceptance criteria

Render with your own server, e.g. `npx vite --host 127.0.0.1 --port <p> --strictPort` and `--url`. No new warnings for this bridge.

1. **`--az 0 --el 3 --target pylon0`** (vs `tp-4-1`):
   - The pylon is a narrow A in elevation, with an opening at deck level about 3 m wide and 4.5 m tall, a solid shaft above it, and a flat narrow tip with no V-notch.
   - Pylon above deck : deck-to-water is about 0.6 (0.55–0.70).
   - Twin wall piers with a narrow gap stand on a cap showing about 4 m above the water.
   - 17 red stays per side, near-parallel, leaving the shaft between about 0.25 and 0.73 of its height.
2. **`--az 90 --el 3 --target unit`** (vs `nqs11`): along the axis the pylon is a slim column about 3 m wide in the median, with one stay plane. There are no legs at the deck edges.
3. **`--az 160 --el 30 --target pylon0`** (vs `nqs13`): the stays land on the median centreline, from about 26 m to about 89 m from the pylon on both sides. The cap is wider than the pier.
4. **`--az 325 --el 12 --target unit`** and `side` (vs `vne_thongxe`, `tp-2`): two A-shafts with red single-plane fans, about 40 m of unstayed deck at mid-span, and a gently crested deck with the mid-span slightly higher than at the pylons.
5. **Data checks:**
   - `data/bridges.json` → `deck_elevation_m` 40.5, `deck_crest_m` 5, `cables_per_side` 17, `nav_clearance.height_m` 40.
   - Label / drawn tip ≈ 72 m from the water (40.5 + 3.87 + 27.5).
   - E is not raised by the nav check.
   - No REVIEW_R1 king-post geometry remains.
6. **With G17:** the soffit at the pier is about 9.5 m below the deck top, tapering to 4 m. Without G17 (if deferred), everything else must pass and G17 is logged as open.

## 8. Sources

- Tiền Phong, "Chiêm ngưỡng cầu 'dây đỏ' vượt cửa biển dài nhất miền Trung": https://tienphong.vn/chiem-nguong-cau-day-do-vuot-cua-bien-dai-nhat-mien-trung-post1810259.tpo. 32 m pylon, 72 m water-to-tip, 50 piers, 218 m, "cao 40 m". Source of the 21 photos.
- Báo Xây dựng: https://baoxaydung.com.vn/thua-thien-hue-quyet-tam-thong-tuyen-cau-vuot-cua-bien-thuan-an-trong-nam-2024-370939.html. Span arrangement (120 + 218 + 120), approach units, T26/T27.
- Đạt Phương: https://datphuong.com.vn/tin-tuc/cau-thuan-an-thong-xe-ky-thuat-dau-an-nguoi-dat-phuong-tren-cong-trinh-vuot-bien-dai-nhat-mien-trung. Clearance 40 m, 218 m navigation span, 32 m / 72 m, 34 piles Ø2 m × 83.7 m, deck 20–23.5 m.
- Người Quan Sát: https://nguoiquansat.vn/ngay-mai-cau-vuot-cua-bien-dai-nhat-mien-trung-chinh-thuc-thong-xe-240880.html. 34 stays per end, A-pylon 34 m, total 72 m, deck > 40 m above the sea. Dân Việt photos `nqs11`, `nqs13`.
- VnExpress: https://vnexpress.net/hop-long-cau-vuot-cua-bien-thuan-an-4880564.html (closure 30/4/2025, 23.5 m main spans) and https://vnexpress.net/thong-xe-cau-vuot-cua-bien-dai-nhat-mien-trung-5068581.html (opening 30/4/2026, 4 lanes; photo `vne_thongxe`).
- Báo Tin tức / TTXVN: https://baotintuc.vn/co-ban-hoan-thanh-tuyen-duong-ven-bien-va-cau-vuot-cua-bien-thuan-an-post848232.html. 20 m, 4 lanes, 5,000 t ships.
- Báo Lâm Đồng (existing): official operation 30/7/2026.
- The "theo phương dọc cầu" wording came from a search-engine excerpt that I could not re-locate verbatim. The longitudinal A is nevertheless certain from the photos.
