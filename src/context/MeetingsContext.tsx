import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Meeting, MeetingTopic, MeetingsContextType } from '../types';
import { dbOperation } from '../services/database';
import { generateId } from '../utils/ids';

const MeetingsContext = createContext<MeetingsContextType | null>(null);

export function useMeetingsContext() {
  const ctx = useContext(MeetingsContext);
  if (!ctx) throw new Error('useMeetingsContext must be used within MeetingsProvider');
  return ctx;
}

export function MeetingsProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [meetingTopics, setMeetingTopics] = useState<MeetingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const loadedMeetings = await dbOperation<Meeting[]>('meetings', 'readonly', s => s.getAll());
        const loadedTopics = await dbOperation<MeetingTopic[]>('meeting_topics', 'readonly', s => s.getAll());
        setMeetings(loadedMeetings || []);
        setMeetingTopics(loadedTopics || []);
      } catch {
        console.log('MeetingsContext: DB init');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const saveMeeting = async (
    meetingData: Omit<Meeting, 'id' | 'created_at'> & { id?: string }
  ) => {
    const meeting: Meeting = meetingData.id
      ? { ...meetings.find(m => m.id === meetingData.id)!, ...meetingData }
      : { ...meetingData, id: generateId(), created_at: Date.now() } as Meeting;
    await dbOperation('meetings', 'readwrite', store => store.put(meeting));
    setMeetings(prev => meetingData.id ? prev.map(m => m.id === meeting.id ? meeting : m) : [...prev, meeting]);
  };

  const deleteMeeting = async (id: string) => {
    const relatedTopics = meetingTopics.filter(t => t.meeting_id === id);
    for (const topic of relatedTopics) {
      const updated = { ...topic, meeting_id: null };
      await dbOperation('meeting_topics', 'readwrite', store => store.put(updated));
    }
    await dbOperation('meetings', 'readwrite', store => store.delete(id));
    setMeetings(prev => prev.filter(m => m.id !== id));
    setMeetingTopics(prev => prev.map(t => t.meeting_id === id ? { ...t, meeting_id: null } : t));
  };

  const saveMeetingTopic = async (
    topicData: Omit<MeetingTopic, 'id' | 'created_at'> & { id?: string }
  ) => {
    const topic: MeetingTopic = topicData.id
      ? { ...meetingTopics.find(t => t.id === topicData.id)!, ...topicData }
      : { ...topicData, id: generateId(), created_at: Date.now() } as MeetingTopic;
    await dbOperation('meeting_topics', 'readwrite', store => store.put(topic));
    setMeetingTopics(prev => topicData.id ? prev.map(t => t.id === topic.id ? topic : t) : [...prev, topic]);
  };

  const deleteMeetingTopic = async (id: string) => {
    await dbOperation('meeting_topics', 'readwrite', store => store.delete(id));
    setMeetingTopics(prev => prev.filter(t => t.id !== id));
  };

  const resolveMeetingTopic = async (id: string) => {
    const topic = meetingTopics.find(t => t.id === id);
    if (topic) {
      const updated = { ...topic, resolved: true, resolved_at: Date.now() };
      await dbOperation('meeting_topics', 'readwrite', store => store.put(updated));
      setMeetingTopics(prev => prev.map(t => t.id === id ? updated : t));
    }
  };

  return (
    <MeetingsContext.Provider value={{
      meetings, meetingTopics, isLoading,
      saveMeeting, deleteMeeting,
      saveMeetingTopic, deleteMeetingTopic, resolveMeetingTopic,
    }}>
      {children}
    </MeetingsContext.Provider>
  );
}
