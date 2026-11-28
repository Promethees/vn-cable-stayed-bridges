# Implementation: round 12, Cầu Cửa Hội (`cau-cua-hoi`), 2026-11-28

Implements `brief-r12-cua-hoi.md`. The brief's optional engine items (round/elliptical sections, approach viaducts) were skipped.

## Changes

**`research/shapes/cau-cua-hoi.json`**
- `model3d` is replaced verbatim by the brief's target (`chwork/target_shape_model3d.json`). It contains:
  - a lotus-bud median shaft to 29 m, with the pink-red tip on leg 4;
  - a pier ≈6 × 8 m on a chamfered cap 12 × 23 m (G18 `chamfer_m` 3.5);
  - deck 26 + crest 2.6, depth 3, haunch {5, 60} (G17);
  - one plane, semi-fan, 11 stays per side, `main_stay_deck_m` / `back_stay_deck_m` [14, 58], anchor zone 7–18.5 m;
  - stays `#d0313d`, `colour_mode` "vivid".
- `pylons_vi` / `pylons_en`, `notes`, `colour`, `compare` and `checklist` follow §4 and §6. A round-12 `review` line is added and `pass2` is kept.

**`scripts/gen_bridges.py`**
- **Seed `add()`:**
  - new fields: `total_length_m` 1728, `lanes` 4, `pylons` (búp sen), `cost` "950 tỷ VND";
  - `investor` "Ban QLDA 6 (Bộ GTVT); designer TEDI";
  - 7 new sources (VTV, Ngôi Sao, CafeBiz, Kinh tế & Đô thị, Người Quan Sát, VnExpress lighting, vi.wikipedia);
  - new notes, which no longer say "single source";
  - `construction_start` 2019 and `opened` 2021 are kept.
- **m3d fallback:** brought in step (single, [29, 29], semi_fan, cps 11), with the usual "fallback only" comment.
- **PRESS:** 2 images added, VTV side elevation and Người Quan Sát completed bridge.
- **NAV:** `nav(24.5, 80, "navigation opening 120 m × 20.5 m; 24.5 m within 40 m …; 2,000 DWT", VTV)`.
- **PHASE6:** `#d0313d` plus vivid.
- **EXPECT_R1:** now white / `#d0313d` / vivid / deck 26 / crest 2.6 / 11 / semi_fan.
- **Allow-lists:**
  - `VIVID_OK` (G14) and `G15_OK` gain `cau-cua-hoi`;
  - the G17 `deck_haunch` assert now accepts `("cau-thuan-an", "cau-cua-hoi")`;
  - the G18 `chamfer_m` assert now accepts `("cau-dai-ngai-1", "cau-cua-hoi")`.
- **Round-12 assert block:** covers every item in brief §5.7, plus a VTV / kinhtedothi source check.

**`src/lib/data.test.ts`**
- The vivid and `main_stay_deck_m` allow-list expectations now include `cau-cua-hoi`. There are no separate lists for `deck_haunch` or `chamfer_m`.
- **New test** `Cửa Hội (round 12) …`. I confirmed it runs to the end and does not return early. It checks:
  - no warnings and E = 26 (not raised);
  - deck 28.02 at the pylons and 28.6 at mid-span, with the 24.5 m clearance + 1 m met under the girder;
  - haunch 5 → 3 m over 60 m;
  - tip ≈57 m above the water;
  - every sweep within 4 m of the centreline;
  - an octagonal cap with its top 1.5–3.5 m above the water and 23 m across;
  - pylon : deck-above-cap ratio 0.95–1.25;
  - 11 + 11 stays per pylon in the median, 14–58 m on the deck, 7–18.5 m on the shaft.

**`data/bridges.json`** was regenerated.

## Verification
- `python3 scripts/gen_bridges.py data/bridges.json` runs with all asserts passing.
- `npm run typecheck` and `npm run lint` are clean. `npm test` passes all 143 tests, and `npm run build` succeeds.
- **Renders** (own dev server on :5831) are in `scratchpad/views-ch-impl/`: the 5 standard views plus `--az 30 --el 1 --target unit` and `--az 0 --el 2 --target unit`. Both custom renders are **byte-identical** to the researcher's `chwork/r3/` targets.

## Comparison with the photos
- **`nq1.jpg`:**
  - Matches: two white median shafts with a pointed pink-red tip; single-plane red fans ending ≈58 m out on both sides; the visible haunch at the piers; the slight crest; rectangular piers on low chamfered caps; the overall proportions.
  - Still differs: the real bud is taller, slimmer and drop-shaped (a round section, about as wide as the shaft, tapering over the top ≈⅓ of the pylon). The rectangular "bud" sweep reads as a squat lantern. This is the engine gap the brief already names (round/elliptical sweep sections, P2).
  - Also differs: in the photo the top stay anchors look closer to the bud than 18.5 m. The brief's values are kept.
- **`vtv.png`:** the pylon height and the deck height above the water relative to the 153 m span, the absence of auxiliary piers and the inner and outer stay landings all look consistent.

## Deviations
- `investor` reads "Ban QLDA 6 (Bộ GTVT); designer TEDI" instead of the bare "Ban QLDA 6 (Bộ GTVT)". This follows the Đại Ngãi 1 pattern (client; contractor) and records TEDI as the brief asks.
- No other deviations.
