<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\AddPaymentRequest;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Services\OrderService;
use App\Support\InertiaData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected OrderService $orderService
    ) {}

    public function indexPage(Request $request)
    {
        return Inertia::render('Orders/Index', [
            'orders' => InertiaData::paginate(
                Order::with(['customer:id,name,email,phone', 'product:id,name,price', 'payments'])
                    ->latest()
                    ->paginate($request->integer('per_page', 10))
            ),
        ]);
    }

    public function createPage()
    {
        return Inertia::render('Orders/Create', [
            'products' => Product::query()
                ->where('is_active', true)
                ->select('id', 'name', 'price')
                ->orderBy('name')
                ->get(),
            'customers' => Customer::query()
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function editPage(Order $order)
    {
        $order->load(['customer:id,name,email', 'product:id,name,price', 'payments']);

        return Inertia::render('Orders/Edit', [
            'order' => $order,
            'products' => Product::query()
                ->where('is_active', true)
                ->select('id', 'name', 'price')
                ->orderBy('name')
                ->get(),
            'customers' => Customer::query()
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function index()
    {
        return $this->orderService->list();
    }

    public function show(int $id)
    {
        return $this->orderService->find($id);
    }

    public function store(StoreOrderRequest $request)
    {
        return $this->webOrJson(
            $request,
            $this->orderService->create($request->validated()),
            'orders.index',
            'Order created.',
        );
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        return $this->webOrJson(
            $request,
            $this->orderService->update($order->id, $request->validated()),
            'orders.index',
            'Order updated.',
        );
    }

    public function addPayment(AddPaymentRequest $request, Order $order)
    {
        return $this->webOrJson(
            $request,
            $this->orderService->addPayment($order->id, $request->validated()),
            'orders.index',
            'Payment added.',
        );
    }

    public function destroy(Request $request, Order $order)
    {
        return $this->webOrJson(
            $request,
            $this->orderService->delete($order->id),
            'orders.index',
            'Order deleted.',
        );
    }
}
