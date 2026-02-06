# Fase 1 - Modelos de Datos

## 1.1 Nuevas Entidades

- [x] Crear interface `Category`
- [x] Crear interface `PersonalTask`
- [x] Crear interface `TeamTask`
- [x] Crear interface `Subtask`
- [x] Crear interface `TaskComment`
- [x] Crear interface `TimelineEvent`
- [x] Crear interface `Meeting`
- [x] Crear interface `MeetingTopic`

## 1.2 Nuevos Object Stores en IndexedDB

- [x] Crear store `personal_tasks` (keyPath: `id`, índices: `status`, `category_id`)
- [x] Crear store `categories` (keyPath: `id`)
- [x] Crear store `team_tasks` (keyPath: `id`, índices: `assignee_id`, `status`)
- [x] Crear store `subtasks` (keyPath: `id`, índice: `team_task_id`)
- [x] Crear store `task_comments` (keyPath: `id`, índice: `team_task_id`)
- [x] Crear store `timeline_events` (keyPath: `id`, índice: `team_task_id`)
- [x] Crear store `meetings` (keyPath: `id`, índice: `date`)
- [x] Crear store `meeting_topics` (keyPath: `id`, índices: `meeting_id`, `resolved`)
- [x] Renombrar store `teamMembers` → `team_members`
- [x] Mantener store `priorities`
- [x] Eliminar stores antiguos: `tasks`, `summaries`

## 1.3 Nuevos Contextos

- [x] Crear `PersonalTasksContext` (personalTasks + save/delete/move)
- [x] Crear `TeamTasksContext` (teamTasks, subtasks, taskComments, timelineEvents + CRUD completo)
- [x] Crear `MeetingsContext` (meetings, meetingTopics + CRUD completo)
- [x] Actualizar `DataContext` (team_members store + categories)
- [x] Conectar providers en App.tsx

## 1.4 Documentación

- [x] Actualizar CLAUDE.md con nuevos modelos, stores y contextos
- [x] Actualizar README.md con nuevos modelos, stores y contextos
- [x] Marcar checklists de fase-0 (0.4) y fase-1 como completados
