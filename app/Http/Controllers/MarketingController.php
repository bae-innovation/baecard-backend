<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use App\Models\Order;
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

    public function checkout(string $slug)
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return $this->render('Frontend/Checkout', [
            'product' => $this->mapPublicProduct($product),
        ]);
    }

    public function orderThankYou(string $orderNumber)
    {
        $order = Order::query()
            ->with('customer:id,name,phone')
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        return $this->render('Frontend/OrderThankYou', [
            'order' => [
                'order_number' => $order->order_number,
                'product_name' => $order->product_name,
                'quantity' => $order->quantity,
                'total' => $order->total,
                'customer_name' => $order->customer?->name,
            ],
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

    public function appointment()
    {
        return $this->render('Frontend/Appointment');
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
            ->map(fn (Product $product) => $this->mapPublicProduct($product))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function mapPublicProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'short_description' => $product->short_description,
            'price' => $product->price,
            'discount_type' => $product->discount_type,
            'discount_value' => $product->discount_value,
            'image_url' => $product->image_url,
        ];
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
            ->get(['id', 'name', 'body', 'rating', 'image'])
            ->map(fn (Review $review) => [
                'id' => $review->id,
                'name' => $review->name,
                'body' => $review->body,
                'rating' => $review->rating,
                'image_url' => $review->image_url,
            ])
            ->values()
            ->all();
    }
}
