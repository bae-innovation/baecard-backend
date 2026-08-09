<?php

namespace App\Http\Requests\CardCode;

use Illuminate\Foundation\Http\FormRequest;

class StoreCardCodeRequest extends FormRequest
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
            'order_id' => ['required', 'integer', 'exists:orders,id', 'unique:card_codes,order_id'],
        ];
    }
}
