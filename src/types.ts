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
  investor?: string;
  cost?: string;
  model3d?: Model3D;
  lat: number;
  lng: number;
  images: BridgeImage[];
  sources: string[];
  confidence: 'verified' | 'needs_check';
  notes?: string;
}
