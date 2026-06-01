# Documento de Arquitectura del Sistema — MOVIX

| Campo | Valor |
|---|---|
| **Proyecto** | MOVIX — Sistema de Gestión Cinematográfica |
| **Versión** | 0.1.0 |
| **Fecha de análisis** | Mayo 2026 |
| **Autores del sistema** | Sofía Restrepo, Claudia Patricia Galvis, Allison Mariana Restrepo |
| **Stack principal** | Next.js 16.2.6, React 19.2, TypeScript 5, Prisma 7.8, PostgreSQL |

---

## 1. Tipo de Arquitectura

El sistema MOVIX implementa una **arquitectura cliente-servidor con enfoque por capas (layered architecture)** bajo el paradigma de **React Server Components (RSC)** de Next.js App Router, complementada con elementos de **arquitectura modular**.

### Justificación

La clasificación corresponde a los siguientes criterios verificables en el código:

| Criterio | Evidencia |
|---|---|
| **Separación en capas** | El proyecto distingue claramente capa de presentación (`app/components/`, `app/page.tsx`), capa de aplicación/ruteo (`app/api/`, `app/galeria/[id]/page.tsx`), capa de acceso a datos (`lib/db.ts`, Prisma ORM) y capa de almacenamiento (PostgreSQL). |
| **Cliente-Servidor** | Next.js App Router separa explícitamente componentes de servidor (`page.tsx` sin `"use client"`) y componentes de cliente (`"use client"`). Las API REST (`app/api/`) actúan como intermediario cuando el frontend requiere datos desde el navegador. |
| **Dividido en módulos funcionales** | Cada ruta (`/galeria`, `/consultas`, `/quienes-somos`, `/base-de-datos`) representa un módulo independiente con su propia responsabilidad, siguiendo el sistema de enrutamiento basado en archivos de Next.js (file-based routing). |

No es una arquitectura MVC pura porque Next.js App Router fusiona el controlador con las rutas (Route Handlers) y las vistas son Server Components que pueden consumir datos directamente sin pasar por un controlador explícito.

---

## 2. Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE (Navegador)                                │
│                                                                              │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │  HomePage    │  │  Galería │  │  Consultas   │  │  Quiénes Somos      │  │
│  │  /           │  │  /galeria│  │  /consultas  │  │  /quienes-somos     │  │
│  └──────┬───────┘  └─────┬────┘  └──────┬───────┘  └─────────────────────┘  │
│         │                │              │                                    │
│         │         ┌──────┴──────┐       │                                    │
│         │         │ Detalle     │       │                                    │
│         │         │ /galeria/[id]│      │                                    │
│         │         └──────┬──────┘       │                                    │
│         │                │              │                                    │
│  ┌──────┴────────────────┴──────────────┴─────────────────────────────┐     │
│  │                    COMPONENTES COMPARTIDOS                           │     │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────────┐ ┌────────┐ ┌─────────┐  │     │
│  │  │ Navbar  │ │ Footer   │ │ ThemeProvider │ │Carousel│ │Contact- │  │     │
│  │  │(cliente)│ │(servidor)│ │  (cliente)    │ │(client)│ │Form     │  │     │
│  │  └─────────┘ └──────────┘ └──────────────┘ └────────┘ └─────────┘  │     │
│  │  ┌──────────┐ ┌────────────────┐ ┌────────────────────────┐        │     │
│  │  │MovieSearch│ │ScrollAnimation│ │  BootstrapClient       │        │     │
│  │  │(cliente)  │ │ (cliente)     │ │  (cliente, BS5 init)   │        │     │
│  │  └──────────┘ └────────────────┘ └────────────────────────┘        │     │
│  └────────────────────────────────────────────────────────────────────┘     │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │ HTTP (fetch)
                             ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                   SERVIDOR Next.js (App Router)                              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              ROUTE HANDLERS (API REST - Capa Controlador)           │    │
│  │                                                                      │    │
│  │  ┌────────────────────┐  ┌──────────────────────┐  ┌─────────────┐  │    │
│  │  │ GET /api/movies    │  │ GET /api/movies/[id] │  │ /api/genres │  │    │
│  │  │ (búsqueda + filtro │  │ (detalle un solo     │  │ (lista de   │  │    │
│  │  │  + paginación)     │  │  registro)           │  │  géneros)   │  │    │
│  │  └────────┬───────────┘  └──────────┬───────────┘  └──────┬──────┘  │    │
│  └───────────┼──────────────────────────┼─────────────────────┼────────┘    │
│              │                          │                     │              │
│  ┌───────────┼──────────────────────────┼─────────────────────┼────────────┐│
│  │           ▼                          ▼                     ▼            ││
│  │                      CAPA DE ACCESO A DATOS                            ││
│  │                                                                         ││
│  │  ┌─────────────────────────────────────────────────────────────────┐   ││
│  │  │                    lib/db.ts (Prisma Client Singleton)           │   ││
│  │  │  Adaptador: @prisma/adapter-pg (Pool de conexiones PostgreSQL)  │   ││
│  │  └───────────────────────────┬─────────────────────────────────────┘   ││
│  └──────────────────────────────┼──────────────────────────────────────────┘│
└─────────────────────────────────┼──────────────────────────────────────────┘
                                  │ Prisma ORM
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CAPA DE ALMACENAMIENTO                                   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     PostgreSQL (localhost:54322)                      │   │
│  │                                                                       │   │
│  │  ┌───────────┐   ┌────────────┐   ┌──────────────┐   ┌───────────┐  │   │
│  │  │  movies   │──▶│movie_genres│◀──│    genre     │   │  people   │  │   │
│  │  │ (entidad  │   │ (N:M)      │   │  (entidad    │   │(entidad   │  │   │
│  │  │ principal)│   └────────────┘   │   principal) │   │ principal)│  │   │
│  │  │           │                    └──────────────┘   │ actor+dir  │  │   │
│  │  │           │──▶┌──────────────┐ ┌──────────────┐  └─────┬─────┘  │   │
│  │  │           │   │ movie_cast   │ │movie_directors│        │        │   │
│  │  │           │   │ (N:M actores)│ │(N:M dirs)    │◀───────┘        │   │
│  │  └───────────┘   └──────────────┘ └──────────────┘                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

                     FLUJO DE INFORMACIÓN PRINCIPAL

  Usuario                    Servidor Next.js                  PostgreSQL
    │                             │                               │
    │  1. GET /galeria            │                               │
    │────────────────────────────▶│                               │
    │                             │  2. Prisma findMany()         │
    │                             │──────────────────────────────▶│
    │                             │  3. Filas + JOINs             │
    │                             │◀──────────────────────────────│
    │  4. HTML renderizado        │                               │
    │◀────────────────────────────│                               │
    │                             │                               │
    │  5. fetch('/api/movies?q=..')│                              │
    │────────────────────────────▶│                               │
    │                             │  6. Prisma findMany+count()   │
    │                             │──────────────────────────────▶│
    │                             │  7. Resultados filtrados      │
    │                             │◀──────────────────────────────│
    │  8. JSON {movies, pagination}│                              │
    │◀────────────────────────────│                               │
```

---

## 3. Explicación Detallada de Cada Componente

### 3.1 Capa de Presentación — Páginas (Server Components)

Son componentes React ejecutados en el servidor que generan HTML estático o dinámico. No tienen estado de cliente ni efectos secundarios.

| Archivo | Responsabilidad | Interacción |
|---|---|---|
| `app/page.tsx` | Página de inicio. Renderiza `Header`, `MovieCarousel`, secciones de bienvenida, módulos del sistema, tabla resumen y formulario de contacto. | Importa componentes `MovieCarousel`, `ContactForm`, `ScrollAnimation`, `Header`. |
| `app/galeria/page.tsx` | Galería con buscador, filtro por género y paginación. Es "use client" porque maneja estado de búsqueda en el navegador. | Hace `fetch()` a `/api/genres` y `/api/movies`. Renderiza tarjetas de películas. |
| `app/galeria/[id]/page.tsx` | Página de detalle de película (Server Component). Obtiene datos vía Prisma directamente. | Consulta `prisma.movie.findUnique()` con includes. Pasa datos a `MovieDetailClient`. |
| `app/consultas/page.tsx` | Búsqueda local sobre `peliculas.json` + video trailer. Renderiza `MovieSearch`. | Usa `MovieSearch` que carga JSON local. |
| `app/quienes-somos/page.tsx` | Página institucional con misión, visión y equipo. | Usa `ScrollAnimation`. |
| `app/base-de-datos/page.tsx` | Documentación del esquema relacional con tablas de ejemplo y diagrama E-R. | Estático, sin imports de componentes lógicos. |

### 3.2 Capa de Presentación — Componentes Compartidos

| Componente | Tipo | Responsabilidad |
|---|---|---|
| `Header.tsx` | Servidor | Renderiza el encabezado principal "MOVIX — Sistema de Gestión". |
| `Navbar.tsx` | Cliente | Barra de navegación sticky con 4 enlaces (`Inicio`, `Galería`, `Base de Datos`, `Quiénes Somos`). Usa `usePathname()` para resaltar ruta activa. |
| `Footer.tsx` | Servidor | Pie de página con créditos, fuente de datos y soporte. |
| `ThemeProvider.tsx` | Cliente | Contexto de tema oscuro/claro. Persiste selección en `localStorage`. Provee hook `useTheme()`. |
| `BootstrapClient.tsx` | Cliente | Importa `bootstrap.bundle.min.js` solo en cliente. |
| `MovieCarousel.tsx` | Cliente | Carrusel Bootstrap con 4 películas destacadas. Instancia `bootstrap.Carousel`. |
| `MovieSearch.tsx` | Cliente | Buscador sobre archivo JSON local `peliculas.json`. Muestra resultados con póster, año, rating y sinopsis. |
| `ContactForm.tsx` | Cliente | Formulario de contacto con validación en frontend (nombre ≥3 chars, email con @ y ., mensaje ≥5 chars). |
| `ScrollAnimation.tsx` | Cliente | Envuelve contenido en un contenedor con `IntersectionObserver` para animación fade-in al hacer scroll. |

### 3.3 Capa de Aplicación — Route Handlers (API REST)

| Endpoint | Método | Responsabilidad | Parámetros |
|---|---|---|---|
| `/api/movies` | GET | Búsqueda de películas con filtros, paginación y ordenamiento. Retorna JSON con array `movies` y objeto `pagination`. | `q` (búsqueda textual), `genre` (filtro), `page` (página), `limit` (resultados por página, máx 50). |
| `/api/movies/[id]` | GET | Obtiene detalle completo de una película por ID. Retorna JSON con todos los campos y relaciones. | `id` (ruta dinámica). |
| `/api/genres` | GET | Lista todos los géneros ordenados alfabéticamente. Retorna JSON con `[{id, name}]`. | Ninguno. |

### 3.4 Capa de Acceso a Datos

| Archivo | Responsabilidad |
|---|---|
| `lib/db.ts` | Singleton del cliente Prisma. Usa `@prisma/adapter-pg` para conexión a PostgreSQL. Previene múltiples instancias en desarrollo mediante `globalThis`. |
| `prisma/schema.prisma` | Definición del esquema ORM con 6 modelos y sus relaciones. |
| `prisma.config.ts` | Configuración de Prisma CLI con ruta de esquema y migraciones. |
| `prisma/migrations/` | Migración inicial con todas las tablas, índices y claves foráneas. |

### 3.5 Capa de Almacenamiento — PostgreSQL

**Base de datos relacional** con 6 tablas:

| Tabla | Tipo | Campos | Propósito |
|---|---|---|---|
| `movies` | Entidad | 8 | Almacena datos de cada película (título, año, duración, rating, sinopsis, póster). |
| `people` | Entidad (rol polimórfico) | 4 | Almacena tanto actores como directores. `is_actor` e `is_director` hacen las veces de flags de rol. |
| `genre` | Entidad | 2 | Catálogo de géneros cinematográficos. |
| `movie_genres` | Relación N:M | 2 | Asocia películas con géneros. |
| `movie_cast` | Relación N:M | 3 | Asocia películas con actores, incluyendo `billing_order` para orden de créditos. |
| `movie_directors` | Relación N:M | 2 | Asocia películas con directores. |

### 3.6 Capa de Configuración y Estática

| Archivo | Propósito |
|---|---|
| `next.config.ts` | Configura imágenes remotas desde `m.media-amazon.com`. |
| `tsconfig.json` | TypeScript estricto con alias `@/*`, target ES2017, JSX `react-jsx`. |
| `postcss.config.mjs` | Plugin de Tailwind CSS v4 para PostCSS. |
| `eslint.config.mjs` | Reglas ESLint con Next.js core-web-vitals y TypeScript. |
| `app/globals.css` | 860 líneas de CSS con sistema de variables CSS para tema oscuro/claro, paleta dorada/crema, tipografía, grid de películas, detalle, formularios, carrusel y paginación. |
| `public/data/peliculas.json` | Dataset de 150+ películas en formato JSON para búsqueda local. |
| `public/img/` | Imágenes del carrusel y diagrama E-R. |
| `public/assets/InterstellarTrailer.mp4` | Video de tráiler incorporado. |

---

## 4. Flujo Completo del Sistema (Paso a Paso)

### 4.1 Flujo de Navegación Estándar

```
1. USUARIO escribe URL → Navegador solicita GET a Next.js server
   │
2. SERVER ejecuta layout.tsx → Renderiza:
   ├── ThemeProvider (provee contexto oscuro/claro)
   ├── BootstrapClient (carga JS de Bootstrap 5 en cliente)
   ├── Navbar (barra de navegación superior)
   ├── {children} (página solicitada)
   └── Footer
   │
3. SERVER determina qué página renderizar según la ruta:
   │
   ├── [GET /] → HomePage (page.tsx)
   │   └── Renderiza: Header → MovieCarousel → Secciones → ContactForm
   │
   ├── [GET /galeria] → GaleriaPage (page.tsx con "use client")
   │   └── useEffect #1: fetch /api/genres → obtiene lista de géneros
   │   └── useEffect #2: fetch /api/movies?page=1&limit=24 → obtiene primeras 24 películas
   │   └── Usuario escribe búsqueda y/o cambia filtro de género
   │   └── handleSearch: fetch /api/movies?q=...&genre=...&page=1&limit=24
   │   └── Usuario hace clic en paginación → fetch /api/movies?page=N
   │   └── Usuario hace clic en tarjeta → navega a /galeria/{id}
   │
   ├── [GET /galeria/{id}] → MovieDetailPage (Server Component)
   │   └── Extrae id de params (Promise<{id}>)
   │   └── Consulta prisma.movie.findUnique({ where: {id}, include: {genres, directors, cast} })
   │   └── Si no existe → notFound()
   │   └── Pasa datos a MovieDetailClient → renderiza póster, metadatos, sinopsis, directores, reparto
   │
   ├── [GET /consultas] → ConsultasPage
   │   └── Renderiza MovieSearch (cliente)
   │   └── Usuario escribe nombre → fetch /data/peliculas.json (búsqueda local)
   │   └── Si encuentra → muestra póster, rating, sinopsis
   │   └── Renderiza video player con tráiler de Interstellar
   │
   ├── [GET /quienes-somos] → Página institucional estática
   │
   └── [GET /base-de-datos] → Documentación del esquema DB estática
   │
4. CLIENTE (navegador) ejecuta componentes con "use client":
   ├── Navbar: escucha scroll, actualiza clase active según pathname
   ├── ThemeProvider: lee localStorage, aplica clase light-mode al body
   ├── MovieCarousel: instancia Bootstrap Carousel con autoplay 4.5s
   ├── ContactForm: valida campos, muestra feedback sin enviar a servidor
   └── ScrollAnimation: IntersectionObserver para animaciones al hacer scroll
```

### 4.2 Flujo de Datos en API REST (GaleriaPage)

```
1. Navegador detecta cambio en page/searchKey → useEffect se dispara
   │
2. fetch(`/api/movies?q=${q}&genre=${g}&page=${page}&limit=24`)
   │
3. Route Handler GET /api/movies processa request:
   ├── Parsea searchParams (q, genre, page, limit, skip)
   ├── Construye objeto `where` dinámico:
   │   ├── Si hay query: busca en title, overview, director.name, cast.name, genre.name
   │   └── Si hay genre: filtra por genre.name
   │   └── Todos los filtros son case-insensitive (mode: 'insensitive')
   ├── Ejecuta Promise.all:
   │   ├── prisma.movie.findMany({ where, skip, take, orderBy, include })
   │   └── prisma.movie.count({ where })
   │
4. Prisma traduce a SQL: SELECT ... FROM movies JOIN movie_genres JOIN genre ...
   ├── PostgreSQL ejecuta consulta con índices (idx_year, idx_rating, idx_people)
   └── Retorna filas con JOINs resueltos
   │
5. Route Handler transforma datos:
   ├── Convierte Decimal (imdbRating) a string
   ├── Mapea relaciones anidadas a arrays planos (genres[], directors[], cast[])
   └── Construye objeto pagination { page, limit, total, totalPages }
   │
6. NextResponse.json() → HTTP 200 con JSON
   │
7. GaleriaPage recibe JSON:
   ├── setMovies(data.movies) → actualiza estado
   ├── setPagination(data.pagination) → actualiza paginación
   └── React re-renderiza grid de tarjetas
```

### 4.3 Transformación de Datos (Movie → Vista)

```
Prisma Model (SQL row)
┌─────────────────────────┐
│ id: 1                   │
│ title: "Shawshank..."   │
│ year: 1994              │
│ imdbRating: Decimal(9.3)│
│ posterUrl: "https://..."│
│ directors: [{person:{   │
│   name: "Frank Darabont"│
│ }}]                     │
│ cast: [{person:{...}}]  │
│ genres: [{genre:{...}}] │
└──────────┬──────────────┘
           │ MovieDetailPage (Server Component)
           ▼
┌─────────────────────────┐
│ data = {                │
│   imdbRating: "9.3",    │ ← Decimal → string
│   genres: ["Drama"],     │ ← nested → flat array
│   directors: ["Frank.."],│ ← nested → flat array
│   cast: [{name, order}] │
│ }                       │
└──────────┬──────────────┘
           │ MovieDetailClient (Client Component)
           ▼
┌─────────────────────────┐
│ Render:                 │
│ ├── Image (poster)      │
│ ├── <h1>{title}</h1>    │
│ ├── Badges: año, durac. │
│ ├── Tags: géneros       │
│ ├── Sinopsis            │
│ ├── Directores          │
│ └── Reparto (top 10)    │
└─────────────────────────┘
```

---

## 5. Estructura del Proyecto

```
movies/
│
├── 📁 app/                          # Next.js App Router (capa de presentación)
│   ├── 📄 layout.tsx                # Layout raíz: fuentes, Bootstrap CSS, ThemeProvider, Navbar, Footer
│   ├── 📄 page.tsx                  # Página de inicio (Home)
│   ├── 📄 globals.css               # Estilos globales (860 líneas, variables CSS, tema oscuro/claro)
│   │
│   ├── 📁 galeria/                  # Módulo Galería
│   │   ├── 📄 page.tsx              # "use client" — búsqueda, filtro, grid, paginación
│   │   └── 📁 [id]/
│   │       ├── 📄 page.tsx          # Server Component — detalle de película (consulta Prisma directa)
│   │       └── 📄 MovieDetailClient.tsx  # "use client" — renderiza póster, metadatos, reparto
│   │
│   ├── 📁 consultas/                # Módulo Consultas
│   │   └── 📄 page.tsx              # Búsqueda local en JSON + trailer de video
│   │
│   ├── 📁 quienes-somos/            # Módulo Institucional
│   │   └── 📄 page.tsx              # Misión, visión, equipo
│   │
│   ├── 📁 base-de-datos/            # Módulo Documentación DB
│   │   └── 📄 page.tsx              # Esquema relacional con tablas de ejemplo y diagrama E-R
│   │
│   ├── 📁 api/                      # API REST (Route Handlers)
│   │   ├── 📁 movies/
│   │   │   ├── 📄 route.ts          # GET /api/movies — búsqueda + filtro + paginación
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 route.ts      # GET /api/movies/[id] — detalle individual
│   │   └── 📁 genres/
│   │       └── 📄 route.ts          # GET /api/genres — lista de géneros
│   │
│   ├── 📁 components/               # Componentes compartidos
│   │   ├── 📄 Header.tsx            # Encabezado "MOVIX"
│   │   ├── 📄 Navbar.tsx            # Barra de navegación (cliente)
│   │   ├── 📄 Footer.tsx            # Pie de página (servidor)
│   │   ├── 📄 ThemeProvider.tsx      # Contexto de tema oscuro/claro (cliente)
│   │   ├── 📄 BootstrapClient.tsx    # Carga Bootstrap JS en cliente
│   │   ├── 📄 MovieCarousel.tsx     # Carrusel Bootstrap (cliente)
│   │   ├── 📄 MovieSearch.tsx       # Búsqueda en JSON local (cliente)
│   │   ├── 📄 ContactForm.tsx       # Formulario de contacto (cliente)
│   │   └── 📄 ScrollAnimation.tsx   # Animación scroll con IntersectionObserver (cliente)
│   │
│   └── 📁 generated/prisma/         # Prisma Client generado (ignorado en .gitignore)
│
├── 📁 prisma/                       # Capa de base de datos
│   ├── 📄 schema.prisma             # Esquema ORM (6 modelos)
│   ├── 📄 prisma.config.ts          # Configuración Prisma CLI
│   └── 📁 migrations/               # Migraciones SQL
│       └── 📁 20260526194144_init/
│           └── 📄 migration.sql     # SQL inicial con tablas, índices y FK
│
├── 📁 lib/                          # Utilidades compartidas
│   └── 📄 db.ts                     # Singleton Prisma Client con adapter-pg
│
├── 📁 public/                       # Archivos estáticos
│   ├── 📁 data/
│   │   └── 📄 peliculas.json        # Dataset JSON (150+ películas)
│   ├── 📁 img/                      # Imágenes (carousel, diagrama)
│   ├── 📁 assets/
│   │   └── 📄 InterstellarTrailer.mp4  # Video tráiler
│   └── 📄 *.svg                     # Íconos Next.js por defecto
│
├── 📁 types/                        # Declaraciones TypeScript
│   └── 📄 bootstrap.d.ts            # Módulo declaration para Bootstrap bundle
│
├── 📁 supabase/                     # Scripts SQL adicionales
│   └── 📁 snippets/
│       └── 📄 Untitled query 780.sql  # Inserción masiva de movie_directors
│
├── 📄 package.json                  # Dependencias y scripts
├── 📄 tsconfig.json                 # Configuración TypeScript
├── 📄 next.config.ts                # Configuración Next.js (remote images)
├── 📄 postcss.config.mjs            # Configuración PostCSS + Tailwind
├── 📄 eslint.config.mjs             # Configuración ESLint
├── 📄 .env                          # Variables de entorno (DATABASE_URL)
├── 📄 .gitignore                    # Archivos ignorados
├── 📄 AGENTS.md                     # Notas sobre breaking changes de Next.js
└── 📄 README.md                     # README por defecto de Next.js
```

---

## 6. Tecnologías, Herramientas, Librerías y Paradigmas

### 6.1 Tecnologías Principales

| Tecnología | Versión | Rol |
|---|---|---|
| **Next.js** | 16.2.6 | Framework full-stack con App Router, Server Components y Route Handlers |
| **React** | 19.2.4 | Librería para interfaces de usuario con Server Components |
| **TypeScript** | ^5 | Tipado estático y compilación |
| **Node.js** | (entorno) | Runtime de ejecución del servidor |

### 6.2 Almacenamiento y ORM

| Tecnología | Versión | Rol |
|---|---|---|
| **PostgreSQL** | — | Base de datos relacional |
| **Prisma** | ^7.8.0 | ORM con generación de tipos, migraciones y query builder |
| **@prisma/adapter-pg** | ^7.8.0 | Adaptador de conexión PostgreSQL con pool nativo |
| **dotenv** | — | Carga de variables de entorno |

### 6.3 UI y Estilos

| Tecnología | Versión | Rol |
|---|---|---|
| **Bootstrap** | ^5.3.8 | Framework CSS (navbar, carousel, grid, forms) |
| **Bootstrap Icons** | ^1.13.1 | Librería de iconos SVG |
| **Tailwind CSS** | ^4 | Utilidades CSS (usado solo como base con `@import "tailwindcss"`) |
| **PostCSS** | — | Procesador CSS |

### 6.4 Herramientas de Desarrollo

| Herramienta | Rol |
|---|---|
| **ESLint** | ^9 (con `eslint-config-next`) |
| **TypeScript** | ^5 (strict mode) |

### 6.5 Paradigmas Identificados

| Paradigma | Aplicación en el proyecto |
|---|---|
| **Programación declarativa (React)** | Componentes que describen la UI como función del estado |
| **Componentes de servidor (RSC)** | Páginas que renderizan en servidor y envían HTML al cliente |
| **Arquitectura orientada a componentes** | UI descompuesta en componentes reutilizables |
| **ORM (Object-Relational Mapping)** | Prisma abstrae SQL en objetos TypeScript |
| **REST (API RESTful)** | Endpoints HTTP con semántica GET y rutas por recurso |
| **Singleton** | Cliente Prisma único compartido en toda la app |
| **Context API** | Tema oscuro/claro propagado sin prop drilling |
| **Patrón Observer** | IntersectionObserver para animaciones de scroll |
| **Programación asíncrona** | async/await en Server Components y Route Handlers |

---

## 7. Patrones de Diseño, Principios y Buenas Prácticas

### 7.1 Patrones de Diseño

| Patrón | Ubicación | Descripción |
|---|---|---|
| **Singleton** | `lib/db.ts:5-11` | El cliente Prisma se almacena en `globalThis` para garantizar una única instancia en desarrollo y evitar múltiples conexiones a la base de datos. |
| **Context Provider** | `app/components/ThemeProvider.tsx:12-15` | `ThemeContext` con `Provider` permite que cualquier componente hijo acceda al tema actual y su función `toggle()` sin prop drilling. |
| **Factory Method** | Prisma Client | `PrismaClient` actúa como fábrica que construye objetos de consulta tipados. |
| **Observer** | `app/components/ScrollAnimation.tsx:12-19` | `IntersectionObserver` notifica cuando un elemento entra en el viewport para activar la animación. |
| **Data Transfer Object (DTO)** | `app/api/movies/route.ts:43-56` | Los resultados de Prisma se transforman en objetos planos serializables (conversión de Decimal a string, anidaciones aplanadas) antes de enviarlos como JSON. |
| **Repository (implícito)** | `lib/db.ts` + Prisma | Prisma abstrae el repositorio de datos; `prisma.movie.findMany()`, `.count()`, `.findUnique()` son operaciones de repositorio. |
| **Composición** | Layout/Pages | `layout.tsx` compone `ThemeProvider > BootstrapClient > Navbar > {children} > Footer`. Las páginas componen subcomponentes. |

### 7.2 Principios de Programación

| Principio | Evidencia |
|---|---|
| **KISS (Keep It Simple, Stupid)** | Rutas API con lógica mínima (20-60 líneas cada una); componentes enfocados en una sola responsabilidad. |
| **DRY (Don't Repeat Yourself)** | El cliente Prisma se define una vez en `lib/db.ts` y se reutiliza en todos los Route Handlers y Server Components. |
| **Single Responsibility (SRP)** | `MovieSearch.tsx` solo busca películas; `ContactForm.tsx` solo maneja contacto; `ThemeProvider.tsx` solo gestiona el tema. |
| **Separation of Concerns** | Capas claramente separadas: presentación (componentes), aplicación (Route Handlers), acceso a datos (Prisma/`lib/db.ts`), almacenamiento (PostgreSQL). |
| **Inmutabilidad** | Uso de `useState` con reemplazo de estado, no mutación directa. |
| **Composition over Inheritance** | Componentes se componen anidándose (`<ThemeProvider><Navbar/><main>{children}</main>...`) sin usar herencia de clases. |

### 7.3 Buenas Prácticas Identificadas

| Práctica | Ubicación |
|---|---|
| **Validación de entrada** | `app/api/movies/route.ts:8-9` — `Math.max(1, parseInt(...))` sanitiza página y límite. `app/api/movies/[id]/route.ts:9-11` — validación de ID numérico con respuesta 400. |
| **Paginación con límite máximo** | `app/api/movies/route.ts:9` — `Math.min(50, ...)` evita que un cliente solicite datasets masivos. |
| **Text search case-insensitive** | `app/api/movies/route.ts:16-22` — Uso de `mode: 'insensitive'` en todos los campos textuales. |
| **Carga diferida de Bootstrap JS** | `app/components/BootstrapClient.tsx:8` — Import dinámico con `useEffect` solo en cliente. |
| **Persistencia de tema** | `app/components/ThemeProvider.tsx:28,45` — `localStorage` para tema oscuro/claro persistente entre sesiones. |
| **Animación con IntersectionObserver** | `app/components/ScrollAnimation.tsx` — Carga diferida de animaciones solo cuando el elemento es visible. |
| **Lazy loading de imágenes** | `app/galeria/page.tsx:179` — `loading="lazy"` en imágenes del grid. `carousel-img` en carrusel sin lazy para primer slide. |
| **Imágenes responsivas** | `next.config.ts:4-11` — Configuración de `remotePatterns` para imágenes desde Amazon. `MovieDetailClient.tsx:26-37` — Uso de `next/image` con width/height y estilo responsivo. |
| **Manejo de errores** | Route Handlers retornan 400 (ID inválido) y 404 (no encontrado). Componentes cliente tienen bloques `catch` silenciosos. |
| **Migraciones versionadas** | Prisma migrations en `prisma/migrations/` con SQL explícito y timestamp. |
| **Accesibilidad** | Uso de `aria-labelledby`, `aria-label`, `role="status"`, `visually-hidden` en carrusel, formularios y spinner. |

---

## 8. Ventajas y Limitaciones de la Arquitectura

### 8.1 Ventajas

| # | Ventaja | Explicación |
|---|---|---|
| 1 | **Rendimiento de Server Components** | Las páginas de detalle (`/galeria/[id]`) ejecutan consultas a DB en el servidor y envían HTML ya renderizado, reduciendo JavaScript en el cliente y mejorando el tiempo de primera carga (LCP). |
| 2 | **Separación clara de responsabilidades** | Las tres capas (presentación, aplicación, datos) están bien definidas y desacopladas, facilitando el mantenimiento. |
| 3 | **Tipado fuerte** | TypeScript strict mode + Prisma Client generado proporciona tipos completos desde la base de datos hasta la vista, eliminando errores de proyección. |
| 4 | **Componentes reutilizables** | `ScrollAnimation`, `ThemeProvider`, `BootstrapClient` son componentes transversales usados en múltiples páginas. |
| 5 | **API ligera para interactividad** | Solo 3 endpoints REST que retornan JSON limpio, evitando sobrecarga de GraphQL o lógica compleja en el servidor. |
| 6 | **Base de datos normalizada** | Modelo relacional en 3FN (sin redundancia) con tablas intermedias N:M y claves foráneas con `ON DELETE CASCADE`. |
| 7 | **Persistencia de tema** | El tema oscuro/claro se mantiene entre sesiones mediante `localStorage` sin necesidad de autenticación. |
| 8 | **Despliegue sencillo** | Next.js App Router permite despliegue unificado (frontend + API + Server Components) en una sola aplicación. |

### 8.2 Limitaciones

| # | Limitación | Explicación | Recomendación |
|---|---|---|---|
| 1 | **Sin autenticación ni autorización** | El sistema no tiene registro de usuarios, inicio de sesión ni control de acceso. Cualquier endpoint es público. | Implementar NextAuth.js o un middleware de autenticación. |
| 2 | **Solo operaciones de lectura (GET)** | Las API solo exponen métodos GET. No hay creación (POST), actualización (PUT/PATCH) ni eliminación (DELETE) de recursos. | Extender Route Handlers con operaciones CRUD protegidas por autenticación. |
| 3 | **Validación de entrada limitada** | Los parámetros de API se sanitizan mínimamente (parseInt, min/max) pero no hay validación de esquema con Zod o Yup. | Agregar validación con Zod en los Route Handlers. |
| 4 | **Sin caché de consultas** | Cada solicitud a `/api/movies` ejecuta dos consultas a la DB (findMany + count). Sin Redis, SWR o React Cache, el caché es inexistente. | Implementar React `cache()` de Next.js o SWR en el cliente. |
| 5 | **Consultas N+1 potenciales** | Aunque Prisma eager-loads con `include`, el Route Handler de películas mapea las relaciones una vez obtenidas, lo cual es ineficiente con datasets grandes. | Evaluar `select` en lugar de `include` si solo se necesitan campos específicos. |
| 6 | **Sin pruebas automatizadas** | No hay tests unitarios, de integración ni e2e. | Agregar Vitest para tests unitarios, Playwright para e2e. |
| 7 | **Estado de búsqueda no compartible** | Los resultados de búsqueda en `/galeria` dependen de estado local en React; no generan URLs únicas que puedan compartirse. | Sincronizar filtros con search params de URL (`useSearchParams`). |
| 8 | **Sin sistema de caché en imágenes** | Las imágenes de Amazon se cargan directamente sin capa de optimización intermedia (salvo el resize de next/image). | Configurar imágenes en next.config.ts con dominios y optimización. |
| 9 | **Dependencia de un solo adaptador DB** | `@prisma/adapter-pg` está hardcodeado para PostgreSQL. Migrar a otra base de datos requeriría cambios. | Usar Prisma con driver agnóstico si se anticipa cambio de DB. |

---

## 9. Resumen de Hallazgos

El sistema MOVIX implementa una **arquitectura cliente-servidor por capas** utilizando **Next.js 16 App Router con React Server Components** como framework central. La separación en cuatro capas (presentación, aplicación/ruteo, acceso a datos, almacenamiento) es clara y verificable en la estructura del proyecto.

**Fortalezas principales:**
- Stack moderno y tipado (Next.js 16 + React 19 + TypeScript 5 + Prisma 7)
- Componentización granular con Server/Client boundaries bien definidos
- Modelo de datos relacional normalizado con índices estratégicos
- Sistema de tema oscuro/claro persistente sin librerías externas

**Debilidades principales:**
- Ausencia total de autenticación
- API de solo lectura (sin escritura de datos)
- Sin pruebas automatizadas ni validación de esquemas
- Sin mecanismos de caché

El proyecto presenta una base sólida propia de una aplicación académica de nivel intermedio, con patrones de diseño bien aplicados y una arquitectura mantenible, aunque limitada a operaciones de consulta sin flujos de escritura ni control de acceso.

---

*Documento generado a partir del análisis estático del código fuente. Fecha: 31 de mayo de 2026.*
