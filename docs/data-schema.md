# Bridge data schema (shared contract: researcher / designer / engineer)

File: `data/bridges.json` — array of Bridge objects.

```ts
type Status = "completed" | "under_construction" | "planned";

interface BridgeImage {
  url: string;          // direct image URL (prefer Wikimedia Commons)
  credit: string;       // author / owner
  license: string;      // e.g. "CC BY-SA 4.0"; "unknown" if not free
  source: string;       // page where image was found
}

interface Bridge {
  id: string;                    // kebab-case slug, e.g. "cau-my-thuan-2"
  name_vi: string;               // "Cầu Mỹ Thuận 2"
  name_en?: string;
  status: Status;
  structure_type: "cable_stayed" | "extradosed";
  usage: ("road" | "rail" | "metro" | "pedestrian")[];  // e.g. ["road","rail"] for combined bridges
  province: string;              // current province (post-July-2025 34-unit structure)
  province_former?: string[];    // pre-2025 province(s) on each bank
  crosses?: string;              // river / channel / sea strait
  roads: string[];               // e.g. ["CT.01"], ["QL1A"], ["ĐT.830"]; [] for rail-only
  railways?: string[];           // e.g. ["Đường sắt tốc độ cao Bắc–Nam"], ["Đường sắt Lào Cai–Hà Nội–Hải Phòng"], ["Metro số 2 TP.HCM"]
  construction_start?: number;   // year construction began
  opened?: number;               // year opened to traffic (or planned)
  main_span_m: number;           // must be > 150
  total_length_m?: number;
  width_m?: number;
  lanes?: number;
  cable_stayed_spans?: number;   // number of cable-stayed main spans (1 = classic)
  span_arrangement?: string;     // e.g. "150 + 350 + 150 m"
  pylons?: string;               // count / shape / height
  investor?: string;
  cost?: string;
  nav_clearance?: {              // tĩnh không thông thuyền
    height_m?: number;           // vertical clearance (H) above design high water
    width_m?: number;            // channel width (B)
    reference?: string;          // e.g. "above H5%" / "mực nước cao thiết kế"
    source?: string;
  };
  model3d?: Model3D;             // parameters for the schematic 3D model (see below)
  lat: number;
  lng: number;
  images: BridgeImage[];
  sources: string[];             // URLs backing the facts
  confidence: "verified" | "needs_check";
  notes?: string;                // conflicts between sources, caveats
}
```

```ts
// Schematic 3D model parameters (approximate; drawn procedurally, not a survey model)
interface Model3D {
  spans_m: number[];             // full span list of the stay-cabled unit, e.g. [150, 350, 150]
  pylon_shape: "H" | "A" | "inverted_Y" | "diamond" | "single" | "inverted_V" | "other";
  pylon_heights_m: number[];     // one per pylon, height above deck or total (say which in notes)
  pylon_height_ref: "above_deck" | "total";
  cable_planes: 1 | 2;
  cable_pattern: "fan" | "semi_fan" | "harp";
  cables_per_side?: number;      // stays per pylon per side per plane, if known
  deck_width_m: number;
  deck_type?: "concrete" | "steel" | "composite";
  approach_length_m?: number;    // approaches each side, for context
  extradosed?: boolean;          // low pylons, short stays
  deck_plan_radius_m?: number;   // horizontal curve radius of the deck (omit if straight)
  pylon_custom?: PylonCustom;    // for curved / leaning / sculptural pylons (Ba Son, Tứ Liên, Cần Giờ...)
  confidence: "verified" | "estimated";
  notes?: string;
}
```

```ts
// Custom pylon geometry, in metres, in the pylon's local frame:
// x = along bridge axis (+ toward main span), y = up from deck, z = across bridge.
interface PylonCustom {
  description: string;                     // plain words, e.g. "single curved leg leaning back 10°, top bends toward main span"
  legs: {                                  // one entry per leg (1 for single, 2 for H/A/...)
    centerline: [number, number, number][];// polyline from start to tip; >= 3 points, smooth curve drawn through them.
                                           // Usually starts at the footing (below deck); a leg may also start at a given
                                           // point above the deck, e.g. twin blades rising from a merge point (Tứ Liên).
    width_base_m: number; width_top_m: number; depth_base_m?: number; depth_top_m?: number;
  }[];
  crossbeams_y_m?: number[];               // heights of cross-beams between legs
  anchor_zone: { y_from_m: number; y_to_m: number; leg: number }[]; // where stays attach on each leg
  mirror_for_other_pylons?: boolean;       // multi-pylon bridges: reuse mirrored
  reference_images?: string[];             // URLs used to derive the shape
}
```

Status colors: completed = green border, under_construction = yellow, planned = red.

Client decisions (2026-11-25): include extradosed bridges (tag on card); include railway / metro bridges (main span > 150 m); Cần Giờ stays "planned"; `opened` = year opened to traffic; province = 34-unit scheme.
