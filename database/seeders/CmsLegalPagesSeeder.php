<?php

namespace Database\Seeders;

use App\Models\CmsEntry;
use App\Support\LegalContent;
use Illuminate\Database\Seeder;

class CmsLegalPagesSeeder extends Seeder
{
    public function run(): void
    {
        $this->upsertPage('page.terms', 'Terms Page', LegalContent::termsPage(), 20);
        $this->upsertPage('page.policy', 'Privacy Policy', LegalContent::policyPage(), 21);
    }

    /**
     * @param  array<string, mixed>  $content
     */
    private function upsertPage(string $key, string $label, array $content, int $sortOrder): void
    {
        CmsEntry::query()->updateOrCreate(
            ['key' => $key],
            [
                'label' => $label,
                'group' => 'pages',
                'content' => $content,
                'is_published' => true,
                'sort_order' => $sortOrder,
            ],
        );
    }
}
