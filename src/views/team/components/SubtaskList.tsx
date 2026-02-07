import React, { useState } from 'react';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { SubtaskListProps } from '../../../types';
import { useTeamTasksContext } from '../../../context';

export const SubtaskList: React.FC<SubtaskListProps> = ({ subtasks, taskId }) => {
  const { saveSubtask, deleteSubtask, toggleSubtask } = useTeamTasksContext();
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const sorted = [...subtasks].sort((a, b) => a.order - b.order);
  const completed = subtasks.filter(s => s.completed).length;

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await saveSubtask({
      team_task_id: taskId,
      title: newTitle.trim(),
      completed: false,
      order: subtasks.length,
    });
    setNewTitle('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setNewTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-200">
          Subtareas{' '}
          {subtasks.length > 0 && (
            <span className="text-gray-500">
              ({completed}/{subtasks.length})
            </span>
          )}
        </h4>
        <button
          onClick={() => setIsAdding(true)}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <Plus size={14} /> Añadir
        </button>
      </div>

      {subtasks.length > 0 && (
        <div className="mb-3">
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-green-500 transition-all"
              style={{ width: `${subtasks.length > 0 ? (completed / subtasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-1">
        {sorted.map(sub => (
          <div
            key={sub.id}
            className="flex items-center gap-2 group py-1.5 px-2 rounded hover:bg-gray-800/50"
          >
            <button onClick={() => toggleSubtask(sub.id)} className="shrink-0">
              {sub.completed ? (
                <CheckSquare size={16} className="text-green-400" />
              ) : (
                <Square size={16} className="text-gray-500" />
              )}
            </button>
            <span
              className={`flex-1 text-sm ${sub.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}
            >
              {sub.title}
            </span>
            <button
              onClick={() => deleteSubtask(sub.id)}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded transition-opacity"
            >
              <Trash2 size={12} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-gray-700 rounded-lg px-3 py-1.5 text-sm bg-gray-800"
            placeholder="Título de la subtarea"
            autoFocus
          />
          <button
            onClick={handleAdd}
            disabled={!newTitle.trim()}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Añadir
          </button>
        </div>
      )}
    </div>
  );
};
