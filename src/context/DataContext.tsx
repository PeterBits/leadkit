import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TeamMember, Priority, DataContextType } from '../types';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const loadedMembers = await dbOperation<TeamMember[]>('teamMembers', 'readonly', store => store.getAll());
        const loadedPriorities = await dbOperation<Priority[]>('priorities', 'readonly', store => store.getAll());
        setTeamMembers(loadedMembers || []);
        setPriorities(loadedPriorities || []);
      } catch {
        console.log('DataContext: DB init');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const saveTeamMember = async (member: TeamMember) => {
    const newMember = member.id ? member : { ...member, id: generateId(), createdAt: Date.now() };
    await dbOperation('teamMembers', 'readwrite', store => store.put(newMember));
    setTeamMembers(prev => [...prev, newMember]);
  };

  const deleteTeamMember = async (id: string) => {
    await dbOperation('teamMembers', 'readwrite', store => store.delete(id));
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const savePriority = async (priority: Priority) => {
    const newPriority = priority.id ? priority : { ...priority, id: generateId(), createdAt: Date.now() };
    await dbOperation('priorities', 'readwrite', store => store.put(newPriority));
    setPriorities(prev => [...prev, newPriority]);
  };

  const deletePriority = async (id: string) => {
    await dbOperation('priorities', 'readwrite', store => store.delete(id));
    setPriorities(prev => prev.filter(p => p.id !== id));
  };

  return (
    <DataContext.Provider value={{ teamMembers, priorities, isLoading, saveTeamMember, deleteTeamMember, savePriority, deletePriority }}>
      {children}
    </DataContext.Provider>
  );
}
