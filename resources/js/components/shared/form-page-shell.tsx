import { type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { PageTitle } from '@/components/shared/page-title';
import { PageBackButton } from '@/components/shared/page-back-button';

type FormPageShellProps = {
  backTo: string;
  backLabel: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
};

export function FormPageShell({
  backTo,
  backLabel,
  title,
  description,
  icon,
  children,
}: FormPageShellProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b bg-background px-4 py-2 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <PageTitle
            title={title}
            description={description}
            icon={icon}
            compact
            className="min-w-0 flex-1"
          />
          <PageBackButton fallbackHref={backTo} label={backLabel} className="shrink-0" />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
