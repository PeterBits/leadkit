import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PersonalTask, TaskModalProps } from '../../../types';
import { PrioritySelector, CategorySelector } from '../../../components/shared';

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  categories,
  priorities,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [categoryId, setCategoryId] = useState<string | null>(task?.category_id || null);
  const [status] = useState(task?.status || ('todo' as PersonalTask['status']));
  const [priorityId, setPriorityId] = useState<string | null>(task?.priority_id || null);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      title,
      description,
      category_id: categoryId,
      status,
      priority_id: priorityId,
      id: task?.id,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 w-full sm:rounded-lg sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        <div className="px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{task ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titulo</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-base"
                placeholder="Titulo de la tarea"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripcion</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-base"
                rows={3}
                placeholder="Descripcion opcional"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <CategorySelector
                  categories={categories}
                  value={categoryId}
                  onChange={setCategoryId}
                />
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
                className="w-full sm:w-auto px-4 py-2.5 text-gray-400 hover:bg-gray-700 rounded-lg text-base"
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
