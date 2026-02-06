export interface MeetingTopic {
  id: string;
  meeting_id: string | null;
  title: string;
  description: string;
  resolved: boolean;
  resolved_at: number | null;
  created_at: number;
}
