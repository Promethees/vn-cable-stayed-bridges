# 3D model review: round 10, Cầu Mỹ Thuận (`cau-my-thuan`, the 2000 bridge), 2026-11-28

The user asked for another review. **Confirmed: the pylon is drawn as a plain rectangle, which is wrong, and the deck level and crest are also off.**

The model has two near-vertical legs (±14 → ±12.3 m) and a thin bar at 42 m. The real Mỹ Thuận tower is an **H whose legs are straight and lean inward over their whole lower part**:

- The legs run from a long pile cap, past the deck, up to a **single upper crossbeam at about half the above-deck height**. The crossbeam is deep and its soffit is gently arched.
- Above the crossbeam the legs continue as **two near-vertical posts**, about 19 m apart, with chamfered tops. These posts carry the stay anchorages.
- Under the girder there is a **deep crossbeam with a haunched soffit**.
- The deck sits on a strong vertical curve. The side spans fall at about 5 % to the anchor piers.

The current model has none of this except the H.

**No client-confirmed conflict.** No Mỹ Thuận value in `gen_bridges.py` is marked client-confirmed (`CC`).

**Height check.** Round 7's crest-aware clearance gave E 35.4 (unit ends) and 41.4 (mid-span), with a label of 121.7 against 120 in the data. The new figures below were re-derived from TEDI (the designer's institute) and from photos:

- The **pylon is 123.5 m above the top of the pile cap and 84.43 m above the deck** (TEDI, vi.wikipedia).
- The infobox gives **116.5 m**, and the press says "120 m above high water".
- Reconciling these, the target is **label 121.0 m** (water to tip), **83.5 m tip above the deck at the pylon**, deck **37.5 m at the pylons** and **40.5 m at mid-span**. See §1.2.

Reference images are in `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/ref/mt/`:

| File | What it is |
|---|---|
| `c1.jpg`, crop `c1_crop.png`, `c1_grid.png` | Commons "Cầu Mỹ Thuận (6297673871)" (Quang Vũ Trương, CC BY 2.0), from the bank about 45° off the axis. Near pylon from cap to tip. Leg lean, upper beam at ≈0.5 H, posts, deep under-deck beam with arched soffit, low pile cap. **Primary form and proportion reference** |
| `c3.jpg`, crop `c3_crop.png` | Commons "Cầu Mỹ Thuận, Vĩnh Long, 2013" (Prenn), distant oblique view. Same form; beam bottom at 0.48 and top at 0.53 of the above-deck height; post c/c ≈ 0.78 × the leg c/c at the deck |
| `c2.jpg`, `c2_grid.png` | Commons "My_Thuan_Bridge_cables" (Dragfyre), taken on the deck looking along the axis, pylon face-on. Straight inward-leaning legs, deep beam with arched soffit, posts with chamfered tops, stays light blue, semi-fan anchorages on the posts. Measured c/c ratios: beam/deck 0.65, posts/deck 0.57. Some keystone, so these are averaged with c1/c3 |
| `c4.jpg`, crop `c4_crop.png` | Commons "Cầu Mỹ Thuận 1 và 2" (AnhNguyen, drone). Long pile cap with rounded/pointed ends, oriented across the bridge; no auxiliary piers in the side spans; whitish concrete |

Renders:

- **Current model** (main checkout): `…/scratchpad/views-mt/` (front, side, foot, top, three_quarter, `custom-az50-el8-pylon0`).
- **Prototype of the target**: `…/scratchpad/mtwork/r1/` (the same views plus `custom-az50-el8-pylon0` and `custom-az20-el6-unit`).
  - It was rendered from a scratch copy of the repo (`mtwork/repo`); the project itself is untouched.
  - The exact JSON is in `mtwork/target.json`, and `mtwork/target.py` applies it.
  - Contact sheets: `…/scratchpad/cur_sheet.png` and `…/scratchpad/proto_sheet.png`.
  - The generator passed and the render had no warnings.

Confidence tags: **[C]** confirmed by a source · **[I]** inferred from sources · **[P]** measured on photos · **[E]** estimated.

## 1. Facts

| Item | Value | Conf | Source |
|---|---|---|---|
| Main bridge | **150 + 350 + 150 m**. The cable-stayed section is 660 m because the deck runs 5 m past each anchor pier: the outermost side-span stays anchor 5.0 m beyond the anchor-pier centreline. Approaches 875.2 m in 22 spans of Super-T girders (40 / 38.8 / 43.8 m). Total 1,535.2 m | [C] | [TEDI](https://tedi.vn/project/cau-my-thuan/), [vi.wikipedia](https://vi.wikipedia.org/wiki/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn) |
| Auxiliary piers | **None.** Only the anchor piers at the unit ends: two RC columns 1.5 × 3.5 m each, no cap beam, tied directly into the deck, on 2 × D2.5 m piles | [C] | TEDI; photos c1, c4 |
| Deck | **23.66 m**: 4 motor lanes and 2 footways. Prestressed concrete (grade 50), built by balanced cantilever. **Two edge girders 1.76 m deep** (1.2–1.4 m wide), cross girders, 250 mm slab. Longitudinal grade up to **5 %** | [C] | TEDI, vi.wiki |
| Stay planes | **Two planes 18.6 m apart**, which is narrower than the 23.66 m deck: the footways (≈2.5 m) lie outside the stays. Semi-fan | [C] | TEDI, vi.wiki |
| Stays | **128 = 8 groups × 16** (2 pylons × 2 planes × 2 sides × 16). Freyssinet 7-wire 15.2 mm strands, 22–68 (69) per stay. Angle 77.39° (innermost side-span stay) to 31.03° (outermost). **Blue HDPE sheaths** (AECOM); light blue in the photos | [C] | TEDI, vi.wiki, [AECOM](https://aecom.com/projects/thuan-bridge/) |
| Pylon height | **123.5 m from the top of the pile cap; 84.43 m above the deck** (TEDI). Infobox 116.5 m. Press and en-wiki say "120 m above high water". AECOM says 128 m, Structurae 116 m | [C] (conflicting bases) | TEDI, vi/en wiki, AECOM |
| Pylon form | "H-shaped" reinforced concrete, grade 50 [C]. Legs straight and leaning inward from the cap to the upper beam; one upper beam at ≈0.5 of the above-deck height; near-vertical posts with chamfered tops; deep under-deck beam [P] | [C]/[P] | TEDI; c1, c2, c3 |
| Foundations | 16 bored piles D2.5 m per pylon, to −90 m (north) and −100 m (south). Bottom of the solid cap +1.0 m; casings to −35 / −40 m. Long cap with rounded or pointed ends, across the bridge, standing ≈4–5 m out of the water | [C] piles, [P] cap | TEDI; c1, c4 |
| Navigation | **37.5 × 110 m**. Ship impact 32,000 kN | [C] | TEDI (better than the current mytour.vn source) |
| Builders | Design and supervision Maunsell McIntyre (now AECOM). Contractor Baulderstone Hornibrook with Cienco 6. Built 6/7/1997 – 21/5/2000. A$90.86 m, 66 % AusAID | [C] | vi.wiki, AECOM, [TRID](https://trid.trb.org/view/715352) |
| Colours | Pylons and deck: warm off-white / light grey concrete. Stays: light blue | [P]/[C] | c1–c4, AECOM |

### 1.1 Pylon geometry (photo measurements)

Heights are given as fractions of deck-to-tip (H′ = 83.5 m):

| Element | c1 | c3 | c2 | Adopted (real, above the pylon deck) |
|---|---|---|---|---|
| Upper beam bottom / top | 0.49 / 0.545 | 0.48 / 0.53 | 0.54 / 0.60 (keystone) | **40.6 / 45.5 m**, soffit arched ≈1 m |
| Leg c/c at beam ÷ c/c at deck | 0.745 | 0.81 | 0.65 | ≈0.70 |
| Post c/c ÷ c/c at deck | 0.69 | 0.78 | 0.57 | ≈0.64, i.e. posts **±9.5** if the deck c/c is **29.5** |
| Foot c/c ÷ c/c at deck | 1.18 | — | — | foot **±18.0** |
| Cap top to deck | 0.364 × H′ ≈ 30.7 m | | | 32–33 m (116.5 − 84.43 = 32.1) |
| Leg width across | at deck ≈ 0.148 × c/c ≈ 4.4 m; posts ≈ 2.4–2.6 m (c2) | | | 5.0 at the foot → 2.6 at the tip |

Why these values hang together:

- With the posts at ±9.5, the stay planes are almost vertical. This matches the 18.6 m plane spacing (deck anchors ±9.3).
- The leg inner faces at deck level are at about ±12.6, just clear of the 23.66 m deck (±11.83).

### 1.2 Levels (how the 121 m label is reached)

- The two TEDI figures read together: 123.5 − 116.5 = 7 m of pile cap (bottom of the solid part at +1 m), so 116.5 m is cap top to tip. Cap top to deck is then 116.5 − 84.43 = **32.1 m**. Photo c1 gives 30.7 m [P].
- The cap stands about **4.5 m** above the water (c1, c4). So the tip is ≈4.5 + 116.5 = **121 m above the water**, which matches "120 m above high water", and the deck at the pylon is ≈**36.5 m**.
- The clearance of 37.5 m over the 110 m channel, with a 1.8 m girder, needs the deck at ≥ 40.3 m mid-span in the engine's rule. So the main span rises ≈4 m from the pylons to mid-span.
- The side spans fall about 7–8 m to the anchor piers (5 % grade; the 31° outer stay also needs it).
- The engine has one parabola over the unit, so we take **E = 30, crest 10.5, deck_depth 1.8**:
  - deck at the unit ends **30.0**
  - deck at the pylons 30 + 10.5 × (1 − (175/325)²) = **37.46**
  - deck at mid-span **40.5** (≥ 37.5 + 1.8 + 1 = 40.3: no raise, no warning)
  - end grade 6.5 % (real ≤ 5 %; acceptable)
- Tip local **83.5** gives label 83.5 + 37.46 = **120.96 ≈ 121 m**. Above the deck that is 83.5 vs 84.43 published (−1 %).

## 2. Current vs reality

| P | Problem | Current | Expected |
|---|---|---|---|
| **P0** | Legs near-vertical (±14 → ±12.3), so the pylon reads as a plain rectangle frame. The real legs lean in about 6° from the cap to the upper beam, then turn into vertical posts | shape file legs | Legs (−26.4, ±18) → (0, ±14.75) → (43, ±10.4) → posts ±9.6 → (83.5, ±9.5) (§3.1) |
| **P0** | Upper "beam" is a thin square bar at 42 m; the real beam is deep with an arched soffit. Under-deck beam is a thin bar at −3 | `crossbeams_y_m [-3, 42]` | Two **panels**: upper top 45.5, soffit 40.6 → 41.6; under-deck top −1.6, soffit −6.8 → −5.8 (local). **Drop `crossbeams_y_m`** |
| **P1** | Deck levels: E 35.4 / 41.4 mid; crest 6 too small, side-span fall too small; girder depth defaults to 2.92 | PHASE6 crest 6, no E | `deck_elevation_m 30`, `deck_crest_m 10.5`, `deck_depth_m 1.8` → 30 / 37.5 / 40.5 |
| P1 | Label 121.7 from a 41.4 m deck basis; tip local 82 sits on the wrong deck level | tip 82, heights [120,120] | Tip local 83.5 → label **121.0**; `pylon_heights_m [121,121]` |
| P1 | No pile cap; legs end at a point in the water | — | `pile_cap` 20 × 52, stadium ends, top local −26.4, thickness 5.6 (≈7 m drawn, top ≈4.5 m above the water) |
| P1 | Stays default teal/grey; real stays are blue HDPE (light blue) | — | `stay_colour "#7aa6cc"` (muted mode is fine; no vivid needed) |
| P1 | Anchor zone 48–80 on legs whose geometry is wrong | 48–80 | 47–79 on the posts (lowest anchors just above the beam top, top one ≈4.5 m under the tip) |
| P2 | Back stays default to 11 → 142.5 m; the real outermost stay lands 5 m past the anchor pier | — | `back_stay_deck_m [10.5, 149]` (clamped by the engine at end − 1) |
| P2 | Leg sections 4.5 → 3.0 across | | 5.0 → 2.6 across, 6.0 → 4.0 along |
| P2 | Pylon colour default | — | `pylon_colour "#dcd6c8"` (warm off-white) |
| P2 | Stays land at the deck edges (±11.83); the real planes are 18.6 m apart (±9.3) | engine | Optional engine gap G15 (§4) |
| P2 | Seed text: span note says "from general knowledge"; `pylons` texts; NAV source is a travel blog | gen_bridges.py | §3.2–§3.3 |
| P2 | Chamfered post tops are not modelled | — | Skip (sub-metre detail) |

## 3. Data changes

### 3.1 Target `model3d` (replaces the shape file's `model3d`)

```json
{
  "spans_m": [150, 350, 150],
  "pylon_shape": "H",
  "pylon_heights_m": [121, 121],
  "pylon_height_ref": "total",
  "deck_elevation_m": 30,
  "deck_crest_m": 10.5,
  "deck_depth_m": 1.8,
  "cable_planes": 2,
  "cable_pattern": "semi_fan",
  "cables_per_side": 16,
  "back_stay_deck_m": [10.5, 149],
  "deck_width_m": 23.66,
  "deck_type": "concrete",
  "pylon_colour": "#dcd6c8",
  "stay_colour": "#7aa6cc",
  "confidence": "estimated",
  "pylon_custom": {
    "description": "H pylon (Mỹ Thuận): two straight legs lean inward (≈6° from vertical) all the way from a long stadium pile cap, past the deck, to a single upper crossbeam with a gently arched soffit at ≈0.5 of the above-deck height; above it the legs continue as two near-vertical posts ≈19 m apart with chamfered tops, carrying the stay anchorages. A deep under-deck crossbeam with a haunched soffit carries the girder between the legs. Stays in two near-vertical planes 18.6 m apart, semi-fan.",
    "legs": [
      {"centerline": [[0,-26.4,-18.0],[0,-12.8,-16.35],[0,0,-14.75],[0,20,-12.75],[0,43,-10.4],[0,46.5,-9.7],[0,60,-9.6],[0,83.5,-9.5]],
       "width_base_m": 5.0, "width_top_m": 2.6, "depth_base_m": 6.0, "depth_top_m": 4.0},
      {"centerline": [[0,-26.4,18.0],[0,-12.8,16.35],[0,0,14.75],[0,20,12.75],[0,43,10.4],[0,46.5,9.7],[0,60,9.6],[0,83.5,9.5]],
       "width_base_m": 5.0, "width_top_m": 2.6, "depth_base_m": 6.0, "depth_top_m": 4.0}
    ],
    "panels": [
      {"top": [[-10.5,45.5],[10.5,45.5]],
       "bottom": [[-10.5,40.6],[-7,41.2],[-3.5,41.5],[0,41.6],[3.5,41.5],[7,41.2],[10.5,40.6]],
       "depth_m": 3.5},
      {"top": [[-14.5,-1.6],[14.5,-1.6]],
       "bottom": [[-14.5,-6.8],[-12,-6.2],[-8,-5.9],[0,-5.8],[8,-5.9],[12,-6.2],[14.5,-6.8]],
       "depth_m": 6.0}
    ],
    "pile_cap": {"length_x_m": 20, "width_z_m": 52, "top_y_m": -26.4, "thickness_m": 5.6, "rounded_ends": true},
    "anchor_zone": [
      {"y_from_m": 47, "y_to_m": 79, "leg": 0},
      {"y_from_m": 47, "y_to_m": 79, "leg": 1}
    ],
    "mirror_for_other_pylons": true,
    "reference_images": [
      "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_(6297673871).jpg",
      "https://commons.wikimedia.org/wiki/File:My_Thuan_Bridge_cables.jpg",
      "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn,_V%C4%A9nh_Long,_2013.JPG",
      "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_1_v%C3%A0_2.jpg"
    ]
  },
  "notes": "Spans 150 + 350 + 150 (TEDI), no auxiliary piers; anchor piers at the unit ends, outer stays land 5 m beyond them. H pylons 123.5 m above the pile-cap top and 84.43 m above the deck (TEDI); ≈120 m above high water (press). Drawn: deck 30 m at the unit ends, 37.5 m at the pylons, 40.5 m at mid-span (clearance 37.5 × 110 m), tip ≈121 m above the water. Legs lean inward from the cap to one upper beam at ≈0.5 of the above-deck height, then vertical posts; deep under-deck beam. 128 stays = 16 per side per plane, semi-fan, two planes 18.6 m apart (drawn at the deck edges), blue HDPE sheaths. Concrete girder: two 1.76 m edge girders, 23.66 m deck. Leg and beam geometry measured on Commons photos."
}
```

Local frame. Local y = 0 is E = 30, and points above 0 are lifted by crestAt(pylon) = 7.46. Points below 0 are stretched by (1 + 7.46/30) = 1.2485, so:

- The cap top −26.4 is drawn at real +4.5 m above the water. Its 5.6 m thickness is drawn as ≈7 m.
- The under-deck beam −1.6 / −6.8 is drawn as ≈2.0 / 8.5 m under the pylon deck.
- The foot at ±18.0 sits inside the 52 m cap (±26 with ±10 round ends).

Notes:

- **Do not set `crossbeams_y_m`.** Both beams are panels; a straight bar would cut the arched soffit.
- Panel z ends (±10.5 at the upper beam, ±14.5 under the deck) sit inside the legs, so the joints close.
- The leg polyline has two close points around the kink (43, 46.5) so that the Catmull-Rom curve keeps the posts straight.

### 3.2 Generator (`scripts/gen_bridges.py`) and the shape file

- **`research/shapes/cau-my-thuan.json`.**
  - Replace `model3d` with §3.1.
  - `pylons_vi`: "2 tháp chữ H: hai chân thẳng nghiêng vào từ bệ móng đến dầm ngang trên (≈½ chiều cao trên mặt cầu), phía trên là hai cột đứng neo dây; dầm ngang lớn dưới mặt cầu; cao 123,5 m từ đỉnh bệ, 84,43 m trên mặt cầu (≈120 m trên mực nước cao)".
  - `pylons_en`: "2 H pylons: straight legs leaning inward from the pile cap to one upper crossbeam (≈half the above-deck height), then two vertical posts carrying the stays; deep under-deck crossbeam; 123.5 m above the pile cap, 84.43 m above the deck (≈120 m above high water)".
  - Update `review` / `checklist` with an r10 line: "legs lean in to the upper beam, posts above, deep under-deck beam, pile cap, deck 30/37.5/40.5, blue stays".
- **PHASE6** (`"cau-my-thuan": {"deck_crest_m": 6.0}`, ~l.809). Change it to 10.5, or remove it, since the shape file now sets it.
- **EXPECT_R1** (~l.1025). Change `"cau-my-thuan": {"deck_crest_m": 6.0}` to `{"deck_crest_m": 10.5, "cables_per_side": 16, "stay_colour": "#7aa6cc"}`. Otherwise the assert fails.
- **M3D** (l.403). Make it consistent: heights `[121, 121]`, and notes as in §3.1 (the shape file overrides it anyway).
- **NAV** (l.628). Use `nav(37.5, 110, None, "https://tedi.vn/project/cau-my-thuan/")`.
- **`add(...)`** (l.68).
  - Add the sources `https://tedi.vn/project/cau-my-thuan/`, `https://vi.wikipedia.org/wiki/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn` and `https://aecom.com/projects/thuan-bridge/`.
  - Notes: replace "Span arrangement from general knowledge … lists only the 350 m main span" with "Spans 150 + 350 + 150 m (cable-stayed section 660 m incl. 5 m past each anchor pier; approaches 875.2 m, 22 Super-T spans) per TEDI. Design Maunsell McIntyre (AECOM); built by Baulderstone Hornibrook with Cienco 6. Wikipedia gives total length as both 1,535 m and 1,560 m; TEDI 1,535.2 m."
  - Set `pylons=` to the §3.2 English text.
- No `colour_mode`, and **no `VIVID_OK` change**.

## 4. Engine gaps

There are **none that block**: the prototype uses only existing features (legs, G13 panels, `pile_cap`, deck elevation / crest / depth, G11 `back_stay_deck_m`).

Optional, P2, do not block:

- **G15 `cable_plane_spacing_m?: number`** (two-plane bridges only).
  - When set, deck anchors (main and back stays, including G11) go to `z = ±cable_plane_spacing_m / 2` instead of `±deck_width_m / 2`. In code that is `deckZ` with `hw → spacing / 2`.
  - Validate `0 < spacing ≤ deck_width_m`; otherwise warn and ignore it.
  - Pylon anchors are unchanged.
  - Bridges without the field render byte-identically.
  - Mỹ Thuận would use 18.6, giving near-vertical stay planes with the footways outside them, as in c2. Today the planes tilt out from ±9.5 at the posts to ±11.83 at the deck. This is visible only in the front view.

## 5. Acceptance criteria (I will re-render)

Cameras:

- `--views front,side,foot,top,three_quarter`
- **`--az 50 --el 8 --target pylon0`**: compare with `c1_crop.png` and `c3_crop.png`.
- `--az 20 --el 6 --target unit`: compare with `c1.jpg` (whole unit, deck curve).
- The front view should match `c2.jpg` (face-on).

Criteria:

1. **Form (P0)**, checked in the front view and az50.
   - Legs are straight and visibly lean inward from the cap to the upper beam. Leg c/c at the beam is ≈0.70 × at deck level, and the foot c/c ≈1.2 × at deck level.
   - Near-vertical posts above the beam, tips at local 83.5.
   - One deep upper beam (local 40.6–45.5) with an arched soffit; no other beam above the deck.
   - A deep under-deck beam with a haunched soffit, visible in the foot view.
   - Proportions as in `mtwork/r1/cau-my-thuan-custom-az50-el8-pylon0.png`.
2. **Levels.**
   - Deck 30 m at the unit ends, ≈37.5 m at the pylons, 40.5 m at mid-span. The crest is visible in the side view and the side spans slope down.
   - No "deck_elevation_m below navigation clearance" warning.
   - Height label **121 m (±0.5)**.
3. **Foundation.** A stadium-shaped cap across the bridge, about 4.5 m proud of the water, at both pylons.
4. **Stays.**
   - Light blue, 16 per side per plane (128), semi-fan.
   - Pylon anchors on the posts between local 47 and 79.
   - Back stays land 10.5 → 149 m from the pylon.
   - No auxiliary piers.
5. **Data.**
   - Texts, sources, NAV and notes updated.
   - PHASE6 and EXPECT_R1 consistent.
   - `python3 scripts/gen_bridges.py data/bridges.json` passes and `npm test` passes.
   - No other bridge changes.

## 6. Open points (no user decision needed)

- **Deck levels** are reconciled, not published: ±2 m [I/P]. A single parabola cannot also give the real ≤5 % end grade; 6.5 % is accepted.
- **Pile cap plan** (20 × 52, stadium) is [P], low confidence. Its top level is [P] ±1.5 m.
- **Label 121 vs 120.** The data's "≈120 m above high water" is kept in the texts. The drawn 121 follows TEDI's 116.5 m (cap top to tip) plus the visible cap. If the user wants exactly 120, set the tip local to 82.5 (above the deck then drops to 82.5 vs 84.43).
