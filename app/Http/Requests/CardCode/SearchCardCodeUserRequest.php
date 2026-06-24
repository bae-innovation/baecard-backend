<?php

namespace App\Http\Requests\CardCode;

use Illuminate\Foundation\Http\FormRequest;

class SearchCardCodeUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['nullable', 'string', 'email', 'max:255', 'required_without:phone'],
            'phone' => ['nullable', 'string', 'max:20', 'required_without:email'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required_without' => 'Enter an email or phone number to search.',
            'phone.required_without' => 'Enter an email or phone number to search.',
            'email.email' => 'Please enter a valid email address.',
        ];
    }
}
