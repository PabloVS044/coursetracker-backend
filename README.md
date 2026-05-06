# Courses Tracker API

Backend REST API para el proyecto **Courses Tracker**.  
Este servidor expone endpoints JSON para administrar cursos y está pensado para ser consumido por un cliente hecho con HTML, CSS y JavaScript vanilla.

## Tecnologías

- Node.js
- Express
- PostgreSQL (Supabase)
- Cloudinary
- CORS
- Swagger / OpenAPI

## Requisitos

- Node.js 18 o superior
- npm
- un proyecto de Supabase con acceso a Postgres
- opcional: `psql` si prefieres cargar scripts SQL desde terminal

## Configuración con Supabase

1. Instala dependencias:

```bash
npm install
```

2. Crea tu archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

3. Ajusta los valores si hace falta:

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

Notas:
- `CORS_ORIGIN` debe apuntar al origen real del frontend. Si abres el frontend con Live Server suele ser algo como `http://127.0.0.1:5500` o `http://localhost:5500`.
- Para este backend Express conviene usar la URI de **Session pooler** que aparece en el botón **Connect** de Supabase. Esa opción es la recomendada para clientes persistentes cuando trabajas sobre IPv4.
- Si tu hosting soporta IPv6, también puedes usar la conexión directa de Supabase.
- Evita usar el **Transaction pooler** para este backend mientras corra como servidor persistente; ese modo está pensado para conexiones cortas o serverless.
- `DATABASE_SSL=true` fuerza TLS cuando tu URI no trae parámetros SSL. Si la cadena copiada desde Supabase ya incluye `sslmode` o certificados, puedes dejar `DATABASE_SSL` vacío para no sobrescribir esa configuración.
- `CLOUDINARY_FOLDER` es opcional. Si lo defines, todas las imagenes se guardaran dentro de esa carpeta.

## Configurar Cloudinary

1. Crea o abre tu cuenta de Cloudinary.
2. Copia `Cloud name`, `API Key` y `API Secret` desde el dashboard.
3. Coloca esos valores en tu archivo `.env`.

Este backend expone `POST /uploads/image` y sube la imagen a Cloudinary desde el servidor.  
El frontend usa ese endpoint cuando eliges un archivo en el formulario del curso.

## Preparar la base en Supabase

Supabase ya crea la base Postgres por ti. Lo que necesitas cargar es el esquema del proyecto.

Opción recomendada:
- abre el **SQL Editor** de Supabase
- ejecuta el contenido de `src/db/schema.sql`

Opción por terminal desde este backend:

```bash
npm run db:schema
```

Ese archivo crea:
- la tabla `courses`
- validaciones con `CHECK`
- el trigger para `updated_at`
- índices básicos

Si prefieres CLI, puedes ejecutar ese mismo script usando la cadena de conexión de Supabase con `psql`.

## Cargar datos de ejemplo

Si quieres trabajar con cursos de prueba desde el inicio, ejecuta el contenido de `src/db/seed.sql` en el SQL Editor de Supabase.

También puedes hacerlo por terminal:

```bash
npm run db:seed
```

Ese seed agrega cursos de ejemplo y evita duplicados básicos por título.

Si quieres hacer ambas cosas seguidas:

```bash
npm run db:init
```

## Ejecutar el servidor

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

## Endpoints principales

- `GET /health`
- `GET /courses`
- `GET /courses/:courseId`
- `POST /courses`
- `PUT /courses/:courseId`
- `DELETE /courses/:courseId`
- `POST /uploads/image`

## Swagger

Con el servidor corriendo:

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/openapi.json`

## CORS

CORS es una política de seguridad del navegador que bloquea peticiones entre orígenes distintos si el servidor no las permite explícitamente.  
En desarrollo, este backend usa el valor de `CORS_ORIGIN` para permitir al frontend consumir la API.

## Carga de imagenes

En el formulario ahora puedes:

- pegar una `image_url` manual
- o seleccionar un archivo `.jpg`, `.png`, `.webp` o `.gif`

Si seleccionas un archivo, el frontend lo envía a `POST /uploads/image`, el backend lo sube a Cloudinary y luego guarda la `secure_url` resultante en `image_url`.

## Health check

`GET /health` ahora valida también la conexión real a la base de datos.

- responde `200` cuando la API y Postgres están disponibles
- responde `503` cuando el servidor está arriba pero no puede conectarse a Supabase

## Verificación rápida

Con el servidor corriendo, deberías poder probar:

```bash
curl http://localhost:3000/health
```

Si todo está bien, la respuesta incluirá algo como:

```json
{
  "status": "ok",
  "database": "ok",
  "timestamp": "2026-05-06T12:00:00.000Z"
}
```

Y también:

```bash
curl http://localhost:3000/courses
```

Si `courses` responde vacío, no es error: solo significa que tu base de Supabase todavía no tiene registros.
