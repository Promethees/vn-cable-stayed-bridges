// Mirrors docs/data-schema.md (the shared data contract).
export type Status = 'completed' | 'under_construction' | 'planned';

export const STATUSES: readonly Status[] = ['completed', 'under_construction', 'planned'];

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
  province: string;
  province_former?: string[];
  crosses?: string;
  roads: string[];
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
