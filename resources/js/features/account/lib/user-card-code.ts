import type { AccountCardCode } from '@/features/account/schemas/account.schema';

type UserWithCardCode = {
  card_code?: AccountCardCode | null;
  cardCode?: AccountCardCode | null;
};

export function resolveUserCardCode(user: UserWithCardCode): AccountCardCode | null {
  return user.card_code ?? user.cardCode ?? null;
}
