# src2.0

Estructura de referencia para una arquitectura layered en NestJS.

## Objetivo

Separar responsabilidades por capas para mantener el proyecto escalable, mantenible y fácil de testear.

## Capas principales

- Presentation: controllers, DTOs, HTTP
- Application: services y use cases
- Domain: entities, interfaces, rules
- Infrastructure: repositories, MySQL, JWT, adapters externos
- Shared: utilities, config, middlewares, filters

## Organización

- app/
  - modules/
    - auth/
    - todos/
- shared/
- database/
