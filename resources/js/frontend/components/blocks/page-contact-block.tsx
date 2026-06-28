import { Link } from '@inertiajs/react';
import { Mail, MessageCircle, Phone } from 'lucide-react';

import { MessageForm } from '@frontend/components/actions/message-form';
import { AppointmentForm } from '@frontend/components/actions/appointment-form';
import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { useActionHub } from '@frontend/hooks/use-action-hub';
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

export function PageContactBlock({ variant, className }: PageContactBlockProps) {
  const { translate } = useMarketingContent();
  const { openHub } = useActionHub();
  const app = useAppSettings();

  const whatsapp = app.whatsapp ?? app.support_phone;
  const phone = app.support_phone;
  const email = app.contact_email;

  if (variant === 'contact') {
    return (
      <section className={cn('border-t border-fe-border bg-fe-surface/30 py-12 sm:py-16', className)}>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:gap-10 sm:px-5 md:px-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <h2 className="text-2xl font-bold text-fe-text">
              {translate({ en: 'Contact Us', bn: 'যোগাযোগ' })}
            </h2>
            {phone ? (
              <a href={`tel:${phone}`} className="flex items-center gap-2 text-fe-muted hover:text-fe-accent">
                <Phone className="size-4" /> {phone}
              </a>
            ) : null}
            {email ? (
              <a href={`mailto:${email}`} className="flex items-center gap-2 text-fe-muted hover:text-fe-accent">
                <Mail className="size-4" /> {email}
              </a>
            ) : null}
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-fe-muted hover:text-fe-accent"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            ) : null}
          </div>
          <div className="rounded-2xl border border-fe-border bg-fe-surface p-6">
            <h3 className="mb-4 font-semibold text-fe-text">
              {translate({ en: 'Send a message', bn: 'মেসেজ পাঠান' })}
            </h3>
            <MessageForm />
          </div>
          <div className="rounded-2xl border border-fe-border bg-fe-surface p-6">
            <h3 className="mb-4 font-semibold text-fe-text">
              {translate({ en: 'Book appointment', bn: 'অ্যাপয়েন্টমেন্ট' })}
            </h3>
            <AppointmentForm />
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'home') {
    return (
      <section className={cn('py-12', className)}>
        <div className="mx-auto flex max-w-4xl flex-col items-stretch gap-4 rounded-2xl border border-fe-border bg-gradient-to-br from-fe-surface to-fe-bg p-5 text-center sm:flex-row sm:items-center sm:justify-between sm:p-8 sm:text-left">
          <div>
            <h2 className="text-xl font-bold text-fe-text">
              {translate({ en: 'Ready to connect smarter?', bn: 'স্মার্টভাবে সংযোগ করতে প্রস্তুত?' })}
            </h2>
            <p className="mt-1 text-fe-muted">
              {translate({ en: 'Order your card or book a demo today.', bn: 'আজই অর্ডার করুন বা ডেমো বুক করুন।' })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {whatsapp ? (
              <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                <MarketingButton variant="solid">WhatsApp</MarketingButton>
              </a>
            ) : null}
            <MarketingButton variant="outline" onClick={() => openHub('appointment')}>
              {translate({ en: 'Book a Demo', bn: 'ডেমো বুক' })}
            </MarketingButton>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'products') {
    return (
      <section className={cn('border-y border-fe-border bg-fe-accent/5 py-8', className)}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 md:px-6">
          <p className="font-medium text-fe-text">
            {translate({ en: 'Found the perfect card?', bn: 'পছন্দের কার্ড পেয়েছেন?' })}
          </p>
          <MarketingButton onClick={() => openHub('order')}>
            {translate({ en: 'Order Now', bn: 'অর্ডার করুন' })}
          </MarketingButton>
        </div>
      </section>
    );
  }

  if (variant === 'corporate') {
    return (
      <section className={cn('py-8', className)}>
        <div className="mx-auto max-w-3xl rounded-2xl border border-fe-border bg-fe-surface p-6 text-center">
          <p className="text-fe-muted">
            {translate({ en: 'Scroll down to submit your corporate inquiry.', bn: 'কর্পোরেট ইনকোয়ারি জমা দিতে নিচে স্ক্রল করুন।' })}
          </p>
        </div>
      </section>
    );
  }

  if (variant === 'security') {
    return (
      <section className={cn('py-8 text-center', className)}>
        <p className="text-fe-muted">
          {translate({ en: 'Questions about security?', bn: 'নিরাপত্তা নিয়ে প্রশ্ন?' })}
        </p>
        <MarketingButton className="mt-3" variant="ghost" onClick={() => openHub('message')}>
          {translate({ en: 'Talk to us', bn: 'কথা বলুন' })}
        </MarketingButton>
      </section>
    );
  }

  if (variant === 'faq') {
    return (
      <section className={cn('py-10 text-center', className)}>
        <p className="mb-3 text-fe-muted">
          {translate({ en: 'Still have questions?', bn: 'এখনও প্রশ্ন আছে?' })}
        </p>
        <Link href="/contact">
          <MarketingButton variant="outline">
            {translate({ en: 'Contact us', bn: 'যোগাযোগ করুন' })}
          </MarketingButton>
        </Link>
      </section>
    );
  }

  if (variant === 'about') {
    return (
      <section className={cn('py-10', className)}>
        <div className="mx-auto max-w-xl rounded-2xl border border-fe-border bg-fe-surface p-6 text-center">
          <h3 className="font-semibold text-fe-text">
            {translate({ en: 'Need support?', bn: 'সাহায্য দরকার?' })}
          </h3>
          {email ? (
            <a href={`mailto:${email}`} className="mt-2 block text-fe-accent hover:underline">
              {email}
            </a>
          ) : null}
          {phone ? <p className="mt-1 text-fe-muted">{phone}</p> : null}
        </div>
      </section>
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
