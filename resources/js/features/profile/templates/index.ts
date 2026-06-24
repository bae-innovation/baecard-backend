export { Template1 } from '@/features/profile/templates/Template1';
export { Template2 } from '@/features/profile/templates/Template2';
export { Template3 } from '@/features/profile/templates/Template3';
export { Template4 } from '@/features/profile/templates/Template4';

import { Template1 } from '@/features/profile/templates/Template1';
import { Template2 } from '@/features/profile/templates/Template2';
import { Template3 } from '@/features/profile/templates/Template3';
import { Template4 } from '@/features/profile/templates/Template4';

export const PROFILE_TEMPLATES = {
  1: Template1,
  2: Template2,
  3: Template3,
  4: Template4,
} as const;

export const TEMPLATE_OPTIONS = [
  { id: 1, title: 'Classic Light', description: 'Warm classic card with social grid' },
  { id: 2, title: 'Classic Dark', description: 'Dark classic card with social grid' },
  { id: 3, title: 'Modern Light', description: 'Clean modern card with centered profile' },
  { id: 4, title: 'Modern Dark', description: 'Dark modern card with centered profile' },
] as const;
