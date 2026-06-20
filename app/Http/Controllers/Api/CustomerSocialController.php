<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerSocial\StoreCustomerSocialRequest;
use App\Http\Requests\CustomerSocial\UpdateCustomerSocialRequest;
use App\Services\CustomerSocialService;

class CustomerSocialController extends Controller
{
    public function __construct(
        protected CustomerSocialService $customerSocialService
    ) {}

    public function index(int $customerId)
    {
        return $this->customerSocialService->list($customerId);
    }

    public function store(StoreCustomerSocialRequest $request)
    {
        return $this->customerSocialService->create($request->validated());
    }

    public function update(int $id, UpdateCustomerSocialRequest $request)
    {
        return $this->customerSocialService->update($id, $request->validated());
    }

    public function destroy(int $id)
    {
        return $this->customerSocialService->delete($id);
    }
}
