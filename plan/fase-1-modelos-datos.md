# Fase 1 - Modelos de Datos

## 1.1 Nuevas Entidades

- [ ] Crear interface `Category`
  ```typescript
  interface Category {
    id: string;
    name: string;          // "Hablar", "Tarea de código", "Recordatorio", etc.
    color: string;         // Color Tailwind (ej: "blue-400")
    created_at: number;
  }
  ```
- [ ] Crear interface `PersonalTask` (evolución de Task actual)
  ```typescript
  interface PersonalTask {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'doing' | 'done';
    priority_id: string | null;
    category_id: string | null;
    created_at: number;
    updated_at: number;
  }
  ```
  > Se elimina `assignee_id` porque las tareas personales son siempre del tech lead.
- [ ] Crear interface `TeamTask`
  ```typescript
  interface TeamTask {
    id: string;
    title: string;
    description: string;
    assignee_id: string;              // Miembro del equipo (obligatorio)
    status: 'todo' | 'doing' | 'done';
    priority_id: string | null;
    jira_ref: string | null;          // Referencia JIRA opcional (ej: "FRONT-123")
    start_date: number | null;        // Fecha en que empezaron
    deadline: number | null;          // Deadline opcional
    progress_mode: 'auto' | 'manual'; // Cómo se calcula el progreso
    manual_progress: number;           // 0-100, solo usado si progress_mode === 'manual'
    created_at: number;
    updated_at: number;
  }
  ```
- [ ] Crear interface `Subtask`
  ```typescript
  interface Subtask {
    id: string;
    team_task_id: string;
    title: string;
    completed: boolean;
    order: number;
    created_at: number;
  }
  ```
- [ ] Crear interface `TaskComment`
  ```typescript
  interface TaskComment {
    id: string;
    team_task_id: string;
    content: string;
    created_at: number;
  }
  ```
- [ ] Crear interface `TimelineEvent`
  ```typescript
  interface TimelineEvent {
    id: string;
    team_task_id: string;
    type: 'started' | 'blocked' | 'unblocked' | 'subtask_completed' | 'completed' | 'status_change';
    description: string | null;
    created_at: number;
  }
  ```
  > `description` es opcional en todos los tipos. En `blocked` y `unblocked` permite registrar el motivo.
- [ ] Crear interface `Meeting`
  ```typescript
  interface Meeting {
    id: string;
    date: number;
    notes: string;
    leader_feedback: string;
    created_at: number;
  }
  ```
- [ ] Crear interface `MeetingTopic`
  ```typescript
  interface MeetingTopic {
    id: string;
    meeting_id: string | null;     // null = tema sin asignar a reunión específica
    title: string;
    description: string;
    resolved: boolean;
    resolved_at: number | null;
    created_at: number;
  }
  ```

## 1.2 Nuevos Object Stores en IndexedDB

- [ ] Crear store `personal_tasks` (keyPath: `id`, índices: `status`, `category_id`)
- [ ] Crear store `categories` (keyPath: `id`)
- [ ] Crear store `team_tasks` (keyPath: `id`, índices: `assignee_id`, `status`)
- [ ] Crear store `subtasks` (keyPath: `id`, índice: `team_task_id`)
- [ ] Crear store `task_comments` (keyPath: `id`, índice: `team_task_id`)
- [ ] Crear store `timeline_events` (keyPath: `id`, índice: `team_task_id`)
- [ ] Crear store `meetings` (keyPath: `id`, índice: `date`)
- [ ] Crear store `meeting_topics` (keyPath: `id`, índices: `meeting_id`, `resolved`)
- [ ] Renombrar store `teamMembers` → `team_members`
- [ ] Mantener store `priorities`
- [ ] Eliminar stores antiguos: `tasks`, `summaries`
