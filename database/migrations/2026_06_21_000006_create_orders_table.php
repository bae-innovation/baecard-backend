<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name');
            $table->decimal('unit_price', 10, 2);
            $table->unsignedInteger('quantity')->default(1);
            $table->enum('status', [
                'pending',
                'processing',
                'confirmed',
                'shipped',
                'delivered',
                'cancelled',
                'refunded',
            ])->default('pending');
            $table->enum('payment_status', [
                'pending',
                'paid',
                'partially_paid',
                'overdue',
                'refunded',
            ])->default('pending');
            $table->decimal('subtotal', 10, 2);
            $table->enum('discount_type', ['percentage', 'fixed', 'coupon'])->nullable();
            $table->decimal('discount_value', 10, 2)->default(0);
            $table->string('discount_code')->nullable();
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('due_amount', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
