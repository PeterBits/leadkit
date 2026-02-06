import { TeamMember, Priority } from '../entities';

export interface DataContextType {
  teamMembers: TeamMember[];
  priorities: Priority[];
  isLoading: boolean;
  saveTeamMember: (member: TeamMember) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  savePriority: (priority: Priority) => Promise<void>;
  deletePriority: (id: string) => Promise<void>;
}
