import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Loader2, Send, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { SectionShell } from '@frontend/components/blocks/section-shell';
import { submitContact } from '@frontend/lib/marketing-api';
import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { PremiumSectionHeading } from '@frontend/components/ui/premium-section-heading';
import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(1, 'Full name is required'),
  phone: z
    .string()
    .length(11, 'Invalid mobile number')
    .regex(/^01[0-9]{9}$/, 'Invalid mobile number'),
  job_title: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email('Valid email is required'),
  card_amount: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type CorporateFormProps = {
  variant?: 'page' | 'section';
};

function CorporateHeading() {
  const { content, translate } = useMarketingContent();

  return (
    <PremiumSectionHeading
      badge={translate(content.sectionHeadings.corporate.title)}
      title={translate(content.sectionHeadings.corporate.title)}
      subtitle={translate(content.sectionHeadings.corporate.subtitle)}
      icon={Building2}
    />
  );
}

function CorporateCopy() {
  const { content, translate } = useMarketingContent();
  const reducedMotion = useReducedMotion();

  const paragraphs = [
    translate({
      en: "Empower Your Team's Networking: Introducing the BAE CARD",
      bn: 'আপনার টিমের নেটওয়ার্কিং শক্তিশালী করুন: পরিচিত হোন BAE CARD-এর সাথে',
    }),
    translate({
      en: "Revolutionize your team's connections with the BAE CARD, the ultimate smart business card for visionary companies worldwide.",
      bn: 'বিশ্বব্যাপী দূরদর্শী কোম্পানিগুলোর জন্য আদর্শ স্মার্ট বিজনেস কার্ড BAE CARD দিয়ে আপনার টিমের সংযোগকে নতুন মাত্রা দিন।',
    }),
    translate({
      en: 'This innovative NFC technology empowers faster, smarter networking, allowing you to effortlessly share contact information and more with a simple tap. Boost your brand image and stand out from the competition with the BAE CARD.',
      bn: 'এই উদ্ভাবনী NFC প্রযুক্তি দ্রুত ও স্মার্ট নেটওয়ার্কিং সক্ষম করে — একটি ট্যাপেই যোগাযোগের তথ্য ও আরও অনেক কিছু সহজে শেয়ার করুন। BAE CARD দিয়ে ব্র্যান্ড ইমেজ বাড়ান এবং প্রতিযোগিতায় এগিয়ে থাকুন।',
    }),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative space-y-6"
    >
      <div
        className="pointer-events-none absolute -left-6 top-0 size-32 rounded-full bg-fe-accent/10 blur-3xl"
        aria-hidden
      />
      <div className="relative space-y-4">
        {paragraphs.map((text, index) => (
          <motion.p
            key={index}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + index * 0.08, duration: 0.45 }}
            className={cn(
              'leading-relaxed text-fe-muted',
              index === 0
                ? 'text-lg font-bold text-fe-text sm:text-xl'
                : 'text-sm sm:text-base',
            )}
          >
            {text}
          </motion.p>
        ))}
      </div>

      <ul className="relative grid gap-3 sm:grid-cols-1">
        {content.corporate.bullets.map((bullet, index) => (
          <motion.li
            key={translate(bullet)}
            initial={reducedMotion ? false : { opacity: 0, x: -10 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.06, duration: 0.4 }}
            className="flex items-center gap-3 rounded-2xl border border-fe-border/70 bg-fe-surface/50 px-4 py-3 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-fe-accent/40 hover:shadow-[0_8px_28px_color-mix(in_srgb,var(--fe-accent)_12%,transparent)]"
          >
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-fe-accent/20 text-fe-accent ring-2 ring-fe-accent/30">
              {index === 0 ? (
                <Users className="size-4" />
              ) : index === 1 ? (
                <Building2 className="size-4" />
              ) : (
                <Sparkles className="size-4" />
              )}
            </span>
            <span className="text-sm font-medium text-fe-text sm:text-base">{translate(bullet)}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function CorporateQuoteForm() {
  const { translate } = useMarketingContent();
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      job_title: '',
      company: '',
      email: '',
      card_amount: '',
      message: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await submitContact({
        name: values.name,
        phone: values.phone,
        email: values.email,
        message: values.message || 'Corporate quote request',
        subject: 'corporate',
        metadata: {
          job_title: values.job_title,
          company: values.company,
          card_amount: values.card_amount,
        },
      });
      toast.success(
        translate({
          en: 'Quote request submitted — we will contact you soon.',
          bn: 'কোট অনুরোধ জমা হয়েছে — আমরা শীঘ্রই যোগাযোগ করব।',
        }),
      );
      form.reset();
      setSubmitted(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : translate({ en: 'Submission failed.', bn: 'জমা দেওয়া যায়নি।' }),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass = 'border-fe-border bg-fe-bg/60';

  if (submitted) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-3xl border border-fe-border/70 bg-gradient-to-br from-fe-surface/95 to-fe-bg/80 p-8 text-center backdrop-blur-sm">
        <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-fe-accent/20 text-fe-accent ring-2 ring-fe-accent/30">
          <Send className="size-6" />
        </div>
        <h3 className="text-xl font-bold text-fe-text">
          {translate({ en: 'Request received', bn: 'অনুরোধ গ্রহণ হয়েছে' })}
        </h3>
        <p className="mt-2 max-w-sm text-sm text-fe-muted">
          {translate({
            en: 'Our team will review your quote request and get back to you shortly.',
            bn: 'আমাদের টিম আপনার কোট অনুরোধ পর্যালোচনা করে শীঘ্রই যোগাযোগ করবে।',
          })}
        </p>
        <MarketingButton
          variant="outline"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          {translate({ en: 'Submit another', bn: 'আরেকটি জমা দিন' })}
        </MarketingButton>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      onSubmit={form.handleSubmit(onSubmit)}
      className="relative overflow-hidden rounded-3xl border border-fe-border/70 bg-gradient-to-br from-fe-surface/95 to-fe-bg/80 p-6 shadow-[0_24px_60px_-20px_color-mix(in_srgb,var(--fe-accent)_35%,transparent)] backdrop-blur-sm sm:p-8"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fe-accent/50 to-transparent"
        aria-hidden
      />
      <h3 className="mb-6 text-center text-lg font-semibold text-fe-text sm:text-xl">
        {translate({
          en: 'To Get a Quote Please fill out the Form',
          bn: 'কোট পেতে ফর্মটি পূরণ করুন',
        })}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="corp-name">{translate({ en: 'Full Name *', bn: 'পুরো নাম *' })}</Label>
          <Input
            id="corp-name"
            {...form.register('name')}
            className={cn(fieldClass, form.formState.errors.name && 'border-destructive')}
          />
          {form.formState.errors.name ? (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="corp-phone">{translate({ en: 'Mobile Number *', bn: 'মোবাইল নম্বর *' })}</Label>
          <Input
            id="corp-phone"
            placeholder="01XXXXXXXXX"
            {...form.register('phone')}
            className={cn(fieldClass, form.formState.errors.phone && 'border-destructive')}
          />
          {form.formState.errors.phone ? (
            <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="corp-job">{translate({ en: 'Job Title', bn: 'পদবি' })}</Label>
          <Input id="corp-job" {...form.register('job_title')} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="corp-company">{translate({ en: 'Company', bn: 'কোম্পানি' })}</Label>
          <Input id="corp-company" {...form.register('company')} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="corp-email">{translate({ en: 'Email', bn: 'ইমেইল' })}</Label>
          <Input
            id="corp-email"
            type="email"
            {...form.register('email')}
            className={cn(fieldClass, form.formState.errors.email && 'border-destructive')}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="corp-cards">{translate({ en: 'Cards Required', bn: 'প্রয়োজনীয় কার্ড' })}</Label>
          <Input id="corp-cards" {...form.register('card_amount')} className={fieldClass} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="corp-message">{translate({ en: 'Message', bn: 'মেসেজ' })}</Label>
          <Textarea id="corp-message" rows={3} {...form.register('message')} className={fieldClass} />
        </div>
      </div>
      <div className="mt-6 text-center">
        <MarketingButton
          type="submit"
          variant="solid"
          disabled={submitting}
          className="fe-corporate-cta min-w-[200px]"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {translate({ en: 'Submit', bn: 'জমা দিন' })}
        </MarketingButton>
      </div>
    </motion.form>
  );
}

export function CorporateForm({ variant = 'page' }: CorporateFormProps) {
  const isSection = variant === 'section';

  const inner = (
    <>
      {!isSection ? null : <CorporateHeading />}
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <CorporateCopy />
        <CorporateQuoteForm />
      </div>
    </>
  );

  if (isSection) {
    return (
      <SectionShell id="corporate" className="fe-corporate-section relative overflow-hidden">
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
        />
        <div className="relative">{inner}</div>
      </SectionShell>
    );
  }

  return (
    <section id="corporate" className="fe-corporate-section relative overflow-hidden py-16 md:py-24">
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
      />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">{inner}</div>
    </section>
  );
}
