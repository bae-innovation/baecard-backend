<?php

namespace App\Http\Requests\CustomerSocial;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerSocialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'platform' => ['sometimes', 'required', Rule::in([
                'whatsapp', 'facebook', 'instagram', 'twitter',
                'linkedin', 'tiktok', 'youtube', 'snapchat', 'other',
            ])],
            'platform_value' => ['sometimes', 'required', 'string', 'max:255'],
            'url' => ['nullable', 'string', 'max:500'],
            'label' => ['nullable', 'string', 'max:255'],
            'fn' => ['nullable', 'string', 'max:255'],
            'is_primary' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
