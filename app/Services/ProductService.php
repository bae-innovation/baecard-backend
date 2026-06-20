<?php

namespace App\Services;

use App\Models\Product;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ProductService
{
    use ApiResponseTrait;

    public function __construct(
        protected ImageUploadService $imageUploadService
    ) {}

    public function list(): JsonResponse
    {
        $products = Product::latest()->paginate(10);

        return $this->successResponse($products, 'Products retrieved successfully.');
    }

    public function find(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (! $product) {
            return $this->notFoundResponse('Product not found.');
        }

        return $this->successResponse($product, 'Product retrieved successfully.');
    }

    public function create(array $data): JsonResponse
    {
        $imagePath = null;

        if (request()->hasFile('image')) {
            $imagePath = $this->imageUploadService->store(request()->file('image'), 'product');
        }

        $product = Product::create([
            'name' => $data['name'],
            'slug' => $data['slug'] ?? Str::slug($data['name']),
            'description' => $data['description'] ?? null,
            'short_description' => $data['short_description'] ?? null,
            'sku' => $data['sku'] ?? null,
            'price' => $data['price'] ?? null,
            'discount_type' => $data['discount_type'] ?? null,
            'discount_value' => $data['discount_value'] ?? null,
            'stock_quantity' => $data['stock_quantity'] ?? null,
            'image' => $imagePath,
            'images' => $data['images'] ?? null,
            'nfc_type' => $data['nfc_type'] ?? null,
            'weight' => $data['weight'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'is_featured' => $data['is_featured'] ?? false,
            'meta_title' => $data['meta_title'] ?? null,
            'meta_description' => $data['meta_description'] ?? null,
        ]);

        return $this->successResponse($product, 'Product created successfully.', 201);
    }

    public function update(int $id, array $data): JsonResponse
    {
        $product = Product::find($id);

        if (! $product) {
            return $this->notFoundResponse('Product not found.');
        }

        $fields = collect($data)->except('image')->toArray();

        if (request()->hasFile('image')) {
            $fields['image'] = $this->imageUploadService->replace(
                request()->file('image'),
                $product->image,
                'product'
            );
        }

        $product->update($fields);

        return $this->successResponse($product->fresh(), 'Product updated successfully.');
    }

    public function delete(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (! $product) {
            return $this->notFoundResponse('Product not found.');
        }

        $this->imageUploadService->delete($product->image);
        $product->delete();

        return $this->successResponse(null, 'Product deleted successfully.');
    }
}
