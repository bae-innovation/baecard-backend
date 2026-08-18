<?php

namespace App\Http\Requests\Auth;

use App\Models\CardCode;
use App\Support\CardCodePath;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'The email field is required.',
            'email.email' => 'Please enter a valid email address.',
            'password.required' => 'The password field is required.',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $redirect = $this->input('redirect') ?: $this->query('redirect');

            if (! CardCodePath::isCardCodePath($redirect)) {
                return;
            }

            $cardCode = CardCode::query()
                ->with('user:id,email')
                ->where('code', CardCodePath::codeFromPath($redirect))
                ->first();

            if (
                $cardCode?->user_id !== null
                && $cardCode->user
                && $this->input('email') !== $cardCode->user->email
            ) {
                $validator->errors()->add(
                    'email',
                    'This card is linked to another account. Sign in with the assigned account.',
                );
            }
        });
    }
}