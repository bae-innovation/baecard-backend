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
    'users.assign_role' => ['SuperAdmin'],
    'roles.manage' => ['SuperAdmin'],
];
