import { usePage } from '@inertiajs/react';

import type { AppSettings } from '@/types/app-settings';

const fallback: AppSettings = {
    name: 'BAE Card',
    tagline: null,
    site_url: '',
    contact_email: null,
    support_phone: null,
    copyright: null,
    logo_white_url: null,
    logo_black_url: null,
    admin_logo_url: null,
    primary_color: '#2563eb',
    currency: 'BDT',
    currency_symbol: '৳',
    email_from_name: 'BAE Card',
    email_from_email: null,
    email_support: null,
    whatsapp: '+8801897543515',
    facebook: 'https://www.facebook.com/baecard.info/',
    instagram: 'https://www.instagram.com/bae_card/',
    linkedin: 'https://www.linkedin.com/company/bae-card/',
};

export function useAppSettings(): AppSettings {
    const { app } = usePage<{ app?: AppSettings }>().props;

    return app ?? fallback;
}
