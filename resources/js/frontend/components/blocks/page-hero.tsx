import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import type { LocalizedString } from '@frontend/types/marketing-content';
import { cn } from '@/lib/utils';

type PageHeroProps = {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
};

export function PageHero({ title, subtitle, breadcrumb, className }: PageHeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className={cn(
        'fe-page-hero relative overflow-hidden border-b border-fe-border py-12 sm:py-14 md:py-20',
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute -left-24 top-0 size-72 rounded-full bg-fe-accent/14 blur-3xl fe-orb-drift"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-0 size-80 rounded-full bg-fe-accent/10 blur-3xl fe-orb-drift-reverse"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.15 }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fe-accent/40 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 md:px-6">
        {breadcrumb && breadcrumb.length > 0 ? (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-4 flex flex-wrap items-center gap-1 text-xs text-fe-muted sm:mb-5 sm:text-sm"
            aria-label="Breadcrumb"
          >
            {breadcrumb.map((item, i) => (
              <span key={item.label} className="inline-flex items-center gap-1">
                {i > 0 ? <ChevronRight className="size-3.5" aria-hidden /> : null}
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-fe-accent">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-fe-accent">{item.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        ) : null}

        <motion.h1
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="max-w-4xl text-balance text-3xl font-bold tracking-tight text-fe-text sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
        >
          {title}
        </motion.h1>

        {subtitle ? (
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-fe-muted sm:mt-5 sm:text-lg md:text-xl"
          >
            {subtitle}
          </motion.p>
        ) : null}

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="fe-timeline-shimmer-bar mt-6 h-1 w-24 origin-left rounded-full sm:mt-8 sm:w-32"
          aria-hidden
        />
      </div>
    </section>
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
