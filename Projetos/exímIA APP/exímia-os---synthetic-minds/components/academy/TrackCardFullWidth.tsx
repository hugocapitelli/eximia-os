import React from 'react';
import { GraduationCap, CheckCircle, GripVertical, PenTool, Trash2 } from 'lucide-react';
import { AcademyTrack } from '../../types';

interface TrackCardFullWidthProps {
  track: AcademyTrack;
  onNavigate: (trackId: string) => void;
  isEditorMode?: boolean;
  onEdit?: (trackId: string) => void;
  onDelete?: (trackId: string) => void;
}

// Extract gradient base color for background
const getGradientBackground = (color: string): string => {
  // Extract the first color from gradients like "from-blue-500 to-cyan-500"
  if (color.includes('blue')) return 'from-blue-600/20 via-blue-900/10 to-transparent';
  if (color.includes('purple') || color.includes('violet')) return 'from-violet-600/20 via-violet-900/10 to-transparent';
  if (color.includes('amber') || color.includes('orange')) return 'from-orange-600/20 via-orange-900/10 to-transparent';
  if (color.includes('green') || color.includes('emerald')) return 'from-emerald-600/20 via-emerald-900/10 to-transparent';
  return 'from-zinc-600/20 via-zinc-900/10 to-transparent';
};

export const TrackCardFullWidth: React.FC<TrackCardFullWidthProps> = ({
  track,
  onNavigate,
  isEditorMode = false,
  onEdit,
  onDelete,
}) => {
  const progress = track.completedCount && track.courseCount
    ? Math.round((track.completedCount / track.courseCount) * 100)
    : 0;

  // Use track's own color property
  const iconColor = track.color || 'from-zinc-600 to-zinc-700';
  const gradient = getGradientBackground(track.color || '');

  const isCompleted = progress === 100;
  const isStarted = progress > 0;

  return (
    <div
      onClick={() => !isEditorMode && onNavigate(track.id)}
      className={`
        relative w-full overflow-hidden
        bg-[#0A0A0A] border rounded-2xl
        transition-all duration-300 cursor-pointer
        group
        ${isEditorMode
          ? 'border-amber-500/30'
          : 'border-[#1F1F22] hover:border-zinc-700'
        }
      `}
      role="listitem"
      aria-label={`Trilha: ${track.title}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />

      {/* Content */}
      <div className="relative z-10 p-6 flex items-center gap-6">
        {/* Editor Mode: Drag Handle */}
        {isEditorMode && (
          <div
            className="cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-5 h-5 text-zinc-600" />
          </div>
        )}

        {/* Icon */}
        <div
          className={`
            w-[72px] h-[72px] rounded-xl flex items-center justify-center flex-shrink-0
            bg-gradient-to-br ${iconColor}
            shadow-lg
          `}
        >
          {track.icon ? (
            <track.icon className="w-8 h-8 text-white" />
          ) : (
            <span className="text-3xl">{track.emoji || '📚'}</span>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-50 transition-colors">
            {track.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-zinc-400 mb-4 line-clamp-1">
            {track.description}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <GraduationCap className="w-4 h-4" />
              <span>{track.courseCount || 0} Cursos</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <CheckCircle className="w-4 h-4" />
              <span>{track.completedCount || 0} Concluídos</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-500">Progresso</span>
              <span className="text-xs text-zinc-500">{progress}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        {!isEditorMode && (
          <div className="flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(track.id);
              }}
              className={`
                px-6 py-3 rounded-xl font-medium text-sm transition-all
                ${isCompleted
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-white text-zinc-900 hover:bg-zinc-100'
                }
              `}
            >
              {isCompleted ? 'Concluída ✓' : isStarted ? 'Continuar Trilha' : 'Iniciar Trilha'}
            </button>
          </div>
        )}

        {/* Editor Mode: Actions */}
        {isEditorMode && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(track.id);
              }}
              className="p-2 text-zinc-500 hover:text-amber-500 transition-colors"
              aria-label="Editar trilha"
            >
              <PenTool className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(track.id);
              }}
              className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
              aria-label="Excluir trilha"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackCardFullWidth;
