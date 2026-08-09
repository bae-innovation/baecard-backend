<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->text('bio')->nullable();
            $table->string('job_title')->nullable();
            $table->string('company')->nullable();
            $table->unsignedTinyInteger('active_template')->default(1);
            $table->json('profile_visibility')->nullable();
            $table->json('template_settings')->nullable();
            $table->timestamps();
        });

        if (Schema::hasColumn('users', 'bio')) {
            DB::table('users')->orderBy('id')->chunkById(100, function ($users): void {
                $rows = [];

                foreach ($users as $user) {
                    $rows[] = [
                        'user_id' => $user->id,
                        'bio' => $user->bio,
                        'job_title' => $user->job_title,
                        'company' => $user->company,
                        'active_template' => $user->active_template ?? 1,
                        'profile_visibility' => $user->profile_visibility,
                        'template_settings' => $user->template_settings,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if ($rows !== []) {
                    DB::table('customer_profiles')->insert($rows);
                }
            });

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
    }

    public function down(): void
    {
        if (! Schema::hasTable('customer_profiles')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'bio')) {
                $table->text('bio')->nullable()->after('avatar');
                $table->string('job_title')->nullable()->after('bio');
                $table->string('company')->nullable()->after('job_title');
                $table->unsignedTinyInteger('active_template')->default(1)->after('company');
                $table->json('profile_visibility')->nullable()->after('active_template');
                $table->json('template_settings')->nullable()->after('profile_visibility');
            }
        });

        DB::table('customer_profiles')->orderBy('id')->chunkById(100, function ($profiles): void {
            foreach ($profiles as $profile) {
                DB::table('users')->where('id', $profile->user_id)->update([
                    'bio' => $profile->bio,
                    'job_title' => $profile->job_title,
                    'company' => $profile->company,
                    'active_template' => $profile->active_template,
                    'profile_visibility' => $profile->profile_visibility,
                    'template_settings' => $profile->template_settings,
                ]);
            }
        });

        Schema::dropIfExists('customer_profiles');
    }
};
