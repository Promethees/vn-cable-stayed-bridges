import type { Lang } from './i18n';

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

export function parseSearch(search: string): { view: View; lang: Lang | null } {
  const p = new URLSearchParams(search);
  const lang = p.get('lang') === 'en' ? 'en' : p.get('lang') === 'vi' ? 'vi' : null;
  const bridge = p.get('bridge');
  const province = p.get('province');
  const view: View = bridge
    ? { kind: 'bridge', id: bridge }
    : province
      ? { kind: 'province', slug: province }
      : { kind: 'country' };
  return { view, lang };
}

export function buildSearch(view: View, lang: Lang): string {
  const p = new URLSearchParams();
  if (view.kind === 'bridge') p.set('bridge', view.id);
  if (view.kind === 'province') p.set('province', view.slug);
  if (lang === 'en') p.set('lang', 'en');
  const s = p.toString();
  return s ? `?${s}` : '';
}

export const sameView = (a: View, b: View) =>
  a.kind === b.kind &&
  (a.kind !== 'bridge' || a.id === (b as { id: string }).id) &&
  (a.kind !== 'province' || a.slug === (b as { slug: string }).slug);
