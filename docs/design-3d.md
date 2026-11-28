# Design spec: card media (3D schematic model + gallery)

Extends `docs/design.md` §6 (bridge card). Replaces the inline span diagram (§6.2 placement) and gallery (§6.5) there; the diagram drawing rules in §6.2 still apply to the "Sơ đồ" view.
Data: `model3d` and `images` in `docs/data-schema.md`. Tokens: `--m3d-*`, `--hero-*`, `--thumb-*`, `--lightbox-*`, `--linkcard-bg`, `--badge-approx-*` in `docs/design-tokens.css`.

Current data (2026-11-25): no bridge has `model3d` yet, and 16 of 33 bridges have no images. Both the empty and fallback states are therefore the common case at launch, not edge cases.

---

## 1. Placement: one hero media area with three views

The card gets a **hero media area** directly under the title block (name, status chip), above the main-span figure. A segmented control on top switches the view:

```
┌─────────────────────────────────────────┐
│ Cầu Mỹ Thuận 2                      [✕] │
│ (⊥ Đã thông xe) (Extradosed) Sông Tiền  │  structure tag only when extradosed; usage icons road/rail/metro
│ ┌ Ảnh 3 ┐┌  3D  ┐┌ Sơ đồ ┐               │  segmented control, role=tablist
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │  hero viewport, aspect --hero-aspect,
│ │          (active view)              │ │  max-height --hero-max-h on desktop
│ │                                 [⤢] │ │  full-screen button (3D and Ảnh)
│ └─────────────────────────────────────┘ │
│ [thumb][thumb][thumb][link]   2 / 4     │  Ảnh only: thumbnail strip
│ Ảnh: Nguyễn Văn A, CC BY-SA 4.0. Nguồn  │  credit line (Ảnh) / disclaimer (3D)
│                                         │
│ 350 m  nhịp chính                       │  rest of the card as in design.md
```

Why tabs rather than stacking: photos, 3D and the diagram answer the same question ("what does it look like?"), and the phone sheet can only afford one viewport. Stacking would push the spec table below the fold.

| View | Label VI / EN | Shown when | Content |
|---|---|---|---|
| Photos | Ảnh / Photos (+ count) | always (empty state if 0) | gallery, §7 |
| 3D | 3D | `model3d` present | Three.js schematic, §2–§6 |
| Diagram | Sơ đồ / Elevation | `span_arrangement` or `model3d.spans_m` parses to ≥ 2 spans | SVG elevation from design.md §6.2 (prefer `model3d.spans_m` when present) |

- **Default view**: Photos if there is at least one displayable (licensed) image, otherwise Diagram, otherwise Photos (empty state). **3D is never the default**: it only loads when someone picks it.
- The chosen view is kept while browsing other bridges in the same session (if available for that bridge) and reflected in the URL as `&view=3d|diagram` (omit for photos). `/?bridge=id&view=3d` opens straight into 3D.
- The segmented control is `role="tablist"`, each tab is `role="tab"` with `aria-selected` and `aria-controls`, and Left/Right arrows move between tabs (roving tabindex). Hidden tabs are removed, not disabled.

### Phone bottom sheet
- The hero is part of the sheet's **half** snap: at peek (148px) only name, status and main span show. Selecting the 3D tab, or tapping the hero at peek, raises the sheet to at least half.
- Inside the 3D canvas, `touch-action: none`: one finger orbits and two fingers pinch-zoom or pan. The sheet can then only be dragged by its handle and title row, never from the canvas, so orbiting never fights the sheet drag.
- At the full snap the hero keeps its 16:10 ratio; the spec table scrolls under it (the hero is not sticky).

### Full screen
Yes, for 3D and Photos. The `⤢` button opens a modal `<dialog>` (`--z-lightbox`) that fills the viewport. Use this rather than the Fullscreen API, which is unreliable for elements on iOS Safari.
- 3D full screen: the same renderer, re-parented and resized (do not create a second WebGL context). The toolbar moves to the bottom centre, and labels get more room (the declutter threshold relaxes, §5).
- Photos full screen = the lightbox, §7.3.
- Esc or the `✕` button closes it and returns focus to `⤢`.

---

## 2. 3D visual style: an architect's white model on a calm river

Aim for a matte study model of the bridge, not a render. It should read instantly as a diagram: flat-shaded volumes, every edge outlined, one accent color for the stay cables, and no textures, reflections or post-processing.

| Element | Token | Material |
|---|---|---|
| Background | `--m3d-sky-top` → `--m3d-sky-bottom` | CSS linear-gradient on the container; renderer `alpha: true`, clear alpha 0 |
| Fog | `--m3d-sky-bottom` | `THREE.Fog(near = 1.2 × fitDistance, far = 3 × fitDistance)`: fades the water edge into the sky |
| Water plane | `--m3d-water` | `PlaneGeometry` 3 × total length square, `MeshLambertMaterial`, at y = 0, no animation |
| Banks / ground | `--m3d-ground` | two low boxes (height 4 m) from each abutment outward for `approach_length_m` (default 0.3 × unit length) + 200 m, width 3 × deck width; approach deck as a plain slab sloping down to bank height |
| Pylons, piers | `--m3d-concrete` | `MeshLambertMaterial`, `flatShading: true` |
| Deck (concrete) | `--m3d-concrete` | same; deck depth = clamp(main span / 120, 2, 4.5) m |
| Deck (steel / composite) | `--m3d-steel` | same |
| Stay cables | `--m3d-cable` | `LineSegments` with `LineBasicMaterial` (1px, so they stay crisp at any zoom). A data `stay_colour` / `back_stay_colour` is muted, then its HSL lightness is clamped to ≤ 0.70 on a light sky and ≥ 0.45 on a dark sky, so white stays never vanish. With `colour_mode: "vivid"` (G14) the stay colour is not muted: its sRGB saturation is kept and only the lightness is clamped (0.30–0.80, then the same sky clamp) |
| Outlines | `--m3d-edge` | `EdgesGeometry(threshold 30°)` on every mesh, `LineBasicMaterial` transparent |

Lighting: `HemisphereLight(sky = --m3d-sky-top, ground = --m3d-water, --m3d-hemi-intensity)` plus one `DirectionalLight(#ffffff, --m3d-sun-intensity)` from azimuth 135° and elevation 50°. **No shadows** (cost, and they add realism the schematic does not want). Tone mapping off, `outputColorSpace = SRGBColorSpace`.

Theme: read every `--m3d-*` value with `getComputedStyle(document.documentElement)` when building the scene. On theme change (the `prefers-color-scheme` matchMedia listener, plus a MutationObserver on `data-theme`), update material colors in place and render once.

### Geometry rules (procedural, 1 unit = 1 m, no vertical exaggeration)
- **Deck elevation** above water (at the unit ends): `deck_elevation_m` when given, else `clamp(0.1 × main span, 12, 45)` m. The clearance is checked at the centre of the widest main span, where the deck is this plus the crest there (`deck_crest_m`), so E = max(E, `nav_clearance.height_m + deck depth + 1` − crest at that station); a given value that gets raised logs the warning "deck_elevation_m below navigation clearance". If `pylon_height_ref = "total"`, the pylon height above deck = height − deck elevation − crest at the pylon, and a custom pylon's water-to-tip label includes the crest at the pylon (the drawn tip).
- **Custom pylons** (`pylon_custom`): local y is above the deck, so tip = local y + deck elevation. When `pylon_heights_m` differ between pylons, each pylon's above-deck y (legs, crossbeams, anchor zones, struts) is scaled by `h_i / max(h)`. The height label shows the drawn pylon: water-to-tip when the data's reference is `total`, otherwise tip above deck. Pylon supports get no automatic pier: a custom pylon's legs (or struts) must reach its foundation, and `pile_cap` draws a box or stadium footing at every pylon in the plain concrete material.
- **Per-member colours (G12)**: `pylon_custom.legs[i].colour`, `struts[i].colour` and `panels[i].colour` override `pylon_colour` for that member (same muted tint, one material per colour); members without one use `pylon_colour` or plain concrete as before, and pile caps stay plain concrete. Ngọc Hồi: copper-red inner posts and gate, concrete outer skin and split legs.
- **Colour mode (G14)**: data colours are muted by default (`mutedColour`: saturation ≤ 0.45, lightness 0.35–0.88, computed in three's linear working space), which keeps every model in one study-model palette. `colour_mode: "vivid"` opts a bridge out for hex colours: each is read as sRGB, keeps its saturation, and only its sRGB lightness is clamped to 0.30–0.80 (`vividColour`); named colours keep their palette values. Ngọc Hồi uses it so the copper gate (`#e06a3e`) reads orange-red and the stays golden. Bridges without the field render byte-identically.
- **Panels (G13)**: `pylon_custom.panels` draws a flat infill between a `top` and a `bottom` (z, y) curve in the pylon's cross-bridge plane, extruded along the bridge over `x_m ± depth_m / 2`. Columns sit at the union of both curves' breakpoints (two where a curve steps vertically), each interval split into 6 with a shape-preserving cubic (PCHIP) so a U or an arch reads smooth without overshoot; the mesh is the two faces, the walls along both curves and the end caps. Vertices go through the same pylon-local mapping as the legs (mirrored with the pylon, above-deck y scaled per pylon), are part of the pylon's sweeps (bounds, NaN checks) and never set the tip, anchors or crossbeams. Ngọc Hồi "Cổng Mặt Trời": the gate's upper edge is a U down to ≈28 m above the deck, its lower edge a round-headed arch with its crown at ≈23 m.
- Missing `pylon_heights_m`: use 0.22 × adjacent main span above deck (0.1 × for `extradosed`).
- **Pylon positions** (count = `pylon_heights_m.length`): (a) if the count equals the number of interior supports, put a pylon on every interior support; (b) otherwise put them at the ends of the largest spans; (c) if that still does not match, rank interior supports by the sum of their adjacent spans and take the top N, and log a console warning. Other supports get plain piers (box columns, width 0.6 × deck width).
- **Pylon shapes** (legs at the cable-plane positions; leg section about 1/25 of pylon height):
  - `H`: two vertical legs, a crossbeam under the deck and another at 85% height.
  - `A` / `inverted_V`: legs lean in to meet at the top (A also gets the under-deck crossbeam).
  - `inverted_Y`: A-legs meeting at 60% of the height above deck, then a single mast.
  - `diamond`: legs splay out to the deck edges and converge both above (apex) and below (footing).
  - `single`: one mast on the centreline.
  - `other`: draw as `H`.
- **Cable planes**: 2 → at the deck edges (±0.5 × `deck_width_m`), anchored on the pylon legs; 1 → on the centreline (a median slot in the deck).
- **Cables per side** = `cables_per_side ?? clamp(round(reach / 12), 6, 24)`, where reach = half the main span toward a neighbouring pylon, or 0.95 × the back span toward an abutment or auxiliary pier. Deck anchors are spaced evenly from 8% to 100% of the reach.
- **Pattern**: `fan` = all cables from the top point; `semi_fan` = pylon anchors spread over the top 25% of the height above deck; `harp` = truly parallel stays on each side of a pylon: anchor heights run linearly from `yLow` to `yTop` (built-in pylons: `yTop` = 0.97 H, floor 0.15 H; custom: the anchor zone), with `yLow = max(floor, yTop · f0/f1)`, and each deck anchor sits at `anchor x ± k · (anchor height above deck)`, where `k` puts the outermost stay at the end of the reach (`f1`). If the floor is above `yTop · f0/f1`, the deck anchors start further out rather than bunching the stays.
- **Back-stay planes**: with `cable_planes = 1` and `back_stay_planes = 2`, the back-span stays (toward a unit end) are drawn in two planes from the two faces of the mast to the deck edges (±0.5 × deck width); main-span stays stay on the centreline. Single-plane custom pylons anchor on the centreline (z = 0), unless an anchor zone names a `side`: then main-span and back-span stays use only their own zones (zones without a side serve both), pick the zone whose leg is on the plane's side when that side has two planes, and anchor on the leg's real z (Nguyễn Trãi: main plane on the central mast, back planes on the two rear columns).
- **Back-stay count and deck range (G11)**: on a back side (toward a unit end, no further pylon), `back_stay_count` replaces `cables_per_side` as the number of stays per plane, and `back_stay_deck_m: [d0, d1]` replaces the `reach · (f0…f1)` deck stations: stay `t` (0 = lowest pylon anchor) lands at `pylon station ± (d0 + (d1 − d0) · t)`, both clamped to [1, distance to the unit end − 1] (swapped with a warning when `d0 > d1`), and is not snapped to auxiliary piers. Harp ignores the range (warning). Main sides are unchanged. Trần Thị Lý: 33 main stays, 2 × 15 back stays converging on the last ≈15 m of deck at abutment S1.
- **Truss deck** (`deck_section: "truss"`): top and bottom chord slabs (0.6 m thick, full deck width) `deck_depth_m` apart (default 12 m), joined on both faces by a Warren web (verticals at every node plus alternating diagonals, panels ≈ `deck_depth_m` long). Stays anchor at the top-chord edges; approach slabs stay 3 m deep.
- **Extradosed**: low pylons (as above); deck anchors only from 15% to 50% of the reach. The deck is visibly deeper (×1.8).
- Unparseable or degenerate `model3d` (for example an empty `spans_m`): do not attempt a partial model. Show the fallback (§6) with the message "Thiếu thông số để dựng mô hình 3D." / "Not enough data to build the 3D model."

---

## 3. Status in 3D (decided: two simple treatments, no crane)

| Status | Treatment |
|---|---|
| completed | full model as above |
| under_construction | **Balanced cantilever**: pylons complete; the deck is built out from each pylon to 60% of each reach, leaving open closure gaps at mid-span and at the abutment ends of the back spans. Cables are drawn only to built deck. A 6 × 4 × 5 m form-traveller box in `--m3d-traveller` sits at each deck tip; it is the only status-colored object. |
| planned | **Ghost**: all meshes get `transparent: true` and `opacity: --m3d-ghost-opacity`, and edges become `LineDashedMaterial` in `--m3d-ghost` (dash 4, gap 3). Cables are dashed too. Water and banks stay normal so the ghost reads against them. |

There is no crane: travellers say "being built" with one box, and a crane would add clutter and modelling work.

---

## 4. Camera & controls

- `PerspectiveCamera`, fov 35°, near 1, far 10 × fitDistance.
- **Default 3/4 view**: the target is the unit centre at half the pylon height; the camera is at azimuth 35° off the bridge's perpendicular and elevation 20°, with the distance chosen so the whole cable-stayed unit plus 10% margin fits the viewport width (recompute on resize).
- `OrbitControls` with `enableDamping` (damping 0.08), `minPolarAngle` 10° (the camera never looks straight down) and `maxPolarAngle` 84° (it never goes below the water). `minDistance` = max(60, 0.12 × unit length) and `maxDistance` = 2.2 × default distance. The pan target is clamped to the bridge bounding box expanded by 20%. `screenSpacePanning: true`.
- **Render on demand**: render only on control change, resize or theme change; no constant loop.
- **Auto-rotate: off.** An optional toolbar toggle "Tự xoay" / "Auto-rotate" (`aria-pressed`, 0.6°/s) is hidden entirely when `prefers-reduced-motion: reduce` is set.
- **Reset**: toolbar button "Đặt lại góc nhìn" / "Reset view" (icon + visible text on desktop, icon-only with aria-label on phone). It eases back over 500 ms, or jumps instantly under reduced motion. Same behaviour for keyboard `0` / `Home`.
- **Toolbar** (bottom-right inside the viewport, `--c-raised` at 90%, `--r-control`): Reset, Kích thước (labels on/off, `aria-pressed`, default on), Auto-rotate (optional), Full screen.
- On the first visit only, a one-line hint fades after 4 s: "Kéo để xoay, cuộn để phóng to" / "Drag to orbit, scroll to zoom" (touch version: "Một ngón để xoay, hai ngón để phóng to"). Remember dismissal in localStorage (try/catch).

---

## 5. Labels (HTML via `CSS2DRenderer`, so they stay crisp, use the UI font and are selectable)

- **Span dimensions**: a dimension line runs along the deck on the camera-facing side, offset outward by 0.5 × deck width + 10 m at deck level, in `--m3d-dim-line` at 1px, with short perpendicular ticks at each support. Each span's label sits at its midpoint, e.g. "350 m": Be Vietnam Pro 12/600 tabular, `--m3d-label-ink` on a `--m3d-label-bg` chip, `--r-chip`. The main span label is 13/700 and has a 2px `--status` underline.
- **Pylon heights**: a vertical dimension line beside each pylon from the deck to the top (or from water to the top when ref = total), labelled "Cao 120 m" plus a smaller second line "trên mặt cầu" / "above deck" or "tổng" / "total". If all pylons have the same height, label only the one nearest the camera.
- **Declutter**: hide a span label when its projected span is under 56px (under 40px in full screen); hide overlapping labels by priority: main span, then pylon height, then the other spans. Labels fade by opacity and never jump positions.
- **Disclaimer**: when `model3d.confidence === "estimated"`, show a badge pinned top-left in the viewport, "Mô hình gần đúng" / "Approximate model" (`--badge-approx-bg` / `--badge-approx-ink`, 12/600, `--r-chip`, info icon). The badge is a button that toggles a popover with `model3d.notes`.
- A caption is always shown under the viewport (12/400 `--c-steel`): "Mô hình minh họa dựng từ thông số công bố, không phải bản vẽ thiết kế." / "Schematic built from published figures, not a design drawing."

---

## 6. Loading, fallback, accessibility

### Loading
- `three`, `OrbitControls` and `CSS2DRenderer` are loaded by **dynamic `import()` only when the 3D tab is first selected**. On desktop, prefetch them (`<link rel="modulepreload">` injected) on hover or focus of the 3D tab. Pin an exact Three.js version from the importmap / CDN.
- While loading, the viewport shows the **Diagram SVG** (instant, zero cost) dimmed to 40%, with a centred pill "Đang tải mô hình 3D…" / "Loading 3D model…" and an indeterminate 2px `--c-cable` bar at the top edge.
- Keep **one renderer for the whole app**: rebuild only the scene per bridge, dispose geometries and materials on bridge change, and pause rendering when the tab or card is hidden. Cap `setPixelRatio(min(devicePixelRatio, 2))`, `antialias: true`.
- Import failure: "Không tải được mô hình 3D. [Thử lại]" / "Couldn't load the 3D model. [Try again]".

### Static fallback (no WebGL, context lost, or bad data)
Detect before importing (`canvas.getContext('webgl2') || getContext('webgl')`). Fallback content in the 3D view:
1. The Diagram SVG at full viewport size.
2. A notice line: "Trình duyệt không hỗ trợ WebGL nên hiển thị sơ đồ 2D." / "Your browser doesn't support WebGL, so the 2D elevation is shown."
3. The text description (below).

On `webglcontextlost`, switch to the fallback, and offer [Thử lại] to restore it.

### Accessibility
- Viewport wrapper: `role="img"` is wrong for an interactive control, so use `role="application"` with `aria-roledescription="mô hình 3D"`, `tabindex="0"`, `aria-label="Mô hình 3D cầu {name_vi}"` and `aria-describedby` pointing to a visually hidden **generated description**, e.g.:
  "Cầu dây văng 3 nhịp 150 + 350 + 150 m. 2 tháp chữ H, cao 120 m trên mặt cầu. 2 mặt phẳng dây, dạng rẻ quạt, 18 dây mỗi bên. Mặt cầu bê tông rộng 25 m. Trạng thái: đã thông xe. Mô hình gần đúng." (EN equivalent in EN mode; shape names: chữ H / chữ A / chữ Y ngược / kim cương / một trụ / chữ V ngược.) The same text is shown visibly in the static fallback.
- **Keyboard** (when the viewport is focused): ←/→ orbit 15°, ↑/↓ tilt 10° (within the limits), `+`/`-` zoom 15%, Shift + arrows pan, `0`/Home reset, `L` toggles labels, `F` opens full screen, Esc leaves full screen. On focus, a small keys legend shows inside the viewport (bottom-left, 12/400) and hides on blur.
- After a keyboard action, a polite live region announces the state change only for reset and labels ("Đã đặt lại góc nhìn", "Đã ẩn kích thước"), not for every orbit step.
- Every toolbar button has a visible focus ring (`--focus-ring`) and a 44px touch target.
- Status is conveyed by the chip and the description text, not only by the deck, traveller or ghost treatment.

---

## 7. Photo gallery

### 7.1 Viewer + thumbnail strip
- The main image fills the hero viewport (`object-fit: cover` in the card; `contain` in the lightbox), with `loading="lazy"` except the first image, and `decoding="async"`.
- Thumbnail strip below: `--thumb-w` × `--thumb-h`, gap `--thumb-gap`, `--r-media`; the selected thumb gets a `--thumb-ring-sel` `--c-cable` outline. Thumbs are buttons (`aria-label="Ảnh 2 / 4"`, `aria-current` on the active one). The counter "2 / 4" sits right-aligned and tabular.
- Left/Right arrows on the focused viewer and horizontal swipe on touch change the image. Use plain crossfade, `--dur-base`, none under reduced motion.
- Order: licensed images first, in data order, then link-only items. Show at most 4 thumbs; if there are more, the 4th thumb shows "+n" and opens the lightbox.
- Tapping or clicking the main image, or `⤢`, opens the lightbox.

### 7.2 Credit line (under the strip, always for the current item)
`Ảnh: {credit}, {license}. ` followed by the link **Nguồn** / **Source** (to `image.source`, new tab), in 12/400 `--c-steel` with the link in `--c-cable`. Public domain / CC0: "Ảnh: {credit}, phạm vi công cộng" / "public domain". The credit line is also repeated in the lightbox.

### 7.3 Lightbox
Modal `<dialog>` with backdrop `--lightbox-bg` and text `--lightbox-ink`, the same in both themes. Image `contain`, max 92vw × 80vh. Prev/next buttons (48px, vertically centred), close top-right, counter top-left, credit line at the bottom. Keys: ←/→, Esc. Swipe left/right; swipe down closes on touch. Focus is trapped, and on close it returns to the thumb or button that opened the lightbox. Link-only items are skipped in the lightbox sequence.

### 7.4 Link-only card (`license === "unknown"`)
We do not hotlink or display copyrighted images. In their place, both as the main viewport item and as a thumb:
```
┌─────────────────────────────────────┐   background --linkcard-bg (diagonal hatch)
│              ⊥ (48px, --c-line)     │   pylon glyph, outline variant
│   Ảnh có bản quyền của {credit}     │   15/500 --c-ink
│   [ Xem ảnh tại vnexpress.net  ⧉ ]  │   button: --c-raised, 1px --c-line, --c-cable text;
│                                     │   opens image.source in a new tab
└─────────────────────────────────────┘
```
- Thumb: hatch background + small link icon, `aria-label="Ảnh bản quyền, mở tại {hostname} (tab mới)"`.
- Credit line for this item: "© {credit}. Xem tại {hostname}" / "© {credit}. View at {hostname}".
- The Photos tab count includes link-only items, and the default-view rule treats a gallery made only of link-only items as "no displayable image".

### 7.5 Empty state (0 images)
The viewport shows the pylon glyph at 48px in `--c-line` on `--c-mist`, with two lines:
- "Chưa có ảnh cho cầu này." / "No photos of this bridge yet."
- A link "Tìm ảnh trên Wikimedia Commons" / "Find photos on Wikimedia Commons" → `https://commons.wikimedia.org/w/index.php?search={encodeURIComponent(name_vi)}`.

There is no thumbnail strip and no credit line. The tab label reads "Ảnh 0" in `--c-steel`. If the bridge also has a diagram or 3D model, the default view is not Photos (§1), so most people never land on this state.

### 7.6 Broken image
On `error`, swap in the empty-state tile with the line "Không tải được ảnh." / "Couldn't load this photo." The credit line stays visible, and the thumb shows the glyph.

---

## 8. Engineer checklist
- [ ] Hero tablist with Photos / 3D / Diagram, default-view rule, `&view=` in the URL
- [ ] Three.js loaded lazily, one shared renderer, render on demand, dispose on bridge change
- [ ] Geometry rules §2, status treatments §3, theme-reactive `--m3d-*` colors
- [ ] OrbitControls limits, Reset, labels toggle, full-screen dialog, reduced motion
- [ ] CSS2D labels with declutter; "Approximate model" badge + caption
- [ ] WebGL detection + static fallback + generated aria description
- [ ] Gallery: strip, credit line, lightbox, link-only card, empty + broken states
