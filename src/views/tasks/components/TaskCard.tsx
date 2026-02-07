import React from 'react';
import { Trash2, Edit2, ArrowRight, ArrowLeft } from 'lucide-react';
import { TaskCardProps } from '../../../types';

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  categories,
  priorities,
  onEdit,
  onDelete,
  onMove,
}) => {
  const category = categories.find(c => c.id === task.category_id);
  const priority = priorities.find(p => p.id === task.priority_id);
  const borderColor = priority ? `border-l-${priority.color}` : 'border-l-gray-300';

  return (
    <div
      className={`bg-gray-900 rounded-lg border border-gray-800 border-l-4 ${borderColor} p-3 mb-2`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-100 text-sm">{task.title}</h4>
        <div className="flex gap-1">
          <button onClick={() => onEdit(task)} className="p-1 hover:bg-gray-700 rounded">
            <Edit2 size={14} className="text-gray-400" />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1 hover:bg-gray-700 rounded">
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>
      {task.description && <p className="text-xs text-gray-400 mb-2">{task.description}</p>}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center flex-wrap">
          {category && (
            <span className="text-xs bg-gray-800 px-2 py-1 rounded flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full bg-${category.color}`} />
              {category.name}
            </span>
          )}
          {priority && (
            <span
              className={`text-xs px-2 py-1 rounded-full bg-${priority.color} text-white font-medium flex items-center gap-1`}
            >
              <span className="text-[10px]">P</span>
              {priority.level}
            </span>
          )}
        </div>
        <div className="flex gap-1">
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
