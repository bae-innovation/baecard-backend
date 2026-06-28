import type { CmsCatalogEntry, CmsCatalogGroup } from '@/features/cms/schemas/cms-entry.schema';

export const CMS_CATALOG_GROUPS: Record<
  CmsCatalogGroup,
  { title: string; description: string }
> = {
  homepage: {
    title: 'Homepage sections',
    description: 'Hero, offers, steps, features, and other blocks on the home page.',
  },
  pages: {
    title: 'Marketing pages',
    description: 'Intro copy for dedicated pages like About, Products, and FAQ.',
  },
  site: {
    title: 'Site-wide',
    description: 'Navigation, SEO, contact blocks, and shared headings.',
  },
};

export const CMS_ENTRY_CATALOG: CmsCatalogEntry[] = [
  {
    key: 'section.hero',
    label: 'Hero Section',
    description: 'Homepage hero title, subtitle, and call-to-action buttons.',
    group: 'homepage',
    previewPath: '/',
  },
  {
    key: 'section.offers',
    label: 'Offer Banners',
    description: 'Promo ticker messages above the navigation bar.',
    group: 'homepage',
    previewPath: '/',
  },
  {
    key: 'section.order_steps',
    label: 'Order Steps',
    description: 'Three-step timeline on the homepage.',
    group: 'homepage',
    previewPath: '/',
  },
  {
    key: 'section.how_it_works',
    label: 'How It Works',
    description: 'Detailed how-it-works steps on the homepage.',
    group: 'homepage',
    previewPath: '/',
  },
  {
    key: 'section.features',
    label: 'Feature Grid',
    description: 'Icon cards explaining BAE Card benefits.',
    group: 'homepage',
    previewPath: '/',
  },
  {
    key: 'section.faq',
    label: 'FAQ Items',
    description: 'Questions and answers shown on the FAQ page and homepage teaser.',
    group: 'homepage',
    previewPath: '/faq',
  },
  {
    key: 'section.section_headings',
    label: 'Section Headings',
    description: 'Titles and subtitles for homepage sections.',
    group: 'homepage',
    previewPath: '/',
  },
  {
    key: 'page.about',
    label: 'About Page',
    description: 'About us page title and body paragraphs.',
    group: 'pages',
    previewPath: '/about',
  },
  {
    key: 'page.products',
    label: 'Products Page',
    description: 'Products page intro copy.',
    group: 'pages',
    previewPath: '/products',
  },
  {
    key: 'page.corporate',
    label: 'Corporate Page',
    description: 'Corporate solutions page intro.',
    group: 'pages',
    previewPath: '/corporate',
  },
  {
    key: 'page.security',
    label: 'Security Page',
    description: 'Security page intro copy.',
    group: 'pages',
    previewPath: '/security',
  },
  {
    key: 'page.contact',
    label: 'Contact Page',
    description: 'Contact page intro copy.',
    group: 'pages',
    previewPath: '/contact',
  },
  {
    key: 'page.faq',
    label: 'FAQ Page',
    description: 'FAQ page intro copy.',
    group: 'pages',
    previewPath: '/faq',
  },
  {
    key: 'page.terms',
    label: 'Terms Page',
    description: 'Terms of service page content.',
    group: 'pages',
    previewPath: '/terms',
  },
  {
    key: 'page.policy',
    label: 'Privacy Policy',
    description: 'Privacy policy page content.',
    group: 'pages',
    previewPath: '/policy',
  },
  {
    key: 'section.navigation',
    label: 'Navigation Links',
    description: 'Header and footer navigation items.',
    group: 'site',
    previewPath: '/',
  },
  {
    key: 'section.contact',
    label: 'Contact Block',
    description: 'Shared contact section heading on marketing pages.',
    group: 'site',
    previewPath: '/contact',
  },
  {
    key: 'section.corporate',
    label: 'Corporate Block',
    description: 'Shared corporate inquiry block copy.',
    group: 'site',
    previewPath: '/corporate',
  },
  {
    key: 'seo.all',
    label: 'SEO Meta',
    description: 'Page titles and descriptions for search engines.',
    group: 'site',
    previewPath: '/',
  },
];

export function getCatalogEntry(key: string): CmsCatalogEntry | undefined {
  return CMS_ENTRY_CATALOG.find((entry) => entry.key === key);
}

export function getCatalogByGroup(group: CmsCatalogGroup): CmsCatalogEntry[] {
  return CMS_ENTRY_CATALOG.filter((entry) => entry.group === group);
}
