import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

export default function StatCard({ icon: Icon, label, value, suffix = '', trend, trendValue, color = 'primary' }) {
  const animatedValue = useAnimatedCounter(typeof value === 'number' ? value : 0);

  const colorMap = {
    primary: 'from-primary-500 to-primary-600',
    cyan: 'from-cyan-500 to-cyan-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
  };

  const iconBgMap = {
    primary: 'bg-primary-500/10 text-primary-500',
    cyan: 'bg-cyan-500/10 text-cyan-500',
    amber: 'bg-amber-500/10 text-amber-500',
    rose: 'bg-rose-500/10 text-rose-500',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-navy-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card group hover:shadow-glow transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBgMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-navy-500 dark:text-navy-400">{label}</p>
        <p className="text-3xl font-bold tracking-tight">
          {typeof value === 'number' ? animatedValue.toLocaleString() : value}
          {suffix && <span className="text-lg font-normal text-navy-400 ml-1">{suffix}</span>}
        </p>
      </div>
    </motion.div>
  );
}
