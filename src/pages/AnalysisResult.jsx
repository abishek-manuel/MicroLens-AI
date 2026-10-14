import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Share2,
  MapPin,
  Calendar,
  Droplets,
  Image,
  Activity,
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
} from 'lucide-react';
import SeverityMeter from '../components/ui/SeverityMeter';
import ParticlePieChart from '../components/charts/ParticlePieChart';
import DetectionBarChart from '../components/charts/DetectionBarChart';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { sampleService } from '../services/sampleService';
import toast from 'react-hot-toast';

const PARTICLE_COLORS = ['#14b8a6', '#06b6d4', '#f59e0b', '#ef4444'];

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

function StatPill({ icon: Icon, label, value, accent }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-3 px-5 py-3 rounded-2xl flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, ${accent}18 0%, ${accent}08 100%)`,
        border: `1px solid ${accent}30`,
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}22` }}
      >
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-xs font-medium text-navy-400 dark:text-navy-500 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-bold text-navy-900 dark:text-gray-100 leading-none">{value}</p>
      </div>
    </motion.div>
  );
}

function ParticleRow({ particle, index, total }) {
  const pct = total > 0 ? (particle.value / total) * 100 : 0;
  // Risk based on share of total (percentage), not raw count
  const risk = pct > 50 ? 'danger' : pct > 25 ? 'warning' : 'success';
  const riskLabel = pct > 50 ? 'High' : pct > 25 ? 'Medium' : 'Low';
  const color = PARTICLE_COLORS[index % PARTICLE_COLORS.length];

  return (
    <motion.tr
      variants={fadeUp}
      className="border-b border-navy-100 dark:border-navy-800/60 last:border-0 hover:bg-navy-50/80 dark:hover:bg-navy-800/20 transition-colors"
    >
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }}
          />
          <span className="font-semibold text-navy-900 dark:text-gray-100">{particle.name}</span>
        </div>
      </td>
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-navy-100 dark:bg-navy-800 overflow-hidden" style={{ maxWidth: '100px' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
            />
          </div>
          <span className="font-mono text-sm font-bold text-navy-700 dark:text-navy-300 w-6 text-right">
            {particle.value}
          </span>
        </div>
      </td>
      <td className="py-4 px-5 text-right">
        <span className="font-mono text-sm text-navy-500 dark:text-navy-400">{pct.toFixed(1)}%</span>
      </td>
      <td className="py-4 px-5 text-right">
        <Badge variant={risk}>{riskLabel}</Badge>
      </td>
    </motion.tr>
  );
}

export default function AnalysisResult() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sample, setSample] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);

  useEffect(() => {
    if (!sample) {
      sampleService
        .getSampleById(id)
        .then(setSample)
        .catch(() => {
          toast.error('Sample not found');
          navigate('/history');
        })
        .finally(() => setLoading(false));
    }
  }, [id, sample, navigate]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!sample) return null;

  const pieData = [
    { name: 'Fibers', value: sample.particles.fibers },
    { name: 'Films', value: sample.particles.films },
    { name: 'Fragments', value: sample.particles.fragments },
    { name: 'Pallets', value: sample.particles.pallets ?? sample.particles.spheres ?? 0 },
  ];

  const barData = [
    { name: 'Fibers', count: sample.particles.fibers },
    { name: 'Films', count: sample.particles.films },
    { name: 'Fragments', count: sample.particles.fragments },
    { name: 'Pallets', count: sample.particles.pallets ?? sample.particles.spheres ?? 0 },
  ];

  const severityLabel =
    sample.severity <= 25 ? 'Low' :
    sample.severity <= 50 ? 'Moderate' :
    sample.severity <= 75 ? 'High' : 'Critical';

  const severityVariant =
    sample.severity <= 25 ? 'success' :
    sample.severity <= 50 ? 'warning' : 'danger';

  const severityColor =
    sample.severity <= 25 ? '#10b981' :
    sample.severity <= 50 ? '#f59e0b' :
    sample.severity <= 75 ? '#f97316' : '#ef4444';

  const SeverityIcon = sample.severity <= 25 ? CheckCircle : sample.severity <= 75 ? AlertTriangle : Zap;

  const handleExport = async () => {
    const toastId = toast.loading('Generating PDFâ€¦');
    try {
      const { default: jsPDF } = await import('jspdf');

      const pdf  = new jsPDF({ unit: 'mm', format: 'a4' });
      const W    = 210;           // page width mm
      const L    = 15;            // left margin
      const R    = W - 15;        // right margin
      let   y    = 20;            // current y cursor

      const pallets  = sample.particles.pallets ?? sample.particles.spheres ?? 0;
      const total    = sample.particleCount || 1;

      // â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      const line = (thickness = 0.3) => {
        pdf.setDrawColor(180);
        pdf.setLineWidth(thickness);
        pdf.line(L, y, R, y);
        y += 4;
      };

      const gap = (mm = 5) => { y += mm; };

      const heading = (text) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(30, 30, 30);
        pdf.text(text, L, y);
        y += 6;
        line(0.4);
      };

      const field = (label, value, indent = 0) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        pdf.text(label + ':', L + indent, y);

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(20, 20, 20);
        pdf.text(String(value), L + indent + 45, y);
        y += 6;
      };

      // â”€â”€ Title block â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor(10, 10, 10);
      pdf.text('MICRO LENS AI', L, y);
      y += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      pdf.text('Microplastic Analysis Report', L, y);
      y += 5;

      pdf.setFontSize(9);
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, L, y);
      y += 3;

      line(0.6);
      gap(3);

      // â”€â”€ Sample info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      heading('Sample Information');
      field('File Name',    sample.fileName);
      field('Analysis ID',  sample.id);
      field('Location',     sample.location);
      field('Date',         new Date(sample.date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
      field('Sample Type',  sample.sampleType);
      gap(4);

      // â”€â”€ Contamination summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      heading('Contamination Summary');
      field('Severity Score',  `${sample.severity} / 100`);
      field('Risk Level',      severityLabel);
      field('Total Particles', sample.particleCount);
      gap(4);

      // â”€â”€ Particle breakdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      heading('Particle Breakdown');

      // table header
      const cols = { type: L, count: L + 55, share: L + 90, risk: L + 125 };
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text('TYPE',       cols.type,  y);
      pdf.text('COUNT',      cols.count, y);
      pdf.text('SHARE (%)',  cols.share, y);
      pdf.text('RISK',       cols.risk,  y);
      y += 3;
      line(0.3);

      const particles = [
        { name: 'Fibers',    value: sample.particles.fibers },
        { name: 'Films',     value: sample.particles.films },
        { name: 'Fragments', value: sample.particles.fragments },
        { name: 'Pallets',   value: pallets },
      ];

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      particles.forEach(p => {
        const pct  = ((p.value / total) * 100).toFixed(1);
        const risk = parseFloat(pct) > 50 ? 'High' : parseFloat(pct) > 25 ? 'Medium' : 'Low';
        pdf.setTextColor(20, 20, 20);
        pdf.text(p.name,        cols.type,  y);
        pdf.text(String(p.value), cols.count, y);
        pdf.text(`${pct}%`,     cols.share, y);
        pdf.text(risk,          cols.risk,  y);
        y += 7;
      });

      gap(4);

      // â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      pdf.setDrawColor(200);
      pdf.setLineWidth(0.3);
      pdf.line(L, 282, R, 282);
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Micro Lens AI Â· Microplastic Detection System Â· Confidential â€” for research use only', L, 287);

      pdf.save(`analysis-${sample.id}.pdf`);
      toast.success('PDF downloaded!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF', { id: toastId });
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="max-w-6xl mx-auto space-y-7"
    >
      {/* â”€â”€ Header â”€â”€ */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center
                       bg-white/60 dark:bg-navy-800/60 border border-navy-200/50 dark:border-navy-700/50
                       hover:bg-white dark:hover:bg-navy-700 shadow-sm transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight gradient-text">Analysis Result</h1>
            <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5 font-medium">{sample.fileName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied!');
            }}
            className="btn-ghost text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button onClick={handleExport} className="btn-primary text-sm px-4 py-2.5">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* â”€â”€ Hero Stats Banner â”€â”€ */}
      <motion.div variants={fadeUp} className="glass-card !p-5 relative overflow-hidden">
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ backgroundColor: severityColor }}
        />
        <div className="relative flex flex-wrap gap-3">
          <StatPill icon={MapPin} label="Location" value={sample.location} accent="#14b8a6" />
          <StatPill
            icon={Calendar}
            label="Analyzed On"
            value={new Date(sample.date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            accent="#06b6d4"
          />
          <StatPill icon={Droplets} label="Sample Type" value={sample.sampleType} accent="#8b5cf6" />
          <StatPill icon={Activity} label="Total Particles" value={sample.particleCount} accent="#f59e0b" />
          <StatPill icon={TrendingUp} label="Severity Score" value={`${sample.severity}/100`} accent={severityColor} />
          <StatPill icon={SeverityIcon} label="Risk Level" value={severityLabel} accent={severityColor} />
        </div>
      </motion.div>

      {/* â”€â”€ Top Row: Annotated Image + Severity Card â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Annotated Image â€” wider */}
        <motion.div variants={fadeUp} className="lg:col-span-3 glass-card flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-navy-900 dark:text-gray-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary-500" />
              Annotated Image
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-navy-100 dark:bg-navy-800 text-navy-500 dark:text-navy-400 font-medium">
              AI Processed
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden border border-navy-200/50 dark:border-navy-700/50">
            {sample.annotatedImageUrl ? (
              <img
                src={sample.annotatedImageUrl}
                alt="Annotated microplastic detection"
                className="w-full h-full object-contain bg-navy-900"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-navy-100 to-navy-200 dark:from-navy-800 dark:to-navy-900" />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #14b8a620 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                <div className="relative flex items-center justify-center h-full text-center z-10">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-navy-200/60 dark:bg-navy-700/60 flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-navy-300/30 dark:border-navy-600/30">
                      <Image className="w-7 h-7 text-navy-400 dark:text-navy-500" />
                    </div>
                    <p className="text-sm font-medium text-navy-500 dark:text-navy-400">Start the backend to see annotated image</p>
                    <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">Run: <code className="font-mono bg-navy-200 dark:bg-navy-700 px-1 rounded">uvicorn main:app</code></p>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Severity Card â€” narrower */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-2 glass-card flex flex-col items-center justify-between gap-5 relative overflow-hidden"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full opacity-20 blur-2xl pointer-events-none"
            style={{ backgroundColor: severityColor }}
          />
          <div className="relative w-full flex flex-col items-center">
            <p className="text-xs font-semibold text-navy-400 dark:text-navy-500 uppercase tracking-widest mb-4">
              Contamination Level
            </p>
            <SeverityMeter score={sample.severity} />
          </div>

          <div className="w-full space-y-2.5">
            {[
              { label: 'Risk Status', value: <Badge variant={severityVariant}>{severityLabel}</Badge> },
              { label: 'Total Particles', value: <span className="font-bold text-navy-900 dark:text-gray-100">{sample.particleCount}</span> },
              { label: 'Severity Score', value: <span className="font-bold text-navy-900 dark:text-gray-100">{sample.severity}<span className="font-normal text-navy-400 text-xs">/100</span></span> },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-800"
              >
                <span className="text-xs font-medium text-navy-500 dark:text-navy-400">{label}</span>
                {value}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* â”€â”€ Charts Row â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp}>
          <ParticlePieChart data={pieData} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <DetectionBarChart data={barData} />
        </motion.div>
      </div>

      {/* â”€â”€ Detailed Breakdown Table â”€â”€ */}
      <motion.div variants={fadeUp} className="glass-card !p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy-100 dark:border-navy-800">
          <h3 className="text-base font-bold text-navy-900 dark:text-gray-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-500" />
            Detailed Particle Breakdown
          </h3>
          <span className="text-xs text-navy-400 dark:text-navy-500 font-medium">
            {sample.particleCount} total detected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50/80 dark:bg-navy-800/40">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
                  Particle Type
                </th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="text-right py-3.5 px-5 text-xs font-semibold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="text-right py-3.5 px-5 text-xs font-semibold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
                  Risk Level
                </th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="initial" animate="animate">
              {pieData.map((particle, index) => (
                <ParticleRow
                  key={particle.name}
                  particle={particle}
                  index={index}
                  total={sample.particleCount}
                />
              ))}
            </motion.tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-navy-50/50 dark:bg-navy-800/20 border-t border-navy-100 dark:border-navy-800 flex items-center justify-between">
          <span className="text-xs text-navy-400 dark:text-navy-500">
            Analysis ID: <span className="font-mono font-medium text-navy-600 dark:text-navy-300">{sample.id}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-navy-400 dark:text-navy-500">Analysis complete</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

