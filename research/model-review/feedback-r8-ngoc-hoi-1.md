# Ngọc Hồi round 8: validation feedback 1 (commit dc2b99d)

I re-rendered the model from the worktree into scratchpad `views-nh-r1/` with these cameras: the five presets, `az55 el38 unit`, `az55 el35 pylon0`, `az10 el2 unit` and `az25 el5 pylon0`. I compared them with `ref/nh/user-official-render.png`, `dl/ho_885562182_z6.png`, `dl/bxd_9.jpg`, `dl/bxd_2.jpg` and `dl/bxd_3.jpg`.

**Geometry is good.** The following all match the references:
- Free posts with flat tips and no top beam.
- The U-and-arch gate matches `bxd_9`: lowest point ≈ 28 m, arch crown ≈ 23 m, spandrels down to the deck.
- The inverted-V concrete legs on the 24 × 50 m cap, and the two-tone post (red inner face, concrete outer face), match `bxd_3`.
- Spans, deck level and the 126 m label are correct.
- The data, docs and tests are thorough.

**Not approved, because of colour.** The red copper colour is the bridge's signature, and it does not come through.

## P0. The copper reads mauve-brown, not orange-red

Measured on lit faces in `cau-ngoc-hoi-front.png` (gate at (600, 470), posts at (490, 200)): **#7f5b55, sRGB HSL h = 9°, s = 0.20, l = 0.42**. In the user-camera view (`az55 el38 unit`), the pylons read as dusty brown-pink. The user's render reads vivid orange-red: posts and gate sample at about **#c6553a–#d7502a, h ≈ 12–18°, s ≈ 0.55–0.75**.

The cause is in `src/three/engine.ts`. `mutedColour()` caps saturation at 0.45, and it does so in three's **linear** working space (`c.getHSL(hsl)` is called with no colour space). That crushes an sRGB-saturated hex colour much more than 0.45 would suggest.

The stays have the same problem. `#d4a24c` renders as pale beige-amber 1 px lines that almost vanish, while the render shows a strong golden fan.

**Fix (G14, scoped per bridge so other bridges stay byte-identical):**

- **Schema.** Add `model3d.colour_mode?: "muted" | "vivid"`, default `"muted"`. Document it in `docs/data-schema.md` next to `pylon_colour` and add it to `types.ts`, `validate.ts` and the generator's allowed keys.
- **Engine.** When `colour_mode === "vivid"`:
  - Hex colours on this bridge skip the saturation cap. This covers `pylon_colour`, `legs` / `struts` / `panels[].colour`, `stay_colour`, `back_stay_colour` and `deck_colour`.
  - Read them as sRGB (`new THREE.Color(hex)`, which converts to linear under ColorManagement).
  - Clamp only the lightness, to 0.30–0.80 in **sRGB** HSL.
  - Named colours keep their pre-muted palette.
  - For stays, keep the existing `stayLightness` theme adjustment but **preserve the saturation**.
- **Data.** Set `"colour_mode": "vivid"` in `research/shapes/cau-ngoc-hoi.json`. Keep `#cf5a32` and `#d4a24c`. If the stays still read weak after this, raise them to `#e0a83a`.
- **Fallback.** If you would rather not add a field, apply the cap in sRGB space instead of linear space and raise it to 0.7. That changes every hex-coloured bridge, though, and they would all need re-checking. The per-bridge field is preferred.

**Acceptance:**

1. `front` preset, lit gate and post-face pixels (for example (600, 470) and (490, 200)): **sRGB hue 8–22°, saturation ≥ 0.45, lightness 0.35–0.62**.
2. `--az 55 --el 38 --target unit`: posts and gate read clearly **orange-red**, as in the user's render.
3. Stays read **golden**: the line pixels in `az10 el2 unit` have hue 30–48° and saturation ≥ 0.40, and the fan is clearly visible against sky and water.
4. Concrete parts (outer skin, split legs, cap) stay plain concrete.
5. Re-render the bridges that use hex pylon or stay colours with HEAD and with the branch, and diff them. Everything except Ngọc Hồi must be byte-identical, as in round 8.

## P2. Small saw-teeth on the U edge (optional)

In the front preset, zoomed at about x 500–700, y 380–470 (`views-nh-r1/z_u.png`), there are small regular dark ticks along the smoothed U edge, one at each column. They look like slivers from the top wall at each column join, or a few z-fighting pixels between the face and the wall. They are not visible at normal size. If it is cheap, share the vertices between the face and the wall quads, or offset the wall by 1 cm. Otherwise ignore it.

## Not required

- `crossbeam_colour`: not needed, because no bridge uses it.
- The official aerial image entry: fine to skip.
