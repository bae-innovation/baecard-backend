<?php

namespace App\Http\Requests\Appointment;

use Illuminate\Foundation\Http\FormRequest;

class StorePublicAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'guest_name' => ['required', 'string', 'max:255'],
            'guest_phone' => ['required', 'string', 'size:11', 'regex:/^01[0-9]{9}$/'],
            'guest_email' => ['nullable', 'string', 'email', 'max:255'],
            'appointment_date' => ['required', 'date', 'after:now'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'guest_phone.size' => 'Invalid mobile number.',
            'guest_phone.regex' => 'Invalid mobile number.',
        ];
    }
}
