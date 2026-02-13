import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useLocalStorage } from '../../utils/local-storage';

export function Layout() {
  const [collapsed, setCollapsed] = useLocalStorage(
    'leadkit-sidebar-collapsed',
    false
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <BottomNav />
      <main
        className={`pb-20 sm:pb-0 transition-[margin-left] duration-300 ease-in-out ${
          collapsed ? 'sm:ml-[68px]' : 'sm:ml-60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
