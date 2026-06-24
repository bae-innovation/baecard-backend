<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('bio')->nullable()->after('avatar');
            $table->string('job_title')->nullable()->after('bio');
            $table->string('company')->nullable()->after('job_title');
            $table->unsignedTinyInteger('active_template')->default(1)->after('company');
            $table->json('profile_visibility')->nullable()->after('active_template');
            $table->json('template_settings')->nullable()->after('profile_visibility');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'bio',
                'job_title',
                'company',
                'active_template',
                'profile_visibility',
                'template_settings',
            ]);
        });
    }
};
