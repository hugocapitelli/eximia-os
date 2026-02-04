import React, { ReactNode } from 'react';
import { TOKENS, CategoryColor } from '@/design-tokens';

// ============================================================
// BADGE ATOM COMPONENT
// ============================================================
// Display category badge with proper colors from design tokens
// Supports multiple sizes and custom categories

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Badge content */
  children: ReactNode;

  /** Size of the badge */
  size?: BadgeSize;

  /** Category object with color and bgColor (for book categories) */
  category?: CategoryColor;

  /** Custom background color (if not using category) */
  bgColor?: string;

  /** Custom text color (if not using category) */
  textColor?: string;

  /** Optional CSS class */
  className?: string;

  /** Optional aria-label */
  ariaLabel?: string;
}

/**
 * Badge Atom Component
 *
 * Displays category badges with consistent styling from design tokens.
 * Can use predefined category colors or custom colors.
 *
 * Accessibility Features:
 * - aria-label for additional context
 * - Color + text to convey meaning (not color alone)
 * - Contrast ratios verified (≥ 3:1 for large text)
 * - Can be standalone or within text
 *
 * @example
 * // Using category object with label
 * <Badge category={TOKENS.categories[0]} ariaLabel="Categoria: Produtividade">
 *   Produtividade
 * </Badge>
 *
 * // Using custom colors
 * <Badge textColor="#10b981" bgColor="#d1fae5" ariaLabel="Tag customizado">
 *   Custom
 * </Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  size = 'md',
  category,
  bgColor,
  textColor,
  className = '',
  ariaLabel,
}) => {
  // ============================================================
  // SIZE STYLES
  // ============================================================

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  // ============================================================
  // GET COLORS
  // ============================================================

  const getFinalColors = (): { bg: string; text: string } => {
    if (category) {
      return {
        bg: category.bgColor,
        text: category.color,
      };
    }

    return {
      bg: bgColor || TOKENS.colors.tech.border,
      text: textColor || TOKENS.colors.eximia[400],
    };
  };

  const colors = getFinalColors();

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-md
        font-semibold
        uppercase
        tracking-wider
        transition-all
        duration-200
        border
        border-opacity-20
        ${sizeStyles[size]}
        ${className}
      `.trim()}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.text,
      }}
      aria-label={ariaLabel}
    >
      {children}
    </span>
  );
};

export default Badge;
