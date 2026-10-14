import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import AnalysisResult from './pages/AnalysisResult';
import History from './pages/History';
import Reports from './pages/Reports';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes — Dashboard Layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analysis/:id" element={<AnalysisResult />} />
          <Route path="/history" element={<History />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
