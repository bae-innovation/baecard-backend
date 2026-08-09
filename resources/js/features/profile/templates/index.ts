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
  { id: 1, title: 'Theme 1 Dark', description: 'Classic dark card with left circular avatar' },
  { id: 2, title: 'Theme 1 Light', description: 'Classic light card with left circular avatar' },
  { id: 3, title: 'Theme 2 Dark', description: 'Wave dark card with centered rounded avatar' },
  { id: 4, title: 'Theme 2 Light', description: 'Wave light card with centered rounded avatar' },
] as const;
