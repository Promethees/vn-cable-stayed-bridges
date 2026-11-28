# 3D model review: round 10 implementation, Cầu Cát Lái (2026-11-28)

Brief: `research/model-review/brief-r10-cat-lai.md`. The pylon is rebuilt as TEDI SD01's "giọt nước" (water drop): the legs straddle the deck instead of standing in the median. There are no engine changes; the only code change is the G15 opt-in assertion in the generator. Checks: `npm run typecheck`, `npm run lint`, `npm test` (124 tests) and `npm run build` all pass. Regenerating `data/bridges.json` changes only `cau-cat-lai`.

## Data

**`research/shapes/cau-cat-lai.json`**
- `model3d` is the brief §3.1 JSON (scratchpad `clwork/target.json`), unchanged:
  - spans 190 + 450 + 190, auxiliary piers [70, 760]
  - pylons [175, 175] total, `deck_elevation_m` 50 / `deck_crest_m` 11 / `deck_depth_m` 3.5
  - deck 33.5 m composite
  - stays: 2 planes, semi-fan, 22 per side per plane, `back_stay_deck_m` [22, 186], `main_stay_deck_m` [22, 218]
  - white pylons and white stays
  - pylon geometry: 2 legs, 4 G13 panels (under-deck arch beam, waist web, top link, base knot), `pile_cap` 30 × 36, anchors 74–103 m
- No `crown` and no `crossbeams_y_m` key. No `deck_closed` key, because nothing is built yet.
- `pylons_vi` and `pylons_en` are set from §3.2.
- `notes` is "Official renders (VnExpress / Tuổi Trẻ / Báo Xây dựng, 2026)."
- `review` and `checklist` are rewritten:
  - legs at deck: outside the deck edges
  - head: slot, top link and two tips, with no crown
  - foot: a loop on a plinth
  - crossbeams: panels only

**`scripts/gen_bridges.py`**

| Where | Change |
|---|---|
| Seed `add(...)` | Adds `width_m` 33.5 and `span_arrangement` "190 + 450 + 190 m". `pylons` / `pylons_en` hold the water-drop texts. Cost is 24,003 tỷ (bridge sub-project ≈14,920 tỷ, PPP-BT). Investor is the CC1 JV, design TEDI. Adds 6 sources: Dân Trí 29/9/2026, Tuổi Trẻ 29/9/2026, 1thegioi, Báo Đồng Nai 1/2026, cafeland 152342 and cafeland 150238. Notes are the brief's text, including that Long Hưng's 175 m / 37 m / twin swords must not be applied here. |
| `M3D` fallback | Kept in step with the shape file: `other`, [175, 175], semi-fan, 33.5 m composite, `cps` 22. |
| `PRESS` | Adds the VnExpress pylon close-up and the Tuổi Trẻ 9/2026 groundbreaking render. The credit is the existing English "VnExpress (Đồng Nai Dept. of Construction render)", for consistency. |
| PHASE6 | The `"cau-cat-lai": {"pylon_custom": {"crown": "rounded"}}` entry is deleted and replaced by a comment. |
| `EXPECT_R1` | `cau-cat-lai`: `deck_width_m` 33.5, `cables_per_side` 22, `deck_elevation_m` 50. |
| Regression block | Checks spans, aux piers, heights and deck levels, stay ranges, and that there is no `deck_closed`, no `crown` and no `crossbeams_y_m`. Checks 4 panels and the cap top at −48.3. Checks that the leg z at y 0 is ≥ 17 (outside the deck), that the loop reaches ±22 below the deck, and that the tips are at (117, ±7.2). Checks the anchors 74–103 m. Checks the texts: water drop / giọt nước / 175, and no "rounded" / "twin swords" / "song kiếm". Checks the cost (24,003), TEDI, and the Dân Trí / cafeland 152342 sources. |
| G15 / G16 opt-in | Split into two checks. `G15_OK = {"cau-phuoc-an", "cau-cat-lai"}` may set `main_stay_deck_m`. Only `cau-phuoc-an` may set `deck_closed`. |

**`src/lib/data.test.ts`**
- The Phước An opt-in check is split: `deck_closed` is set only on Phước An, and `main_stay_deck_m` only on Cát Lái and Phước An.
- A new test, "Cát Lái (round 10)", checks:
  - **Data:** no crown, no crossbeam bar and no `deck_closed`. The legs are outside ±16.75 at deck level, the loop reaches ±22, and the tips are at (0, 117, ±7.2). Width and span arrangement are checked too.
  - **Geometry:** no warnings for the under-construction or the completed status. Pylons at x 190 / 640, aux piers [70, 760], deck 50 at the ends, 57.77 at the pylons and 61 at mid-span. The label is 175. Each pylon has 6 sweeps (2 legs + 4 panels), 0 members and 1 cap. Travellers are present (balanced cantilevers).
  - **Stays:** under construction, only the stays on the built cantilevers are drawn. The completed geometry has 88 stays per pylon (22 × 2 sides × 2 planes). Back stays land 22–186 m from the pylon and main stays 22–218 m, each in its own plane.

## Renders

The renders are in scratchpad `views-cl-impl/`: front, side, foot, top, three_quarter, az70/el5/pylon0, az88/el1/pylon0, az35/el6/unit and az8/el2/unit. They come from a dev server on 127.0.0.1:5782 that this worktree started, and they are identical in form to the researcher's prototype (`clwork/r2/`).
- **az70 vs `vne3.jpg`.** The loop below the deck sits on a low plinth, with the arched under-deck beam. Above the deck the legs converge to the waist web, run up as a slot to the top link, and end in two flaring tips. The deck runs between the legs.
- **az88 vs `tt2_crop.png`.** The legs land at the deck edges. The waist at ≈0.6 H, the slot and the top link match the axis view. Nothing stands in the median.
- **az8 vs `bxd_2`.** The proportions and the deck crest read correctly. The deck is drawn as balanced cantilevers, the under-construction convention.
- **az35 vs `tt1` / `mtg1_side.png`.** The auxiliary piers are in the side spans. They are drawn as single piers, not twin columns (cosmetic, brief §4).

## Deviations

None of substance. The credit for the new VnExpress image uses the existing English wording. Cosmetic gaps carried over from brief §4:
- The twisted base is approximated by a knot panel.
- The auxiliary piers are single-column.
