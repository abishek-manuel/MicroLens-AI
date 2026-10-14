import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { login, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect once user is fully loaded from AuthContext (role fetched from Firestore)
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [loading, isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isForgotPassword) {
      if (!email) {
        toast.error('Please enter your email address to reset password');
        return;
      }
      setSubmitting(true);
      try {
        await authService.resetPassword(email);
        toast.success('Password reset email sent! Please check your inbox.');
        setIsForgotPassword(false);
      } catch (err) {
        console.error(err);
        toast.error(err.message || 'Failed to send reset email. Please try again.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!email || !password || (!isLogin && !name)) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Welcome back!');
        // Navigation is handled by the useEffect above once auth state is resolved
      } else {
        await authService.register(name, email, password);
        toast.success('Account created successfully!');
        // Navigation is handled by the useEffect above once auth state is resolved
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-primary-50 to-cyan-50 dark:bg-hero-pattern dark:from-transparent dark:via-transparent dark:to-transparent relative overflow-hidden p-4">
      {/* Background effects */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card !bg-white/80 dark:!bg-navy-900/60 !p-8 md:!p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 group-hover:shadow-glow transition-shadow">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-navy-900 dark:text-white tracking-tight">
                MICRO <span className="gradient-text">LENS</span> AI
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-navy-900 dark:text-white mb-1">
              {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome back' : 'Create Account')}
            </h1>
            <p className="text-sm text-navy-600 dark:text-navy-400">
              {isForgotPassword ? 'Enter your email to receive a reset link' : (isLogin ? 'Sign in to access your dashboard' : 'Join us to start analyzing samples')}
            </p>
          </div>

          {/* Toggle */}
          {!isForgotPassword && (
            <div className="flex p-1 mb-8 bg-navy-100 dark:bg-white/5 rounded-xl border border-navy-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isLogin ? 'bg-white dark:bg-primary-500 text-primary-600 dark:text-white shadow-sm' : 'text-navy-500 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isLogin ? 'bg-white dark:bg-primary-500 text-primary-600 dark:text-white shadow-sm' : 'text-navy-500 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && !isForgotPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label htmlFor="name" className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400 dark:text-navy-500" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="input-field !pl-11"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400 dark:text-navy-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@email.com"
                  className="input-field !pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <AnimatePresence mode="popLayout">
              {!isForgotPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label htmlFor="password" className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2 mt-4">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400 dark:text-navy-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field !pl-11 !pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500 hover:text-navy-600 dark:hover:text-navy-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

            {/* Submit */}
            <button
              id="login-btn"
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isForgotPassword ? 'Sending...' : (isLogin ? 'Signing in...' : 'Creating account...')}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  {isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account')}
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
            
            {isForgotPassword && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-sm font-medium text-navy-500 dark:text-navy-400 hover:text-navy-700 dark:hover:text-navy-200 transition-colors"
                >
                  Back to login
                </button>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
