<?php

namespace App\Http\Requests\OfferTicker;

use App\Models\OfferTicker;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOfferTickerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'array'],
            'message.en' => ['required', 'string', 'max:500'],
            'message.bn' => ['required', 'string', 'max:500'],
            'badge' => ['nullable', 'array'],
            'badge.en' => ['nullable', 'string', 'max:100'],
            'badge.bn' => ['nullable', 'string', 'max:100'],
            'href' => ['nullable', 'string', 'max:500'],
            'theme' => ['nullable', 'string', Rule::in(OfferTicker::THEMES)],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
