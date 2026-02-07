import { useState } from 'react';
import { Plus, LayoutGrid, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { TeamTask } from '../../types';
import { useTeamTasksContext, useDataContext } from '../../context';
import { TeamKanbanColumn, TeamTaskModal, TeamTaskDetail } from './components';

type ViewMode = 'unified' | 'by-person';

const KANBAN_TABS = [
  { status: 'todo' as const, label: 'To Do', color: 'bg-gray-500' },
  { status: 'doing' as const, label: 'Doing', color: 'bg-blue-500' },
  { status: 'done' as const, label: 'Done', color: 'bg-green-500' },
];

export function TeamPage() {
  const { teamTasks, subtasks, timelineEvents, saveTeamTask, deleteTeamTask, moveTeamTask } =
    useTeamTasksContext();
  const { teamMembers, priorities } = useDataContext();

  const [viewMode, setViewMode] = useState<ViewMode>('unified');
  const [detailTask, setDetailTask] = useState<TeamTask | null>(null);
  const [modalTask, setModalTask] = useState<TeamTask | null | 'new'>(null);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(() => {
    return new Set(teamMembers.length > 0 ? [teamMembers[0].id] : []);
  });
  const [activeTab, setActiveTab] = useState<TeamTask['status']>('todo');

  const toggleMember = (id: string) => {
    setExpandedMembers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleOpenDetail = (task: TeamTask) => setDetailTask(task);

  const handleEditFromDetail = () => {
    if (detailTask) {
      setModalTask(detailTask);
      setDetailTask(null);
    }
  };

  const handleDeleteFromDetail = async (id: string) => {
    await deleteTeamTask(id);
    setDetailTask(null);
  };

  const handleSave = async (
    data: Omit<TeamTask, 'id' | 'created_at' | 'updated_at'> & { id?: string },
  ) => {
    await saveTeamTask(data);
  };

  const getTabCount = (tasks: TeamTask[], status: TeamTask['status']) =>
    tasks.filter(t => t.status === status).length;

  const renderKanban = (tasks: TeamTask[]) => (
    <>
      {/* Mobile tabs */}
      <div className="sm:hidden flex gap-1 mb-4 bg-gray-800 p-1 rounded-lg">
        {KANBAN_TABS.map(tab => (
          <button
            key={tab.status}
            onClick={() => setActiveTab(tab.status)}
            className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeTab === tab.status ? 'bg-gray-700 shadow' : 'text-gray-400'
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.status ? tab.color + ' text-white' : 'bg-gray-600'}`}
            >
              {getTabCount(tasks, tab.status)}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile single column */}
      <div className="sm:hidden">
        <TeamKanbanColumn
          title={KANBAN_TABS.find(t => t.status === activeTab)!.label}
          status={activeTab}
          tasks={tasks}
          subtasks={subtasks}
          timelineEvents={timelineEvents}
          teamMembers={teamMembers}
          priorities={priorities}
          color={KANBAN_TABS.find(t => t.status === activeTab)!.color}
          onOpen={handleOpenDetail}
          onMove={moveTeamTask}
        />
      </div>

      {/* Desktop columns */}
      <div className="hidden sm:flex gap-4 overflow-x-auto pb-4">
        {KANBAN_TABS.map(tab => (
          <TeamKanbanColumn
            key={tab.status}
            title={tab.label}
            status={tab.status}
            tasks={tasks}
            subtasks={subtasks}
            timelineEvents={timelineEvents}
            teamMembers={teamMembers}
            priorities={priorities}
            color={tab.color}
            onOpen={handleOpenDetail}
            onMove={moveTeamTask}
          />
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-100">Seguimiento del equipo</h1>
          <div className="hidden sm:flex bg-gray-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('unified')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'unified' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'}`}
              title="Vista unificada"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('by-person')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'by-person' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'}`}
              title="Vista por persona"
            >
              <Users size={16} />
            </button>
          </div>
        </div>
        <button
          onClick={() => setModalTask('new')}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
        >
          <Plus size={18} /> Nueva Tarea
        </button>
      </div>

      {/* Mobile view toggle */}
      <div className="sm:hidden flex gap-1 mb-4 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setViewMode('unified')}
          className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
            viewMode === 'unified' ? 'bg-gray-700 shadow text-white' : 'text-gray-400'
          }`}
        >
          <LayoutGrid size={14} /> Unificada
        </button>
        <button
          onClick={() => setViewMode('by-person')}
          className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
            viewMode === 'by-person' ? 'bg-gray-700 shadow text-white' : 'text-gray-400'
          }`}
        >
          <Users size={14} /> Por persona
        </button>
      </div>

      {/* Unified view */}
      {viewMode === 'unified' && renderKanban(teamTasks)}

      {/* By-person view */}
      {viewMode === 'by-person' && (
        <div className="space-y-3">
          {teamMembers.map(member => {
            const memberTasks = teamTasks.filter(t => t.assignee_id === member.id);
            const isExpanded = expandedMembers.has(member.id);

            return (
              <div
                key={member.id}
                className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleMember(member.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                    <span className="font-medium text-gray-200">{member.name}</span>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                      {memberTasks.length} {memberTasks.length === 1 ? 'tarea' : 'tareas'}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {KANBAN_TABS.map(tab => {
                      const count = getTabCount(memberTasks, tab.status);
                      return count > 0 ? (
                        <span
                          key={tab.status}
                          className={`text-[10px] ${tab.color} text-white px-1.5 py-0.5 rounded-full`}
                        >
                          {count}
                        </span>
                      ) : null;
                    })}
                  </div>
                </button>

                {isExpanded && <div className="px-4 pb-4">{renderKanban(memberTasks)}</div>}
              </div>
            );
          })}

          {teamMembers.length === 0 && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
              <Users size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No hay miembros de equipo. Añádelos en Configuración.</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {modalTask && (
        <TeamTaskModal
          task={modalTask === 'new' ? null : modalTask}
          teamMembers={teamMembers}
          priorities={priorities}
          onSave={handleSave}
          onClose={() => setModalTask(null)}
        />
      )}

      {detailTask && (
        <TeamTaskDetail
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onEdit={handleEditFromDetail}
          onDelete={handleDeleteFromDetail}
        />
      )}
    </>
  );
}
