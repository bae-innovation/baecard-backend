<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\EmailVerificationController;
use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\BusinessCardController;
use App\Http\Controllers\Api\CardCodeController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CustomerSocialController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\Role\RoleController;
use App\Http\Controllers\Api\ScanController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\VendorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public JSON API
|--------------------------------------------------------------------------
*/
Route::prefix('api')->group(function () {
    Route::get('card/{uid}', [BusinessCardController::class, 'show']);

    Route::post('contact/create', [ContactController::class, 'store']);

    Route::prefix('product')->group(function () {
        Route::get('list', [ProductController::class, 'index']);
        Route::get('show/{id}', [ProductController::class, 'show']);
    });

    Route::prefix('review')->group(function () {
        Route::get('list', [ReviewController::class, 'index']);
        Route::get('show/{id}', [ReviewController::class, 'show']);
        Route::post('create', [ReviewController::class, 'store']);
    });

    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'apiLogin']);
        Route::post('forgot-password', [ForgotPasswordController::class, 'forgotPassword']);
        Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword']);
    });

    Route::middleware('auth')->group(function () {
        Route::prefix('auth')->group(function () {
            Route::post('logout', [AuthController::class, 'apiLogout']);
            Route::get('me', [AuthController::class, 'me']);
        });

        Route::prefix('email')->group(function () {
            Route::post('verification-notification', [EmailVerificationController::class, 'sendVerification']);
            Route::get('verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
                ->name('verification.verify');
        });

        Route::middleware('verified')->group(function () {
            Route::prefix('customer-social')->group(function () {
                Route::middleware('ability:users.view')->get('list/{customerId}', [CustomerSocialController::class, 'index']);
                Route::middleware('ability:users.view')->post('create', [CustomerSocialController::class, 'store']);
                Route::middleware('ability:users.view')->put('update/{id}', [CustomerSocialController::class, 'update']);
                Route::middleware('ability:users.view')->delete('delete/{id}', [CustomerSocialController::class, 'destroy']);
            });
        });
    });
});

/*
|--------------------------------------------------------------------------
| Public card scan & profile
|--------------------------------------------------------------------------
*/
Route::get('scan/{code}', [ScanController::class, 'scan'])->name('scan');
Route::get('profile/{slug}/{code}', [ProfileController::class, 'show'])->name('profile.show');

/*
|--------------------------------------------------------------------------
| Guest auth (Inertia)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('login', function (Request $request) {
        return Inertia::render('Auth/Login', [
            'redirect' => $request->query('redirect'),
        ]);
    })->name('login');
    Route::post('login', [AuthController::class, 'login']);

    Route::get('register', [AuthController::class, 'registerPage'])->name('register');
    Route::post('register', [AuthController::class, 'registerWeb']);

    Route::get('forgot-password', fn () => Inertia::render('Auth/ForgotPassword'))->name('password.request');
    Route::post('forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');

    Route::get('reset-password', function (Request $request) {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->query('email'),
            'token' => $request->query('token'),
        ]);
    })->name('password.reset');

    Route::post('reset-password', [ForgotPasswordController::class, 'reset']);
});

Route::post('logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

/*
|--------------------------------------------------------------------------
| Authenticated dashboard (Inertia)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [DashboardController::class, 'indexPage'])->name('dashboard');

    // Products
    Route::get('products', [ProductController::class, 'indexPage'])
        ->middleware('ability:products.view')
        ->name('products.index');
    Route::get('products/create', [ProductController::class, 'createPage'])
        ->middleware('ability:products.manage')
        ->name('products.create');
    Route::post('products', [ProductController::class, 'store'])
        ->middleware('ability:products.manage')
        ->name('products.store');
    Route::get('products/{product}/edit', [ProductController::class, 'editPage'])
        ->middleware('ability:products.manage')
        ->name('products.edit');
    Route::put('products/{product}', [ProductController::class, 'update'])
        ->middleware('ability:products.manage')
        ->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])
        ->middleware('ability:products.manage')
        ->name('products.destroy');

    // Vendors
    Route::get('vendors', [VendorController::class, 'indexPage'])
        ->middleware('ability:vendors.view')
        ->name('vendors.index');
    Route::get('vendors/create', [VendorController::class, 'createPage'])
        ->middleware('ability:vendors.manage')
        ->name('vendors.create');
    Route::post('vendors', [VendorController::class, 'store'])
        ->middleware('ability:vendors.manage')
        ->name('vendors.store');
    Route::get('vendors/{vendor}/edit', [VendorController::class, 'editPage'])
        ->middleware('ability:vendors.manage')
        ->name('vendors.edit');
    Route::put('vendors/{vendor}', [VendorController::class, 'update'])
        ->middleware('ability:vendors.manage')
        ->name('vendors.update');
    Route::delete('vendors/{vendor}', [VendorController::class, 'destroy'])
        ->middleware('ability:vendors.manage')
        ->name('vendors.destroy');

    // Orders
    Route::get('orders', [OrderController::class, 'indexPage'])
        ->middleware('ability:orders.view')
        ->name('orders.index');
    Route::get('orders/create', [OrderController::class, 'createPage'])
        ->middleware('ability:orders.manage')
        ->name('orders.create');
    Route::post('orders', [OrderController::class, 'store'])
        ->middleware('ability:orders.manage')
        ->name('orders.store');
    Route::get('orders/{order}/edit', [OrderController::class, 'editPage'])
        ->middleware('ability:orders.manage')
        ->name('orders.edit');
    Route::put('orders/{order}', [OrderController::class, 'update'])
        ->middleware('ability:orders.manage')
        ->name('orders.update');
    Route::post('orders/{order}/payments', [OrderController::class, 'addPayment'])
        ->middleware('ability:orders.manage')
        ->name('orders.payments.store');
    Route::delete('orders/{order}', [OrderController::class, 'destroy'])
        ->middleware('ability:orders.manage')
        ->name('orders.destroy');

    // Contacts
    Route::get('contacts', [ContactController::class, 'indexPage'])
        ->middleware('ability:contacts.view')
        ->name('contacts.index');
    Route::patch('contacts/{contact}/mark-read', [ContactController::class, 'markRead'])
        ->middleware('ability:contacts.view')
        ->name('contacts.mark-read');
    Route::delete('contacts/{contact}', [ContactController::class, 'destroy'])
        ->middleware('ability:contacts.delete')
        ->name('contacts.destroy');

    // Reviews
    Route::get('reviews', [ReviewController::class, 'indexPage'])
        ->middleware('ability:reviews.view')
        ->name('reviews.index');
    Route::post('reviews', [ReviewController::class, 'store'])
        ->middleware('ability:reviews.manage')
        ->name('reviews.store');
    Route::patch('reviews/{review}', [ReviewController::class, 'update'])
        ->middleware('ability:reviews.manage')
        ->name('reviews.update');
    Route::patch('reviews/{review}/toggle-visibility', [ReviewController::class, 'toggleVisibility'])
        ->middleware('ability:reviews.manage')
        ->name('reviews.toggle-visibility');
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])
        ->middleware('ability:reviews.manage')
        ->name('reviews.destroy');

    // Appointments
    Route::get('appointments', [AppointmentController::class, 'indexPage'])
        ->middleware('ability:appointments.view,appointments.view_own')
        ->name('appointments.index');
    Route::get('appointments/create', [AppointmentController::class, 'createPage'])
        ->middleware('ability:appointments.manage,appointments.view_own')
        ->name('appointments.create');
    Route::post('appointments', [AppointmentController::class, 'store'])
        ->middleware('ability:appointments.manage,appointments.view_own')
        ->name('appointments.store');
    Route::get('appointments/{appointment}/edit', [AppointmentController::class, 'editPage'])
        ->middleware('ability:appointments.manage,appointments.view_own')
        ->name('appointments.edit');
    Route::put('appointments/{appointment}', [AppointmentController::class, 'update'])
        ->middleware('ability:appointments.manage,appointments.view_own')
        ->name('appointments.update');
    Route::delete('appointments/{appointment}', [AppointmentController::class, 'destroy'])
        ->middleware('ability:appointments.manage,appointments.view_own')
        ->name('appointments.destroy');

    // Users management
    Route::get('users', [UserController::class, 'indexPage'])
        ->middleware('ability:users.view')
        ->name('users.index');
    Route::post('users', [UserController::class, 'store'])
        ->middleware('ability:users.create')
        ->name('users.store');
    Route::put('users/{user}', [UserController::class, 'update'])
        ->middleware('ability:users.update')
        ->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])
        ->middleware('ability:users.delete')
        ->name('users.destroy');

    // Business cards
    Route::get('cards', [DashboardController::class, 'cardsPage'])
        ->middleware('ability:dashboard.card.view')
        ->name('cards.index');
    Route::post('cards/{user}/generate', [DashboardController::class, 'generate'])
        ->middleware('ability:dashboard.card.generate')
        ->name('cards.generate');
    Route::post('cards/{user}/regenerate', [DashboardController::class, 'regenerate'])
        ->middleware('ability:dashboard.card.regenerate')
        ->name('cards.regenerate');

    Route::get('cards/codes', [CardCodeController::class, 'indexPage'])
        ->middleware('ability:dashboard.card.view')
        ->name('cards.codes.index');
    Route::get('cards/codes/generate', [CardCodeController::class, 'generateCode'])
        ->middleware('ability:dashboard.card.manage')
        ->name('cards.codes.generate');
    Route::post('cards/codes', [CardCodeController::class, 'store'])
        ->middleware('ability:dashboard.card.manage')
        ->name('cards.codes.store');
    Route::delete('cards/codes/{cardCode}', [CardCodeController::class, 'destroy'])
        ->middleware('ability:dashboard.card.manage')
        ->name('cards.codes.destroy');

    // Access control
    Route::get('access-control/roles', [RoleController::class, 'indexPage'])
        ->middleware('ability:roles.manage')
        ->name('access-control.roles.index');
    Route::post('access-control/roles', [RoleController::class, 'store'])
        ->middleware('ability:roles.manage')
        ->name('access-control.roles.store');
    Route::put('access-control/roles/{role}', [RoleController::class, 'update'])
        ->middleware('ability:roles.manage')
        ->name('access-control.roles.update');
    Route::delete('access-control/roles/{role}', [RoleController::class, 'destroy'])
        ->middleware('ability:roles.manage')
        ->name('access-control.roles.destroy');

    Route::get('access-control/users', [UserController::class, 'accessControlIndexPage'])
        ->middleware('ability:users.view')
        ->name('access-control.users.index');
    Route::patch('access-control/users/{user}/assign-role', [UserController::class, 'assignRole'])
        ->middleware('ability:users.assign_role')
        ->name('access-control.users.assign-role');

    Route::get('customers', [UserController::class, 'customersIndexPage'])
        ->middleware('ability:users.view')
        ->name('customers.index');

    Route::redirect('settings', '/settings/general')
        ->middleware('ability:settings.manage')
        ->name('settings.index');
    Route::get('settings/{group}', [SettingsController::class, 'show'])
        ->middleware('ability:settings.manage')
        ->name('settings.show');
    Route::match(['post', 'patch'], 'settings/{group}', [SettingsController::class, 'update'])
        ->middleware('ability:settings.manage')
        ->whereIn('group', ['general', 'branding', 'business', 'social', 'email'])
        ->name('settings.update');

    // Account
    Route::get('user/account', [UserController::class, 'accountPage'])
        ->name('user.account');
});

Route::fallback(fn () => Inertia::render('Dashboard/Index'));
