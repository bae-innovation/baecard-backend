import {
  filterNavByAbilities,
  getDashboardNav,
} from '@/components/shared/sidebar/dashboard-nav-config';
import { NavMain } from '@/components/shared/sidebar/nav-main';
import { NavUser } from '@/components/shared/sidebar/nav-user';
import { TeamSwitcher } from '@/components/shared/sidebar/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { hasAnyAbility, user } = useAuth();
  const navMain = filterNavByAbilities(getDashboardNav(user?.active_template), hasAnyAbility);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
