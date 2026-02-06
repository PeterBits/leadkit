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

Single-page React app for frontend team management: Kanban board + weekly meeting summaries. All data persisted in IndexedDB (no backend).

### State Management

All application state lives in `App.tsx` via `useState` hooks. There are no contexts, reducers, or state management libraries. Each CRUD operation writes to IndexedDB first, then updates React state. Data is loaded once on mount via `useEffect`.

### Data Layer

`services/database.ts` exposes a generic `dbOperation<T>(storeName, mode, operation)` wrapper around IndexedDB. The DB (`FrontendTeamDB`, version 2) has 4 object stores: `tasks`, `summaries`, `teamMembers`, `priorities`. To add a new store or index, increment `DB_VERSION` and handle it in `onupgradeneeded`.

### Component Organization

- `components/kanban/` - KanbanColumn, TaskCard, TaskModal (includes PrioritySelector sub-component)
- `components/weekly-summary/` - SummaryItemCard
- `components/settings/` - SettingsPanel (slide-over panel for team members and priorities CRUD)
- Each folder has a barrel `index.ts`

### Dynamic Tailwind Classes

Priority colors are applied dynamically (e.g., `` bg-${priority.color} ``, `` border-l-${priority.color} ``). These classes **must** be listed in `tailwind.config.js` `safelist` or they won't be generated. When adding new colors, update both `constants/index.ts` (`PRIORITY_COLORS`) and the safelist.

### Types

All interfaces are in `types/index.ts`: `Task`, `SummaryItem`, `TeamMember`, `Priority`, `View`. The `View` type controls which main view is rendered (`'kanban' | 'weekly'`).

## Key Conventions

- Language: UI text is in Spanish, code identifiers in English
- **Naming:** Object/interface keys use `snake_case` (`created_at`, `team_task_id`). Variables/functions/hooks use `camelCase`. Components/classes use `PascalCase`.
- Responsive: mobile-first with `sm:` breakpoint for desktop. Kanban uses tabs on mobile, 3-column grid on desktop. Modal renders as bottom-sheet on mobile, centered on desktop.
- Icons: Lucide React (`lucide-react`)
- IDs: Random string via `utils/ids.ts` (`Math.random().toString(36) + Date.now().toString(36)`)
- TypeScript: strict mode with `noUnusedLocals` and `noUnusedParameters`
- **README.md must be updated when making code changes** (owner requirement)
