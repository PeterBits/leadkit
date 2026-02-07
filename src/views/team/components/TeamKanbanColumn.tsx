import React from 'react';
import { TeamKanbanColumnProps } from '../../../types';
import { TeamTaskCard } from './TeamTaskCard';

export const TeamKanbanColumn: React.FC<TeamKanbanColumnProps> = ({
  title,
  status,
  tasks,
  subtasks,
  timelineEvents,
  teamMembers,
  priorities,
  color,
  onOpen,
  onMove,
}) => {
  const filtered = tasks.filter(t => t.status === status);

  return (
    <div className="flex-1 min-w-[280px]">
      <div className={`${color} rounded-t-lg px-4 py-2 flex justify-between items-center`}>
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="bg-white/30 text-white text-sm px-2 py-0.5 rounded-full">
          {filtered.length}
        </span>
      </div>
      <div className="bg-gray-800/50 rounded-b-lg p-3 min-h-[400px]">
        {filtered.map(task => (
          <TeamTaskCard
            key={task.id}
            task={task}
            subtasks={subtasks}
            timelineEvents={timelineEvents}
            teamMembers={teamMembers}
            priorities={priorities}
            onOpen={onOpen}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  );
};
