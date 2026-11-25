import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Dark when OS prefers dark, unless <html data-theme> forces a theme. */
export function useDarkTheme(): boolean {
  const osDark = useMediaQuery('(prefers-color-scheme: dark)');
  const forced = document.documentElement.dataset.theme;
  return forced ? forced === 'dark' : osDark;
}

export function readStored<T extends string>(key: string, allowed: readonly T[]): T | null {
  try {
    const v = localStorage.getItem(key);
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : null;
  } catch {
    return null;
  }
}
export function writeStored(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* ignore */
  }
}
