# LEADKIT

Aplicación web para gestión de equipos de desarrollo frontend: tablero Kanban, seguimiento de reuniones y dashboard de equipo.

## Índice

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Modelos de Datos](#modelos-de-datos)
- [Base de Datos (IndexedDB)](#base-de-datos-indexeddb)
- [Componentes](#componentes)
- [Funcionalidades](#funcionalidades)
- [Guía de Desarrollo](#guía-de-desarrollo)
- [Mejoras Futuras](#mejoras-futuras)

---

## Descripción

LEADKIT es una aplicación diseñada para technical leads que gestionan equipos de desarrollo frontend. Permite:

- Gestionar tareas del equipo mediante un tablero Kanban (To Do → Doing → Done)
- Preparar y documentar reuniones semanales con el lead
- Configurar dinámicamente miembros del equipo y prioridades
- Almacenar todos los datos localmente en el navegador (IndexedDB)
- **Responsive:** Sidebar en desktop, bottom tab bar en móvil
- **PWA:** Instalable como aplicación nativa

**Contexto de uso:** Pensada para technical leads con equipos de cualquier tamaño, con reuniones periódicas de seguimiento.

---

## Tecnologías

| Tecnología       | Versión | Propósito                |
| ---------------- | ------- | ------------------------ |
| React            | 18.x    | UI Library               |
| TypeScript       | 5.x     | Type safety              |
| Vite             | 6.x     | Build tool               |
| React Router     | 6.x     | Client-side routing      |
| vite-plugin-pwa  | 1.x     | Progressive Web App      |
| IndexedDB        | Nativo  | Persistencia local       |
| Tailwind CSS     | 3.x     | Estilos (utility-first)  |
| Lucide React     | 0.263.x | Iconografía              |

---

## Instalación

```bash
# Clonar o entrar al directorio
cd leadkit

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo (localhost:5173)
npm run build    # Build de producción (genera PWA)
npm run preview  # Preview del build
npm run lint     # Linting con ESLint
```

### Instalar como PWA

**En móvil (Chrome/Safari):**
1. Abre la app en el navegador
2. Toca el menú (⋮) o botón compartir
3. Selecciona "Añadir a pantalla de inicio"

**En escritorio (Chrome/Edge):**
1. Abre la app en el navegador
2. Click en el icono de instalación en la barra de direcciones
3. Confirma la instalación

---

## Estructura del Proyecto

```
leadkit/
├── src/
│   ├── views/                          # Una carpeta por vista
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx       # Vista principal con resumen
│   │   ├── tasks/
│   │   │   ├── TasksPage.tsx           # Kanban de tareas
│   │   │   └── components/             # Componentes exclusivos de tasks
│   │   │       ├── KanbanColumn.tsx
│   │   │       ├── TaskCard.tsx
│   │   │       ├── TaskModal.tsx
│   │   │       └── index.ts
│   │   ├── meetings/
│   │   │   ├── MeetingsPage.tsx        # Reuniones con el Leader
│   │   │   └── components/             # Componentes exclusivos de meetings
│   │   │       ├── CreateMeetingModal.tsx
│   │   │       ├── MeetingListItem.tsx
│   │   │       ├── MeetingModal.tsx
│   │   │       ├── TeamStatusSection.tsx
│   │   │       ├── MemberSnapshotCard.tsx
│   │   │       ├── TopicsSection.tsx
│   │   │       ├── FeedbackSection.tsx
│   │   │       ├── PendingTopicsPanel.tsx
│   │   │       └── index.ts
│   │   ├── team/
│   │   │   ├── TeamPage.tsx            # Seguimiento de equipo (Kanban + detalle)
│   │   │   └── components/             # Componentes exclusivos de team
│   │   │       ├── TeamKanbanColumn.tsx
│   │   │       ├── TeamTaskCard.tsx
│   │   │       ├── TeamTaskModal.tsx
│   │   │       ├── TeamTaskDetail.tsx
│   │   │       ├── SubtaskList.tsx
│   │   │       ├── CommentSection.tsx
│   │   │       ├── TaskTimeline.tsx
│   │   │       └── index.ts
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx        # Configuración de equipo, prioridades y categorías
│   │   └── index.ts
│   ├── components/
│   │   ├── shared/                     # Componentes compartidos entre vistas
│   │   │   ├── PrioritySelector.tsx    # Selector de prioridad reutilizable
│   │   │   ├── CategorySelector.tsx   # Selector de categoria reutilizable
│   │   │   └── index.ts
│   │   └── layout/                     # Componentes compartidos (navegación)
│   │       ├── Layout.tsx              # Shell con Sidebar + BottomNav + Outlet
│   │       ├── Sidebar.tsx             # Navegación desktop (sidebar izquierdo)
│   │       ├── BottomNav.tsx           # Navegación móvil (tab bar inferior)
│   │       └── index.ts
│   ├── context/
│   │   ├── DataContext.tsx             # teamMembers, priorities, categories
│   │   ├── PersonalTasksContext.tsx    # personalTasks
│   │   ├── TeamTasksContext.tsx        # teamTasks, subtasks, comments, timeline
│   │   ├── MeetingsContext.tsx         # meetings, meetingTopics
│   │   └── index.ts
│   ├── constants/                      # Constantes fragmentadas por entidad
│   │   ├── priority.ts                # PRIORITY_COLORS
│   │   ├── category.ts               # DEFAULT_CATEGORY_COLORS
│   │   ├── team-task.ts              # PROGRESS_MODES, TEAM_TASK_STATUSES
│   │   ├── timeline-event.ts         # TIMELINE_EVENT_TYPES
│   │   └── index.ts
│   ├── services/
│   │   └── database.ts                # Operaciones IndexedDB (v5, 11 stores)
│   ├── types/                          # Sistema de tipos por entidad
│   │   ├── entities/                   # Interfaces de datos
│   │   │   ├── category.ts
│   │   │   ├── personal-task.ts
│   │   │   ├── team-task.ts
│   │   │   ├── subtask.ts
│   │   │   ├── task-comment.ts
│   │   │   ├── timeline-event.ts
│   │   │   ├── meeting.ts
│   │   │   ├── meeting-topic.ts
│   │   │   ├── meeting-snapshot.ts
│   │   │   ├── team-member.ts
│   │   │   ├── priority.ts
│   │   │   └── index.ts
│   │   ├── interfaces/                 # Props de componentes y contextos
│   │   │   ├── personal-task.ts
│   │   │   ├── team-task.ts
│   │   │   ├── meeting.ts
│   │   │   ├── meeting-snapshot.ts
│   │   │   ├── priority.ts
│   │   │   ├── category.ts
│   │   │   ├── context.ts
│   │   │   ├── task.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── dates.ts                    # Utilidades de fechas/semanas
│   │   ├── ids.ts                      # Generación de IDs
│   │   ├── team-tasks.ts              # getTaskProgress, isTaskBlocked
│   │   └── meeting-snapshots.ts       # generateMeetingSnapshots
│   ├── App.tsx                         # Router shell (~20 líneas)
│   ├── main.tsx                        # Entry point con BrowserRouter
│   ├── index.css                       # Estilos globales + Tailwind
│   └── vite-env.d.ts
├── public/
│   └── icon.svg                        # Icono PWA
├── plan/                               # Plan de desarrollo por fases
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts                      # Incluye configuración PWA
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Arquitectura

### Routing

La aplicación usa **React Router v6** con las siguientes rutas:

| Ruta         | Página           | Descripción                          |
| ------------ | ---------------- | ------------------------------------ |
| `/`          | DashboardPage    | Resumen general con contadores       |
| `/tasks`     | TasksPage        | Kanban de tareas                     |
| `/team`      | TeamPage         | Seguimiento del equipo (Kanban + detalle)|
| `/meetings`  | MeetingsPage     | Reuniones con el leader              |
| `/settings`  | SettingsPage     | CRUD de miembros, prioridades y categorías |

### Navegación

- **Desktop (sm:+):** Sidebar fijo a la izquierda (240px) con iconos + labels
- **Móvil:** Bottom tab bar fijo con 5 iconos

### Gestión de Estado

4 React Contexts organizados por dominio:

| Contexto | Datos | Stores IndexedDB |
|---|---|---|
| **DataContext** | teamMembers, priorities, categories | team_members, priorities, categories |
| **PersonalTasksContext** | personalTasks | personal_tasks |
| **TeamTasksContext** | teamTasks, subtasks, taskComments, timelineEvents | team_tasks, subtasks, task_comments, timeline_events |
| **MeetingsContext** | meetings, meetingTopics, meetingSnapshots | meetings, meeting_topics, meeting_snapshots |

### Flujo de Datos

1. **Carga inicial:** Contexts + Pages → `dbOperation(getAll)` → `setState()`
2. **Crear/Editar:** Acción usuario → `save*()` → `dbOperation(put)` → `setState()`
3. **Eliminar:** Acción usuario → `delete*()` → `dbOperation(delete)` → `setState()`
4. **Mover tarea:** Click flecha → `moveTask()` → `saveTask()` con nuevo status

---

## Modelos de Datos

### Datos de referencia

#### TeamMember
```typescript
{ id, name, created_at }
```

#### Priority
```typescript
{ id, color, level, created_at }
```
> Nivel único (1-10). Se muestra como "P1", "P2", etc. con el color de fondo.

#### Category
```typescript
{ id, name, color, created_at }
```
> Categorías personalizables para clasificar tareas personales.

### Tareas personales

#### PersonalTask
```typescript
{ id, title, description, status, priority_id, category_id, created_at, updated_at }
```
> Tareas propias del tech lead. Sin asignado (siempre del lead).

### Tareas de equipo

#### TeamTask
```typescript
{ id, title, description, assignee_id, status, priority_id, jira_ref, start_date, deadline, progress_mode, manual_progress, created_at, updated_at }
```
> `progress_mode`: `'auto'` (calculado por subtareas) o `'manual'` (porcentaje directo).

#### Subtask
```typescript
{ id, team_task_id, title, completed, order, created_at }
```

#### TaskComment
```typescript
{ id, team_task_id, content, created_at }
```

#### TimelineEvent
```typescript
{ id, team_task_id, type, description, created_at }
```
> `type`: `'started'` | `'blocked'` | `'unblocked'` | `'subtask_completed'` | `'completed'` | `'status_change'`

### Reuniones

#### Meeting
```typescript
{ id, date, notes, leader_feedback, created_at }
```

#### MeetingTopic
```typescript
{ id, meeting_id, title, description, resolved, resolved_at, created_at }
```
> `meeting_id` nullable: permite temas sin reunión asignada.

#### MeetingSnapshot
```typescript
{ id, meeting_id, member_id, member_name, tasks_doing, tasks_blocked, tasks_completed_since_last, overall_progress, created_at }
```
> Snapshot del estado de un miembro del equipo en una reunión. Generado automáticamente desde el tracking.

### Colores disponibles para prioridades

| Color    | Valor Tailwind |
| -------- | -------------- |
| Gris     | gray-400       |
| Azul     | blue-400       |
| Verde    | green-400      |
| Amarillo | yellow-400     |
| Naranja  | orange-400     |
| Rojo     | red-400        |
| Púrpura  | purple-400     |
| Rosa     | pink-400       |

---

## Base de Datos (IndexedDB)

### Configuración

```typescript
const DB_NAME = "FrontendTeamDB";
const DB_VERSION = 5;
```

### Object Stores (11)

| Store | keyPath | Índices |
|---|---|---|
| `team_members` | `id` | — |
| `priorities` | `id` | `level` |
| `categories` | `id` | — |
| `personal_tasks` | `id` | `status`, `category_id` |
| `team_tasks` | `id` | `assignee_id`, `status` |
| `subtasks` | `id` | `team_task_id` |
| `task_comments` | `id` | `team_task_id` |
| `timeline_events` | `id` | `team_task_id` |
| `meetings` | `id` | `date` |
| `meeting_topics` | `id` | `meeting_id`, `resolved` |
| `meeting_snapshots` | `id` | `meeting_id` |

### Operaciones

```typescript
// Función genérica para operaciones
const dbOperation = async <T>(storeName, mode, operation): Promise<T>

// Ejemplos de uso:
await dbOperation('team_members', 'readonly', store => store.getAll());
await dbOperation('personal_tasks', 'readwrite', store => store.put(task));
await dbOperation('priorities', 'readwrite', store => store.delete(id));
```

---

## Componentes

### Jerarquía

```
App (Router shell)
└── Layout
    ├── Sidebar (desktop)
    ├── BottomNav (móvil)
    └── Outlet → Pages
        ├── DashboardPage
        │   ├── Widgets (Mis Tareas, Equipo, Próxima Reunión, Alertas)
        │   └── Accesos rápidos (4 botones)
        ├── TasksPage
        │   ├── Filtros (select por categoria)
        │   ├── KanbanColumn (x3: todo, doing, done)
        │   │   └── TaskCard (x n tareas)
        │   └── TaskModal (crear/editar con CategorySelector)
        ├── TeamPage
        │   ├── Vista Unificada / Por Persona (toggle)
        │   ├── TeamKanbanColumn (x3: todo, doing, done)
        │   │   └── TeamTaskCard (progreso, bloqueado, JIRA)
        │   ├── TeamTaskModal (crear/editar)
        │   └── TeamTaskDetail (info + subtareas + comments + timeline)
        │       ├── SubtaskList (checklist con progreso)
        │       ├── CommentSection (comentarios cronológicos)
        │       └── TaskTimeline (línea cronológica vertical)
        ├── MeetingsPage
        │   ├── MeetingListItem (lista de reuniones)
        │   ├── PendingTopicsPanel (temas flotantes)
        │   ├── CreateMeetingModal (nueva reunión)
        │   └── MeetingModal (detalle, 3 tabs)
        │       ├── TeamStatusSection → MemberSnapshotCard
        │       ├── TopicsSection (temas vinculados)
        │       └── FeedbackSection (feedback del líder)
        └── SettingsPage
            ├── TeamMembersSection (CRUD miembros)
            ├── PrioritiesSection (CRUD prioridades)
            └── CategoriesSection (CRUD categorías)
```

### Componentes Principales

| Componente        | Ubicación                       | Responsabilidad                    |
| ----------------- | ------------------------------- | ---------------------------------- |
| `Layout`          | components/layout/              | Shell con Sidebar + BottomNav      |
| `Sidebar`         | components/layout/              | Navegación desktop                 |
| `BottomNav`       | components/layout/              | Navegación móvil                   |
| `TaskCard`        | views/tasks/components/         | Renderiza tarea con acciones       |
| `KanbanColumn`    | views/tasks/components/         | Columna del Kanban                 |
| `TaskModal`       | views/tasks/components/         | Modal crear/editar tarea           |
| `PrioritySelector`  | components/shared/              | Selector de prioridad reutilizable |
| `CategorySelector`  | components/shared/              | Selector de categoria reutilizable |
| `TeamTaskCard`      | views/team/components/          | Tarjeta de tarea con progreso      |
| `TeamKanbanColumn`  | views/team/components/          | Columna Kanban de equipo           |
| `TeamTaskModal`     | views/team/components/          | Modal crear/editar tarea equipo    |
| `TeamTaskDetail`    | views/team/components/          | Panel detalle completo             |
| `SubtaskList`       | views/team/components/          | Checklist de subtareas             |
| `CommentSection`    | views/team/components/          | Comentarios de tarea               |
| `TaskTimeline`      | views/team/components/          | Timeline cronológico               |
| `CreateMeetingModal` | views/meetings/components/      | Modal para crear reunión            |
| `MeetingListItem`    | views/meetings/components/      | Tarjeta de reunión en la lista      |
| `MeetingModal`       | views/meetings/components/      | Modal detalle con 3 tabs            |
| `TeamStatusSection`  | views/meetings/components/      | Tab estado del equipo               |
| `MemberSnapshotCard` | views/meetings/components/      | Snapshot de un miembro              |
| `TopicsSection`      | views/meetings/components/      | Tab temas de reunión                |
| `FeedbackSection`    | views/meetings/components/      | Tab feedback del líder              |
| `PendingTopicsPanel` | views/meetings/components/      | Panel de temas pendientes globales  |

---

## Funcionalidades

### Kanban Board (`/tasks`)

- Tres columnas con estados: To Do, Doing, Done
- Crear tareas con titulo, descripcion, categoria, prioridad
- Editar tareas existentes
- Eliminar tareas
- Mover tareas entre columnas (flechas)
- Filtrar por categoria
- Indicador visual de prioridad (borde coloreado)
- Badge de categoria con color
- Contador de tareas por columna

### Seguimiento del Equipo (`/team`)

- Kanban de 3 columnas para tareas de equipo (To Do, Doing, Done)
- **Vista unificada:** todas las tareas en un solo tablero
- **Vista por persona:** acordeón por cada miembro con su Kanban individual
- Crear tareas con: título, descripción, asignado, prioridad, referencia JIRA, fechas, modo de progreso
- **Panel de detalle** al hacer click en una tarjeta:
  - Información general (asignado, prioridad, JIRA, fechas)
  - Barra de progreso (automático por subtareas o manual)
  - Checklist de subtareas con progreso visual
  - Sección de comentarios cronológicos
  - Timeline vertical con eventos automáticos y manuales
- Bloquear/desbloquear tareas con indicador visual (borde rojo + icono)
- Mover tareas entre columnas con timeline event automático
- Responsive: tabs en móvil, columnas en desktop

### Reuniones con el Leader (`/meetings`)

- Listado de reuniones ordenadas por fecha (más recientes primero)
- Crear reuniones con fecha y notas opcionales
- Modal de detalle con 3 tabs:
  - **Estado del Equipo:** Snapshot auto-generado por miembro (tareas en progreso, bloqueadas, completadas desde la última reunión, progreso general)
  - **Temas:** Crear, resolver y eliminar temas. Vincular temas flotantes a una reunión
  - **Feedback:** Registrar feedback del líder con guardado explícito
- Panel de temas pendientes globales (sin reunión asignada)
- Eliminación de reunión con cascade delete de snapshots y unlink de temas

### Configuración (`/settings`)

- Crear/eliminar miembros del equipo
- Crear/eliminar niveles de prioridad (1-10) con color asociado
- Crear/eliminar categorías con nombre y color asociado
- Prioridades únicas por nivel
- 8 colores disponibles para prioridades y categorías

### Dashboard (`/`)

- **Mis Tareas:** Contador por estado (pendientes, en curso, completadas)
- **Equipo:** Resumen por persona (tareas activas, bloqueos)
- **Próxima Reunión:** Fecha + temas vinculados + temas pendientes sin vincular
- **Alertas:** Tareas con retraso (pasaron deadline), bloqueos activos, tareas estancadas (>7 días en doing)
- **Accesos rápidos:** Crear tarea personal, crear tarea de equipo, añadir tema pendiente, ir a reuniones

### Persistencia

- Almacenamiento en IndexedDB
- Carga automática al iniciar
- Guardado automático en cada acción

### PWA (Progressive Web App)

- Instalable en móvil y escritorio
- Funciona offline
- Icono personalizado

### Dark Theme

- Tema oscuro permanente (sin toggle)
- Fondo página: `gray-950`, cards/paneles: `gray-900`, inputs/filas: `gray-800`
- Acentos: `blue-400`, `green-400`, `purple-400`
- Colores base definidos en `src/index.css` vía `@layer base`
- `theme-color` meta configurado a `#030712`

### Responsive Design

- **Móvil:** Kanban con tabs, modal tipo bottom sheet, bottom tab bar
- **Desktop:** Kanban con 3 columnas, modal centrado, sidebar lateral

---

## Guía de Desarrollo

### Añadir miembros del equipo

Los miembros del equipo se gestionan desde `/settings`. No es necesario modificar código.

### Añadir prioridades

Las prioridades se gestionan desde `/settings`. Cada prioridad tiene:
- **Nivel:** Del 1 al 10 (1 = máxima prioridad)
- **Color:** Seleccionable de 8 opciones

### Añadir campo a PersonalTask

1. Actualizar interface en `src/types/entities/personal-task.ts`
2. Actualizar vista y componentes en `src/views/tasks/`
3. Considerar migración de IndexedDB si hay datos existentes

### Añadir campo a TeamTask

1. Actualizar interface en `src/types/entities/team-task.ts`
2. Actualizar vista y componentes en `src/views/team/`
3. Considerar migración de IndexedDB si hay datos existentes

### Añadir nueva ruta/página

1. Crear carpeta `src/views/nueva/` con `NuevaPage.tsx`
2. Exportar desde `src/views/index.ts`
3. Añadir `<Route>` en `src/App.tsx`
4. Añadir entrada en `NAV_ITEMS` en `Sidebar.tsx` y `BottomNav.tsx`

### Añadir nuevo color para prioridades

```typescript
// En src/constants/priority.ts
export const PRIORITY_COLORS = [
  // ... existentes
  { value: 'cyan-400', label: 'Cian', bg: 'bg-cyan-400' },
];

// En tailwind.config.js - añadir al safelist
'border-l-cyan-400',
'bg-cyan-400',
'bg-cyan-400/20',
```

---

## Mejoras Futuras

### Prioridad Alta

- [ ] Drag & drop real con `@dnd-kit/core`
- [ ] Fechas límite (due dates) en tareas
- [ ] Exportar resumen semanal a Markdown/PDF
- [ ] Búsqueda global de tareas

### Prioridad Media

- [ ] Estadísticas del equipo (tareas completadas por persona/semana)
- [ ] Etiquetas/tags personalizables
- [x] Subtareas (checklist dentro de tarea) — implementado en Fase 3
- [x] Comentarios en tareas — implementado en Fase 3
- [x] Historial de cambios (timeline events) — implementado en Fase 3
- [ ] Edición de miembros y prioridades existentes

### Prioridad Baja

- [ ] Tema oscuro
- [ ] Notificaciones (tareas próximas a vencer)
- [ ] Sincronización con backend (opcional)
- [ ] Integración con JIRA (importar/exportar)
- [ ] Vista de calendario

---

## Notas para IA

### Contexto del proyecto

- **Owner:** Pedro, Technical Lead de frontend
- **Empresa:** AURGI
- **Stack preferido:** React + TypeScript + Vite

### Convenciones de código

- Componentes funcionales con hooks
- TypeScript estricto
- Tailwind CSS para estilos
- Sin dependencias innecesarias
- **Interfaces:** Nunca declarar interfaces o types en componentes, services ni contexts. Todas las interfaces se definen en `types/entities/` (modelos de datos) o `types/interfaces/` (props de componentes, types de contextos). Un archivo por entidad.

### Convenciones de naming

| Contexto                          | Formato      | Ejemplo                          |
| --------------------------------- | ------------ | -------------------------------- |
| Keys de objetos/interfaces (datos)| `snake_case` | `created_at`, `team_task_id`     |
| Variables, funciones, hooks       | `camelCase`  | `saveTask`, `teamMembers`        |
| Componentes React, clases         | `PascalCase` | `TaskCard`, `SettingsPanel`      |

### Puntos de extensión comunes

1. Añadir campos a tareas personales → modificar `types/entities/personal-task.ts` + vista `views/tasks/`
2. Añadir campos a tareas de equipo → modificar `types/entities/team-task.ts` + vista `views/team/`
3. Nuevas páginas → crear carpeta en `views/` + añadir Route en `App.tsx` + nav items
4. Nuevas categorías → modificar `constants/category.ts` + `types/entities/category.ts`
5. Nuevos colores → modificar `constants/priority.ts` + `tailwind.config.js` safelist
6. Cambios en DB → incrementar `DB_VERSION` + handle `onupgradeneeded`

---

## Licencia

Uso interno - AURGI Frontend Team
