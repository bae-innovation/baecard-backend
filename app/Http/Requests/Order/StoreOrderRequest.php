<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => [
                'required_without:new_customer',
                'prohibits:new_customer',
                'integer',
                'exists:users,id',
            ],
            'new_customer' => ['required_without:customer_id', 'prohibits:customer_id', 'array'],
            'new_customer.name' => ['required_with:new_customer', 'string', 'max:255'],
            'new_customer.email' => ['required_with:new_customer', 'string', 'email', 'max:255', 'unique:users,email'],
            'new_customer.phone' => ['nullable', 'string', 'max:20'],
            'new_customer.password' => ['nullable', 'string', 'min:8'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
            'product_name' => ['required', 'string', 'max:255'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'status' => ['nullable', Rule::in([
                'pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded',
            ])],
            'payment_status' => ['nullable', Rule::in([
                'pending', 'paid', 'partially_paid', 'overdue', 'refunded',
            ])],
            'discount_type' => ['nullable', Rule::in(['percentage', 'fixed', 'coupon'])],
            'discount_value' => ['nullable', 'numeric', 'min:0'],
            'discount_code' => ['nullable', 'string', 'max:100'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'shipping_cost' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
