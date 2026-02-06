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
