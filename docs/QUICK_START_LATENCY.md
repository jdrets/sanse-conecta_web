# 🚀 Quick Start - Simulación de Latencia

## Uso rápido

### Activar latencia (1 segundo)
```bash
php artisan latency:toggle on
php artisan config:clear
```

### Activar con latencia personalizada (2 segundos)
```bash
php artisan latency:toggle on --ms=2000
php artisan config:clear
```

### Desactivar latencia
```bash
php artisan latency:toggle off
php artisan config:clear
```

### Ver estado actual
```bash
php artisan latency:toggle status
```

## Presets recomendados

### Conexión rápida (WiFi local)
```bash
php artisan latency:toggle on --ms=300
```

### Conexión normal (desarrollo)
```bash
php artisan latency:toggle on --ms=1000
```

### Conexión lenta (3G)
```bash
php artisan latency:toggle on --ms=2000
```

### Conexión muy lenta (testing extremo)
```bash
php artisan latency:toggle on --ms=3500
```

## Para qué usar

✅ Probar spinners y estados de loading
✅ Ver cómo se comporta la UX en conexiones lentas
✅ Detectar problemas de sincronización
✅ Verificar que los usuarios no puedan hacer doble submit
✅ Probar feedback visual de las mutaciones
✅ Testing de optimistic updates

## Recomendación

Durante desarrollo normal: **DESACTIVADA**
Antes de commit/PR: **ACTIVADA** (1-2 segundos) para probar UX

## ⚠️ IMPORTANTE

**NUNCA** activar en producción. Solo para desarrollo/testing local.

---

Ver documentación completa en: `docs/SIMULATE_LATENCY.md`

