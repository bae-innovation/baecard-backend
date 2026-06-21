<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Product;
use App\Services\ProductService;
use App\Support\InertiaData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected ProductService $productService
    ) {}

    public function indexPage(Request $request)
    {
        return Inertia::render('Products/Index', [
            'products' => InertiaData::paginate(
                Product::latest()->paginate($request->integer('per_page', 10))
            ),
        ]);
    }

    public function createPage()
    {
        return Inertia::render('Products/Create');
    }

    public function editPage(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
        ]);
    }

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
        return $this->webOrJson(
            $request,
            $this->productService->create($request->validated()),
            'products.index',
            'Product created.',
        );
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        return $this->webOrJson(
            $request,
            $this->productService->update($product->id, $request->validated()),
            'products.index',
            'Product updated.',
        );
    }

    public function destroy(Request $request, Product $product)
    {
        return $this->webOrJson(
            $request,
            $this->productService->delete($product->id),
            'products.index',
            'Product deleted.',
        );
    }
}
