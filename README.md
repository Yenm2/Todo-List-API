# Todo List API

Backend HTTP para gestionar usuarios y tareas (`todos`). Está construido con
NestJS, TypeScript y MySQL, y utiliza JWT para autenticar la consulta de tareas
del usuario actual.

## Requisitos

- Node.js compatible con las versiones indicadas por el proyecto.
- npm.
- Docker y Docker Compose (recomendado para ejecutar MySQL).

## Instalación y ejecución

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea el archivo de entorno a partir de `.env.example` y configura la
   conexión. Para la base de datos incluida en `db/compose.yaml`, los valores
   mínimos son:

   ```dotenv
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=pass
   DB_NAME=app
   JWT_SECRET=una-clave-larga-y-segura
   ```

3. Inicia MySQL:

   ```bash
   docker compose -f db/compose.yaml up -d
   ```

   El script `db/mysql/init.sql` se ejecuta únicamente cuando el volumen de
   MySQL se crea por primera vez.

4. Inicia la API:

   ```bash
   npm run start:dev
   ```

   La API queda disponible en `http://localhost:3000`. Para producción:

   ```bash
   npm run build
   npm run start:prod
   ```

## Autenticación

El registro y el login devuelven un JWT con una vigencia de una hora:

```json
{
  "token": "eyJ...",
  "userId": 1
}
```

Para los endpoints protegidos se debe enviar:

```http
Authorization: Bearer <token>
```

Las contraseñas registradas mediante la API se almacenan con bcrypt. El usuario
insertado directamente por `db/mysql/init.sql` usa el valor `menny` sin hash,
por lo que no debe utilizarse como credencial de login sin corregir el seed.

## API

La URL base es `http://localhost:3000`.

### Registro

```http
POST /auth/register
Content-Type: application/json
```

Body:

```json
{
  "username": "ana",
  "password": "secreto123"
}
```

Responde `201 Created` con `{ "token": "...", "userId": 2 }`. Si el usuario ya
existe, responde `409 Conflict`.

### Login

```http
POST /auth/login
Content-Type: application/json
```

Body:

```json
{
  "username": "ana",
  "password": "secreto123"
}
```

Responde `201 Created` con el token y el identificador del usuario. Las
credenciales inválidas producen `401 Unauthorized`.

### Listar todos

```http
GET /todos
```

Devuelve todos los registros, ordenados por `id` descendente:

```json
[
  {
    "id": 1,
    "userId": 2,
    "nombre": "Comprar leche",
    "descripcion": "Pasar por el supermercado",
    "createdAt": "2026-09-17T16:20:00.000Z"
  }
]
```

Este endpoint es público en la implementación actual.

### Listar todos de un usuario

```http
GET /todos/user/:userId
```

Ejemplo:

```bash
curl http://localhost:3000/todos/user/2
```

También es público actualmente; el servicio filtra por `user_id`.

### Listar mis todos

```http
GET /todos/me
Authorization: Bearer <token>
```

Usa el `userId` contenido en el JWT y no acepta el identificador por query o
body. Sin token o con un token inválido responde `401 Unauthorized`.

### Consultar un todo

```http
GET /todos/:id
```

Ejemplo:

```bash
curl http://localhost:3000/todos/1
```

Responde `404 Not Found` si no existe. Los parámetros que no sean enteros
responden `400 Bad Request`.

### Crear un todo

```http
POST /todos
Content-Type: application/json
```

Body:

```json
{
  "userId": 2,
  "nombre": "Comprar leche",
  "descripcion": "Pasar por el supermercado"
}
```

Responde `201 Created` con el todo creado. La API actual no protege este
endpoint con JWT: el `userId` se recibe del body.

### Actualizar un todo

```http
PATCH /todos/:id
Content-Type: application/json
```

Se pueden enviar uno o ambos campos:

```json
{
  "nombre": "Comprar leche y pan",
  "descripcion": "Comprar antes de las 18:00"
}
```

Responde `200 OK` con el registro actualizado. Un body vacío deja el registro
sin cambios; si el todo no existe responde `404 Not Found`.

### Eliminar un todo

```http
DELETE /todos/:id
```

Responde `204 No Content`. Si el todo no existe responde `404 Not Found`.

## Errores y validación

NestJS convierte las excepciones del servicio en respuestas JSON con el status
HTTP correspondiente. `ParseIntPipe` valida los parámetros `id` y `userId`.
Los archivos `auth.schemas.ts` y `todo.schemas.ts` describen tipos y reglas,
pero no hay un `ValidationPipe` ni un pipe de Zod registrado en `main.ts`;
por ello, las reglas de esos esquemas no se aplican automáticamente a los
requests actuales.

## Scripts útiles

| Comando | Uso |
| --- | --- |
| `npm run start:dev` | Ejecutar en desarrollo con watch |
| `npm run build` | Compilar a `dist/` |
| `npm run start:prod` | Ejecutar la compilación |
| `npm run lint` | Ejecutar Oxlint |
| `npm run format` | Formatear TypeScript |
| `npm run test` | Ejecutar pruebas Vitest |
| `npm run test:e2e` | Ejecutar pruebas end-to-end |

La descripción de módulos, el flujo de una petición y las reglas para mantener
el código están en [ARCHITECTURE.md](./ARCHITECTURE.md).

## CLI de prueba

El script `cli/todo-cli.sh` permite probar rápidamente los endpoints desde
Bash. No requiere dependencias adicionales aparte de `curl` y `sed`:

```bash
chmod +x cli/todo-cli.sh
./cli/todo-cli.sh register ana secreto123
./cli/todo-cli.sh mine
./cli/todo-cli.sh create 1 "Comprar leche" "Pasar por el supermercado"
./cli/todo-cli.sh list
```

`register` y `login` guardan el JWT en `~/.todo-list-api-token`; `mine` lo usa
para llamar a `GET /todos/me`. Para apuntar a otro servidor:

```bash
TODO_API_URL=http://localhost:4000 ./cli/todo-cli.sh list
```
