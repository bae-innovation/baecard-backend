import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

import { PremiumSectionHeading } from '@frontend/components/ui/premium-section-heading';
import { StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { SecurityItem } from '@frontend/types/marketing-content';
import { cn } from '@/lib/utils';

import { SectionShell } from './section-shell';

type CardTheme = {
  accentStrength: number;
  tintStrength: number;
  number: string;
};

const CARD_THEMES: CardTheme[] = [
  { accentStrength: 100, tintStrength: 22, number: '01' },
  { accentStrength: 78, tintStrength: 18, number: '02' },
  { accentStrength: 58, tintStrength: 14, number: '03' },
  { accentStrength: 42, tintStrength: 10, number: '04' },
];

function cardThemeVars(theme: CardTheme): React.CSSProperties {
  return {
    '--sec-accent': `color-mix(in srgb, var(--fe-accent) ${theme.accentStrength}%, transparent)`,
    '--sec-tint': `color-mix(in srgb, var(--fe-accent) ${theme.tintStrength}%, var(--fe-surface))`,
  } as React.CSSProperties;
}

function SecurityCard({
  item,
  index,
  translate,
  reducedMotion,
}: {
  item: SecurityItem;
  index: number;
  translate: (v: { en: string; bn: string }) => string;
  reducedMotion: boolean;
}) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 36 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: index * 0.08 }}
      whileHover={
        reducedMotion
          ? undefined
          : { y: -10, transition: { type: 'spring', stiffness: 380, damping: 20 } }
      }
      style={cardThemeVars(theme)}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-fe-border bg-fe-surface',
        'shadow-[0_10px_40px_color-mix(in_srgb,var(--fe-accent)_12%,transparent)]',
        'transition-[box-shadow,border-color] duration-500',
        'hover:border-fe-accent/50 hover:shadow-[0_20px_56px_color-mix(in_srgb,var(--fe-accent)_24%,transparent)]',
      )}
    >
      <div className="h-2 w-full bg-[var(--sec-accent)]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,var(--sec-tint),transparent_58%)]"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-1 top-2 select-none text-[4.5rem] font-black leading-none text-fe-accent/[0.07]"
        aria-hidden
        animate={reducedMotion ? undefined : { opacity: [0.05, 0.12, 0.05] }}
        transition={reducedMotion ? undefined : { duration: 4.5, repeat: Infinity, delay: index * 0.5 }}
      >
        {theme.number}
      </motion.div>

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        <motion.span
          className={cn(
            'mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-fe-accent/15 p-3 ring-2 ring-fe-accent/30',
            !reducedMotion && 'fe-step-icon-pulse',
          )}
          style={reducedMotion ? undefined : { animationDelay: `${index * 0.35}s` }}
          animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
          transition={
            reducedMotion
              ? undefined
              : { y: { duration: 3.2 + index * 0.4, repeat: Infinity, ease: 'easeInOut' } }
          }
        >
          <motion.img
            src={item.icon}
            alt=""
            className="size-full object-contain"
            loading="lazy"
            animate={reducedMotion ? undefined : { scale: [1, 1.06, 1] }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 2.8, repeat: Infinity, delay: index * 0.3, ease: 'easeInOut' }
            }
          />
        </motion.span>
        <h3 className="mb-2 text-lg font-bold tracking-tight text-fe-text sm:text-xl">
          {translate(item.title)}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-fe-muted sm:text-[15px]">
          {translate(item.description)}
        </p>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-fe-accent transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />
    </motion.article>
  );
}

export function SecurityCardsBlock({ showHeading = true }: { showHeading?: boolean }) {
  const { content, translate } = useMarketingContent();
  const reducedMotion = useReducedMotion();

  return (
    <SectionShell id="security" className="fe-security-section relative overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -left-20 top-16 size-64 rounded-full bg-fe-accent/12 blur-3xl fe-orb-drift"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-12 size-72 rounded-full bg-fe-accent/10 blur-3xl fe-orb-drift-reverse"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      />

      {showHeading ? (
        <PremiumSectionHeading
          badge={translate(content.sectionHeadings.security.title)}
          title={translate(content.sectionHeadings.security.title)}
          subtitle={translate(content.sectionHeadings.security.subtitle)}
          icon={ShieldCheck}
        />
      ) : null}

      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
        {content.security.map((item, index) => (
          <StaggerItem key={translate(item.title)} className="h-full">
            <SecurityCard
              item={item}
              index={index}
              translate={translate}
              reducedMotion={reducedMotion}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionShell>
  );
}
