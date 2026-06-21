<?php

namespace App\Http\Requests\Vendor;

use App\Models\Vendor;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVendorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $vendorId = $this->resolveVendorId();

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('vendors', 'slug')->ignore($vendorId, 'id')],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:5120'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'website' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    private function resolveVendorId(): int
    {
        $vendor = $this->route('vendor') ?? $this->route('id');

        if ($vendor instanceof Vendor) {
            return (int) $vendor->getKey();
        }

        if ($vendor !== null && $vendor !== '') {
            return (int) $vendor;
        }

        return (int) $this->segment(2);
    }
}
