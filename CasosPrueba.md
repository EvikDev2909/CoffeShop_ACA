# Casos de Prueba Unitarios

Este documento resume 5 pruebas unitarias implementadas en el backend para los módulos `categories` y `product`.

## Módulo Categories

| ID | Archivo de prueba | Caso de prueba | Entrada | Resultado esperado |
| --- | --- | --- | --- | --- |
| CP-01 | `categories.service.test.js` | Consultar una categoría existente por id | `id = 2` y repositorio con categoría registrada | El servicio retorna la categoría encontrada |
| CP-02 | `categories.service.test.js` | Validar creación de categoría sin nombre válido | `name = "   "` | El servicio lanza error `400` con mensaje `El nombre es requerido` |
| CP-03 | `categories.controller.test.js` | Validar respuesta HTTP al listar categorías | Solicitud `GET` simulada al controlador | El controlador responde `200` y retorna el arreglo de categorías |

## Módulo Product

| ID | Archivo de prueba | Caso de prueba | Entrada | Resultado esperado |
| --- | --- | --- | --- | --- |
| CP-04 | `product.service.test.js` | Validar creación de producto con normalización de datos | `name` con espacios, `price` y `cost` como texto, `category_id` como texto | El servicio convierte valores al tipo correcto y envía el payload limpio al repositorio |
| CP-05 | `product.controller.test.js` | Validar propagación de errores async en eliminación | Solicitud `DELETE` simulada y servicio que falla controladamente | El controlador envía el error a `next()` para manejo centralizado |

## Observación

Los casos anteriores fueron tomados de pruebas unitarias reales ya implementadas en el proyecto y ejecutadas exitosamente.
