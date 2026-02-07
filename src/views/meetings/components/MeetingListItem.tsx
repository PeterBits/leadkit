import React from 'react';
import { Trash2, MessageSquare, Users, Calendar } from 'lucide-react';
import { MeetingListItemProps } from '../../../types';

export const MeetingListItem: React.FC<MeetingListItemProps> = ({
  meeting,
  topicCount,
  hasSnapshots,
  onOpen,
  onDelete,
}) => {
  const formattedDate = new Date(meeting.date).toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
      onClick={() => onOpen(meeting)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-blue-600/20 rounded-lg flex-shrink-0">
            <Calendar size={18} className="text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm capitalize">{formattedDate}</p>
            {meeting.notes && (
              <p className="text-xs text-gray-400 truncate mt-0.5">{meeting.notes}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {topicCount > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare size={14} /> {topicCount}
              </span>
            )}
            {hasSnapshots && (
              <span className="flex items-center gap-1 text-green-400">
                <Users size={14} />
              </span>
            )}
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(meeting.id);
            }}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
