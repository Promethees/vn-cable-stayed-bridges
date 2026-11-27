# 3D model review: round 1 brief (researcher → engineer), 2026-11-26

Scope: all 36 bridges in `data/bridges.json`. Baseline renders (front / side / three_quarter) are in the session scratchpad (`views/`). Contact sheets were compared against sources and against prior passes (`research/shape-review.md`, `research/compare/`). Shapes that pass 2 verified against photos are **not** re-opened unless a published number contradicts them.

Confidence tags: **[C]** confirmed by a cited source · **[I]** inferred from a source (arithmetic or wording) · **[E]** estimated (photo or render proportions, or no source).

Where to edit: `research/shapes/<id>.json` → `model3d` is authoritative for every bridge (all 36 have `pass2: true`). Either edit those files, or (preferred, see §0.1) add a single `REVIEW_R1` override dict in `scripts/gen_bridges.py` that is applied **last** and unconditionally. "Scale custom y by f" means: multiply the y of every `pylon_custom.legs[*].centerline` point with y > 0, every positive `crossbeams_y_m` entry, every `anchor_zone.y_from_m/y_to_m` and the y of any strut endpoint above deck by f. Leave below-deck geometry alone.

---

## 0. Data-pipeline bugs (fix first; they affect many bridges)

### 0.1 PHASE6 overrides are silently dropped for every bridge — P0
`gen_bridges.py` applies `PHASE6` only when `not SHAPES[bid].get("pass2")`, and **all 36 shape files have `pass2: true`**. As a result, these reviewed values are missing from `data/bridges.json` (verified by dumping the file):

| Bridge | Lost value(s) |
|---|---|
| cau-bai-chay | `stay_colour: "yellow"`, `deck_crest_m: 8.0` |
| cau-my-thuan | `deck_crest_m: 6.0` |
| cau-bach-dang | `stay_colour: "orange"` |
| cau-rach-mieu | `stay_colour: "orange"` |
| cau-tran-thi-ly | `pylon_colour: "white"`, `stay_colour: "white"`, `back_stay_colour: "red"` |
| cau-cua-hoi | `pylon_colour: "white"`, `stay_colour: "red"` |
| cau-ben-rung | `pylon_colour: "white"`, `stay_colour: "red"` |
| cau-thuan-an | `pylon_colour: "white"`, `stay_colour: "red"` |
| cau-rach-mieu-2 | `auxiliary_piers_m: [60, 460]` (no aux piers render today) |
| cau-may-chai | nothing lost: the pass-2 shape file has its own refined legs and struts. **Do not** re-apply the PHASE6 `legs_override` and `struts` (they are older). |

Fix: apply PHASE6 (or the new `REVIEW_R1`) after SHAPES for every bridge. Keep the `pass2` guard only for keys the shape file itself sets. Add a generator assert listing the expected colour/crest/aux keys per id, so a regression fails the build.

### 0.2 Cần Thơ auxiliary piers wrong — P0
`model3d.auxiliary_piers_m = [40, 80, 850, 890]` (from the shape file). The unit is 40+40+150+550+150+40+40 = 1010 m, so the far-side aux piers are at **930 and 970**. 850 and 890 fall inside the 150 m side span. The side render shows 2 piers on the left and 4 on the right. Set `[40, 80, 930, 970]` (these coincide with interior supports, which already render, so `auxiliary_piers_m` may also be omitted).

### 0.3 Non-schema keys in model3d — P2
Remove or convert these:
- `colour` (bai-chay, cao-lanh, nhat-tan, rach-mieu, bach-dang): map it into `pylon_colour`, `stay_colour` and `deck_colour`.
- `image_issue` (bach-dang): already handled by DROP_IMAGES, so delete it.
- `auxiliary_piers_m_from_end` (can-tho, rach-mieu-2): convert to absolute `auxiliary_piers_m`.

Keep the text in `notes`.

---

## 1. Engine capability gaps (spec for `src/lib/bridge3d.ts`, `src/three/engine.ts`, `src/types.ts`, `docs/data-schema.md`)

Ordered by impact.

### G1. `deck_elevation_m` (optional number) — P1
Today `E = max(clamp(0.1·main, 12, 45), nav_h + deckDepth + 1)`. This is wrong when the real deck is much lower or higher than the heuristic, and it shifts the total pylon height of every custom pylon (tip = custom y + E).
- Spec: if `m.deck_elevation_m` is given, `E = max(m.deck_elevation_m, nav_h ? nav_h + deckDepth + 1 : 0)`. Add the warning `deck_elevation_m below navigation clearance` when it gets raised.
- Needed by:
  - cau-thuan-an: 40 m. [C] Tiền Phong: pylon 32 m above deck, 72 m above water.
  - cau-tu-lien: 25 m [E]. With 45 m the 170 m custom tip makes 215 m total vs 185 m published.
  - cau-hoa-son: 40 m [E] (reservoir crossing, no navigation figure). Low priority.

### G2. Harp stays must be parallel — P1
Harp anchors are currently `y = yd + H·(0.3 + 0.67t)` with deck x at `r·(0.08 + 0.92t)`. The slope varies, so the "harp" renders as a loose semi-fan.
- Spec: for `harp`, keep the deck stations and set the pylon anchor to `y = yd + H·hi·(f0 + (f1 − f0)t)/f1`, clamped to ≥ `yd + 0.15H`. That makes every stay the same slope. For custom pylons, map that y into the anchor zone (`arcAtY`) instead of the linear t.
- Needed by: cau-may-chai (now harp, see §2), cau-kien, cau-ben-rung, cau-cua-hoi, cau-thuan-an, cau-phuoc-an.
- Acceptance: in the side view, adjacent stays are parallel within ±2°.

### G3. Different cable planes on the main and back side (`back_stay_planes?: 1 | 2`) — P1
Trần Thị Lý: the main-span stays are one central plane anchored in the median; the back stays are split into two planes (VECC / CafeF "3 mặt phẳng dây": "the west-side stays are twisted and split into two branches").
- Spec: when `cable_planes = 1` and `back_stay_planes = 2`, back-side cables get `plane ∈ {0, 1}` with deck anchors at z = ±hw. The pylon anchor stays at the mast (z = ±0.5·leg width).
- Needed by: cau-tran-thi-ly only.

### G4. Per-pylon height for custom pylons — P2
Custom pylons share one geometry, so `pylon_heights_m` cannot differ between pylons.
- Spec: if the `pylon_heights_m` values differ and `pylon_custom` is set, scale each pylon's local y > 0 by `h_i / max(h)`. Apply the same scale to crossbeams and anchor zones.
- Needed by: cau-bach-dang (centre 99.74 m, sides 94.5 m), cau-thuong-cat (centre taller).

### G5. Truss / double-deck girder (`deck_section?: "box" | "truss"`, `deck_depth_m?: number`) — P2
- Spec: `truss` draws the deck as top and bottom chord slabs (each about 0.6 m thick) at ±hw, `deck_depth_m` apart (default 12 m). Between them goes a Warren web: vertical and diagonal Member boxes at roughly `deck_depth_m` spacing on both faces. Stays anchor at the top-chord edges. The bottom deck is visible in the front view.
- Needed by:
  - cau-can-tho-2: road on top, two rail tracks below; depth about 14 m [E]. Sources: [baoxaydung](https://baoxaydung.vn/cau-can-tho-2-du-kien-khoi-cong-nam-2027-thiet-ke-day-vang-ket-hop-duong-sat-192250914110904007.htm), [VnExpress](https://vnexpress.net/cau-can-tho-2-duoc-de-xuat-xay-hai-tang-5125832.html).
  - cau-duong-sat-can-gio: steel-truss girder ("dây văng dầm giàn thép") [C], depth about 10 m [E]. Source: [nguoiquansat](https://nguoiquansat.vn/tuyen-duong-sat-noi-den-sieu-do-thi-ty-usd-cua-vingroup-dang-xay-dung-cau-vuot-song-dai-gan-1-000m-323288.html).

### G6. Light stay colours vanish against the sky — P2
`cau-can-tho` has `stay_colour: "white"` and its side view shows **no stays at all**. Máy Chai's white stays are also faint.
- Spec: in `engine.ts` `lineMat`, clamp the stay line lightness to ≤ 0.70 (HSL) in light theme. In dark theme, clamp it to ≥ 0.45.
- Acceptance: stays visible in the side view of every bridge.

### G7. (no engine change) Short A / single pylons on extradosed decks
The built-in `A` shape runs the legs from the water to the apex. With a 32 m pylon this makes the huge splayed "tent" seen at Thuận An. Express these pylons with `pylon_custom` legs that start on the pier head at deck level (see §2 Thuận An).

---

## 2. Per-bridge findings

Each row gives the current value, the expected value, the confidence and the source. The P column is priority: P0 is wrong or broken, P1 is a visible discrepancy with a published number, P2 is polish.

### cau-can-tho — Cần Thơ (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P0 | auxiliary_piers_m | [40,80,850,890] | [40,80,930,970] or omit | [I] arithmetic of spans_m |
| P1 | cables_per_side | derived 23 | **27** | [I] 216 stays = 2 pylons × 2 planes × 2 sides × 27 ([nguoiquansat](https://nguoiquansat.vn/sieu-cau-noi-2-vung-dbscl-ket-thuc-su-menh-nhung-ben-pha-hon-100-nam-tuoi-thong-xe-15-nam-van-nam-giu-ky-luc-dong-nam-a-top-the-gioi-194312.html)) |
| P1 | custom pylon tip | 135 above deck (total 180) | total 175.3 → scale custom y by **0.965** (tip 130.3) | [C] Wikipedia EN height 175.3 m |
| P2 | stay_colour | "white" (invisible) | keep "white" once G6 lands; otherwise use "#d8dcdf" | — |

Diamond foot, merge height and head were verified in pass 2; no change.

### cau-vam-cong — Vàm Cống (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P1 | pylon_heights_m | [140,140] | **[150,150]** total | [C] vi.wikipedia "Trụ tháp cầu cao 150 m"; CafeF quotes the project director at 150 m (other press: 143.9 / 149.3 m) |
| P1 | custom tip | 100 (total 145) | scale custom y by **1.05** (tip 105) | [I] |
| P2 | spans_m | [210,450,210] | keep. 870 m unit [C]; the split is unpublished [E] | [hanoimoi](https://hanoimoi.vn/can-canh-cau-vam-cong-noi-dong-thap-va-can-tho-chuan-bi-thong-xe-542646.html) |

Deck is steel girder in the main span [C]; `composite` is acceptable.

### cau-bai-chay — Bãi Cháy (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P0 | stay_colour | missing | "yellow" | §0.1 |
| P0 | deck_crest_m | missing | **8.0** | §0.1 (pass-2 photo estimate) |
| P1 | pylon height | custom tip 100 above deck | **91.5 m above deck**: scale custom y by 0.915; anchor zone becomes 50–89 | [C] IABSE paper / ResearchGate abstract 91.5 m above deck; Structurae 90 m. The 150 m figure is from foundation or water level. |
| P1 | pylon_heights_m / ref | [150,150] total | **[91.5, 91.5] above_deck** | same |
| P1 | cables_per_side | derived | **28** | [C] 28 stays per side per pylon (ResearchGate); 112 total (Freyssinet) |
| P1 | nav_clearance | none | height_m **50** | [E] widely quoted 50 m; add with reference "press" |
| P2 | spans_m | [129,435,129] | keep. Full layout 86+129+435+129+87; the 129 m spans are stayed [C] | Wikipedia list |

### cau-phu-my — Phú Mỹ (completed)
| P | Field | Current | Expected | Conf |
|---|---|---|---|---|
| P2 | custom tip | 100 (total 149.2) | scale custom y by **0.96** (total 145) | [C] 145 m (476 ft) Wikipedia infobox. The 162.5 m in the tallest-bridges list conflicts; keep 145. |
| — | spans 162.5+380+162.5 | — | keep. The 705 m unit is confirmed ([bridgeweb](https://www.bridgeweb.com/Saigon-sight/1833)); the split is [I] | |

### cau-binh-khanh — Bình Khánh (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P1 | spans_m | [194,375,194] | **[187.25, 375, 187.25]** | [C] [vi.wikipedia](https://vi.wikipedia.org/wiki/C%E1%BA%A7u_B%C3%ACnh_Kh%C3%A1nh) |
| P1 | pylon_heights_m | [135,135] | **[155,155]** (the custom tip already gives about 157, so the geometry is OK) | [C] vi.wikipedia; [VnExpress](https://vnexpress.net/thiet-ke-dac-biet-cua-hai-cau-day-vang-cao-nhat-viet-nam-5092605.html) |
| P1 | cables_per_side | derived | **17** | [C] "17 đôi cáp văng" per pylon, 2 fan planes, saddle anchorage (VnExpress, vi.wiki) |
| P2 | deck_type | none | "concrete" | [I] cast-in-situ cantilever with form travellers |

### cau-phuoc-khanh — Phước Khánh (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P1 | custom tip | 110 (total 168.5) | total **155**: scale custom y by **0.877** (tip ≈ 96.5; top beam 104 → 91) | [C] [vietnamnet](https://vietnamnet.vn/cau-day-vang-cao-nhat-viet-nam-tren-tuyen-ben-luc-long-thanh-sap-hop-long-2517148.html), VnExpress |
| P1 | cables_per_side | derived | **14** | [C] 56 bundles, 28 per pylon, saddle anchored |
| P2 | deck_type | none | "concrete" | [I] |

### cau-my-thuan — Mỹ Thuận (completed)
| P | Field | Current | Expected | Conf |
|---|---|---|---|---|
| P0 | deck_crest_m | missing | **6.0** | §0.1 |
| — | pylon 120 m, cps 16 | — | keep (Yootek says 123 m; within tolerance) | [C] |

### cau-my-thuan-2 — Mỹ Thuận 2 (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P1 | cables_per_side | derived | **16** | [C] 128 stay bundles ([VnExpress](https://vnexpress.net/cau-noi-cao-toc-my-thuan-can-tho-truoc-2-thang-thong-xe-4670076.html)) |
| P2 | pylon_heights_m | [125,125] | **[125.5,125.5]**; scale custom y by 0.967 (tip 84) | [C] Tiền Phong "đỉnh cao 125,5 m" above sea level |

### cau-cao-lanh — Cao Lãnh (completed)
No change. 150+350+150, 123.4 m, H and 24.5 m are all [C] (vi/en Wikipedia). Custom total 125.4 is within tolerance.

### cau-nhat-tan — Nhật Tân (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P1 | cables_per_side | derived | **11** | [C] 220 stays / 5 pylons = 44 per pylon = 2 sides × 2 planes × 11; 12 m deck spacing ([JSCE paper](https://www.jsce.or.jp/committee/concrete/e/newsletter/newsletter43/Newsletter43_files/Tanaka%20award/1.pdf), Tokyo Rope) |
| P2 | pylon_heights_m | 110 | 111 (from foundation) | [C] JSCE "max 111 m" |

The A / diamond form was verified in pass 2. Deck width 33.2 m (Tokyo Rope) vs 35.6 m (ResearchGate): keep 33.2.

### cau-rach-mieu — Rạch Miễu (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P0 | stay_colour | missing | "orange" | §0.1 |
| P1 | deck_width_m | 12 | **15** | [C] [vi.wikipedia](https://vi.wikipedia.org/wiki/C%E1%BA%A7u_R%E1%BA%A1ch_Mi%E1%BB%85u) (2 car lanes + 2 motorbike lanes + walkways). Move the custom legs at deck level from z = ±9 to **±9.5** so they stay outside the deck edge. |
| P2 | pylon_heights_m | 110 | **117** (the custom total 115.8 is OK) | [C] vi.wikipedia |

### cau-rach-mieu-2 — Rạch Miễu 2 (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P0 | auxiliary_piers_m | missing | **[60, 460]** | §0.1 (pass-2 photo) |
| P2 | pylon_heights_m | 113 | **116.5** (geometry OK) | [C] [Trung Nam E&C](https://trungnamec.com.vn/cau-rach-mieu-2/) |
| P2 | nav_clearance | 110 m wide, 37.5 m | contractor: 220 m × 30 m, 37.5 m at mid-channel. Keep 37.5; set `width_m: 220` and note it | [C] |

### cau-binh — Bính (completed)
No change. 100+260+100 [C] (full layout 50+6×60+100+260+100+6×60+50) and 101.6 m [C]. Deck 22.5 m, composite [C].

### cau-bach-dang — Bạch Đằng (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P0 | stay_colour | missing | "orange" | §0.1 |
| P1 | pylon height above deck | custom tip 62 (total 113) | **centre 46, sides 43 above deck**: scale custom y by **0.74**; crossbeam 38 → **22**; anchor zone 40–60 → **28–45** | [C] design crown elevation +97.5 (T29); as-built 99.74 / 94.5 m ([Công An](https://congan.com.vn/giao-thong-24h/khanh-thanh-cau-bach-dang-noi-tp-hai-phong-voi-tinh-quang-ninh_61237.html)). Deck sits about 52 m above water (48.4 m clearance). Cross-checked on Commons photo img0: above-deck height ≈ 1.6 × the leg spacing ≈ 42–45 m, and the beam is at ≈ 0.5 of that height. |
| P1 | cables_per_side | derived | **12** | [C] 48 stay bundles per pylon ([baolamdong](https://baolamdong.vn/cau-bach-dang-cong-trinh-day-vang-nhieu-nhip-hang-dau-the-gioi-noi-hai-phong-va-quang-ninh-454260.html)) |
| P2 | centre pylon taller | equal | needs G4 | |

### cau-tran-thi-ly — Trần Thị Lý (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P0 | colours | missing | pylon "white", stays "white", back stays "red" | §0.1 |
| P1 | back_stay_planes | n/a | **2** (needs G3); main span stays in 1 central plane | [C] VECC: "single-plane in main span, median anchorage" + "triple-plane system"; CafeF: west stays split into two branches |
| P2 | spans_m | [230,120] | keep. Layout 4×50+230+45+4×50+30+26 [C]; the back stays anchor over the 45 m span plus the first approach spans, so 120 is an acceptable lumped back span | [vi.wikipedia](https://vi.wikipedia.org/wiki/C%E1%BA%A7u_Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD) |

Lean direction: sources say "12° toward the west (S1 abutment)". Pass 2 verified the lean away from the main span against photos; keep it.

### cau-kien — Kiền (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P1 | cables_per_side | derived | **9** | [C] "36 cặp dây văng" = 72 stays = 2 × 2 × 2 × 9 ([vi.wikipedia](https://vi.wikipedia.org/wiki/C%E1%BA%A7u_Ki%E1%BB%81n)) |
| P2 | deck_width_m | 16 | **16.7** | [C] vi.wikipedia |
| P2 | harp | renders as semi-fan | parallel (G2) | |

### cau-ba-son — Ba Son (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P1 | cables_per_side | derived 8 | **14** | [C] 56 stay bundles = 2 sides × 2 planes × 14 ([vi.wikipedia](https://vi.wikipedia.org/wiki/C%E1%BA%A7u_Ba_Son)) |
| P1 | custom tip | about 101 (total 121) | total **113**: scale custom y by **0.92** | [C] 113 m |

Lean direction is disputed in the press (An Khánh vs Thủ Thiêm). Pass 2 checked photos; keep it.

### cau-may-chai — Máy Chai / Hoàng Gia (completed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P1 | cable_pattern | semi_fan | **harp** | [C] "dây văng kiểu đàn hạc", 24 stays per pylon split evenly on both sides (baohaiphong, congly); 6 per side per plane is OK |

### cau-ben-rung — Bến Rừng (completed, extradosed)
| P | Field | Current | Expected | Conf |
|---|---|---|---|---|
| P0 | colours | missing | pylon "white", stays "red" | §0.1 |
| P2 | harp | — | parallel (G2) | |

Spans (90+2×160+90) and the 21.5 m width are [C] ([dangcongsan](https://dangcongsan.vn/kinh-te/thong-xe-cau-ben-rung-672765.html)). The V blades lean strongly outward [C] (Tuổi Trẻ).

### cau-cua-hoi — Cửa Hội (completed, extradosed)
| P | Field | Current | Expected | Conf |
|---|---|---|---|---|
| P0 | colours | missing | pylon "white", stays "red" | §0.1 |
| P2 | harp | — | parallel (G2) | |

Spans 86+153+86 and 18.5 m width are [C] (baohatinh). Pylon height is unpublished, so keep 18 m [E].

### cau-thuan-an — Thuận An (completed, extradosed)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P0 | colours | missing | pylon "white", stays "red" | §0.1 |
| P1 | deck_elevation_m | derived 21.8 | **40** (needs G1) | [C] pylon 32 m above deck and 72 m above water ([Tiền Phong](https://tienphong.vn/chiem-nguong-cau-day-do-vuot-cua-bien-dai-nhat-mien-trung-post1810259.tpo)) |
| P1 | pylon form | built-in `A`: legs reach the water ±28 m outside the deck (big tent) | `pylon_custom`: 2 legs from the pier head at deck level, centreline [[0,-3,±10.5],[0,0,±10],[0,16,±5],[0,32,0]], width 2.5→2.0 m; short head leg [[0,32,0],[0,34,0],[0,36,0]]; anchor zone 18–32 on the head/apex (single central plane); a pier column below the deck is drawn by the engine from the abutment piers, or add a strut [0,-40,0]→[0,-3,0] width 8 | [C] "chữ A phía trên"; [E] proportions |
| P2 | harp | — | parallel (G2) | |

### cau-hoa-son — Hòa Sơn (under construction)
Spans and 187 m height are [C]; shape and colours are from the render. Optional: `deck_elevation_m` 40 [E] (G1). No other change.

### cau-tu-lien — Tứ Liên (under construction)
| P | Field | Current | Expected | Conf |
|---|---|---|---|---|
| P1 | total height | 215 (custom tip 170 + E 45) | **185**: set `deck_elevation_m: 25` (G1) **and** scale custom y by 0.94 (tip 160) | [C] 185 m (VOV, CafeF; Kenh14's 158 m is the outlier) |

Spans 250+500+250 and the 43 m steel deck are [C].

### cau-dai-ngai-1 — Đại Ngãi 1 (under construction)
No change. 210+450+210 [C], "chữ A" (inverted Y) [C], 110 m above deck [C], width 21.5 m (19 m in one source) ([Dân Trí](https://dantri.com.vn/thoi-su/cau-day-vang-co-nhip-chinh-dai-thu-2-viet-nam-muc-dau-tu-4000-ty-dong-20241209104809062.htm)).

### cau-cat-lai — Cát Lái (under construction)
No change. 450 m, 2 planes, composite steel and 55 m clearance are [C]; "water-drop" pylons match the custom eye and rounded crown. Pylon height is unpublished.

### cau-ngoc-hoi — Ngọc Hồi (under construction)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P2 | deck_width_m | 33 | **38.3** (overall incl. stay-anchor zones; 32.3 m carriageway) | [C] [batdongsan wiki / project](https://wiki.batdongsan.com.vn/wiki/cau-ngoc-hoi-848852) |

Spans 165+350+165, 126 m and H form are all [C] (Kenh14 / CafeF).

### cau-long-hung — Long Hưng (under construction)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P1 | pylon form | single mast with a 15 m Y foot | **twin swords ("song kiếm hợp bích")**: 2 slim legs in the median, separate for the full height with a narrow slot, meeting at a pointed tip; below the deck they flare out to a wider footing. `pylon_custom` legs: [[0,-30,±7],[0,0,±3.5],[0,70,±2.2],[0,125,±1],[0,140,0]], width 3.0→1.8 m, depth 6→4 m, crown "pointed"; crossbeams [-3]; anchor zones 60–132 on both legs | [C] [1thegioi](https://1thegioi.vn/cau-cat-lai-va-cau-long-hung-cong-nghe-gap-ngon-ngu-kien-truc-258897.html) "splayed at the base and converging at the top"; render (vnncdn ground-breaking image) |
| P1 | deck_crest_m | none | **6** [E] (render shows a clear crest) | render |
| P2 | deck_width_m | 38 | **37** | [C] |
| P2 | auxiliary_piers_m | none | one per back span at ≈ 60 m from each end → [60, 640] [E] | render |

### cau-nguyen-trai — Nguyễn Trãi (under construction)
Spans 125+300+125 are now [I]: the main bridge is 550.6 m ([vietnamnet](https://vietnamnet.vn/cau-nguyen-trai-ha-tang-thuc-day-phat-trien-khu-vuc-bac-song-cam-hai-phong-2510816.html)). Height 111 m [C]. The pylon is described as "two sails", with no drawing found; keep H. No change.

### cau-duong-sat-can-gio — Soài Rạp rail bridge (under construction)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| P1 | pylon_shape | "other" (neutral portal) | **"A"** | [C] "hai trụ tháp chữ A", steel-truss girder ([nguoiquansat](https://nguoiquansat.vn/tuyen-duong-sat-noi-den-sieu-do-thi-ty-usd-cua-vingroup-dang-xay-dung-cau-vuot-song-dai-gan-1-000m-323288.html)) |
| P2 | deck | box | truss (G5), depth 10 [E] | |

Spans 280+360+280 = 920 match "about 920 m" [I]; the 242 × 55 m clearance is [C].

### cau-phuoc-an — Phước An (under construction, extradosed)
Spans and pylon height are unpublished, so keep them. Only change is harp parallelism (G2).

### cau-thuong-cat — Thượng Cát (under construction)
Sources conflict (3 or 2 pylons; height 60–80 / 107 / 113 m; layout 100+2×200+100 in the older scheme). "Bird wing" pylons curve sideways. Keep the current model. **No change this round**, flagged as low confidence.

### cau-cua-lon — Cửa Lớn (under construction)
No sources on form. No change.

### cau-phu-my-2 — Phú Mỹ 2 (planned)
| P | Field | Current | Expected | Conf / source |
|---|---|---|---|---|
| **Client decision** | spans_m | [60,200,350,200,60] (350 m is a client-chosen estimate) | contractor page: **(210+450+210) = 870 m**, main span **450 m** | [C] [Bắc Trung Nam](https://bactrungnam-vn.com/cau-phu-my-2-dong-nai/). Do **not** change without client sign-off. Raise it with the client. If accepted: spans [210,450,210], main_span_m 450, drop auxiliary_piers_m. |

The rest matches the PM02 render (33.5 m composite deck [C], 250 × 55 m clearance [C]).

### cau-can-gio — Cần Giờ (planned)
| P | Field | Current | Expected | Conf |
|---|---|---|---|---|
| P2 | pylon_heights_m | 100 (label) while the geometry gives ≈149 total | label **150** (most press). The geometry is consistent; only fix the label. | [C/E] sources conflict (100 / 150 m) |

### cau-can-tho-2 — Cần Thơ 2 (planned)
Spans 210+450+210 and 30.5 m width are [C]. **Double-deck steel truss (road on top, 2 rail tracks below)** [C] needs G5. No other change.

### cau-dong-nai-gia-nghia-bao-lam (planned)
No sources beyond the 350 m span. No change.

---

## 3. Acceptance criteria (what I will check in the round-1 renders)

Run `node scripts/render_views.mjs all --out <dir> --views front,side,three_quarter,foot` and add `--views top` for the bridges marked †.

Global:
- `data/bridges.json` contains every key from §0.1.
- No `colour`, `image_issue` or `auxiliary_piers_m_from_end` keys remain in model3d.
- Stays are visible in the side view of every bridge (G6).
- Harp bridges show parallel stays in the side view (G2).
- Planned bridges stay ghosted (no colour expected).

| Bridge | Check |
|---|---|
| can-tho | Side: 2 aux piers each end, **symmetric**; stays visible. Fullscreen: 27 stays per half-fan per plane (card view may thin). Label ≈175 m. |
| vam-cong | Label 150 m; top beam still just below the tip. |
| bai-chay | Side: single-plane yellow stays, 28 per half-fan; deck crest ≈8 m visible; pylon ≈91.5 m above deck (≈2.1 × the 43.5 m deck elevation); deck ≥ 50 m clearance under the main span. |
| phu-my | Label/total ≈145 m. |
| binh-khanh | Spans 187.25/375/187.25; 17 stays per half-fan; total ≈155. |
| phuoc-khanh | Total ≈155; 14 stays per half-fan; top beam just below the tip. |
| my-thuan | Deck crest ≈6 m visible in the side view. |
| my-thuan-2 | 16 stays per half-fan. |
| nhat-tan | 11 stays per half-fan per plane at each of 5 pylons. |
| rach-mieu | Orange stays; deck 15 m with legs outside the deck edges in the front view. |
| rach-mieu-2 | Side: one aux pier in each side span at ≈60 m from the end pier. |
| bach-dang | Orange stays; pylon above-deck height ≈ 1.7–1.9 × the leg spacing (front view, compare with Commons img0); beam at ≈50% of the above-deck height; 12 stays per half-fan; centre pylon visibly taller (if G4 is done). |
| tran-thi-ly† | White mast, white single-plane main stays in the median, **red back stays in 2 planes to the deck edges**. Front view shows 3 planes. |
| kien | 9 stays per half-fan, parallel. |
| ba-son | 14 stays per half-fan (main + back); total ≈113 m. |
| may-chai | Parallel (harp) stays, 6 per half-fan per plane; yellow arch, red deck; curved wing feet and struts present. |
| ben-rung / cua-hoi | White pylons, red parallel stays. |
| thuan-an† | Front view: A pylon from the deck edges to the apex, **no legs splaying into the water**; deck ≈40 m above water; pylon 32 m above deck; red stays in a single plane. |
| tu-lien | Total ≈185 m; deck ≈25 m above water. |
| long-hung† | Front view: two slim median legs with a slot, meeting at a pointed tip; flared foot below the deck; single plane; deck crest; aux piers. |
| duong-sat-can-gio | A-pylon form; truss deck (if G5 is done). |
| can-tho-2 | Truss double deck visible in the front view (if G5 is done). |
| can-gio | Label 150 m. |
| phu-my-2 | Unchanged unless the client approves 450 m. |
| others (cao-lanh, binh, cat-lai, dai-ngai-1, hoa-son, ngoc-hoi, nguyen-trai, phuoc-an, thuong-cat, cua-lon, dong-nai) | No regression against the baseline renders, apart from the global harp and stay-visibility checks. |

Approval bar: all P0 and P1 rows done, and G1–G3 and G6 implemented. G4 and G5 may slip to round 2 if they are flagged in the engineer's reply.
