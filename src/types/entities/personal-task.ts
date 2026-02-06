export interface PersonalTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  priority_id: string | null;
  category_id: string | null;
  created_at: number;
  updated_at: number;
}
