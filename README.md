# Courses Tracker API

Backend REST API para **Courses Tracker**, una aplicación full stack separada en cliente y servidor.  
Este repositorio contiene únicamente el backend: responde **JSON**, persiste datos en **PostgreSQL (Supabase)**, valida entradas en servidor, documenta su contrato con **OpenAPI/Swagger** y soporta **subida de imágenes** con **Cloudinary**.

El enunciado original del laboratorio habla de un *Series Tracker*; en esta implementación el dominio se adaptó a **cursos**, pero se mantuvieron los mismos principios: separación cliente/servidor, contrato REST claro, códigos HTTP correctos, CORS, documentación de API e imágenes.

## Links

- Backend desplegado: `https://coursetracker-backend.vercel.app`
- Frontend desplegado: `https://coursetracker-frontend.vercel.app/`
- Repositorio del backend: `https://github.com/PabloVS044/coursetracker-backend`
- Repositorio del frontend: `https://github.com/PabloVS044/coursetracker-frontend`

## Screenshot


```md
![Screenshot de Courses Tracker](./docs/ss.png)
```

## Arquitectura

La aplicación está separada en dos repositorios:

- **Backend**: expone una API REST y se conecta a la base de datos.
- **Frontend**: consume la API usando **HTML + CSS + JavaScript vanilla + fetch()**.

El servidor **no genera HTML**. El cliente **no accede directamente a la base de datos**.

## Tecnologías

- Node.js
- Express
- PostgreSQL en Supabase
- Cloudinary
- OpenAPI / Swagger UI
- CORS
- Vercel

## Requisitos Cumplidos

- Backend HTTP independiente que responde JSON
- CRUD REST completo para el recurso principal
- Persistencia en base de datos real: PostgreSQL
- Cliente separado que consume la API con `fetch()`
- Soporte para imagen por curso
- CORS configurado
- Despliegue público en internet
- Swagger UI servido desde el backend en entorno local

## Challenges Implementados

Estos son los challenges del laboratorio que este backend sí implementa:

- OpenAPI/Swagger escrita y precisa
- Swagger UI servido desde el backend
- Códigos HTTP correctos en la API
- Validación server-side con errores JSON descriptivos
- Paginación con `?page=` y `?limit=`
- Búsqueda por nombre con `?q=`
- Ordenamiento con `?sort=` y `?order=asc|desc`
- Subida de imágenes con límite de tamaño y almacenamiento externo

## Features del Backend

- `GET /courses` lista cursos con paginación, búsqueda y ordenamiento
- `GET /courses/:courseId` devuelve un curso por ID
- `POST /courses` crea un curso
- `PUT /courses/:courseId` actualiza un curso
- `DELETE /courses/:courseId` elimina un curso
- `POST /uploads/image` sube una imagen a Cloudinary y devuelve su URL segura
- `GET /health` verifica que la API y la base de datos estén disponibles
- `GET /openapi.json` devuelve la especificación OpenAPI
- `GET /api-docs` muestra Swagger UI en local

## Endpoints

### Cursos

- `GET /courses`
- `GET /courses/:courseId`
- `POST /courses`
- `PUT /courses/:courseId`
- `DELETE /courses/:courseId`

### Uploads

- `POST /uploads/image`

### Utilidad

- `GET /`
- `GET /health`
- `GET /openapi.json`
- `GET /api-docs`

## Query Params Soportados

En `GET /courses`:

- `page`: número de página, inicia en `1`
- `limit`: cantidad de resultados por página
- `q`: búsqueda por título
- `sort`: `title`, `price`, `created_at`, `level`
- `order`: `asc` o `desc`

Ejemplo:

```http
GET /courses?page=1&limit=10&q=react&sort=title&order=asc
```

## Códigos HTTP

La API usa códigos HTTP coherentes con el resultado de cada operación:

- `200` cuando una consulta o actualización fue exitosa
- `201` cuando un recurso se crea correctamente
- `204` cuando un recurso se elimina correctamente
- `400` cuando el input es inválido
- `404` cuando el recurso no existe
- `424` cuando falla una dependencia externa como Cloudinary
- `500` cuando ocurre un error interno no controlado
- `503` cuando la API está arriba pero no puede conectarse a la base de datos

## Validación

La validación se hace en servidor.  
Cuando una petición es inválida, la API responde JSON con una estructura parecida a esta:

```json
{
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "title must be at least 3 characters long"
      }
    ]
  }
}
```

## CORS

**CORS** es una política de seguridad del navegador que bloquea peticiones entre orígenes distintos si el servidor no las autoriza explícitamente.

En este proyecto se configuró CORS con:

- `Access-Control-Allow-Origin` usando el valor de `CORS_ORIGIN`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

En desarrollo puedes permitir múltiples orígenes, por ejemplo:

```env
CORS_ORIGIN=https://tu-frontend.vercel.app,http://localhost:5500,http://127.0.0.1:5500
```

## Imágenes

Cada curso tiene un campo `image_url`.

El backend soporta dos formas de trabajo:

- guardar manualmente una URL de imagen
- subir un archivo con `POST /uploads/image`

Detalles de la subida:

- usa `multer` en memoria
- acepta `jpg`, `png`, `webp` y `gif`
- límite máximo: **5 MB**
- sube el archivo a Cloudinary
- devuelve la `secure_url` para luego guardarla en `image_url`

## Base de Datos

Se usa **PostgreSQL** alojado en **Supabase**.

La tabla principal es `courses` y contiene, entre otros, estos campos:

- `id`
- `title`
- `instructor`
- `platform`
- `category`
- `level`
- `price`
- `duration_hours`
- `lessons`
- `language`
- `description`
- `image_url`
- `created_at`
- `updated_at`

El esquema también incluye:

- `CHECK constraints`
- trigger para actualizar `updated_at`
- índices básicos para búsqueda y ordenamiento

## Requisitos Previos

- Node.js 18 o superior
- npm
- un proyecto de Supabase con acceso a Postgres
- una cuenta de Cloudinary

## Configuración Local

1. Instala dependencias:

```bash
npm install
```

2. Crea tu `.env`:

```bash
cp .env.example .env
```

3. Configura las variables:

```env
PORT=3000
CORS_ORIGIN=http://127.0.0.1:5500
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
DATABASE_SSL=true
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
CLOUDINARY_FOLDER=coursetracker
```

### Notas sobre Supabase

- Usa la cadena de conexión de **Session pooler**
- No construyas la URL manualmente; cópiala desde **Connect**
- Si tu URL ya trae parámetros SSL, puedes dejar `DATABASE_SSL` vacío

## Inicializar la Base de Datos

Crear esquema:

```bash
npm run db:schema
```

Cargar datos de ejemplo:

```bash
npm run db:seed
```

Hacer ambos pasos:

```bash
npm run db:init
```

También puedes ejecutar `src/db/schema.sql` y `src/db/seed.sql` desde el SQL Editor de Supabase.

## Ejecutar el Proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

## Swagger / OpenAPI

Con el backend corriendo en local:

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/openapi.json`

En Vercel:

- `GET /openapi.json` sigue disponible
- `GET /api-docs` responde una guía simple en JSON en vez de montar la UI completa

## Health Check

`GET /health` valida también la conexión real a la base de datos.

Respuesta esperada:

```json
{
  "status": "ok",
  "database": "ok",
  "timestamp": "2026-05-06T12:00:00.000Z"
}
```

## Despliegue en Vercel

Este backend ya incluye:

- entrada serverless en `api/index.js`
- `vercel.json` con rewrites a `/api`

Variables que debes configurar en Vercel:

- `DATABASE_URL`
- `DATABASE_SSL`
- `CORS_ORIGIN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`

Recomendación:

- prueba primero con `vercel dev`
- verifica que `GET /health` responda `200`
- usa `GET /openapi.json` para comprobar que la función está sirviendo el backend correctamente

## Estructura del Proyecto

```text
coursetracker-backend/
├── api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── docs/
│   ├── middlewares/
│   ├── models/
│   ├── queries/
│   ├── routes/
│   ├── services/
│   └── utils/
├── .env.example
├── package.json
└── vercel.json
```

## Verificación Rápida

Con el backend corriendo:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/courses
curl http://localhost:3000/openapi.json
```

## Reflexión Técnica

Para este laboratorio usé **Node.js + Express** porque permiten construir una API REST clara y rápida de iterar. **Supabase/PostgreSQL** fue una mejor opción que SQLite para practicar conexiones reales, SQL, constraints y despliegue. **Cloudinary** resolvió bien el manejo de imágenes sin tener que almacenar archivos localmente, lo cual además encaja mejor con Vercel.

Sí volvería a usar esta stack para proyectos pequeños o medianos donde quiera separar claramente frontend y backend. Lo que más aportó fue la claridad del contrato REST, la validación en servidor y Swagger para documentar la API. Lo que tuvo más fricción fue la configuración entre entornos, especialmente CORS, Supabase en Vercel y diferencias entre local y serverless, pero precisamente esa parte fue útil para entender mejor un flujo full stack real.

## Pendientes Antes de Entregar

- reemplazar los `TODO` de links por URLs reales
- agregar screenshot real de la aplicación
- confirmar que el frontend desplegado consume correctamente el backend desplegado
