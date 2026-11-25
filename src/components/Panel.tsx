import type { ReactNode } from 'react';
import type { Status } from '../types';
import { STRINGS, type Lang } from '../lib/i18n';

export type SheetSnap = 'peek' | 'half' | 'full';
const NEXT: Record<SheetSnap, SheetSnap> = { peek: 'half', half: 'full', full: 'peek' };

interface Props {
  isDesktop: boolean;
  status?: Status;
  snap: SheetSnap;
  onSnap: (s: SheetSnap) => void;
  labelledBy: string;
  lang: Lang;
  children: ReactNode;
}

/** Desktop: 400px side panel. Phone: bottom sheet with peek/half/full snaps (tap handle cycles). */
export function Panel({ isDesktop, status, snap, onSnap, labelledBy, lang, children }: Props) {
  return (
    <aside
      className={`panel ${status ? `status-${status}` : 'no-status'} ${isDesktop ? 'is-side' : `is-sheet snap-${snap}`}`}
      role={isDesktop ? 'complementary' : 'dialog'}
      aria-modal={isDesktop ? undefined : false}
      aria-labelledby={labelledBy}
    >
      {!isDesktop && (
        <button
          type="button"
          className="sheet-handle"
          aria-label={STRINGS[lang].sheetHandle}
          onClick={() => onSnap(NEXT[snap])}
        >
          <span />
        </button>
      )}
      <div className="panel-body">{children}</div>
    </aside>
  );
}
