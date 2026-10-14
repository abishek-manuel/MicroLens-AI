import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = 'No data found', 
  description = 'There are no items to display at the moment.',
  action,
  actionLabel = 'Get Started'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="p-4 rounded-2xl bg-navy-100 dark:bg-navy-800 mb-4">
        <Icon className="w-12 h-12 text-navy-400 dark:text-navy-500" />
      </div>
      <h3 className="text-lg font-semibold text-navy-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-navy-500 dark:text-navy-400 max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <button onClick={action} className="btn-primary text-sm">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
