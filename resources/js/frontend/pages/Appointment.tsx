import { Link } from '@inertiajs/react';
import { CalendarCheck } from 'lucide-react';

import { AppointmentForm } from '@frontend/components/actions/appointment-form';
import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingContent } from '@frontend/types/marketing-content';

type AppointmentPageProps = {
  marketing?: MarketingContent | null;
};

function AppointmentPageContent() {
  const { translate } = useMarketingContent();

  return (
    <>
      <section className="border-b border-fe-border bg-fe-surface/50 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6">
          <nav
            className="mb-3 flex flex-wrap items-center gap-1 text-xs text-fe-muted sm:text-sm"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-fe-accent">
              {translate({ en: 'Home', bn: 'হোম' })}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-fe-text">
              {translate({ en: 'Book a Demo', bn: 'ডেমো বুক করুন' })}
            </span>
          </nav>
          <div className="flex items-start gap-3">
            <CalendarCheck className="mt-1 size-8 shrink-0 text-fe-accent sm:size-10" aria-hidden />
            <div>
              <h1 className="text-balance text-2xl font-bold tracking-tight text-fe-text sm:text-3xl md:text-4xl">
                {translate({ en: 'Book a Demo', bn: 'ডেমো বুক করুন' })}
              </h1>
              <p className="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-fe-muted sm:text-lg">
                {translate({
                  en: 'Fill in your details and we will confirm your appointment.',
                  bn: 'আপনার তথ্য দিন, আমরা অ্যাপয়েন্টমেন্ট নিশ্চিত করব।',
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-xl px-4 sm:px-5">
          <div className="rounded-2xl border border-fe-border bg-fe-surface p-6 sm:p-8">
            <AppointmentForm variant="page" />
          </div>
        </div>
      </section>
    </>
  );
}

export default function Appointment({ marketing }: AppointmentPageProps) {
  return (
    <FrontendLayout
      marketing={marketing}
      title="Book a Demo — BAE Card"
      showContactBlock={false}
    >
      <AppointmentPageContent />
    </FrontendLayout>
  );
}
