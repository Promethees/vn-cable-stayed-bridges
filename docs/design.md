# Design spec: Cầu dây văng Việt Nam

Audience: Vietnamese public (commuters, engineering students, enthusiasts) on phones first; English-speaking visitors second.
Job: find a big cable-stayed bridge on the map, read its key specs at a glance, and hand off to Google Maps or OSM for navigation.
Tokens: `docs/design-tokens.css` (import it first; every color/size below refers to a token there). Data: `docs/data-schema.md`.

---

## 1. Visual direction: "structural drawing over the river delta"

- The map is the page. All chrome is small, quiet, and sits on `--c-mist` / `--c-raised` with `--c-ink` text. No hero, no landing copy.
- The one memorable element is the **span elevation diagram** in the bridge card (§6.2): a live, to-scale engineering drawing of the bridge (deck, pylons, cable fans) built from `span_arrangement`. Everything else stays disciplined so this stands out.
- The **pylon glyph** (§5.3) is the brand mark: it appears in the header, in every bridge marker, and in the legend, and it changes form with status (finished deck, broken deck, sketch outline).
- Palette = river ink + steel + cable blue. Status colors (green / amber / red) are the only saturated colors on screen, so they always read as status.
- Sentence case everywhere. No all-caps labels, no eyebrow labels, no arrows appended to link text.

### Base palette (light / dark)
| Token | Light | Dark | Use |
|---|---|---|---|
| `--c-mist` | #F3F5F4 | #121A1E | app/panel surface |
| `--c-raised` | #FFFFFF | #1B262B | controls, marker fill |
| `--c-ink` | #12303D | #E6ECEE | text, province dot |
| `--c-steel` | #56666E | #9DADB4 | secondary text, field labels |
| `--c-line` | #D3D9DA | #2E3D44 | dividers |
| `--c-cable` | #0E6A87 | #62C3E0 | links, focus, interactive accent |

### Status tokens (border color + border style + glyph: three cues)
| Status | Light | Dark | Border style | Glyph | VI / EN label |
|---|---|---|---|---|---|
| completed | #1E8A4C | #4CC27A | solid | pylon, continuous deck | Đã thông xe / Open to traffic |
| under_construction | #E8A600 + 1px outline #5C4300 | #F5C02E | dashed | pylon, deck with gap | Đang xây dựng / Under construction |
| planned | #C4302B | #FF6B5E | dotted | pylon outline only (sketch) | Quy hoạch / Planned |

Amber on light map tiles is below 3:1, so on light theme every amber ring gets a 1px `--status-construction-edge` outline on both sides (implement as `box-shadow: 0 0 0 1px edge, inset 0 0 0 1px edge` around the ring). Amber **text** on light uses `--status-construction-text`, never `--status-construction`.

Apply via the helper classes `.status-completed | .status-under_construction | .status-planned`, which set `--status`, `--status-tint`, `--status-text`, `--status-border-style`.

---

## 2. Typography

| Role | Font | Size / weight | Notes |
|---|---|---|---|
| UI, body, field values | Be Vietnam Pro | 15/1.5, 400–600 | designed for Vietnamese diacritics |
| Bridge name, main-span figure, province dot numerals | Barlow Condensed | 28 / 600 (name), 40 / 600 (span), 16 / 600 (dot) | condensed fits long names (e.g. "Cầu Rạch Miễu 2") in 360px; Vietnamese subset |
| Field labels | Be Vietnam Pro | 13 / 500, `--c-steel` | sentence case |
| Credits, map plate 2nd line | Be Vietnam Pro | 12 / 400 | |

- Google Fonts URL in tokens file includes `subset=vietnamese` and `display=swap`.
- All numbers use `font-variant-numeric: tabular-nums` in the spec table.
- Units are set with a thin no-break space: `350 m`, `1 535 m` (Vietnamese grouping uses `.`: format with `Intl.NumberFormat('vi-VN')` → `1.535 m`; EN → `1,535 m`).
- Max line length in the card: ~60ch (panel width does this naturally).

---

## 3. Language: Vietnamese primary with a VI / EN toggle

Choice: **toggle, default VI**, not side-by-side bilingual labels.
Why: the card on a 360px phone already holds ~12 fields; doubling every label costs a third of the sheet height and halves scannability. A toggle keeps one clean language at a time.

- Toggle: segmented control `VI | EN` in the header, `aria-pressed` on each half. Persist in `localStorage` (try/catch) and reflect as `?lang=en` in the URL (omit for VI). Set `<html lang>`.
- `name_vi` is always the title. In EN mode show `name_en` as the subtitle if present (the Vietnamese name stays primary because it is what road signs and Google Maps show).
- Proper nouns (provinces, rivers, roads) stay in Vietnamese in both modes.
- All UI strings live in one dictionary `{ vi: {...}, en: {...} }` keyed by field key (see §6.3).

---

## 4. Map

### 4.1 Frame
- Leaflet. Initial view: `fitBounds([[8.2, 102.1], [23.4, 116.6]])` (mainland + Hoàng Sa + Trường Sa), padding 16px.
- `maxBounds: [[5.0, 99.5], [24.8, 119.0]]`, `maxBoundsViscosity: 1.0`, `minZoom` = zoom after initial fit (compute, then lock), `maxZoom: 18`, `zoomSnap: 0.25` (phones need fractional zoom to fit the S-shape).
- Attribution control bottom-right, always visible (OSM, CARTO, Esri as applicable).

### 4.2 Base layers (switch, top-right, `L.control.layers` restyled)
| Label VI / EN | Tiles | Notes |
|---|---|---|
| Bản đồ OSM / OSM standard (default) | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | required base |
| Bản đồ sáng / Light | CARTO `light_all` (light theme) or `dark_all` (dark theme) | follows theme |
| Ảnh vệ tinh / Satellite | Esri `World_Imagery` | switch label color to light-halo style while active |

Remember the choice in `localStorage`.

### 4.3 Sovereignty labels overlay (required)
Raster tiles may label the archipelagos with other names; we cannot remove text from tiles, so we place our own **opaque label plates** in a custom pane (`map.createPane('vnLabels')`, z-index `--z-map-labels`, `pointer-events: none`) that cover that area at country zoom.

| id | Anchor (lat, lng) | VI line 1 / line 2 | EN line 1 / line 2 |
|---|---|---|---|
| hoang-sa | 16.5, 112.0 | Quần đảo Hoàng Sa / (Việt Nam) | Hoang Sa Archipelago / (Viet Nam) |
| truong-sa | 9.8, 114.3 | Quần đảo Trường Sa / (Việt Nam) | Truong Sa Archipelago / (Viet Nam) |
| bien-dong | 13.2, 112.8 | Biển Đông | East Sea (Biển Đông) |

- Plate: `L.marker` with `divIcon`, `--map-plate-bg`, 1px `--map-plate-border`, radius `--r-control`, padding 4px 8px, line 1 Be Vietnam Pro 13/600 italic, line 2 12/400. Biển Đông: no plate, italic 15/500, letter-spacing 0.04em, `--c-cable` at 70% opacity with halo.
- Also draw a dotted ring (`L.circle`-like `L.polygon`, stroke `--c-ink` 1px, dash `2 4`, no fill) around each archipelago's extent so they read as features even on satellite:
  Hoàng Sa ≈ bounds [[15.7, 111.1], [17.2, 112.9]]; Trường Sa ≈ [[7.5, 111.5], [11.6, 116.0]].
- Visible at all zooms ≤ 9. The engineer must visually check the OSM default tile at zooms 5–8 and nudge plate anchors so they sit on top of any tile label there.
- Labels switch with the VI/EN toggle.

---

## 5. Markers

### 5.1 Zoom levels
| State | Shown | Trigger |
|---|---|---|
| Country (`zoom < 8` and no province selected) | province dots only | initial / reset |
| Province (province selected, or `zoom ≥ 8`) | bridge markers for all visible bridges | click province dot, or user zooms in |
| Bridge | bridge markers + selected marker + card open | click marker / deep link |

Zooming manually below 8 returns to province dots (and clears province selection).

### 5.2 Province dot
- Position: mean lat/lng of that province's (filtered) bridges. Province key = `province` field.
- Diameter: `clamp(32, 28 + 6·√count, 48)` px.
- Fill `--dot-fill`, numeral `--dot-numeral` (Barlow Condensed 16/600, centered) = filtered bridge count.
- Ring: 4px **segmented status ring** = `conic-gradient` with each status's share of that province's bridges (order: completed, under construction, planned), with 1px `--c-raised` gaps between segments. So a province with 2 open + 1 building shows a 2/3 green, 1/3 amber ring.
- Province name label: right of the dot, Be Vietnam Pro 12/500, `--map-label-ink` with 2px `--map-label-halo` text-shadow. Shown at zoom ≥ 6.5 (hide below to avoid clutter in the north).
- Hover / focus: scale 1.08, `--shadow-marker`, label turns `--c-cable`, tooltip `"{n} cầu — nhấn để phóng to"` / `"{n} bridges — click to zoom in"`.
- Click / Enter: `flyToBounds(provinceBridgesBounds, {padding: 64, maxZoom: 12, duration: --dur-map})`. If the province has **one** bridge: fly to it (zoom 13) and open its card directly.

### 5.3 Pylon glyph (16×16 SVG, `stroke="currentColor"`, stroke-width 1.6, round caps)
```
completed            under construction        planned
   |                     |                      ┆   (all strokes dashed 1.5 2,
  /|\                   /|\                    ╱┆╲    opacity .85)
 / | \                 / | \                  ╱ ┆ ╲
──────────            ───  ───               ┄┄┄┄┄┄┄
```
Paths: pylon `M8 2V14`; cables `M8 3L2 11 M8 3L4.5 11 M8 3L11.5 11 M8 3L14 11`; deck `M1 11H15` (completed), `M1 11H6 M10 11H15` (construction gap), dashed deck (planned).

### 5.4 Bridge marker
- `divIcon`, 30px circle, fill `--marker-fill`, 3px ring `border: 3px var(--status-border-style) var(--status)`, glyph 16px `--marker-glyph` centered, `--shadow-marker`. Invisible hit area padded to 44px.
- Hover / focus: scale 1.12 over `--dur-fast`, name tooltip (Be Vietnam Pro 13/600 + main span, e.g. "Cầu Mỹ Thuận 2, 350 m").
- Selected: 40px, ring 4px, plus outer halo `0 0 0 6px color-mix(in srgb, var(--status) 30%, transparent)`, z-index top, persistent name label to the right.
- Zoom ≥ 12: show persistent name labels for all markers (12/500 with halo).
- Overlapping markers (rare, e.g. twin bridges): offset by 18px horizontally at zoom < 13; no clustering library needed.

---

## 6. Bridge card

> Update 2026-11-25: the card's media (photos, 3D model, elevation diagram) now live in one tabbed hero area, specified in `docs/design-3d.md`. That file replaces the diagram placement in §6.1 and the gallery in §6.5. The drawing rules in §6.2 still apply to the "Sơ đồ" tab.

Desktop (≥ 768px): right side panel, `--panel-w` 400px, full height under the header, slides in (`--dur-base`). Map keeps its full size; when flying to a bridge use padding-right = panel width so the marker isn't hidden.
Phone (< 768px): bottom sheet with three snaps: peek `--sheet-peek` (name, status, main span), half `--sheet-half`, full `--sheet-full`. Drag handle 36×4px; tap handle cycles snaps. When flying to a bridge use padding-bottom = current sheet height.

Card border: 4px **left** border (desktop panel) / 4px **top** border (sheet) in `--status` with `--status-border-style`. The status chip repeats the cue.

### 6.1 Wireframe (desktop panel; the sheet is the same content stacked)
```
┌─────────────────────────────────────────┐▲ 4px status border (left on desktop)
│ [‹ Tỉnh Vĩnh Long]                  [✕] │  back-to-province / close
│                                         │
│ Cầu Mỹ Thuận 2                          │  Barlow Condensed 28/600
│ My Thuan 2 Bridge            (EN only)  │  steel 15/400
│ ( ⊥ Đã thông xe )  Sông Tiền, Vĩnh Long │  status chip (glyph+label) + crosses, province
│                                         │
│ 350 m                                   │  Barlow Condensed 40/600
│ nhịp chính                              │  steel 13/500
│ ┌─────────────────────────────────────┐ │
│ │      /|\               /|\          │ │  SPAN ELEVATION DIAGRAM (§6.2)
│ │ ____/_|_\_____________/_|_\_____    │ │
│ │  150     |     350     |    150     │ │
│ └─────────────────────────────────────┘ │
│ [ Mở Google Maps ] [ Mở OpenStreetMap ] │  two equal buttons, icon + text
│ ─────────────────────────────────────── │
│ Tuyến đường        (CT.01) (QL1A)       │  road chips
│ Khởi công          2020                 │
│ Thông xe           2023                 │  "Dự kiến thông xe" if not completed
│ Chiều dài          1.906 m              │
│ Bề rộng            24,5 m               │
│ Số nhịp dây văng   2                    │  only when > 1
│ Sơ đồ nhịp         150 + 350 + 150 m    │
│ …extensible rows (pylons, lanes, …)     │
│ ─────────────────────────────────────── │
│ Hình ảnh                                │
│ [ img ][ img ][ im…  ← scroll-snap →    │  16:10, 240px wide, radius --r-media
│ Ảnh: Nguyễn Văn A, CC BY-SA 4.0         │  credit under each image, links to source
│ ─────────────────────────────────────── │
│ Nguồn                                   │
│ 1. vnexpress.net                        │  ordered list, hostname as link text
│ 2. mt.gov.vn                            │
│ ⓘ Một số số liệu đang được kiểm chứng.  │  only if confidence = needs_check
│ ▸ Ghi chú                               │  <details>, only if notes
└─────────────────────────────────────────┘
```

### 6.2 Span elevation diagram (signature element)
- Inline SVG, width 100%, height 84px, `viewBox` computed from total of spans; `preserveAspectRatio="none"` only on x for the deck; text not scaled (place labels in HTML or use `vector-effect` + fixed font size).
- Parse `span_arrangement`: extract numbers (`/\d+(?:[.,]\d+)?/g`), treat comma as decimal; `×` / `x` multiplier (`"3×100"`) expands. If fewer than 2 numbers parse, hide diagram and show only the text row.
- Main spans = the `cable_stayed_spans ?? 1` largest spans (must be contiguous; if not, use the single largest). Pylons stand at both ends of each main span (shared pylon between adjacent main spans).
- Draw: deck line 2px `--c-ink`; piers as 1px ticks; pylons 2px `--c-ink`, height = 0.28 × main span length (clamped to fit); 4–6 cables per side per pylon, 1px `--c-steel`, fanning to the deck across half of each adjacent span. Main span deck segment stroked 3px in `--status` with `--status-border-style` dash pattern. Span lengths labelled under the deck (Be Vietnam Pro 12, tabular).
- Under construction: draw cables only on 60% of their length (visual hint); planned: whole drawing at 60% opacity, dashed.
- `role="img"`, `aria-label="Sơ đồ nhịp: 150 + 350 + 150 m, nhịp chính 350 m"`.

### 6.3 Field registry (extensibility)
Render the spec table from an ordered config array; adding a field = one entry + two strings:
```js
{ key: 'roads', label: {vi:'Tuyến đường', en:'Road(s)'}, format: 'roadChips', showIf: v => v?.length }
{ key: 'construction_start', label: {vi:'Khởi công', en:'Construction began'} }
{ key: 'opened', label: b => b.status==='completed' ? {vi:'Thông xe',en:'Opened'} : {vi:'Dự kiến thông xe',en:'Expected opening'} }
{ key: 'total_length_m', label:{vi:'Chiều dài',en:'Length'}, format:'meters' }
{ key: 'width_m', label:{vi:'Bề rộng',en:'Width'}, format:'meters' }
{ key: 'cable_stayed_spans', label:{vi:'Số nhịp dây văng',en:'Cable-stayed spans'}, showIf: v => v > 1 }
{ key: 'span_arrangement', label:{vi:'Sơ đồ nhịp',en:'Span arrangement'} }
// optional, already in schema: lanes (Số làn xe), pylons (Tháp cầu), investor (Chủ đầu tư), cost (Tổng mức đầu tư)
```
Default `showIf`: value is not null/empty → the row is hidden, never shown as "—". `main_span_m` is the headline figure, not a table row.
Table = `<dl>` with a 2-column grid (label 40% `--c-steel` 13/500, value 15/400 tabular). Road chips: `--r-chip`, 1px `--c-line`, 12/600.

### 6.4 Navigation links
- Google Maps: `https://www.google.com/maps/search/?api=1&query={lat},{lng}`
- OpenStreetMap: `https://www.openstreetmap.org/?mlat={lat}&mlon={lng}#map=16/{lat}/{lng}`
- `target="_blank" rel="noopener"`, label "Mở Google Maps" / "Open in Google Maps", "Mở OpenStreetMap" / "Open in OpenStreetMap". Buttons: height 44px, `--r-control`, 1px `--c-line`, text `--c-cable` 14/600, small external-link icon after text with `aria-hidden`; visually-hidden "(mở tab mới)" / "(opens in new tab)".

### 6.5 Gallery
- Horizontal `scroll-snap-type: x mandatory`, images 240×150 (16:10, `object-fit: cover`), `loading="lazy"`, `alt="{name_vi}, ảnh {n}"`.
- Credit caption under each: "Ảnh: {credit}, {license}" linked to `source`. If `license === "unknown"`: "Ảnh: {credit} (bản quyền thuộc tác giả)".
- Tap opens a lightbox (`<dialog>`), arrow keys / swipe to move, Esc closes, credit always visible in lightbox.
- No images: one placeholder tile with the pylon glyph at 48px in `--c-line` and "Chưa có ảnh" / "No photos yet".

---

## 7. Chrome layout

```
DESKTOP                                         PHONE (< 768px)
┌──────────────────────────────────────────┐    ┌──────────────────────┐
│[⊥ Cầu dây văng Việt Nam]    [VI|EN][≡lớp]│    │[⊥ Cầu dây văng VN][VI|EN][≡]│
│[‹ Toàn quốc] Việt Nam › Vĩnh Long        │    │(✓Đã thông xe)(⋯Đang xây)(⋮QH)│ ← chip row, h-scroll
│                                ┌────────┐│    │[‹ Toàn quốc]          │
│                                │ PANEL  ││    │                      │
│           MAP                  │ 400px  ││    │        MAP           │
│                                │        ││    │                      │
│┌───────────────────┐  [+][-]   │        ││    │ [+][-]               │
││Trạng thái         │           │        ││    ├──────────────────────┤
││[✓] ⊥ Đã thông xe 6│           │        ││    │ ▔▔  bottom sheet     │
││[✓] ⊥ Đang xây  3  │           └────────┘│    │ Cầu Mỹ Thuận 2  350 m│
││[✓] ⊥ Quy hoạch 2  │      © OSM attribution│    └──────────────────────┘
│└───────────────────┘                     │
└──────────────────────────────────────────┘
```
- **Header** (top-left, floating, `--c-raised`, `--shadow-control`, `--r-control`): pylon glyph + "Cầu dây văng Việt Nam" (Be Vietnam Pro 15/600); second line is the breadcrumb `Việt Nam › {Tỉnh}` (13/500) shown only when a province/bridge is active.
- **Back / reset**: "‹ Toàn quốc" / "‹ All of Vietnam" button (chevron icon, not text arrow) under the header whenever not at country view. Inside the card, "‹ {Tỉnh}" returns to the province view.
- **Legend = filter** (desktop bottom-left; phone: chip row under header). Each row is a toggle button (`aria-pressed`) showing the marker sample (ring style + glyph), label, and count of bridges in that status. All on by default. Turning off a status hides its markers and recomputes province dot counts/rings. Turning off the last active one is allowed and triggers the empty state. Title "Trạng thái" / "Status"; footnote 12/400 steel: "Chỉ gồm cầu dây văng có nhịp chính trên 150 m" / "Cable-stayed bridges with a main span over 150 m".
- Zoom controls bottom-right above attribution (desktop), bottom-left above sheet peek (phone). Layer switch top-right as an icon button opening a small radio list.

---

## 8. Interaction flow & URL

```
Country view ──click province dot──▶ Province view ──click marker──▶ Bridge view (card open)
     ▲   (1 bridge in province: straight to Bridge view)  │                 │
     └──── "‹ Toàn quốc" / zoom < 8 / Esc at province ────┘◀── "‹ Tỉnh" / ✕ / Esc
```
- URL is the state: `/` country, `/?province={slug}` province, `/?bridge={id}` bridge (province implied), optional `&lang=en`. Province slug = slugified `province` without diacritics (e.g. `vinh-long`).
- Use `history.pushState` on each view change; handle `popstate` so the browser back button walks back through views.
- Deep link load `/?bridge=id`: show map at initial fit for ~0 ms, then fly directly to the bridge (zoom 14) once data loads and open the card. Unknown id: country view + toast "Không tìm thấy cầu "{id}". Đang hiển thị toàn quốc." / "No bridge with id "{id}". Showing all of Vietnam."
- Filter state is not stored in the URL (keeps shared links simple). Deep-linked bridge stays visible even if its status is filtered off (selected marker always rendered).
- Map clicks on empty area close the card on desktop; on phone they collapse the sheet to peek first, then close.
- Reduced motion: `setView`/`fitBounds` with `animate: false` instead of `flyTo`.

---

## 9. Loading, empty, error states
| State | Display | Copy (VI / EN) |
|---|---|---|
| Loading data | toast-pill top-center, pylon glyph with a slow deck-draw animation (static under reduced motion); markers absent | Đang tải dữ liệu cầu… / Loading bridges… |
| Data load failed | pill becomes error style (`--status-planned` left bar) + button | Không tải được dữ liệu cầu. [Thử lại] / Couldn't load bridge data. [Try again] |
| Filter excludes all | pill top-center + button that re-enables all statuses | Không có cầu nào ở trạng thái đã chọn. [Hiện tất cả] / No bridges match the selected status. [Show all] |
| Province has no bridges after filter | its dot disappears (no zero-dots) | — |
| Image fails to load | replace with placeholder tile (§6.5), keep credit | — |
| Missing optional fields | row hidden | — |
| Tile errors | Leaflet default (blank tiles); no message | — |

---

## 10. Accessibility
- **Color is never the only cue**: status = color + border style (solid / dashed / dotted) + glyph variant + text label in chip, legend, tooltip, and aria-label.
- Contrast: text ≥ 4.5:1 on its surface; status rings ≥ 3:1 against map (amber uses the dark edge outline on light).
- **Keyboard**: markers and dots are `divIcon`s with `role="button"`, `tabindex="0"`, Enter/Space activate. Tab order: header → filter → province dots sorted north→south (by lat desc) → zoom. In province view, bridge markers north→south. Esc steps back one level (close card → province → country). Focus moves to the card's `<h2>` on open and returns to the triggering marker on close.
- Skip link (first focusable, visible on focus): "Bỏ qua bản đồ, xem danh sách cầu" / "Skip map, view bridge list" → opens the panel in list mode: bridges grouped by province (h3), each a button with status chip + main span. This is the full non-map alternative.
- aria-labels: province dot `"{Tỉnh}: {n} cầu ({a} đã thông xe, {b} đang xây dựng, {c} quy hoạch)"`; bridge marker `"{name_vi}, {status label}, nhịp chính {span} m"`.
- Card: desktop panel `role="complementary"` with `aria-labelledby` the name; phone sheet `role="dialog"` `aria-modal="false"`. Map container `aria-label="Bản đồ cầu dây văng Việt Nam"`. A polite live region announces view changes ("Đang xem tỉnh Vĩnh Long, 3 cầu").
- Focus ring: `--focus-ring` on everything focusable, including markers (applied to the circle, not the 44px hit box).
- Touch targets ≥ 44px. Respect `prefers-reduced-motion` (tokens zero out durations; map animations off).
- `<html lang>` follows the toggle.
