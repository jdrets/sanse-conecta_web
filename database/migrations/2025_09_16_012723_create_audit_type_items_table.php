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
        Schema::create('audit_type_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('term');
            $table->text('laws');
            $table->decimal('order', 8, 2);
            $table->foreignId('audit_type_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_type_items');
    }
};
