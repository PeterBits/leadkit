import { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Users, ListTodo, Calendar, Settings, Menu, X } from 'lucide-react';
import { Task, SummaryItem, View, TeamMember, Priority } from './types';
import { CATEGORIES } from './constants';
import { dbOperation } from './services/database';
import { getWeekNumber, getWeekDates, formatDate } from './utils/dates';
import { generateId } from './utils/ids';
import { KanbanColumn, TaskModal } from './components/kanban';
import { SummaryItemCard } from './components/weekly-summary';
import { SettingsPanel } from './components/settings';

export default function App() {
  const [view, setView] = useState<View>('kanban');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summaries, setSummaries] = useState<SummaryItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [modalTask, setModalTask] = useState<Task | null | 'new'>(null);
  const [filter, setFilter] = useState<string>('all');
  const [currentWeek, setCurrentWeek] = useState(getWeekNumber(new Date()));
  const [summaryTitle, setSummaryTitle] = useState('');
  const [summaryDescription, setSummaryDescription] = useState('');
  const [summaryCategory, setSummaryCategory] = useState<SummaryItem['category']>('discussion');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeKanbanTab, setActiveKanbanTab] = useState<Task['status']>('todo');

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedTasks = await dbOperation<Task[]>('tasks', 'readonly', store => store.getAll());
        const loadedSummaries = await dbOperation<SummaryItem[]>('summaries', 'readonly', store => store.getAll());
        const loadedMembers = await dbOperation<TeamMember[]>('teamMembers', 'readonly', store => store.getAll());
        const loadedPriorities = await dbOperation<Priority[]>('priorities', 'readonly', store => store.getAll());
        setTasks(loadedTasks || []);
        setSummaries(loadedSummaries || []);
        setTeamMembers(loadedMembers || []);
        setPriorities(loadedPriorities || []);
      } catch (e) {
        console.log('DB init');
      }
    };
    loadData();
  }, []);

  const saveTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = Date.now();
    const task: Task = taskData.id
      ? { ...tasks.find(t => t.id === taskData.id)!, ...taskData, updatedAt: now }
      : { ...taskData, id: generateId(), createdAt: now, updatedAt: now } as Task;
    await dbOperation('tasks', 'readwrite', store => store.put(task));
    setTasks(prev => taskData.id ? prev.map(t => t.id === task.id ? task : t) : [...prev, task]);
  };

  const deleteTask = async (id: string) => {
    await dbOperation('tasks', 'readwrite', store => store.delete(id));
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = async (id: string, status: Task['status']) => {
    const task = tasks.find(t => t.id === id);
    if (task) await saveTask({ ...task, status });
  };

  const addSummary = async () => {
    if (!summaryTitle.trim()) return;
    const item: SummaryItem = {
      id: generateId(),
      weekNumber: currentWeek.week,
      year: currentWeek.year,
      title: summaryTitle,
      description: summaryDescription,
      category: summaryCategory,
      createdAt: Date.now()
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

  const saveTeamMember = async (member: TeamMember) => {
    await dbOperation('teamMembers', 'readwrite', store => store.put(member));
    setTeamMembers(prev => [...prev, member]);
  };

  const deleteTeamMember = async (id: string) => {
    await dbOperation('teamMembers', 'readwrite', store => store.delete(id));
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const savePriority = async (priority: Priority) => {
    await dbOperation('priorities', 'readwrite', store => store.put(priority));
    setPriorities(prev => [...prev, priority]);
  };

  const deletePriority = async (id: string) => {
    await dbOperation('priorities', 'readwrite', store => store.delete(id));
    setPriorities(prev => prev.filter(p => p.id !== id));
  };

  const weekDates = getWeekDates(currentWeek.week, currentWeek.year);
  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.assigneeId === filter);
  const weekSummaries = summaries.filter(s => s.weekNumber === currentWeek.week && s.year === currentWeek.year);

  const kanbanTabs = [
    { status: 'todo' as const, label: 'To Do', color: 'bg-gray-500', count: filteredTasks.filter(t => t.status === 'todo').length },
    { status: 'doing' as const, label: 'Doing', color: 'bg-blue-500', count: filteredTasks.filter(t => t.status === 'doing').length },
    { status: 'done' as const, label: 'Done', color: 'bg-green-500', count: filteredTasks.filter(t => t.status === 'done').length },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Team Manager</h1>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-2">
              <nav className="flex gap-2">
                <button
                  onClick={() => setView('kanban')}
                  className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-sm sm:text-base ${view === 'kanban' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <ListTodo size={18} /> <span className="hidden md:inline">Kanban</span>
                </button>
                <button
                  onClick={() => setView('weekly')}
                  className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-sm sm:text-base ${view === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <Calendar size={18} /> <span className="hidden md:inline">Semanal</span>
                </button>
              </nav>
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Configuración"
              >
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Settings size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="sm:hidden flex gap-2 mt-3 pt-3 border-t">
              <button
                onClick={() => { setView('kanban'); setMobileMenuOpen(false); }}
                className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${view === 'kanban' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                <ListTodo size={18} /> Kanban
              </button>
              <button
                onClick={() => { setView('weekly'); setMobileMenuOpen(false); }}
                className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${view === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                <Calendar size={18} /> Semanal
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {view === 'kanban' ? (
          <>
            {/* Kanban Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-gray-500 hidden sm:block" />
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="flex-1 sm:flex-none border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">Todos</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setModalTask('new')}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
              >
                <Plus size={18} /> Nueva Tarea
              </button>
            </div>

            {/* Mobile Kanban Tabs */}
            <div className="sm:hidden flex gap-1 mb-4 bg-gray-200 p-1 rounded-lg">
              {kanbanTabs.map(tab => (
                <button
                  key={tab.status}
                  onClick={() => setActiveKanbanTab(tab.status)}
                  className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                    activeKanbanTab === tab.status ? 'bg-white shadow' : 'text-gray-600'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeKanbanTab === tab.status ? tab.color + ' text-white' : 'bg-gray-300'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile Kanban View - Single Column */}
            <div className="sm:hidden">
              <KanbanColumn
                title={kanbanTabs.find(t => t.status === activeKanbanTab)!.label}
                status={activeKanbanTab}
                tasks={filteredTasks}
                teamMembers={teamMembers}
                priorities={priorities}
                color={kanbanTabs.find(t => t.status === activeKanbanTab)!.color}
                onEdit={setModalTask}
                onDelete={deleteTask}
                onMove={moveTask}
              />
            </div>

            {/* Desktop Kanban View - Three Columns */}
            <div className="hidden sm:flex gap-4 overflow-x-auto pb-4">
              <KanbanColumn
                title="To Do"
                status="todo"
                tasks={filteredTasks}
                teamMembers={teamMembers}
                priorities={priorities}
                color="bg-gray-500"
                onEdit={setModalTask}
                onDelete={deleteTask}
                onMove={moveTask}
              />
              <KanbanColumn
                title="Doing"
                status="doing"
                tasks={filteredTasks}
                teamMembers={teamMembers}
                priorities={priorities}
                color="bg-blue-500"
                onEdit={setModalTask}
                onDelete={deleteTask}
                onMove={moveTask}
              />
              <KanbanColumn
                title="Done"
                status="done"
                tasks={filteredTasks}
                teamMembers={teamMembers}
                priorities={priorities}
                color="bg-green-500"
                onEdit={setModalTask}
                onDelete={deleteTask}
                onMove={moveTask}
              />
            </div>
          </>
        ) : (
          <>
            {/* Weekly Summary Header */}
            <div className="flex justify-between items-center mb-4 sm:mb-6 bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <button
                onClick={() => setCurrentWeek(prev => {
                  const d = new Date(prev.year, 0, 1 + (prev.week - 2) * 7);
                  return getWeekNumber(d);
                })}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <div className="text-center">
                <h2 className="text-base sm:text-lg font-semibold">Semana {currentWeek.week}, {currentWeek.year}</h2>
                <p className="text-xs sm:text-sm text-gray-500">{formatDate(weekDates.start)} - {formatDate(weekDates.end)}</p>
              </div>
              <button
                onClick={() => setCurrentWeek(prev => {
                  const d = new Date(prev.year, 0, 1 + prev.week * 7);
                  return getWeekNumber(d);
                })}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Add Summary Form */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm mb-4 sm:mb-6">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={summaryCategory}
                    onChange={e => setSummaryCategory(e.target.value as SummaryItem['category'])}
                    className="border rounded-lg px-3 py-2 text-sm sm:w-40"
                  >
                    {Object.entries(CATEGORIES).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={summaryTitle}
                    onChange={e => setSummaryTitle(e.target.value)}
                    placeholder="Título"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={summaryDescription}
                    onChange={e => setSummaryDescription(e.target.value)}
                    placeholder="Descripción (opcional)"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
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
                  <div key={key} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <cat.icon size={18} /> {cat.label} ({items.length})
                    </h3>
                    {items.length === 0 ? (
                      <p className="text-gray-400 text-sm italic">Sin elementos</p>
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
        )}
      </main>

      {modalTask && (
        <TaskModal
          task={modalTask === 'new' ? null : modalTask}
          teamMembers={teamMembers}
          priorities={priorities}
          onSave={saveTask}
          onClose={() => setModalTask(null)}
        />
      )}

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        teamMembers={teamMembers}
        priorities={priorities}
        onSaveTeamMember={saveTeamMember}
        onDeleteTeamMember={deleteTeamMember}
        onSavePriority={savePriority}
        onDeletePriority={deletePriority}
      />
    </div>
  );
}
