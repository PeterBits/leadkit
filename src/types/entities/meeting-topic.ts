export interface MeetingTopic {
  id: string;
  meeting_id: string | null;
  team_task_id: string | null;
  title: string;
  description: string;
  resolved: boolean;
  resolved_at: number | null;
  leader_response: string;
  created_at: number;
}
