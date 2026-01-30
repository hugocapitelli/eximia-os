import React from 'react';
import { SkillNode } from '../../hooks/useSkillTree';
import { Lock, BookOpen, CheckCircle, Circle } from 'lucide-react';

interface SkillTooltipProps {
  skill: SkillNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const TIER_LABELS: Record<number, string> = {
  1: 'Básico',
  2: 'Intermediário',
  3: 'Avançado',
  4: 'Mestre',
};

const STATE_LABELS: Record<string, { label: string; color: string }> = {
  locked: { label: 'Bloqueado', color: 'text-zinc-500' },
  available: { label: 'Disponível', color: 'text-zinc-400' },
  in_progress: { label: 'Em Progresso', color: 'text-blue-400' },
  completed: { label: 'Concluído', color: 'text-emerald-400' },
  mastered: { label: 'Mestria', color: 'text-amber-400' },
};

export const SkillTooltip: React.FC<SkillTooltipProps> = ({
  skill,
  position = 'top',
  className = '',
}) => {
  const stateInfo = STATE_LABELS[skill.state];
  const completedCount = skill.coursesCompleted.length;
  const totalCount = skill.coursesRequired.length;

  // Position classes
  const positionClasses = {
    top: 'bottom-full mb-3 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-3 left-1/2 -translate-x-1/2',
    left: 'right-full mr-3 top-1/2 -translate-y-1/2',
    right: 'left-full ml-3 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#1F1F22]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#1F1F22]',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-[#1F1F22]',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-[#1F1F22]',
  };

  return (
    <div
      className={`
        absolute z-50 w-64 p-4 bg-[#0A0A0A] border border-[#1F1F22] rounded-xl shadow-2xl
        animate-in fade-in zoom-in-95 duration-200
        ${positionClasses[position]}
        ${className}
      `}
      role="tooltip"
    >
      {/* Arrow */}
      <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{skill.icon}</span>
        <div>
          <h4 className="text-sm font-bold text-white">{skill.name}</h4>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${stateInfo.color}`}>
            {stateInfo.label}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1F1F22] mb-3" />

      {/* Tier */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tier</span>
        <span className="text-xs text-zinc-400">{TIER_LABELS[skill.tier]}</span>
      </div>

      {/* Progress */}
      {skill.state !== 'locked' && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Progresso</span>
            <span className="text-xs text-zinc-400">{skill.progress}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                skill.state === 'mastered'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : skill.state === 'completed'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : 'bg-gradient-to-r from-blue-500 to-blue-400'
              }`}
              style={{ width: `${skill.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Courses */}
      {totalCount > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-3 h-3 text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Cursos: {completedCount}/{totalCount}
            </span>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {skill.coursesRequired.map((courseId) => {
              const isCompleted = skill.coursesCompleted.includes(courseId);
              return (
                <div key={courseId} className="flex items-center gap-2 text-xs">
                  {isCompleted ? (
                    <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                  )}
                  <span className={isCompleted ? 'text-zinc-400' : 'text-zinc-600'}>
                    {courseId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked message */}
      {skill.state === 'locked' && skill.prerequisites.length > 0 && (
        <div className="flex items-start gap-2 p-2 bg-zinc-900 rounded-lg">
          <Lock className="w-3 h-3 text-zinc-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-zinc-500">
            <span className="font-bold">Requer:</span>{' '}
            {skill.prerequisites.map(p => p.replace(/-/g, ' ')).join(', ')}
          </div>
        </div>
      )}

      {/* Description */}
      {skill.description && (
        <p className="text-xs text-zinc-500 mt-2">{skill.description}</p>
      )}

      {/* Action hint */}
      {skill.state !== 'locked' && (
        <div className="mt-3 pt-2 border-t border-[#1F1F22]">
          <span className="text-[10px] text-zinc-600">
            Clique para ver detalhes
          </span>
        </div>
      )}
    </div>
  );
};

export default SkillTooltip;
