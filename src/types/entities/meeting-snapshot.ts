export interface SnapshotTask {
  id: string;
  title: string;
  progress: number;
  jira_ref: string | null;
}

export interface SnapshotBlockedTask {
  id: string;
  title: string;
  blocked_reason: string | null;
}

export interface SnapshotCompletedTask {
  id: string;
  title: string;
}

export interface MeetingSnapshot {
  id: string;
  meeting_id: string;
  member_id: string;
  member_name: string;
  tasks_doing: SnapshotTask[];
  tasks_blocked: SnapshotBlockedTask[];
  tasks_completed_since_last: SnapshotCompletedTask[];
  overall_progress: number;
  created_at: number;
}
