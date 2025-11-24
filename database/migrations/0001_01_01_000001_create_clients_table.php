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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address');
            $table->string('cadastral_nomenclature')->nullable();
            $table->string('phone');
            $table->string('cuit')->unique();
            $table->string('contact_name');
            $table->string('responsible_email');
            $table->string('environmental_audit_responsible')->nullable();
            $table->string('safety_audit_responsible')->nullable();
            $table->foreignId('category_id')->constrained('industries_categories')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
