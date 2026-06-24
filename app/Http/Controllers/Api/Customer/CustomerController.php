<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Models\Customer;
use App\Services\CustomerService;
use App\Support\InertiaData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected CustomerService $customerService,
    ) {}

    public function indexPage(Request $request)
    {
        return Inertia::render('Customers/Index', [
            'customers' => InertiaData::paginate(
                Customer::query()
                    ->with('roles')
                    ->latest()
                    ->paginate($request->integer('per_page', 10))
            ),
        ]);
    }

    public function show(Request $request, Customer $customer)
    {
        $customer->load([
            'roles:id,name',
            'customerSocials' => fn ($query) => $query->orderBy('sort_order'),
        ]);

        $payload = [
            'customer' => $customer,
            'socials' => $customer->customerSocials,
        ];

        if (InertiaData::prefersJson($request)) {
            return response()->json([
                'success' => true,
                'message' => 'Customer retrieved successfully.',
                'data' => $payload,
            ]);
        }

        return Inertia::render('Customers/Show', $payload);
    }

    public function store(StoreCustomerRequest $request)
    {
        return $this->webOrJson(
            $request,
            $this->customerService->create($request->validated()),
            'customers.index',
            'Customer created.',
        );
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        return $this->webOrJson(
            $request,
            $this->customerService->update($customer->id, $request->validated()),
            'customers.index',
            'Customer updated.',
        );
    }

    public function destroy(Request $request, Customer $customer)
    {
        return $this->webOrJson(
            $request,
            $this->customerService->delete($customer->id),
            'customers.index',
            'Customer deleted.',
        );
    }
}
