<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all existing records with NULL status to 'normal'
        DB::table('audit_items')
            ->whereNull('status')
            ->update(['status' => 'normal']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to revert this data migration
    }
};
