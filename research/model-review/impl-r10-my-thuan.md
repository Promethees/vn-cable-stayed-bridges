# 3D model review: round 10 implementation, Cầu Mỹ Thuận (2026-11-28)

Brief: `research/model-review/brief-r10-my-thuan.md`. All of §3 is implemented. There are no engine changes. The optional G15 `cable_plane_spacing_m` (brief §4) was not added, so the stays still land at the deck edges (±11.83) rather than at ±9.3.

Checks: `npm run typecheck`, `npm run lint`, `npm test` (124 tests) and `npm run build` all pass. `python3 scripts/gen_bridges.py data/bridges.json` passes with no warnings. In `data/bridges.json`, only `cau-my-thuan` changed.

## Data

### `research/shapes/cau-my-thuan.json`

- **`model3d`** is the brief's §3.1 JSON exactly (`mtwork/target.json`). The prototype's placeholder note is replaced with the §3.1 notes text, prefixed "r10:". The JSON contains:
  - H legs from (−26.4, ±18) → (0, ±14.75) → (43, ±10.4), then posts ±9.7 → ±9.5 up to local 83.5. Sections are 5.0 → 2.6 across and 6.0 → 4.0 along.
  - Two G13 panels:
    - the upper beam: top 45.5, soffit 40.6 → 41.6;
    - the under-deck beam: top −1.6, soffit −6.8 → −5.8.
  - No `crossbeams_y_m`.
  - A 20 × 52 stadium cap with its top at −26.4 and thickness 5.6.
  - Anchor zones 47–79 on both legs.
  - E 30, crest 10.5, girder 1.8.
  - 16 stays per side per plane, back stays 10.5–149.
  - Pylon `#dcd6c8`, stays `#7aa6cc`, no `colour_mode`.
  - Height `[121, 121]` total.
- **`pylons_vi` / `pylons_en`** use the §3.2 texts.
- **`review` and `checklist`**: an r10 line is added and the checklist rows are updated.

### `scripts/gen_bridges.py`

| Where | Change |
|---|---|
| `add(...)` | `pylons=` now uses the §3.2 English text. Added sources: TEDI, vi.wikipedia and AECOM. The notes use the TEDI span, approach and builder text in place of "from general knowledge". |
| `M3D` | Heights `[120,120]` → `[121,121]`; notes updated (the shape file overrides them). |
| `NAV` | `nav(37.5, 110, None, "https://tedi.vn/project/cau-my-thuan/")` |
| `PHASE6` | `deck_crest_m` 6.0 → 10.5. The shape file sets it as well. |
| `EXPECT_R1` | `{"deck_crest_m": 10.5, "cables_per_side": 16, "stay_colour": "#7aa6cc"}` |
| Regression block | New `cau-my-thuan` asserts. See below. |
| `VIVID_OK` | Unchanged. |

The new regression asserts check:

- spans and no aux piers;
- height 121 / total, with the M3D fallback in step;
- E, crest, depth and width;
- stays and back-stay range, with no `colour_mode`;
- colours;
- panels and no `crossbeams_y_m`;
- tips at (83.5, ±9.5), the foot, deck and beam z of the legs, and the leg sections;
- panel extremes;
- the cap, with the feet on it;
- anchor zones;
- NAV;
- texts, notes and sources.

### Tests (`src/lib/data.test.ts`)

There is one new test, "Mỹ Thuận (round 10)". It checks:

- no geometry warnings;
- E 30, depth 1.8, no aux piers, pylons at x 150 / 500;
- deck 30 at both ends and 40.5 at mid-span;
- stay and pylon colours, and that the bridge is not vivid;
- leg lean: c/c at the beam ÷ c/c at the deck is between 0.66 and 0.74, the foot ÷ deck is ≈1.22, and the posts are near-vertical;
- for each pylon:
  - the deck at the pylon is ≈37.46;
  - the tip is 83.5 above the deck and the label is 121;
  - 4 sweeps and 0 members;
  - the upper panel's top, soffit and crown, and the lower panel's top, soffit and crown (below-deck y is stretched);
  - the cap top is ≈4.5 m above the water;
  - 64 stays per pylon, anchored 47–79, inboard of the deck edges;
  - the back stays land 10.5–149 m from the pylon.

## Renders

The renders are in scratchpad `views-mt-impl/`: the 5 standard views, `custom-az50-el8-pylon0` and `custom-az20-el6-unit`. They were made with a worktree dev server on 127.0.0.1:5781. All 7 are **byte-identical** to the researcher's prototype (`mtwork/r1/`).

Compared with the photos:

- **az50 vs `c1_crop`.** The legs lean in from the stadium cap past the deck to the deep upper beam, near-vertical posts carry the light-blue fans, and the haunched under-deck beam is visible. The form and proportions match.
- **Front vs `c2`.** The legs converge to the beam with an arched soffit, and the posts are parallel above it, as in the photo.
- **az20 unit.** The crested deck falls clearly to the anchor piers, there are no aux piers, and both caps are visible.

## Deviations

There are none from the brief's data. Remaining differences:

- The stay planes still tilt out to the deck edges, because G15 was not implemented (optional, needs an engine change).
- The chamfered post tops are not modelled (the brief says to skip them).
- The pylons render a little greyer than the warm off-white in the photos. This is the muted colour mode, which the brief accepts.
