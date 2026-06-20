<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Services\ProductService;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    public function index()
    {
        return $this->productService->list();
    }

    public function show(int $id)
    {
        return $this->productService->find($id);
    }

    public function store(StoreProductRequest $request)
    {
        return $this->productService->create($request->validated());
    }

    public function update(int $id, UpdateProductRequest $request)
    {
        return $this->productService->update($id, $request->validated());
    }

    public function destroy(int $id)
    {
        return $this->productService->delete($id);
    }
}
