# Fase 4 - Reuniones con el Líder (`/meetings`)

## 4.1 Listado de Reuniones

- [ ] Vista de lista de reuniones pasadas y futuras
- [ ] Botón para crear nueva reunión (seleccionar fecha)
- [ ] Las reuniones pasadas quedan como registro histórico

## 4.2 Vista de Reunión (detalle)

Una reunión tiene tres secciones principales:

### Estado del Equipo (auto-generado)

- [ ] Resumen por miembro del equipo:
  - Tareas en las que está trabajando (status = doing)
  - Tareas bloqueadas con motivo
  - Tareas completadas desde la última reunión
  - Progreso general
- [ ] Información extraída automáticamente del tracking del equipo (`/team`)
- [ ] Almacenar snapshot generado como registro histórico

### Temas Pendientes con el Líder

- [ ] Lista de temas (título + descripción)
- [ ] Cada tema se puede marcar como "resuelto" (queda en el registro, no se elimina)
- [ ] Crear temas sin asignarlos a una reunión específica (temas "flotantes")
- [ ] Historial de temas resueltos visible

### Feedback del Líder

- [ ] Campo de texto para registrar el feedback recibido del líder tras la reunión
- [ ] Se almacena como parte de la entidad Meeting (`leader_feedback`)
- [ ] Permite documentar decisiones, indicaciones y comentarios del líder

## 4.3 Temas Pendientes Globales

- [ ] Vista de todos los temas pendientes sin resolver (independiente de la reunión)
- [ ] Al preparar una reunión, se pueden "vincular" temas pendientes a esa reunión
