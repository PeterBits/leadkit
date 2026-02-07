import { useNavigate } from 'react-router-dom';
import {
  ListTodo,
  Users,
  Calendar,
  ArrowRight,
  Plus,
  AlertTriangle,
  Clock,
  MessageSquare,
} from 'lucide-react';
import {
  usePersonalTasksContext,
  useDataContext,
  useTeamTasksContext,
  useMeetingsContext,
} from '../../context';
import { isTaskBlocked } from '../../utils/team-tasks';

export function DashboardPage() {
  const navigate = useNavigate();
  const { personalTasks } = usePersonalTasksContext();
  const { teamMembers } = useDataContext();
  const { teamTasks, timelineEvents } = useTeamTasksContext();
  const { meetings, meetingTopics } = useMeetingsContext();

  const todoCount = personalTasks.filter(t => t.status === 'todo').length;
  const doingCount = personalTasks.filter(t => t.status === 'doing').length;
  const doneCount = personalTasks.filter(t => t.status === 'done').length;

  // Team status per member
  const memberStats = teamMembers.map(member => {
    const tasks = teamTasks.filter(t => t.assignee_id === member.id);
    const blocked = tasks.filter(t => isTaskBlocked(t.id, timelineEvents)).length;
    return {
      id: member.id,
      name: member.name,
      total: tasks.length,
      doing: tasks.filter(t => t.status === 'doing').length,
      blocked,
    };
  });

  // Next meeting
  const now = Date.now();
  const upcomingMeetings = meetings.filter(m => m.date >= now).sort((a, b) => a.date - b.date);
  const nextMeeting = upcomingMeetings[0] || null;
  const nextMeetingTopics = nextMeeting
    ? meetingTopics.filter(t => t.meeting_id === nextMeeting.id && !t.resolved).length
    : 0;
  const pendingTopicsCount = meetingTopics.filter(t => t.meeting_id === null && !t.resolved).length;

  // Alerts
  const overdueTeamTasks = teamTasks.filter(
    t => t.deadline && t.deadline < now && t.status !== 'done',
  );
  const blockedTeamTasks = teamTasks.filter(t => isTaskBlocked(t.id, timelineEvents));
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const staleDoingTasks = teamTasks.filter(
    t => t.status === 'doing' && t.updated_at < now - sevenDaysMs,
  );
  const totalAlerts = overdueTeamTasks.length + blockedTeamTasks.length + staleDoingTasks.length;

  return (
    <>
      <h1 className="text-xl font-bold text-gray-100 mb-6">Inicio</h1>

      {/* Summary widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Personal tasks */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <ListTodo size={20} className="text-blue-400" />
            <h2 className="font-semibold text-gray-200">Mis Tareas</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Pendientes</span>
              <span className="font-medium">{todoCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">En curso</span>
              <span className="font-medium">{doingCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Completadas</span>
              <span className="font-medium">{doneCount}</span>
            </div>
          </div>
        </div>

        {/* Team status */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <Users size={20} className="text-green-400" />
            <h2 className="font-semibold text-gray-200">Equipo</h2>
          </div>
          {memberStats.length > 0 ? (
            <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
              {memberStats.map(m => (
                <div key={m.id} className="flex items-center justify-between">
                  <span className="text-gray-400 truncate">{m.name}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs">{m.doing} activas</span>
                    {m.blocked > 0 && (
                      <span className="text-xs text-red-400">{m.blocked} bloq.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Sin miembros</p>
          )}
        </div>

        {/* Next meeting */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={20} className="text-purple-400" />
            <h2 className="font-semibold text-gray-200">Próxima Reunión</h2>
          </div>
          {nextMeeting ? (
            <div>
              <p className="text-sm font-medium capitalize">
                {new Date(nextMeeting.date).toLocaleDateString('es-ES', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
              <p className="text-xs text-gray-400 mt-1">{nextMeetingTopics} temas vinculados</p>
              {pendingTopicsCount > 0 && (
                <p className="text-xs text-purple-400 mt-0.5">
                  {pendingTopicsCount} temas pendientes sin vincular
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Sin reuniones programadas</p>
          )}
        </div>

        {/* Alerts */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle
              size={20}
              className={totalAlerts > 0 ? 'text-orange-400' : 'text-gray-600'}
            />
            <h2 className="font-semibold text-gray-200">Alertas</h2>
            {totalAlerts > 0 && (
              <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full">
                {totalAlerts}
              </span>
            )}
          </div>
          {totalAlerts > 0 ? (
            <div className="space-y-2 text-sm">
              {overdueTeamTasks.length > 0 && (
                <div className="flex items-center gap-2 text-red-400">
                  <Clock size={14} />
                  <span>{overdueTeamTasks.length} con retraso</span>
                </div>
              )}
              {blockedTeamTasks.length > 0 && (
                <div className="flex items-center gap-2 text-orange-400">
                  <AlertTriangle size={14} />
                  <span>{blockedTeamTasks.length} bloqueadas</span>
                </div>
              )}
              {staleDoingTasks.length > 0 && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <Clock size={14} />
                  <span>{staleDoingTasks.length} estancadas (&gt;7d)</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Sin alertas</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Plus size={20} className="text-blue-400" />
          <h2 className="font-semibold text-gray-200">Accesos rápidos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center justify-between px-3 py-2.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ListTodo size={16} className="text-blue-400" />
              Crear tarea personal
            </span>
            <ArrowRight size={16} className="text-gray-500" />
          </button>
          <button
            onClick={() => navigate('/team')}
            className="flex items-center justify-between px-3 py-2.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <Users size={16} className="text-green-400" />
              Crear tarea de equipo
            </span>
            <ArrowRight size={16} className="text-gray-500" />
          </button>
          <button
            onClick={() => navigate('/meetings')}
            className="flex items-center justify-between px-3 py-2.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <MessageSquare size={16} className="text-purple-400" />
              Añadir tema pendiente
            </span>
            <ArrowRight size={16} className="text-gray-500" />
          </button>
          <button
            onClick={() => navigate('/meetings')}
            className="flex items-center justify-between px-3 py-2.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-purple-400" />
              Ir a reuniones
            </span>
            <ArrowRight size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </>
  );
}
