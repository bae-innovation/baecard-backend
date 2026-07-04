<?php

/**
 * Maps abilities to role names allowed to perform them.
 * SuperAdmin can create new roles in the DB and assign them via users.assign_role.
 *
 * My Account (/user/account) and Appearance (/settings/appearance) are intentionally
 * omitted — they are permission-free for every authenticated user.
 */
return [
    'users.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'users.create' => ['SuperAdmin', 'Admin'],
    'users.update' => ['SuperAdmin', 'Admin'],
    'users.delete' => ['SuperAdmin', 'Admin'],
    'users.assign_role' => ['SuperAdmin', 'Admin'],
    'roles.manage' => ['SuperAdmin', 'Admin'],
    'dashboard.card.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'dashboard.card.manage' => ['SuperAdmin', 'Admin'],
    'dashboard.card.generate' => ['SuperAdmin', 'Admin'],
    'dashboard.card.regenerate' => ['SuperAdmin'],
    'contacts.view' => ['SuperAdmin', 'Admin'],
    'contacts.view_own' => ['User'],
    'contacts.create' => ['User'],
    'contacts.delete' => ['SuperAdmin', 'Admin'],
    'products.view' => ['SuperAdmin', 'Admin', 'Marketing', 'User'],
    'products.manage' => ['SuperAdmin', 'Admin', 'Marketing'],
    'reviews.view' => ['SuperAdmin', 'Admin'],
    'reviews.view_own' => ['User'],
    'reviews.create' => ['User'],
    'reviews.manage' => ['SuperAdmin', 'Admin'],
    'vendors.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'vendors.manage' => ['SuperAdmin', 'Admin', 'Marketing'],
    'orders.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'orders.manage' => ['SuperAdmin', 'Admin'],
    'appointments.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'appointments.manage' => ['SuperAdmin', 'Admin', 'Marketing'],
    'appointments.view_own' => ['User'],
    'profile.manage' => ['User'],
    'settings.manage' => ['SuperAdmin', 'Admin'],
    'cms.view' => ['SuperAdmin', 'Admin'],
    'cms.manage' => ['SuperAdmin', 'Admin'],
    'offer_tickers.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'offer_tickers.manage' => ['SuperAdmin', 'Admin', 'Marketing'],
    'site_social.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'site_social.manage' => ['SuperAdmin', 'Admin', 'Marketing'],
];
