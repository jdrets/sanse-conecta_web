<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Muestra la vista de login
     */
    public function loginView()
    {
        return Inertia::render('auth/login/page');
    }

    /**
     * Procesa el login del usuario
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();
            
            $user = Auth::user();
            
            return response()->json([
                'success' => true,
                'message' => 'Inicio de sesión exitoso.',
                'redirect' => '/',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
            'errors' => [
                'email' => ['Las credenciales proporcionadas no coinciden con nuestros registros.']
            ]
        ], 422);
    }

    /**
     * Muestra la vista de registro
     */
    public function registerView()
    {
        return Inertia::render('auth/register/page');
    }

    /**
     * Procesa el registro del usuario
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'role' => 'user',
            'publication_max' => 3, // Valor por defecto
        ]);

        Auth::login($user);

        return response()->json([
            'success' => true,
            'message' => 'Registro exitoso.',
            'redirect' => '/',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }

    /**
     * Cierra la sesión del usuario
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/auth/login');
    }
}
