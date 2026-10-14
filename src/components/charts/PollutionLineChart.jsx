import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card-sm !p-3 text-sm">
        <p className="font-semibold text-navy-900 dark:text-gray-100">{label}</p>
        <p className="text-primary-500 font-medium">Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function PollutionLineChart({ data, title = 'Pollution Trend' }) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#9fb3c8' : '#486581';
  const gridColor = theme === 'dark' ? '#243b53' : '#d9e2ec';

  const chartData = data;
  const hasData = chartData && chartData.length > 0 && chartData.some(d => d.score > 0);

  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <TrendingUp className="w-12 h-12 text-navy-300 dark:text-navy-600 mb-3" />
          <p className="text-sm font-medium text-navy-500 dark:text-navy-400">No trend data yet</p>
          <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">Upload samples to start tracking pollution trends.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="pollutionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: textColor, fontSize: 13 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: textColor, fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#14b8a6"
              strokeWidth={2.5}
              fill="url(#pollutionGradient)"
              dot={{ fill: '#14b8a6', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: '#14b8a6', strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
