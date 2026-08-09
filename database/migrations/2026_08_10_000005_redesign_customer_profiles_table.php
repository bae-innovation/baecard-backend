<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $legacyProfiles = Schema::hasTable('customer_profiles')
            ? DB::table('customer_profiles')->get()->keyBy('user_id')
            : collect();

        $legacySocials = Schema::hasTable('customer_socials')
            ? DB::table('customer_socials')->orderBy('sort_order')->get()->groupBy('customer_id')
            : collect();

        $users = DB::table('users')->orderBy('id')->get();

        Schema::dropIfExists('user_services');
        Schema::dropIfExists('customer_socials');
        Schema::dropIfExists('customer_profiles');

        Schema::create('customer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('profile_image')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('personal_email')->nullable();
            $table->string('personal_phone_code', 8)->nullable();
            $table->string('personal_phone', 32)->nullable();
            $table->string('personal_address')->nullable();
            $table->string('bio', 255)->nullable();
            $table->string('company')->nullable();
            $table->string('designation')->nullable();
            $table->string('work_email')->nullable();
            $table->string('work_phone_code', 8)->nullable();
            $table->string('work_phone', 32)->nullable();
            $table->string('work_address')->nullable();
            $table->json('social_links')->nullable();
            $table->unsignedTinyInteger('active_template')->default(1);
            $table->timestamps();
        });

        foreach ($users as $user) {
            $profile = $legacyProfiles->get($user->id);
            $nameParts = preg_split('/\s+/', trim((string) $user->name), 2) ?: [];
            $firstName = $nameParts[0] ?? null;
            $lastName = $nameParts[1] ?? null;

            $coverImage = null;
            if ($profile?->template_settings) {
                $settings = json_decode((string) $profile->template_settings, true);
                if (is_array($settings)) {
                    $activeTemplate = (string) ($profile->active_template ?? 1);
                    $coverImage = $settings[$activeTemplate]['cover_image']
                        ?? $settings[(int) $activeTemplate]['cover_image']
                        ?? null;
                }
            }

            $socialLinks = [];
            foreach ($legacySocials->get($user->id, collect()) as $social) {
                if (in_array($social->platform, ['phone', 'email'], true)) {
                    continue;
                }

                $socialLinks[] = [
                    'platform' => $social->platform,
                    'url' => $social->url ?: $social->platform_value,
                ];
            }

            DB::table('customer_profiles')->insert([
                'user_id' => $user->id,
                'profile_image' => $user->avatar,
                'cover_image' => $coverImage,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'personal_email' => $user->email,
                'personal_phone' => $user->phone,
                'bio' => $profile?->bio,
                'company' => $profile?->company,
                'designation' => $profile?->job_title,
                'social_links' => $socialLinks === [] ? null : json_encode($socialLinks),
                'active_template' => $profile?->active_template ?? 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_profiles');

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

        Schema::create('customer_socials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->string('platform', 50);
            $table->string('platform_value');
            $table->string('url')->nullable();
            $table->string('label')->nullable();
            $table->string('fn')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('user_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }
};
