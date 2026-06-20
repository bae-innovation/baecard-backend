<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\AddPaymentRequest;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderRequest;
use App\Services\OrderService;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

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
        return $this->orderService->create($request->validated());
    }

    public function update(int $id, UpdateOrderRequest $request)
    {
        return $this->orderService->update($id, $request->validated());
    }

    public function addPayment(int $id, AddPaymentRequest $request)
    {
        return $this->orderService->addPayment($id, $request->validated());
    }

    public function destroy(int $id)
    {
        return $this->orderService->delete($id);
    }
}
