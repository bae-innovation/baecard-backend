import { Link } from '@inertiajs/react';

import { AppBrandLogo } from '@/components/shared/app-brand-logo';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAppSettings } from '@/hooks/useAppSettings';
import { cn } from '@/lib/utils';

export function TeamSwitcher() {
  const app = useAppSettings();
  const hasLogo = Boolean(
    app.admin_logo_url || app.logo_black_url || app.logo_white_url,
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          tooltip={app.name}
          className="justify-start group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!p-0"
          asChild
        >
          <Link
            href="/"
            className="flex w-full items-center justify-start gap-2 group-data-[collapsible=icon]:justify-center"
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg text-sm font-bold',
                hasLogo
                  ? 'bg-transparent'
                  : 'bg-primary text-primary-foreground',
              )}
            >
              <AppBrandLogo
                variant="sidebar"
                imageClassName="size-8"
                fallbackClassName="size-8 text-sm"
              />
            </span>
            <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
              {app.name}
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
