# CoffeeShop API

Backend para un sistema de gestion de cafeteria desarrollado con Node.js, Express y PostgreSQL. El proyecto expone una API REST organizada por modulos y sigue una separacion por capas entre rutas, controladores, servicios y repositorios.

## Que hace el proyecto

Actualmente la API implementa operaciones CRUD para:

- categorias
- productos

La estructura de base de datos del proyecto tambien contempla otras entidades como usuarios, roles, pedidos y detalle de pedidos, definidas en [ddl_v0.sql](C:\Users\pedro\Dev\CoffeShop_ACA\api\db_archives\ddl_v0.sql:1).

## Stack

- Node.js
- Express
- PostgreSQL
- `pg` para conexion a base de datos
- `dotenv` para variables de entorno

## Estructura general

```text
.
├─ api/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ db/
│  │  ├─ middlewares/
│  │  ├─ modules/
│  │  │  ├─ categories/
│  │  │  └─ product/
│  │  ├─ routes.js
│  │  ├─ app.js
│  │  └─ index.js
│  └─ db_archives/
└─ package.json
```

## Variables de entorno

El proyecto necesita un archivo `.env` dentro de `api/` con al menos estas variables:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/coffeeshop
```

## Instalacion

Desde la raiz del proyecto:

```bash
npm install
```

## Ejecucion

Para iniciar la API en modo desarrollo:

```bash
npm run dev:api
```

La aplicacion valida la conexion con la base de datos al arrancar y luego levanta el servidor en el puerto configurado.

## Endpoints principales

Base URL:

```text
/api
```

Categorias:

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

Productos:

- `GET /api/product`
- `GET /api/product/:id`
- `POST /api/product`
- `PUT /api/product/:id`
- `DELETE /api/product/:id`

## Base de datos

El script inicial de base de datos se encuentra en [ddl_v0.sql](C:\Users\pedro\Dev\CoffeShop_ACA\api\db_archives\ddl_v0.sql:1). Alli se define el esquema `app` y las tablas principales del sistema.

## Notas

- El proyecto usa workspaces de npm, con la aplicacion principal dentro de `api/`.
- La ruta raiz `/` responde con el texto `CoffeShop API`.
- Las rutas de productos incluyen informacion de categoria mediante consultas con `JOIN`.
