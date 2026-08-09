<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;

class DashboardService
{
    /**
     * @return array{
     *     orders: array{
     *         total: int,
     *         pending: int,
     *         revenue: float,
     *         total_sales: float,
     *         due: float,
     *     },
     *     reviews: array{
     *         total: int,
     *         average_rating: float,
     *         pending_visibility: int,
     *     },
     *     customers: array{total: int},
     *     products: array{total: int, active: int},
     *     contacts: array{total: int, unread: int},
     *     recent_orders: list<array{
     *         id: int,
     *         order_number: string,
     *         customer_name: string,
     *         total: float,
     *         status: string,
     *         payment_status: string,
     *         created_at: string,
     *     }>,
     * }
     */
    public function stats(): array
    {
        $recentOrders = Order::query()
            ->with('customer:id,name')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer?->name ?? '—',
                'total' => (float) $order->total,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at?->toIso8601String() ?? '',
            ])
            ->values()
            ->all();

        return [
            'orders' => [
                'total' => Order::count(),
                'pending' => Order::where('status', 'pending')->count(),
                'revenue' => (float) Order::sum('paid_amount'),
                'total_sales' => (float) Order::sum('total'),
                'due' => (float) Order::sum('due_amount'),
            ],
            'reviews' => [
                'total' => Review::count(),
                'average_rating' => round((float) Review::avg('rating'), 1),
                'pending_visibility' => Review::where('is_visible', false)->count(),
            ],
            'customers' => [
                'total' => Customer::count(),
            ],
            'products' => [
                'total' => Product::count(),
                'active' => Product::where('is_active', true)->count(),
            ],
            'contacts' => [
                'total' => Contact::count(),
                'unread' => Contact::where('is_read', false)->count(),
            ],
            'recent_orders' => $recentOrders,
        ];
    }
}
