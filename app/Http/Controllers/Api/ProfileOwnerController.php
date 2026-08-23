<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ProfilePreviewData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileOwnerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('Owner/Home', ProfilePreviewData::forUser($user));
    }
}
