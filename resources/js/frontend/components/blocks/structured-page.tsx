import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles, Target, type LucideIcon } from 'lucide-react';

import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import type { PageContent } from '@frontend/types/marketing-content';
import { cn } from '@/lib/utils';

import { SectionShell } from './section-shell';

type StructuredPageProps = {
  page: PageContent;
  translate: (value: { en: string; bn: string }) => string;
  variant?: 'default' | 'about';
};

const ABOUT_PILLARS: { icon: LucideIcon; title: { en: string; bn: string }; body: { en: string; bn: string } }[] = [
  {
    icon: Target,
    title: { en: 'Our Mission', bn: 'আমাদের লক্ষ্য' },
    body: {
      en: 'Make professional networking effortless with smart NFC technology.',
      bn: 'স্মার্ট NFC প্রযুক্তি দিয়ে পেশাদার নেটওয়ার্কিং সহজ করা।',
    },
  },
  {
    icon: Heart,
    title: { en: 'Customer First', bn: 'গ্রাহক প্রথম' },
    body: {
      en: 'Premium cards, fast support, and a profile that grows with your career.',
      bn: 'প্রিমিয়াম কার্ড, দ্রুত সাপোর্ট, এবং আপনার ক্যারিয়ারের সাথে বেড়ে ওঠা প্রোফাইল।',
    },
  },
  {
    icon: Shield,
    title: { en: 'Trust & Security', bn: 'বিশ্বাস ও নিরাপত্তা' },
    body: {
      en: 'Your data is protected with industry-standard security practices.',
      bn: 'আপনার ডেটা শিল্প-মানের নিরাপত্তা অনুশীলনে সুরক্ষিত।',
    },
  },
  {
    icon: Sparkles,
    title: { en: 'Innovation', bn: 'উদ্ভাবন' },
    body: {
      en: 'Always improving — new features, designs, and integrations.',
      bn: 'অবিরত উন্নতি — নতুন ফিচার, ডিজাইন ও ইন্টিগ্রেশন।',
    },
  },
];

export function StructuredPageBody({ page, translate, variant = 'default' }: StructuredPageProps) {
  const reducedMotion = useReducedMotion();

  return (
    <SectionShell className="fe-structured-page relative overflow-hidden !py-10 sm:!py-12 md:!py-16">
      <motion.div
        className="pointer-events-none absolute -right-16 top-8 size-56 rounded-full bg-fe-accent/10 blur-3xl fe-orb-drift-reverse"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      />

      <div className="relative mx-auto max-w-3xl">
        <div className="space-y-5">
          {page.paragraphs.map((p, index) => (
            <motion.p
              key={translate(p).slice(0, 32)}
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(
                'leading-relaxed text-fe-muted',
                index === 0
                  ? 'rounded-2xl border border-fe-border/70 bg-fe-surface/80 p-6 text-base backdrop-blur-sm sm:p-7 sm:text-lg'
                  : 'text-base sm:text-lg',
              )}
            >
              {translate(p)}
            </motion.p>
          ))}
        </div>
      </div>

      {variant === 'about' ? (
        <div className="relative mx-auto mt-14 max-w-6xl sm:mt-16 md:mt-20">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {ABOUT_PILLARS.map((pillar, index) => (
              <motion.article
                key={translate(pillar.title)}
                initial={reducedMotion ? false : { opacity: 0, y: 32 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-32px' }}
                transition={{ type: 'spring', stiffness: 260, damping: 22, delay: index * 0.08 }}
                whileHover={
                  reducedMotion
                    ? undefined
                    : { y: -8, transition: { type: 'spring', stiffness: 380, damping: 20 } }
                }
                className="group relative overflow-hidden rounded-[1.5rem] border border-fe-border bg-fe-surface p-6 shadow-[0_10px_40px_color-mix(in_srgb,var(--fe-accent)_10%,transparent)] transition-[border-color,box-shadow] duration-500 hover:border-fe-accent/45 hover:shadow-[0_18px_50px_color-mix(in_srgb,var(--fe-accent)_20%,transparent)]"
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-fe-accent" aria-hidden />
                <motion.span
                  className={cn(
                    'mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-fe-accent/15 ring-2 ring-fe-accent/30',
                    !reducedMotion && 'fe-step-icon-pulse',
                  )}
                  style={reducedMotion ? undefined : { animationDelay: `${index * 0.3}s` }}
                  animate={reducedMotion ? undefined : { y: [0, -4, 0] }}
                  transition={
                    reducedMotion
                      ? undefined
                      : { y: { duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut' } }
                  }
                >
                  <pillar.icon className="size-5 text-fe-accent" aria-hidden />
                </motion.span>
                <h3 className="mb-2 font-bold text-fe-text">{translate(pillar.title)}</h3>
                <p className="text-sm leading-relaxed text-fe-muted">{translate(pillar.body)}</p>
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-fe-accent transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden
                />
              </motion.article>
            ))}
          </div>
        </div>
      ) : null}
    </SectionShell>
  );
}
