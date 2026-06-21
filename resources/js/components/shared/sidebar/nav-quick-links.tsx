import { Folder, Forward, MoreHorizontal, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type QuickLinkItem = {
  name: string;
  url: string;
  icon: LucideIcon;
  deprecated?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
  /** When true, `<a>` uses target="_blank" and rel security attrs */
  openInNewTab?: boolean;
};

export function NavQuickLinks({
  quickLinks,
}: {
  quickLinks: ReadonlyArray<QuickLinkItem>;
}) {
  const { isMobile } = useSidebar();

  return (
    <TooltipProvider delayDuration={300}>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
        <SidebarMenu>
          {quickLinks.map((item) =>
            item.disabled ? (
              <SidebarMenuItem key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block w-full">
                      <SidebarMenuButton
                        disabled
                        aria-disabled="true"
                        className={cn(
                          item.deprecated &&
                            'text-muted-foreground opacity-60 hover:text-muted-foreground/80 [&>span]:line-through [&>svg]:text-orange-500/60',
                        )}
                      >
                        <item.icon />
                        <span className="flex-1">{item.name}</span>
                      </SidebarMenuButton>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side={isMobile ? 'bottom' : 'right'}>
                    {item.disabledTooltip ?? 'Log in to open this link'}
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    item.deprecated &&
                      'text-muted-foreground opacity-60 hover:text-muted-foreground/80 [&>a>span]:line-through [&>a>svg]:text-orange-500/60',
                  )}
                >
                  <a
                    href={item.url}
                    {...(item.openInNewTab
                      ? {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          'aria-label': `${item.name} (opens in new tab)`,
                        }
                      : {})}
                  >
                    <item.icon />
                    <span className="flex-1">{item.name}</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>Open Link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ),
          )}
        </SidebarMenu>
      </SidebarGroup>
    </TooltipProvider>
  );
}
