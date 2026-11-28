# 3D model review: round 8, Cầu Tứ Liên (`cau-tu-lien`), 2026-11-28

The user asked for a revision and supplied the **official render**, which is authoritative for the pylon form. **Confirmed: the current pylon is wrong.** Today the model has legs that *merge* at about 38 % and then split into two thick, twisted blades. The real pylon is a **diamond-X**:

- The two legs **cross** each other in an X above the deck.
- Each leg continues past the crossing and becomes the **opposite** slender upper post.
- The two posts are parallel, about 8.5 m apart, joined by a short link near the top, with flat tops at staggered heights.

A second finding comes from the **general elevation drawing** that VOV published (6/2026). It gives exact spans, stay count and stay spacing, pylon top level, navigation box and **auxiliary piers**. The current model has none of these.

**No client-confirmed conflict.** This record has no `client-confirmed` value. The earlier "client feedback 11/2026" pylon *interpretation* (merge plus twisted blades with 170/155 m tops) is superseded by the user's render; it was a misreading of the same design. Spans 250 + 500 + 250, 1,000 m, 43 m deck and 185 m all stay correct.

Reference images are in scratchpad `ref/tl/` (`/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/ref/tl/`):

| File | What it is |
|---|---|
| `user-official-render.png` | **The user's official render. Authoritative for the form.** Low river-level view from the start-end side span. Crops: `u_near_lower.png` (diamond foot, knee, under-deck crossbeam), `u_cross.png` (the X crossing), `u_near_upper.png` (posts, link, staggered tops), `u_far.png` (whole far pylon) |
| `vov_section.jpg` | **General elevation drawing** (VOV, "Sơ đồ mặt cắt điển hình cầu chính"). Spans 50 + 200 + 500 + 200 + 50, stays 18 × 12 m = 216 m per fan, top +185.000, navigation box 80 × 10, H5% +9.55, H1% +13.20. Crops: `s_p37.png`, `s_left.png`, `s_mid.png` |
| `vov_render.jpg`, crop `v_side.png` | VOV render at sunset. The right pylon is seen nearly along the axis: staggered post tops, posts slightly offset along the bridge, single tapered leg below the deck |
| `bld_render.jpg`, crop `b_pylons.png` | Báo Lâm Đồng aerial render. Legs at the deck stand just outside the deck edges; X crossing at about 0.39 of the above-deck height |
| `cafef_constr.jpg`, `soha1.jpg`, `vov_*.jpg` | Construction photos (P37/P38 lower pylon on cofferdams, 2026) |

Baselines (current model): scratchpad `views-tl/`, including `cau-tu-lien-custom-az-68-el-3-pylon0.png`.

Prototype of the target (rendered from a scratch copy of the repo; the project is untouched): scratchpad `tlwork/r3/`. `tlwork/compare.png` shows four panels: user render, current, target, and target foot view. The exact JSON is in `tlwork/target.json`.

Confidence tags: **[C]** confirmed by a source · **[D]** read from the official drawing · **[R]** measured on the official render · **[E]** estimated.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Status | Under construction. Started **19/5/2025**. End-10/2026: 26.85 % of contract value; pylons P37 at 6/37 lifts, P38 at 5/37. Main-span closure target **30/7/2027**, opening **10/10/2027**. Current data is correct. | [C] | [Soha 12/11/2026](https://soha.vn/sieu-cong-trinh-gan-20000-ty-dong-so-huu-thiet-ke-van-xoan-doc-dao-do-lien-danh-vingroup-cua-ty-phu-pham-nhat-vuong-xay-dat-tien-do-ra-sao-sau-hon-mot-nam-khoi-cong-198261112162043713.htm), [VOV](https://vov.gov.vn/toan-canh-cau-tu-lien-bieu-tuong-moi-ben-song-hong-cua-ha-noi-dang-thanh-hinh-dtnew-1150575) |
| Main bridge | **1,000 m** cable-stayed, main span **500 m**, steel girder (erected as balanced cantilevers with "thiết bị lắp hẫng dầm thép"), 2 stay planes | [C] | VOV, Soha |
| Spans / piers | **P36 – 50 – P36-1 – 200 – P37 – 500 – P38 – 200 – P39-1 – 50 – P39**. This is 250 + 500 + 250 with **one auxiliary pier in each side span, 50 m from the end pier** (stations 50 and 950) | [D] | `vov_section.jpg` |
| Deck | 43 m wide: 6 motor lanes, 2 mixed lanes, footpaths; 80 km/h | [C] | VOV, Soha |
| Deck level | Datum (Hòn Dấu) levels: about **+24.5 at the end piers**, about **+25.6 at the pylons**, **+26.2 at mid-span**. That is a vertical curve of about 1.7 m | [D] (small text, ±0.3) | `s_left.png`, `s_mid.png`, `s_p37.png` |
| Water / flood | H5% = +9.55, H1% = +13.20, Hmin ≈ −1.09. **Model the water at datum 0** (dry-season level is about +1 to +3; say so in the notes) | [D] | drawing |
| Navigation | Box **80 m wide × 10 m high** (above the design flood level H5%), centred in the main span | [D] | `s_mid.png` |
| Pylon top | **+185.000** (datum). The "185 m" in the press is the top level. The drawn height above deck at the pylon is 185 − 25.6 ≈ **159.4 m** | [C] 185, [D] level | Tiền Phong, VOV, drawing. Kenh14 / Soha's "158 m" is the 2024 WATG "dragon" competition scheme (60 m, 8 lanes), which was **not built**. Ignore it. |
| Pylon form | **Diamond-X**, described as "trụ tháp hình kim cương với hai thân tháp đan chéo" (search summary of press). Details in §1.1 | [R] | user render, `vov_render.jpg`, `bld_render.jpg` |
| Stays | **19 per side per plane per pylon** (counted on the drawing: 19 deck anchors between 28 m and 244 m from the pylon), 12 m spacing, **152 stays in total**. Semi-fan concentrated high on the posts. White | [D] count, [R] colour | `vov_section.jpg` ("28 + 18×12 = 216 + 12 (closure) …", "6 + 216 + 28" on the back side) |
| Stay anchor zone on the posts | Local y ≈ **92 → 141 m** above the deck (drawing 90–141; render 0.59–0.89 of the above-deck height) | [D]/[R] | `s_p37.png`, `u_near_upper.png` |
| Foundations | Bored piles **D2.5 m, about 65 m long**. Pile-cap top ≈ +0 to +2 in the drawing, about 30 m along the bridge. In the render the caps are submerged (legs enter the water separately) | [C] piles, [D] cap | [Tiền Phong](https://tienphong.vn/toan-canh-tien-do-sieu-du-an-cau-tu-lien-gan-20000-ty-dong-post1835217.tpo), drawing |
| Colours | Pylons warm white / cream; stays white; steel deck grey with a dark soffit | [R] | user render |
| Approach piers | Y-shaped: one column splitting into a V under the deck | [R] | user render (bottom left) |

### 1.1 Pylon geometry (pylon-local frame: x along the bridge, + toward the main span; y up from the deck at the pylon; z across, deck edges at ±21.5)

All ratios were measured on both pylons of the user render, and the two agree within 0.02. Above-deck height H = 159.5.

| Element | Render observation | Model value |
|---|---|---|
| Feet | Two separate feet entering the water, **closer together than the knees** (feet/knee spacing 0.42–0.57) | z = ±16 at the waterline (y = −25) |
| Lower legs | Straight, splaying outward going up, about 37° from vertical | (±16, −25) → (±24.5, −17) → knee |
| Knee | A sharp change of slope **just outside the deck edges**, at the crossbeam level, below the deck | **(±33, −8.5)**. Knee half-spacing / (crossing − knee height) = 0.47 ([R] 0.47–0.53; the aerial puts the legs right at the deck edges, so do not go wider) |
| Under-deck crossbeam | A deep transverse beam between the knees, carrying the girder; its top is just under the soffit; ≈ 8–9 m deep | strut (0, −8.5, ±31.5), width 8 (square, so it is 8 m deep and 8 m along the bridge) |
| Upper legs | Straight, leaning inward through the deck plane | knee → crossing |
| **Crossing (X)** | Legs **cross** at the centreline at **0.39–0.42 H** | **(0, 62, 0)**. The two leg sweeps intersect there; this is intended |
| Post base | ≈ 12 m above the crossing, each leg bends to vertical **on the opposite side** (leg from −z ends at the +z post) | (±1.5, 74, ±4.25) |
| Posts | Two slender parallel vertical posts; centre-to-centre ≈ **0.16 × knee spacing** → **8.5 m**, slot ≈ 4 m. Seen along the axis (`v_side.png`) they are offset ≈ 3 m along the bridge (the "twist") | z = ±4.25; x = ∓1.5 / ±1.5; section 5.0 → 4.5 across × 8.5 → 7.5 along |
| Tops | Flat, **staggered**: the lower top is at **0.94 H** | tall post (z = −4.25) tip **159.5**; short post (z = +4.25) tip **150** |
| Link | Small horizontal link between the posts, **just below the lower top** (0.91 H) | strut y = 145, width 3 |
| Stays | One plane per post, inclined from the post (±4.25) to the deck edge (±21.5); the stays sit inside the diamond | anchor zones on legs 2 and 3, y 92–141 |
| Section | Lower legs visibly heavier than the posts | legs 8.0 → 5.5 across × 11 → 8.5 along |

With the target camera (§5), the taller post appears on the **left** of the near pylon, as in the render. Mirroring is in x only, so both pylons keep the tall post at −z, which matches the render (both pylons show their taller post on the left).

## 2. Current vs reality

| P | Problem | Current | Expected |
|---|---|---|---|
| **P0** | Pylon form: legs merge at 38 % and then split into twisted blades; this reads as a different bridge | `PYLON["cau-tu-lien"]` (gen_bridges.py ~l.671): 2 legs merging at y 65, plus 2 blades (8.5 × 12.75, twist ±18°) with tops 160 / 146 | **Diamond-X**: legs cross at y 62, opposite parallel posts, link, staggered tops (§3) |
| **P0** | `REVIEW_R1["cau-tu-lien"]` has `scale_y: 0.94`, which would rescale the new geometry | l.912 | **Remove `scale_y`**. The new geometry is already at the real scale (label 185.3) |
| P1 | No under-deck crossbeam; no knee | none | strut at y −8.5, width 8 |
| P1 | No auxiliary piers | none | `auxiliary_piers_m: [50, 950]` |
| P1 | Stay count 18; back-stay range is derived | `cables_per_side: 18` | **19**, plus `back_stay_deck_m: [28, 244]` |
| P1 | Pylon grey, stays blue | defaults | `pylon_colour: "#e8e0cc"`, `stay_colour: "white"` |
| P1 | Deck elevation 25, no crest | 25 | `deck_elevation_m: 24.5`, `deck_crest_m: 1.7` (pylon deck ≈ 25.8, mid-span 26.2) |
| P2 | No navigation clearance | none | NAV: height 10, width 80 (see §3.3) |
| P2 | Leg/blade sections too blocky at the top (12.75 m deep blades) | | posts 5 × 8.5 → 4.5 × 7.5 |
| P2 | No pile cap (legs end in the water) | none | submerged cap, top at the waterline |
| P2 | Texts: `pylons`, `pylons_en`, M3D notes ("client feedback … twisted blades"), shape-file checklist | | §3.4 |

## 3. Data changes

### 3.1 Target `model3d` (keys to set / replace)

This was verified in a scratch copy: the generator passes and renders with no warnings.

```json
"spans_m": [250, 500, 250],
"pylon_shape": "other",
"pylon_heights_m": [185, 185], "pylon_height_ref": "total",
"deck_elevation_m": 24.5,
"deck_crest_m": 1.7,
"auxiliary_piers_m": [50, 950],
"cable_planes": 2, "cable_pattern": "semi_fan",
"cables_per_side": 19,
"back_stay_deck_m": [28, 244],
"deck_width_m": 43.0, "deck_type": "steel",
"pylon_colour": "#e8e0cc",
"stay_colour": "white",
"pylon_custom": {
  "description": "Diamond-X pylon (Tứ Liên official render): two straight legs rise from separate feet in the river, splay outward to a knee just outside the deck edges where a deep crossbeam carries the girder, then lean inward through the deck and CROSS at the centreline (X) ≈ 40% of the above-deck height; each leg continues past the crossing and turns vertical as the opposite upper post. Two slender parallel posts ≈ 8.5 m apart (≈4 m slot), offset ±1.5 m along the bridge (slight twist), with flat tops staggered ≈9.5 m and a short link just below the lower top. Semi-fan stays in two inclined planes from the posts to the deck edges.",
  "legs": [
    {"centerline": [[0,-25.0,-16],[0,-17,-24.5],[0,-8.5,-33],[0,0,-29.0],[0,30,-15.0],[0,62,0],[0.9,68,2.4],[1.5,74,4.25]],
     "width_base_m": 8.0, "width_top_m": 5.5, "depth_base_m": 11.0, "depth_top_m": 8.5},
    {"centerline": [[0,-25.0,16],[0,-17,24.5],[0,-8.5,33],[0,0,29.0],[0,30,15.0],[0,62,0],[-0.9,68,-2.4],[-1.5,74,-4.25]],
     "width_base_m": 8.0, "width_top_m": 5.5, "depth_base_m": 11.0, "depth_top_m": 8.5},
    {"centerline": [[-1.5,74,-4.25],[-1.5,115,-4.25],[-1.5,159.5,-4.25]],
     "width_base_m": 5.0, "width_top_m": 4.5, "depth_base_m": 8.5, "depth_top_m": 7.5},
    {"centerline": [[1.5,74,4.25],[1.5,112,4.25],[1.5,150,4.25]],
     "width_base_m": 5.0, "width_top_m": 4.5, "depth_base_m": 8.5, "depth_top_m": 7.5}
  ],
  "struts": [
    {"a": [0,-8.5,-31.5], "b": [0,-8.5,31.5], "width": 8.0},
    {"a": [-1.5,145,-4.25], "b": [1.5,145,4.25], "width": 3.0}
  ],
  "anchor_zone": [
    {"y_from_m": 92, "y_to_m": 141, "leg": 2},
    {"y_from_m": 92, "y_to_m": 141, "leg": 3}
  ],
  "pile_cap": {"length_x_m": 30, "width_z_m": 48, "top_y_m": -25.0, "thickness_m": 6, "rounded_ends": false},
  "mirror_for_other_pylons": true,
  "reference_images": [
    "https://admin.vov.gov.vn/UploadFolder/KhoTin/Images/UploadFolder/VOVVN/Images/sites/default/files/styles/large_watermark/public/2026-06/cau_tu_lien_ve_dich_22_0.jpg",
    "https://admin.vov.gov.vn/UploadFolder/KhoTin/Images/UploadFolder/VOVVN/Images/sites/default/files/styles/large/public/2026-06/cau_tu_lien.jpg",
    "https://daknong.1cdn.vn/thumbs/1200x630/2026/07/23/img_afa3cf01.jpg"
  ]
}
```

Notes on the JSON:

- **Why the posts are separate legs (2, 3)** and not continuations of legs 0 and 1: anchor-zone plane matching uses the sign of a leg's *average* z (`customZone`). A crossing leg averages to the wrong side, and its stays would then cross between the posts. Keep the anchor zones on legs 2 and 3 only.
- **Do not use `crossbeams_y_m`.** It joins consecutive legs (0–1, 1–2, 2–3), and with four legs it would draw diagonal bars to the post bases. The under-deck beam is the first `strut`.
- **Waterline.** The waterline is local y = −E = −24.5. The feet go to −25 and the cap top is −25, so the cap is just submerged and the feet are hidden, as in the render.
- **Label.** The label is tip + E + crestAt(pylon) = 159.5 + 24.5 + 1.275 = **185.3**, which reads as 185 m.
- **Clearance.** The deck soffit at mid-span (26.2 − ≈4.2) is far above the 10 m navigation box. You should get no warning, and E stays at 24.5.

### 3.2 Generator (`scripts/gen_bridges.py`)

- **`PYLON["cau-tu-lien"]` (~l.671–695).** Replace it with the `pylon_custom` above, and update its comment block. Alternatively, move the model into `research/shapes/cau-tu-lien.json` as a real pass-2 shape and drop the `bid != "cau-tu-lien"` special case at ~l.1002. Either is fine; the PYLON route is the smaller change.
- **`M3D["cau-tu-lien"]` (~l.416).** Set `cps=19`. Replace the notes with: "1,000 m main bridge, 50 + 200 + 500 + 200 + 50 m with an auxiliary pier in each side span (VOV general elevation), 185 m pylons (top level +185.0), 43 m steel deck. Diamond-X pylons per the official render: legs cross above the deck and continue as two parallel posts with a short link near the top and staggered tops. 19 stays per side per plane at 12 m (152 total). Deck levels +24.5 (ends) / +25.6 (pylons) / +26.2 (mid-span); water modelled at datum 0."
- **`REVIEW_R1["cau-tu-lien"]` (~l.912).** Remove `scale_y`. Replace the entry with a `set` holding `deck_elevation_m`, `deck_crest_m`, `auxiliary_piers_m`, `cables_per_side`, `back_stay_deck_m`, `pylon_colour` and `stay_colour` (or put these in M3D/PHASE6). Use the note "r8: diamond-X pylon, spans/aux piers/stays from the VOV general elevation drawing."
- **Text at ~l.1019.** Update `b["pylons"]` / `b["pylons_en"]` (§3.4).

### 3.3 NAV

`"cau-tu-lien": nav(10, 80, "BxH = 80 × 10 m above the 5% design flood level H5% = +9.55 m (general elevation drawing)", "https://vov.gov.vn/toan-canh-cau-tu-lien-bieu-tuong-moi-ben-song-hong-cua-ha-noi-dang-thanh-hinh-dtnew-1150575")`. Confidence [D], medium: the "10" is small rotated text on the drawing.

### 3.4 Bridge fields

- `span_arrangement`: "50 + 200 + 500 + 200 + 50 m"
- `pylons`: "2 tháp kim cương – hai chân đan chéo (chữ X) phía trên mặt cầu, tiếp tục thành hai cột song song nối bằng thanh giằng ngắn gần đỉnh, đỉnh lệch cao; đỉnh tháp +185,0 m"
- `pylons_en`: "2 diamond-X pylons: legs cross above the deck and continue as two parallel posts with a short link near the top and staggered tops; top level +185.0 m"
- `sources`: add the VOV gov article (drawing, deck, lanes), [Tiền Phong](https://tienphong.vn/toan-canh-tien-do-sieu-du-an-cau-tu-lien-gan-20000-ty-dong-post1835217.tpo) (185 m, piles) and Soha 12/11/2026 (progress, 37 lifts).
- `notes`: append "Progress end-10/2026: 26.85 %; pylons P37 6/37 lifts, P38 5/37. The 158 m / 60 m / 8-lane figures belong to the 2024 WATG 'dragon' competition scheme, not the built design."
- `PRESS` images: optionally add the VOV render (`cau_tu_lien_ve_dich_22_0.jpg`, "render") and the elevation drawing (`cau_tu_lien.jpg`, "general elevation").
- `research/shapes/cau-tu-lien.json` (review_only): update the checklist and review entries to say diamond-X, crossing at about 0.39 H, posts plus link, staggered tops, under-deck crossbeam, aux piers.

## 4. Engine gaps

**None required.** Everything above uses existing features: custom legs with depth, `struts`, `pile_cap`, `anchor_zone`, `deck_elevation_m` / `deck_crest_m`, `auxiliary_piers_m`, `back_stay_deck_m`, colours and nav. The prototype rendered with no warnings.

Optional, P2, do not block on these:

- **G13 `pier_shape?: "wall" | "Y"`** for the unit's end and auxiliary piers. For "Y", draw a single column of width 0.2 W from the water to 0.6 h, then two straight arms out to z = ±0.35 W under the deck soffit, each 0.12 W thick, with the pier length along x unchanged. Needed by Tứ Liên (approach piers in the render). Acceptance: in the custom camera below, the end and aux piers read as Y.
- **Sharp knee.** Catmull-Rom rounds the knee at y −8.5 slightly. The render has a crisp kink, but the rounding is acceptable. If wanted, add an optional per-leg `sharp?: boolean` (polyline without smoothing).

## 5. Acceptance criteria (I will re-render)

Cameras:
- `--views front,side,foot,top,three_quarter`
- **`--az -68 --el -3 --target pylon0`**: this matches the user's render (near pylon left of centre, far pylon to the right, taller post on the left, X face-on).
- `--az -72 --el -3 --target pylon0`, a variant of the same.

1. **Diamond-X (P0)**, checked in the front view and the user-render camera.
   - The legs splay outward from separate feet to a knee just outside the deck edges, with a deep crossbeam under the deck.
   - Above the deck the legs lean in and **cross** at the centreline at local y 62 ± 3 (≈ 0.39 H).
   - Each leg continues to the **opposite** post.
   - Two parallel vertical posts, ≈ 8.5 m apart c/c with a visible slot.
   - A small link at y ≈ 145.
   - Flat tops, staggered: 159.5 / 150.
   - Nothing remains of the old merge/twisted blades.
2. **Height.** The pylon label reads 185 m (185.3). The deck is ≈ 25.8 at the pylons and 26.2 at mid-span; E = 24.5; there is no clearance warning.
3. **Stays.**
   - White.
   - 19 per side per plane per pylon.
   - Anchored on the posts between y 92 and 141, in two planes that run from the posts (±4.25) to the deck edges (±21.5).
   - No stay crosses the other plane between the posts.
   - Back stays land 28–244 m from the pylon.
4. **Spans and piers.** Auxiliary piers at stations 50 and 950. Spans 250 + 500 + 250.
5. **Colour.** Cream/white pylons (`#e8e0cc`).
6. **Proportion vs the render**, with the user-render camera:
   - knee half-spacing / (crossing − knee) ≈ 0.47 (± 0.05);
   - post c/c / knee spacing ≈ 0.13–0.17;
   - lower top / taller top ≈ 0.94.
7. **Data.** `scale_y` is gone from `REVIEW_R1`. `span_arrangement`, `pylons` / `pylons_en`, notes, sources and NAV are updated. The generator assertions pass, and `npm test` passes (no engine change expected).

## 6. Open points (no user decision required)

- **Knee spread.** The user render alone suggests knees at about ±36–40 m, which is wide for a 43 m deck. The aerial render (`b_pylons.png`) shows the legs right at the deck edges. ±33 is the compromise; the posts and crossing do not depend on it.
- **Post x-offset (±1.5 m).** This "twist" is read from the near-axial VOV render (`v_side.png`) only [R, low]. If it looks odd, set the offset to 0.
- **Water level.** The model water is datum 0, with the dry season at about +1 to +3. This keeps the label equal to the published 185 m.
