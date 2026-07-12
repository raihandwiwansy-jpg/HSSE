import { cn } from '@/lib/utils';

interface CardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
  children?: React.ReactNode;
}

const iconBg = {
  green: 'bg-[#2E7D32]',
  blue: 'bg-[#1976D2]',
  yellow: 'bg-[#FFC107]',
  red: 'bg-[#D32F2F]',
  purple: 'bg-[#7B1FA2]',
};

export default function Card({ title, value, icon, color = 'green', children }: CardProps) {
  return (
    <div className="hse-stat-card card-hover cursor-default">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        {icon && (
          <div className={cn('p-2.5 rounded-xl text-white transition-transform duration-300 group-hover:scale-110', iconBg[color])}>
            {icon}
          </div>
        )}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
