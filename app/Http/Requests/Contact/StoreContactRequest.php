<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $subject = $this->input('subject', 'message');

        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'size:11', 'regex:/^01[0-9]{9}$/'],
            'email' => [
                Rule::requiredIf(in_array($subject, ['message', 'corporate'], true)),
                'nullable',
                'string',
                'email',
                'max:255',
            ],
            'message' => [
                Rule::requiredIf(in_array($subject, ['message', 'corporate'], true)),
                'nullable',
                'string',
                'max:5000',
            ],
            'subject' => ['nullable', 'string', Rule::in(['message', 'order', 'corporate'])],
            'metadata' => ['nullable', 'array'],
            'metadata.product_id' => ['nullable', 'integer', 'exists:products,id'],
            'metadata.product_name' => ['nullable', 'string', 'max:255'],
            'metadata.job_title' => ['nullable', 'string', 'max:255'],
            'metadata.company' => ['nullable', 'string', 'max:255'],
            'metadata.card_amount' => ['nullable', 'string', 'max:255'],
            'metadata.vendor_slug' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.size' => 'Invalid mobile number.',
            'phone.regex' => 'Invalid mobile number.',
        ];
    }
}
