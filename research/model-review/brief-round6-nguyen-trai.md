# 3D model review: round 6, Cầu Nguyễn Trãi (`cau-nguyen-trai`), 2026-11-27

The user reported that the model is wrong. **Confirmed.** The current model is a placeholder: a built-in `H` portal with two cable planes and the generic deck height. The real design is a **"sail" pylon made of three sub-pylons (three columns)**, and its cable system is unusual: **one central plane over the main span and two planes over the side spans.**

Reference images are saved in scratchpad `ref/nt/`:

| File | What it is |
|---|---|
| `user-official-render.png`, crops `user_near.jpg` / `user_far.jpg` | **Primary reference, supplied by the user.** Official aerial night render. |
| `KCCAU-NGUYEN-TRAI-2.jpg`, crop `r2_pylon.jpg` | TEDI near-elevation render of one pylon from the bank |
| `KCCAU-NGUYEN-TRAI-1.jpg`, crop `r1_pylons.jpg` | TEDI aerial |
| `stage_right.jpg` / `stage_left.jpg` | The ground-breaking stage screen (18/12/2024), showing a pylon seen along the bridge axis |
| `dbnd7.jpg` | Construction aerial, 8/2026 |

Current-model baselines are in scratchpad `views-nt/`. The camera matching the user's render is `--az 55 --el 25 --target unit`.

Confidence tags: **[C]** confirmed · **[I]** inferred · **[E]** estimated from render proportions.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Main bridge | **3-span continuous cable-stayed, 125 + 300 + 125 m (550.6 m)**. Full layout 5×35 + 47.1 + 3×63 + 47.1 + **125 + 300 + 125** + 50 + 2×78 + 50 + 6×35 m; total 1,476.4 m. | [C] | [TEDI (designer)](https://tedi.vn/khoi-cong-xay-dung-cau-nguyen-trai-do-tedi-thuc-hien-cong-tac-tu-van-thiet-ke/) |
| Deck | **26.5 m**; 4 motor lanes + 2 mixed lanes; 80 km/h; **prestressed-concrete closed box girder** | [C] | TEDI; [Báo Lâm Đồng](https://baolamdong.vn/cau-nguyen-trai-hon-6200-ty-dong-tai-hai-phong-kien-truc-canh-buom-cao-ngang-toa-nha-40-tang-440415.html) |
| Navigation | **165 m × 25 m** (Sông Cấm); 5,000 DWT vessel impact | [C] | TEDI, [Dân Trí](https://dantri.com.vn/thoi-su/hai-phong-khoi-cong-cau-nguyen-trai-bac-qua-song-cam-20241218182112695.htm) |
| Concept | "Two 111-m towers form two sails reaching out to sea" | [C] | [vietnam.vn ground-breaking article](https://www.vietnam.vn/en/khoi-cong-xay-dung-cau-nguyen-trai) (user-designated official source) |
| **Pylon structure** | **"Three-column towers"**: reinforced-concrete foundation and lower shaft, **composite-steel upper section**, columns **linked by steel bracing at three levels with diagonal connections**. Bored piles (88 for the main bridge). | [C] | TEDI |
| Pylon height | **107.5 m from the top of the pile cap** (TEDI); 111 m in press (probably measured from water or foundation) | [C] | TEDI, vietnam.vn |
| **Stays** | **Semi-fan, 120 cables.** Each side span carries **40 in two planes** (20 per plane). The main span carries **20 per side in one central plane**. | [C] | TEDI |
| Colours | white pylons and stays; grey concrete deck and piers; coloured night lighting (not modelled) | [C] | renders |
| Deck profile | straight in plan, with a clear vertical crest over the main span | [E] | user render, TEDI aerial |
| Status | Under construction since 18/12/2024. As of 4/2026: 32%, 88/88 bored piles, piers T10 and T13 done, the **T11 pylon pile cap** done. The 8/2026 aerial shows the T11 pylon starting inside a cofferdam. Target opening 2/9/2027 (contract to 2/2028). | [C] | Báo Lâm Đồng, [Duyên Hải Land 4/2026](https://duyenhailand.vn/cap-nhat-tien-do-xay-dung-cau-nguyen-trai-thang-4-2026-dat-32-phan-dau-ve-dich-thang-9-2027/), Báo ĐBND 8/2026 |

**Superseded:** my earlier pass and the data's placeholder ("pylon shape not published, H"). No competing scheme was found; all official images (user render, TEDI renders, stage screen) show the same three-column sail.

## 2. Pylon geometry: how the three sub-pylons are arranged

Reading the user's render together with TEDI's near-elevation and the stage screen, each pylon is **one tower made of three columns, set in 3-D rather than in a single row**:

1. **Main mast (one, on the bridge centreline).** This is the tallest element and the leading edge of the sail.
   - In elevation it is **curved, convex toward the main span**, and its tip leans back over the side span. It forms the sharp apex of the "pointed arch" seen in the user render.
   - It carries the **single central plane of main-span stays**.
   - Below the deck it continues as the front reinforced-concrete pier column.
2. **Two rear columns, one at each deck edge,** set back toward the side span.
   - In elevation they are almost straight, leaning slightly forward. In the along-axis view (stage screen) they **lean inward**, converging toward the mast near the top without touching it.
   - They stop **≈12 m below the mast tip**.
   - Together they carry the **two planes of side-span stays**.
   - Below the deck they continue as reinforced-concrete columns down to the pile cap.
3. **Bracing.** Three levels of steel struts join each rear column to the mast. In the user render these appear as the "inner arch" rungs (they read as slightly arched). TEDI notes diagonals as well.

From the side (the user render, TEDI r2) this reads as a **sail or pointed arch**: a tall curved front edge, a straight rear edge, and rungs between them. Seen along the bridge (stage screen) it reads as a **central mast flanked by two inclined legs** joined by three crossbeams.

Proportions are scaled from TEDI r2 against the 107.5 m height:
- At deck level the mast and the rear columns are **≈18 m apart along the bridge**.
- The mast tip sits **≈79.5 m above the deck** (cap top 2 m above water, deck 30 m above water). That gives ≈109.5 m above water, consistent with the 111 m press figure.

### `research/shapes/cau-nguyen-trai.json` → `model3d`

```json
"spans_m": [125, 300, 125],
"pylon_shape": "other",
"pylon_heights_m": [111, 111], "pylon_height_ref": "total",
"deck_elevation_m": 30,
"deck_crest_m": 4,
"deck_width_m": 26.5, "deck_type": "concrete",
"cable_planes": 1, "back_stay_planes": 2,
"cable_pattern": "semi_fan", "cables_per_side": 20,
"pylon_colour": "white", "stay_colour": "white",
"pylon_custom": {
  "description": "Sail pylon of three columns: a curved central mast (convex toward the main span, tip leaning back) carrying the single main-span stay plane, and two straighter rear columns at the deck edges, set back toward the side span and leaning inward, carrying the two side-span planes; joined by steel struts at three levels; RC lower shafts to a pile cap.",
  "legs": [
    {"centerline": [[-9,-28,-11],[-9,-3,-11.5],[-9,0,-12],[-8,30,-8],[-7,50,-5],[-6,67,-2]],
     "width_base_m": 2.5, "width_top_m": 1.8, "depth_base_m": 4.0, "depth_top_m": 2.5},
    {"centerline": [[7,-28,0],[8,-3,0],[8,0,0],[8.5,25,0],[7,50,0],[2,68,0],[-4,79.5,0]],
     "width_base_m": 4.0, "width_top_m": 2.5, "depth_base_m": 6.0, "depth_top_m": 3.0},
    {"centerline": [[-9,-28,11],[-9,-3,11.5],[-9,0,12],[-8,30,8],[-7,50,5],[-6,67,2]],
     "width_base_m": 2.5, "width_top_m": 1.8, "depth_base_m": 4.0, "depth_top_m": 2.5}
  ],
  "crossbeams_y_m": [-4, 22, 42, 60],
  "anchor_zone": [
    {"y_from_m": 30, "y_to_m": 76, "leg": 1, "side": "main"},
    {"y_from_m": 24, "y_to_m": 64, "leg": 0, "side": "back"},
    {"y_from_m": 24, "y_to_m": 64, "leg": 2, "side": "back"}
  ],
  "pile_cap": {"length_x_m": 32, "width_z_m": 34, "top_y_m": -28, "thickness_m": 5, "rounded_ends": false},
  "mirror_for_other_pylons": true,
  "reference_images": ["(user-supplied official render, scratchpad ref/nt/user-official-render.png)", "https://tedi.vn/wp-content/uploads/2024/12/KCCAU-NGUYEN-TRAI-2.jpg", "https://tedi.vn/wp-content/uploads/2024/12/KCCAU-NGUYEN-TRAI-1.jpg"]
}
```

Notes:
- **Leg order matters.** It is [rear −z, mast, rear +z], so `crossbeams_y_m` joins rear → mast → rear at each level. That gives the three bracing levels (22, 42 and 60 m) plus a portal beam under the deck (−4 m). These "crossbeams" are diagonal in plan, because the mast sits 15–17 m forward of the rear columns. That is intended; they are the rungs.
- **Optional diagonals:** struts from the mast at y 32 to each rear column at y 12, and from the mast at y 52 to each rear column at y 32 (width 1.2).
- **Lower shafts.** The mast continues straight down as the front pier column (x ≈ +7) and the rear columns as the rear piers (x ≈ −9). All of them stand on one cap, matching TEDI r2's two pier columns under the deck.
- **`pylon_heights_m` [111, 111] total** is the press figure. The label comes from the geometry, ≈109.5 m above water.
- **Mirroring.** Each pylon's mast faces its main span and its rear columns face its own side span.
- **Fields.** Bridge fields stay unchanged: `main_span_m` 300, `span_arrangement` "125 + 300 + 125 m", `width_m` 26.5. Add `lanes` 6 (4 motor + 2 mixed). Update `pylons` / `pylons_en`:
  - VI: "2 tháp hình cánh buồm gồm 3 cột (cột chính cong ở giữa, 2 cột sau nghiêng), giằng thép 3 tầng, cao ≈107,5 m từ bệ"
  - EN: "2 sail pylons of three columns (curved central mast, two inclined rear columns), steel bracing at 3 levels, ≈107.5 m above the pile cap"
- **Sources.** Add TEDI and the vietnam.vn article to `sources`. Replace the "geometry unchanged" note.
- **No client-confirmed conflict.** The record has no client-confirmed spans, and the official figures (125 + 300 + 125, 26.5 m, 165 × 25 m clearance) match the current data.

## 3. Engine gap

### G8. Per-side anchor zones for custom pylons — required

Today, when `cable_planes = 1` the engine forces every custom anchor to z = 0. A `back_stay_planes = 2` split then anchors both back planes on the faces of the same leg. Nguyễn Trãi needs the main-span stays on the mast and the side-span stays on two **other** legs.

Spec:
- **Schema.** `anchor_zone[i].side?: "main" | "back"`, optional.
- **Zone choice.** When any zone has `side`, a stay on side S of a pylon uses only the zones whose `side` matches `isBackSide ? "back" : "main"`. Zones without `side` keep today's behaviour.
- **Plane choice.** On a two-plane side (the split back side, or `cable_planes` 2), pick the zone whose leg's mean z sign matches the plane (plane 0 → z < 0). On a single-plane side, use the single matching zone.
- **Anchor z.** Use the leg's **actual z** (no forcing to 0) whenever the zone was chosen by `side`. The deck anchor stays at z = 0 on a single-plane side and ±hw on two-plane sides.
- **Harp.** The harp / semi-fan logic is unchanged.
- **Validation and tests.**
  - `validate.ts`: `side` ∈ {"main", "back"}.
  - Tests: Nguyễn Trãi main-side stays anchor on leg 1 with deck anchors at z = 0; back-side stays anchor on legs 0 and 2 at ±hw; 20 per side (per plane).

Everything else is existing engine features:
- custom legs and crossbeams
- `pile_cap` (G7)
- `deck_elevation_m` (G1)
- `back_stay_planes` (G3)
- `deck_crest_m`

## 4. Acceptance criteria (I will re-render)

Cameras: `--views side,front,foot,three_quarter,top`; `--az 55 --el 25 --target unit` (**matches the user's official render**: near pylon lower right, far pylon upper left); `--az 15 --el 3 --target pylon0` (compare TEDI r2); `--az 90 --el 5 --target pylon0` (along the axis, compare the stage screen).

1. **Pylon form, az 55 view vs the user render.**
   - Each pylon reads as a white sail or pointed arch: a tall curved front mast with the sharp apex, two shorter straight rear columns, and three rungs between them.
   - Two pylons, about 300 m apart.
2. **Along-axis view vs the stage screen.** A central vertical mast, flanked by two rear columns that lean inward and stop below the mast tip, with three crossbeams.
3. **Elevation vs TEDI r2.**
   - The mast curves, convex toward the main span, with its tip over the side span.
   - About 18 m between mast and rear columns at deck level.
   - Rear tops about 12 m below the mast tip.
   - Pier columns under the deck on a pile cap at the waterline.
4. **Stays.**
   - Main span: one central plane, 20 per side, from the mast to the median.
   - Side spans: two planes, 20 per plane, from the rear columns to the deck edges.
   - White.
5. **Deck.**
   - About 30 m above water with a visible crest of about 4 m.
   - Clears 165 × 25 m.
   - Under-construction cantilevers drawn as today.
6. **Data and tests.**
   - The fields above are set, with `pylons` / `pylons_en` and sources updated.
   - G8 is in the schema, `validate.ts` and docs.
   - `npm test` passes.
