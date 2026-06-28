import * as React from 'react';

import { MotionSection } from '@frontend/components/ui/motion-section';
import { cn } from '@/lib/utils';

type SectionShellProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
};

export function SectionShell({ id, className, children, delay }: SectionShellProps) {
  return (
    <MotionSection
      id={id}
      delay={delay}
      className={cn('py-12 sm:py-16 md:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6">{children}</div>
    </MotionSection>
  );
}
