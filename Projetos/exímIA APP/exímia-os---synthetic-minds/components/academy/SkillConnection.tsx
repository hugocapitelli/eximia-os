import React from 'react';

interface SkillConnectionProps {
  isActive: boolean;
  direction: 'vertical' | 'horizontal';
  className?: string;
}

export const SkillConnection: React.FC<SkillConnectionProps> = ({
  isActive,
  direction,
  className = '',
}) => {
  const baseClass = direction === 'vertical'
    ? 'w-0.5 h-8'
    : 'h-0.5 w-8';

  return (
    <div
      className={`
        ${baseClass}
        ${isActive
          ? 'bg-gradient-to-b from-emerald-500 to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
          : 'bg-zinc-800'
        }
        transition-all duration-500
        ${className}
      `}
      aria-hidden="true"
    />
  );
};

// SVG version for more complex connections (future use)
export const SkillConnectionSVG: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isActive: boolean;
}> = ({ x1, y1, x2, y2, isActive }) => {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isActive ? '#22c55e' : '#27272a'}
      strokeWidth={isActive ? 3 : 2}
      strokeLinecap="round"
      className={isActive ? 'drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]' : ''}
    />
  );
};

export default SkillConnection;
