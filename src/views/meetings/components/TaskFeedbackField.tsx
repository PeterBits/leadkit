import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Save } from 'lucide-react';
import { TaskFeedbackFieldProps } from '../../../types';
import { useMeetingsContext } from '../../../context/MeetingsContext';

export const TaskFeedbackField: React.FC<TaskFeedbackFieldProps> = ({ meetingId, teamTaskId }) => {
  const { meetingTaskFeedback, saveMeetingTaskFeedback } = useMeetingsContext();

  const existing = meetingTaskFeedback.find(
    f => f.meeting_id === meetingId && f.team_task_id === teamTaskId,
  );
  const [value, setValue] = useState(existing?.content ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(existing?.content ?? '');
  }, [existing?.content]);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 80) + 'px';
  }, []);

  useEffect(autoResize, [value, autoResize]);

  const hasChanges = value.trim() !== (existing?.content ?? '');

  const handleSave = async () => {
    if (!hasChanges) return;
    await saveMeetingTaskFeedback({
      ...(existing ? { id: existing.id } : {}),
      meeting_id: meetingId,
      team_task_id: teamTaskId,
      content: value.trim(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="mt-1.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <MessageCircle size={11} className="text-purple-400" />
          <span className="text-[10px] text-purple-400">Comentarios</span>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 transition-colors"
            title="Guardar (Ctrl+Enter)"
          >
            <Save size={10} />
            Guardar
          </button>
        )}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Sin comentarios..."
        rows={1}
        className="w-full border border-gray-600 rounded px-2 py-1 text-xs bg-gray-800/50 resize-none overflow-y-auto max-h-[80px] focus:border-purple-500 focus:outline-none transition-colors"
      />
    </div>
  );
};
