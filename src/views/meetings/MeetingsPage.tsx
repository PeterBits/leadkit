import { useState } from 'react';
import { Plus, MessageSquare, Calendar } from 'lucide-react';
import { Meeting } from '../../types';
import { useMeetingsContext } from '../../context/MeetingsContext';
import {
  CreateMeetingModal,
  MeetingListItem,
  MeetingModal,
  PendingTopicsPanel,
} from './components';

export function MeetingsPage() {
  const { meetings, meetingTopics, meetingSnapshots, deleteMeeting, isLoading } =
    useMeetingsContext();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPendingTopics, setShowPendingTopics] = useState(false);

  const sortedMeetings = [...meetings].sort((a, b) => b.date - a.date);
  const pendingTopicsCount = meetingTopics.filter(t => t.meeting_id === null && !t.resolved).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Reuniones</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowPendingTopics(!showPendingTopics)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors flex-1 sm:flex-none justify-center ${
              showPendingTopics
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <MessageSquare size={16} />
            Temas Pendientes
            {pendingTopicsCount > 0 && (
              <span className="bg-purple-500/30 text-purple-300 text-xs px-1.5 py-0.5 rounded-full">
                {pendingTopicsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 sm:flex-none justify-center"
          >
            <Plus size={16} />
            Nueva Reunión
          </button>
        </div>
      </div>

      {/* Pending Topics Panel */}
      {showPendingTopics && <PendingTopicsPanel onClose={() => setShowPendingTopics(false)} />}

      {/* Meeting list */}
      {sortedMeetings.length > 0 ? (
        <div className="space-y-2">
          {sortedMeetings.map(meeting => {
            const topicCount = meetingTopics.filter(
              t => t.meeting_id === meeting.id && !t.resolved,
            ).length;
            const hasSnapshots = meetingSnapshots.some(s => s.meeting_id === meeting.id);
            return (
              <MeetingListItem
                key={meeting.id}
                meeting={meeting}
                topicCount={topicCount}
                hasSnapshots={hasSnapshots}
                onOpen={setSelectedMeeting}
                onDelete={deleteMeeting}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400 font-medium">No hay reuniones</p>
          <p className="text-sm text-gray-500 mt-1">
            Crea tu primera reunión para empezar a hacer seguimiento
          </p>
        </div>
      )}

      {/* Create Meeting Modal */}
      {showCreateModal && <CreateMeetingModal onClose={() => setShowCreateModal(false)} />}

      {/* Meeting Detail Modal */}
      {selectedMeeting && (
        <MeetingModal meeting={selectedMeeting} onClose={() => setSelectedMeeting(null)} />
      )}
    </>
  );
}
