import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle } from 'lucide-react';
import { useMeetingsContext } from '../../context/MeetingsContext';
import { BriefingSection } from './components/BriefingSection';
import { FeedbackSection } from './components/FeedbackSection';

const TABS = [
  { key: 'briefing', label: 'Briefing', icon: Users },
  { key: 'feedback', label: 'Feedback', icon: MessageCircle },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export function MeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { meetings } = useMeetingsContext();
  const [activeTab, setActiveTab] = useState<TabKey>('briefing');

  const meeting = meetings.find(m => m.id === meetingId);

  if (!meeting) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 font-medium mb-2">Reunión no encontrada</p>
        <button
          onClick={() => navigate('/meetings')}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Volver a reuniones
        </button>
      </div>
    );
  }

  const formattedDate = new Date(meeting.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/meetings')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Reunión</h1>
            <p className="text-sm text-gray-400 capitalize">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 sm:mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'briefing' && <BriefingSection meetingId={meeting.id} />}
      {activeTab === 'feedback' && <FeedbackSection meeting={meeting} />}
    </>
  );
}
