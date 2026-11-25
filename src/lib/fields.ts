import type { Bridge } from '../types';
import type { L10n } from './i18n';

export type FieldFormat = 'text' | 'meters' | 'roadChips' | 'list' | 'clearance' | 'localized';

export interface FieldDef {
  key: keyof Bridge & string;
  label: L10n | ((b: Bridge) => L10n);
  format?: FieldFormat;
  /** Default: shown when value is not null/undefined/empty. */
  showIf?: (v: unknown, b: Bridge) => boolean;
}

/** Spec table rows (design.md §6.3). Adding a field = one entry here. main_span_m is the headline, not a row. */
export const FIELDS: FieldDef[] = [
  { key: 'roads', label: { vi: 'Tuyến đường', en: 'Road(s)' }, format: 'roadChips' },
  { key: 'railways', label: { vi: 'Tuyến đường sắt', en: 'Railway line' }, format: 'roadChips' },
  { key: 'construction_start', label: { vi: 'Khởi công', en: 'Construction began' } },
  {
    key: 'opened',
    label: (b) =>
      b.status === 'completed' ? { vi: 'Thông xe', en: 'Opened' } : { vi: 'Dự kiến thông xe', en: 'Expected opening' },
  },
  { key: 'total_length_m', label: { vi: 'Chiều dài', en: 'Length' }, format: 'meters' },
  { key: 'width_m', label: { vi: 'Bề rộng', en: 'Width' }, format: 'meters' },
  { key: 'lanes', label: { vi: 'Số làn xe', en: 'Lanes' } },
  {
    key: 'cable_stayed_spans',
    label: { vi: 'Số nhịp dây văng', en: 'Cable-stayed spans' },
    showIf: (v) => typeof v === 'number' && v > 1,
  },
  { key: 'span_arrangement', label: { vi: 'Sơ đồ nhịp', en: 'Span arrangement' } },
  { key: 'pylons', label: { vi: 'Tháp cầu', en: 'Pylons' }, format: 'localized', showIf: (_, b) => !!(b.pylons || b.pylons_en) },
  {
    key: 'nav_clearance',
    label: { vi: 'Tĩnh không thông thuyền', en: 'Navigation clearance' },
    format: 'clearance',
    showIf: (v) => !!v && typeof v === 'object' && !!((v as { height_m?: number }).height_m || (v as { width_m?: number }).width_m),
  },
  { key: 'province_former', label: { vi: 'Tỉnh cũ (trước 2025)', en: 'Former province(s)' }, format: 'list' },
  { key: 'investor', label: { vi: 'Chủ đầu tư', en: 'Investor' } },
  { key: 'cost', label: { vi: 'Tổng mức đầu tư', en: 'Cost' } },
];

export const isPresent = (v: unknown) =>
  v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);

export function visibleFields(b: Bridge): FieldDef[] {
  return FIELDS.filter((f) => (f.showIf ?? isPresent)(b[f.key], b));
}

/** VI text in VI mode, the *_en variant in EN mode, each falling back to the other. */
export function localizedText(b: { pylons?: string; pylons_en?: string }, lang: 'vi' | 'en'): string | undefined {
  return lang === 'en' ? (b.pylons_en ?? b.pylons) : (b.pylons ?? b.pylons_en);
}
