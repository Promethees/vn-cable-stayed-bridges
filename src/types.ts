// Mirrors docs/data-schema.md (the shared data contract).
export type Status = 'completed' | 'under_construction' | 'planned';

export const STATUSES: readonly Status[] = ['completed', 'under_construction', 'planned'];

export type StructureType = 'cable_stayed' | 'extradosed';
export const STRUCTURE_TYPES: readonly StructureType[] = ['cable_stayed', 'extradosed'];

export type Usage = 'road' | 'rail' | 'metro' | 'pedestrian';
export const USAGES: readonly Usage[] = ['road', 'rail', 'metro', 'pedestrian'];
/** Usages offered as map filters (pedestrian-only bridges are always shown). */
export const FILTER_USAGES: readonly Usage[] = ['road', 'rail', 'metro'];

export type PylonShape = 'H' | 'A' | 'inverted_Y' | 'diamond' | 'single' | 'inverted_V' | 'other';
export const PYLON_SHAPES: readonly PylonShape[] = ['H', 'A', 'inverted_Y', 'diamond', 'single', 'inverted_V', 'other'];
export type CablePattern = 'fan' | 'semi_fan' | 'harp';

/** Custom pylon geometry (metres, pylon-local frame: x along the bridge toward the main span, y up from deck, z across). */
export interface PylonCustom {
  description: string;
  legs: {
    centerline: [number, number, number][];
    width_base_m: number;
    width_top_m: number;
    depth_base_m?: number;
    depth_top_m?: number;
    /** rotation of the section about the centreline from base to tip, degrees */
    twist_deg?: number;
    /** G12: colour of this leg (overrides pylon_colour) */
    colour?: string;
  }[];
  crossbeams_y_m?: number[];
  /** vertical depth of the crossbeams_y_m members (default: square, max(1.5, 0.8 × leg top width)) */
  crossbeam_depth_m?: number;
  /** shape where legs merge at the apex */
  crown?: 'pointed' | 'rounded' | 'flat';
  /** extra straight members (pylon-local frame), e.g. a strut under the side span */
  struts?: { a: [number, number, number]; b: [number, number, number]; width: number; /** G12 */ colour?: string }[];
  /** G13: flat infill panels in the cross-bridge plane, bounded by a top and a bottom (z, y) curve */
  panels?: PylonPanel[];
  /** foundation block at the foot of every pylon (pylon-local frame), drawn in plain concrete */
  pile_cap?: PileCap;
  /** where stays attach; `side` restricts a zone to the main-span or back-span stays (zones without it serve both) */
  anchor_zone: { y_from_m: number; y_to_m: number; leg: number; side?: 'main' | 'back' }[];
  mirror_for_other_pylons?: boolean;
  reference_images?: string[];
}

/**
 * G13 panel: the region between two (z, y) polylines (local frame, y above deck; z non-decreasing, same end z),
 * extruded along local x over x_m ± depth_m / 2.
 */
export interface PylonPanel {
  top: [number, number][];
  bottom: [number, number][];
  depth_m: number;
  /** centre along the bridge, local x (default 0) */
  x_m?: number;
  /** G12: colour of the panel (overrides pylon_colour) */
  colour?: string;
}

/** Pile cap / footing: x ∈ ±length/2, z ∈ ±width/2, y ∈ [top − thickness, top] (y up from deck). */
export interface PileCap {
  length_x_m: number;
  width_z_m: number;
  top_y_m: number;
  thickness_m: number;
  /** stadium plan: semicircular ends (diameter = length_x_m) on the ±z ends */
  rounded_ends?: boolean;
}

/** Tĩnh không thông thuyền. */
export interface NavClearance {
  height_m?: number;
  width_m?: number;
  reference?: string;
  source?: string;
}

/** Schematic 3D model parameters (approximate; drawn procedurally, not a survey model). */
export interface Model3D {
  spans_m: number[];
  pylon_shape: PylonShape;
  pylon_heights_m: number[];
  pylon_height_ref: 'above_deck' | 'total';
  cable_planes: 1 | 2;
  cable_pattern: CablePattern;
  cables_per_side?: number;
  deck_width_m: number;
  deck_type?: 'concrete' | 'steel' | 'composite';
  approach_length_m?: number;
  extradosed?: boolean;
  deck_plan_radius_m?: number;
  /** rise of the deck at mid-unit (vertical curve), metres */
  deck_crest_m?: number;
  /** deck elevation above water, metres (overrides the heuristic; raised to clear navigation if needed) */
  deck_elevation_m?: number;
  /** cable planes on the back side when cable_planes = 1 (2 = back stays split to the deck edges) */
  back_stay_planes?: 1 | 2;
  /** G11: stays per plane on each back side (toward a unit end); defaults to cables_per_side */
  back_stay_count?: number;
  /** G11: back-side deck anchors spread linearly [from, to] metres from the pylon station toward the unit end
   *  (t = 0 lowest pylon anchor ↔ from); no snapping to auxiliary piers; ignored for harp */
  back_stay_deck_m?: [number, number];
  /** G15: main-side deck anchors (main span, or toward the next pylon) spread linearly [from, to] metres from the
   *  pylon station (t = 0 lowest pylon anchor ↔ from), clamped to the stay reach − 1; ignored for harp */
  main_stay_deck_m?: [number, number];
  /** G16: the deck is continuous (all closures done) although the bridge is not open: an under-construction bridge
   *  draws the full deck with no form travellers (the status is unchanged) */
  deck_closed?: boolean;
  /** girder section: box (default) or a double-deck / truss girder drawn as two chords with a Warren web */
  deck_section?: 'box' | 'truss';
  /** girder depth in metres (truss: distance between the chords, default 12) */
  deck_depth_m?: number;
  /** G17: haunched box girder. The deck top is unchanged; the soffit deepens toward each pylon on a parabola from
   *  deck_depth_m at length_m from the pylon to depth_at_pylon_m at the pylon (length clamped to half-way to the next
   *  pylon, or to the unit end). Box section only (ignored with a warning for truss); approaches are not haunched. */
  deck_haunch?: { depth_at_pylon_m: number; length_m: number };
  /** auxiliary piers, distances from the unit start, metres */
  auxiliary_piers_m?: number[];
  /** colours: hex (#rrggbb) or a named colour; rendered muted */
  pylon_colour?: string;
  stay_colour?: string;
  back_stay_colour?: string;
  deck_colour?: string;
  /** G14: "vivid" keeps the sRGB saturation of hex colours (lightness clamped 0.30–0.80); default "muted" */
  colour_mode?: 'muted' | 'vivid';
  pylon_custom?: PylonCustom;
  confidence: 'verified' | 'estimated';
  notes?: string;
}

export interface BridgeImage {
  url: string;
  credit: string;
  license: string;
  source: string;
}

export interface Bridge {
  id: string;
  name_vi: string;
  name_en?: string;
  status: Status;
  structure_type: StructureType;
  usage: Usage[];
  province: string;
  province_former?: string[];
  crosses?: string;
  roads: string[];
  railways?: string[];
  construction_start?: number;
  opened?: number;
  main_span_m: number;
  total_length_m?: number;
  width_m?: number;
  lanes?: number;
  cable_stayed_spans?: number;
  span_arrangement?: string;
  pylons?: string;
  pylons_en?: string;
  investor?: string;
  cost?: string;
  nav_clearance?: NavClearance;
  model3d?: Model3D;
  lat: number;
  lng: number;
  images: BridgeImage[];
  sources: string[];
  confidence: 'verified' | 'needs_check';
  notes?: string;
}
