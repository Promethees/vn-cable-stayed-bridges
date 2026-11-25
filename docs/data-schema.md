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
  lat: number;
  lng: number;
  images: BridgeImage[];
  sources: string[];             // URLs backing the facts
  confidence: "verified" | "needs_check";
  notes?: string;                // conflicts between sources, caveats
}
```

Status colors: completed = green border, under_construction = yellow, planned = red.

Client decisions (2026-11-25): include extradosed bridges (tag on card); include railway / metro bridges (main span > 150 m); Cần Giờ stays "planned"; `opened` = year opened to traffic; province = 34-unit scheme.
