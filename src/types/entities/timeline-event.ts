export type TimelineEventType =
  | 'started'
  | 'blocked'
  | 'unblocked'
  | 'subtask_completed'
  | 'completed'
  | 'status_change';

export interface TimelineEvent {
  id: string;
  team_task_id: string;
  type: TimelineEventType;
  description: string | null;
  created_at: number;
}
