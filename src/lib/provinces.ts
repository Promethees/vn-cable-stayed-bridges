import { slugify } from './url';

export interface ProvinceInfo {
  /** display name (34-unit scheme, effective 1 July 2025) */
  name: string;
  slug: string;
  /** fixed dot anchor: approximate centroid of the merged unit */
  lat: number;
  lng: number;
}

const P = (name: string, lat: number, lng: number, slug = slugify(name)): ProvinceInfo => ({ name, slug, lat, lng });

/** The 34 provincial-level units. Anchors are approximate centroids (good enough for a dot, not for analysis). */
export const PROVINCES: ProvinceInfo[] = [
  // 6 centrally-run cities
  P('Hà Nội', 21.0, 105.7),
  P('Hải Phòng', 20.85, 106.5),
  P('Huế', 16.35, 107.55),
  P('Đà Nẵng', 15.6, 108.0),
  P('TP. Hồ Chí Minh', 10.85, 106.75, 'ho-chi-minh'),
  P('Cần Thơ', 9.75, 105.85),
  // 28 provinces
  P('Lai Châu', 22.3, 103.2),
  P('Điện Biên', 21.7, 102.9),
  P('Sơn La', 21.2, 104.0),
  P('Lạng Sơn', 21.8, 106.6),
  P('Quảng Ninh', 21.15, 107.3),
  P('Thanh Hóa', 20.0, 105.4),
  P('Nghệ An', 19.2, 104.9),
  P('Hà Tĩnh', 18.3, 105.7),
  P('Cao Bằng', 22.7, 106.1),
  P('Tuyên Quang', 22.4, 105.2),
  P('Lào Cai', 22.0, 104.3),
  P('Thái Nguyên', 21.9, 105.8),
  P('Phú Thọ', 21.0, 105.25),
  P('Bắc Ninh', 21.3, 106.4),
  P('Hưng Yên', 20.6, 106.2),
  P('Ninh Bình', 20.3, 106.0),
  P('Quảng Trị', 17.3, 106.6),
  P('Quảng Ngãi', 14.8, 108.3),
  P('Gia Lai', 14.0, 108.4),
  P('Khánh Hòa', 12.1, 109.0),
  P('Lâm Đồng', 11.6, 107.9),
  P('Đắk Lắk', 12.9, 108.5),
  P('Đồng Nai', 11.4, 107.0),
  P('Tây Ninh', 11.0, 106.2),
  P('Vĩnh Long', 9.95, 106.35),
  P('Đồng Tháp', 10.45, 105.95),
  P('An Giang', 10.2, 105.0),
  P('Cà Mau', 9.15, 105.2),
];

const BY_SLUG = new Map(PROVINCES.map((p) => [p.slug, p]));

/** Normalises "TP. Hồ Chí Minh", "Thành phố Hồ Chí Minh", "tỉnh Vĩnh Long" … to a canonical slug. */
export function provinceSlug(raw: string): string {
  return slugify(raw).replace(/^(tp|thanh-pho|tinh)-/, '');
}

export const findProvince = (raw: string): ProvinceInfo | undefined => BY_SLUG.get(provinceSlug(raw));

/** "Đồng Tháp – Vĩnh Long" → ["Đồng Tháp", "Vĩnh Long"] (bridges on a boundary list both banks). */
export function splitProvinces(value: string): string[] {
  return value
    .split(/\s+[–—-]\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** First listed province: used for breadcrumbs and the card's back button. */
export const primaryProvince = (value: string): string => {
  const first = splitProvinces(value)[0] ?? value;
  return findProvince(first)?.name ?? first;
};
