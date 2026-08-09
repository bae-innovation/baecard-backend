<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->foreignId('created_by')
                ->nullable()
                ->after('user_id')
                ->constrained('users')
                ->nullOnDelete();
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->foreignId('created_by')
                ->nullable()
                ->after('user_id')
                ->constrained('users')
                ->nullOnDelete();
        });

        DB::table('contacts')
            ->whereNotNull('user_id')
            ->update(['created_by' => DB::raw('user_id')]);

        DB::table('reviews')
            ->whereNotNull('user_id')
            ->update(['created_by' => DB::raw('user_id')]);
    }

    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('created_by');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropConstrainedForeignId('created_by');
        });
    }
};
