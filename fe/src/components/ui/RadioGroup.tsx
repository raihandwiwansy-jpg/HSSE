'use client';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  name: string;
  disabled?: boolean;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md';
}

export default function RadioGroup({
  options,
  value,
  onChange,
  name,
  disabled = false,
  className = '',
  layout = 'horizontal',
  size = 'md',
}: RadioGroupProps) {
  return (
    <div
      className={`flex ${layout === 'horizontal' ? 'flex-wrap gap-3' : 'flex-col gap-2'} ${className}`}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className={`
              group relative flex items-center gap-3 cursor-pointer select-none
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${size === 'sm' ? 'p-2' : 'p-3'} rounded-xl border-2 transition-all duration-200 ease-in-out
              ${isSelected
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-500 shadow-md shadow-blue-500/10'
                : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
              }
              ${!disabled ? 'active:scale-[0.98]' : ''}
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              disabled={disabled}
              className="sr-only"
            />
            {/* Custom radio circle */}
            <div
              className={`
                flex-shrink-0 rounded-full border-2 transition-all duration-200
                ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
                ${isSelected
                  ? 'border-blue-500 bg-white dark:bg-gray-800'
                  : 'border-gray-300 dark:border-gray-500 group-hover:border-blue-400'
                }
              `}
            >
              <div
                className={`
                  m-auto rounded-full bg-blue-500 transition-all duration-200
                  ${size === 'sm' ? 'w-2 h-2 mt-[1px]' : 'w-2.5 h-2.5 mt-[2px]'}
                  ${isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                `}
              />
            </div>
            {/* Label */}
            <div className="flex-1 min-w-0">
              <span
                className={`${
                  size === 'sm' ? 'text-xs' : 'text-sm'
                } font-medium leading-tight block ${
                  isSelected
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {option.label}
              </span>
              {option.description && (
                <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
