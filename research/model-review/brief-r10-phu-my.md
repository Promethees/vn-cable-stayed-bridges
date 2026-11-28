# 3D model review: round 10, Cầu Phú Mỹ (Phú Mỹ 1, `cau-phu-my`), 2026-11-28

The user asked for this bridge to be reviewed again. **The pylon is the wrong shape below the deck, and its crossbeams are wrong.** The model draws a plain H: two straight vertical legs from the water to the tip, a thin square bar under the deck, a thin bar at local 67, no pile cap, and a flat deck. The real pylon is the "modified H" (Arcadis) shown in every close photo:

- **Below the deck the legs splay outward** to a large rectangular pile cap. The c/c spacing is about 1.3 × the spacing at deck level.
- **There is a kink at the deck.** Above it the legs **lean slightly inward**: the c/c at the tips is about 0.8 × the c/c at the deck.
- **A deep box crossbeam** sits under the girder.
- **One deep upper crossbeam** sits at about 0.55–0.64 of the above-deck height. It has **large curved haunches** into the legs, so the soffit reads as a portal, and small fillets on top.
- **Two free posts** with flat tops continue above it.
- **The deck has a visible vertical curve.**

**No client-confirmed conflict.** Phú Mỹ has only one client-confirmed value, `construction_start` 2005 (`CC` in `add(...)`), and this brief does not touch it. Wikipedia's prose says "March 2007", but the infobox, Người Quan Sát and Thanh Niên give a ground-breaking of 9/9/2005, so the client value stands. The client calls the bridge "Phú Mỹ 1". It is not `cau-phu-my-2`.

**The round-1 height of 145 m is re-verified and corrected to a coherent set of measurements** (§1.1). `REVIEW_R1 scale_y 0.96` must be removed.

| Measured from | Height | Source |
|---|---|---|
| Above the deck | **93 m** | Structurae |
| Above the pile-cap top | **134.5 m** | Structurae (DE page, "Gesamthöhe") |
| Above the water | **≈ 139–140 m** | SEI 2010 paper: "approximately 140 m" |
| From the cap underside / foundation (best reading) | **145 m** | Wikipedia, bridgeinfo |

My photo measurement gives above-deck / cap-to-tip = 0.69, against 93 / 134.5 = 0.69 from Structurae. The model draws **139 m water-to-tip**: the cap top is about 4.5 m proud of the water, plus 134.5 m. The texts keep "≈ 145 m".

Reference photos are in scratchpad `ref/pm/` (`/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/ref/pm/`; credits in `index.txt`):

| File | What it is |
|---|---|
| `c1.jpg` / `c6.jpg` | Commons "Phu_My_Bruecke2" / "Phu_My_Bruecke" (Glabb/Hajotthu), elevated bank view. **Right pylon in true side elevation** (`c1_crop_r.png`): the leg tapers along x, there is a cap, and deck / tip ratios can be read. Left pylon oblique (`c1_crop_l.png`): leg convergence and the crossbeam. Side spans with no aux piers, stays reaching the end piers |
| `c15.jpg` | Commons "Phú_Mỹ_Bridge.JPG", from the water. Both pylons oblique (`c15_crop_l.png`, `c15_crop_r.png`): **splayed feet, kink at the deck, inward lean above**, crossbeam height. `c15_strip.png`: deck vertical curve |
| `c2.jpg`, `c3.jpg` | Commons "Phu_My_Bridge_1/2" (BrightRaven), from below on the river. **Primary form reference**: haunched portal crossbeam with fillets on top, deep box under-deck beam, splayed legs, big rectangular cap, ribbed open deck soffit (edge beams + floor beams) |
| `c8.jpg`, `c13.jpg`, `c12.jpg` | Flickr/Commons (BAOTRI), from the deck: crossbeam haunches face-on, stays in near-vertical planes on the deck edges, stay anchor pipes outside the railing |
| `c16.jpg` / `c16_crop.png` | Commons aerial: **no auxiliary piers** in either side span. The first approach pier is about 160 m from each pylon (the anchor pier) |
| `c10.jpg` | Leg below the deck from the ground: splay, ribbed deck soffit |

Renders:
- **Current model:** scratchpad `views-pm/` (`sheet.png`).
- **Prototype of the target:** scratchpad `pmwork/r2/`. It was rendered from a scratch copy of the repo (`pmwork/repo`); the project is untouched. The exact JSON is `pmwork/target.json`, applied by `pmwork/target.py`.
- In the scratch copy, `gen_bridges.py` passes and `vitest` passes (122/122).

Confidence: **[C]** confirmed by a source · **[P]** measured on photos · **[E]** estimated.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Main bridge | **162.5 + 380 + 162.5 = 705 m**, 3 spans, 2 pylons. **No auxiliary piers**: the side spans end on anchor piers, then the approach viaducts start (758 m + 638 m) | [C] spans, [P] no aux | Structurae; SEI 2010 abstract; JPCI; aerial `c16` |
| Whole bridge | 2,031 m (press) / 2,100 m (Wikipedia, incl. ramps) | [C] | Người Quan Sát; Wikipedia |
| Deck | **27.5 m** wide (Structurae, press; Wikipedia 27 m), 6 lanes (4 motor + 2 mixed). **Open Π-section reinforced-concrete deck** of variable depth: two main edge beams with transverse floor beams, visible as a ribbed soffit in `c2`/`c3`/`c10`. Depth not published; **≈ 2.5 m** [E] | [C] width/type, [E] depth | Structurae; ICE design audit (Khan 2010) figure labels "Main edge beams", "Open Pi-section RC deck"; photos |
| Navigation | **45 m vertical in a 250 m wide zone** (the 200 m in the data comes from a travel blog) | [C] | SEI 2010 abstract (Moir, Edmonds, Walser, Romberg); Người Quan Sát "khổ thông thuyền 250 m" |
| Pylon height | 93 m above deck; 134.5 m total (above the cap top); ≈ 140 m; 145 m. The press "162.5 m" is the side span confused with height | [C] | Structurae, SEI, Wikipedia; see §1.1 |
| Pylon form | "Modified H-shaped" (Wikipedia), "H frame" (SEI). High-level crossbeam (design audit figure label). Geometry in §1.1 | [C] form, [P] geometry | |
| Stays | **144 stays** = 2 pylons × 2 planes × 2 sides × **18**. Semi-fan (Structurae) / "semi-harp" (audit). Two near-vertical planes on the deck edges; anchor pipes outside the railing (`c13`). Freyssinet HDPE parallel-strand stays | [C] count (design audit, via search abstract; medium), [P] layout | ICE design audit; Structurae; Wikipedia |
| Stay anchorage on pylon | In the legs, from just below the upper crossbeam to near the tip | [P] | `c3`, `c15_crop_r` |
| Foundations | Piles up to about 80 m deep (SEI summary). Large rectangular pile cap with chamfered corners, top about 4–5 m above the water | [C] piles, [P] cap | Scribd SEI summary; `c1_crop_r`, `c2`, `c3` |
| Colours | Light grey / off-white concrete. Stays mid-grey (light grey against the sky, dark grey from below). Blue/white floodlighting at night (not modelled) | [P] | all daylight photos |
| Team | Main bridge design: Arcadis (FR); approaches: Cardno. Construction: Bilfinger Berger, Baulderstone Hornibrook, Freyssinet (stays), CC620. BOT; opened 2/9/2009 | [C] | Wikipedia; Người Quan Sát |

### 1.1 Height and pylon geometry

**Side elevation, `c1_crop_r` (right pylon seen edge-on):**

| Point | Crop y (px) |
|---|---|
| Tip | 38 |
| Deck top | 805 |
| Cap top | 1155 |

- Above deck / cap-to-tip = 767 / 1117 = **0.687**. Structurae gives 93 / 134.5 = 0.691, so the photo agrees.
- Scale 0.12 m/crop px:
  - Deck top at the pylon ≈ **42 m above the cap top**.
  - Leg depth along x ≈ 9.6 m at the cap, ≈ 8.2 m at the deck, ≈ 5.4 m at the tip.
  - Cap length along x ≈ 22 m.

**Height chain:**
- Cap top ≈ +4.5 m above the water [P, ±2 m], so the tip is at +139 m. That fits the SEI "≈ 140 m".
- 145 m = 139 + a cap about 6 m thick, i.e. measured from the cap underside. This is plausible but not confirmed.
- The deck top at the pylons is at ≈ **46.5 m** above the water.

**Transverse geometry (`c15` both pylons, `c1` left; orthographic ratios, independent of the view angle):**

| Ratio | c15 L | c15 R | c1 L | Used |
|---|---|---|---|---|
| Leg c/c at tip / at deck | 0.78 | 0.82 | 0.79 | **0.80** |
| Leg c/c at cap / at deck | 1.36 | 1.36 | 1.28 | **1.30** |

- With the legs clear of the 27.5 m deck (inner face ≥ 14.6 m), the leg centres are **±17 at the deck, ±13.6 at the tip and ±22 at the cap**.
- The stays then run from the legs (±13.6…±15.3) to the deck edges (±13.75): near-vertical planes, as in `c8`/`c13`.

**Upper crossbeam (`c1_crop_l`, `c15`):**
- Top at **0.64** of the above-deck height (≈ 59.5 m). Soffit at mid-span ≈ 51 m.
- The haunches meet the legs at ≈ 44 m. Their horizontal extent is about 0.25 × the clear gap (`c3`).
- The top has concave fillets of about 3 m at the legs (`c2`, `c8`).

**Under-deck beam (`c2`, `c3`):** a box from the deck soffit down to about 9.5 m below the deck top. It is flat-bottomed, with a slight haunch at the legs.

### 1.2 Deck level and crest
- The deck at the pylons is ≈ 46.5 m (§1.1).
- The engine rule needs mid-span ≥ 45 + 2.5 + 1 = 48.5 m.
- `c15_strip` and `c6` show a clear vertical curve over the whole unit.
- With `deck_elevation_m 40.8` and `deck_crest_m 8`:
  - crestAt(pylon) = 8 × (1 − (190 / 352.5)²) = **5.68**, so the deck at the pylons is **46.5**.
  - Mid-span is **48.8**, which is ≥ 48.5, so there is no warning.
  - The end grade is 2 × 8 / 352.5 = 4.5 %, plausible for the approach ramps.
- [P/E] ±3 m.

## 2. Current vs reality

| P | Problem | Current | Expected |
|---|---|---|---|
| **P0** | The legs are straight and vertical from the water to the tip (±15). There is no splay below the deck, no kink at the deck and no inward lean above | `research/shapes/cau-phu-my.json` legs | ±22 at the cap → ±17 at the deck (kink) → ±13.6 at the tip (§3.1) |
| **P0** | The upper crossbeam is a thin square bar (local 70 × 0.96 ≈ 67, about 0.72 H). The real beam is deep, at about 0.55–0.64 H, with large curved haunches and top fillets: the signature of the pylon | `crossbeams_y_m [-3, 70]` | Panel: top 59.5 (fillets to 63 at the legs), soffit 51.2 → 44 at the legs (§3.1). **Drop `crossbeams_y_m`** |
| **P0** | `REVIEW_R1["cau-phu-my"]` has `scale_y: 0.96`, which would rescale the new geometry | gen_bridges.py `REVIEW_R1` | **Remove `scale_y`**. Use `"set": {"pylon_heights_m": [139, 139]}` and drop the "Review r1" note |
| P1 | The under-deck beam is a thin bar | crossbeam at −3 | Deep box panel: top −2.2, bottom −8.2 (−9.5 at the legs), 7 m along x |
| P1 | There is no pile cap. The legs end in the water | — | `pile_cap` 22 × 56, top −36.9 (≈ +4.5 m real above the water), thickness 5.3 |
| P1 | The deck is flat. E is raised to 49.2 by the clearance rule (heuristic 38, nav 45 + default depth 3.17 + 1), so it sits about 3 m too high at the pylons and has no crest | — | `deck_elevation_m 40.8`, `deck_crest_m 8`, `deck_depth_m 2.5` |
| P1 | Height label / reference. Round 1 scaled to a "145 m total" that is not water-to-tip | 145 | Label **139** (tip local 92.5 + 40.8 + 5.68). Texts say "93 m trên mặt cầu, 134,5 m từ đỉnh bệ (≈145 m)" |
| P1 | Stay count is derived (about 16) | — | `cables_per_side: 18` (144 stays) |
| P1 | Navigation width is 200 m from a travel blog | `nav(45, 200, …)` | `nav(45, 250, "45 m within a 250 m wide navigation zone", SEI paper)` |
| P2 | Deck width is 27.0 | 27.0 | **27.5** in `model3d` and `add(width_m=27.5)` |
| P2 | Leg sections are 5 → 3.5 across and 7 → 5 along | | across 5.0 → 3.5, along **9.5 → 5.5** |
| P2 | Stays are the default teal | — | `stay_colour "#7a7f85"` (grey; muted mode is fine, **no vivid**). `pylon_colour "#dedbd3"` |
| P2 | Texts and notes say "H, cross-beam near the top, 145 m" | shape file, `add(pylons=…)`, M3D notes | §3.3 |

## 3. Data changes

### 3.1 Target `model3d` (replaces the shape file's `model3d`)

```json
{
 "spans_m": [162.5, 380, 162.5],
 "pylon_shape": "H",
 "pylon_heights_m": [139, 139],
 "pylon_height_ref": "total",
 "deck_elevation_m": 40.8,
 "deck_crest_m": 8,
 "deck_depth_m": 2.5,
 "cable_planes": 2,
 "cable_pattern": "semi_fan",
 "cables_per_side": 18,
 "deck_width_m": 27.5,
 "deck_type": "concrete",
 "pylon_colour": "#dedbd3",
 "stay_colour": "#7a7f85",
 "confidence": "estimated",
 "pylon_custom": {
  "description": "Modified H (Arcadis): two hollow concrete legs that splay outward below the deck to a large rectangular pile cap, kink at the deck and lean gently inward above it (c/c ≈ 34 m at the deck, ≈ 27 m at the tips, ≈ 44 m at the cap). A deep box crossbeam under the deck carries the girder; one deep upper crossbeam at ≈ 0.55–0.64 of the above-deck height has large curved haunches into the legs (portal soffit) and small fillets on top; the legs continue above it as two free posts with flat tops. Legs taper along the bridge (≈ 9.5 → 5.5 m) and across (≈ 5 → 3.5 m). Stays in two near-vertical planes anchored in the legs from just below the crossbeam to near the tips, landing on the deck edges. Light-grey concrete, grey stays.",
  "legs": [
   {"centerline": [[0, -36.9, -22], [0, -18, -19.44], [0, -3, -17.41], [0, 0, -17], [0, 3, -16.89], [0, 46, -15.31], [0, 92.5, -13.6]],
    "width_base_m": 5.0, "width_top_m": 3.5, "depth_base_m": 9.5, "depth_top_m": 5.5},
   {"centerline": [[0, -36.9, 22], [0, -18, 19.44], [0, -3, 17.41], [0, 0, 17], [0, 3, 16.89], [0, 46, 15.31], [0, 92.5, 13.6]],
    "width_base_m": 5.0, "width_top_m": 3.5, "depth_base_m": 9.5, "depth_top_m": 5.5}
  ],
  "panels": [
   {"top": [[-14.5, 63], [-13, 61.5], [-11.5, 60], [-10, 59.5], [10, 59.5], [11.5, 60], [13, 61.5], [14.5, 63]],
    "bottom": [[-14.5, 44], [-13, 45.2], [-11.5, 47.8], [-9.5, 50], [-7, 51], [0, 51.2], [7, 51], [9.5, 50], [11.5, 47.8], [13, 45.2], [14.5, 44]],
    "depth_m": 5.5},
   {"top": [[-17.5, -2.2], [17.5, -2.2]],
    "bottom": [[-17.5, -9.5], [-15.5, -8.4], [-13, -8.2], [13, -8.2], [15.5, -8.4], [17.5, -9.5]],
    "depth_m": 7.0}
  ],
  "pile_cap": {"length_x_m": 22, "width_z_m": 56, "top_y_m": -36.9, "thickness_m": 5.3, "rounded_ends": false},
  "anchor_zone": [
   {"y_from_m": 46, "y_to_m": 90, "leg": 0},
   {"y_from_m": 46, "y_to_m": 90, "leg": 1}
  ],
  "mirror_for_other_pylons": true,
  "reference_images": [
   "https://commons.wikimedia.org/wiki/File:Phu_My_Bruecke2.jpg",
   "https://commons.wikimedia.org/wiki/File:Phu_My_Bridge_1.JPG",
   "https://commons.wikimedia.org/wiki/File:Phu_My_Bridge_2.JPG",
   "https://commons.wikimedia.org/wiki/File:Ph%C3%BA_M%E1%BB%B9_Bridge.JPG",
   "https://commons.wikimedia.org/wiki/File:PhuMy_bridge_-_C%E1%BA%A7u_Ph%C3%BA_M%E1%BB%B97.jpg"
  ]
 },
 "notes": "Spans 162.5 + 380 + 162.5 = 705 m (Structurae, SEI 2010), no auxiliary piers (aerial photo). 'Modified H' pylon (Arcadis): legs splay below the deck to the pile cap and lean slightly inward above it; deep haunched upper crossbeam at ≈ 0.6 of the above-deck height, deep box beam under the deck. Height 93 m above deck and 134.5 m above the pile-cap top (Structurae); ≈ 140 m (SEI); 145 m (Wikipedia, read as from the cap underside). Drawn 139 m from the water with the cap ≈ 4.5 m proud (photo ratio 0.69 above deck / total matches Structurae). 144 stays = 18 per side per plane (ICE design audit). Open Π-section RC deck 27.5 m, depth ≈ 2.5 m estimated. Clearance 45 m within a 250 m zone (SEI). Deck ≈ 46.5 m above water at the pylons and 48.8 m at mid-span (photo estimate)."
}
```

**Engine-frame notes:**
- **Frame.** Local y = 0 is the deck at the unit ends (E = 40.8). Points above 0 are lifted by crestAt(pylon) = 5.68. Points below 0 are stretched by 1 + 5.68 / 40.8 = 1.139, so the below-deck locals are real values ÷ 1.139:
  - Cap top: real −42.0 below the deck → local −36.9, which is +4.5 m above the water.
  - Under-deck beam bottom: real −9.4 → local −8.2.
- **Label.** 92.5 + 40.8 + 5.68 = **139.0**.
- **Clearance.** E + crest = 48.8 ≥ 45 + 2.5 + 1 = 48.5, so there is no warning.
- **Kink.** The points at −3 / 0 / +3 keep the kink at the deck sharp through the smooth curve.
- **Panels replace `crossbeams_y_m`.** Do **not** also set it, or straight bars would be drawn through the haunches. The panel ends (±14.5 at the top beam, ±17.5 under the deck) sit inside the legs, so the joints close.

### 3.2 Generator (`scripts/gen_bridges.py`)
- **`research/shapes/cau-phu-my.json`.**
  - Replace `model3d` with §3.1.
  - Set `pylons_vi` / `pylons_en` per §3.3.
  - `review`: add "r10: modified H, splayed feet, haunched portal beam, box under-deck beam, cap, crest".
  - `checklist`: foot below deck "pass (splayed to cap)", crossbeams "pass (haunched upper panel + box under deck)".
- **`REVIEW_R1["cau-phu-my"]`.** Replace it with `{"set": {"pylon_heights_m": [139, 139]}}`. **Remove `scale_y` and the note.** Add a comment: `# round 10 (brief-r10-phu-my.md): scale_y 0.96 removed; tip local 92.5 is the 139 m label`.
- **`NAV["cau-phu-my"]`.** Use `nav(45, 250, "45 m within a 250 m wide navigation zone", "https://www.tandfonline.com/doi/abs/10.2749/101686610792016664")`.
- **`M3D["cau-phu-my"]`** (fallback, keep consistent):
  - Deck width 27.5, heights `[139, 139]`.
  - Notes: "Fallback only: research/shapes/cau-phu-my.json (round 10) wins. 162.5+380+162.5 = 705 m. Modified-H pylons, 93 m above deck / 134.5 m above the cap top (Structurae), ≈140 m (SEI), 145 m (Wikipedia, from the cap underside). Press 162.5 m is the side span."
- **`add(id="cau-phu-my", …)`.**
  - `width_m=27.5`.
  - `pylons=` per §3.3 (VI).
  - Add sources: Structurae (`https://structurae.net/en/structures/phu-my-bridge`), SEI 2010 (`https://www.tandfonline.com/doi/abs/10.2749/101686610792016664`), ICE design audit (`https://trid.trb.org/view/1099803`).
  - **Keep** the `construction_start` 2005 client-confirmed source and note unchanged.
- **Optional.** `EXPECT_R1["cau-phu-my"] = {"cables_per_side": 18, "deck_crest_m": 8, "deck_elevation_m": 40.8}`, plus an assertion that the tip is still `[0, 92.5, ±13.6]` (not rescaled), like the Vàm Cống one.
- **No `colour_mode`.** Phú Mỹ is not added to `VIVID_OK`.

### 3.3 Bridge texts
- `pylons` (VI): "2 tháp chữ H cải tiến: chân choãi ra dưới mặt cầu xuống bệ móng, nghiêng nhẹ vào trên mặt cầu; dầm ngang trên có vút cong lớn, dầm hộp đỡ dầm cầu; cao 93 m trên mặt cầu, 134,5 m từ đỉnh bệ (≈145 m)"
- `pylons_en`: "2 modified-H pylons: legs splay out below the deck to the pile cap and lean slightly inward above it; deep upper crossbeam with large curved haunches, box beam under the deck; 93 m above deck, 134.5 m above the pile cap (≈145 m)"

## 4. Engine gaps
**None.** The prototype uses only existing features: legs with depth, G13 panels, `pile_cap`, `deck_elevation_m` / `deck_crest_m` / `deck_depth_m`, and `cables_per_side`.

Optional, P2, do not block:
- **Chamfered pile-cap corners.** The real cap has chamfered corners. A `pile_cap.chamfer_m` would show them; the box is fine at this scale.
- **Stay contrast.** Muted grey stays are faint against the light sky (see `pmwork/r2/cau-phu-my-side.png`). This is the same for every grey-stayed bridge and is a theme matter, not a Phú Mỹ one.

## 5. Acceptance criteria (I will re-render)

Cameras:
- `--views front,side,foot,top,three_quarter`
- `--az 60 --el -8 --target pylon0`: compare with `c3.jpg` / `c2.jpg` (from the river below the deck).
- `--az 2 --el 2 --target pylon0`: side elevation, compare with `c1_crop_r.png`.
- `--az 12 --el 6 --target unit`: compare with `c6.jpg` / `c15.jpg`.
- `--az 88 --el 4 --target pylon0`: along the axis, compare with `c8.jpg` / `c13.jpg`.

Criteria:
1. **Form (P0)**, checked in the front, az60 and az88 views.
   - The legs splay below the deck: foot c/c / deck c/c = 1.25–1.35.
   - There is a visible kink at the deck.
   - The legs lean inward above the deck: tip c/c / deck c/c = 0.76–0.84.
2. **Upper crossbeam.**
   - One deep beam with curved haunches into both legs; the soffit crown is at local 51 ± 2 and the top at 59.5 ± 2 (≈ 0.64 H), with small top fillets.
   - No straight bar elsewhere above the deck.
   - Free posts above it to flat tips at local 92.5.
3. **Below the deck.**
   - A deep box beam under the girder (bottom about 8–9.5 m below the deck top).
   - A rectangular cap ≈ 4–5 m proud of the water, wider than the feet.
4. **Height and deck.**
   - Label **139 m**.
   - Deck ≈ 46.5 at the pylons and 48.8 at mid-span (crest visible in the side view).
   - No clearance warning; navigation box 250 m wide.
   - `scale_y` is gone, and the tip stays at local 92.5.
5. **Stays.**
   - 18 per side per plane (144 total), grey.
   - Two near-vertical planes from the legs (y 46–90) to the deck edges.
   - Back stays reach close to the end piers; no aux piers.
6. **Data.**
   - `width_m` / `deck_width_m` 27.5; texts, notes, NAV and sources updated; the client-confirmed 2005 is untouched.
   - `python3 scripts/gen_bridges.py data/bridges.json` and `npm test` pass.
   - No other bridge changes.

## 6. Open points (no user decision needed)
- **Height reference.** If the user prefers the widely quoted 145 m as the label, raise the tip to local 98.5 (145 − 40.8 − 5.68). The above-deck height would then be 99 m, which contradicts Structurae's 93 m, so I recommend 139.
- **Cap height above the water** (±2 m), deck depth (2.5 m [E]) and crest (±3 m) are photo estimates.
- **Stay count.** 144 comes from a search summary of the paywalled ICE audit. Photo counts are consistent with 17–19 per side, but I could not count exactly.

## Sources
- Wikipedia EN, [Phú Mỹ Bridge](https://en.wikipedia.org/wiki/Ph%C3%BA_M%E1%BB%B9_Bridge): 380 m span, 145 m, 27 m, clearance 45 m, "modified H-shaped", Arcadis / Cardno / BBBH + Freyssinet.
- Structurae, [Phu My Bridge](https://structurae.net/en/structures/phu-my-bridge): 162.5–380–162.5, 93 m above deck, 134.5 m total, 27.5 m, semi-fan. Read through search snippets; the site blocks fetching.
- Moir, Edmonds, Walser, Romberg, "Construction Engineering of Phu My Cable-Stayed Bridge, Vietnam", SEI 20(3) 2010, [T&F](https://www.tandfonline.com/doi/abs/10.2749/101686610792016664): 705 m, 45 m × 250 m clearance, H-frame ≈ 140 m, piles to 80 m (Scribd summary).
- Khan, "Design audit of the Phu My cable-stayed bridge", Proc. ICE Bridge Eng. 163(4) 2010, [ICE](https://trid.trb.org/view/1099803): 144 stays, open Π RC deck, main edge beams, high-level cross-beam. Seen as a search abstract only.
- Người Quan Sát, [H-pylon article](https://nguoiquansat.vn/cau-day-vang-hon-2-000-ty-co-kien-truc-tru-thap-hinh-chu-h-gan-15-nam-giu-ky-luc-cau-vang-lon-nhat-thanh-pho-dau-tau-kinh-te-cua-viet-nam-106235.html): 27.5 m, 45 m clearance, 250 m channel, "162,5 m" (a side-span mix-up).
- [bridgeinfo.net](https://www.bridgeinfo.net/bridge/index.php?ID=203): 145 m, 45 m, 27 m.
- Commons photos listed in the table above (credits in `ref/pm/index.txt`).
