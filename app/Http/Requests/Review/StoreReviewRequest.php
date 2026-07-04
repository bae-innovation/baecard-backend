<?php

namespace App\Http\Requests\Review;

use App\Support\RoleAbility;
use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
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

        $user = $this->user();

        if ($user && ! RoleAbility::allows($user, 'reviews.manage')) {
            $this->merge([
                'name' => $user->name,
                'email' => $user->email,
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:5000'],
            'image' => ['nullable', 'file', 'mimes:'.implode(',', self::ALLOWED_IMAGE_MIMES)],
        ];
    }
}
