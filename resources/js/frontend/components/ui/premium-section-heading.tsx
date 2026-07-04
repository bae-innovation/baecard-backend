import { Sparkles, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type PremiumSectionHeadingProps = {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  size?: 'md' | 'lg';
};

export function PremiumSectionHeading({
  badge,
  title,
  subtitle,
  description,
  icon: Icon,
  className,
  size = 'md',
}: PremiumSectionHeadingProps) {
  const BadgeIcon = Icon ?? Sparkles;

  return (
    <div
      className={cn(
        'relative mx-auto mb-12 flex w-full max-w-4xl flex-col items-center text-center sm:mb-14 md:mb-16',
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="pointer-events-none absolute inset-x-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fe-accent/12 blur-3xl fe-orb-drift"
        aria-hidden
      />
      {badge ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative inline-flex items-center gap-2 rounded-full border border-fe-accent/25 bg-fe-accent/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-fe-accent sm:px-5 sm:py-2 sm:text-xs"
        >
          <motion.span
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BadgeIcon className="size-3.5" aria-hidden />
          </motion.span>
          {badge}
        </motion.div>
      ) : null}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: badge ? 0.08 : 0 }}
        className={cn(
          'relative mx-auto mt-4 w-full max-w-3xl text-balance text-center font-bold tracking-tight text-fe-text sm:mt-5',
          size === 'lg'
            ? 'text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-tight'
            : 'text-2xl sm:text-3xl md:text-4xl',
        )}
      >
        {subtitle ?? title}
      </motion.h2>
      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="relative mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-fe-muted sm:text-base md:text-lg"
        >
          {description}
        </motion.p>
      ) : null}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.18 }}
        className="fe-timeline-shimmer-bar mx-auto mt-6 h-1.5 w-32 origin-center rounded-full sm:mt-7 sm:w-40"
        aria-hidden
      />
    </div>
  );
}
