import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileBarChart,
  Download,
  Calendar,
  TrendingUp,
  Beaker,
  Plus,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import PollutionLineChart from '../components/charts/PollutionLineChart';
import ParticlePieChart from '../components/charts/ParticlePieChart';
import { reportService } from '../services/reportService';
import { dashboardService } from '../services/dashboardService';
import toast from 'react-hot-toast';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [trends, setTrends] = useState(null);
  const [particles, setParticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reportsData, trendsData, particlesData] = await Promise.all([
          reportService.getReports(),
          dashboardService.getPollutionTrends(),
          dashboardService.getParticleBreakdown(),
        ]);
        setReports(reportsData);
        setTrends(trendsData);
        const pieFormat = particlesData.map((p) => ({ name: p.name, value: p.count }));
        setParticles(pieFormat);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const newReport = await reportService.generateReport();
      setReports((prev) => [newReport, ...prev]);
      toast.success('Report generated successfully!');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (report) => {
    const toastId = toast.loading('Generating PDF…');
    try {
      const { default: jsPDF } = await import('jspdf');

      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
      const L = 15, R = 195;
      let y = 20;

      const line = (w = 0.3) => {
        pdf.setDrawColor(180); pdf.setLineWidth(w);
        pdf.line(L, y, R, y); y += 4;
      };
      const gap = (mm = 5) => { y += mm; };
      const heading = (text) => {
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(13); pdf.setTextColor(30, 30, 30);
        pdf.text(text, L, y); y += 6; line(0.4);
      };
      const field = (label, value) => {
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(80, 80, 80);
        pdf.text(label + ':', L, y);
        pdf.setFont('helvetica', 'normal'); pdf.setTextColor(20, 20, 20);
        pdf.text(String(value ?? '—'), L + 50, y); y += 6;
      };

      // Title
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(20); pdf.setTextColor(10, 10, 10);
      pdf.text('MICRO LENS AI', L, y); y += 8;
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(12); pdf.setTextColor(60, 60, 60);
      pdf.text('Aggregated Analysis Report', L, y); y += 5;
      pdf.setFontSize(9); pdf.setTextColor(120, 120, 120);
      pdf.text(`Downloaded: ${new Date().toLocaleString()}`, L, y); y += 3;
      line(0.6); gap(3);

      // Report details
      heading('Report Information');
      field('Title',           report.title);
      field('Date Range',      report.dateRange);
      field('Total Samples',   report.totalSamples);
      field('Avg Severity',    `${report.avgSeverity} / 100`);
      field('Status',          'Completed');
      field('Generated On',    new Date(report.createdAt).toLocaleString());
      gap(4);

      // Footer
      pdf.setDrawColor(200); pdf.setLineWidth(0.3); pdf.line(L, 282, R, 282);
      pdf.setFont('helvetica', 'italic'); pdf.setFontSize(8); pdf.setTextColor(150, 150, 150);
      pdf.text('Micro Lens AI · Microplastic Detection System · Confidential — for research use only', L, 287);

      pdf.save(`report-${report.id}.pdf`);
      toast.success('PDF downloaded!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-navy-500 dark:text-navy-400 mt-1">
            Aggregated analysis reports and data exports.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary disabled:opacity-50"
        >
          {generating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </div>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Generate Report
            </>
          )}
        </button>
      </motion.div>

      {/* Charts overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp}>
          <PollutionLineChart data={trends} title="Overall Pollution Trend" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ParticlePieChart data={particles} />
        </motion.div>
      </div>

      {/* Reports list */}
      <motion.div variants={fadeUp} className="glass-card">
        <h3 className="text-lg font-semibold mb-4">Generated Reports</h3>
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <FileBarChart className="w-10 h-10 text-navy-300 dark:text-navy-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-navy-500 dark:text-navy-400">No reports generated yet</p>
              <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">Click "Generate Report" to create your first report.</p>
            </div>
          ) : (
            reports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl 
                         bg-navy-50 dark:bg-navy-800/30 hover:bg-navy-100 dark:hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500 mt-0.5">
                  <FileBarChart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{report.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-navy-500 dark:text-navy-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.dateRange}
                    </span>
                    <span className="flex items-center gap-1">
                      <Beaker className="w-3 h-3" />
                      {report.totalSamples} samples
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Avg: {report.avgSeverity}/100
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <Badge variant="success">Completed</Badge>
                <button
                  onClick={() => handleDownload(report)}
                  className="btn-ghost text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
