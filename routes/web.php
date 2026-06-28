<?php

use App\Http\Controllers\Api\Admin\CmsController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\EmailVerificationController;
use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\CardCodeController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\Customer\CustomerController;
use App\Http\Controllers\Api\CustomerSocialController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProfileServiceController;
use App\Http\Controllers\Api\ProfileSocialController;
use App\Http\Controllers\Api\ProfileTemplateController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\Role\RoleController;
use App\Http\Controllers\Api\ScanController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\MarketingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public JSON API
|--------------------------------------------------------------------------
*/
Route::prefix('api')->group(function () {
    Route::get('card-code/{code}', [CardCodeController::class, 'showPublic']);

    Route::post('contact/create', [ContactController::class, 'store']);

    Route::post('appointment/create', [AppointmentController::class, 'storePublic']);

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
| Public card profile by code
|--------------------------------------------------------------------------
*/
Route::redirect('get-started/{code}', '/{code}')->where('code', '[A-Za-z0-9]{6,8}');
Route::redirect('scan/{code}', '/{code}')->where('code', '[A-Za-z0-9]{6,8}');

/*
|--------------------------------------------------------------------------
| Public marketing site
|--------------------------------------------------------------------------
*/
Route::get('/', [MarketingController::class, 'home'])->name('home');
Route::get('/products', [MarketingController::class, 'products'])->name('products');
Route::get('/corporate', [MarketingController::class, 'corporate'])->name('corporate');
Route::get('/security', [MarketingController::class, 'security'])->name('security');
Route::get('/contact', [MarketingController::class, 'contact'])->name('contact');
Route::get('/faq', [MarketingController::class, 'faq'])->name('faq');
Route::get('/about', [MarketingController::class, 'about'])->name('about');
Route::get('/terms', [MarketingController::class, 'terms'])->name('terms');
Route::get('/policy', [MarketingController::class, 'policy'])->name('policy');

Route::get('profile/{slug}/{code}', [ProfileController::class, 'show'])
    ->where('code', '[A-Za-z0-9]{6,8}')
    ->name('profile.show');

/*
|--------------------------------------------------------------------------
| Guest auth (Inertia)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'loginPage'])->name('login');
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

Route::middleware('auth')->group(function () {
    Route::get('email/verify', [EmailVerificationController::class, 'notice'])
        ->name('verification.notice');
    Route::get('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verifyWeb'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify.web');
    Route::post('email/verification-notification', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // My Account — permission-free for every authenticated user (no ability check).
    Route::get('user/account', [UserController::class, 'accountPage'])
        ->name('user.account');
    Route::match(['put', 'post'], 'user/account', [UserController::class, 'updateAccount'])
        ->name('user.account.update');
    Route::put('user/account/password', [UserController::class, 'updateAccountPassword'])
        ->name('user.account.password');

    // Appearance — permission-free; theme and accent are stored in the browser only.
    Route::get('settings/appearance', [SettingsController::class, 'appearancePage'])
        ->name('settings.appearance');
});

/*
|--------------------------------------------------------------------------
| Authenticated dashboard (Inertia)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'indexPage'])->name('dashboard');

    // Products (admin — public catalog lives at GET /products)
    Route::prefix('admin/products')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'indexPage'])
            ->middleware('ability:products.view')
            ->name('index');
        Route::get('create', [ProductController::class, 'createPage'])
            ->middleware('ability:products.manage')
            ->name('create');
        Route::post('/', [ProductController::class, 'store'])
            ->middleware('ability:products.manage')
            ->name('store');
        Route::get('{product}/edit', [ProductController::class, 'editPage'])
            ->middleware('ability:products.manage')
            ->name('edit');
        Route::put('{product}', [ProductController::class, 'update'])
            ->middleware('ability:products.manage')
            ->name('update');
        Route::delete('{product}', [ProductController::class, 'destroy'])
            ->middleware('ability:products.manage')
            ->name('destroy');
    });

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
        ->middleware('ability:contacts.view,contacts.view_own')
        ->name('contacts.index');
    Route::post('contacts', [ContactController::class, 'store'])
        ->middleware('ability:contacts.create')
        ->name('contacts.store');
    Route::patch('contacts/{contact}/mark-read', [ContactController::class, 'markRead'])
        ->middleware('ability:contacts.view')
        ->name('contacts.mark-read');
    Route::delete('contacts/{contact}', [ContactController::class, 'destroy'])
        ->middleware('ability:contacts.delete')
        ->name('contacts.destroy');

    // Reviews
    Route::get('reviews', [ReviewController::class, 'indexPage'])
        ->middleware('ability:reviews.view,reviews.view_own')
        ->name('reviews.index');
    Route::post('reviews', [ReviewController::class, 'store'])
        ->middleware('ability:reviews.manage,reviews.create')
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
        ->middleware('ability:appointments.manage')
        ->name('appointments.edit');
    Route::put('appointments/{appointment}', [AppointmentController::class, 'update'])
        ->middleware('ability:appointments.manage')
        ->name('appointments.update');
    Route::delete('appointments/{appointment}', [AppointmentController::class, 'destroy'])
        ->middleware('ability:appointments.manage')
        ->name('appointments.destroy');

    // Legacy redirect
    Route::redirect('users', '/access-control/users')
        ->middleware('ability:users.view');

    // Customers
    Route::get('customers', [CustomerController::class, 'indexPage'])
        ->middleware('ability:users.view')
        ->name('customers.index');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])
        ->middleware('ability:users.view')
        ->name('customers.show');
    Route::post('customers', [CustomerController::class, 'store'])
        ->middleware('ability:users.create')
        ->name('customers.store');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])
        ->middleware('ability:users.update')
        ->name('customers.update');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])
        ->middleware('ability:users.delete')
        ->name('customers.destroy');

    Route::middleware('ability:users.view')->group(function () {
        Route::post('customers/{customer}/social-links', [CustomerSocialController::class, 'store'])
            ->name('customers.social-links.store');
        Route::put('customers/{customer}/social-links/{id}', [CustomerSocialController::class, 'update'])
            ->name('customers.social-links.update');
        Route::delete('customers/{customer}/social-links/{id}', [CustomerSocialController::class, 'destroy'])
            ->name('customers.social-links.destroy');
    });

    // Cards (code + QR workflow)
    Route::get('cards', [CardCodeController::class, 'indexPage'])
        ->middleware('ability:dashboard.card.view')
        ->name('cards.index');
    Route::get('cards/generate', [CardCodeController::class, 'generateCode'])
        ->middleware('ability:dashboard.card.manage')
        ->name('cards.generate');
    Route::post('cards', [CardCodeController::class, 'store'])
        ->middleware('ability:dashboard.card.manage')
        ->name('cards.store');
    Route::get('cards/search-users', [CardCodeController::class, 'searchUsers'])
        ->middleware('ability:dashboard.card.manage')
        ->name('cards.search-users');
    Route::delete('cards/{cardCode}', [CardCodeController::class, 'destroy'])
        ->middleware('ability:dashboard.card.manage')
        ->name('cards.destroy');
    Route::patch('cards/{cardCode}/assign-user', [CardCodeController::class, 'assignUser'])
        ->middleware('ability:dashboard.card.manage')
        ->name('cards.assign-user');

    Route::redirect('cards/codes', '/cards');
    Route::redirect('cards/codes/generate', '/cards/generate');
    Route::redirect('cards/codes/search-users', '/cards/search-users');

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
    Route::post('access-control/users', [UserController::class, 'store'])
        ->middleware('ability:users.create')
        ->name('access-control.users.store');
    Route::put('access-control/users/{user}', [UserController::class, 'update'])
        ->middleware('ability:users.update')
        ->name('access-control.users.update');
    Route::delete('access-control/users/{user}', [UserController::class, 'destroy'])
        ->middleware('ability:users.delete')
        ->name('access-control.users.destroy');
    Route::patch('access-control/users/{user}/assign-role', [UserController::class, 'assignRole'])
        ->middleware('ability:users.assign_role')
        ->name('access-control.users.assign-role');

    Route::redirect('settings', '/settings/general')
        ->middleware('ability:settings.manage')
        ->name('settings.index');
    Route::get('settings/{group}', [SettingsController::class, 'show'])
        ->middleware('ability:settings.manage')
        ->whereIn('group', ['general'])
        ->name('settings.show');
    Route::match(['post', 'patch'], 'settings/{group}', [SettingsController::class, 'update'])
        ->middleware('ability:settings.manage')
        ->whereIn('group', ['general', 'branding', 'business', 'social', 'email'])
        ->name('settings.update');

    Route::redirect('admin/cms', '/admin/cms/index')
        ->middleware('ability:cms.view')
        ->name('admin.cms.redirect');
    Route::get('admin/cms/index', [CmsController::class, 'indexPage'])
        ->middleware('ability:cms.view')
        ->name('admin.cms.index');
    Route::get('admin/cms/{key}', [CmsController::class, 'editPage'])
        ->middleware('ability:cms.view')
        ->where('key', '[a-z0-9._]+')
        ->name('admin.cms.edit');
    Route::put('admin/cms/{key}', [CmsController::class, 'update'])
        ->middleware('ability:cms.manage')
        ->where('key', '[a-z0-9._]+')
        ->name('admin.cms.update');
    Route::post('admin/cms/upload', [CmsController::class, 'upload'])
        ->middleware('ability:cms.manage')
        ->name('admin.cms.upload');

    Route::middleware('ability:profile.manage')->group(function () {
        Route::get('profile/social', [ProfileSocialController::class, 'indexPage'])
            ->name('profile.social.index');
        Route::post('profile/social', [ProfileSocialController::class, 'store'])
            ->name('profile.social.store');
        Route::put('profile/social/{id}', [ProfileSocialController::class, 'update'])
            ->name('profile.social.update');
        Route::delete('profile/social/{id}', [ProfileSocialController::class, 'destroy'])
            ->name('profile.social.destroy');
        Route::post('profile/social/reorder', [ProfileSocialController::class, 'reorder'])
            ->name('profile.social.reorder');

        Route::get('profile/services', [ProfileServiceController::class, 'indexPage'])
            ->name('profile.services.index');
        Route::post('profile/services', [ProfileServiceController::class, 'store'])
            ->name('profile.services.store');
        Route::put('profile/services/{id}', [ProfileServiceController::class, 'update'])
            ->name('profile.services.update');
        Route::delete('profile/services/{id}', [ProfileServiceController::class, 'destroy'])
            ->name('profile.services.destroy');
        Route::post('profile/services/reorder', [ProfileServiceController::class, 'reorder'])
            ->name('profile.services.reorder');

        Route::get('profile/templates/{template}', [ProfileTemplateController::class, 'templatePage'])
            ->whereIn('template', ['1', '2', '3', '4'])
            ->name('profile.template.show');
        Route::post('profile/templates/{template}/activate', [ProfileTemplateController::class, 'activate'])
            ->whereIn('template', ['1', '2', '3', '4'])
            ->name('profile.template.activate');
        Route::patch('profile/visibility', [ProfileTemplateController::class, 'updateVisibility'])
            ->name('profile.visibility.update');
        Route::post('profile/templates/{template}/cover', [ProfileTemplateController::class, 'uploadCover'])
            ->whereIn('template', ['1', '2', '3', '4'])
            ->name('profile.template.cover');
    });
});

Route::get('{code}', [ScanController::class, 'show'])
    ->where('code', '[A-Za-z0-9]{6,8}')
    ->name('card.show');

Route::fallback(function (Request $request) {
    if ($request->user()) {
        return Inertia::render('Dashboard/Index');
    }

    return redirect()->route('home');
});
