export interface Circle {
  x: number;
  y: number;
  r: number;
}

/**
 * Pushes overlapping circles apart (screen pixels). Deterministic; returns per-circle offsets.
 * Used to keep province dots from covering each other at low zoom.
 */
export function spreadCircles(circles: Circle[], gap = 4, iterations = 80): { dx: number; dy: number }[] {
  const pos = circles.map((c) => ({ x: c.x, y: c.y }));
  for (let it = 0; it < iterations; it++) {
    let moved = false;
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        let dx = pos[j].x - pos[i].x;
        let dy = pos[j].y - pos[i].y;
        let d = Math.hypot(dx, dy);
        const min = circles[i].r + circles[j].r + gap;
        if (d >= min - 0.01) continue;
        if (d < 1e-6) {
          // identical positions: separate along a fixed, index-dependent direction
          dx = Math.cos(j * 2.4);
          dy = Math.sin(j * 2.4);
          d = 1;
        }
        const push = (min - d) / 2;
        const ux = dx / d;
        const uy = dy / d;
        pos[i].x -= ux * push;
        pos[i].y -= uy * push;
        pos[j].x += ux * push;
        pos[j].y += uy * push;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return pos.map((p, i) => ({ dx: p.x - circles[i].x, dy: p.y - circles[i].y }));
}
