import { frontendAsset } from '@frontend/lib/brand';

export const featureItems = [
  {
    icon: frontendAsset('Get card2.svg'),
    title: 'Get your BAE CARD',
    description:
      'Put your personal info into networks devices with your smart business card. Order from the website or contact us on WhatsApp.',
  },
  {
    icon: frontendAsset('Profile2.svg'),
    title: 'BAE CARD PROFILE',
    description:
      'Personalize your profile landing page with an attractive design that suits your taste.',
  },
  {
    icon: frontendAsset('Share2.svg'),
    title: 'Effortless Sharing',
    description:
      'Tap your BAE Card on an NFC enabled smartphone to instantly share contact information. No software downloads needed.',
  },
  {
    icon: frontendAsset('QR2.svg'),
    title: 'QR Code',
    description: 'For non-NFC users, share your information using the QR code on your card.',
  },
] as const;

export const howItWorksSteps = [
  {
    id: 'order',
    label: '1. Order',
    content: 'Place your order for a personalized NFC Bae Card through our platform. Phone: +880 1897 543 515',
  },
  {
    id: 'design',
    label: '2. Design',
    content:
      'Collaborate with our design team to create a unique NFC Bae Card that matches your preferences and style.',
  },
  {
    id: 'setup',
    label: '3. Setup',
    content:
      'Follow our straightforward instructions for a quick, hassle-free setup so your card is ready to use right away.',
  },
] as const;
