import React, { useId } from 'react';

/**
 * Input Component
 *
 * A fully accessible form input with label, error handling, and icons.
 *
 * Accessibility Features:
 * - Label associated with input via htmlFor + id
 * - Error messages linked via aria-describedby
 * - Error messages use role="alert" for screen reader announcement
 * - Visible focus indicator (ring-2 offset-2)
 * - WCAG AA contrast ratios (≥ 4.5:1)
 * - Placeholder not used as substitute for label
 */

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  size?: InputSize;
  icon?: React.ReactNode;
  helperText?: string;
}

const SIZES: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  size = 'md',
  icon,
  className = '',
  helperText,
  id: providedId,
  required,
  disabled,
  ...props
}) => {
  // Generate unique id for input if not provided
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  // Build aria-describedby to link error and helper text
  const describedBy = [
    error ? errorId : undefined,
    helperText ? helperId : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
        >
          {label}
          {required && <span aria-label="obrigatório"> *</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-lg transition-all duration-200
            bg-[#121214] border
            ${error
              ? 'border-rose-900/50 focus:border-rose-800 focus:ring-rose-950/30'
              : 'border-zinc-800 focus:border-zinc-600 focus:ring-zinc-900/50'
            }
            text-zinc-200 placeholder:text-zinc-600
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
            disabled:opacity-50 disabled:cursor-not-allowed
            ${SIZES[size]}
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && (
        <span
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-xs text-rose-500 font-medium"
        >
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={helperId} className="text-xs text-zinc-500">
          {helperText}
        </span>
      )}
    </div>
  );
};
