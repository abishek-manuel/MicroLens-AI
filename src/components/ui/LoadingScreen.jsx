import { motion } from 'framer-motion';
import { Microscope } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-navy-950">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500"
        >
          <Microscope className="w-10 h-10 text-white" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-navy-900 dark:text-gray-100">
            MICRO LENS AI
          </h2>
          <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">
            Loading...
          </p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-primary-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
