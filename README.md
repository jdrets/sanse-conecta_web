# App Consultora Industrial

Una aplicación web moderna construida con Laravel 12, Inertia.js y React.

## 🚀 Tecnologías utilizadas

- **Backend**: Laravel 12
- **Frontend**: React 18 + Inertia.js
- **Build Tool**: Vite
- **Base de datos**: SQLite (por defecto)

## 📋 Requisitos previos

- PHP 8.2+
- Composer
- Node.js 16+ (recomendado 20+)
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd app_consultora_industrial
```

### 2. Instalar dependencias de PHP
```bash
composer install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Configurar base de datos
Edita el archivo `.env` y configura tu base de datos:
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/your/project/database/database.sqlite
```

### 5. Ejecutar migraciones
```bash
php artisan migrate
```

### 6. Instalar dependencias de Node.js
```bash
npm install
```

### 7. Compilar assets
```bash
npm run build
```

## 🚀 Desarrollo

### Iniciar servidor de desarrollo
```bash
# Terminal 1: Servidor Laravel
php artisan serve

# Terminal 2: Servidor de Vite (hot reload)
npm run dev
```

### Compilar para producción
```bash
npm run build
```

## 📁 Estructura del proyecto

```
app_consultora_industrial/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Middleware/
│   └── ...
├── resources/
│   ├── js/
│   │   ├── Pages/          # Páginas de React
│   │   ├── Layouts/        # Layouts de React
│   │   └── app.jsx         # Punto de entrada de React
│   ├── css/
│   │   └── app.css         # Estilos principales
│   └── views/
│       └── app.blade.php   # Vista principal de Inertia
├── routes/
│   └── web.php             # Rutas web
├── vite.config.js          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind
└── package.json
```

## 🎨 Crear nuevas páginas

### 1. Crear componente React
```jsx
// resources/js/Pages/About.jsx
import React from 'react';

export default function About() {
    return (
        <div>
            <h1>Acerca de nosotros</h1>
        </div>
    );
}
```

### 2. Crear controlador
```bash
php artisan make:controller AboutController
```

### 3. Configurar controlador
```php
// app/Http/Controllers/AboutController.php
use Inertia\Inertia;

public function index()
{
    return Inertia::render('About');
}
```

### 4. Agregar ruta
```php
// routes/web.php
Route::get('/about', [AboutController::class, 'index']);
```

## 🔧 Comandos útiles

```bash
# Limpiar caché
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Crear nuevo controlador
php artisan make:controller NombreController

# Crear nuevo modelo
php artisan make:model NombreModel

# Crear nueva migración
php artisan make:migration create_nombre_table

# Ejecutar migraciones
php artisan migrate

# Revertir última migración
php artisan migrate:rollback
```

## 📚 Recursos adicionales

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
