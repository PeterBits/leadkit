import React, { useState } from 'react';
import { Save, MessageCircle, ListChecks, MessageSquare } from 'lucide-react';
import { FeedbackSectionProps } from '../../../types';
import { useMeetingsContext } from '../../../context/MeetingsContext';
import { useTeamTasksContext } from '../../../context/TeamTasksContext';

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ meeting }) => {
  const { saveMeeting, meetingTopics, meetingTaskFeedback } = useMeetingsContext();
  const { teamTasks } = useTeamTasksContext();
  const [feedback, setFeedback] = useState(meeting.leader_feedback);
  const hasChanges = feedback !== meeting.leader_feedback;

  const handleSave = async () => {
    await saveMeeting({
      ...meeting,
      leader_feedback: feedback,
      id: meeting.id,
    });
  };

  // Per-task feedback for this meeting
  const taskResponses = meetingTaskFeedback
    .filter(f => f.meeting_id === meeting.id && f.content.trim())
    .map(f => {
      const task = teamTasks.find(t => t.id === f.team_task_id);
      return { id: f.id, taskTitle: task?.title ?? 'Tarea eliminada', content: f.content };
    });

  // Per-topic leader responses for this meeting
  const topicResponses = meetingTopics
    .filter(t => t.meeting_id === meeting.id && (t.leader_response ?? '').trim())
    .map(t => ({
      id: t.id,
      topicTitle: t.title,
      content: t.leader_response ?? '',
    }));

  const hasResponses = taskResponses.length > 0 || topicResponses.length > 0;

  return (
    <div className="space-y-6">
      {/* General feedback */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <MessageCircle size={16} />
          Feedback general
        </h4>

        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Registra el feedback recibido, decisiones, indicaciones..."
          className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-sm min-h-[160px] resize-y"
          rows={6}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            Guardar feedback
          </button>
        </div>
      </div>

      {/* Response summary */}
      {hasResponses && (
        <>
          <div className="border-t border-gray-800" />
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <ListChecks size={16} />
              Resumen de respuestas
            </h4>

            {taskResponses.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Por tarea</p>
                {taskResponses.map(r => (
                  <div
                    key={r.id}
                    className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <ListChecks size={12} className="text-blue-400" />
                      <span className="text-xs font-medium text-gray-300">{r.taskTitle}</span>
                    </div>
                    <p className="text-sm text-gray-400">{r.content}</p>
                  </div>
                ))}
              </div>
            )}

            {topicResponses.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Por tema</p>
                {topicResponses.map(r => (
                  <div
                    key={r.id}
                    className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <MessageSquare size={12} className="text-purple-400" />
                      <span className="text-xs font-medium text-gray-300">{r.topicTitle}</span>
                    </div>
                    <p className="text-sm text-gray-400">{r.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
