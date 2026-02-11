# Fase 9 - Tab "Tareas" en Detalle de Reunion

## Objetivo

Anadir un tercer tab **"Tareas"** al detalle de reunion (`/meetings/:meetingId`) donde las protagonistas sean las tareas del equipo organizadas por estado. A diferencia del tab Briefing (que usa snapshots), este tab usa datos en vivo de `TeamTasksContext`.

---

## 9.1 Interfaces

- [x] En `src/types/interfaces/meeting.ts` anadir `TasksSectionProps { meetingId: string }`
- [x] En `src/types/interfaces/index.ts` exportar `TasksSectionProps`
- [x] En `src/types/index.ts` re-exportar `TasksSectionProps`

---

## 9.2 Componente TasksSection

- [x] Crear `src/views/meetings/components/TasksSection.tsx`:
  - Props: `meetingId`
  - Fuente de datos: `useTeamTasksContext()` (datos en vivo) + `useDataContext()` (nombres de miembros)
  - Logica:
    1. Filtrar `teamTasks` con status `todo` o `doing` (excluir `done`)
    2. Clasificar bloqueadas con `isTaskBlocked()` de `src/utils/team-tasks.ts`
    3. De las no bloqueadas, separar `doing` y `todo`
    4. Calcular progreso con `getTaskProgress()` de `src/utils/team-tasks.ts`
  - Secciones (en orden de urgencia):
    - **Bloqueadas** (icono AlertTriangle, color rojo) — borde rojo, muestra razon de bloqueo
    - **En progreso** (icono Clock, color amarillo)
    - **Pendientes** (icono CircleDot, color azul)
  - Por cada tarea muestra:
    - Titulo + referencia JIRA (badge azul)
    - Nombre del asignado (lookup en `teamMembers`)
    - Barra de progreso con porcentaje
    - Razon de bloqueo (si bloqueada, extraida del ultimo timeline event tipo `blocked`)
    - Lista de subtareas (checklist read-only: CheckSquare/Square + titulo)
    - `TaskFeedbackField` (componente reutilizado de fase 8)
  - Estado vacio si no hay tareas activas

---

## 9.3 Integracion en MeetingDetailPage

- [x] En `src/views/meetings/MeetingDetailPage.tsx`:
  - Importar `TasksSection` y icono `ListChecks` de lucide-react
  - Anadir tab al array `TABS`: `{ key: 'tasks', label: 'Tareas', icon: ListChecks }` (entre Briefing y Feedback)
  - Tipo `TabKey` se actualiza automaticamente al derivar de `TABS`
  - Renderizado condicional: `{activeTab === 'tasks' && <TasksSection meetingId={meeting.id} />}`

---

## 9.4 Barrel export

- [x] En `src/views/meetings/components/index.ts` anadir export de `TasksSection`

---

## 9.5 Documentacion

- [x] Actualizar `README.md`:
  - Estructura del proyecto (anadir `TasksSection.tsx` al arbol)
  - Ruta `/meetings/:meetingId` → descripcion actualizada a "briefing + tareas + feedback"
  - Jerarquia de componentes (anadir TasksSection bajo MeetingDetailPage)
  - Tabla de componentes (anadir fila TasksSection)
  - Funcionalidades de reuniones (cambiar "2 tabs" a "3 tabs", anadir descripcion del tab Tareas)

---

## Reutilizacion de codigo existente

| Funcion/Componente | Ubicacion | Uso |
|---|---|---|
| `TaskFeedbackField` | `views/meetings/components/TaskFeedbackField.tsx` | Campo de comentarios por tarea (reutilizado) |
| `getTaskProgress()` | `utils/team-tasks.ts` | Calcular progreso (auto/manual) |
| `isTaskBlocked()` | `utils/team-tasks.ts` | Detectar si tarea esta bloqueada |
| `useTeamTasksContext()` | `context/TeamTasksContext.tsx` | Datos en vivo de tareas, subtareas, timeline events |
| `useDataContext()` | `context/DataContext.tsx` | Nombres de miembros del equipo |

---

## Resumen de archivos

### Nuevos (1)

| Archivo | Proposito |
|---------|-----------|
| `src/views/meetings/components/TasksSection.tsx` | Tab de tareas activas organizadas por estado con datos en vivo |

### Modificados (5)

| Archivo | Cambio |
|---------|--------|
| `src/types/interfaces/meeting.ts` | +`TasksSectionProps` |
| `src/types/interfaces/index.ts` | Export `TasksSectionProps` |
| `src/types/index.ts` | Re-export `TasksSectionProps` |
| `src/views/meetings/MeetingDetailPage.tsx` | Tercer tab "Tareas" con icono ListChecks |
| `src/views/meetings/components/index.ts` | Export `TasksSection` |
| `README.md` | Documentacion actualizada |

---

## Verificacion

1. [x] `npm run build` compila sin errores
2. [x] `npm run lint` sin warnings nuevos
3. [ ] Navegar a `/meetings/:id` → aparecen 3 tabs (Briefing, Tareas, Feedback)
4. [ ] Tab Tareas muestra tareas bloqueadas, en curso y pendientes con datos en vivo
5. [ ] Cada tarea muestra: titulo, asignado, JIRA, progreso, subtareas, campo de comentarios
6. [ ] TaskFeedbackField funciona (Ctrl+Enter guarda, persiste al volver)
7. [ ] Responsive: mobile y desktop se ven correctamente
8. [ ] Estado vacio si no hay tareas activas
