import React from 'react';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { MemberSnapshotCardProps } from '../../../types';

export const MemberSnapshotCard: React.FC<MemberSnapshotCardProps> = ({ snapshot }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">{snapshot.member_name}</h4>
        <span className="text-xs text-gray-400">{snapshot.overall_progress}% general</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all"
          style={{ width: `${snapshot.overall_progress}%` }}
        />
      </div>

      {/* Doing tasks */}
      {snapshot.tasks_doing.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <Loader2 size={12} /> En progreso ({snapshot.tasks_doing.length})
          </p>
          <ul className="space-y-1">
            {snapshot.tasks_doing.map(t => (
              <li key={t.id} className="text-sm flex items-center justify-between">
                <span className="truncate">
                  {t.jira_ref && <span className="text-blue-400 text-xs mr-1">{t.jira_ref}</span>}
                  {t.title}
                </span>
                <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{t.progress}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Blocked tasks */}
      {snapshot.tasks_blocked.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
            <AlertTriangle size={12} /> Bloqueadas ({snapshot.tasks_blocked.length})
          </p>
          <ul className="space-y-1">
            {snapshot.tasks_blocked.map(t => (
              <li key={t.id} className="text-sm border-l-2 border-red-500 pl-2">
                <span className="truncate">{t.title}</span>
                {t.blocked_reason && (
                  <p className="text-xs text-red-300/70 mt-0.5">{t.blocked_reason}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Completed tasks */}
      {snapshot.tasks_completed_since_last.length > 0 && (
        <div>
          <p className="text-xs text-green-400 mb-1 flex items-center gap-1">
            <CheckCircle2 size={12} /> Completadas ({snapshot.tasks_completed_since_last.length})
          </p>
          <ul className="space-y-1">
            {snapshot.tasks_completed_since_last.map(t => (
              <li key={t.id} className="text-sm text-gray-400">
                {t.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {snapshot.tasks_doing.length === 0 &&
        snapshot.tasks_blocked.length === 0 &&
        snapshot.tasks_completed_since_last.length === 0 && (
          <p className="text-xs text-gray-500 italic">Sin tareas registradas</p>
        )}
    </div>
  );
};
