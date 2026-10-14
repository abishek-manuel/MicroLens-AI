import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload as UploadIcon,
  Image,
  MapPin,
  Calendar,
  Droplets,
  X,
  Loader2,
  CheckCircle2,
  Microscope,
} from 'lucide-react';
import { sampleService } from '../services/sampleService';
import toast from 'react-hot-toast';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sampleType, setSampleType] = useState('water');
  const [uploading, setUploading] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    } else {
      toast.error('Please upload an image file');
    }
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please upload a sample image');
      return;
    }
    if (!location.trim()) {
      toast.error('Please enter a sample location');
      return;
    }

    setUploading(true);

    const stages = [
      'Uploading image...',
      'Preprocessing sample...',
      'Running AI detection model...',
      'Classifying particles...',
      'Generating results...',
    ];

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(stages[i]);
      await new Promise((r) => setTimeout(r, 500));
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('location', location);
      formData.append('date', date);
      formData.append('sampleType', sampleType);

      const result = await sampleService.uploadSample(formData);
      toast.success('Analysis complete!');
      navigate(`/analysis/${result.id}`, { state: { result } });
    } catch (err) {
      const msg = err?.message || 'Upload failed. Please try again.';
      toast.error(msg);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setProcessingStage('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Sample</h1>
        <p className="text-navy-500 dark:text-navy-400 mt-1">
          Upload a water or soil sample image for AI-powered microplastic detection.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drop zone */}
        <div
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300
            ${dragActive
              ? 'border-primary-500 bg-primary-500/5 scale-[1.01]'
              : file
                ? 'border-primary-500/50 bg-primary-500/5'
                : 'border-navy-300 dark:border-navy-600 hover:border-primary-500/50 hover:bg-primary-500/5'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative p-6"
              >
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <img
                    src={preview}
                    alt="Sample preview"
                    className="w-full md:w-64 h-48 object-cover rounded-xl"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-500">File ready</span>
                    </div>
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-navy-500 dark:text-navy-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.label
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                htmlFor="file-input"
                className="flex flex-col items-center justify-center py-16 px-6 cursor-pointer"
              >
                <div className="p-4 rounded-2xl bg-navy-100 dark:bg-navy-800 mb-4">
                  <UploadIcon className="w-10 h-10 text-navy-400 dark:text-navy-500" />
                </div>
                <p className="text-base font-semibold mb-1">
                  Drop your sample image here
                </p>
                <p className="text-sm text-navy-500 dark:text-navy-400 mb-4">
                  or click to browse • PNG, JPG, TIFF up to 50MB
                </p>
                <span className="btn-secondary text-sm">
                  <Image className="w-4 h-4" />
                  Browse Files
                </span>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </motion.label>
            )}
          </AnimatePresence>
        </div>

        {/* Metadata fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-1.5" />
              Sample Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Pacific Ocean, Station 12"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              <Calendar className="w-4 h-4 inline mr-1.5" />
              Collection Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sample-type" className="block text-sm font-medium mb-2">
              <Droplets className="w-4 h-4 inline mr-1.5" />
              Sample Type
            </label>
            <select
              id="sample-type"
              value={sampleType}
              onChange={(e) => setSampleType(e.target.value)}
              className="input-field"
            >
              <option value="water">Water</option>
              <option value="soil">Soil</option>
              <option value="sediment">Sediment</option>
              <option value="air">Air Filter</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          id="submit-upload"
          type="submit"
          disabled={uploading || !file}
          className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              {processingStage}
            </div>
          ) : (
            <>
              <Microscope className="w-5 h-5" />
              Analyze Sample
            </>
          )}
        </button>
      </form>

      {/* Processing overlay */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="glass-card !p-10 text-center max-w-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 mb-6"
              >
                <Microscope className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">Analyzing Sample</h3>
              <p className="text-sm text-navy-500 dark:text-navy-400 mb-4">
                {processingStage}
              </p>
              <div className="w-full bg-navy-200 dark:bg-navy-700 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
