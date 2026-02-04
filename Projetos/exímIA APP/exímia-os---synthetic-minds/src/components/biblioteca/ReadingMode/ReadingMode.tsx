import { useState, useEffect, useCallback, useMemo } from 'react';
import { SummaryWithChapters, UserReadingPreferences, SummaryReadingProgress, THEMES, FONT_SIZES } from '../../../types/biblioteca';
import { saveReadingProgress } from '../../../lib/actions/summaries/progress';
import { ReadingHeader } from './ReadingHeader';
import { ReadingContent } from './ReadingContent';
import { ReadingFooter } from './ReadingFooter';
import { TableOfContents } from './TableOfContents';
import { useKeyboardNav } from '../../../hooks/useKeyboardNav';

interface ReadingModeProps {
  summary: SummaryWithChapters;
  initialChapter?: number;
  userPreferences?: UserReadingPreferences | null;
  progress?: SummaryReadingProgress | null;
  onBack: () => void;
}

export function ReadingMode({
  summary,
  initialChapter = 1,
  userPreferences,
  progress,
  onBack,
}: ReadingModeProps) {
  const [currentChapter, setCurrentChapter] = useState(
    progress?.current_chapter || initialChapter
  );
  const [theme, setTheme] = useState(userPreferences?.theme || 'dark');
  const [fontSize, setFontSize] = useState(userPreferences?.font_size || 'medium');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalChapters = summary.chapters.length;
  const chapter = useMemo(
    () => summary.chapters.find(c => c.chapter_number === currentChapter),
    [summary.chapters, currentChapter]
  );

  useEffect(() => {
    const isLastChapter = currentChapter === totalChapters;
    saveReadingProgress({
      summary_id: summary.id,
      current_chapter: currentChapter,
      completed: isLastChapter && currentChapter > (progress?.current_chapter || 0),
    }).catch(err => console.error('Failed to save progress:', err));
  }, [currentChapter, summary.id, totalChapters, progress?.current_chapter]);

  const goToChapter = useCallback((num: number) => {
    if (num >= 1 && num <= totalChapters) {
      setCurrentChapter(num);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalChapters]);

  const goNext = useCallback(() => {
    if (currentChapter < totalChapters) {
      goToChapter(currentChapter + 1);
    }
  }, [currentChapter, totalChapters, goToChapter]);

  const goPrev = useCallback(() => {
    if (currentChapter > 1) {
      goToChapter(currentChapter - 1);
    }
  }, [currentChapter, goToChapter]);

  useKeyboardNav({
    onPrev: goPrev,
    onNext: goNext,
    onEscape: onBack,
  });

  const themeConfig = THEMES.find(t => t.name === theme) || THEMES[2];
  const fontConfig = FONT_SIZES.find(f => f.name === fontSize) || FONT_SIZES[1];

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: themeConfig.colors.background,
        color: themeConfig.colors.text,
      }}
    >
      <ReadingHeader
        title={summary.catalog?.title || summary.title}
        theme={theme}
        fontSize={fontSize}
        onThemeChange={setTheme}
        onFontSizeChange={setFontSize}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onBack={onBack}
      />

      <ReadingContent
        chapter={chapter}
        themeConfig={themeConfig}
        fontConfig={fontConfig}
      />

      <ReadingFooter
        currentChapter={currentChapter}
        totalChapters={totalChapters}
        onPrev={goPrev}
        onNext={goNext}
        isFirst={currentChapter === 1}
        isLast={currentChapter === totalChapters}
      />

      <TableOfContents
        chapters={summary.chapters}
        currentChapter={currentChapter}
        onSelectChapter={goToChapter}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  );
}
