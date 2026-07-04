import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

import { frontendAsset } from '@frontend/lib/brand';
import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { MotionSection } from '@frontend/components/ui/motion-section';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';

export function HeroSection() {
  const { content, translate } = useMarketingContent();

  return (
    <MotionSection id="mybanner" className="relative overflow-hidden">
      <div className="relative min-h-[40dvh] sm:min-h-[55vh] lg:min-h-[65vh]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={frontendAsset('videos/bannerText.webm')} type="video/webm" />
        </video>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-balance text-2xl font-bold leading-tight text-fe-text sm:text-4xl md:text-5xl">
            {translate(content.hero.title)}
          </h1>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-fe-muted sm:text-lg">
            {translate(content.hero.subtitle)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-8 flex w-full flex-col gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:justify-center"
        >
          <Link href="/appointment" className="w-full sm:w-auto">
            <MarketingButton size="lg" className="w-full sm:w-auto">
              {translate(content.hero.ctaPrimary)}
            </MarketingButton>
          </Link>
          <Link href="/appointment" className="w-full sm:w-auto">
            <MarketingButton size="lg" variant="solid" className="w-full sm:w-auto">
              {translate(content.hero.ctaSecondary)}
            </MarketingButton>
          </Link>
        </motion.div>
      </div>
    </MotionSection>
  );
}
