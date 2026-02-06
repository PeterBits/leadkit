export interface TeamTask {
  id: string;
  title: string;
  description: string;
  assignee_id: string;
  status: 'todo' | 'doing' | 'done';
  priority_id: string | null;
  jira_ref: string | null;
  start_date: number | null;
  deadline: number | null;
  progress_mode: 'auto' | 'manual';
  manual_progress: number;
  created_at: number;
  updated_at: number;
}
