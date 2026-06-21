import type { NavItem } from '@/components/shared/sidebar/nav-main';
import {
  Calendar,
  CreditCard,
  MessageSquare,
  Package,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  User,
  UserCog,
  UserRound,
  Users,
} from 'lucide-react';

const TEMPLATE_NAV: NavItem[] = [
  {
    title: 'Access Control',
    url: '.',
    icon: Shield,
    isActive: true,
    items: [
      {
        title: 'Roles',
        url: '/access-control/roles',
        icon: ShieldCheck,
      },
      {
        title: 'Users',
        url: '/access-control/users',
        icon: UserCog,
      },
    ],
  },
  {
    title: 'User Management',
    url: '.',
    icon: Users,
    items: [
      {
        title: 'Users List',
        url: '/users',
        icon: Users,
      },
    ],
  },
  {
    title: 'Customer Management',
    url: '.',
    icon: UserRound,
    items: [
      {
        title: 'Customers',
        url: '/customers',
        icon: UserRound,
      },
    ],
  },
  {
    title: 'Products',
    url: '.',
    icon: Package,
    items: [
      {
        title: 'Products',
        url: '/products',
        icon: Package,
      },
    ],
  },
  {
    title: 'Vendors',
    url: '.',
    icon: Store,
    items: [
      {
        title: 'Vendors',
        url: '/vendors',
        icon: Store,
      },
    ],
  },
  {
    title: 'Orders',
    url: '.',
    icon: ShoppingCart,
    items: [
      {
        title: 'Order List',
        url: '/orders',
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: 'Card Management',
    url: '.',
    icon: CreditCard,
    items: [
      {
        title: 'Cards',
        url: '/cards',
        icon: CreditCard,
      },
    ],
  },
  {
    title: 'Appointments',
    url: '.',
    icon: Calendar,
    items: [
      {
        title: 'Appointments',
        url: '/appointments',
        icon: Calendar,
      },
    ],
  },
  {
    title: 'Contacts',
    url: '.',
    icon: MessageSquare,
    items: [
      {
        title: 'Contact Messages',
        url: '/contacts',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Reviews',
    url: '.',
    icon: Star,
    items: [
      {
        title: 'Reviews',
        url: '/reviews',
        icon: Star,
      },
    ],
  },
  {
    title: 'Settings',
    url: '.',
    icon: Settings,
    items: [
      {
        title: 'Settings',
        url: '/settings',
        icon: Settings,
      },
    ],
  },
  {
    title: 'My Account',
    url: '.',
    icon: User,
    items: [
      {
        title: 'My Account',
        url: '/user/account',
        icon: User,
      },
    ],
  },
];

export function getDashboardNav(): NavItem[] {
  return TEMPLATE_NAV;
}
