<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessCardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->user->name,
            'phone' => $this->user->phone,
            'role' => $this->user->roles->first()?->name,
            'card_url' => $this->card_url,
        ];
    }
}
