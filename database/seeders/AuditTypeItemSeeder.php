<?php

namespace Database\Seeders;

use App\Models\AuditType;
use App\Models\AuditTypeItem;
use Illuminate\Database\Seeder;

class AuditTypeItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $auditTypes = AuditType::all();

        foreach ($auditTypes as $auditType) {
            $items = [
                [
                    'name' => 'Evaluación de Impacto Ambiental',
                    'term' => 'EIA',
                    'laws' => 'Ley 25.675 - Ley General del Ambiente',
                    'order' => 1.0,
                ],
                [
                    'name' => 'Gestión de Residuos',
                    'term' => 'GR',
                    'laws' => 'Ley 25.916 - Gestión de Residuos Domiciliarios',
                    'order' => 2.0,
                ],
                [
                    'name' => 'Control de Emisiones',
                    'term' => 'CE',
                    'laws' => 'Ley 20.284 - Control de Contaminación Atmosférica',
                    'order' => 3.0,
                ],
            ];

            foreach ($items as $item) {
                AuditTypeItem::create([
                    ...$item,
                    'audit_type_id' => $auditType->id,
                ]);
            }
        }
    }
}
