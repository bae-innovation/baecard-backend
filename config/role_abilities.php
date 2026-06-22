<?php

/**
 * Maps abilities to role names allowed to perform them.
 * SuperAdmin can create new roles in the DB and assign them via users.assign_role.
 */
return [
    'users.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'users.create' => ['SuperAdmin', 'Admin'],
    'users.update' => ['SuperAdmin', 'Admin'],
    'users.delete' => ['SuperAdmin'],
    'users.assign_role' => ['SuperAdmin', 'Admin'],
    'roles.manage' => ['SuperAdmin'],
    'dashboard.card.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'dashboard.card.manage' => ['SuperAdmin', 'Admin'],
    'dashboard.card.generate' => ['SuperAdmin', 'Admin'],
    'dashboard.card.regenerate' => ['SuperAdmin'],
    'contacts.view' => ['SuperAdmin', 'Admin'],
    'contacts.delete' => ['SuperAdmin', 'Admin'],
    'products.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'products.manage' => ['SuperAdmin', 'Admin', 'Marketing'],
    'reviews.view' => ['SuperAdmin', 'Admin'],
    'reviews.manage' => ['SuperAdmin', 'Admin'],
    'vendors.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'vendors.manage' => ['SuperAdmin', 'Admin', 'Marketing'],
    'orders.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'orders.manage' => ['SuperAdmin', 'Admin'],
    'appointments.view' => ['SuperAdmin', 'Admin', 'Marketing'],
    'appointments.manage' => ['SuperAdmin', 'Admin', 'Marketing'],
    'appointments.view_own' => ['User'],
    'settings.manage' => ['SuperAdmin', 'Admin'],
];
