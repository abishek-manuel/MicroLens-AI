import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  History,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
  Microscope,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onToggle, isMobile }) {
  const sidebarWidth = isOpen ? 'w-64' : 'w-[72px]';
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload', to: '/upload', icon: Upload },
    { label: 'History', to: '/history', icon: History },
    { label: 'Reports', to: '/reports', icon: FileBarChart },
  ];

  // Dynamically add Admin Panel if user has the admin role
  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Panel', to: '/admin', icon: Users });
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] 
          glass border-r border-white/10 dark:border-navy-700/50
          flex flex-col transition-all duration-300 ease-in-out
          ${isMobile ? (isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64') : sidebarWidth}
        `}
      >
        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={isMobile ? onToggle : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
                }
                ${!isOpen && !isMobile ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(isOpen || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse button (desktop only) */}
        {!isMobile && (
          <div className="p-3 border-t border-navy-200 dark:border-navy-700/50">
            <button
              id="sidebar-collapse-btn"
              onClick={onToggle}
              className="flex items-center justify-center w-full p-2 rounded-xl 
                         hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors
                         text-navy-500 dark:text-navy-400"
            >
              {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}
