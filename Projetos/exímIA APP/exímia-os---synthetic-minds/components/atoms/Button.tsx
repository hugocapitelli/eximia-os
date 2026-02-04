import React, { ReactNode } from 'react';
import { TOKENS } from '../../src/design-tokens';

// ============================================================
// BUTTON ATOM COMPONENT
// ============================================================
// Base button component with variants, colors, and sizes
// All styling uses TOKENS exclusively - no hardcoded colors

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonColor = 'gold' | 'purple' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;

  /** Color scheme of the button */
  color?: ButtonColor;

  /** Size of the button */
  size?: ButtonSize;

  /** Optional icon/content before text */
  icon?: ReactNode;

  /** Button content */
  children: ReactNode;

  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}

/**
 * Button Atom Component
 *
 * A versatile button component supporting multiple variants, colors, and sizes.
 * All colors and spacing use design tokens for consistency.
 *
 * @example
 * <Button variant="primary" color="gold" size="md">
 *   Click Me
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      color = 'gold',
      size = 'md',
      icon,
      className = '',
      ariaLabel,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // ============================================================
    // SIZE STYLES
    // ============================================================

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    // ============================================================
    // VARIANT & COLOR COMBINATIONS
    // ============================================================

    const getButtonStyles = (): string => {
      const baseClasses = `
        font-semibold
        rounded-lg
        transition-all
        duration-200
        ease-out
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-offset-black
        disabled:opacity-50
        disabled:cursor-not-allowed
        inline-flex
        items-center
        justify-center
        whitespace-nowrap
      `;

      // Primary Variant
      if (variant === 'primary') {
        if (color === 'gold') {
          return `${baseClasses} bg-eximia-400 text-tech-bg hover:bg-eximia-500 active:bg-eximia-600 focus:ring-eximia-400`;
        }
        if (color === 'purple') {
          return `${baseClasses} bg-minds-500 text-white hover:bg-minds-600 active:bg-minds-700 focus:ring-minds-500`;
        }
        // ghost
        return `${baseClasses} bg-transparent text-eximia-400 hover:bg-eximia-400/10 active:bg-eximia-400/20 focus:ring-eximia-400`;
      }

      // Secondary Variant
      if (variant === 'secondary') {
        if (color === 'gold') {
          return `${baseClasses} bg-eximia-100 text-eximia-700 hover:bg-eximia-200 active:bg-eximia-300 focus:ring-eximia-400`;
        }
        if (color === 'purple') {
          return `${baseClasses} bg-minds-100 text-minds-700 hover:bg-minds-200 active:bg-minds-300 focus:ring-minds-500`;
        }
        // ghost
        return `${baseClasses} bg-tech-border text-white hover:bg-tech-border/80 active:bg-tech-border/60 focus:ring-minds-500`;
      }

      // Tertiary Variant (Outline)
      if (color === 'gold') {
        return `${baseClasses} border-2 border-eximia-400 text-eximia-400 hover:bg-eximia-400/10 active:bg-eximia-400/20 focus:ring-eximia-400`;
      }
      if (color === 'purple') {
        return `${baseClasses} border-2 border-minds-500 text-minds-500 hover:bg-minds-500/10 active:bg-minds-500/20 focus:ring-minds-500`;
      }
      // ghost
      return `${baseClasses} border-2 border-tech-border text-white hover:border-tech-border/80 hover:bg-tech-border/10 active:bg-tech-border/20 focus:ring-minds-500`;
    };

    return (
      <button
        ref={ref}
        className={`
          ${getButtonStyles()}
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        disabled={disabled}
        aria-label={ariaLabel}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
