<?php

namespace App\Support;

class PermissionCatalog
{
    public const GUARD = 'sanctum';

    public const GLOBAL_WILDCARD = '*';

    public const PROTECTED_ROLES = ['SuperAdmin', 'User'];

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
            self::perm('vendor.vendor.manage', 'vendor', 'Manage Vendors'),
            self::wildcard('order.*', 'order', 'Orders (All)'),
            self::perm('order.order.view', 'order', 'View Orders'),
            self::perm('order.order.manage', 'order', 'Manage Orders'),
            self::wildcard('card.*', 'card', 'Cards (All)'),
            self::perm('card.card.view', 'card', 'View Cards'),
            self::perm('card.card.manage', 'card', 'Manage Cards'),
            self::perm('card.card.generate', 'card', 'Generate Cards'),
            self::perm('card.card.regenerate', 'card', 'Regenerate Cards'),
            self::wildcard('appointment.*', 'appointment', 'Appointments (All)'),
            self::perm('appointment.appointment.view', 'appointment', 'View Appointments'),
            self::perm('appointment.appointment.manage', 'appointment', 'Manage Appointments'),
            self::perm('appointment.appointment.view_own', 'appointment', 'View Own Appointments'),
            self::wildcard('contact.*', 'contact', 'Contacts (All)'),
            self::perm('contact.contact.view', 'contact', 'View Contact Messages'),
            self::perm('contact.contact.delete', 'contact', 'Delete Contact Messages'),
            self::perm('contact.contact.view_own', 'contact', 'View Own Contact Messages'),
            self::perm('contact.contact.create', 'contact', 'Create Contact Messages'),
            self::wildcard('review.*', 'review', 'Reviews (All)'),
            self::perm('review.review.view', 'review', 'View Reviews'),
            self::perm('review.review.manage', 'review', 'Manage Reviews'),
            self::perm('review.review.view_own', 'review', 'View Own Reviews'),
            self::perm('review.review.create', 'review', 'Create Reviews'),
            self::wildcard('profile.*', 'profile', 'Profile Portal (All)'),
            self::perm('profile.social.manage', 'profile', 'Manage Social Links'),
            self::perm('profile.service.manage', 'profile', 'Manage Services'),
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
     * @return list<string>
     */
    public static function customerPortalPermissions(): array
    {
        return [
            'profile.social.manage',
            'profile.service.manage',
            'profile.template.manage',
            'contact.contact.view_own',
            'contact.contact.create',
            'appointment.appointment.view_own',
            'review.review.view_own',
            'review.review.create',
        ];
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
            fn (string $name) => $name !== 'card.card.regenerate'
                && ! in_array($name, self::customerPortalPermissions(), true)
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
            'vendor.vendor.manage',
            'order.order.view',
            'card.card.view',
            'appointment.appointment.view',
            'appointment.appointment.manage',
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
