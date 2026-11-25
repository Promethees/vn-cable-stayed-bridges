import type { Status } from '../types';

const CABLES = 'M8 3L2 11M8 3L4.5 11M8 3L11.5 11M8 3L14 11';

/** Pylon glyph (design.md §5.3): finished deck / broken deck / dashed sketch. */
export function pylonSvg(status: Status, size = 16): string {
  const attrs = `viewBox="0 0 16 16" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" focusable="false"`;
  if (status === 'planned') {
    return `<svg ${attrs} stroke-dasharray="1.5 2" opacity=".85"><path d="M8 2V14"/><path d="${CABLES}"/><path d="M1 11H15"/></svg>`;
  }
  const deck = status === 'completed' ? 'M1 11H15' : 'M1 11H6M10 11H15';
  return `<svg ${attrs}><path d="M8 2V14"/><path d="${CABLES}"/><path d="${deck}"/></svg>`;
}
