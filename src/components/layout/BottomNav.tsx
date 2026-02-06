import { NavLink } from 'react-router-dom';
import { Home, ListTodo, Users, Calendar, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/tasks', icon: ListTodo, label: 'Tareas' },
  { to: '/team', icon: Users, label: 'Equipo' },
  { to: '/meetings', icon: Calendar, label: 'Reuniones' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
];

export function BottomNav() {
  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-xs transition-colors ${
                isActive ? 'text-blue-400' : 'text-gray-400'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
