<?php

namespace Database\Seeders;

use App\Models\IndustryCategory;
use Illuminate\Database\Seeder;

class IndustryCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'AGROINDUSTRIA',
            'ALIMENTOS Y BEBIDAS',
            'AUTOMOTRIZ',
            'CONSTRUCCION',
            'CUERO Y PRODUCTOS DEL CUERO',
            'DESPOSITO',
            'FRACCIONAMIENTO',
            'MADERA Y PRODUCTOS DE LA MADERA',
            'METALMECANICA',
            'METALURGICA',
            'MINERIA',
            'PAPEL Y GRAFICA',
            'PLASTICA',
            'QUIMICA',
            'SERVICIOS',
            'TECNOLOGIA',
            'TEXTIL',
            'TRANSPORTE Y LOGISTICA',
            'OTROS',
        ];

        foreach ($categories as $category) {
            IndustryCategory::create([
                'name' => $category,
            ]);
        }
    }
}
