import { frontendAsset } from '@frontend/lib/brand';

export const securityItems = [
  {
    icon: frontendAsset('encryption2.svg'),
    title: 'Encryption',
    description: 'Your data is safe with us. We encrypt all data at the storage level using AES-256 bit encryption.',
  },
  {
    icon: frontendAsset('ssl security2.svg'),
    title: 'SSL Security',
    description: 'All data transferred is encrypted before exchange following the SSL standard.',
  },
  {
    icon: frontendAsset('firewall2.svg'),
    title: 'Firewall',
    description: 'We implemented best-in-class security measures against unwanted traffic.',
  },
  {
    icon: frontendAsset('hosting2.svg'),
    title: 'Hosting',
    description: 'Our hosting providers DigitalOcean and Hostinger are committed to best-in-class security.',
  },
] as const;
