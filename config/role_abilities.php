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
    'dashboard.card.generate' => ['SuperAdmin', 'Admin'],
    'dashboard.card.regenerate' => ['SuperAdmin'],
];
