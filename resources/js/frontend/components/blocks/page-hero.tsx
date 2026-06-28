import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { MotionSection } from '@frontend/components/ui/motion-section';
import type { LocalizedString } from '@frontend/types/marketing-content';
import { cn } from '@/lib/utils';

type PageHeroProps = {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
};

export function PageHero({ title, subtitle, breadcrumb, className }: PageHeroProps) {
  return (
    <MotionSection className={cn('border-b border-fe-border bg-fe-surface/50 py-10 sm:py-12 md:py-16', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs sm:text-sm text-fe-muted" aria-label="Breadcrumb">
            {breadcrumb.map((item, i) => (
              <span key={item.label} className="inline-flex items-center gap-1">
                {i > 0 ? <ChevronRight className="size-3.5" aria-hidden /> : null}
                {item.href ? (
                  <Link href={item.href} className="hover:text-fe-accent">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-fe-text">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="text-balance text-2xl font-bold tracking-tight text-fe-text sm:text-3xl md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-fe-muted sm:mt-3 sm:text-lg">{subtitle}</p>
        ) : null}
      </div>
    </MotionSection>
  );
}

export function localizedPageHero(
  translate: (v: LocalizedString) => string,
  title: LocalizedString,
  subtitle?: LocalizedString,
) {
  return {
    title: translate(title),
    subtitle: subtitle ? translate(subtitle) : undefined,
  };
}
