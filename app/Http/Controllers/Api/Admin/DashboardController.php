<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function indexPage()
    {
        return Inertia::render('Dashboard/Index');
    }
}
