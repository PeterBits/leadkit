import React from 'react';
import { Task, TeamMember, Priority } from '../../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  teamMembers: TeamMember[];
  priorities: Priority[];
  color: string;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: Task['status']) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  teamMembers,
  priorities,
  color,
  onEdit,
  onDelete,
  onMove
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
      <div className="bg-gray-50 rounded-b-lg p-3 min-h-[400px]">
        {filtered.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            teamMembers={teamMembers}
            priorities={priorities}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  );
};
