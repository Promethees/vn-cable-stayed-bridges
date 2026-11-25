import { STATUSES, type Status } from '../types';
import { STATUS_LABEL } from '../lib/status';
import { StatusIcon } from './StatusBadge';

interface Props {
  active: ReadonlySet<Status>;
  counts: Record<Status, number>;
  onToggle: (s: Status) => void;
  isSample: boolean;
}

export function Legend({ active, counts, onToggle, isSample }: Props) {
  return (
    <fieldset className="legend">
      <legend>Trạng thái</legend>
      {STATUSES.map((s) => (
        <label key={s} className="legend-item" data-status={s}>
          <input type="checkbox" checked={active.has(s)} onChange={() => onToggle(s)} />
          <span className="legend-swatch" data-status={s}>
            <StatusIcon status={s} />
          </span>
          <span>
            {STATUS_LABEL[s].vi} <span className="muted">({counts[s]})</span>
          </span>
        </label>
      ))}
      {isSample && <p className="sample-note">Dữ liệu mẫu (sample)</p>}
    </fieldset>
  );
}
