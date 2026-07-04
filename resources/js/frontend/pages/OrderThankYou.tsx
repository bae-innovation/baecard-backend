import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle2, Heart, PhoneCall, Sparkles } from 'lucide-react';

import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingContent } from '@frontend/types/marketing-content';
import { formatPrice } from '@frontend/utils/format-price';
import { useAppSettings } from '@/hooks/useAppSettings';

import { MarketingButton } from '../components/ui/marketing-button';

type OrderSummary = {
  order_number: string;
  product_name: string;
  quantity: number;
  total: string | number;
  customer_name: string | null;
};

type OrderThankYouPageProps = {
  order: OrderSummary;
  marketing?: MarketingContent | null;
};

function OrderThankYouContent({ order }: { order: OrderSummary }) {
  const { translate } = useMarketingContent();
  const { currency_symbol } = useAppSettings();

  return (
    <section className="relative min-h-[70vh] overflow-hidden py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fe-accent/20 via-transparent to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/4 size-72 rounded-full bg-fe-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 size-72 rounded-full bg-fe-promo/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="overflow-hidden rounded-3xl border border-fe-border/80 bg-fe-surface/90 shadow-2xl shadow-fe-accent/5 backdrop-blur"
        >
          <div className="border-b border-fe-border/60 bg-gradient-to-r from-fe-accent/10 via-fe-surface to-fe-promo/10 px-6 py-10 text-center sm:px-10 sm:py-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
              className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-fe-accent/15 ring-4 ring-fe-accent/20"
            >
              <CheckCircle2 className="size-10 text-fe-accent" strokeWidth={1.5} />
            </motion.div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fe-accent/30 bg-fe-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-fe-accent">
              <Sparkles className="size-3.5" />
              {translate({ en: 'Order confirmed', bn: 'অর্ডার নিশ্চিত' })}
            </div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-fe-text sm:text-4xl">
              {translate({ en: 'Thank You!', bn: 'ধন্যবাদ!' })}
            </h1>
            {order.customer_name ? (
              <p className="mt-3 text-lg text-fe-muted">
                {translate({ en: 'Dear', bn: 'প্রিয়' })} {order.customer_name},
              </p>
            ) : null}
          </div>

          <div className="space-y-6 px-6 py-8 sm:px-10 sm:py-10">
            <div className="rounded-2xl border border-fe-border/70 bg-fe-surface/50 p-5 text-center">
              <p className="text-sm text-fe-muted">
                {translate({ en: 'Your order number', bn: 'আপনার অর্ডার নম্বর' })}
              </p>
              <p className="mt-1 font-mono text-xl font-bold tracking-wide text-fe-accent sm:text-2xl">
                {order.order_number}
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-fe-border/70 bg-fe-surface/30 p-5 text-sm sm:grid-cols-2">
              <div>
                <p className="text-fe-muted">{translate({ en: 'Product', bn: 'পণ্য' })}</p>
                <p className="mt-1 font-medium text-fe-text">{order.product_name}</p>
              </div>
              <div>
                <p className="text-fe-muted">{translate({ en: 'Quantity', bn: 'পরিমাণ' })}</p>
                <p className="mt-1 font-medium text-fe-text">{order.quantity}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-fe-muted">{translate({ en: 'Total', bn: 'মোট' })}</p>
                <p className="mt-1 text-lg font-bold text-fe-text">
                  {formatPrice(Number(order.total), currency_symbol)}
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-fe-accent/20 bg-fe-accent/5 p-5">
              <PhoneCall className="mt-0.5 size-5 shrink-0 text-fe-accent" />
              <div>
                <p className="font-semibold text-fe-text">
                  {translate({
                    en: 'We appreciate your trust',
                    bn: 'আপনার আস্থার জন্য ধন্যবাদ',
                  })}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fe-muted">
                  {translate({
                    en: 'One of our team members will contact you shortly to confirm your order and guide you through the next steps.',
                    bn: 'আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করে অর্ডার নিশ্চিত করবেন এবং পরবর্তী ধাপগুলো জানাবেন।',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-fe-muted">
              <Heart className="size-4 text-fe-promo" fill="currentColor" />
              <span>
                {translate({
                  en: 'Thank you for choosing BAE Card',
                  bn: 'BAE Card বেছে নেওয়ার জন্য ধন্যবাদ',
                })}
              </span>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
              <Link href="/">
                <MarketingButton variant="solid" className="w-full sm:w-auto">
                  {translate({ en: 'Back to Home', bn: 'হোমে ফিরুন' })}
                </MarketingButton>
              </Link>
              <Link href="/products">
                <MarketingButton variant="outline" className="w-full sm:w-auto">
                  {translate({ en: 'Continue Shopping', bn: 'আরও পণ্য দেখুন' })}
                </MarketingButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function OrderThankYou({ order, marketing }: OrderThankYouPageProps) {
  return (
    <FrontendLayout
      marketing={marketing}
      title="Thank You — BAE Card"
      showContactBlock={false}
    >
      <OrderThankYouContent order={order} />
    </FrontendLayout>
  );
}
