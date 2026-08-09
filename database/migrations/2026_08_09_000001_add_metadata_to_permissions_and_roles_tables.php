<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->string('group')->nullable()->after('guard_name');
            $table->string('label')->nullable()->after('group');
            $table->boolean('is_wildcard')->default(false)->after('label');
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->boolean('is_protected')->default(false)->after('guard_name');
        });
    }

    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropColumn(['group', 'label', 'is_wildcard']);
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('is_protected');
        });
    }
};
