import type { OfferBanner } from '@frontend/types/offer-banner';

export type Locale = 'en' | 'bn';

export type LocalizedString = { en: string; bn: string };

export type CmsPageSlug =
  | 'about'
  | 'terms'
  | 'policy'
  | 'corporate'
  | 'contact'
  | 'products'
  | 'security'
  | 'faq';

export type NavItem = {
  label: LocalizedString;
  href: string;
  route?: string;
};

export type HeroContent = {
  title: LocalizedString;
  subtitle: LocalizedString;
  ctaPrimary: LocalizedString;
  ctaSecondary: LocalizedString;
};

export type OrderStep = {
  id: string;
  title: LocalizedString;
  body: LocalizedString;
};

export type FeatureItem = {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
};

export type SecurityItem = {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
};

export type FaqItem = {
  question: LocalizedString;
  answer: LocalizedString;
};

export type PageContent = {
  title: LocalizedString;
  subtitle?: LocalizedString;
  paragraphs: LocalizedString[];
};

export type SeoMeta = {
  title: LocalizedString;
  description: LocalizedString;
};

export type ContactBlock = {
  heading: LocalizedString;
  subheading: LocalizedString;
};

export type CorporateBlock = {
  heading: LocalizedString;
  subheading: LocalizedString;
  bullets: LocalizedString[];
};

export type HowItWorksStep = {
  id: string;
  label: LocalizedString;
  content: LocalizedString;
};

export type MarketingContent = {
  hero: HeroContent;
  orderSteps: OrderStep[];
  howItWorksSteps: HowItWorksStep[];
  features: FeatureItem[];
  security: SecurityItem[];
  faq: FaqItem[];
  offers: OfferBanner[];
  pages: Record<CmsPageSlug, PageContent>;
  navigation: NavItem[];
  contact: ContactBlock;
  corporate: CorporateBlock;
  seo: Record<string, SeoMeta>;
  sectionHeadings: {
    catalog: { title: LocalizedString; subtitle: LocalizedString };
    howItWorks: { title: LocalizedString; subtitle: LocalizedString };
    features: { title: LocalizedString; subtitle: LocalizedString };
    reviews: { title: LocalizedString; subtitle: LocalizedString };
    security: { title: LocalizedString; subtitle: LocalizedString };
    faq: { title: LocalizedString; subtitle: LocalizedString };
    corporate: { title: LocalizedString; subtitle: LocalizedString };
    trust: { title: LocalizedString };
  };
};
