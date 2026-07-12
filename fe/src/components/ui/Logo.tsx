'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showSubtitle = false, className = '' }: LogoProps) {
  const sizes = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src="/logo-hse.svg"
        alt="HSSE Logo"
        className={`${sizes[size]} object-contain`}
      />
      {showSubtitle && (
        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-widest mt-2">
          MANAGEMENT SYSTEM
        </p>
      )}
    </div>
  );
}
