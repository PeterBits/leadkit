# Fase 4 - Reuniones con el Líder (`/meetings`)

## 4.1 Listado de Reuniones

- [x] Vista de lista de reuniones pasadas y futuras
- [x] Botón para crear nueva reunión (seleccionar fecha)
- [x] Las reuniones pasadas quedan como registro histórico

## 4.2 Vista de Reunión (detalle)

Una reunión tiene tres secciones principales:

### Estado del Equipo (auto-generado)

- [x] Resumen por miembro del equipo:
  - Tareas en las que está trabajando (status = doing)
  - Tareas bloqueadas con motivo
  - Tareas completadas desde la última reunión
  - Progreso general
- [x] Información extraída automáticamente del tracking del equipo (`/team`)
- [x] Almacenar snapshot generado como registro histórico

### Temas Pendientes con el Líder

- [x] Lista de temas (título + descripción)
- [x] Cada tema se puede marcar como "resuelto" (queda en el registro, no se elimina)
- [x] Crear temas sin asignarlos a una reunión específica (temas "flotantes")
- [x] Historial de temas resueltos visible

### Feedback del Líder

- [x] Campo de texto para registrar el feedback recibido del líder tras la reunión
- [x] Se almacena como parte de la entidad Meeting (`leader_feedback`)
- [x] Permite documentar decisiones, indicaciones y comentarios del líder

## 4.3 Temas Pendientes Globales

- [x] Vista de todos los temas pendientes sin resolver (independiente de la reunión)
- [x] Al preparar una reunión, se pueden "vincular" temas pendientes a esa reunión
