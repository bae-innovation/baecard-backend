<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    /** @var list<string> */
    public const ALLOWED_IMAGE_MIMES = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $slugRules = ['nullable', 'string', 'max:255'];
        if (filled($this->input('slug'))) {
            $slugRules[] = Rule::unique('products', 'slug');
        }

        $skuRules = ['nullable', 'string', 'max:100'];
        if (filled($this->input('sku'))) {
            $skuRules[] = Rule::unique('products', 'sku');
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => $slugRules,
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'sku' => $skuRules,
            'price' => ['nullable', 'numeric', 'min:0'],
            'discount_type' => ['nullable', Rule::in(['percentage', 'fixed'])],
            'discount_value' => ['nullable', 'numeric', 'min:0'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'file', 'mimes:'.implode(',', self::ALLOWED_IMAGE_MIMES)],
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

    protected function prepareForValidation(): void
    {
        $nullableFields = [
            'slug',
            'description',
            'short_description',
            'sku',
            'discount_type',
            'nfc_type',
            'meta_title',
            'meta_description',
        ];

        $normalized = [];

        foreach ($nullableFields as $field) {
            if ($this->has($field) && $this->input($field) === '') {
                $normalized[$field] = null;
            }
        }

        if ($normalized !== []) {
            $this->merge($normalized);
        }
    }
}
