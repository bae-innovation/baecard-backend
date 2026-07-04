import { z } from 'zod';

import { PROFILE_PLATFORMS, PLATFORM_LABELS, type ProfilePlatform } from '@/features/profile/schemas/profile-social.schema';

export const siteSocialLinkSchema = z.object({
  id: z.number(),
  platform: z.enum(PROFILE_PLATFORMS),
  platform_value: z.string(),
  url: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  is_active: z.boolean(),
  show_in_floating: z.boolean(),
  sort_order: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type SiteSocialLink = z.infer<typeof siteSocialLinkSchema>;

export const siteSocialFormSchema = z.object({
  platform: z.enum(PROFILE_PLATFORMS),
  platform_value: z.string().min(1, 'Value is required').max(255),
  url: z.string().max(500).optional().or(z.literal('')),
  label: z.string().max(255).optional().or(z.literal('')),
  is_active: z.boolean(),
  show_in_floating: z.boolean(),
  sort_order: z.coerce.number().int().min(0),
});

export type SiteSocialFormValues = z.infer<typeof siteSocialFormSchema>;

export { PLATFORM_LABELS, PROFILE_PLATFORMS, type ProfilePlatform };

export function serializeSiteSocialFormPayload(values: SiteSocialFormValues) {
  return {
    platform: values.platform,
    platform_value: values.platform_value,
    url: values.url || null,
    label: values.label || null,
    is_active: values.is_active,
    show_in_floating: values.show_in_floating,
    sort_order: values.sort_order,
  };
}

export function siteSocialToFormValues(link: SiteSocialLink): SiteSocialFormValues {
  return {
    platform: link.platform,
    platform_value: link.platform_value,
    url: link.url ?? '',
    label: link.label ?? '',
    is_active: link.is_active,
    show_in_floating: link.show_in_floating,
    sort_order: link.sort_order,
  };
}
