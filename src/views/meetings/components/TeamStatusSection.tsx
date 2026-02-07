import React from 'react';
import { RefreshCw, Users } from 'lucide-react';
import { TeamStatusSectionProps } from '../../../types';
import { useMeetingsContext } from '../../../context/MeetingsContext';
import { useDataContext } from '../../../context/DataContext';
import { useTeamTasksContext } from '../../../context/TeamTasksContext';
import { generateMeetingSnapshots } from '../../../utils/meeting-snapshots';
import { MemberSnapshotCard } from './MemberSnapshotCard';

export const TeamStatusSection: React.FC<TeamStatusSectionProps> = ({ meetingId }) => {
  const { meetings, meetingSnapshots, saveMeetingSnapshots } = useMeetingsContext();
  const { teamMembers } = useDataContext();
  const { teamTasks, subtasks, timelineEvents } = useTeamTasksContext();

  const snapshots = meetingSnapshots.filter(s => s.meeting_id === meetingId);
  const hasSnapshots = snapshots.length > 0;

  const handleGenerate = async () => {
    const newSnapshots = generateMeetingSnapshots(
      meetingId,
      teamMembers,
      teamTasks,
      subtasks,
      timelineEvents,
      meetings,
    );
    await saveMeetingSnapshots(newSnapshots);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Users size={16} />
          Estado del Equipo
        </h4>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={14} />
          {hasSnapshots ? 'Regenerar' : 'Generar'}
        </button>
      </div>

      {hasSnapshots ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {snapshots.map(snapshot => (
            <MemberSnapshotCard key={snapshot.id} snapshot={snapshot} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Users size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No se ha generado el estado del equipo</p>
          <p className="text-xs mt-1">Haz click en "Generar" para capturar el estado actual</p>
        </div>
      )}
    </div>
  );
};
