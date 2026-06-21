<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreVendorRequest;
use App\Http\Requests\Vendor\UpdateVendorRequest;
use App\Models\Vendor;
use App\Services\VendorService;
use App\Support\InertiaData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected VendorService $vendorService
    ) {}

    public function indexPage(Request $request)
    {
        return Inertia::render('Vendors/Index', [
            'vendors' => InertiaData::paginate(
                Vendor::latest()->paginate($request->integer('per_page', 10))
            ),
        ]);
    }

    public function createPage()
    {
        return Inertia::render('Vendors/Create');
    }

    public function editPage(Vendor $vendor)
    {
        return Inertia::render('Vendors/Edit', [
            'vendor' => $vendor,
        ]);
    }

    public function index()
    {
        return $this->vendorService->list();
    }

    public function show(int $id)
    {
        return $this->vendorService->find($id);
    }

    public function store(StoreVendorRequest $request)
    {
        return $this->webOrJson(
            $request,
            $this->vendorService->create($request->validated()),
            'vendors.index',
            'Vendor created.',
        );
    }

    public function update(UpdateVendorRequest $request, Vendor $vendor)
    {
        return $this->webOrJson(
            $request,
            $this->vendorService->update($vendor->id, $request->validated()),
            'vendors.index',
            'Vendor updated.',
        );
    }

    public function destroy(Request $request, Vendor $vendor)
    {
        return $this->webOrJson(
            $request,
            $this->vendorService->delete($vendor->id),
            'vendors.index',
            'Vendor deleted.',
        );
    }
}
