<?php

namespace App\Services;

use App\Http\Resources\AdminBusinessCardResource;
use App\Http\Resources\BusinessCardResource;
use App\Models\BusinessCard;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CardService
{
    use ApiResponseTrait;

    private const UID_LENGTH = 6;

    private const UID_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    public function list(): JsonResponse
    {
        $users = User::with(['roles', 'businessCard'])->get();

        $generated = [];
        $notGenerated = [];

        foreach ($users as $user) {
            if ($user->businessCard) {
                $generated[] = array_merge(
                    $this->formatUserSummary($user),
                    [
                        'uid' => $user->businessCard->uid,
                        'card_url' => $user->businessCard->card_url,
                    ]
                );
            } else {
                $notGenerated[] = $this->formatUserSummary($user);
            }
        }

        return $this->successResponse([
            'generated' => $generated,
            'not_generated' => $notGenerated,
        ], 'Business card status retrieved successfully.');
    }

    public function find(int $userId): JsonResponse
    {
        $user = User::with(['roles', 'businessCard'])->find($userId);

        if (! $user) {
            return $this->notFoundResponse('User not found.');
        }

        return $this->successResponse([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'roles' => $user->roles->pluck('name'),
            'business_card' => $user->businessCard
                ? new AdminBusinessCardResource($user->businessCard)
                : null,
        ], 'Business card retrieved successfully.');
    }

    public function assignToUser(int $userId): JsonResponse
    {
        return DB::transaction(function () use ($userId) {
            $user = User::with('businessCard')->find($userId);

            if (! $user) {
                return $this->notFoundResponse('User not found.');
            }

            if ($user->businessCard) {
                return $this->errorResponse('User already has a business card assigned.', null, 409);
            }

            $businessCard = BusinessCard::create([
                'user_id' => $user->id,
                'uid' => $this->generateUid(),
            ]);

            return $this->successResponse(
                [
                    'user_id' => $user->id,
                    'uid' => $businessCard->uid,
                    'card_url' => $businessCard->card_url,
                ],
                'Business card generated successfully.',
                201
            );
        });
    }

    public function regenerateForUser(int $userId): JsonResponse
    {
        return DB::transaction(function () use ($userId) {
            $user = User::with('businessCard')->find($userId);

            if (! $user) {
                return $this->notFoundResponse('User not found.');
            }

            if (! $user->businessCard) {
                return $this->errorResponse('User does not have a business card assigned.', null, 404);
            }

            $user->businessCard->update([
                'uid' => $this->generateUid(),
            ]);

            return $this->successResponse(
                new AdminBusinessCardResource($user->businessCard->fresh()->load('user.roles')),
                'Business card regenerated successfully.'
            );
        });
    }

    public function getCardByUid(string $uid): JsonResponse
    {
        $businessCard = BusinessCard::with(['user.roles'])
            ->where('uid', strtoupper($uid))
            ->first();

        if (! $businessCard) {
            return $this->notFoundResponse('Business card not found.');
        }

        return $this->successResponse(
            new BusinessCardResource($businessCard),
            'Business card retrieved successfully.'
        );
    }

    private function generateUid(): string
    {
        $maxAttempts = 100;

        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            $uid = $this->buildRandomUid();

            if (! BusinessCard::where('uid', $uid)->exists()) {
                return $uid;
            }
        }

        throw new RuntimeException('Unable to generate unique card UID.');
    }

    private function buildRandomUid(): string
    {
        $characters = self::UID_CHARACTERS;
        $length = strlen($characters);
        $uid = '';

        for ($i = 0; $i < self::UID_LENGTH; $i++) {
            $uid .= $characters[random_int(0, $length - 1)];
        }

        return $uid;
    }

    /**
     * @return array<string, mixed>
     */
    private function formatUserSummary(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'roles' => $user->roles->pluck('name'),
        ];
    }
}
