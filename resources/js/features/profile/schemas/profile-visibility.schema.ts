import { z } from 'zod';

export const profileVisibilitySchema = z.object({
  bio: z.boolean(),
  phones: z.boolean(),
  emails: z.boolean(),
  social: z.boolean(),
  services: z.boolean(),
  cover: z.boolean(),
  qr: z.boolean(),
});

export type ProfileVisibility = z.infer<typeof profileVisibilitySchema>;

export const DEFAULT_PROFILE_VISIBILITY: ProfileVisibility = {
  bio: true,
  phones: true,
  emails: true,
  social: true,
  services: true,
  cover: true,
  qr: true,
};

export const VISIBILITY_FIELDS: {
  key: keyof ProfileVisibility;
  label: string;
  description: string;
}[] = [
  { key: 'cover', label: 'Cover image', description: 'Header banner on your card' },
  { key: 'bio', label: 'Bio', description: 'About me text' },
  { key: 'phones', label: 'Phone numbers', description: 'All phone contact entries' },
  { key: 'emails', label: 'Email addresses', description: 'Secondary email entries' },
  { key: 'social', label: 'Social links', description: 'Social media icons and links' },
  { key: 'services', label: 'Services / products', description: 'Your business offerings' },
  { key: 'qr', label: 'QR code', description: 'Scannable QR code section' },
];
