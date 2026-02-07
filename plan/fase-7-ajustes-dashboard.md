# Fase 7 - Ajustes Dashboard, Alertas detalladas y Accesos directos

## 7.1 Alertas detalladas en Dashboard

- [x] **Con retraso:** Listar cada tarea cuyo `deadline < now` y `status !== 'done'`, mostrando título + nombre del asignado
- [x] **Bloqueadas:** Listar cada tarea bloqueada (`isTaskBlocked()`), mostrando título + nombre del asignado
- [x] **Estancadas (>7d):** Listar cada tarea en `doing` con `updated_at` > 7 días, mostrando título + nombre del asignado
- [x] Limitar altura del widget con scroll si hay muchas alertas
- [x] Cada alerta individual con icono de tipo (reloj para retraso, candado para bloqueada, reloj para estancada)

## 7.2 Widget de Equipo — mostrar activas y pendientes

- [x] Por cada miembro mostrar: `X activas` (status = doing) + `Y pendientes` (status = todo)
- [x] Mantener indicador de bloqueos

## 7.3 Indicador de deadline vencido en TeamTaskCard

- [x] En `TeamTaskCard`, si la tarea tiene `deadline` y `deadline < Date.now()` y `status !== 'done'`, mostrar indicador visual
- [x] Acento visual naranja diferenciado del rojo de bloqueo (borde naranja, icono Clock, texto con fecha vencida)

## 7.4 Accesos directos con apertura automática de modales

- [x] Crear tarea personal → `/tasks` con `state: { openCreateModal: true }`
- [x] Crear tarea de equipo → `/team` con `state: { openCreateModal: true }`
- [x] Reunión de hoy → `/meetings` con `state: { createTodayMeeting: true }` (crea reunión si no existe, abre modal)
