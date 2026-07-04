<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'sku',
        'price',
        'discount_type',
        'discount_value',
        'stock_quantity',
        'image',
        'images',
        'nfc_type',
        'weight',
        'is_active',
        'is_featured',
        'meta_title',
        'meta_description',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'discount_value' => 'decimal:2',
            'weight' => 'decimal:2',
            'images' => 'array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function effectiveUnitPrice(): float
    {
        $base = (float) $this->price;
        $value = (float) ($this->discount_value ?? 0);

        if ($value <= 0) {
            return round($base, 2);
        }

        if ($this->discount_type === 'percentage') {
            return round(max(0, $base - $base * ($value / 100)), 2);
        }

        return round(max(0, $base - $value), 2);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        return asset($this->image);
    }
}
