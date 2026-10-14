import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Bug, TrendingUp, Clock } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import PollutionLineChart from '../components/charts/PollutionLineChart';
import DetectionBarChart from '../components/charts/DetectionBarChart';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import { dashboardService } from '../services/dashboardService';

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const [activity, setActivity] = useState(null);
  const [particles, setParticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, trendsData, activityData, particlesData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getPollutionTrends(),
          dashboardService.getRecentActivity(),
          dashboardService.getParticleBreakdown(),
        ]);
        setStats(statsData);
        setTrends(trendsData);
        setActivity(activityData);
        setParticles(particlesData);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <Bug className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-navy-500 dark:text-navy-400 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Refresh Page
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  const severityBadge = (severity) => {
    if (severity <= 25) return <Badge variant="success">Low</Badge>;
    if (severity <= 50) return <Badge variant="warning">Moderate</Badge>;
    if (severity <= 75) return <Badge variant="danger">High</Badge>;
    return <Badge variant="danger">Critical</Badge>;
  };

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-navy-500 dark:text-navy-400 mt-1">
          Overview of your microplastic detection activity.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Beaker}
          label="Total Samples"
          value={stats.totalSamples}
          color="primary"
        />
        <StatCard
          icon={Bug}
          label="Particles Detected"
          value={stats.particlesDetected}
          color="cyan"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Severity"
          value={stats.avgSeverity}
          suffix="/100"
          color="amber"
        />
        <StatCard
          icon={Clock}
          label="This Month"
          value={stats.recentUploads}
          suffix="uploads"
          color="rose"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp}>
          <PollutionLineChart data={trends} title="Pollution Score Trend" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <DetectionBarChart data={particles} />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={fadeUp} className="glass-card">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {!activity || activity.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-navy-300 dark:text-navy-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-navy-500 dark:text-navy-400">No recent activity</p>
            <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">Upload your first sample to see activity here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-navy-50 dark:hover:bg-navy-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.action}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400 truncate">{item.detail}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {item.severity && severityBadge(item.severity)}
                  <span className="text-xs text-navy-400 dark:text-navy-500 whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
