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
Route::get('/', function () {
    return redirect('/audits');
});

// Rutas protegidas (requieren autenticación)
Route::middleware(['auth'])->group(function () {
    // Rutas de clientes
    Route::get('/clients', [ClientsController::class, 'index']);
    Route::get('/clients/create', [ClientsController::class, 'createView']);
    Route::post('/clients', [ClientsController::class, 'create']);
    Route::post('/clients/user-access', [ClientsController::class, 'createUserAccess']);
    Route::put('/clients/user-access', [ClientsController::class, 'modifyUserAccessPassword']);
    Route::delete('/clients/user-access', [ClientsController::class, 'deleteUserAccess']);

    // Rutas de auditorías
    Route::get('/audits', [AuditsController::class, 'index']);
    Route::get('/audits/create', [AuditsController::class, 'createView']);
    Route::get('/audits/types/{auditTypeId}/items', [AuditsController::class, 'getAuditTypeItems']);
    Route::get('/audits/types', [AuditTypesController::class, 'typesView']);
    Route::get('/audits/types/{id}/configuration', [AuditTypesController::class, 'typesConfigurationView']);
    Route::post('/audits/types/{id}/reorder', [AuditTypesController::class, 'reorderItems']);
    Route::post('/audits/types/items', [AuditTypesController::class, 'createItem']);
    Route::put('/audits/types/items/{id}', [AuditTypesController::class, 'editItem']);
    Route::delete('/audits/types/items/{id}', [AuditTypesController::class, 'deleteItem']);

    // rutas de auditorías
    Route::post('/audits/create', [AuditsController::class, 'create']);
    Route::get('/audits/{id}', [AuditsController::class, 'view']);
    Route::get('/audits/{id}/print', [AuditsController::class, 'print']);
    Route::put('/audits/{id}', [AuditsController::class, 'update']);
    Route::delete('/audits/{id}', [AuditsController::class, 'delete']);
    
    // rutas de files
    Route::post('/files', [FilesController::class, 'upload']);
    Route::get('/files/{path}', [FilesController::class, 'download'])->name('files.download');

    // Logout
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

// Ruta para simular respuesta de API
Route::get('/api/response', [WelcomeController::class, 'getPerson']);
