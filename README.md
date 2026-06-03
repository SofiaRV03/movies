# MOVIX - Sistema de Gestión de Bases de Datos Cinematográficas

Una plataforma moderna y elegante para la gestión, consulta y descubrimiento de películas. Construida con Next.js 16, TypeScript, Prisma ORM y Bootstrap.

---

## Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
3. [Características Principales](#-características-principales)
4. [Roles y Permisos](#-roles-y-permisos)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Paso a Paso de Instalación](#-paso-a-paso-de-instalación)
7. [Configuración de la Base de Datos](#-configuración-de-la-base-de-datos)
8. [Ejecución del Proyecto](#-ejecución-del-proyecto)
9. [Módulos y Funcionalidades](#-módulos-y-funcionalidades)
10. [Base de Datos (Modelo Relacional)](#-base-de-datos-modelo-relacional)

---

## Descripción del Proyecto

**MOVIX** es un sistema de gestión cinematográfica que permite a los usuarios explorar, consultar y gestionar información sobre películas, actores, directores y géneros. El proyecto incluye funcionalidades de autenticación, roles de usuario (ADMIN y USER), listas personalizadas (Vistas y Watchlist), y un sistema de reseñas.

La interfaz cuenta con un diseño elegante y moderno, con soporte para modo oscuro y claro, y una experiencia de usuario fluida y responsive.

---

## Tecnologías Utilizadas

| Categoría | Tecnologías |
|-----------|-------------|
| **Framework Principal** | Next.js 16.2.6 |
| **Lenguaje** | TypeScript 5 |
| **UI y Estilos** | Bootstrap 5.3.8, Bootstrap Icons 1.13.1, Tailwind CSS 4 |
| **ORM y Base de Datos** | Prisma ORM 7.8.0, PostgreSQL |
| **React** | React 19.2.4, React DOM 19.2.4 |
| **Herramientas de Desarrollo** | ESLint 9, @types/node, @types/react, @types/react-dom |

---

## Características Principales

- **Galería de Películas**: Navega por el catálogo completo con filtros de búsqueda y géneros
- **Autenticación Segura**: Sistema de inicio de sesión y registro de usuarios
- **Roles de Usuario**: Control de acceso diferenciado entre ADMIN y USER
- **Reseñas y Calificaciones**: Los usuarios pueden dejar reseñas y calificar películas
- **Listas Personalizadas**: "Vistas" (películas vistas) y "Watchlist" (para ver después)
- **Modo Oscuro/Claro**: Interfaz adaptable con tema personalizable
- **Responsive Design**: Perfectamente funcional en dispositivos móviles, tabletas y desktop
- **Búsqueda Avanzada**: Busca películas por título, director, actor o género
- **Base de Datos Relacional**: Modelo completo de películas, personas, géneros y reseñas

---

## Roles y Permisos

### Rol: ADMIN
Los administradores tienen acceso completo a todas las funcionalidades:
- Ver y gestionar el catálogo completo de películas
- Registrar nuevas películas
- Ver y administrar la estructura de la base de datos
- Eliminar reseñas de usuarios
- Acceso a todos los módulos de la aplicación
- Ver la galería de películas y detalles individuales

### Rol: USER
Los usuarios estándar tienen acceso a funcionalidades de consulta y gestión personal:
- Ver la galería y detalles de películas
- Buscar y filtrar películas
- Dejar reseñas y calificaciones
- Marcar películas como "Vistas"
- Agregar películas a la "Watchlist"
- Ver sus listas personalizadas
- No pueden registrar nuevas películas
- No pueden acceder a la sección "Base de Datos"
- No pueden eliminar reseñas de otros usuarios

### Visitante (No autenticado)
Los usuarios no autenticados solo pueden:
- Ver la página de inicio
- Ver la sección "Quiénes Somos"
- Acceder a la página de inicio de sesión y registro
- No pueden acceder a la galería ni a otras secciones protegidas

---

## Estructura del Proyecto

```
movies/
├── app/                          # Directorio principal de la aplicación Next.js
│   ├── api/                      # Rutas API (Backend)
│   │   ├── auth/                 # Autenticación (login, logout, me, register)
│   │   ├── genres/               # Obtención de géneros
│   │   ├── movies/               # Gestión de películas (lista, detalle, reseñas)
│   │   └── user/                 # Listas personalizadas del usuario
│   ├── base-de-datos/            # Página de administración de BD (solo ADMIN)
│   ├── components/               # Componentes reutilizables
│   │   ├── BootstrapClient.tsx   # Carga de Bootstrap JS
│   │   ├── Footer.tsx            # Pie de página
│   │   ├── Header.tsx            # Encabezado (solo Inicio)
│   │   ├── MovieCarousel.tsx     # Carrusel de películas destacadas
│   │   ├── MovieSearch.tsx       # Buscador de películas
│   │   ├── Navbar.tsx            # Barra de navegación principal
│   │   ├── ThemeProvider.tsx     # Gestión del tema (oscuro/claro)
│   │   └── ...otros componentes
│   ├── consultas/                # Página de consultas y tráiler
│   ├── contexts/                 # Contextos de React
│   │   └── AuthContext.tsx       # Contexto de autenticación
│   ├── galeria/                  # Página de galería y detalle de películas
│   │   └── [id]/                 # Ruta dinámica para detalle de película
│   ├── login/                    # Página de inicio de sesión
│   ├── quienes-somos/            # Página "Quiénes Somos"
│   ├── registrar-pelicula/       # Formulario de registro de películas (ADMIN)
│   ├── vistas/                   # Lista de películas vistas (USER)
│   ├── watchlist/                # Lista de películas para ver (USER)
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página de Inicio
├── prisma/                       # Configuración de Prisma ORM
│   ├── migrations/               # Migraciones de base de datos
│   └── schema.prisma             # Esquema de la base de datos
├── public/                       # Archivos públicos
│   ├── assets/                   # Recursos (vídeos, etc.)
│   ├── img/                      # Imágenes
│   └── data/                     # Datos adicionales
├── package.json                  # Dependencies y scripts
├── tsconfig.json                 # Configuración de TypeScript
├── next.config.ts                # Configuración de Next.js
├── postcss.config.mjs            # Configuración de PostCSS
└── eslint.config.mjs             # Configuración de ESLint
```

---

## Paso a Paso de Instalación

### 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:
- **Node.js**: Versión 18.x o superior (recomendado 20.x)
- **npm**: Versión 9.x o superior (incluido con Node.js)
- **PostgreSQL**: Versión 13 o superior (o Docker para ejecutar una instancia)
- **Git**: Para clonar el repositorio (opcional)

### 2. Clonar o Descargar el Proyecto

Si el proyecto está en un repositorio Git:
```bash
git clone https://github.com/SofiaRV03/movies.git
cd movies
```

Si ya tienes los archivos, simplemente navega al directorio del proyecto.

### 3. Instalar las Dependencias

Ejecuta el siguiente comando para instalar todas las dependencias del proyecto:

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`:

#### Dependencias de Producción
- `@prisma/adapter-pg`: Adaptador PostgreSQL para Prisma
- `@prisma/client`: Cliente de Prisma ORM
- `bootstrap`: Framework CSS
- `bootstrap-icons`: Íconos de Bootstrap
- `next`: Framework Next.js
- `react`: React
- `react-dom`: React DOM

#### Dependencias de Desarrollo
- `@tailwindcss/postcss`: Integración Tailwind con PostCSS
- `@types/bcryptjs`, `@types/bootstrap`, `@types/node`, `@types/react`, `@types/react-dom`: Tipos TypeScript
- `eslint`, `eslint-config-next`: Linting
- `prisma`: CLI de Prisma
- `tailwindcss`: Tailwind CSS
- `typescript`: TypeScript

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (al mismo nivel que `package.json`) con el siguiente contenido:

```env
# URL de conexión a la base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/movix?schema=public"

# (Opcional) Variable para entorno de desarrollo
NODE_ENV="development"
```

**Nota**: Asegúrate de reemplazar `usuario` y `contraseña` con tus credenciales de PostgreSQL. Si usas Docker, puedes usar la configuración que se muestra en la sección siguiente.

---

## Configuración de la Base de Datos

### Opción A: Usar PostgreSQL Local

1. Asegúrate de que PostgreSQL esté instalado y ejecutándose en tu sistema.
2. Crea una base de datos llamada `movix`:
   ```sql
   CREATE DATABASE movix;
   ```
3. Actualiza la variable `DATABASE_URL` en el archivo `.env` con tus credenciales.

### Opción B: Usar Docker (Recomendado para Desarrollo)

Si prefieres usar Docker, puedes ejecutar una instancia de PostgreSQL con el siguiente comando:

```bash
docker run --name movix-db \
  -e POSTGRES_USER=movix_admin \
  -e POSTGRES_PASSWORD=movix_secure_password \
  -e POSTGRES_DB=movix \
  -p 5432:5432 \
  -d postgres:16
```

Luego, actualiza tu `.env` con esta URL:
```env
DATABASE_URL="postgresql://movix_admin:movix_secure_password@localhost:5432/movix?schema=public"
```

### Aplicar Migraciones de Base de Datos

Ejecuta las migraciones para crear las tablas en la base de datos:

```bash
npx prisma migrate dev
```

Este comando:
1. Aplica todas las migraciones existentes en el directorio `prisma/migrations/`
2. Genera el cliente de Prisma
3. Crea las tablas y relaciones definidas en el esquema

### (Opcional) Sembrar Datos de Prueba

Si el proyecto incluye un script para sembrar datos (seed), ejecútalo:
```bash
npx prisma db seed
```

**Nota**: Si el proyecto no tiene un script de semilla, puedes crear un usuario ADMIN manualmente usando Prisma Studio o un cliente SQL.

### Verificar la Conexión

Para verificar que todo esté correcto, puedes abrir Prisma Studio:
```bash
npx prisma studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde podrás ver y editar los datos de tu base de datos.

---

## Ejecución del Proyecto

### Entorno de Desarrollo

Para iniciar el servidor de desarrollo de Next.js:

```bash
npm run dev
```

El proyecto se ejecutará en `http://localhost:3000`

### Construir para Producción

Para generar una versión optimizada para producción:

```bash
npm run build
```

### Ejecutar en Producción

Después de construir, puedes ejecutar la aplicación en modo producción:

```bash
npm start
```

---

## Módulos y Funcionalidades

### 1. Página de Inicio (`/`)
- Carrusel de películas destacadas
- Descripción del proyecto y bienvenida
- Resumen de los módulos del sistema
- Vista de las tablas de la base de datos
- Formulario de contacto

### 2. Galería de Películas (`/galeria`)
- Cuadrícula de películas con pósters
- Buscador por título, director, actor o género
- Filtro por géneros
- Paginación del catálogo
- Vista de detalle de cada película (`/galeria/[id]`)

### 3. Detalle de Película (`/galeria/[id]`)
- Póster grande de la película
- Información completa (título, año, duración, rating IMDb)
- Sinopsis
- Lista de géneros
- Directores y reparto principal
- Sección de reseñas de usuarios
- Botones para agregar a "Vistas" o "Watchlist" (solo USER)
- Formulario para dejar reseñas (solo USER)

### 4. Inicio de Sesión / Registro (`/login`)
- Formulario de inicio de sesión
- Formulario de registro de nuevos usuarios
- Validación de campos
- Manejo de errores

### 5. Registrar Película (`/registrar-pelicula`) (Solo ADMIN)
- Formulario completo para agregar nuevas películas
- Campos: Título, año, duración, rating IMDb, sinopsis, URL del póster
- Selección de géneros (múltiples)
- Agregar director y actores (con opción de agregar más actores)
- Vista previa del póster
- Validación de campos obligatorios

### 6. Base de Datos (`/base-de-datos`) (Solo ADMIN)
- Visualización de la estructura de todas las tablas
- Descripción de cada campo
- Ejemplos de registros
- Diagrama ER (si está disponible)
- Índice de navegación entre tablas

### 7. Vistas (`/vistas`) (Solo USER)
- Lista de películas marcadas como "vistas" por el usuario
- Visualización similar a la galería
- Posibilidad de quitar películas de la lista

### 8. Watchlist (`/watchlist`) (Solo USER)
- Lista de películas que el usuario quiere ver
- Visualización similar a la galería
- Posibilidad de quitar películas de la lista

### 9. Consultas (`/consultas`)
- Buscador de películas
- Reproductor de tráiler de ejemplo (Interstellar)

### 10. Quiénes Somos (`/quienes-somos`)
- Información sobre el equipo de desarrollo
- Misión y visión del proyecto
- Detalles académicos (si aplica)

---

## Base de Datos (Modelo Relacional)

El modelo de base de datos de MOVIX está compuesto por las siguientes tablas:

### Tabla: `movies` (Películas)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Identificador único (PK, autoincremental) |
| `title` | String | Título de la película |
| `year` | Int? | Año de estreno |
| `runtimeMin` | Int? | Duración en minutos |
| `imdbRating` | Decimal? | Calificación de IMDb (0-10) |
| `overview` | String? | Sinopsis de la película |
| `posterUrl` | String? | URL(s) del póster (separadas por coma) |
| `createdAt` | DateTime | Fecha de creación del registro |

### Tabla: `people` (Personas - Actores y Directores)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Identificador único (PK, autoincremental) |
| `name` | String | Nombre de la persona (único) |
| `isDirector` | Boolean | Indica si es director |
| `isActor` | Boolean | Indica si es actor |

### Tabla: `genres` (Géneros Cinematográficos)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Identificador único (PK, autoincremental) |
| `name` | String | Nombre del género (único) |

### Tabla: `users` (Usuarios del Sistema)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Identificador único (PK, autoincremental) |
| `name` | String | Nombre completo del usuario |
| `email` | String | Correo electrónico (único) |
| `password` | String | Contraseña (encriptada) |
| `role` | String | Rol del usuario ("ADMIN" o "USER") |
| `createdAt` | DateTime | Fecha de creación del registro |

### Tabla: `reviews` (Reseñas de Usuarios)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Identificador único (PK, autoincremental) |
| `movieId` | Int | ID de la película (FK a `movies`) |
| `userId` | Int | ID del usuario (FK a `users`) |
| `rating` | Int | Calificación (1-5) |
| `comment` | String | Comentario de la reseña |
| `createdAt` | DateTime | Fecha de creación |

### Tablas de Relación (Many-to-Many)

- **`movie_genres`**: Relaciona películas con géneros
- **`movie_directors`**: Relaciona películas con directores
- **`movie_cast`**: Relaciona películas con actores (incluye `billingOrder` para el orden de créditos)
- **`user_movies`**: Relaciona usuarios con películas (incluye `listType` para diferenciar "Vistas" y "Watchlist")

---

## Contribuciones

Si deseas contribuir al proyecto, por favor:
1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Realiza tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Licencia

Este proyecto está bajo la Licencia MIT.

---

## Equipo de Desarrollo

Desarrollado como proyecto académico por:
- Sofia Restrepo
- Claudia Patricia Galvis
- Allison Mariana Restrepo

---

## Contacto

Si tienes preguntas o sugerencias sobre el proyecto, no dudes en contactarnos.

---

**¡Gracias por usar MOVIX!**
