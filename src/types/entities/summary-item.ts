export interface SummaryItem {
  id: string;
  weekNumber: number;
  year: number;
  title: string;
  description: string;
  category: 'discussion' | 'blocker' | 'achievement' | 'action-item';
  createdAt: number;
}
