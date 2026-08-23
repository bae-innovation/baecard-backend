import { Link, router, usePage } from '@inertiajs/react';
import { CreditCard, LogOut, Menu } from 'lucide-react';
import * as React from 'react';

import {
  filterNavByPermissions,
  getDashboardNav,
} from '@/components/shared/sidebar/dashboard-nav-config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { resolveUserAvatarUrl } from '@/features/account/lib/user-avatar';
import { useAuth } from '@/hooks/useAuth';
import {
  dedupeNavLinksByUrl,
  flattenDashboardNav,
  groupNavLinks,
} from '@/owner/lib/flatten-dashboard-nav';
import { cn } from '@/lib/utils';

function userInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function OwnerMenuSheet() {
  const [open, setOpen] = React.useState(false);
  const { url } = usePage();
  const pathname = url.split('?')[0];
  const { user, hasAnyPermission } = useAuth();

  const menuGroups = React.useMemo(() => {
    const navMain = filterNavByPermissions(getDashboardNav(), hasAnyPermission);
    const links = dedupeNavLinksByUrl([
      {
        group: 'My card',
        title: 'My card',
        url: '/profile',
        icon: CreditCard,
      },
      ...flattenDashboardNav(navMain),
    ]);

    return groupNavLinks(links);
  }, [hasAnyPermission]);

  if (!user) {
    return null;
  }

  const initials = userInitials(user.name);
  const avatarUrl = resolveUserAvatarUrl(user);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9 shrink-0"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>
      <SheetContent side="left" className="flex w-[min(100%,280px)] flex-col gap-0 p-0 sm:max-w-xs">
        <SheetHeader className="space-y-0 border-b px-4 py-4 pr-12 text-left">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={avatarUrl} alt={user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <SheetTitle className="truncate text-base">{user.name}</SheetTitle>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <nav className="px-2 py-3" aria-label="Main menu">
            {menuGroups.map((section) => (
              <div key={section.group} className="mb-4 last:mb-0">
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.group}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active =
                      pathname === item.url ||
                      (item.url !== '/profile' && pathname.startsWith(item.url));
                    const Icon = item.icon;

                    return (
                      <li key={item.url}>
                        <Link
                          href={item.url}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            active
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground hover:bg-muted',
                          )}
                        >
                          {Icon ? (
                            <Icon className="size-4 shrink-0" aria-hidden />
                          ) : (
                            <span className="size-4 shrink-0" />
                          )}
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>

        <div className="border-t p-2">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
            onClick={() => {
              setOpen(false);
              router.post('/logout');
            }}
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
