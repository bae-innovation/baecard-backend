<?php

namespace App\Http\Requests\CardCode;

use Illuminate\Foundation\Http\FormRequest;

class FulfillCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('code')) {
            $this->merge([
                'code' => strtoupper((string) $this->input('code')),
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:8', 'regex:/^[A-Z0-9]+$/', 'unique:card_codes,code'],
            'new_customer' => ['required', 'array'],
            'new_customer.name' => ['required', 'string', 'max:255'],
            'new_customer.email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'new_customer.phone' => ['nullable', 'string', 'max:20'],
            'new_customer.password' => ['nullable', 'string', 'min:8'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
            'product_name' => ['required', 'string', 'max:255'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
