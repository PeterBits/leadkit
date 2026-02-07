import React, { useState } from 'react';
import { Trash2, Send } from 'lucide-react';
import { CommentSectionProps } from '../../../types';
import { useTeamTasksContext } from '../../../context';

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days}d`;
  return new Date(timestamp).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, taskId }) => {
  const { saveTaskComment, deleteTaskComment } = useTeamTasksContext();
  const [content, setContent] = useState('');

  const sorted = [...comments].sort((a, b) => b.created_at - a.created_at);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await saveTaskComment({
      team_task_id: taskId,
      content: content.trim(),
    });
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-200 mb-3">
        Comentarios{' '}
        {comments.length > 0 && <span className="text-gray-500">({comments.length})</span>}
      </h4>

      <div className="flex gap-2 mb-4">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-800 resize-none"
          rows={2}
          placeholder="Escribe un comentario..."
        />
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="self-end p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>

      <div className="space-y-2">
        {sorted.map(comment => (
          <div key={comment.id} className="bg-gray-800/50 rounded-lg p-3 group">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs text-gray-500">
                {formatRelativeTime(comment.created_at)}
              </span>
              <button
                onClick={() => deleteTaskComment(comment.id)}
                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded transition-opacity"
              >
                <Trash2 size={12} className="text-red-400" />
              </button>
            </div>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
