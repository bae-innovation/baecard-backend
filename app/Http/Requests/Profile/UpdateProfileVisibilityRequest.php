<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileVisibilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'bio' => ['sometimes', 'boolean'],
            'phones' => ['sometimes', 'boolean'],
            'emails' => ['sometimes', 'boolean'],
            'social' => ['sometimes', 'boolean'],
            'services' => ['sometimes', 'boolean'],
            'cover' => ['sometimes', 'boolean'],
            'qr' => ['sometimes', 'boolean'],
        ];
    }
}
