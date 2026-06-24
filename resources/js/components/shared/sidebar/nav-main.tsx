import { Link } from '@inertiajs/react';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

function NavUnseenIndicator({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <span
      className={cn('flex shrink-0 items-center gap-1.5', className)}
      aria-label={`${count} unseen`}
    >
      <span className="flex h-2 w-2 rounded-full bg-red-500" aria-hidden />
      <span className="min-w-[1ch] text-xs font-semibold tabular-nums text-red-600">
        {count}
      </span>
    </span>
  );
}

// Recursive type for nested navigation items
export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  badge?: number;
  /** Show when the user has any of these abilities. Omit to always show. */
  requiredAbilities?: readonly string[];
  /** Always show in the sidebar regardless of abilities. */
  alwaysVisible?: boolean;
  /** Show a dot when this template is active. */
  activeIndicator?: boolean;
  items?: ReadonlyArray<NavItem>;
};

// Recursive component for rendering nested sub-items
function NavSubItem({ subItem }: { subItem: NavItem }) {
  // If the subItem has its own items, render it as a collapsible
  if (subItem.items && subItem.items.length > 0) {
    return (
      <SidebarMenuSubItem>
        <Collapsible
          defaultOpen={subItem.isActive}
          className="group/collapsible-nested"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton>
              {subItem.icon && <subItem.icon />}
              <span className="min-w-0 flex-1 truncate">{subItem.title}</span>
              <span className="ml-auto flex shrink-0 items-center gap-1.5">
                {subItem.badge ? (
                  <NavUnseenIndicator count={subItem.badge} />
                ) : null}
                <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible-nested:rotate-90" />
              </span>
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {subItem.items.map((nestedItem) => (
                <SidebarMenuSubItem key={nestedItem.title}>
                  <SidebarMenuSubButton asChild>
                    <Link
                      href={nestedItem.url}
                      className="flex w-full min-w-0 items-center gap-2"
                    >
                      {nestedItem.icon && <nestedItem.icon />}
                      <span className="min-w-0 flex-1 truncate">
                        {nestedItem.title}
                      </span>
                      {nestedItem.badge ? (
                        <NavUnseenIndicator
                          count={nestedItem.badge}
                          className="shrink-0"
                        />
                      ) : null}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuSubItem>
    );
  }

  // Otherwise, render it as a simple link
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <Link
          href={subItem.url}
          className="flex w-full min-w-0 items-center gap-2"
        >
          {subItem.icon && <subItem.icon />}
          <span className="min-w-0 flex-1 truncate">{subItem.title}</span>
          {subItem.activeIndicator ? (
            <span className="size-2 shrink-0 rounded-full bg-emerald-500" aria-label="Active template" />
          ) : null}
          {subItem.badge ? (
            <NavUnseenIndicator count={subItem.badge} className="shrink-0" />
          ) : null}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export function NavMain({ items }: { items: ReadonlyArray<NavItem> }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-1.5">
                    {item.badge ? (
                      <NavUnseenIndicator count={item.badge} />
                    ) : null}
                    <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <NavSubItem key={subItem.title} subItem={subItem} />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
