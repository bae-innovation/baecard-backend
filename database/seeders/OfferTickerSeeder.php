<?php

namespace Database\Seeders;

use App\Models\OfferTicker;
use App\Services\OfferTickerService;
use Illuminate\Database\Seeder;

class OfferTickerSeeder extends Seeder
{
    public function run(): void
    {
        $service = app(OfferTickerService::class);

        if (OfferTicker::query()->exists()) {
            return;
        }

        $migrated = $service->migrateFromCmsEntry();

        if ($migrated > 0) {
            return;
        }

        OfferTicker::create([
            'message' => [
                'en' => '🌸 New year, new start — enjoy 25% off!',
                'bn' => '🌸 নতুন বছরে নতুন শুরু, সাথে থাকুক ২৫% ছাড়!',
            ],
            'badge' => ['en' => 'New Year', 'bn' => 'নতুন বছর'],
            'href' => '/products',
            'theme' => 'coral',
            'is_active' => true,
            'sort_order' => 10,
        ]);

        OfferTicker::create([
            'message' => [
                'en' => '⚡ Free shipping on all NFC card orders this week!',
                'bn' => '⚡ এই সপ্তাহে সব NFC কার্ড অর্ডারে ফ্রি শিপিং!',
            ],
            'badge' => ['en' => 'Limited', 'bn' => 'সীমিত'],
            'href' => '/products',
            'theme' => 'emerald',
            'is_active' => true,
            'sort_order' => 20,
        ]);

        OfferTicker::create([
            'message' => [
                'en' => '✨ Corporate teams get bulk pricing — contact us today!',
                'bn' => '✨ কর্পোরেট টিমের জন্য বাল্ক প্রাইস — আজই যোগাযোগ করুন!',
            ],
            'badge' => ['en' => 'Corporate', 'bn' => 'কর্পোরেট'],
            'href' => '/corporate',
            'theme' => 'violet',
            'is_active' => true,
            'sort_order' => 30,
        ]);
    }
}
