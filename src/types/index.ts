export interface TeamMember {
  id: string;
  name: string;
  createdAt: number;
}

export interface Priority {
  id: string;
  color: string;
  level: number;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  status: 'todo' | 'doing' | 'done';
  priorityId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface SummaryItem {
  id: string;
  weekNumber: number;
  year: number;
  title: string;
  description: string;
  category: 'discussion' | 'blocker' | 'achievement' | 'action-item';
  createdAt: number;
}

export type View = 'kanban' | 'weekly';
