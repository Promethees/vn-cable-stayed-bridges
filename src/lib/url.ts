import type { Lang } from './i18n';
import type { HeroView } from './hero';

export type View = { kind: 'country' } | { kind: 'province'; slug: string } | { kind: 'bridge'; id: string };

export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseSearch(search: string): { view: View; lang: Lang | null; hero: HeroView | null } {
  const p = new URLSearchParams(search);
  const lang = p.get('lang') === 'en' ? 'en' : p.get('lang') === 'vi' ? 'vi' : null;
  const bridge = p.get('bridge');
  const province = p.get('province');
  const view: View = bridge
    ? { kind: 'bridge', id: bridge }
    : province
      ? { kind: 'province', slug: province }
      : { kind: 'country' };
  const h = p.get('view');
  const hero: HeroView | null = h === '3d' || h === 'diagram' || h === 'photos' ? h : null;
  return { view, lang, hero };
}

export function buildSearch(view: View, lang: Lang, hero: HeroView | null = null): string {
  const p = new URLSearchParams();
  if (view.kind === 'bridge') p.set('bridge', view.id);
  if (view.kind === 'bridge' && hero && hero !== 'photos') p.set('view', hero);
  if (view.kind === 'province') p.set('province', view.slug);
  if (lang === 'en') p.set('lang', 'en');
  const s = p.toString();
  return s ? `?${s}` : '';
}

export const sameView = (a: View, b: View) =>
  a.kind === b.kind &&
  (a.kind !== 'bridge' || a.id === (b as { id: string }).id) &&
  (a.kind !== 'province' || a.slug === (b as { slug: string }).slug);
