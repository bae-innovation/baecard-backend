import * as React from 'react';

import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-10 text-center', className)}>
      <h2 className="text-2xl font-bold tracking-tight text-fe-text sm:text-3xl md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm leading-relaxed text-fe-muted sm:mt-3 sm:text-base">{subtitle}</p> : null}
    </div>
  );
}
