'use client';

import { useTheme } from '@/context/ThemeContext';
import { Plus } from 'lucide-react';

interface LogoPremiumProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
}

export function LogoPremium({ size = 'md', className = '', showSubtitle = false }: LogoPremiumProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const sizes = {
    sm: { plus: 20, hse: 'text-xl', sub: 'text-[10px]', gap: 'gap-0.5' },
    md: { plus: 32, hse: 'text-3xl', sub: 'text-xs', gap: 'gap-0.5' },
    lg: { plus: 48, hse: 'text-5xl', sub: 'text-sm', gap: 'gap-1' },
  };

  const s = sizes[size] || sizes.md;

  const textColor = isDark ? 'text-green-400' : 'text-green-700';
  const iconColor = isDark ? '#4CAF50' : '#2E7D32';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`flex flex-col items-center ${s.gap}`}>
        <Plus size={s.plus} color={iconColor} strokeWidth={2.5} className="drop-shadow-sm" />
        <span className={`${s.hse} font-extrabold ${textColor} tracking-tight`}>HSSE</span>
      </div>

      {showSubtitle && (
        <p className={`${s.sub} font-medium text-gray-500 dark:text-gray-400 tracking-widest mt-2`}>
          MANAGEMENT SYSTEM
        </p>
      )}
    </div>
  );
}
