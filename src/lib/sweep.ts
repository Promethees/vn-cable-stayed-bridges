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
export function catmullRom(points: V3[], samplesPerSegment = 10, endPhantom?: V3): V3[] {
  if (points.length < 2) return points.slice();
  const out: V3[] = [];
  // endPhantom (optional) replaces the clamped point after the last one, fixing the end tangent
  const P = (i: number) =>
    i >= points.length && endPhantom ? endPhantom : points[Math.max(0, Math.min(points.length - 1, i))];
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
export function sweepRect(pl: Polyline, w0: number, w1: number, d0: number, d1: number, twistDeg = 0): SweepMesh {
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
    let Wv = norm(cross(T, D));
    const f = pl.length ? pl.s[i] / pl.length : 0;
    if (twistDeg) {
      // rotate the section about the tangent, growing linearly from base to tip
      const th = (twistDeg * Math.PI * f) / 180;
      const [c, sn] = [Math.cos(th), Math.sin(th)];
      [Wv, D] = [add(mul(Wv, c), mul(D, sn)), add(mul(D, c), mul(Wv, -sn))];
    }
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

// ---- G13 panels ----

/**
 * Linear interpolation of a z-monotone (z, y) polyline at z, clamped to its ends. Where the curve has a vertical
 * step (two points at the same z), side −1 returns the value approached from the left and +1 from the right.
 */
export function panelYAt(c: [number, number][], z: number, side: -1 | 1 = 1): number {
  if (z <= c[0][0]) return side < 0 || z < c[0][0] ? c[0][1] : c[firstAfter(c, z) - 1][1];
  const n = c.length;
  if (z >= c[n - 1][0]) return side > 0 || z > c[n - 1][0] ? c[n - 1][1] : c[lastBefore(c, z) + 1][1];
  if (side > 0) {
    // last point with z_k <= z, then interpolate toward the next one
    const k = firstAfter(c, z) - 1;
    const [z0, y0] = c[k];
    const [z1, y1] = c[k + 1];
    return z1 === z0 ? y1 : y0 + ((y1 - y0) * (z - z0)) / (z1 - z0);
  }
  const k = lastBefore(c, z) + 1; // first point with z_k >= z
  const [z1, y1] = c[k];
  const [z0, y0] = c[k - 1];
  return z1 === z0 ? y0 : y0 + ((y1 - y0) * (z - z0)) / (z1 - z0);
}
/** index of the first point with z_k > z (n when none) */
const firstAfter = (c: [number, number][], z: number) => {
  let k = 0;
  while (k < c.length && c[k][0] <= z) k++;
  return k;
};
/** index of the last point with z_k < z (−1 when none) */
const lastBefore = (c: [number, number][], z: number) => {
  let k = c.length - 1;
  while (k >= 0 && c[k][0] >= z) k--;
  return k;
};

/**
 * Shape-preserving cubic (PCHIP, Fritsch–Butland tangents) through a z-monotone (z, y) polyline, at z strictly
 * between two of its points; elsewhere (on a point, outside, or across a vertical step) the linear value. Smooths
 * the panel edges between the data points without overshoot: a local minimum (the bottom of a U) gets a flat tangent.
 */
export function panelSmoothAt(c: [number, number][], z: number): number {
  const n = c.length;
  const k = firstAfter(c, z) - 1; // last point with z_k <= z
  if (k < 0 || k >= n - 1 || c[k][0] === z) return panelYAt(c, z, 1);
  const slope = (i: number) => (c[i + 1][1] - c[i][1]) / (c[i + 1][0] - c[i][0]);
  const h = (i: number) => c[i + 1][0] - c[i][0];
  const tangent = (i: number) => {
    const hasPrev = i > 0 && c[i][0] > c[i - 1][0];
    const hasNext = i < n - 1 && c[i + 1][0] > c[i][0];
    if (hasPrev && hasNext) {
      const [d0, d1] = [slope(i - 1), slope(i)];
      if (d0 * d1 <= 0) return 0;
      const [w1, w2] = [2 * h(i) + h(i - 1), h(i) + 2 * h(i - 1)];
      return (w1 + w2) / (w1 / d0 + w2 / d1);
    }
    return hasNext ? slope(i) : hasPrev ? slope(i - 1) : 0;
  };
  const hk = h(k);
  const t = (z - c[k][0]) / hk;
  const [t2, t3] = [t * t, t * t * t];
  return (2 * t3 - 3 * t2 + 1) * c[k][1] + (t3 - 2 * t2 + t) * hk * tangent(k) + (-2 * t3 + 3 * t2) * c[k + 1][1] + (t3 - t2) * hk * tangent(k + 1);
}

/**
 * G13: flat panel between a top and a bottom (z, y) curve (both z-monotone, same end z), extruded along x over
 * [x0, x1]. Columns sit at the union of both curves' breakpoints (two columns where either curve steps vertically),
 * each interval split into `sub` parts (edges smoothed between the data points, see panelSmoothAt). Vertices are (x, y, z) in the frame of the curves; the caller maps them.
 */
export function panelMesh(top: [number, number][], bottom: [number, number][], x0: number, x1: number, sub = 6): SweepMesh {
  const zs = [...new Set([...top, ...bottom].map((q) => q[0]))].sort((a, b) => a - b);
  const cols: [number, number, number][] = []; // z, y bottom, y top
  // a curve's own points take its exact (one-sided) value; anywhere else, including the other curve's breakpoints,
  // the smooth value, so the edge has no notch where only the other curve has a point
  const at = (c: [number, number][], z: number, side: -1 | 1) => (c.some((q) => q[0] === z) ? panelYAt(c, z, side) : panelSmoothAt(c, z));
  const col = (z: number, side: -1 | 1): [number, number, number] => {
    const yb = at(bottom, z, side);
    return [z, yb, Math.max(yb, at(top, z, side))];
  };
  zs.forEach((z, k) => {
    if (k > 0) for (let s = 1; s < sub; s++) cols.push(col(zs[k - 1] + ((z - zs[k - 1]) * s) / sub, 1));
    const [l, r] = [col(z, -1), col(z, 1)];
    cols.push(l);
    if (Math.abs(r[1] - l[1]) > 1e-9 || Math.abs(r[2] - l[2]) > 1e-9) cols.push(r);
  });
  const positions: number[] = [];
  const indices: number[] = [];
  // per column: 0 front bottom, 1 front top (x0), 2 back bottom, 3 back top (x1)
  for (const [z, yb, yt] of cols) positions.push(x0, yb, z, x0, yt, z, x1, yb, z, x1, yt, z);
  const quad = (a: number, b: number, c: number, d: number) => indices.push(a, b, c, a, c, d);
  for (let k = 0; k + 1 < cols.length; k++) {
    const i = k * 4;
    const j = i + 4;
    quad(i, j, j + 1, i + 1); // front face (x0)
    quad(i + 2, i + 3, j + 3, j + 2); // back face (x1)
    quad(i, i + 2, j + 2, j); // bottom edge
    quad(i + 1, j + 1, j + 3, i + 3); // top edge
  }
  const l = (cols.length - 1) * 4;
  quad(0, 1, 3, 2); // end caps
  quad(l, l + 2, l + 3, l + 1);
  return { positions, indices };
}
