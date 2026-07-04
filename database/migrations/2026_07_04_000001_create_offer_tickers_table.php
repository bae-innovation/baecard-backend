<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offer_tickers', function (Blueprint $table) {
            $table->id();
            $table->json('message');
            $table->json('badge')->nullable();
            $table->string('href')->nullable();
            $table->string('theme')->default('coral');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offer_tickers');
    }
};
