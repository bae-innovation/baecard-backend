import { z } from 'zod';

import { PROFILE_PLATFORMS } from '@/features/profile/schemas/profile-social.schema';

export const profileSocialLinkSchema = z.object({
  platform: z.enum(PROFILE_PLATFORMS),
  url: z.string().max(500),
});

export type ProfileSocialLink = z.infer<typeof profileSocialLinkSchema>;

export const profileContentSchema = z.object({
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  login_email: z.string().email().optional(),
  personal_email: z.string().nullable().optional(),
  personal_phone_code: z.string().nullable().optional(),
  personal_phone: z.string().nullable().optional(),
  personal_address: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  designation: z.string().nullable().optional(),
  work_email: z.string().nullable().optional(),
  work_phone_code: z.string().nullable().optional(),
  work_phone: z.string().nullable().optional(),
  work_address: z.string().nullable().optional(),
  social_links: z.array(profileSocialLinkSchema).optional(),
  profile_image_url: z.string().nullable().optional(),
  cover_image_url: z.string().nullable().optional(),
  active_template: z.number().optional(),
});

export type ProfileContent = z.infer<typeof profileContentSchema>;

export const profileContentFormSchema = z.object({
  first_name: z.string().max(255).optional().or(z.literal('')),
  last_name: z.string().max(255).optional().or(z.literal('')),
  personal_email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  personal_phone_code: z.string().max(8).optional().or(z.literal('')),
  personal_phone: z.string().max(32).optional().or(z.literal('')),
  personal_address: z.string().max(500).optional().or(z.literal('')),
  bio: z.string().max(255, 'Bio must be 255 characters or less').optional().or(z.literal('')),
  company: z.string().max(255).optional().or(z.literal('')),
  designation: z.string().max(255).optional().or(z.literal('')),
  work_email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  work_phone_code: z.string().max(8).optional().or(z.literal('')),
  work_phone: z.string().max(32).optional().or(z.literal('')),
  work_address: z.string().max(500).optional().or(z.literal('')),
  social_links: z.array(profileSocialLinkSchema),
});

export type ProfileContentFormValues = z.infer<typeof profileContentFormSchema>;

export const DEFAULT_PHONE_CODE = '+880';

export const DEFAULT_SOCIAL_SLOTS: ProfileSocialLink[] = [
  { platform: 'facebook', url: '' },
  { platform: 'instagram', url: '' },
  { platform: 'linkedin', url: '' },
  { platform: 'whatsapp', url: '' },
];

export function mergeSocialLinks(links?: ProfileSocialLink[] | null): ProfileSocialLink[] {
  const existing = Array.isArray(links) ? links : [];
  const used = new Set(existing.map((link) => link.platform));
  const merged = [...existing];

  for (const slot of DEFAULT_SOCIAL_SLOTS) {
    if (!used.has(slot.platform)) {
      merged.push({ ...slot });
    }
  }

  return merged.length > 0 ? merged : [...DEFAULT_SOCIAL_SLOTS];
}
