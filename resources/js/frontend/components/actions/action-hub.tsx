import { Calendar, MessageSquare } from 'lucide-react';

import { useActionHub } from '@frontend/hooks/use-action-hub';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { ActionHubTab, MarketingProduct } from '@frontend/types/marketing';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AppointmentForm } from './appointment-form';
import { MessageForm } from './message-form';

type ActionHubProps = {
  products: MarketingProduct[];
};

export function ActionHub({ products: _products }: ActionHubProps) {
  const { open, tab, closeHub, setTab } = useActionHub();
  const { translate } = useMarketingContent();

  return (
    <Drawer open={open} onOpenChange={(v) => !v && closeHub()}>
      <DrawerContent className="max-h-[92dvh] border-fe-border bg-fe-surface text-fe-text">
        <DrawerHeader className="shrink-0 text-left">
          <DrawerTitle className="text-fe-text">
            {translate({ en: 'How can we help?', bn: 'কীভাবে সাহায্য করতে পারি?' })}
          </DrawerTitle>
          <DrawerDescription className="text-fe-muted">
          {translate({
            en: 'Send a message or book an appointment.',
            bn: 'মেসেজ বা অ্যাপয়েন্টমেন্ট বুক করুন।',
          })}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex max-h-[calc(92dvh-7rem)] flex-col overflow-hidden px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as ActionHubTab)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <TabsList className="fe-touch grid h-auto w-full shrink-0 grid-cols-2 gap-1 bg-fe-border/30 p-1">
              <TabsTrigger
                value="message"
                className="fe-touch min-h-11 gap-1 text-xs sm:text-sm data-[state=active]:bg-fe-accent data-[state=active]:text-fe-bg"
              >
                <MessageSquare className="size-4 shrink-0" />
                {translate({ en: 'Message', bn: 'মেসেজ' })}
              </TabsTrigger>
              <TabsTrigger
                value="appointment"
                className="fe-touch min-h-11 gap-1 text-xs sm:text-sm data-[state=active]:bg-fe-accent data-[state=active]:text-fe-bg"
              >
                <Calendar className="size-4 shrink-0" />
                {translate({ en: 'Book', bn: 'বুক' })}
              </TabsTrigger>
            </TabsList>
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-2">
              <TabsContent value="message" className="mt-0">
                <MessageForm />
              </TabsContent>
              <TabsContent value="appointment" className="mt-0">
                <AppointmentForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
