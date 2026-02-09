# Fase 8 - Rediseno de Reuniones

## Objetivo

Transformar la experiencia de reuniones para que el tech lead pueda preparar y documentar reuniones de forma mas eficiente:

1. **Modal → Vista completa:** Convertir el modal de detalle de reunion en una pagina dedicada (`/meetings/:id`) con mas espacio
2. **Vista unificada:** Ver estado del equipo y temas a tratar en un mismo espacio (tab "Briefing")
3. **Temas vinculables a tareas:** Los temas pueden asociarse opcionalmente a una tarea del equipo
4. **Comentarios por item:** Cada tarea y cada tema tiene su propio campo de comentarios, ademas del feedback general
5. **Snapshots completos:** Incluyen tareas pendientes, en progreso, bloqueadas y completadas (sin duplicacion entre listas)
6. **Temas editables:** Titulo y descripcion editables despues de creados
7. **Guardado manual:** Comentarios se guardan con boton o Ctrl+Enter (no auto-save)
8. **Auto-resize:** Textareas se adaptan al contenido (maximo 5 lineas)

---

## 8.1 Modelo de datos

### Nueva entidad: MeetingTaskFeedback

- [x] Crear `src/types/entities/meeting-task-feedback.ts`
  ```typescript
  interface MeetingTaskFeedback {
    id: string;
    meeting_id: string;
    team_task_id: string;
    content: string;
    created_at: number;
  }
  ```

### Modificar MeetingTopic

- [x] En `src/types/entities/meeting-topic.ts` anadir:
  - `team_task_id: string | null` — vinculo opcional a una tarea del equipo
  - `leader_response: string` — comentarios sobre este tema

### Barrel exports

- [x] Actualizar `src/types/entities/index.ts` — exportar `MeetingTaskFeedback`
- [x] Actualizar `src/types/index.ts` — re-exportar `MeetingTaskFeedback`

---

## 8.2 Interfaces de componentes

- [x] Actualizar `src/types/interfaces/meeting.ts`:
  - Anadir a `MeetingsContextType`: `meetingTaskFeedback`, `saveMeetingTaskFeedback`, `deleteMeetingTaskFeedback`
  - Anadir `BriefingSectionProps { meetingId: string }`
  - Anadir `TaskFeedbackFieldProps { meetingId: string; teamTaskId: string }`
  - Eliminar `MeetingModalProps` y `TeamStatusSectionProps`
- [x] Actualizar `src/types/interfaces/meeting-snapshot.ts`:
  - Anadir `meetingId: string` a `MemberSnapshotCardProps`
- [x] Actualizar `src/types/interfaces/index.ts` — exportar nuevas interfaces

---

## 8.3 Base de datos (IndexedDB v5 → v6)

- [x] En `src/services/database.ts`:
  - Cambiar `DB_VERSION` de 5 a 6
  - Anadir `MEETING_TASK_FEEDBACK: 'meeting_task_feedback'` a `STORE_NAMES`
  - En `onupgradeneeded`:
    - Crear store `meeting_task_feedback` (keyPath: `id`, indices: `meeting_id`, `team_task_id`)
    - Anadir indice `team_task_id` al store `meeting_topics` existente (acceder via `transaction.objectStore`)

> **Nota:** Los registros existentes de `meeting_topics` no necesitan migracion. IndexedDB es schemaless: se manejan defaults (`?? null`, `?? ''`) al leer en la app.

---

## 8.4 Contexto

- [x] Actualizar `src/context/MeetingsContext.tsx`:
  - Nuevo state: `meetingTaskFeedback: MeetingTaskFeedback[]`
  - Cargar desde `STORE_NAMES.MEETING_TASK_FEEDBACK` en el `useEffect` inicial
  - Nueva funcion `saveMeetingTaskFeedback(data)` — upsert (crea o actualiza por id)
  - Nueva funcion `deleteMeetingTaskFeedback(id)`
  - Actualizar `deleteMeeting()` — cascade delete tambien los `meeting_task_feedback` del meeting
  - Anadir todo al provider value

---

## 8.5 Actualizar callers existentes (sin romper la app)

Antes de cambiar la UI, asegurar que todos los sitios que crean temas incluyan los nuevos campos con defaults:

- [x] `src/views/meetings/components/TopicsSection.tsx` — anadir `team_task_id: null, leader_response: ''` en llamadas a `saveMeetingTopic`
- [x] `src/views/meetings/components/PendingTopicsPanel.tsx` — anadir mismos defaults
- [x] Verificar que la app compila y funciona igual que antes (`npm run build`)

---

## 8.6 Nueva ruta y pagina de detalle

### Ruta

- [x] En `src/App.tsx` anadir ruta anidada: `/meetings/:meetingId` → `MeetingDetailPage`
  - La ruta se renderiza dentro del `Layout` existente (mantiene sidebar/bottom nav)
  - No anadir al array `NAV_ITEMS` (no es item de navegacion principal)

### Pagina de detalle

- [x] Crear `src/views/meetings/MeetingDetailPage.tsx`:
  - Lee `meetingId` de `useParams()`
  - Busca la reunion en contexto
  - Si no existe, muestra estado de error con link a `/meetings`
  - Header: fecha de reunion formateada + boton "Volver a reuniones" (navigate back)
  - 2 tabs: **"Briefing"** y **"Feedback"**
  - Layout de pagina completa (usa todo el ancho disponible dentro del Layout)
  - Responsive: funciona bien en mobile y desktop

### Actualizar MeetingsPage

- [x] En `src/views/meetings/MeetingsPage.tsx`:
  - Cambiar `onOpen` de abrir modal a `navigate(/meetings/${meeting.id})`
  - Eliminar estado del modal (`selectedMeeting`, etc.)
  - Eliminar import/renderizado de `MeetingModal`
  - Mantener: lista de reuniones, CreateMeetingModal, PendingTopicsPanel
  - Mantener logica de `createTodayMeeting` pero navegar a la reunion creada en vez de abrir modal

### Actualizar exports

- [x] Actualizar `src/views/index.ts` — exportar `MeetingDetailPage`

---

## 8.7 Nuevos componentes del Briefing

### TaskFeedbackField (nuevo)

- [x] Crear `src/views/meetings/components/TaskFeedbackField.tsx`:
  - Props: `meetingId`, `teamTaskId`
  - Busca en contexto si existe `MeetingTaskFeedback` para ese meeting+task
  - Textarea auto-expandible (max 5 lineas) con placeholder "Sin comentarios..."
  - Guardado manual: boton "Guardar" visible cuando hay cambios + Ctrl+Enter

### BriefingSection (nuevo)

- [x] Crear `src/views/meetings/components/BriefingSection.tsx`:
  - Props: `meetingId`
  - Absorbe la logica de `TeamStatusSection`:
    - Boton Generar/Regenerar snapshots
    - Usa `generateMeetingSnapshots()` de `src/utils/meeting-snapshots.ts`
  - Auto-genera snapshots al entrar si no existen
  - **Si hay snapshots**, muestra:
    - Por cada miembro (componente colapsable):
      - `MemberSnapshotCard` (tareas pendientes/doing/blocked/completed + comentarios por tarea)
    - Seccion "Temas" (todos los temas, vinculados y no vinculados):
      - Lista unificada con badge de tarea vinculada
      - Temas editables (titulo + descripcion) con boton lapiz
      - Comentarios por tema con guardado manual (boton + Ctrl+Enter)
      - Textareas auto-expandibles (max 5 lineas)
      - Marcar resuelto / eliminar
      - Temas resueltos en seccion colapsable aparte (opacidad reducida)
    - Formulario anadir tema:
      - Titulo + descripcion (textarea auto-expandible)
      - Dropdown opcional para vincular a una tarea del equipo (lista de tareas activas)
    - Boton "Vincular temas pendientes" (temas flotantes sin meeting_id)
  - **Si no hay snapshots**: estado vacio con boton generar + temas

### Mejorar MemberSnapshotCard

- [x] Actualizar `src/views/meetings/components/MemberSnapshotCard.tsx`:
  - Props: `snapshot`, `meetingId`
  - Hacer colapsable (expandido por defecto si tiene tareas bloqueadas o en progreso)
  - Secciones: pendientes, en progreso, bloqueadas (sin duplicacion), completadas
  - Por cada tarea todo/doing/blocked:
    - Mostrar info actual (titulo, progreso, jira, bloqueo)
    - Mostrar `TaskFeedbackField` debajo
  - Tareas completadas: solo titulo (sin feedback, para no saturar)
  - Tareas bloqueadas excluidas de su lista de estado original

---

## 8.8 Reestructurar FeedbackSection

- [x] Actualizar `src/views/meetings/components/FeedbackSection.tsx`:
  - Mantener textarea de feedback general (funcionalidad actual)
  - Anadir seccion "Resumen de respuestas" debajo:
    - Lista read-only de todos los `MeetingTaskFeedback.content` (no vacios) de esta reunion, con titulo de la tarea
    - Lista read-only de todos los `MeetingTopic.leader_response` (no vacios) de esta reunion, con titulo del tema
    - Cada item muestra: icono (tarea/tema) + titulo + comentarios

---

## 8.9 Limpieza

- [x] Eliminar `src/views/meetings/components/MeetingModal.tsx` (reemplazado por MeetingDetailPage)
- [x] Eliminar `src/views/meetings/components/TeamStatusSection.tsx` (absorbido por BriefingSection)
- [x] Actualizar `src/views/meetings/components/index.ts`:
  - Eliminar: `MeetingModal`, `TeamStatusSection`
  - Anadir: `BriefingSection`, `TaskFeedbackField`
- [x] Eliminar interfaces obsoletas de `src/types/interfaces/meeting.ts`: `MeetingModalProps`, `TeamStatusSectionProps`

---

## 8.10 Documentacion

- [x] Actualizar `README.md`:
  - Modelos de datos (MeetingTopic campos nuevos, nueva entidad MeetingTaskFeedback)
  - Base de datos (v6, 12 stores, nueva store meeting_task_feedback)
  - Routing (nueva ruta `/meetings/:meetingId`)
  - Componentes (eliminar MeetingModal/TeamStatusSection, anadir MeetingDetailPage/BriefingSection/TaskFeedbackField)
  - Funcionalidades de reuniones actualizadas
- [x] Actualizar `CLAUDE.md`:
  - Version DB y numero de stores
  - Nueva ruta en seccion Routing
  - Descripcion de MeetingsContext actualizada
  - Organizacion de componentes de meetings

---

## Resumen de archivos

### Nuevos (4)

| Archivo | Proposito |
|---------|-----------|
| `src/types/entities/meeting-task-feedback.ts` | Entidad: comentarios por tarea en una reunion |
| `src/views/meetings/MeetingDetailPage.tsx` | Pagina completa de detalle de reunion (reemplaza modal) |
| `src/views/meetings/components/BriefingSection.tsx` | Tab unificado: estado equipo + temas + feedback por item |
| `src/views/meetings/components/TaskFeedbackField.tsx` | Input inline reutilizable de feedback por tarea |

### Modificados (14)

| Archivo | Cambio |
|---------|--------|
| `src/types/entities/meeting-topic.ts` | +`team_task_id`, +`leader_response` |
| `src/types/entities/index.ts` | Export nueva entidad |
| `src/types/index.ts` | Re-export |
| `src/types/interfaces/meeting.ts` | Context type + props nuevas - props obsoletas |
| `src/types/entities/meeting-snapshot.ts` | +`SnapshotTodoTask`, +`tasks_todo` en MeetingSnapshot |
| `src/types/interfaces/meeting-snapshot.ts` | Props del card (`snapshot`, `meetingId`) |
| `src/types/interfaces/index.ts` | Exports |
| `src/services/database.ts` | v6, nuevo store, nuevo indice |
| `src/context/MeetingsContext.tsx` | State + CRUD + cascade |
| `src/App.tsx` | Nueva ruta `/meetings/:meetingId` |
| `src/views/index.ts` | Export MeetingDetailPage |
| `src/views/meetings/MeetingsPage.tsx` | Navigate en vez de modal |
| `src/views/meetings/components/MemberSnapshotCard.tsx` | Colapsable + tareas todo/doing/blocked/completed + feedback |
| `src/utils/meeting-snapshots.ts` | +tasks_todo, exclusion de bloqueadas en otras listas |
| `src/views/meetings/components/FeedbackSection.tsx` | Resumen de respuestas |
| `src/views/meetings/components/TopicsSection.tsx` | Defaults campos nuevos |
| `src/views/meetings/components/PendingTopicsPanel.tsx` | Defaults campos nuevos |
| `src/views/meetings/components/index.ts` | Barrel actualizado |
| `README.md` | Documentacion |
| `CLAUDE.md` | Documentacion |

### Eliminados (2)

| Archivo | Razon |
|---------|-------|
| `src/views/meetings/components/MeetingModal.tsx` | Reemplazado por MeetingDetailPage |
| `src/views/meetings/components/TeamStatusSection.tsx` | Absorbido por BriefingSection |

---

## Verificacion

1. [x] `npm run build` compila sin errores
2. [x] `npm run lint` sin warnings nuevos
3. [ ] Navegar a `/meetings` → lista de reuniones funciona
4. [ ] Click en reunion → navega a `/meetings/:id` con vista completa
5. [ ] Generar snapshots → tab Briefing muestra estado unificado por miembro
6. [ ] Anadir tema general (sin tarea) → aparece en la lista de temas
7. [ ] Anadir tema vinculado a tarea → aparece en la lista con badge de la tarea
8. [ ] Escribir comentario por tarea (Ctrl+Enter o boton) → persiste al navegar y volver
9. [ ] Escribir comentario por tema (Ctrl+Enter o boton) → persiste
9b. [ ] Editar titulo y descripcion de un tema existente → persiste
10. [ ] Regenerar snapshots → feedback por tarea y respuestas de temas NO se pierden
11. [ ] Tab Feedback → textarea general + resumen de respuestas individuales
12. [ ] Eliminar reunion → cascade elimina snapshots, task feedback, y desvincula temas
13. [ ] Boton "Volver" → regresa a `/meetings`
14. [ ] Acceso directo desde Dashboard (createTodayMeeting) → navega a la reunion
15. [ ] Responsive: mobile y desktop funcionan correctamente
16. [ ] Ruta invalida `/meetings/abc123` → muestra error con link a `/meetings`
