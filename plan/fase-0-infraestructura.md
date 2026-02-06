# Fase 0 - Infraestructura Base

## 0.1 Sistema de Rutas

- [x] Instalar `react-router-dom`
- [x] Crear layout principal con sidebar/navbar persistente
- [x] Configurar rutas: `/`, `/tasks`, `/team`, `/meetings`, `/settings`
- [x] Adaptar la navegación actual (header) al nuevo sistema de rutas

## 0.2 Refactor de Estado

- [x] Extraer el estado de `App.tsx` a contextos o moverlo a nivel de cada página
- [x] Evaluar si conviene un contexto global para datos compartidos (teamMembers, priorities, categories) y estado local por página para el resto
- [x] Mantener la sincronización con IndexedDB

## 0.3 Nueva Estructura de Carpetas

- [x] Crear estructura de carpetas:
  ```
  src/
  ├── pages/
  │   ├── DashboardPage.tsx
  │   ├── TasksPage.tsx
  │   ├── TeamPage.tsx
  │   ├── MeetingsPage.tsx
  │   └── SettingsPage.tsx
  ├── components/
  │   ├── layout/          # Layout, Sidebar, BottomNav
  │   ├── kanban/          # Componentes Kanban reutilizables
  │   ├── team/            # Componentes específicos de tracking
  │   ├── meetings/        # Componentes de reuniones
  │   ├── settings/        # (eliminado - migrado a SettingsPage)
  │   └── shared/          # Componentes compartidos
  ├── services/
  │   └── database.ts
  ├── types/
  │   └── index.ts
  ├── constants/
  ├── utils/
  └── context/             # DataContext + TasksContext
  ```
- [x] Mover archivos existentes a la nueva estructura
- [x] Actualizar imports en todos los archivos afectados

## 0.4 Migración de IndexedDB

- [ ] Incrementar `DB_VERSION` (de 2 a 3)
- [ ] Añadir nuevos object stores (ver Fase 1)
- [ ] Migrar los datos existentes de `tasks` → `personal_tasks`
- [ ] Migrar `summaries` → se mantendrá o transformará según la nueva sección de reuniones

> **Nota:** La sub-fase 0.4 se difiere a después de la Fase 1, ya que depende de los nuevos modelos de datos.
