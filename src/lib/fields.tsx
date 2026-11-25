import type { ReactNode } from 'react';
import type { Bridge } from '../types';

export interface CardField {
  key: string;
  label: string;
  /** Return null/undefined to hide the row. */
  render: (b: Bridge) => ReactNode | null | undefined;
}

const fmtNum = (n: number) => n.toLocaleString('vi-VN');
const m = (n?: number) => (n === undefined ? null : `${fmtNum(n)} m`);

/** Detail card rows, in display order. Add a field by adding an entry here. */
export const CARD_FIELDS: CardField[] = [
  { key: 'roads', label: 'Tuyến đường', render: (b) => (b.roads.length ? b.roads.join(', ') : null) },
  { key: 'crosses', label: 'Vượt qua', render: (b) => b.crosses },
  {
    key: 'province',
    label: 'Tỉnh / thành',
    render: (b) =>
      b.province_former?.length ? `${b.province} (trước 2025: ${b.province_former.join(' – ')})` : b.province,
  },
  { key: 'construction_start', label: 'Khởi công', render: (b) => b.construction_start },
  {
    key: 'opened',
    label: 'Thông xe',
    render: (b) => (b.opened === undefined ? null : b.status === 'completed' ? b.opened : `${b.opened} (dự kiến)`),
  },
  { key: 'main_span_m', label: 'Nhịp chính', render: (b) => m(b.main_span_m) },
  { key: 'cable_stayed_spans', label: 'Số nhịp dây văng', render: (b) => ((b.cable_stayed_spans ?? 1) > 1 ? b.cable_stayed_spans : null) },
  { key: 'span_arrangement', label: 'Sơ đồ nhịp', render: (b) => b.span_arrangement },
  { key: 'total_length_m', label: 'Tổng chiều dài', render: (b) => m(b.total_length_m) },
  { key: 'width_m', label: 'Bề rộng', render: (b) => m(b.width_m) },
  { key: 'lanes', label: 'Số làn xe', render: (b) => b.lanes },
  { key: 'pylons', label: 'Trụ tháp', render: (b) => b.pylons },
  { key: 'investor', label: 'Chủ đầu tư', render: (b) => b.investor },
  { key: 'cost', label: 'Tổng mức đầu tư', render: (b) => b.cost },
  { key: 'notes', label: 'Ghi chú', render: (b) => b.notes },
];
