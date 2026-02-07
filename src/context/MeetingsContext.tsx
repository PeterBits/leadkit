import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Meeting, MeetingTopic, MeetingSnapshot, MeetingsContextType } from '../types';
import { dbOperation } from '../services/database';
import { STORE_NAMES } from '../services/database';
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
  const [meetingSnapshots, setMeetingSnapshots] = useState<MeetingSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const loadedMeetings = await dbOperation<Meeting[]>(STORE_NAMES.MEETINGS, 'readonly', s =>
          s.getAll(),
        );
        const loadedTopics = await dbOperation<MeetingTopic[]>(
          STORE_NAMES.MEETING_TOPICS,
          'readonly',
          s => s.getAll(),
        );
        const loadedSnapshots = await dbOperation<MeetingSnapshot[]>(
          STORE_NAMES.MEETING_SNAPSHOTS,
          'readonly',
          s => s.getAll(),
        );
        setMeetings(loadedMeetings || []);
        setMeetingTopics(loadedTopics || []);
        setMeetingSnapshots(loadedSnapshots || []);
      } catch {
        console.log('MeetingsContext: DB init');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const saveMeeting = async (meetingData: Omit<Meeting, 'id' | 'created_at'> & { id?: string }) => {
    const meeting: Meeting = meetingData.id
      ? { ...meetings.find(m => m.id === meetingData.id)!, ...meetingData }
      : ({ ...meetingData, id: generateId(), created_at: Date.now() } as Meeting);
    await dbOperation(STORE_NAMES.MEETINGS, 'readwrite', store => store.put(meeting));
    setMeetings(prev =>
      meetingData.id ? prev.map(m => (m.id === meeting.id ? meeting : m)) : [...prev, meeting],
    );
  };

  const deleteMeeting = async (id: string) => {
    // Cascade-delete snapshots
    const relatedSnapshots = meetingSnapshots.filter(s => s.meeting_id === id);
    for (const snapshot of relatedSnapshots) {
      await dbOperation(STORE_NAMES.MEETING_SNAPSHOTS, 'readwrite', store =>
        store.delete(snapshot.id),
      );
    }
    setMeetingSnapshots(prev => prev.filter(s => s.meeting_id !== id));

    // Unlink topics
    const relatedTopics = meetingTopics.filter(t => t.meeting_id === id);
    for (const topic of relatedTopics) {
      const updated = { ...topic, meeting_id: null };
      await dbOperation(STORE_NAMES.MEETING_TOPICS, 'readwrite', store => store.put(updated));
    }
    await dbOperation(STORE_NAMES.MEETINGS, 'readwrite', store => store.delete(id));
    setMeetings(prev => prev.filter(m => m.id !== id));
    setMeetingTopics(prev => prev.map(t => (t.meeting_id === id ? { ...t, meeting_id: null } : t)));
  };

  const saveMeetingTopic = async (
    topicData: Omit<MeetingTopic, 'id' | 'created_at'> & { id?: string },
  ) => {
    const topic: MeetingTopic = topicData.id
      ? { ...meetingTopics.find(t => t.id === topicData.id)!, ...topicData }
      : ({ ...topicData, id: generateId(), created_at: Date.now() } as MeetingTopic);
    await dbOperation(STORE_NAMES.MEETING_TOPICS, 'readwrite', store => store.put(topic));
    setMeetingTopics(prev =>
      topicData.id ? prev.map(t => (t.id === topic.id ? topic : t)) : [...prev, topic],
    );
  };

  const deleteMeetingTopic = async (id: string) => {
    await dbOperation(STORE_NAMES.MEETING_TOPICS, 'readwrite', store => store.delete(id));
    setMeetingTopics(prev => prev.filter(t => t.id !== id));
  };

  const resolveMeetingTopic = async (id: string) => {
    const topic = meetingTopics.find(t => t.id === id);
    if (topic) {
      const updated = { ...topic, resolved: true, resolved_at: Date.now() };
      await dbOperation(STORE_NAMES.MEETING_TOPICS, 'readwrite', store => store.put(updated));
      setMeetingTopics(prev => prev.map(t => (t.id === id ? updated : t)));
    }
  };

  const saveMeetingSnapshots = async (snapshots: MeetingSnapshot[]) => {
    if (snapshots.length === 0) return;
    const meetingId = snapshots[0].meeting_id;

    // Delete old snapshots for this meeting
    const oldSnapshots = meetingSnapshots.filter(s => s.meeting_id === meetingId);
    for (const old of oldSnapshots) {
      await dbOperation(STORE_NAMES.MEETING_SNAPSHOTS, 'readwrite', store => store.delete(old.id));
    }

    // Insert new snapshots
    for (const snapshot of snapshots) {
      await dbOperation(STORE_NAMES.MEETING_SNAPSHOTS, 'readwrite', store => store.put(snapshot));
    }

    setMeetingSnapshots(prev => [...prev.filter(s => s.meeting_id !== meetingId), ...snapshots]);
  };

  const deleteMeetingSnapshots = async (meetingId: string) => {
    const toDelete = meetingSnapshots.filter(s => s.meeting_id === meetingId);
    for (const snapshot of toDelete) {
      await dbOperation(STORE_NAMES.MEETING_SNAPSHOTS, 'readwrite', store =>
        store.delete(snapshot.id),
      );
    }
    setMeetingSnapshots(prev => prev.filter(s => s.meeting_id !== meetingId));
  };

  return (
    <MeetingsContext.Provider
      value={{
        meetings,
        meetingTopics,
        meetingSnapshots,
        isLoading,
        saveMeeting,
        deleteMeeting,
        saveMeetingTopic,
        deleteMeetingTopic,
        resolveMeetingTopic,
        saveMeetingSnapshots,
        deleteMeetingSnapshots,
      }}
    >
      {children}
    </MeetingsContext.Provider>
  );
}
