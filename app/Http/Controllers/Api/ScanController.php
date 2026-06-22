<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CardCode;
use App\Services\CardCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ScanController extends Controller
{
    public function __construct(
        protected CardCodeService $cardCodeService
    ) {}

    public function scan(Request $request, string $code)
    {
        $cardCode = $this->cardCodeService->findPublishedByCode($code);

        if ($cardCode && $cardCode->user) {
            return redirect()->route('profile.show', [
                'slug' => Str::slug($cardCode->user->name),
                'code' => $cardCode->code,
            ]);
        }

        $pendingCode = CardCode::query()
            ->where('code', strtoupper($code))
            ->firstOrFail();

        if (! Auth::check()) {
            return redirect()->route('login', [
                'redirect' => '/scan/'.$pendingCode->code,
            ]);
        }

        $claimed = $this->cardCodeService->claim($pendingCode->code, Auth::id());

        return redirect()->route('profile.show', [
            'slug' => Str::slug($claimed->user->name),
            'code' => $claimed->code,
        ]);
    }
}
