<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customer_socials', function (Blueprint $table) {
            $table->string('platform', 50)->change();
        });
    }

    public function down(): void
    {
        Schema::table('customer_socials', function (Blueprint $table) {
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
            ])->change();
        });
    }
};
