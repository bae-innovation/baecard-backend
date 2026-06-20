<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\EmailVerificationController;
use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\BusinessCardController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CustomerSocialController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\Role\RoleController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\VendorController;
use Illuminate\Support\Facades\Route;

// Public card endpoint (NFC / QR scan)
Route::get('card/{uid}', [BusinessCardController::class, 'show']);

// Public contact form
Route::post('contact/create', [ContactController::class, 'store']);

// Public product listing
Route::prefix('product')->group(function () {
    Route::get('list', [ProductController::class, 'index']);
    Route::get('show/{id}', [ProductController::class, 'show']);
});

// Public review listing & submission
Route::prefix('review')->group(function () {
    Route::get('list', [ReviewController::class, 'index']);
    Route::get('show/{id}', [ReviewController::class, 'show']);
    Route::post('create', [ReviewController::class, 'store']);
});

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

        Route::prefix('contact')->group(function () {
            Route::middleware('ability:contacts.view')->get('list', [ContactController::class, 'index']);
            Route::middleware('ability:contacts.view')->get('show/{id}', [ContactController::class, 'show']);
            Route::middleware('ability:contacts.view')->patch('mark-read/{id}', [ContactController::class, 'markRead']);
            Route::middleware('ability:contacts.delete')->delete('delete/{id}', [ContactController::class, 'destroy']);
        });

        Route::prefix('product')->group(function () {
            Route::middleware('ability:products.manage')->post('create', [ProductController::class, 'store']);
            Route::middleware('ability:products.manage')->post('update/{id}', [ProductController::class, 'update']);
            Route::middleware('ability:products.manage')->delete('delete/{id}', [ProductController::class, 'destroy']);
        });

        Route::prefix('review')->group(function () {
            Route::middleware('ability:reviews.manage')->put('update/{id}', [ReviewController::class, 'update']);
            Route::middleware('ability:reviews.manage')->delete('delete/{id}', [ReviewController::class, 'destroy']);
            Route::middleware('ability:reviews.manage')->patch('toggle-visibility/{id}', [ReviewController::class, 'toggleVisibility']);
        });

        Route::prefix('vendor')->group(function () {
            Route::middleware('ability:vendors.view')->get('list', [VendorController::class, 'index']);
            Route::middleware('ability:vendors.view')->get('show/{id}', [VendorController::class, 'show']);
            Route::middleware('ability:vendors.manage')->post('create', [VendorController::class, 'store']);
            Route::middleware('ability:vendors.manage')->post('update/{id}', [VendorController::class, 'update']);
            Route::middleware('ability:vendors.manage')->delete('delete/{id}', [VendorController::class, 'destroy']);
        });

        Route::prefix('order')->group(function () {
            Route::middleware('ability:orders.view')->get('list', [OrderController::class, 'index']);
            Route::middleware('ability:orders.view')->get('show/{id}', [OrderController::class, 'show']);
            Route::middleware('ability:orders.manage')->post('create', [OrderController::class, 'store']);
            Route::middleware('ability:orders.manage')->put('update/{id}', [OrderController::class, 'update']);
            Route::middleware('ability:orders.manage')->delete('delete/{id}', [OrderController::class, 'destroy']);
            Route::middleware('ability:orders.manage')->post('add-payment/{id}', [OrderController::class, 'addPayment']);
        });

        Route::prefix('appointment')->group(function () {
            Route::middleware('ability:appointments.view,appointments.view_own')->get('list', [AppointmentController::class, 'index']);
            Route::middleware('ability:appointments.view,appointments.view_own')->get('show/{id}', [AppointmentController::class, 'show']);
            Route::middleware('ability:appointments.manage,appointments.view_own')->post('create', [AppointmentController::class, 'store']);
            Route::middleware('ability:appointments.manage,appointments.view_own')->put('update/{id}', [AppointmentController::class, 'update']);
            Route::middleware('ability:appointments.manage,appointments.view_own')->delete('delete/{id}', [AppointmentController::class, 'destroy']);
        });

        Route::prefix('customer-social')->group(function () {
            Route::middleware('ability:users.view')->get('list/{customerId}', [CustomerSocialController::class, 'index']);
            Route::middleware('ability:users.view')->post('create', [CustomerSocialController::class, 'store']);
            Route::middleware('ability:users.view')->put('update/{id}', [CustomerSocialController::class, 'update']);
            Route::middleware('ability:users.view')->delete('delete/{id}', [CustomerSocialController::class, 'destroy']);
        });
    });
});
