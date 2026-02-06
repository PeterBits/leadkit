import { TeamMember, Priority, Category } from '../entities';

export interface DataContextType {
  teamMembers: TeamMember[];
  priorities: Priority[];
  categories: Category[];
  isLoading: boolean;
  saveTeamMember: (member: TeamMember) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  savePriority: (priority: Priority) => Promise<void>;
  deletePriority: (id: string) => Promise<void>;
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}
