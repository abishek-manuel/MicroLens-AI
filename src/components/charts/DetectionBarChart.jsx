import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#14b8a6', '#06b6d4', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card-sm !p-3 text-sm">
        <p className="font-semibold text-navy-900 dark:text-gray-100">{label}</p>
        <p className="text-primary-500 font-medium">{payload[0].value} detected</p>
      </div>
    );
  }
  return null;
};

export default function DetectionBarChart({ data }) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#9fb3c8' : '#486581';
  const gridColor = theme === 'dark' ? '#243b53' : '#d9e2ec';

  const chartData = data || [];
  const hasData = chartData.length > 0 && chartData.some(d => d.count > 0);

  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold mb-6">Particle Detection Breakdown</h3>
      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <BarChart3 className="w-12 h-12 text-navy-300 dark:text-navy-600 mb-3" />
          <p className="text-sm font-medium text-navy-500 dark:text-navy-400">No detection data yet</p>
          <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">Upload samples to see particle breakdowns.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: textColor, fontSize: 13 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: textColor, fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={48}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
