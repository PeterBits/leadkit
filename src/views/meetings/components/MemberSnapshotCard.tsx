import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, ChevronDown, ChevronRight, Circle } from 'lucide-react';
import { MemberSnapshotCardProps } from '../../../types';
import { TaskFeedbackField } from './TaskFeedbackField';

export const MemberSnapshotCard: React.FC<MemberSnapshotCardProps> = ({ snapshot, meetingId }) => {
  const hasBlocked = snapshot.tasks_blocked.length > 0;
  const [expanded, setExpanded] = useState(hasBlocked || snapshot.tasks_doing.length > 0);

  const hasTasks =
    (snapshot.tasks_todo?.length ?? 0) > 0 ||
    snapshot.tasks_doing.length > 0 ||
    snapshot.tasks_blocked.length > 0 ||
    snapshot.tasks_completed_since_last.length > 0;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Collapsible header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-750 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown size={16} className="text-gray-400" />
          ) : (
            <ChevronRight size={16} className="text-gray-400" />
          )}
          <h4 className="font-semibold text-sm">{snapshot.member_name}</h4>
          {hasBlocked && <AlertTriangle size={14} className="text-red-400" />}
        </div>
        <span className="text-xs text-gray-400">{snapshot.overall_progress}% general</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all"
              style={{ width: `${snapshot.overall_progress}%` }}
            />
          </div>

          {/* Todo tasks */}
          {(snapshot.tasks_todo?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                <Circle size={12} /> Pendientes ({snapshot.tasks_todo.length})
              </p>
              <ul className="space-y-2">
                {snapshot.tasks_todo.map(t => (
                  <li
                    key={t.id}
                    className="bg-gray-900/50 rounded-lg p-2.5 border border-gray-700/50"
                  >
                    <span className="text-sm truncate">
                      {t.jira_ref && (
                        <span className="text-blue-400 text-xs mr-1">{t.jira_ref}</span>
                      )}
                      {t.title}
                    </span>
                    <TaskFeedbackField meetingId={meetingId} teamTaskId={t.id} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Doing tasks */}
          {snapshot.tasks_doing.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                <Loader2 size={12} /> En progreso ({snapshot.tasks_doing.length})
              </p>
              <ul className="space-y-2">
                {snapshot.tasks_doing.map(t => (
                  <li
                    key={t.id}
                    className="bg-gray-900/50 rounded-lg p-2.5 border border-gray-700/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">
                        {t.jira_ref && (
                          <span className="text-blue-400 text-xs mr-1">{t.jira_ref}</span>
                        )}
                        {t.title}
                      </span>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {t.progress}%
                      </span>
                    </div>
                    <TaskFeedbackField meetingId={meetingId} teamTaskId={t.id} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Blocked tasks */}
          {snapshot.tasks_blocked.length > 0 && (
            <div>
              <p className="text-xs text-red-400 mb-1.5 flex items-center gap-1">
                <AlertTriangle size={12} /> Bloqueadas ({snapshot.tasks_blocked.length})
              </p>
              <ul className="space-y-2">
                {snapshot.tasks_blocked.map(t => (
                  <li
                    key={t.id}
                    className="bg-gray-900/50 rounded-lg p-2.5 border border-red-500/30"
                  >
                    <span className="text-sm">{t.title}</span>
                    {t.blocked_reason && (
                      <p className="text-xs text-red-300/70 mt-0.5">{t.blocked_reason}</p>
                    )}
                    <TaskFeedbackField meetingId={meetingId} teamTaskId={t.id} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Completed tasks */}
          {snapshot.tasks_completed_since_last.length > 0 && (
            <div>
              <p className="text-xs text-green-400 mb-1 flex items-center gap-1">
                <CheckCircle2 size={12} /> Completadas ({snapshot.tasks_completed_since_last.length}
                )
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
          {!hasTasks && <p className="text-xs text-gray-500 italic">Sin tareas registradas</p>}
        </div>
      )}
    </div>
  );
};
