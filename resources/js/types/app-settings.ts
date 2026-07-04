export type FloatingSocialLink = {
  id: string;
  platform: string;
  platform_value: string;
  url?: string | null;
  label?: string | null;
  href: string;
  show_in_floating?: boolean;
};

export type AppSettings = {
    name: string;
    tagline: string | null;
    site_url: string;
    contact_email: string | null;
    support_phone: string | null;
    copyright: string | null;
    logo_white_url: string | null;
    logo_black_url: string | null;
    admin_logo_url: string | null;
    primary_color: string;
    currency: string;
    currency_symbol: string;
    email_from_name: string;
    email_from_email: string | null;
    email_support: string | null;
    whatsapp?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    floating_socials?: FloatingSocialLink[];
};
