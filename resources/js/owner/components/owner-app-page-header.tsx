import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type OwnerAppPageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
};

export function OwnerAppPageHeader({
  title,
  description,
  icon: Icon,
  action,
}: OwnerAppPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="owner-icon-header" aria-hidden /> : null}
          <h1 className="owner-h1">{title}</h1>
        </div>
        {description ? <p className="owner-lead">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
