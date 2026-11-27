# 3D model review: round 7 implementation, Cầu Bình Khánh (2026-11-27)

Brief: `research/model-review/brief-r7-binh-khanh.md`. Everything in the brief is implemented with data only; no engine change.

Checks: `npm run typecheck`, `npm run lint`, `npm test` (81 tests) and `npm run build` all pass. `python3 scripts/gen_bridges.py data/bridges.json` regenerates cleanly, and only the Bình Khánh record changes.

## Data

`research/shapes/cau-binh-khanh.json`, as in brief §3:
- **Spans and pylons:** 187.25 + 375 + 187.25 m, [155, 155] total. The stale 194 m and 135 m values are gone.
- **Deck:**
  - `deck_elevation_m` 60, `deck_depth_m` 3
  - `deck_width_m` 30.35, concrete
- **Stays:** 2 fan planes, 17 per side, `stay_colour` white.
- **Legs:**
  - Feet at y −62 and tips at y 93, with the brief's widths and depths (6.5 → 3.5 across, 9 → 7 along).
  - Legs at **z ±18.4**, not ±17.6. See the deviation below.
- **Beams:**
  - `crossbeams_y_m` is `[]`.
  - Strut at y 61, 5 m deep (the upper beam).
  - Strut at y −53, 6 m deep (the tie beam).
- **Anchor zones:** 53–89 on legs 0 and 1.
- **Reference images:** the five URLs from the brief.
- **Text:**
  - `pylons_vi` / `pylons_en` and `model3d.notes` use the brief §2 wording.
  - `review` / `checklist` are updated: "foot below deck" and "deck / aux piers" now pass.

`scripts/gen_bridges.py`:
- **Sources:** added the VECC project page and the TNCK opening article.
- **`NAV`:** 55 × 242, citing VECC and the 20,000 DWT design vessel.
- **Seed:** the `M3D` seed now holds the current values, and its notes are a placeholder pointer to the shape file.
- **`REVIEW_R1`:** now sets `deck_width_m: 30.35`. Its `pylons` / `pylons_en` text is the new wording; this was necessary because `REVIEW_R1` is applied after the shape file.
- **Regression asserts:**
  - spans, no auxiliary piers
  - deck 60 / 3 / 30.35, with bridge `width_m` still 21.75
  - 2 planes, 17 stays, white
  - no crossbeams; struts at 61 and −53
  - legs −62 → 93 at ±18.4
  - anchor zones
  - nav 55 × 242
  - no stale 194 / "top cross-beam" text

## Tests

`src/lib/data.test.ts` has a new test, "Bình Khánh (round 7)", that checks:
- **Deck:** deck 60, width 30.35, soffit ≥ 55 m.
- **Layout:** pylons at x 187.25 / 562.25, no auxiliary piers, white stays.
- **Height label:** 151–157 m (total).
- **Legs:** they reach y ≤ 0 (the water). At deck level, the inner leg faces sit outside the deck edge by less than 1.5 m.
- **Beams:** exactly two horizontal members.
  - The tie beam is 0–15 m above the water.
  - The upper beam is at 0.64–0.68 of the above-deck height.
  - Neither is within 10 m of the deck.
- **Stays:**
  - 68 cables per pylon.
  - Saddle tops between 52.5 and 89.5 m above the deck.
  - The lowest saddle is below the upper beam.

## Deviation: legs at ±18.4 instead of ±17.6

The brief's spec fails its own acceptance criterion 2 ("legs fully outside the 30.35 m deck, gap ≈0.5–1 m"):
- **The leg is about 5.3 m wide at deck level.** The engine tapers linearly along the leg, so 6.5 m at y −62 becomes 3.5 m at y 93, which gives 5.3 m at y 0.
- **The leg pierces the deck at ±17.6.** Its inner face is at 17.6 − 2.65 = 14.95 m, while the deck edge is at 15.175 m, so the leg cuts 0.22 m into the deck. The data test catches this.

The brief's own derivation puts the inner faces at ±15.6–16 (the vtc1 gap is the deck width plus about 1 m). With a 5.3 m leg, that gives centres at about ±18.3–18.6, so I used **±18.4**:
- The gap at deck level is ≈0.58 m per side.
- The struts span ±18.4.
- The stays anchor at the leg centres, as before.

The difference is not visible at card scale. If the researcher prefers ±17.6, the alternative is a slimmer leg (about 3.9 m wide at the deck), which would contradict vtc1.

## Renders

Renders are in `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/views-bk-impl/`: side, front, foot, three_quarter, top, `custom-az50-el35-unit`, `custom-az35-el30-pylon0` and `custom-az88-el4-pylon0`.

1. **az 50 vs p3.**
   - Two H pylons, each with an upper beam at about ⅔ of its height and a tie beam near the water.
   - Clear side spans to the end piers.
   - Two white fan planes that meet at mid-span.
2. **az 35 vs p1.**
   - The legs run down to the water, with the tie beam just above it.
   - Nothing under the deck.
   - The upper beam is well below the heads, and the lowest stays meet the legs below it.
3. **az 88 vs vtc1.**
   - The deck fills the space between the legs, which stand just outside it.
   - A single upper beam, with the heads about 32 m above it.
4. **side.**
   - The part above the deck is about 1.55 × the part below.
   - The tip is 153 m above the water.
