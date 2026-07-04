import type { NavItem } from '@/components/shared/sidebar/nav-main';
import {
  Briefcase,
  Calendar,
  CreditCard,
  Globe,
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
    requiredAbilities: ['profile.manage'],
  },
  {
    title: 'Classic Dark',
    url: '/profile/templates/2',
    icon: LayoutTemplate,
    activeIndicator: activeTemplate === 2,
    requiredAbilities: ['profile.manage'],
  },
  {
    title: 'Modern Light',
    url: '/profile/templates/3',
    icon: LayoutTemplate,
    activeIndicator: activeTemplate === 3,
    requiredAbilities: ['profile.manage'],
  },
  {
    title: 'Modern Dark',
    url: '/profile/templates/4',
    icon: LayoutTemplate,
    activeIndicator: activeTemplate === 4,
    requiredAbilities: ['profile.manage'],
  },
];

const TEMPLATE_NAV: NavItem[] = [
  {
    title: 'Access Control',
    url: '.',
    icon: Shield,
    isActive: true,
    requiredAbilities: ['users.view', 'roles.manage'],
    items: [
      {
        title: 'Roles',
        url: '/access-control/roles',
        icon: ShieldCheck,
        requiredAbilities: ['roles.manage'],
      },
      {
        title: 'Users',
        url: '/access-control/users',
        icon: UserCog,
        requiredAbilities: ['users.view'],
      },
    ],
  },
  {
    title: 'Customer Management',
    url: '.',
    icon: UserRound,
    requiredAbilities: ['users.view'],
    items: [
      {
        title: 'Customers',
        url: '/customers',
        icon: UserRound,
        requiredAbilities: ['users.view'],
      },
    ],
  },
  {
    title: 'Products',
    url: '.',
    icon: Package,
    requiredAbilities: ['products.view'],
    items: [
      {
        title: 'Products',
        url: '/admin/products',
        icon: Package,
        requiredAbilities: ['products.view'],
      },
    ],
  },
  {
    title: 'Vendors',
    url: '.',
    icon: Store,
    requiredAbilities: ['vendors.view'],
    items: [
      {
        title: 'Vendors',
        url: '/vendors',
        icon: Store,
        requiredAbilities: ['vendors.view'],
      },
    ],
  },
  {
    title: 'Orders',
    url: '.',
    icon: ShoppingCart,
    requiredAbilities: ['orders.view'],
    items: [
      {
        title: 'Order List',
        url: '/orders',
        icon: ShoppingCart,
        requiredAbilities: ['orders.view'],
      },
    ],
  },
  {
    title: 'Card Management',
    url: '.',
    icon: CreditCard,
    requiredAbilities: ['dashboard.card.view'],
    items: [
      {
        title: 'Cards',
        url: '/cards',
        icon: CreditCard,
        requiredAbilities: ['dashboard.card.view'],
      },
    ],
  },
  {
    title: 'Appointments',
    url: '.',
    icon: Calendar,
    requiredAbilities: ['appointments.view', 'appointments.view_own'],
    items: [
      {
        title: 'Appointments',
        url: '/appointments',
        icon: Calendar,
        requiredAbilities: ['appointments.view', 'appointments.view_own'],
      },
    ],
  },
  {
    title: 'Contacts',
    url: '.',
    icon: MessageSquare,
    requiredAbilities: ['contacts.view', 'contacts.view_own'],
    items: [
      {
        title: 'Contact Messages',
        url: '/contacts',
        icon: MessageSquare,
        requiredAbilities: ['contacts.view', 'contacts.view_own'],
      },
    ],
  },
  {
    title: 'Reviews',
    url: '.',
    icon: Star,
    requiredAbilities: ['reviews.view', 'reviews.view_own'],
    items: [
      {
        title: 'Reviews',
        url: '/reviews',
        icon: Star,
        requiredAbilities: ['reviews.view', 'reviews.view_own'],
      },
    ],
  },
  {
    title: 'Profile Management',
    url: '.',
    icon: UserRound,
    requiredAbilities: ['profile.manage'],
    items: [
      {
        title: 'Social Links',
        url: '/profile/social',
        icon: Share2,
        requiredAbilities: ['profile.manage'],
      },
      {
        title: 'My Services',
        url: '/profile/services',
        icon: Briefcase,
        requiredAbilities: ['profile.manage'],
      },
    ],
  },
  {
    title: 'Template Management',
    url: '.',
    icon: LayoutTemplate,
    requiredAbilities: ['profile.manage'],
    items: buildTemplateNav(),
  },
  {
    title: 'Website CMS',
    url: '.',
    icon: Globe,
    requiredAbilities: ['cms.view', 'offer_tickers.view', 'site_social.view'],
    items: [
      {
        title: 'CMS Sections',
        url: '/admin/cms/index',
        icon: Globe,
        requiredAbilities: ['cms.view'],
      },
      {
        title: 'Offer Ticker',
        url: '/admin/offer-tickers',
        icon: Megaphone,
        requiredAbilities: ['offer_tickers.view'],
      },
      {
        title: 'Social Management',
        url: '/admin/site-social',
        icon: Share2,
        requiredAbilities: ['site_social.view'],
      },
    ],
  },
  {
    title: 'Settings',
    url: '.',
    icon: Settings,
    requiredAbilities: ['settings.manage'],
    items: [
      {
        title: 'General',
        url: '/settings/general',
        icon: Globe,
        requiredAbilities: ['settings.manage'],
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

export function filterNavByAbilities(
  items: ReadonlyArray<NavItem>,
  hasAnyAbility: (abilities: readonly string[]) => boolean,
): NavItem[] {
  return items
    .map((item) => {
      const filteredChildren = item.items
        ? filterNavByAbilities(item.items, hasAnyAbility)
        : undefined;

      if (!item.alwaysVisible) {
        if (item.requiredAbilities && !hasAnyAbility(item.requiredAbilities)) {
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
