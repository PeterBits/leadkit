export interface SummaryItem {
  id: string;
  week_number: number;
  year: number;
  title: string;
  description: string;
  category: 'discussion' | 'blocker' | 'achievement' | 'action-item';
  created_at: number;
}
