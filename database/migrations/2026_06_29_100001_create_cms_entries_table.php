<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_entries', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('group')->default('marketing');
            $table->string('label');
            $table->json('content');
            $table->unsignedSmallInteger('schema_version')->default(1);
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_entries');
    }
};
