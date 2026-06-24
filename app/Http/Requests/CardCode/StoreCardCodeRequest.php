<?php

namespace App\Http\Requests\CardCode;

use App\Rules\AssignableCardCustomer;
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
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'user_id' => ['nullable', 'integer', 'exists:users,id', new AssignableCardCustomer],
        ];
    }
}
