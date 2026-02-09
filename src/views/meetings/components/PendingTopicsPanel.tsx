import React, { useState } from 'react';
import { Plus, X, Trash2, MessageSquare } from 'lucide-react';
import { PendingTopicsPanelProps } from '../../../types';
import { useMeetingsContext } from '../../../context/MeetingsContext';

export const PendingTopicsPanel: React.FC<PendingTopicsPanelProps> = ({ onClose }) => {
  const { meetingTopics, saveMeetingTopic, deleteMeetingTopic } = useMeetingsContext();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const pendingTopics = meetingTopics.filter(t => t.meeting_id === null && !t.resolved);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await saveMeetingTopic({
      meeting_id: null,
      team_task_id: null,
      title: newTitle.trim(),
      description: newDescription.trim(),
      resolved: false,
      resolved_at: null,
      leader_response: '',
    });
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800 mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
          <MessageSquare size={18} />
          Temas Pendientes ({pendingTopics.length})
        </h3>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-700 rounded-lg">
          <X size={18} />
        </button>
      </div>

      {/* Add new floating topic */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Nuevo tema pendiente..."
            className="flex-1 border border-gray-700 rounded-lg px-3 py-2 text-sm"
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={!newTitle.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
          </button>
        </div>
        <input
          type="text"
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          className="border border-gray-700 rounded-lg px-3 py-2 text-sm"
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
      </div>

      {/* Floating topics list */}
      {pendingTopics.length > 0 ? (
        <ul className="space-y-2">
          {pendingTopics.map(topic => (
            <li
              key={topic.id}
              className="flex items-start justify-between bg-gray-800 rounded-lg p-2.5 border border-gray-700"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{topic.title}</p>
                {topic.description && (
                  <p className="text-xs text-gray-400 mt-0.5">{topic.description}</p>
                )}
              </div>
              <button
                onClick={() => deleteMeetingTopic(topic.id)}
                className="p-1 text-gray-500 hover:text-red-400 flex-shrink-0 ml-2"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic text-center py-2">
          No hay temas pendientes sin vincular
        </p>
      )}
    </div>
  );
};
