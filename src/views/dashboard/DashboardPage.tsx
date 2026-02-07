import { useNavigate } from 'react-router-dom';
import { ListTodo, Users, Calendar, ArrowRight } from 'lucide-react';
import { usePersonalTasksContext, useDataContext } from '../../context';

export function DashboardPage() {
  const navigate = useNavigate();
  const { personalTasks } = usePersonalTasksContext();
  const { teamMembers } = useDataContext();

  const todoCount = personalTasks.filter(t => t.status === 'todo').length;
  const doingCount = personalTasks.filter(t => t.status === 'doing').length;
  const doneCount = personalTasks.filter(t => t.status === 'done').length;

  return (
    <>
      <h1 className="text-xl font-bold text-gray-100 mb-6">Inicio</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Tasks summary */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <ListTodo size={20} className="text-blue-400" />
            <h2 className="font-semibold text-gray-200">Tareas</h2>
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

        {/* Team summary */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <Users size={20} className="text-green-400" />
            <h2 className="font-semibold text-gray-200">Equipo</h2>
          </div>
          <p className="text-2xl font-bold text-gray-100">{teamMembers.length}</p>
          <p className="text-sm text-gray-400">miembros</p>
        </div>

        {/* Quick access */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={20} className="text-purple-400" />
            <h2 className="font-semibold text-gray-200">Accesos rapidos</h2>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/tasks')}
              className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span>Ir a tareas</span>
              <ArrowRight size={16} className="text-gray-500" />
            </button>
            <button
              onClick={() => navigate('/meetings')}
              className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span>Ir a reuniones</span>
              <ArrowRight size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
