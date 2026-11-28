# 3D model review: round 9, Cầu Vàm Cống (`cau-vam-cong`), 2026-11-28

The user asked for a revision. **Confirmed: the pylon is the wrong shape above the deck.**

The model draws two near-vertical legs (±14 → ±12 m) with a thin beam just under the tip, which reads as a tall, open rectangle. The real pylon is an **"improved H"** (the designers' term, "개선된 H형"):

- Above the deck the legs **lean strongly inward**, from about ±16.5 m at the deck to about ±5.75 m.
- There they meet a **single upper crossbeam with a round-arched soffit**, at about 0.75 of the above-deck height.
- Above the crossbeam they continue as **two vertical posts** with flat tops, about 11.5 m apart (c/c).
- Below the deck the legs splay out to a large pile cap. A **deep under-deck crossbeam** with haunched, arched soffit joins them at the knee.
- The stays are **blue**, not the default teal/grey.

**No client-confirmed conflict.** No Vàm Cống value in `gen_bridges.py` is marked client-confirmed.

Round 1 changed the height to **150 m** (`REVIEW_R1` `scale_y 1.05`). The design paper gives **143.9 m above the top of the foundation**. The press figure of 150 m is consistent with that if it is measured from the pile-cap underside (143.9 + ≈6 m cap). This brief sets the drawn water-to-tip height to **147 m**: 143.9 m plus a pile cap whose top is about 3 m above the water. **`scale_y` must be removed.**

Reference images are in scratchpad `ref/vc/` (`/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/ref/vc/`):

| File | What it is |
|---|---|
| `c1.jpg`, crop `c1_crop.png` | Commons "Vam_Cong_Bridge.jpg" (Duong Dang Khoi), dusk, low bank view nearly along the axis. Near pylon face-on: splayed feet, haunched under-deck beam, legs converging to the arched upper beam, posts. **Primary form reference.** |
| `c4.png`, crop `c4_crop.png` | Commons "Cầu_Vàm_Cống.png" (Bùi Thụy Đào Nguyên), sunset silhouette, same kind of view. **Primary proportion reference:** upper beam at 0.82 of cap-to-tip, deck at 0.24 |
| `c2.png` | Commons "Cầu Vàm Cống trong chiều" (night). Anchor pier (portal with cap beam) at the unit end, then about 40 m approach spans. No intermediate pier in the side span |
| `n3.jpg`, crop `n3_crop.png` | Drone shot along the deck axis (Người Quan Sát 12/2024). **Arched soffit of the upper beam, vertical posts, inclined blue stay planes** |
| `n1.jpg`, `n2.jpg` | Drone shots in fog: large rectangular pile caps, no aux piers, blue stays |
| `n4.jpg` | Close-up of the deck: stays anchored outboard of the railing on the edge girders; blue sheaths |
| `n5.jpg` | Aerial with the approaches |
| `c3.jpg` | Commons 2016 construction photo (pylons climbing) |

Renders:
- **Current model:** scratchpad `views-vc/`. This includes `custom-az70-el3-pylon0` and `custom-az25-el22-unit`.
- **Prototype of the target:** scratchpad `vcwork/r1/`. It was rendered from a scratch copy of the repo (`vcwork/repo`); the project itself is untouched. The exact model JSON is in `vcwork/target.json`, and the script that applies it is in `vcwork/target.py`. The prototype generated and rendered with no warnings.

Confidence tags: **[C]** confirmed by a source · **[P]** measured on photos · **[E]** estimated.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Main bridge | **210 + 450 + 210 = 870 m**, 3 spans, 2 pylons. The design paper says the original scheme with an intermediate pier was **changed to exclude it** ("중간교각을 배제한 2주탑 3경간"). The side/main ratio was raised from 0.42 (190/450) to 0.47 (210/450) to cut uplift at the anchor piers, which carry tie-down cables (8 × 19-15.7). **No auxiliary piers**; the anchor piers AP1/AP2 are at the unit ends | [C] | [Cienco 625](http://cienco625.vn/tin-tuc/khoi-cong-du-an-xay-dung-cau-vam-cong-152); Lee & Kang 2013, [KoreaScience](https://www.koreascience.kr/article/JAKO201334064308422.pdf) / [ScienceON](https://scienceon.kisti.re.kr/srch/selectPORSrchArticle.do?cn=JAKO201334064308422&dbt=NART); photos c2, n2 |
| Whole bridge | 2,970 m (approaches 1,099.7 m Đồng Tháp side + 999.7 m Cần Thơ side, Super-T). Expansion joint at P29 (girder crack incident, 11/2018) | [C] | [vi.wikipedia](https://vi.wikipedia.org/wiki/C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng), [VnExpress](https://vnexpress.net/cau-vam-cong-sau-khi-phat-hien-nut-dam-thep-3672266.html) |
| Girder | **Steel–concrete composite**: 2 edge girders **2.0 m deep**, about 25 m apart, cross beams, precast slabs 260 mm. Segments 12 m | [C] | Lee & Kang 2013 |
| Deck width | **24.5 m** (4 motor lanes + 2 mixed lanes; 6 lanes in the final phase). 25.8 m overall to the outside of the edge girders (crack paper, wind-tunnel note). `width_m` in the seed table is still **21.6, which is wrong** | [C] | TEDI, vi.wiki, CafeF; [ResearchGate](https://www.researchgate.net/publication/354535209) |
| Navigation | Clearance **37.5 m** for 10,000 DWT. Channel width not found | [C] | [TEDI](https://tedi.vn/project/cau-vam-cong/), VOV, CafeF |
| Pylon height | **143.9 m above the top of the foundation** (design). Press "150 m" (project director, vi.wiki). Some sources give "over 143 m" | [C] | Lee & Kang 2013, TEDI; [CafeF](https://cafef.vn/cau-5700-ty-co-tru-thap-cao-nhat-coc-khoan-sau-nhat-viet-nam-188230505101414572.chn) |
| Pylon form | "Improved H", hollow rectangular concrete section, 50 MPa, auto-climbing form in 4 m lifts. Geometry in §1.1 | [C] form, [P] geometry | Lee & Kang; c1, c4, n3 |
| Deck level | Deck top at the pylon is about **0.24 × cap-to-tip** above the pile-cap top: measured 0.23 (c1), 0.24 (c4), 0.26 (c2) → about 35–36 m above the cap top, so about **39 m above the water**. Mid-span must be ≥ 37.5 + 2.5 (girder) + 1 = **41 m** for the engine's clearance rule | [P]/[E] | c1, c2, c4 |
| Stays | **144 stays** = 2 pylons × 2 planes × 2 sides × **18**. Two inclined planes, fan / semi-fan. Deck anchors on the edge girders at **12 m**, outboard of the railing. Multi-strand cables, 30–73 × 15.7 mm. The VnExpress "114" is a typo for 144 | [C] | CafeF, Người Quan Sát (144), Lee & Kang (12 m, fan) |
| Stay anchorage on pylon | From about 0.45 of the above-deck height up to just under the tip; the top stays anchor on the posts above the upper beam | [P] | c1_crop, n3_crop |
| Foundations | Bored piles **D2.5 m, up to 116 m** (63–98 m embedded per the design paper), spaced 3.0D at the pylons. Large rectangular pile caps, standing about 3 m out of the water, roughly 1.4 × the leg-foot spacing across | [C] piles, [P] cap | CafeF, Lee & Kang; c1, n1, n2 |
| Colours | Pylons light grey / off-white concrete. **Stays medium blue** (vivid in daylight drones). Deck grey | [P] | n1–n4 (daylight), c1 |
| Contractors | **GS E&C (80 %) + Hanshin E&C** (not Daelim). Cienco 1 subcontractor. Design: Dasan + Kunhwa + Pyunghwa. KEXIM EDCF loan. Built 9/2013 – 19/5/2019 | [C] | vi.wiki; [Etoday](https://www.etoday.co.kr/news/view/788059) |

### 1.1 Pylon geometry

Frame: pylon-local, x along the bridge, y up from E, z across.

Engine note: local y = 0 is the deck level at the unit ends (E = 33). Points above 0 are lifted by crestAt(pylon) = 6.23. Points below 0 are stretched by (1 + 6.23/33) = 1.19, so the local values below are real values ÷ 1.19.

| Element | Photo observation | Model value (local) |
|---|---|---|
| Pile cap | Large block, top about 3 m above the water; cap about 6 m thick (150 − 143.9) | top −30.5 (real water +3.0); 32 (x) × 64 (z); thickness 5 (≈6 m drawn) |
| Feet | Leg c/c at the cap is about 1.43 × the c/c at deck level (c1 1.45, c4 1.41) | z ±23.5 |
| Lower legs | Straight, splaying outward going down | (−30.5, ±23.5) → (−18, ±20.35) → knee (−6, ±17.2) |
| Under-deck beam | Deep transverse beam just under the girder. The soffit is haunched into the legs and gently arched | panel: top −2.5, soffit −6.7 at the centre, falling to −12 at the legs; 8 m along x |
| Upper legs | Lean inward ≈7° from vertical. The c/c at the upper beam is ≈0.33–0.35 × the c/c at the deck (c1, c4) | (−6, ±17.2) → (30, ±12.6) → (78, ±5.75); inner face at deck ≈ ±13.3, clear of the 25.8 m deck |
| Upper crossbeam | At 0.82 of cap-to-tip (c4), i.e. about 0.76 of the above-deck height. Flat top, **round-arched soffit** (n3) | panel z ±4.5, top 84, soffit 75 at the legs → 80.4 at the centre, 5.5 m along x |
| Posts | Vertical above the bend, ≈ 22–24 m above the beam top, flat tops. Clear gap ≈ 2 × post width (n3) | (78 → 107.8, ±5.75). Tip local 107.8 → label 107.8 + 33 + 6.23 = **147.0** |
| Section | Legs visibly heavier at the foot | across 6.5 → 4.0, along 9.0 → 6.0 |
| Anchor zone | From about 0.45 H up to just under the tip, on both legs | y 48 → 104 |

## 2. Current vs reality

| P | Problem | Current | Expected |
|---|---|---|---|
| **P0** | Upper legs near-vertical (±14 → ±12) with a thin straight beam at 0.92 H. The pylon reads as a plain rectangle frame, not the Vàm Cống "improved H" | `research/shapes/cau-vam-cong.json` | Legs converge from ±17.2 (knee) to ±5.75 at y 78, then vertical posts to 107.8. Arched-soffit upper beam at y 75–84 (§3.1) |
| **P0** | `REVIEW_R1["cau-vam-cong"]` `scale_y: 1.05` would rescale the new geometry | gen_bridges.py l.904 | **Remove `scale_y`**. Set `pylon_heights_m: [147, 147]` |
| P1 | Stays default teal | none | `stay_colour: "#3b7fd4"`, `colour_mode: "vivid"` (blue must read as blue; the pylon stays light grey) |
| P1 | Under-deck beam is a thin square bar at −3 | `crossbeams_y_m [-3, 96.6]` | Deep haunched panel (§3.1). **Drop `crossbeams_y_m`**: both beams become panels |
| P1 | Deck elevation is the heuristic and there is no crest; girder depth defaults to 3.75 | — | `deck_elevation_m: 33`, `deck_crest_m: 8.5`, `deck_depth_m: 2.5`: deck at pylons ≈ 39.2, mid-span 41.5, ≥ 41 clearance minimum, so no warning |
| P1 | Stay count derived; back stays derived | — | `cables_per_side: 18`, `back_stay_deck_m: [12, 204]` |
| P1 | No pile cap | — | `pile_cap` 32 × 64, top −30.5, thickness 5 |
| P1 | Seed `width_m` 21.6; M3D notes say 21.6 / "≈140 m estimated" | l.31, l.387 | `width_m=24.5`; notes as in §3.2 |
| P2 | Leg sections are constant-ish 6 → 3.5 with no depth | | across 6.5 → 4.0, along 9 → 6 |
| P2 | Texts `pylons` / `pylons_en` say "cao 150 m" | REVIEW_R1 `bridge` | §3.3 |
| P2 | NAV reference missing | `nav(37.5, None, None, VOV)` | add reference "for 10,000 DWT; above design high water" and the TEDI source |

## 3. Data changes

### 3.1 Target `model3d`

This replaces the shape file's `model3d`. It was verified in the scratch copy: the generator passes once the G14 assertion is widened (§3.2), and it renders with no warnings.

```json
"spans_m": [210, 450, 210],
"pylon_shape": "H",
"pylon_heights_m": [147, 147], "pylon_height_ref": "total",
"deck_elevation_m": 33, "deck_crest_m": 8.5, "deck_depth_m": 2.5,
"cable_planes": 2, "cable_pattern": "fan",
"cables_per_side": 18, "back_stay_deck_m": [12, 204],
"deck_width_m": 24.5, "deck_type": "composite",
"pylon_colour": "#d8d5cc", "stay_colour": "#3b7fd4", "colour_mode": "vivid",
"confidence": "estimated",
"pylon_custom": {
  "description": "Improved H (Vàm Cống): below the deck two straight legs splay outward from a large pile cap to a knee just under the deck, joined by a deep under-deck crossbeam with a haunched, slightly arched soffit; above the deck the legs lean inward (≈7° from vertical) to a single upper crossbeam with a round-arched soffit at ≈0.75 of the above-deck height, then continue as two vertical posts ≈11.5 m apart to flat tops. Stays in two inclined planes from the legs/posts to the edge girders.",
  "legs": [
    {"centerline": [[0,-30.5,-23.5],[0,-18,-20.35],[0,-6,-17.2],[0,30,-12.6],[0,78,-5.75],[0,95,-5.75],[0,107.8,-5.75]],
     "width_base_m": 6.5, "width_top_m": 4.0, "depth_base_m": 9.0, "depth_top_m": 6.0},
    {"centerline": [[0,-30.5,23.5],[0,-18,20.35],[0,-6,17.2],[0,30,12.6],[0,78,5.75],[0,95,5.75],[0,107.8,5.75]],
     "width_base_m": 6.5, "width_top_m": 4.0, "depth_base_m": 9.0, "depth_top_m": 6.0}
  ],
  "panels": [
    {"top": [[-4.5,84],[4.5,84]],
     "bottom": [[-4.5,75],[-4,77.6],[-3,79.2],[-1.5,80.1],[0,80.4],[1.5,80.1],[3,79.2],[4,77.6],[4.5,75]],
     "depth_m": 5.5},
    {"top": [[-16,-2.5],[16,-2.5]],
     "bottom": [[-16,-12],[-14,-9],[-11,-7.6],[-6,-6.9],[0,-6.7],[6,-6.9],[11,-7.6],[14,-9],[16,-12]],
     "depth_m": 8.0}
  ],
  "pile_cap": {"length_x_m": 32, "width_z_m": 64, "top_y_m": -30.5, "thickness_m": 5, "rounded_ends": false},
  "anchor_zone": [
    {"y_from_m": 48, "y_to_m": 104, "leg": 0},
    {"y_from_m": 48, "y_to_m": 104, "leg": 1}
  ],
  "mirror_for_other_pylons": true,
  "reference_images": [
    "https://commons.wikimedia.org/wiki/File:Vam_Cong_Bridge.jpg",
    "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng.png",
    "https://nqs.1cdn.vn/2024/12/02/dautu.kinhtechungkhoan.vn-stores-news_dataimages-2024-122024-02-15-_cau-co-tru-thap-cao-nhat-viet-nam320241202154835.jpg"
  ]
}
```

Notes on the JSON:

- **Label.** The label is tip + E + crestAt(210) = 107.8 + 33 + 8.5 × (1 − (225/435)²) = 107.8 + 33 + 6.23 = **147.0**.
- **Real height above the cap.** The cap top is at real +3.0 (local −30.5 × 1.19 + 39.2), so the real tip above the cap is 144.0 ≈ 143.9.
- **Clearance.** E + crest = 41.5 ≥ 37.5 + 2.5 + 1 = 41, so there is no warning and E stays 33. End grade 4 × 8.5 / 870 ≈ 3.9 %, which is plausible for the approach ramps.
- **Waterline.** The waterline is local −33. The cap spans local −30.5 to −35.5, so it stands about 3 m proud of the water, as in the photos.
- **Panels in place of `crossbeams_y_m`.** Both beams are panels. Do **not** also set `crossbeams_y_m`, or straight bars would be drawn through the arches. Panel z ends (±4.5 and ±16) sit inside the legs, so the joints close.
- **Main-span stays.** These keep the engine default (deck from 0.08 to 1.0 of the reach, ≈18 → 225 m). The real layout is 12 m spacing, about 12 → 216 m. Close enough; no engine change.

### 3.2 Generator (`scripts/gen_bridges.py`)

- **`research/shapes/cau-vam-cong.json`.** Replace `model3d` with §3.1. Update the `pylons_vi`/`pylons_en`, `review` and `checklist` texts:
  - "improved H: legs converge above deck, arched upper beam at ≈0.75 H, vertical posts; splayed feet; deep under-deck beam; blue stays".
  - Notes: "Spans 210 + 450 + 210, no auxiliary piers (design paper: intermediate pier eliminated). Pylon 143.9 m above the foundation top (Lee & Kang 2013 / TEDI); 147 m drawn from the water with the cap ≈3 m proud; press '150 m' is probably from the cap underside. 144 stays = 18 per side per plane. Composite girder (2.0 m edge girders, 12 m segments), 24.5 m deck, clearance 37.5 m. Deck level estimated from photos (≈39 m above water at the pylons, 41.5 m at mid-span)."
- **l.31 `add(...)`.** Set `width_m=24.5`. Add sources TEDI, CafeF and the KoreaScience paper. Append to notes: "Contractor GS E&C – Hanshin JV (Korea, EDCF)."
- **l.387 `M3D`.** Change 21.6 → 24.5 and `[140,140]` → `[147,147]`, and update the notes as above. The shape file overrides this anyway, but keep them consistent.
- **l.904 `REVIEW_R1`.** Remove `"scale_y": 1.05`. Keep `"set": {"pylon_heights_m": [147, 147]}`. Set the `bridge` texts per §3.3, and the note to "r9: improved-H pylon, 143.9 m above foundation (design paper)".
- **l.615 NAV.** `nav(37.5, None, "for 10,000 DWT ships", "https://tedi.vn/project/cau-vam-cong/")`.
- **G14 assertion (~l.1105).** `assert b["id"] == "cau-ngoc-hoi" or "colour_mode" not in m` must allow `cau-vam-cong`. It is better as a set `VIVID_OK = {"cau-ngoc-hoi", "cau-vam-cong"}`, because other r9 bridges may add to it. Optionally add `EXPECT_R1["cau-vam-cong"] = {"stay_colour": "#3b7fd4", "cables_per_side": 18}`.

### 3.3 Bridge texts

- `pylons`: "2 tháp chữ H cải tiến: hai chân nghiêng vào trên mặt cầu, dầm ngang trên có vòm, hai cột đứng ở đỉnh; chân choãi dưới mặt cầu, dầm ngang đỡ dầm; cao 143,9 m từ đỉnh bệ móng (≈150 m)"
- `pylons_en`: "2 'improved H' pylons: legs lean inward above the deck to an arched upper crossbeam and two vertical posts; splayed feet with a deep under-deck beam; 143.9 m above the foundation top (≈150 m)"

## 4. Engine gaps

**None.** The prototype uses existing features only: legs with depth, G13 panels, `pile_cap`, `deck_elevation_m` / `deck_crest_m` / `deck_depth_m`, `back_stay_deck_m`, and G14 vivid. The only code change is the generator assertion in §3.2.

Optional, P2, do not block:

- **`main_stay_deck_m?: [number, number]`**, the main-side analogue of G11. It would allow the exact 12 → 216 m layout. The current default (18 → 225) is visually indistinguishable.

## 5. Acceptance criteria (I will re-render)

Cameras:

- `--views front,side,foot,top,three_quarter`
- **`--az 70 --el 3 --target pylon0`**: compare with `c1.jpg` / `c4.png` (near pylon nearly face-on, deck running off to the right).
- `--az 25 --el 22 --target unit`: compare with drone `n2.jpg`.

Criteria:

1. **Form (P0)**, checked in the front view and az70.
   - Above the deck the legs visibly converge; at the upper beam the c/c is 0.33–0.40 × the c/c at deck level.
   - One upper crossbeam with an **arched soffit**, top at local 84 ± 2. No straight beam near the tip.
   - Two vertical posts above it, tips at local 107.8.
   - The front view should match `n3_crop.png`.
2. **Below the deck.**
   - The legs splay out to the cap: foot c/c ≈ 1.4 × the deck-level c/c.
   - A deep under-deck beam with haunched/arched soffit is visible in the foot view.
   - A rectangular cap ≈3 m proud of the water.
3. **Height.**
   - Label **147 m**.
   - Deck ≈39.2 at the pylons and 41.5 at mid-span (visible crest in the side view).
   - No clearance warning.
   - `scale_y` is gone.
4. **Stays.**
   - Blue (`#3b7fd4`, vivid), 18 per side per plane (144 total).
   - Two inclined planes from the legs (y 48–104) to the deck edges.
   - Back stays land 12–204 m from the pylon.
   - No aux piers.
5. **Data.**
   - `width_m` 24.5, NAV source/reference, texts and notes updated.
   - `python3 scripts/gen_bridges.py data/bridges.json` passes; `npm test` passes.
   - No other bridge's `colour_mode` changes.

## 6. Open points (no user decision needed)

- **Deck level** is photo-derived [P/E], about ±3 m. The label stays 147 whatever E is, as long as the tip is re-solved (tip = 147 − E − crestAt).
- **147 vs 150.** If the user prefers the press 150 m, set `pylon_heights_m [150,150]` and raise the tip to local 110.8. Do not use `scale_y`.
- **Pile cap size** (32 × 64) is [P], low confidence. The photos show a large block, possibly with a fender ring.
