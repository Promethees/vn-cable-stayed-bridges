import type { Status, StructureType, Usage } from '../types';

export type Lang = 'vi' | 'en';
export type L10n = { vi: string; en: string };

export const LANG_STORAGE_KEY = 'vncsb.lang';

const vi = {
  appTitle: 'Cầu dây văng Việt Nam',
  country: 'Việt Nam',
  backCountry: 'Toàn quốc',
  statusTitle: 'Trạng thái',
  usageTitle: 'Loại hình',
  filterFootnote: 'Chỉ gồm cầu dây văng có nhịp chính trên 150 m',
  sampleNote: 'Đang dùng dữ liệu mẫu',
  skipLink: 'Bỏ qua bản đồ, xem danh sách cầu',
  listTitle: 'Danh sách cầu',
  loading: 'Đang tải dữ liệu cầu…',
  loadFailed: 'Không tải được dữ liệu cầu.',
  retry: 'Thử lại',
  emptyFilter: 'Không có cầu nào khớp bộ lọc đã chọn.',
  showAll: 'Hiện tất cả',
  notFound: (id: string) => `Không tìm thấy cầu "${id}". Đang hiển thị toàn quốc.`,
  close: 'Đóng',
  mainSpan: 'nhịp chính',
  openGmaps: 'Mở Google Maps',
  openOsm: 'Mở OpenStreetMap',
  newTab: '(mở tab mới)',
  photos: 'Hình ảnh',
  noPhotos: 'Chưa có ảnh',
  photoBy: 'Ảnh',
  rightsReserved: '(bản quyền thuộc tác giả)',
  viewAtSource: 'Xem ảnh tại nguồn',
  sources: 'Nguồn',
  needsCheck: 'Một số số liệu đang được kiểm chứng.',
  notes: 'Ghi chú',
  provinceTooltip: (n: number) => `${n} cầu — nhấn để phóng to`,
  provinceAria: (p: string, n: number, a: number, b: number, c: number) =>
    `${p}: ${n} cầu (${a} đã thông xe, ${b} đang xây dựng, ${c} quy hoạch)`,
  bridgeAria: (name: string, status: string, span: string) => `${name}, ${status}, nhịp chính ${span}`,
  viewCountry: (n: number) => `Đang xem toàn quốc, ${n} cầu`,
  viewProvince: (p: string, n: number) => `Đang xem tỉnh ${p}, ${n} cầu`,
  viewBridge: (name: string) => `Đang xem ${name}`,
  mapLabel: 'Bản đồ cầu dây văng Việt Nam',
  layerOsm: 'Bản đồ OSM',
  layerLight: 'Bản đồ sáng',
  layerSat: 'Ảnh vệ tinh',
  sheetHandle: 'Thay đổi chiều cao thẻ',
  prev: 'Ảnh trước',
  next: 'Ảnh sau',
  diagramAria: (arr: string, main: string) => `Sơ đồ nhịp: ${arr}, nhịp chính ${main}`,
  bridgesCount: (n: number) => `${n} cầu`,
  langLabel: 'Ngôn ngữ',
};

type Dict = typeof vi;

const en: Dict = {
  appTitle: 'Cable-stayed bridges of Viet Nam',
  country: 'Viet Nam',
  backCountry: 'All of Vietnam',
  statusTitle: 'Status',
  usageTitle: 'Carries',
  filterFootnote: 'Cable-stayed bridges with a main span over 150 m',
  sampleNote: 'Showing sample data',
  skipLink: 'Skip map, view bridge list',
  listTitle: 'Bridge list',
  loading: 'Loading bridges…',
  loadFailed: "Couldn't load bridge data.",
  retry: 'Try again',
  emptyFilter: 'No bridges match the selected filters.',
  showAll: 'Show all',
  notFound: (id) => `No bridge with id "${id}". Showing all of Vietnam.`,
  close: 'Close',
  mainSpan: 'main span',
  openGmaps: 'Open in Google Maps',
  openOsm: 'Open in OpenStreetMap',
  newTab: '(opens in new tab)',
  photos: 'Photos',
  noPhotos: 'No photos yet',
  photoBy: 'Photo',
  rightsReserved: '(all rights reserved by the author)',
  viewAtSource: 'View photo at source',
  sources: 'Sources',
  needsCheck: 'Some figures are still being verified.',
  notes: 'Notes',
  provinceTooltip: (n) => `${n} ${n === 1 ? 'bridge' : 'bridges'} — click to zoom in`,
  provinceAria: (p, n, a, b, c) =>
    `${p}: ${n} ${n === 1 ? 'bridge' : 'bridges'} (${a} open, ${b} under construction, ${c} planned)`,
  bridgeAria: (name, status, span) => `${name}, ${status}, main span ${span}`,
  viewCountry: (n) => `Viewing all of Vietnam, ${n} bridges`,
  viewProvince: (p, n) => `Viewing ${p}, ${n} bridges`,
  viewBridge: (name) => `Viewing ${name}`,
  mapLabel: 'Map of cable-stayed bridges in Viet Nam',
  layerOsm: 'OSM standard',
  layerLight: 'Light',
  layerSat: 'Satellite',
  sheetHandle: 'Resize card',
  prev: 'Previous photo',
  next: 'Next photo',
  diagramAria: (arr, main) => `Span arrangement: ${arr}, main span ${main}`,
  bridgesCount: (n) => `${n} ${n === 1 ? 'bridge' : 'bridges'}`,
  langLabel: 'Language',
};

export const STRINGS: Record<Lang, Dict> = { vi, en };

export const STATUS_LABEL: Record<Status, L10n> = {
  completed: { vi: 'Đã thông xe', en: 'Open to traffic' },
  under_construction: { vi: 'Đang xây dựng', en: 'Under construction' },
  planned: { vi: 'Quy hoạch', en: 'Planned' },
};

export const STRUCTURE_LABEL: Record<StructureType, L10n> = {
  cable_stayed: { vi: 'Dây văng', en: 'Cable-stayed' },
  extradosed: { vi: 'Extradosed', en: 'Extradosed' },
};

export const USAGE_LABEL: Record<Usage, L10n> = {
  road: { vi: 'Đường bộ', en: 'Road' },
  rail: { vi: 'Đường sắt', en: 'Rail' },
  metro: { vi: 'Metro', en: 'Metro' },
  pedestrian: { vi: 'Đi bộ', en: 'Pedestrian' },
};

const NBSP_THIN = ' ';
export const fmtNum = (n: number, lang: Lang) => new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US').format(n);
export const fmtMeters = (n: number, lang: Lang) => `${fmtNum(n, lang)}${NBSP_THIN}m`;

export function readStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    return v === 'vi' || v === 'en' ? v : null;
  } catch {
    return null;
  }
}
export function storeLang(l: Lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, l);
  } catch {
    /* ignore */
  }
}
