import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      id="fab-upload"
      onClick={() => navigate('/upload')}
      className="fixed bottom-8 right-8 z-40 p-4 rounded-full 
                 bg-gradient-to-r from-primary-500 to-cyan-500 
                 text-white shadow-glow-lg 
                 hover:shadow-glow hover:scale-105 
                 active:scale-95 
                 transition-all duration-200"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Upload new sample"
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  );
}
