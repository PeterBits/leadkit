export const TIMELINE_EVENT_TYPES = [
  { value: 'started' as const, label: 'Iniciado' },
  { value: 'blocked' as const, label: 'Bloqueado' },
  { value: 'unblocked' as const, label: 'Desbloqueado' },
  { value: 'subtask_completed' as const, label: 'Subtarea completada' },
  { value: 'completed' as const, label: 'Completado' },
  { value: 'status_change' as const, label: 'Cambio de estado' },
];
