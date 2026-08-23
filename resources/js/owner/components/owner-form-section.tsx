import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type OwnerFormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function OwnerFormSection({
  title,
  description,
  children,
  className,
}: OwnerFormSectionProps) {
  return (
    <section className={cn('rounded-2xl border bg-card p-4 shadow-sm', className)}>
      <div className="mb-4">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
