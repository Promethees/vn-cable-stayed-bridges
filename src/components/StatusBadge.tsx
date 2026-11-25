import type { Status } from '../types';
import { STATUS_ICON_SVG, STATUS_LABEL } from '../lib/status';

export function StatusIcon({ status }: { status: Status }) {
  return <span className="status-icon" data-status={status} dangerouslySetInnerHTML={{ __html: STATUS_ICON_SVG[status] }} />;
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className="status-badge" data-status={status}>
      <StatusIcon status={status} />
      {STATUS_LABEL[status].vi}
    </span>
  );
}
