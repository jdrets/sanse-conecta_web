<?php

use App\Http\Controllers\AuditsController;
use App\Http\Controllers\ClientsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/clients', [ClientsController::class, 'create']);

// Ruta para cron job - Notificaciones de vencimientos
Route::post('/cron/expiry-notifications', [AuditsController::class, 'sendExpiryNotifications']);
 

// Vp(oy_6vWK9&Pe?[