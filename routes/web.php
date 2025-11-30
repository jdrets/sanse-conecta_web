<?php

use App\Http\Controllers\AuditsController;
use App\Http\Controllers\AuditTypesController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\FilesController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\PublicationLikeController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

// Rutas públicas (sin autenticación)
Route::get('/auth/login', [AuthController::class, 'loginView'])->name('login');
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/register', [AuthController::class, 'registerView'])->name('register');
Route::post('/auth/register', [AuthController::class, 'register']);

// Ruta principal (Home)
Route::get('/', [PublicationController::class, 'home'])->name('home');

// Ruta de prueba para verificar latencia (útil para testing)
Route::get('/test-latency', function () {
    return response()->json([
        'message' => 'Latency test',
        'timestamp' => now()->toIso8601String(),
        'latency_enabled' => config('app.simulate_latency'),
        'latency_ms' => config('app.simulate_latency_ms'),
    ]);
});

// Búsqueda de clasificados (pública)
Route::get('/search', [PublicationController::class, 'search'])->name('publication.search');

// Rutas protegidas (requieren autenticación)
Route::middleware(['auth'])->group(function () {
    // Logout (solo usuarios autenticados)
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('logout');
    // Rutas de clasificados (crear, editar, eliminar)
    // IMPORTANTE: Las rutas específicas deben ir ANTES que las rutas con parámetros dinámicos
    Route::get('/publication/create', [PublicationController::class, 'create'])->name('publication.create');
    Route::post('/publication', [PublicationController::class, 'store'])->name('publication.store');
    Route::get('/publication/{id}/edit', [PublicationController::class, 'edit'])->name('publication.edit');
    Route::put('/publication/{id}', [PublicationController::class, 'update'])->name('publication.update');
    Route::delete('/publication/{id}', [PublicationController::class, 'destroy'])->name('publication.destroy');

    // Rutas de "me gusta"
    Route::post('/publication/{id}/like', [PublicationLikeController::class, 'toggle'])->name('publication.like');

    Route::delete('/audits/{id}', [AuditsController::class, 'delete']);
    
    // rutas de files
    Route::post('/files', [FilesController::class, 'upload']);
    Route::get('/files/{path}', [FilesController::class, 'download'])->name('files.download');

});

// Ver detalle de clasificado (pública) - debe ir después de las rutas específicas
Route::get('/publication/{id}', [PublicationController::class, 'show'])->name('publication.show');

// Ruta para simular respuesta de API
Route::get('/api/response', [WelcomeController::class, 'getPerson']);
