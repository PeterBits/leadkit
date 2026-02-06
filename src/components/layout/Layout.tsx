import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <BottomNav />
      <main className="sm:ml-60 pb-20 sm:pb-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
