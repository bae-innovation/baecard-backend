import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { SectionShell } from '@frontend/components/blocks/section-shell';
import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { FeatureItem } from '@frontend/types/marketing-content';
import type { LocalizedString } from '@frontend/types/marketing-content';
import { cn } from '@/lib/utils';

type FeatureTheme = {
  accentStrength: number;
  tintStrength: number;
  number: string;
};

const FEATURE_THEMES: FeatureTheme[] = [
  { accentStrength: 100, tintStrength: 22, number: '01' },
  { accentStrength: 78, tintStrength: 18, number: '02' },
  { accentStrength: 58, tintStrength: 14, number: '03' },
  { accentStrength: 42, tintStrength: 10, number: '04' },
];

const FEATURE_HIGHLIGHTS: LocalizedString[][] = [
  [
    { en: 'Premium NFC chip built-in', bn: 'বিল্ট-ইন প্রিমিয়াম NFC চিপ' },
    { en: 'Custom branding on card', bn: 'কার্ডে কাস্টম ব্র্যান্ডিং' },
  ],
  [
    { en: 'Photo, bio & social links', bn: 'ছবি, বায়ো ও সোশ্যাল লিংক' },
    { en: 'Update anytime from dashboard', bn: 'ড্যাশবোর্ড থেকে যেকোনো সময় আপডেট' },
  ],
  [
    { en: 'Works on NFC smartphones', bn: 'NFC স্মার্টফোনে কাজ করে' },
    { en: 'No app needed for receiver', bn: 'গ্রহণকারীর অ্যাপ লাগে না' },
  ],
  [
    { en: 'QR on every card', bn: 'প্রতিটি কার্ডে QR' },
    { en: 'Works on all phone types', bn: 'সব ধরনের ফোনে কাজ করে' },
  ],
];

function featureThemeVars(theme: FeatureTheme): React.CSSProperties {
  return {
    '--feature-accent': `color-mix(in srgb, var(--fe-accent) ${theme.accentStrength}%, transparent)`,
    '--feature-tint': `color-mix(in srgb, var(--fe-accent) ${theme.tintStrength}%, var(--fe-surface))`,
  } as React.CSSProperties;
}

function FeaturesHeading() {
  const { content, translate } = useMarketingContent();

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
          <Sparkles className="size-3.5" aria-hidden />
        </motion.span>
        {translate(content.sectionHeadings.features.title)}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="relative mx-auto mt-4 w-full max-w-3xl text-center text-balance text-2xl font-bold tracking-tight text-fe-text sm:mt-5 sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-tight"
      >
        {translate(content.sectionHeadings.features.subtitle)}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.14 }}
        className="relative mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-fe-muted sm:text-base md:text-lg"
      >
        {translate({
          en: 'Everything you need to network smarter — from a premium physical card to a live digital profile that updates with your career.',
          bn: 'স্মার্ট নেটওয়ার্কিংয়ের জন্য যা দরকার — প্রিমিয়াম ফিজিক্যাল কার্ড থেকে আপনার ক্যারিয়ারের সাথে আপডেট হওয়া লাইভ ডিজিটাল প্রোফাইল।',
        })}
      </motion.p>
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

function FeatureCard({
  item,
  index,
  translate,
  reducedMotion,
}: {
  item: FeatureItem;
  index: number;
  translate: (v: LocalizedString) => string;
  reducedMotion: boolean;
}) {
  const theme = FEATURE_THEMES[index % FEATURE_THEMES.length];
  const highlights = FEATURE_HIGHLIGHTS[index] ?? [];

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 40 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 22,
        delay: index * 0.1,
      }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -10,
              transition: { type: 'spring', stiffness: 380, damping: 20 },
            }
      }
      style={featureThemeVars(theme)}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-fe-border bg-fe-surface',
        'shadow-[0_10px_40px_color-mix(in_srgb,var(--fe-accent)_12%,transparent)]',
        'transition-[box-shadow,border-color] duration-500',
        'hover:border-fe-accent/50 hover:shadow-[0_20px_56px_color-mix(in_srgb,var(--fe-accent)_24%,transparent)]',
      )}
    >
      <div className="h-2 w-full bg-[var(--feature-accent)]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,var(--feature-tint),transparent_58%)]"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-1 top-2 select-none text-[5rem] font-black leading-none text-fe-accent/[0.07] sm:text-[5.5rem]"
        aria-hidden
        animate={reducedMotion ? undefined : { opacity: [0.05, 0.12, 0.05] }}
        transition={reducedMotion ? undefined : { duration: 4.5, repeat: Infinity, delay: index * 0.5 }}
      >
        {theme.number}
      </motion.div>

      <div className="relative flex flex-1 flex-col p-6 sm:p-7 lg:p-8">
        <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
          <motion.span
            className={cn(
              'inline-flex size-[4.5rem] shrink-0 items-center justify-center rounded-2xl bg-fe-accent/15 p-3 ring-2 ring-fe-accent/30',
              !reducedMotion && 'fe-step-icon-pulse',
            )}
            style={reducedMotion ? undefined : { animationDelay: `${index * 0.35}s` }}
            animate={
              reducedMotion
                ? undefined
                : {
                    y: [0, -5, 0],
                  }
            }
            transition={
              reducedMotion
                ? undefined
                : {
                    y: { duration: 3.2 + index * 0.4, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            whileHover={reducedMotion ? undefined : { scale: 1.08, rotate: [0, -4, 4, 0] }}
          >
            <motion.img
              src={item.icon}
              alt=""
              className="size-full object-contain"
              loading="lazy"
              animate={reducedMotion ? undefined : { scale: [1, 1.05, 1] }}
              transition={
                reducedMotion
                  ? undefined
                  : { duration: 2.8, repeat: Infinity, delay: index * 0.3, ease: 'easeInOut' }
              }
            />
          </motion.span>
          <span className="rounded-full border border-fe-accent/30 bg-fe-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-fe-accent">
            {theme.number}
          </span>
        </div>

        <motion.h3
          initial={reducedMotion ? false : { opacity: 0, x: -12 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + index * 0.08, duration: 0.45 }}
          className="relative mb-3 text-lg font-bold tracking-tight text-fe-text sm:text-xl"
        >
          {translate(item.title)}
        </motion.h3>
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          whileInView={reducedMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22 + index * 0.08, duration: 0.5 }}
          className="relative mb-5 flex-1 text-sm leading-relaxed text-fe-muted sm:text-[15px]"
        >
          {translate(item.description)}
        </motion.p>

        <ul className="relative space-y-2.5 border-t border-fe-border/60 pt-4">
          {highlights.map((highlight, highlightIndex) => (
            <motion.li
              key={translate(highlight)}
              initial={reducedMotion ? false : { opacity: 0, x: -10 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.3 + index * 0.08 + highlightIndex * 0.1,
                duration: 0.4,
              }}
              className="flex items-start gap-2.5 text-sm text-fe-text"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-fe-accent" aria-hidden />
              <span>{translate(highlight)}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-fe-accent transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />
    </motion.article>
  );
}

export function FeatureGrid() {
  const { content, translate } = useMarketingContent();
  const reducedMotion = useReducedMotion();

  return (
    <SectionShell
      id="workColumn"
      className="fe-features-section relative overflow-hidden !py-16 sm:!py-20 md:!py-28"
    >
      <motion.div
        className="pointer-events-none absolute -left-20 top-24 size-64 rounded-full bg-fe-accent/12 blur-3xl fe-orb-drift"
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
          <FeaturesHeading />
        </div>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 sm:gap-7 lg:gap-8">
          {content.features.map((item, index) => (
            <StaggerItem key={translate(item.title)} className="h-full">
              <FeatureCard
                item={item}
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
          transition={{ delay: 0.35, duration: 0.55, type: 'spring', stiffness: 260 }}
          className="relative mt-14 sm:mt-16 md:mt-20"
        >
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
            transition={reducedMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center justify-center gap-5 rounded-[1.75rem] border border-fe-border bg-fe-surface/90 px-6 py-6 text-center shadow-[0_8px_32px_color-mix(in_srgb,var(--fe-accent)_14%,transparent)] backdrop-blur-sm sm:flex-row sm:justify-between sm:px-8 sm:text-left"
          >
            <div>
              <p className="font-semibold text-fe-text">
                {translate({
                  en: 'Ready to upgrade how you connect?',
                  bn: 'যোগাযোগের ধরন বদলাতে প্রস্তুত?',
                })}
              </p>
              <p className="mt-1 text-sm text-fe-muted">
                {translate({
                  en: 'Explore our card collection or book a demo with our team.',
                  bn: 'আমাদের কার্ড কালেকশন দেখুন বা টিমের সাথে ডেমো বুক করুন।',
                })}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Link href="/products" className="w-full sm:w-auto">
                <MarketingButton className="w-full sm:w-auto">
                  {translate({ en: 'View products', bn: 'পণ্য দেখুন' })}
                  <ArrowRight className="size-4" />
                </MarketingButton>
              </Link>
              <Link href="/appointment" className="w-full sm:w-auto">
                <MarketingButton variant="outline" className="w-full sm:w-auto">
                  {translate({ en: 'Book a demo', bn: 'ডেমো বুক করুন' })}
                </MarketingButton>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
