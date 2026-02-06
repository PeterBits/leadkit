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
│   │   │   ├── MeetingsPage.tsx        # Resúmenes semanales
│   │   │   └── components/             # Componentes exclusivos de meetings
│   │   │       ├── SummaryItemCard.tsx
│   │   │       └── index.ts
│   │   ├── team/
│   │   │   └── TeamPage.tsx            # Seguimiento de equipo (próximamente)
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx        # Configuración de equipo y prioridades
│   │   └── index.ts
│   ├── components/
│   │   └── layout/                     # Componentes compartidos (navegación)
│   │       ├── Layout.tsx              # Shell con Sidebar + BottomNav + Outlet
│   │       ├── Sidebar.tsx             # Navegación desktop (sidebar izquierdo)
│   │       ├── BottomNav.tsx           # Navegación móvil (tab bar inferior)
│   │       └── index.ts
│   ├── context/
│   │   ├── DataContext.tsx             # Estado global: teamMembers, priorities
│   │   ├── TasksContext.tsx            # Estado global: tasks
│   │   └── index.ts
│   ├── constants/                      # Constantes fragmentadas por entidad
│   │   ├── priority.ts                # PRIORITY_COLORS
│   │   ├── summary-item.ts            # CATEGORIES
│   │   └── index.ts
│   ├── services/
│   │   └── database.ts                # Operaciones IndexedDB
│   ├── types/                          # Sistema de tipos por entidad
│   │   ├── entities/                   # Interfaces de datos
│   │   │   ├── task.ts
│   │   │   ├── summary-item.ts
│   │   │   ├── team-member.ts
│   │   │   ├── priority.ts
│   │   │   └── index.ts
│   │   ├── interfaces/                 # Props de componentes y contextos
│   │   │   ├── task.ts
│   │   │   ├── summary-item.ts
│   │   │   ├── priority.ts
│   │   │   ├── context.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── dates.ts                    # Utilidades de fechas/semanas
│   │   └── ids.ts                      # Generación de IDs
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
| `/team`      | TeamPage         | Seguimiento del equipo (próximamente)|
| `/meetings`  | MeetingsPage     | Resúmenes semanales                  |
| `/settings`  | SettingsPage     | CRUD de miembros y prioridades       |

### Navegación

- **Desktop (sm:+):** Sidebar fijo a la izquierda (240px) con iconos + labels
- **Móvil:** Bottom tab bar fijo con 5 iconos

### Gestión de Estado

Dos React Contexts para datos compartidos, estado local por página para el resto:

```
┌─────────────────────────────────────────────────┐
│                    App.tsx                        │
│  ┌─────────────┐  ┌──────────────┐               │
│  │ DataProvider │  │ TasksProvider│               │
│  │ teamMembers │  │ tasks[]      │               │
│  │ priorities  │  │ CRUD handlers│               │
│  └──────┬──────┘  └──────┬───────┘               │
│         │                │                        │
│         ▼                ▼                        │
│  ┌────────────────────────────────────────────┐  │
│  │              Pages (local state)            │  │
│  │  TasksPage: modalTask, filter, tabs         │  │
│  │  MeetingsPage: summaries, currentWeek, form │  │
│  │  SettingsPage: form inputs                  │  │
│  └────────────────────────────────────────────┘  │
│         │                                         │
│         ▼                                         │
│  ┌────────────────────────────────────────────┐  │
│  │              IndexedDB Service              │  │
│  │  Stores: tasks, summaries, teamMembers,     │  │
│  │          priorities                          │  │
│  └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Carga inicial:** Contexts + Pages → `dbOperation(getAll)` → `setState()`
2. **Crear/Editar:** Acción usuario → `save*()` → `dbOperation(put)` → `setState()`
3. **Eliminar:** Acción usuario → `delete*()` → `dbOperation(delete)` → `setState()`
4. **Mover tarea:** Click flecha → `moveTask()` → `saveTask()` con nuevo status

---

## Modelos de Datos

### TeamMember (Miembro del equipo)

```typescript
interface TeamMember {
  id: string;           // ID único generado
  name: string;         // Nombre del miembro
  createdAt: number;    // Timestamp de creación
}
```

### Priority (Prioridad)

```typescript
interface Priority {
  id: string;           // ID único generado
  color: string;        // Color Tailwind (ej: "red-400", "yellow-400")
  level: number;        // Nivel de 1 a 10 (1 = máxima prioridad)
  createdAt: number;    // Timestamp de creación
}
```

> **Nota:** Las prioridades solo tienen nivel y color. El nivel es único (no puede haber dos prioridades con el mismo nivel). En las tarjetas se muestra como "P1", "P2", etc. con el color de fondo correspondiente.

### Task (Tarea)

```typescript
interface Task {
  id: string;                           // ID único generado
  title: string;                        // Título de la tarea (requerido)
  description: string;                  // Descripción opcional
  assigneeId: string | null;            // ID del miembro asignado
  status: "todo" | "doing" | "done";    // Estado en el Kanban
  priorityId: string | null;            // ID de la prioridad
  createdAt: number;                    // Timestamp de creación
  updatedAt: number;                    // Timestamp de última modificación
}
```

### SummaryItem (Ítem de Resumen Semanal)

```typescript
interface SummaryItem {
  id: string;           // ID único generado
  weekNumber: number;   // Número de semana ISO (1-53)
  year: number;         // Año (ej: 2025)
  title: string;        // Título del ítem (requerido)
  description: string;  // Descripción detallada (opcional)
  category: "discussion" | "blocker" | "achievement" | "action-item";
  createdAt: number;    // Timestamp de creación
}
```

### Categorías de Resumen

| Key           | Label       | Color   | Uso                           |
| ------------- | ----------- | ------- | ----------------------------- |
| `discussion`  | A discutir  | Azul    | Temas para tratar en reunión  |
| `blocker`     | Blocker     | Rojo    | Impedimentos del equipo       |
| `achievement` | Logro       | Verde   | Wins y éxitos de la semana    |
| `action-item` | Action Item | Púrpura | Tareas derivadas de reuniones |

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
const DB_VERSION = 2;
```

### Object Stores

#### `tasks`

- **keyPath:** `id`
- **Índices:**
  - `status` → Para filtrar por columna
  - `assigneeId` → Para filtrar por miembro

#### `summaries`

- **keyPath:** `id`
- **Índices:**
  - `week` → Índice compuesto `[year, weekNumber]`

#### `teamMembers`

- **keyPath:** `id`

#### `priorities`

- **keyPath:** `id`
- **Índices:**
  - `level` → Para ordenar por nivel de prioridad

### Operaciones

```typescript
// Función genérica para operaciones
const dbOperation = async <T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest
): Promise<T>

// Ejemplos de uso:
await dbOperation('tasks', 'readonly', store => store.getAll());
await dbOperation('teamMembers', 'readwrite', store => store.put(member));
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
        │   └── Contadores + Accesos rápidos
        ├── TasksPage
        │   ├── Filtros (select por miembro)
        │   ├── KanbanColumn (x3: todo, doing, done)
        │   │   └── TaskCard (x n tareas)
        │   └── TaskModal (crear/editar)
        ├── TeamPage (próximamente)
        ├── MeetingsPage
        │   ├── WeekSelector (navegación semanas)
        │   ├── AddSummaryForm (título + descripción + categoría)
        │   └── CategorySection (x4 categorías)
        │       └── SummaryItemCard (título + descripción)
        └── SettingsPage
            ├── TeamMembersSection (CRUD miembros)
            └── PrioritiesSection (CRUD prioridades)
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
| `SummaryItemCard` | views/meetings/components/      | Ítem con título y descripción      |

---

## Funcionalidades

### Kanban Board (`/tasks`)

- Tres columnas con estados: To Do, Doing, Done
- Crear tareas con título, descripción, miembro asignado, prioridad
- Editar tareas existentes
- Eliminar tareas
- Mover tareas entre columnas (flechas)
- Filtrar por miembro del equipo
- Indicador visual de prioridad (borde coloreado)
- Contador de tareas por columna

### Resumen Semanal (`/meetings`)

- Navegación entre semanas (anterior/siguiente)
- Mostrar rango de fechas de la semana
- Añadir ítems con título y descripción opcional
- Cuatro categorías diferenciadas por color
- Eliminar ítems
- Persistencia por semana

### Configuración (`/settings`)

- Crear/eliminar miembros del equipo
- Crear/eliminar niveles de prioridad (1-10) con color asociado
- Prioridades únicas por nivel
- 8 colores disponibles

### Dashboard (`/`)

- Contadores de tareas por estado
- Contador de miembros del equipo
- Accesos rápidos a tareas y reuniones

### Persistencia

- Almacenamiento en IndexedDB
- Carga automática al iniciar
- Guardado automático en cada acción

### PWA (Progressive Web App)

- Instalable en móvil y escritorio
- Funciona offline
- Icono personalizado

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

### Añadir nueva categoría de resumen

```typescript
// En src/constants/summary-item.ts
import { MessageCircle } from 'lucide-react';

export const CATEGORIES = {
  // ... existentes
  feedback: {
    label: "Feedback",
    icon: MessageCircle,
    color: "bg-orange-100 text-orange-700",
  },
};

// En src/types/entities/summary-item.ts - actualizar el tipo SummaryItem.category
category: "discussion" | "blocker" | "achievement" | "action-item" | "feedback";
```

### Añadir campo a Task

1. Actualizar interface `Task` en `src/types/entities/task.ts`
2. Actualizar `TaskModal` en `src/views/tasks/components/TaskModal.tsx`
3. Actualizar `TaskCard` en `src/views/tasks/components/TaskCard.tsx` si debe mostrarse
4. Considerar migración de IndexedDB si hay datos existentes

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
- [ ] Subtareas (checklist dentro de tarea)
- [ ] Comentarios en tareas
- [ ] Historial de cambios
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

1. Añadir campos a tareas → modificar `types/entities/task.ts` + `views/tasks/components/TaskModal` + `TaskCard`
2. Nuevas páginas → crear carpeta en `views/` + añadir Route en `App.tsx` + nav items
3. Nuevas categorías → modificar `constants/summary-item.ts` + `types/entities/summary-item.ts`
4. Nuevos colores → modificar `constants/priority.ts` + `tailwind.config.js` safelist
5. Cambios en DB → incrementar `DB_VERSION` + handle `onupgradeneeded`

---

## Licencia

Uso interno - AURGI Frontend Team
