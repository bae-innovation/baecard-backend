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
        homeHref: resolveHomeHref(
            auth.permissions,
            auth.user?.roles?.map((role) => role.name),
            auth.user?.active_template,
        ),
    };
}

function resolveHomeHref(
    permissions: readonly { name: string }[],
    roleNames: readonly string[] | undefined,
    activeTemplate: number | null | undefined,
): string {
    if (hasAbilityForUser(permissions, roleNames, 'dashboard.view')) {
        return '/dashboard';
    }

    if (hasAbilityForUser(permissions, roleNames, 'orders.view')) {
        return '/orders';
    }

    if (hasAbilityForUser(permissions, roleNames, 'profile.manage')) {
        return `/profile/templates/${activeTemplate ?? 1}`;
    }

    return '/user/account';
}
