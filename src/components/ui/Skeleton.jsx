export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseClass = 'animate-pulse bg-navy-200 dark:bg-navy-700';

  const variantClass = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div className={`${baseClass} ${variantClass[variant]} ${className}`} />
  );
}
