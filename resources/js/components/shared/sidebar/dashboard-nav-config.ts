import type { NavItem } from '@/components/shared/sidebar/nav-main';
import { DASHBOARD_ACCESS_PERMISSIONS } from '@/lib/permissions';
import {
  BarChart3,
  Briefcase,
  Calendar,
  CreditCard,
  Globe,
  KeyRound,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  MessageSquare,
  Package,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  User,
  UserCog,
  UserRound,
} from 'lucide-react';

const buildTemplateNav = (activeTemplate?: number): NavItem[] => [
  {
    title: 'Classic Light',
    url: '/profile/templates/1',
    icon: LayoutTemplate,
    activeIndicator: activeTemplate === 1,
    requiredPermissions: ['profile.template.manage'],
  },
  {
    title: 'Classic Dark',
    url: '/profile/templates/2',
    icon: LayoutTemplate,
    activeIndicator: activeTemplate === 2,
    requiredPermissions: ['profile.template.manage'],
  },
  {
    title: 'Modern Light',
    url: '/profile/templates/3',
    icon: LayoutTemplate,
    activeIndicator: activeTemplate === 3,
    requiredPermissions: ['profile.template.manage'],
  },
  {
    title: 'Modern Dark',
    url: '/profile/templates/4',
    icon: LayoutTemplate,
    activeIndicator: activeTemplate === 4,
    requiredPermissions: ['profile.template.manage'],
  },
];

const TEMPLATE_NAV: NavItem[] = [
  {
    title: 'Dashboard',
    url: '.',
    icon: LayoutDashboard,
    isActive: true,
    requiredPermissions: [...DASHBOARD_ACCESS_PERMISSIONS],
    items: [
      {
        title: 'Analytics',
        url: '/dashboard',
        icon: BarChart3,
        requiredPermissions: [...DASHBOARD_ACCESS_PERMISSIONS],
      },
    ],
  },
  {
    title: 'Access Control',
    url: '.',
    icon: Shield,
    isActive: true,
    requiredPermissions: ['rbac.role.view', 'rbac.user.view', 'rbac.permission.view'],
    items: [
      {
        title: 'Permissions',
        url: '/access-control/permissions',
        icon: KeyRound,
        requiredPermissions: ['rbac.permission.view'],
      },
      {
        title: 'Roles',
        url: '/access-control/roles',
        icon: ShieldCheck,
        requiredPermissions: ['rbac.role.view', 'rbac.*'],
      },
      {
        title: 'Users',
        url: '/access-control/users',
        icon: UserCog,
        requiredPermissions: ['rbac.user.view'],
      },
    ],
  },
  {
    title: 'Customer Management',
    url: '.',
    icon: UserRound,
    requiredPermissions: ['customer.customer.view'],
    items: [
      {
        title: 'Customers',
        url: '/customers',
        icon: UserRound,
        requiredPermissions: ['customer.customer.view'],
      },
    ],
  },
  {
    title: 'Products',
    url: '.',
    icon: Package,
    requiredPermissions: ['product.product.view'],
    items: [
      {
        title: 'Products',
        url: '/admin/products',
        icon: Package,
        requiredPermissions: ['product.product.view'],
      },
    ],
  },
  {
    title: 'Vendors',
    url: '.',
    icon: Store,
    requiredPermissions: ['vendor.vendor.view'],
    items: [
      {
        title: 'Vendors',
        url: '/vendors',
        icon: Store,
        requiredPermissions: ['vendor.vendor.view'],
      },
    ],
  },
  {
    title: 'Orders',
    url: '.',
    icon: ShoppingCart,
    requiredPermissions: ['order.order.view'],
    items: [
      {
        title: 'Order List',
        url: '/orders',
        icon: ShoppingCart,
        requiredPermissions: ['order.order.view'],
      },
    ],
  },
  {
    title: 'Card Management',
    url: '.',
    icon: CreditCard,
    requiredPermissions: ['card.card.view'],
    items: [
      {
        title: 'Cards',
        url: '/cards',
        icon: CreditCard,
        requiredPermissions: ['card.card.view'],
      },
    ],
  },
  {
    title: 'Appointments',
    url: '.',
    icon: Calendar,
    requiredPermissions: ['appointment.appointment.view', 'appointment.appointment.view_own'],
    items: [
      {
        title: 'Appointments',
        url: '/appointments',
        icon: Calendar,
        requiredPermissions: ['appointment.appointment.view', 'appointment.appointment.view_own'],
      },
    ],
  },
  {
    title: 'Contacts',
    url: '.',
    icon: MessageSquare,
    requiredPermissions: ['contact.contact.view', 'contact.contact.view_own'],
    items: [
      {
        title: 'Contact Messages',
        url: '/contacts',
        icon: MessageSquare,
        requiredPermissions: ['contact.contact.view', 'contact.contact.view_own'],
      },
    ],
  },
  {
    title: 'Reviews',
    url: '.',
    icon: Star,
    requiredPermissions: ['review.review.view', 'review.review.view_own'],
    items: [
      {
        title: 'Reviews',
        url: '/reviews',
        icon: Star,
        requiredPermissions: ['review.review.view', 'review.review.view_own'],
      },
    ],
  },
  {
    title: 'Profile Management',
    url: '.',
    icon: UserRound,
    requiredPermissions: ['profile.social.manage', 'profile.service.manage', 'profile.template.manage'],
    items: [
      {
        title: 'Social Links',
        url: '/profile/social',
        icon: Share2,
        requiredPermissions: ['profile.social.manage'],
      },
      {
        title: 'My Services',
        url: '/profile/services',
        icon: Briefcase,
        requiredPermissions: ['profile.service.manage'],
      },
    ],
  },
  {
    title: 'Template Management',
    url: '.',
    icon: LayoutTemplate,
    requiredPermissions: ['profile.template.manage'],
    items: buildTemplateNav(),
  },
  {
    title: 'Website CMS',
    url: '.',
    icon: Globe,
    requiredPermissions: ['cms.section.view', 'cms.offer_ticker.view', 'cms.site_social.view'],
    items: [
      {
        title: 'CMS Sections',
        url: '/admin/cms/index',
        icon: Globe,
        requiredPermissions: ['cms.section.view'],
      },
      {
        title: 'Offer Ticker',
        url: '/admin/offer-tickers',
        icon: Megaphone,
        requiredPermissions: ['cms.offer_ticker.view'],
      },
      {
        title: 'Social Management',
        url: '/admin/site-social',
        icon: Share2,
        requiredPermissions: ['cms.site_social.view'],
      },
    ],
  },
  {
    title: 'Settings',
    url: '.',
    icon: Settings,
    requiredPermissions: ['settings.general.manage'],
    items: [
      {
        title: 'General',
        url: '/settings/general',
        icon: Globe,
        requiredPermissions: ['settings.general.manage'],
      },
    ],
  },
  {
    title: 'Appearance',
    url: '.',
    icon: Sparkles,
    alwaysVisible: true,
    items: [
      {
        title: 'Appearance',
        url: '/settings/appearance',
        icon: Sparkles,
        alwaysVisible: true,
      },
    ],
  },
  {
    title: 'My Account',
    url: '.',
    icon: User,
    alwaysVisible: true,
    items: [
      {
        title: 'My Account',
        url: '/user/account',
        icon: User,
        alwaysVisible: true,
      },
    ],
  },
];

export function getDashboardNav(activeTemplate?: number): NavItem[] {
  return TEMPLATE_NAV.map((item) =>
    item.title === 'Template Management'
      ? { ...item, items: buildTemplateNav(activeTemplate) }
      : item,
  );
}

export function filterNavByPermissions(
  items: ReadonlyArray<NavItem>,
  hasAnyPermission: (permissions: readonly string[]) => boolean,
): NavItem[] {
  return items
    .map((item) => {
      const filteredChildren = item.items
        ? filterNavByPermissions(item.items, hasAnyPermission)
        : undefined;

      const required =
        item.requiredPermissions ?? item.requiredAbilities ?? [];

      if (!item.alwaysVisible) {
        if (required.length > 0 && !hasAnyPermission(required)) {
          return null;
        }

        if (filteredChildren && filteredChildren.length === 0) {
          return null;
        }
      }

      return {
        ...item,
        items: filteredChildren,
      };
    })
    .filter((item): item is NavItem => item !== null);
}

/** @deprecated Use filterNavByPermissions */
export const filterNavByAbilities = filterNavByPermissions;
