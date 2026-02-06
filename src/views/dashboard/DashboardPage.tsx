import { useNavigate } from 'react-router-dom';
import { ListTodo, Users, Calendar, ArrowRight } from 'lucide-react';
import { useTasksContext, useDataContext } from '../../context';

export function DashboardPage() {
  const navigate = useNavigate();
  const { tasks } = useTasksContext();
  const { teamMembers } = useDataContext();

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const doingCount = tasks.filter(t => t.status === 'doing').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Inicio</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Tasks summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ListTodo size={20} className="text-blue-600" />
            <h2 className="font-semibold text-gray-700">Tareas</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Pendientes</span>
              <span className="font-medium">{todoCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">En curso</span>
              <span className="font-medium">{doingCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Completadas</span>
              <span className="font-medium">{doneCount}</span>
            </div>
          </div>
        </div>

        {/* Team summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Users size={20} className="text-green-600" />
            <h2 className="font-semibold text-gray-700">Equipo</h2>
          </div>
          <p className="text-2xl font-bold text-gray-800">{teamMembers.length}</p>
          <p className="text-sm text-gray-500">miembros</p>
        </div>

        {/* Quick access */}
        <div className="bg-white rounded-lg p-4 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={20} className="text-purple-600" />
            <h2 className="font-semibold text-gray-700">Accesos rápidos</h2>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/tasks')}
              className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Ir a tareas</span>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
            <button
              onClick={() => navigate('/meetings')}
              className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Ir a reuniones</span>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
