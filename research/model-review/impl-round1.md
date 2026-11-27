# 3D model review: round 1 implementation (engineer → researcher), 2026-11-26

Brief: `research/model-review/brief-round1.md`. Nothing is committed; all changes are in the working tree.

Renders (front / side / three_quarter / foot for every bridge, plus `top` for Trần Thị Lý, Thuận An and Long Hưng):
`/private/tmp/claude-501/-Users-tqmthong-Desktop-Documents-Personal-vn-cable-stayed-bridges/44ae99ff-6f43-452b-beeb-ca5856464d86/scratchpad/views-r1/`

Checks: `npm run typecheck`, `npm run lint`, `npm test` (69 tests) and `npm run build` all pass. `python3 scripts/gen_bridges.py data/bridges.json` regenerates the data, and the generator now asserts the round-1 keys.

## Files changed

| File | Change |
|---|---|
| `scripts/gen_bridges.py` | PHASE6 applied to every bridge (shape-file keys win); `sanitize_model3d` removes non-schema keys; new `REVIEW_R1` overrides applied last (`scale_y` / `set` / `pylon_custom` / `bridge` / `nav`); `EXPECT_R1` regression asserts; Phú Mỹ 2 at 450 m |
| `research/shapes/cau-phu-my-2.json` | Spans 210 + 450 + 210, no aux piers, 170 m label, notes and pylon text |
| `research/candidates.md`, `research/report.md`, `research/questions.md` (#42) | Phú Mỹ 2 rows updated to 450 m (contractor figure) |
| `src/types.ts` | New optional `deck_elevation_m`, `back_stay_planes`, `deck_section`, `deck_depth_m` |
| `src/lib/validate.ts` | Validates the four new fields |
| `src/lib/bridge3d.ts` | G1–G6 (see below), custom-pylon height label, `stayLightness` helper |
| `src/three/engine.ts` | Stay lightness clamp (G6), truss web members rendered as deck |
| `src/lib/bridge3d.test.ts` | 9 new tests (deck elevation, harp parallelism, back-stay planes, per-pylon scaling, custom label, truss, lightness clamp) |
| `src/lib/data.test.ts` | New: model3d has only schema keys, and every harp bridge has adjacent stays within 2°; Long Hưng assertion updated to the twin-sword form |
| `docs/data-schema.md`, `docs/design-3d.md` | New fields, harp, back-stay planes, truss, deck elevation, per-pylon scaling, label, stay clamp, generation order |

## §0 Data-pipeline bugs

- **0.1 PHASE6 dropped:** fixed. PHASE6 now runs for every bridge, but a key is skipped when the pass-2 shape file sets it (for `pylon_custom`, per sub-key; `legs_override` is skipped when the shape file has `legs`). As a result the stale Máy Chai `legs_override` and `struts` are **not** re-applied. Its shape-file struts (−24 m foot, width 2.2) are kept. All the values listed in the brief now reach `data/bridges.json`. `EXPECT_R1` in the generator asserts them, so a regression fails the build.
  - Side effect: Phước An also picks up PHASE6 `crown: "rounded"`. Its pass-2 review says "crown described as rounded", so I kept it.
- **0.2 Cần Thơ aux piers:** set to `[40, 80, 930, 970]`.
- **0.3 Non-schema keys:** `sanitize_model3d` handles them:
  - `colour` is moved into notes ("Colour: …").
  - `image_issue` is dropped (DROP_IMAGES already handles it).
  - `auxiliary_piers_m_from_end` is converted to absolute positions when `auxiliary_piers_m` is missing.
  - The colours were mapped by hand in `REVIEW_R1`:
    - bai-chay: pylon grey, stays yellow.
    - nhat-tan: pylon grey.
    - bach-dang: pylon grey, stays orange.
    - rach-mieu: pylon cream `#e6dcc3`, stays orange.
    - cao-lanh: plain concrete, so left at the default.
  - The generator asserts that none of these keys remain, and the data test checks that model3d contains only schema keys.

## §1 Engine gaps

| Gap | Status | Notes |
|---|---|---|
| G1 `deck_elevation_m` | Done | `E = max(deck_elevation_m ?? heuristic, nav_h + deckDepth + 1)`, with the warning `deck_elevation_m below navigation clearance` when E gets raised. |
| G2 parallel harp | Done, with a deviation | Anchor heights run linearly from `yLow` to `yTop`. Each deck anchor is placed at `anchor.x ± k·(anchor height above deck)`, with `k` chosen so the outermost stay lands at the end of the reach. Every stay on one side of a pylon therefore has exactly the same slope, even on leaning custom legs. **Deviation:** the brief's formula clamps low anchors to the floor (0.15 H, or the custom anchor zone), and that bunches the inner stays and breaks parallelism (Máy Chai zone 25–60, Kiền, Phước An). I start the deck anchors further out instead. Without a clamp the result is identical to the brief's formula. Aux-pier snapping is skipped for harp stays. Tests: unit spread < 0.5°; data test: adjacent stays < 2° on all 6 harp bridges. |
| G3 `back_stay_planes` | Done | With `cable_planes = 1` and `back_stay_planes = 2`, back-side stays get planes 0 and 1: deck anchors at ±hw, pylon anchors on the two mast faces (±half the section width at that height). Built-in masts use ±0.65 × leg size. Only Trần Thị Lý uses it. |
| G4 per-pylon custom height | Done | When `pylon_heights_m` values differ and `pylon_custom` is set, each pylon's local y > 0 (legs, struts, crossbeams, anchor zones) is scaled by `h_i / max(h)`. Bạch Đằng: centre 45.9 m, sides 43.5 m above deck. |
| G5 truss girder | Done (basic) | `deck_section: "truss"` draws top and bottom chord slabs (0.6 m, full width) `deck_depth_m` apart (default 12), plus a Warren web of verticals and alternating diagonals on both faces, panels ≈ depth. Stays anchor at the top-chord edge; approaches stay 3 m deep. Applied to Cần Thơ 2 (14 m) and the Soài Rạp rail bridge (10 m). A truss deck with a crest or plan curve uses box pieces instead of a smooth mesh (no bridge needs it today). |
| G6 stay contrast | Done | `stay_colour` / `back_stay_colour` are muted, then their **sRGB** HSL lightness is clamped to ≤ 0.70 on a light sky and ≥ 0.45 on a dark sky. The theme is detected from the `--m3d-sky-bottom` token. three.js's default HSL space is linear, and a 0.70 clamp there still looked almost white, so the clamp is done in sRGB. |

Also changed: **custom-pylon height label.** A custom pylon used to be labelled with its tip height above deck. When the data's `pylon_height_ref` is `total`, the label (and the generated description) now gives water-to-tip of the drawn pylon. This is what the brief's "Label ≈175 m / 150 m" checks look at. Pylons whose ref is `above_deck` are unchanged.

## §2 Per-bridge changes (all via `REVIEW_R1` unless noted)

| Bridge | Changes |
|---|---|
| can-tho | aux [40,80,930,970]; cps 27; custom y × 0.965 (tip 130.3 → label 175 m) |
| vam-cong | heights [150,150]; custom y × 1.05 (tip 105; top beam 96.6); pylon text 150 m |
| bai-chay | stays yellow, crest 8 (PHASE6); custom y × 0.915 (tip 91.5, anchor zone 50.3–88.8); heights [91.5,91.5] above_deck; cps 28; nav 50 m ("press (widely quoted)"); pylon text. Note: with 50 m clearance, E = 50 + 3.6 + 1 ≈ 54.6 m, not the 43.5 m quoted in the brief's acceptance row. The two rows conflict, and I kept the ≥ 50 m clearance. |
| phu-my | custom y × 0.96 (≈145 m total) |
| binh-khanh | spans [187.25, 375, 187.25]; heights [155,155]; cps 17; deck concrete; span_arrangement and pylon text |
| phuoc-khanh | custom y × 0.877 (tip 96.5, top beam 91.2); cps 14; deck concrete |
| my-thuan | crest 6 (PHASE6) |
| my-thuan-2 | cps 16; heights [125.5,125.5]; custom y × 0.967 |
| nhat-tan | cps 11; heights 111 × 5 |
| rach-mieu | deck 15 m; legs at deck level moved to z ±9.5; heights 117; stays orange; pylon text |
| rach-mieu-2 | aux [60,460] (PHASE6); heights 116.5; nav width 220 (contractor, Trung Nam) |
| bach-dang | custom y × 0.74; crossbeam [−3, 22]; anchor zone 28–45; cps 12; stays orange; G4 makes the centre pylon taller |
| tran-thi-ly | white pylon, white stays, red back stays (PHASE6); `back_stay_planes: 2` |
| kien | cps 9; deck 16.7; parallel harp (G2) |
| ba-son | cps 14; custom y × 0.92 (113 m) |
| may-chai | `cable_pattern: "harp"`; shape-file legs and struts kept |
| ben-rung, cua-hoi | white pylons, red stays (PHASE6); parallel harp |
| thuan-an | white / red (PHASE6); `deck_elevation_m: 40`; new `pylon_custom`: A legs from the pier head at the deck edges to a 32 m apex, a pier column strut [0,−40,0]→[0,−3,0] w 8 and a pier-head beam at −3 m; parallel harp. **Deviation:** the brief's short head leg (32–36 m) cannot carry an 18–32 m anchor zone, and a single central plane cannot anchor on the inclined A legs. I extended the head into a central king-post from 16 m (where the legs are ±5 m apart) through the apex to 36 m, and anchored the stays at 18–33 m on it. |
| hoa-son | `deck_elevation_m: 40` (optional item, [E]) |
| tu-lien | `deck_elevation_m: 25`; custom y × 0.94 (blades 159.8 / 145.7 → ≈185 m total) |
| long-hung | new twin-sword `pylon_custom` exactly as specified; crest 6; deck 37; aux [60,640]; pylon text. Single-plane custom anchors now sit on the centreline (z = 0), so the stays run in the slot between the blades. |
| duong-sat-can-gio | `pylon_shape: "A"`; truss deck 10 m (G5); pylon text |
| can-tho-2 | truss deck 14 m (G5). The deeper deck raises E to 55 m (40 m clearance + 14 + 1), so the custom pylon is scaled × 0.913 to keep ≈160 m total. Crossbeams [−15, 98.6]: the under-deck beam moved below the bottom chord. |
| ngoc-hoi | deck 38.3 |
| can-gio | heights [150,150] (label only; geometry unchanged) |
| **phu-my-2** | **User decision (relayed mid-task):** spans **210 + 450 + 210**, `main_span_m` 450, auxiliary piers removed. Generator seed, M3D placeholder and shape file are updated. `span_arrangement`, sources and notes now cite the contractor page (https://bactrungnam-vn.com/cau-phu-my-2-dong-nai/) instead of "client-chosen estimate", and `pylons_vi` / `pylons_en` no longer call 350 m an estimate. The pylon geometry is unchanged at ≈110 m above deck (≈0.24 × 450, in line with Đại Ngãi and Vàm Cống). With the 55 m clearance E ≈ 59.75 m, so `pylon_heights_m` becomes [170,170] total [E]. |
| cao-lanh, binh, dai-ngai-1, cat-lai, nguyen-trai, phuoc-an, thuong-cat, cua-lon, dong-nai | No data change. Phước An gets the rounded crown (PHASE6) and the parallel harp. |

Skipped: none of the P0/P1 rows. P2 items not done: Nhật Tân deck width is kept at 33.2 m, as the brief says.

## Render review (against brief §3)

I looked at contact sheets of every bridge (side / front / three_quarter / foot, plus top where marked †):

- **Global**
  - Every §0.1 key is present, and no `colour`, `image_issue` or `auxiliary_piers_m_from_end` keys remain (both asserted).
  - After the sRGB clamp, stays show in every side view, including Cần Thơ's white stays and the white main stays of Máy Chai and Trần Thị Lý. On Cần Thơ they are light grey and readable but still soft: the fog fades a 1 px light line on a pale sky. If that is not enough, lower the 0.70 cap.
  - Harp bridges (Kiền, Máy Chai, Bến Rừng, Cửa Hội, Thuận An, Phước An) show parallel stays in the side view.
  - Planned bridges are still ghosted.
- **Cần Thơ:** 2 aux piers each end, symmetric; 27 stays per half-fan in full screen (the card thins dense fans).
- **Bãi Cháy:** yellow single plane, crest visible.
- **Bạch Đằng**
  - Beam at about 50% of the above-deck height; centre pylon slightly taller (G4).
  - The above-deck height is about 1.64 × the 28 m leg spacing, a little under the brief's 1.7–1.9 range. That comes from the leg spacing in the shape file, which I did not change.
  - The front-view camera sits under the deck because the deck is high (≈52 m).
- **Trần Thị Lý†:** white mast and main stays in the median, red back stays in two planes to the deck edges.
- **Thuận An†**
  - A-head on the pier head with no legs into the water; deck at 40 m; pylon 32 m above deck; red single plane.
  - It also has a king-post (see the deviation in §2).
- **Long Hưng†:** two slim median blades with a slot, meeting at a pointed tip and flared below the deck; single plane, crest, aux piers.
- **Soài Rạp rail bridge:** A pylons and a truss deck.
- **Cần Thơ 2:** ghosted truss double deck visible.
- **Tứ Liên:** deck at 25 m, blades about 185 m total.
- **Phú Mỹ 2:** 210 + 450 + 210, ghosted, no aux piers.
- **Others:** no regressions seen against the baseline.

Known cosmetic issue (pre-existing, not changed): under-construction form travellers fill the front view of short / narrow decks (Phước An, Đường sắt Cần Giờ), because the front camera is close to the pylon.
