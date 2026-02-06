import { NavLink } from 'react-router-dom';
import { Home, ListTodo, Users, Calendar, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/tasks', icon: ListTodo, label: 'Tareas' },
  { to: '/team', icon: Users, label: 'Equipo' },
  { to: '/meetings', icon: Calendar, label: 'Reuniones' },
  { to: '/settings', icon: Settings, label: 'Configuración' },
];

export function Sidebar() {
  return (
    <aside className="hidden sm:flex fixed left-0 top-0 h-full w-60 bg-white shadow-sm border-r flex-col z-30">
      <div className="px-5 py-5 border-b">
        <h1 className="text-xl font-bold text-gray-800">LEADKIT</h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
