# 3D shape review — pass 2 (photo vs render), 2026-11-26

Method: references for every bridge (Commons category or search, press, renders) were downloaded and viewed. Each model was rendered with `scripts/render_views.mjs` (front / foot / three-quarter, plus custom `--az/--el` views where needed) and compared side by side; shapes were fixed and re-rendered until the checklist passed or hit a geometry-code limit.
Composites with free-licensed photos are in `research/compare/<id>.png`. Composites built on press photos or renders with unknown licence stay in the scratchpad and are not committed.

Pass 1 got the Cần Thơ foot wrong. It described splayed A-frame legs, but the client's photo shows a DIAMOND foot. That is fixed here, and every foot was re-checked against photos taken below the deck.

## Cầu Cần Thơ (`cau-can-tho`)
- Pass-1 issue: Pass 1 claimed A-frame splayed feet — wrong. Change: Diamond foot: legs ±15.8 m at the deck converging to ±11 m at the footing; merge ≈74 m above deck; aux piers fixed (unit = 930 m).

| Check | Result |
|---|---|
| foot below deck | fixed (diamond, footing ≈0.55× deck spread) |
| legs at deck | pass (outside edges, cross-beam) |
| merge height | fixed (≈56 m, 40%) |
| crossbeams | pass (1, under deck) |
| head | fixed (long, stout, tapered) |
| proportions | pass (135 m above deck / 550 m span) |
| stays | limited (dense fan rendered thinner than reality) |
| deck / aux piers | fixed (aux piers 40/80 m from each end) |
| colour | pass (grey; red night lighting not modelled) |

References: https://commons.wikimedia.org/wiki/File:Can_Tho_Bridge_(32866753646).jpg, https://commons.wikimedia.org/wiki/File:Can_Tho_Bridge_(32907235505).jpg, https://commons.wikimedia.org/wiki/File:Can_Tho_Bridge_(32866755796).jpg, https://commons.wikimedia.org/wiki/File:Can_Tho_Bridge_under_construction.jpg
Composite: research/compare/cau-can-tho.png

## Cầu Mỹ Thuận 2 (`cau-my-thuan-2`)
- Pass-1 issue: Plain inverted-Y without the diamond foot. Change: Diamond lower legs converging to a narrow pier, merge ≈47 m above deck, single-head anchor zone.

| Check | Result |
|---|---|
| foot below deck | pass (diamond, footing ≈0.5× deck spread) |
| legs at deck | pass (outside edges, under-deck beam) |
| merge height | pass (≈47 m, ≈54%) |
| crossbeams | pass (1, under deck) |
| head | pass (≈45%) |
| proportions | limited (pylon height unpublished, ≈87 m above deck estimated) |
| stays | pass (semi-fan, 2 planes) |
| deck / aux piers | pass (none visible) |
| colour | pass (light grey) |

References: https://commons.wikimedia.org/wiki/File:Cầu_Mỹ_Thuận_1_và_2.jpg, https://commons.wikimedia.org/wiki/File:Cao_tốc_mỹ_thuận_cần_thơ.jpg, https://image.sggp.org.vn/1200x630/Uploaded/2026/cdjwzdjwp/2023_10_14/cong-trinh-giao-thong-cau-my-thuan-2-sung-sung-noi-doi-bo-song-tien-9597.jpg.webp
Composite: research/compare/cau-my-thuan-2.png

## Cầu Rạch Miễu (`cau-rach-mieu`)
- Pass-1 issue: Generic inverted-Y; no below-deck legs, stay colour or strut. Change: A-frame legs to splayed footings, merge ≈58 m above deck, under-deck strut, orange stays.

| Check | Result |
|---|---|
| foot below deck | pass (A-frame: legs splay straight down to a wide footing — confirmed on img2) |
| legs at deck | pass (outside the 12 m deck, strut under deck) |
| merge height | pass (≈58 m) |
| crossbeams | pass (1, under deck) |
| head | pass (short head) |
| proportions | pass |
| stays | pass (fan, orange) |
| deck / aux piers | pass |
| colour | pass (cream, orange stays) |

References: https://commons.wikimedia.org/wiki/File:Cầu_dây_văng_Rạch_Miễu.jpg, https://commons.wikimedia.org/wiki/File:Rach_Mieu_Bridge_pylon.jpg, https://commons.wikimedia.org/wiki/File:Rạch_Miễu_bridge._(14451567804).jpg, https://commons.wikimedia.org/wiki/File:Rach_Mieu_Bridge_under_construction.jpg
Composite: research/compare/cau-rach-mieu.png

## Cầu Bính (`cau-binh`)
- Pass-1 issue: Modelled as inverted-Y; the legs actually stay apart with a top beam and pointed tips. Change: Truncated A with beam ≈60 m above deck and pointed tips.

| Check | Result |
|---|---|
| foot below deck | limited (no photo below deck; straight assumed) |
| legs at deck | pass (outside edges) |
| merge height | pass (legs never merge) |
| crossbeams | fixed (upper beam ≈54 m, 75%) |
| head | fixed (pointed tips above the beam) |
| proportions | pass |
| stays | pass (fan, 2 planes) |
| deck / aux piers | limited |
| colour | pass (light grey) |

References: https://commons.wikimedia.org/wiki/File:Bridge_in_Haiphong.jpg
Composite: research/compare/cau-binh.png

## Cầu Hòa Sơn (`cau-hoa-son`)
- Pass-1 issue: —. Change: Inverted-Y kept; red/white colour noted.

| Check | Result |
|---|---|
| foot below deck | limited (render shows no foot) |
| legs at deck | pass |
| merge height | limited (render too small) |
| crossbeams | limited |
| head | pass |
| proportions | pass |
| stays | pass (red, fan) |
| deck / aux piers | limited |
| colour | pass (white pylon, red stays) |

References: https://baolamdong.vn/cao-toc-10000-ty-hoa-binh-moc-chau-phan-dau-ve-dich-som-1-nam-va-ky-luc-cau-day-vang-424941.html, https://nguoiquansat.vn/tay-bac-sap-co-cay-cau-moi-lap-ky-luc-viet-nam-quy-mo-3-100-ty-cam-hung-thiet-ke-tu-nui-rung-dia-phuong-298648.html
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Cát Lái (`cau-cat-lai`)
- Pass-1 issue: Inverted-Y — render shows parallel legs closing in a rounded arch. Change: Custom arch-top pylon (Ba Son-like but vertical).

| Check | Result |
|---|---|
| foot below deck | limited (render shows no foot) |
| legs at deck | fixed (in the median, not outside the deck edges) |
| merge height | fixed (legs touch ≈44 m, eye 60–108 m, crown ≈116 m) |
| crossbeams | pass (under deck) |
| head | fixed (slotted eye + rounded crown) |
| proportions | pass |
| stays | pass |
| deck / aux piers | limited |
| colour | pass (white) |

References: https://i1-vnexpress.vnecdn.net/2026/01/29/gen-h-z7480267955959-ba79feb88a7a279aae8ce8175156fea7-1769679191-1769686927-1769696745.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=AcNEih9NX7kBNJoD0LwqfQ
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Đại Ngãi 1 (`cau-dai-ngai-1`)
- Pass-1 issue: Shape 'A' — render shows an inverted-Y with a long single head. Change: Pylon shape → inverted_Y, merge ≈45 m above deck, head anchors; red stays.

| Check | Result |
|---|---|
| foot below deck | limited (render shows no foot; mild diamond assumed) |
| legs at deck | pass |
| merge height | fixed (≈78 m, 70%; was ≈45%) |
| crossbeams | pass |
| head | fixed (short head with eye slot — slot not modelled) |
| proportions | pass (110 m above deck) |
| stays | pass (red fan) |
| deck / aux piers | limited |
| colour | pass |

References: https://media.baodautu.vn/thumb_x470x250/Images/anhminh/2024/12/04/he-lo-nha-thau-thi-cong-sieu-cau-day-vang-dai-ngai-1-tri-gia-3900-ty-dong1733300762.jpg
Composite: scratchpad only (doubtful CC0 photo + press renders)

## Cầu Vàm Cống (`cau-vam-cong`)
- Pass-1 issue: Plain H; missing the splayed lower legs and the top cross-beam position. Change: Splayed portal foot, top cross-beam ≈92 m above deck, deck width 24.5 m.

| Check | Result |
|---|---|
| foot below deck | pass (splayed portal legs) |
| legs at deck | pass |
| merge height | n/a (H) |
| crossbeams | pass (top + under deck) |
| head | pass |
| proportions | limited (height unpublished) |
| stays | pass (fan) |
| deck / aux piers | pass |
| colour | pass |

References: https://commons.wikimedia.org/wiki/File:Vam_Cong_Bridge.jpg, https://commons.wikimedia.org/wiki/File:Cầu_Vàm_Cống_trong_chiều.png
Composite: research/compare/cau-vam-cong.png

## Cầu Bãi Cháy (`cau-bai-chay`)
- Pass-1 issue: Single post OK but no below-deck shaft and no stay colour. Change: Explicit single shaft to the pier, anchor zone 55–97 m, yellow stays noted.

| Check | Result |
|---|---|
| foot below deck | pass (single shaft) |
| legs at deck | pass (median) |
| merge height | n/a |
| crossbeams | n/a |
| head | pass |
| proportions | pass |
| stays | pass (yellow, single plane) |
| deck / aux piers | pass (crest) |
| colour | pass |

References: https://commons.wikimedia.org/wiki/File:Bai_Chay_Bridge_(49357435003).jpg, https://commons.wikimedia.org/wiki/File:Bãi_Cháy_Bridge,_Hạ_Long_City,_Việt_Nam.jpg, https://commons.wikimedia.org/wiki/File:VietnamBaiChayBridge.jpg
Composite: research/compare/cau-bai-chay.png

## Cầu Phú Mỹ (`cau-phu-my`)
- Pass-1 issue: Plain H with no cross-beam heights. Change: Under-deck beam plus high beam ≈70 m above deck, anchor zone 72–98 m.

| Check | Result |
|---|---|
| foot below deck | pass (straight) |
| legs at deck | pass |
| merge height | n/a (H) |
| crossbeams | pass (under deck + high beam) |
| head | pass |
| proportions | pass |
| stays | pass |
| deck / aux piers | pass |
| colour | pass |

References: https://commons.wikimedia.org/wiki/File:Phu_My_Bruecke2.jpg, https://commons.wikimedia.org/wiki/File:Phú_Mỹ_Bridge.JPG, https://commons.wikimedia.org/wiki/File:Cablestay_bridge_in_Saigon.jpg
Composite: research/compare/cau-phu-my.png

## Cầu Bình Khánh (`cau-binh-khanh`)
- Pass-1 issue: Plain H, no beams. Change: Twin vertical legs, under-deck beam + beam near the top (≈90 m above deck).

| Check | Result |
|---|---|
| foot below deck | limited (no photo below deck) |
| legs at deck | pass |
| merge height | n/a |
| crossbeams | pass (top beam) |
| head | pass |
| proportions | pass |
| stays | pass |
| deck / aux piers | limited |
| colour | pass |

References: https://cdn2.tuoitre.vn/thesaigontimes/uploads/2025/07/DJI_20250710151804_0781_D-1.jpg
Composite: research/compare/cau-binh-khanh.png

## Cầu Mỹ Thuận (`cau-my-thuan`)
- Pass-1 issue: H pylon had no cross-beam heights and no below-deck leg. Change: Added legs to the footing, 2 cross-beams (under deck and ≈42 m above deck), anchor zone 48–80 m, vertical deck crest noted.

| Check | Result |
|---|---|
| foot below deck | pass (straight legs to pile cap) |
| legs at deck | pass (outside edges) |
| merge height | pass (no merge, H) |
| crossbeams | pass (under deck + ≈42 m) |
| head | pass |
| proportions | pass |
| stays | pass (semi-fan) |
| deck / aux piers | pass (vertical crest) |
| colour | pass |

References: https://commons.wikimedia.org/wiki/File:Cầu_Mỹ_Thuận,_Vĩnh_Long,_2013.JPG, https://commons.wikimedia.org/wiki/File:My_Thuan_Bridge_cables.jpg, https://commons.wikimedia.org/wiki/File:Cầu_Mỹ_Thuận_1_và_2.jpg
Composite: research/compare/cau-my-thuan.png

## Cầu Cao Lãnh (`cau-cao-lanh`)
- Pass-1 issue: Height 120 m (press says 123.4 m); no cross-beam positions. Change: Height 123.4 m, beams under deck and ≈38 m above deck, anchor zone.

| Check | Result |
|---|---|
| foot below deck | pass (straight) |
| legs at deck | pass |
| merge height | n/a (H) |
| crossbeams | pass (under deck + ≈38 m) |
| head | pass |
| proportions | pass (123.4 m) |
| stays | pass |
| deck / aux piers | pass |
| colour | limited (magenta night lighting not modelled) |

References: https://commons.wikimedia.org/wiki/File:Cầu_Cao_Lãnh.jpg
Composite: research/compare/cau-cao-lanh.png

## Cầu Nhật Tân (`cau-nhat-tan`)
- Pass-1 issue: Legs started at deck level (no diamond foot); one gallery image shows no bridge. Change: Legs now converge below deck into one pier (diamond), apex ≈80 m above deck; flag image VN 02 for replacement.

| Check | Result |
|---|---|
| foot below deck | pass (legs converge into one pier — diamond) |
| legs at deck | pass (outside edges) |
| merge height | pass (pointed apex) |
| crossbeams | pass (under deck only) |
| head | pass |
| proportions | limited (110 m total from Wikipedia) |
| stays | pass (fan) |
| deck / aux piers | pass |
| colour | limited (night lighting not modelled) |

References: https://commons.wikimedia.org/wiki/File:4am_view_of_Nhat_Tan_Bridge_in_Hanoi.jpg, https://commons.wikimedia.org/wiki/File:Nhat_Tan_Bridge_at_night_2016.jpg
Composite: research/compare/cau-nhat-tan.png

## Cầu Phước Khánh (`cau-phuoc-khanh`)
- Pass-1 issue: Plain H, no beams. Change: Twin vertical legs, under-deck beam + top beam.

| Check | Result |
|---|---|
| foot below deck | limited |
| legs at deck | pass |
| merge height | n/a |
| crossbeams | pass (top beam) |
| head | pass |
| proportions | pass |
| stays | pass |
| deck / aux piers | limited |
| colour | pass |

References: https://commons.wikimedia.org/wiki/File:Cầu_Phước_Khánh_2017.jpg
Composite: research/compare/cau-phuoc-khanh.png

## Cầu Rạch Miễu 2 (`cau-rach-mieu-2`)
- Pass-1 issue: H with an implied upper beam; no auxiliary piers. Change: Twin columns with no upper beam, under-deck beam only; auxiliary pier in each side span.

| Check | Result |
|---|---|
| foot below deck | pass (straight) |
| legs at deck | pass |
| merge height | n/a (twin columns) |
| crossbeams | pass (under deck only) |
| head | pass |
| proportions | pass |
| stays | pass |
| deck / aux piers | pass (aux piers) |
| colour | pass |

References: https://commons.wikimedia.org/wiki/File:(VNM-Dong_Thap)_Rach_Mieu_2_Bridge_2025-10-05.jpg, https://i2-vnexpress.vnecdn.net/2025/04/19/DJI-20250420075438-0019-D-copy-1745029263.jpg?w=1200&h=675&q=100&dpr=1&fit=crop&s=e6x9QcBbyTU8zxJQt7zodA
Composite: research/compare/cau-rach-mieu-2.png

## Cầu Bạch Đằng (`cau-bach-dang`)
- Pass-1 issue: No cross-beam positions; one gallery image is the VOV logo. Change: Upper beam ≈38 m above deck + under-deck beam; orange stays; remove the VOV image.

| Check | Result |
|---|---|
| foot below deck | pass (straight) |
| legs at deck | pass |
| merge height | n/a (H) |
| crossbeams | pass |
| head | pass |
| proportions | pass |
| stays | pass (orange) |
| deck / aux piers | pass |
| colour | pass |

References: https://commons.wikimedia.org/wiki/File:Bạch_Đằng_Bridge_(49534690148).jpg, https://daknong.1cdn.vn/thumbs/1200x630/2026/07/19/img_93285243.jpg
Composite: research/compare/cau-bach-dang.png

## Cầu Trần Thị Lý (`cau-tran-thi-ly`)
- Pass-1 issue: Stay colours not captured. Change: Kept single 12° mast; added white front / red back-stay colours.

| Check | Result |
|---|---|
| foot below deck | pass (single mast) |
| legs at deck | pass (median) |
| merge height | n/a |
| crossbeams | n/a |
| head | pass (12° lean) |
| proportions | pass |
| stays | pass (white front, red back) |
| deck / aux piers | pass |
| colour | limited (purple lighting not modelled) |

References: https://commons.wikimedia.org/wiki/File:Trần_Thị_Lý_Bridge_at_daytime.jpg, https://commons.wikimedia.org/wiki/File:Trần_Thị_Lý_Bridge,_Da_Nang.jpg
Composite: research/compare/cau-tran-thi-ly.png

## Cầu Kiền (`cau-kien`)
- Pass-1 issue: Plain H, no beams. Change: Inward-tapering legs, 2 upper beams (≈22 m, ≈38 m above deck), harp.

| Check | Result |
|---|---|
| foot below deck | limited (no photo below deck) |
| legs at deck | pass |
| merge height | n/a |
| crossbeams | pass (2 upper beams) |
| head | pass |
| proportions | limited |
| stays | pass |
| deck / aux piers | limited |
| colour | pass |

References: https://commons.wikimedia.org/wiki/File:Kien_Bridge.jpg
Composite: research/compare/cau-kien.png

## Cầu Ba Son (Thủ Thiêm 2) (`cau-ba-son`)
- Pass-1 issue: Apex drawn pointed. Change: Rounded crown noted; back-stay fan confirmed; geometry otherwise unchanged.

| Check | Result |
|---|---|
| foot below deck | limited (no clear photo below deck; legs to a single pier block) |
| legs at deck | pass (just outside the 27.5 m deck) |
| merge height | pass (arch, rounded crown) |
| crossbeams | pass (none) |
| head | pass |
| proportions | pass (≈100 m above deck / 200 m span) |
| stays | pass (main fan + back-stay fan) |
| deck / aux piers | pass |
| colour | pass (white) |

References: https://commons.wikimedia.org/wiki/File:Cầu_Ba_Son,_TP.HCM,_042022.jpg, https://commons.wikimedia.org/wiki/File:ThapCauThuThiem2(Left).jpg, https://commons.wikimedia.org/wiki/File:Ba_Son_Bridge,_Saigon_(20230705_1516).jpg, https://wsp.com/en-ca/projects/thu-thiem-2-cable-stayed-bridge
Composite: research/compare/cau-ba-son.png

## Cầu Bến Rừng (`cau-ben-rung`)
- Pass-1 issue: —. Change: No geometry change; red stays and white/red blades confirmed.

| Check | Result |
|---|---|
| foot below deck | pass (blades on the deck edge) |
| legs at deck | pass |
| merge height | n/a |
| crossbeams | n/a |
| head | pass |
| proportions | pass |
| stays | pass (red) |
| deck / aux piers | pass |
| colour | pass |

References: https://cdn-i.vtcnews.vn/resize/1200x900//upload/2024/07/16/cau-ben-rung-truoc-ngay-thong-cau-5-10294993.jpg
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Cửa Hội (`cau-cua-hoi`)
- Pass-1 issue: Pylon type 'other' with no detail. Change: Single low central column, single plane, red stays.

| Check | Result |
|---|---|
| foot below deck | limited |
| legs at deck | limited |
| merge height | limited |
| crossbeams | limited |
| head | limited (no pylon reference: construction-site photos only) |
| proportions | limited |
| stays | limited |
| deck / aux piers | limited |
| colour | limited |

References: https://vinwonders.com/vi/wonderpedia/news/cau-cua-hoi-bieu-tuong-ket-noi-nghe-an-va-ha-tinh/
Composite: scratchpad only (press/render images, licence unknown)

## Cầu vượt cửa biển Thuận An (`cau-thuan-an`)
- Pass-1 issue: —. Change: Single central plane and red stays confirmed.

| Check | Result |
|---|---|
| foot below deck | limited |
| legs at deck | limited |
| merge height | limited |
| crossbeams | limited |
| head | limited (no pylon reference: construction-site photos only) |
| proportions | limited |
| stays | limited |
| deck / aux piers | limited |
| colour | limited |

References: https://baolamdong.vn/cau-vuot-bien-thuan-an-dai-nhat-mien-trung-sap-dua-vao-khai-thac-454712.html
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Tứ Liên (`cau-tu-lien`)
- Pass-1 issue: Blades looked like sticks. Change: Blades thickened (0.05 × / 0.075 × the above-deck height).

| Check | Result |
|---|---|
| foot below deck | pass (diamond, engineer's model) |
| legs at deck | pass (outside edges) |
| merge height | pass (≈38%) |
| crossbeams | pass (none) |
| head | fixed (blades thickened to ≈8.5 × 12.75 m; slot 2.5 m) |
| proportions | pass |
| stays | pass (semi-fan, 2 planes) |
| deck / aux piers | limited |
| colour | pass |

References: https://baolamdong.vn/cau-tu-lien-hon-20100-ty-dong-tien-do-thi-cong-va-lo-trinh-hop-long-nam-2027-455142.html, https://cafef.vn/cau-day-vang-gan-20000-ty-dong-o-ha-noi-dang-thay-doi-dien-mao-the-nao-188261101071700319.chn
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Ngọc Hồi (`cau-ngoc-hoi`)
- Pass-1 issue: —. Change: No change: only construction-site or no images.

| Check | Result |
|---|---|
| foot below deck | limited |
| legs at deck | limited |
| merge height | limited |
| crossbeams | limited |
| head | limited (no pylon reference: construction-site photos only) |
| proportions | limited |
| stays | limited |
| deck / aux piers | limited |
| colour | limited |

References: https://cafef.vn/dai-cong-truong-cau-ngoc-hoi-sau-15-thang-thi-cong-188261103143452699.chn, https://tuoitre.vn/cong-truong-lam-cau-day-vang-hon-11-800-ti-dong-noi-ha-noi-va-hung-yen-20260128211946328.htm
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Long Hưng (`cau-long-hung`)
- Pass-1 issue: Single mast without the Y foot. Change: Short Y foot noted (legs splay just above the deck into the mast).

| Check | Result |
|---|---|
| foot below deck | pass (Y foot into single pier) |
| legs at deck | pass (median) |
| merge height | pass |
| crossbeams | n/a |
| head | pass |
| proportions | pass |
| stays | pass (single plane) |
| deck / aux piers | limited |
| colour | pass |

References: https://static-images.vnncdn.net/vps_images_publish/000001/00000Q/2026/9/30/vietnam-breaks-ground-on-14-billion-bridges-linking-hcmc-dong-nai-0357762bb0234c268c395c13c735948d-1011.jpg?width=0&s=-bm-9gfs17Ugs-fpazsM4A
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Nguyễn Trãi (`cau-nguyen-trai`)
- Pass-1 issue: —. Change: No change: only construction-site or no images.

| Check | Result |
|---|---|
| foot below deck | limited |
| legs at deck | limited |
| merge height | limited |
| crossbeams | limited |
| head | limited (no pylon reference: construction-site photos only) |
| proportions | limited |
| stays | limited |
| deck / aux piers | limited |
| colour | limited |

References: https://daibieunhandan.vn/hai-phong-toan-canh-du-an-cau-nguyen-trai-va-vung-phu-can-hon-6-300-ty-dong-10425773.html
Composite: scratchpad only (press/render images, licence unknown)

## Cầu đường sắt vượt sông Soài Rạp (tuyến Bến Thành – Cần Giờ) (`cau-duong-sat-can-gio`)
- Pass-1 issue: —. Change: No change: only construction-site or no images.

| Check | Result |
|---|---|
| foot below deck | limited |
| legs at deck | limited |
| merge height | limited |
| crossbeams | limited |
| head | limited (no pylon reference: construction-site photos only) |
| proportions | limited |
| stays | limited |
| deck / aux piers | limited |
| colour | limited |

References: https://24hmoney.vn/news/sieu-do-thi-ty-usd-cua-vingroup-co-them-buoc-ngoat-c3a2848236.html
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Phước An (`cau-phuoc-an`)
- Pass-1 issue: Apex pointed. Change: Crown described as rounded.

| Check | Result |
|---|---|
| foot below deck | pass (arch legs onto one round pier) |
| legs at deck | pass |
| merge height | pass (rounded crown) |
| crossbeams | n/a |
| head | pass |
| proportions | pass |
| stays | pass |
| deck / aux piers | limited |
| colour | pass |

References: https://nqs.1cdn.vn/thumbs/1200x630/2026/08/01/7031_cau-phuoc-an3.jpg
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Thượng Cát (`cau-thuong-cat`)
- Pass-1 issue: —. Change: No change: only construction-site or no images.

| Check | Result |
|---|---|
| foot below deck | limited |
| legs at deck | limited |
| merge height | limited |
| crossbeams | limited |
| head | limited (no pylon reference: construction-site photos only) |
| proportions | limited |
| stays | limited |
| deck / aux piers | limited |
| colour | limited |

References: https://baolamdong.vn/du-an-cau-thuong-cat-hon-7300-ty-dong-day-nhanh-thi-cong-ba-tru-thap-chinh-qua-song-hong-448557.html, https://cafef.vn/hinh-hai-cau-thuong-cat-sau-mot-nam-khoi-cong-188261021153843485.chn
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Máy Chai (Cầu Hoàng Gia) (`cau-may-chai`)
- Pass-1 issue: Below-deck feet were straight; colours missing. Change: Curved splayed yellow feet and side-span strut described; yellow/red colours.

| Check | Result |
|---|---|
| foot below deck | fixed (legs converge to a narrow pile cap; no z-splay) |
| legs at deck | pass |
| merge height | pass (arch, rounded crown) |
| crossbeams | pass (none) |
| head | pass |
| proportions | pass |
| stays | pass |
| deck / aux piers | limited (curved wing arm drawn as a straight strut) |
| colour | pass (yellow/red) |

References: https://cafefcdn.com/thumb_w/640/203337114487263232/2026/7/30/avatar1785383768277-1785383768904592996991.png, https://cdn-i.vtcnews.vn/resize/1200x900/upload/2025/07/13/anh-2-18403346.jpg
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Cửa Lớn (cao tốc Cà Mau – Đất Mũi) (`cau-cua-lon`)
- Pass-1 issue: —. Change: No change: only construction-site or no images.

| Check | Result |
|---|---|
| foot below deck | limited |
| legs at deck | limited |
| merge height | limited |
| crossbeams | limited |
| head | limited (no pylon reference: construction-site photos only) |
| proportions | limited |
| stays | limited |
| deck / aux piers | limited |
| colour | limited |

References: https://nguoiquansat.vn/cao-toc-59-000-ty-cua-dbscl-se-so-huu-nhieu-cau-vuot-song-quy-mo-va-ket-noi-den-cau-vuot-bien-dai-nhat-viet-nam-296881.html
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Cần Giờ (`cau-can-gio`)
- Pass-1 issue: —. Change: Kept; render confirms root legs splitting from one trunk.

| Check | Result |
|---|---|
| foot below deck | pass (root legs) |
| legs at deck | pass |
| merge height | pass |
| crossbeams | n/a |
| head | pass |
| proportions | pass |
| stays | pass |
| deck / aux piers | limited |
| colour | pass |

References: https://cdn2.tuoitre.vn/zoom/1200_630/471584752817336320/2026/1/14/anh-9-17683527812281318384555-89-20-838-1451-crop-176842964739965225266.jpg
Composite: scratchpad only (press/render images, licence unknown)

## Cầu Cần Thơ 2 (`cau-can-tho-2`)
- Pass-1 issue: Plain H. Change: Top cross-beam frame + under-deck beam; double-deck truss noted.

| Check | Result |
|---|---|
| foot below deck | limited |
| legs at deck | pass |
| merge height | n/a |
| crossbeams | pass (top frame) |
| head | pass |
| proportions | pass |
| stays | pass |
| deck / aux piers | limited (double-deck truss as steel box) |
| colour | pass |

References: https://cafefcdn.com/thumb_w/1200/203337114487263232/2026/10/8/avatar1791451772173-1791451772671916968314.webp
Composite: scratchpad only (press/render images, licence unknown)

## Cầu vượt sông Đồng Nai (đường động lực Gia Nghĩa – Bảo Lâm) (`cau-dong-nai-gia-nghia-bao-lam`)
- Pass-1 issue: —. Change: No change: only construction-site or no images.

| Check | Result |
|---|---|
| foot below deck | limited |
| legs at deck | limited |
| merge height | limited |
| crossbeams | limited |
| head | limited (no pylon reference: construction-site photos only) |
| proportions | limited |
| stays | limited |
| deck / aux piers | limited |
| colour | limited |

References: https://nguoiquansat.vn/tinh-rong-nhat-viet-nam-sap-xay-cau-day-vang-vuot-song-nhip-chinh-dai-350m-313529.html
Composite: scratchpad only (press/render images, licence unknown)

