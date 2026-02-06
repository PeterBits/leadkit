import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TeamMember, Priority, Category, DataContextType } from '../types';
import { dbOperation } from '../services/database';
import { generateId } from '../utils/ids';

const DataContext = createContext<DataContextType | null>(null);

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext must be used within DataProvider');
  return ctx;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const loadedMembers = await dbOperation<TeamMember[]>('team_members', 'readonly', store =>
          store.getAll(),
        );
        const loadedPriorities = await dbOperation<Priority[]>('priorities', 'readonly', store =>
          store.getAll(),
        );
        const loadedCategories = await dbOperation<Category[]>('categories', 'readonly', store =>
          store.getAll(),
        );
        setTeamMembers(loadedMembers || []);
        setPriorities(loadedPriorities || []);
        setCategories(loadedCategories || []);
      } catch {
        console.log('DataContext: DB init');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const saveTeamMember = async (member: TeamMember) => {
    const newMember = member.id ? member : { ...member, id: generateId(), created_at: Date.now() };
    await dbOperation('team_members', 'readwrite', store => store.put(newMember));
    setTeamMembers(prev => {
      const exists = prev.some(m => m.id === newMember.id);
      return exists ? prev.map(m => (m.id === newMember.id ? newMember : m)) : [...prev, newMember];
    });
  };

  const deleteTeamMember = async (id: string) => {
    await dbOperation('team_members', 'readwrite', store => store.delete(id));
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const savePriority = async (priority: Priority) => {
    const newPriority = priority.id
      ? priority
      : { ...priority, id: generateId(), created_at: Date.now() };
    await dbOperation('priorities', 'readwrite', store => store.put(newPriority));
    setPriorities(prev => {
      const exists = prev.some(p => p.id === newPriority.id);
      return exists
        ? prev.map(p => (p.id === newPriority.id ? newPriority : p))
        : [...prev, newPriority];
    });
  };

  const deletePriority = async (id: string) => {
    await dbOperation('priorities', 'readwrite', store => store.delete(id));
    setPriorities(prev => prev.filter(p => p.id !== id));
  };

  const saveCategory = async (category: Category) => {
    const newCategory = category.id
      ? category
      : { ...category, id: generateId(), created_at: Date.now() };
    await dbOperation('categories', 'readwrite', store => store.put(newCategory));
    setCategories(prev => {
      const exists = prev.some(c => c.id === newCategory.id);
      return exists
        ? prev.map(c => (c.id === newCategory.id ? newCategory : c))
        : [...prev, newCategory];
    });
  };

  const deleteCategory = async (id: string) => {
    await dbOperation('categories', 'readwrite', store => store.delete(id));
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        teamMembers,
        priorities,
        categories,
        isLoading,
        saveTeamMember,
        deleteTeamMember,
        savePriority,
        deletePriority,
        saveCategory,
        deleteCategory,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
