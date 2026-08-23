import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type OwnerAppEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function OwnerAppEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: OwnerAppEmptyStateProps) {
  return (
    <div className="owner-card flex flex-col items-center justify-center gap-4 border-dashed bg-muted/20 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Icon className="owner-icon-empty" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <p className="owner-h2">{title}</p>
        {description ? <p className="owner-body text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
