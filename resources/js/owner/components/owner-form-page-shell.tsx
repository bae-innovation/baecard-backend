import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { OwnerAppPageHeader } from '@/owner/components/owner-app-page-header';

type OwnerFormPageShellProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
};

export function OwnerFormPageShell({
  title,
  description,
  icon,
  children,
}: OwnerFormPageShellProps) {
  return (
    <div className="flex flex-col">
      <div className="owner-page-header shrink-0 border-b bg-background">
        <OwnerAppPageHeader title={title} description={description} icon={icon} />
      </div>
      <div className="owner-page-content">{children}</div>
    </div>
  );
}
