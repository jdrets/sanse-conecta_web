# 📧 Sistema de Notificaciones de Vencimientos

## Resumen

Sistema automatizado que envía notificaciones por correo electrónico sobre items de auditorías próximos a vencer o ya vencidos en el mes actual.

## ⚡ Inicio Rápido

### 1. Configurar Variables de Entorno

Agregar al archivo `.env`:

```env
# Email destino
EXPIRY_NOTIFICATION_EMAIL=admin@tuempresa.com

# Configuración de email
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicacion
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@tuempresa.com
MAIL_FROM_NAME="Sistema de Auditorías"
```

### 2. Probar el Endpoint

```bash
curl -X POST "http://localhost/api/cron/expiry-notifications"
```

### 3. Configurar Cron Job

Editar crontab:
```bash
crontab -e
```

Agregar línea (ejecutar el primer día de cada mes a las 8 AM):
```bash
0 8 1 * * curl -X POST "https://tudominio.com/api/cron/expiry-notifications"
```

## 📋 Características

✅ **Detección automática** de vencimientos del mes actual  
✅ **Clasificación** en vencidos y próximos a vencer  
✅ **Email HTML** con tablas organizadas por cliente y tipo  
✅ **Protección con token** para seguridad  
✅ **Respuesta JSON** con información del envío  
✅ **Compatible** con cualquier servicio de cron jobs  

## 📊 Información en el Email

El email incluye:
- **Items vencidos**: Con fecha de vencimiento y alerta roja
- **Items próximos a vencer**: Con días restantes y alerta amarilla
- **Información por item**:
  - Nombre del cliente
  - Tipo de auditoría
  - Nombre del item
  - Fecha de vencimiento
  - Estado o días restantes

## 🔒 Seguridad

⚠️ **IMPORTANTE:** 
- Este es un endpoint de **uso interno** sin autenticación
- Se recomienda **restringir el acceso** mediante:
  - Firewall del servidor
  - Whitelist de IPs
  - Configuración de red privada
- Usar **HTTPS** en producción

## 🧪 Testing

Prueba manual con curl:

```bash
curl -X POST "http://localhost/api/cron/expiry-notifications"
```

Para desarrollo local, puedes probar desde tu navegador o herramientas como Postman:
- URL: `http://localhost/api/cron/expiry-notifications`
- Método: `POST`

## 📁 Archivos Creados

```
app/
  ├── Mail/
  │   └── ExpiryNotificationMail.php       # Mailable para el email
  └── Http/Controllers/
      └── AuditsController.php              # Método sendExpiryNotifications()

resources/views/emails/
  └── expiry-notification.blade.php         # Template HTML del email

routes/
  └── web.php                               # Ruta pública agregada

docs/
  ├── CRON_SETUP.md                         # Documentación completa
  ├── ENV_EXAMPLE_CRON.txt                  # Ejemplo de variables .env
  └── NOTIFICACIONES_README.md              # Este archivo
```

## 🔧 Configuración de Gmail

Si usas Gmail como SMTP:

1. Habilitar "Verificación en 2 pasos"
2. Ir a: https://myaccount.google.com/apppasswords
3. Generar una contraseña de aplicación
4. Usar esa contraseña en `MAIL_PASSWORD`

## 📅 Opciones de Frecuencia

```bash
# Primer día de cada mes a las 8 AM
0 8 1 * * [comando]

# Todos los lunes a las 9 AM
0 9 * * 1 [comando]

# Todos los días a las 8 AM
0 8 * * * [comando]

# Días 1 y 15 de cada mes a las 8 AM
0 8 1,15 * * [comando]

# Cada domingo a medianoche
0 0 * * 0 [comando]
```

## 🐛 Troubleshooting

### El email no se envía

1. Verificar configuración de MAIL en `.env`
2. Revisar logs: `tail -f storage/logs/laravel.log`
3. Probar con `MAIL_MAILER=log` para debug
4. Verificar acceso del servidor al SMTP

### El cron no se ejecuta

1. Verificar cron: `crontab -l`
2. Probar comando manualmente
3. Revisar permisos y URL
4. Verificar logs del sistema

## 📖 Documentación Adicional

Para más detalles, consultar:
- `docs/CRON_SETUP.md` - Guía completa de configuración
- `docs/ENV_EXAMPLE_CRON.txt` - Variables de entorno necesarias

## 🚀 Servicios de Cron Online

Si no tienes acceso al servidor:
- **cron-job.org** (gratis)
- **EasyCron** (gratis/pago)
- **Cronitor** (pago)

## ⚠️ Importante

- Nunca compartas el `CRON_TOKEN` públicamente
- Usa HTTPS en producción
- Cambia el token regularmente
- Monitorea los logs de acceso

## 📧 Contacto

Para soporte o consultas sobre el sistema de notificaciones, contactar al equipo de desarrollo.

