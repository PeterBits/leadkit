import { Meeting, MeetingTopic, MeetingSnapshot } from '../entities';

export interface MeetingsContextType {
  meetings: Meeting[];
  meetingTopics: MeetingTopic[];
  meetingSnapshots: MeetingSnapshot[];
  isLoading: boolean;
  saveMeeting: (meetingData: Omit<Meeting, 'id' | 'created_at'> & { id?: string }) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  saveMeetingTopic: (
    topicData: Omit<MeetingTopic, 'id' | 'created_at'> & { id?: string },
  ) => Promise<void>;
  deleteMeetingTopic: (id: string) => Promise<void>;
  resolveMeetingTopic: (id: string) => Promise<void>;
  saveMeetingSnapshots: (snapshots: MeetingSnapshot[]) => Promise<void>;
  deleteMeetingSnapshots: (meetingId: string) => Promise<void>;
}

export interface MeetingListItemProps {
  meeting: Meeting;
  topicCount: number;
  hasSnapshots: boolean;
  onOpen: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
}

export interface MeetingModalProps {
  meeting: Meeting;
  onClose: () => void;
}

export interface TeamStatusSectionProps {
  meetingId: string;
}

export interface TopicsSectionProps {
  meetingId: string;
}

export interface FeedbackSectionProps {
  meeting: Meeting;
}

export interface PendingTopicsPanelProps {
  onClose: () => void;
}

export interface CreateMeetingModalProps {
  onClose: () => void;
}
