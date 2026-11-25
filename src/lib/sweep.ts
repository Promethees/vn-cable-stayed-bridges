/** Curve + sweep helpers for custom pylons (pure, no Three.js). */
export type V3 = [number, number, number];

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const norm = (a: V3): V3 => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Centripetal Catmull-Rom through all control points (passes through each of them). */
export function catmullRom(points: V3[], samplesPerSegment = 10): V3[] {
  if (points.length < 2) return points.slice();
  const out: V3[] = [];
  const P = (i: number) => points[Math.max(0, Math.min(points.length - 1, i))];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = P(i - 1);
    const p1 = P(i);
    const p2 = P(i + 1);
    const p3 = P(i + 2);
    // centripetal parameterisation (alpha = 0.5) avoids cusps and self-intersections
    const t0 = 0;
    const t1 = t0 + Math.max(Math.sqrt(len(sub(p1, p0))), 1e-6);
    const t2 = t1 + Math.max(Math.sqrt(len(sub(p2, p1))), 1e-6);
    const t3 = t2 + Math.max(Math.sqrt(len(sub(p3, p2))), 1e-6);
    for (let s = 0; s < samplesPerSegment; s++) {
      const t = t1 + ((t2 - t1) * s) / samplesPerSegment;
      const lerp = (a: V3, b: V3, ta: number, tb: number) =>
        tb - ta < 1e-9 ? a : add(mul(a, (tb - t) / (tb - ta)), mul(b, (t - ta) / (tb - ta)));
      const A1 = lerp(p0, p1, t0, t1);
      const A2 = lerp(p1, p2, t1, t2);
      const A3 = lerp(p2, p3, t2, t3);
      const B1 = lerp(A1, A2, t0, t2);
      const B2 = lerp(A2, A3, t1, t3);
      out.push(lerp(B1, B2, t1, t2));
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

export interface Polyline {
  pts: V3[];
  /** cumulative arc length at each point */
  s: number[];
  length: number;
}

export function polyline(pts: V3[]): Polyline {
  const s = [0];
  for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + len(sub(pts[i], pts[i - 1])));
  return { pts, s, length: s[s.length - 1] };
}

/** Point at arc length `d` (clamped). */
export function pointAt(pl: Polyline, d: number): V3 {
  const t = Math.max(0, Math.min(pl.length, d));
  let i = 1;
  while (i < pl.s.length - 1 && pl.s[i] < t) i++;
  const seg = pl.s[i] - pl.s[i - 1] || 1;
  return add(pl.pts[i - 1], mul(sub(pl.pts[i], pl.pts[i - 1]), (t - pl.s[i - 1]) / seg));
}

/** Arc length where the curve first reaches height y (component 1); clamped to the ends. */
export function arcAtY(pl: Polyline, y: number): number {
  const p = pl.pts;
  if (y <= p[0][1]) return 0;
  for (let i = 1; i < p.length; i++) {
    const [a, b] = [p[i - 1][1], p[i][1]];
    if ((y >= a && y <= b) || (y <= a && y >= b)) {
      const f = b === a ? 0 : (y - a) / (b - a);
      return pl.s[i - 1] + f * (pl.s[i] - pl.s[i - 1]);
    }
  }
  return pl.length;
}

export interface SweepMesh {
  positions: number[];
  indices: number[];
}

/**
 * Sweeps a rectangular section along a polyline. Width runs across the bridge (≈ z), depth in
 * the curve's x–y plane; both interpolate base → top by arc length.
 */
export function sweepRect(pl: Polyline, w0: number, w1: number, d0: number, d1: number): SweepMesh {
  const positions: number[] = [];
  const indices: number[] = [];
  const n = pl.pts.length;
  for (let i = 0; i < n; i++) {
    const prev = pl.pts[Math.max(0, i - 1)];
    const next = pl.pts[Math.min(n - 1, i + 1)];
    const T = norm(sub(next, prev));
    let D = cross([0, 0, 1], T); // in the x–y plane, perpendicular to the tangent
    if (len(D) < 1e-6) D = [1, 0, 0];
    D = norm(D);
    const Wv = norm(cross(T, D));
    const f = pl.length ? pl.s[i] / pl.length : 0;
    const hw = (w0 + (w1 - w0) * f) / 2;
    const hd = (d0 + (d1 - d0) * f) / 2;
    const c = pl.pts[i];
    for (const [a, b] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ] as const)
      positions.push(...add(c, add(mul(Wv, a * hw), mul(D, b * hd))));
  }
  for (let i = 0; i < n - 1; i++)
    for (let k = 0; k < 4; k++) {
      const a = i * 4 + k;
      const b = i * 4 + ((k + 1) % 4);
      const c = (i + 1) * 4 + ((k + 1) % 4);
      const d = (i + 1) * 4 + k;
      indices.push(a, b, c, a, c, d);
    }
  // caps
  const last = (n - 1) * 4;
  indices.push(0, 2, 1, 0, 3, 2, last, last + 1, last + 2, last, last + 2, last + 3);
  return { positions, indices };
}
