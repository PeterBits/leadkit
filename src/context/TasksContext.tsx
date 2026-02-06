import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Task, TasksContextType } from '../types';
import { dbOperation } from '../services/database';
import { generateId } from '../utils/ids';

const TasksContext = createContext<TasksContextType | null>(null);

export function useTasksContext() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasksContext must be used within TasksProvider');
  return ctx;
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const loadedTasks = await dbOperation<Task[]>('tasks', 'readonly', store => store.getAll());
        setTasks(loadedTasks || []);
      } catch {
        console.log('TasksContext: DB init');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const saveTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => {
    const now = Date.now();
    const task: Task = taskData.id
      ? { ...tasks.find(t => t.id === taskData.id)!, ...taskData, updated_at: now }
      : { ...taskData, id: generateId(), created_at: now, updated_at: now } as Task;
    await dbOperation('tasks', 'readwrite', store => store.put(task));
    setTasks(prev => taskData.id ? prev.map(t => t.id === task.id ? task : t) : [...prev, task]);
  };

  const deleteTask = async (id: string) => {
    await dbOperation('tasks', 'readwrite', store => store.delete(id));
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = async (id: string, status: Task['status']) => {
    const task = tasks.find(t => t.id === id);
    if (task) await saveTask({ ...task, status });
  };

  return (
    <TasksContext.Provider value={{ tasks, isLoading, saveTask, deleteTask, moveTask }}>
      {children}
    </TasksContext.Provider>
  );
}
