import { Link } from '@inertiajs/react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { PageTitle } from '@/components/shared/page-title';
import { Button } from '@/components/ui/button';

type FormPageShellProps = {
  backTo: string;
  backLabel: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  color?: React.ComponentProps<typeof PageTitle>['color'];
  children: React.ReactNode;
};

export function FormPageShell({
  backTo,
  backLabel,
  title,
  description,
  icon,
  color,
  children,
}: FormPageShellProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b bg-background px-4 pb-4 pt-2 sm:px-6">
        <Button variant="ghost" size="sm" className="-ml-2 mb-3" asChild>
          <Link href={backTo}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel}
          </Link>
        </Button>
        <PageTitle
          title={title}
          description={description}
          icon={icon}
          color={color}
          headingClassName="text-2xl sm:text-3xl"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
