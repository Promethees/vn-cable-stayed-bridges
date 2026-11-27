# 3D model review: round 7, Cầu Rạch Miễu 2 (`cau-rach-mieu-2`), 2026-11-27

The user reported that the model needs improvement. **Confirmed.** Two errors make it look like a different bridge:

1. **The upper crossbeam is missing.** The real pylon is an **H**: two vertical columns joined by a deep concrete strut at about half the height above the deck. Our model has two free-standing masts. The pass-2 note claimed "no upper beam in the aerial", but that is wrong; the beam is clearly visible in the same VnExpress aerial.
2. **The auxiliary piers do not exist.** The pier that pass 2 read as an auxiliary pier at about 60 m is really the end (anchor) pier, *trụ neo*. The pier beyond it is the first approach pier. Both side spans are clear, 120 m from pylon to anchor pier.

**No client-confirmed conflict.** The only client-confirmed item on this record is `roads` QL60B, which is unaffected. Nothing in this brief touches the original `cau-rach-mieu` (2009).

Reference images are in scratchpad `ref/rm2/` (`/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/ref/rm2/`):

| File | What it is |
|---|---|
| `commons.jpg`, with crops `c_left.png`, `c_right.png`, `c_pyl_r.jpg` | **Primary elevation.** Wikimedia Commons, 5/10/2025, CC BY 4.0, near side-on from river level. Shows the spans, the pier layout, the stay fan, and deck and pylon proportions. |
| `vnx_hoplong.jpg`, with crops `v_near.png`, `v_pyl.jpg`, `v_far.jpg` | VnExpress drone aerial at closure, 19–20/4/2025. Shows **both pylons with the upper crossbeam**, the pile caps, and the anchor pier of the near side span. |
| `vnx_dsc.jpg` | VnExpress, taken on the deck looking along the axis at a pylon. Shows the **H outline and the haunched upper strut** in close-up. |
| `vnx_0036.jpg` | VnExpress drone shot along the axis over the deck. Shows two stay planes at the deck edges and an H pylon in the distance. |
| `vnx_0020.jpg`, crop `z_car.jpg` | VnExpress top-down shot at the closure joint. A car gives the scale for the deck width. |
| `plo_cau-rach-mieu-2-6-8928.png` | PLO, 3/2024. Pylon under construction seen along the axis: two vertical columns, the lower crossbeam on falsework, and a rectangular pile cap. |
| `tcxd1.jpg` | Tạp chí GTVT, 7/2024. Pile cap with chamfered corners, and the twin-column anchor pier in the water. |
| `plo_cau-rach-mieu-2-2-3197.jpg` | PLO, 10/2024. Shot along the river: anchor pier, then the approach pier, at the bank. |

Ignore `tcxd2.jpg` and `tcxd3.jpg`; they show the Sông Đào bridge from the same article.

Current-model baselines are in scratchpad `views-rm2/`.

Confidence tags: **[C]** confirmed by a source · **[I]** inferred or measured from photos · **[E]** estimated.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Status | **Completed.** Construction started 29/3/2022; closure 19/4/2025; inaugurated and opened **19/8/2025**. Current data is correct. | [C] | [VnExpress](https://vnexpress.net/cau-rach-mieu-2-hop-long-4875889.html), [Nhân Dân](https://nhandan.vn/ocop/khanh-thanh-va-dua-vao-khai-thac-cau-rach-mieu-2-post901947.html), [vi.wikipedia](https://vi.wikipedia.org/wiki/C%E1%BA%A7u_R%E1%BA%A1ch_Mi%E1%BB%85u_2) |
| Main bridge | **3-span continuous cable-stayed, 120 + 270 + 120 m (510 m).** Prestressed-concrete girder, **two stay planes**. | [C] | [Tạp chí GTVT 31/7/2024](https://giaothong.tapchixaydung.vn/du-an-cau-rach-mieu-2-bat-dau-thi-cong-keo-cang-he-thong-cap-day-vang-183240731113933198.htm). The contractor's scope "Km5+913 → Km6+423", 510 m between the two anchor piers, agrees ([Trung Nam E&C](https://trungnamec.com.vn/cau-rach-mieu-2/)). |
| Wikipedia's 117 + 270 + 117 | **Reject.** These are the spans of the original Rạch Miễu (117 + 270 + 117), apparently copied over. Our 125 + 270 + 125 was an estimate. | [I] | |
| Auxiliary piers | **None.** In the Commons elevation the stays end at a single tall pier exactly 120 m from each pylon (scaled from the 270 m main span: 228 px vs 514 px). The next pier is about 45 m further on, an approach pier. The PLO and Tạp chí GTVT photos show this same pier pair as a twin-column anchor pier followed by an approach pier. | [I], high | `c_left.png`, `c_right.png`, `plo_…3197.jpg`, `tcxd1.jpg` |
| Pylons | P19 and P20, **"dạng chữ H"** (H-shaped), reinforced and prestressed concrete. Each has **two vertical, parallel columns**, a **lower crossbeam** under the deck ("dầm ngang dưới", reported done), and **one upper crossbeam**. The upper crossbeam is a deep strut with haunched, curved soffit fillets, at **≈53 % of the above-deck height** (measured 0.53–0.55 on both pylons in the aerial). The head is flat, with no crown. 32 lifts per column. | [C] shape, [I] strut height | Tạp chí GTVT; [PLO 3/2024](https://tuoitre.vn/plo/du-an-cau-rach-mieu-2-ra-sao-sau-gan-2-nam-khoi-cong-post779051.html); `v_pyl.jpg`, `v_far.jpg`, `vnx_dsc.jpg` |
| Pylon height | **116.5 m** (contractor) vs **113 m** (VnExpress, Trung Nam closure note, Wikipedia). The Commons elevation, scaled from the 270 m span, gives **≈66 m above the deck** and **≈106 m above water**, so 113 and 116.5 m are presumably measured from the pile-cap or footing base. Keep the data value 116.5; model the visible geometry from the photo. | [C] / [I] | [Trung Nam E&C](https://trungnamec.com.vn/cau-rach-mieu-2/), `c_pyl_r.jpg` |
| Deck level | About **40 m above water at the pylons**, rising to about **42 m at mid-span**. It falls to about 33 m at the anchor piers, a parabolic vertical curve of roughly 6 m over the unit. | [I] | `commons.jpg`, deck strip crops |
| Navigation | 220 × 30 m channel, **37.5 m at mid-channel** (already in the data). | [C] | Wikipedia, contractor |
| Stays | **112 stays in two planes**, parallel-strand (PSS), 31–55 strands each. That gives **14 per side per plane per pylon**. Semi-fan: anchored on the columns from about 31 m to about 61 m above the deck. White HDPE. | [C] count, [I] zone | Tạp chí GTVT; `c_pyl_r.jpg` |
| Deck width | Sources disagree: **17.5 m** (Wikipedia, 2022 ground-breaking) vs **21.5 m** (VnExpress, Trung Nam closure note). The top-down photo, scaled from a car, measures **≈16.5–17.5 m** edge to edge, with stay anchors at the deck edges. **Keep 17.5 m.** | [I] | `z_car.jpg` |
| Foundations | 24 bored piles per pylon, Ø 2.0 m, 80 m long. Rectangular pile cap with chamfered corners, about 2 m above water. It reads wider across the bridge than along it. | [C] piles, [I] cap | Tạp chí GTVT, Trung Nam; `tcxd1.jpg`, `v_near.png` |
| Colours | Grey-white concrete pylons; the pylon below the deck looks lighter. White stays. Grey deck. | [C] photos | |

## 2. Current vs reality

The baseline renders are `views-rm2/*.png`, plus custom views `az0 el0 unit`, `az-40 el35 pylon0` and `az85 el2 pylon0`.

| P | Problem | Current | Expected |
|---|---|---|---|
| **P0** | No upper crossbeam: reads as two free masts, not an H | `crossbeams_y_m: [-3]` | `[-3, 35]` (see §3) |
| **P0** | Phantom auxiliary piers in both side spans | `auxiliary_piers_m: [60, 460]` (shape file `auxiliary_piers_m_from_end: [60]`, plus PHASE6 line ~766 and REVIEW line ~930) | **none**: remove it in all three places |
| P1 | Spans | `[125, 270, 125]` | **`[120, 270, 120]`**, and add `span_arrangement: "120 + 270 + 120 m"` to the bridge record |
| P1 | Stay count | default | **`cables_per_side: 14`** |
| P1 | Stay colour | default blue | **`stay_colour: "white"`** |
| P1 | Pylon too tall above the deck (75 m vs ≈66 m); the anchor zone sits too high (42–73) | tip y = 75 | tip **y = 66**, anchors **31–61** |
| P1 | No pile cap: columns plunge into the water | none | `pile_cap` (see §3) |
| P1 | Deck is flat at 40.75 m (forced by the nav clearance); the real deck has a clear vertical curve | no crest | `deck_elevation_m: 36`, `deck_crest_m: 6` (needs **G9**) |
| P2 | Column section is square and thin (3.5 → 2.5) | `width` only | width (across) **4.0 → 3.0**, depth (along) **5.5 → 3.5** |
| P2 | Columns sit just inside the deck edge | z = ±10.5 → ±10 | **z = ±11, vertical** (the deck passes between the columns) |
| P2 | Text and notes | `pylons` "2 tháp hai cột (chữ H)…"; notes "No free image found"; shape notes mention aux piers | see §3.3 |

## 3. Data changes

### 3.1 `research/shapes/cau-rach-mieu-2.json` → `model3d`

The pylon local frame is: y = 0 at deck level, x along the bridge, z across it.

```json
"spans_m": [120, 270, 120],
"pylon_shape": "H",
"pylon_heights_m": [116.5, 116.5], "pylon_height_ref": "total",
"deck_elevation_m": 36,
"deck_crest_m": 6,
"cable_planes": 2, "cable_pattern": "semi_fan", "cables_per_side": 14,
"deck_width_m": 17.5, "deck_type": "concrete",
"stay_colour": "white",
"pylon_custom": {
  "description": "H pylon: two vertical, parallel rectangular RC columns outside the deck edges, a lower crossbeam under the deck and one deep upper strut at about mid-height above the deck; flat heads; semi-fan stays in two planes anchored on the columns from about 31 m to 61 m above the deck; rectangular pile cap at the waterline.",
  "legs": [
    {"centerline": [[0,-34,-11],[0,0,-11],[0,35,-11],[0,66,-11]],
     "width_base_m": 4.0, "width_top_m": 3.0, "depth_base_m": 5.5, "depth_top_m": 3.5},
    {"centerline": [[0,-34,11],[0,0,11],[0,35,11],[0,66,11]],
     "width_base_m": 4.0, "width_top_m": 3.0, "depth_base_m": 5.5, "depth_top_m": 3.5}
  ],
  "crossbeams_y_m": [-3, 35],
  "anchor_zone": [
    {"y_from_m": 31, "y_to_m": 61, "leg": 0},
    {"y_from_m": 31, "y_to_m": 61, "leg": 1}
  ],
  "pile_cap": {"length_x_m": 22, "width_z_m": 34, "top_y_m": -34, "thickness_m": 6, "rounded_ends": false},
  "mirror_for_other_pylons": true,
  "reference_images": [
    "https://commons.wikimedia.org/wiki/File:(VNM-Dong_Thap)_Rach_Mieu_2_Bridge_2025-10-05.jpg",
    "https://i2-vnexpress.vnecdn.net/2025/04/19/DJI-20250420075438-0019-D-copy-1745029263.jpg?w=1200&h=675&q=100&dpr=1&fit=crop&s=e6x9QcBbyTU8zxJQt7zodA",
    "https://vnexpress.net/cau-rach-mieu-2-hop-long-4875889.html (DSC05579: on-deck view of the H strut)"
  ]
}
```

- **Delete** `auxiliary_piers_m_from_end` from the shape file. Delete `"cau-rach-mieu-2": {"auxiliary_piers_m": [60, 460]}` from PHASE6 (line ~766) and from the round-1 table (line ~930).
- **Deck elevation.** With `deck_elevation_m` 36 and crest 6, the deck is 36 m at the anchor piers, ≈40.3 m at the pylons (crestAt = 0.72 × 6) and 42 m at mid-span. That matches the Commons photo. The mid-span soffit is 42 − 2.25 = 39.75 m, which clears 37.5 + 1.
- **Pile cap.** Its top sits about 2 m above water. Local −34 = 36 − 34 = 2 m. Plan: 24 piles at 5 m centres in a 4 × 6 grid, plus edge distance, gives 22 m along × 34 m across.
- **Crossbeam heights.** The upper strut centre is at 35 ≈ 0.53 × 66. Keep the lower crossbeam at −3, under the girder.
- **Stays.** Anchors 31–61 come from the Commons crop: lowest anchor ≈ 31.5 m and highest ≈ 61 m above the deck.

### 3.2 Generator (`scripts/gen_bridges.py`)

- In the `m3d(...)` seed for `cau-rach-mieu-2` (line ~383), change the spans to `[120, 270, 120]` and update the notes. Note that the shape file overrides most keys anyway.
- **Remove both `auxiliary_piers_m` entries** (lines ~766 and ~930). The REVIEW_R1 entry at line ~858 already sets heights to 116.5; it can stay.

### 3.3 Bridge fields (`add(id="cau-rach-mieu-2", …)`)

- `span_arrangement="120 + 270 + 120 m"`. This is new; there is currently none.
- `pylons` (VI): "2 tháp chữ H (hai cột đứng, dầm ngang trên ở khoảng giữa chiều cao), cao 116,5 m"
- `pylons_en`: "2 H-shaped pylons (two vertical columns, one upper cross-beam at about mid-height), 116.5 m"
- `sources`: add the Tạp chí GTVT article (spans, H form, 112 stays, piles) and the Trung Nam page.
- `notes`:
  - Drop "No free image found"; a CC BY 4.0 Commons image exists.
  - Add: "Spans 120 + 270 + 120 (Tạp chí GTVT; contractor scope Km5+913–Km6+423 = 510 m). Wikipedia's 117 + 270 + 117 is the original Rạch Miễu's arrangement. Pylon 116.5 m (contractor) / 113 m (press). 112 stays in 2 planes. Width: 17.5 m (Wikipedia, ground-breaking; photo-measured) vs 21.5 m (VnExpress, Trung Nam closure note)."
- `model3d.notes`: replace the "auxiliary pier" sentence with the H-strut and no-aux-pier finding.
- `confidence` stays "verified". `model3d.confidence` can become "verified" for spans, form and stay count; the dimensions are photo-derived.

## 4. Engine gap

### G9. Navigation floor should account for the deck crest (required for the crest)

`bridge3d.ts` (line ~353) computes `E = max(givenE ?? heuristic, navMin)` with `navMin = nav.height + deckDepth + 1`, and checks it against **E**. With a crest, though, E is the deck level at the **unit ends**. The clearance is needed at the **main-span centre**, where the deck is `E + crestAt(cMain)`. Today any crested bridge with a nav clearance is pushed up by the full crest. Here it would give a 46.75 m mid-span deck instead of 42 m.

Spec:
- Compute the crest at the clearance station before E. The station is the centre of the widest main span, `cMain = (edges[mi] + edges[mi+1]) / 2`, the same span as the clearance envelope:
  `crestMain = crest ? crest * (1 - ((cMain - centre) / centre) ** 2) : 0`.
- Set `E = max(givenE ?? deckElevation(mainSpan), navMin - crestMain)`.
- Show the warning `'deck_elevation_m below navigation clearance'` only when `givenE + crestMain < navMin`.
- Pylon labels: when `pylon_height_ref === 'total'`, the custom-pylon label should be `tip + E + crestAt(x)` rather than `tip + E`, so the water-to-tip label includes the crest at the pylon. Apply the same to the built-in branch `above = given - E - crestAt(x)`, if that is simple.
- Test: Rạch Miễu 2 gives E = 36 (not 40.75), deck at mid-span 42 ± 0.1, no warning. A bridge without a crest is unchanged.

Check the other crested bridges after this change (`cau-bai-chay` 8, `cau-my-thuan` 6, `cau-long-hung` 6, `cau-nguyen-trai` 4). Their E may drop where nav previously forced it. That is correct behaviour, but re-render them once.

### G10 (optional, P2). Crossbeam depth

Today crossbeams are square members of size `max(1.5, 0.8 × w1)`, about 2.4 m here. The real upper strut is about 5 m deep (vertical) and about 3 m thick, with haunches. Optional schema field: `crossbeam_depth_m?: number`, the vertical depth of `crossbeams_y_m` members, with thickness unchanged. Set it to 5 here. If this is skipped, the 2.4 m strut is acceptable for P0.

Everything else uses existing engine features: custom legs with depth, crossbeams, `pile_cap`, `deck_elevation_m`, `deck_crest_m`, `cables_per_side` and `stay_colour`.

## 5. Acceptance criteria (I will re-render)

Cameras:
- `--views side,front,foot,three_quarter,top`
- `--az 0 --el 0 --target unit` (≈ Commons elevation, `commons.jpg`)
- `--az -40 --el 35 --target pylon0`, plus `--az 40 --el 35 --target pylon0` if mirrored (≈ VnExpress closure aerial, `v_pyl.jpg`)
- `front` preset (≈ `vnx_dsc.jpg` / `vnx_0036.jpg`, along the axis)

1. **H form.** In the front view and both aerial views, each pylon reads as an **H**:
   - two vertical, parallel columns outside the deck edges;
   - an upper strut at **≈53 % of the above-deck height** (local y 35 ± 2);
   - a lower crossbeam under the girder;
   - flat heads.
2. **Side elevation vs Commons.**
   - **No auxiliary piers.** The only piers in the unit are the two end piers, 120 m from each pylon. Stays end at the end piers.
   - Pylon above the deck ≈ 66 m; deck ≈ 40 m above water at the pylons.
   - Above-deck to deck-elevation ratio ≈ 1.65 (± 0.1).
   - The deck visibly crests toward mid-span and drops toward the anchor piers.
3. **Stays.**
   - White.
   - 14 per side per plane per pylon (112 total).
   - Semi-fan anchored over y ≈ 31–61 above the deck.
   - Two planes at the deck edges.
4. **Foot view.** Rectangular pile cap of about 22 × 34 m just above the waterline, with both columns standing on it.
5. **Clearance.** The 37.5 m envelope fits under the mid-span soffit (≈ 39.75 m) with no warning. E = 36.
6. **Data.**
   - `spans_m` [120, 270, 120];
   - `span_arrangement` set;
   - `auxiliary_piers_m` absent from `data/bridges.json`;
   - `pylons` / `pylons_en`, sources and notes updated.
7. **Tests.** G9 is in `bridge3d.ts`, `docs/data-schema.md` (crest note) and tests, and `npm test` passes. Other crested bridges have been re-rendered and checked for regressions.

## 6. Open points (no user decision required)

- **Deck width 17.5 vs 21.5 m.** The photo scale supports 17.5. If the user prefers the contractor's 21.5, move the columns to z = ±13.
- **Pylon height label.** The drawn height is ≈ 106–108 m above water, while the data text says 116.5 m (contractor) and the press says 113 m. Both press figures most likely include the foundation; the label will show the drawn value.
