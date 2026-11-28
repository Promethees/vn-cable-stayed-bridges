# 3D model review: round 8, Cầu Ngọc Hồi (`cau-ngoc-hoi`), 2026-11-28

The user flagged this model as wrong and supplied the **official render**, which is authoritative for the design. **Confirmed: the pylon is a completely different form.** The current model shows plain grey H pylons with a high straight crossbeam and blue stays. The real design is the competition-winning **"Cổng Mặt Trời"** (Sun Gate) by Công ty CP Tư vấn Thiết kế Cầu lớn – Hầm (first prize, approved 4/2025). Each pylon has these parts:

- **Two vertical posts** that rise free to separate flat tips, with no top crossbeam. The **outer faces are concrete** and the **inner faces carry red-orange copper cladding**.
- A **red "gate" infill** between the posts, which is not a straight crossbeam:
  - its upper edge is a deep **U** that hangs from high on the posts down to about 28 m above the deck;
  - its lower edge is a round-headed **arch** over the carriageway, with its crown at about 23 m.
- Below about 21 m above the deck, each post **splits along the bridge axis into two splayed concrete legs**, forming an inverted V in elevation, down to the water.

The stays are **golden/amber**, in two planes, semi-fan.

**No client-confirmed conflict.** Nothing on this record is client-confirmed. Spans 165 + 350 + 165, total 680 m, 126 m pylons and 38.3 m width are all confirmed by sources and stay as they are.

The scratchpad paths below are relative to `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/`. References are in `ref/nh/`; the downloads are in `ref/nh/dl/`.

| File | What it is |
|---|---|
| `user-official-render.png` (596 px) = **`dl/ho_885562182_z6.png`** (1280 px, same image) | **User's official render**: daytime aerial, the primary reference. Crops: `a_p1.png`, `a_p2.png`, `a_fan.png`. |
| `dl/bxd_9.jpg` (2560 px), grid crop `bxd9_grid.png` | **Along-axis view from the deck at sunset.** This is the key image for the gate geometry and the two-tone posts. |
| `dl/bxd_2.jpg` = `dl/ho_343354245_z6.png`, crops `bxd2_grid.png`, `s_p1.png`, `s_p2.png` | **Near-elevation from the bank.** Used to scale spans, heights, deck level, the leg split and the anchor zone. |
| `dl/bxd_3.jpg`, crop `bxd3_grid.png` | Low view from a boat. Shows the split concrete legs, the red inner face, and the concrete outer face. |
| `dl/bxd_1,4–8.jpg`, `dl/ho_795683229_z6.png`, `dl/k14_8.jpg` (`k8_near.png`) | Other official renders: aerial, mist, and night views (the night views are lit with chevrons). |
| `dl/k14_1–7.jpg` (sheet `k14_sheet.jpg`) | Construction 10–11/2026. `k14_3` shows the rectangular cofferdam at a pylon. |

The current-model baselines are in `views-nh/` (`side`, `front`, `foot`, `three_quarter`, `top`), plus the custom views `az-40 el30 unit` and `az50 el35 unit`.

Confidence tags: **[C]** confirmed by a source · **[I]** measured from official renders · **[E]** estimated.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Spans | **165 + 350 + 165 = 680 m**, from pier T40 (Km1+677.825) to T43 (Km2+359.025). Two stay planes. | [C] | [vncnec.com.vn project page](https://vncnec.com.vn/vi/du-an-dau-tu-xay-dung-cau-ngoc-hoi/); the elevation render scales to 164 m side spans |
| River piers | "4 trụ ở lòng sông, trong đó 2 trụ tháp chính" (4 river piers, 2 of them pylons): T41 on the Hà Nội side, T42 on the Hưng Yên side. That leaves only the two end piers, so **no auxiliary piers**. | [C] | [Tiền Phong](https://tienphong.vn/cau-ngoc-hoi-noi-ha-noi-voi-hung-yen-tang-toc-thi-cong-hai-tru-cau-thap-day-vang-post1817163.tpo) |
| Width / lanes | **32.3 m between parapets; 38.3 m including the stay-anchor zones.** 6 motor-vehicle lanes + 2 mixed lanes. The 33.0 m figure is the approach-viaduct width (2 × 15.75 m). | [C] | vncnec, Tiền Phong |
| Pylon height | **126 m** ("cao tương đương tòa nhà 40 tầng", as tall as a 40-storey building). The render scales to about 98.5 m above the deck plus about 27.4 m deck-to-water at the pylon, which gives ≈ 126 m. | [C] / [I] | [Kenh14 / CafeF](https://kenh14.vn/toan-canh-cau-day-vang-gan-12000-ty-dong-bac-qua-song-hong-tru-thap-cao-tuong-duong-toa-nha-40-tang-nhip-day-vang-350m-ket-noi-ha-noi-voi-sieu-san-van-dong-lon-thu-2-viet-nam-215261104074107024.chn), [Nhân Dân](https://nhandan.vn/anh-cau-ngoc-hoi-tang-toc-thi-cong-huong-toi-thong-xe-ky-thuat-truoc-apec-2027-post995411.html) |
| Pylon form | The designer's description: "**chân trụ được xử lý tách đôi thành hai nhánh riêng biệt**" (where the pylon meets the water, the base splits into two separate branches, seen along the river); "**hai trụ chính thẳng đứng liên kết với dầm ngang tạo thành hình dáng chữ H**" (two vertical posts joined by a crossbeam form the H); the crossbeam is "**cách điệu với hiệu ứng vòm, mô phỏng hình ảnh cổng chào ở cả phía trên lẫn phía dưới**" (styled as an arch, a welcome gate both above and below); the curved inner surfaces of the posts and the crossbeam are faceted triangles "**ốp gò đồng**" (clad in hammered copper), contrasted with "**bê tông bề mặt bên ngoài thân trụ**" (concrete on the outer face of the posts). | [C] | [Báo Xây dựng 23/4/2025](https://baoxaydung.vn/phuong-an-kien-truc-cau-ngoc-hoi-doat-giai-nhat-co-gi-dac-biet-192250423083854733.htm) |
| Pylon geometry | All values in metres above the deck. **Posts:** vertical; centres at **z = ±21.25**, inner face at ±19.0; about 4.5 m across and 6 → 4.5 m along the bridge; flat tips at **98.5**. **Gate, upper edge (U):** leaves the post inner face at about 55–72, lowest point **27.9** at the centreline. **Gate, arch soffit:** crown **23.2**; springs at ±14.8 at about 3.4 m; solid spandrels between the arch and the posts go down to the deck. **Leg split:** about **21** above the deck. Feet are about ±8 m along x at the pile cap. | [I] | `bxd9_grid.png` (front), `bxd2_grid.png` / `s_p1.png` (elevation) |
| Deck level | The deck soffit in the elevation is 7 px (≈ 4 m) higher at mid-span than at the unit ends, so **crest ≈ 4 m**. The deck is about 27.4 m above water at the pylons, which gives **E ≈ 24.5 m** at the unit ends. | [I] | `bxd_2.jpg` pixel scan |
| Foundations | **40 bored piles Ø 2.0 m, 75 m long** at T41 (80 at both pylons). Cofferdam is rectangular (`k14_3`). With piles at 5 m centres in a 4 × 10 grid, the cap is about **24 m (x) × 50 m (z)**. | [C] piles, [E] cap | Tiền Phong, Nhân Dân |
| Stays | Two planes, semi-fan. Anchored on the posts from about **36 to 87 m** above the deck. Count is about **16 per side per plane** (estimated from the renders, ± 2). Colour **golden/amber** in the user render; orange in the elevation render. | [C] planes; [I] / [E] rest | vncnec; `a_fan.png`, `s_fan.png` |
| Colours | Copper cladding samples at about `#c6553a`–`#d7502a` in the user render; **use `#cf5a32`**. Concrete about `#d9d5cd`. Stays about `#d4a24c`. | [I] | pixel sampling |
| Status | Under construction. Ground-breaking 19/8/2025; all 80 pylon piles done; pile caps and tower lifts were in progress at 11/2026. Target: technical opening before APEC 2027 (some sources say 2028). Current data is correct. | [C] | Nhân Dân, Kenh14 |
| Designer / contractor | Architecture competition first prize: **Công ty CP Tư vấn Thiết kế Cầu lớn – Hầm**. EPC: Liên danh EPC Cầu Ngọc Hồi, package 07/TP3-EPC. Investor: Ban QLDA ĐTXD công trình giao thông Hà Nội. | [C] | Báo Xây dựng, vncnec |

## 2. Current vs reality

| P | Problem | Current | Expected |
|---|---|---|---|
| **P0** | Wrong pylon form: a straight H with a high square crossbeam | built-in `H`, no `pylon_custom` | `pylon_custom` in §3: two free posts, a U-plus-arch gate, splayed lower legs |
| **P0** | Pylon all grey | single concrete colour | Red copper (`#cf5a32`) inner half of the posts and the gate; concrete outer skin, lower legs and pile cap. **Needs G12.** |
| **P0** | No gate infill: the "Sun Gate" is the bridge's signature | — | Gate panel. **Needs G13** (fallback in §4) |
| P1 | Stays are default blue | default | `stay_colour: "#d4a24c"` |
| P1 | Stay count is default | default | `cables_per_side: 16` |
| P1 | Deck elevation is heuristic (35 m) and there is no crest | E = clamp(0.1 × 350) = 35 | `deck_elevation_m: 24.5`, `deck_crest_m: 4`. Deck about 27.4 m at the pylons, 28.5 m at mid-span. |
| P1 | Pylon too short above the deck, and its proportion is wrong | ≈ 91 m above the deck, with E = 35 | tip at local y **98.5**; label reads **126** (98.5 + 24.5 + 2.94 crest) |
| P1 | No pile cap | none | `pile_cap` 24 × 50 m, top at local −23.5 |
| P2 | `width_m` 33 is the approach width | 33 | **38.3** (and say "32.3 m between parapets" in notes) |
| P2 | Text, sources and notes | "2 tháp chữ H, cao ≈126 m"; notes "No render or pylon photo found" | see §3.3 |

## 3. Data changes

### 3.1 `research/shapes/cau-ngoc-hoi.json` → `model3d`

The pylon local frame is: y = 0 at deck level, x along the bridge, z across it.

Each post is modelled as **two abutting legs**:

- an inner **red copper** leg, z 19.0 → 21.5;
- an outer **concrete skin** leg, z 21.5 → 23.5.

The tips are 2.25 m apart, so they do not "merge" into a crown (the threshold is 1.5 m). Stays anchor on the inner legs (legs 0 and 1). The splayed lower legs are `struts`. There are **no** `crossbeams_y_m`, because the engine would join legs 0→1→2→3 in order.

```json
"spans_m": [165, 350, 165],
"pylon_shape": "H",
"pylon_heights_m": [126, 126], "pylon_height_ref": "total",
"deck_elevation_m": 24.5,
"deck_crest_m": 4,
"cable_planes": 2, "cable_pattern": "semi_fan", "cables_per_side": 16,
"deck_width_m": 38.3,
"stay_colour": "#d4a24c",
"pylon_custom": {
  "description": "'Cổng Mặt Trời' H pylon: two vertical posts rising free to flat tips, copper-clad (red) on their inner faces and concrete outside; between them a red gate whose upper edge is a deep U hanging from high on the posts to ≈28 m above the deck and whose lower edge is a round-headed arch over the carriageway (crown ≈23 m); below ≈21 m above the deck each post splits along the bridge into two splayed concrete legs down to a rectangular pile cap.",
  "legs": [
    {"centerline": [[0,19,-20.25],[0,60,-20.25],[0,98.5,-20.25]], "width_base_m": 2.5, "width_top_m": 2.5, "depth_base_m": 6.0, "depth_top_m": 4.5, "colour": "#cf5a32"},
    {"centerline": [[0,19,20.25],[0,60,20.25],[0,98.5,20.25]],   "width_base_m": 2.5, "width_top_m": 2.5, "depth_base_m": 6.0, "depth_top_m": 4.5, "colour": "#cf5a32"},
    {"centerline": [[0,19,-22.5],[0,60,-22.5],[0,98.5,-22.5]],   "width_base_m": 2.0, "width_top_m": 2.0, "depth_base_m": 6.0, "depth_top_m": 4.5},
    {"centerline": [[0,19,22.5],[0,60,22.5],[0,98.5,22.5]],      "width_base_m": 2.0, "width_top_m": 2.0, "depth_base_m": 6.0, "depth_top_m": 4.5}
  ],
  "struts": [
    {"a": [-8,-23.5,-21.25], "b": [0,21,-21.25], "width": 4.5},
    {"a": [ 8,-23.5,-21.25], "b": [0,21,-21.25], "width": 4.5},
    {"a": [-8,-23.5, 21.25], "b": [0,21, 21.25], "width": 4.5},
    {"a": [ 8,-23.5, 21.25], "b": [0,21, 21.25], "width": 4.5}
  ],
  "panels": [
    {"depth_m": 5.0, "colour": "#cf5a32",
     "top":    [[-19.5,72],[-18.2,54],[-15.8,41.4],[-12.4,34.6],[-7.4,29.6],[0,27.9],[7.4,29.6],[12.4,34.6],[15.8,41.4],[18.2,54],[19.5,72]],
     "bottom": [[-19.5,0],[-15.0,0],[-14.8,3.4],[-14.2,10],[-13.3,16],[-10,20.3],[-5,22.6],[0,23.2],[5,22.6],[10,20.3],[13.3,16],[14.2,10],[14.8,3.4],[15.0,0],[19.5,0]]}
  ],
  "anchor_zone": [
    {"y_from_m": 36, "y_to_m": 87, "leg": 0},
    {"y_from_m": 36, "y_to_m": 87, "leg": 1}
  ],
  "pile_cap": {"length_x_m": 24, "width_z_m": 50, "top_y_m": -23.5, "thickness_m": 6, "rounded_ends": false},
  "mirror_for_other_pylons": true,
  "reference_images": [
    "https://hanoionline.mediacdn.vn/2025/8/19/10/885562182_z692178457141797b25ad8b3910b52047298b3a4de84cc.webp.png (official aerial = user's render)",
    "https://baoxaydung.mediacdn.vn/603483875699699712/2025/4/23/ea77780faca11fff46b0-1745371882515213675427.jpg (along-axis, gate geometry)",
    "https://baoxaydung.mediacdn.vn/603483875699699712/2025/4/23/7fc16be6bc480f165659-1745371786274445331238.jpg (elevation)",
    "https://baoxaydung.mediacdn.vn/603483875699699712/2025/4/23/043f8dd0447ef720ae6f-1745371800881577308906.jpg (split legs, two-tone post)"
  ]
}
```

Notes:
- **Heights.** E 24.5 + crest at the pylon 4 × (1 − (175/340)²) = 2.94 puts the deck at the pylons at 27.4 m. The tip is at 98.5 above the deck, so the label = 98.5 + 24.5 + 2.94 = **125.9 → "126 m"**. There is no `nav_clearance` on this record, so E is not forced.
- **Pile cap.** Its top at local −23.5 maps to about +1.1 m above water, because the plan mapping stretches the below-deck part by 1 + 2.94/24.5. The strut feet sit on the cap.
- **Panel.** It overlaps the inner legs by 0.5 m (|z| 19.0–19.5), so it reads as one red body with the copper inner faces. Its foot at y = 0 for |z| 15–19.5 forms the spandrel piers standing on the deck edge.
- **Fallback.** If you prefer all-red posts over the two-leg skin, drop legs 2 and 3 and set the widths of legs 0 and 1 to 4.5 (centre ±21.25). That is acceptable for P0, because the user render reads as red posts.
- The shape-file `notes`, `review` and `checklist` should record this round: "r8: official render supplied by the user; Sun Gate form".

### 3.2 Generator (`scripts/gen_bridges.py`)

- The `m3d(...)` seed at line ~424 can stay; the shape file overrides it. Update its notes (drop "side spans are derived": 165 + 350 + 165 is confirmed by vncnec).
- REVIEW_R1 (line ~924) sets `deck_width_m` 38.3, which agrees with the new value. It can stay.

### 3.3 Bridge fields (`add(id="cau-ngoc-hoi", …)`, line ~236)

- `width_m=38.3` (it was 33).
- `span_arrangement="165 + 350 + 165 m"`. This is new.
- `pylons` (VI): "2 tháp chữ H 'Cổng Mặt Trời' cao 126 m: hai cột đứng (mặt trong ốp gò đồng đỏ, mặt ngoài bê tông), dầm ngang dạng vòm cổng (vòm trên chữ U, vòm dưới cổng chào), chân trụ tách đôi"
- `pylons_en`: "2 'Sun Gate' H pylons, 126 m: two vertical posts (copper-clad red inner faces, concrete outside) joined by an arched gate (U above, portal arch below); each post splits into two legs at the base"
- `investor="Ban QLDA ĐTXD các công trình giao thông TP. Hà Nội"`.
- `sources`: add the vncnec page, Báo Xây dựng, Nhân Dân and Kenh14 (all four are linked in §1).
- `notes`:
  - Drop "Width 32.3–38.3 m per source" and replace it with "32.3 m between parapets, 38.3 m incl. stay anchorage (vncnec); approaches 33 m".
  - Add: "Architecture: 'Cổng Mặt Trời', first prize, Công ty CP Tư vấn Thiết kế Cầu lớn – Hầm (approved 4/2025). Pylon piles 40 × Ø2.0 m × 75 m (T41)."
- `model3d.notes`: replace with "Spans confirmed (vncnec). Pylon geometry measured from the official renders (user-supplied aerial, Báo Xây dựng along-axis and elevation renders). Stay count estimated (±2). Gate panel and two-tone posts use G12 / G13."
- Optionally add the official aerial as an image (credit "Hà Nội Online / UBND TP Hà Nội", licence "unknown"), with the URL above.

## 4. Engine gaps

### G12. Per-member pylon colours (P0)

Today `engine.ts:354` renders every pylon sweep and member with a single `pylonMat` (`pylon_colour` or plain concrete). The two-tone design cannot be expressed.

Schema (`types.ts`, `docs/data-schema.md`):
- `PylonCustom.legs[i].colour?: string`
- `PylonCustom.struts[i].colour?: string`
- `PylonCustom.panels[i].colour?: string` (G13)
- optionally `PylonCustom.crossbeam_colour?: string`

All of these take the same named / `#rrggbb` values as `pylon_colour`.

Geometry: carry the colour on the output. For example, `Member.colour?: string`, and replace `Pylon.sweeps: SweepMesh[]` with a parallel `sweepColours: (string | undefined)[]`, or use `SweepMesh & { colour?: string }`. Keep existing consumers and tests working.

Render: each sweep and member uses `this.tinted(M.concrete, colour ?? g.colours.pylon)`, and falls back to `pylonMat` when neither is set. Cache the tinted materials per colour. Pile caps stay plain concrete.

Test: a pylon with one coloured leg produces exactly one sweep carrying that colour. Bridges without per-member colours render unchanged.

### G13. Planar infill panels in the pylon's cross-bridge plane (P0 for the Sun Gate)

Schema: `PylonCustom.panels?: { top: [number, number][]; bottom: [number, number][]; depth_m: number; x_m?: number; colour?: string }[]`

- `top` and `bottom` are polylines of `(z, y)` in the local frame (y above the deck), each with strictly non-decreasing z.
- Both must start and end at the same z (z0, z1).
- `top[k].y ≥ bottom.y` at every z.
- The panel is the region between the two curves for z ∈ [z0, z1], extruded along local x from `x_m − depth_m/2` to `x_m + depth_m/2`. `x_m` defaults to 0.

Mesh:
- Take the union of the z breakpoints of both curves and interpolate each curve linearly. Optionally subdivide each interval into 4 for smoothness; this is not required.
- Build a closed outline: the bottom curve from z0 to z1, then the top curve from z1 back to z0.
- Because the region is z-monotone, triangulate it as quad strips between the two curves on each face (front x−, back x+).
- Add side walls along both curves and end caps at z0 and z1.
- Map every vertex through `toStation`, which mirrors x with `dir` and scales y > 0 by `pylonScale`, exactly like the legs.
- Push the result into the pylon's sweeps, so the data tests' bounds and NaN checks cover it.

Panels do **not** affect `tip` (tip is still taken from the legs), the anchors or the crossbeams. Validate in the generator: equal end z values, and at least 2 points per curve. On invalid input, skip with a warning.

Test: for Ngọc Hồi, one panel mesh per pylon. Its max y is about E + 72 + crest; its min y at z = 0 is about E + 23.2 + crest; no NaN.

**Fallback (only if G13 is deferred):** approximate the gate with two extra legs per pylon from (0, 30, ±19) through (0, 27, ±10) to (0, 25.5, 0). Use `width_base_m` 30 → `width_top_m` 12 (in-plane), depth 5, red. Avoid a perfectly horizontal end tangent: the sweep frame flips at T ∥ z. With this fallback, the leg order changes and the anchor-zone leg indices stay 0 and 1. G13 is preferred.

Everything else uses existing features: custom legs with depth, struts, `pile_cap`, `deck_elevation_m`, `deck_crest_m`, `cables_per_side` and `stay_colour`.

## 5. Acceptance criteria (I will re-render)

Cameras:
- `--views side,front,foot,three_quarter,top`
- **`--az 55 --el 38 --target unit`**: matches the user's official render (`user-official-render.png`). The bridge runs from upper-left to lower-right, with the near pylon at the lower right.
- `--az 55 --el 35 --target pylon0`: pylon close-up for `a_p1.png` / `a_p2.png`.
- `front` preset: matches `bxd_9.jpg` (along the axis).
- `--az 10 --el 2 --target unit`: matches the elevation `bxd_2.jpg`.
- `--az 25 --el 5 --target pylon0`: matches `bxd_3.jpg` (split legs).

1. **Form (front view).** Two vertical posts rise free to flat tips at the same height; there is **no crossbeam at the top**. Between them is a red gate:
   - its upper edge is a smooth **U**, lowest at about 28 m above the deck and rising steeply into the posts above about 50 m;
   - its lower edge is a **round-headed arch** over the carriageway, with its crown at about 23 m;
   - the solid spandrels reach the deck beside the posts.
   The proportions should match `bxd9_grid.png`: post spacing ≈ 0.43 × height above the deck, and the gate's lowest top point ≈ 0.28 H.
2. **Colours (user-render camera).** Posts read **red/copper** from above, together with the red gate. The outer skin of the posts, the splayed lower legs and the pile cap read concrete grey-white. Stays read **golden**, not blue.
3. **Elevation.**
   - Each post splits into an inverted V at about 21 m above the deck. The feet are about 16 m apart along the bridge, on the pile cap at the waterline.
   - Above-deck height ≈ 98.5 m; deck ≈ 27 m above water at the pylons; label "126 m".
   - Spans 165 / 350 / 165; no auxiliary piers.
   - The deck crests about 4 m toward mid-span.
4. **Stays.** Two planes, anchored on the inner (red) legs over about 36–87 m; semi-fan; 16 per side per plane (128 in total); golden.
5. **Foot view.** A rectangular cap of about 24 × 50 m; all four splayed legs stand on it.
6. **Data.**
   - `width_m` 38.3; `span_arrangement` set;
   - `pylons` / `pylons_en`, investor, sources and notes updated;
   - `confidence` stays `needs_check` (the coordinates are still approximate).
7. **Engine.**
   - G12 and G13 are in the schema docs, `types.ts`, the generator's allowed keys, `bridge3d.ts` and `engine.ts`, with tests.
   - `npm test` passes.
   - Re-render one existing custom-pylon bridge (for example `cau-nguyen-trai` or `cau-rach-mieu-2`) and check that it is unchanged.

## 6. Open points (no user decision required)

- **Stay count** (16) is estimated from renders; the press gives no number. It could be 14–18.
- **Copper on the side faces.** The elevation render shows red panels framed by concrete on the faces seen side-on as well. The two-leg skin (inner red, outer concrete) is a schematic compromise that matches the user's aerial and the front view. Fully red posts, the fallback in §3.1, are also acceptable.
- **Tip bevel.** The tips have a slight sloped cap in `bxd_9`. A flat tip is acceptable.
- **The deck is drawn under construction** (partial cantilevers), because the status is `under_construction`. That is correct engine behaviour; compare the pylon form, not the deck completeness, with the render.
