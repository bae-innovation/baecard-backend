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
          {Icon ? <Icon className="size-5 shrink-0 text-primary" aria-hidden /> : null}
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        </div>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
