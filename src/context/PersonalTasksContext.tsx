import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { PersonalTask, PersonalTasksContextType } from '../types';
import { dbOperation } from '../services/database';
import { generateId } from '../utils/ids';

const PersonalTasksContext = createContext<PersonalTasksContextType | null>(null);

export function usePersonalTasksContext() {
  const ctx = useContext(PersonalTasksContext);
  if (!ctx) throw new Error('usePersonalTasksContext must be used within PersonalTasksProvider');
  return ctx;
}

export function PersonalTasksProvider({ children }: { children: ReactNode }) {
  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await dbOperation<PersonalTask[]>('personal_tasks', 'readonly', store =>
          store.getAll(),
        );
        setPersonalTasks(loaded || []);
      } catch {
        console.log('PersonalTasksContext: DB init');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const savePersonalTask = async (
    taskData: Omit<PersonalTask, 'id' | 'created_at' | 'updated_at'> & { id?: string },
  ) => {
    const now = Date.now();
    const task: PersonalTask = taskData.id
      ? { ...personalTasks.find(t => t.id === taskData.id)!, ...taskData, updated_at: now }
      : ({ ...taskData, id: generateId(), created_at: now, updated_at: now } as PersonalTask);
    await dbOperation('personal_tasks', 'readwrite', store => store.put(task));
    setPersonalTasks(prev =>
      taskData.id ? prev.map(t => (t.id === task.id ? task : t)) : [...prev, task],
    );
  };

  const deletePersonalTask = async (id: string) => {
    await dbOperation('personal_tasks', 'readwrite', store => store.delete(id));
    setPersonalTasks(prev => prev.filter(t => t.id !== id));
  };

  const movePersonalTask = async (id: string, status: PersonalTask['status']) => {
    const task = personalTasks.find(t => t.id === id);
    if (task) await savePersonalTask({ ...task, status });
  };

  return (
    <PersonalTasksContext.Provider
      value={{
        personalTasks,
        isLoading,
        savePersonalTask,
        deletePersonalTask,
        movePersonalTask,
      }}
    >
      {children}
    </PersonalTasksContext.Provider>
  );
}
