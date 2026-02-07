import React, { useState } from 'react';
import { X, Users, MessageSquare, MessageCircle } from 'lucide-react';
import { MeetingModalProps } from '../../../types';
import { TeamStatusSection } from './TeamStatusSection';
import { TopicsSection } from './TopicsSection';
import { FeedbackSection } from './FeedbackSection';

const TABS = [
  { key: 'status', label: 'Estado del Equipo', icon: Users },
  { key: 'topics', label: 'Temas', icon: MessageSquare },
  { key: 'feedback', label: 'Feedback', icon: MessageCircle },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export const MeetingModal: React.FC<MeetingModalProps> = ({ meeting, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('status');

  const formattedDate = new Date(meeting.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 w-full sm:rounded-lg sm:max-w-4xl max-h-[90vh] flex flex-col rounded-t-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Reunión</h3>
              <p className="text-sm text-gray-400 capitalize">{formattedDate}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {activeTab === 'status' && <TeamStatusSection meetingId={meeting.id} />}
          {activeTab === 'topics' && <TopicsSection meetingId={meeting.id} />}
          {activeTab === 'feedback' && <FeedbackSection meeting={meeting} />}
        </div>
      </div>
    </div>
  );
};
