# Fase 3 - Tracking del Equipo (`/team`)

## 3.1 Vista Kanban del Equipo

- [ ] Crear toggle (swap) para alternar entre vista unificada y vista por persona
- [ ] **Vista unificada:** Un solo Kanban con todas las tareas del equipo
- [ ] **Vista por persona:** Acordeones colapsables, cada uno con el Kanban de un miembro
- [ ] En vista unificada, cada tarjeta muestra el miembro asignado
- [ ] En vista por persona, los acordeones se pueden expandir/colapsar individualmente

## 3.2 Tarjeta de Tarea del Equipo

La tarjeta es más rica que la personal. Debe mostrar en vista compacta:

- [ ] Título
- [ ] Miembro asignado
- [ ] Referencia JIRA (si existe, como link/badge)
- [ ] Barra de progreso (con indicador de bloqueos)
- [ ] Prioridad
- [ ] Indicador visual si la tarea está actualmente bloqueada

## 3.3 Detalle de Tarea del Equipo (Modal/Panel)

Al hacer click en una tarjeta, se abre un panel detallado con secciones:

### Info general

- [ ] Título, descripción
- [ ] Miembro asignado, prioridad
- [ ] Referencia JIRA (opcional)
- [ ] Fecha de inicio, deadline (opcional)

### Checklist de Subtareas

- [ ] Lista ordenable de subtareas con checkbox
- [ ] Añadir/eliminar subtareas
- [ ] Porcentaje completado visible

### Barra de Progreso

- [ ] Toggle auto/manual
- [ ] Si auto: se calcula del checklist (completadas/total × 100)
- [ ] Si manual: campo numérico editable
- [ ] Indicadores visuales de bloqueos en la barra (marcas rojas en los puntos donde se bloqueó)

### Comentarios

- [ ] Lista de comentarios con fecha y hora de creación (metadatos automáticos)
- [ ] Campo para añadir nuevo comentario
- [ ] Orden cronológico

### Timeline / Cronograma

- [ ] Línea cronológica vertical con eventos:
  - 🟢 Tarea iniciada (fecha)
  - 🔴 Bloqueada (fecha + motivo opcional) — puede ocurrir múltiples veces
  - 🟢 Desbloqueada (fecha + motivo opcional)
  - ✅ Subtarea completada (fecha + nombre)
  - 🔵 Cambio de estado (fecha + de→a)
  - 🏁 Tarea completada (fecha)
- [ ] Eventos se generan automáticamente al realizar acciones
- [ ] Se pueden crear eventos manuales
