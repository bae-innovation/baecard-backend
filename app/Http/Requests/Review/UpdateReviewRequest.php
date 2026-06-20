<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255'],
            'rating' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:255'],
            'body' => ['sometimes', 'required', 'string', 'max:5000'],
            'is_visible' => ['nullable', 'boolean'],
        ];
    }
}
