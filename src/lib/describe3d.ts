import type { Bridge, PylonShape } from '../types';
import type { BridgeGeometry } from './bridge3d';
import { fmtNum, STATUS_LABEL, type Lang } from './i18n';

const SHAPE: Record<PylonShape, { vi: string; en: string }> = {
  H: { vi: 'chữ H', en: 'H-shaped' },
  A: { vi: 'chữ A', en: 'A-shaped' },
  inverted_Y: { vi: 'chữ Y ngược', en: 'inverted-Y' },
  diamond: { vi: 'kim cương', en: 'diamond' },
  single: { vi: 'một trụ', en: 'single-mast' },
  inverted_V: { vi: 'chữ V ngược', en: 'inverted-V' },
  other: { vi: 'dạng khác', en: 'other-shaped' },
};
const PATTERN = {
  fan: { vi: 'dạng rẻ quạt', en: 'fan' },
  semi_fan: { vi: 'dạng bán rẻ quạt', en: 'semi-fan' },
  harp: { vi: 'dạng đàn hạc', en: 'harp' },
};
const DECK = {
  concrete: { vi: 'bê tông', en: 'concrete' },
  steel: { vi: 'thép', en: 'steel' },
  composite: { vi: 'liên hợp', en: 'composite' },
};

/** Generated text description of the 3D model (design-3d.md §6, accessibility). */
export function describeModel(b: Bridge, g: BridgeGeometry, lang: Lang): string {
  const n = (v: number) => fmtNum(Math.round(v), lang);
  const spans = g.spans.map((s) => n(s.length)).join(' + ');
  const heights = [...new Set(g.pylons.map((p) => Math.round(p.labelHeight)))];
  const ref = g.pylons[0].labelRef;
  const kind = g.extradosed ? { vi: 'Cầu extradosed', en: 'Extradosed bridge' } : { vi: 'Cầu dây văng', en: 'Cable-stayed bridge' };
  const deckType = g.deckType ? DECK[g.deckType][lang] : '';
  const approx = b.model3d?.confidence === 'estimated';
  if (lang === 'vi') {
    return [
      `${kind.vi} ${g.spans.length} nhịp ${spans} m.`,
      `${g.pylons.length} tháp ${SHAPE[g.shape].vi}, cao ${heights.map(n).join(' / ')} m ${ref === 'total' ? 'tổng' : 'trên mặt cầu'}.`,
      `${g.planes} mặt phẳng dây, ${PATTERN[g.pattern].vi}, ${g.cablesPerSide} dây mỗi bên.`,
      `Mặt cầu${deckType ? ` ${deckType}` : ''} rộng ${n(g.deckWidth)} m.`,
      `Trạng thái: ${STATUS_LABEL[b.status].vi.toLowerCase()}.`,
      approx ? 'Mô hình gần đúng.' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
  return [
    `${kind.en}, ${g.spans.length} spans of ${spans} m.`,
    `${g.pylons.length} ${SHAPE[g.shape].en} pylon${g.pylons.length > 1 ? 's' : ''}, ${heights.map(n).join(' / ')} m ${ref === 'total' ? 'tall in total' : 'above the deck'}.`,
    `${g.planes} cable plane${g.planes > 1 ? 's' : ''}, ${PATTERN[g.pattern].en} pattern, ${g.cablesPerSide} stays per side.`,
    `${deckType ? `${deckType[0].toUpperCase()}${deckType.slice(1)} deck` : 'Deck'} ${n(g.deckWidth)} m wide.`,
    `Status: ${STATUS_LABEL[b.status].en.toLowerCase()}.`,
    approx ? 'Approximate model.' : '',
  ]
    .filter(Boolean)
    .join(' ');
}
