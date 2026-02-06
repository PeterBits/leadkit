export interface Subtask {
  id: string;
  team_task_id: string;
  title: string;
  completed: boolean;
  order: number;
  created_at: number;
}
