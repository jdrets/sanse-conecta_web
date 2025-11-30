<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SimulateLatency
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Leer configuración
        $enabled = config('app.simulate_latency', false);
        $latencyMs = config('app.simulate_latency_ms', 1000);
        
        // Solo aplicar si está habilitado
        if (!$enabled) {
            return $next($request);
        }
        
        // Excluir assets estáticos para no ralentizar la carga de la interfaz
        $path = $request->path();
        $excludedPatterns = [
            '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', 
            '.woff', '.woff2', '.ttf', '.ico', '.map',
            'hot', 'build/', 'storage/', 'assets/'
        ];
        
        foreach ($excludedPatterns as $pattern) {
            if (str_contains($path, $pattern)) {
                return $next($request);
            }
        }
        
        // Aplicar latencia
        usleep($latencyMs * 1000);
        
        // Procesar petición
        $response = $next($request);
        
        // Agregar header para debugging
        $response->headers->set('X-Simulated-Latency', $latencyMs . 'ms');
        
        return $response;
    }
}
