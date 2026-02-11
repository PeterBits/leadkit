import React from 'react';
import { AlertTriangle, Clock, CircleDot, CheckSquare, Square, ExternalLink } from 'lucide-react';
import { TasksSectionProps, TeamTask } from '../../../types';
import { useTeamTasksContext } from '../../../context/TeamTasksContext';
import { useDataContext } from '../../../context/DataContext';
import { getTaskProgress, isTaskBlocked } from '../../../utils/team-tasks';
import { TaskFeedbackField } from './TaskFeedbackField';

export const TasksSection: React.FC<TasksSectionProps> = ({ meetingId }) => {
  const { teamTasks, subtasks, timelineEvents } = useTeamTasksContext();
  const { teamMembers } = useDataContext();

  const memberMap = new Map(teamMembers.map(m => [m.id, m.name]));

  const activeTasks = teamTasks.filter(t => t.status === 'todo' || t.status === 'doing');

  const blocked: TeamTask[] = [];
  const doing: TeamTask[] = [];
  const todo: TeamTask[] = [];

  for (const task of activeTasks) {
    if (isTaskBlocked(task.id, timelineEvents)) {
      blocked.push(task);
    } else if (task.status === 'doing') {
      doing.push(task);
    } else {
      todo.push(task);
    }
  }

  const getBlockReason = (taskId: string): string | null => {
    const event = timelineEvents
      .filter(e => e.team_task_id === taskId && e.type === 'blocked')
      .sort((a, b) => b.created_at - a.created_at)[0];
    return event?.description ?? null;
  };

  const sections = [
    { key: 'blocked', label: 'Bloqueadas', tasks: blocked, icon: AlertTriangle, color: 'text-red-400' },
    { key: 'doing', label: 'En progreso', tasks: doing, icon: Clock, color: 'text-yellow-400' },
    { key: 'todo', label: 'Pendientes', tasks: todo, icon: CircleDot, color: 'text-blue-400' },
  ];

  if (activeTasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <CircleDot size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No hay tareas activas del equipo</p>
        <p className="text-xs mt-1">Las tareas en &quot;To Do&quot; y &quot;Doing&quot; aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map(section => {
        if (section.tasks.length === 0) return null;
        return (
          <div key={section.key}>
            <h3 className={`text-sm font-medium flex items-center gap-2 mb-3 ${section.color}`}>
              <section.icon size={16} />
              {section.label} ({section.tasks.length})
            </h3>
            <div className="space-y-3">
              {section.tasks.map(task => {
                const progress = getTaskProgress(task, subtasks);
                const assigneeName = memberMap.get(task.assignee_id) ?? 'Sin asignar';
                const taskSubtasks = subtasks
                  .filter(s => s.team_task_id === task.id)
                  .sort((a, b) => a.order - b.order);
                const blockReason = section.key === 'blocked' ? getBlockReason(task.id) : null;

                return (
                  <div
                    key={task.id}
                    className={`bg-gray-900 rounded-lg p-4 border ${
                      section.key === 'blocked' ? 'border-red-500/30' : 'border-gray-700'
                    }`}
                  >
                    {/* Header: title + assignee + progress */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-gray-400">{assigneeName}</span>
                          {task.jira_ref && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                              <ExternalLink size={9} />
                              {task.jira_ref}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-300 flex-shrink-0">
                        {progress}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          section.key === 'blocked'
                            ? 'bg-red-400'
                            : progress === 100
                              ? 'bg-green-400'
                              : 'bg-blue-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Block reason */}
                    {blockReason && (
                      <p className="mt-2 text-xs text-red-300 bg-red-500/10 rounded px-2 py-1">
                        {blockReason}
                      </p>
                    )}

                    {/* Subtasks checklist */}
                    {taskSubtasks.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {taskSubtasks.map(st => (
                          <div key={st.id} className="flex items-center gap-1.5 text-xs">
                            {st.completed ? (
                              <CheckSquare size={12} className="text-green-400 flex-shrink-0" />
                            ) : (
                              <Square size={12} className="text-gray-500 flex-shrink-0" />
                            )}
                            <span className={st.completed ? 'text-gray-500 line-through' : 'text-gray-300'}>
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Feedback field */}
                    <TaskFeedbackField meetingId={meetingId} teamTaskId={task.id} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
