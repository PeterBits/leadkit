import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TeamTask, TeamTaskModalProps } from '../../../types';
import { PrioritySelector } from '../../../components/shared';
import { PROGRESS_MODES } from '../../../constants/team-task';

export const TeamTaskModal: React.FC<TeamTaskModalProps> = ({
  task,
  teamMembers,
  priorities,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [assigneeId, setAssigneeId] = useState(task?.assignee_id || '');
  const [priorityId, setPriorityId] = useState<string | null>(task?.priority_id || null);
  const [jiraRef, setJiraRef] = useState(task?.jira_ref || '');
  const [startDate, setStartDate] = useState(
    task?.start_date ? new Date(task.start_date).toISOString().split('T')[0] : '',
  );
  const [deadline, setDeadline] = useState(
    task?.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
  );
  const [progressMode, setProgressMode] = useState<TeamTask['progress_mode']>(
    task?.progress_mode || 'auto',
  );
  const [status] = useState(task?.status || ('todo' as TeamTask['status']));

  const handleSubmit = () => {
    if (!title.trim() || !assigneeId) return;
    onSave({
      title,
      description,
      assignee_id: assigneeId,
      status,
      priority_id: priorityId,
      jira_ref: jiraRef || null,
      start_date: startDate ? new Date(startDate).getTime() : null,
      deadline: deadline ? new Date(deadline).getTime() : null,
      progress_mode: progressMode,
      manual_progress: task?.manual_progress || 0,
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
        className="bg-gray-900 w-full sm:rounded-lg sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        <div className="px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {task ? 'Editar Tarea de Equipo' : 'Nueva Tarea de Equipo'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
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
                className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-base"
                placeholder="Título de la tarea"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-base"
                rows={3}
                placeholder="Descripción de la tarea"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Asignado a <span className="text-red-400">*</span>
                </label>
                <select
                  value={assigneeId}
                  onChange={e => setAssigneeId(e.target.value)}
                  className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-base"
                >
                  <option value="">Seleccionar miembro</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
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

            <div>
              <label className="block text-sm font-medium mb-1">Referencia JIRA</label>
              <input
                type="text"
                value={jiraRef}
                onChange={e => setJiraRef(e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-base"
                placeholder="Ej: PROJ-123"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Modo de progreso</label>
              <div className="flex gap-2">
                {PROGRESS_MODES.map(mode => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setProgressMode(mode.value)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      progressMode === mode.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
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
                disabled={!title.trim() || !assigneeId}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
