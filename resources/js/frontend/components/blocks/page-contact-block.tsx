import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Mail, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

import { MessageForm } from '@frontend/components/actions/message-form';
import { AppointmentForm } from '@frontend/components/actions/appointment-form';
import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { useActionHub } from '@frontend/hooks/use-action-hub';
import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { useAppSettings } from '@/hooks/useAppSettings';
import { cn } from '@/lib/utils';

export type PageContactVariant =
  | 'home'
  | 'products'
  | 'corporate'
  | 'security'
  | 'contact'
  | 'faq'
  | 'about'
  | 'terms'
  | 'policy';

type PageContactBlockProps = {
  variant: PageContactVariant;
  className?: string;
};

function AnimatedCtaStrip({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, type: 'spring', stiffness: 260 }}
      className={cn('relative overflow-hidden py-10 sm:py-12', className)}
    >
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
        transition={reducedMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-[1.75rem] border border-fe-border bg-fe-surface/90 px-6 py-7 text-center shadow-[0_8px_32px_color-mix(in_srgb,var(--fe-accent)_14%,transparent)] backdrop-blur-sm sm:flex-row sm:justify-between sm:px-8 sm:text-left"
      >
        <div>
          <p className="font-semibold text-fe-text">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-fe-muted">{subtitle}</p> : null}
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">{children}</div>
      </motion.div>
    </motion.section>
  );
}

function ContactInfoCard({
  icon: Icon,
  label,
  value,
  href,
  index,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href: string;
  index: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      whileHover={reducedMotion ? undefined : { y: -6 }}
      className="group flex items-center gap-4 rounded-2xl border border-fe-border bg-fe-surface/90 p-5 transition-[border-color,box-shadow] duration-300 hover:border-fe-accent/45 hover:shadow-[0_12px_40px_color-mix(in_srgb,var(--fe-accent)_16%,transparent)]"
    >
      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-fe-accent/15 ring-2 ring-fe-accent/30 transition-transform duration-300 group-hover:scale-105">
        <Icon className="size-5 text-fe-accent" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-fe-muted">{label}</p>
        <p className="mt-0.5 font-medium text-fe-text">{value}</p>
      </div>
    </motion.a>
  );
}

export function PageContactBlock({ variant, className }: PageContactBlockProps) {
  const { translate } = useMarketingContent();
  const { openHub } = useActionHub();
  const app = useAppSettings();
  const reducedMotion = useReducedMotion();

  const whatsapp = app.whatsapp ?? app.support_phone;
  const phone = app.support_phone;
  const email = app.contact_email;

  if (variant === 'contact') {
    const contactItems = [
      phone
        ? {
            icon: Phone,
            label: translate({ en: 'Phone', bn: 'ফোন' }),
            value: phone,
            href: `tel:${phone}`,
          }
        : null,
      email
        ? {
            icon: Mail,
            label: translate({ en: 'Email', bn: 'ইমেইল' }),
            value: email,
            href: `mailto:${email}`,
          }
        : null,
      whatsapp
        ? {
            icon: MessageCircle,
            label: 'WhatsApp',
            value: whatsapp,
            href: `https://wa.me/${whatsapp.replace(/\D/g, '')}`,
          }
        : null,
    ].filter(Boolean) as {
      icon: typeof Phone;
      label: string;
      value: string;
      href: string;
    }[];

    return (
      <section className={cn('fe-contact-section relative overflow-hidden py-12 sm:py-16 md:py-20', className)}>
        <motion.div
          className="pointer-events-none absolute -left-20 top-10 size-64 rounded-full bg-fe-accent/12 blur-3xl fe-orb-drift"
          aria-hidden
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />
        <motion.div
          className="pointer-events-none absolute -right-24 bottom-10 size-72 rounded-full bg-fe-accent/10 blur-3xl fe-orb-drift-reverse"
          aria-hidden
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-5 md:px-6">
          {contactItems.length > 0 ? (
            <div className="mx-auto mb-10 grid max-w-3xl gap-4 sm:grid-cols-3">
              {contactItems.map((item, index) => (
                <ContactInfoCard key={item.label} {...item} index={index} />
              ))}
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, x: -20 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="overflow-hidden rounded-[1.75rem] border border-fe-border bg-fe-surface/95 p-6 shadow-[0_12px_40px_color-mix(in_srgb,var(--fe-accent)_12%,transparent)] sm:p-8"
            >
              <div className="mb-6 h-1 w-12 rounded-full bg-fe-accent" aria-hidden />
              <h3 className="mb-1 text-xl font-bold text-fe-text">
                {translate({ en: 'Send a message', bn: 'মেসেজ পাঠান' })}
              </h3>
              <p className="mb-6 text-sm text-fe-muted">
                {translate({
                  en: 'Fill out the form and our team will respond within 24 hours.',
                  bn: 'ফর্ম পূরণ করুন — আমাদের টিম ২৪ ঘণ্টার মধ্যে উত্তর দেবে।',
                })}
              </p>
              <MessageForm />
            </motion.div>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, x: 20 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="overflow-hidden rounded-[1.75rem] border border-fe-border bg-fe-surface/95 p-6 shadow-[0_12px_40px_color-mix(in_srgb,var(--fe-accent)_12%,transparent)] sm:p-8"
            >
              <div className="mb-6 h-1 w-12 rounded-full bg-fe-accent" aria-hidden />
              <h3 className="mb-1 text-xl font-bold text-fe-text">
                {translate({ en: 'Book appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' })}
              </h3>
              <p className="mb-6 text-sm text-fe-muted">
                {translate({
                  en: 'Schedule a demo or consultation at your convenience.',
                  bn: 'আপনার সুবিধামতো ডেমো বা পরামর্শের সময় নির্ধারণ করুন।',
                })}
              </p>
              <AppointmentForm />
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'home') {
    return (
      <AnimatedCtaStrip
        className={className}
        title={translate({ en: 'Ready to connect smarter?', bn: 'স্মার্টভাবে সংযোগ করতে প্রস্তুত?' })}
        subtitle={translate({ en: 'Order your card or book a demo today.', bn: 'আজই অর্ডার করুন বা ডেমো বুক করুন।' })}
      >
        {whatsapp ? (
          <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
            <MarketingButton variant="solid" className="w-full sm:w-auto">
              WhatsApp
            </MarketingButton>
          </a>
        ) : null}
        <MarketingButton variant="outline" className="w-full sm:w-auto" onClick={() => openHub('appointment')}>
          <Calendar className="size-4" />
          {translate({ en: 'Book a Demo', bn: 'ডেমো বুক' })}
        </MarketingButton>
      </AnimatedCtaStrip>
    );
  }

  if (variant === 'products') {
    return (
      <AnimatedCtaStrip
        className={cn('fe-contact-strip border-t border-fe-border', className)}
        title={translate({ en: 'Found the perfect card?', bn: 'পছন্দের কার্ড পেয়েছেন?' })}
        subtitle={translate({
          en: 'Order now and we will confirm your details shortly.',
          bn: 'এখনই অর্ডার করুন — আমরা শীঘ্রই বিস্তারিত নিশ্চিত করব।',
        })}
      >
        <MarketingButton className="w-full sm:w-auto" onClick={() => openHub('order')}>
          {translate({ en: 'Order Now', bn: 'অর্ডার করুন' })}
          <ArrowRight className="size-4" />
        </MarketingButton>
      </AnimatedCtaStrip>
    );
  }

  if (variant === 'corporate') {
    return (
      <AnimatedCtaStrip
        className={className}
        title={translate({ en: 'Need a bulk quote?', bn: 'বাল্ক কোট দরকার?' })}
        subtitle={translate({
          en: 'Scroll down to submit your corporate inquiry — our team handles B2B orders.',
          bn: 'কর্পোরেট ইনকোয়ারি জমা দিতে নিচে স্ক্রল করুন — আমাদের টিম B2B অর্ডার সামলায়।',
        })}
      >
        <a href="#corporate">
          <MarketingButton variant="outline" className="w-full sm:w-auto">
            {translate({ en: 'Go to form', bn: 'ফর্মে যান' })}
            <ArrowRight className="size-4" />
          </MarketingButton>
        </a>
      </AnimatedCtaStrip>
    );
  }

  if (variant === 'security') {
    return (
      <AnimatedCtaStrip
        className={className}
        title={translate({ en: 'Questions about security?', bn: 'নিরাপত্তা নিয়ে প্রশ্ন?' })}
        subtitle={translate({
          en: 'Our team is happy to explain how we protect your data.',
          bn: 'আমরা কীভাবে আপনার ডেটা সুরক্ষিত রাখি তা ব্যাখ্যা করতে প্রস্তুত।',
        })}
      >
        <MarketingButton className="w-full sm:w-auto" onClick={() => openHub('message')}>
          {translate({ en: 'Talk to us', bn: 'কথা বলুন' })}
          <MessageCircle className="size-4" />
        </MarketingButton>
      </AnimatedCtaStrip>
    );
  }

  if (variant === 'faq') {
    return (
      <AnimatedCtaStrip
        className={className}
        title={translate({ en: 'Still have questions?', bn: 'এখনও প্রশ্ন আছে?' })}
        subtitle={translate({
          en: 'Our support team is one message away.',
          bn: 'আমাদের সাপোর্ট টিম এক মেসেজ দূরে।',
        })}
      >
        <Link href="/contact">
          <MarketingButton variant="outline" className="w-full sm:w-auto">
            {translate({ en: 'Contact us', bn: 'যোগাযোগ করুন' })}
            <ArrowRight className="size-4" />
          </MarketingButton>
        </Link>
      </AnimatedCtaStrip>
    );
  }

  if (variant === 'about') {
    return (
      <AnimatedCtaStrip
        className={className}
        title={translate({ en: 'Need support?', bn: 'সাহায্য দরকার?' })}
        subtitle={
          email
            ? translate({ en: 'Reach us anytime — we are here for you.', bn: 'যেকোনো সময় যোগাযোগ করুন।' })
            : undefined
        }
      >
        {email ? (
          <a href={`mailto:${email}`}>
            <MarketingButton className="w-full sm:w-auto">
              <Mail className="size-4" />
              {email}
            </MarketingButton>
          </a>
        ) : null}
        {phone ? (
          <a href={`tel:${phone}`}>
            <MarketingButton variant="outline" className="w-full sm:w-auto">
              <Phone className="size-4" />
              {phone}
            </MarketingButton>
          </a>
        ) : null}
      </AnimatedCtaStrip>
    );
  }

  return (
    <section className={cn('border-t border-fe-border py-6 text-center text-sm text-fe-muted', className)}>
      {email ? (
        <span>
          {translate({ en: 'Support:', bn: 'সাপোর্ট:' })}{' '}
          <a href={`mailto:${email}`} className="text-fe-accent hover:underline">
            {email}
          </a>
        </span>
      ) : null}
    </section>
  );
}
