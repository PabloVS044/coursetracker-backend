# Courses Tracker API

Backend REST API para el proyecto **Courses Tracker**.  
Este servidor expone endpoints JSON para administrar cursos y está pensado para ser consumido por un cliente hecho con HTML, CSS y JavaScript vanilla.

## Tecnologías

- Node.js
- Express
- PostgreSQL
- CORS
- Swagger / OpenAPI

## Requisitos

- Node.js 18 o superior
- npm
- PostgreSQL corriendo localmente
- `psql` disponible en terminal

## Configuración local

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
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/coursetracker
DATABASE_SSL=false
```

Notas:
- `CORS_ORIGIN` debe apuntar al origen real del frontend. Si abres el frontend con Live Server suele ser algo como `http://127.0.0.1:5500` o `http://localhost:5500`.
- `DATABASE_URL` debe coincidir con tu usuario, contraseña, host, puerto y nombre de base.

## Crear la base de datos

Si todavía no existe, crea la base:

```bash
psql -h localhost -U postgres -c "CREATE DATABASE coursetracker;"
```

Luego carga el esquema:

```bash
psql -h localhost -U postgres -d coursetracker -f src/db/schema.sql
```

Ese archivo crea:
- la tabla `courses`
- validaciones con `CHECK`
- el trigger para `updated_at`
- índices básicos

## Cargar datos de ejemplo

Si quieres trabajar con cursos de prueba desde el inicio, ejecuta:

```bash
psql -h localhost -U postgres -d coursetracker -f src/db/seed.sql
```

Ese seed agrega cursos de ejemplo y evita duplicados básicos por título.

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

## Swagger

Con el servidor corriendo:

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/openapi.json`

## CORS

CORS es una política de seguridad del navegador que bloquea peticiones entre orígenes distintos si el servidor no las permite explícitamente.  
En desarrollo, este backend usa el valor de `CORS_ORIGIN` para permitir al frontend consumir la API.

## Verificación rápida

Con el servidor corriendo, deberías poder probar:

```bash
curl http://localhost:3000/health
```

Y también:

```bash
curl http://localhost:3000/courses
```

Si `courses` responde vacío, no es error: solo significa que la base todavía no tiene registros.
