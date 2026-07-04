<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\OfferTicker\StoreOfferTickerRequest;
use App\Http\Requests\OfferTicker\UpdateOfferTickerRequest;
use App\Models\OfferTicker;
use App\Services\OfferTickerService;
use App\Support\InertiaData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfferTickerController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected OfferTickerService $offerTickerService,
    ) {}

    public function indexPage(Request $request)
    {
        return Inertia::render('OfferTickers/Index', [
            'offerTickers' => InertiaData::paginate(
                OfferTicker::query()
                    ->orderBy('sort_order')
                    ->orderByDesc('id')
                    ->paginate($request->integer('per_page', 10))
            ),
            'themes' => OfferTicker::THEMES,
        ]);
    }

    public function createPage()
    {
        return Inertia::render('OfferTickers/Create', [
            'themes' => OfferTicker::THEMES,
        ]);
    }

    public function editPage(OfferTicker $offerTicker)
    {
        return Inertia::render('OfferTickers/Edit', [
            'offerTicker' => $offerTicker,
            'themes' => OfferTicker::THEMES,
        ]);
    }

    public function store(StoreOfferTickerRequest $request)
    {
        return $this->webOrJson(
            $request,
            $this->offerTickerService->create($request->validated()),
            'offer-tickers.index',
            'Offer ticker created.',
        );
    }

    public function update(UpdateOfferTickerRequest $request, OfferTicker $offerTicker)
    {
        return $this->webOrJson(
            $request,
            $this->offerTickerService->update($offerTicker->id, $request->validated()),
            'offer-tickers.index',
            'Offer ticker updated.',
        );
    }

    public function toggleActive(Request $request, OfferTicker $offerTicker)
    {
        return $this->webOrJson(
            $request,
            $this->offerTickerService->toggleActive($offerTicker->id),
            'offer-tickers.index',
            'Offer ticker status updated.',
        );
    }

    public function destroy(Request $request, OfferTicker $offerTicker)
    {
        return $this->webOrJson(
            $request,
            $this->offerTickerService->delete($offerTicker->id),
            'offer-tickers.index',
            'Offer ticker deleted.',
        );
    }
}
