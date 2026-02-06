# Fase 0 - Infraestructura Base

## 0.1 Sistema de Rutas

- [ ] Instalar `react-router-dom`
- [ ] Crear layout principal con sidebar/navbar persistente
- [ ] Configurar rutas: `/`, `/tasks`, `/team`, `/meetings`, `/settings`
- [ ] Adaptar la navegación actual (header) al nuevo sistema de rutas

## 0.2 Refactor de Estado

- [ ] Extraer el estado de `App.tsx` a contextos o moverlo a nivel de cada página
- [ ] Evaluar si conviene un contexto global para datos compartidos (teamMembers, priorities, categories) y estado local por página para el resto
- [ ] Mantener la sincronización con IndexedDB

## 0.3 Nueva Estructura de Carpetas

- [ ] Crear estructura de carpetas:
  ```
  src/
  ├── pages/
  │   ├── Dashboard.tsx
  │   ├── PersonalTasks.tsx
  │   ├── TeamTracking.tsx
  │   ├── Meetings.tsx
  │   └── Settings.tsx
  ├── components/
  │   ├── layout/          # Navbar, Sidebar, Layout
  │   ├── kanban/          # Componentes Kanban reutilizables
  │   ├── team/            # Componentes específicos de tracking
  │   ├── meetings/        # Componentes de reuniones
  │   ├── settings/        # Panel de configuración
  │   └── shared/          # Componentes compartidos (Modal, Timeline, etc.)
  ├── services/
  │   └── database.ts      # Ampliar con nuevos stores
  ├── types/
  │   └── index.ts         # Nuevos modelos de datos
  ├── constants/
  ├── utils/
  └── context/             # Contextos de React (si se decide usar)
  ```
- [ ] Mover archivos existentes a la nueva estructura
- [ ] Actualizar imports en todos los archivos afectados

## 0.4 Migración de IndexedDB

- [ ] Incrementar `DB_VERSION` (de 2 a 3)
- [ ] Añadir nuevos object stores (ver Fase 1)
- [ ] Migrar los datos existentes de `tasks` → `personal_tasks`
- [ ] Migrar `summaries` → se mantendrá o transformará según la nueva sección de reuniones
