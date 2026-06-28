import { securityItems } from '@frontend/constants/security-content';
import { MarketingCard } from '@frontend/components/ui/marketing-card';
import { MotionSection, StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';

export function SecurityGrid() {
  return (
    <MotionSection id="security" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading title="We Ensure your Security" />
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {securityItems.map((item) => (
            <StaggerItem key={item.title}>
              <MarketingCard className="h-full text-center">
                <img src={item.icon} alt="" className="mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-3 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-white/60">{item.description}</p>
              </MarketingCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </MotionSection>
  );
}
