import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Tag } from 'lucide-react';
import { PersonalTask } from '../../types';
import { usePersonalTasksContext, useDataContext } from '../../context';
import { KanbanColumn, TaskModal } from './components';

export function TasksPage() {
  const { personalTasks, savePersonalTask, deletePersonalTask, movePersonalTask } =
    usePersonalTasksContext();
  const { categories, priorities } = useDataContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [modalTask, setModalTask] = useState<PersonalTask | null | 'new'>(null);

  useEffect(() => {
    const state = location.state as { openCreateModal?: boolean } | null;
    if (state?.openCreateModal) {
      setModalTask('new');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);
  const [filter, setFilter] = useState<string>('all');
  const [activeKanbanTab, setActiveKanbanTab] = useState<PersonalTask['status']>('todo');

  const filteredTasks =
    filter === 'all' ? personalTasks : personalTasks.filter(t => t.category_id === filter);

  const kanbanTabs = [
    {
      status: 'todo' as const,
      label: 'To Do',
      color: 'bg-gray-500',
      count: filteredTasks.filter(t => t.status === 'todo').length,
    },
    {
      status: 'doing' as const,
      label: 'Doing',
      color: 'bg-blue-500',
      count: filteredTasks.filter(t => t.status === 'doing').length,
    },
    {
      status: 'done' as const,
      label: 'Done',
      color: 'bg-green-500',
      count: filteredTasks.filter(t => t.status === 'done').length,
    },
  ];

  return (
    <>
      {/* Kanban Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <Tag size={20} className="text-gray-400 hidden sm:block" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="flex-1 sm:flex-none border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todas</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
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
      <div className="sm:hidden flex gap-1 mb-4 bg-gray-800 p-1 rounded-lg">
        {kanbanTabs.map(tab => (
          <button
            key={tab.status}
            onClick={() => setActiveKanbanTab(tab.status)}
            className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeKanbanTab === tab.status ? 'bg-gray-700 shadow' : 'text-gray-400'
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${activeKanbanTab === tab.status ? tab.color + ' text-white' : 'bg-gray-600'}`}
            >
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
          categories={categories}
          priorities={priorities}
          color={kanbanTabs.find(t => t.status === activeKanbanTab)!.color}
          onEdit={setModalTask}
          onDelete={deletePersonalTask}
          onMove={movePersonalTask}
        />
      </div>

      {/* Desktop Kanban View - Three Columns */}
      <div className="hidden sm:flex gap-4 overflow-x-auto pb-4">
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={filteredTasks}
          categories={categories}
          priorities={priorities}
          color="bg-gray-500"
          onEdit={setModalTask}
          onDelete={deletePersonalTask}
          onMove={movePersonalTask}
        />
        <KanbanColumn
          title="Doing"
          status="doing"
          tasks={filteredTasks}
          categories={categories}
          priorities={priorities}
          color="bg-blue-500"
          onEdit={setModalTask}
          onDelete={deletePersonalTask}
          onMove={movePersonalTask}
        />
        <KanbanColumn
          title="Done"
          status="done"
          tasks={filteredTasks}
          categories={categories}
          priorities={priorities}
          color="bg-green-500"
          onEdit={setModalTask}
          onDelete={deletePersonalTask}
          onMove={movePersonalTask}
        />
      </div>

      {modalTask && (
        <TaskModal
          task={modalTask === 'new' ? null : modalTask}
          categories={categories}
          priorities={priorities}
          onSave={savePersonalTask}
          onClose={() => setModalTask(null)}
        />
      )}
    </>
  );
}
