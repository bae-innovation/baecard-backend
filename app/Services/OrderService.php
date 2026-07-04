<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    use ApiResponseTrait;

    public function list(): JsonResponse
    {
        $orders = Order::with(['customer:id,name,email', 'product:id,name', 'payments'])
            ->latest()
            ->paginate(10);

        return $this->successResponse($orders, 'Orders retrieved successfully.');
    }

    public function find(int $id): JsonResponse
    {
        $order = Order::with(['customer:id,name,email,phone', 'product:id,name,price', 'payments', 'creator:id,name'])
            ->find($id);

        if (! $order) {
            return $this->notFoundResponse('Order not found.');
        }

        return $this->successResponse($order, 'Order retrieved successfully.');
    }

    public function createPublicCheckout(array $data): JsonResponse
    {
        return DB::transaction(function () use ($data) {
            $product = Product::query()
                ->where('id', $data['product_id'])
                ->where('is_active', true)
                ->first();

            if (! $product) {
                return $this->notFoundResponse('Product not found.');
            }

            $customer = $this->resolveOrCreateGuestCustomer($data['name'], $data['phone']);
            $quantity = (int) ($data['quantity'] ?? 1);
            $unitPrice = $product->effectiveUnitPrice();

            return $this->create([
                'customer_id' => $customer->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'unit_price' => $unitPrice,
                'quantity' => $quantity,
                'status' => 'pending',
                'payment_status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ]);
        });
    }

    public function create(array $data): JsonResponse
    {
        return DB::transaction(function () use ($data) {
            $quantity = $data['quantity'] ?? 1;
            $unitPrice = (float) $data['unit_price'];
            $subtotal = $unitPrice * $quantity;

            $discountValue = (float) ($data['discount_value'] ?? 0);
            $discountType = $data['discount_type'] ?? null;

            $discountAmount = $this->calculateDiscount($subtotal, $discountType, $discountValue);
            $tax = (float) ($data['tax'] ?? 0);
            $shippingCost = (float) ($data['shipping_cost'] ?? 0);
            $total = max(0, $subtotal - $discountAmount + $tax + $shippingCost);

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'customer_id' => $data['customer_id'],
                'product_id' => $data['product_id'] ?? null,
                'product_name' => $data['product_name'],
                'unit_price' => $unitPrice,
                'quantity' => $quantity,
                'status' => $data['status'] ?? 'pending',
                'payment_status' => $data['payment_status'] ?? 'pending',
                'subtotal' => $subtotal,
                'discount_type' => $discountType,
                'discount_value' => $discountValue,
                'discount_code' => $data['discount_code'] ?? null,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'paid_amount' => 0,
                'due_amount' => $total,
                'notes' => $data['notes'] ?? null,
                'created_by' => request()->user()?->id,
            ]);

            return $this->successResponse(
                $order->load(['customer:id,name,email', 'product:id,name']),
                'Order created successfully.',
                201
            );
        });
    }

    public function update(int $id, array $data): JsonResponse
    {
        return DB::transaction(function () use ($id, $data) {
            $order = Order::find($id);

            if (! $order) {
                return $this->notFoundResponse('Order not found.');
            }

            $quantity = $data['quantity'] ?? $order->quantity;
            $unitPrice = isset($data['unit_price']) ? (float) $data['unit_price'] : (float) $order->unit_price;
            $subtotal = $unitPrice * $quantity;

            $discountValue = (float) ($data['discount_value'] ?? $order->discount_value);
            $discountType = $data['discount_type'] ?? $order->discount_type;

            $discountAmount = $this->calculateDiscount($subtotal, $discountType, $discountValue);
            $tax = (float) ($data['tax'] ?? $order->tax);
            $shippingCost = (float) ($data['shipping_cost'] ?? $order->shipping_cost);
            $total = max(0, $subtotal - $discountAmount + $tax + $shippingCost);
            $paidAmount = (float) $order->paid_amount;
            $dueAmount = max(0, $total - $paidAmount);

            $order->update(array_merge($data, [
                'unit_price' => $unitPrice,
                'quantity' => $quantity,
                'subtotal' => $subtotal,
                'discount_value' => $discountValue,
                'discount_type' => $discountType,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'due_amount' => $dueAmount,
                'payment_status' => $this->resolvePaymentStatus($paidAmount, $total, $order->payment_status),
            ]));

            return $this->successResponse(
                $order->fresh()->load(['customer:id,name,email', 'product:id,name', 'payments']),
                'Order updated successfully.'
            );
        });
    }

    public function addPayment(int $orderId, array $data): JsonResponse
    {
        return DB::transaction(function () use ($orderId, $data) {
            $order = Order::find($orderId);

            if (! $order) {
                return $this->notFoundResponse('Order not found.');
            }

            $payment = Payment::create([
                'order_id' => $order->id,
                'amount' => $data['amount'],
                'payment_method' => $data['payment_method'],
                'reference_number' => $data['reference_number'] ?? null,
                'notes' => $data['notes'] ?? null,
                'paid_at' => $data['paid_at'] ?? now(),
                'created_by' => request()->user()?->id,
            ]);

            $paidAmount = (float) $order->paid_amount + (float) $data['amount'];
            $dueAmount = max(0, (float) $order->total - $paidAmount);

            $order->update([
                'paid_amount' => $paidAmount,
                'due_amount' => $dueAmount,
                'payment_status' => $this->resolvePaymentStatus($paidAmount, (float) $order->total),
            ]);

            return $this->successResponse(
                $order->fresh()->load(['payments', 'customer:id,name,email']),
                'Payment added successfully.',
                201
            );
        });
    }

    public function delete(int $id): JsonResponse
    {
        $order = Order::find($id);

        if (! $order) {
            return $this->notFoundResponse('Order not found.');
        }

        $order->delete();

        return $this->successResponse(null, 'Order deleted successfully.');
    }

    private function resolveOrCreateGuestCustomer(string $name, string $phone): User
    {
        UserRole::ensureExists(UserRole::User);

        $customer = User::role(UserRole::User->value)
            ->where('phone', $phone)
            ->first();

        if ($customer) {
            if ($customer->name !== $name) {
                $customer->update(['name' => $name]);
            }

            return $customer;
        }

        $customer = User::create([
            'name' => $name,
            'email' => $this->uniqueGuestEmail($phone),
            'phone' => $phone,
            'password' => Str::password(32),
            'email_verified_at' => now(),
        ]);

        $customer->assignRole(UserRole::User->value);

        return $customer;
    }

    private function uniqueGuestEmail(string $phone): string
    {
        $base = "guest.{$phone}@orders.baecard.local";
        $email = $base;
        $suffix = 1;

        while (User::where('email', $email)->exists()) {
            $email = str_replace('@', ".{$suffix}@", $base);
            $suffix++;
        }

        return $email;
    }

    private function generateOrderNumber(): string
    {
        do {
            $number = 'ORD-'.now()->format('Ymd').'-'.strtoupper(substr(uniqid(), -6));
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }

    private function calculateDiscount(float $subtotal, ?string $type, float $value): float
    {
        if ($value <= 0 || ! $type) {
            return 0;
        }

        if ($type === 'percentage') {
            return min($subtotal, $subtotal * ($value / 100));
        }

        return min($subtotal, $value);
    }

    private function resolvePaymentStatus(float $paidAmount, float $total, ?string $current = null): string
    {
        if ($paidAmount <= 0) {
            return 'pending';
        }

        if ($paidAmount >= $total) {
            return 'paid';
        }

        return 'partially_paid';
    }
}
