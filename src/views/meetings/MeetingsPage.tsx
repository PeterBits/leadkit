import { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { SummaryItem } from '../../types';
import { CATEGORIES } from '../../constants';
import { dbOperation } from '../../services/database';
import { getWeekNumber, getWeekDates, formatDate } from '../../utils/dates';
import { generateId } from '../../utils/ids';
import { SummaryItemCard } from './components';

export function MeetingsPage() {
  const [summaries, setSummaries] = useState<SummaryItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState(getWeekNumber(new Date()));
  const [summaryTitle, setSummaryTitle] = useState('');
  const [summaryDescription, setSummaryDescription] = useState('');
  const [summaryCategory, setSummaryCategory] = useState<SummaryItem['category']>('discussion');

  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await dbOperation<SummaryItem[]>('summaries', 'readonly', store =>
          store.getAll(),
        );
        setSummaries(loaded || []);
      } catch {
        console.log('MeetingsPage: DB init');
      }
    };
    load();
  }, []);

  const addSummary = async () => {
    if (!summaryTitle.trim()) return;
    const item: SummaryItem = {
      id: generateId(),
      week_number: currentWeek.week,
      year: currentWeek.year,
      title: summaryTitle,
      description: summaryDescription,
      category: summaryCategory,
      created_at: Date.now(),
    };
    await dbOperation('summaries', 'readwrite', store => store.put(item));
    setSummaries(prev => [...prev, item]);
    setSummaryTitle('');
    setSummaryDescription('');
  };

  const deleteSummary = async (id: string) => {
    await dbOperation('summaries', 'readwrite', store => store.delete(id));
    setSummaries(prev => prev.filter(s => s.id !== id));
  };

  const weekDates = getWeekDates(currentWeek.week, currentWeek.year);
  const weekSummaries = summaries.filter(
    s => s.week_number === currentWeek.week && s.year === currentWeek.year,
  );

  return (
    <>
      {/* Weekly Summary Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6 bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800">
        <button
          onClick={() =>
            setCurrentWeek(prev => {
              const d = new Date(prev.year, 0, 1 + (prev.week - 2) * 7);
              return getWeekNumber(d);
            })
          }
          className="p-2 hover:bg-gray-700 rounded-lg"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-base sm:text-lg font-semibold">
            Semana {currentWeek.week}, {currentWeek.year}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            {formatDate(weekDates.start)} - {formatDate(weekDates.end)}
          </p>
        </div>
        <button
          onClick={() =>
            setCurrentWeek(prev => {
              const d = new Date(prev.year, 0, 1 + prev.week * 7);
              return getWeekNumber(d);
            })
          }
          className="p-2 hover:bg-gray-700 rounded-lg"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Add Summary Form */}
      <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800 mb-4 sm:mb-6">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={summaryCategory}
              onChange={e => setSummaryCategory(e.target.value as SummaryItem['category'])}
              className="border border-gray-700 rounded-lg px-3 py-2 text-sm sm:w-40"
            >
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={summaryTitle}
              onChange={e => setSummaryTitle(e.target.value)}
              placeholder="Título"
              className="flex-1 border border-gray-700 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={summaryDescription}
              onChange={e => setSummaryDescription(e.target.value)}
              placeholder="Descripción (opcional)"
              className="flex-1 border border-gray-700 rounded-lg px-3 py-2 text-sm"
              onKeyDown={e => e.key === 'Enter' && addSummary()}
            />
            <button
              onClick={addSummary}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const items = weekSummaries.filter(s => s.category === key);
          return (
            <div key={key} className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                <cat.icon size={18} /> {cat.label} ({items.length})
              </h3>
              {items.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Sin elementos</p>
              ) : (
                items.map(item => (
                  <SummaryItemCard key={item.id} item={item} onDelete={deleteSummary} />
                ))
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
