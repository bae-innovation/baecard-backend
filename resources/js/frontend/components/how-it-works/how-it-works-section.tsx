import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Palette,
  ShoppingBag,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { SectionShell } from '@frontend/components/blocks/section-shell';
import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { frontendAsset } from '@frontend/lib/brand';
import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { HowItWorksStep } from '@frontend/types/marketing-content';
import { cn } from '@/lib/utils';

const VIDEO_SRC = frontendAsset('videos/workLast.webm');

type StepTheme = {
  icon: LucideIcon;
  accentStrength: number;
  tintStrength: number;
  number: string;
  actionLabel: { en: string; bn: string };
  isFinal?: boolean;
};

const STEP_THEMES: Record<string, StepTheme> = {
  order: {
    icon: ShoppingBag,
    accentStrength: 100,
    tintStrength: 22,
    number: '01',
    actionLabel: { en: 'Continue to Design', bn: 'ডিজাইনে যান' },
  },
  design: {
    icon: Palette,
    accentStrength: 72,
    tintStrength: 16,
    number: '02',
    actionLabel: { en: 'Continue to Setup', bn: 'সেটআপে যান' },
  },
  setup: {
    icon: Smartphone,
    accentStrength: 48,
    tintStrength: 12,
    number: '03',
    actionLabel: { en: 'You are ready!', bn: 'আপনি প্রস্তুত!' },
    isFinal: true,
  },
};

const FALLBACK_THEMES = Object.values(STEP_THEMES);

function getStepTheme(step: HowItWorksStep, index: number): StepTheme {
  return STEP_THEMES[step.id] ?? FALLBACK_THEMES[index % FALLBACK_THEMES.length];
}

function stepThemeVars(theme: StepTheme): React.CSSProperties {
  return {
    '--step-accent': `color-mix(in srgb, var(--fe-accent) ${theme.accentStrength}%, transparent)`,
    '--step-tint': `color-mix(in srgb, var(--fe-accent) ${theme.tintStrength}%, var(--fe-surface))`,
  } as React.CSSProperties;
}

function stepLabel(step: HowItWorksStep, translate: (v: { en: string; bn: string }) => string) {
  const label = translate(step.label);
  return label.includes('. ') ? label.split('. ')[1] : label;
}

function SectionHeadingPremium({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative mb-14 text-center sm:mb-16 md:mb-20 lg:mb-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="pointer-events-none absolute inset-x-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fe-accent/12 blur-3xl fe-orb-drift"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative inline-flex items-center gap-2 rounded-full border border-fe-accent/25 bg-fe-accent/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-fe-accent sm:px-5 sm:py-2 sm:text-xs"
      >
        <Sparkles className="size-3.5" aria-hidden />
        {title}
      </motion.div>
      {subtitle ? (
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="relative mx-auto mt-4 max-w-3xl text-balance text-2xl font-bold tracking-tight text-fe-text sm:mt-5 sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-tight"
        >
          {subtitle}
        </motion.h2>
      ) : null}
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

function StepSelector({
  steps,
  active,
  onSelect,
  translate,
  reducedMotion,
}: {
  steps: HowItWorksStep[];
  active: string;
  onSelect: (id: string) => void;
  translate: (v: { en: string; bn: string }) => string;
  reducedMotion: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
      {steps.map((step, index) => {
        const theme = getStepTheme(step, index);
        const Icon = theme.icon;
        const isActive = active === step.id;

        return (
          <motion.button
            key={step.id}
            type="button"
            onClick={() => onSelect(step.id)}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            whileHover={reducedMotion ? undefined : { y: -4 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            style={isActive ? stepThemeVars(theme) : undefined}
            className={cn(
              'fe-touch group relative flex min-h-24 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border px-2 py-4 text-center transition-all duration-300 sm:min-h-28 sm:rounded-3xl sm:px-3 sm:py-5',
              isActive
                ? 'border-fe-accent/40 bg-fe-surface shadow-[0_12px_36px_color-mix(in_srgb,var(--fe-accent)_18%,transparent)] ring-1 ring-fe-accent/20'
                : 'border-fe-border bg-fe-surface/70 text-fe-muted hover:border-fe-accent/30 hover:bg-fe-surface',
            )}
          >
            {isActive ? (
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[var(--step-accent)] transition-[background] duration-500" aria-hidden />
            ) : null}
            {isActive ? (
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--step-tint),transparent_65%)]"
                aria-hidden
              />
            ) : null}

            <span
              className={cn(
                'relative inline-flex size-11 items-center justify-center rounded-xl sm:size-12',
                isActive
                  ? 'bg-fe-accent/15 text-fe-accent ring-2 ring-fe-accent/30 fe-step-icon-pulse'
                  : 'bg-fe-accent/10 text-fe-accent ring-1 ring-fe-accent/20',
              )}
              style={isActive && !reducedMotion ? { animationDelay: `${index * 0.3}s` } : undefined}
            >
              <Icon className="size-5 sm:size-6" strokeWidth={1.75} />
            </span>
            <span
              className={cn(
                'relative text-[11px] font-bold uppercase tracking-wide sm:text-xs',
                isActive ? 'text-fe-accent' : 'text-fe-text',
              )}
            >
              {stepLabel(step, translate)}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function StepContentPanel({
  step,
  index,
  translate,
  onSelect,
  steps,
}: {
  step: HowItWorksStep;
  index: number;
  translate: (v: { en: string; bn: string }) => string;
  onSelect: (id: string) => void;
  steps: HowItWorksStep[];
}) {
  const theme = getStepTheme(step, index);
  const Icon = theme.icon;
  const nextStep = steps[index + 1];

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={stepThemeVars(theme)}
      className={cn(
        'group relative overflow-hidden rounded-[1.75rem] border border-fe-border bg-fe-surface',
        'shadow-[0_10px_40px_color-mix(in_srgb,var(--fe-accent)_12%,transparent)]',
      )}
    >
      <div className="h-2 w-full bg-[var(--step-accent)]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--step-tint),transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1 top-2 select-none text-[5rem] font-black leading-none text-fe-accent/[0.07] sm:text-[5.5rem]"
        aria-hidden
      >
        {theme.number}
      </div>

      <div className="relative flex flex-col px-7 py-8 sm:px-8 sm:py-9">
        <div className="mb-6 flex items-start gap-4 sm:mb-7">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-fe-accent/15 text-fe-accent ring-2 ring-fe-accent/30 fe-step-icon-pulse">
            <Icon className="size-7" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-fe-accent">
              {translate({ en: `Step ${index + 1}`, bn: `ধাপ ${index + 1}` })}
            </p>
            <h3 className="mt-1.5 text-xl font-bold text-fe-text sm:text-2xl">
              {stepLabel(step, translate)}
            </h3>
          </div>
        </div>

        <p className="relative mb-8 text-[15px] leading-7 text-fe-muted sm:text-base sm:leading-7">
          {translate(step.content)}
        </p>

        <div className="relative mt-auto border-t border-fe-border/70 pt-6 sm:pt-7">
          {!theme.isFinal && nextStep ? (
            <MarketingButton
              type="button"
              variant="outline"
              size="lg"
              className="w-full border-fe-accent/40 bg-fe-accent/5 text-fe-accent shadow-[0_4px_16px_color-mix(in_srgb,var(--fe-accent)_12%,transparent)] hover:bg-fe-accent hover:text-fe-bg"
              onClick={() => onSelect(nextStep.id)}
            >
              {translate(theme.actionLabel)}
              <ArrowRight className="size-4" />
            </MarketingButton>
          ) : (
            <MarketingButton
              type="button"
              variant="solid"
              size="lg"
              className="w-full bg-fe-accent font-semibold text-fe-bg shadow-[0_8px_28px_color-mix(in_srgb,var(--fe-accent)_40%,transparent)] hover:brightness-110"
            >
              <CheckCircle2 className="size-4" />
              {translate(theme.actionLabel)}
            </MarketingButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function VideoPanel({
  activeStep,
  activeIndex,
  translate,
}: {
  activeStep: HowItWorksStep;
  activeIndex: number;
  translate: (v: { en: string; bn: string }) => string;
}) {
  const theme = getStepTheme(activeStep, activeIndex);

  return (
    <div
      style={stepThemeVars(theme)}
      className={cn(
        'relative overflow-hidden rounded-[1.75rem] border border-fe-border bg-fe-surface',
        'shadow-[0_16px_48px_color-mix(in_srgb,var(--fe-accent)_16%,transparent)]',
        'transition-[box-shadow,border-color] duration-500',
      )}
    >
      <div
        className="h-2 w-full bg-[var(--step-accent)] transition-[background] duration-500"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--step-tint),transparent_55%)] transition-[background] duration-500"
        aria-hidden
      />

      <div className="relative m-4 overflow-hidden rounded-2xl border border-fe-border/80 sm:m-5">
        <video
          className="aspect-video w-full object-cover"
          controls
          muted
          playsInline
          preload="metadata"
        >
          <source src={VIDEO_SRC} type="video/webm" />
        </video>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pb-5 sm:px-6 sm:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.25 }}
            className="inline-flex items-center gap-2 rounded-full border border-fe-accent/25 bg-fe-accent/10 px-3.5 py-2 text-xs font-semibold text-fe-accent sm:text-sm"
          >
            <span className="size-2 shrink-0 rounded-full bg-fe-accent fe-step-connector-glow" />
            {stepLabel(activeStep, translate)}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span
            key={theme.number}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-sm font-bold text-fe-accent/70"
          >
            {theme.number}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  const { content, translate } = useMarketingContent();
  const reducedMotion = useReducedMotion();
  const steps = content.howItWorksSteps;
  const [active, setActive] = React.useState(steps[0]?.id ?? 'order');

  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === active),
  );
  const activeStep = steps[activeIndex] ?? steps[0];

  return (
    <SectionShell
      id="workVideo"
      className="fe-how-it-works-section relative overflow-hidden !py-16 sm:!py-20 md:!py-28"
    >
      <motion.div
        className="pointer-events-none absolute -left-16 top-20 size-56 rounded-full bg-fe-accent/10 blur-3xl fe-orb-drift"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-12 size-64 rounded-full bg-fe-accent/10 blur-3xl fe-orb-drift-reverse"
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
        <SectionHeadingPremium
          title={translate({ en: 'How it works', bn: 'কীভাবে কাজ করে' })}
          subtitle={translate({
            en: 'Three simple steps from order to your live NFC card',
            bn: 'অর্ডার থেকে লাইভ NFC কার্ড — মাত্র ৩ ধাপ',
          })}
        />

        <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-10 xl:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 26 }}
            className="order-1 lg:col-span-3 lg:order-none"
          >
            <VideoPanel
              activeStep={activeStep}
              activeIndex={activeIndex}
              translate={translate}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 260, damping: 26 }}
            className="order-2 space-y-6 lg:col-span-2 lg:space-y-7"
          >
            <StepSelector
              steps={steps}
              active={active}
              onSelect={setActive}
              translate={translate}
              reducedMotion={reducedMotion}
            />

            <AnimatePresence mode="wait">
              {activeStep ? (
                <StepContentPanel
                  step={activeStep}
                  index={activeIndex}
                  translate={translate}
                  onSelect={setActive}
                  steps={steps}
                />
              ) : null}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center pt-2"
            >
              <motion.div
                animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
                transition={reducedMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-fe-border bg-fe-surface/95 px-6 py-4 text-center shadow-[0_8px_32px_color-mix(in_srgb,var(--fe-accent)_14%,transparent)] backdrop-blur-sm sm:max-w-none sm:flex-row sm:gap-4 sm:rounded-full sm:px-8 sm:py-4 sm:text-left"
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
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}
