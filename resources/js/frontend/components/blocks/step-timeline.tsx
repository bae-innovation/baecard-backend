import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Palette, ShoppingBag, Smartphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { OrderStep } from '@frontend/types/marketing-content';
import { cn } from '@/lib/utils';

import { SectionShell } from './section-shell';

type StepTimelineProps = {
  steps?: OrderStep[];
  title?: string;
  subtitle?: string;
};

type StepTheme = {
  icon: LucideIcon;
  accentStrength: number;
  tintStrength: number;
  number: string;
  nextLabel: { en: string; bn: string };
};

const STEP_THEMES: Record<string, StepTheme> = {
  order: {
    icon: ShoppingBag,
    accentStrength: 100,
    tintStrength: 22,
    number: '01',
    nextLabel: { en: 'Continue to Design', bn: 'ডিজাইনে যান' },
  },
  design: {
    icon: Palette,
    accentStrength: 72,
    tintStrength: 16,
    number: '02',
    nextLabel: { en: 'Continue to Setup', bn: 'সেটআপে যান' },
  },
  setup: {
    icon: Smartphone,
    accentStrength: 48,
    tintStrength: 12,
    number: '03',
    nextLabel: { en: 'You are ready!', bn: 'আপনি প্রস্তুত!' },
  },
};

const FALLBACK_THEMES: StepTheme[] = Object.values(STEP_THEMES);

function getStepTheme(step: OrderStep, index: number): StepTheme {
  return STEP_THEMES[step.id] ?? FALLBACK_THEMES[index % FALLBACK_THEMES.length];
}

function PremiumHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative mx-auto mb-14 flex w-full max-w-4xl flex-col items-center text-center sm:mb-16 md:mb-20 lg:mb-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="pointer-events-none absolute inset-x-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fe-accent/12 blur-3xl fe-orb-drift"
        aria-hidden
      />
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative text-xs font-bold uppercase tracking-[0.35em] text-fe-accent sm:text-sm"
      >
        {title}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="relative mx-auto mt-4 w-full max-w-3xl text-center text-balance text-2xl font-bold tracking-tight text-fe-text sm:mt-5 sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-tight"
      >
        {subtitle}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.15 }}
        className="fe-timeline-shimmer-bar mx-auto mt-6 h-1.5 w-32 origin-center rounded-full sm:mt-7 sm:w-40"
        aria-hidden
      />
    </div>
  );
}

function StepProgressRail({ count }: { count: number }) {
  return (
    <div className="mb-10 hidden max-w-3xl md:mx-auto md:mb-12 md:flex md:items-center md:justify-between md:px-6 lg:mb-14">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-1 items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 320 }}
            className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-fe-accent bg-fe-accent/15 text-sm font-bold text-fe-accent shadow-[0_0_20px_color-mix(in_srgb,var(--fe-accent)_35%,transparent)]"
          >
            {index + 1}
          </motion.div>
          {index < count - 1 ? (
            <div className="relative mx-3 h-1 flex-1 overflow-hidden rounded-full bg-fe-border">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.12, duration: 0.6 }}
                className="fe-timeline-shimmer-bar h-full w-full origin-left rounded-full"
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function StepCard({
  step,
  index,
  translate,
  reducedMotion,
}: {
  step: OrderStep;
  index: number;
  translate: (v: { en: string; bn: string }) => string;
  reducedMotion: boolean;
}) {
  const theme = getStepTheme(step, index);
  const Icon = theme.icon;
  const isLast = index === 2;

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 36 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 22,
        delay: index * 0.14,
      }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -10,
              transition: { type: 'spring', stiffness: 380, damping: 20 },
            }
      }
      className={cn(
        'group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] border border-fe-border bg-fe-surface sm:min-h-[24rem]',
        'shadow-[0_10px_40px_color-mix(in_srgb,var(--fe-accent)_12%,transparent)]',
        'transition-[box-shadow,border-color,transform] duration-500',
        'hover:border-fe-accent/50 hover:shadow-[0_20px_56px_color-mix(in_srgb,var(--fe-accent)_26%,transparent)]',
      )}
      style={
        {
          '--step-accent': `color-mix(in srgb, var(--fe-accent) ${theme.accentStrength}%, transparent)`,
          '--step-tint': `color-mix(in srgb, var(--fe-accent) ${theme.tintStrength}%, var(--fe-surface))`,
        } as React.CSSProperties
      }
    >
      <div className="h-2 w-full bg-[var(--step-accent)]" aria-hidden />

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,var(--step-tint),transparent_58%)]"
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute -right-1 top-2 select-none text-[5.5rem] font-black leading-none text-fe-accent/[0.07] sm:text-[6.5rem]"
        aria-hidden
        animate={reducedMotion ? undefined : { opacity: [0.05, 0.12, 0.05] }}
        transition={reducedMotion ? undefined : { duration: 4.5, repeat: Infinity, delay: index * 0.55 }}
      >
        {theme.number}
      </motion.div>

      <div className="relative flex flex-1 flex-col px-7 py-8 sm:px-8 sm:py-9 lg:px-9 lg:py-10">
        <div className="mb-7 flex items-start justify-between gap-4 sm:mb-8">
          <motion.span
            className={cn(
              'inline-flex size-16 shrink-0 items-center justify-center rounded-2xl bg-fe-accent/15 text-fe-accent ring-2 ring-fe-accent/30',
              !reducedMotion && 'fe-step-icon-pulse',
            )}
            style={reducedMotion ? undefined : { animationDelay: `${index * 0.35}s` }}
            whileHover={reducedMotion ? undefined : { scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <Icon className="size-8" strokeWidth={1.75} />
          </motion.span>
          <span className="rounded-full border border-fe-accent/30 bg-fe-accent/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-fe-accent sm:px-4 sm:text-xs">
            {translate({ en: `Step ${index + 1}`, bn: `ধাপ ${index + 1}` })}
          </span>
        </div>

        <h3 className="relative mb-4 text-2xl font-bold tracking-tight text-fe-text sm:text-[1.65rem]">
          {translate(step.title)}
        </h3>
        <p className="relative mb-8 flex-1 text-[15px] leading-7 text-fe-muted sm:text-base sm:leading-7">
          {translate(step.body)}
        </p>

        <div className="relative mt-auto border-t border-fe-border/70 pt-6 sm:pt-7">
          {!isLast ? (
            <MarketingButton
              type="button"
              variant="outline"
              size="lg"
              className="w-full border-fe-accent/40 bg-fe-accent/5 text-fe-accent shadow-[0_4px_16px_color-mix(in_srgb,var(--fe-accent)_12%,transparent)] hover:bg-fe-accent hover:text-fe-bg"
            >
              {translate(theme.nextLabel)}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MarketingButton>
          ) : (
            <MarketingButton
              type="button"
              variant="solid"
              size="lg"
              className="w-full bg-fe-accent font-semibold text-fe-bg shadow-[0_8px_28px_color-mix(in_srgb,var(--fe-accent)_40%,transparent)] hover:brightness-110"
            >
              <CheckCircle2 className="size-4" />
              {translate(theme.nextLabel)}
            </MarketingButton>
          )}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-fe-accent transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />
    </motion.article>
  );
}

export function StepTimeline({ steps, title, subtitle }: StepTimelineProps) {
  const { content, translate } = useMarketingContent();
  const reducedMotion = useReducedMotion();
  const items = steps ?? content.orderSteps;
  const headingTitle = title ?? translate(content.sectionHeadings.howItWorks.title);
  const headingSubtitle = subtitle ?? translate(content.sectionHeadings.howItWorks.subtitle);

  return (
    <SectionShell
      id="order-setup"
      className="fe-order-setup-section relative overflow-hidden !py-16 sm:!py-20 md:!py-28"
    >
      <motion.div
        className="pointer-events-none absolute -left-20 top-28 size-64 rounded-full bg-fe-accent/12 blur-3xl fe-orb-drift"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-20 size-72 rounded-full bg-fe-accent/10 blur-3xl fe-orb-drift-reverse"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fe-accent/40 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex w-full justify-center">
          <PremiumHeading title={headingTitle} subtitle={headingSubtitle} />
        </div>

        <StepProgressRail count={items.length} />

        <StaggerContainer className="relative grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {items.map((step, index) => (
            <StaggerItem key={step.id} className="relative z-10 h-full">
              <StepCard
                step={step}
                index={index}
                translate={translate}
                reducedMotion={reducedMotion}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.55, type: 'spring', stiffness: 260 }}
          className="relative mt-14 flex justify-center sm:mt-16 md:mt-20"
        >
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
            transition={reducedMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-fe-border bg-fe-surface/95 px-6 py-4 text-center shadow-[0_8px_32px_color-mix(in_srgb,var(--fe-accent)_14%,transparent)] backdrop-blur-sm sm:flex-row sm:gap-4 sm:rounded-full sm:px-8 sm:py-4 sm:text-left"
          >
            <span className="flex shrink-0 gap-2">
              {[100, 65, 40].map((opacity) => (
                <span
                  key={opacity}
                  className="size-2.5 rounded-full bg-fe-accent"
                  style={{ opacity: opacity / 100 }}
                />
              ))}
            </span>
            <p className="text-sm leading-relaxed sm:text-[15px]">
              <span className="font-semibold text-fe-text">
                {translate({
                  en: 'Order → Design → Setup',
                  bn: 'অর্ডার → ডিজাইন → সেটআপ',
                })}
              </span>
              <span className="text-fe-muted">
                {' '}
                {translate({
                  en: '— we guide you all the way',
                  bn: '— আমরা পুরো পথে আপনার পাশে',
                })}
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
