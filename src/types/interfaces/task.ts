import { PersonalTask, Category, Priority } from '../entities';

export interface TaskCardProps {
  task: PersonalTask;
  categories: Category[];
  priorities: Priority[];
  onEdit: (task: PersonalTask) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: PersonalTask['status']) => void;
}

export interface TaskModalProps {
  task: PersonalTask | null;
  categories: Category[];
  priorities: Priority[];
  onSave: (task: Omit<PersonalTask, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => void;
  onClose: () => void;
}

export interface KanbanColumnProps {
  title: string;
  status: PersonalTask['status'];
  tasks: PersonalTask[];
  categories: Category[];
  priorities: Priority[];
  color: string;
  onEdit: (task: PersonalTask) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: PersonalTask['status']) => void;
}
