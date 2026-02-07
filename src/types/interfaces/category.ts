import { Category } from '../entities';

export interface CategorySelectorProps {
  categories: Category[];
  value: string | null;
  onChange: (value: string | null) => void;
}
