<?php

namespace Database\Seeders;

use App\Models\AuditType;
use Illuminate\Database\Seeder;

class AuditTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $auditTypes = [
            ['name' => 'Auditoria de Gestión Ambiental'],
            ['name' => 'Auditoria de Higiene y Seguridad'],
        ];

        foreach ($auditTypes as $auditType) {
            AuditType::create($auditType);
        }
    }
}
