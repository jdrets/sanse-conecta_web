# Simulación de Latencia - Testing de UX

## Descripción

Middleware que simula latencia de red para probar estados de loading, spinners, feedback visual y experiencia de usuario en condiciones de conexión lenta o servidor remoto.

## Configuración

### 1. Variables de entorno (`.env`)

Agrega estas variables a tu archivo `.env`:

```env
# Simulación de latencia (solo para desarrollo)
SIMULATE_LATENCY=true
SIMULATE_LATENCY_MS=1000
```

### 2. Opciones de configuración

| Variable | Valores | Descripción |
|----------|---------|-------------|
| `SIMULATE_LATENCY` | `true` / `false` | Activa/desactiva la simulación |
| `SIMULATE_LATENCY_MS` | Número (ms) | Tiempo de retraso en milisegundos |

### 3. Ejemplos de configuración

#### Deshabilitado (producción o desarrollo rápido)
```env
SIMULATE_LATENCY=false
```

#### Conexión lenta (3G)
```env
SIMULATE_LATENCY=true
SIMULATE_LATENCY_MS=2000
```

#### Conexión media (4G)
```env
SIMULATE_LATENCY=true
SIMULATE_LATENCY_MS=500
```

#### Conexión normal (desarrollo)
```env
SIMULATE_LATENCY=true
SIMULATE_LATENCY_MS=1000
```

#### Conexión muy lenta (testing extremo)
```env
SIMULATE_LATENCY=true
SIMULATE_LATENCY_MS=3000
```

## Cómo funciona

El middleware intercepta **todas** las peticiones HTTP del grupo `web` y agrega un delay antes de procesarlas:

```php
if (env('SIMULATE_LATENCY', false)) {
    $latencyMs = env('SIMULATE_LATENCY_MS', 1000);
    usleep($latencyMs * 1000); // Convierte ms a microsegundos
}
```

## Casos de uso

### ✅ Probar estados de loading

```typescript
// Verás el spinner mientras se carga
<Button disabled={mutation.isPending}>
  {mutation.isPending ? "Cargando..." : "Guardar"}
</Button>
```

### ✅ Probar optimistic updates

```typescript
// Ver si los cambios optimistas funcionan bien
onMutate: async (newData) => {
  // Actualización optimista
  setData(newData);
}
```

### ✅ Probar skeleton screens

```typescript
if (isLoading) {
  return <Skeleton variant="rectangular" height={200} />;
}
```

### ✅ Probar experiencia real de usuario

- Formularios lentos
- Búsquedas con delay
- Carga de imágenes
- Navegación entre páginas
- Likes, comments, etc.

## Recomendaciones

### Durante desarrollo activo
```env
SIMULATE_LATENCY=false  # Para desarrollo rápido
```

### Durante testing de UX
```env
SIMULATE_LATENCY=true
SIMULATE_LATENCY_MS=1500  # Simular servidor remoto
```

### Antes de deploy
```env
SIMULATE_LATENCY=true
SIMULATE_LATENCY_MS=3000  # Testing extremo
```

### En producción
```env
SIMULATE_LATENCY=false  # ¡NUNCA activar en producción!
```

## Qué probar con latencia simulada

### ✅ Autenticación
- [ ] Login muestra spinner
- [ ] Register muestra estado de procesamiento
- [ ] Logout tiene feedback visual

### ✅ Clasificados
- [ ] Crear publicación muestra progreso
- [ ] Editar publicación tiene loading state
- [ ] Eliminar muestra confirmación y loading
- [ ] Like/Unlike tiene feedback inmediato

### ✅ Búsqueda y filtros
- [ ] Búsqueda muestra skeleton o spinner
- [ ] Filtros no se bloquean mientras carga
- [ ] Resultados tienen transiciones suaves

### ✅ Navegación
- [ ] Cambio entre páginas tiene indicador
- [ ] Breadcrumbs no se rompen
- [ ] Menús responden instantáneamente

### ✅ Formularios
- [ ] Validaciones no se pierden
- [ ] Errores se muestran correctamente
- [ ] Usuario no puede hacer doble submit

## Troubleshooting

### La latencia no se aplica

1. Verificar que `SIMULATE_LATENCY=true` en `.env`
2. Limpiar caché: `php artisan config:clear`
3. Reiniciar servidor: `php artisan serve`

### La aplicación está muy lenta

1. Verificar `SIMULATE_LATENCY_MS` - podría ser muy alto
2. Desactivar temporalmente: `SIMULATE_LATENCY=false`

### Solo quiero latencia en algunas rutas

Modificar el middleware para excluir rutas:

```php
public function handle(Request $request, Closure $next): Response
{
    // Excluir assets y ciertas rutas
    $excludedPaths = ['/assets/', '/storage/', '/build/'];
    
    foreach ($excludedPaths as $path) {
        if (str_contains($request->path(), $path)) {
            return $next($request);
        }
    }
    
    // ... resto del código
}
```

## Notas importantes

⚠️ **IMPORTANTE**: 
- Este middleware es SOLO para desarrollo/testing
- NUNCA activar en producción
- No afecta la lógica de la aplicación, solo agrega delay
- Útil para detectar race conditions y problemas de sincronización

## Desactivar completamente

Si quieres desactivarlo sin cambiar el `.env`, comenta la línea en `app/Http/Kernel.php`:

```php
protected $middlewareGroups = [
    'web' => [
        // \App\Http\Middleware\SimulateLatency::class,  // ← Comentar esta línea
        \App\Http\Middleware\EncryptCookies::class,
        // ...
    ],
];
```

