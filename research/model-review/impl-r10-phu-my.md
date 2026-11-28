# 3D model review: round 10 implementation, Cầu Phú Mỹ (Phú Mỹ 1, `cau-phu-my`), 2026-11-28

Brief: `research/model-review/brief-r10-phu-my.md`. All of §3 is implemented. There are no engine changes.

Checks: `npm run typecheck`, `npm run lint`, `npm test` (124 tests) and `npm run build` all pass. `python3 scripts/gen_bridges.py data/bridges.json` passes. In `data/bridges.json` only `cau-phu-my` changed, and only these fields: `width_m`, `pylons`, `pylons_en`, `nav_clearance`, `model3d` and `sources`. The client-confirmed `construction_start` 2005, its source and the bridge notes are unchanged.

## Data

### `research/shapes/cau-phu-my.json`

- **`model3d`** is the brief's §3.1 JSON (`pmwork/target.json`, applied with `pmwork/target.py`). It contains:
  - modified-H legs: ±22 at the cap, ±17 at the deck (kink points at −3 / 0 / +3) and ±13.6 at the tips (local 92.5);
  - leg sections 5 → 3.5 across and 9.5 → 5.5 along;
  - two G13 panels: the haunched upper beam (top 59.5 with fillets to 63, soffit 51.2 → 44) and the box under-deck beam (top −2.2, bottom −8.2 → −9.5, 7 m deep);
  - no `crossbeams_y_m`;
  - a 22 × 56 pile cap with its top at −36.9 and a thickness of 5.3;
  - anchor zones 46–90 on both legs;
  - E 40.8, crest 8, girder depth 2.5, deck width 27.5;
  - 18 stays per side per plane;
  - pylon `#dedbd3` and stays `#7a7f85`. There is no `colour_mode`, so the stays are drawn muted.
- **`model3d.notes`** use the brief's §3.1 text. `target.json` had `"notes": "placeholder"`, and the generator's new assert caught it.
- **`pylons_vi` / `pylons_en`** use the §3.3 texts.
- **`review`** gains an r10 line. **`checklist`** now reads "foot below deck: pass (splayed to cap)" and "crossbeams: pass (haunched upper panel + box under deck)".

### `scripts/gen_bridges.py`

| Where | Change |
|---|---|
| `add(...)` | `width_m` 27 → 27.5. `pylons` uses the §3.3 VI text. Added three sources: Structurae, SEI 2010 (T&F) and the ICE design audit (TRID). The 2005 client-confirmed source and the notes are unchanged. |
| `M3D` (fallback) | `[139, 139]`, 27.5, and the brief's fallback notes. |
| `NAV` | `nav(45, 250, "45 m within a 250 m wide navigation zone", SEI)` |
| `REVIEW_R1` | **`scale_y` 0.96 and the note removed.** Now `{"set": {"pylon_heights_m": [139, 139]}}`, with the round-10 comment. |
| `EXPECT_R1` | Added `cables_per_side` 18, `deck_crest_m` 8, `deck_elevation_m` 40.8 and `pylon_heights_m` `[139, 139]`. PHASE6 has no Phú Mỹ entry. |
| Regression block | New `cau-phu-my` asserts: spans and no aux piers; 139 / total; E, crest, girder depth and width; stays; colours and no `colour_mode`; 2 panels and no `crossbeams_y_m`; tips `[0, 92.5, ±13.6]` (not rescaled); feet at ±22 / −36.9; kink point ±17 at 0; leg sections; panel extremes; the exact cap; anchor zones; `width_m` and the client 2005 start; NAV 45 × 250 from SEI; texts; and notes with no "Review r1" and containing 134.5. |

### Tests (`src/lib/data.test.ts`)

There is a new test, "Phú Mỹ (round 10)". It checks:

- **Data and geometry basics:**
  - no geometry warnings;
  - E 40.8 and girder depth 2.5;
  - mid-span deck 48.8;
  - pylons at x 162.5 / 542.5;
  - grey stays, not vivid;
  - NAV 45 × 250;
  - width 27.5;
  - construction start 2005.
- **Leg ratios:** foot ÷ deck c/c is between 1.25 and 1.35, and tip ÷ deck c/c is between 0.76 and 0.84.
- **Kink:** the legs splay below the deck and lean inward above it, and the slope above is less than 1/3 of the slope below.
- **Per pylon:**
  - deck at 46.5;
  - tip 92.5 above the deck and label 139;
  - 4 sweeps and 0 members;
  - the upper panel's top, fillet top, soffit at the legs and crown;
  - the under-deck panel's top, bottom and crown (below-deck y stretched);
  - the cap top 4.5 m above the water;
  - 72 stays anchored 45–91 m above the deck, each on the same side as its deck edge and within 2.5 m of it in z (near-vertical planes).

I made sure the test runs and is not skipped: a temporary mutation (label 138) made it fail.

## Renders

The renders are in scratchpad `views-pm-impl/`: the 5 standard views plus `custom-az60-el-8-pylon0`, `custom-az2-el2-pylon0`, `custom-az12-el6-unit` and `custom-az88-el4-pylon0`. The server was on 127.0.0.1:5783 from this worktree. All 9 are **byte-identical** to the researcher's prototype renders (`pmwork/r2/`).

Compared with the photos:

- **az60 vs `c3`.**
  - The legs splay to a wide rectangular cap, the box beam sits under the girder, and there is a kink at the deck.
  - The legs lean gently inward to the haunched portal beam, and two flat-topped free posts rise above it. The form matches.
  - The real haunch soffit is a little more chamfered or angular than the model's curve. This is acceptable at this scale.
- **Front vs `c15_crop_r`.**
  - The feet-to-deck splay and the tip convergence ratios read as in the photo.
  - The upper beam is at about 0.64 of the above-deck height.
- **Side.**
  - The vertical crest is visible.
  - There are no aux piers, and the back stays reach close to the end piers.
  - The grey stays are faint against the light sky. The brief §4 lists this as a theme matter, not a Phú Mỹ one.

## Deviations

- **`model3d.notes`.** `target.json` carried `"notes": "placeholder"`. I replaced it with the brief's §3.1 notes text. Nothing else differs from the brief's data.
