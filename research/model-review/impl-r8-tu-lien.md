# 3D model review: round 8 implementation, Cầu Tứ Liên (2026-11-28)

Brief: `research/model-review/brief-r8-tu-lien.md`. All P0/P1/P2 data changes in the brief are implemented. No engine change (the brief needed none; the optional G13 Y-piers and sharp knee were not done).

Checks: `npm run typecheck`, `npm run lint`, `npm test` (98 tests) and `npm run build` all pass. The generated `model3d` is identical to the researcher's `tlwork/target.json` for every key it lists.

## Data

`scripts/gen_bridges.py` (PYLON route, the smaller of the two options in §3.2):

| Where | Change |
|---|---|
| `add(id="cau-tu-lien")` | `span_arrangement` "50 + 200 + 500 + 200 + 50 m"; new `pylons` / `pylons_en` (diamond-X, top level +185.0 m); sources + VOV gov (drawing), Tiền Phong (185 m, piles), Soha 12/11/2026 (progress); notes: opening 10/10/2027, progress end-10/2026, WATG "dragon" 158 m scheme not built |
| `M3D` | `cps=19`; notes rewritten per §3.2, plus a "Round 8" sentence stating the earlier "client feedback 11/2026" merge + twisted-blades reading is superseded by the user's official render |
| `PRESS` | VOV render and VOV general elevation drawing added (link-only) |
| `NAV` | 80 × 10 m above H5% = +9.55 m (VOV drawing) |
| `PYLON` | Replaced by the diamond-X `pylon_custom` from §3.1 (four legs, two struts, anchor zones on the posts, submerged pile cap), with a comment block explaining the frame, the intended crossing at (0, 62, 0), why the posts are separate legs and why struts are used instead of `crossbeams_y_m` |
| `REVIEW_R1` | `scale_y: 0.94` removed. Entry is now a `set` of deck_elevation 24.5, deck_crest 1.7, aux piers [50, 950], 19 stays, back_stay_deck [28, 244], pylon #e8e0cc, stays white. No `note` key (it would be prefixed "Review r1:"); the r8 note lives in M3D |
| Merge loop | The hard-coded `pylons` text override for this bridge is removed (text is now on the record) |
| Regression asserts | spans, aux piers, E 24.5 + crest 1.7, 43 m deck, 19 stays, back-stay range, colours, 4 legs / no `crossbeams_y_m` / no twist, leg tips [74, 74, 159.5, 150] (catches any re-introduced scale), crossing at (0, 62, 0), each crossing leg ends at the opposite post base, struts at −8.5 / 145, anchor zones (2/3, 92–141), cap top −25 with feet on it, NAV 10 × 80, span_arrangement and pylon texts, "superseded" in notes and no "Review r1" |

`research/shapes/cau-tu-lien.json` (still `review_only`; the `bid != "cau-tu-lien"` special case is kept): checklist and review entries updated for diamond-X, crossing ≈0.39 H, posts + link, staggered tops, under-deck crossbeam, aux piers, stays, colour.

`data/bridges.json` is regenerated; only the `cau-tu-lien` record changed.

## Tests

`src/lib/data.test.ts`, new "Tứ Liên (round 8)" test (skipped on the sample file), built as `completed`:
- No warnings; E 24.5; aux piers [50, 950]; pylons at 250 / 750; deck 26.2 at mid-span; clearance height 10.
- Legs cross at (0, 62, 0) and end at the opposite post base; posts 8.5 m apart; tops 159.5 / 150 (ratio 0.94); knee ±33; knee/(crossing − knee) ≈ 0.47.
- Per pylon: label 184.5–186 (185.3); deck 25.5–26 at the pylon; 159.5 above deck; one pile cap; two members at −8.5 and 145 above deck; 19 × 2 × 2 stays, all anchored 91–142 above deck, top and deck z on the same side (no stay crosses between the posts), tops within |z| < 7, deck ends at |z| > 17; back fan lands 28–244 m from the pylon.
- Colours #e8e0cc / white.

## Renders and comparison

`node scripts/render_views.mjs cau-tu-lien` with the default views, `--views front,side,foot,top,three_quarter`, and `--az -68 --el -3 --target pylon0` / `--az -72 …`. Output: scratchpad `views-tl-impl/`.

Against the user's official render (camera az −68, el −3):
- Diamond-X reads correctly: separate feet, knees just outside the deck with the deep crossbeam under it, legs crossing ≈0.39 H above the deck, each continuing as the opposite post.
- Two parallel posts with a visible slot, the short link near the top, flat staggered tops with the taller post on the left on both pylons, as in the render.
- Two stay planes from the posts to the deck edges, white; nothing of the old merge/twisted blades remains.
- The render is of the under-construction state (status `under_construction`), so the deck shows as cantilevers with travellers; the completed-state geometry is what the data test checks.
- Matches the researcher's prototype panel in `tlwork/compare.png`.

## Deviations

- None in the data. The REVIEW_R1 `note` suggested in §3.2 was folded into the M3D notes to avoid the "Review r1:" prefix on a round-8 note.
- Remaining visual differences vs the render are the known optional engine gaps: wall end/aux piers instead of the Y-shaped piers (G13) and a slightly rounded knee (Catmull-Rom).
