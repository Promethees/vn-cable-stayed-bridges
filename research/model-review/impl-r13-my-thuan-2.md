# Implementation: round 13, Cầu Mỹ Thuận 2 (`cau-my-thuan-2`), 2026-11-29

Implements `brief-r13-my-thuan-2.md`. No engine change; only existing features (G14 vivid, G15 main_stay_deck_m, G18 chamfer_m, panels).

## Changes

- `research/shapes/cau-my-thuan-2.json`
  - `model3d` replaced by the brief's §4 target JSON verbatim (identical to `mt2work/target_model3d.json`):
    - A legs to a flat-topped slot at 69.6 m, a solid head 69.6 → 87.4 m (12.4 → 7.6 m), a diamond foot on a 24 × 52 m pointed-hexagon cap (chamfer 12, top at local −24.0);
    - an under-deck beam panel from −2.5 to −7.5;
    - deck 28.5 + crest 13.5, depth 2.5;
    - 16 stays per side per plane, deck anchors 17–167 (main) and 17–145 (back), pylon anchors 50–84 on legs 0 and 1;
    - `#2f80c8` vivid stays, `#d9d5cc` pylons.
  - `pylons_vi` / `pylons_en` from §6, plus the top-level `notes`, a round-13 `review` line, the `checklist` and `compare`. `pass2` is kept.
- `scripts/gen_bridges.py`
  - Seed `add()`: A-pylon `pylons` text; `investor` gets "Ban QLDA 7 (Bộ GTVT); designer TEDI; main bridge (XL03B) Trung Nam E&C – Trung Chính – VNCN E&C JV". This follows the repo convention, where designer and contractor sit inside `investor`, since there are no separate fields. Also: 9 new sources, `confidence="verified"`, and new notes (350 / 650 m, 1,906 m, people, piles, the dates 27/2/2020 → 19/8/2020 → 14/10/2023 → 24/12/2023).
  - The M3D fallback is in step: 125.5 m, `cps=16`, with the round-13 comment.
  - NAV: 37.5 m, width `None`, source the TEDI project page.
  - PRESS: the TEDI T16 photo and the Tecco1 `cau-my-thuan-12.jpg` near-elevation (the optional one) are added.
  - The REVIEW_R1 `cau-my-thuan-2` entry (`scale_y 0.967`) is deleted and replaced by a comment.
  - `VIVID_OK`, `G15_OK` and the G18 `chamfer_m` allow-list now include `cau-my-thuan-2`.
  - Round-13 assert block (brief §5 item 7), placed before the Mỹ Thuận 1 block.
- `src/lib/data.test.ts`
  - The vivid and main_stay_deck_m lists are updated.
  - New `it('Mỹ Thuận 2 (round 13) …')`. It checks:
    - the data fields;
    - engine warnings `[]`, E 28.5, deckY(150) ≈ 38.09, deckY(325) = 42;
    - 87.4 m above the deck and a label of 125.5 ± 0.05;
    - 128 cables, 32 + 32 per pylon in two planes, inside 17–167 / 17–145 and 50–84 m;
    - the cap top ≈ 6 m above the water, 52 m across;
    - vivid colours.
- `data/bridges.json` regenerated. Its `model3d` equals the target except `notes`, which gets the shape file's top-level notes appended as usual.

## Verification

- `python3 scripts/gen_bridges.py data/bridges.json` passes, including all asserts.
- `npm run typecheck`, `npm run lint` and `npm run build` are clean. `npm test` / vitest: 145 passed.
- Renders (own server on 127.0.0.1:5851) are in `scratchpad/views-mt2-impl/`: front, side, three_quarter, foot, top, az35/el0/pylon0 and az0/el25/unit. All 7 are **byte-identical** to the researcher's prototype `mt2work/r1/`.
- Against the photos (`cmp.png`, `tedi1`, `tc12`, `tc06`):
  - the A pylon with a slot under a solid flat-topped head;
  - legs converging below the deck to a pointed-hexagon cap, with the under-deck beam;
  - a visible crest and a gap between the fans at mid-span;
  - no auxiliary piers;
  - two inclined blue planes.

## Deviations

- Designer and contractor are recorded inside `investor`, because the schema has no separate fields.
- The optional Tecco1 elevation press image was added.
- No other deviations.
