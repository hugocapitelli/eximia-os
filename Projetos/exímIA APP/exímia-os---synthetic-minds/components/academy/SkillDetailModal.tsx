import React, { useEffect, useRef } from 'react';
import { SkillNode } from '../../hooks/useSkillTree';
import { X, Lock, BookOpen, CheckCircle, Circle, Trophy, Star, ArrowRight } from 'lucide-react';
import { Button } from '../atoms/Button';

interface SkillDetailModalProps {
  skill: SkillNode;
  onClose: () => void;
  onStartCourse?: (courseId: string) => void;
}

const TIER_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Básico', color: 'text-zinc-400 bg-zinc-800' },
  2: { label: 'Intermediário', color: 'text-blue-400 bg-blue-500/10' },
  3: { label: 'Avançado', color: 'text-purple-400 bg-purple-500/10' },
  4: { label: 'Mestre', color: 'text-amber-400 bg-amber-500/10' },
};

const STATE_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  locked: { label: 'Bloqueado', color: 'text-zinc-500', bgColor: 'bg-zinc-800' },
  available: { label: 'Disponível', color: 'text-zinc-400', bgColor: 'bg-zinc-700' },
  in_progress: { label: 'Em Progresso', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  completed: { label: 'Concluído', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  mastered: { label: 'Mestria', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
};

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  onClose,
  onStartCourse,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const tierInfo = TIER_LABELS[skill.tier];
  const stateInfo = STATE_CONFIG[skill.state];
  const completedCount = skill.coursesCompleted.length;
  const totalCount = skill.coursesRequired.length;

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-lg bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Header with gradient */}
        <div className={`relative p-6 ${
          skill.state === 'mastered'
            ? 'bg-gradient-to-br from-amber-900/40 via-[#0A0A0A] to-[#0A0A0A]'
            : skill.state === 'completed'
              ? 'bg-gradient-to-br from-emerald-900/40 via-[#0A0A0A] to-[#0A0A0A]'
              : skill.state === 'in_progress'
                ? 'bg-gradient-to-br from-blue-900/40 via-[#0A0A0A] to-[#0A0A0A]'
                : 'bg-[#0A0A0A]'
        }`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon and title */}
          <div className="flex items-start gap-4">
            <div className={`
              w-16 h-16 rounded-xl flex items-center justify-center text-3xl
              ${stateInfo.bgColor} border border-[#1F1F22]
            `}>
              {skill.state === 'locked' ? (
                <Lock className="w-8 h-8 text-zinc-600" />
              ) : (
                skill.icon
              )}
            </div>
            <div className="flex-1">
              <h2 id="skill-modal-title" className="text-xl font-bold text-white mb-1">
                {skill.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${tierInfo.color}`}>
                  {tierInfo.label}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${stateInfo.bgColor} ${stateInfo.color}`}>
                  {stateInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {skill.description && (
            <p className="mt-4 text-sm text-zinc-400">{skill.description}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 border-t border-[#1F1F22]">
          {/* Progress section */}
          {skill.state !== 'locked' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Progresso</span>
                <span className="text-sm font-mono text-white">{skill.progress}%</span>
              </div>
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    skill.state === 'mastered'
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500'
                      : skill.state === 'completed'
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                        : 'bg-gradient-to-r from-blue-500 to-blue-400'
                  }`}
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Courses section */}
          {totalCount > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Cursos Necessários ({completedCount}/{totalCount})
                </span>
              </div>
              <div className="space-y-2">
                {skill.coursesRequired.map((courseId) => {
                  const isCompleted = skill.coursesCompleted.includes(courseId);
                  const courseName = courseId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                  return (
                    <div
                      key={courseId}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border transition-colors
                        ${isCompleted
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : 'bg-zinc-900 border-[#1F1F22] hover:border-zinc-700'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-600" />
                        )}
                        <span className={`text-sm ${isCompleted ? 'text-zinc-400' : 'text-white'}`}>
                          {courseName}
                        </span>
                      </div>
                      {!isCompleted && onStartCourse && (
                        <button
                          onClick={() => onStartCourse(courseId)}
                          className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
                        >
                          Iniciar <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prerequisites for locked skills */}
          {skill.state === 'locked' && skill.prerequisites.length > 0 && (
            <div className="p-4 bg-zinc-900 rounded-xl border border-[#1F1F22]">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Pré-requisitos
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                Complete as seguintes habilidades primeiro:{' '}
                <span className="text-white font-medium">
                  {skill.prerequisites.map(p => p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).join(', ')}
                </span>
              </p>
            </div>
          )}

          {/* Mastery badge */}
          {skill.state === 'mastered' && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-500/20">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-4 h-4" /> Mestria Alcançada
                </h4>
                <p className="text-xs text-zinc-400">
                  Você dominou completamente esta habilidade!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1F1F22] flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
          {skill.state !== 'locked' && skill.state !== 'mastered' && (
            <Button variant="primary" className="bg-amber-500 hover:bg-amber-400 text-black border-transparent">
              {skill.state === 'completed' ? 'Revisar Conteúdo' : 'Continuar Estudando'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillDetailModal;
