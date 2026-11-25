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
  clearance3d: (h?: string, w?: string) => (h ? `Tĩnh không ${h}` : `Luồng B ${w}`),
  customPylon: 'dạng đặc biệt',
  tabPhotos: 'Ảnh',
  tab3d: '3D',
  tabDiagram: 'Sơ đồ',
  mediaLabel: 'Hình ảnh và mô hình',
  fullscreen: 'Toàn màn hình',
  resetView: 'Đặt lại góc nhìn',
  dimensions: 'Kích thước',
  autoRotate: 'Tự xoay',
  approxModel: 'Mô hình gần đúng',
  modelCaption: 'Mô hình minh họa dựng từ thông số công bố, không phải bản vẽ thiết kế.',
  hintMouse: 'Kéo để xoay, cuộn để phóng to',
  hintTouch: 'Một ngón để xoay, hai ngón để phóng to',
  loading3d: 'Đang tải mô hình 3D…',
  load3dFailed: 'Không tải được mô hình 3D.',
  noWebgl: 'Trình duyệt không hỗ trợ WebGL nên hiển thị sơ đồ 2D.',
  contextLost: 'Mô hình 3D bị gián đoạn nên hiển thị sơ đồ 2D.',
  badModel: 'Thiếu thông số để dựng mô hình 3D.',
  model3dAria: (name: string) => `Mô hình 3D cầu ${name}`,
  model3dRole: 'mô hình 3D',
  resetDone: 'Đã đặt lại góc nhìn',
  labelsHidden: 'Đã ẩn kích thước',
  labelsShown: 'Đã hiện kích thước',
  keysLegend: '←→ xoay · ↑↓ nghiêng · +/− phóng · Shift+mũi tên di chuyển · 0 đặt lại · L kích thước · F toàn màn hình',
  heightLabel: (v: string) => `Cao ${v}`,
  aboveDeck: 'trên mặt cầu',
  totalHeight: 'tổng',
  photoOf: (i: number, n: number) => `Ảnh ${i} / ${n}`,
  copyrightBy: (c: string) => `Ảnh có bản quyền của ${c}`,
  viewAt: (h: string) => `Xem ảnh tại ${h}`,
  creditLinkOnly: (c: string, h: string) => `© ${c}. Xem tại ${h}`,
  publicDomain: 'phạm vi công cộng',
  noPhotosLong: 'Chưa có ảnh cho cầu này.',
  findCommons: 'Tìm ảnh trên Wikimedia Commons',
  photoBroken: 'Không tải được ảnh.',
  source: 'Nguồn',
  thumbLinkAria: (h: string) => `Ảnh bản quyền, mở tại ${h} (tab mới)`,
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
  clearance3d: (h, w) => (h ? `Clearance ${h}` : `Channel B ${w}`),
  customPylon: 'custom-shaped',
  tabPhotos: 'Photos',
  tab3d: '3D',
  tabDiagram: 'Elevation',
  mediaLabel: 'Photos and model',
  fullscreen: 'Full screen',
  resetView: 'Reset view',
  dimensions: 'Dimensions',
  autoRotate: 'Auto-rotate',
  approxModel: 'Approximate model',
  modelCaption: 'Schematic built from published figures, not a design drawing.',
  hintMouse: 'Drag to orbit, scroll to zoom',
  hintTouch: 'One finger to orbit, two to zoom',
  loading3d: 'Loading 3D model…',
  load3dFailed: "Couldn't load the 3D model.",
  noWebgl: "Your browser doesn't support WebGL, so the 2D elevation is shown.",
  contextLost: 'The 3D view was interrupted, so the 2D elevation is shown.',
  badModel: 'Not enough data to build the 3D model.',
  model3dAria: (name) => `3D model of ${name}`,
  model3dRole: '3D model',
  resetDone: 'View reset',
  labelsHidden: 'Dimensions hidden',
  labelsShown: 'Dimensions shown',
  keysLegend: '←→ orbit · ↑↓ tilt · +/− zoom · Shift+arrows pan · 0 reset · L dimensions · F full screen',
  heightLabel: (v) => `Height ${v}`,
  aboveDeck: 'above deck',
  totalHeight: 'total',
  photoOf: (i, n) => `Photo ${i} / ${n}`,
  copyrightBy: (c) => `Photo © ${c}`,
  viewAt: (h) => `View photo at ${h}`,
  creditLinkOnly: (c, h) => `© ${c}. View at ${h}`,
  publicDomain: 'public domain',
  noPhotosLong: 'No photos of this bridge yet.',
  findCommons: 'Find photos on Wikimedia Commons',
  photoBroken: "Couldn't load this photo.",
  source: 'Source',
  thumbLinkAria: (h) => `Copyrighted photo, open at ${h} (new tab)`,
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

/** "H 45 m × B 250 m" (whichever values are present). */
export function fmtClearance(c: { height_m?: number; width_m?: number }, lang: Lang): string {
  return [c.height_m ? `H ${fmtMeters(c.height_m, lang)}` : '', c.width_m ? `B ${fmtMeters(c.width_m, lang)}` : '']
    .filter(Boolean)
    .join(' × ');
}
