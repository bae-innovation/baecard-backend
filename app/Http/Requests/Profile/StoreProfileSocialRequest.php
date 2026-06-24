<?php

namespace App\Http\Requests\Profile;

use App\Support\ProfileSocialPlatform;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProfileSocialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('url') && $this->input('url') === '') {
            $this->merge(['url' => null]);
        }

        if ($this->has('label') && $this->input('label') === '') {
            $this->merge(['label' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'platform' => ['required', 'string', Rule::in(ProfileSocialPlatform::all())],
            'platform_value' => ['required', 'string', 'max:255'],
            'url' => ['nullable', 'string', 'max:500'],
            'label' => ['nullable', 'string', 'max:255'],
            'is_primary' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
