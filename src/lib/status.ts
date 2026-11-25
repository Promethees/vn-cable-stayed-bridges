import type { Status } from '../types';

export const STATUS_LABEL: Record<Status, { vi: string; en: string }> = {
  completed: { vi: 'Đã hoàn thành', en: 'Completed' },
  under_construction: { vi: 'Đang xây dựng', en: 'Under construction' },
  planned: { vi: 'Quy hoạch / dự kiến', en: 'Planned' },
};

/** Inline SVG glyphs so status is never conveyed by color alone. */
export const STATUS_ICON_SVG: Record<Status, string> = {
  completed:
    '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  under_construction:
    '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 2.5L14 13.5H2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 6.5v3.5M8 11.6v.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  planned:
    '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2.4 2"/><circle cx="8" cy="8" r="1.6" fill="currentColor"/></svg>',
};
