import json, sys

W = "https://en.wikipedia.org/wiki/"
CC = "client-confirmed 2026-11-25"
LIST = W + "List_of_bridges_in_Vietnam"
OSM = "https://www.openstreetmap.org (Overpass query, bridge way centre, retrieved 2026-11-25)"

def img(url, credit, lic, src):
    return {"url": url, "credit": credit, "license": lic, "source": src}

U = "https://upload.wikimedia.org/wikipedia/commons/"
C = "https://commons.wikimedia.org/wiki/File:"

B = []
def add(**k):
    k.setdefault("images", [])
    k.setdefault("usage", ["road"])
    k.setdefault("structure_type", "cable_stayed")
    assert k["main_span_m"] > 150, k["id"]
    B.append(k)

# ---------------- COMPLETED: cable-stayed ----------------
add(id="cau-can-tho", name_vi="Cầu Cần Thơ", name_en="Cần Thơ Bridge", status="completed",
    province="Cần Thơ – Vĩnh Long", province_former=["Cần Thơ", "Vĩnh Long"], crosses="Sông Hậu",
    roads=["QL1A"], construction_start=2004, opened=2010, main_span_m=550, total_length_m=2750,
    width_m=23.1, lanes=6, cable_stayed_spans=1, pylons="2 pylons, 175.3 m", lat=10.0328, lng=105.8103,
    images=[img(U+"3/32/CanThoBridge.jpg", "Tomdoan", "Public domain", C+"CanThoBridge.jpg")],
    sources=[W+"Cần_Thơ_Bridge", LIST, OSM], confidence="verified",
    notes="Total length 2,750 m (15,850 m with approaches). Opened 24/4/2010.")

add(id="cau-vam-cong", name_vi="Cầu Vàm Cống", name_en="Vàm Cống Bridge", status="completed",
    province="Đồng Tháp – Cần Thơ", province_former=["Đồng Tháp", "Cần Thơ"], crosses="Sông Hậu",
    roads=["CT.02"], construction_start=2013, opened=2019, main_span_m=450, total_length_m=2970,
    width_m=24.5, lanes=6, cable_stayed_spans=1, cost="5,700 tỷ VND", lat=10.3170, lng=105.5043,
    images=[img(U+"c/cc/C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng.png", "Bùi Thụy Đào Nguyên", "CC BY-SA 4.0", C+"C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng.png")],
    sources=[W+"Vàm_Cống_Bridge", LIST, OSM, "https://tedi.vn/project/cau-vam-cong/",
             "https://cafef.vn/cau-5700-ty-co-tru-thap-cao-nhat-coc-khoan-sau-nhat-viet-nam-188230505101414572.chn",
             "https://www.koreascience.kr/article/JAKO201334064308422.pdf"], confidence="verified",
    notes="Road code from OpenStreetMap (CT.02; also tagged as Đường Hồ Chí Minh). Opened 19/5/2019. Contractor GS E&C – Hanshin JV (Korea, EDCF).")

add(id="cau-bai-chay", name_vi="Cầu Bãi Cháy", name_en="Bãi Cháy Bridge", status="completed",
    province="Quảng Ninh", province_former=["Quảng Ninh"], crosses="Eo Cửa Lục",
    roads=["QL18"], construction_start=2003, opened=2006, main_span_m=435, total_length_m=1106,
    width_m=25, lanes=4, cable_stayed_spans=1, span_arrangement="5 spans", pylons="2 single pylons (single cable plane)",
    cost="≈1,046 tỷ VND", lat=20.9602, lng=107.0658,
    images=[img(U+"9/9b/Le_pont_suspendu_d%27Halong.jpg", "Jean-Pierre Dalbéra", "CC BY 2.0", C+"Le_pont_suspendu_d%27Halong.jpg")],
    sources=[W+"Bãi_Cháy_Bridge", LIST], confidence="verified",
    notes="Opened 2/12/2006. Single-plane cable-stayed bridge.")

add(id="cau-phu-my", name_vi="Cầu Phú Mỹ", name_en="Phú Mỹ Bridge", status="completed",
    province="TP. Hồ Chí Minh", province_former=["TP. Hồ Chí Minh"], crosses="Sông Sài Gòn",
    roads=["Vành đai 2 TP.HCM"], construction_start=2005, opened=2009, main_span_m=380, total_length_m=2100,
    width_m=27, lanes=6, cable_stayed_spans=1, pylons="2 H-shaped pylons, 145 m", lat=10.7450, lng=106.7445,
    images=[img(U+"7/78/Phu_My_Bruecke2.jpg", "Hajotthu", "CC BY 3.0", C+"Phu_My_Bruecke2.jpg")],
    sources=[W+"Phú_Mỹ_Bridge", LIST, "construction_start 2005: " + CC], confidence="verified",
    notes="Called 'Phú Mỹ 1' by the client. Construction start 2005 confirmed by the client (Wikipedia text also mentions 2007). Opened 2/9/2009.")

add(id="cau-binh-khanh", name_vi="Cầu Bình Khánh", name_en="Bình Khánh Bridge", status="completed",
    province="TP. Hồ Chí Minh", province_former=["TP. Hồ Chí Minh"], crosses="Sông Soài Rạp",
    roads=["CT.01"], construction_start=2015, opened=2026, main_span_m=375, total_length_m=2763.5,
    width_m=21.75, lanes=4, cable_stayed_spans=1, lat=10.6598, lng=106.7388,
    images=[img(U+"b/b6/C%E1%BA%A7u_B%C3%ACnh_Kh%C3%A1nh_trong_qu%C3%A1_tr%C3%ACnh_x%C3%A2y_d%E1%BB%B1ng.jpg", "Lê Uy Lân", "CC BY-SA 4.0", C+"C%E1%BA%A7u_B%C3%ACnh_Kh%C3%A1nh_trong_qu%C3%A1_tr%C3%ACnh_x%C3%A2y_d%E1%BB%B1ng.jpg")],
    sources=[W+"Bình_Khánh_Bridge", "https://tuoitre.vn/cao-toc-ben-luc-long-thanh.html", LIST,
             "https://vecc.com.vn/project/duong-cao-toc-ben-luc-long-thanh/?lang=en",
             "https://www.tinnhanhchungkhoan.vn/khanh-thanh-cau-day-vang-binh-khanh-cau-co-tinh-khong-cao-nhat-viet-nam-post382393.html", OSM], confidence="needs_check",
    notes="On the Bến Lức–Long Thành expressway (OSM tags it CT.01; to confirm). Inaugurated 12/2025, but full traffic began only when Phước Khánh opened (1/10/2026 per Wikipedia).")

add(id="cau-my-thuan", name_vi="Cầu Mỹ Thuận", name_en="Mỹ Thuận Bridge", status="completed",
    province="Đồng Tháp – Vĩnh Long", province_former=["Tiền Giang", "Vĩnh Long"], crosses="Sông Tiền",
    roads=["QL1A"], construction_start=1997, opened=2000, main_span_m=350, total_length_m=1535,
    width_m=23.66, lanes=4, cable_stayed_spans=1, span_arrangement="150 + 350 + 150 m", pylons="2 H pylons: straight legs leaning inward from the pile cap to one upper crossbeam (≈half the above-deck height), then two vertical posts carrying the stays; deep under-deck crossbeam; 123.5 m above the pile cap, 84.43 m above the deck (≈120 m above high water)",
    cost="≈A$91 million", lat=10.2775, lng=105.9100,
    images=[img(U+"5/58/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_%286297673871%29.jpg", "Quang Vũ Trương", "CC BY 2.0", C+"C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_(6297673871).jpg")],
    sources=[W+"My_Thuan_Bridge", LIST, OSM, "https://tedi.vn/project/cau-my-thuan/",
             "https://vi.wikipedia.org/wiki/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn", "https://aecom.com/projects/thuan-bridge/"], confidence="verified",
    notes="Vietnam's first large cable-stayed bridge. Opened 21/5/2000. Spans 150 + 350 + 150 m (cable-stayed section 660 m incl. 5 m past each anchor pier; approaches 875.2 m, 22 Super-T spans) per TEDI. Design Maunsell McIntyre (AECOM); built by Baulderstone Hornibrook with Cienco 6. Wikipedia gives total length as both 1,535 m and 1,560 m; TEDI 1,535.2 m.")

add(id="cau-my-thuan-2", name_vi="Cầu Mỹ Thuận 2", name_en="Mỹ Thuận 2 Bridge", status="completed",
    province="Đồng Tháp – Vĩnh Long", province_former=["Tiền Giang", "Vĩnh Long"], crosses="Sông Tiền",
    roads=["CT.01"], construction_start=2020, opened=2023, main_span_m=350, total_length_m=1906,
    width_m=28, lanes=6, cable_stayed_spans=1, span_arrangement="150 + 350 + 150 m (cable-stayed unit 650 m)",
    cost="5,003 tỷ VND", lat=10.2755, lng=105.9067,
    images=[img(U+"2/23/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_2_%C4%91ang_thi_c%C3%B4ng.jpg", "Lehuunghi", "CC BY-SA 4.0", C+"C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_2_%C4%91ang_thi_c%C3%B4ng.jpg")],
    sources=["https://vi.wikipedia.org/wiki/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_2", LIST, "https://tuoitre.vn/cau-my-thuan-2-cang-cap-day-vang-cuoi-cung-du-kien-hop-long-trong-thang-10-20230915150909691.htm", OSM], confidence="needs_check",
    notes="vi-Wikipedia and press say 'nhịp chính 650 m', which is the whole cable-stayed unit. The en-Wikipedia list gives a 350 m main span. Opened 24/12/2023. Photo shows it under construction (2023).")

add(id="cau-cao-lanh", name_vi="Cầu Cao Lãnh", name_en="Cao Lãnh Bridge", status="completed",
    province="Đồng Tháp", province_former=["Đồng Tháp"], crosses="Sông Tiền",
    roads=["CT.02"], construction_start=2013, opened=2018, main_span_m=350, total_length_m=2010,
    width_m=24.5, lanes=4, cable_stayed_spans=1, span_arrangement="150 + 350 + 150 m", pylons="2 H-shaped pylons, 120 m",
    lat=10.4126, lng=105.6518,
    images=[img(U+"5/57/C%E1%BA%A7u_Cao_L%C3%A3nh.jpg", "Bùi Thụy Đào Nguyên", "CC BY-SA 4.0", C+"C%E1%BA%A7u_Cao_L%C3%A3nh.jpg")],
    sources=[W+"Cao_Lãnh_Bridge", LIST, OSM], confidence="verified",
    notes="Road code from OpenStreetMap (CT.02 / Đường Hồ Chí Minh). Opened 27/5/2018.")

add(id="cau-nhat-tan", name_vi="Cầu Nhật Tân", name_en="Nhật Tân Bridge", status="completed",
    province="Hà Nội", province_former=["Hà Nội"], crosses="Sông Hồng",
    roads=["Vành đai 2 Hà Nội", "Đường Võ Nguyên Giáp"], construction_start=2009, opened=2015, main_span_m=300,
    total_length_m=3700, width_m=33.2, lanes=6, cable_stayed_spans=4, span_arrangement="150 + 4 × 300 + 150 m",
    pylons="5 A-shaped pylons, ≈110 m", cost="≈13,600 tỷ VND", lat=21.0928, lng=105.8207,
    images=[img(U+"8/8d/4am_view_of_Nhat_Tan_Bridge_in_Hanoi.jpg", "cloud.shepherd", "CC BY 2.0", C+"4am_view_of_Nhat_Tan_Bridge_in_Hanoi.jpg")],
    sources=[W+"Nhật_Tân_Bridge", LIST], confidence="verified",
    notes="Multi-span cable-stayed bridge: four 300 m main spans. Opened 4/1/2015.")

add(id="cau-phuoc-khanh", name_vi="Cầu Phước Khánh", name_en="Phước Khánh Bridge", status="completed",
    province="TP. Hồ Chí Minh – Đồng Nai", province_former=["TP. Hồ Chí Minh", "Đồng Nai"], crosses="Sông Lòng Tàu",
    roads=["CT.01"], construction_start=2015, opened=2026, main_span_m=300, total_length_m=3186,
    width_m=21.75, lanes=4, cable_stayed_spans=1, pylons="2 tháp chữ H (2 cột đứng, 1 xà ngang trên ở khoảng 2/3 chiều cao), cao 135,8 m tính từ móng", lat=10.6659, lng=106.7988,
    images=[img(U+"a/ac/C%E1%BA%A7u_Ph%C6%B0%E1%BB%9Bc_Kh%C3%A1nh_2017.jpg", "Pieceofmetalwork", "CC0", C+"C%E1%BA%A7u_Ph%C6%B0%E1%BB%9Bc_Kh%C3%A1nh_2017.jpg")],
    sources=[W+"Phước_Khánh_Bridge", "https://tuoitre.vn/cao-toc-ben-luc-long-thanh.html", "https://cafef.vn/nhung-cong-doan-cuoi-cung-truoc-khi-thong-xe-cau-phuoc-khanh-188260911101103844.chn",
             "https://vecc.com.vn/project/duong-cao-toc-ben-luc-long-thanh/?lang=en",
             "https://www.jica.go.jp/english/about/policy/environment/id/asia/southeast/a_b_fi/vietnam/__icsFiles/afieldfile/2026/09/29/Result_of_Environmental_Monitoring_(2026Q2).pdf", OSM], confidence="needs_check",
    notes="Opening 1/10/2026 per en-Wikipedia. Press only gives a 30/9/2026 target; no press report of the opening ceremony was found. 55 m navigation clearance. Photo dates from 2017 (construction). On the Bến Lức–Long Thành expressway (OSM tags it CT.01; to confirm).")

add(id="cau-rach-mieu", name_vi="Cầu Rạch Miễu", name_en="Rạch Miễu Bridge", status="completed",
    province="Đồng Tháp – Vĩnh Long", province_former=["Tiền Giang", "Bến Tre"], crosses="Sông Tiền",
    roads=["QL60"], construction_start=2002, opened=2009, main_span_m=270, total_length_m=2868,
    width_m=12, lanes=2, cable_stayed_spans=1, span_arrangement="117 + 270 + 117 m", cost="1,400 tỷ VND",
    lat=10.3443, lng=106.3423,
    images=[img(U+"f/fa/R%E1%BA%A1ch_mi%E1%BB%85u_TG-BT.jpg", "Đức-Huy", "CC BY 2.0", C+"R%E1%BA%A1ch_mi%E1%BB%85u_TG-BT.jpg")],
    sources=[W+"Rạch_Miễu_Bridge", LIST, OSM], confidence="verified",
    notes="Opened 19/1/2009. Coordinates are the OSM QL60 bridge way and are approximate for the pylon.")

add(id="cau-rach-mieu-2", name_vi="Cầu Rạch Miễu 2", name_en="Rạch Miễu 2 Bridge", status="completed",
    province="Đồng Tháp – Vĩnh Long", province_former=["Tiền Giang", "Bến Tre"], crosses="Sông Tiền",
    roads=["QL60B"], construction_start=2022, opened=2025, main_span_m=270, total_length_m=1954,
    width_m=21.5, lanes=4, cable_stayed_spans=1, span_arrangement="120 + 270 + 120 m",
    pylons="2 tháp chữ H (hai cột đứng, dầm ngang trên ở khoảng giữa chiều cao), cao 116,5 m", cost="6,810 tỷ VND (whole project)",
    lat=10.3368, lng=106.3074,
    sources=["https://vi.wikipedia.org/wiki/C%E1%BA%A7u_R%E1%BA%A1ch_Mi%E1%BB%85u_2", "https://vneconomy.vn/cau-rach-mieu-2-se-khanh-thanh-vao-ngay-19-8-2025.htm", "https://tienphong.vn/can-canh-cau-day-vang-6810-ty-dong-bac-qua-song-tien-post1764558.tpo",
             "https://giaothong.tapchixaydung.vn/du-an-cau-rach-mieu-2-bat-dau-thi-cong-keo-cang-he-thong-cap-day-vang-183240731113933198.htm",
             "https://trungnamec.com.vn/cau-rach-mieu-2/", "roads QL60B: " + CC, OSM], confidence="verified",
    notes="About 3.8 km upstream of Rạch Miễu 1. Opened 19/8/2025. Sources disagree on length (1,954 m vs 1,971.2 m). "
          "Spans 120 + 270 + 120 (Tạp chí GTVT; contractor scope Km5+913–Km6+423 = 510 m); Wikipedia's 117 + 270 + 117 is the original Rạch Miễu's arrangement. "
          "Pylon 116.5 m (contractor) / 113 m (press). 112 stays in 2 planes. "
          "Width 21.5 m (VnExpress, Trung Nam closure note; client-confirmed 2026-11-28); 17.5 m (Wikipedia, ground-breaking) superseded.")

add(id="cau-binh", name_vi="Cầu Bính", name_en="Bính Bridge", status="completed",
    province="Hải Phòng", province_former=["Hải Phòng"], crosses="Sông Cấm",
    roads=["ĐT.359"], construction_start=2002, opened=2005, main_span_m=260, total_length_m=1280,
    width_m=22.5, lanes=6, cable_stayed_spans=1, pylons="2 pylons, 102 m", cost="≈943 tỷ VND (JBIC loan)",
    lat=20.8755, lng=106.6678,
    images=[img(U+"3/36/Bridge_in_Haiphong.jpg", "Teijo Hakala", "CC BY-SA 2.0", C+"Bridge_in_Haiphong.jpg")],
    sources=[W+"Binh_Bridge", LIST, OSM], confidence="needs_check",
    notes="Road code ĐT.359 is from OSM only. Opened 13/5/2005.")

add(id="cau-bach-dang", name_vi="Cầu Bạch Đằng", name_en="Bạch Đằng Bridge", status="completed",
    province="Hải Phòng – Quảng Ninh", province_former=["Hải Phòng", "Quảng Ninh"], crosses="Sông Bạch Đằng",
    roads=["CT.06"], construction_start=2015, opened=2018, main_span_m=240, total_length_m=3054,
    width_m=25, lanes=4, cable_stayed_spans=2, span_arrangement="110 + 240 + 240 + 110 m (cable-stayed unit ≈700 m)", pylons="3 pylons: centre ≈99.7 m, sides ≈94.5 m", cost="≈7,300–7,600 tỷ VND",
    lat=20.8478, lng=106.7655,
    images=[img(U+"7/71/B%E1%BA%A1ch_%C4%90%E1%BA%B1ng_Bridge_%2849534690148%29.jpg", "Not So Dusty (Flickr)", "CC BY 2.0", C+"B%E1%BA%A1ch_%C4%90%E1%BA%B1ng_Bridge_(49534690148).jpg")],
    sources=[W+"Bạch_Đằng_Bridge", "https://thanhtra.com.vn/nha-dat-57A4B2310/chinh-thuc-hop-long-cau-bach-dang-noi-quang-ninh-va-hai-phong-68E69BC0.html", "https://vsl.com/projects/bach-dang-bridge", "https://vov.vn/tin-24h/nhung-hinh-anh-thi-cong-cuoi-cung-tren-cau-bach-dang-805863.vov", "https://baolamdong.vn/cau-bach-dang-cong-trinh-day-vang-nhieu-nhip-hang-dau-the-gioi-noi-hai-phong-va-quang-ninh-454260.html", LIST, "main span 240 m: " + CC, OSM], confidence="verified",
    notes="Client chose 240 m (2026-11-25); client map measurement ≈235 m. Thanh Tra gives a 700 m cable-stayed main bridge, side spans (110+110) m and a 240 m river span; with VSL's ≈700 m this implies 110+240+240+110. en-Wikipedia article: 2 × 240 m; en-Wikipedia list: 250 × 2. VOV gives a 250 m wide navigation clearance, which conflicts with a 240 m span (it may be a channel width). No designer or investor document found. On the Hạ Long–Hải Phòng expressway (OSM CT.06). Opened 1/9/2018. The Commons photo is categorised as a Vietnamese cable-stayed bridge but is not explicitly located.")

add(id="cau-tran-thi-ly", name_vi="Cầu Trần Thị Lý", name_en="Trần Thị Lý Bridge", status="completed",
    province="Đà Nẵng", province_former=["Đà Nẵng"], crosses="Sông Hàn",
    roads=["Đường Trần Thị Lý"], construction_start=2009, opened=2013, main_span_m=230, total_length_m=731,
    width_m=34.5, cable_stayed_spans=1, span_arrangement="4 × 50 + 230 m (cầu chính 430 m); toàn cầu 4×50 + 230 + 45 + 4×50 + 30 + 26 = 731 m",
    pylons="1 inclined pylon, 145 m, leaning 12°", cost="497.7 tỷ VND (Wikipedia) / 1,709 tỷ VND (press, whole project)",
    lat=16.0504, lng=108.2300,
    images=[img(U+"2/2c/Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge_at_daytime.jpg", "Tycho (shansov.net)", "CC BY-SA 3.0", C+"Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge_at_daytime.jpg")],
    sources=["https://vecc.com.vn/project/cau-nguyen-van-troi-tran-thi-ly-thanh-pho-da-nang/?lang=en", "https://www.dccd.com/project/tran-thi-ly-bridge/", "https://itst.gov.vn/thanh-tuu-khcn-moi/doc-dao-cau-day-vang-ba-mat-phang/",
             "https://danang.gov.vn/vi/w/cau-tran-thi-ly-canh-buom-cang-gio-ra-bien-lon-i", "https://vi.wikipedia.org/wiki/C%E1%BA%A7u_Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD",
             W+"Trần_Thị_Lý_Bridge", LIST, "https://mia.vn/cam-nang-du-lich/cau-tran-thi-ly-da-nang-14983", "https://structurae.net/en/structures/nguyen-van-troi-tran-thi-ly-bridge"], confidence="verified",
    notes="Single-pylon asymmetric cable-stayed bridge. The cable-stayed unit is 4 × 50 m + 230 m (430 m, S1–S6) with the pylon at S5 (VECC general elevation; DCCD: '4 side spans of the main bridge at 50 m each… main span (cable-stayed) of 230 m'; ITST). Whole bridge 731 m. Pylon 145 m above sea level, 134 m above the deck, leaning 12° west; 33 main-span stays in one central plane and 30 back stays in two planes anchored at abutment S1 (ITST). Deck 34.5 m (VECC; 35.5 m elsewhere does not add up). Navigation clearance 50 × 7 m (VECC). Construction start is given as 2003 (press, whole project) or 2009 (Wikipedia). Opened 29/3/2013.")

add(id="cau-kien", name_vi="Cầu Kiền", name_en="Kiền Bridge", status="completed",
    province="Hải Phòng", province_former=["Hải Phòng"], crosses="Sông Cấm",
    roads=["QL10"], construction_start=2001, opened=2003, main_span_m=200, total_length_m=1186,
    cable_stayed_spans=1, lat=20.9134, lng=106.6236,
    images=[img(U+"8/8c/Kien_Bridge.jpg", "Phó Nháy", "Public domain", C+"Kien_Bridge.jpg")],
    sources=[W+"Kiền_Bridge", LIST, OSM], confidence="verified",
    notes="The Wikipedia infobox has inconsistent dates; the text gives inauguration on 28/9/2003.")

add(id="cau-ba-son", name_vi="Cầu Ba Son (Thủ Thiêm 2)", name_en="Ba Son Bridge", status="completed",
    province="TP. Hồ Chí Minh", province_former=["TP. Hồ Chí Minh"], crosses="Sông Sài Gòn",
    roads=["Đường Tôn Đức Thắng", "Đường R12 (Thủ Thiêm)"], construction_start=2015, opened=2022, main_span_m=200,
    total_length_m=885.7, lanes=6, cable_stayed_spans=1, pylons="1 inclined pylon, 113 m", lat=10.7808, lng=106.7088,
    images=[img(U+"a/a9/C%E1%BA%A7u_Ba_Son%2C_TP.HCM%2C_042022.jpg", "Prenn", "CC BY-SA 4.0", C+"C%E1%BA%A7u_Ba_Son,_TP.HCM,_042022.jpg")],
    sources=[W+"Ba_Son_Bridge", LIST, "https://vnexpress.net/hop-long-cau-thu-thiem-2-4350180.html", OSM], confidence="needs_check",
    notes="Formerly Thủ Thiêm 2 (renamed 12/2022). The 200 m span is from Wikipedia only and no press confirmation was found. Opened 28/4/2022.")

# ---------------- COMPLETED: extradosed ----------------
add(id="cau-ben-rung", name_vi="Cầu Bến Rừng", name_en="Bến Rừng Bridge", status="completed", structure_type="extradosed",
    province="Hải Phòng – Quảng Ninh", province_former=["Hải Phòng", "Quảng Ninh"], crosses="Sông Đá Bạch",
    roads=[], opened=2024, main_span_m=160, total_length_m=1865.3, width_m=21.5,
    cable_stayed_spans=2, span_arrangement="90 + 2 × 160 + 90 m", pylons="3 V-shaped pylons", cost="1,941 tỷ VND",
    lat=20.9728, lng=106.7703,
    sources=["https://tuoitre.vn/thong-cau-ben-rung-gan-2-000-ti-ket-noi-hai-phong-quang-ninh-20240717180405727.htm", "https://vneconomy.vn/gan-2-000-ty-dong-xay-dung-cau-ben-rung-noi-hai-phong-voi-quang-ninh.htm", "https://nhadautu.vn/pho-thu-tuong-le-van-thanh-bam-nut-khoi-cong-xay-dung-cau-ben-rung-noi-hai-phong--quang-ninh-d66089.html", "https://nominatim.openstreetmap.org (Cầu Bến Rừng)"], confidence="needs_check",
    notes="EXTRADOSED. Technical opening 17/7/2024. Construction start year not confirmed. Road code unknown. The main unit is given as ≈490 m or ≈500 m.")

add(id="cau-cua-hoi", name_vi="Cầu Cửa Hội", name_en="Cửa Hội Bridge", status="completed", structure_type="extradosed",
    province="Nghệ An – Hà Tĩnh", province_former=["Nghệ An", "Hà Tĩnh"], crosses="Sông Lam (cửa Hội)",
    roads=["Đường bộ ven biển"], construction_start=2019, opened=2021, main_span_m=153, width_m=18.5,
    span_arrangement="86 + 153 + 86 m", lat=18.7510, lng=105.7469,
    sources=["https://infra.global/projects/cua-hoi-bridge/", "https://vinwonders.com/vi/wonderpedia/news/cau-cua-hoi-bieu-tuong-ket-noi-nghe-an-va-ha-tinh/", OSM], confidence="needs_check",
    notes="EXTRADOSED. The 153 m main span comes from a single source (infra.global) and is borderline (just above 150). Inaugurated 14/3/2021.")

add(id="cau-thuan-an", name_vi="Cầu vượt cửa biển Thuận An", name_en="Thuận An Sea-mouth Bridge", status="completed", structure_type="extradosed",
    province="Huế", province_former=["Thừa Thiên Huế"], crosses="Cửa biển Thuận An (phá Tam Giang)",
    roads=["Đường bộ ven biển"], opened=2026, main_span_m=218, total_length_m=2360, width_m=20,
    pylons="A-shaped red pylons, ≈40 m", lat=16.5687, lng=107.6234,
    sources=["https://baolamdong.vn/chinh-thuc-thong-xe-cau-vuot-cua-bien-dai-nhat-mien-trung-tai-tp-hue-truoc-ngay-307-456100.html", "https://baodautu.vn/hue-hop-long-cau-vuot-cua-bien-thuan-an-d275266.html", OSM], confidence="needs_check",
    notes="EXTRADOSED. Technical opening 30/4/2026, official operation 30/7/2026. Construction start year not confirmed.")

# ---------------- UNDER CONSTRUCTION ----------------
add(id="cau-hoa-son", name_vi="Cầu Hòa Sơn", name_en="Hòa Sơn Bridge", status="under_construction",
    province="Phú Thọ", province_former=["Hòa Bình"], crosses="Hồ thủy điện Hòa Bình (sông Đà)",
    roads=["Cao tốc Hòa Bình – Mộc Châu"], construction_start=2025, opened=2028, main_span_m=550, total_length_m=1200,
    width_m=21, lanes=4, cable_stayed_spans=1, span_arrangement="40 + 40 + 150 + 550 + 150 + 40 + 40 m (main bridge 1,010 m)",
    pylons="2 inverted-Y 'mountain peak' pylons, 187 m", investor="Ban QLDA khu vực Hòa Bình", lat=20.78, lng=105.21,
    sources=["https://baolamdong.vn/cao-toc-10000-ty-hoa-binh-moc-chau-phan-dau-ve-dich-som-1-nam-va-ky-luc-cau-day-vang-424941.html", "https://nguoiquansat.vn/tay-bac-sap-co-cay-cau-moi-lap-ky-luc-viet-nam-quy-mo-3-100-ty-cam-hung-thiet-ke-tu-nui-rung-dia-phuong-298648.html", "https://baodauthau.vn/1-nha-thau-tham-du-goi-thau-xay-lap-cau-hoa-son-hon-5502-ty-post172897.html",
             "https://tedi.vn/le-ky-ket-hop-dong-goi-thau-goi-thautu-van-khao-sat-lap-thiet-ke-ky-thuat-va-du-toan-xay-dung-cong-trinh-cau-hoa-son-thuoc-du-an-cao-toc-hoa-binh-moc-chau-doan-tu-km19000-km53000-tre/",   # designer: spans, deck, girder, pylon form
             "https://tedi-gic.vn/cau-hoa-son-km40750-km41989-va-cao-toc-hoa-binh-moc-chau-doan-tu-km46000-km47500-tren-dia-ban-tinh-hoa-binh-tkkt/",   # chainage, spans, nav 50 × 7 m
             "https://baoxaydung.vn/lap-dat-sa-lan-lon-thi-cong-cau-co-2-ky-luc-tren-cao-toc-hoa-binh-moc-chau-192250604161040171.htm",   # 550 m / 187 m, contractor, renders
             "https://nguoiquansat.vn/huy-dong-thiet-bi-sieu-khong-lo-viet-nam-sap-hoan-thanh-cay-cau-day-vang-dai-nhat-ca-nuoc-nam-tren-tuyen-cao-toc-10-000-ty-o-khu-vuc-tay-bac-298966.html",   # progress 20/6/2026
             "https://baolamdong.vn/cau-hoa-son-tren-cao-toc-hoa-binh-moc-chau-cau-day-vang-nhip-chinh-dai-nhat-viet-nam-449235.html"], confidence="needs_check",   # foundations 6/2026
    notes="COORDINATES APPROXIMATE (±10 km): placed on the Hòa Bình reservoir near the Mai Châu bank; exact site (between Tiền Phong and Tân Thành communes) not mapped. Started 15/4/2025; completion target end-2028 (expressway target 2027). Would equal Cần Thơ (550 m) as the longest span in Vietnam. Total length 1,200 m is the press '≈1.2 km' (TEDI scope Km40+750 – Km41+989 ≈ 1,239 m; main cable-stayed bridge 1,010 m). Designer TEDI; contractor Trung Chính. Mid-6/2026: pylon foundations P8 42/45, P9 43/45 bored piles (D2.2 m, ≈85 m, in > 40 m of water). Stage 1: 4 lanes on a 21 m deck (final 6 lanes).")

add(id="cau-tu-lien", name_vi="Cầu Tứ Liên", name_en="Tứ Liên Bridge", status="under_construction",
    province="Hà Nội", province_former=["Hà Nội"], crosses="Sông Hồng",
    roads=[], construction_start=2025, opened=2027, main_span_m=500, total_length_m=1000, width_m=43,
    cable_stayed_spans=1, span_arrangement="50 + 200 + 500 + 200 + 50 m",
    pylons="2 tháp kim cương – hai chân đan chéo (chữ X) phía trên mặt cầu, tiếp tục thành hai cột song song nối bằng thanh giằng ngắn gần đỉnh, đỉnh lệch cao; đỉnh tháp +185,0 m",
    pylons_en="2 diamond-X pylons: legs cross above the deck and continue as two parallel posts with a short link near the top and staggered tops; top level +185.0 m",
    cost="≈20,100 tỷ VND", investor="Liên danh Vingroup (BT)",
    lat=21.0709, lng=105.8513,
    sources=["https://baolamdong.vn/cau-tu-lien-hon-20100-ty-dong-tien-do-thi-cong-va-lo-trinh-hop-long-nam-2027-455142.html", "https://cafef.vn/cau-day-vang-gan-20000-ty-dong-o-ha-noi-dang-thay-doi-dien-mao-the-nao-188261101071700319.chn",
             "https://vov.gov.vn/toan-canh-cau-tu-lien-bieu-tuong-moi-ben-song-hong-cua-ha-noi-dang-thanh-hinh-dtnew-1150575",   # general elevation drawing, deck, lanes
             "https://tienphong.vn/toan-canh-tien-do-sieu-du-an-cau-tu-lien-gan-20000-ty-dong-post1835217.tpo",   # 185 m, D2.5 m piles
             "https://soha.vn/sieu-cong-trinh-gan-20000-ty-dong-so-huu-thiet-ke-van-xoan-doc-dao-do-lien-danh-vingroup-cua-ty-phu-pham-nhat-vuong-xay-dat-tien-do-ra-sao-sau-hon-mot-nam-khoi-cong-198261112162043713.htm",   # progress end-10/2026
             OSM], confidence="verified",
    notes="Started 19/5/2025. Main-span closure target 30/7/2027, opening target 10/10/2027. Total length is for the main cable-stayed bridge only. Connects Tây Hồ (Nghi Tàm) and Đông Anh; road name not set. Progress end-10/2026: 26.85 %; pylons P37 6/37 lifts, P38 5/37. The 158 m / 60 m / 8-lane figures belong to the 2024 WATG 'dragon' competition scheme, not the built design.")

add(id="cau-dai-ngai-1", name_vi="Cầu Đại Ngãi 1", name_en="Đại Ngãi 1 Bridge", status="under_construction",
    province="Vĩnh Long – Cần Thơ", province_former=["Trà Vinh", "Sóc Trăng"], crosses="Sông Hậu",
    roads=["QL60"], construction_start=2025, opened=2028, main_span_m=450, cable_stayed_spans=1,
    pylons="2 A-shaped pylons (110 m or 164 m per source)", cost="≈3,900 tỷ VND (package)", investor="Bộ Xây dựng (Ban QLDA 85); contractor Đèo Cả",
    lat=9.7069, lng=106.1506,
    sources=["https://moc.gov.vn/vn/tin-tuc/1252/92886/day-nhanh-tien-do-cong-trinh-cau-dai-ngai-1-bac-qua-song-hau.aspx", "https://tienphong.vn/cau-dai-ngai-1-dat-hon-63-khoi-luong-phan-dau-thong-tuyen-trong-nam-2027-post1851319.tpo", "https://vneconomy.vn/bo-giao-thong-van-tai-neu-nguyen-nhan-lui-tien-do-cau-day-vang-lon-thu-2-viet-nam.htm", OSM], confidence="verified",
    notes="Construction from 12/1/2025. Completion target: 'thông tuyến 2027' (Tiền Phong) or 6/2028 (Đèo Cả package). Sources disagree on pylon height (110 m vs 164 m). Commons image 'Cầu Đại Ngãi 1.jpg' is tagged CC0, but its source is given as Báo Lao Động, so the free license is doubtful; it shows approach-viaduct construction and is categorised on Commons as an unidentified bridge.")

add(id="cau-cat-lai", name_vi="Cầu Cát Lái", name_en="Cát Lái Bridge", status="under_construction",
    province="TP. Hồ Chí Minh – Đồng Nai", province_former=["TP. Hồ Chí Minh", "Đồng Nai"], crosses="Sông Đồng Nai",
    roads=["Đường Nguyễn Thị Định", "ĐT.769B"], construction_start=2026, opened=2029, main_span_m=450, total_length_m=11600,
    lanes=8, cable_stayed_spans=1, pylons="2 pylons (two cable planes)", cost="≈20,600–24,000 tỷ VND", investor="Liên danh do CC1 dẫn đầu (PPP-BT)",
    lat=10.7547, lng=106.7900,
    sources=["https://vietnamnet.vn/en/vietnam-breaks-ground-on-1-4-billion-bridges-linking-hcmc-dong-nai-2560272.html", "https://www.vietnamplus.vn/khoi-cong-2-cau-chien-luoc-ket-noi-thanh-pho-dong-nai-thanh-pho-ho-chi-minh-post1138956.vnp", "https://e.vnexpress.net/photo/traffic/vietnam-unveils-794m-cable-bridge-design-linking-ho-chi-minh-city-to-long-thanh-airport-corridor-5015145.html", "https://moc.gov.vn/vn/tin-tuc/1184/90985/cau-cat-lai-18-300-ti-dong-noi-dong-nai--tp-ho-chi-minh-dong-tho-vao-ngay-151.aspx", OSM], confidence="needs_check",
    notes="Groundbreaking 15/1/2026; construction start 29/9/2026. VietnamPlus describes a 'composite steel girder', while VietnamNet and other sources say cable-stayed with a 450 m main span. Total length includes approaches. 55 m navigation clearance. Coordinates are the OSM proposed alignment.")

add(id="cau-ngoc-hoi", name_vi="Cầu Ngọc Hồi", name_en="Ngọc Hồi Bridge", status="under_construction",
    province="Hà Nội – Hưng Yên", province_former=["Hà Nội", "Hưng Yên"], crosses="Sông Hồng",
    roads=[], construction_start=2025, opened=2027, main_span_m=350, total_length_m=680, width_m=38.3,
    lanes=8, cable_stayed_spans=1, span_arrangement="165 + 350 + 165 m", pylons="2 H-shaped pylons, ≈126 m", cost="≈11,770–11,844 tỷ VND",
    investor="Ban QLDA ĐTXD các công trình giao thông TP. Hà Nội",
    lat=20.9600, lng=105.8950,
    sources=["https://cafef.vn/dai-cong-truong-cau-ngoc-hoi-sau-15-thang-thi-cong-188261103143452699.chn", "https://tienphong.vn/cau-ngoc-hoi-noi-ha-noi-voi-hung-yen-tang-toc-thi-cong-hai-tru-cau-thap-day-vang-post1817163.html", "https://tuoitre.vn/cong-truong-lam-cau-day-vang-hon-11-800-ti-dong-noi-ha-noi-va-hung-yen-20260128211946328.htm",
             "https://vncnec.com.vn/vi/du-an-dau-tu-xay-dung-cau-ngoc-hoi/", "https://baoxaydung.vn/phuong-an-kien-truc-cau-ngoc-hoi-doat-giai-nhat-co-gi-dac-biet-192250423083854733.htm",
             "https://nhandan.vn/anh-cau-ngoc-hoi-tang-toc-thi-cong-huong-toi-thong-xe-ky-thuat-truoc-apec-2027-post995411.html",
             "https://kenh14.vn/toan-canh-cau-day-vang-gan-12000-ty-dong-bac-qua-song-hong-tru-thap-cao-tuong-duong-toa-nha-40-tang-nhip-day-vang-350m-ket-noi-ha-noi-voi-sieu-san-van-dong-lon-thu-2-viet-nam-215261104074107024.chn"], confidence="needs_check",
    notes="COORDINATES APPROXIMATE: the exact river-crossing location was not found (the OSM 'Cầu Ngọc Hồi' is an old QL1 bridge). Started 19/8/2025; target 8/2027. 680 m is the main river bridge. 32.3 m between parapets, 38.3 m incl. stay anchorage (vncnec); approaches 33 m. Architecture: 'Cổng Mặt Trời', first prize, Công ty CP Tư vấn Thiết kế Cầu lớn – Hầm (approved 4/2025). Pylon piles 40 × Ø2.0 m × 75 m (T41).")

add(id="cau-long-hung", name_vi="Cầu Long Hưng", name_en="Long Hưng Bridge", status="under_construction",
    province="TP. Hồ Chí Minh – Đồng Nai", province_former=["TP. Hồ Chí Minh", "Đồng Nai"], crosses="Sông Đồng Nai",
    roads=[], construction_start=2026, opened=2029, main_span_m=350, total_length_m=9800, lanes=8,
    cable_stayed_spans=1, pylons="single cable plane; pylon 175 m", cost="≈12,700 tỷ VND", investor="PPP (CC1 consortium)",
    lat=10.8260, lng=106.8880,
    sources=["https://vietnamnet.vn/en/vietnam-breaks-ground-on-1-4-billion-bridges-linking-hcmc-dong-nai-2560272.html", "https://www.vietnamplus.vn/khoi-cong-2-cau-chien-luoc-ket-noi-thanh-pho-dong-nai-thanh-pho-ho-chi-minh-post1138956.vnp", "https://thuonghieucongluan.com.vn/dieu-chinh-von-dau-tu-cau-long-hung-len-hon-12-700-ty-dong-tang-toc-ket-noi-tp-hcm-dong-nai-a322300.html", "https://nominatim.openstreetmap.org (Dự án Cầu Long Hưng)"], confidence="needs_check",
    notes="Also called Cầu Đồng Nai 2. COORDINATES APPROXIMATE, between the OSM project points in Long Phước (HCMC) and An Phước (Đồng Nai). Groundbreaking 15/1/2026; construction start 29/9/2026. Total length includes approaches.")

add(id="cau-nguyen-trai", name_vi="Cầu Nguyễn Trãi", name_en="Nguyễn Trãi Bridge", status="under_construction",
    province="Hải Phòng", province_former=["Hải Phòng"], crosses="Sông Cấm",
    roads=[], construction_start=2024, opened=2027, main_span_m=300, total_length_m=1476, width_m=26.5, lanes=6,
    cable_stayed_spans=1, span_arrangement="125 + 300 + 125 m", pylons="2 sail pylons of three columns, 107.5 m above the pile cap", cost="≈6,200–6,300 tỷ VND",
    lat=20.8707, lng=106.6940,
    sources=["https://tedi.vn/khoi-cong-xay-dung-cau-nguyen-trai-do-tedi-thuc-hien-cong-tac-tu-van-thiet-ke/", "https://www.vietnam.vn/en/khoi-cong-xay-dung-cau-nguyen-trai",
             "https://baolamdong.vn/cau-nguyen-trai-hon-6200-ty-dong-tai-hai-phong-kien-truc-canh-buom-cao-ngang-toa-nha-40-tang-440415.html",
             "https://dantri.com.vn/thoi-su/hai-phong-khoi-cong-cau-nguyen-trai-bac-qua-song-cam-20241218182112695.htm",
             "https://duyenhailand.vn/cap-nhat-tien-do-xay-dung-cau-nguyen-trai-thang-4-2026-dat-32-phan-dau-ve-dich-thang-9-2027/",
             "https://daibieunhandan.vn/hai-phong-toan-canh-du-an-cau-nguyen-trai-va-vung-phu-can-hon-6-300-ty-dong-10425773.html", "https://vneconomy.vn/hai-phong-khoi-cong-xay-dung-cau-nguyen-trai-hon-6-200-ty-dong.htm", "https://tienphong.vn/cau-6300-ty-dong-noi-vung-loi-hai-phong-voi-khu-do-thi-moi-bac-song-cam-post1872017.tpo", OSM], confidence="needs_check",
    notes="Groundbreaking 18/12/2024. Main bridge: 3-span continuous cable-stayed 125 + 300 + 125 m (550.6 m) in a 1,476.4 m bridge (TEDI, designer); 26.5 m prestressed-concrete box deck, 4 motor + 2 mixed lanes, 80 km/h; channel 165 × 25 m. Pylons: two 'sail' towers of three columns (curved central mast + two inclined rear columns, steel bracing at three levels), 107.5 m above the pile cap (111 m in press). Stays: semi-fan, 120 cables: one central plane of 20 per side over the main span, two planes of 20 over each side span (TEDI). Pylon form confirmed by the official render supplied by the user (2026-11-27), the TEDI renders and the ground-breaking stage screen. Progress 4/2026 ≈32% (all 88 bored piles, T11 pylon pile cap); opening target 2/9/2027.")

add(id="cau-duong-sat-can-gio", name_vi="Cầu đường sắt vượt sông Soài Rạp (tuyến Bến Thành – Cần Giờ)", name_en="Soài Rạp rail bridge (Bến Thành – Cần Giờ line)",
    status="under_construction", usage=["metro"],
    province="TP. Hồ Chí Minh", province_former=["TP. Hồ Chí Minh"], crosses="Sông Soài Rạp",
    roads=[], railways=["Đường sắt Bến Thành – Cần Giờ"], construction_start=2025, opened=2028, main_span_m=360,
    total_length_m=920, cable_stayed_spans=1, investor="VinSpeed (BOO)", lat=10.6690, lng=106.7660,
    sources=["https://24hmoney.vn/news/sieu-do-thi-ty-usd-cua-vingroup-co-them-buoc-ngoat-c3a2848236.html", "https://danviet.vn/xuyen-dem-khoan-khao-sat-dia-chat-sau-80m-phuc-vu-sieu-du-an-metro-ben-thanh--can-gio-d1425010.html", "https://cafef.vn/duong-sat-toc-do-cao-ha-noi-quang-ninh-ben-thanh-can-gio-dong-loat-thi-cong-188261003183549843.chn"], confidence="needs_check",
    notes="Main span 360 m from a single article (22/10/2026); bored piling underway 10/2026. Navigation clearance 242 × 55 m. The line broke ground 19/12/2025; operation target Q4/2028 is for the whole line. COORDINATES APPROXIMATE: at the Nhà Bè – Bình Khánh boundary. Usage 'metro' vs 'rail' to be confirmed: the line is marketed as both a metro and a high-speed railway.")

add(id="cau-phuoc-an", name_vi="Cầu Phước An", name_en="Phước An Bridge", status="under_construction", structure_type="extradosed",
    province="TP. Hồ Chí Minh – Đồng Nai", province_former=["Bà Rịa – Vũng Tàu", "Đồng Nai"], crosses="Sông Thị Vải",
    roads=[], construction_start=2023, main_span_m=250, total_length_m=3514, width_m=27, lanes=6,
    cable_stayed_spans=1, span_arrangement="137.5 + 250 + 137.5 m", cost="≈4,900 tỷ VND",
    lat=10.6285, lng=106.9989,
    sources=["https://nguoiquansat.vn/cau-day-vang-gan-5-000-ty-co-tinh-khong-cao-nhat-viet-nam-nhip-chinh-dai-nhat-dong-nam-a-noi-nhip-2-tp-truc-thuoc-trung-uong-la-hanh-lang-van-tai-chien-luoc-307915.html", "https://nhandan.vn/can-canh-cau-phuoc-an-ket-noi-quan-trong-giua-thanh-pho-ho-chi-minh-va-dong-nai-dang-vuot-tien-do-post968305.html", "https://thuviennhadat.vn/bat-dong-san/cau-phuoc-an-du-kien-hoan-thanh-vao-nam-2027-16917.html",
             "https://cafef.vn/viet-nam-dang-xay-cay-cau-gan-5000-ty-dong-co-nhip-chinh-dai-250m-tru-thap-cao-tuong-duong-toa-nha-40-tang-nam-tren-truc-giao-thong-ket-noi-toi-sieu-do-thi-lan-bien-rong-2870-ha-cua-ty-phu-pham-nhat-vuong-188261027120348509.chn",   # spans 137.5 + 250 + 137.5, pylon ≈119 m, ≈70 % on 16/10/2026
             "https://thanhtra.com.vn/dau-tu-72A9E3223/cau-phuoc-an-sieu-du-an-1803-ty-dong-lap-ky-luc-nhip-dai-nhat-dong-nam-a-fd59ce4a6.html",   # 525 m, 60 m above deck, 5-web box, 48 stays, cap 48 × 26
             "https://trungnamec.com.vn/hop-long-nhip-chinh-cau-phuoc-an",   # main-span closure 24/7/2026
             OSM], confidence="needs_check",
    notes="EXTRADOSED (press calls it 'dây văng'), described as the longest extradosed span in SE Asia. Main span closed 24/7/2026; technical opening targeted end-2026 (no confirmation found by 28/11/2026), final completion 2027. Links Phú Mỹ (formerly BR-VT, now HCMC) and Nhơn Trạch (Đồng Nai). Main bridge 137.5 + 250 + 137.5 m (T37–T40); 'giọt nước' pointed-arch pylons ≈119 m (60 m above the deck); ≈70 % complete on 16/10/2026.")


add(id="cau-thuong-cat", name_vi="Cầu Thượng Cát", name_en="Thượng Cát Bridge", status="under_construction",
    province="Hà Nội", province_former=["Hà Nội"], crosses="Sông Hồng",
    roads=["Vành đai 3.5 Hà Nội"], construction_start=2025, opened=2027, main_span_m=270, total_length_m=5200, width_m=35,
    lanes=8, cable_stayed_spans=2, span_arrangement="120 + 2 × 270 + 120 m (780 m cable-stayed main bridge)", pylons="3 tháp chữ V hình cánh chim", cost="≈7,300 tỷ VND",
    lat=21.1030, lng=105.7455,
    sources=["https://baodauthau.vn/khoi-cong-cau-thuong-cat-hon-7000-ty-dong-bac-qua-song-hong-post186408.html",
             "https://danviet.vn/khoi-cong-cau-thuong-cat-buoc-tien-moi-cho-ha-tang-giao-thong-thu-do-d1368789.html",
             "https://vtv.vn/ha-noi-khoi-cong-du-an-cau-thuong-cat-ket-noi-bo-bac-song-hong-voi-trung-tam-thu-do-100251008113812543.htm",
             "https://tedi.vn/phuong-an-kien-truc-canh-chim-hoa-binh-cho-cau-thuong-cat/",
             "http://vov.vn/xa-hoi/cau-thuong-cat-lap-nhip-dam-dau-tien-tang-toc-thi-cong-3-tru-thap-post1351599.vov",
             "https://soha.vn/nhin-tu-tren-cao-cong-truong-xay-cay-cau-8-lan-xe-hon-7300-ty-dong-o-ha-noi-198261115112543869.htm",
             "https://cafef.vn/kien-truc-cau-thuong-cat-bi-nghi-giong-cau-thach-han-se-dieu-chinh-de-tao-khac-biet-188240403064544532.chn",
             "https://dantri.com.vn/thoi-su/kien-truc-cau-thuong-cat-o-ha-noi-bi-nghi-giong-cau-thach-han-1-o-quang-tri-20240130150755072.htm",
             "https://mekongasean.vn/chiem-nguong-phuong-an-dat-giai-nhat-thiet-ke-kien-truc-cau-thuong-cat-20434.html",
             "https://danviet.vn/lo-dien-vi-tri-3-tru-thap-chinh-cua-cau-thuong-cat-tren-song-hong-d1434160.html",
             "https://vtcnews.vn/toan-canh-cau-day-vang-hon-7-300-ty-dong-o-ha-noi-sau-gan-10-thang-thi-cong-ar1037024.html", OSM], confidence="verified",
    notes="Main (cable-stayed) bridge 780 m in 4 spans 120 + 270 + 270 + 120 m with 3 pylons, per the ground-breaking reports (Báo Đấu thầu, Dân Việt, 8/10/2025); confirmed by the user 2026-11-27. This supersedes the earlier client-confirmed 4 × 195 m (2026-11-25); the 2024 competition scheme was 100 + 2 × 200 + 100 m (600 m) before the city asked for a 270 m main span. Deck 35 m on the main bridge (31 m on the approaches), 8 lanes, prestressed-concrete box girder by balanced cantilever (TEDI). Pylons: 'Cánh chim Hòa bình' (dove wings), each a V of two separate blades leaning outward ≈15° from one pier; the centre pylon (P30) is ≈10 m taller than P29 / P31 (reported 102–107 m, 60–80 m above deck). Under construction (≈21% in 11/2026: P31 at tower segment 6/32, P29 at 3/32, P30 pile cap); started 8/10/2025, completion target end of 2027. Total length 5.2 km includes approaches (main bridge + approaches ≈3.9 km). Runs from Kỳ Vũ road (Thượng Cát) to QL23B (Thiên Lộc).")


add(id="cau-may-chai", name_vi="Cầu Máy Chai (Cầu Hoàng Gia)", name_en="Máy Chai (Hoàng Gia) Bridge", status="completed",
    province="Hải Phòng", province_former=["Hải Phòng"], crosses="Sông Cấm",
    roads=["Đường Lê Thánh Tông", "Đảo Vũ Yên"], construction_start=2023, opened=2025, main_span_m=200, total_length_m=2200,
    width_m=21, lanes=4, cable_stayed_spans=1, pylons="2 yellow arch-shaped pylons (two curved legs each), 89 m, leaning toward the river; 24 stays per pylon",
    investor="Vingroup", cost="≈2,300 tỷ VND", lat=20.8737, lng=106.7142,
    sources=["https://cafef.vn/cau-2300-ty-dong-do-vingroup-cua-ty-phu-pham-nhat-vuong-dau-tu-xac-lap-ky-luc-chua-tung-co-ve-toc-do-xay-dung-cong-trinh-bac-qua-song-cam-188260730105702738.chn", "https://www.vtcnews.vn/hai-phong-khanh-thanh-cau-hoang-gia-hon-2-300-ty-dong-bac-qua-song-cam-ar960522.html", "https://tienphong.vn/lo-dien-hinh-hai-cau-hoang-gia-gan-2000-ty-bac-qua-song-cam-hai-phong-post1663183.tpo", "https://nominatim.openstreetmap.org (Cầu Máy Chai / Cầu Hoàng Gia)"], confidence="needs_check",
    notes="Also called cầu Hoàng Gia; links Vũ Yên island (Vinhomes Royal Island) to Máy Chai / Gia Viên (Lê Thánh Tông road). Started 9/2023; opened to traffic 15/7/2025 and inaugurated 19/8/2025. Main span 200 m with a steel deck, per press. CafeF's segment count (16 × 10 m + 5.8 m) does not add up to 200 m. Side spans not published. Coordinates are midway between the OSM bridge-way points.")


add(id="cau-cua-lon", name_vi="Cầu Cửa Lớn (cao tốc Cà Mau – Đất Mũi)", name_en="Cửa Lớn Bridge (Cà Mau – Đất Mũi Expressway)", status="under_construction",
    province="Cà Mau", province_former=["Cà Mau"], crosses="Sông Cửa Lớn",
    roads=["Cao tốc Cà Mau – Đất Mũi"], construction_start=2025, opened=2028, main_span_m=250, total_length_m=1500, lanes=4,
    cable_stayed_spans=1, investor="Bộ Quốc phòng (Binh đoàn 12 thi công)", lat=8.7546, lng=104.9906,
    sources=["main span 250 m: client-confirmed 2026-11-26", "https://baolamdong.vn/cao-toc-ca-mau-dat-mui-59-000-ty-dong-tuyen-duong-so-huu-cau-vuot-bien-dai-nhat-viet-nam-447122.html", "https://nguoiquansat.vn/cao-toc-59-000-ty-cua-dbscl-se-so-huu-nhieu-cau-vuot-song-quy-mo-va-ket-noi-den-cau-vuot-bien-dai-nhat-viet-nam-296881.html", "https://diendandoanhnghiep.vn/ca-mau-dong-loat-khoi-cong-khanh-thanh-nhieu-cong-trinh-trong-diem-10159869.html", "https://www.vietnamplus.vn/huy-dong-3000-nhan-luc-gap-rut-thi-cong-du-an-cao-toc-duong-ra-dao-hon-khoai-post1136303.vnp", "https://nominatim.openstreetmap.org (Sông Cửa Lớn)"], confidence="needs_check",
    notes="Cable-stayed bridge ≈1.5 km over the Cửa Lớn river near the end of the Cà Mau – Đất Mũi expressway (≈81 km, 4 lanes; groundbreaking 19/8/2025; target end-2028). Main span 250 m is client-confirmed and has no press source. Construction start of the bridge itself is unconfirmed: press reports equipment being mobilised for Cửa Lớn (2026), so construction_start is the expressway year. Expressway CT code not found. COORDINATES APPROXIMATE (±10 km): the river centroid near Năm Căn, not the surveyed alignment. No render or bridge photo found.")

# ---------------- PLANNED ----------------

add(id="cau-phu-my-2", name_vi="Cầu Phú Mỹ 2", name_en="Phú Mỹ 2 Bridge", status="planned",
    province="TP. Hồ Chí Minh – Đồng Nai", province_former=["TP. Hồ Chí Minh", "Đồng Nai"], crosses="Sông Nhà Bè",
    roads=["Đường Nguyễn Hữu Thọ", "Đường Liên Cảng – 25C"], construction_start=2026, opened=2029, main_span_m=450,
    total_length_m=6300, width_m=33.5, lanes=8, cable_stayed_spans=1, span_arrangement="210 + 450 + 210 m (870 m stayed unit; contractor Bắc Trung Nam)",
    pylons="2 symmetric pylons, fan stays in 2 planes", investor="Masterise Hạ tầng Phú Mỹ (PPP-BT)", cost="≈23,186 tỷ VND",
    lat=10.7050, lng=106.7700,
    sources=["https://bactrungnam-vn.com/cau-phu-my-2-dong-nai/",
             "https://baodautu.vn/thong-nhat-tinh-khong-thong-thuyen-cau-chinh-phu-my-2-cao-55-m-rong-250-m-d569257.html",
             "https://thanhnien.vn/lo-dien-thiet-ke-cau-phu-my-2-noi-tphcm-dong-nai-185260411113038756.htm",
             "https://tuoitre.vn/plo/kien-truc-doc-dao-cua-cau-phu-my-2-post903737.html",
             "https://cafeland.vn/tin-tuc/toan-canh-vi-tri-xay-cau-phu-my-2-sau-dong-tho-khu-vuc-nay-dang-ra-sao-150579.html",
             "https://cafef.vn/cay-cau-dai-63km-quy-mo-8-lan-xe-so-huu-day-vang-tinh-khong-cao-bac-nhat-viet-nam-ket-noi-voi-sieu-du-an-16-ty-usd-18826091314280457.chn"],
    confidence="needs_check",
    notes="Span arrangement 210 + 450 + 210 m (main span 450 m) from the contractor page (Bắc Trung Nam), adopted by client decision 2026-11-26; replaces the earlier 350 m client estimate. Known: TEDI–BR design PM02 won the architectural competition (HCMC decision, 4/2026); cable-stayed main bridge ≈870 m with 2 symmetric pylons, 2 cable planes, steel–concrete composite girder, deck ≈33.5 m, 8 lanes; navigation channel 250 × 55 m (Ministry of Construction, channel shifted ≈340 m toward Đồng Nai). Route ≈6.3 km (4.6 km HCMC, 1.7 km Đồng Nai) from Nguyễn Hữu Thọ (Nhà Bè) to Liên Cảng – 25C (Đại Phước). Groundbreaking 15/1/2026 (taken as construction_start); completion target 2029. COORDINATES APPROXIMATE (on the Nhà Bè river between Nhà Bè and Đại Phước).")

add(id="cau-can-gio", name_vi="Cầu Cần Giờ", name_en="Cần Giờ Bridge", status="planned",
    province="TP. Hồ Chí Minh", province_former=["TP. Hồ Chí Minh"], crosses="Sông Soài Rạp",
    roads=["Đường 15B (Nhà Bè)", "Đường Rừng Sác"], opened=2029, main_span_m=350, total_length_m=6300, lanes=6,
    cable_stayed_spans=1, pylons="2 pylons, ≈100 m", cost="≈13,200 tỷ VND", investor="Masterise Group (PPP-BT)",
    lat=10.6720, lng=106.7690,
    sources=["https://tuoitre.vn/dong-tho-cau-can-gio-dinh-hinh-trung-tam-ha-tang-moi-cua-tp-hcm-20260115061754127.htm", "https://vneconomy.vn/chinh-thuc-khoi-cong-cau-can-gio-tao-don-bay-thuc-day-phat-trien-vung-loi-vinh-tien.htm", W+"Cần_Giờ_Bridge", "https://nguoiquansat.vn/sap-khoi-cong-xay-dung-cay-cau-day-vang-hon-11-000-ty-lon-nhat-thanh-pho-giau-nhat-viet-nam-216171.html", "status planned: " + CC], confidence="needs_check",
    notes="Status 'planned' per client decision. Groundbreaking (động thổ) was 15/1/2026; actual construction start not confirmed. Main span 350 m (some articles say 360 m, which may be confused with the parallel rail bridge). Opening target 6/2029. COORDINATES APPROXIMATE (near the Bình Khánh ferry).")

add(id="cau-can-tho-2", name_vi="Cầu Cần Thơ 2", name_en="Cần Thơ 2 Bridge", status="planned", usage=["road", "rail"],
    province="Cần Thơ – Vĩnh Long", province_former=["Cần Thơ", "Vĩnh Long"], crosses="Sông Hậu",
    roads=["CT.01"], railways=["Đường sắt TP.HCM – Cần Thơ"], construction_start=2028, opened=2031, main_span_m=450,
    width_m=30.5, lanes=6, cable_stayed_spans=1, span_arrangement="210 + 450 + 210 m", cost="≈27,050 tỷ VND (preliminary)",
    investor="Bộ Xây dựng (Ban QLDA Mỹ Thuận)", lat=9.9992, lng=105.8338,
    sources=["https://cafef.vn/cau-can-tho-2-hon-27000-ty-dong-du-kien-khoi-cong-nam-2027-188261008163003601.chn", "https://baodautu.vn/phan-dau-khoi-cong-xay-dung-cau-can-tho-2-von-28500-ty-dong-vao-nam-2027-d388354.html", "https://thesaigontimes.vn/nghien-cuu-xay-cau-can-tho-voi-sau-lan-xe/", OSM], confidence="needs_check",
    notes="Double-deck road + double-track rail (1,435 mm). Investment approval still pending. Approaches start Q4/2027 and the main bridge Q2/2028 (construction_start is that planned main-bridge year). Earlier options had a 550 m span. Rail line name assumed; to confirm. Coordinates are the OSM proposed alignment.")

add(id="cau-dong-nai-gia-nghia-bao-lam", name_vi="Cầu vượt sông Đồng Nai (đường động lực Gia Nghĩa – Bảo Lâm)", name_en="Đồng Nai River Bridge (Gia Nghĩa – Bảo Lâm road)",
    status="planned", province="Lâm Đồng", province_former=["Đắk Nông", "Lâm Đồng"], crosses="Sông Đồng Nai",
    roads=["Đường động lực Gia Nghĩa – Bảo Lâm"], opened=2029, main_span_m=350, total_length_m=1166.8,
    cable_stayed_spans=1, pylons="single cable plane", cost="2,850 tỷ VND (whole 8.87 km road)", investor="Ban QLDA ĐTXD số 3 (Lâm Đồng)",
    lat=11.90, lng=107.72,
    sources=["https://tienphong.vn/lam-dong-duyet-du-an-lam-duong-xay-cau-day-vang-vuot-song-gan-3000-ty-dong-post1872499.tpo", "https://moc.gov.vn/vn/tin-tuc/1232/96640/lam-dong-dau-tu-2-850-ty-dong-xay-dung-tuyen-duong-dong-luc-gia-nghia---bao-lam.aspx", "https://nguoiquansat.vn/tinh-rong-nhat-viet-nam-sap-xay-cau-day-vang-vuot-song-nhip-chinh-dai-350m-313529.html"], confidence="needs_check",
    notes="Project approved; implementation 2026–2029; design contract awarded (BRITEC–CCU). COORDINATES VERY APPROXIMATE (±15 km): the route runs between Đông Gia Nghĩa ward and Bảo Lâm 5 commune. Bridge has no official name yet.")


# ---------------- 3D MODEL PARAMETERS (schematic) ----------------
# confidence "verified" only when spans, pylon shape/height and cable layout all come from a source;
# anything read off photos/renders or derived (e.g. side spans = (unit length - main)/2) is "estimated".
def m3d(spans, shape, heights, ref, planes, pattern, deck_w, deck_type=None, conf="estimated", notes="", cps=None, approach=None, extradosed=None):
    d = {"spans_m": spans, "pylon_shape": shape, "pylon_heights_m": heights, "pylon_height_ref": ref,
         "cable_planes": planes, "cable_pattern": pattern}
    if cps: d["cables_per_side"] = cps
    d["deck_width_m"] = deck_w
    if deck_type: d["deck_type"] = deck_type
    if approach: d["approach_length_m"] = approach
    if extradosed: d["extradosed"] = True
    d["confidence"] = conf
    if notes: d["notes"] = notes
    return d

M3D = {
 "cau-can-tho": m3d([40, 40, 150, 550, 150, 40, 40], "inverted_Y", [175.3, 175.3], "total", 2, "semi_fan", 26.0, "steel",
    notes="Spans and 175.3 m pylon height from the mageba reference sheet. Inverted-Y pylons and fan stays confirmed on Commons photos (one press site wrongly says 'H'). Deck: steel box girder in the 550 m span (210 m central part in steel), concrete in the side spans; deck width 23.1–26 m by source."),
 "cau-vam-cong": m3d([210, 450, 210], "H", [147, 147], "total", 2, "fan", 24.5, "composite",
    notes="Spans 210 + 450 + 210, no auxiliary piers (design paper: intermediate pier eliminated). Improved-H pylons, 143.9 m above the foundation top (Lee & Kang 2013 / TEDI; 147 m drawn from the water). Composite steel–concrete girder (KoreaScience), 24.5 m deck. Geometry in research/shapes/cau-vam-cong.json (round 9)."),
 "cau-bai-chay": m3d([129, 435, 129], "single", [150, 150], "total", 1, "semi_fan", 25.0, "concrete",
    notes="Single-plane prestressed-concrete box girder (sources). Side spans 129 m from engineering literature memory, not a fetched source. Pylon height uses the Wikipedia infobox 'Height 150 m'."),
 "cau-phu-my": m3d([162.5, 380, 162.5], "H", [145, 145], "total", 2, "semi_fan", 27.0, "concrete",
    notes="162.5+380+162.5 = 705 m (Wikipedia list / JPCI). H pylons per press. Height 145 m per Wikipedia (Người Quan Sát says 162.5 m, which is probably the side span confused with height)."),
 "cau-binh-khanh": m3d([187.25, 375, 187.25], "H", [155, 155], "total", 2, "fan", 30.35,
    notes="Placeholder; replaced by research/shapes/cau-binh-khanh.json (round 7)."),
 "cau-my-thuan": m3d([150, 350, 150], "H", [121, 121], "total", 2, "semi_fan", 23.66, "concrete", cps=16,
    notes="Spans 150 + 350 + 150 (TEDI), no auxiliary piers. H pylons 123.5 m above the pile-cap top and 84.43 m above the deck (TEDI); ≈120 m above high water (press), drawn ≈121 m above the water. 128 stays = 16 per side per plane. Concrete girder, 23.66 m deck. Geometry in research/shapes/cau-my-thuan.json (round 10)."),
 "cau-my-thuan-2": m3d([150, 350, 150], "inverted_Y", [125, 125], "total", 2, "semi_fan", 28.0, "concrete",
    notes="Spans 150+350+150 (Wikipedia list; press '650 m' = whole unit). Inverted-Y pylons read from press photos (SGGP 2023). Pylon height not published (estimated). Deck 25–28 m by source."),
 "cau-cao-lanh": m3d([150, 350, 150], "H", [120, 120], "total", 2, "semi_fan", 24.5, "concrete", conf="verified",
    notes="Spans, H-shaped 120 m towers and deck width per Wikipedia. Cable pattern (semi-fan) from photos."),
 "cau-nhat-tan": m3d([150, 300, 300, 300, 300, 150], "A", [110, 110, 110, 110, 110], "total", 2, "fan", 33.2, "composite",
    notes="150+4×300+150 m, five A-shaped pylons ≈110 m (Wikipedia). Steel–concrete composite girder. Fan pattern from photos."),
 "cau-phuoc-khanh": m3d([149.5, 300, 149.5], "H", [135.8, 135.8], "total", 2, "semi_fan", 21.75,
    notes="Spans 149.5+300+149.5 and pylon 135.8 m from the foundations (VEC); the press 155 m is Bình Khánh's. Geometry in research/shapes/cau-phuoc-khanh.json (round 7)."),
 "cau-rach-mieu": m3d([117, 270, 117], "inverted_Y", [110, 110], "total", 2, "fan", 12.0, "concrete",
    notes="Spans 117+270+117 (Wikipedia). Inverted-Y (A with single head) pylons and fan stays read from Commons photos. Pylon height estimated; the Wikipedia 'height 117 m' looks like the side span."),
 "cau-rach-mieu-2": m3d([120, 270, 120], "H", [113, 113], "total", 2, "semi_fan", 21.5, "concrete",
    notes="Spans 120 + 270 + 120 (Tạp chí GTVT). H pylons with one upper strut (VnExpress hợp long photos, 4/2025); no auxiliary piers."),
 "cau-binh": m3d([100, 260, 100], "inverted_Y", [101.6, 101.6], "total", 2, "fan", 22.5, "composite",
    notes="260 m main span; side spans estimated. Pylon height 101.6 m and composite steel–concrete girder per press. Pylon shape read from photos."),
 "cau-bach-dang": m3d([110, 240, 240, 110], "H", [94.5, 99.74, 94.5], "total", 2, "semi_fan", 25.0, "concrete",
    notes="110+240+240+110 per Thanh Tra / VSL ≈700 m unit (240 m client-confirmed). Pylon heights per Báo Lâm Đồng (centre ≈99.7 m, sides 94.5 m). H shape per Wikipedia. Cable planes/pattern and deck type estimated."),
 "cau-tran-thi-ly": m3d([200, 230], "single", [145], "total", 1, "semi_fan", 34.5, "concrete", conf="verified", cps=33,
    notes="4 × 50 + 230 m stayed unit with the pylon at S5 (VECC, DCCD). Single 145 m pylon (134 m above deck) leaning 12° west. 33 main stays in one central plane, 2 × 15 back stays (ITST)."),
 "cau-kien": m3d([85, 200, 85], "H", [80, 80], "total", 2, "harp", 16.0,
    notes="200 m main span; harp stays per Wikipedia. Side spans, pylon shape/height and deck width estimated from photos."),
 "cau-ba-son": m3d([200, 115], "other", [113], "total", 2, "fan", 27.5, "composite",
    notes="Asymmetric: 200 m main span (steel–concrete composite) + 115 m concrete back span; deck 27–28 m; pylon 110 m (WSP) / 113 m (Freyssinet, press). WSP calls it a 'backward sloping and curved pylon'. Pylon form, lean and stay layout measured off Commons photos; see pylon_custom."),
 "cau-ben-rung": m3d([90, 160, 160, 90], "other", [18, 18, 18], "above_deck", 2, "harp", 21.5, "concrete", extradosed=True,
    notes="Extradosed 90+2×160+90 m (press). Three pairs of red V-shaped low pylons ('V – Victory'). Pylon height above deck estimated from photos (≈18 m)."),
 "cau-cua-hoi": m3d([86, 153, 86], "other", [18, 18], "above_deck", 1, "harp", 18.5, "concrete", extradosed=True,
    notes="Extradosed 86+153+86 m (infra.global). Low red pylons; one central plane assumed from press aerials. Pylon height estimated."),
 "cau-thuan-an": m3d([120, 218, 120], "A", [32, 32], "above_deck", 1, "harp", 23.5, "concrete", extradosed=True,
    notes="Extradosed main span 218 m; A-topped red pylons 32 m above deck (72 m from water) per Người Quan Sát. Side spans and the single central cable plane estimated from photos. Number of extradosed spans unclear."),
 # fallback only: research/shapes/cau-hoa-son.json (pass 2) wins; kept in step with it (round 9)
 "cau-hoa-son": m3d([40, 40, 150, 550, 150, 40, 40], "inverted_Y", [187, 187], "total", 2, "fan", 21.0, "composite", cps=22,
    notes="Main bridge (40 + 40 + 150 + 550 + 150 + 40 + 40) m, L = 1,010 m (TEDI); 550 m main span, 187 m inverted-Y 'mountain peak' pylons (press). 21.0 m hybrid PC / steel-composite deck. 22 stays per side per plane (estimated)."),
 "cau-tu-lien": m3d([250, 500, 250], "other", [185, 185], "total", 2, "semi_fan", 43.0, "steel", cps=19,
    notes="1,000 m main bridge, 50 + 200 + 500 + 200 + 50 m with an auxiliary pier in each side span (VOV general elevation), 185 m pylons (top level +185.0), 43 m steel deck. Diamond-X pylons per the official render: legs cross above the deck and continue as two parallel posts with a short link near the top and staggered tops. 19 stays per side per plane at 12 m (152 total). Deck levels +24.5 (ends) / +25.6 (pylons) / +26.2 (mid-span); water modelled at datum 0 (dry season ≈ +1 to +3). Round 8: diamond-X pylon, spans/aux piers/stays from the VOV general elevation drawing; the earlier 'client feedback 11/2026' reading (legs merging into two twisted blades, 170/155 m tops) is superseded by the user's official render."),
 "cau-dai-ngai-1": m3d([210, 450, 210], "A", [110, 110], "above_deck", 2, "fan", 21.5, "composite",
    notes="210+450+210 m, A-shaped pylons 110 m above deck, composite steel girder (Báo Đầu tư). Fan pattern from the render. Another source gives 164 m total height."),
 "cau-cat-lai": m3d([190, 450, 190], "inverted_Y", [170, 170], "total", 2, "fan", 38.0, "composite",
    notes="Spans 190–450–190 m and a ≥230 × 55 m navigation clearance (cafeland.vn). Two cable planes (press). Pylon height and deck width (8 lanes) estimated. Inverted-Y pylons read from the VnExpress render (1/2026)."),
 "cau-duong-sat-can-gio": m3d([280, 360, 280], "other", [130, 130], "total", 2, "semi_fan", 14.0,
    notes="920 m cable-stayed bridge with a 360 m span (24hMoney). Side spans derived. Pylon shape/height and deck width (double-track) unknown; placeholder values."),
 "cau-ngoc-hoi": m3d([165, 350, 165], "H", [126, 126], "total", 2, "semi_fan", 33.0,
    notes="Spans 165 + 350 + 165 m (vncnec). H-shaped pylons ≈126 m (press). Deck 38.3 m incl. stay anchorage (vncnec)."),
 "cau-long-hung": m3d([175, 350, 175], "single", [175, 175], "total", 1, "fan", 38.0,
    notes="350 m span, single cable plane, 175 m pylons (VietnamNet EN). Side spans and deck width (8 lanes) estimated. Single-mast pylons from renders."),
 "cau-nguyen-trai": m3d([125, 300, 125], "H", [111, 111], "total", 2, "semi_fan", 26.5,
    notes="125+300+125 m, pylons 111 m, deck 26.5 m (press). Pylon shape and cable pattern not published (placeholder 'H')."),
 "cau-phuoc-an": m3d([137.5, 250, 137.5], "other", [119, 119], "total", 2, "semi_fan", 27.0, "concrete", extradosed=True, cps=12,
    notes="Placeholder; replaced by research/shapes/cau-phuoc-an.json (round 9)."),
 "cau-thuong-cat": m3d([120, 270, 270, 120], "other", [70, 80, 70], "above_deck", 2, "semi_fan", 35.0, "concrete",
    notes="Placeholder; replaced by research/shapes/cau-thuong-cat.json (round 2)."),
 "cau-can-tho-2": m3d([210, 450, 210], "H", [160, 160], "total", 2, "semi_fan", 30.5, "steel",
    notes="210+450+210 m, 30.5 m deck, double-deck road-over-rail (CafeF). H-like pylons and steel truss girder read from the CafeF render. Pylon height estimated."),
 "cau-can-gio": m3d([150, 350, 150], "other", [100, 100], "total", 2, "fan", 30.0,
    notes="350 m span (2019 approval). The design changed from one 230 m pylon to two 'mangrove' (cây đước) pylons ≈100 m (press). Side spans and deck width (6 lanes) estimated. Pylon shape per Tuổi Trẻ render (1/2026)."),
 "cau-dong-nai-gia-nghia-bao-lam": m3d([175, 350, 175], "single", [150, 150], "total", 1, "fan", 20.0,
    notes="350 m span, single cable plane, ≈1,167 m bridge (press). Side spans, pylon height and deck width estimated from the Người Quan Sát render."),
}

# ---------------- PRESS / RENDER IMAGES (license "unknown": shown as link only) ----------------
def press(url, credit, src, what):
    return {"url": url, "credit": credit, "license": "unknown", "source": src, "_what": what}

PRESS = {
 "cau-hoa-son": [
    press("https://tedi.vn/wp-content/uploads/2024/05/hoason.jpg", "TEDI", "https://tedi.vn/le-ky-ket-hop-dong-goi-thau-goi-thautu-van-khao-sat-lap-thiet-ke-ky-thuat-va-du-toan-xay-dung-cong-trinh-cau-hoa-son-thuoc-du-an-cao-toc-hoa-binh-moc-chau-doan-tu-km19000-km53000-tre/", "official render"),
    press("https://daknong.1cdn.vn/thumbs/1200x630/2026/02/16/img_6067e82a.jpeg", "Báo Lâm Đồng", "https://baolamdong.vn/cao-toc-10000-ty-hoa-binh-moc-chau-phan-dau-ve-dich-som-1-nam-va-ky-luc-cau-day-vang-424941.html", "render"),
    press("https://nqs.1cdn.vn/thumbs/1200x630/2026/06/18/16C5_cau-hoa-son-17817714084611872675758-0-6-563-907-crop-17817714775621826758988.jpg", "Người Quan Sát", "https://nguoiquansat.vn/tay-bac-sap-co-cay-cau-moi-lap-ky-luc-viet-nam-quy-mo-3-100-ty-cam-hung-thiet-ke-tu-nui-rung-dia-phuong-298648.html", "render")],
 "cau-tu-lien": [
    press("https://daknong.1cdn.vn/thumbs/1200x630/2026/07/23/img_afa3cf01.jpg", "Báo Lâm Đồng", "https://baolamdong.vn/cau-tu-lien-hon-20100-ty-dong-tien-do-thi-cong-va-lo-trinh-hop-long-nam-2027-455142.html", "render"),
    press("https://cafefcdn.com/thumb_w/1200/203337114487263232/2026/11/1/avatar1793492171852-17934921724821426072177.jpg", "CafeF / Hà Nội Mới", "https://cafef.vn/cau-day-vang-gan-20000-ty-dong-o-ha-noi-dang-thay-doi-dien-mao-the-nao-188261101071700319.chn", "construction 11/2026"),
    press("https://admin.vov.gov.vn/UploadFolder/KhoTin/Images/UploadFolder/VOVVN/Images/sites/default/files/styles/large_watermark/public/2026-06/cau_tu_lien_ve_dich_22_0.jpg", "VOV", "https://vov.gov.vn/toan-canh-cau-tu-lien-bieu-tuong-moi-ben-song-hong-cua-ha-noi-dang-thanh-hinh-dtnew-1150575", "render"),
    press("https://admin.vov.gov.vn/UploadFolder/KhoTin/Images/UploadFolder/VOVVN/Images/sites/default/files/styles/large/public/2026-06/cau_tu_lien.jpg", "VOV", "https://vov.gov.vn/toan-canh-cau-tu-lien-bieu-tuong-moi-ben-song-hong-cua-ha-noi-dang-thanh-hinh-dtnew-1150575", "general elevation")],
 "cau-dai-ngai-1": [
    press("https://media.baodautu.vn/thumb_x470x250/Images/anhminh/2024/12/04/he-lo-nha-thau-thi-cong-sieu-cau-day-vang-dai-ngai-1-tri-gia-3900-ty-dong1733300762.jpg", "Báo Đầu tư", "https://baodautu.vn/he-lo-nha-thau-thi-cong-sieu-cau-day-vang-dai-ngai-1-tri-gia-3900-ty-dong-d231683.html", "render"),
    press("https://cdn.daidoanket.vn/1200x630/uploaded/images/2026/03/18/e3af5231-140e-4454-aa79-b6fdb4a3625f.jpg", "Báo Đại Đoàn Kết", "https://daidoanket.vn/can-canh-cong-trinh-cau-day-vang-co-nhip-chinh-dai-thu-2-viet-nam.html", "construction 3/2026")],
 "cau-cat-lai": [
    press("https://i1-vnexpress.vnecdn.net/2026/01/29/gen-h-z7480267955959-ba79feb88a7a279aae8ce8175156fea7-1769679191-1769686927-1769696745.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=AcNEih9NX7kBNJoD0LwqfQ", "VnExpress (Đồng Nai Dept. of Construction render)", "https://e.vnexpress.net/photo/traffic/vietnam-unveils-794m-cable-bridge-design-linking-ho-chi-minh-city-to-long-thanh-airport-corridor-5015145.html", "render")],
 "cau-long-hung": [
    press("https://static-images.vnncdn.net/vps_images_publish/000001/00000Q/2026/9/30/vietnam-breaks-ground-on-14-billion-bridges-linking-hcmc-dong-nai-0357762bb0234c268c395c13c735948d-1011.jpg?width=0&s=-bm-9gfs17Ugs-fpazsM4A", "VietnamNet", "https://vietnamnet.vn/en/vietnam-breaks-ground-on-1-4-billion-bridges-linking-hcmc-dong-nai-2560272.html", "render"),
    press("https://media.thuonghieucongluan.vn/resize_1200x630/uploads/2026/06/12/lay-1-1781221565.jpg", "Thương hiệu & Công luận", "https://thuonghieucongluan.com.vn/dieu-chinh-von-dau-tu-cau-long-hung-len-hon-12-700-ty-dong-tang-toc-ket-noi-tp-hcm-dong-nai-a322300.html", "render (earlier design option)")],
 "cau-duong-sat-can-gio": [
    press("https://cdn.24hmoney.vn/upload/images/2026-4/article_avatar_img/2026-10-22/a-nh-ma-n-hi-nh-2026-10-22-lu-c-10-1792639623-width698height391-auto-crop-1792639635-width698height391.jpg", "24hMoney", "https://24hmoney.vn/news/sieu-do-thi-ty-usd-cua-vingroup-co-them-buoc-ngoat-c3a2848236.html", "construction 10/2026 (Soài Rạp foundations)")],
 "cau-ngoc-hoi": [
    press("https://cafefcdn.com/thumb_w/1200/203337114487263232/2026/11/3/avatar1793691258906-17936912655082071358607.jpg", "CafeF / Hà Nội Mới", "https://cafef.vn/dai-cong-truong-cau-ngoc-hoi-sau-15-thang-thi-cong-188261103143452699.chn", "construction 11/2026"),
    press("https://cdn2.tuoitre.vn/zoom/1200_630/471584752817336320/2026/1/28/9qa-1769609411334699323452-91-0-1406-2511-crop-1769609435273630389189.jpg", "Tuổi Trẻ", "https://tuoitre.vn/cong-truong-lam-cau-day-vang-hon-11-800-ti-dong-noi-ha-noi-va-hung-yen-20260128211946328.htm", "construction 1/2026")],
 "cau-nguyen-trai": [
    press("https://dbnd.1cdn.vn/thumbs/1200x630/2026/08/02/cau-nguyen-trai-7-.jpg", "Báo Đại biểu Nhân dân", "https://daibieunhandan.vn/hai-phong-toan-canh-du-an-cau-nguyen-trai-va-vung-phu-can-hon-6-300-ty-dong-10425773.html", "construction 8/2026 (aerial)")],
 "cau-phuoc-an": [
    press("https://nqs.1cdn.vn/thumbs/1200x630/2026/08/01/7031_cau-phuoc-an3.jpg", "Người Quan Sát", "https://nguoiquansat.vn/cau-day-vang-gan-5-000-ty-co-tinh-khong-cao-nhat-viet-nam-nhip-chinh-dai-nhat-dong-nam-a-noi-nhip-2-tp-truc-thuoc-trung-uong-la-hanh-lang-van-tai-chien-luoc-307915.html", "render / near-complete"),
    press("https://cafefcdn.com/203337114487263232/2026/10/27/img4224-17921448362781663170439-1793076853415550427428.jpg", "Báo Xây dựng / CafeF", "https://cafef.vn/viet-nam-dang-xay-cay-cau-gan-5000-ty-dong-co-nhip-chinh-dai-250m-tru-thap-cao-tuong-duong-toa-nha-40-tang-nam-tren-truc-giao-thong-ket-noi-toi-sieu-do-thi-lan-bien-rong-2870-ha-cua-ty-phu-pham-nhat-vuong-188261027120348509.chn", "aerial 10/2026, both pylons, closed deck"),
    press("https://cafefcdn.com/203337114487263232/2026/10/27/img4207-17921448355181727615817-17930767736402027576764.jpg", "Báo Xây dựng / CafeF", "https://cafef.vn/viet-nam-dang-xay-cay-cau-gan-5000-ty-dong-co-nhip-chinh-dai-250m-tru-thap-cao-tuong-duong-toa-nha-40-tang-nam-tren-truc-giao-thong-ket-noi-toi-sieu-do-thi-lan-bien-rong-2870-ha-cua-ty-phu-pham-nhat-vuong-188261027120348509.chn", "aerial 10/2026 along the axis"),
    press("https://cafefcdn.com/203337114487263232/2026/10/27/photo-1793077280357-1793077280757507249795.png", "Báo Xây dựng / CafeF", "https://cafef.vn/viet-nam-dang-xay-cay-cau-gan-5000-ty-dong-co-nhip-chinh-dai-250m-tru-thap-cao-tuong-duong-toa-nha-40-tang-nam-tren-truc-giao-thong-ket-noi-toi-sieu-do-thi-lan-bien-rong-2870-ha-cua-ty-phu-pham-nhat-vuong-188261027120348509.chn", "render, deck level")],
 "cau-thuong-cat": [
    press("https://daknong.1cdn.vn/thumbs/1200x630/2026/06/17/img_98909ae3.jpg", "Báo Lâm Đồng", "https://baolamdong.vn/du-an-cau-thuong-cat-hon-7300-ty-dong-day-nhanh-thi-cong-ba-tru-thap-chinh-qua-song-hong-448557.html", "construction 6/2026 (aerial)"),
    press("https://cafefcdn.com/thumb_w/1200/203337114487263232/2026/10/21/avatar1792571886935-17925718873211627305556.webp", "CafeF / Tiền Phong", "https://cafef.vn/hinh-hai-cau-thuong-cat-sau-mot-nam-khoi-cong-188261021153843485.chn", "construction 10/2026 (pylon)")],
 "cau-can-tho-2": [
    press("https://cafefcdn.com/thumb_w/1200/203337114487263232/2026/10/8/avatar1791451772173-1791451772671916968314.webp", "CafeF", "https://cafef.vn/cau-can-tho-2-hon-27000-ty-dong-du-kien-khoi-cong-nam-2027-188261008163003601.chn", "render (road + rail)")],
 "cau-can-gio": [
    press("https://cdn2.tuoitre.vn/zoom/1200_630/471584752817336320/2026/1/14/anh-9-17683527812281318384555-89-20-838-1451-crop-176842964739965225266.jpg", "Tuổi Trẻ", "https://tuoitre.vn/dong-tho-cau-can-gio-dinh-hinh-trung-tam-ha-tang-moi-cua-tp-hcm-20260115061754127.htm", "render (current two-pylon design)"),
    press("https://cdn2.tuoitre.vn/plo/image/Uploaded/dinhcuong/2019_04_19/cangio34_GELO_thumb.jpg", "Pháp Luật TP.HCM", "https://plo.vn/chinh-thuc-cong-bo-hinh-hai-cau-day-vang-can-gio-5300-ti-post521730.html", "render (superseded 2019 single-pylon design)")],
 "cau-dong-nai-gia-nghia-bao-lam": [
    press("https://nqs.1cdn.vn/thumbs/1200x630/2026/08/31/2B2F_cay-cau.jpg", "Người Quan Sát", "https://nguoiquansat.vn/tinh-rong-nhat-viet-nam-sap-xay-cau-day-vang-vuot-song-nhip-chinh-dai-350m-313529.html", "render")],
 "cau-ben-rung": [
    press("https://cdn-i.vtcnews.vn/resize/1200x900//upload/2024/07/16/cau-ben-rung-truoc-ngay-thong-cau-5-10294993.jpg", "VTC News", "https://vtcnews.vn/hinh-hai-cau-ben-rung-noi-hai-phong-quang-ninh-truoc-ngay-thong-xe-ar883484.html", "photo 7/2024 (V pylons)"),
    press("https://cdn2.tuoitre.vn/zoom/1200_630/471584752817336320/2024/7/17/cau-rung-17212139427531519216815-166-0-1213-2000-crop-17212141387431731728425.jpg", "Tuổi Trẻ", "https://tuoitre.vn/thong-cau-ben-rung-gan-2-000-ti-ket-noi-hai-phong-quang-ninh-20240717180405727.htm", "photo 7/2024 (opening)")],
 "cau-cua-hoi": [
    press("https://static.vinwonders.com/production/cau-cua-hoi-thumb.jpg", "VinWonders", "https://vinwonders.com/vi/wonderpedia/news/cau-cua-hoi-bieu-tuong-ket-noi-nghe-an-va-ha-tinh/", "aerial photo")],
 "cau-thuan-an": [
    press("https://daknong.1cdn.vn/thumbs/1200x630/2026/07/21/img_3fc41632.jpg", "Báo Lâm Đồng", "https://baolamdong.vn/cau-vuot-bien-thuan-an-dai-nhat-mien-trung-sap-dua-vao-khai-thac-454712.html", "photo 7/2026 (extradosed span)")],
 "cau-phuoc-khanh": [
    press("https://cafefcdn.com/thumb_w/1200/203337114487263232/2026/9/11/avatar1789096235138-1789096236156216466580.jpg", "CafeF", "https://cafef.vn/nhung-cong-doan-cuoi-cung-truoc-khi-thong-xe-cau-phuoc-khanh-188260911101103844.chn", "photo 9/2026 (completed span)")],
 "cau-ba-son": [
    press("https://i2-vnexpress.vnecdn.net/2021/09/02/22cauthuthiem2-1630569460-5250-1630569471.jpg?w=1200&h=675&q=100&dpr=1&fit=crop&s=EGLmhFqYjwS-qcPamZwyng", "VnExpress", "https://vnexpress.net/hop-long-cau-thu-thiem-2-4350180.html", "photo 9/2021 (closure)")],
 "cau-my-thuan-2": [
    press("https://image.sggp.org.vn/1200x630/Uploaded/2026/cdjwzdjwp/2023_10_14/cong-trinh-giao-thong-cau-my-thuan-2-sung-sung-noi-doi-bo-song-tien-9597.jpg.webp", "Sài Gòn Giải Phóng", "https://www.sggp.org.vn/khoanh-khac-cau-my-thuan-2-noi-lien-doi-bo-song-tien-post709756.html", "photo 10/2023 (closure)")],
}

# ---------------- CURATED WIKIMEDIA COMMONS IMAGES (1280px thumbnails) ----------------
COMMONS = {
 "cau-can-tho": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Can_Tho_Bridge_3.jpg/1280px-Can_Tho_Bridge_3.jpg", "Christophe95", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Can_Tho_Bridge_3.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Can_Tho_Bridge_cables.JPG/1280px-Can_Tho_Bridge_cables.JPG", "Dragfyre", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Can_Tho_Bridge_cables.JPG"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Can_Tho_Bridge_tower_under_construction.jpg/1280px-Can_Tho_Bridge_tower_under_construction.jpg", "Dave Nix", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Can_Tho_Bridge_tower_under_construction.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/C%E1%BA%A7u_C%E1%BA%A7n_Th%C6%A1_%286321757880%29.jpg/1280px-C%E1%BA%A7u_C%E1%BA%A7n_Th%C6%A1_%286321757880%29.jpg", "Quang Vũ Trương", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_C%E1%BA%A7n_Th%C6%A1_(6321757880).jpg"),
 ],
 "cau-vam-cong": [
    img("https://upload.wikimedia.org/wikipedia/commons/2/21/Vam_Cong_Bridge.jpg", "Duong Dang Khoi", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Vam_Cong_Bridge.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng_trong_chi%E1%BB%81u.png/1280px-C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng_trong_chi%E1%BB%81u.png", "Bùi Thụy Đào Nguyên", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng_trong_chi%E1%BB%81u.png"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng%2C_042016.JPG/1280px-C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng%2C_042016.JPG", "Prenn", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng,_042016.JPG"),
 ],
 "cau-bai-chay": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bai_Chay_Bridge_%2849357435003%29.jpg/1280px-Bai_Chay_Bridge_%2849357435003%29.jpg", "Martin Lewison", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Bai_Chay_Bridge_(49357435003).jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/B%C3%A3i_Ch%C3%A1y_Bridge%2C_H%E1%BA%A1_Long_City%2C_Vi%E1%BB%87t_Nam.jpg/1280px-B%C3%A3i_Ch%C3%A1y_Bridge%2C_H%E1%BA%A1_Long_City%2C_Vi%E1%BB%87t_Nam.jpg", "Phó Nháy", "Public domain", "https://commons.wikimedia.org/wiki/File:B%C3%A3i_Ch%C3%A1y_Bridge,_H%E1%BA%A1_Long_City,_Vi%E1%BB%87t_Nam.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/VietnamBaiChayBridge.jpg/1280px-VietnamBaiChayBridge.jpg", "BluesyPete", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:VietnamBaiChayBridge.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Le_pont_suspendu_d%27Halong.jpg/1280px-Le_pont_suspendu_d%27Halong.jpg", "Jean-Pierre Dalbéra", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Le_pont_suspendu_d%27Halong.jpg"),
 ],
 "cau-phu-my": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Cablestay_bridge_in_Saigon.jpg/1280px-Cablestay_bridge_in_Saigon.jpg", "Frank Starmer", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Cablestay_bridge_in_Saigon.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Phu_My_Bruecke2.jpg/1280px-Phu_My_Bruecke2.jpg", "Hajotthu", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Phu_My_Bruecke2.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Ph%C3%BA_M%E1%BB%B9_Bridge.JPG/1280px-Ph%C3%BA_M%E1%BB%B9_Bridge.JPG", "Nguyễn Thanh Quang", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Ph%C3%BA_M%E1%BB%B9_Bridge.JPG"),
 ],
 "cau-binh-khanh": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/C%E1%BA%A7u_B%C3%ACnh_Kh%C3%A1nh_trong_qu%C3%A1_tr%C3%ACnh_x%C3%A2y_d%E1%BB%B1ng.jpg/1280px-C%E1%BA%A7u_B%C3%ACnh_Kh%C3%A1nh_trong_qu%C3%A1_tr%C3%ACnh_x%C3%A2y_d%E1%BB%B1ng.jpg", "Lê Uy Lân", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_B%C3%ACnh_Kh%C3%A1nh_trong_qu%C3%A1_tr%C3%ACnh_x%C3%A2y_d%E1%BB%B1ng.jpg"),
 ],
 "cau-my-thuan": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_%286297673871%29.jpg/1280px-C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_%286297673871%29.jpg", "Quang Vũ Trương", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_(6297673871).jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/My_Thuan_Bridge_cables.jpg/1280px-My_Thuan_Bridge_cables.jpg", "Dragfyre", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:My_Thuan_Bridge_cables.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn%2C_V%C4%A9nh_Long%2C_2013.JPG/1280px-C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn%2C_V%C4%A9nh_Long%2C_2013.JPG", "Prenn", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn,_V%C4%A9nh_Long,_2013.JPG"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_1_v%C3%A0_2.jpg/1280px-C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_1_v%C3%A0_2.jpg", "AnhNguyen", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_1_v%C3%A0_2.jpg"),
 ],
 "cau-my-thuan-2": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_1_v%C3%A0_2.jpg/1280px-C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_1_v%C3%A0_2.jpg", "AnhNguyen", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_1_v%C3%A0_2.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Cao_t%E1%BB%91c_m%E1%BB%B9_thu%E1%BA%ADn_c%E1%BA%A7n_th%C6%A1.jpg/1280px-Cao_t%E1%BB%91c_m%E1%BB%B9_thu%E1%BA%ADn_c%E1%BA%A7n_th%C6%A1.jpg", "Letrieuvy2002", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Cao_t%E1%BB%91c_m%E1%BB%B9_thu%E1%BA%ADn_c%E1%BA%A7n_th%C6%A1.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_2_%C4%91ang_thi_c%C3%B4ng.jpg/1280px-C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_2_%C4%91ang_thi_c%C3%B4ng.jpg", "Lehuunghi", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_2_%C4%91ang_thi_c%C3%B4ng.jpg"),
 ],
 "cau-cao-lanh": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/C%E1%BA%A7u_Cao_L%C3%A3nh.jpg/1280px-C%E1%BA%A7u_Cao_L%C3%A3nh.jpg", "Bùi Thụy Đào Nguyên", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_Cao_L%C3%A3nh.jpg"),
 ],
 "cau-nhat-tan": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/4am_view_of_Nhat_Tan_Bridge_in_Hanoi.jpg/1280px-4am_view_of_Nhat_Tan_Bridge_in_Hanoi.jpg", "cloud.shepherd", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:4am_view_of_Nhat_Tan_Bridge_in_Hanoi.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Cau_Nhat_Tan%2C_Ha_Noi%2C_VN_02.jpg/1280px-Cau_Nhat_Tan%2C_Ha_Noi%2C_VN_02.jpg", "Ltn12345", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Cau_Nhat_Tan,_Ha_Noi,_VN_02.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Nhat_Tan_Bridge_at_night_2016.jpg/1280px-Nhat_Tan_Bridge_at_night_2016.jpg", "cloud.shepherd", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Nhat_Tan_Bridge_at_night_2016.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/C%E1%BA%A7u_Nh%E1%BA%ADt_T%C3%A2n_%C4%91ang_x%C3%A2y_d%E1%BB%B1ng.jpg/1280px-C%E1%BA%A7u_Nh%E1%BA%ADt_T%C3%A2n_%C4%91ang_x%C3%A2y_d%E1%BB%B1ng.jpg", "David Berkowitz", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_Nh%E1%BA%ADt_T%C3%A2n_%C4%91ang_x%C3%A2y_d%E1%BB%B1ng.jpg"),
 ],
 "cau-phuoc-khanh": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/C%E1%BA%A7u_Ph%C6%B0%E1%BB%9Bc_Kh%C3%A1nh_2017.jpg/1280px-C%E1%BA%A7u_Ph%C6%B0%E1%BB%9Bc_Kh%C3%A1nh_2017.jpg", "Pieceofmetalwork", "CC0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_Ph%C6%B0%E1%BB%9Bc_Kh%C3%A1nh_2017.jpg"),
 ],
 "cau-rach-mieu": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/C%E1%BA%A7u_d%C3%A2y_v%C4%83ng_R%E1%BA%A1ch_Mi%E1%BB%85u.jpg/1280px-C%E1%BA%A7u_d%C3%A2y_v%C4%83ng_R%E1%BA%A1ch_Mi%E1%BB%85u.jpg", "Bùi Thụy Đào Nguyên", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_d%C3%A2y_v%C4%83ng_R%E1%BA%A1ch_Mi%E1%BB%85u.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/2/2c/Rach_Mieu_Bridge_pylon.jpg", "Chris Yasick", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Rach_Mieu_Bridge_pylon.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/R%E1%BA%A1ch_Mi%E1%BB%85u_bridge._%2814451567804%29.jpg/1280px-R%E1%BA%A1ch_Mi%E1%BB%85u_bridge._%2814451567804%29.jpg", "Phi Phi Hoang", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:R%E1%BA%A1ch_Mi%E1%BB%85u_bridge._(14451567804).jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/6/66/Rach_Mieu_Bridge_under_construction.jpg", "Terry Tran", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Rach_Mieu_Bridge_under_construction.jpg"),
 ],
 "cau-rach-mieu-2": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/%28VNM-Dong_Thap%29_Rach_Mieu_2_Bridge_2025-10-05.jpg/1280px-%28VNM-Dong_Thap%29_Rach_Mieu_2_Bridge_2025-10-05.jpg", "S5A-0043", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:(VNM-Dong_Thap)_Rach_Mieu_2_Bridge_2025-10-05.jpg"),
 ],
 "cau-binh": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Bridge_in_Haiphong.jpg/1280px-Bridge_in_Haiphong.jpg", "Teijo Hakala", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Bridge_in_Haiphong.jpg"),
 ],
 "cau-bach-dang": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/B%E1%BA%A1ch_%C4%90%E1%BA%B1ng_Bridge_%2849534690148%29.jpg/1280px-B%E1%BA%A1ch_%C4%90%E1%BA%B1ng_Bridge_%2849534690148%29.jpg", "Not So Dusty", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:B%E1%BA%A1ch_%C4%90%E1%BA%B1ng_Bridge_(49534690148).jpg"),
 ],
 "cau-tran-thi-ly": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge_at_daytime.jpg/1280px-Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge_at_daytime.jpg", "Tycho (shansov.net)", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge_at_daytime.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Tran_Thi_Ly_Bridge_%28I%29.jpg/1280px-Tran_Thi_Ly_Bridge_%28I%29.jpg", "This Photo was taken by Supanut Arunoprayote. Feel free to use any of my images,", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Tran_Thi_Ly_Bridge_(I).jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge%2C_Da_Nang.jpg/1280px-Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge%2C_Da_Nang.jpg", "Quangpraha", "CC0", "https://commons.wikimedia.org/wiki/File:Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge,_Da_Nang.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Tran_Thi_Ly_Bridge.jpg/1280px-Tran_Thi_Ly_Bridge.jpg", "Christophe95", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Tran_Thi_Ly_Bridge.jpg"),
 ],
 "cau-kien": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Kien_Bridge.jpg/1280px-Kien_Bridge.jpg", "Phó Nháy", "Public domain", "https://commons.wikimedia.org/wiki/File:Kien_Bridge.jpg"),
 ],
 "cau-ba-son": [
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/C%E1%BA%A7u_Ba_Son%2C_TP.HCM%2C_042022.jpg/1280px-C%E1%BA%A7u_Ba_Son%2C_TP.HCM%2C_042022.jpg", "Prenn", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_Ba_Son,_TP.HCM,_042022.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ba_Son_Bridge_%2853175234769%29.jpg/1280px-Ba_Son_Bridge_%2853175234769%29.jpg", "David Ackerman", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Ba_Son_Bridge_(53175234769).jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/4/47/ThapCauThuThiem2.jpg", "Lacessori", "CC0", "https://commons.wikimedia.org/wiki/File:ThapCauThuThiem2.jpg"),
    img("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Thu_Thiem_2_Bridge_construction.png/1280px-Thu_Thiem_2_Bridge_construction.png", "Cuong Tran", "Public domain", "https://commons.wikimedia.org/wiki/File:Thu_Thiem_2_Bridge_construction.png"),
 ],
 "cau-dai-ngai-1": [
    img("https://upload.wikimedia.org/wikipedia/commons/8/86/C%E1%BA%A7u_%C4%90%E1%BA%A1i_Ng%C3%A3i_1.jpg", "Phương Anh", "CC0", "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_%C4%90%E1%BA%A1i_Ng%C3%A3i_1.jpg"),
 ],
}


PRESS.setdefault("cau-binh-khanh", []).append(press("https://cdn2.tuoitre.vn/thesaigontimes/uploads/2025/07/DJI_20250710151804_0781_D-1.jpg", "Sài Gòn Times", "https://thesaigontimes.vn/cau-binh-khanh-hop-long-cao-toc-ben-luc-long-thanh-tang-toc-ve-dich/", "aerial 7/2025 (closure)"))
PRESS.setdefault("cau-bach-dang", []).extend([
    press("https://media.vov.vn/sites/default/files/styles/og_image/public/images/vov_cau_bach_dang_7_KXCD.jpg", "VOV", "https://vov.vn/tin-24h/nhung-hinh-anh-thi-cong-cuoi-cung-tren-cau-bach-dang-805863.vov", "final construction 2018"),
    press("https://daknong.1cdn.vn/thumbs/1200x630/2026/07/19/img_93285243.jpg", "Báo Lâm Đồng", "https://baolamdong.vn/cau-bach-dang-cong-trinh-day-vang-nhieu-nhip-hang-dau-the-gioi-noi-hai-phong-va-quang-ninh-454260.html", "aerial (3 pylons)")])
PRESS.setdefault("cau-rach-mieu-2", []).extend([
    press("https://i2-vnexpress.vnecdn.net/2025/04/19/DJI-20250420075438-0019-D-copy-1745029263.jpg?w=1200&h=675&q=100&dpr=1&fit=crop&s=e6x9QcBbyTU8zxJQt7zodA", "VnExpress", "https://vnexpress.net/cau-rach-mieu-2-hop-long-4875889.html", "aerial 4/2025 (closure)"),
    press("https://cdn2.tuoitre.vn/zoom/1200_630/471584752817336320/2025/4/12/hinhanh-3-17444238244982079259698-345-542-1120-2023-crop-17444242392611225682403.jpg", "Tuổi Trẻ", "https://tuoitre.vn/hop-long-cau-rach-mieu-2-som-hon-4-thang-so-voi-ke-hoach-20250412091941669.htm", "photo 4/2025")])


# ---------------- NAVIGATION CLEARANCE (tĩnh không thông thuyền) ----------------
# Only values found in a source; fields left out when unknown (see research/questions.md).
def nav(h=None, b=None, ref=None, src=None):
    d = {}
    if h is not None: d["height_m"] = h
    if b is not None: d["width_m"] = b
    if ref: d["reference"] = ref
    if src: d["source"] = src
    return d

NAV = {
 "cau-can-tho": nav(39, None, "for 10,000 DWT ships; reference level not stated", "https://nguoiquansat.vn/sieu-cau-noi-2-vung-dbscl-ket-thuc-su-menh-nhung-ben-pha-hon-100-nam-tuoi-thong-xe-15-nam-van-nam-giu-ky-luc-dong-nam-a-top-the-gioi-194312.html"),
 "cau-vam-cong": nav(37.5, None, "for 10,000 DWT ships", "https://tedi.vn/project/cau-vam-cong/"),
 "cau-phu-my": nav(45, 200, "width 200 m from a travel blog only (mytour.vn)", "https://24hmoney.vn/news/tp-hcm-de-xuat-mo-rong-cau-phu-my-len-it-nhat-8-lan-c27a2807656.html"),
 "cau-binh-khanh": nav(55, 242, "VECC: 55 m, L = 242 m; 20,000 DWT design vessel", "https://vecc.com.vn/project/duong-cao-toc-ben-luc-long-thanh/?lang=en"),
 "cau-my-thuan": nav(37.5, 110, None, "https://tedi.vn/project/cau-my-thuan/"),
 "cau-cao-lanh": nav(37.5, None, None, "https://vtcnews.vn/thong-xe-cay-cau-lon-thu-2-o-mien-tay-d401815.html"),
 "cau-phuoc-khanh": nav(55, 242, None, "https://vecc.com.vn/project/duong-cao-toc-ben-luc-long-thanh/?lang=en"),
 "cau-rach-mieu": nav(37.5, 70, None, "https://nguoiquansat.vn/cay-cau-day-vang-dau-tien-do-viet-nam-xay-dung-se-cam-o-to-trong-3-ngay-150152.html"),
 "cau-rach-mieu-2": nav(37.5, 110, "main channel; secondary channel 220 m × 30 m", "https://daibieunhandan.vn/du-an-cau-rach-mieu-2-dua-vao-khai-thac-som-hon-5-thang-10383788.html"),
 "cau-binh": nav(25, None, "for 3,000 DWT ships; travel blog only", "https://mytour.vn/vi/blog/bai-viet/cau-binh.html"),
 "cau-bach-dang": nav(48.4, 250, None, "https://vov.vn/tin-24h/nhung-hinh-anh-thi-cong-cuoi-cung-tren-cau-bach-dang-805863.vov"),
 "cau-ben-rung": nav(11, 85, "two channels, each 85 m × 11 m (BxH = 2×(85×11) m)", "https://vnbusiness.vn/day-nhanh-tien-do-thi-cong-cau-ben-rung-ket-noi-hai-phong-quang-ninh.html"),
 "cau-cat-lai": nav(55, 230, "minimum, for 60,000 DWT container ships", "https://cafeland.vn/tin-tuc/toan-canh-noi-xay-cau-cat-lai-sau-dong-tho-khu-vuc-nay-dang-ra-sao-150238.html"),
 "cau-duong-sat-can-gio": nav(55, 242, None, "https://24hmoney.vn/news/sieu-do-thi-ty-usd-cua-vingroup-co-them-buoc-ngoat-c3a2848236.html"),
 "cau-nguyen-trai": nav(25, 165, "press says 'khoảng 165m x 25m'", "https://daibieunhandan.vn/hai-phong-toan-canh-du-an-cau-nguyen-trai-va-vung-phu-can-hon-6-300-ty-dong-10425773.html"),
 "cau-phuoc-an": nav(55, 135, "for 30,000 DWT ships (an earlier appraisal said 123 m × 55 m)", "https://nhandan.vn/can-canh-cau-phuoc-an-ket-noi-quan-trong-giua-thanh-pho-ho-chi-minh-va-dong-nai-dang-vuot-tien-do-post968305.html"),
 "cau-can-tho-2": nav(40, 110, "main channel, above H5%; total navigable width 300 m incl. two 95 m × 31 m side channels", "https://baodautu.vn/phan-dau-khoi-cong-xay-dung-cau-can-tho-2-von-28500-ty-dong-vao-nam-2027-d388354.html"),
 "cau-ba-son": nav(11, None, None, "https://en.wikipedia.org/wiki/Ba_Son_Bridge"),
 "cau-hoa-son": nav(7, 50, "inland waterway class III, B × H = 50 × 7 m (TEDI-GIC technical-design summary; reference level not stated)", "https://tedi-gic.vn/cau-hoa-son-km40750-km41989-va-cao-toc-hoa-binh-moc-chau-doan-tu-km46000-km47500-tren-dia-ban-tinh-hoa-binh-tkkt/"),
 "cau-can-gio": nav(55, None, None, "https://plo.vn/cau-can-gio-mang-hinh-tuong-cay-duoc-post515884.html"),
 "cau-tu-lien": nav(10, 80, "BxH = 80 × 10 m above the 5% design flood level H5% = +9.55 m (general elevation drawing)", "https://vov.gov.vn/toan-canh-cau-tu-lien-bieu-tuong-moi-ben-song-hong-cua-ha-noi-dang-thanh-hinh-dtnew-1150575"),
}


# ---------------- CUSTOM PYLON GEOMETRY (sculptural / curved / leaning pylons) ----------------
# Local frame per schema: x along bridge (+ toward main span), y up from deck level, z across bridge.
# All values were measured off side-on / oblique photos and renders, scaled with known pylon heights,
# deck widths and spans. They are approximate ("estimated").
CW = "https://commons.wikimedia.org/wiki/File:"
# Trần Thị Lý (round 7, research/model-review/brief-r7-tran-thi-ly.md): leaning blade mast (leg 0) on an oval
# S5 pier (leg 1) and a low rounded pile cap; shared by PYLON, the shape file and REVIEW_R1.
TTL_PYLON = {
    "description": "Single straight RC blade on the deck centreline at pier S5, leaning 12° west (back, away from the 230 m span); V-section tapering from ≈11 m deep along the bridge at deck level to ≈4.5 m at the flat top (glass lantern, 134 m above deck). Rigid with the deck, seated on a wide oval pier and pile cap at the waterline. Main span: one central plane of 33 white stays anchored 48–126 m up the mast. Back side: 2 × 15 red stays from the mast faces (68–126 m) to the two deck edges, all converging on the last ≈15 m of deck at abutment S1 (≈181–195 m behind the pylon) — the twisted red 'sail'.",
    "legs": [
        {"centerline": [[0.4, -2, 0], [-13.8, 65, 0], [-28.5, 134, 0]],
         "width_base_m": 6, "width_top_m": 4, "depth_base_m": 11, "depth_top_m": 4.5},
        {"centerline": [[0, -10.5, 0], [0, -6, 0], [0, -2, 0]],
         "width_base_m": 12, "width_top_m": 12, "depth_base_m": 15, "depth_top_m": 15},
    ],
    "anchor_zone": [
        {"y_from_m": 48, "y_to_m": 126, "leg": 0, "side": "main"},
        {"y_from_m": 68, "y_to_m": 126, "leg": 0, "side": "back"},
    ],
    "pile_cap": {"length_x_m": 22, "width_z_m": 30, "top_y_m": -10.5, "thickness_m": 3, "rounded_ends": True},
    "reference_images": [
        "https://vecc.com.vn/project/cau-nguyen-van-troi-tran-thi-ly-thanh-pho-da-nang/?lang=en (general elevation)",
        "https://commons.wikimedia.org/wiki/File:Tran_Thi_Ly_Br%C3%BCcke.jpeg",
        "https://commons.wikimedia.org/wiki/File:Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge_at_daytime.jpg",
        "https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD.jpeg",
    ],
}
PYLON = {
 "cau-ba-son": {
    "description": "Single pointed-arch pylon (two legs straddling the deck, curving inward and meeting at the tip, like an inverted 'U'/dragon spine). The whole arch is curved in elevation and leans BACK, away from the 200 m main span, toward the Thủ Thiêm back span. The main-span stays fan from the upper arch to both deck edges; a smaller set of back-stays anchors in the 115 m back span.",
    "legs": [
        {"centerline": [[0, -11, -15.5], [-2, 15, -14.5], [-7, 45, -11], [-14, 75, -6], [-21, 92, -2], [-24, 101, 0]], "width_base_m": 5.0, "width_top_m": 2.5, "depth_base_m": 4.0, "depth_top_m": 2.5},
        {"centerline": [[0, -11, 15.5], [-2, 15, 14.5], [-7, 45, 11], [-14, 75, 6], [-21, 92, 2], [-24, 101, 0]], "width_base_m": 5.0, "width_top_m": 2.5, "depth_base_m": 4.0, "depth_top_m": 2.5},
    ],
    "anchor_zone": [{"y_from_m": 40, "y_to_m": 96, "leg": 0}, {"y_from_m": 40, "y_to_m": 96, "leg": 1}],
    "reference_images": [CW + "Cầu_Ba_Son,_TP.HCM,_042022.jpg", CW + "ThapCauThuThiem2(Left).jpg", CW + "Ba_Son_Bridge,_Saigon_(20230705_1516).jpg", "https://wsp.com/en-ca/projects/thu-thiem-2-cable-stayed-bridge"],
 },
 "cau-nhat-tan": {
    "description": "Five identical pointed-arch ('gothic A') pylons: two legs straddle the deck and curve inward to meet at a single tip, with no visible cross-beam above the deck. Fan stays run from the upper third of each leg to the deck edges.",
    "legs": [
        {"centerline": [[0, -12, -19], [0, 20, -17], [0, 50, -12], [0, 72, -5], [0, 82, 0]], "width_base_m": 4.5, "width_top_m": 2.5},
        {"centerline": [[0, -12, 19], [0, 20, 17], [0, 50, 12], [0, 72, 5], [0, 82, 0]], "width_base_m": 4.5, "width_top_m": 2.5},
    ],
    "anchor_zone": [{"y_from_m": 45, "y_to_m": 78, "leg": 0}, {"y_from_m": 45, "y_to_m": 78, "leg": 1}],
    "mirror_for_other_pylons": True,
    "reference_images": [CW + "4am_view_of_Nhat_Tan_Bridge_in_Hanoi.jpg", CW + "Cau_Nhat_Tan,_Ha_Noi,_VN_02.jpg"],
 },
 "cau-tran-thi-ly": TTL_PYLON,
 "cau-tu-lien": {
    # Round 8 (research/model-review/brief-r8-tu-lien.md), per the user's official render and the VOV general
    # elevation drawing. Supersedes the earlier "client feedback 11/2026" merge + twisted-blades reading.
    # Pylon-local frame: x along the bridge (+ toward the main span), y up from the deck at the pylon (waterline at
    # y = -24.5), z across (deck edges ±21.5). Real scale: tip 159.5 + E 24.5 + crest at the pylon ≈1.3 → label ≈185 m.
    # Legs 0/1: separate feet (±16) splay out to a knee just outside the deck (±33, y -8.5, under-deck beam), lean
    #   in and CROSS at the centreline at y 62 (≈0.39 H), then turn vertical as the OPPOSITE post (leg from -z ends
    #   at the +z post). The two sweeps intersecting at (0, 62, 0) is intended.
    # Legs 2/3: the parallel posts (8.5 m c/c, ±1.5 m x-offset "twist"), flat tops staggered 159.5 / 150. They are
    #   separate legs so each stay plane anchors on its own post (customZone matches planes by the leg's mean z;
    #   a crossing leg would average to the wrong side). Struts, not crossbeams_y_m: with four legs that would join
    #   consecutive legs diagonally.
    "description": "Diamond-X pylon (Tứ Liên official render): two straight legs rise from separate feet in the river, splay outward to a knee just outside the deck edges where a deep crossbeam carries the girder, then lean inward through the deck and CROSS at the centreline (X) ≈ 40% of the above-deck height; each leg continues past the crossing and turns vertical as the opposite upper post. Two slender parallel posts ≈ 8.5 m apart (≈4 m slot), offset ±1.5 m along the bridge (slight twist), with flat tops staggered ≈9.5 m and a short link just below the lower top. Semi-fan stays in two inclined planes from the posts to the deck edges.",
    "legs": [
        {"centerline": [[0, -25.0, -16], [0, -17, -24.5], [0, -8.5, -33], [0, 0, -29.0], [0, 30, -15.0], [0, 62, 0], [0.9, 68, 2.4], [1.5, 74, 4.25]],
         "width_base_m": 8.0, "width_top_m": 5.5, "depth_base_m": 11.0, "depth_top_m": 8.5},
        {"centerline": [[0, -25.0, 16], [0, -17, 24.5], [0, -8.5, 33], [0, 0, 29.0], [0, 30, 15.0], [0, 62, 0], [-0.9, 68, -2.4], [-1.5, 74, -4.25]],
         "width_base_m": 8.0, "width_top_m": 5.5, "depth_base_m": 11.0, "depth_top_m": 8.5},
        {"centerline": [[-1.5, 74, -4.25], [-1.5, 115, -4.25], [-1.5, 159.5, -4.25]],
         "width_base_m": 5.0, "width_top_m": 4.5, "depth_base_m": 8.5, "depth_top_m": 7.5},
        {"centerline": [[1.5, 74, 4.25], [1.5, 112, 4.25], [1.5, 150, 4.25]],
         "width_base_m": 5.0, "width_top_m": 4.5, "depth_base_m": 8.5, "depth_top_m": 7.5},
    ],
    "struts": [
        {"a": [0, -8.5, -31.5], "b": [0, -8.5, 31.5], "width": 8.0},     # deep under-deck crossbeam between the knees
        {"a": [-1.5, 145, -4.25], "b": [1.5, 145, 4.25], "width": 3.0},  # short link just below the lower top
    ],
    "anchor_zone": [{"y_from_m": 92, "y_to_m": 141, "leg": 2}, {"y_from_m": 92, "y_to_m": 141, "leg": 3}],
    "pile_cap": {"length_x_m": 30, "width_z_m": 48, "top_y_m": -25.0, "thickness_m": 6, "rounded_ends": False},
    "mirror_for_other_pylons": True,
    "reference_images": [
        "https://admin.vov.gov.vn/UploadFolder/KhoTin/Images/UploadFolder/VOVVN/Images/sites/default/files/styles/large_watermark/public/2026-06/cau_tu_lien_ve_dich_22_0.jpg",
        "https://admin.vov.gov.vn/UploadFolder/KhoTin/Images/UploadFolder/VOVVN/Images/sites/default/files/styles/large/public/2026-06/cau_tu_lien.jpg",
        "https://daknong.1cdn.vn/thumbs/1200x630/2026/07/23/img_afa3cf01.jpg",
    ],
 },
 "cau-can-gio": {
    "description": "Current two-pylon 'mangrove tree' (cây đước) design per the 1/2026 render: each pylon has two splayed 'root' legs that rise from the water outside the deck, curve inward under/through the deck and join into one trunk about a third of the way up; the trunk continues as a single mast carrying fan stays in two planes.",
    "legs": [
        {"centerline": [[0, -40, -20], [0, -15, -17], [0, 10, -10], [0, 30, -2], [0, 40, 0]], "width_base_m": 5.0, "width_top_m": 4.0},
        {"centerline": [[0, -40, 20], [0, -15, 17], [0, 10, 10], [0, 30, 2], [0, 40, 0]], "width_base_m": 5.0, "width_top_m": 4.0},
        {"centerline": [[0, 40, 0], [0, 65, 0], [0, 90, 0]], "width_base_m": 6.0, "width_top_m": 3.0},
    ],
    "anchor_zone": [{"y_from_m": 50, "y_to_m": 88, "leg": 2}],
    "mirror_for_other_pylons": True,
    "reference_images": ["https://cdn2.tuoitre.vn/zoom/1200_630/471584752817336320/2026/1/14/anh-9-17683527812281318384555-89-20-838-1451-crop-176842964739965225266.jpg"],
 },
 "cau-ben-rung": {
    "description": "At each of the 3 pylon piers, two separate flat 'blade' posts stand at the deck edges and lean OUTWARD, forming a V in cross-section (the 'V – Victory' motif), white with a red inner face. Short extradosed stays (red) in two planes run from each blade to the deck edge.",
    "legs": [
        {"centerline": [[0, -2, -10.5], [0, 8, -12.5], [0, 18, -15]], "width_base_m": 2.0, "width_top_m": 3.5, "depth_base_m": 2.0, "depth_top_m": 1.2},
        {"centerline": [[0, -2, 10.5], [0, 8, 12.5], [0, 18, 15]], "width_base_m": 2.0, "width_top_m": 3.5, "depth_base_m": 2.0, "depth_top_m": 1.2},
    ],
    "anchor_zone": [{"y_from_m": 6, "y_to_m": 17, "leg": 0}, {"y_from_m": 6, "y_to_m": 17, "leg": 1}],
    "mirror_for_other_pylons": True,
    "reference_images": ["https://cdn-i.vtcnews.vn/resize/1200x900//upload/2024/07/16/cau-ben-rung-truoc-ngay-thong-cau-5-10294993.jpg"],
 },
}
DECK_RADIUS = {}   # no horizontally curved stayed unit found in sources/photos


M3D["cau-may-chai"] = m3d([90, 200, 90], "other", [89, 89], "total", 2, "semi_fan", 21.0, "steel", cps=6,
    notes="200 m main span, 89 m pylons, 48 stays (24 per pylon, so 6 per side per plane assuming 2 planes), steel deck 21 m (CafeF). Side spans not published (estimated 90 m). Pylon form read from the CafeF and VTC photos (7/2025).")
PYLON["cau-may-chai"] = {
    "description": "Each pylon is a yellow arch: two curved legs straddle the deck, lean forward toward the river (main span) and curve inward to meet at the tip, like a bent wing ('Cửa Thế Giới' concept). Stays in two planes fan to the deck edges on both sides.",
    "legs": [
        {"centerline": [[-4, -20, -13], [0, 10, -12.5], [6, 35, -9], [11, 55, -4], [13, 64, 0]], "width_base_m": 4.0, "width_top_m": 2.5},
        {"centerline": [[-4, -20, 13], [0, 10, 12.5], [6, 35, 9], [11, 55, 4], [13, 64, 0]], "width_base_m": 4.0, "width_top_m": 2.5},
    ],
    "anchor_zone": [{"y_from_m": 25, "y_to_m": 60, "leg": 0}, {"y_from_m": 25, "y_to_m": 60, "leg": 1}],
    "mirror_for_other_pylons": True,
    "reference_images": ["https://cafefcdn.com/thumb_w/640/203337114487263232/2026/7/30/avatar1785383768277-1785383768904592996991.png", "https://cdn-i.vtcnews.vn/resize/1200x900/upload/2025/07/13/anh-2-18403346.jpg"],
}
NAV["cau-may-chai"] = nav(25, 110, None, "https://cafef.vn/cau-2300-ty-dong-do-vingroup-cua-ty-phu-pham-nhat-vuong-dau-tu-xac-lap-ky-luc-chua-tung-co-ve-toc-do-xay-dung-cong-trinh-bac-qua-song-cam-188260730105702738.chn")
PRESS["cau-may-chai"] = [
    press("https://cafefcdn.com/thumb_w/640/203337114487263232/2026/7/30/avatar1785383768277-1785383768904592996991.png", "CafeF", "https://cafef.vn/cau-2300-ty-dong-do-vingroup-cua-ty-phu-pham-nhat-vuong-dau-tu-xac-lap-ky-luc-chua-tung-co-ve-toc-do-xay-dung-cong-trinh-bac-qua-song-cam-188260730105702738.chn", "aerial (completed)"),
    press("https://cdn-i.vtcnews.vn/resize/1200x900/upload/2025/07/13/anh-2-18403346.jpg", "VTC News", "https://vtcnews.vn/can-canh-cau-hoang-gia-truoc-gio-g-bieu-tuong-moi-tai-hai-phong-sau-sap-nhap-ar954169.html", "photo 7/2025 (pylons)")]
NAV["cau-my-thuan-2"] = nav(37.5, None, None, "https://www.sggp.org.vn/khoanh-khac-cau-my-thuan-2-noi-lien-doi-bo-song-tien-post709756.html")


M3D["cau-cua-lon"] = m3d([110, 250, 110], "H", [100, 100], "total", 2, "semi_fan", 20.0,
    notes="Placeholder geometry: 250 m main span (client); side spans assumed 110 m within the ≈1.5 km bridge; pylon shape, height and deck width (4-lane expressway) assumed, since no render was found.")
PRESS["cau-cua-lon"] = [press("https://nqs.1cdn.vn/thumbs/1200x630/2026/06/09/5B30_ca-mau-1-17809802873171473761074-0-0-625-1000-crop-178098039885440981610.jpg", "Người Quan Sát", "https://nguoiquansat.vn/cao-toc-59-000-ty-cua-dbscl-se-so-huu-nhieu-cau-vuot-song-quy-mo-va-ket-noi-den-cau-vuot-bien-dai-nhat-viet-nam-296881.html", "expressway article image (not the bridge itself)")]


# ---------------- SHAPE REVIEW (research/shapes/<id>.json, photo/render review 2026-11-26) ----------------
# Each proposal replaces model3d (incl. pylon_custom) and sets pylons (VI) / pylons_en. Colour, auxiliary piers
# and image issues are kept in model3d.notes (not yet in the schema).
import os, glob as _glob
SHAPES = {}
_sd = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "research", "shapes")
for _f in sorted(_glob.glob(os.path.join(_sd, "*.json"))):
    _p = json.load(open(_f, encoding="utf-8"))
    SHAPES[_p["id"]] = _p
DROP_IMAGES = {
    "cau-bach-dang": ["media.vov.vn/sites/default/files/styles/og_image/public/images/vov_cau_bach_dang_7_KXCD.jpg"],   # resolves to the VOV logo
    "cau-nhat-tan": ["Cau_Nhat_Tan%2C_Ha_Noi%2C_VN_02.jpg", "Cau_Nhat_Tan,_Ha_Noi,_VN_02.jpg"],                       # shows only the roadway
}

# ---------------- PHASE 6: fields the schema could not express before (shape review "can't express yet") ----------------
# Colours are rendered muted in 3D. Sources: research/shapes/<id>.json "colour" and model3d.notes.
PHASE6 = {
    "cau-bai-chay": {"stay_colour": "yellow", "deck_crest_m": 8.0},          # crest estimated from side photos
    "cau-my-thuan": {"deck_crest_m": 10.5},                                  # round 10: E 30 + crest 10.5 → 30 / 37.5 / 40.5 (shape file sets it too)
    "cau-bach-dang": {"stay_colour": "orange"},
    "cau-rach-mieu": {"stay_colour": "orange"},
    "cau-tran-thi-ly": {"pylon_colour": "white", "stay_colour": "white", "back_stay_colour": "red"},
    "cau-may-chai": {
        "pylon_colour": "yellow", "deck_colour": "red", "stay_colour": "white",
        "pylon_custom": {
            # curved splayed 'wing' feet: narrow at the pier, sweeping outward below the deck, then up into the arch
            "legs_override": {
                0: [[-1, -30, -7], [-6, -18, -15], [0, 10, -12.5], [6, 35, -9], [11, 55, -4], [13, 64, 0]],
                1: [[-1, -30, 7], [-6, -18, 15], [0, 10, 12.5], [6, 35, 9], [11, 55, 4], [13, 64, 0]],
            },
            # strut reaching out under the side-span deck from each foot (local -x = away from the main span)
            "struts": [{"a": [-5, -20, -14], "b": [-38, -3, -9], "width": 2.0},
                       {"a": [-5, -20, 14], "b": [-38, -3, 9], "width": 2.0}],
        },
    },
    "cau-dai-ngai-1": {"stay_colour": "red"},
    "cau-cua-hoi": {"pylon_colour": "white", "stay_colour": "red"},
    "cau-ben-rung": {"pylon_colour": "white", "stay_colour": "red"},        # white blades, red inner face, red stays
    "cau-hoa-son": {"pylon_colour": "white", "stay_colour": "#cfdbe6"},     # white pylons, light stays per the official render (TEDI); red stays = alternative aerial scheme
    "cau-thuan-an": {"pylon_colour": "white", "stay_colour": "red"},
    "cau-can-tho": {"auxiliary_piers_m": [40, 80, 930, 970]},                # 2×40 m end spans each side
    "cau-ba-son": {"pylon_custom": {"crown": "rounded"}},
    "cau-cat-lai": {"pylon_custom": {"crown": "rounded"}},
    # cau-phuoc-an: the 'rounded' crown entry was wrong (round 9: pointed 'giọt nước' apex, research/shapes/cau-phuoc-an.json)
}


M3D["cau-phu-my-2"] = m3d([210, 450, 210], "H", [170, 170], "total", 2, "fan", 33.5, "composite",
    notes="Placeholder until the render compare (replaced by research/shapes/cau-phu-my-2.json).")
NAV["cau-phu-my-2"] = nav(55, 250, None, "https://baodautu.vn/thong-nhat-tinh-khong-thong-thuyen-cau-chinh-phu-my-2-cao-55-m-rong-250-m-d569257.html")
PRESS["cau-phu-my-2"] = [
    press("https://cdn2.tuoitre.vn/plo/image/Uploaded/daotrang/2026_04_11/cau-phu-my-2-21-6172-1418.jpg", "Pháp Luật TP.HCM (PM02 render)", "https://tuoitre.vn/plo/kien-truc-doc-dao-cua-cau-phu-my-2-post903737.html", "PM02 render"),
    press("https://images2.thanhnien.vn/zoom/1200_630/528068263637045248/2026/4/11/thumbnail-1-17758816924231675336197-0-0-755-1208-crop-17758818141781921120657.jpg", "Thanh Niên (PM02 render)", "https://thanhnien.vn/lo-dien-thiet-ke-cau-phu-my-2-noi-tphcm-dong-nai-185260411113038756.htm", "PM02 render"),
    press("https://cafefcdn.com/thumb_w/1200/203337114487263232/2026/9/13/cau-phu-my-2-11-8376-8844-17892844087341675295924-0-0-755-1208-crop-17892844148141100818472.jpg", "CafeF", "https://cafef.vn/cay-cau-dai-63km-quy-mo-8-lan-xe-so-huu-day-vang-tinh-khong-cao-bac-nhat-viet-nam-ket-noi-voi-sieu-du-an-16-ty-usd-18826091314280457.chn", "render")]

# ---------------- MODEL REVIEW ROUND 1 (research/model-review/brief-round1.md, 2026-11-26) ----------------
# Applied LAST and unconditionally (after SHAPES and PHASE6). Per bridge:
#   "scale_y": multiply every above-deck y of the custom pylon (centreline points, crossbeams, anchor zones, strut ends)
#   "set": model3d fields; "pylon_custom": pylon_custom fields (after scaling); "bridge": top-level fields; "nav": nav_clearance
NON_SCHEMA = ("colour", "image_issue", "auxiliary_piers_m_from_end")

def sanitize_model3d(m):
    """Drops keys that are not in docs/data-schema.md (their text is kept in notes)."""
    c = m.pop("colour", None)
    if c and c not in m.get("notes", ""):
        m["notes"] = (m.get("notes", "") + " Colour: " + c + ".").strip()
    m.pop("image_issue", None)                      # handled by DROP_IMAGES
    fe = m.pop("auxiliary_piers_m_from_end", None)
    if fe and "auxiliary_piers_m" not in m:
        L = sum(m["spans_m"])
        m["auxiliary_piers_m"] = sorted(set(fe) | {round(L - d, 3) for d in fe})

def check_panels(m, bid):
    """G13 panels: >= 2 points per curve, z non-decreasing, equal end z on both curves; invalid ones are skipped."""
    pc = m.get("pylon_custom")
    if not pc or "panels" not in pc: return
    ok = []
    for i, pn in enumerate(pc["panels"]):
        t, bt = pn.get("top", []), pn.get("bottom", [])
        good = (len(t) >= 2 and len(bt) >= 2 and pn.get("depth_m", 0) > 0
                and all(c[k][0] >= c[k - 1][0] for c in (t, bt) for k in range(1, len(c)))
                and t[0][0] == bt[0][0] and t[-1][0] == bt[-1][0] and t[-1][0] > t[0][0])
        if good: ok.append(pn)
        else: print(f"warning: {bid}: skipping invalid pylon_custom.panels[{i}]", file=sys.stderr)
    if ok: pc["panels"] = ok
    else: del pc["panels"]

def scale_custom(pc, f):
    for leg in pc["legs"]:
        leg["centerline"] = [[x, y * f if y > 0 else y, z] for x, y, z in leg["centerline"]]
    if "crossbeams_y_m" in pc:
        pc["crossbeams_y_m"] = [round(y * f, 2) if y > 0 else y for y in pc["crossbeams_y_m"]]
    for az in pc["anchor_zone"]:
        az["y_from_m"] = round(az["y_from_m"] * f, 2)
        az["y_to_m"] = round(az["y_to_m"] * f, 2)
    for st in pc.get("struts", []):
        for e in ("a", "b"):
            if st[e][1] > 0: st[e] = [st[e][0], st[e][1] * f, st[e][2]]
    for leg in pc["legs"]:
        leg["centerline"] = [[x, round(y, 3), z] for x, y, z in leg["centerline"]]

def apply_review(b, r):
    import copy
    m = b["model3d"]
    if "scale_y" in r:
        assert "pylon_custom" in m, b["id"]
        m["pylon_custom"] = copy.deepcopy(m["pylon_custom"])
        scale_custom(m["pylon_custom"], r["scale_y"])
    for k, v in r.get("set", {}).items():
        if v is None: m.pop(k, None)
        else: m[k] = copy.deepcopy(v)
    for k, v in r.get("pylon_custom", {}).items():
        m["pylon_custom"][k] = copy.deepcopy(v)
    for k, v in r.get("bridge", {}).items():
        b[k] = v
    if "nav" in r:
        NAV[b["id"]] = r["nav"]
    if r.get("note"):
        m["notes"] = (m.get("notes", "") + " Review r1: " + r["note"]).strip()

R1 = "model review round 1 (research/model-review/brief-round1.md)"
REVIEW_R1 = {
    "cau-can-tho": {"scale_y": 0.965, "set": {"auxiliary_piers_m": [40, 80, 930, 970], "cables_per_side": 27},
        "note": "Aux piers at 930/970 m (unit 1010 m); 27 stays per side per plane (216 stays); custom pylon scaled to 175.3 m total."},
    # round 9 (brief-r9-vam-cong.md): no scale_y, the improved-H shape file's tip (local 107.8) is the 147 m label
    "cau-vam-cong": {"set": {"pylon_heights_m": [147, 147]},
        "bridge": {"pylons": "2 tháp chữ H cải tiến: hai chân nghiêng vào trên mặt cầu, dầm ngang trên có vòm, hai cột đứng ở đỉnh; chân choãi dưới mặt cầu, dầm ngang đỡ dầm; cao 143,9 m từ đỉnh bệ móng (≈150 m)",
                   "pylons_en": "2 'improved H' pylons: legs lean inward above the deck to an arched upper crossbeam and two vertical posts; splayed feet with a deep under-deck beam; 143.9 m above the foundation top (≈150 m)"},
        "note": "r9: improved-H pylon, 143.9 m above foundation (design paper)."},
    "cau-bai-chay": {"scale_y": 0.915,
        "set": {"pylon_heights_m": [91.5, 91.5], "pylon_height_ref": "above_deck", "cables_per_side": 28, "pylon_colour": "grey", "stay_colour": "yellow"},
        "nav": nav(50, None, "press (widely quoted)"),
        "bridge": {"pylons": "2 tháp một cột (một mặt phẳng dây), cao 91,5 m trên mặt cầu; dây văng bọc vàng", "pylons_en": "2 single-column pylons (one cable plane), 91.5 m above deck; yellow stay sheaths"},
        "note": "Pylon 91.5 m above deck (IABSE / ResearchGate); 28 stays per side per pylon (112 total, Freyssinet)."},
    "cau-phu-my": {"scale_y": 0.96, "note": "Custom pylon scaled to 145 m total (Wikipedia)."},
    "cau-binh-khanh": {"set": {"spans_m": [187.25, 375, 187.25], "pylon_heights_m": [155, 155], "cables_per_side": 17, "deck_type": "concrete",
                               "deck_width_m": 30.35},
        "bridge": {"pylons": "2 tháp chữ H hai cột đứng, dầm ngang ở khoảng 2/3 chiều cao trên mặt cầu, giằng chân sát mặt nước; dây neo yên ngựa; cao 155 m tính từ móng",
                   "pylons_en": "2 H pylons with two vertical legs, a crossbeam at ≈2/3 of the height above deck and a tie beam at the waterline; stays over saddles; 155 m from the foundations",
                   "span_arrangement": "187,25 + 375 + 187,25 m"},
        "note": "Spans 187.25 + 375 + 187.25 m, 155 m pylons, 17 stay pairs per pylon side (vi.wikipedia, VnExpress)."},
    # round 7 (research/model-review/brief-r7-phuoc-khanh.md): scale_y 0.877 removed; the shape file now holds measured geometry
    "cau-phuoc-khanh": {"set": {"cables_per_side": 14, "deck_type": "concrete"}},  # height note lives in the shape file
    "cau-my-thuan-2": {"scale_y": 0.967, "set": {"cables_per_side": 16, "pylon_heights_m": [125.5, 125.5]},
        "note": "128 stay bundles = 16 per side per plane (VnExpress); crest 125.5 m (Tiền Phong)."},
    "cau-nhat-tan": {"set": {"cables_per_side": 11, "pylon_heights_m": [111] * 5, "pylon_colour": "grey"},
        "note": "220 stays / 5 pylons = 11 per side per plane (JSCE); max pylon 111 m."},
    "cau-rach-mieu": {"set": {"deck_width_m": 15, "pylon_heights_m": [117, 117], "stay_colour": "orange", "pylon_colour": "#e6dcc3"},
        "pylon_custom": {"legs": None},   # filled below (legs moved to ±9.5 m at deck level)
        "bridge": {"pylons": "2 tháp chữ A (Y ngược), chân choãi, dây văng màu cam, cao 117 m", "pylons_en": "2 A-frame (inverted-Y) pylons with splayed feet, orange stays, 117 m"},
        "note": "Deck 15 m and pylon 117 m (vi.wikipedia)."},
    "cau-rach-mieu-2": {"set": {"pylon_heights_m": [116.5, 116.5]},
        "nav": nav(37.5, 220, "contractor: channel 220 m × 30 m, 37.5 m at mid-channel", "https://trungnamec.com.vn/cau-rach-mieu-2/"),
        "bridge": {"pylons": "2 tháp chữ H (hai cột đứng, dầm ngang trên ở khoảng giữa chiều cao), cao 116,5 m",
                   "pylons_en": "2 H-shaped pylons (two vertical columns, one upper cross-beam at about mid-height), 116.5 m"},
        "note": "Pylon 116.5 m (Trung Nam E&C)."},
    "cau-bach-dang": {"scale_y": 0.74, "set": {"cables_per_side": 12, "pylon_colour": "grey", "stay_colour": "orange"},
        "pylon_custom": {"crossbeams_y_m": [-3, 22], "anchor_zone": [{"y_from_m": 28, "y_to_m": 45, "leg": 0}, {"y_from_m": 28, "y_to_m": 45, "leg": 1}]},
        "note": "Pylons ≈43–46 m above a deck ≈52 m above water (crown +99.74 / +94.5 m); beam at ≈50% of the above-deck height; 48 stay bundles per pylon (baolamdong). Per-pylon heights scale the custom pylon (centre taller)."},
    "cau-tran-thi-ly": {"set": {"spans_m": [200, 230], "auxiliary_piers_m": [50, 100, 150], "pylon_shape": "single",
                                "pylon_heights_m": [145], "pylon_height_ref": "total", "deck_elevation_m": 11,
                                "deck_width_m": 34.5, "deck_type": "concrete", "cable_planes": 1, "back_stay_planes": 2,
                                "cable_pattern": "semi_fan", "cables_per_side": 33, "back_stay_count": 15, "back_stay_deck_m": [181, 195],
                                "pylon_colour": "white", "stay_colour": "white", "back_stay_colour": "red", "confidence": "verified",
                                "pylon_custom": TTL_PYLON},
        "nav": nav(7, 50, "navigation clearance BxH = 50 × 7 m", "https://vecc.com.vn/project/cau-nguyen-van-troi-tran-thi-ly-thanh-pho-da-nang/?lang=en"),
        "bridge": {"pylons": "1 tháp BTCT nghiêng 12° về phía Tây, tiết diện chữ V, cao 145 m (134 m trên mặt cầu); dây văng 3 mặt phẳng: 33 dây nhịp chính (1 mặt phẳng giữa), 30 dây neo sau màu đỏ (2 mặt phẳng) hội tụ về mố S1",
                   "pylons_en": "1 RC pylon leaning 12° west, V-section, 145 m (134 m above deck); three stay planes: 33 main-span stays in one central plane, 30 red back stays in two planes converging on abutment S1"},
    },  # round-7 notes live in the shape file
    "cau-kien": {"set": {"cables_per_side": 9, "deck_width_m": 16.7}, "note": "36 stay pairs = 9 per side per plane; deck 16.7 m (vi.wikipedia)."},
    "cau-ba-son": {"scale_y": 0.92, "set": {"cables_per_side": 14}, "note": "56 stay bundles = 14 per side per plane; 113 m (vi.wikipedia)."},
    "cau-may-chai": {"set": {"cable_pattern": "harp"}, "note": "Harp stays ('dây văng kiểu đàn hạc', baohaiphong / congly)."},
    "cau-thuan-an": {"set": {"deck_elevation_m": 40},
        "pylon_custom": None,   # filled below
        "note": "Deck ≈40 m above water: pylon 32 m above deck and 72 m above water (Tiền Phong). A-head on the pier head (legs from the deck edges), single central plane."},
    # round 9 (research/model-review/brief-r9-hoa-son.md): deck 55 m above full-pool water (deck ≈0.30 of the 187 m
    # water-to-tip height in the official elevation render); the note lives in the shape file, not as "Review r1:"
    "cau-hoa-son": {"set": {"deck_elevation_m": 55}},
    # round 8 (research/model-review/brief-r8-tu-lien.md): scale_y 0.94 removed, the diamond-X pylon is at real scale
    "cau-tu-lien": {"set": {"deck_elevation_m": 24.5, "deck_crest_m": 1.7, "auxiliary_piers_m": [50, 950], "cables_per_side": 19,
                            "back_stay_deck_m": [28, 244], "pylon_colour": "#e8e0cc", "stay_colour": "white"}},  # note lives in M3D
    "cau-long-hung": {"set": {"deck_crest_m": 6, "deck_width_m": 37, "auxiliary_piers_m": [60, 640]},
        "pylon_custom": None,   # filled below
        "bridge": {"pylons": "2 tháp 'song kiếm hợp bích': hai lưỡi mảnh giữa dải phân cách, chụm nhọn ở đỉnh, chân choãi dưới mặt cầu, cao 175 m",
                   "pylons_en": "2 'twin swords' pylons: two slim median blades meeting at a pointed tip, flared below the deck, 175 m"},
        "note": "Twin swords ('song kiếm hợp bích', 1thegioi; ground-breaking render); crest, aux piers and 37 m deck."},
    "cau-can-tho-2": {"scale_y": 0.913, "set": {"deck_section": "truss", "deck_depth_m": 14},
        "pylon_custom": {"crossbeams_y_m": [-15, 98.6]},
        "note": "Double-deck steel truss (road on top, 2 rail tracks below; baoxaydung, VnExpress), depth ≈14 m estimated; the deeper deck raises the deck, so the custom pylon is scaled to keep ≈160 m total."},
    "cau-duong-sat-can-gio": {"set": {"pylon_shape": "A", "deck_section": "truss", "deck_depth_m": 10},
        "bridge": {"pylons": "2 tháp chữ A; dầm giàn thép", "pylons_en": "2 A-shaped pylons; steel-truss girder"},
        "note": "'Hai trụ tháp chữ A', steel-truss girder (nguoiquansat)."},
    "cau-ngoc-hoi": {"set": {"deck_width_m": 38.3}, "note": "Deck 38.3 m overall incl. stay-anchor zones (32.3 m carriageway)."},
    "cau-can-gio": {"set": {"pylon_heights_m": [150, 150]},
        "bridge": {"pylons": "2 tháp hình cây đước (chân rễ choãi), cao ≈150 m", "pylons_en": "2 mangrove-tree pylons with splayed root legs, ≈150 m"},
        "note": "Height label 150 m (most press; some say 100 m)."},
}
REVIEW_R1["cau-rach-mieu"]["pylon_custom"]["legs"] = [
    {"centerline": [[0, -30, -14], [0, 0, -9.5], [0, 40, -3], [0, 58, 0]], "width_base_m": 3.5, "width_top_m": 2.5},
    {"centerline": [[0, -30, 14], [0, 0, 9.5], [0, 40, 3], [0, 58, 0]], "width_base_m": 3.5, "width_top_m": 2.5},
    {"centerline": [[0, 58, 0], [0, 66, 0], [0, 75, 0]], "width_base_m": 3.5, "width_top_m": 2.8},
]
REVIEW_R1["cau-thuan-an"]["set"]["pylon_custom"] = {
    "description": "Low A-head on each pier: two legs rise from the pier head at the deck edges and lean in to an apex 32 m above the deck, with a central king-post from the upper third through the apex to a short head that carries the single central plane of red extradosed stays. A single pier column carries the pier head below the deck.",
    "legs": [
        {"centerline": [[0, -3, -10.5], [0, 0, -10], [0, 16, -5], [0, 32, 0]], "width_base_m": 2.5, "width_top_m": 2.0},
        {"centerline": [[0, -3, 10.5], [0, 0, 10], [0, 16, 5], [0, 32, 0]], "width_base_m": 2.5, "width_top_m": 2.0},
        # central king-post carrying the single stay plane (saddles), rising through the apex to a short head
        {"centerline": [[0, 16, 0], [0, 26, 0], [0, 36, 0]], "width_base_m": 2.4, "width_top_m": 1.6, "depth_base_m": 3.0, "depth_top_m": 2.2},
    ],
    "struts": [{"a": [0, -40, 0], "b": [0, -3, 0], "width": 8.0}, {"a": [0, -3, -10.5], "b": [0, -3, 10.5], "width": 3.0}],
    "anchor_zone": [{"y_from_m": 18, "y_to_m": 33, "leg": 2}],
    "mirror_for_other_pylons": True,
    "reference_images": ["https://tienphong.vn/chiem-nguong-cau-day-do-vuot-cua-bien-dai-nhat-mien-trung-post1810259.tpo"],
}
del REVIEW_R1["cau-thuan-an"]["pylon_custom"]
REVIEW_R1["cau-long-hung"]["set"]["pylon_custom"] = {
    "description": "Twin swords ('song kiếm hợp bích'): two slim legs in the median, separate for the full height with a narrow slot, meeting at a pointed tip; below the deck they flare out to a wider footing. Single central plane of stays anchored along both blades.",
    "legs": [
        {"centerline": [[0, -30, -7], [0, 0, -3.5], [0, 70, -2.2], [0, 125, -1], [0, 140, 0]], "width_base_m": 3.0, "width_top_m": 1.8, "depth_base_m": 6.0, "depth_top_m": 4.0},
        {"centerline": [[0, -30, 7], [0, 0, 3.5], [0, 70, 2.2], [0, 125, 1], [0, 140, 0]], "width_base_m": 3.0, "width_top_m": 1.8, "depth_base_m": 6.0, "depth_top_m": 4.0},
    ],
    "crossbeams_y_m": [-3],
    "crown": "pointed",
    "anchor_zone": [{"y_from_m": 60, "y_to_m": 132, "leg": 0}, {"y_from_m": 60, "y_to_m": 132, "leg": 1}],
    "mirror_for_other_pylons": True,
    "reference_images": ["https://1thegioi.vn/cau-cat-lai-va-cau-long-hung-cong-nghe-gap-ngon-ngu-kien-truc-258897.html"],
}
del REVIEW_R1["cau-long-hung"]["pylon_custom"]
# round 7 (G9 labels include the crest at the pylon): the drawn tip was 35 + 4.5 + 140 = 179.5 m;
# scale the above-deck geometry so the tip lands at 175 m (175 − 35 − 4.5 = 135.5 m above the local deck)
scale_custom(REVIEW_R1["cau-long-hung"]["set"]["pylon_custom"], 135.5 / 140)
# keys that must reach data/bridges.json (a regression fails the build)
EXPECT_R1 = {
    "cau-bai-chay": {"stay_colour": "yellow", "deck_crest_m": 8.0}, "cau-my-thuan": {"deck_crest_m": 10.5, "cables_per_side": 16, "stay_colour": "#7aa6cc"},
    "cau-bach-dang": {"stay_colour": "orange"}, "cau-rach-mieu": {"stay_colour": "orange"},
    "cau-tran-thi-ly": {"pylon_colour": "white", "stay_colour": "white", "back_stay_colour": "red", "back_stay_planes": 2,
                        "spans_m": [200, 230], "auxiliary_piers_m": [50, 100, 150], "deck_elevation_m": 11, "deck_width_m": 34.5,
                        "cable_pattern": "semi_fan", "cables_per_side": 33, "back_stay_count": 15, "back_stay_deck_m": [181, 195],
                        "confidence": "verified"},
    "cau-cua-hoi": {"pylon_colour": "white", "stay_colour": "red"}, "cau-ben-rung": {"pylon_colour": "white", "stay_colour": "red"},
    "cau-thuan-an": {"pylon_colour": "white", "stay_colour": "red", "deck_elevation_m": 40},
    "cau-can-tho": {"auxiliary_piers_m": [40, 80, 930, 970], "cables_per_side": 27},
    "cau-may-chai": {"cable_pattern": "harp", "pylon_colour": "yellow", "deck_colour": "red"},
    "cau-phu-my-2": {"spans_m": [210, 450, 210]},
    "cau-vam-cong": {"stay_colour": "#3b7fd4", "colour_mode": "vivid", "cables_per_side": 18, "pylon_heights_m": [147, 147]},
    # round 2 (research/model-review/brief-round2-thuong-cat.md)
    "cau-thuong-cat": {"spans_m": [120, 270, 270, 120], "pylon_heights_m": [70, 80, 70], "pylon_height_ref": "above_deck",
                       "deck_width_m": 35.0, "deck_type": "concrete", "deck_elevation_m": 25, "cables_per_side": 13},
}

# ---------------- MERGE images + model3d into each bridge ----------------
for b in B:
    bid = b["id"]
    if bid in COMMONS:                      # curated Commons set replaces the single seed image
        b["images"] = list(COMMONS[bid])
    extra = PRESS.get(bid, [])
    if extra:
        b["images"] += [{k: v for k, v in p.items() if not k.startswith("_")} for p in extra]
        what = "; ".join(f"{p['credit']} – {p['_what']}" for p in extra)
        b["notes"] = (b.get("notes", "") + f" Link-only images (press/official, license unknown): {what}.").strip()
    assert b["images"], f"{bid}: no image"
    b["model3d"] = M3D[bid]
    if bid in PYLON:
        pc = PYLON[bid]
        for leg in pc["legs"]:
            assert len(leg["centerline"]) >= 3, bid
        for az in pc["anchor_zone"]:
            assert 0 <= az["leg"] < len(pc["legs"]) and az["y_from_m"] < az["y_to_m"], bid
        b["model3d"]["pylon_custom"] = pc
        b["model3d"]["confidence"] = "estimated"
    if bid in SHAPES and bid != "cau-tu-lien":
        sp = SHAPES[bid]
        m = dict(sp["model3d"])
        extra_notes = []
        if sp.get("colour"): extra_notes.append("Colour: " + sp["colour"] + ".")
        if sp.get("auxiliary_piers_m_from_end"): extra_notes.append("Auxiliary piers in each side span at ≈" + ", ".join(str(x) for x in sp["auxiliary_piers_m_from_end"]) + " m from the end pier.")
        if sp.get("notes"): extra_notes.append(sp["notes"])
        m["notes"] = " ".join(x for x in [m.get("notes", "")] + extra_notes if x).strip()
        if "pylon_custom" in m:
            for leg in m["pylon_custom"]["legs"]:
                assert len(leg["centerline"]) >= 3, bid
            for az in m["pylon_custom"]["anchor_zone"]:
                assert 0 <= az["leg"] < len(m["pylon_custom"]["legs"]) and az["y_from_m"] < az["y_to_m"], bid
        m["confidence"] = "estimated"
        b["model3d"] = m
        b["pylons"] = sp["pylons_vi"]
        b["pylons_en"] = sp["pylons_en"]
    # PHASE6 for every bridge; keys the pass-2 shape file sets itself win (Máy Chai keeps its refined legs/struts)
    if bid in PHASE6:
        shape_m = SHAPES.get(bid, {}).get("model3d", {}) if SHAPES.get(bid, {}).get("pass2") else {}
        shape_pc = shape_m.get("pylon_custom", {})
        m = b["model3d"]
        for k, v in PHASE6[bid].items():
            if k == "pylon_custom":
                assert "pylon_custom" in m, bid
                for kk, vv in v.items():
                    if kk == "legs_override":
                        if "legs" in shape_pc: continue
                        for li, cl in vv.items():
                            m["pylon_custom"]["legs"][li]["centerline"] = cl
                    elif kk not in shape_pc:
                        m["pylon_custom"][kk] = vv
            elif k not in shape_m:
                m[k] = v
    sanitize_model3d(b["model3d"])
    check_panels(b["model3d"], bid)
    if bid in REVIEW_R1:
        apply_review(b, REVIEW_R1[bid])
    for frag in DROP_IMAGES.get(bid, []):
        b["images"] = [im for im in b["images"] if frag not in im["url"] and frag not in im["source"]]
    assert b["images"], f"{bid}: no image after drop"
    if bid in DECK_RADIUS:
        b["model3d"]["deck_plan_radius_m"] = DECK_RADIUS[bid]
    if NAV.get(bid):
        b["nav_clearance"] = NAV[bid]
        h = NAV[bid].get("height_m")
        if h is not None:
            assert h > 0, bid
            m = b["model3d"]
            if m["pylon_height_ref"] == "total":
                assert h < min(m["pylon_heights_m"]), f"{bid}: clearance {h} >= pylon height"
    if b["structure_type"] == "extradosed":
        assert b["model3d"].get("extradosed") is True, bid
    assert sum(b["model3d"]["spans_m"]) > 0 and max(b["model3d"]["spans_m"]) >= b["main_span_m"] - 1, bid

VIVID_OK = {"cau-ngoc-hoi", "cau-vam-cong"}   # G14 colour_mode "vivid" is opt-in per bridge (r8 Ngọc Hồi, r9 Vàm Cống)
for b in B:
    m = b["model3d"]
    for k in NON_SCHEMA: assert k not in m, (b["id"], k)
    assert m.get("colour_mode", "muted") in ("muted", "vivid"), b["id"]
    assert b["id"] in VIVID_OK or "colour_mode" not in m, (b["id"], "G14 vivid is opt-in per bridge")
    for k, v in EXPECT_R1.get(b["id"], {}).items():
        assert m.get(k) == v, (b["id"], k, m.get(k))
    if "pylon_custom" in m:
        for leg in m["pylon_custom"]["legs"]: assert len(leg["centerline"]) >= 3, b["id"]
        for az in m["pylon_custom"]["anchor_zone"]:
            assert 0 <= az["leg"] < len(m["pylon_custom"]["legs"]) and az["y_from_m"] < az["y_to_m"], b["id"]
    if b["id"] == "cau-thuong-cat":   # round 3: slender blades along the bridge, wide wings across
        legs = m["pylon_custom"]["legs"]
        assert [l["depth_base_m"] for l in legs[:4]] == [10.0, 10.0, 4.5, 4.5], legs
        assert legs[2]["width_base_m"] == 10.0 and legs[2]["width_top_m"] == 1.0, legs[2]
        assert [z["leg"] for z in m["pylon_custom"]["anchor_zone"]] == [2, 3]
    if b["id"] == "cau-nguyen-trai":  # round 6: three-column sail pylons, main stays on the mast, side stays on rear columns
        pc = m["pylon_custom"]
        assert m["spans_m"] == [125, 300, 125] and m["cable_planes"] == 1 and m["back_stay_planes"] == 2, m
        assert m["cables_per_side"] == 20 and m["deck_elevation_m"] == 30 and m["deck_crest_m"] == 4, m
        assert len(pc["legs"]) == 3 and pc["crossbeams_y_m"] == [-4, 22, 42, 60], pc
        assert [(z["leg"], z["side"]) for z in pc["anchor_zone"]] == [(1, "main"), (0, "back"), (2, "back")], pc
        assert pc["pile_cap"]["top_y_m"] == -28 and b["lanes"] == 6
    if b["id"] == "cau-phuoc-khanh":  # round 7: H portal, upper beam ≈63 % up, free posts, stays only above the beam
        pc = m["pylon_custom"]
        assert m["spans_m"] == [149.5, 300, 149.5] and m["pylon_heights_m"] == [135.8, 135.8], m
        assert m["deck_elevation_m"] == 58.5 and m["deck_crest_m"] == 2.5 and m["stay_colour"] == "white", m
        assert m["cables_per_side"] == 14 and m["cable_pattern"] == "semi_fan" and m["cable_planes"] == 2, m
        assert [l["centerline"][-1][1] for l in pc["legs"]] == [68, 68], "free posts end 68 m above deck (not rescaled)"
        assert [l["centerline"][0][2] for l in pc["legs"]] == [-13, 13] and pc["crossbeams_y_m"] == [], pc
        assert sorted(st["a"][1] for st in pc["struts"]) == [-5.5, 43], pc["struts"]
        assert all(z["y_from_m"] > 43 and z["y_to_m"] < 68 for z in pc["anchor_zone"]), "stays only above the upper beam"
        assert all(l["centerline"][0][1] == pc["pile_cap"]["top_y_m"] == -55 for l in pc["legs"]), "legs stand on the cap"
        assert b["nav_clearance"]["width_m"] == 242 and "135,8" in b["pylons"] and "135.8" in b["pylons_en"], b
    if b["id"] == "cau-binh-khanh":   # round 7: H legs reach the water outside a 30.35 m deck, beam at 2/3, tie at the waterline
        pc = m["pylon_custom"]
        assert m["spans_m"] == [187.25, 375, 187.25] and "auxiliary_piers_m" not in m, m
        assert m["deck_elevation_m"] == 60 and m["deck_depth_m"] == 3 and m["deck_width_m"] == 30.35 and b["width_m"] == 21.75, m
        assert m["cable_planes"] == 2 and m["cables_per_side"] == 17 and m["stay_colour"] == "white", m
        assert pc["crossbeams_y_m"] == [] and [s["a"][1] for s in pc["struts"]] == [61, -53], pc
        assert all(l["centerline"][0][1] == -62 and l["centerline"][-1][1] == 93 for l in pc["legs"]), pc
        assert sorted(l["centerline"][0][2] for l in pc["legs"]) == [-18.4, 18.4], pc
        assert [(z["leg"], z["y_from_m"], z["y_to_m"]) for z in pc["anchor_zone"]] == [(0, 53, 89), (1, 53, 89)], pc
        assert b["nav_clearance"]["height_m"] == 55 and b["nav_clearance"]["width_m"] == 242, b["nav_clearance"]
        assert "194" not in m["notes"] and "135 m H" not in m["notes"] and "top cross-beam" not in b["pylons_en"], m["notes"]
    if b["id"] == "cau-tran-thi-ly":  # round 7: 4×50 + 230 unit, leaning blade at S5, back stays converging on S1 (G11)
        pc = m["pylon_custom"]
        assert m["spans_m"] == [200, 230] and m["auxiliary_piers_m"] == [50, 100, 150], m
        assert m["cable_planes"] == 1 and m["back_stay_planes"] == 2 and m["cables_per_side"] == 33, m
        assert m["back_stay_count"] == 15 and m["back_stay_deck_m"] == [181, 195] and m["deck_elevation_m"] == 11, m
        assert pc["legs"][0]["centerline"][-1] == [-28.5, 134, 0] and pc["legs"][0]["depth_base_m"] == 11, pc
        assert [(z["leg"], z["side"], z["y_from_m"], z["y_to_m"]) for z in pc["anchor_zone"]] == [(0, "main", 48, 126), (0, "back", 68, 126)], pc
        assert pc["pile_cap"]["top_y_m"] == -10.5 and b["width_m"] == 34.5 and b["confidence"] == "verified", b["id"]
        assert b["nav_clearance"]["height_m"] == 7 and b["nav_clearance"]["width_m"] == 50, b["nav_clearance"]
        assert "120 m" not in m.get("notes", "") and "Geometry unchanged" not in m.get("notes", ""), m["notes"]
    if b["id"] == "cau-rach-mieu-2":  # round 7: H pylon with an upper strut, no aux piers, crested deck, pile cap
        pc = m["pylon_custom"]
        assert m["spans_m"] == [120, 270, 120] and "auxiliary_piers_m" not in m, m
        assert m["cables_per_side"] == 14 and m["stay_colour"] == "white" and m["cable_pattern"] == "semi_fan", m
        assert m["deck_elevation_m"] == 36 and m["deck_crest_m"] == 6 and m["deck_width_m"] == 21.5 and b["width_m"] == 21.5, m
        assert len(pc["legs"]) == 2 and pc["crossbeams_y_m"] == [-3, 35] and pc["crossbeam_depth_m"] == 5, pc
        assert all(l["centerline"][-1][1] == 66 and l["centerline"][0][1] == pc["pile_cap"]["top_y_m"] for l in pc["legs"]), pc
        assert sorted(l["centerline"][0][2] for l in pc["legs"]) == [-13, 13], "columns outside the 21.5 m deck"
        assert [(z["y_from_m"], z["y_to_m"]) for z in pc["anchor_zone"]] == [(31, 61), (31, 61)], pc
        assert pc["pile_cap"]["rounded_ends"] is False and b["span_arrangement"] == "120 + 270 + 120 m", b
        assert "No free image" not in b["notes"] and b["pylons"].startswith("2 tháp chữ H"), b
    if b["id"] == "cau-hoa-son":  # round 9: 'mountain peak' inverted Y, TEDI spans, light stays, deck 55 (official render)
        pc = m["pylon_custom"]
        assert m["spans_m"] == [40, 40, 150, 550, 150, 40, 40] and sum(m["spans_m"]) == 1010, m
        assert M3D["cau-hoa-son"]["spans_m"] == m["spans_m"] and M3D["cau-hoa-son"]["cables_per_side"] == 22, "fallback in step"
        assert m["deck_elevation_m"] == 55 and m["deck_width_m"] == 21.0 and m["deck_type"] == "composite", m
        assert m["cables_per_side"] == 22 and m["back_stay_count"] == 22 and m["back_stay_deck_m"] == [14, 142], m
        assert m["pylon_colour"] == "white" and m["stay_colour"] == "#cfdbe6" and m["approach_length_m"] == 200, m
        assert m["pylon_heights_m"] == [187, 187] and m["pylon_height_ref"] == "total", m
        assert len(pc["legs"]) == 4 and "crossbeams_y_m" not in pc and pc["crown"] == "pointed", pc
        assert [l["centerline"][-1][1] for l in pc["legs"]] == [78, 78, 123, 132], "merge 78, spire tip 132"
        assert [l["centerline"][4][2] for l in pc["legs"][:2]] == [-14.5, 14.5], "legs pass outside the deck edges"
        assert pc["legs"][3]["width_top_m"] <= 1.0 and pc["legs"][2]["centerline"][0][1] < 78, pc["legs"][2:]
        assert [(z["leg"], z["y_from_m"], z["y_to_m"]) for z in pc["anchor_zone"]] == [(2, 84, 119)], "stays on the mast only"
        assert len(pc["panels"]) == 1 and pc["panels"][0]["depth_m"] < pc["legs"][0]["depth_top_m"] + 3, "cup/stem panel"
        assert pc["pile_cap"]["top_y_m"] == -57 and all(l["centerline"][0][1] == -57 for l in pc["legs"][:2]), pc
        assert b["nav_clearance"]["height_m"] == 7 and b["nav_clearance"]["width_m"] == 50, b["nav_clearance"]
        assert b["span_arrangement"].startswith("40 + 40 + 150 + 550") and b["width_m"] == 21 and b["lanes"] == 4, b
        assert "đỉnh núi" in b["pylons"] and "mountain peak" in b["pylons_en"] and "red-and-white" not in b["pylons_en"], b
        assert "Review r1" not in m["notes"] and "Trung Chính" in b["notes"], (m["notes"], b["notes"])
        assert any("tedi-gic.vn" in s for s in b["sources"]) and b["images"][0]["credit"] == "TEDI", b
    if b["id"] == "cau-tu-lien":  # round 8: diamond-X pylon, aux piers, 19 stays per side per plane (VOV elevation drawing)
        pc = m["pylon_custom"]
        assert m["spans_m"] == [250, 500, 250] and m["auxiliary_piers_m"] == [50, 950], m
        assert m["deck_elevation_m"] == 24.5 and m["deck_crest_m"] == 1.7 and m["deck_width_m"] == 43.0, m
        assert m["cables_per_side"] == 19 and m["back_stay_deck_m"] == [28, 244] and m["cable_planes"] == 2, m
        assert m["pylon_colour"] == "#e8e0cc" and m["stay_colour"] == "white", m
        assert len(pc["legs"]) == 4 and "crossbeams_y_m" not in pc and "twist_deg" not in str(pc), "no scale/blades"
        assert [l["centerline"][-1][1] for l in pc["legs"]] == [74, 74, 159.5, 150], "not rescaled (scale_y removed)"
        assert pc["legs"][0]["centerline"][5] == [0, 62, 0] == pc["legs"][1]["centerline"][5], "legs cross at y 62"
        assert pc["legs"][0]["centerline"][-1] == pc["legs"][3]["centerline"][0], "leg from -z continues as the +z post"
        assert pc["legs"][1]["centerline"][-1] == pc["legs"][2]["centerline"][0], "leg from +z continues as the -z post"
        assert sorted(st["a"][1] for st in pc["struts"]) == [-8.5, 145], pc["struts"]
        assert [(z["leg"], z["y_from_m"], z["y_to_m"]) for z in pc["anchor_zone"]] == [(2, 92, 141), (3, 92, 141)], pc
        assert pc["pile_cap"]["top_y_m"] == -25.0 and all(l["centerline"][0][1] == -25.0 for l in pc["legs"][:2]), pc
        assert b["nav_clearance"]["height_m"] == 10 and b["nav_clearance"]["width_m"] == 80, b["nav_clearance"]
        assert b["span_arrangement"] == "50 + 200 + 500 + 200 + 50 m" and "+185" in b["pylons_en"] and "đan chéo" in b["pylons"], b
        assert "twisted blades" not in b["pylons_en"] and "superseded" in m["notes"] and "Review r1" not in m["notes"], m["notes"]
    if b["id"] == "cau-phuoc-an":   # round 9 (brief-r9-phuoc-an.md): 'giọt nước' pointed arch, legs to the cap, closed deck
        pc = m["pylon_custom"]
        assert m["spans_m"] == [137.5, 250, 137.5] and "auxiliary_piers_m" not in m, m
        assert m["pylon_heights_m"] == [119, 119] and m["pylon_height_ref"] == "total", m
        assert m["deck_elevation_m"] == 54 and m["deck_crest_m"] == 6.5 and m["deck_width_m"] == 27.0 and "deck_depth_m" not in m, m
        assert m["cable_pattern"] == "semi_fan" and m["cable_planes"] == 2 and m["cables_per_side"] == 12, m
        assert m["back_stay_deck_m"] == [24, 105] and m["main_stay_deck_m"] == [24, 105], m
        assert m["deck_closed"] is True and b["status"] == "under_construction", "G16: closed deck, still under construction"
        assert m["pylon_colour"] == "#e9e7e1" and m["stay_colour"] == "white" and m["extradosed"] is True, m
        assert pc["crown"] == "pointed", "PHASE6 'rounded' entry must stay deleted"
        assert len(pc["legs"]) == 2 and all(l["centerline"][-1] == [0, 60, 0] for l in pc["legs"]), "apex 60 m above the deck"
        assert [l["centerline"][0] for l in pc["legs"]] == [[0, -52, -9.5], [0, -52, 9.5]], "legs stand on the cap"
        assert [l["centerline"][3][2] for l in pc["legs"]] == [-16.0, 16.0], "legs just outside the 27 m deck"
        assert len(pc["struts"]) == 1 and pc["struts"][0]["a"][1] == -28 and "crossbeams_y_m" not in pc, pc
        assert len(pc["panels"]) == 1 and max(y for _, y in pc["panels"][0]["top"]) == 60.3, pc["panels"]
        assert [(z["leg"], z["y_from_m"], z["y_to_m"]) for z in pc["anchor_zone"]] == [(0, 18, 42), (1, 18, 42)], pc
        cap = pc["pile_cap"]
        assert (cap["length_x_m"], cap["width_z_m"], cap["top_y_m"], cap["thickness_m"], cap["rounded_ends"]) == (26, 48, -52, 5, True), cap
        assert b["span_arrangement"] == "137.5 + 250 + 137.5 m" and "119" in b["pylons"] and "pointed-arch" in b["pylons_en"], b
        assert "rounded" not in b["pylons_en"] and "rounded crown" not in json.dumps(m) + b["notes"], "no rounded crown left"
        assert any("thanhtra.com.vn" in u for u in b["sources"]) and any("trungnamec" in u for u in b["sources"]), b["sources"]
        assert sum("Báo Xây dựng / CafeF" == im["credit"] for im in b["images"]) == 3, b["images"]
        assert "Placeholder" not in m["notes"] and "137.5 + 250 + 137.5" in b["notes"], (m["notes"], b["notes"])
    assert b["id"] == "cau-phuoc-an" or not ({"deck_closed", "main_stay_deck_m"} & set(m)), (b["id"], "G15/G16 opt-in")
    if b["id"] == "cau-ben-rung":     # round 5: foundation (pile cap + columns), 22 m deck, 25° blades, 12 stays
        pc = m["pylon_custom"]
        assert m["deck_elevation_m"] == 22 and m["cables_per_side"] == 12 and m["cable_pattern"] == "semi_fan", m
        assert pc["pile_cap"]["top_y_m"] == -20 and pc["pile_cap"]["rounded_ends"] is True, pc
        assert all(l["centerline"][0][1] == pc["pile_cap"]["top_y_m"] for l in pc["legs"]), "columns stand on the cap"
        assert m["pylon_colour"] == "white" and m["stay_colour"] == "red"
    if b["id"] == "cau-ngoc-hoi":   # round 8: 'Cổng Mặt Trời' (brief-r8-ngoc-hoi.md)
        pc = m["pylon_custom"]
        assert m["spans_m"] == [165, 350, 165] and "auxiliary_piers_m" not in m, m
        assert m["deck_elevation_m"] == 24.5 and m["deck_crest_m"] == 4 and m["deck_width_m"] == 38.3, m
        assert m["cables_per_side"] == 16 and m["cable_planes"] == 2 and m["cable_pattern"] == "semi_fan", m
        assert m["stay_colour"] == "#d4a24c" and "pylon_colour" not in m and m["colour_mode"] == "vivid", m
        assert [l.get("colour") for l in pc["legs"]] == ["#e06a3e", "#e06a3e", None, None], "red inner posts, concrete outer skin"
        assert all(l["centerline"][-1][1] == 98.5 for l in pc["legs"]) and "crossbeams_y_m" not in pc, pc
        assert len(pc["struts"]) == 4 and all(st["a"][1] == pc["pile_cap"]["top_y_m"] == -23.5 and st["b"][1] == 21 for st in pc["struts"])
        assert len(pc["panels"]) == 1 and pc["panels"][0]["colour"] == "#e06a3e", pc["panels"]
        pn = pc["panels"][0]
        assert min(y for _, y in pn["top"]) == 27.9 and max(y for _, y in pn["bottom"]) == 23.2, pn
        assert [(z["leg"], z["y_from_m"], z["y_to_m"]) for z in pc["anchor_zone"]] == [(0, 36, 87), (1, 36, 87)], pc
        assert (pc["pile_cap"]["length_x_m"], pc["pile_cap"]["width_z_m"]) == (24, 50), pc["pile_cap"]
        assert b["width_m"] == 38.3 and b["span_arrangement"] == "165 + 350 + 165 m" and b["lanes"] == 8, b
        assert "Cổng Mặt Trời" in b["pylons"] and "Sun Gate" in b["pylons_en"] and b["confidence"] == "needs_check", b
        assert "derived" not in m["notes"] and "Width 32.3–38.3" not in b["notes"], (m["notes"], b["notes"])
    if b["id"] == "cau-my-thuan":   # round 10: H legs leaning in to one arched upper beam, posts above (brief-r10-my-thuan.md)
        pc = m["pylon_custom"]
        assert m["spans_m"] == [150, 350, 150] and "auxiliary_piers_m" not in m, m
        assert m["pylon_heights_m"] == [121, 121] and m["pylon_height_ref"] == "total", m
        assert M3D["cau-my-thuan"]["pylon_heights_m"] == [121, 121], "fallback in step"
        assert m["deck_elevation_m"] == 30 and m["deck_crest_m"] == 10.5 and m["deck_depth_m"] == 1.8 and m["deck_width_m"] == 23.66, m
        assert m["cables_per_side"] == 16 and m["cable_planes"] == 2 and m["cable_pattern"] == "semi_fan", m
        assert m["back_stay_deck_m"] == [10.5, 149] and "colour_mode" not in m, m
        assert m["pylon_colour"] == "#dcd6c8" and m["stay_colour"] == "#7aa6cc", m
        assert "crossbeams_y_m" not in pc and len(pc["panels"]) == 2 and len(pc["legs"]) == 2, "both beams are panels"
        assert [l["centerline"][-1] for l in pc["legs"]] == [[0, 83.5, -9.5], [0, 83.5, 9.5]], "posts end at local 83.5"
        assert [l["centerline"][0][2] for l in pc["legs"]] == [-18.0, 18.0] and [l["centerline"][2][2] for l in pc["legs"]] == [-14.75, 14.75], pc
        assert [l["centerline"][4] for l in pc["legs"]] == [[0, 43, -10.4], [0, 43, 10.4]], "legs lean in to the upper beam"
        assert all((l["width_base_m"], l["width_top_m"], l["depth_base_m"], l["depth_top_m"]) == (5.0, 2.6, 6.0, 4.0) for l in pc["legs"]), pc
        up, lo = pc["panels"]
        assert max(y for _, y in up["top"]) == 45.5 and min(y for _, y in up["bottom"]) == 40.6 and max(y for _, y in up["bottom"]) == 41.6, up
        assert max(y for _, y in lo["top"]) == -1.6 and min(y for _, y in lo["bottom"]) == -6.8 and max(y for _, y in lo["bottom"]) == -5.8, lo
        assert pc["pile_cap"] == {"length_x_m": 20, "width_z_m": 52, "top_y_m": -26.4, "thickness_m": 5.6, "rounded_ends": True}, pc["pile_cap"]
        assert all(l["centerline"][0][1] == -26.4 for l in pc["legs"]), "legs stand on the cap"
        assert [(z["leg"], z["y_from_m"], z["y_to_m"]) for z in pc["anchor_zone"]] == [(0, 47, 79), (1, 47, 79)], pc
        assert b["nav_clearance"] == {"height_m": 37.5, "width_m": 110, "source": "https://tedi.vn/project/cau-my-thuan/"}, b["nav_clearance"]
        assert "123,5" in b["pylons"] and "84.43" in b["pylons_en"] and "2 dầm ngang" not in b["pylons"], b
        assert "general knowledge" not in b["notes"] and "Baulderstone" in b["notes"] and "1,535.2" in b["notes"], b["notes"]
        assert any("tedi.vn/project/cau-my-thuan" in s for s in b["sources"]) and any("aecom.com" in s for s in b["sources"]), b["sources"]
        assert "r10:" in m["notes"] and "≈55%" not in m["notes"], m["notes"]
    if b["id"] == "cau-vam-cong":   # round 9: improved-H pylon (brief-r9-vam-cong.md)
        pc = m["pylon_custom"]
        assert m["spans_m"] == [210, 450, 210] and "auxiliary_piers_m" not in m, m
        assert m["pylon_heights_m"] == [147, 147] and m["pylon_height_ref"] == "total", m
        assert m["deck_elevation_m"] == 33 and m["deck_crest_m"] == 8.5 and m["deck_depth_m"] == 2.5 and m["deck_width_m"] == 24.5, m
        assert m["cables_per_side"] == 18 and m["cable_planes"] == 2 and m["back_stay_deck_m"] == [12, 204], m
        assert m["pylon_colour"] == "#d8d5cc" and m["stay_colour"] == "#3b7fd4" and m["colour_mode"] == "vivid", m
        assert "crossbeams_y_m" not in pc and len(pc["panels"]) == 2 and len(pc["legs"]) == 2, "both beams are panels"
        assert [l["centerline"][-1] for l in pc["legs"]] == [[0, 107.8, -5.75], [0, 107.8, 5.75]], "not rescaled (scale_y removed)"
        assert [l["centerline"][2][2] for l in pc["legs"]] == [-17.2, 17.2] and [l["centerline"][4][2] for l in pc["legs"]] == [-5.75, 5.75], pc
        up = pc["panels"][0]
        assert max(y for _, y in up["top"]) == 84 and max(y for _, y in up["bottom"]) == 80.4 and min(y for _, y in up["bottom"]) == 75, up
        assert max(y for _, y in pc["panels"][1]["top"]) == -2.5 and min(y for _, y in pc["panels"][1]["bottom"]) == -12, pc["panels"][1]
        assert pc["pile_cap"]["top_y_m"] == -30.5 and all(l["centerline"][0][1] == -30.5 for l in pc["legs"]), pc["pile_cap"]
        assert [(z["leg"], z["y_from_m"], z["y_to_m"]) for z in pc["anchor_zone"]] == [(0, 48, 104), (1, 48, 104)], pc
        assert b["width_m"] == 24.5 and "GS E&C" in b["notes"] and "Daelim" not in b["notes"], b
        assert b["nav_clearance"] == {"height_m": 37.5, "reference": "for 10,000 DWT ships", "source": "https://tedi.vn/project/cau-vam-cong/"}, b["nav_clearance"]
        assert "cải tiến" in b["pylons"] and "improved H" in b["pylons_en"] and "143.9" in b["pylons_en"], b
        assert "≈140 m" not in m["notes"] and "143.9" in m["notes"], m["notes"]
    if "pylon_custom" in m and "pile_cap" in m["pylon_custom"]:
        c = m["pylon_custom"]["pile_cap"]
        assert min(c["length_x_m"], c["width_z_m"], c["thickness_m"]) > 0 and c["top_y_m"] <= 0, b["id"]
    aux = m.get("auxiliary_piers_m", [])
    assert all(0 < x < sum(m["spans_m"]) for x in aux), b["id"]

for b in B:
    for f in ("lat", "lng"):
        b[f] = float(b[f])
ids = [b["id"] for b in B]
assert len(ids) == len(set(ids))
order = ["id","name_vi","name_en","status","structure_type","usage","province","province_former","crosses","roads","railways",
         "construction_start","opened","main_span_m","total_length_m","width_m","lanes","cable_stayed_spans","span_arrangement",
         "pylons","pylons_en","investor","cost","nav_clearance","model3d","lat","lng","images","sources","confidence","notes"]
out = [{k: b[k] for k in order if k in b} for b in B]
json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
from collections import Counter
print(len(out), Counter(b["status"] for b in out), Counter(b["structure_type"] for b in out), Counter(b["confidence"] for b in out))
