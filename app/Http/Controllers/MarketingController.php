<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use App\Services\CmsService;
use Inertia\Inertia;

class MarketingController extends Controller
{
    public function __construct(
        protected CmsService $cmsService,
    ) {}

    public function home()
    {
        return $this->render('Frontend/Home', [
            'products' => $this->publicProducts(),
            'reviews' => $this->publicReviews(),
        ]);
    }

    public function products()
    {
        return $this->render('Frontend/Products', [
            'products' => $this->publicProducts(),
        ]);
    }

    public function corporate()
    {
        return $this->render('Frontend/Corporate');
    }

    public function security()
    {
        return $this->render('Frontend/Security');
    }

    public function contact()
    {
        return $this->render('Frontend/Contact');
    }

    public function faq()
    {
        return $this->render('Frontend/Faq');
    }

    public function about()
    {
        return $this->render('Frontend/About');
    }

    public function terms()
    {
        return $this->render('Frontend/Terms');
    }

    public function policy()
    {
        return $this->render('Frontend/Policy');
    }

    /**
     * @param  array<string, mixed>  $extra
     */
    private function render(string $page, array $extra = [])
    {
        return Inertia::render($page, array_merge($extra, [
            'marketing' => $this->cmsService->getPublicPayload(),
        ]));
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function publicProducts(): array
    {
        return Product::query()
            ->where('is_active', true)
            ->orderByDesc('price')
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'discount_type' => $product->discount_type,
                'discount_value' => $product->discount_value,
                'image_url' => $product->image_url,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function publicReviews(): array
    {
        return Review::query()
            ->where('is_visible', true)
            ->latest()
            ->limit(12)
            ->get(['id', 'name', 'body', 'rating'])
            ->map(fn (Review $review) => [
                'id' => $review->id,
                'name' => $review->name,
                'body' => $review->body,
                'rating' => $review->rating,
            ])
            ->values()
            ->all();
    }
}
