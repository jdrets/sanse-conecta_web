<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador principal
        User::firstOrCreate(
            ['email' => 'juliandrets@gmail.com'],
            [
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'client_id' => null,
            ]
        );

        // Crear usuario administrador por defecto
        User::firstOrCreate(
            ['email' => 'admin@consultora.com'],
            [
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'client_id' => null,
            ]
        );

        // Crear usuario de prueba
        User::firstOrCreate(
            ['email' => 'test@consultora.com'],
            [
                'password' => Hash::make('password123'),
                'role' => 'user',
                'client_id' => null,
            ]
        );
    }
}
