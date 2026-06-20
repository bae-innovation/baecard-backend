<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_socials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->enum('platform', [
                'whatsapp',
                'facebook',
                'instagram',
                'twitter',
                'linkedin',
                'tiktok',
                'youtube',
                'snapchat',
                'other',
            ]);
            $table->string('platform_value');
            $table->string('url')->nullable();
            $table->string('label')->nullable();
            $table->string('fn')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_socials');
    }
};
