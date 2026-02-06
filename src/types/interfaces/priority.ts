import { Priority } from '../entities';

export interface PrioritySelectorProps {
  priorities: Priority[];
  value: string | null;
  onChange: (value: string | null) => void;
}
