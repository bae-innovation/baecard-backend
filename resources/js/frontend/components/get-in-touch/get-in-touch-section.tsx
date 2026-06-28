import { Calendar, MessageSquare, Package } from 'lucide-react';
import { motion } from 'framer-motion';

import { useActionHub } from '@frontend/hooks/use-action-hub';
import { MarketingCard } from '@frontend/components/ui/marketing-card';
import { MotionSection, StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';

const items = [
  {
    tab: 'order' as const,
    icon: Package,
    title: 'Order a BAE Card',
    description: 'Choose your card and we will call you to confirm.',
  },
  {
    tab: 'message' as const,
    icon: MessageSquare,
    title: 'Send us a Message',
    description: 'Questions? Reach out and our team will respond quickly.',
  },
  {
    tab: 'appointment' as const,
    icon: Calendar,
    title: 'Book an Appointment',
    description: 'Schedule a demo or consultation at your convenience.',
  },
];

export function GetInTouchSection() {
  const { openHub } = useActionHub();

  return (
    <MotionSection id="get-in-touch" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading title="Get in Touch" subtitle="We are here to help" />
        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <StaggerItem key={item.tab}>
              <motion.button
                type="button"
                onClick={() => openHub(item.tab)}
                className="w-full text-left"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <MarketingCard glow className="h-full cursor-pointer">
                  <item.icon className="mb-4 size-10 text-[#66FCF1]" />
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-white/60">{item.description}</p>
                </MarketingCard>
              </motion.button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </MotionSection>
  );
}
