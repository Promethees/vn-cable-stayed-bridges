# 3D model review: round 9 implementation, Cầu Phước An (2026-11-28)

Brief: `research/model-review/brief-r9-phuoc-an.md`. Everything in the brief is implemented: the P0/P1/P2 data changes and the two engine gaps, **G16** (`deck_closed`) and **G15** (`main_stay_deck_m`). The `model3d` is exactly the brief's §3.1 / `pawork/target.json`.

Checks: `npm run typecheck`, `npm run lint`, `npm test` (118 tests) and `npm run build` all pass.

## Engine

### G16: `model3d.deck_closed?: boolean`

| File | Change |
|---|---|
| `src/lib/bridge3d.ts` | The cantilever branch now runs only when `status === 'under_construction' && m.deck_closed !== true`. With the flag set, the deck is one segment `[0, totalLength]`, there are no travellers and every stay is drawn. `g.status` is unchanged, so the yellow status chip stays. |
| `src/types.ts`, `src/lib/validate.ts` | New optional boolean. |
| `docs/data-schema.md`, `docs/design-3d.md` | Documented in the schema and the status table. |

### G15: `model3d.main_stay_deck_m?: [number, number]`

This mirrors G11 (`back_stay_deck_m`) on the main sides (the main span, or the side toward the next pylon).

- Stay `t` (0 = the lowest pylon anchor) lands at `pylon station ± (d0 + (d1 − d0) · t)`.
- Both ends are clamped to [1, reach − 1]. The reach is half-way to the next pylon. Clamping gives one warning, `main_stay_deck_m clamped to the stay reach …`.
- When from > to, the range is swapped with a warning.
- Harp ignores the range, with a warning.
- Pylon anchors use `customAnchor` / `atY` exactly as the G11 branch does.
- The code is a new `else if (!back && mainDeck)` branch in the stay loop, so bridges without the field take the old path.

Docs: `docs/data-schema.md` and a new "Main-side deck range (G15)" rule in `docs/design-3d.md`. Both new keys are in the allowed-key list in `src/lib/data.test.ts`.

## Data

- **`research/shapes/cau-phuoc-an.json`** (pass 2):
  - `model3d` replaced with brief §3.1, including the notes;
  - new `pylons_vi` / `pylons_en`;
  - `notes`, `review` and `checklist` now say "pointed (Gothic) apex, solid tip", "legs converge to an elliptical cap, one strut" and "deck / aux piers: pass (no aux piers; deck closed)".
- **`scripts/gen_bridges.py`**:
  - **The `PHASE6["cau-phuoc-an"] = {"pylon_custom": {"crown": "rounded"}}` entry is deleted** and replaced by a comment.
  - The old `PYLON["cau-phuoc-an"]` entry is removed. The geometry now lives only in the shape file, as it does for Ngọc Hồi and Bình Khánh, so it is not duplicated.
  - The `M3D` seed is now 137.5 / 250 / 137.5, `[119, 119]` total, semi-fan, 12 per side. It is marked as a placeholder for the shape file.
  - `add()`:
    - `span_arrangement` "137.5 + 250 + 137.5 m";
    - 3 new sources: CafeF 27/10/2026, Thanh Tra and the Trungnam closure page;
    - the notes get the sentence from the brief, and "no confirmation found by" is updated to 28/11/2026.
  - `PRESS`: 3 new CafeF images (img4224 aerial, img4207 axial aerial, the deck-level render), credited "Báo Xây dựng / CafeF".
  - Regression asserts cover:
    - spans, heights and reference, E and crest, width, no `deck_depth_m`;
    - pattern, planes and count, both deck ranges, `deck_closed` while the status stays `under_construction`;
    - colours, `crown == "pointed"`, tips at (0, 60, 0), feet on the cap at ±9.5, ±16 at the deck;
    - one strut at −28, the panel apex at 60.3, anchor zones, cap dimensions;
    - bridge texts and sources, 3 CafeF images, and no "rounded crown" anywhere.
  - A further assert keeps G15/G16 opt-in: no other bridge may carry either key.
- **`data/bridges.json`** was regenerated. Compared record by record with the previous file, only `cau-phuoc-an` changed.

## Tests

- **`bridge3d.test.ts`:**
  - **G16:** under construction with `deck_closed` gives one deck segment `[0, 850]`, 0 travellers, the status kept, and the same cable count as the completed build. `false` or an absent flag still gives 4 travellers. Validation is checked too.
  - **G15:** on spans [137.5, 250, 137.5] with `[24, 105]`:
    - pylon 0's main anchors run **161.5 → 242.5**, monotonic, and the lowest anchor lands nearest the pylon;
    - pylon 1 mirrors them;
    - the back sides are unchanged;
    - clamping, swapping and harp each give their warning;
    - validation is checked;
    - without the field, the old reach spread is used.
- **`data.test.ts`:** new Phước An test:
  - no warnings; one 0–525 deck, no travellers, status `under_construction`;
  - pylons at 137.5 / 387.5;
  - E 54, deck 60.5 at mid-span and ≈59.03 at the pylons;
  - tip 60 above the deck, label **119**;
  - 3 sweeps (2 legs + the tip panel), 1 strut below the deck, 1 cap, leg feet 0–4 m above the water;
  - 48 stays per pylon, anchored 17–43 m above the deck and 24–105 m out, each in its own plane;
  - a 40 m unstayed gap at mid-span;
  - only this bridge uses G15/G16.

## Renders

The renders are in scratchpad `views-pa-impl/`: the 5 presets plus `az-30 el25 unit`, `az-55 el6 pylon0` and `az80 el3 main`. Each script was pointed with `--url` at a separate Vite server on its own port. The default port 5199 is shared with the other worktrees and one run hit another server, so this rules that out.

- **`az-30 el25 unit` vs `cafef3`:** matches. The deck is continuous and has no yellow boxes. Both teardrop arches stand on stadium caps just above the water, with the strut below the deck. The two fans almost meet at mid-span.
- **Front / `az80 el3 main` vs `cafef4`:** a symmetric pointed Gothic arch straddles the deck, with a solid tip and near-vertical stay planes from the legs to the deck edges. Below the deck the legs converge to the cap with one strut. Nothing floats, and there is no generic pier under the pylon.
- **`az-55 el6 pylon0` vs `cafef1` / `nqs`:** the teardrop outline, the converging lower legs, the strut and the elliptical cap all match.
- **Side:** 137.5 + 250 + 137.5 with no aux piers. There are 12 stays per side per plane, and ≈40 m of the main span centre is unstayed.
- **Colour:** the off-white `#e9e7e1` is rendered muted, as on every non-vivid bridge, so it reads pale grey rather than white. I did not set `colour_mode: "vivid"` because the brief did not ask for it.

**Regression check.** Front, three-quarter and side views of 4 bridges were rendered from HEAD 2a35718 (a `git archive` copy) and from this branch. All **12 PNGs are byte-identical**. The bridges are:
- `cau-thuong-cat` and `cau-nguyen-trai`, which are under construction without `deck_closed`, so they still show cantilevers and travellers;
- `cau-ngoc-hoi`, which is under construction and vivid;
- `cau-tran-thi-ly`, which uses G11 `back_stay_deck_m`.

As a control, the Phước An PNGs differ.

## Deviations

- The old `PYLON` entry was removed rather than replaced, because the pass-2 shape file supersedes it.
- The shape file's `notes` ("r9: …") is appended to `model3d.notes` by the existing generator merge, which is the same pattern Ngọc Hồi uses.
