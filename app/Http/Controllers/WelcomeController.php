<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('Welcome', [
            'user' => $user,
        ]);
    }

    public function getPerson()
    {
        // Simulando una respuesta de API
        $response = [
            'status' => 'success',
            'message' => 'Datos obtenidos exitosamente',
            'data' => [
                'id' => 1,
                'nombre' => 'Producto Industrial',
                'descripcion' => 'Descripción del producto industrial',
                'precio' => 1500.00,
                'stock' => 50,
            ],
            'timestamp' => now()->toISOString(),
        ];

        return response()->json($response);
    }
}
