<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ToggleLatency extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'latency:toggle 
                            {action? : on/off/status - Activa, desactiva o muestra estado}
                            {--ms= : Tiempo de latencia en milisegundos (ej: --ms=1500)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Activa o desactiva la simulación de latencia para testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $envPath = base_path('.env');
        
        if (!file_exists($envPath)) {
            $this->error('Archivo .env no encontrado');
            return Command::FAILURE;
        }

        $envContent = file_get_contents($envPath);
        $action = $this->argument('action') ?? 'status';

        switch (strtolower($action)) {
            case 'on':
                $this->turnOn($envContent, $envPath);
                break;
            case 'off':
                $this->turnOff($envContent, $envPath);
                break;
            case 'status':
                $this->showStatus();
                break;
            default:
                $this->error("Acción inválida. Usa: on, off, o status");
                return Command::FAILURE;
        }

        return Command::SUCCESS;
    }

    private function turnOn($envContent, $envPath)
    {
        $latencyMs = $this->option('ms') ?? 1000;

        // Agregar o actualizar SIMULATE_LATENCY
        if (preg_match('/^SIMULATE_LATENCY=.*$/m', $envContent)) {
            $envContent = preg_replace('/^SIMULATE_LATENCY=.*$/m', 'SIMULATE_LATENCY=true', $envContent);
        } else {
            $envContent .= "\n# Simulación de latencia\nSIMULATE_LATENCY=true\n";
        }

        // Agregar o actualizar SIMULATE_LATENCY_MS
        if (preg_match('/^SIMULATE_LATENCY_MS=.*$/m', $envContent)) {
            $envContent = preg_replace('/^SIMULATE_LATENCY_MS=.*$/m', "SIMULATE_LATENCY_MS={$latencyMs}", $envContent);
        } else {
            $envContent .= "SIMULATE_LATENCY_MS={$latencyMs}\n";
        }

        file_put_contents($envPath, $envContent);
        
        $this->info("✅ Simulación de latencia ACTIVADA");
        $this->info("⏱️  Tiempo: {$latencyMs}ms");
        $this->warn("⚠️  Recuerda ejecutar: php artisan config:clear");
    }

    private function turnOff($envContent, $envPath)
    {
        if (preg_match('/^SIMULATE_LATENCY=.*$/m', $envContent)) {
            $envContent = preg_replace('/^SIMULATE_LATENCY=.*$/m', 'SIMULATE_LATENCY=false', $envContent);
            file_put_contents($envPath, $envContent);
            
            $this->info("✅ Simulación de latencia DESACTIVADA");
            $this->warn("⚠️  Recuerda ejecutar: php artisan config:clear");
        } else {
            $this->warn("ℹ️  SIMULATE_LATENCY no está configurado en .env");
        }
    }

    private function showStatus()
    {
        $enabled = env('SIMULATE_LATENCY', false);
        $latencyMs = env('SIMULATE_LATENCY_MS', 1000);

        $this->info("=== Estado de Simulación de Latencia ===");
        $this->line("");
        
        if ($enabled) {
            $this->info("🟢 Estado: ACTIVADA");
            $this->info("⏱️  Latencia: {$latencyMs}ms");
        } else {
            $this->warn("🔴 Estado: DESACTIVADA");
        }

        $this->line("");
        $this->comment("Comandos disponibles:");
        $this->line("  php artisan latency:toggle on           # Activar (1000ms por defecto)");
        $this->line("  php artisan latency:toggle on --ms=2000 # Activar con 2 segundos");
        $this->line("  php artisan latency:toggle off          # Desactivar");
        $this->line("  php artisan latency:toggle status       # Ver estado actual");
    }
}
