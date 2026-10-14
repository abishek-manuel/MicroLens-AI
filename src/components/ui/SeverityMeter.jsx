import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function SeverityMeter({ score = 0, size = 200 }) {
  const clampedScore = Math.max(0, Math.min(100, score));

  const { color, label, bgGradient } = useMemo(() => {
    if (clampedScore <= 25) return { color: '#10b981', label: 'Low', bgGradient: 'from-emerald-500/10 to-emerald-500/5' };
    if (clampedScore <= 50) return { color: '#f59e0b', label: 'Moderate', bgGradient: 'from-amber-500/10 to-amber-500/5' };
    if (clampedScore <= 75) return { color: '#f97316', label: 'High', bgGradient: 'from-orange-500/10 to-orange-500/5' };
    return { color: '#ef4444', label: 'Critical', bgGradient: 'from-red-500/10 to-red-500/5' };
  }, [clampedScore]);

  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-b ${bgGradient}`}>
      <div className="relative" style={{ width: size, height: size / 2 + 30 }}>
        <svg
          width={size}
          height={size / 2 + 20}
          viewBox="0 0 200 120"
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className="text-navy-200 dark:text-navy-700"
          />
          {/* Foreground arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          {/* Score text */}
          <text
            x="100"
            y="85"
            textAnchor="middle"
            className="fill-navy-900 dark:fill-gray-100 text-4xl font-bold"
            style={{ fontSize: '36px', fontWeight: 700 }}
          >
            {clampedScore}
          </text>
          <text
            x="100"
            y="105"
            textAnchor="middle"
            className="fill-navy-500 dark:fill-navy-400 text-sm"
            style={{ fontSize: '12px' }}
          >
            / 100
          </text>
        </svg>
      </div>
      <div className="text-center">
        <span
          className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {label} Severity
        </span>
      </div>
    </div>
  );
}
