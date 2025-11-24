<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::getDriverName();
        
        if ($driver === 'mysql') {
            // Modificar el enum para agregar 'error' en MySQL
            DB::statement("ALTER TABLE audit_items MODIFY COLUMN status ENUM('warning', 'normal', 'error') DEFAULT 'normal'");
        } elseif ($driver === 'sqlite') {
            // En SQLite no hay restricción de ENUM real, se comporta como TEXT
            // No es necesario modificar la columna, ya acepta cualquier valor
            // Pero podemos recrearla para mantener consistencia
            Schema::table('audit_items', function (Blueprint $table) {
                $table->string('status', 20)->default('normal')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();
        
        if ($driver === 'mysql') {
            // Revertir a los valores originales en MySQL
            DB::statement("ALTER TABLE audit_items MODIFY COLUMN status ENUM('warning', 'normal') DEFAULT 'normal'");
        }
        // En SQLite no hacemos nada en el down ya que no hay restricción real
    }
};
