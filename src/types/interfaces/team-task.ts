import { TeamTask, Subtask, TaskComment, TimelineEvent } from '../entities';

export interface TeamTasksContextType {
  teamTasks: TeamTask[];
  subtasks: Subtask[];
  taskComments: TaskComment[];
  timelineEvents: TimelineEvent[];
  isLoading: boolean;
  saveTeamTask: (taskData: Omit<TeamTask, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => Promise<void>;
  deleteTeamTask: (id: string) => Promise<void>;
  moveTeamTask: (id: string, status: TeamTask['status']) => Promise<void>;
  saveSubtask: (subtaskData: Omit<Subtask, 'id' | 'created_at'> & { id?: string }) => Promise<void>;
  deleteSubtask: (id: string) => Promise<void>;
  toggleSubtask: (id: string) => Promise<void>;
  saveTaskComment: (commentData: Omit<TaskComment, 'id' | 'created_at'> & { id?: string }) => Promise<void>;
  deleteTaskComment: (id: string) => Promise<void>;
}
