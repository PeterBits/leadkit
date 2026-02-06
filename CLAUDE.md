# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Dev server at localhost:5173
npm run build        # TypeScript check + Vite production build (generates PWA assets)
npm run preview      # Preview production build
npm run lint         # ESLint
npm run format       # Format all source files with Prettier
npm run format:check # Check formatting without writing
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

5 React Contexts organized by domain:

- **DataContext** (`context/DataContext.tsx`): `teamMembers`, `priorities`, `categories` + their CRUD handlers. Reference data shared across the app.
- **PersonalTasksContext** (`context/PersonalTasksContext.tsx`): `personalTasks` + save/delete/move. Tech lead's own tasks.
- **TeamTasksContext** (`context/TeamTasksContext.tsx`): `teamTasks`, `subtasks`, `taskComments`, `timelineEvents` + full CRUD. Includes cascade delete and automatic timeline events.
- **MeetingsContext** (`context/MeetingsContext.tsx`): `meetings`, `meetingTopics` + CRUD. Includes topic resolution and unlink-on-delete.
- **~~TasksContext~~** (deprecated, will be removed in Phase 2): Legacy `tasks` context, kept temporarily for backward compatibility.

Each CRUD operation writes to IndexedDB first, then updates React state.

### Data Layer

`services/database.ts` exposes a generic `dbOperation<T>(storeName, mode, operation)` wrapper and a `STORE_NAMES` constant. The DB (`FrontendTeamDB`, version 4) has 10 object stores: `team_members`, `priorities`, `categories`, `personal_tasks`, `team_tasks`, `subtasks`, `task_comments`, `timeline_events`, `meetings`, `meeting_topics`. To add a new store or index, increment `DB_VERSION` and handle it in `onupgradeneeded`.

### Component & View Organization

- `views/` - Each view has its own folder with page + scoped components:
  - `views/tasks/` - TasksPage + `components/` (KanbanColumn, TaskCard, TaskModal with PrioritySelector)
  - `views/meetings/` - MeetingsPage + `components/` (SummaryItemCard)
  - `views/dashboard/` - DashboardPage
  - `views/team/` - TeamPage
  - `views/settings/` - SettingsPage
- `components/layout/` - Layout, Sidebar, BottomNav (persistent navigation shell, shared across all views)
- `context/` - DataContext, PersonalTasksContext, TeamTasksContext, MeetingsContext (+ deprecated TasksContext)
- `constants/` - Split by entity: `priority.ts`, `category.ts`, `team-task.ts`, `timeline-event.ts`, `summary-item.ts` (deprecated)
- `types/` - Split by entity:
  - `types/entities/` - One file per entity (category, personal-task, team-task, subtask, task-comment, timeline-event, meeting, meeting-topic, team-member, priority + deprecated: task, summary-item)
  - `types/interfaces/` - Component/context props organized by entity
- Each folder has a barrel `index.ts`

### Navigation

- **Desktop (sm:+):** Fixed left sidebar (240px) with NavLink × 5, icons from Lucide
- **Mobile:** Fixed bottom tab bar with NavLink × 5
- Nav items are defined in `Sidebar.tsx` and `BottomNav.tsx` as `NAV_ITEMS` arrays

### Theme

Permanent dark theme. Base colors set in `index.css` via `@layer base` (body: `bg-gray-950 text-gray-100`, form elements: `bg-gray-800 border-gray-700`). All components use dark palette directly — no light/dark toggle. Key surfaces: `bg-gray-950` (page), `bg-gray-900` (cards/panels), `bg-gray-800` (inputs/rows/badges). Accents: `blue-400`, `green-400`, `purple-400`. Primary buttons remain `bg-blue-600`.

### Dynamic Tailwind Classes

Priority colors are applied dynamically (e.g., `` bg-${priority.color} ``, `` border-l-${priority.color} ``). These classes **must** be listed in `tailwind.config.js` `safelist` or they won't be generated. When adding new colors, update both `constants/priority.ts` (`PRIORITY_COLORS`) and the safelist.

### Types

Entity-based type system split across two subdirectories:
- `types/entities/` - Data model interfaces: `Category`, `PersonalTask`, `TeamTask`, `Subtask`, `TaskComment`, `TimelineEvent`, `Meeting`, `MeetingTopic`, `TeamMember`, `Priority` (+ deprecated `Task`, `SummaryItem`)
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
