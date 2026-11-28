# 3D model review: round 9 implementation, Cầu Vàm Cống (2026-11-28)

Brief: `research/model-review/brief-r9-vam-cong.md`. All of §3 is implemented. There are no engine changes; the only code change is the G14 generator assertion, which the brief anticipated. The optional `main_stay_deck_m` (brief §4) was not added.

Checks: `npm run typecheck`, `npm run lint`, `npm test` (114 tests) and `npm run build` all pass. `python3 scripts/gen_bridges.py data/bridges.json` passes with no warnings.

## Data

### `research/shapes/cau-vam-cong.json`

- **`model3d`** is the brief's §3.1 JSON exactly (`vcwork/target.json`):
  - improved-H legs: ±23.5 at the cap → knee ±17.2 → ±5.75 at y 78, then vertical posts to 107.8;
  - two G13 panels: the arched upper beam (top 84, soffit 75 → 80.4) and the haunched under-deck beam (top −2.5, soffit −6.7 → −12);
  - no `crossbeams_y_m`;
  - a 32 × 64 pile cap with its top at −30.5;
  - anchor zones 48–104 on both legs;
  - E 33, crest 8.5, girder 2.5;
  - 18 stays per side per plane, back stays 12–204;
  - pylon `#d8d5cc`, stays `#3b7fd4`, `colour_mode: "vivid"`.
- **`notes`** use the brief's §3.2 text, with an "r9:" prefix.
- **`pylons_vi` / `pylons_en`** use the §3.3 texts.
- **`review` and `checklist`** are updated.

### `scripts/gen_bridges.py`

| Where | Change |
|---|---|
| `add(...)` | `width_m` 21.6 → 24.5. Added three sources: TEDI, CafeF and the KoreaScience paper. Notes now end with "Contractor GS E&C – Hanshin JV (Korea, EDCF)." |
| `M3D` | 21.6 → 24.5 and `[140,140]` → `[147,147]`; notes updated. The shape file overrides both, but the values are kept consistent. |
| `NAV` | `nav(37.5, None, "for 10,000 DWT ships", TEDI)` |
| `REVIEW_R1` | **`scale_y` 1.05 removed.** `set.pylon_heights_m` is now `[147, 147]`. The `bridge` texts follow §3.3, and the note is "r9: improved-H pylon, 143.9 m above foundation (design paper)." |
| G14 assertion | Now uses `VIVID_OK = {"cau-ngoc-hoi", "cau-vam-cong"}`. Other bridges in this round can add their ids to the set. |
| `EXPECT_R1` | Added Vàm Cống: `stay_colour`, `colour_mode`, `cables_per_side`, `pylon_heights_m`. |
| Regression block | New `cau-vam-cong` asserts: spans and no aux piers; height 147 / total; E, crest, girder depth and width; stays and back-stay range; colours; panels with no `crossbeams_y_m`; tips at 107.8 (so the legs are not rescaled); knee and beam z; panel extremes; cap and feet at −30.5; anchor zones; `width_m`, contractor and NAV; texts and notes. |

### Tests (`src/lib/data.test.ts`)

- **Ngọc Hồi.** The vivid-list expectation is now `['cau-ngoc-hoi', 'cau-vam-cong']`, sorted.
- **New test: Vàm Cống (round 9).** It checks:
  - no geometry warnings;
  - E 33 and girder depth 2.5;
  - mid-span deck at 41.5;
  - pylons at x 210 / 660;
  - leg convergence: c/c at the beam ÷ c/c at the deck is between 0.33 and 0.40, foot ÷ deck ≈ 1.43, and the posts are vertical;
  - label 147, tip 107.8 above the deck, 4 sweeps (2 legs + 2 panels) and 0 members;
  - the upper panel's top, soffit and crown, and the lower panel's top, soffit and crown (below-deck y is stretched);
  - the cap top ≈3 m above the water;
  - 72 stays per pylon, anchored 48–104 m above the deck, outboard;
  - back stays land 12–204 m from the pylon;
  - stays `#3b7fd4`, vivid.

## Renders

The renders are in scratchpad `views-vc-impl/`: the 5 standard views, `custom-az70-el3-pylon0` and `custom-az25-el22-unit`. All 7 are **byte-identical** to the researcher's prototype renders (`vcwork/r1/`).

Compared with the photos:

- **az70 vs `c1_crop`.** The legs splay to the cap, a haunched under-deck beam sits at the knee, the legs converge to the arched upper beam, and two flat-topped posts rise above it. The form matches.
- **Front.** The arched soffit reads as in `n3_crop`, with blue stays in inclined planes.
- **az25 vs `n2`.** Large rectangular caps, no aux piers, blue fans.

## Deviations

None from the brief's data.

- The model note reads "… Review r1: r9: improved-H pylon …", because `apply_review` always prefixes "Review r1:". This is cosmetic.
- The panel extremes in the data test use ±0.5 m tolerance. The engine's pylon height solve scales above-deck y by about 1.0007 (the upper beam top is drawn at 84.06).
