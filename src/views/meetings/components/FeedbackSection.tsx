import React, { useState } from 'react';
import { Save, MessageCircle } from 'lucide-react';
import { FeedbackSectionProps } from '../../../types';
import { useMeetingsContext } from '../../../context/MeetingsContext';

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ meeting }) => {
  const { saveMeeting } = useMeetingsContext();
  const [feedback, setFeedback] = useState(meeting.leader_feedback);
  const hasChanges = feedback !== meeting.leader_feedback;

  const handleSave = async () => {
    await saveMeeting({
      ...meeting,
      leader_feedback: feedback,
      id: meeting.id,
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
        <MessageCircle size={16} />
        Feedback del Líder
      </h4>

      <textarea
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        placeholder="Registra el feedback recibido del líder, decisiones, indicaciones..."
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
  );
};
