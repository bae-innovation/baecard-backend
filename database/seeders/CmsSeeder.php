<?php

namespace Database\Seeders;

use App\Services\CmsService;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        $cms = app(CmsService::class);

        $cms->upsert('section.hero', 'Hero Section', [
            'title' => ['en' => "Bangladesh's Smart NFC Digital Business Card", 'bn' => 'বাংলাদেশের স্মার্ট এনএফসি ডিজিটাল বিজনেস কার্ড'],
            'subtitle' => ['en' => 'Share your contact info with just a tap or scan.', 'bn' => 'একটি ট্যাপ বা স্ক্যানে যোগাযোগের তথ্য শেয়ার করুন।'],
            'ctaPrimary' => ['en' => 'Get Started', 'bn' => 'শুরু করুন'],
            'ctaSecondary' => ['en' => 'Book a Demo', 'bn' => 'ডেমো বুক করুন'],
        ], null, 10);

        $cms->upsert('section.offers', 'Offer Banners', [
            'items' => [
                [
                    'id' => 'new-year-25',
                    'badge' => ['en' => 'New Year', 'bn' => 'নতুন বছর'],
                    'message' => ['en' => '🌸 New year, new start — enjoy 25% off!', 'bn' => '🌸 নতুন বছরে নতুন শুরু, সাথে থাকুক ২৫% ছাড়!'],
                    'href' => '/products',
                    'enabled' => true,
                ],
            ],
        ], null, 20);
    }
}
