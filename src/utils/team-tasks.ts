import { TeamTask, Subtask, TimelineEvent } from '../types';

export function getTaskProgress(task: TeamTask, subtasks: Subtask[]): number {
  if (task.progress_mode === 'manual') return task.manual_progress;
  const taskSubtasks = subtasks.filter(s => s.team_task_id === task.id);
  if (taskSubtasks.length === 0) return 0;
  const completed = taskSubtasks.filter(s => s.completed).length;
  return Math.round((completed / taskSubtasks.length) * 100);
}

export function isTaskBlocked(taskId: string, events: TimelineEvent[]): boolean {
  const relevant = events
    .filter(e => e.team_task_id === taskId && (e.type === 'blocked' || e.type === 'unblocked'))
    .sort((a, b) => b.created_at - a.created_at);
  return relevant.length > 0 && relevant[0].type === 'blocked';
}
