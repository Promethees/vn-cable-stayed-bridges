import type { Status, Usage } from '../types';
import { pylonSvg } from '../lib/status';
import { STATUS_LABEL, USAGE_LABEL, type Lang } from '../lib/i18n';

export function PylonGlyph({ status, size = 16 }: { status: Status; size?: number }) {
  return <span className="glyph" dangerouslySetInnerHTML={{ __html: pylonSvg(status, size) }} />;
}

export function StatusChip({ status, lang }: { status: Status; lang: Lang }) {
  return (
    <span className={`status-chip status-${status}`}>
      <PylonGlyph status={status} />
      {STATUS_LABEL[status][lang]}
    </span>
  );
}

export function Chevron() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path d="M9 3h4v4M13 3L7 9M11 10v3H3V5h3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const USAGE_PATH: Record<Usage, string> = {
  road: 'M5 2L3 14M11 2l2 12M8 3v2M8 7.5v2M8 12v2',
  rail: 'M5 2v12M11 2v12M3 4.5h10M3 8h10M3 11.5h10',
  metro: 'M4 3h8a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zM3 8h10M5 12l-1.5 2.5M11 12l1.5 2.5',
  pedestrian: 'M8 2.5a1 1 0 100 .1M8 5v5l-2 4M8 10l2 4M5 7.5l3-1.5 3 1.5',
};

export function UsageIcon({ usage }: { usage: Usage }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path d={USAGE_PATH[usage]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UsageTag({ usage, lang }: { usage: Usage; lang: Lang }) {
  return (
    <span className="tag">
      <UsageIcon usage={usage} />
      {USAGE_LABEL[usage][lang]}
    </span>
  );
}
