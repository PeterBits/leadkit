# Plan de Acción - LEADKIT v2

## Visión General

Transformar la aplicación de un Kanban simple a una herramienta completa de gestión para tech leads con 5 secciones principales:

| Ruta         | Sección              | Propósito                                       |
| ------------ | -------------------- | ----------------------------------------------- |
| `/`          | Dashboard            | Vista global del estado de todo                  |
| `/tasks`     | Tareas Personales    | Kanban personal del tech lead                    |
| `/team`      | Tracking del Equipo  | Seguimiento detallado de tareas del equipo       |
| `/meetings`  | Reuniones            | Preparación de reuniones con el líder            |
| `/settings`  | Configuración        | CRUD de miembros, prioridades y categorías       |

## Convenciones de Naming

| Contexto                          | Formato      | Ejemplo                          |
| --------------------------------- | ------------ | -------------------------------- |
| Keys de objetos/interfaces (datos)| `snake_case` | `created_at`, `team_task_id`     |
| Variables, funciones, hooks       | `camelCase`  | `saveTask`, `teamMembers`        |
| Componentes React, clases         | `PascalCase` | `TaskCard`, `SettingsPanel`      |

> Esto aplica a todo el código nuevo y se irá migrando el código existente progresivamente.

## Fases

| Orden | Fase | Archivo | Estado |
| ----- | ---- | ------- | ------ |
| 0 | Infraestructura Base | [fase-0-infraestructura.md](./fase-0-infraestructura.md) | Pendiente |
| 1 | Modelos de Datos | [fase-1-modelos-datos.md](./fase-1-modelos-datos.md) | Pendiente |
| 2 | Tareas Personales | [fase-2-tareas-personales.md](./fase-2-tareas-personales.md) | Pendiente |
| 3 | Tracking del Equipo | [fase-3-tracking-equipo.md](./fase-3-tracking-equipo.md) | Pendiente |
| 4 | Reuniones con el Líder | [fase-4-reuniones.md](./fase-4-reuniones.md) | Pendiente |
| 5 | Dashboard | [fase-5-dashboard.md](./fase-5-dashboard.md) | Pendiente |
| 6 | Configuración | [fase-6-configuracion.md](./fase-6-configuracion.md) | Pendiente |
| 7 | Ajustes Dashboard | [fase-7-ajustes-dashboard.md](./fase-7-ajustes-dashboard.md) | Pendiente |

## Orden de Implementación Recomendado

| Orden | Fase   | Descripción                         | Dependencias |
| ----- | ------ | ----------------------------------- | ------------ |
| 1     | 0.1    | Sistema de rutas                     | —            |
| 2     | 0.3    | Nueva estructura de carpetas         | 0.1          |
| 3     | 0.2    | Refactor de estado                   | 0.3          |
| 4     | 1.1-1.2| Modelos de datos + migración BD      | 0.2          |
| 5     | 0.4    | Migración IndexedDB                  | 1.1          |
| 6     | 6.2    | CRUD de categorías en settings       | 1.1          |
| 7     | 2      | Tareas personales (adaptar Kanban)   | 5, 6         |
| 8     | 3.1-3.2| Tracking equipo (vistas Kanban)      | 5            |
| 9     | 3.3    | Detalle de tarea (modal completo)    | 8            |
| 10    | 4      | Reuniones con el líder               | 8            |
| 11    | 5      | Dashboard                            | 7, 8, 10     |
| 12    | 7      | Ajustes Dashboard + accesos directos | 5             |

## Consideraciones Técnicas

### Rendimiento
- Las consultas a IndexedDB por `team_task_id` (subtasks, comments, timeline) se hacen bajo demanda al abrir el detalle de una tarea, no al cargar la lista

### Safelist de Tailwind
- Al crear el CRUD de categorías con colores dinámicos, asegurar que los nuevos colores se añadan al safelist
- Considerar generar el safelist programáticamente o usar un set amplio predefinido

### Timeline Events
- Los eventos del timeline se generan automáticamente cuando:
  - Se cambia el status de una tarea
  - Se marca/desmarca una subtarea
  - Se registra un bloqueo/desbloqueo
- Tanto el bloqueo como el desbloqueo aceptan un comentario/motivo opcional
- También se pueden crear eventos manuales

### Reuniones - Generación de Estado
- El estado del equipo en la reunión es una "foto" en el momento de la reunión
- Se recomienda almacenar el snapshot generado para que quede como registro histórico (no depender solo de datos en vivo que pueden cambiar)
