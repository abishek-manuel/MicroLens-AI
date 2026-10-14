import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  Eye,
  Beaker,
  LayoutGrid,
  List,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { sampleService } from '../services/sampleService';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function History() {
  const navigate = useNavigate();
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null); // sample object to delete
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    sampleService.getSamples()
      .then(setSamples)
      .finally(() => setLoading(false));
  }, []);

  const filtered = samples.filter((s) => {
    const matchesSearch = s.fileName.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || s.sampleType === filterType;
    return matchesSearch && matchesType;
  });

  const getSeverityBadge = (severity) => {
    if (severity <= 25) return <Badge variant="success">Low</Badge>;
    if (severity <= 50) return <Badge variant="warning">Moderate</Badge>;
    if (severity <= 75) return <Badge variant="danger">High</Badge>;
    return <Badge variant="danger">Critical</Badge>;
  };

  const handleDeleteClick = (e, sample) => {
    e.stopPropagation(); // prevent card navigation
    setDeleteError('');
    setDeleteTarget(sample);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await sampleService.deleteSample(deleteTarget);
      // Optimistic UI: remove from local state immediately
      setSamples((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete sample. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            key="delete-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              key="delete-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-md relative"
            >
              {/* Close button */}
              <button
                id="delete-modal-close"
                onClick={() => !deleting && setDeleteTarget(null)}
                disabled={deleting}
                className="absolute top-4 right-4 p-1 rounded-lg text-navy-400 hover:text-navy-600 dark:hover:text-navy-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 mb-4 mx-auto">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>

              <h2 className="text-xl font-bold text-center mb-2">Delete Sample?</h2>
              <p className="text-sm text-navy-500 dark:text-navy-400 text-center mb-1">
                You are about to permanently delete:
              </p>
              <p className="text-sm font-semibold text-center mb-1 truncate px-4">
                {deleteTarget.fileName}
              </p>
              <p className="text-xs text-navy-400 text-center mb-6">
                This will remove the sample record and both images from storage. This action cannot be undone.
              </p>

              {deleteError && (
                <p className="text-xs text-red-500 text-center mb-4">{deleteError}</p>
              )}

              <div className="flex gap-3">
                <button
                  id="delete-cancel-btn"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-navy-200 dark:border-navy-700 text-sm font-medium hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  id="delete-confirm-btn"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Page ── */}
      <motion.div initial="initial" animate="animate" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sample History</h1>
            <p className="text-navy-500 dark:text-navy-400 mt-1">
              {samples.length} total samples analyzed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="view-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-500/10 text-primary-500' : 'text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              id="view-list-btn"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-500/10 text-primary-500' : 'text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
            <input
              id="search-history"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by filename or location..."
              className="input-field !pl-11"
            />
          </div>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field !w-auto min-w-[140px]"
          >
            <option value="all">All Types</option>
            <option value="water">Water</option>
            <option value="soil">Soil</option>
            <option value="sediment">Sediment</option>
          </select>
        </motion.div>

        {/* Results */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Beaker}
            title="No samples found"
            description="Try adjusting your search or filter criteria."
          />
        ) : viewMode === 'grid' ? (
          // ── GRID VIEW ──
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((sample, index) => (
              <motion.div
                key={sample.id}
                variants={fadeUp}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/analysis/${sample.id}`)}
                className="glass-card cursor-pointer group hover:shadow-glow transition-all duration-300 relative"
              >
                {/* Delete button */}
                <button
                  id={`delete-btn-${sample.id}`}
                  onClick={(e) => handleDeleteClick(e, sample)}
                  title="Delete sample"
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Thumbnail */}
                <div className="aspect-video bg-navy-100 dark:bg-navy-800 rounded-xl mb-4 overflow-hidden flex items-center justify-center relative">
                  {sample.annotatedImageUrl || sample.imageUrl ? (
                    <img
                      src={sample.annotatedImageUrl || sample.imageUrl}
                      alt={sample.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Beaker className="w-10 h-10 text-navy-300 dark:text-navy-600 group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm truncate">{sample.fileName}</h3>
                    {getSeverityBadge(sample.severity)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-navy-500 dark:text-navy-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {sample.location.split(',')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(sample.date + 'T12:00:00').toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-navy-100 dark:border-navy-800">
                    <span className="text-xs text-navy-400">{sample.particleCount} particles</span>
                    <span className="text-xs font-medium text-primary-500 flex items-center gap-1 group-hover:underline">
                      <Eye className="w-3 h-3" />
                      View
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // ── LIST VIEW ──
          <div className="glass-card !p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800/30">
                  <th className="text-left py-3 px-4 font-semibold text-navy-500 dark:text-navy-400">File</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-500 dark:text-navy-400 hidden sm:table-cell">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-500 dark:text-navy-400 hidden md:table-cell">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-500 dark:text-navy-400">Type</th>
                  <th className="text-center py-3 px-4 font-semibold text-navy-500 dark:text-navy-400">Severity</th>
                  <th className="text-right py-3 px-4 font-semibold text-navy-500 dark:text-navy-400">Particles</th>
                  <th className="text-center py-3 px-4 font-semibold text-navy-500 dark:text-navy-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sample) => (
                  <tr
                    key={sample.id}
                    onClick={() => navigate(`/analysis/${sample.id}`)}
                    className="border-b border-navy-100 dark:border-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800/30 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-medium truncate max-w-[180px]">{sample.fileName}</td>
                    <td className="py-3 px-4 text-navy-500 dark:text-navy-400 truncate max-w-[150px] hidden sm:table-cell">{sample.location}</td>
                    <td className="py-3 px-4 text-navy-500 dark:text-navy-400 hidden md:table-cell">{new Date(sample.date + 'T12:00:00').toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant="info">{sample.sampleType}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">{getSeverityBadge(sample.severity)}</td>
                    <td className="py-3 px-4 text-right font-medium">{sample.particleCount}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        id={`delete-list-btn-${sample.id}`}
                        onClick={(e) => handleDeleteClick(e, sample)}
                        title="Delete sample"
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </>
  );
}
