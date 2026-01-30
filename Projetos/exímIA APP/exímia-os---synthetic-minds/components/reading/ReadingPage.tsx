import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ReadingHeader } from './ReadingHeader';
import { TOCCard, Chapter } from './TOCCard';
import { ReadingProgress } from './ReadingProgress';
import { useReadingProgress, ReadingSettings } from '../../hooks/useReadingProgress';
import { useFocusMode } from '../../hooks/useFocusMode';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReadingPageProps {
  bookId: string;
  bookTitle: string;
  authorName?: string;
  chapters: {
    id: string;
    number: number;
    title: string;
    subtitle?: string;
    content: string;
  }[];
  initialChapterId?: string;
  onBack: () => void;
}

type ReadingTheme = 'dark' | 'sepia' | 'light';

// Theme styles - sepia darker, all themes have header/toc variant colors
const THEME_STYLES: Record<ReadingTheme, {
  bg: string;
  title: string;
  subtitle: string;
  prose: string;
  headerBg: string;
  headerBorder: string;
  headerText: string;
  headerMuted: string;
  divider: string;
}> = {
  dark: {
    bg: 'bg-[#050505]',
    title: 'text-white',
    subtitle: 'text-zinc-400',
    prose: 'text-zinc-300',
    headerBg: 'rgba(255, 255, 255, 0.05)',
    headerBorder: 'rgba(255, 255, 255, 0.1)',
    headerText: 'text-white',
    headerMuted: 'text-zinc-400',
    divider: 'bg-zinc-700',
  },
  sepia: {
    bg: 'bg-[#E8D9C0]', // Darker cream/sepia
    title: 'text-amber-950',
    subtitle: 'text-amber-800',
    prose: 'text-amber-900',
    headerBg: 'rgba(120, 80, 40, 0.15)',
    headerBorder: 'rgba(120, 80, 40, 0.2)',
    headerText: 'text-amber-950',
    headerMuted: 'text-amber-700',
    divider: 'bg-amber-300',
  },
  light: {
    bg: 'bg-[#FAFAFA]',
    title: 'text-zinc-900',
    subtitle: 'text-zinc-600',
    prose: 'text-zinc-700',
    headerBg: 'rgba(0, 0, 0, 0.05)',
    headerBorder: 'rgba(0, 0, 0, 0.1)',
    headerText: 'text-zinc-900',
    headerMuted: 'text-zinc-500',
    divider: 'bg-zinc-300',
  },
};

// Font size mapping
const FONT_SIZES: Record<ReadingSettings['fontSize'], string> = {
  small: 'text-base',
  medium: 'text-lg',
  large: 'text-xl',
};

// Line height mapping
const LINE_HEIGHTS: Record<ReadingSettings['lineHeight'], string> = {
  compact: 'leading-relaxed',
  normal: 'leading-loose',
  relaxed: 'leading-[2.2]',
};

// Font family mapping
const FONT_FAMILIES: Record<ReadingSettings['fontFamily'], string> = {
  'serif': 'font-serif',
  'sans-serif': 'font-sans',
  'monospace': 'font-mono',
};

export const ReadingPage: React.FC<ReadingPageProps> = ({
  bookId,
  bookTitle,
  authorName,
  chapters,
  initialChapterId,
  onBack,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
    if (initialChapterId) {
      const idx = chapters.findIndex((c) => c.id === initialChapterId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [showTOC, setShowTOC] = useState(true);
  const [theme, setTheme] = useState<ReadingTheme>('dark');

  const contentRef = useRef<HTMLDivElement>(null);
  const currentChapter = chapters[currentChapterIndex];

  const {
    progress,
    settings,
    updateProgress,
    updateSettings,
    getLastPosition,
    calculateProgress,
  } = useReadingProgress({
    bookId,
    totalChapters: chapters.length,
  });

  const { isUIVisible } = useFocusMode();

  // TOC data
  const tocChapters: Chapter[] = chapters.map((c, idx) => ({
    id: c.id,
    number: c.number,
    title: c.title,
    isRead: progress ? idx < currentChapterIndex : false,
  }));

  // Restore scroll position on mount
  useEffect(() => {
    const lastPos = getLastPosition();
    if (lastPos > 0) {
      window.scrollTo(0, lastPos);
    }
  }, [getLastPosition]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      const newProgress = calculateProgress(currentChapterIndex, scrollPercent);
      updateProgress({
        currentChapterId: currentChapter.id,
        scrollPosition: scrollTop,
        progress: newProgress,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentChapterIndex, currentChapter.id, calculateProgress, updateProgress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentChapterIndex > 0) {
        setCurrentChapterIndex((prev) => prev - 1);
        window.scrollTo(0, 0);
      } else if (e.key === 'ArrowRight' && currentChapterIndex < chapters.length - 1) {
        setCurrentChapterIndex((prev) => prev + 1);
        window.scrollTo(0, 0);
      } else if (e.key === 't' || e.key === 'T') {
        setShowTOC((prev) => !prev);
      } else if (e.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIndex, chapters.length, onBack]);

  const handleChapterSelect = useCallback((chapterId: string) => {
    const idx = chapters.findIndex((c) => c.id === chapterId);
    if (idx >= 0) {
      setCurrentChapterIndex(idx);
      window.scrollTo(0, 0);
    }
  }, [chapters]);

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const themeStyle = THEME_STYLES[theme];

  return (
    <div className={`min-h-screen ${themeStyle.bg} transition-colors duration-300`}>
      {/* Floating Header */}
      <ReadingHeader
        title={bookTitle}
        onBack={onBack}
        onToggleTOC={() => setShowTOC(!showTOC)}
        isVisible={isUIVisible}
        theme={theme}
        onThemeChange={setTheme}
        fontSize={settings.fontSize}
        onFontSizeChange={(size) => updateSettings({ fontSize: size })}
        themeStyles={{
          bg: themeStyle.headerBg,
          border: themeStyle.headerBorder,
          text: themeStyle.headerText,
          muted: themeStyle.headerMuted,
        }}
      />

      {/* Main Content */}
      <main ref={contentRef} className="pt-32 pb-20 px-6">
        {/* Title Section - Centered */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-serif font-bold ${themeStyle.title} mb-4`}>
            {bookTitle}
          </h1>
          {authorName && (
            <p className={`text-lg italic ${themeStyle.subtitle}`}>
              por {authorName}
            </p>
          )}
          <div className={`w-16 h-px mx-auto mt-8 ${themeStyle.divider}`} />
        </div>

        {/* Chapter Content */}
        <div className="max-w-2xl mx-auto">
          <article
            className={`
              ${FONT_SIZES[settings.fontSize]}
              ${LINE_HEIGHTS[settings.lineHeight]}
              ${FONT_FAMILIES[settings.fontFamily]}
            `}
          >
            {/* Chapter Header */}
            <header className="mb-10">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">
                Capítulo {currentChapter.number}
              </p>
              <h2 className={`text-2xl md:text-3xl font-bold ${themeStyle.title} mb-2`}>
                {currentChapter.title}
              </h2>
              {currentChapter.subtitle && (
                <p className={`text-lg ${themeStyle.subtitle}`}>
                  {currentChapter.subtitle}
                </p>
              )}
              <div className={`mt-6 w-12 h-[2px] bg-gradient-to-r from-amber-500 to-transparent`} />
            </header>

            {/* Chapter Content */}
            <div
              className={`reading-text ${themeStyle.prose} prose max-w-none ${theme === 'dark' ? 'prose-invert prose-amber' : ''}`}
              dangerouslySetInnerHTML={{ __html: currentChapter.content }}
            />

            {/* Chapter Navigation */}
            <nav className={`mt-16 pt-8 border-t ${theme === 'dark' ? 'border-[#1F1F22]' : 'border-zinc-200'} flex items-center justify-between`}>
              <button
                onClick={goToPreviousChapter}
                disabled={currentChapterIndex === 0}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${currentChapterIndex === 0
                    ? `${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'} cursor-not-allowed`
                    : `${theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`
                  }
                  focus:outline-none focus:ring-2 focus:ring-amber-500/50
                `}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Anterior</span>
              </button>

              <span className={`text-xs ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                {currentChapterIndex + 1} / {chapters.length}
              </span>

              <button
                onClick={goToNextChapter}
                disabled={currentChapterIndex === chapters.length - 1}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${currentChapterIndex === chapters.length - 1
                    ? `${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'} cursor-not-allowed`
                    : `${theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`
                  }
                  focus:outline-none focus:ring-2 focus:ring-amber-500/50
                `}
              >
                <span className="text-sm">Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          </article>
        </div>
      </main>

      {/* TOC Card - Right Side */}
      {showTOC && (
        <TOCCard
          chapters={tocChapters}
          currentChapterId={currentChapter.id}
          currentChapterIndex={currentChapterIndex}
          onChapterSelect={handleChapterSelect}
          onClose={() => setShowTOC(false)}
          theme={theme}
        />
      )}

      {/* Reading Progress */}
      <ReadingProgress progress={progress?.progress || 0} />

      {/* Styles for reading content */}
      <style>{`
        .reading-text p {
          margin-bottom: 1.5rem;
        }

        .reading-text blockquote {
          border-left: 3px solid #f59e0b;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
        }

        .reading-text a {
          color: #f59e0b;
          text-decoration: underline;
          text-decoration-color: rgba(245, 158, 11, 0.3);
          text-underline-offset: 2px;
        }

        .reading-text a:hover {
          text-decoration-color: #f59e0b;
        }

        .reading-text h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 3rem;
          margin-bottom: 1rem;
        }

        .reading-text h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }

        .reading-text ul, .reading-text ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }

        .reading-text li {
          margin-bottom: 0.5rem;
        }

        .reading-text code {
          background: rgba(0, 0, 0, 0.1);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .reading-text pre {
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ReadingPage;
