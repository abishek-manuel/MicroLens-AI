import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Microscope, User, LogOut, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';

export default function Navbar({ onMenuToggle, isSidebarOpen }) {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const isPublic = ['/', '/login', '/about'].includes(location.pathname);

  // Load notifications (recent activity) when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const loadNotifications = async () => {
      try {
        const activity = await dashboardService.getRecentActivity();
        setNotifications(activity);
        // Count items from the last 24 hours as "unread"
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const recent = activity.filter(
          (a) => !a.time.includes('days')
        );
        setUnreadCount(recent.length);
      } catch {
        // Silently fail — notifications are non-critical
      }
    };
    loadNotifications();
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNotifToggle = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen) {
      // Mark all as read when opening
      setUnreadCount(0);
    }
  };

  return (
    <nav className="sticky top-0 z-30 w-full glass border-b border-white/10 dark:border-navy-700/50">
      <div className={`flex items-center justify-between h-16 px-4 ${isPublic ? 'max-w-7xl mx-auto' : ''}`}>
        {/* Left */}
        <div className="flex items-center gap-3">
          {!isPublic && (
            <button
              id="sidebar-toggle"
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors lg:hidden"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 group-hover:shadow-glow transition-shadow">
              <Microscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              MICRO <span className="gradient-text">LENS</span> AI
            </span>
          </Link>
        </div>

        {/* Center — public nav links */}
        {isPublic && (
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Home', to: '/' },
              { label: 'About', to: '/about' },
              { label: 'Login', to: '/login' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${location.pathname === link.to
                    ? 'text-primary-500 bg-primary-500/10'
                    : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-2">
          {location.pathname !== '/' && <ThemeToggle />}

          {isAuthenticated && (
            <>
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  id="notifications-btn"
                  onClick={handleNotifToggle}
                  className="relative p-2.5 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
                >
                  <Bell className="w-5 h-5 text-navy-600 dark:text-navy-300" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 glass-card !p-0 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-navy-200 dark:border-navy-700 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-navy-900 dark:text-gray-100">Notifications</h4>
                        {notifications.length > 0 && (
                          <span className="flex items-center gap-1 text-xs text-primary-500">
                            <CheckCheck className="w-3.5 h-3.5" />
                            All read
                          </span>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <Bell className="w-8 h-8 text-navy-300 dark:text-navy-600 mx-auto mb-2" />
                            <p className="text-sm text-navy-500 dark:text-navy-400">No notifications yet</p>
                            <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">Upload a sample to get started.</p>
                          </div>
                        ) : (
                          notifications.map((item) => (
                            <div
                              key={item.id}
                              className="px-4 py-3 hover:bg-navy-50 dark:hover:bg-navy-800/50 transition-colors border-b border-navy-100 dark:border-navy-800 last:border-b-0"
                            >
                              <p className="text-sm font-medium text-navy-900 dark:text-gray-100">{item.action}</p>
                              <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">{item.detail}</p>
                              <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">{item.time}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={menuRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-navy-700 dark:text-navy-200">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 glass-card !p-2 z-50"
                    >
                      <div className="px-3 py-2 mb-1">
                        <p className="text-sm font-semibold text-navy-900 dark:text-gray-100">{user?.name}</p>
                        <p className="text-xs text-navy-500 dark:text-navy-400">{user?.email}</p>
                      </div>
                      <hr className="border-navy-200 dark:border-navy-700 my-1" />
                      <button
                        id="logout-btn"
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

