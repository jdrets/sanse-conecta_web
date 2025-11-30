<?php

use App\Http\Controllers\AuditsController;
use App\Http\Controllers\AuditTypesController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\FilesController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

// Rutas públicas (sin autenticación)
Route::get('/auth/login', [AuthController::class, 'loginView'])->name('login');
Route::post('/auth/login', [AuthController::class, 'login']);

// Redirección por defecto
// Route::get('/', function () {
//     return redirect('/');
// });
Route::get('/', [WelcomeController::class, 'index']);


// Rutas protegidas (requieren autenticación)
Route::middleware(['auth'])->group(function () {
   // home rutes
    

    Route::delete('/audits/{id}', [AuditsController::class, 'delete']);
    
    // rutas de files
    Route::post('/files', [FilesController::class, 'upload']);
    Route::get('/files/{path}', [FilesController::class, 'download'])->name('files.download');

    // Logout
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

// Ruta para simular respuesta de API
Route::get('/api/response', [WelcomeController::class, 'getPerson']);
