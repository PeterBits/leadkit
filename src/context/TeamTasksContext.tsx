import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TeamTask, Subtask, TaskComment, TimelineEvent, TeamTasksContextType } from '../types';
import { dbOperation } from '../services/database';
import { generateId } from '../utils/ids';

const TeamTasksContext = createContext<TeamTasksContextType | null>(null);

export function useTeamTasksContext() {
  const ctx = useContext(TeamTasksContext);
  if (!ctx) throw new Error('useTeamTasksContext must be used within TeamTasksProvider');
  return ctx;
}

export function TeamTasksProvider({ children }: { children: ReactNode }) {
  const [teamTasks, setTeamTasks] = useState<TeamTask[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [taskComments, setTaskComments] = useState<TaskComment[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const loadedTasks = await dbOperation<TeamTask[]>('team_tasks', 'readonly', s => s.getAll());
        const loadedSubtasks = await dbOperation<Subtask[]>('subtasks', 'readonly', s => s.getAll());
        const loadedComments = await dbOperation<TaskComment[]>('task_comments', 'readonly', s => s.getAll());
        const loadedEvents = await dbOperation<TimelineEvent[]>('timeline_events', 'readonly', s => s.getAll());
        setTeamTasks(loadedTasks || []);
        setSubtasks(loadedSubtasks || []);
        setTaskComments(loadedComments || []);
        setTimelineEvents(loadedEvents || []);
      } catch {
        console.log('TeamTasksContext: DB init');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const addTimelineEvent = async (teamTaskId: string, type: TimelineEvent['type'], description: string | null) => {
    const event: TimelineEvent = {
      id: generateId(),
      team_task_id: teamTaskId,
      type,
      description,
      created_at: Date.now(),
    };
    await dbOperation('timeline_events', 'readwrite', store => store.put(event));
    setTimelineEvents(prev => [...prev, event]);
  };

  const saveTeamTask = async (
    taskData: Omit<TeamTask, 'id' | 'created_at' | 'updated_at'> & { id?: string }
  ) => {
    const now = Date.now();
    const task: TeamTask = taskData.id
      ? { ...teamTasks.find(t => t.id === taskData.id)!, ...taskData, updated_at: now }
      : { ...taskData, id: generateId(), created_at: now, updated_at: now } as TeamTask;
    await dbOperation('team_tasks', 'readwrite', store => store.put(task));
    setTeamTasks(prev => taskData.id ? prev.map(t => t.id === task.id ? task : t) : [...prev, task]);
  };

  const deleteTeamTask = async (id: string) => {
    const relatedSubtasks = subtasks.filter(s => s.team_task_id === id);
    const relatedComments = taskComments.filter(c => c.team_task_id === id);
    const relatedEvents = timelineEvents.filter(e => e.team_task_id === id);

    for (const s of relatedSubtasks) {
      await dbOperation('subtasks', 'readwrite', store => store.delete(s.id));
    }
    for (const c of relatedComments) {
      await dbOperation('task_comments', 'readwrite', store => store.delete(c.id));
    }
    for (const e of relatedEvents) {
      await dbOperation('timeline_events', 'readwrite', store => store.delete(e.id));
    }

    await dbOperation('team_tasks', 'readwrite', store => store.delete(id));
    setTeamTasks(prev => prev.filter(t => t.id !== id));
    setSubtasks(prev => prev.filter(s => s.team_task_id !== id));
    setTaskComments(prev => prev.filter(c => c.team_task_id !== id));
    setTimelineEvents(prev => prev.filter(e => e.team_task_id !== id));
  };

  const moveTeamTask = async (id: string, status: TeamTask['status']) => {
    const task = teamTasks.find(t => t.id === id);
    if (task) {
      await saveTeamTask({ ...task, status });
      await addTimelineEvent(id, 'status_change', `Estado cambiado a ${status}`);
    }
  };

  const saveSubtask = async (
    subtaskData: Omit<Subtask, 'id' | 'created_at'> & { id?: string }
  ) => {
    const sub: Subtask = subtaskData.id
      ? { ...subtasks.find(s => s.id === subtaskData.id)!, ...subtaskData }
      : { ...subtaskData, id: generateId(), created_at: Date.now() } as Subtask;
    await dbOperation('subtasks', 'readwrite', store => store.put(sub));
    setSubtasks(prev => subtaskData.id ? prev.map(s => s.id === sub.id ? sub : s) : [...prev, sub]);
  };

  const deleteSubtask = async (id: string) => {
    await dbOperation('subtasks', 'readwrite', store => store.delete(id));
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const toggleSubtask = async (id: string) => {
    const sub = subtasks.find(s => s.id === id);
    if (sub) {
      const updated = { ...sub, completed: !sub.completed };
      await dbOperation('subtasks', 'readwrite', store => store.put(updated));
      setSubtasks(prev => prev.map(s => s.id === id ? updated : s));
      if (updated.completed) {
        await addTimelineEvent(sub.team_task_id, 'subtask_completed', `Subtarea "${sub.title}" completada`);
      }
    }
  };

  const saveTaskComment = async (
    commentData: Omit<TaskComment, 'id' | 'created_at'> & { id?: string }
  ) => {
    const comment: TaskComment = commentData.id
      ? { ...taskComments.find(c => c.id === commentData.id)!, ...commentData }
      : { ...commentData, id: generateId(), created_at: Date.now() } as TaskComment;
    await dbOperation('task_comments', 'readwrite', store => store.put(comment));
    setTaskComments(prev => commentData.id ? prev.map(c => c.id === comment.id ? comment : c) : [...prev, comment]);
  };

  const deleteTaskComment = async (id: string) => {
    await dbOperation('task_comments', 'readwrite', store => store.delete(id));
    setTaskComments(prev => prev.filter(c => c.id !== id));
  };

  return (
    <TeamTasksContext.Provider value={{
      teamTasks, subtasks, taskComments, timelineEvents, isLoading,
      saveTeamTask, deleteTeamTask, moveTeamTask,
      saveSubtask, deleteSubtask, toggleSubtask,
      saveTaskComment, deleteTaskComment,
    }}>
      {children}
    </TeamTasksContext.Provider>
  );
}
