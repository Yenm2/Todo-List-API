# Arquitectura y guía de mantenimiento

## Visión general

La aplicación sigue una arquitectura modular de NestJS:

```text
HTTP request
    |
    v
Controller -> Service -> Repository abstracto -> Repositorio MySQL -> MysqlService -> MySQL
    |
    +--> JwtAuthGuard (solo en los endpoints que lo declaran)
```

Los controllers traducen HTTP a llamadas de aplicación, los services contienen
las reglas de negocio y los repositories encapsulan SQL. La inversión de
dependencias permite reemplazar la implementación de MySQL por otra sin
cambiar controllers ni services.

## Flujo de arranque

1. `src/main.ts` es el entrypoint y llama a `bootstrap`.
2. `src/server.ts` crea la aplicación NestJS, habilita CORS y escucha en
   `PORT` (3000 por defecto).
3. `src/app.module.ts` importa el módulo de base de datos, autenticación y
   todos.
4. `src/database/mysql.service.ts` crea un pool `mysql2/promise` con las
   variables de entorno.
5. Al destruir el módulo, el pool se cierra mediante `onModuleDestroy`.

## Módulos y archivos

### Raíz

| Archivo | Responsabilidad |
| --- | --- |
| `src/main.ts` | Punto de entrada ejecutable. Invoca el arranque HTTP. |
| `src/server.ts` | Configura NestJS, CORS y el puerto de escucha. |
| `src/app.module.ts` | Composición de los módulos de la aplicación. |
| `nest-cli.json` | Configuración del CLI de Nest y del directorio fuente. |
| `tsconfig.json` | Compilación TypeScript estricta, ESM y decoradores. |
| `package.json` | Dependencias y comandos de desarrollo, build, lint y tests. |
| `.env.example` | Plantilla de configuración local. No contiene secretos reales. |
| `.gitignore` | Excluye dependencias, compilación y metadatos incrementales de Git. |
| `.prettierrc` | Reglas de formato usadas por Prettier. |
| `.oxlintrc.json` | Reglas y alcance de Oxlint para el código fuente. |
| `vitest.config.ts` | Configuración de pruebas unitarias (`*.spec.ts`). |
| `vitest.config.e2e.ts` | Configuración de pruebas end-to-end (`*.e2e-spec.ts`). |
| `tsconfig.build.json` | Configuración específica para compilar el proyecto. |

### Base de datos

| Archivo | Responsabilidad |
| --- | --- |
| `src/database/database.module.ts` | Expone `MysqlService` globalmente para los módulos. |
| `src/database/mysql.service.ts` | Configura y administra el pool de conexiones MySQL. |
| `db/compose.yaml` | Levanta MySQL 8 y monta el volumen persistente. |
| `db/mysql/init.sql` | Crea `usuarios` y `todo`, además de datos iniciales. |

La tabla `todo.user_id` referencia `usuarios.id` con `ON DELETE CASCADE`.
Si se cambia el esquema, actualiza el script de inicialización y documenta la
migración; recuerda que Docker no vuelve a ejecutar el script sobre un volumen
existente.

### Autenticación

| Archivo | Responsabilidad |
| --- | --- |
| `src/modules/auth/auth.module.ts` | Registra controller, service y binding del repository. |
| `src/modules/auth/auth.controller.ts` | Expone `POST /auth/register` y `POST /auth/login`. |
| `src/modules/auth/auth.service.ts` | Comprueba usuarios, aplica bcrypt y firma JWT de una hora. |
| `src/modules/auth/auth.repository.ts` | Contrato de persistencia de usuarios. |
| `src/modules/auth/mysql-auth.repository.ts` | Implementación MySQL del contrato de usuarios. |
| `src/modules/auth/auth.schemas.ts` | Tipos inferidos y esquemas Zod de credenciales. |
| `src/modules/auth/user.model.ts` | Modelo TypeScript de un usuario. |
| `src/modules/auth/jwt-auth.guard.ts` | Lee `Authorization: Bearer`, verifica JWT y agrega `userId` al request. |

El secreto JWT se lee al cargar el módulo. Después de cambiar `JWT_SECRET` se
debe reiniciar el proceso. Nunca se debe registrar el token ni la contraseña.

### Todos

| Archivo | Responsabilidad |
| --- | --- |
| `src/modules/todos/todos.module.ts` | Registra controller, service y binding del repository. |
| `src/modules/todos/todo.controller.ts` | Expone el CRUD y las consultas por usuario. |
| `src/modules/todos/todo.service.ts` | Maneja existencia de registros y delega persistencia. |
| `src/modules/todos/todo.repository.ts` | Contrato de acceso a datos de todos. |
| `src/modules/todos/mysql-todo.repository.ts` | Ejecuta las consultas SQL y mapea filas a modelos. |
| `src/modules/todos/todo.schemas.ts` | Tipos de entrada de creación y actualización. |
| `src/modules/todos/todo.model.ts` | Modelo TypeScript de un todo. |

Actualmente `GET /todos/me` es el único endpoint de todos con
`JwtAuthGuard`. El resto de operaciones no comprueba ownership; antes de
exponer la API a usuarios no confiables, la autorización debe añadirse al
controller/service y las queries de actualización y eliminación deben
restringirse también por `user_id`.

### Rutas heredadas

`src/routes/auth.routes.ts`, `src/routes/todo.routes.ts` y
`src/routes/index.ts` están vacíos y no participan en el enrutamiento. Las
rutas activas se definen directamente con decoradores NestJS en los
controllers. No agregues endpoints a esos archivos salvo que se decida
explícitamente migrar la aplicación a un router distinto.

## Reglas para mantener el código

### Añadir un endpoint

1. Define el método HTTP y la ruta en el controller del módulo correcto.
2. Mantén el controller delgado: parsea parámetros y delega al service.
3. Coloca reglas de negocio, errores `NotFoundException`, ownership y
   transiciones en el service.
4. Agrega el método al contrato abstracto del repository.
5. Implementa el método en `mysql-*.repository.ts` usando placeholders `?`;
   no interpoles valores del usuario en SQL.
6. Si requiere autenticación, aplica `@UseGuards(JwtAuthGuard)` y usa
   `request.userId` en vez de confiar en un identificador enviado por el
   cliente.
7. Actualiza el README y agrega pruebas unitarias o e2e para el nuevo
   comportamiento.

### Validación de entrada

Los esquemas actuales son útiles como tipos, pero no validan requests por sí
solos. Si se activa validación runtime, conecta un `ValidationPipe` o un pipe
de Zod en el arranque y verifica que todos los controllers usen el mismo
formato de errores. Evita afirmar en la documentación que un campo es
obligatorio hasta que exista esa validación en ejecución.

### Base de datos y seguridad

- Usa variables de entorno para credenciales y un `JWT_SECRET` fuerte.
- Conserva bcrypt para contraseñas; nunca guardes contraseñas en texto plano.
- Corrige el seed inicial antes de usarlo en un entorno compartido: el valor
  `menny` de `db/mysql/init.sql` no es un hash bcrypt válido para login.
- Usa consultas parametrizadas y limita el acceso de cada usuario a sus
  propios todos.
- Al cambiar tablas, considera una migración versionada en lugar de depender
  solo de `init.sql`.
- No expongas `password` en respuestas HTTP si se agrega un endpoint de
  usuarios; el modelo interno actualmente sí lo contiene para comparar hashes.

### Cambios y verificación

Antes de integrar cambios:

```bash
npm run format
npm run lint
npm run build
npm run test
npm run test:e2e
```

Para cambios solo de documentación basta con mantener los ejemplos sincronizados
con los decoradores y contratos actuales. Para cambios de API, actualiza
primero el controller/service/repository y después las secciones de API en
`README.md`.
