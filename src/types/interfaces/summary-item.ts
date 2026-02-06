import { SummaryItem } from '../entities';

export interface SummaryItemCardProps {
  item: SummaryItem;
  onDelete: (id: string) => void;
}
