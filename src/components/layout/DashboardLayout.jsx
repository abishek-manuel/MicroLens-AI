import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import FloatingActionButton from '../ui/FloatingActionButton';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const mainMargin = isMobile ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-[72px]';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar onMenuToggle={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} isMobile={isMobile} />

      <main
        className={`transition-all duration-300 ease-in-out ${mainMargin} pt-6 pb-12 px-4 lg:px-8`}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <FloatingActionButton />
    </div>
  );
}
