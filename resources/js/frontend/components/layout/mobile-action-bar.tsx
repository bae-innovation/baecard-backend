import { Calendar, Home, MessageCircle, ShoppingBag } from 'lucide-react';

import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { useAppSettings } from '@/hooks/useAppSettings';
import { cn } from '@/lib/utils';

export function MobileActionBar() {
  const { translate } = useMarketingContent();
  const app = useAppSettings();

  const whatsappNumber = app.whatsapp ?? app.support_phone;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`
    : null;

  const items: { key: string; icon: typeof Home; label: string; href: string; external?: boolean }[] = [];

  items.push({
    key: 'home',
    icon: Home,
    label: translate({ en: 'Home', bn: 'হোম' }),
    href: '/',
  });

  items.push({
    key: 'products',
    icon: ShoppingBag,
    label: translate({ en: 'Products', bn: 'পণ্য' }),
    href: '/products',
  });

  if (whatsappHref) {
    items.push({
      key: 'whatsapp',
      icon: MessageCircle,
      label: translate({ en: 'WhatsApp', bn: 'হোয়াটসঅ্যাপ' }),
      href: whatsappHref,
      external: true,
    });
  }

  items.push({
    key: 'appointment',
    icon: Calendar,
    label: translate({ en: 'Book', bn: 'বুক' }),
    href: '/appointment',
  });

  return (
    <div
      className="fe-mobile-tab-bar fixed inset-x-0 bottom-0 z-40 border-t border-fe-border bg-fe-nav/95 backdrop-blur-lg md:hidden"
      role="navigation"
      aria-label="Quick actions"
    >
      <div className="grid grid-cols-4">
        {items.map(({ key, icon: Icon, label, href, external }) =>
          external ? (
            <a
              key={key}
              href={href!}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'fe-touch flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors active:scale-95',
                'text-fe-muted active:text-fe-accent',
              )}
            >
              <Icon className="size-5" strokeWidth={2} />
              <span className="truncate max-w-full">{label}</span>
            </a>
          ) : (
            <a
              key={key}
              href={href}
              className={cn(
                'fe-touch flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors active:scale-95',
                'text-fe-muted active:text-fe-accent',
              )}
            >
              <Icon className="size-5" strokeWidth={2} />
              <span className="truncate max-w-full">{label}</span>
            </a>
          ),
        )}
      </div>
    </div>
  );
}