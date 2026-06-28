import { motion } from 'framer-motion';

import { useActionHub } from '@frontend/hooks/use-action-hub';
import { scrollToSection } from '@frontend/hooks/use-scroll-to-section';
import { frontendAsset } from '@frontend/lib/brand';
import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { MotionSection } from '@frontend/components/ui/motion-section';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';

export function HeroSection() {
  const { openHub } = useActionHub();
  const { content, translate } = useMarketingContent();

  return (
    <MotionSection id="mybanner" className="relative overflow-hidden">
      <div className="relative min-h-[52dvh] sm:min-h-[70vh] lg:min-h-[87vh]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={frontendAsset('videos/bannerText.webm')} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-fe-bg via-fe-bg/50 to-fe-bg/10" />
        <div className="relative z-10 flex min-h-[52dvh] flex-col items-center justify-end px-4 pb-8 pt-16 sm:min-h-[70vh] sm:pb-16 lg:min-h-[87vh]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 w-full max-w-3xl text-center"
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
            className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
          >
            <MarketingButton size="lg" className="w-full sm:w-auto" onClick={() => scrollToSection('products')}>
              {translate(content.hero.ctaPrimary)}
            </MarketingButton>
            <MarketingButton
              size="lg"
              variant="solid"
              className="w-full sm:w-auto"
              onClick={() => openHub('appointment')}
            >
              {translate(content.hero.ctaSecondary)}
            </MarketingButton>
          </motion.div>
        </div>
      </div>
    </MotionSection>
  );
}
