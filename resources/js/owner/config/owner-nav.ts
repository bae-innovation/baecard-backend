import {
  CreditCard,
  LayoutTemplate,
  Pencil,
  UserRound,
} from 'lucide-react';

export type OwnerNavItem = {
  label: string;
  href: string;
  icon: typeof CreditCard;
  match: (pathname: string) => boolean;
};

export const OWNER_NAV_ITEMS: OwnerNavItem[] = [
  {
    label: 'My card',
    href: '/profile',
    icon: CreditCard,
    match: (pathname) => pathname === '/profile',
  },
  {
    label: 'Edit',
    href: '/profile/content',
    icon: Pencil,
    match: (pathname) => pathname.startsWith('/profile/content'),
  },
  {
    label: 'Theme',
    href: '/profile/templates',
    icon: LayoutTemplate,
    match: (pathname) => pathname.startsWith('/profile/templates'),
  },
  {
    label: 'Account',
    href: '/user/account',
    icon: UserRound,
    match: (pathname) => pathname.startsWith('/user/account'),
  },
];
