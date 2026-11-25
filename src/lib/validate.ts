import { STATUSES, type Bridge, type BridgeImage } from '../types';

export const MIN_MAIN_SPAN_M = 150;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const isStr = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const optStr = (v: unknown) => v === undefined || typeof v === 'string';
const optNum = (v: unknown) => v === undefined || isNum(v);
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

function isImage(v: unknown): v is BridgeImage {
  return isObj(v) && isStr(v.url) && typeof v.credit === 'string' && typeof v.license === 'string' && typeof v.source === 'string';
}

/** Returns a list of problems; empty list means the value is a valid Bridge. */
export function bridgeProblems(v: unknown): string[] {
  if (!isObj(v)) return ['not an object'];
  const p: string[] = [];
  if (!isStr(v.id)) p.push('id');
  if (!isStr(v.name_vi)) p.push('name_vi');
  if (!STATUSES.includes(v.status as never)) p.push('status');
  if (!isStr(v.province)) p.push('province');
  if (!isStrArr(v.roads)) p.push('roads');
  if (!isNum(v.main_span_m)) p.push('main_span_m');
  if (!isNum(v.lat) || v.lat < -90 || v.lat > 90) p.push('lat');
  if (!isNum(v.lng) || v.lng < -180 || v.lng > 180) p.push('lng');
  if (!Array.isArray(v.images) || !v.images.every(isImage)) p.push('images');
  if (!isStrArr(v.sources)) p.push('sources');
  if (v.confidence !== 'verified' && v.confidence !== 'needs_check') p.push('confidence');
  for (const k of ['name_en', 'crosses', 'span_arrangement', 'pylons', 'investor', 'cost', 'notes']) {
    if (!optStr(v[k])) p.push(k);
  }
  for (const k of ['construction_start', 'opened', 'total_length_m', 'width_m', 'lanes', 'cable_stayed_spans']) {
    if (!optNum(v[k])) p.push(k);
  }
  if (v.province_former !== undefined && !isStrArr(v.province_former)) p.push('province_former');
  return p;
}

export const isBridge = (v: unknown): v is Bridge => bridgeProblems(v).length === 0;

/** Validates raw JSON, drops invalid entries, spans <= 150 m and duplicate ids (with console.warn). */
export function parseBridges(raw: unknown, warn: (...a: unknown[]) => void = console.warn): Bridge[] {
  if (!Array.isArray(raw)) {
    warn('[bridges] data is not an array; ignoring');
    return [];
  }
  const out: Bridge[] = [];
  const seen = new Set<string>();
  raw.forEach((item, i) => {
    const problems = bridgeProblems(item);
    if (problems.length) {
      warn(`[bridges] dropping entry #${i} (${isObj(item) ? String(item.id) : '?'}): invalid ${problems.join(', ')}`);
      return;
    }
    const b = item as Bridge;
    if (b.main_span_m <= MIN_MAIN_SPAN_M) {
      warn(`[bridges] dropping "${b.id}": main_span_m ${b.main_span_m} <= ${MIN_MAIN_SPAN_M}`);
      return;
    }
    if (seen.has(b.id)) {
      warn(`[bridges] dropping duplicate id "${b.id}"`);
      return;
    }
    seen.add(b.id);
    out.push(b);
  });
  return out;
}
