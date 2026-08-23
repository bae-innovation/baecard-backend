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
use App\Http\Controllers\Api\OfferTickerController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProfileOwnerController;
use App\Http\Controllers\Api\ProfileContentController;
use App\Http\Controllers\Api\ProfileTemplateController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\Role\RoleController;
use App\Http\Controllers\Api\ScanController;
use App\Http\Controllers\Api\SiteSocialController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\MarketingController;
use App\Support\InertiaErrorResponder;
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

    Route::post('order/create', [OrderController::class, 'storePublic']);

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
Route::get('/products/{slug}/order', [MarketingController::class, 'checkout'])->name('products.checkout');
Route::get('/order/thank-you/{orderNumber}', [MarketingController::class, 'orderThankYou'])->name('order.thank-you');
Route::get('/corporate', [MarketingController::class, 'corporate'])->name('corporate');
Route::get('/security', [MarketingController::class, 'security'])->name('security');
Route::get('/contact', [MarketingController::class, 'contact'])->name('contact');
Route::get('/appointment', [MarketingController::class, 'appointment'])->name('appointment');
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
});

Route::get('reset-password', function (Request $request) {
    $token = $request->query('token');
    $email = $request->query('email');

    return Inertia::render('Auth/ResetPassword', [
        'email' => $email,
        'token' => $token,
        'isInvite' => filled($token) && filled($email),
    ]);
})->name('password.reset');

Route::post('reset-password', [ForgotPasswordController::class, 'reset']);

Route::post('logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

Route::get('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verifyWeb'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify.web');

Route::middleware('auth')->group(function () {
    Route::get('email/verify', [EmailVerificationController::class, 'notice'])
        ->name('verification.notice');
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
    Route::get('/dashboard', [DashboardController::class, 'indexPage'])
        ->middleware('permission:dashboard.analytics.view,dashboard.*')
        ->name('dashboard');

    // Products (admin — public catalog lives at GET /products)
    Route::prefix('admin/products')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'indexPage'])
            ->middleware('permission:product.product.view')
            ->name('index');
        Route::get('create', [ProductController::class, 'createPage'])
            ->middleware('permission:product.product.create')
            ->name('create');
        Route::post('/', [ProductController::class, 'store'])
            ->middleware('permission:product.product.create')
            ->name('store');
        Route::get('{product}/edit', [ProductController::class, 'editPage'])
            ->middleware('permission:product.product.update')
            ->name('edit');
        Route::put('{product}', [ProductController::class, 'update'])
            ->middleware('permission:product.product.update')
            ->name('update');
        Route::delete('{product}', [ProductController::class, 'destroy'])
            ->middleware('permission:product.product.delete')
            ->name('destroy');
    });

    // Vendors
    Route::get('vendors', [VendorController::class, 'indexPage'])
        ->middleware('permission:vendor.vendor.view')
        ->name('vendors.index');
    Route::get('vendors/create', [VendorController::class, 'createPage'])
        ->middleware('permission:vendor.vendor.create')
        ->name('vendors.create');
    Route::post('vendors', [VendorController::class, 'store'])
        ->middleware('permission:vendor.vendor.create')
        ->name('vendors.store');
    Route::get('vendors/{vendor}/edit', [VendorController::class, 'editPage'])
        ->middleware('permission:vendor.vendor.update')
        ->name('vendors.edit');
    Route::put('vendors/{vendor}', [VendorController::class, 'update'])
        ->middleware('permission:vendor.vendor.update')
        ->name('vendors.update');
    Route::delete('vendors/{vendor}', [VendorController::class, 'destroy'])
        ->middleware('permission:vendor.vendor.delete')
        ->name('vendors.destroy');

    // Website orders (from public checkout)
    Route::get('orders', [OrderController::class, 'indexPage'])
        ->middleware('permission:order.website_order.view')
        ->name('orders.index');
    Route::put('orders/{order}', [OrderController::class, 'updateWebsite'])
        ->middleware('permission:order.website_order.update')
        ->name('orders.update');
    Route::post('orders/{order}/payments', [OrderController::class, 'addWebsitePayment'])
        ->middleware('permission:order.website_order.update')
        ->name('orders.payments.store');

    // Custom orders (created in admin)
    Route::prefix('custom-orders')->name('custom-orders.')->group(function () {
        Route::get('/', [OrderController::class, 'customIndexPage'])
            ->middleware('permission:order.custom_order.view')
            ->name('index');
        Route::get('create', [OrderController::class, 'createPage'])
            ->middleware('permission:order.custom_order.create')
            ->name('create');
        Route::post('/', [OrderController::class, 'store'])
            ->middleware('permission:order.custom_order.create')
            ->name('store');
        Route::get('{order}/edit', [OrderController::class, 'editPage'])
            ->middleware('permission:order.custom_order.update')
            ->name('edit');
        Route::put('{order}', [OrderController::class, 'updateCustom'])
            ->middleware('permission:order.custom_order.update')
            ->name('update');
        Route::post('{order}/payments', [OrderController::class, 'addCustomPayment'])
            ->middleware('permission:order.custom_order.update')
            ->name('payments.store');
        Route::delete('{order}', [OrderController::class, 'destroyCustom'])
            ->middleware('permission:order.custom_order.delete')
            ->name('destroy');
    });

    // Contacts
    Route::get('contacts', [ContactController::class, 'indexPage'])
        ->middleware('permission:contact.contact.view,contact.contact.view_own')
        ->name('contacts.index');
    Route::post('contacts', [ContactController::class, 'store'])
        ->middleware('permission:contact.contact.create,contact.contact.create_own')
        ->name('contacts.store');
    Route::patch('contacts/{contact}/mark-read', [ContactController::class, 'markRead'])
        ->middleware('permission:contact.contact.view')
        ->name('contacts.mark-read');
    Route::delete('contacts/{contact}', [ContactController::class, 'destroy'])
        ->middleware('permission:contact.contact.delete,contact.contact.delete_own')
        ->name('contacts.destroy');

    // Reviews
    Route::get('reviews', [ReviewController::class, 'indexPage'])
        ->middleware('permission:review.review.view,review.review.view_own')
        ->name('reviews.index');
    Route::post('reviews', [ReviewController::class, 'store'])
        ->middleware('permission:review.review.create,review.review.create_own')
        ->name('reviews.store');
    Route::patch('reviews/{review}', [ReviewController::class, 'update'])
        ->middleware('permission:review.review.update,review.review.update_own')
        ->name('reviews.update');
    Route::patch('reviews/{review}/toggle-visibility', [ReviewController::class, 'toggleVisibility'])
        ->middleware('permission:review.review.update')
        ->name('reviews.toggle-visibility');
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])
        ->middleware('permission:review.review.delete,review.review.delete_own')
        ->name('reviews.destroy');

    // Appointments
    Route::get('appointments', [AppointmentController::class, 'indexPage'])
        ->middleware('permission:appointment.appointment.view,appointment.appointment.view_own')
        ->name('appointments.index');
    Route::get('appointments/create', [AppointmentController::class, 'createPage'])
        ->middleware('permission:appointment.appointment.create,appointment.appointment.create_own')
        ->name('appointments.create');
    Route::post('appointments', [AppointmentController::class, 'store'])
        ->middleware('permission:appointment.appointment.create,appointment.appointment.create_own')
        ->name('appointments.store');
    Route::get('appointments/{appointment}/edit', [AppointmentController::class, 'editPage'])
        ->middleware('permission:appointment.appointment.update,appointment.appointment.update_own')
        ->name('appointments.edit');
    Route::put('appointments/{appointment}', [AppointmentController::class, 'update'])
        ->middleware('permission:appointment.appointment.update,appointment.appointment.update_own')
        ->name('appointments.update');
    Route::delete('appointments/{appointment}', [AppointmentController::class, 'destroy'])
        ->middleware('permission:appointment.appointment.delete,appointment.appointment.delete_own')
        ->name('appointments.destroy');

    Route::redirect('users', '/access-control/users')
        ->middleware('permission:rbac.user.view');

    // Access control
    Route::get('access-control/permissions', [\App\Http\Controllers\Api\Role\PermissionController::class, 'indexPage'])
        ->middleware('permission:rbac.permission.view')
        ->name('access-control.permissions.index');

    Route::get('access-control/roles/create', [RoleController::class, 'createPage'])
        ->middleware('permission:rbac.role.create')
        ->name('access-control.roles.create');
    Route::get('access-control/roles/{role}/edit', [RoleController::class, 'editPage'])
        ->middleware('permission:rbac.role.update')
        ->name('access-control.roles.edit');
    Route::get('access-control/roles', [RoleController::class, 'indexPage'])
        ->middleware('permission:rbac.role.view,rbac.*')
        ->name('access-control.roles.index');
    Route::post('access-control/roles', [RoleController::class, 'store'])
        ->middleware('permission:rbac.role.create')
        ->name('access-control.roles.store');
    Route::put('access-control/roles/{role}', [RoleController::class, 'update'])
        ->middleware('permission:rbac.role.update')
        ->name('access-control.roles.update');
    Route::delete('access-control/roles/{role}', [RoleController::class, 'destroy'])
        ->middleware('permission:rbac.role.delete')
        ->name('access-control.roles.destroy');

    Route::get('access-control/users', [UserController::class, 'accessControlIndexPage'])
        ->middleware('permission:rbac.user.view')
        ->name('access-control.users.index');
    Route::post('access-control/users', [UserController::class, 'store'])
        ->middleware('permission:rbac.user.create')
        ->name('access-control.users.store');
    Route::put('access-control/users/{user}', [UserController::class, 'update'])
        ->middleware('permission:rbac.user.update')
        ->name('access-control.users.update');
    Route::delete('access-control/users/{user}', [UserController::class, 'destroy'])
        ->middleware('permission:rbac.user.delete')
        ->name('access-control.users.destroy');
    Route::patch('access-control/users/{user}/assign-role', [UserController::class, 'assignRole'])
        ->middleware('permission:rbac.user.assign_role')
        ->name('access-control.users.assign-role');

    Route::get('customers', [CustomerController::class, 'indexPage'])
        ->middleware('permission:customer.customer.view')
        ->name('customers.index');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])
        ->middleware('permission:customer.customer.view')
        ->name('customers.show');
    Route::post('customers', [CustomerController::class, 'store'])
        ->middleware('permission:customer.customer.create')
        ->name('customers.store');
    Route::post('customers/quick-create', [CustomerController::class, 'quickCreate'])
        ->middleware('permission:customer.customer.create')
        ->name('customers.quick-create');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])
        ->middleware('permission:customer.customer.update')
        ->name('customers.update');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])
        ->middleware('permission:customer.customer.delete')
        ->name('customers.destroy');


    // Cards (code + QR workflow)
    Route::get('cards', [CardCodeController::class, 'indexPage'])
        ->middleware('permission:card.card.view')
        ->name('cards.index');
    Route::get('cards/generate', [CardCodeController::class, 'generateCode'])
        ->middleware('permission:card.card.create')
        ->name('cards.generate');
    Route::get('cards/available-orders', [CardCodeController::class, 'availableOrders'])
        ->middleware('permission:card.card.create')
        ->name('cards.available-orders');
    Route::post('cards', [CardCodeController::class, 'store'])
        ->middleware('permission:card.card.create')
        ->name('cards.store');
    Route::post('cards/fulfill', [CardCodeController::class, 'fulfill'])
        ->middleware('permission:card.card.create')
        ->name('cards.fulfill');
    Route::get('cards/search-users', [CardCodeController::class, 'searchUsers'])
        ->middleware('permission:card.card.create,card.card.update')
        ->name('cards.search-users');
    Route::delete('cards/{cardCode}', [CardCodeController::class, 'destroy'])
        ->middleware('permission:card.card.delete')
        ->name('cards.destroy');
    Route::patch('cards/{cardCode}/assign-user', [CardCodeController::class, 'assignUser'])
        ->middleware('permission:card.card.update')
        ->name('cards.assign-user');

    Route::redirect('cards/codes', '/cards');
    Route::redirect('cards/codes/generate', '/cards/generate');
    Route::redirect('cards/codes/search-users', '/cards/search-users');

    Route::redirect('settings', '/settings/general')
        ->middleware('permission:settings.general.manage')
        ->name('settings.index');
    Route::get('settings/{group}', [SettingsController::class, 'show'])
        ->middleware('permission:settings.general.manage')
        ->whereIn('group', ['general'])
        ->name('settings.show');
    Route::match(['post', 'patch'], 'settings/{group}', [SettingsController::class, 'update'])
        ->middleware('permission:settings.general.manage')
        ->whereIn('group', ['general', 'branding', 'business', 'social', 'email'])
        ->name('settings.update');

    Route::prefix('admin/offer-tickers')->name('offer-tickers.')->group(function () {
        Route::get('/', [OfferTickerController::class, 'indexPage'])
            ->middleware('permission:cms.offer_ticker.view')
            ->name('index');
        Route::get('create', [OfferTickerController::class, 'createPage'])
            ->middleware('permission:cms.offer_ticker.manage')
            ->name('create');
        Route::post('/', [OfferTickerController::class, 'store'])
            ->middleware('permission:cms.offer_ticker.manage')
            ->name('store');
        Route::get('{offerTicker}/edit', [OfferTickerController::class, 'editPage'])
            ->middleware('permission:cms.offer_ticker.manage')
            ->name('edit');
        Route::put('{offerTicker}', [OfferTickerController::class, 'update'])
            ->middleware('permission:cms.offer_ticker.manage')
            ->name('update');
        Route::patch('{offerTicker}/toggle-active', [OfferTickerController::class, 'toggleActive'])
            ->middleware('permission:cms.offer_ticker.manage')
            ->name('toggle-active');
        Route::delete('{offerTicker}', [OfferTickerController::class, 'destroy'])
            ->middleware('permission:cms.offer_ticker.manage')
            ->name('destroy');
    });

    Route::prefix('admin/site-social')->name('site-social.')->group(function () {
        Route::get('/', [SiteSocialController::class, 'indexPage'])
            ->middleware('permission:cms.site_social.view')
            ->name('index');
        Route::get('create', [SiteSocialController::class, 'createPage'])
            ->middleware('permission:cms.site_social.manage')
            ->name('create');
        Route::post('/', [SiteSocialController::class, 'store'])
            ->middleware('permission:cms.site_social.manage')
            ->name('store');
        Route::get('{siteSocialLink}/edit', [SiteSocialController::class, 'editPage'])
            ->middleware('permission:cms.site_social.manage')
            ->name('edit');
        Route::put('{siteSocialLink}', [SiteSocialController::class, 'update'])
            ->middleware('permission:cms.site_social.manage')
            ->name('update');
        Route::patch('{siteSocialLink}/toggle-active', [SiteSocialController::class, 'toggleActive'])
            ->middleware('permission:cms.site_social.manage')
            ->name('toggle-active');
        Route::patch('{siteSocialLink}/toggle-floating', [SiteSocialController::class, 'toggleFloating'])
            ->middleware('permission:cms.site_social.manage')
            ->name('toggle-floating');
        Route::delete('{siteSocialLink}', [SiteSocialController::class, 'destroy'])
            ->middleware('permission:cms.site_social.manage')
            ->name('destroy');
    });

    Route::redirect('admin/cms', '/admin/cms/index')
        ->middleware('permission:cms.section.view')
        ->name('admin.cms.redirect');
    Route::get('admin/cms/index', [CmsController::class, 'indexPage'])
        ->middleware('permission:cms.section.view')
        ->name('admin.cms.index');
    Route::get('admin/cms/{key}', [CmsController::class, 'editPage'])
        ->middleware('permission:cms.section.view')
        ->where('key', '[a-z0-9._]+')
        ->name('admin.cms.edit');
    Route::put('admin/cms/{key}', [CmsController::class, 'update'])
        ->middleware('permission:cms.section.manage')
        ->where('key', '[a-z0-9._]+')
        ->name('admin.cms.update');
    Route::post('admin/cms/upload', [CmsController::class, 'upload'])
        ->middleware('permission:cms.section.manage')
        ->name('admin.cms.upload');

    Route::middleware('permission:profile.content.manage,profile.template.manage')->group(function () {
        Route::get('profile', [ProfileOwnerController::class, 'index'])
            ->middleware('permission:profile.template.manage')
            ->name('profile.home');

        Route::get('profile/content', [ProfileContentController::class, 'index'])
            ->middleware('permission:profile.content.manage')
            ->name('profile.content.index');
        Route::match(['put', 'post'], 'profile/content', [ProfileContentController::class, 'update'])
            ->middleware('permission:profile.content.manage')
            ->name('profile.content.update');
        Route::redirect('profile/social', '/profile/content');
        Route::redirect('profile/services', '/profile/content');
        Route::redirect('profile/bio', '/profile/content');

        Route::get('profile/templates', [ProfileTemplateController::class, 'index'])
            ->middleware('permission:profile.template.manage')
            ->name('profile.templates.index');
        Route::redirect('profile/templates/{template}', '/profile/templates')
            ->whereIn('template', ['1', '2', '3', '4']);
        Route::post('profile/templates/{template}/activate', [ProfileTemplateController::class, 'activate'])
            ->middleware('permission:profile.template.manage')
            ->whereIn('template', ['1', '2', '3', '4'])
            ->name('profile.template.activate');
    });
});

Route::get('{code}', [ScanController::class, 'show'])
    ->where('code', '[A-Za-z0-9]{6,8}')
    ->name('card.show');

Route::fallback(function (Request $request) {
    return InertiaErrorResponder::notFound($request);
});
