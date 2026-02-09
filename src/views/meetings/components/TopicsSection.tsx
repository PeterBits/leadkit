import React, { useState } from 'react';
import { Plus, Check, Trash2, Link2, MessageSquare } from 'lucide-react';
import { TopicsSectionProps } from '../../../types';
import { useMeetingsContext } from '../../../context/MeetingsContext';

export const TopicsSection: React.FC<TopicsSectionProps> = ({ meetingId }) => {
  const { meetingTopics, saveMeetingTopic, deleteMeetingTopic, resolveMeetingTopic } =
    useMeetingsContext();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showLinkPanel, setShowLinkPanel] = useState(false);

  const linkedTopics = meetingTopics.filter(t => t.meeting_id === meetingId);
  const unresolvedLinked = linkedTopics.filter(t => !t.resolved);
  const resolvedLinked = linkedTopics.filter(t => t.resolved);
  const floatingTopics = meetingTopics.filter(t => t.meeting_id === null && !t.resolved);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await saveMeetingTopic({
      meeting_id: meetingId,
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

  const handleLink = async (topicId: string) => {
    const topic = meetingTopics.find(t => t.id === topicId);
    if (topic) {
      await saveMeetingTopic({ ...topic, meeting_id: meetingId, id: topic.id });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <MessageSquare size={16} />
          Temas ({unresolvedLinked.length} pendientes)
        </h4>
        {floatingTopics.length > 0 && (
          <button
            onClick={() => setShowLinkPanel(!showLinkPanel)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Link2 size={14} />
            Vincular ({floatingTopics.length})
          </button>
        )}
      </div>

      {/* Link floating topics panel */}
      {showLinkPanel && floatingTopics.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Temas pendientes sin reunión:</p>
          <div className="space-y-1">
            {floatingTopics.map(topic => (
              <div key={topic.id} className="flex items-center justify-between py-1.5">
                <span className="text-sm truncate">{topic.title}</span>
                <button
                  onClick={() => handleLink(topic.id)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex-shrink-0 ml-2"
                >
                  Vincular
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new topic form */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Nuevo tema..."
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

      {/* Unresolved topics */}
      {unresolvedLinked.length > 0 ? (
        <ul className="space-y-2">
          {unresolvedLinked.map(topic => (
            <li
              key={topic.id}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{topic.title}</p>
                {topic.description && (
                  <p className="text-xs text-gray-400 mt-1">{topic.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => resolveMeetingTopic(topic.id)}
                  className="p-1.5 text-green-400 hover:bg-green-400/10 rounded"
                  title="Marcar como resuelto"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => deleteMeetingTopic(topic.id)}
                  className="p-1.5 text-red-400 hover:bg-red-400/10 rounded"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic text-center py-4">Sin temas pendientes</p>
      )}

      {/* Resolved topics */}
      {resolvedLinked.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Resueltos ({resolvedLinked.length})</p>
          <ul className="space-y-1">
            {resolvedLinked.map(topic => (
              <li
                key={topic.id}
                className="flex items-center justify-between py-1.5 px-3 bg-gray-800/50 rounded-lg opacity-60"
              >
                <span className="text-sm line-through">{topic.title}</span>
                <button
                  onClick={() => deleteMeetingTopic(topic.id)}
                  className="p-1 text-gray-500 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
