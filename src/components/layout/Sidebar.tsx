import { NavLink } from 'react-router-dom';
import {
  Home,
  ListTodo,
  Users,
  Calendar,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import type { SidebarProps } from '../../types/interfaces';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/tasks', icon: ListTodo, label: 'Tareas' },
  { to: '/team', icon: Users, label: 'Equipo' },
  { to: '/meetings', icon: Calendar, label: 'Reuniones' },
  { to: '/settings', icon: Settings, label: 'Configuración' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`hidden sm:flex fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 flex-col z-30 transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-[68px]' : 'w-60'
      }`}
    >
      <div
        className={`py-5 border-b border-gray-800 flex items-center gap-2 ${collapsed ? 'px-2 justify-center' : 'px-5 justify-between'}`}
      >
        <h1 className="text-xl font-bold text-gray-100">{collapsed ? 'LK' : 'LEADKIT'}</h1>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-100 transition-colors"
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>

      <nav className={`flex-1 py-4 space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `group relative flex items-center rounded-lg text-sm font-medium transition-colors ${
                collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`
            }
          >
            <Icon size={20} className="shrink-0" />
            {collapsed ? (
              <span className="pointer-events-none absolute left-full ml-2 rounded-md bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-gray-100 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 whitespace-nowrap z-50">
                {label}
              </span>
            ) : (
              <span className="truncate">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
