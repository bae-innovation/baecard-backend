<?php

namespace App\Services;

use App\Models\CardCode;
use App\Traits\ApiResponseTrait;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class CardCodeService
{
    use ApiResponseTrait;

    private const CODE_LENGTH = 6;

    private const CODE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    public function listPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return CardCode::query()
            ->with('user:id,name,email,phone')
            ->latest()
            ->paginate($perPage);
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
        $cardCode = CardCode::create([
            'code' => strtoupper($data['code']),
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'status' => CardCode::STATUS_PENDING,
        ]);

        return $this->successResponse(
            $cardCode->fresh(),
            'Card code created successfully.',
            201,
        );
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

    public function claim(string $code, int $userId): CardCode
    {
        $cardCode = CardCode::query()
            ->where('code', strtoupper($code))
            ->firstOrFail();

        if ($cardCode->isPublished()) {
            if ((int) $cardCode->user_id === $userId) {
                return $cardCode->load('user');
            }

            abort(409, 'This card code is already linked to another account.');
        }

        if ($cardCode->user_id !== null && (int) $cardCode->user_id !== $userId) {
            abort(409, 'This card code is already linked to another account.');
        }

        $cardCode->update([
            'user_id' => $userId,
            'status' => CardCode::STATUS_PUBLISHED,
        ]);

        return $cardCode->fresh()->load('user');
    }

    public function findPublishedByCode(string $code): ?CardCode
    {
        return CardCode::query()
            ->where('code', strtoupper($code))
            ->where('status', CardCode::STATUS_PUBLISHED)
            ->with('user')
            ->first();
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
