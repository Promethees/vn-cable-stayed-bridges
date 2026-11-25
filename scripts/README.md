# scripts/

| Script | What it does |
|---|---|
| `gen_bridges.py` | Generates `data/bridges.json` (`python3 scripts/gen_bridges.py data/bridges.json`). |
| `build_neighbors.sh` | Rebuilds `src/assets/neighbors.geo.json` (foreign-land mask) from Natural Earth. |
| `render_views.mjs` | Renders standard 3D views of bridges to PNG, for photo-vs-model comparison (dev only). |

## render_views.mjs

Renders each bridge's 3D model full screen at 1200×800 with labels, dimensions and overlays off, and writes one PNG per view. It starts its own Vite **dev** server, because the camera API (`window.__engine.setView`) exists only in dev builds and is stripped from production.

One-time setup (Playwright is a dev dependency):

```sh
npm install
npx playwright install chromium
```

Usage:

```sh
# all standard views for two bridges
node scripts/render_views.mjs cau-can-tho cau-tu-lien --out /tmp/views

# every bridge, only some views
node scripts/render_views.mjs all --out /tmp/views --views front,foot

# custom camera, to match a photo's viewpoint
node scripts/render_views.mjs cau-can-tho --out /tmp/views --az 60 --el 10 --target pylon0
```

Output: `<out>/<id>-<view>.png`, or `<out>/<id>-custom-az<az>-el<el>-<target>.png` for a custom camera.

Views:

| View | Camera |
|---|---|
| `front` | Along the bridge axis from the middle of the main span, looking at the first pylon; the deck is translucent so the pylon shows from footing to tip. |
| `side` | True elevation of the stay-cabled unit, perpendicular to the bridge. |
| `three_quarter` | The app's default card view (azimuth 35°, elevation 20°). |
| `foot` | Close-up of the first pylon, about 30° off the axis, slightly below deck level, framing the footing up to about 1.3 × deck height. |
| `top` | Close-up of the first pylon's head (top ≈ 40% of the height above deck). |

Custom camera (`--az`, `--el` and `--target` go together; `--az` and `--el` are required):

- `--az <deg>`: azimuth off the bridge's perpendicular. 0 = side-on, +90 = along the axis from the far end (looking back toward the start), 35 = default.
- `--el <deg>`: elevation above the horizontal; negative values look up from below the deck.
- `--target pylon0 | main | unit` (default `unit`): what the camera looks at, framed to fit. `pylon0` = the first pylon (footing to tip), `main` = the middle of the main span at deck level, `unit` = the whole stayed unit.

Options: `--views` takes a comma-separated subset of the views above. `--url <base>` uses an already running dev server (`npm run dev`) instead of starting one.

Notes:

- Rendering uses headless Chromium with SwiftShader (software WebGL), so it works without a GPU. Expect a few seconds per view.
- Bridges without `model3d` are skipped with a warning.
- In the browser console of `npm run dev`, the same API is available: `__engine.setView({ preset: 'foot' })` or `__engine.setView({ az: 60, el: 10, target: 'pylon0' })`.
