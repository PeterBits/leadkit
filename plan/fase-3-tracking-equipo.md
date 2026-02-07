# Fase 3 - Tracking del Equipo (`/team`)

## 3.1 Vista Kanban del Equipo

- [x] Crear toggle (swap) para alternar entre vista unificada y vista por persona
- [x] **Vista unificada:** Un solo Kanban con todas las tareas del equipo
- [x] **Vista por persona:** Acordeones colapsables, cada uno con el Kanban de un miembro
- [x] En vista unificada, cada tarjeta muestra el miembro asignado
- [x] En vista por persona, los acordeones se pueden expandir/colapsar individualmente

## 3.2 Tarjeta de Tarea del Equipo

La tarjeta es más rica que la personal. Debe mostrar en vista compacta:

- [x] Título
- [x] Miembro asignado
- [x] Referencia JIRA (si existe, como link/badge)
- [x] Barra de progreso (con indicador de bloqueos)
- [x] Prioridad
- [x] Indicador visual si la tarea está actualmente bloqueada

## 3.3 Detalle de Tarea del Equipo (Modal/Panel)

Al hacer click en una tarjeta, se abre un panel detallado con secciones:

### Info general

- [x] Título, descripción
- [x] Miembro asignado, prioridad
- [x] Referencia JIRA (opcional)
- [x] Fecha de inicio, deadline (opcional)

### Checklist de Subtareas

- [x] Lista ordenable de subtareas con checkbox
- [x] Añadir/eliminar subtareas
- [x] Porcentaje completado visible

### Barra de Progreso

- [x] Toggle auto/manual
- [x] Si auto: se calcula del checklist (completadas/total × 100)
- [x] Si manual: campo numérico editable
- [x] Indicadores visuales de bloqueos en la barra (marcas rojas en los puntos donde se bloqueó)

### Comentarios

- [x] Lista de comentarios con fecha y hora de creación (metadatos automáticos)
- [x] Campo para añadir nuevo comentario
- [x] Orden cronológico

### Timeline / Cronograma

- [x] Línea cronológica vertical con eventos:
  - 🟢 Tarea iniciada (fecha)
  - 🔴 Bloqueada (fecha + motivo opcional) — puede ocurrir múltiples veces
  - 🟢 Desbloqueada (fecha + motivo opcional)
  - ✅ Subtarea completada (fecha + nombre)
  - 🔵 Cambio de estado (fecha + de→a)
  - 🏁 Tarea completada (fecha)
- [x] Eventos se generan automáticamente al realizar acciones
- [x] Se pueden crear eventos manuales
