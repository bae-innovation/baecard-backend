import {
  filterNavByPermissions,
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
  const { hasAnyPermission, user } = useAuth();
  const navMain = filterNavByPermissions(getDashboardNav(user?.active_template), hasAnyPermission);

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
