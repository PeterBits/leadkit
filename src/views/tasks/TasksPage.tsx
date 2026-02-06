import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Task } from '../../types';
import { useTasksContext, useDataContext } from '../../context';
import { KanbanColumn, TaskModal } from './components';

export function TasksPage() {
  const { tasks, saveTask, deleteTask, moveTask } = useTasksContext();
  const { teamMembers, priorities } = useDataContext();

  const [modalTask, setModalTask] = useState<Task | null | 'new'>(null);
  const [filter, setFilter] = useState<string>('all');
  const [activeKanbanTab, setActiveKanbanTab] = useState<Task['status']>('todo');

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.assignee_id === filter);

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
          <Users size={20} className="text-gray-500 hidden sm:block" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="flex-1 sm:flex-none border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todos</option>
            {teamMembers.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
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
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${activeKanbanTab === tab.status ? tab.color + ' text-white' : 'bg-gray-300'}`}
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

      {modalTask && (
        <TaskModal
          task={modalTask === 'new' ? null : modalTask}
          teamMembers={teamMembers}
          priorities={priorities}
          onSave={saveTask}
          onClose={() => setModalTask(null)}
        />
      )}
    </>
  );
}
