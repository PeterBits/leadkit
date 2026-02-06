import { PersonalTask } from '../entities';

export interface PersonalTasksContextType {
  personalTasks: PersonalTask[];
  isLoading: boolean;
  savePersonalTask: (
    taskData: Omit<PersonalTask, 'id' | 'created_at' | 'updated_at'> & { id?: string },
  ) => Promise<void>;
  deletePersonalTask: (id: string) => Promise<void>;
  movePersonalTask: (id: string, status: PersonalTask['status']) => Promise<void>;
}
