<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreVendorRequest;
use App\Http\Requests\Vendor\UpdateVendorRequest;
use App\Services\VendorService;

class VendorController extends Controller
{
    public function __construct(
        protected VendorService $vendorService
    ) {}

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
        return $this->vendorService->create($request->validated());
    }

    public function update(int $id, UpdateVendorRequest $request)
    {
        return $this->vendorService->update($id, $request->validated());
    }

    public function destroy(int $id)
    {
        return $this->vendorService->delete($id);
    }
}
