import React from 'react';
import { BookOpen, Clock, ChevronRight, GripVertical, PenTool, Trash2 } from 'lucide-react';
import { AcademyTrack } from '../../types';

interface TrackCardLargeProps {
  track: AcademyTrack;
  onNavigate: (trackId: string) => void;
  isEditorMode?: boolean;
  onEdit?: (trackId: string) => void;
  onDelete?: (trackId: string) => void;
}

export const TrackCardLarge: React.FC<TrackCardLargeProps> = ({
  track,
  onNavigate,
  isEditorMode = false,
  onEdit,
  onDelete,
}) => {
  const progress = track.completedCount && track.courseCount
    ? Math.round((track.completedCount / track.courseCount) * 100)
    : 0;

  const status: 'not_started' | 'in_progress' | 'completed' =
    progress === 0 ? 'not_started' : progress === 100 ? 'completed' : 'in_progress';

  // Extract gradient colors from track.color (e.g., 'from-blue-500 to-cyan-500')
  const gradientClass = track.color || 'from-amber-500 to-orange-500';

  return (
    <div
      className={`
        relative group bg-[#0A0A0A] border rounded-2xl overflow-hidden
        min-h-[400px] flex flex-col transition-all duration-300
        ${isEditorMode
          ? 'border-amber-500/30 cursor-grab active:cursor-grabbing'
          : 'border-[#1F1F22] hover:border-amber-400/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer'
        }
      `}
      onClick={() => !isEditorMode && onNavigate(track.id)}
      role="listitem"
      aria-label={`Trilha: ${track.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          !isEditorMode && onNavigate(track.id);
        }
      }}
    >
      {/* Thumbnail Area with Gradient */}
      <div className="relative h-40 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-80`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

        {/* Track Icon */}
        {track.icon && (
          <div className="absolute bottom-4 left-4 p-3 bg-black/50 backdrop-blur-sm rounded-xl border border-white/10">
            <track.icon className="w-6 h-6 text-white" />
          </div>
        )}

        {/* Editor Mode Controls */}
        {isEditorMode && (
          <>
            <button
              className="absolute top-3 left-3 w-8 h-8 bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-grab active:cursor-grabbing"
              aria-label="Arrastar para reordenar"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <button
              className="absolute top-3 right-12 w-8 h-8 bg-amber-500 border border-amber-400 rounded-lg flex items-center justify-center text-zinc-900 hover:scale-110 transition-transform shadow-lg"
              aria-label="Editar trilha"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(track.id);
              }}
            >
              <PenTool className="w-4 h-4" />
            </button>
            <button
              className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
              aria-label="Excluir trilha"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(track.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Category Badge */}
        <div className="mb-3">
          <span
            className={`
              inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
              bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent
              border border-current
            `}
            style={{
              borderColor: 'rgba(255,255,255,0.15)',
              background: `linear-gradient(135deg, rgba(255,255,255,0.05), transparent)`,
            }}
          >
            <span className={`bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>
              TRILHA
            </span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-50 transition-colors">
          {track.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-400 line-clamp-3 mb-4 flex-1">
          {track.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Progresso
            </span>
            <span className="text-xs font-bold text-zinc-400">{progress}%</span>
          </div>
          <div className="h-1.5 bg-[#1F1F22] rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${gradientClass} rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {track.courseCount} cursos
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {track.courseCount * 4}h total
          </span>
        </div>

        {/* CTA Button */}
        <button
          className={`
            w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider
            flex items-center justify-center gap-2 transition-all
            ${status === 'not_started'
              ? 'bg-white text-black hover:bg-zinc-200'
              : status === 'completed'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:ring-amber-500/50
          `}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(track.id);
          }}
        >
          {status === 'not_started' && (
            <>
              Iniciar <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          {status === 'in_progress' && (
            <>
              Continuar <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          {status === 'completed' && 'Concluída ✓'}
        </button>
      </div>
    </div>
  );
};

export default TrackCardLarge;
