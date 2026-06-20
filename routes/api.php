<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\EmailVerificationController;
use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\BusinessCardController;
use App\Http\Controllers\Api\Role\RoleController;
use App\Http\Controllers\Api\User\UserController;
use Illuminate\Support\Facades\Route;

// Public card endpoint (NFC / QR scan)
Route::get('card/{uid}', [BusinessCardController::class, 'show']);

// Public Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [ForgotPasswordController::class, 'forgotPassword']);
    Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword']);
});

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });

    Route::prefix('email')->group(function () {
        Route::post('verification-notification', [EmailVerificationController::class, 'sendVerification']);
        Route::get('verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify');
    });

    Route::middleware('verified')->group(function () {

        Route::prefix('user')->group(function () {
            Route::middleware('ability:users.view')->get('list', [UserController::class, 'index']);
            Route::middleware('ability:users.view')->get('show/{id}', [UserController::class, 'show']);
            Route::middleware('ability:users.create')->post('create', [UserController::class, 'store']);
            Route::middleware('ability:users.update')->put('update/{id}', [UserController::class, 'update']);
            Route::middleware('ability:users.delete')->delete('delete/{id}', [UserController::class, 'destroy']);
            Route::middleware('ability:users.assign_role')->patch('assign-role/{id}', [UserController::class, 'assignRole']);
        });

        Route::prefix('role')->group(function () {
            Route::middleware('ability:roles.manage')->get('list', [RoleController::class, 'index']);
            Route::middleware('ability:roles.manage')->get('show/{id}', [RoleController::class, 'show']);
            Route::middleware('ability:roles.manage')->post('create', [RoleController::class, 'store']);
            Route::middleware('ability:roles.manage')->put('update/{id}', [RoleController::class, 'update']);
            Route::middleware('ability:roles.manage')->delete('delete/{id}', [RoleController::class, 'destroy']);
        });

        Route::prefix('admin/dashboard')->group(function () {
            Route::middleware('ability:dashboard.card.view')->get('card/list', [DashboardController::class, 'index']);
            Route::middleware('ability:dashboard.card.view')->get('card/show/{id}', [DashboardController::class, 'show']);
            Route::middleware('ability:dashboard.card.generate')->post('card/generate/{id}', [DashboardController::class, 'generate']);
            Route::middleware('ability:dashboard.card.regenerate')->post('card/regenerate/{id}', [DashboardController::class, 'regenerate']);
        });
    });
});
