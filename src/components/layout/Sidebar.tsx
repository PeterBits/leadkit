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
    <aside className="hidden sm:flex fixed left-0 top-0 h-full w-60 bg-gray-900 border-r border-gray-800 flex-col z-30">
      <div className="px-5 py-5 border-b border-gray-800">
        <h1 className="text-xl font-bold text-gray-100">LEADKIT</h1>
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
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
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
