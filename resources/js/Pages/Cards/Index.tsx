import type { ReactNode } from 'react';

import { CardsPage } from '@/features/cards/components/cards-page';
import type {
  CardUserSummary,
  GeneratedCard,
} from '@/features/cards/schemas/card.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Index({
  generated,
  not_generated,
}: {
  generated: GeneratedCard[];
  not_generated: CardUserSummary[];
}) {
  return <CardsPage generated={generated} not_generated={not_generated} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
