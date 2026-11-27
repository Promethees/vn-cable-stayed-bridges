# 3D model review: round 7 implementation, Cầu Phước Khánh (2026-11-27)

Brief: `research/model-review/brief-r7-phuoc-khanh.md`. Everything in the brief is implemented with existing engine fields. **No engine code changed.**

Checks: `npm run typecheck`, `npm run lint`, `npm test` (81 tests) and `npm run build` all pass. `python3 scripts/gen_bridges.py data/bridges.json` passes its asserts, and only the Phước Khánh record in `data/bridges.json` changes.

## Data

`research/shapes/cau-phuoc-khanh.json`:
- **Pylon text:**
  - `pylons_vi` / `pylons_en` are replaced with the brief's text: H, two vertical legs, one upper crossbeam about two-thirds up, 135.8 m from the foundation.
  - `review` and `checklist` no longer say "top beam".
- **Scalars:**
  - spans 149.5 + 300 + 149.5;
  - `pylon_heights_m` [135.8, 135.8] total;
  - `semi_fan`, 14 per side per plane;
  - concrete deck;
  - `deck_elevation_m` 58.5, `deck_crest_m` 2.5;
  - `stay_colour` white.
  - Pylon and deck colours stay at the default concrete grey.
- **`pylon_custom`:** exactly the brief's block. It has:
  - legs at z ±13 from y −55 to 68, 4.5 → 3.3 wide and 7 → 4.5 deep;
  - `crossbeams_y_m` [];
  - two struts: the upper beam at y 43 (4.5 m) and the under-deck beam at y −5.5 (6 m);
  - anchor zones at y 47–66 on both legs;
  - a pile cap 22 × 36 × 8 m with its top at −55 (3.5 m above water).
  - The strut ends stay on the leg centrelines. The front render shows no odd overlap, so the optional ±11.4 shift was not needed.
- **Notes:** rewritten.
  - VEC gives the spans and 135.8 m from the foundations; the press "155 m" is Bình Khánh's.
  - The drawn label is the photo-faithful ≈126.5 m from water to tip, so "foundations" is ≈8 m below water (the pile-cap underside).
  - The crossbeam is at ≈43 m (≈63 %).
  - 56 saddle stays = 14 per side per plane.
  - Navigation clearance is 55 × 242 m.

`scripts/gen_bridges.py`:
- **`REVIEW_R1`:** `scale_y 0.877` is removed. `cables_per_side` 14 and `deck_type` concrete are kept. The note now reads "Pylon 135.8 m from foundations (VEC); 155 m in the press is Bình Khánh's."
- **`add(...)` seed:** `pylons` gets the same VI text. The VEC project page and the JICA 2026Q2 monitoring report are added to the sources.
- **`M3D` seed:** spans, heights, pattern and notes are made consistent. The shape file still wins.
- **`NAV`:** `nav(55, 242, None, VEC)`, replacing the Tuổi Trẻ source, which gave only the height.
- **Regression asserts (round 7 block):**
  - spans and heights;
  - deck 58.5 m with a 2.5 m crest;
  - white, semi-fan, 14 per side, 2 planes;
  - leg tops at 68 m, which catches a reintroduced rescale;
  - legs at ±13 and no `crossbeams_y_m`;
  - struts at −5.5 and 43;
  - anchor zones above 43 and below 68;
  - legs standing on the cap top at −55;
  - nav width 242 and the 135.8 text.

## Tests

`src/lib/data.test.ts` has a new Phước Khánh test:
- no geometry warnings;
- deck at 58.5 m, pylons at x 149.5 and 449.5;
- 112 stays, 56 per pylon;
- 64–71 m above the deck, and tip-above-deck ÷ water-to-deck between 1.05 and 1.2;
- label between 124 and 130 m (total);
- one pile cap per pylon;
- every stay anchors 45–68 m above the deck, which is above the upper beam.

Measured from the geometry:

| Item | Value |
|---|---|
| Height above deck | 68 m |
| Label | 126.5 m (was 155) |
| Ratio, above deck ÷ water to deck | 1.16 (was 1.65) |
| Outer back stay | lands at x 7.5, 95 % of the side span |
| Outer main stay | lands at mid-span (x 299.5) |
| Clearance box | 55 × 242, with no warnings |

## Renders and comparison

The renders are in `/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/views-pk-impl/`:
- side, front, foot, three_quarter, top;
- `custom-az0-el4-unit`, `custom-az10-el3-pylon0`, `custom-az60-el22-unit`.

1. **Front vs dt2.** Two vertical legs just outside the deck edges and one deep crossbeam at about two-thirds height. Above it are two free posts with flat tops and no top beam. Every stay fans from the posts above the beam. It is close to the photo's composition.
2. **az 0 / side vs dt6.** The pylon now reads only slightly taller above the deck than below it, as in the panorama, not the old tall spire. There are no auxiliary piers.
3. **az 10 pylon0 vs dt6_right.** Seen from that angle, the legs are deeper along the bridge at the base than at the top. The pile cap sits just above the water, the under-deck beam sits directly under the girder, and the stays converge at the top of the posts.
4. **Foot view.** The deep under-deck beam and both legs stand on one cap.
5. **az 60 vs cafef / tp5.** An H portal with the beam about two-thirds up and a semi-fan at the top.

**Differences and notes:**
- **Stay colour.** The white stays render as a pale cream-grey: the engine's muted "white" tint and stay-lightness clamp, the same as on the other white-stay bridges.
- **Saddles.** The saddle anchorages are modelled as ordinary pylon anchor points spread over y 47–66. The photos (dt6_right) suggest the anchor zone may start a little lower on the posts, but the brief's 47–66 zone is kept.
- **Not modelled.** The railing and lightning rods on the post tops, and the haunches under the lower beam.
