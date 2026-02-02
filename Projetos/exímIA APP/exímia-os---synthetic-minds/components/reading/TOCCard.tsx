import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

export interface Chapter {
  id: string;
  number: number;
  title: string;
  isRead?: boolean;
}

type ReadingTheme = 'dark' | 'sepia' | 'light';

// Theme-specific styles for the TOC card
const TOC_THEME_STYLES: Record<ReadingTheme, {
  bg: string;
  border: string;
  shadow: string;
  title: string;
  text: string;
  muted: string;
  active: string;
  activeBg: string;
  hover: string;
  divider: string;
}> = {
  dark: {
    bg: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.08)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    title: 'text-zinc-500',
    text: 'text-zinc-500',
    muted: 'text-zinc-600',
    active: 'text-white',
    activeBg: 'bg-white/10',
    hover: 'hover:text-zinc-300 hover:bg-white/5',
    divider: 'border-white/10',
  },
  sepia: {
    bg: 'rgba(255, 248, 235, 0.95)',
    border: 'rgba(180, 140, 90, 0.25)',
    shadow: '0 8px 32px rgba(120, 80, 40, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    title: 'text-amber-700',
    text: 'text-amber-800',
    muted: 'text-amber-600',
    active: 'text-amber-950',
    activeBg: 'bg-amber-900/10',
    hover: 'hover:text-amber-900 hover:bg-amber-900/5',
    divider: 'border-amber-200',
  },
  light: {
    bg: 'rgba(255, 255, 255, 0.95)',
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    title: 'text-zinc-500',
    text: 'text-zinc-600',
    muted: 'text-zinc-400',
    active: 'text-zinc-900',
    activeBg: 'bg-zinc-100',
    hover: 'hover:text-zinc-800 hover:bg-zinc-50',
    divider: 'border-zinc-200',
  },
};

interface TOCCardProps {
  chapters: Chapter[];
  currentChapterId: string;
  onChapterSelect: (chapterId: string) => void;
  onClose?: () => void;
  currentChapterIndex?: number;
  theme?: ReadingTheme;
}

export const TOCCard: React.FC<TOCCardProps> = ({
  chapters,
  currentChapterId,
  onChapterSelect,
  onClose,
  currentChapterIndex = 0,
  theme = 'dark',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const themeStyle = TOC_THEME_STYLES[theme];

  return (
    <div
      className="
        fixed right-8 top-1/2 -translate-y-1/2 z-40
        w-56 p-4
        rounded-2xl
        hidden lg:block
      "
      style={{
        background: themeStyle.bg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${themeStyle.border}`,
        boxShadow: themeStyle.shadow,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-[10px] font-bold uppercase tracking-widest ${themeStyle.title}`}>
          Sumário
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`${themeStyle.text} hover:opacity-70 transition-colors p-1`}
            aria-label={isCollapsed ? 'Expandir' : 'Minimizar'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className={`${themeStyle.text} hover:opacity-70 transition-colors p-1`}
              aria-label="Fechar sumário"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chapter List */}
      {!isCollapsed && (
        <>
          <div
            className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar"
            role="navigation"
            aria-label="Capítulos"
          >
            {chapters.map((chapter, idx) => {
              const isActive = chapter.id === currentChapterId;
              return (
                <button
                  key={chapter.id}
                  onClick={() => onChapterSelect(chapter.id)}
                  className={`
                    w-full text-left px-2 py-1.5 rounded-lg text-sm
                    transition-colors
                    ${isActive
                      ? `${themeStyle.activeBg} ${themeStyle.active}`
                      : `${themeStyle.text} ${themeStyle.hover}`
                    }
                    ${chapter.isRead && !isActive ? 'opacity-60' : ''}
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {chapter.number}. {chapter.title}
                </button>
              );
            })}
          </div>

          {/* Footer - Chapter Progress */}
          <div className={`mt-4 pt-4 border-t ${themeStyle.divider}`}>
            <p className={`text-xs text-center ${themeStyle.muted}`}>
              Capítulo {currentChapterIndex + 1} de {chapters.length}
            </p>
          </div>
        </>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <p className={`text-xs text-center ${themeStyle.text}`}>
          {currentChapterIndex + 1}/{chapters.length}
        </p>
      )}
    </div>
  );
};

export default TOCCard;
