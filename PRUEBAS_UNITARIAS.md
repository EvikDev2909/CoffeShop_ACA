# Pruebas unitarias del backend

Este proyecto ya incluye una suite de pruebas unitarias para los módulos `categories` y `product` usando el runner nativo de Node.js.

## Requisitos

- Node.js `v22.22.1` o superior recomendado
- Dependencias instaladas con `npm install`

## Comandos

Desde la raíz del proyecto:

```bash
npm run test:api
```

Si quieres ejecutar las pruebas entrando a la carpeta `api`:

```bash
cd api
npm test
```

Para correr únicamente las pruebas unitarias descubiertas dentro de `src`:

```bash
cd api
npm run test:unit
```

## Scripts disponibles

En `api/package.json` quedaron definidos estos scripts:

```json
{
  "scripts": {
    "dev": "node --watch src/index.js",
    "test": "node --test",
    "test:unit": "node --test src/modules/categories/categories.controller.test.js src/modules/categories/categories.repository.test.js src/modules/categories/categories.service.test.js src/modules/product/product.controller.test.js src/modules/product/product.repository.test.js src/modules/product/product.service.test.js"
  }
}
```

Y en la raíz puedes agregar o usar este comando del workspace:

```bash
npm run test -w @coffeshop/api
```

## Cobertura funcional de las pruebas

### Categories

Se validan tres capas del módulo:

- `categories.service.test.js`
  - Retorno de categorías
  - Búsqueda por id
  - Error `404` cuando no existe
  - Validación de nombre requerido
  - Creación
  - Actualización
  - Eliminación

- `categories.controller.test.js`
  - Respuesta `200` en listado
  - Respuesta `200` en búsqueda por id
  - Respuesta `201` en creación
  - Respuesta `200` en actualización
  - Propagación de errores con `next`

- `categories.repository.test.js`
  - SQL de listado
  - SQL de búsqueda por id
  - SQL de inserción
  - SQL de actualización
  - SQL de eliminación

### Product

Se validan tres capas del módulo:

- `product.service.test.js`
  - Retorno de productos
  - Validación de id
  - Error `404` cuando no existe
  - Normalización de payload
  - Validación de `available`
  - Actualización
  - Eliminación

- `product.controller.test.js`
  - Respuesta `200` en listado
  - Respuesta `200` en búsqueda por id
  - Respuesta `201` en creación
  - Respuesta `200` en actualización
  - Propagación de errores con `next`

- `product.repository.test.js`
  - SQL con `JOIN` para listado
  - SQL de búsqueda por id
  - SQL de inserción
  - SQL de actualización
  - SQL de eliminación

## Estructura creada

```text
api/
  src/
    test-utils/
      httpMocks.js
    modules/
      categories/
        categories.controller.test.js
        categories.repository.test.js
        categories.service.test.js
      product/
        product.controller.test.js
        product.repository.test.js
        product.service.test.js
```

## Decisiones técnicas

- Se usó `node:test` para no agregar Jest o Vitest innecesariamente.
- Se aplicó inyección de dependencias en `controller`, `service` y `repository` para facilitar mocks limpios.
- Los tests de `repository` son unitarios: no abren conexión real a PostgreSQL, solo verifican consultas y parámetros.
- Los tests de `controller` validan respuestas HTTP simuladas.
- Los tests de `service` validan reglas de negocio y errores esperados.

## Qué no cubren todavía

- Integración real con base de datos
- Pruebas E2E de rutas Express
- Validación de llaves foráneas reales, por ejemplo `category_id` existente en PostgreSQL

## Recomendación de uso

Corre las pruebas antes de cada cambio de módulo:

```bash
cd api
npm test
```
