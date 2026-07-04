<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    /** @var list<string> */
    public const ALLOWED_IMAGE_MIMES = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('title') && $this->input('title') === '') {
            $this->merge(['title' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255'],
            'rating' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:255'],
            'body' => ['sometimes', 'required', 'string', 'max:5000'],
            'is_visible' => ['nullable', 'boolean'],
            'image' => ['nullable', 'file', 'mimes:'.implode(',', self::ALLOWED_IMAGE_MIMES)],
        ];
    }
}
