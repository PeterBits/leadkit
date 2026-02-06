# Frontend Team Manager

Aplicación web para gestión de equipos de desarrollo frontend con tablero Kanban y seguimiento de reuniones semanales.

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

Frontend Team Manager es una aplicación diseñada para technical leads que gestionan equipos de desarrollo frontend. Permite:

- Gestionar tareas del equipo mediante un tablero Kanban (To Do → Doing → Done)
- Preparar y documentar reuniones semanales con el lead
- Configurar dinámicamente miembros del equipo y prioridades
- Almacenar todos los datos localmente en el navegador (IndexedDB)
- **Responsive:** Optimizada para móvil con navegación por tabs
- **PWA:** Instalable como aplicación nativa

**Contexto de uso:** Pensada para technical leads con equipos de cualquier tamaño, con reuniones periódicas de seguimiento.

---

## Tecnologías

| Tecnología      | Versión | Propósito               |
| --------------- | ------- | ----------------------- |
| React           | 18.x    | UI Library              |
| TypeScript      | 5.x     | Type safety             |
| Vite            | 6.x     | Build tool              |
| vite-plugin-pwa | 1.x     | Progressive Web App     |
| IndexedDB       | Nativo  | Persistencia local      |
| Tailwind CSS    | 3.x     | Estilos (utility-first) |
| Lucide React    | 0.263.x | Iconografía             |

---

## Instalación

```bash
# Clonar o entrar al directorio
cd frontend-team-manager

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
frontend-team-manager/
├── src/
│   ├── components/
│   │   ├── kanban/
│   │   │   ├── index.ts
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskModal.tsx
│   │   ├── weekly-summary/
│   │   │   ├── index.ts
│   │   │   └── SummaryItemCard.tsx
│   │   └── settings/
│   │       ├── index.ts
│   │       └── SettingsPanel.tsx
│   ├── constants/
│   │   └── index.ts            # Categorías y colores disponibles
│   ├── services/
│   │   └── database.ts         # Operaciones IndexedDB
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript
│   ├── utils/
│   │   ├── dates.ts            # Utilidades de fechas/semanas
│   │   └── ids.ts              # Generación de IDs
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx                # Entry point
│   ├── index.css               # Estilos globales + Tailwind
│   └── vite-env.d.ts
├── public/
│   └── icon.svg                # Icono PWA
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts              # Incluye configuración PWA
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Arquitectura

### Patrón de Estado

La aplicación usa **React State (useState)** para gestión de estado local, sincronizado con IndexedDB para persistencia.

```
┌──────────────────────────────────────────────────────────────────┐
│                           App.tsx                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ tasks[]     │  │ summaries[] │  │ teamMembers │  │priorities│ │
│  │ (useState)  │  │ (useState)  │  │ (useState)  │  │(useState)│ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │
│         │                │                │               │      │
│         ▼                ▼                ▼               ▼      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    IndexedDB Service                        │ │
│  │  - initDB()                                                 │ │
│  │  - dbOperation<T>(store, mode, operation)                   │ │
│  │  Stores: tasks, summaries, teamMembers, priorities          │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Carga inicial:** `useEffect` → `dbOperation(getAll)` para cada store → `setState()`
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
App
├── Header (nav entre vistas + botón configuración)
├── KanbanView (view === 'kanban')
│   ├── Filtros (select por miembro del equipo)
│   ├── KanbanColumn (x3: todo, doing, done)
│   │   └── TaskCard (x n tareas)
│   └── TaskModal (crear/editar)
├── WeeklySummaryView (view === 'weekly')
│   ├── WeekSelector (navegación semanas)
│   ├── AddSummaryForm (título + descripción + categoría)
│   └── CategorySection (x4 categorías)
│       └── SummaryItemCard (título + descripción)
└── SettingsPanel (panel lateral)
    ├── TeamMembersSection (CRUD miembros)
    └── PrioritiesSection (CRUD prioridades)
```

### Componentes Principales

| Componente        | Props                                                    | Responsabilidad                    |
| ----------------- | -------------------------------------------------------- | ---------------------------------- |
| `TaskCard`        | task, teamMembers, priorities, onEdit, onDelete, onMove  | Renderiza tarea con acciones       |
| `KanbanColumn`    | title, status, tasks, teamMembers, priorities, callbacks | Columna del Kanban                 |
| `TaskModal`       | task, teamMembers, priorities, onSave, onClose           | Modal crear/editar tarea           |
| `SummaryItemCard` | item, onDelete                                           | Ítem con título y descripción      |
| `SettingsPanel`   | isOpen, teamMembers, priorities, callbacks               | Panel de configuración lateral     |

---

## Funcionalidades

### Kanban Board

- ✅ Tres columnas con estados: To Do, Doing, Done
- ✅ Crear tareas con título, descripción, miembro asignado, prioridad
- ✅ Editar tareas existentes
- ✅ Eliminar tareas
- ✅ Mover tareas entre columnas (flechas ← →)
- ✅ Filtrar por miembro del equipo (dinámico)
- ✅ Indicador visual de prioridad (borde coloreado según configuración)
- ✅ Contador de tareas por columna

### Resumen Semanal

- ✅ Navegación entre semanas (anterior/siguiente)
- ✅ Mostrar rango de fechas de la semana
- ✅ Añadir ítems con título y descripción opcional
- ✅ Cuatro categorías diferenciadas por color
- ✅ Eliminar ítems
- ✅ Persistencia por semana (cada semana guarda sus ítems)

### Configuración (Panel Lateral)

- ✅ Crear miembros del equipo
- ✅ Eliminar miembros del equipo
- ✅ Crear niveles de prioridad (1-10) con color asociado
- ✅ Eliminar prioridades
- ✅ Prioridades únicas por nivel (no se pueden repetir)
- ✅ 8 colores disponibles para prioridades

### Tarjetas de Tarea

- ✅ Icono de persona junto al nombre del asignado
- ✅ Etiqueta de prioridad con color y nivel (ej: "P1", "P2")
- ✅ Borde lateral con el color de la prioridad

### Persistencia

- ✅ Almacenamiento en IndexedDB
- ✅ Carga automática al iniciar
- ✅ Guardado automático en cada acción
- ✅ Sin dependencia de backend/servidor

### PWA (Progressive Web App)

- ✅ Instalable en móvil y escritorio
- ✅ Funciona offline (datos en IndexedDB)
- ✅ Icono personalizado
- ✅ Splash screen al iniciar

### Responsive Design

- ✅ **Móvil:** Kanban con tabs (To Do / Doing / Done)
- ✅ **Móvil:** Modal tipo bottom sheet
- ✅ **Móvil:** Panel de configuración a pantalla completa
- ✅ **Móvil:** Menú hamburguesa para navegación
- ✅ **Tablet/Desktop:** Kanban con 3 columnas
- ✅ **Tablet/Desktop:** Modal centrado
- ✅ Header sticky en todas las vistas

---

## Guía de Desarrollo

### Añadir miembros del equipo

Los miembros del equipo se gestionan desde el panel de configuración (icono de engranaje en el header). No es necesario modificar código.

### Añadir prioridades

Las prioridades se gestionan desde el panel de configuración. Cada prioridad tiene:
- **Nivel:** Del 1 al 10 (1 = máxima prioridad)
- **Color:** Seleccionable de 8 opciones

> Las prioridades se muestran en las tarjetas como "P1", "P2", etc. con el color de fondo correspondiente.

### Añadir nueva categoría de resumen

```typescript
// En src/constants/index.ts
import { MessageCircle } from 'lucide-react';

export const CATEGORIES = {
  // ... existentes
  feedback: {
    label: "Feedback",
    icon: MessageCircle,
    color: "bg-orange-100 text-orange-700",
  },
};

// En src/types/index.ts - actualizar el tipo SummaryItem.category
category: "discussion" | "blocker" | "achievement" | "action-item" | "feedback";
// (El tipo también incluye: title, description, id, weekNumber, year, createdAt)
```

### Añadir campo a Task

1. Actualizar interface `Task` en `src/types/index.ts`
2. Actualizar `TaskModal` en `src/components/kanban/TaskModal.tsx` (estado + input)
3. Actualizar `TaskCard` en `src/components/kanban/TaskCard.tsx` si debe mostrarse
4. Considerar migración de IndexedDB si hay datos existentes (incrementar DB_VERSION)

### Añadir nuevo color para prioridades

```typescript
// En src/constants/index.ts
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

### Convenciones de naming

| Contexto                          | Formato      | Ejemplo                          |
| --------------------------------- | ------------ | -------------------------------- |
| Keys de objetos/interfaces (datos)| `snake_case` | `created_at`, `team_task_id`     |
| Variables, funciones, hooks       | `camelCase`  | `saveTask`, `teamMembers`        |
| Componentes React, clases         | `PascalCase` | `TaskCard`, `SettingsPanel`      |

### Puntos de extensión comunes

1. Añadir campos a tareas → modificar `Task` interface + `TaskModal` + `TaskCard`
2. Nuevas vistas → añadir a `View` type + navegación en header
3. Nuevas categorías → modificar `CATEGORIES` constant + tipo `SummaryItem`
4. Nuevos colores → modificar `PRIORITY_COLORS` + `tailwind.config.js` safelist
5. Cambios en DB → incrementar `DB_VERSION` + handle `onupgradeneeded`

---

## Licencia

Uso interno - AURGI Frontend Team
