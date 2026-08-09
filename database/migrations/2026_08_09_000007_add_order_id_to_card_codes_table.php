<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('card_codes', function (Blueprint $table) {
            $table->foreignId('order_id')
                ->nullable()
                ->after('user_id')
                ->constrained()
                ->nullOnDelete();
        });

        Schema::table('card_codes', function (Blueprint $table) {
            $table->unique('order_id');
        });
    }

    public function down(): void
    {
        Schema::table('card_codes', function (Blueprint $table) {
            $table->dropUnique(['order_id']);
            $table->dropConstrainedForeignId('order_id');
        });
    }
};
