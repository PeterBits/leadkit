import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { CreateMeetingModalProps } from '../../../types';
import { useMeetingsContext } from '../../../context/MeetingsContext';

function isSameDayStr(timestamp: number, dateStr: string): boolean {
  const d = new Date(timestamp);
  const [y, m, day] = dateStr.split('-').map(Number);
  return d.getFullYear() === y && d.getMonth() === m - 1 && d.getDate() === day;
}

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({ onClose }) => {
  const { saveMeeting, meetings } = useMeetingsContext();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const dateExists = date ? meetings.some(m => isSameDayStr(m.date, date)) : false;

  const handleSubmit = async () => {
    if (!date || dateExists) return;
    await saveMeeting({
      date: new Date(date + 'T00:00:00').getTime(),
      notes,
      leader_feedback: '',
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
            <h3 className="text-lg font-semibold">Nueva Reunión</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-base"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-base"
                rows={3}
                placeholder="Notas previas a la reunión..."
              />
            </div>

            {dateExists && (
              <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-sm text-orange-300">
                <AlertTriangle size={16} className="flex-shrink-0" />
                Ya existe una reunión para esta fecha
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 pb-4 sm:pb-0">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 text-gray-400 hover:bg-gray-700 rounded-lg text-base"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!date || dateExists}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
