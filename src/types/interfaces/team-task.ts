import {
  TeamTask,
  Subtask,
  TaskComment,
  TimelineEvent,
  TimelineEventType,
  TeamMember,
  Priority,
} from '../entities';

export interface TeamTasksContextType {
  teamTasks: TeamTask[];
  subtasks: Subtask[];
  taskComments: TaskComment[];
  timelineEvents: TimelineEvent[];
  isLoading: boolean;
  saveTeamTask: (
    taskData: Omit<TeamTask, 'id' | 'created_at' | 'updated_at'> & { id?: string },
  ) => Promise<void>;
  deleteTeamTask: (id: string) => Promise<void>;
  moveTeamTask: (id: string, status: TeamTask['status']) => Promise<void>;
  saveSubtask: (subtaskData: Omit<Subtask, 'id' | 'created_at'> & { id?: string }) => Promise<void>;
  deleteSubtask: (id: string) => Promise<void>;
  toggleSubtask: (id: string) => Promise<void>;
  saveTaskComment: (
    commentData: Omit<TaskComment, 'id' | 'created_at'> & { id?: string },
  ) => Promise<void>;
  deleteTaskComment: (id: string) => Promise<void>;
  addTimelineEvent: (
    teamTaskId: string,
    type: TimelineEventType,
    description: string | null,
  ) => Promise<void>;
}

export interface TeamTaskCardProps {
  task: TeamTask;
  subtasks: Subtask[];
  timelineEvents: TimelineEvent[];
  teamMembers: TeamMember[];
  priorities: Priority[];
  onOpen: (task: TeamTask) => void;
  onMove: (id: string, status: TeamTask['status']) => void;
}

export interface TeamKanbanColumnProps {
  title: string;
  status: TeamTask['status'];
  tasks: TeamTask[];
  subtasks: Subtask[];
  timelineEvents: TimelineEvent[];
  teamMembers: TeamMember[];
  priorities: Priority[];
  color: string;
  onOpen: (task: TeamTask) => void;
  onMove: (id: string, status: TeamTask['status']) => void;
}

export interface TeamTaskModalProps {
  task: TeamTask | null;
  teamMembers: TeamMember[];
  priorities: Priority[];
  onSave: (data: Omit<TeamTask, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => void;
  onClose: () => void;
}

export interface TeamTaskDetailProps {
  task: TeamTask;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export interface SubtaskListProps {
  subtasks: Subtask[];
  taskId: string;
}

export interface CommentSectionProps {
  comments: TaskComment[];
  taskId: string;
}

export interface TaskTimelineProps {
  events: TimelineEvent[];
  taskId: string;
}
