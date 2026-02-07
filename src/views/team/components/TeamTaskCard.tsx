import React from 'react';
import { ArrowRight, ArrowLeft, User, Lock, ExternalLink, Clock } from 'lucide-react';
import { TeamTaskCardProps } from '../../../types';
import { getTaskProgress, isTaskBlocked } from '../../../utils/team-tasks';

export const TeamTaskCard: React.FC<TeamTaskCardProps> = ({
  task,
  subtasks,
  timelineEvents,
  teamMembers,
  priorities,
  onOpen,
  onMove,
}) => {
  const assignee = teamMembers.find(m => m.id === task.assignee_id);
  const priority = priorities.find(p => p.id === task.priority_id);
  const borderColor = priority ? `border-l-${priority.color}` : 'border-l-gray-600';
  const taskSubtasks = subtasks.filter(s => s.team_task_id === task.id);
  const progress = getTaskProgress(task, subtasks);
  const blocked = isTaskBlocked(task.id, timelineEvents);
  const overdue = task.deadline !== null && task.deadline < Date.now() && task.status !== 'done';

  return (
    <div
      className={`bg-gray-900 rounded-lg border ${blocked ? 'border-red-500/60' : overdue ? 'border-orange-500/60' : 'border-gray-800'} border-l-4 ${borderColor} p-3 mb-2 cursor-pointer hover:bg-gray-850 transition-colors`}
      onClick={() => onOpen(task)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-100 text-sm flex-1 mr-2">{task.title}</h4>
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          {overdue && <Clock size={14} className="text-orange-400" />}
          {blocked && <Lock size={14} className="text-red-400" />}
        </div>
      </div>
      {overdue && (
        <p className="text-[10px] text-orange-400 mb-1.5">
          Vencida{' '}
          {new Date(task.deadline!).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
        </p>
      )}

      {/* Progress bar */}
      {(taskSubtasks.length > 0 || task.progress_mode === 'manual') && (
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500">Progreso</span>
            <span className="text-[10px] text-gray-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${blocked ? 'bg-red-500' : progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-1.5 items-center flex-wrap">
          {assignee && (
            <span className="text-xs bg-gray-800 px-2 py-0.5 rounded flex items-center gap-1">
              <User size={10} className="text-gray-400" />
              {assignee.name}
            </span>
          )}
          {priority && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full bg-${priority.color} text-white font-medium`}
            >
              P{priority.level}
            </span>
          )}
          {task.jira_ref && (
            <span className="text-xs bg-blue-900/40 text-blue-300 px-1.5 py-0.5 rounded flex items-center gap-1">
              <ExternalLink size={10} />
              {task.jira_ref}
            </span>
          )}
        </div>
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          {task.status !== 'todo' && (
            <button
              onClick={() => onMove(task.id, task.status === 'doing' ? 'todo' : 'doing')}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <ArrowLeft size={14} className="text-gray-400" />
            </button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() => onMove(task.id, task.status === 'todo' ? 'doing' : 'done')}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <ArrowRight size={14} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
