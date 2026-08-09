<?php

namespace App\Support;

class PermissionCatalog
{
    public const GUARD = 'sanctum';

    public const GLOBAL_WILDCARD = '*';

    public const PROTECTED_ROLES = ['SuperAdmin'];

    /**
     * Permissions that grant access to the admin analytics dashboard.
     *
     * @return list<string>
     */
    public static function dashboardAccessPermissions(): array
    {
        return [
            'dashboard.analytics.view',
            'dashboard.*',
        ];
    }

    /**
     * Permissions that grant access to the roles list page.
     *
     * @return list<string>
     */
    public static function roleViewPermissions(): array
    {
        return [
            'rbac.role.view',
            'rbac.*',
        ];
    }

    /**
     * @return list<array{name: string, group: string, label: string, is_wildcard: bool}>
     */
    public static function definitions(): array
    {
        $definitions = [
            self::wildcard('*', 'system', 'Super Admin (All Access)'),
            self::wildcard('dashboard.*', 'dashboard', 'Dashboard (All)'),
            self::perm('dashboard.analytics.view', 'dashboard', 'View Analytics'),
            self::wildcard('rbac.*', 'rbac', 'Access Control (All)'),
            self::perm('rbac.role.view', 'rbac', 'View Roles'),
            self::perm('rbac.role.create', 'rbac', 'Create Roles'),
            self::perm('rbac.role.update', 'rbac', 'Update Roles'),
            self::perm('rbac.role.delete', 'rbac', 'Delete Roles'),
            self::perm('rbac.user.view', 'rbac', 'View Staff Users'),
            self::perm('rbac.user.create', 'rbac', 'Create Staff Users'),
            self::perm('rbac.user.update', 'rbac', 'Update Staff Users'),
            self::perm('rbac.user.delete', 'rbac', 'Delete Staff Users'),
            self::perm('rbac.user.assign_role', 'rbac', 'Assign Roles to Users'),
            self::perm('rbac.permission.view', 'rbac', 'View Permissions'),
            self::wildcard('customer.*', 'customer', 'Customers (All)'),
            self::perm('customer.customer.view', 'customer', 'View Customers'),
            self::perm('customer.customer.create', 'customer', 'Create Customers'),
            self::perm('customer.customer.update', 'customer', 'Update Customers'),
            self::perm('customer.customer.delete', 'customer', 'Delete Customers'),
            self::wildcard('product.*', 'product', 'Products (All)'),
            self::perm('product.product.view', 'product', 'View Products'),
            self::perm('product.product.create', 'product', 'Create Products'),
            self::perm('product.product.update', 'product', 'Update Products'),
            self::perm('product.product.delete', 'product', 'Delete Products'),
            self::wildcard('vendor.*', 'vendor', 'Vendors (All)'),
            self::perm('vendor.vendor.view', 'vendor', 'View Vendors'),
            self::perm('vendor.vendor.create', 'vendor', 'Create Vendors'),
            self::perm('vendor.vendor.update', 'vendor', 'Update Vendors'),
            self::perm('vendor.vendor.delete', 'vendor', 'Delete Vendors'),
            self::wildcard('order.*', 'order', 'Orders (All)'),
            self::perm('order.website_order.view', 'order', 'View Website Orders'),
            self::perm('order.website_order.update', 'order', 'Update Website Orders'),
            self::perm('order.custom_order.view', 'order', 'View Custom Orders'),
            self::perm('order.custom_order.create', 'order', 'Create Custom Orders'),
            self::perm('order.custom_order.update', 'order', 'Update Custom Orders'),
            self::perm('order.custom_order.delete', 'order', 'Delete Custom Orders'),
            self::wildcard('card.*', 'card', 'Cards (All)'),
            self::perm('card.card.view', 'card', 'View Cards'),
            self::perm('card.card.create', 'card', 'Create Cards'),
            self::perm('card.card.update', 'card', 'Update Cards'),
            self::perm('card.card.delete', 'card', 'Delete Cards'),
            self::wildcard('appointment.*', 'appointment', 'Appointments (All)'),
            self::perm('appointment.appointment.view', 'appointment', 'View Appointments'),
            self::perm('appointment.appointment.create', 'appointment', 'Create Appointments'),
            self::perm('appointment.appointment.update', 'appointment', 'Update Appointments'),
            self::perm('appointment.appointment.delete', 'appointment', 'Delete Appointments'),
            self::perm('appointment.appointment.view_own', 'appointment', 'View Own Appointments'),
            self::perm('appointment.appointment.create_own', 'appointment', 'Create Own Appointments'),
            self::perm('appointment.appointment.update_own', 'appointment', 'Update Own Appointments'),
            self::perm('appointment.appointment.delete_own', 'appointment', 'Delete Own Appointments'),
            self::wildcard('contact.*', 'contact', 'Contacts (All)'),
            self::perm('contact.contact.view', 'contact', 'View Contact Messages'),
            self::perm('contact.contact.delete', 'contact', 'Delete Contact Messages'),
            self::perm('contact.contact.view_own', 'contact', 'View Own Contact Messages'),
            self::perm('contact.contact.create', 'contact', 'Create Contact Messages'),
            self::perm('contact.contact.create_own', 'contact', 'Create Own Contact Messages'),
            self::perm('contact.contact.delete_own', 'contact', 'Delete Own Contact Messages'),
            self::wildcard('review.*', 'review', 'Reviews (All)'),
            self::perm('review.review.view', 'review', 'View Reviews'),
            self::perm('review.review.create', 'review', 'Create Reviews'),
            self::perm('review.review.update', 'review', 'Update Reviews'),
            self::perm('review.review.delete', 'review', 'Delete Reviews'),
            self::perm('review.review.view_own', 'review', 'View Own Reviews'),
            self::perm('review.review.create_own', 'review', 'Create Own Reviews'),
            self::perm('review.review.update_own', 'review', 'Update Own Reviews'),
            self::perm('review.review.delete_own', 'review', 'Delete Own Reviews'),
            self::wildcard('profile.*', 'profile', 'Profile Portal (All)'),
            self::perm('profile.content.manage', 'profile', 'Manage Profile Content'),
            self::perm('profile.template.manage', 'profile', 'Manage Profile Templates'),
            self::wildcard('cms.*', 'cms', 'CMS (All)'),
            self::perm('cms.section.view', 'cms', 'View CMS Sections'),
            self::perm('cms.section.manage', 'cms', 'Manage CMS Sections'),
            self::perm('cms.offer_ticker.view', 'cms', 'View Offer Tickers'),
            self::perm('cms.offer_ticker.manage', 'cms', 'Manage Offer Tickers'),
            self::perm('cms.site_social.view', 'cms', 'View Site Social Links'),
            self::perm('cms.site_social.manage', 'cms', 'Manage Site Social Links'),
            self::wildcard('settings.*', 'settings', 'Settings (All)'),
            self::perm('settings.general.manage', 'settings', 'Manage General Settings'),
        ];

        return $definitions;
    }

    /**
     * @return list<string>
     */
    public static function names(): array
    {
        return array_column(self::definitions(), 'name');
    }

    /**
     * @return list<string>
     */
    public static function assignableNames(): array
    {
        return array_values(array_filter(
            self::names(),
            fn (string $name) => $name !== self::GLOBAL_WILDCARD,
        ));
    }

    /**
     * Ensures list/view permissions are included when mutating actions are granted.
     *
     * @param  list<string>  $permissions
     * @return list<string>
     */
    public static function expandViewDependencies(array $permissions): array
    {
        $available = array_flip(self::assignableNames());
        $expanded = $permissions;

        foreach ($permissions as $permission) {
            $viewPermission = self::viewDependencyFor($permission);

            if ($viewPermission !== null && isset($available[$viewPermission])) {
                $expanded[] = $viewPermission;
            }
        }

        return array_values(array_unique($expanded));
    }

    public static function viewDependencyFor(string $permission): ?string
    {
        if (str_ends_with($permission, '.view') || str_ends_with($permission, '.view_own')) {
            return null;
        }

        $parts = explode('.', $permission);

        if (count($parts) < 2) {
            return null;
        }

        $action = $parts[count($parts) - 1];

        if (str_ends_with($action, '_own')) {
            $baseAction = substr($action, 0, -strlen('_own'));

            if (in_array($baseAction, ['create', 'update', 'delete'], true)) {
                $parts[count($parts) - 1] = 'view_own';

                return implode('.', $parts);
            }

            return null;
        }

        if (! in_array($action, ['create', 'update', 'delete', 'manage', 'assign_role'], true)) {
            return null;
        }

        $parts[count($parts) - 1] = 'view';

        return implode('.', $parts);
    }

    /**
     * @return list<string>
     */
    public static function mutatingActionsForView(string $viewPermission): array
    {
        if (! str_ends_with($viewPermission, '.view') && ! str_ends_with($viewPermission, '.view_own')) {
            return [];
        }

        $prefix = str_ends_with($viewPermission, '.view_own')
            ? substr($viewPermission, 0, -strlen('.view_own'))
            : substr($viewPermission, 0, -strlen('.view'));

        return array_values(array_filter(
            self::assignableNames(),
            fn (string $name) => str_starts_with($name, $prefix.'.')
                && self::viewDependencyFor($name) === $viewPermission,
        ));
    }

    /**
     * @return list<string>
     */
    public static function customerPortalPermissions(): array
    {
        return [
            'profile.content.manage',
            'profile.template.manage',
            'contact.contact.view_own',
            'contact.contact.create_own',
            'appointment.appointment.view_own',
            'appointment.appointment.create_own',
            'appointment.appointment.update_own',
            'appointment.appointment.delete_own',
            'review.review.view_own',
            'review.review.create_own',
        ];
    }

    /**
     * Permissions assignable to the customer User role.
     *
     * @return list<string>
     */
    public static function customerRolePermissions(): array
    {
        return array_merge(
            self::customerPortalPermissions(),
            ['product.product.view'],
        );
    }

    /**
     * @return list<string>
     */
    public static function staffPortalWildcards(): array
    {
        return [
            'profile.*',
        ];
    }

    /**
     * @return list<string>
     */
    public static function adminPermissions(): array
    {
        return array_values(array_filter(
            self::assignableNames(),
            fn (string $name) => ! in_array($name, self::customerPortalPermissions(), true)
                && ! in_array($name, self::staffPortalWildcards(), true)
        ));
    }

    /**
     * @return list<string>
     */
    public static function marketingPermissions(): array
    {
        return [
            'dashboard.analytics.view',
            'rbac.user.view',
            'customer.customer.view',
            'product.product.view',
            'product.product.create',
            'product.product.update',
            'product.product.delete',
            'vendor.vendor.view',
            'vendor.vendor.create',
            'vendor.vendor.update',
            'vendor.vendor.delete',
            'order.website_order.view',
            'card.card.view',
            'appointment.appointment.view',
            'appointment.appointment.create',
            'appointment.appointment.update',
            'appointment.appointment.delete',
            'cms.offer_ticker.view',
            'cms.offer_ticker.manage',
            'cms.site_social.view',
            'cms.site_social.manage',
        ];
    }

    /**
     * @param  list<array{name: string, group: string, label: string, is_wildcard: bool}>  $definitions
     * @return array<string, list<array{name: string, label: string, is_wildcard: bool}>>
     */
    public static function groupedForUi(array $definitions = null): array
    {
        $definitions ??= self::definitions();
        $grouped = [];

        foreach ($definitions as $definition) {
            if ($definition['name'] === self::GLOBAL_WILDCARD) {
                continue;
            }

            $grouped[$definition['group']][] = [
                'name' => $definition['name'],
                'label' => $definition['label'],
                'is_wildcard' => $definition['is_wildcard'],
            ];
        }

        return $grouped;
    }

  /**
     * @return array{name: string, group: string, label: string, is_wildcard: bool}
     */
    private static function perm(string $name, string $group, string $label): array
    {
        return [
            'name' => $name,
            'group' => $group,
            'label' => $label,
            'is_wildcard' => false,
        ];
    }

    /**
     * @return array{name: string, group: string, label: string, is_wildcard: bool}
     */
    private static function wildcard(string $name, string $group, string $label): array
    {
        return [
            'name' => $name,
            'group' => $group,
            'label' => $label,
            'is_wildcard' => true,
        ];
    }
}
