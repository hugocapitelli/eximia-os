import React from 'react';
import { SkillNode as SkillNodeType, SkillNodeState } from '../../hooks/useSkillTree';
import { Lock } from 'lucide-react';

interface SkillNodeProps {
  skill: SkillNodeType;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
  isSelected?: boolean;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const STATE_STYLES: Record<SkillNodeState, string> = {
  locked: 'bg-[#1F1F22] border-[#2a2a2a] opacity-50 grayscale cursor-not-allowed',
  available: 'bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#3a3a3a] hover:border-zinc-500 cursor-pointer animate-pulse-subtle',
  in_progress: 'bg-gradient-to-br from-[#0A0A0A] to-[#1a3a5a] border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer',
  completed: 'bg-gradient-to-br from-[#0A0A0A] to-[#1a4a2a] border-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer',
  mastered: 'bg-gradient-to-br from-[#1a1a0a] to-[#3a3a1a] border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer',
};

const STATE_RING: Record<SkillNodeState, string> = {
  locked: 'ring-zinc-700',
  available: 'ring-zinc-500',
  in_progress: 'ring-blue-500',
  completed: 'ring-emerald-500',
  mastered: 'ring-amber-500',
};

export const SkillNode: React.FC<SkillNodeProps> = ({
  skill,
  onClick,
  onHover,
  isSelected,
  tabIndex = 0,
  onKeyDown,
}) => {
  const stateClass = STATE_STYLES[skill.state];
  const ringClass = STATE_RING[skill.state];

  const handleClick = () => {
    if (skill.state !== 'locked') {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
    onKeyDown?.(e);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      onKeyDown={handleKeyDown}
      tabIndex={skill.state === 'locked' ? -1 : tabIndex}
      role="treeitem"
      aria-label={`${skill.name}: ${skill.state === 'locked' ? 'Bloqueado' : skill.state === 'completed' ? 'Concluído' : skill.state === 'mastered' ? 'Mestria' : skill.state === 'in_progress' ? `Em progresso ${skill.progress}%` : 'Disponível'}`}
      aria-selected={isSelected}
      aria-disabled={skill.state === 'locked'}
      className={`
        relative w-20 h-20 rounded-full border-2 flex items-center justify-center
        transition-all duration-300 ease-out transform
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505] ${ringClass}
        ${stateClass}
        ${isSelected ? 'scale-110 ring-2' : 'hover:scale-105'}
      `}
    >
      {/* Progress ring for in_progress state */}
      {skill.state === 'in_progress' && (
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="38"
            fill="none"
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="3"
          />
          <circle
            cx="40"
            cy="40"
            r="38"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray={`${(skill.progress / 100) * 239} 239`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
      )}

      {/* Mastery glow effect */}
      {skill.state === 'mastered' && (
        <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
      )}

      {/* Icon or Lock */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {skill.state === 'locked' ? (
          <Lock className="w-6 h-6 text-zinc-600" />
        ) : (
          <span className="text-2xl" role="img" aria-hidden="true">
            {skill.icon}
          </span>
        )}
      </div>

      {/* Completion checkmark */}
      {(skill.state === 'completed' || skill.state === 'mastered') && (
        <div className={`
          absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center
          ${skill.state === 'mastered' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-white'}
        `}>
          {skill.state === 'mastered' ? (
            <span className="text-xs">⭐</span>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      )}
    </button>
  );
};

// Skill name label component
export const SkillNodeLabel: React.FC<{ name: string; state: SkillNodeState }> = ({ name, state }) => {
  const textColor = state === 'locked'
    ? 'text-zinc-600'
    : state === 'mastered'
      ? 'text-amber-500'
      : state === 'completed'
        ? 'text-emerald-400'
        : state === 'in_progress'
          ? 'text-blue-400'
          : 'text-zinc-400';

  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${textColor} text-center max-w-20 truncate`}>
      {name}
    </span>
  );
};

export default SkillNode;
