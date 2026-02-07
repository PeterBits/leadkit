import React, { useState } from 'react';
import { Play, Lock, Unlock, CheckCircle2, ArrowRightLeft, Flag, Plus } from 'lucide-react';
import { TaskTimelineProps, TimelineEventType } from '../../../types';
import { useTeamTasksContext } from '../../../context';

const EVENT_CONFIG: Record<
  TimelineEventType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  started: {
    icon: <Play size={14} />,
    color: 'text-green-400',
    label: 'Iniciado',
  },
  blocked: {
    icon: <Lock size={14} />,
    color: 'text-red-400',
    label: 'Bloqueado',
  },
  unblocked: {
    icon: <Unlock size={14} />,
    color: 'text-green-400',
    label: 'Desbloqueado',
  },
  subtask_completed: {
    icon: <CheckCircle2 size={14} />,
    color: 'text-blue-400',
    label: 'Subtarea completada',
  },
  status_change: {
    icon: <ArrowRightLeft size={14} />,
    color: 'text-blue-400',
    label: 'Cambio de estado',
  },
  completed: {
    icon: <Flag size={14} />,
    color: 'text-green-400',
    label: 'Completado',
  },
};

function formatEventTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const TaskTimeline: React.FC<TaskTimelineProps> = ({ events, taskId }) => {
  const { addTimelineEvent } = useTeamTasksContext();
  const [isAdding, setIsAdding] = useState(false);
  const [eventType, setEventType] = useState<'blocked' | 'unblocked'>('blocked');
  const [reason, setReason] = useState('');

  const sorted = [...events].sort((a, b) => b.created_at - a.created_at);

  const handleAddEvent = async () => {
    await addTimelineEvent(taskId, eventType, reason.trim() || null);
    setReason('');
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-200">
          Timeline {events.length > 0 && <span className="text-gray-500">({events.length})</span>}
        </h4>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <Plus size={14} /> Evento
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-800/50 rounded-lg p-3 mb-4 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEventType('blocked')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                eventType === 'blocked'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Bloquear
            </button>
            <button
              type="button"
              onClick={() => setEventType('unblocked')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                eventType === 'unblocked'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Desbloquear
            </button>
          </div>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full border border-gray-700 rounded-lg px-3 py-1.5 text-sm bg-gray-800"
            placeholder="Motivo (opcional)"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-gray-400 hover:bg-gray-700 rounded-lg text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddEvent}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Añadir
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">Sin eventos aún</p>
      ) : (
        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-700" />
          <div className="space-y-3">
            {sorted.map(event => {
              const config = EVENT_CONFIG[event.type];
              return (
                <div key={event.id} className="flex gap-3 relative">
                  <div
                    className={`shrink-0 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center ${config.color} z-10`}
                  >
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                      <span className="text-[10px] text-gray-600">
                        {formatEventTime(event.created_at)}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{event.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
