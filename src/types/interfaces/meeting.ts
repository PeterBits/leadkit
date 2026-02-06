import { Meeting, MeetingTopic } from '../entities';

export interface MeetingsContextType {
  meetings: Meeting[];
  meetingTopics: MeetingTopic[];
  isLoading: boolean;
  saveMeeting: (meetingData: Omit<Meeting, 'id' | 'created_at'> & { id?: string }) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  saveMeetingTopic: (
    topicData: Omit<MeetingTopic, 'id' | 'created_at'> & { id?: string },
  ) => Promise<void>;
  deleteMeetingTopic: (id: string) => Promise<void>;
  resolveMeetingTopic: (id: string) => Promise<void>;
}
