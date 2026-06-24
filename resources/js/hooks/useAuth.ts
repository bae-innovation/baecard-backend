import { usePage } from '@inertiajs/react';

import type { SharedPageProps } from '@/types/inertia';
import { hasAbilityForUser, hasAnyAbilityForUser } from '@/lib/permissions';

export function useAuth() {
    const { auth } = usePage<{ auth: SharedPageProps['auth'] }>().props;

    return {
        user: auth.user,
        permissions: auth.permissions,
        isAuthenticated: () => auth.user !== null,
        hasAbility: (ability: string) =>
            hasAbilityForUser(
                auth.permissions,
                auth.user?.roles?.map((role) => role.name),
                ability,
            ),
        hasAnyAbility: (abilities: readonly string[]) =>
            hasAnyAbilityForUser(
                auth.permissions,
                auth.user?.roles?.map((role) => role.name),
                abilities,
            ),
    };
}
