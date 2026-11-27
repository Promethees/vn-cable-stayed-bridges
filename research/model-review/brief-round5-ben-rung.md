# 3D model review: round 5, Cầu Bến Rừng (`cau-ben-rung`), 2026-11-27

The user reports that the pylons have no foundation. **Confirmed.** In the current model the blade legs start at y = −2 m, just under the deck. Nothing connects the pylon supports to the water, because the engine draws piers only at the abutments and auxiliary piers, never under a pylon. So the deck and blades float at all three main piers (scratchpad `views-br/`: foot, front, `az0 el2 pylon0`, `az2 el8 unit`).

The rest of the pylon was rechecked against photos taken after opening. Reference images are saved in scratchpad `ref/br/`:
- `vtc5.jpg`: drone shot along the deck, VTC News
- `vnx1.jpg` / `vnx1_zoom.jpg`: aerial of the 3 main piers, VnExpress
- `tt9.jpg` / `tt9_centre.jpg` / `tt9_left.jpg`: near-elevation at low tide; the centre pylon is almost edge-on
- `tt11_zoom.jpg`: oblique aerial of the piers
- Tuổi Trẻ Du lịch 7/2024 set `tt1–tt12`

Confidence tags: **[C]** confirmed · **[I]** inferred · **[E]** estimated from photo proportions.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Main bridge | extradosed, 4 spans **90 + 2 × 160 + 90 m**, 3 pylon piers; deck 21.5 m, 4 + 2 lanes, prestressed-concrete box by balanced cantilever | [C] | [CONINCO](https://coninco.com.vn/coninco-tham-du-le-thong-xe-cau-ben-rung-noi-hai-phong-voi-quang-ninh-n3835.html), [Hải Phòng portal](https://haiphong.gov.vn/cac-cong-trinh-trong-diem/xay-dung-cong-trinh-cau-ben-rung-nang-cao-hieu-qua-kinh-te-xa-hoi-cua-02-khu-kinh-te-ven-bien-na-643554), [Báo Đầu tư](https://baodautu.vn/hop-long-cau-ben-rung-noi-hai-phong---quang-ninh-d208276.html) |
| Navigation | 2 channels, 85 × 11 m each | [C] | Hải Phòng portal |
| Foundations | bored piles (380 in total for the project) set in limestone; reinforced-concrete piers | [C] | [VnExpress](https://vnexpress.net/cau-2-000-ty-dong-noi-hai-phong-quang-ninh-truoc-ngay-thong-xe-4769799.html), Báo Đầu tư |
| Pylon motif | 3 main piers shaped as a **V** ("Victory", the three Bạch Đằng victories). The tower body is **strongly inclined, ≈65° from horizontal (≈25° from vertical)**. | [C] V; [I] 65° (press wording via search, page not re-fetched) | VnExpress; [Tuổi Trẻ Du lịch](https://tuoitre.vn/dulichtphcm/ngam-cau-ben-rung-moi-khanh-thanh-noi-hai-phong-va-quang-ninh-10778391.htm) |
| **Pile cap** | One large rectangular cap per pylon pier, with chamfered or rounded ends, **at the waterline**, its top ≈2 m above mean water (≈5 m exposed at the low tide in tt9). In tt9 it is ≈3.6× the column width along the bridge, so **≈19–20 m along**. In vnx1 it extends a few metres beyond the columns on both sides, so **≈32 m across**. About 5 m thick (top +2, bottom −3). | [C] shape and position; [E] size | tt9, vnx1_zoom, tt11 |
| **Columns (below deck)** | **Two separate, near-vertical columns** stand on the cap under the deck edges (z ≈ ±11) and rise to the soffit. In tt9 they are ≈5 m along the bridge; across about 2.5 m [E]. They continue above the deck as the blades. | [C] form; [E] sizes | vnx1_zoom, tt9_centre, tt11 |
| Tie beam | a horizontal strut between the two columns at roughly mid-height between cap and deck | [C] (vnx1_zoom, tt11); [E] height | — |
| Under-deck crossbeam | the girder bears on a crossbeam on top of the columns, just under the soffit | [I] | — |
| Proportions | In tt9 (centre pylon edge-on), blade height above deck ≈ column height cap-top → soffit (ratio ≈1.0); pier-girder depth ≈0.22 × column height | [E] | tt9_centre |
| Deck height | Combining those ratios with a ≈4–4.5 m girder at the pier gives a deck top **≈22 m** above mean water at the pylons. (The model now uses 16 m, from the 11 m clearance plus the default depth.) | [E] | tt9 |
| Blades (above deck) | One blade per deck edge, leaning **outward ≈25°**, so the pair forms a V. In elevation a band ≈4.5–5.5 m wide (widening slightly upward); across about 2.5 m. Bevelled or chamfered top. White with a **red inner face**. About 18 m tall above the deck. | [C] form and colour; [E] sizes | vtc5, tt9, tt11 |
| Stays | 2 planes, red, from each blade down to its deck edge. Short extradosed fans with about 12 per side per blade. The fans look **semi-fan rather than strictly parallel** in tt11 / tt9. | [C] red, 2 planes; [E] count and pattern | vtc5, tt11 |
| Colours | blades white with red inner face; columns and cap light-grey concrete; deck grey; railings white | [C] | photos |

## 2. Current model vs reality

| # | P | Field | Current | Expected |
|---|---|---|---|---|
| 1 | **P0** | foundation | none; legs start at y −2, the deck floats at the pylon piers | **pile cap + two columns + tie beam + under-deck crossbeam** (§3) |
| 2 | P1 | `deck_elevation_m` | heuristic 16 | **22** [E] |
| 3 | P1 | blade lean | ≈13° (z 10.5 → 15 over 20 m) | **≈25°** (tip offset ≈8.4 m over 18 m) |
| 4 | P1 | blade section | 2 → 3.5 m across, 2 → 1.2 m along (thin sticks in elevation) | **≈2.5 → 2.0 m across, 5.0 → 5.5 m along** |
| 5 | P2 | `cables_per_side` | derived 7 | **12** [E] |
| 6 | P2 | `cable_pattern` | harp | **semi_fan** [E] (fans visibly spread in tt11) |
| 7 | — | `pylon_heights_m` | [18,18,18] above_deck | keep |
| 8 | — | colours | white / red stays | keep. The red inner face needs per-face colour, which the engine lacks (not required) |

## 3. Geometry (`research/shapes/cau-ben-rung.json` → `model3d`)

Local frame: deck at y = 0, waterline at y = −22 (`deck_elevation_m: 22`), deck edges at z = ±10.75. For a leg in the y–z plane, `width` = across (z) and `depth` = along the bridge (x).

```json
"deck_elevation_m": 22,
"cables_per_side": 12,
"cable_pattern": "semi_fan",
"pylon_custom": {
  "description": "Bến Rừng 'V – Victory' pier: two near-vertical columns stand on a large pile cap at the waterline, joined by a tie beam at mid-height and a crossbeam under the girder. Above the deck each column continues as a flat blade leaning outward about 25°, white with a red inner face, carrying a short fan of red extradosed stays to its deck edge.",
  "legs": [
    {"centerline": [[0,-20,-11],[0,-10,-11],[0,-3,-11.2],[0,0,-12.2],[0,9,-16.4],[0,18,-20.6]],
     "width_base_m": 2.5, "width_top_m": 2.0, "depth_base_m": 5.0, "depth_top_m": 5.5},
    {"centerline": [[0,-20,11],[0,-10,11],[0,-3,11.2],[0,0,12.2],[0,9,16.4],[0,18,20.6]],
     "width_base_m": 2.5, "width_top_m": 2.0, "depth_base_m": 5.0, "depth_top_m": 5.5}
  ],
  "struts": [
    {"a": [0,-11,-11], "b": [0,-11,11], "width": 2.0},
    {"a": [0,-4.5,-11.2], "b": [0,-4.5,11.2], "width": 3.0}
  ],
  "pile_cap": {"length_x_m": 20, "width_z_m": 32, "top_y_m": -20, "thickness_m": 5, "rounded_ends": true},
  "anchor_zone": [{"y_from_m": 6, "y_to_m": 17, "leg": 0}, {"y_from_m": 6, "y_to_m": 17, "leg": 1}],
  "mirror_for_other_pylons": true,
  "reference_images": ["https://cdn-i.vtcnews.vn/resize/1200x900//upload/2024/07/16/cau-ben-rung-truoc-ngay-thong-cau-5-10294993.jpg", "https://iv1.vnecdn.net/vnexpress/images/web/2024/07/14/toan-canh-cau-ben-rung-1720935309.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=LTLqha5atJPnU9GbTxRRTw", "https://cdn2.tuoitre.vn/tcdulichtphcm/media/upload/3-2024/images/2024-07-17/1721215597-h--nh----nh-10-1721215549-262-width1192height669.jpg"]
}
```

Notes:
- **Leg path.** Each leg is one continuous sweep from the cap top (y −20) to the tip. It is vertical below the deck, and the bend to the 25° lean happens between y −3 and y 0, which the deck hides. The flat crown logic is not triggered, because the tips are 41 m apart.
- **Stays.** The deck anchors stay at ±10.75 m, so the stays run from the deck edge outward and up to each blade.
- **Pile cap.** `pile_cap` is new; see G7. Until it exists, an acceptable fallback is **4 parallel struts** along z at x = −7.5, −2.5, 2.5 and 7.5, from [x, −22.5, −16] to [x, −22.5, 16], each 5.0 wide (a 20 × 5 × 32 m block with square ends).

## 4. Engine gap

### G7. `pylon_custom.pile_cap` (optional) — P1 for this bridge, reusable

```ts
pile_cap?: { length_x_m: number; width_z_m: number; top_y_m: number; thickness_m: number; rounded_ends?: boolean };
```

- **Geometry.** Draw one solid in the pylon-local frame at every pylon. It spans x ∈ ±length/2, z ∈ ±width/2, y ∈ [top − thickness, top]. With `rounded_ends`, make it a stadium in plan: the semicircle ends have diameter = `length_x_m` and sit on the ±z ends.
- **Mapping.** Map it through the same `toStation` / `plan()` path as the legs, so it follows the deck plan and is mirrored with the pylon.
- **Material.** Use the **plain concrete material**, not `pylon_colour`. Footings read as grey concrete even when the pylon is coloured.
- **Bounds and validation.** Include it in the world bounds. In `validate.ts`, require all sizes > 0 and top_y ≥ −E − 10.
- **Tests.** One unit test for the box or stadium vertex extents, and one data test that every Bến Rừng pylon has a cap whose top is within ±3 m of the waterline.
- **Other users later (not this round).** Thượng Cát currently uses a square strut as its pile cap and could switch to `pile_cap`.

Not required: per-face colour for the red inner face of the blades.

## 5. Acceptance criteria (I will re-render)

Views: `--views side,front,foot,three_quarter,top`, plus `--az 0 --el 2 --target pylon0` (compare with `tt9_centre`), `--az 2 --el 8 --target unit` (tt9), `--az 90 --el 25 --target pylon0` (vtc5) and `--az 40 --el 20 --target pylon0` (tt11 / vnx1).

1. **Foundation (P0).**
   - Every pylon pier has a pile cap at the waterline, about 20 m along × 32 m across, top about 2 m above water.
   - Two separate, near-vertical columns rise from it to the deck edges.
   - A tie beam sits about halfway up, and a crossbeam sits just under the deck.
   - Nothing floats: in the foot and front views, the deck and blades are visibly carried down to the cap.
2. **Elevation (`az0 el2 pylon0`).**
   - The blade above the deck is about as tall as the column below it.
   - Blade and column read as bands about 5 m wide, not thin sticks.
   - The cap is about 4× the column width along the bridge.
3. **Front and vtc5 view.** The V opens at about 25° from vertical on each side, the tips are about 41 m apart, and the stays run up and outward from the deck edges.
4. **Stays.** Red, 2 planes, a visible fan spread, 12 per half-fan in full screen.
5. **Data.**
   - `deck_elevation_m` 22, and the 11 m navigation clearance is still satisfied.
   - The schema, `validate.ts` and docs include `pile_cap`.
   - `npm test` passes.
