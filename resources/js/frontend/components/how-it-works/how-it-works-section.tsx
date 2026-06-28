import { Box, CreditCard, Settings } from 'lucide-react';
import * as React from 'react';

import { SectionShell } from '@frontend/components/blocks/section-shell';
import { frontendAsset } from '@frontend/lib/brand';
import { SectionHeading } from '@frontend/components/ui/section-heading';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const stepIcons = [Box, CreditCard, Settings];

export function HowItWorksSection() {
  const { content, translate } = useMarketingContent();
  const steps = content.howItWorksSteps;
  const [active, setActive] = React.useState(steps[0]?.id ?? 'order');

  return (
    <SectionShell id="workVideo">
      <SectionHeading title={translate({ en: 'How it works', bn: 'কীভাবে কাজ করে' })} />
        <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="order-1 lg:col-span-3 lg:order-none">
            <video className="w-full rounded-2xl border border-fe-border" controls muted playsInline>
            <source src={frontendAsset('videos/workLast.webm')} type="video/webm" />
          </video>
        </div>
          <div className="order-2 lg:col-span-2">
            <Tabs value={active} onValueChange={setActive}>
              <TabsList className="fe-scrollbar-hide fe-touch grid h-auto w-full grid-cols-3 gap-1 overflow-x-auto bg-fe-surface p-1">
              {steps.map((step, i) => {
                const Icon = stepIcons[i] ?? Box;
                return (
                  <TabsTrigger
                    key={step.id}
                    value={step.id}
                    className="fe-touch flex min-h-16 flex-col gap-1 py-2.5 text-[11px] data-[state=active]:bg-fe-accent data-[state=active]:text-fe-bg sm:text-xs"
                  >
                    <Icon className="size-6" />
                    <span className="text-xs">{translate(step.label).split('. ')[1] ?? translate(step.label)}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {steps.map((step) => (
              <TabsContent key={step.id} value={step.id} className="mt-6 text-center text-fe-muted">
                {translate(step.content)}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </SectionShell>
  );
}
