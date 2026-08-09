<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\CardCode;
use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use App\Support\PhoneSearch;
use App\Traits\ApiResponseTrait;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CardCodeService
{
    use ApiResponseTrait;

    private const CODE_LENGTH = 6;

    private const CODE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    public function __construct(
        protected CustomerResolver $customerResolver,
        protected OrderService $orderService,
    ) {}

    public function listPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return CardCode::query()
            ->with([
                'user:id,name,email,phone',
                'order:id,order_number,customer_id,source,status',
            ])
            ->latest()
            ->paginate($perPage);
    }

    public function availableOrdersForCustomer(int $customerId): JsonResponse
    {
        $this->customerResolver->findByIdForOrder($customerId);

        $orders = Order::query()
            ->where('customer_id', $customerId)
            ->whereDoesntHave('cardCode')
            ->with('product:id,name')
            ->latest()
            ->get(['id', 'order_number', 'source', 'product_id', 'product_name', 'status', 'created_at']);

        return $this->successResponse($orders, 'Available orders retrieved successfully.');
    }

    public function generateUniqueCode(): string
    {
        $maxAttempts = 100;

        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            $code = $this->buildRandomCode();

            if (! CardCode::where('code', $code)->exists()) {
                return $code;
            }
        }

        throw new RuntimeException('Unable to generate unique card code.');
    }

    public function create(array $data): JsonResponse
    {
        return DB::transaction(function () use ($data) {
            $order = Order::query()->find($data['order_id']);

            if (! $order) {
                return $this->notFoundResponse('Order not found.');
            }

            if ($order->cardCode()->exists()) {
                return $this->errorResponse(
                    'This order already has a card linked to it.',
                    null,
                    422,
                );
            }

            $cardCode = CardCode::create([
                'code' => strtoupper($data['code']),
                'order_id' => $order->id,
                'user_id' => $order->customer_id,
                'status' => CardCode::STATUS_PENDING,
            ]);

            $this->advanceOrderStatusAfterCardCreated($order);

            return $this->successResponse(
                $cardCode->fresh()->load([
                    'user:id,name,email,phone',
                    'order:id,order_number,customer_id,source,status',
                ]),
                'Card code created successfully.',
                201,
            );
        });
    }

    public function fulfill(array $data): JsonResponse
    {
        return DB::transaction(function () use ($data) {
            $customer = $this->customerResolver->createFromAdmin($data['new_customer']);

            $orderResponse = $this->orderService->create([
                'customer_id' => $customer->id,
                'product_id' => $data['product_id'] ?? null,
                'product_name' => $data['product_name'],
                'unit_price' => $data['unit_price'],
                'quantity' => $data['quantity'] ?? 1,
                'notes' => $data['notes'] ?? null,
                'source' => 'custom',
            ]);

            $orderPayload = $orderResponse->getData(true);
            $orderId = (int) ($orderPayload['data']['id'] ?? 0);

            if ($orderId <= 0) {
                return $this->errorResponse('Unable to create order for fulfillment.', null, 500);
            }

            return $this->create([
                'code' => $data['code'],
                'order_id' => $orderId,
            ]);
        });
    }

    public function delete(int $id): JsonResponse
    {
        $cardCode = CardCode::find($id);

        if (! $cardCode) {
            return $this->notFoundResponse('Card code not found.');
        }

        $cardCode->delete();

        return $this->successResponse(null, 'Card code deleted successfully.');
    }

    public function findByCode(string $code): ?CardCode
    {
        return CardCode::query()
            ->where('code', strtoupper($code))
            ->first();
    }

    public function findByCodePublic(string $code): JsonResponse
    {
        $cardCode = $this->findByCode($code);

        if (! $cardCode) {
            return $this->notFoundResponse('Code does not exist.');
        }

        $cardCode->loadMissing('user:id,name,email,phone');

        return $this->successResponse([
            'code' => $cardCode->code,
            'name' => $cardCode->display_name,
            'phone' => $cardCode->user?->phone ?? $cardCode->phone,
            'status' => $cardCode->status,
            'scan_url' => $cardCode->scan_url,
            'profile_url' => $cardCode->profile_url,
            'user' => $cardCode->user ? [
                'id' => $cardCode->user->id,
                'name' => $cardCode->user->name,
                'email' => $cardCode->user->email,
                'phone' => $cardCode->user->phone,
            ] : null,
        ], 'Card code retrieved successfully.');
    }

    public function searchCustomers(?string $email, ?string $phone): JsonResponse
    {
        if ($email) {
            $customers = Customer::query()
                ->select(['id', 'name', 'email', 'phone'])
                ->where('email', $email)
                ->orderBy('name')
                ->limit(10)
                ->get();
        } else {
            $searchPhone = trim($phone ?? '');

            $customers = Customer::query()
                ->select(['id', 'name', 'email', 'phone'])
                ->whereNotNull('phone')
                ->where('phone', '!=', '')
                ->orderBy('name')
                ->limit(100)
                ->get()
                ->filter(
                    fn (Customer $customer) => PhoneSearch::matches(
                        $customer->phone,
                        $searchPhone,
                    ),
                )
                ->take(10)
                ->values();
        }

        return $this->successResponse(
            $customers,
            $customers->isEmpty()
                ? 'No matching customers found.'
                : 'Customers retrieved successfully.',
        );
    }

    public function assignUser(int $cardCodeId, int $userId): JsonResponse
    {
        $cardCode = CardCode::find($cardCodeId);

        if (! $cardCode) {
            return $this->notFoundResponse('Card code not found.');
        }

        if ($cardCode->order_id !== null) {
            return $this->errorResponse(
                'This card is linked to an order. The customer is derived from the order.',
                null,
                422,
            );
        }

        if (
            $cardCode->isPublished()
            && $cardCode->user_id !== null
            && (int) $cardCode->user_id !== $userId
        ) {
            return $this->errorResponse(
                'This card code is already assigned to another user.',
                null,
                409,
            );
        }

        $validationError = $this->validateCustomerAssignment($userId);

        if ($validationError !== null) {
            return $validationError;
        }

        $cardCode->update([
            'user_id' => $userId,
            'status' => CardCode::STATUS_PENDING,
        ]);

        return $this->successResponse(
            $cardCode->fresh()->load('user:id,name,email,phone'),
            'User assigned to card code successfully.',
        );
    }

    public function claim(string $code, int $userId): CardCode
    {
        $user = User::query()->findOrFail($userId);

        return $this->activatePendingCode($code, $user);
    }

    public function linkUserToPendingCard(string $code, User $user): void
    {
        $cardCode = CardCode::query()
            ->where('code', strtoupper($code))
            ->firstOrFail();

        if ($cardCode->isPublished()) {
            abort(409, 'This card code is already active.');
        }

        if ($cardCode->user_id !== null && (int) $cardCode->user_id !== (int) $user->id) {
            abort(403, 'This card code is linked to another account.');
        }

        $this->ensureUserMatchesOrderCustomer($cardCode, $user);

        $cardCode->update([
            'user_id' => $user->id,
            'status' => CardCode::STATUS_PENDING,
        ]);
    }

    public function activatePendingCode(string $code, User $user): CardCode
    {
        $cardCode = CardCode::query()
            ->where('code', strtoupper($code))
            ->firstOrFail();

        if ($cardCode->isPublished()) {
            if ((int) $cardCode->user_id === (int) $user->id) {
                return $cardCode->load('user');
            }

            abort(409, 'This card code is already linked to another account.');
        }

        if (! $user->hasVerifiedEmail()) {
            abort(403, 'Verify your email address to activate this card.');
        }

        if ($cardCode->user_id === null) {
            $this->ensureUserMatchesOrderCustomer($cardCode, $user);
        } elseif ((int) $cardCode->user_id !== (int) $user->id) {
            abort(403, 'This card code is linked to another account.');
        }

        $cardCode->update([
            'user_id' => $user->id,
            'status' => CardCode::STATUS_PUBLISHED,
        ]);

        $this->advanceOrderStatusAfterCardVerified($cardCode);

        return $cardCode->fresh()->load(['user', 'order:id,order_number,status']);
    }

    public function findPublishedByCode(string $code): ?CardCode
    {
        return CardCode::query()
            ->where('code', strtoupper($code))
            ->where('status', CardCode::STATUS_PUBLISHED)
            ->with('user')
            ->first();
    }

    private function validateCustomerAssignment(int $userId): ?JsonResponse
    {
        try {
            $this->ensureCustomerRole($userId);
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $exception) {
            return $this->errorResponse(
                $exception->getMessage(),
                null,
                $exception->getStatusCode(),
            );
        }

        return null;
    }

    private function ensureCustomerRole(int $userId): void
    {
        $user = User::query()->find($userId);

        if (! $user) {
            abort(422, 'The selected user does not exist.');
        }

        if (! $user->hasRole(UserRole::User->value)) {
            abort(
                422,
                'Only customer accounts can be assigned to a card code. '
                .'Create the account under Customer Management, not Access Control.',
            );
        }
    }

    private function ensureUserMatchesOrderCustomer(CardCode $cardCode, User $user): void
    {
        if ($cardCode->order_id === null) {
            $this->ensureCustomerRole((int) $user->id);

            return;
        }

        $cardCode->loadMissing('order:id,customer_id');

        if ((int) $cardCode->order?->customer_id !== (int) $user->id) {
            abort(403, 'This card is linked to a different customer order.');
        }
    }

    private function advanceOrderStatusAfterCardCreated(Order $order): void
    {
        if ($order->status !== 'pending') {
            return;
        }

        $order->update(['status' => 'processing']);
    }

    private function advanceOrderStatusAfterCardVerified(CardCode $cardCode): void
    {
        if ($cardCode->order_id === null) {
            return;
        }

        $order = Order::query()->find($cardCode->order_id);

        if (! $order || $order->status !== 'processing') {
            return;
        }

        $order->update(['status' => 'confirmed']);
    }

    private function buildRandomCode(): string
    {
        $characters = self::CODE_CHARACTERS;
        $length = strlen($characters);
        $code = '';

        for ($i = 0; $i < self::CODE_LENGTH; $i++) {
            $code .= $characters[random_int(0, $length - 1)];
        }

        return $code;
    }
}
