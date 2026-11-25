import type { Bridge } from '../types';
import { diagramSpansOf } from './spans';

export type HeroView = 'photos' | '3d' | 'diagram';

const displayable = (b: Bridge) => b.images.some((i) => i.license.trim().toLowerCase() !== 'unknown');

/** Views available for a bridge (design-3d.md §1). Photos is always present. */
export function availableViews(b: Bridge): HeroView[] {
  const v: HeroView[] = ['photos'];
  if (b.model3d) v.push('3d');
  if (diagramSpansOf(b)) v.push('diagram');
  return v;
}

/** Default: Photos if a licensed image exists, else Diagram, else Photos. 3D is never the default. */
export function defaultView(b: Bridge): HeroView {
  if (displayable(b)) return 'photos';
  return diagramSpansOf(b) ? 'diagram' : 'photos';
}

/** The kept preference if available for this bridge, else the default. */
export const resolveView = (b: Bridge, pref: HeroView | null): HeroView =>
  pref && availableViews(b).includes(pref) ? pref : defaultView(b);
