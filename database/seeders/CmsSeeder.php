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
    }
}
