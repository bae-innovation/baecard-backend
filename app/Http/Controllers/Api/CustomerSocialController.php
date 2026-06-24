<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerSocial\StoreCustomerSocialRequest;
use App\Http\Requests\CustomerSocial\UpdateCustomerSocialRequest;
use App\Services\CustomerSocialService;
use Illuminate\Http\Request;

class CustomerSocialController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected CustomerSocialService $customerSocialService
    ) {}

    public function index(int $customerId)
    {
        return $this->customerSocialService->list($customerId);
    }

    public function store(StoreCustomerSocialRequest $request)
    {
        return $this->webOrBack(
            $request,
            $this->customerSocialService->create($request->validated()),
            'Social link added.',
        );
    }

    public function update(UpdateCustomerSocialRequest $request, int $id)
    {
        return $this->webOrBack(
            $request,
            $this->customerSocialService->update($id, $request->validated()),
            'Social link updated.',
        );
    }

    public function destroy(Request $request, int $id)
    {
        return $this->webOrBack(
            $request,
            $this->customerSocialService->delete($id),
            'Social link removed.',
        );
    }
}
