<?php

namespace App\Http\Requests\Product;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->resolveProductId();

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($productId, 'id')],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($productId, 'id')],
            'price' => ['nullable', 'numeric', 'min:0'],
            'discount_type' => ['nullable', Rule::in(['percentage', 'fixed'])],
            'discount_value' => ['nullable', 'numeric', 'min:0'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'file', 'mimes:'.implode(',', StoreProductRequest::ALLOWED_IMAGE_MIMES)],
            'images' => ['nullable', 'array'],
            'nfc_type' => ['nullable', 'string', 'max:100'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'image.mimes' => 'Please upload a PNG, JPG, JPEG, AVIF, or WebP image.',
        ];
    }

    private function resolveProductId(): int
    {
        $product = $this->route('product') ?? $this->route('id');

        if ($product instanceof Product) {
            return (int) $product->getKey();
        }

        if ($product !== null && $product !== '') {
            return (int) $product;
        }

        return (int) $this->segment(2);
    }
}
