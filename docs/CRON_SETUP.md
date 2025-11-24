# Configuración del Cron Job para Notificaciones de Vencimientos

## Descripción

Este sistema incluye un endpoint público de uso interno que envía notificaciones por correo electrónico sobre los vencimientos de items de auditorías del mes actual.

## Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# Email donde se enviarán las notificaciones
EXPIRY_NOTIFICATION_EMAIL=admin@tuempresa.com

# Configuración de correo (si usas SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicacion
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@tuempresa.com
MAIL_FROM_NAME="Sistema de Auditorías"
```

## Configurar el Cron Job

### Opción 1: Usando crontab (Linux/Mac)

1. Abre el editor de crontab:
```bash
crontab -e
```

2. Agrega una de estas líneas según la frecuencia deseada:

**Ejecutar el primer día de cada mes a las 8:00 AM:**
```bash
0 8 1 * * curl -X POST "https://tudominio.com/api/cron/expiry-notifications" >> /var/log/expiry-notifications.log 2>&1
```

**Ejecutar todos los lunes a las 9:00 AM:**
```bash
0 9 * * 1 curl -X POST "https://tudominio.com/api/cron/expiry-notifications" >> /var/log/expiry-notifications.log 2>&1
```

**Ejecutar todos los días a las 8:00 AM:**
```bash
0 8 * * * curl -X POST "https://tudominio.com/api/cron/expiry-notifications" >> /var/log/expiry-notifications.log 2>&1
```

### Opción 2: Usando wget en lugar de curl

```bash
0 8 1 * * wget -O - "https://tudominio.com/api/cron/expiry-notifications" >> /var/log/expiry-notifications.log 2>&1
```

### Opción 3: Usando un servicio de cron jobs online

Servicios como **cron-job.org**, **EasyCron**, o **Cronitor** permiten configurar cron jobs sin necesidad de acceso al servidor:

1. Regístrate en el servicio
2. Crea un nuevo cron job
3. URL: `https://tudominio.com/api/cron/expiry-notifications`
4. Método: POST
5. Configura la frecuencia deseada

## Probar el Endpoint Manualmente

### Con curl:
```bash
curl -X POST "http://localhost/api/cron/expiry-notifications"
```

### Respuesta exitosa:
```json
{
  "success": true,
  "message": "Notificación enviada exitosamente",
  "data": {
    "expired_count": 5,
    "expiring_soon_count": 12,
    "email_sent_to": "admin@tuempresa.com",
    "month": "diciembre",
    "year": 2025
  }
}
```

## Qué hace el Endpoint

1. **Obtiene todos los items** con vencimiento en el mes actual
2. **Clasifica los items** en:
   - **Vencidos**: Items que ya pasaron su fecha de vencimiento
   - **Próximos a vencer**: Items que vencerán este mes pero aún no han vencido
4. **Envía un email HTML** con tablas organizadas mostrando:
   - Cliente
   - Tipo de auditoría
   - Nombre del item
   - Fecha de vencimiento
   - Estado o días restantes
4. **Retorna un JSON** con el resultado de la operación

## Formato del Crontab

```
* * * * * comando
│ │ │ │ │
│ │ │ │ └─── Día de la semana (0-7, donde 0 y 7 = Domingo)
│ │ │ └───── Mes (1-12)
│ │ └─────── Día del mes (1-31)
│ └───────── Hora (0-23)
└─────────── Minuto (0-59)
```

## Ejemplos de Frecuencias

- `0 8 1 * *` - Primer día de cada mes a las 8:00 AM
- `0 9 * * 1` - Todos los lunes a las 9:00 AM
- `0 8 * * *` - Todos los días a las 8:00 AM
- `0 8 1,15 * *` - Los días 1 y 15 de cada mes a las 8:00 AM
- `0 0 * * 0` - Todos los domingos a medianoche
- `*/30 * * * *` - Cada 30 minutos

## Logs y Debugging

Para ver los logs en desarrollo, puedes configurar el mailer a `log` en `.env`:

```env
MAIL_MAILER=log
```

Los emails se guardarán en `storage/logs/laravel.log`

## Troubleshooting

### El email no se envía:
1. Verifica la configuración de MAIL en `.env`
2. Revisa los logs en `storage/logs/laravel.log`
3. Asegúrate de que el servidor tenga acceso al SMTP configurado
4. Prueba con `MAIL_MAILER=log` para debugging

### El cron job no se ejecuta:
1. Verifica que el cron esté configurado correctamente: `crontab -l`
2. Revisa los logs: `tail -f /var/log/expiry-notifications.log`
3. Prueba el comando manualmente primero
4. Verifica que la URL sea correcta

## Notas de Seguridad

⚠️ **IMPORTANTE:**
- Este es un endpoint de **uso interno**
- Se recomienda **restringir el acceso** mediante configuración del servidor (firewall, whitelist de IPs, etc.)
- Considera usar **HTTPS** en producción

