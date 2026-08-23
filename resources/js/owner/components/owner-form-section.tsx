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
    <section className={cn('owner-section', className)}>
      <div className="owner-section-header">
        <h3 className="owner-h3">{title}</h3>
        {description ? <p className="owner-section-desc">{description}</p> : null}
      </div>
      <div className="owner-section-body">{children}</div>
    </section>
  );
}
