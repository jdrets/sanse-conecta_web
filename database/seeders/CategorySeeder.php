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
                'name' => 'Hogar y mantenimiento',
                'icon' => '🛠️',
                'order' => 1,
                'children' => [
                    'Plomería / Gasista',
                    'Electricista',
                    'Albañilería',
                    'Pintura de interiores/exteriores',
                    'Jardinería y paisajismo',
                    'Riego automático (instalación/reparación)',
                    'Carpintería a medida',
                    'Colocador de durlock/steel-frame',
                    'Cerrajería',
                    'Técnico de aires acondicionados',
                    'Técnico de electrodomésticos',
                    'Instalador de cámaras de seguridad',
                    'Colocador de pisos y revestimientos',
                    'Impermeabilización / techista',
                    'Limpieza de canaletas y techos',
                ],
            ],
            [
                'name' => 'Automotor y movilidad',
                'icon' => '🚗',
                'order' => 2,
                'children' => [
                    'Mecánica automotor',
                    'Gomería / reparación de neumáticos',
                    'Lavado y detailing de autos',
                    'Chapa y pintura',
                    'Servicio de grúa / auxilio',
                    'Instalación de alarmas y audio',
                    'Servicio pre-VTV / diagnóstico',
                    'Polarizado y colocación de film',
                    'Cerrajería automotriz',
                ],
            ],
            [
                'name' => 'Limpieza y organización',
                'icon' => '🧼',
                'order' => 3,
                'children' => [
                    'Limpieza de casas',
                    'Limpieza de piletas',
                    'Limpieza de tapizados y sillones',
                    'Lavadero / planchado de ropa',
                    'Organización de espacios / orden del hogar',
                    'Mudanzas y fletes',
                    'Limpieza de vidrios en altura',
                    'Control y desinfección de plagas',
                ],
            ],
            [
                'name' => 'Cuidado y bienestar familiar',
                'icon' => '👶',
                'order' => 4,
                'children' => [
                    'Niñera / cuidado de niños',
                    'Cuidado de adultos mayores',
                    'Paseo y cuidado de mascotas',
                    'Adiestramiento canino',
                    'Guardería de mascotas',
                    'Clases de apoyo escolar',
                    'Tutorías particulares (matemática, idiomas, etc)',
                ],
            ],
            [
                'name' => 'Salud, deporte y estética',
                'icon' => '💪',
                'order' => 5,
                'children' => [
                    'Entrenador personal / functional training',
                    'Yoga / Pilates / Meditación',
                    'Masajista profesional',
                    'Kinesiología a domicilio',
                    'Peluquería a domicilio',
                    'Manicure / Pedicure',
                    'Maquillaje profesional',
                    'Barbero a domicilio',
                    'Cosmetología / Esteticista',
                ],
            ],
            [
                'name' => 'Tecnología y digital',
                'icon' => '💻',
                'order' => 6,
                'children' => [
                    'Soporte técnico de PC/notebooks',
                    'Armado y reparación de redes Wi-Fi',
                    'Desarrollo web / programación',
                    'Diseño gráfico / UX-UI',
                    'Marketing digital y redes sociales',
                    'Fotografía profesional',
                    'Edición de video',
                    'Desarrollo de tiendas online',
                    'Clases de tecnología / herramientas digitales',
                ],
            ],
            [
                'name' => 'Eventos y servicios profesionales',
                'icon' => '🎉',
                'order' => 7,
                'children' => [
                    'DJ / Sonido para eventos',
                    'Catering / Chef particular',
                    'Pastelería para eventos',
                    'Decoración / ambientación',
                    'Bartender para eventos',
                    'Fotografía y video para eventos',
                    'Organización integral de eventos',
                    'Clases y talleres (cocina, arte, música, etc)',
                    'Servicios legales (asesoramientos puntuales)',
                    'Contador / asesor impositivo',
                    'Arquitectura / planos / dirección de obra',
                ],
            ],
            [
                'name' => 'Construcción y exteriores',
                'icon' => '🏗️',
                'order' => 8,
                'children' => [
                    'Parquización y diseño de jardines',
                    'Mantenimiento de espacios comunes',
                    'Piletas (mantenimiento o reparación)',
                    'Perforación de pozos',
                    'Construcción de decks y pérgolas',
                ],
            ],
        ];

        foreach ($categories as $index => $parentData) {
            // Crear categoría padre
            $parent = Category::create([
                'name' => $parentData['name'],
                'slug' => Str::slug($parentData['name']),
                'icon' => $parentData['icon'],
                'is_active' => true,
                'parent_id' => null,
                'order' => $parentData['order'],
            ]);

            // Crear subcategorías
            foreach ($parentData['children'] as $childIndex => $childName) {
                Category::create([
                    'name' => $childName,
                    'slug' => Str::slug($childName),
                    'icon' => null,
                    'is_active' => true,
                    'parent_id' => $parent->id,
                    'order' => $childIndex + 1,
                ]);
            }
        }
    }
}
