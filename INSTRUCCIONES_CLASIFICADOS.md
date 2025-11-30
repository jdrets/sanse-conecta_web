# Instrucciones de Configuración - Sanse Conecta

## Aplicación de Clasificados para Barrio Privado

Esta aplicación permite a los vecinos publicar y buscar clasificados (servicios, productos, ventas, etc.) dentro del barrio.

## Características Principales

- **Sistema de autenticación**: Login y registro de usuarios
- **Publicación de clasificados**: Los usuarios pueden publicar hasta 3 clasificados diferentes
- **Búsqueda de clasificados**: Por categoría o texto libre
- **Sistema de "me gusta"**: Los usuarios pueden dar "me gusta" a los clasificados
- **Categorías predefinidas**: 15 categorías de clasificados comunes
- **Sistema flexible**: Puede ser usado para servicios, venta de productos, venta de comida, vehículos, etc.

## Pasos de Configuración

### 1. Ejecutar las Migraciones

```bash
php artisan migrate
```

Esto creará las siguientes tablas:
- Actualización de `users` (agrega campos: name, phone, address, publication_max)
- `categories` (categorías de clasificados)
- `publications` (clasificados publicados)
- `publication_likes` (me gusta en clasificados)

### 2. Ejecutar los Seeders

```bash
php artisan db:seed --class=CategorySeeder
```

O ejecutar todos los seeders:

```bash
php artisan db:seed
```

Esto creará 15 categorías predefinidas:
- Plomería 🔧
- Electricidad 💡
- Limpieza 🧹
- Jardinería 🌱
- Carpintería 🪚
- Pintura 🎨
- Mecánica 🔩
- Albañilería 🧱
- Cerrajería 🔑
- Tecnología 💻
- Cuidado de Mascotas 🐕
- Clases Particulares 📚
- Mudanzas 📦
- Cuidado de Niños 👶
- Cocina 👨‍🍳

### 3. Crear el Storage Link

```bash
php artisan storage:link
```

Esto permitirá que las imágenes subidas sean accesibles públicamente.

### 4. Compilar el Frontend

```bash
npm install
npm run dev
```

O para producción:

```bash
npm run build
```

## Rutas Disponibles

### Rutas Públicas
- `/` - Página principal con buscador
- `/auth/login` - Iniciar sesión
- `/auth/register` - Registro de usuarios
- `/search` - Búsqueda de clasificados
- `/publication/{id}` - Detalle de un clasificado

### Rutas Protegidas (requieren autenticación)
- `/publication/create` - Crear nuevo clasificado
- `/publication/{id}/edit` - Editar clasificado
- `/publication/{id}` (DELETE) - Eliminar clasificado
- `/publication/{id}/like` - Dar/quitar "me gusta"

## Estructura de Base de Datos

### Tabla: users
- `id`, `email`, `password`, `role`
- `name` - Nombre completo
- `phone` - Teléfono de contacto
- `address` - Dirección
- `publication_max` - Cantidad máxima de publicaciones (default: 3)

### Tabla: categories
- `id`, `name`, `slug`, `description`
- `icon` - Emoji o icono de la categoría
- `is_active` - Estado de la categoría

### Tabla: publications
- `id`, `user_id`, `category_id`
- `title` - Título del clasificado
- `description` - Descripción detallada
- `image` - Ruta de la imagen
- `likes_count` - Contador de "me gusta"
- `is_active` - Estado del clasificado

### Tabla: publication_likes
- `id`, `user_id`, `publication_id`
- Restricción única: un usuario solo puede dar "me gusta" una vez por clasificado

## Modelos y Relaciones

### User
- `publications()` - Clasificados publicados por el usuario
- `publicationLikes()` - "Me gusta" dados por el usuario
- `canPublishMore()` - Verifica si puede publicar más clasificados
- `remainingPublications()` - Cantidad de publicaciones restantes

### Publication
- `user()` - Usuario que publicó el clasificado
- `category()` - Categoría del clasificado
- `likes()` - "Me gusta" del clasificado
- `isLikedBy($userId)` - Verifica si un usuario dio "me gusta"

### Category
- `publications()` - Clasificados de esta categoría

## Páginas React (con Material-UI)

1. **Login** (`/auth/login/page.tsx`)
2. **Register** (`/auth/register/page.tsx`)
3. **Home** (`/Home.tsx`) - Página principal con buscador y categorías
4. **Search** (`/Search.tsx`) - Resultados de búsqueda
5. **PublicationDetails** (`/PublicationDetails.tsx`) - Detalle del clasificado con botón "me gusta"
6. **PublicationCreate** (`/PublicationCreate.tsx`) - Formulario de creación
7. **PublicationEdit** (`/PublicationEdit.tsx`) - Formulario de edición

## Reglas de Negocio

1. Un usuario puede publicar hasta 3 clasificados (configurable en `publication_max`)
2. No se pueden publicar clasificados repetidos en la misma categoría
3. Los usuarios no registrados pueden buscar y ver clasificados
4. Solo usuarios registrados pueden:
   - Publicar clasificados
   - Dar "me gusta"
5. Los resultados de búsqueda se ordenan por popularidad (más "me gusta" primero)
6. Solo el dueño del clasificado puede editarlo o eliminarlo

## Notas Adicionales

- Las imágenes se almacenan en `storage/app/public/publications`
- El sistema usa Soft Deletes para los clasificados
- Los "me gusta" se incrementan/decrementan automáticamente con cada acción
- La interfaz está completamente en español
- El diseño es responsive y funciona en móviles
- El sistema es flexible y puede usarse para servicios, productos, ventas, etc.

## Comandos Útiles

```bash
# Resetear base de datos y volver a crear todo
php artisan migrate:fresh --seed

# Ver rutas disponibles
php artisan route:list

# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Ver cantidad de categorías
php artisan tinker --execute="echo 'Categorías: ' . \App\Models\Category::count();"

# Ver cantidad de publicaciones
php artisan tinker --execute="echo 'Publicaciones: ' . \App\Models\Publication::count();"
```

## Cambios Realizados

### Nomenclatura Actualizada
- **Service** → **Publication** (Clasificado)
- **ServiceCategory** → **Category** (Categoría)
- **ServiceLike** → **PublicationLike** (Me gusta)
- **ServiceController** → **PublicationController**
- **ServiceLikeController** → **PublicationLikeController**

Este cambio hace que el sistema sea más genérico y pueda usarse para:
- Servicios (plomería, electricidad, etc.)
- Venta de productos
- Venta de comida
- Venta de vehículos
- Cualquier tipo de clasificado que se necesite en el futuro
