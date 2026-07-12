'use client';

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  register?: any;
  error?: any;
}

export default function Input({
  label,
  name,
  register,
  error,
  className,
  type = 'text',
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        className={cn(
          "w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition",
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...(register ? register(name) : {})}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{typeof error === 'string' ? error : error.message}</p>}
    </div>
  );
}
