<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('audit_id')->constrained()->onDelete('cascade');
            $table->foreignId('audit_type_item_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->date('expiry_date')->nullable();
            $table->boolean('apply')->default(true)->nullable();
            $table->boolean('complies')->default(false)->nullable();
            $table->string('documents')->nullable();
            $table->text('comments')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_items');
    }
};
