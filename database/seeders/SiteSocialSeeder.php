<?php

namespace Database\Seeders;

use App\Models\SiteSocialLink;
use Illuminate\Database\Seeder;

class SiteSocialSeeder extends Seeder
{
    public function run(): void
    {
        if (SiteSocialLink::query()->exists()) {
            return;
        }

        SiteSocialLink::create([
            'platform' => 'phone',
            'platform_value' => '+8801897543515',
            'label' => 'Support Phone',
            'is_active' => true,
            'show_in_floating' => true,
            'sort_order' => 10,
        ]);

        SiteSocialLink::create([
            'platform' => 'whatsapp',
            'platform_value' => '+8801897543515',
            'label' => 'WhatsApp',
            'is_active' => true,
            'show_in_floating' => true,
            'sort_order' => 20,
        ]);

        SiteSocialLink::create([
            'platform' => 'facebook',
            'platform_value' => 'baecard.info',
            'url' => 'https://www.facebook.com/baecard.info/',
            'label' => 'Facebook',
            'is_active' => true,
            'show_in_floating' => true,
            'sort_order' => 30,
        ]);

        app(\App\Services\SiteSocialService::class)->bustCache();
    }
}
