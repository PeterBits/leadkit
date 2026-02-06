import { Task, TeamMember, Priority } from '../entities';

export interface TaskCardProps {
  task: Task;
  teamMembers: TeamMember[];
  priorities: Priority[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: Task['status']) => void;
}

export interface TaskModalProps {
  task: Task | null;
  teamMembers: TeamMember[];
  priorities: Priority[];
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onClose: () => void;
}

export interface KanbanColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  teamMembers: TeamMember[];
  priorities: Priority[];
  color: string;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: Task['status']) => void;
}

export interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  saveTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, status: Task['status']) => Promise<void>;
}
