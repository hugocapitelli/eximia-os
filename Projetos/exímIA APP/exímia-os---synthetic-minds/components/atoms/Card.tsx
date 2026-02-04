import React, { ReactNode } from 'react';
import { TOKENS } from '../../src/design-tokens';

// ============================================================
// CARD ATOM COMPONENT
// ============================================================
// Base card component with consistent styling from design tokens
// Supports optional glow shadow effects and custom styling

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode;

  /** Whether to add glow shadow effect */
  glow?: 'gold' | 'purple' | false;

  /** Optional padding override (uses TOKENS.spacing) */
  padding?: keyof typeof TOKENS.spacing;

  /** Optional CSS class */
  className?: string;
}

/**
 * Card Atom Component
 *
 * A flexible card component using design tokens for consistent styling.
 * Supports optional glow effects for visual emphasis.
 *
 * @example
 * <Card glow="gold" padding="md">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      glow = false,
      padding = 'lg',
      className = '',
      ...props
    },
    ref
  ) => {
    // ============================================================
    // GLOW EFFECT STYLES
    // ============================================================

    const glowStyles: Record<'gold' | 'purple' | false, string> = {
      gold: `shadow-[${TOKENS.glows.goldGlow}]`,
      purple: `shadow-[${TOKENS.glows.purpleGlow}]`,
      false: '',
    };

    // ============================================================
    // PADDING STYLES
    // ============================================================

    const paddingValue = TOKENS.spacing[padding as keyof typeof TOKENS.spacing] || TOKENS.spacing.lg;

    return (
      <div
        ref={ref}
        className={`
          rounded-xl
          border
          transition-all
          duration-200
          ${glowStyles[glow]}
          ${className}
        `.trim()}
        style={{
          backgroundColor: TOKENS.colors.tech.surface,
          borderColor: TOKENS.colors.tech.border,
          padding: paddingValue,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
