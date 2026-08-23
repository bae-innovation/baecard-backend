import { Link, usePage } from '@inertiajs/react';

import { OWNER_NAV_ITEMS } from '@/owner/config/owner-nav';
import { cn } from '@/lib/utils';

export function OwnerBottomNav() {
  const { url } = usePage();
  const pathname = url.split('?')[0];

  return (
    <nav
      className="sticky bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="App navigation"
    >
      <div className="flex w-full items-stretch justify-around px-1 pt-1">
        {OWNER_NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition-colors',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className={cn('size-5', active && 'text-primary')} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
