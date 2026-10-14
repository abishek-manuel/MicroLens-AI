import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#14b8a6', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card-sm !p-3 text-sm">
        <p className="font-semibold text-navy-900 dark:text-gray-100">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.fill }} className="font-medium">
          {payload[0].value} ({((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function ParticlePieChart({ data }) {
  const chartData = data || [];
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const hasData = chartData.length > 0 && total > 0;
  const enrichedData = chartData.map((d) => ({ ...d, total }));

  if (!hasData) {
    return (
      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-6">Particle Distribution</h3>
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <PieChartIcon className="w-12 h-12 text-navy-300 dark:text-navy-600 mb-3" />
          <p className="text-sm font-medium text-navy-500 dark:text-navy-400">No particle data yet</p>
          <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">Upload samples to see particle distribution.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold mb-6">Particle Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={enrichedData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {enrichedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-navy-600 dark:text-navy-300">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
