'use client';

interface LogoSmallProps {
  showText?: boolean;
  className?: string;
  textColor?: 'white' | 'navy' | 'dark';
}

export function LogoSmall({ showText = true, className = '', textColor = 'navy' }: LogoSmallProps) {
  const getTextColor = () => {
    if (textColor === 'white') return 'text-white';
    if (textColor === 'navy') return 'text-[#1A365D] dark:text-[#3182CE]';
    if (textColor === 'dark') return 'text-gray-800 dark:text-white';
    return 'text-[#1A365D] dark:text-[#3182CE]';
  };

  const textClass = getTextColor();

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex flex-col items-center leading-none">
        <span className={`text-sm font-bold ${textClass} leading-none`} style={{ lineHeight: 1 }}>
          +
        </span>
        <span
          className={`text-[10px] font-extrabold ${textClass} leading-none tracking-tight`}
          style={{ lineHeight: 1 }}
        >
          HSSE
        </span>
      </div>

      {showText && (
        <div>
          <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">HSSE System</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-1">PT. INL</p>
        </div>
      )}
    </div>
  );
}
