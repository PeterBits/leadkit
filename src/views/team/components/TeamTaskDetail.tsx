import { Calendar, Clock, Edit2, ExternalLink, Trash2, User, X } from 'lucide-react';
import React from 'react';
import { useDataContext, useTeamTasksContext } from '../../../context';
import { TeamTaskDetailProps } from '../../../types';
import { getTaskProgress, isTaskBlocked } from '../../../utils/team-tasks';
import { CommentSection } from './CommentSection';
import { SubtaskList } from './SubtaskList';
import { TaskTimeline } from './TaskTimeline';

function formatDate(timestamp: number | null): string {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const TeamTaskDetail: React.FC<TeamTaskDetailProps> = ({
  task,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { subtasks, taskComments, timelineEvents } = useTeamTasksContext();
  const { teamMembers, priorities } = useDataContext();

  const taskSubtasks = subtasks.filter(s => s.team_task_id === task.id);
  const taskCommentsList = taskComments.filter(c => c.team_task_id === task.id);
  const taskEvents = timelineEvents.filter(e => e.team_task_id === task.id);
  const assignee = teamMembers.find(m => m.id === task.assignee_id);
  const priority = priorities.find(p => p.id === task.priority_id);
  const progress = getTaskProgress(task, subtasks);
  const blocked = isTaskBlocked(task.id, timelineEvents);

  const statusLabels: Record<string, string> = {
    todo: 'To Do',
    doing: 'Doing',
    done: 'Done',
  };
  const statusColors: Record<string, string> = {
    todo: 'bg-gray-500',
    doing: 'bg-blue-500',
    done: 'bg-green-500',
  };

  const handleDelete = () => {
    if (window.confirm('¿Eliminar esta tarea y todos sus datos asociados?')) {
      onDelete(task.id);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 w-full sm:rounded-lg sm:max-w-2xl max-h-[95vh] sm:max-h-[85vh] flex flex-col rounded-t-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-800 shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-100">{task.title}</h3>
                {blocked && (
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                    Bloqueado
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full text-white ${statusColors[task.status]}`}
                >
                  {statusLabels[task.status]}
                </span>
                {task.jira_ref && (
                  <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded flex items-center gap-1">
                    <ExternalLink size={10} />
                    {task.jira_ref}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={onEdit} className="p-2 hover:bg-gray-700 rounded-lg" title="Editar">
                <Edit2 size={16} className="text-gray-400" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-gray-700 rounded-lg"
                title="Eliminar"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 space-y-6">
          {/* Info section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Asignado</p>
                <p className="text-sm text-gray-300">{assignee?.name || '—'}</p>
              </div>
            </div>
            {priority && (
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full bg-${priority.color} flex items-center justify-center shrink-0`}
                >
                  <span className="text-[10px] font-bold text-white">{priority.level}</span>
                </span>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Prioridad</p>
                  <p className="text-sm text-gray-300">Nivel {priority.level}</p>
                </div>
              </div>
            )}
            {task.start_date && (
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Inicio</p>
                  <p className="text-sm text-gray-300">{formatDate(task.start_date)}</p>
                </div>
              </div>
            )}
            {task.deadline && (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Deadline</p>
                  <p className="text-sm text-gray-300">{formatDate(task.deadline)}</p>
                </div>
              </div>
            )}
          </div>

          {task.description && (
            <p className="text-sm text-gray-400 whitespace-pre-wrap">{task.description}</p>
          )}

          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">
                Progreso ({task.progress_mode === 'auto' ? 'automático' : 'manual'})
              </span>
              <span className="text-xs text-gray-300 font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${blocked ? 'bg-red-500' : progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Dividers with sections */}
          <div className="border-t border-gray-800 pt-4">
            <SubtaskList subtasks={taskSubtasks} taskId={task.id} />
          </div>

          <div className="border-t border-gray-800 pt-4">
            <CommentSection comments={taskCommentsList} taskId={task.id} />
          </div>

          <div className="border-t border-gray-800 pt-4 pb-4">
            <TaskTimeline events={taskEvents} taskId={task.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
