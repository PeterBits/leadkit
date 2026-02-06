import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Task, TeamMember, Priority } from '../../types';

interface TaskModalProps {
  task: Task | null;
  teamMembers: TeamMember[];
  priorities: Priority[];
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onClose: () => void;
}

interface PrioritySelectorProps {
  priorities: Priority[];
  value: string | null;
  onChange: (value: string | null) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ priorities, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sortedPriorities = [...priorities].sort((a, b) => a.level - b.level);
  const selected = priorities.find(p => p.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border rounded-lg px-3 py-2.5 text-base text-left flex items-center justify-between bg-white"
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full bg-${selected.color} flex items-center justify-center`}>
              <span className="text-[10px] font-bold text-white">{selected.level}</span>
            </span>
            <span>Nivel {selected.level}</span>
          </span>
        ) : (
          <span className="text-gray-500">Sin prioridad</span>
        )}
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <button
            type="button"
            onClick={() => { onChange(null); setIsOpen(false); }}
            className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${!value ? 'bg-blue-50' : ''}`}
          >
            <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-[10px] text-gray-400">-</span>
            </span>
            <span>Sin prioridad</span>
          </button>
          {sortedPriorities.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => { onChange(p.id); setIsOpen(false); }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${value === p.id ? 'bg-blue-50' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full bg-${p.color} flex items-center justify-center`}>
                <span className="text-[10px] font-bold text-white">{p.level}</span>
              </span>
              <span>Nivel {p.level}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  teamMembers,
  priorities,
  onSave,
  onClose
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [assigneeId, setAssigneeId] = useState<string | null>(task?.assigneeId || null);
  const [status] = useState(task?.status || 'todo' as Task['status']);
  const [priorityId, setPriorityId] = useState<string | null>(task?.priorityId || null);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title, description, assigneeId, status, priorityId, id: task?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:rounded-lg sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar for mobile */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{task ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 text-base"
                placeholder="Título de la tarea"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 text-base"
                rows={3}
                placeholder="Descripción opcional"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asignado a</label>
                <select
                  value={assigneeId || ''}
                  onChange={e => setAssigneeId(e.target.value || null)}
                  className="w-full border rounded-lg px-3 py-2.5 text-base"
                >
                  <option value="">Sin asignar</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prioridad</label>
                <PrioritySelector
                  priorities={priorities}
                  value={priorityId}
                  onChange={setPriorityId}
                />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 pb-4 sm:pb-0">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-base"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
