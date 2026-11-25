import { describe, expect, it } from 'vitest';
import { layoutSpans, parseSpanArrangement } from './spans';
import { buildSearch, parseSearch, slugify } from './url';

describe('parseSpanArrangement', () => {
  it('parses plus-separated spans with comma decimals and multipliers', () => {
    expect(parseSpanArrangement('150 + 350 + 150 m')).toEqual([150, 350, 150]);
    expect(parseSpanArrangement('40,5 + 200 + 40,5')).toEqual([40.5, 200, 40.5]);
    expect(parseSpanArrangement('3×100 + 300')).toEqual([100, 100, 100, 300]);
  });
  it('returns null for fewer than 2 spans', () => {
    expect(parseSpanArrangement('350 m')).toBeNull();
    expect(parseSpanArrangement(undefined)).toBeNull();
  });
});

describe('layoutSpans', () => {
  it('uses contiguous largest spans, else single largest', () => {
    expect(layoutSpans([150, 300, 300, 150], 2)).toMatchObject({ mainStart: 1, mainEnd: 2 });
    expect(layoutSpans([300, 100, 300], 2)).toMatchObject({ mainStart: 0, mainEnd: 0 });
    expect(layoutSpans([40, 150, 550, 150, 40])).toMatchObject({ mainStart: 2, mainEnd: 2 });
  });
});

describe('url state', () => {
  it('slugifies Vietnamese province names', () => {
    expect(slugify('Hồ Chí Minh')).toBe('ho-chi-minh');
    expect(slugify('Đồng Tháp')).toBe('dong-thap');
  });
  it('round-trips views and lang', () => {
    expect(parseSearch(buildSearch({ kind: 'bridge', id: 'cau-can-tho' }, 'en'))).toEqual({
      view: { kind: 'bridge', id: 'cau-can-tho' },
      lang: 'en',
    });
    expect(buildSearch({ kind: 'province', slug: 'vinh-long' }, 'vi')).toBe('?province=vinh-long');
    expect(buildSearch({ kind: 'country' }, 'vi')).toBe('');
  });
});
