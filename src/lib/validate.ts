import { panelYAt } from './sweep';
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
  if (v.deck_plan_radius_m !== undefined && !(isNum(v.deck_plan_radius_m) && v.deck_plan_radius_m > 0)) p.push('deck_plan_radius_m');
  if (v.deck_crest_m !== undefined && !(isNum(v.deck_crest_m) && v.deck_crest_m >= 0)) p.push('deck_crest_m');
  if (v.deck_elevation_m !== undefined && !(isNum(v.deck_elevation_m) && v.deck_elevation_m > 0)) p.push('deck_elevation_m');
  if (v.back_stay_planes !== undefined && v.back_stay_planes !== 1 && v.back_stay_planes !== 2) p.push('back_stay_planes');
  if (v.back_stay_count !== undefined && !(Number.isInteger(v.back_stay_count) && (v.back_stay_count as number) >= 1 && (v.back_stay_count as number) <= 60))
    p.push('back_stay_count');
  if (v.back_stay_deck_m !== undefined && !(Array.isArray(v.back_stay_deck_m) && v.back_stay_deck_m.length === 2 && v.back_stay_deck_m.every((x) => isNum(x) && x >= 0)))
    p.push('back_stay_deck_m');
  if (v.main_stay_deck_m !== undefined && !(Array.isArray(v.main_stay_deck_m) && v.main_stay_deck_m.length === 2 && v.main_stay_deck_m.every((x) => isNum(x) && x >= 0)))
    p.push('main_stay_deck_m');
  if (v.deck_closed !== undefined && typeof v.deck_closed !== 'boolean') p.push('deck_closed');
  if (v.deck_section !== undefined && v.deck_section !== 'box' && v.deck_section !== 'truss') p.push('deck_section');
  if (v.deck_depth_m !== undefined && !(isNum(v.deck_depth_m) && v.deck_depth_m > 0)) p.push('deck_depth_m');
  if (v.deck_haunch !== undefined) {
    const h = v.deck_haunch as Record<string, unknown> | null;
    if (!(h && typeof h === 'object' && !Array.isArray(h) && isNum(h.depth_at_pylon_m) && (h.depth_at_pylon_m as number) > 0 && isNum(h.length_m) && (h.length_m as number) > 0
      && Object.keys(h).every((k) => k === 'depth_at_pylon_m' || k === 'length_m')))
      p.push('deck_haunch');
  }
  if (v.auxiliary_piers_m !== undefined && !(Array.isArray(v.auxiliary_piers_m) && v.auxiliary_piers_m.every((x) => isNum(x) && x > 0)))
    p.push('auxiliary_piers_m');
  for (const k of ['pylon_colour', 'stay_colour', 'back_stay_colour', 'deck_colour'])
    if (v[k] !== undefined && !isColour(v[k])) p.push(k);
  if (v.colour_mode !== undefined && v.colour_mode !== 'muted' && v.colour_mode !== 'vivid') p.push('colour_mode');
  if (v.pylon_custom !== undefined) p.push(...pylonCustomProblems(v.pylon_custom).map((x) => `pylon_custom.${x}`));
  return p;
}

const isVec3 = (a: unknown) => Array.isArray(a) && a.length === 3 && a.every(isNum);

export const NAMED_COLOURS = ['white', 'grey', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'black'] as const;
export const isColour = (v: unknown) =>
  typeof v === 'string' && (/^#[0-9a-f]{6}$/i.test(v) || (NAMED_COLOURS as readonly string[]).includes(v.toLowerCase()));

export function pylonCustomProblems(v: unknown): string[] {
  if (!isObj(v)) return ['not an object'];
  const p: string[] = [];
  if (typeof v.description !== 'string') p.push('description');
  const legs = v.legs;
  if (!Array.isArray(legs) || legs.length < 1) p.push('legs');
  else
    legs.forEach((l, i) => {
      if (!isObj(l)) return p.push(`legs[${i}]`);
      if (!Array.isArray(l.centerline) || l.centerline.length < 3 || !l.centerline.every(isVec3)) p.push(`legs[${i}].centerline`);
      for (const k of ['width_base_m', 'width_top_m'])
        if (!(isNum(l[k]) && (l[k] as number) > 0)) p.push(`legs[${i}].${k}`);
      for (const k of ['depth_base_m', 'depth_top_m'])
        if (l[k] !== undefined && !(isNum(l[k]) && (l[k] as number) > 0)) p.push(`legs[${i}].${k}`);
      if (l.twist_deg !== undefined && !isNum(l.twist_deg)) p.push(`legs[${i}].twist_deg`);
      if (l.colour !== undefined && !isColour(l.colour)) p.push(`legs[${i}].colour`);
    });
  if (v.crossbeams_y_m !== undefined && !(Array.isArray(v.crossbeams_y_m) && v.crossbeams_y_m.every(isNum))) p.push('crossbeams_y_m');
  if (v.crossbeam_depth_m !== undefined && !(isNum(v.crossbeam_depth_m) && v.crossbeam_depth_m > 0)) p.push('crossbeam_depth_m');
  const nLegs = Array.isArray(legs) ? legs.length : 0;
  if (
    !Array.isArray(v.anchor_zone) ||
    v.anchor_zone.length < 1 ||
    !v.anchor_zone.every(
      (z) =>
        isObj(z) &&
        isNum(z.y_from_m) &&
        isNum(z.y_to_m) &&
        Number.isInteger(z.leg) &&
        (z.leg as number) >= 0 &&
        (z.leg as number) < nLegs &&
        (z.side === undefined || z.side === 'main' || z.side === 'back'),
    )
  )
    p.push('anchor_zone');
  if (v.mirror_for_other_pylons !== undefined && typeof v.mirror_for_other_pylons !== 'boolean') p.push('mirror_for_other_pylons');
  if (v.crown !== undefined && !['pointed', 'rounded', 'flat'].includes(v.crown as string)) p.push('crown');
  if (
    v.struts !== undefined &&
    !(
      Array.isArray(v.struts) &&
      v.struts.every(
        (st) => isObj(st) && isVec3(st.a) && isVec3(st.b) && isNum(st.width) && (st.width as number) > 0 && (st.colour === undefined || isColour(st.colour)),
      )
    )
  )
    p.push('struts');
  if (v.panels !== undefined) {
    if (!Array.isArray(v.panels)) p.push('panels');
    else v.panels.forEach((pn, i) => p.push(...panelProblems(pn).map((x) => `panels[${i}]${x ? '.' + x : ''}`)));
  }
  if (v.reference_images !== undefined && !isStrArr(v.reference_images)) p.push('reference_images');
  if (v.pile_cap !== undefined) {
    const c = v.pile_cap;
    const pos = (x: unknown) => isNum(x) && x > 0;
    if (
      !isObj(c) ||
      !pos(c.length_x_m) ||
      !pos(c.width_z_m) ||
      !pos(c.thickness_m) ||
      !isNum(c.top_y_m) ||
      c.top_y_m > 0 ||
      (c.rounded_ends !== undefined && typeof c.rounded_ends !== 'boolean')
    )
      p.push('pile_cap');
  }
  return p;
}

const isZY = (a: unknown) => Array.isArray(a) && a.length === 2 && a.every(isNum);

/** G13 panel: two (z, y) curves with ≥ 2 points, z non-decreasing, same end z, top never below bottom. */
function panelProblems(v: unknown): string[] {
  if (!isObj(v)) return [''];
  const p: string[] = [];
  const curve = (c: unknown) =>
    Array.isArray(c) && c.length >= 2 && c.every(isZY) && c.every((q, k) => k === 0 || (q as number[])[0] >= (c[k - 1] as number[])[0]);
  const top = v.top as [number, number][];
  const bottom = v.bottom as [number, number][];
  if (!curve(top)) p.push('top');
  if (!curve(bottom)) p.push('bottom');
  if (!p.length) {
    const ends = (c: [number, number][]) => [c[0][0], c[c.length - 1][0]];
    const [t0, t1] = ends(top);
    const [b0, b1] = ends(bottom);
    if (Math.abs(t0 - b0) > 1e-6 || Math.abs(t1 - b1) > 1e-6 || !(t1 > t0)) p.push('ends');
    else if ([...top, ...bottom].some(([z]) => panelYAt(top, z, 1) < panelYAt(bottom, z, 1) - 1e-6 || panelYAt(top, z, -1) < panelYAt(bottom, z, -1) - 1e-6))
      p.push('top below bottom');
  }
  if (!(isNum(v.depth_m) && v.depth_m > 0)) p.push('depth_m');
  if (!optNum(v.x_m)) p.push('x_m');
  if (v.colour !== undefined && !isColour(v.colour)) p.push('colour');
  return p;
}

function navClearanceProblems(v: unknown): string[] {
  if (!isObj(v)) return ['not an object'];
  const p: string[] = [];
  for (const k of ['height_m', 'width_m']) if (v[k] !== undefined && !(isNum(v[k]) && (v[k] as number) > 0)) p.push(k);
  for (const k of ['reference', 'source']) if (!optStr(v[k])) p.push(k);
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
  for (const k of ['name_en', 'crosses', 'span_arrangement', 'pylons', 'pylons_en', 'investor', 'cost', 'notes']) {
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
  if (out.nav_clearance !== undefined) {
    const problems = navClearanceProblems(out.nav_clearance);
    if (problems.length) {
      warn(`[bridges] "${String(v.id)}": dropping invalid nav_clearance (${problems.join(', ')})`);
      delete out.nav_clearance;
    }
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
