# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Dev server at localhost:5173
npm run build    # TypeScript check + Vite production build (generates PWA assets)
npm run preview  # Preview production build
npm run lint     # ESLint
```

No test framework is configured.

## Architecture

Multi-page React app for frontend team management: Kanban board, weekly meeting summaries, team tracking, and dashboard. All data persisted in IndexedDB (no backend). Uses React Router v6 for client-side routing.

### Routing

5 routes defined in `App.tsx` via React Router:
- `/` → DashboardPage (task counters + quick links)
- `/tasks` → TasksPage (Kanban board)
- `/team` → TeamPage (placeholder for future team tracking)
- `/meetings` → MeetingsPage (weekly summaries)
- `/settings` → SettingsPage (team members + priorities CRUD)

All routes render inside `Layout` which provides persistent navigation (Sidebar on desktop, BottomNav on mobile).

### State Management

Two React Contexts for shared data, local state per page:

- **DataContext** (`context/DataContext.tsx`): `teamMembers`, `priorities` + their CRUD handlers. Consumed by TasksPage, SettingsPage, DashboardPage, TeamPage.
- **TasksContext** (`context/TasksContext.tsx`): `tasks` + `saveTask`, `deleteTask`, `moveTask`. Consumed by TasksPage, DashboardPage.
- **Page-local state**: `summaries` in MeetingsPage, `modalTask`/`filter`/`activeKanbanTab` in TasksPage, form inputs in SettingsPage.

Each CRUD operation writes to IndexedDB first, then updates React state.

### Data Layer

`services/database.ts` exposes a generic `dbOperation<T>(storeName, mode, operation)` wrapper around IndexedDB. The DB (`FrontendTeamDB`, version 2) has 4 object stores: `tasks`, `summaries`, `teamMembers`, `priorities`. To add a new store or index, increment `DB_VERSION` and handle it in `onupgradeneeded`.

### Component & View Organization

- `views/` - Each view has its own folder with page + scoped components:
  - `views/tasks/` - TasksPage + `components/` (KanbanColumn, TaskCard, TaskModal with PrioritySelector)
  - `views/meetings/` - MeetingsPage + `components/` (SummaryItemCard)
  - `views/dashboard/` - DashboardPage
  - `views/team/` - TeamPage
  - `views/settings/` - SettingsPage
- `components/layout/` - Layout, Sidebar, BottomNav (persistent navigation shell, shared across all views)
- `context/` - DataContext + TasksContext
- `constants/` - Split by entity: `priority.ts`, `summary-item.ts`
- `types/` - Split by entity:
  - `types/entities/` - One file per entity (task, priority, team-member, summary-item)
  - `types/interfaces/` - Component/context props organized by entity
- Each folder has a barrel `index.ts`

### Navigation

- **Desktop (sm:+):** Fixed left sidebar (240px) with NavLink × 5, icons from Lucide
- **Mobile:** Fixed bottom tab bar with NavLink × 5
- Nav items are defined in `Sidebar.tsx` and `BottomNav.tsx` as `NAV_ITEMS` arrays

### Dynamic Tailwind Classes

Priority colors are applied dynamically (e.g., `` bg-${priority.color} ``, `` border-l-${priority.color} ``). These classes **must** be listed in `tailwind.config.js` `safelist` or they won't be generated. When adding new colors, update both `constants/priority.ts` (`PRIORITY_COLORS`) and the safelist.

### Types

Entity-based type system split across two subdirectories:
- `types/entities/` - Data model interfaces (`Task`, `SummaryItem`, `TeamMember`, `Priority`)
- `types/interfaces/` - Component props and context types, organized by entity
- No inline interfaces in components or services — all declared in `types/`

## Key Conventions

- Language: UI text is in Spanish, code identifiers in English
- **Naming:** Object/interface keys use `snake_case` (`created_at`, `team_task_id`). Variables/functions/hooks use `camelCase`. Components/classes use `PascalCase`.
- Responsive: mobile-first with `sm:` breakpoint for desktop. Kanban uses tabs on mobile, 3-column grid on desktop. Modal renders as bottom-sheet on mobile, centered on desktop.
- Icons: Lucide React (`lucide-react`)
- IDs: Random string via `utils/ids.ts` (`Math.random().toString(36) + Date.now().toString(36)`)
- **Interfaces:** NEVER declare interfaces or types in components, services, or contexts. All interfaces and types MUST be defined in `types/entities/` (data models) or `types/interfaces/` (component props, context types). One file per entity.
- TypeScript: strict mode with `noUnusedLocals` and `noUnusedParameters`
- **README.md must be updated when making code changes** (owner requirement)
