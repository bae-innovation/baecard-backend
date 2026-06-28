import { useMarketingContent } from '@frontend/providers/marketing-content-provider';

import { SectionShell } from './section-shell';

export function TrustLogosBlock() {
  const { translate } = useMarketingContent();

  const logos = ['Active2.svg', 'Design2.svg', 'Order2.svg', 'Profile2.svg', 'Share2.svg'];

  return (
    <SectionShell className="py-12">
      <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.2em] text-fe-muted">
        {translate({ en: 'As trusted by', bn: 'যাদের বিশ্বাস' })}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 grayscale transition-opacity hover:opacity-100 hover:grayscale-0">
        {logos.map((logo) => (
          <img
            key={logo}
            src={`/frontend/${logo}`}
            alt=""
            className="h-10 w-auto"
            aria-hidden
          />
        ))}
      </div>
    </SectionShell>
  );
}
