// Mirrors docs/data-schema.md (the shared data contract).
export type Status = 'completed' | 'under_construction' | 'planned';

export const STATUSES: readonly Status[] = ['completed', 'under_construction', 'planned'];

export type StructureType = 'cable_stayed' | 'extradosed';
export const STRUCTURE_TYPES: readonly StructureType[] = ['cable_stayed', 'extradosed'];

export type Usage = 'road' | 'rail' | 'metro' | 'pedestrian';
export const USAGES: readonly Usage[] = ['road', 'rail', 'metro', 'pedestrian'];
/** Usages offered as map filters (pedestrian-only bridges are always shown). */
export const FILTER_USAGES: readonly Usage[] = ['road', 'rail', 'metro'];

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
  lat: number;
  lng: number;
  images: BridgeImage[];
  sources: string[];
  confidence: 'verified' | 'needs_check';
  notes?: string;
}
