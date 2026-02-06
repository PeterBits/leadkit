export interface Task {
  id: string;
  title: string;
  description: string;
  assignee_id: string | null;
  status: 'todo' | 'doing' | 'done';
  priority_id: string | null;
  created_at: number;
  updated_at: number;
}
