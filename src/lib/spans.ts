export interface SpanLayout {
  spans: number[];
  /** inclusive indices of the cable-stayed main span(s) */
  mainStart: number;
  mainEnd: number;
}

const num = (s: string) => parseFloat(s.replace(',', '.'));

/** Parses "150 + 350 + 150 m", "3×100 + 300", "40,5 + 200". Returns null if fewer than 2 spans. */
export function parseSpanArrangement(text: string | undefined): number[] | null {
  if (!text) return null;
  const N = '(\\d+(?:[.,]\\d+)?)';
  const expanded = text.replace(new RegExp(`${N}\\s*[x×]\\s*${N}`, 'gi'), (_, n: string, len: string) => {
    const count = Math.round(num(n));
    return count > 0 && count <= 50 ? Array(count).fill(len).join(' + ') : len;
  });
  const nums = (expanded.match(/\d+(?:[.,]\d+)?/g) ?? []).map(num).filter((n) => n > 0);
  return nums.length >= 2 ? nums : null;
}

/** Picks the `count` largest spans as main spans if contiguous, else the single largest. */
export function layoutSpans(spans: number[], count = 1): SpanLayout {
  const order = spans.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v || a.i - b.i);
  const k = Math.max(1, Math.min(count, spans.length));
  const idx = order
    .slice(0, k)
    .map((o) => o.i)
    .sort((a, b) => a - b);
  if (idx[idx.length - 1] - idx[0] === k - 1) return { spans, mainStart: idx[0], mainEnd: idx[idx.length - 1] };
  return { spans, mainStart: order[0].i, mainEnd: order[0].i };
}

/** Spans for the elevation diagram: model3d.spans_m when present, else span_arrangement. */
export function diagramSpansOf(b: { model3d?: { spans_m: number[] }; span_arrangement?: string }): number[] | null {
  const m = b.model3d?.spans_m;
  if (m && m.length >= 2) return m;
  return parseSpanArrangement(b.span_arrangement);
}
