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
    width_m=21.6, lanes=6, cable_stayed_spans=1, cost="5,700 tỷ VND", lat=10.3170, lng=105.5043,
    images=[img(U+"c/cc/C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng.png", "Bùi Thụy Đào Nguyên", "CC BY-SA 4.0", C+"C%E1%BA%A7u_V%C3%A0m_C%E1%BB%91ng.png")],
    sources=[W+"Vàm_Cống_Bridge", LIST, OSM], confidence="verified",
    notes="Road code from OpenStreetMap (CT.02; also tagged as Đường Hồ Chí Minh). Opened 19/5/2019.")

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
    sources=[W+"Bình_Khánh_Bridge", "https://tuoitre.vn/cao-toc-ben-luc-long-thanh.html", LIST, OSM], confidence="needs_check",
    notes="On the Bến Lức–Long Thành expressway (OSM tags it CT.01; to confirm). Inaugurated 12/2025, but full traffic began only when Phước Khánh opened (1/10/2026 per Wikipedia).")

add(id="cau-my-thuan", name_vi="Cầu Mỹ Thuận", name_en="Mỹ Thuận Bridge", status="completed",
    province="Đồng Tháp – Vĩnh Long", province_former=["Tiền Giang", "Vĩnh Long"], crosses="Sông Tiền",
    roads=["QL1A"], construction_start=1997, opened=2000, main_span_m=350, total_length_m=1535,
    width_m=23.66, lanes=4, cable_stayed_spans=1, span_arrangement="150 + 350 + 150 m", pylons="2 H-shaped pylons, 120 m above high water",
    cost="≈A$91 million", lat=10.2775, lng=105.9100,
    images=[img(U+"5/58/C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_%286297673871%29.jpg", "Quang Vũ Trương", "CC BY 2.0", C+"C%E1%BA%A7u_M%E1%BB%B9_Thu%E1%BA%ADn_(6297673871).jpg")],
    sources=[W+"My_Thuan_Bridge", LIST, OSM], confidence="verified",
    notes="Vietnam's first large cable-stayed bridge. Opened 21/5/2000. Wikipedia gives total length as both 1,535 m and 1,560 m. Span arrangement from general knowledge of the 150+350+150 layout; the article lists only the 350 m main span.")

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
    width_m=21.75, lanes=4, cable_stayed_spans=1, pylons="2 pylons, ≈135 m", lat=10.6659, lng=106.7988,
    images=[img(U+"a/ac/C%E1%BA%A7u_Ph%C6%B0%E1%BB%9Bc_Kh%C3%A1nh_2017.jpg", "Pieceofmetalwork", "CC0", C+"C%E1%BA%A7u_Ph%C6%B0%E1%BB%9Bc_Kh%C3%A1nh_2017.jpg")],
    sources=[W+"Phước_Khánh_Bridge", "https://tuoitre.vn/cao-toc-ben-luc-long-thanh.html", "https://cafef.vn/nhung-cong-doan-cuoi-cung-truoc-khi-thong-xe-cau-phuoc-khanh-188260911101103844.chn", OSM], confidence="needs_check",
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
    width_m=17.5, lanes=4, cable_stayed_spans=1, pylons="2 pylons, ≈113 m", cost="6,810 tỷ VND (whole project)",
    lat=10.3368, lng=106.3074,
    sources=["https://vi.wikipedia.org/wiki/C%E1%BA%A7u_R%E1%BA%A1ch_Mi%E1%BB%85u_2", "https://vneconomy.vn/cau-rach-mieu-2-se-khanh-thanh-vao-ngay-19-8-2025.htm", "https://tienphong.vn/can-canh-cau-day-vang-6810-ty-dong-bac-qua-song-tien-post1764558.tpo", "roads QL60B: " + CC, OSM], confidence="verified",
    notes="About 3.8 km upstream of Rạch Miễu 1. Opened 19/8/2025. Sources disagree on length (1,954 m vs 1,971.2 m) and width (17.5 m vs 21.5 m). No free image found.")

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
    width_m=35.5, cable_stayed_spans=1, pylons="1 inclined pylon, 145 m, leaning 12°", cost="497.7 tỷ VND (Wikipedia) / 1,709 tỷ VND (press, whole project)",
    lat=16.0504, lng=108.2300,
    images=[img(U+"2/2c/Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge_at_daytime.jpg", "Tycho (shansov.net)", "CC BY-SA 3.0", C+"Tr%E1%BA%A7n_Th%E1%BB%8B_L%C3%BD_Bridge_at_daytime.jpg")],
    sources=[W+"Trần_Thị_Lý_Bridge", LIST, "https://mia.vn/cam-nang-du-lich/cau-tran-thi-ly-da-nang-14983", "https://structurae.net/en/structures/nguyen-van-troi-tran-thi-ly-bridge"], confidence="needs_check",
    notes="Single-pylon asymmetric cable-stayed bridge. The 230 m 'main span' (actually the cable-stayed span) comes from a travel site and the Wikipedia list. Construction start is given as 2003 (press, whole project) or 2009 (Wikipedia). Opened 29/3/2013.")

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
    cable_stayed_spans=1, pylons="2 pylons, 187 m", investor="Ban QLDA khu vực Hòa Bình", lat=20.78, lng=105.21,
    sources=["https://baolamdong.vn/cao-toc-10000-ty-hoa-binh-moc-chau-phan-dau-ve-dich-som-1-nam-va-ky-luc-cau-day-vang-424941.html", "https://nguoiquansat.vn/tay-bac-sap-co-cay-cau-moi-lap-ky-luc-viet-nam-quy-mo-3-100-ty-cam-hung-thiet-ke-tu-nui-rung-dia-phuong-298648.html", "https://baodauthau.vn/1-nha-thau-tham-du-goi-thau-xay-lap-cau-hoa-son-hon-5502-ty-post172897.html"], confidence="needs_check",
    notes="COORDINATES APPROXIMATE (±10 km): placed on the Hòa Bình reservoir near the Mai Châu bank; exact site not found. Started 15/4/2025; completion target end-2028 (expressway target 2027). Would equal Cần Thơ (550 m) as the longest span in Vietnam.")

add(id="cau-tu-lien", name_vi="Cầu Tứ Liên", name_en="Tứ Liên Bridge", status="under_construction",
    province="Hà Nội", province_former=["Hà Nội"], crosses="Sông Hồng",
    roads=[], construction_start=2025, opened=2027, main_span_m=500, total_length_m=1000, width_m=43,
    cable_stayed_spans=1, pylons="2 pylons, ≈185 m", cost="≈20,100 tỷ VND", investor="Liên danh Vingroup (BT)",
    lat=21.0709, lng=105.8513,
    sources=["https://baolamdong.vn/cau-tu-lien-hon-20100-ty-dong-tien-do-thi-cong-va-lo-trinh-hop-long-nam-2027-455142.html", "https://cafef.vn/cau-day-vang-gan-20000-ty-dong-o-ha-noi-dang-thay-doi-dien-mao-the-nao-188261101071700319.chn", OSM], confidence="verified",
    notes="Started 19/5/2025. Main-span closure target 30/7/2027, opening target ≈10/2027. Total length is for the main cable-stayed bridge only. Connects Tây Hồ (Nghi Tàm) and Đông Anh; road name not set.")

add(id="cau-dai-ngai-1", name_vi="Cầu Đại Ngãi 1", name_en="Đại Ngãi 1 Bridge", status="under_construction",
    province="Vĩnh Long – Cần Thơ", province_former=["Trà Vinh", "Sóc Trăng"], crosses="Sông Hậu",
    roads=["QL60"], construction_start=2025, opened=2028, main_span_m=450, cable_stayed_spans=1,
    pylons="2 A-shaped pylons (110 m or 164 m per source)", cost="≈3,900 tỷ VND (package)", investor="Bộ Xây dựng (Ban QLDA 85); contractor Đèo Cả",
    lat=9.7069, lng=106.1506,
    sources=["https://moc.gov.vn/vn/tin-tuc/1252/92886/day-nhanh-tien-do-cong-trinh-cau-dai-ngai-1-bac-qua-song-hau.aspx", "https://tienphong.vn/cau-dai-ngai-1-dat-hon-63-khoi-luong-phan-dau-thong-tuyen-trong-nam-2027-post1851319.tpo", "https://vneconomy.vn/bo-giao-thong-van-tai-neu-nguyen-nhan-lui-tien-do-cau-day-vang-lon-thu-2-viet-nam.htm", OSM], confidence="verified",
    notes="Construction from 12/1/2025. Completion target: 'thông tuyến 2027' (Tiền Phong) or 6/2028 (Đèo Cả package). Sources disagree on pylon height (110 m vs 164 m).")

add(id="cau-cat-lai", name_vi="Cầu Cát Lái", name_en="Cát Lái Bridge", status="under_construction",
    province="TP. Hồ Chí Minh – Đồng Nai", province_former=["TP. Hồ Chí Minh", "Đồng Nai"], crosses="Sông Đồng Nai",
    roads=["Đường Nguyễn Thị Định", "ĐT.769B"], construction_start=2026, opened=2029, main_span_m=450, total_length_m=11600,
    lanes=8, cable_stayed_spans=1, pylons="2 pylons (two cable planes)", cost="≈20,600–24,000 tỷ VND", investor="Liên danh do CC1 dẫn đầu (PPP-BT)",
    lat=10.7547, lng=106.7900,
    sources=["https://vietnamnet.vn/en/vietnam-breaks-ground-on-1-4-billion-bridges-linking-hcmc-dong-nai-2560272.html", "https://www.vietnamplus.vn/khoi-cong-2-cau-chien-luoc-ket-noi-thanh-pho-dong-nai-thanh-pho-ho-chi-minh-post1138956.vnp", "https://e.vnexpress.net/photo/traffic/vietnam-unveils-794m-cable-bridge-design-linking-ho-chi-minh-city-to-long-thanh-airport-corridor-5015145.html", "https://moc.gov.vn/vn/tin-tuc/1184/90985/cau-cat-lai-18-300-ti-dong-noi-dong-nai--tp-ho-chi-minh-dong-tho-vao-ngay-151.aspx", OSM], confidence="needs_check",
    notes="Groundbreaking 15/1/2026; construction start 29/9/2026. VietnamPlus describes a 'composite steel girder', while VietnamNet and other sources say cable-stayed with a 450 m main span. Total length includes approaches. 55 m navigation clearance. Coordinates are the OSM proposed alignment.")

add(id="cau-ngoc-hoi", name_vi="Cầu Ngọc Hồi", name_en="Ngọc Hồi Bridge", status="under_construction",
    province="Hà Nội – Hưng Yên", province_former=["Hà Nội", "Hưng Yên"], crosses="Sông Hồng",
    roads=[], construction_start=2025, opened=2027, main_span_m=350, total_length_m=680, width_m=33,
    lanes=8, cable_stayed_spans=1, pylons="2 H-shaped pylons, ≈126 m", cost="≈11,770–11,844 tỷ VND",
    lat=20.9600, lng=105.8950,
    sources=["https://cafef.vn/dai-cong-truong-cau-ngoc-hoi-sau-15-thang-thi-cong-188261103143452699.chn", "https://tienphong.vn/cau-ngoc-hoi-noi-ha-noi-voi-hung-yen-tang-toc-thi-cong-hai-tru-cau-thap-day-vang-post1817163.html", "https://tuoitre.vn/cong-truong-lam-cau-day-vang-hon-11-800-ti-dong-noi-ha-noi-va-hung-yen-20260128211946328.htm"], confidence="needs_check",
    notes="COORDINATES APPROXIMATE: the exact river-crossing location was not found (the OSM 'Cầu Ngọc Hồi' is an old QL1 bridge). Started 19/8/2025; target 8/2027. 680 m is the main river bridge. Width 32.3–38.3 m per source.")

add(id="cau-long-hung", name_vi="Cầu Long Hưng", name_en="Long Hưng Bridge", status="under_construction",
    province="TP. Hồ Chí Minh – Đồng Nai", province_former=["TP. Hồ Chí Minh", "Đồng Nai"], crosses="Sông Đồng Nai",
    roads=[], construction_start=2026, opened=2029, main_span_m=350, total_length_m=9800, lanes=8,
    cable_stayed_spans=1, pylons="single cable plane; pylon 175 m", cost="≈12,700 tỷ VND", investor="PPP (CC1 consortium)",
    lat=10.8260, lng=106.8880,
    sources=["https://vietnamnet.vn/en/vietnam-breaks-ground-on-1-4-billion-bridges-linking-hcmc-dong-nai-2560272.html", "https://www.vietnamplus.vn/khoi-cong-2-cau-chien-luoc-ket-noi-thanh-pho-dong-nai-thanh-pho-ho-chi-minh-post1138956.vnp", "https://thuonghieucongluan.com.vn/dieu-chinh-von-dau-tu-cau-long-hung-len-hon-12-700-ty-dong-tang-toc-ket-noi-tp-hcm-dong-nai-a322300.html", "https://nominatim.openstreetmap.org (Dự án Cầu Long Hưng)"], confidence="needs_check",
    notes="Also called Cầu Đồng Nai 2. COORDINATES APPROXIMATE, between the OSM project points in Long Phước (HCMC) and An Phước (Đồng Nai). Groundbreaking 15/1/2026; construction start 29/9/2026. Total length includes approaches.")

add(id="cau-nguyen-trai", name_vi="Cầu Nguyễn Trãi", name_en="Nguyễn Trãi Bridge", status="under_construction",
    province="Hải Phòng", province_former=["Hải Phòng"], crosses="Sông Cấm",
    roads=[], construction_start=2024, opened=2027, main_span_m=300, total_length_m=1476, width_m=26.5,
    cable_stayed_spans=1, span_arrangement="125 + 300 + 125 m", pylons="2 pylons, 111 m", cost="≈6,200–6,300 tỷ VND",
    lat=20.8707, lng=106.6940,
    sources=["https://daibieunhandan.vn/hai-phong-toan-canh-du-an-cau-nguyen-trai-va-vung-phu-can-hon-6-300-ty-dong-10425773.html", "https://vneconomy.vn/hai-phong-khoi-cong-xay-dung-cau-nguyen-trai-hon-6-200-ty-dong.htm", "https://tienphong.vn/cau-6300-ty-dong-noi-vung-loi-hai-phong-voi-khu-do-thi-moi-bac-song-cam-post1872017.tpo", OSM], confidence="needs_check",
    notes="Groundbreaking 18/12/2024. Cable-stayed main bridge due end-2027. One source says '550 m cable-stayed main bridge', which is the whole 125+300+125 unit.")

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
    cable_stayed_spans=1, cost="≈4,900 tỷ VND",
    lat=10.6285, lng=106.9989,
    sources=["https://nguoiquansat.vn/cau-day-vang-gan-5-000-ty-co-tinh-khong-cao-nhat-viet-nam-nhip-chinh-dai-nhat-dong-nam-a-noi-nhip-2-tp-truc-thuoc-trung-uong-la-hanh-lang-van-tai-chien-luoc-307915.html", "https://nhandan.vn/can-canh-cau-phuoc-an-ket-noi-quan-trong-giua-thanh-pho-ho-chi-minh-va-dong-nai-dang-vuot-tien-do-post968305.html", "https://thuviennhadat.vn/bat-dong-san/cau-phuoc-an-du-kien-hoan-thanh-vao-nam-2027-16917.html", OSM], confidence="needs_check",
    notes="EXTRADOSED (press calls it 'dây văng'), described as the longest extradosed span in SE Asia. Main span closed 24/7/2026; technical opening targeted end-2026 (no confirmation found by 25/11/2026), final completion 2027. Links Phú Mỹ (formerly BR-VT, now HCMC) and Nhơn Trạch (Đồng Nai).")


add(id="cau-thuong-cat", name_vi="Cầu Thượng Cát", name_en="Thượng Cát Bridge", status="under_construction",
    province="Hà Nội", province_former=["Hà Nội"], crosses="Sông Hồng",
    roads=["Vành đai 3.5 Hà Nội"], construction_start=2025, opened=2027, main_span_m=195, total_length_m=5200,
    lanes=8, cable_stayed_spans=4, span_arrangement="4 × 195 m", pylons="3 tháp dây văng", cost="≈7,300 tỷ VND",
    lat=21.1030, lng=105.7455,
    sources=["https://danviet.vn/lo-dien-vi-tri-3-tru-thap-chinh-cua-cau-thuong-cat-tren-song-hong-d1434160.html", "https://vtcnews.vn/toan-canh-cau-day-vang-hon-7-300-ty-dong-o-ha-noi-sau-gan-10-thang-thi-cong-ar1037024.html", "main_span_m / cable_stayed_spans / span_arrangement / pylons: " + CC, OSM], confidence="verified",
    notes="Span data client-confirmed 2026-11-25 (4 × 195 m = the 780 m river section). Press gives only '780 m with 3 large spans'. Started 8/10/2025; completion target 2027. Total length 5.2 km includes approaches (main bridge ≈3.9 km). Runs from Kỳ Vũ road (Thượng Cát) to QL23B (Thiên Lộc).")

# ---------------- PLANNED ----------------
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

for b in B:
    for f in ("lat", "lng"):
        b[f] = float(b[f])
ids = [b["id"] for b in B]
assert len(ids) == len(set(ids))
order = ["id","name_vi","name_en","status","structure_type","usage","province","province_former","crosses","roads","railways",
         "construction_start","opened","main_span_m","total_length_m","width_m","lanes","cable_stayed_spans","span_arrangement",
         "pylons","investor","cost","lat","lng","images","sources","confidence","notes"]
out = [{k: b[k] for k in order if k in b} for b in B]
json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
from collections import Counter
print(len(out), Counter(b["status"] for b in out), Counter(b["structure_type"] for b in out), Counter(b["confidence"] for b in out))
