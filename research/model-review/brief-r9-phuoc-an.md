# 3D model review: round 9, Cầu Phước An (`cau-phuoc-an`), 2026-11-28

The user asked for a revision. **The current model is wrong in its main features:**

1. **The deck is drawn as two open cantilevers with yellow form travellers.** This is the engine's generic "under construction" state. The real deck was closed: the side spans first, then the main span on **24/7/2026**. Photos from 10/2026 show a continuous deck from T37 to T40.
2. **The pylon floats.** Its legs stop 10 m below the deck, which sits about 60 m above the water. A generic grey pier and slab carry it instead of the real legs and pile cap.
3. **The pylon form is wrong.**
   - The legs should come down to a pile cap in the river, with one strut below the deck.
   - The crown is **pointed** (a Gothic "water-drop / flame" arch), not rounded.
   - It is 60 m above the deck, not 35 to 44 m.
4. **The spans are wrong.** They are 137.5 + 250 + 137.5 (525 m), not 145 + 250 + 145.
5. **The stays are wrong.** They are semi-fan through saddles, not harp. There are 12 per side per plane, reaching far into the main span.

**No client-confirmed conflict.** This record has no `client-confirmed` value. Main span 250 m, deck 27 m, 6 lanes, total length 3,514 m and navigation 55 × 135 m all stay as they are.

Reference images are in scratchpad `ref/pa/` (`/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/ref/pa/`). Downsized copies are in `sm/` and crops in `crop/`.

| File | What it is |
|---|---|
| `cafef3.jpg` | **Main reference.** Aerial photo (Báo Xây dựng via CafeF, 10/2026), side-oblique. Shows both pylons, a continuous closed deck, stays, the T39 lower legs, strut and pile cap. Crops: `crop/c3_near.jpg`, `crop/c3_far.jpg` (lower legs, strut, cap), `crop/c3_stays.jpg` |
| `cafef2.jpg` | Aerial photo (10/2026) looking along the bridge over T38: the arch, the stays and the lower legs with the strut |
| `cafef4.png` | Official render at deck level, looking along the axis: a symmetric pointed Gothic arch straddling the deck, with stays from both legs to the deck edges |
| `cafef1.jpg`, `nqs.jpg` (crop `crop/nqs_near.jpg`) | Official renders from river level: the teardrop outline, lower legs converging toward an elliptical cap, one strut below the deck |
| `hnm_a329.jpg`, `hnm_a348.jpg`, `hnm_a336.jpg`, `hnm_a345.jpg` | Construction photos (Hà Nội Mới, 4/2025): two hollow lower legs either side of the K0 pier table, which is a **5-web box**; red temporary struts between the legs; elliptical cap |

Baselines (current model): scratchpad `views-pa/`.

Prototype of the target: scratchpad `pawork/r2/` (front, top, side, `custom-az-55-el6-pylon0`) and `pawork/r1/` (all views plus `az-30-el25-unit` and `az80-el3-main`). It was rendered from a scratch copy of the repo, so the project is untouched. **It used `status: "completed"` to stand in for G16, and the engine's default main-side stay reach because G15 does not exist yet.** The exact JSON is in `pawork/target.json`.

Confidence tags: **[C]** confirmed by a source · **[R]** read from photos/renders · **[E]** estimated.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Type | Extradosed. Prestressed-concrete box girder, **5 webs** ("dầm hộp BTCT DƯL dạng 5 vách"), built by balanced cantilever (32 segments per T-unit) | [C] | [Thanh Tra](https://thanhtra.com.vn/dau-tu-72A9E3223/cau-phuoc-an-sieu-du-an-1803-ty-dong-lap-ky-luc-nhip-dai-nhat-dong-nam-a-fd59ce4a6.html), Vĩnh Hưng, photo `hnm_a348` |
| Spans | **137.5 + 250 + 137.5 = 525 m** main bridge, piers **T37 – T38 – T39 – T40**, no auxiliary piers | [C] | [CafeF 27/10/2026](https://cafef.vn/viet-nam-dang-xay-cay-cau-gan-5000-ty-dong-co-nhip-chinh-dai-250m-tru-thap-cao-tuong-duong-toa-nha-40-tang-nam-tren-truc-giao-thong-ket-noi-toi-sieu-do-thi-lan-bien-rong-2870-ha-cua-ty-phu-pham-nhat-vuong-188261027120348509.chn) ("137,5m, 250m và 137,5m"), Thanh Tra ("tổng chiều dài cầu chính 525 m") |
| Total | Bridge 3,514 m; route about 4.38 km (bridge + 864 m of roads) | [C] | Trungnam E&C, CafeF |
| Deck | 27 m on the main bridge (Trungnam once wrote 28; ignore it), 23.5 m on the approaches. 4 motor + 2 mixed lanes, 70 km/h | [C] | CafeF, NLĐ/Tuổi Trẻ |
| Navigation | **55 m × 135 m**, 30,000 DWT. Already in NAV | [C] | CafeF, NLĐ |
| Pylon form | **"Giọt nước"** (water drop); CafeF says "ngọn lửa hoặc hạt thóc" (flame or rice grain). Two hollow-box legs in the transverse plane, straddling the deck, forming a **pointed Gothic arch** above the deck; solid tip ≈ top 12 % | [C] form, [R] geometry | Thanh Tra, CafeF, `cafef4`, `cafef3` |
| Pylon height | **≈119 m total** (CafeF / Báo Xây dựng 10/2026; Thanh Tra 2025: "gần 116 m"). **60 m from the deck to the top** ("đoạn từ mặt cầu lên đỉnh trụ cao 60 m"). Pylon cast in 15 lifts | [C] | CafeF, Thanh Tra, NLĐ ("14/15 đốt tháp") |
| Below deck | The legs come down outside the box and **converge** toward the cap. **One transverse strut** ("liên kết bằng dầm ngang") at about 0.45 of the way from deck to cap | [C] strut, [R] position | Thanh Tra, `c3_far`, `cafef1`, `nqs` |
| Foundation | Main piers: **elliptical cap 48 × 26 m, 5 m thick**, 36 bored piles D2.0 m, 62 m long. End piers T37 / T40: rectangular caps on 8 piles D2.0. Caps sit just above the water | [C] | Thanh Tra |
| Stays | **Two planes, semi-fan** ("hai mặt phẳng bán rẻ quạt"), passing through **saddles** in the pylon ("hệ yên ngựa neo cáp", from lift T6). 48 "bó" in total (Thanh Tra); Trungnam reports "24/24 bó, 12 at T38 and 12 at T39" at closure. The counts are ambiguous. In the 10/2026 aerial (`c3_stays`) I count **≈12 per side per plane per pylon**, which is consistent with 48 saddle cables (2 pylons × 2 planes × 12), each giving one main-side and one back-side stay. White HDPE | [C] planes/pattern, [R] count (medium) | Thanh Tra, [Vĩnh Hưng](https://vinhhungjsc.com/vi/du-an-cau-phuoc-an-vinh-hung-la-nha-thau-cung-cap-va-thi-cong-he-thong-cap-day-vang-d663), Trungnam |
| Stay geometry | On the legs at about **y 18 → 42 m** above the deck, where the legs are at z ≈ ±15 → ±9, so the planes are nearly vertical down to the deck edges. Deck anchors run from **≈24 m to ≈105 m** from the pylon on the main side, leaving ≈40 m unstayed at mid-span. The back side is about the same (24 → 105 of 137.5) | [R] (perspective-corrected from `cafef3`, ±10 m) | `c3_near`, `c3_stays` |
| Deck level | The 55 m clearance under the mid-span soffit gives a deck top ≈ 60.5 m. The deck at the pylon follows from 119 − 60 = 59 m. The approaches climb, so there is a vertical curve | [C] / [E] | |
| Colours | Pylons off-white concrete (`#e9e7e1`), stays white, deck grey concrete | [R] | photos |
| Status | Started 6/2023. Main span closed **24/7/2026**, ≈70 % overall on 16/10/2026. Technical opening was targeted for end-2026, but no opening report had appeared by 28/11/2026. Completion 2027. **Keep `under_construction`.** | [C] | Trungnam, CafeF |
| Contractor | XL-39 main bridge (T37 – T40): Trungnam E&C + Trung Chính. Stays: Vĩnh Hưng. Owner: Ban QLDA giao thông khu vực cảng Cái Mép – Thị Vải. Designer not found | [C] | Trungnam, Thanh Tra |

### 1.1 Pylon geometry (pylon-local frame: x along the bridge, y up from the deck at the pylon, z across; deck edges at ±13.5)

| Element | Observation | Model |
|---|---|---|
| Above-deck arch | Symmetric pointed arch (`cafef4`, axial). Outer width at the deck / height above the deck ≈ 0.6. The legs are near-vertical just above the deck and curve in from ≈ 0.5 H | centrelines ±16 at y 0, ±15.3 at 16, ±12.8 at 32, ±9 at 44, ±4.5 at 53, tip (0, 60, 0) |
| Tip | Pointed, solid above the inner opening (opening apex ≈ 0.87 H) | `crown: "pointed"` plus a G13 panel filling y 52 → 60.3 |
| Legs at the deck | Just outside the box ("legs either side of the K0 pier table", `hnm_a348`) | z ±16, width 4.2 at deck level |
| Lower legs | Converge downward to the cap. The c/c spacing at the cap is ≈ 0.55 to 0.8 of that at the deck: `c3_far` gives 0.57, `hnm_a329` ≈ 0.8 | ±9.5 at the cap top (0.6) |
| Strut | One horizontal strut ≈ 0.45 of the way down from deck to cap | y −28, width 3.5 |
| Section | Hollow box, heavier at the base | 6.0 → 2.5 across, 7.0 → 3.5 along |
| Cap | Ellipse 48 × 26, 5 m thick, top just above the water | stadium 26 (x) × 48 (z), top −52, thickness 5 |

## 2. Current vs reality

| P | Problem | Current | Expected |
|---|---|---|---|
| **P0** | The deck is drawn as open cantilevers plus travellers, but it closed on 24/7/2026 | engine `status === 'under_construction'` → 60 % cantilevers | Full continuous deck, no travellers. **Engine G16** `deck_closed: true` |
| **P0** | The pylon floats: legs end at local y −10 with the deck at ≈60 m; a generic pier and slab carry it | legs from (±15, −10) | Legs down to the cap at y −52, a strut, the elliptical cap (§3) |
| **P0** | The crown is rounded, from an incorrect review note | `PHASE6["cau-phuoc-an"] = {"pylon_custom": {"crown": "rounded"}}` (gen_bridges.py l.823) | **Delete that entry.** Crown `"pointed"` plus the apex panel |
| **P0** | Above-deck height is 44 m (35 in the label); the arch is too squat | `[35,35] above_deck`, tip 44 | Tip **60** above the deck; `pylon_heights_m [119,119]`, `"total"`; the label reads **119** |
| P1 | Spans | 145 + 250 + 145 | **137.5 + 250 + 137.5** |
| P1 | Stay pattern, count and reach | harp, derived count, main side 0.15–0.5 reach (19–62 m) | `semi_fan`, `cables_per_side: 12`, back `[24, 105]`, main `[24, 105]` (**engine G15**) |
| P1 | Deck elevation and profile | heuristic, raised to 59.75 by NAV, flat | `deck_elevation_m: 54`, `deck_crest_m: 6.5` (pylon deck ≈59.0, mid-span 60.5) |
| P1 | Colours | grey / blue default | `pylon_colour "#e9e7e1"`, `stay_colour "white"` |
| P2 | Texts: `pylons`, `pylons_en` ("rounded-arch"), M3D notes, shape-file checklist/review ("rounded crown") | | §3.3 |
| P2 | PRESS has one render only | | Add the CafeF / Báo Xây dựng photos (§3.3) |

## 3. Data changes

### 3.1 Target `model3d` (replace the whole entry)

```json
{
  "spans_m": [137.5, 250, 137.5],
  "pylon_shape": "other",
  "pylon_heights_m": [119, 119],
  "pylon_height_ref": "total",
  "deck_elevation_m": 54,
  "deck_crest_m": 6.5,
  "cable_planes": 2,
  "cable_pattern": "semi_fan",
  "cables_per_side": 12,
  "back_stay_deck_m": [24, 105],
  "main_stay_deck_m": [24, 105],
  "deck_closed": true,
  "deck_width_m": 27.0,
  "deck_type": "concrete",
  "extradosed": true,
  "pylon_colour": "#e9e7e1",
  "stay_colour": "white",
  "confidence": "estimated",
  "notes": "Main bridge 137.5 + 250 + 137.5 m (525 m, T37–T40), extradosed 5-web PSC box, 27 m deck. 'Giọt nước' pylons: pointed Gothic arch straddling the deck, 60 m above the deck, ≈119 m total; legs converge below the deck to a 48 × 26 m elliptical cap, one strut. Two planes of semi-fan stays through saddles, ≈12 per side per plane (count read from the 10/2026 aerial; press: 48 bó). Deck closed 24/7/2026. Water at 0; deck ≈54 m at T37/T40, 59 m at the pylons, 60.5 m at mid-span (55 m clearance).",
  "pylon_custom": {
    "description": "'Giọt nước' (water-drop / flame) pylon at T38 and T39: two hollow-box concrete legs in the transverse plane. From a stadium pile cap they rise and splay outward to just outside the deck edges (z ≈ ±16 at deck level), joined below the deck by one transverse strut, then curve inward above the deck to a POINTED apex 60 m above the deck (Gothic arch). Two near-vertical planes of semi-fan stays run through saddles in the upper legs to the deck edges.",
    "legs": [
      {"centerline": [[0,-52,-9.5],[0,-30,-13.0],[0,-12,-15.3],[0,0,-16.0],[0,16,-15.3],[0,32,-12.8],[0,44,-9.0],[0,53,-4.5],[0,60,0]],
       "width_base_m": 6.0, "width_top_m": 2.5, "depth_base_m": 7.0, "depth_top_m": 3.5},
      {"centerline": [[0,-52,9.5],[0,-30,13.0],[0,-12,15.3],[0,0,16.0],[0,16,15.3],[0,32,12.8],[0,44,9.0],[0,53,4.5],[0,60,0]],
       "width_base_m": 6.0, "width_top_m": 2.5, "depth_base_m": 7.0, "depth_top_m": 3.5}
    ],
    "crown": "pointed",
    "struts": [
      {"a": [0,-28,-12.4], "b": [0,-28,12.4], "width": 3.5}
    ],
    "panels": [
      {"top": [[-5.2,52],[-2.8,57],[0,60.3],[2.8,57],[5.2,52]], "bottom": [[-5.2,52],[0,52.5],[5.2,52]], "depth_m": 3.6}
    ],
    "anchor_zone": [
      {"y_from_m": 18, "y_to_m": 42, "leg": 0},
      {"y_from_m": 18, "y_to_m": 42, "leg": 1}
    ],
    "pile_cap": {"length_x_m": 26, "width_z_m": 48, "top_y_m": -52, "thickness_m": 5, "rounded_ends": true},
    "mirror_for_other_pylons": true,
    "reference_images": [
      "https://cafefcdn.com/203337114487263232/2026/10/27/img4224-17921448362781663170439-1793076853415550427428.jpg",
      "https://cafefcdn.com/203337114487263232/2026/10/27/img4207-17921448355181727615817-17930767736402027576764.jpg",
      "https://cafefcdn.com/203337114487263232/2026/10/27/photo-1793077280357-1793077280757507249795.png",
      "https://nqs.1cdn.vn/thumbs/1200x630/2026/08/01/7031_cau-phuoc-an3.jpg"
    ]
  }
}
```

Notes on the JSON:

- **Water and the cap.** The waterline is local y = −E = −54. The cap top is at −52, so it stands about 2 m out of the water, as in the photos. Below E the crest is scaled by y/E, so the cap moves by only ≈0.2 m.
- **Label.** The label is tip + E + crestAt(T38) = 60 + 54 + 6.5 × (1 − (125/262.5)²) = 60 + 54 + 5.03 = **119.0**.
- **Clearance.** The check is E + crest = 60.5 ≥ 55 + 3.75 + 1 = 59.75, so there is no warning and E stays at 54. Keep the default deck depth; do **not** set `deck_depth_m` above 4.5.
- **Stay planes.** Each leg's average z has a definite sign, so anchor zones 0/1 map to planes −/+. The stays run from the legs (z ≈ ±15 → ±10 over y 18–42) to the deck edges (±13.5).
- **Apex.** The two leg tips meet at (0, 60, 0), so the engine's pointed crown applies. The panel fills the solid tip and hides the small notch where the swept legs overlap. It was checked in `pawork/r2/cau-phuoc-an-top.png`.
- **Fallback.** Until G15/G16 land, the JSON still renders: unknown keys are ignored. The main stays then reach only to 62.5 m, and the deck shows cantilevers.

### 3.2 Generator (`scripts/gen_bridges.py`)

- **`M3D["cau-phuoc-an"]` (l.441).** Make it equivalent to §3.1: spans, `[119,119] "total"`, `semi_fan`, `cps=12`, notes. Set the other keys through `PHASE6` / `REVIEW_R1` `set`, or move everything into a `research/shapes/cau-phuoc-an.json` pass-2 model. Either route is fine.
- **`PYLON["cau-phuoc-an"]` (l.732–741).** Replace it with the `pylon_custom` above.
- **`PHASE6["cau-phuoc-an"]` (l.823).** **Delete** `{"pylon_custom": {"crown": "rounded"}}`, or change it to the colour keys.
- **`add(id="cau-phuoc-an")` (l.283).**
  - Add `span_arrangement="137.5 + 250 + 137.5 m"` if the field is used for other bridges.
  - Add these sources: CafeF 27/10/2026 (spans, 119 m, 70 %), [Thanh Tra](https://thanhtra.com.vn/dau-tu-72A9E3223/cau-phuoc-an-sieu-du-an-1803-ty-dong-lap-ky-luc-nhip-dai-nhat-dong-nam-a-fd59ce4a6.html) (525 m, 60 m above the deck, 5-web box, 48 stays, cap 48 × 26, piles) and [Trungnam closure](https://trungnamec.com.vn/hop-long-nhip-chinh-cau-phuoc-an).
  - Append to the notes: "Main bridge 137.5 + 250 + 137.5 m (T37–T40); 'giọt nước' pointed-arch pylons ≈119 m (60 m above the deck); ≈70 % complete on 16/10/2026."

### 3.3 Texts / images

- `pylons`: "2 tháp hình giọt nước (vòm nhọn) bê tông, cao ≈119 m (60 m trên mặt cầu); chân tháp thu hẹp dưới mặt cầu, một dầm ngang"
- `pylons_en`: "2 'water-drop' pointed-arch concrete pylons, ≈119 m (60 m above deck); legs converge below the deck, one strut"
- `PRESS["cau-phuoc-an"]`: add `img4224…jpg` ("aerial 10/2026, both pylons, closed deck"), `img4207…jpg` ("aerial 10/2026 along the axis") and the `photo-1793077280357…png` render ("render, deck level"), with credit "Báo Xây dựng / CafeF" and source the CafeF URL.
- `research/shapes/cau-phuoc-an.json`:
  - Change `pylons_*` and the model to match.
  - Replace review/notes "rounded crown" with "pointed (Gothic) apex, solid tip".
  - Checklist: "foot below deck: pass (legs converge to an elliptical cap, one strut)"; "crossbeams: one strut below the deck"; "deck / aux piers: pass (no aux piers; deck closed)".

## 4. Engine gaps (both needed for P0/P1; small)

**G16 `model3d.deck_closed?: boolean` (P0).**
- When `status === 'under_construction'` and `deck_closed === true`, build the deck exactly as for a completed bridge: `deckSegments = [{x0: 0, x1: totalLength}]`, no `travellerBoxes`, and all stays present (`onBuiltDeck` is true everywhere).
- The bridge keeps its yellow "under construction" status chip and colours. Only the geometry changes.
- Add it to `types.ts` / `docs/data-schema.md` ("deck is continuous (all closures done) although the bridge is not open").
- Unit test: an under_construction model with `deck_closed` has 0 travellers and one deck segment of the full length.
- Other bridges that may want it later: any under-construction bridge after closure.

**G15 `model3d.main_stay_deck_m?: [number, number]` (P1).** This mirrors `back_stay_deck_m` (G11) for the non-back sides (main span, or toward the next pylon).
- Deck anchors spread linearly from `from` to `to` metres from the pylon station toward the main span; t = 0, the lowest pylon anchor, maps to `from`.
- Clamp `to` to `reach(support, side) − 1`, which is the half-span for a two-pylon main span, and warn when clamping.
- Swap with a warning when from > to, as G11 does.
- Ignored for harp, with the same warning text pattern as G11.
- In the stay loop (bridge3d.ts ~l.668), add a branch `else if (!back && mainDeck) { x = p.x + side * (d0 + (d1 − d0) * t); top = customAnchor / atY as in the back branch }`.
- Unit test: with `main_stay_deck_m [24,105]` on spans [137.5,250,137.5], the main-side anchors of pylon 0 run from station 161.5 to 242.5.

No other engine change is needed. Custom legs, struts, panels (G13), pile_cap, crown, anchor zones, crest, colours and back_stay_deck_m (G11) all exist. The prototype rendered with no warnings.

## 5. Acceptance criteria (I will re-render)

Cameras:
- `--views front,side,three_quarter,foot,top`
- **`--az -30 --el 25 --target unit`**: this matches `cafef3.jpg`, the side-oblique aerial with both pylons.
- **`--az -55 --el 6 --target pylon0`**: this matches the river-level renders `cafef1.jpg` / `nqs.jpg`.
- **`--az 80 --el 3 --target main`**: this matches the deck-level axial render `cafef4.png`. The arch should read as a symmetric pointed Gothic arch over the carriageway.

Checks:

1. **Deck (P0).**
   - Continuous from 0 to 525 with no gap at mid-span.
   - **No yellow traveller boxes.**
   - The status stays `under_construction`.
2. **Pylon (P0).**
   - Pointed solid apex at local y 60, with no rounded or flat crown.
   - Legs at z ≈ ±16 at deck level, just outside the 27 m deck.
   - Legs curve inward from about mid-height.
   - Below the deck the legs converge to ±9.5 on a stadium cap (26 × 48, top ≈2 m above the water).
   - One horizontal strut at about y −28.
   - Nothing floats: the legs run continuously from the cap to the tip, and no generic pier column or slab appears under the pylon.
3. **Proportions** (front / axial camera):
   - outer arch width at the deck / height above the deck ≈ 0.6 (± 0.07);
   - leg c/c at the cap / at the deck ≈ 0.6 (± 0.1);
   - inner-opening apex ≈ 0.87 H.
4. **Heights.**
   - Pylon label **119** (±1).
   - Deck ≈54 at T37/T40, ≈59 at the pylons, 60.5 at mid-span.
   - No clearance warning.
5. **Spans.** 137.5 + 250 + 137.5. No auxiliary piers.
6. **Stays.**
   - White; two near-vertical planes from the legs to the deck edges; semi-fan.
   - **12 per side per plane per pylon** (96 drawn).
   - Anchors on the legs between y 18 and 42.
   - Deck anchors 24 → 105 m from the pylon on both sides. Unstayed main-span centre ≈40 m.
   - Side view: the two fans nearly meet at mid-span, as in `cafef3`.
7. **Colour.** Off-white pylons (`#e9e7e1`).
8. **Data.**
   - The `PHASE6` "rounded" entry is gone.
   - pylons / pylons_en / notes / sources / PRESS are updated.
   - The shape file is updated.
   - The generator assertions pass. `npm test` passes, including the new G15/G16 tests.
9. **No regressions.** Other under-construction bridges without `deck_closed` still render cantilevers and travellers. `back_stay_deck_m` bridges (G11) are unchanged.

## 6. Open points (no user decision required)

- **Stay count.** "48 bó" (Thanh Tra) and "24 bó, 12 per pylon" (Trungnam) are ambiguous. 12 per side per plane is my photo count, and it is consistent with 48 saddle cables. If the user has a drawing, use its count.
- **Height.** 116 m (Thanh Tra 2025) vs 119 m (CafeF / Báo Xây dựng 10/2026). I used 119 because it is newer and matches 60 m above the deck at a ≈59 m deck level.
- **Lower-leg convergence.** The photos range from 0.57 to 0.8 of the deck-level spacing; ±9.5 (0.6) follows the renders and the side photo.
- **Cap orientation.** The 48 m axis is assumed transverse, because the legs need the width.
