<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Plomería',
                'description' => 'Servicios de instalación y reparación de plomería',
                'icon' => '🔧',
            ],
            [
                'name' => 'Electricidad',
                'description' => 'Servicios de instalación eléctrica y reparaciones',
                'icon' => '💡',
            ],
            [
                'name' => 'Limpieza',
                'description' => 'Servicios de limpieza de casas y oficinas',
                'icon' => '🧹',
            ],
            [
                'name' => 'Jardinería',
                'description' => 'Mantenimiento y diseño de jardines',
                'icon' => '🌱',
            ],
            [
                'name' => 'Carpintería',
                'description' => 'Trabajos en madera, muebles y reparaciones',
                'icon' => '🪚',
            ],
            [
                'name' => 'Pintura',
                'description' => 'Servicios de pintura interior y exterior',
                'icon' => '🎨',
            ],
            [
                'name' => 'Mecánica',
                'description' => 'Reparación y mantenimiento de vehículos',
                'icon' => '🔩',
            ],
            [
                'name' => 'Albañilería',
                'description' => 'Construcción y reparaciones de obra',
                'icon' => '🧱',
            ],
            [
                'name' => 'Cerrajería',
                'description' => 'Apertura y reparación de cerraduras',
                'icon' => '🔑',
            ],
            [
                'name' => 'Tecnología',
                'description' => 'Soporte técnico y reparación de computadoras',
                'icon' => '💻',
            ],
            [
                'name' => 'Cuidado de Mascotas',
                'description' => 'Paseo y cuidado de mascotas',
                'icon' => '🐕',
            ],
            [
                'name' => 'Clases Particulares',
                'description' => 'Clases y tutorías de diferentes materias',
                'icon' => '📚',
            ],
            [
                'name' => 'Mudanzas',
                'description' => 'Servicios de mudanza y transporte',
                'icon' => '📦',
            ],
            [
                'name' => 'Cuidado de Niños',
                'description' => 'Servicios de niñera y cuidado infantil',
                'icon' => '👶',
            ],
            [
                'name' => 'Cocina',
                'description' => 'Servicios de chef a domicilio y catering',
                'icon' => '👨‍🍳',
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'icon' => $category['icon'],
                'is_active' => true,
            ]);
        }
    }
}
