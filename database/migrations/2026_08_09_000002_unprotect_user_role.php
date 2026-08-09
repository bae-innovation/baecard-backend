<?php

use App\Enums\UserRole;
use App\Support\PermissionCatalog;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('roles')
            ->where('guard_name', PermissionCatalog::GUARD)
            ->where('name', UserRole::User->value)
            ->update(['is_protected' => false]);
    }

    public function down(): void
    {
        DB::table('roles')
            ->where('guard_name', PermissionCatalog::GUARD)
            ->where('name', UserRole::User->value)
            ->update(['is_protected' => true]);
    }
};
