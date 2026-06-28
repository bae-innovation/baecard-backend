import { Calendar, MessageSquare, Package } from 'lucide-react';

import { useActionHub } from '@frontend/hooks/use-action-hub';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { cn } from '@/lib/utils';

export function MobileActionBar() {
  const { openHub, tab, open } = useActionHub();
  const { translate } = useMarketingContent();

  const items = [
    { tab: 'order' as const, icon: Package, label: translate({ en: 'Order', bn: 'অর্ডার' }) },
    { tab: 'message' as const, icon: MessageSquare, label: translate({ en: 'Message', bn: 'মেসেজ' }) },
    { tab: 'appointment' as const, icon: Calendar, label: translate({ en: 'Book', bn: 'বুক' }) },
  ];

  return (
    <div
      className="fe-mobile-tab-bar fixed inset-x-0 bottom-0 z-40 border-t border-fe-border bg-fe-nav/95 backdrop-blur-lg md:hidden"
      role="navigation"
      aria-label="Quick actions"
    >
      <div className="grid grid-cols-3">
        {items.map(({ tab: itemTab, icon: Icon, label }) => {
          const active = open && tab === itemTab;
          return (
            <button
              key={itemTab}
              type="button"
              onClick={() => openHub(itemTab)}
              className={cn(
                'fe-touch flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 px-2 py-2 text-[11px] font-medium transition-colors active:scale-95',
                active ? 'text-fe-accent' : 'text-fe-muted active:text-fe-accent',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cn('size-5', active && 'scale-110')} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
