import { PYLON_SHAPES, STATUSES, STRUCTURE_TYPES, USAGES, type Bridge, type BridgeImage, type Model3D } from '../types';

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

/** Problems with an optional model3d block (an invalid block is dropped, the bridge is kept). */
export function model3dProblems(v: unknown): string[] {
  if (!isObj(v)) return ['not an object'];
  const p: string[] = [];
  const posArr = (a: unknown) => Array.isArray(a) && a.every((x) => isNum(x) && x > 0);
  if (!posArr(v.spans_m) || (v.spans_m as number[]).length < 1) p.push('spans_m');
  if (!PYLON_SHAPES.includes(v.pylon_shape as never)) p.push('pylon_shape');
  if (!Array.isArray(v.pylon_heights_m) || !(v.pylon_heights_m.length === 0 || posArr(v.pylon_heights_m))) p.push('pylon_heights_m');
  if (v.pylon_height_ref !== 'above_deck' && v.pylon_height_ref !== 'total') p.push('pylon_height_ref');
  if (v.cable_planes !== 1 && v.cable_planes !== 2) p.push('cable_planes');
  if (!['fan', 'semi_fan', 'harp'].includes(v.cable_pattern as string)) p.push('cable_pattern');
  if (v.cables_per_side !== undefined && !(isNum(v.cables_per_side) && v.cables_per_side >= 1)) p.push('cables_per_side');
  if (!(isNum(v.deck_width_m) && v.deck_width_m > 0)) p.push('deck_width_m');
  if (v.deck_type !== undefined && !['concrete', 'steel', 'composite'].includes(v.deck_type as string)) p.push('deck_type');
  if (!optNum(v.approach_length_m)) p.push('approach_length_m');
  if (v.extradosed !== undefined && typeof v.extradosed !== 'boolean') p.push('extradosed');
  if (v.confidence !== 'verified' && v.confidence !== 'estimated') p.push('confidence');
  if (!optStr(v.notes)) p.push('notes');
  return p;
}

/** Returns a list of problems; empty list means the value is a valid Bridge. */
export function bridgeProblems(v: unknown): string[] {
  if (!isObj(v)) return ['not an object'];
  const p: string[] = [];
  if (!isStr(v.id)) p.push('id');
  if (!isStr(v.name_vi)) p.push('name_vi');
  if (!STATUSES.includes(v.status as never)) p.push('status');
  if (!STRUCTURE_TYPES.includes(v.structure_type as never)) p.push('structure_type');
  if (!Array.isArray(v.usage) || !v.usage.every((u) => USAGES.includes(u as never))) p.push('usage');
  if (v.railways !== undefined && !isStrArr(v.railways)) p.push('railways');
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

/** Fills fields added to the schema later (structure_type, usage) so older data still loads. */
function withDefaults(v: unknown, warn: (...a: unknown[]) => void): unknown {
  if (!isObj(v)) return v;
  const out = { ...v };
  if (out.structure_type === undefined) {
    warn(`[bridges] "${String(v.id)}": missing structure_type, assuming "cable_stayed"`);
    out.structure_type = 'cable_stayed';
  }
  if (out.model3d !== undefined) {
    const problems = model3dProblems(out.model3d);
    if (problems.length) {
      warn(`[bridges] "${String(v.id)}": dropping invalid model3d (${problems.join(', ')})`);
      delete out.model3d;
    } else out.model3d = out.model3d as Model3D;
  }
  if (out.usage === undefined) {
    warn(`[bridges] "${String(v.id)}": missing usage, assuming ["road"]`);
    out.usage = ['road'];
  }
  return out;
}

/** Validates raw JSON, drops invalid entries, spans <= 150 m and duplicate ids (with console.warn). */
export function parseBridges(raw: unknown, warn: (...a: unknown[]) => void = console.warn): Bridge[] {
  if (!Array.isArray(raw)) {
    warn('[bridges] data is not an array; ignoring');
    return [];
  }
  const out: Bridge[] = [];
  const seen = new Set<string>();
  raw.forEach((rawItem, i) => {
    const item = withDefaults(rawItem, warn);
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
