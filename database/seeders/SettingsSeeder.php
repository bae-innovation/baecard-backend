<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'general' => [
                'site_name' => config('app.name', 'BAE Card'),
                'tagline' => 'Digital NFC Business Cards',
                'site_url' => config('app.url'),
                'contact_email' => 'contact@example.com',
                'support_phone' => null,
                'street' => null,
                'city' => null,
                'state' => null,
                'country' => null,
                'postal_code' => null,
                'privacy_policy_url' => null,
                'terms_url' => null,
                'copyright_text' => '© '.date('Y').' BAE Card. All rights reserved.',
            ],
            'branding' => [
                'logo_white' => null,
                'logo_black' => null,
                'admin_logo' => null,
                'primary_color' => '#2563eb',
            ],
            'business' => [
                'currency' => 'BDT',
                'currency_symbol' => '৳',
                'tax_rate' => 0,
                'order_prefix' => 'BAE-',
            ],
            'social' => [
                'whatsapp' => null,
                'facebook' => null,
                'instagram' => null,
                'twitter' => null,
                'linkedin' => null,
                'youtube' => null,
                'tiktok' => null,
            ],
            'email' => [
                'from_name' => config('app.name', 'BAE Card'),
                'from_email' => 'noreply@example.com',
                'support_email' => 'support@example.com',
            ],
        ];

        foreach ($defaults as $key => $value) {
            Setting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
        }
    }
}
