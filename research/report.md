# Research report: cable-stayed and extradosed bridges in Vietnam, main span > 150 m (2026-11-25)

**Scope:** cable-stayed and extradosed bridges with a main span over 150 m, carrying road, rail or metro traffic. Each is completed, under construction or planned. `opened` is the year opened to traffic, or the target year for unfinished bridges. `province` uses the 34-unit scheme; a bridge on a boundary is written "A – B", and the pre-2025 provinces go in `province_former`.

**Result:** 33 bridges. Completed 20 (3 extradosed), under construction 10 (1 extradosed, 1 metro), planned 3 (1 road + rail). 13 verified, 20 needs_check.

## Method
1. Built a seed list from en-Wikipedia "List of bridges in Vietnam" and vi-Wikipedia "Danh sách cầu dài nhất Việt Nam".
2. Took specs from each bridge's Wikipedia article and cross-checked them against the Vietnamese press (VnExpress, Tuổi Trẻ, Tiền Phong, VietnamPlus, CafeF, Báo Đầu tư, Báo Đấu thầu, Người Quan Sát, Báo Lâm Đồng, Thanh Tra, VOV) and the Ministry of Construction site, moc.gov.vn.
3. Ran broad Vietnamese searches by keyword ("nhịp chính", "đang thi công", "khởi công 2025/2026"), by province and by rail line.
4. Took coordinates from OpenStreetMap (Overpass bridge, construction and proposed ways) and Nominatim. Six sites without OSM geometry were estimated and flagged APPROXIMATE.
5. Took images from Wikimedia Commons only, with the license read from the Commons API or file page.
6. Took QL route numbers from Wikipedia and the press. CT and ĐT codes come from OSM `ref` tags and are flagged for confirmation.
7. Recorded client corrections in `sources` as "client-confirmed 2026-11-25".
8. Generated the JSON with `scripts/gen_bridges.py`, which checks every main span is over 150 m and every id is unique.

## Main sources
The Wikipedia articles above; moc.gov.vn; VietnamNet EN (Cát Lái and Long Hưng groundbreaking); VietnamPlus; Tuổi Trẻ; CafeF; Báo Lâm Đồng; Người Quan Sát; Báo Đầu tư (Phú Mỹ 2); 24hMoney (Soài Rạp metro bridge); infra.global (Cửa Hội span); VSL and Thanh Tra (Bạch Đằng); OpenStreetMap; Wikimedia Commons. Each entry's `sources` lists its exact URLs.

## Excluded bridges

| Bridge | Main span (m) | Reason |
|---|---|---|
| Nhật Lệ 2 | 150 ×2 | Not over 150 m |
| Rào 2 | 120 | Not over 150 m |
| Sông Hiếu | 100 ×2 | Not over 150 m |
| Tắc Ông Đĩa rail bridge (Bến Thành–Cần Giờ line) | 140 | Not over 150 m |
| Bát Xát–Bá Sái border bridge | Under 150 (230 m total) | Not over 150 m |
| Cổ Chiên | 150 | Box girder |
| Mễ Sở | 155 | Box girder |
| Hồng Hà | ? | Balanced-cantilever girder |
| Phong Châu (new) | 120 | Box girder |
| Trần Hưng Đạo | 145 ×6 | Steel arch, not over 150 m |
| Thủ Thiêm 4 | ? | Steel arch design chosen |
| Thuận Phước | 405 | Suspension bridge |
| Vân Phúc, Bạch Đằng 2, Cổ Chiên 2 | ? | Not cable-stayed per available sources |
| Mỹ Lợi, Hưng Hà, Ba Lạt, Hàm Luông, Đình Vũ, Tân Vũ, Vĩnh Thịnh, Rạch Sỏi | ? | No evidence of a cable-stayed span over 150 m |
| Phú Mỹ 2 | ? (likely over 250) | Pending: span unpublished |

## Coverage gaps
- Rail-line designs are largely unpublished, so these lines should be rechecked as feasibility studies come out.
- Late-2026 statuses depend on news up to November 2026: the Phước Khánh and Bình Khánh openings, the Phước An opening and the Cần Giờ start.
- Press "main span" figures are sometimes the whole cable-stayed unit (Mỹ Thuận 2 "650 m", Nguyễn Trãi "550 m", Cát Lái "3 km"). These were corrected and noted in the entries.
- OSM bridge centres can be a few hundred metres from the pylons.
- Provincial (ĐT) projects were not swept systematically across all 34 units.
- Some images are imperfect: the Bạch Đằng photo is not explicitly located, and the Mỹ Thuận 2 and Phước Khánh photos show the bridges under construction.
