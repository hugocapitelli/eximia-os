// ReadingMode Component - Main container for immersive reading
// EXIMIA-202

import { useState, useCallback } from 'react';
import type {
  SummaryWithChapters,
  UserReadingPreferences,
  SummaryReadingProgress,
  ReadingModeProps,
} from '../../../types/biblioteca';
import { THEMES, FONT_SIZES } from '../../../types/biblioteca';
import { useKeyboardNav } from '../../../hooks/biblioteca/useKeyboardNav';
import { useReadingPreferences } from '../../../hooks/biblioteca/useReadingPreferences';
import { useReadingProgress } from '../../../hooks/biblioteca/useReadingProgress';
import { ReadingHeader } from './ReadingHeader';
import { ReadingContent } from './ReadingContent';
import { ReadingFooter } from './ReadingFooter';
import { TableOfContents } from './TableOfContents';
import { CompletionModal } from './CompletionModal';
import { SavingIndicator } from './SavingIndicator';

export function ReadingMode({
  summary,
  initialChapter = 1,
  userPreferences,
  progress,
  onBack,
}: ReadingModeProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Reading preferences
  const { theme, fontSize, setTheme, setFontSize } = useReadingPreferences(userPreferences);

  // Reading progress
  const {
    currentChapter,
    setCurrentChapter,
    completed,
    isSaving,
    syncStatus,
  } = useReadingProgress({
    summaryId: summary.id,
    totalChapters: summary.chapters.length,
    initialProgress: progress,
    onComplete: () => setShowCompletion(true),
  });

  const totalChapters = summary.chapters.length;
  const chapter = summary.chapters.find(c => c.chapter_number === currentChapter);

  // Navigation handlers
  const goToChapter = useCallback((num: number) => {
    if (num >= 1 && num <= totalChapters) {
      setCurrentChapter(num);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalChapters, setCurrentChapter]);

  const goNext = useCallback(() => {
    if (currentChapter < totalChapters) {
      goToChapter(currentChapter + 1);
    } else if (!showCompletion) {
      setShowCompletion(true);
    }
  }, [currentChapter, totalChapters, goToChapter, showCompletion]);

  const goPrev = useCallback(() => {
    if (currentChapter > 1) {
      goToChapter(currentChapter - 1);
    }
  }, [currentChapter, goToChapter]);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  }, [onBack]);

  // Keyboard navigation
  useKeyboardNav({
    onPrev: goPrev,
    onNext: goNext,
    onEscape: handleBack,
  });

  // Theme config
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
        onBack={handleBack}
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
        onSelectChapter={(num) => {
          goToChapter(num);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <SavingIndicator
        status={syncStatus}
        isSaving={isSaving}
      />

      <CompletionModal
        isOpen={showCompletion}
        bookTitle={summary.catalog?.title || summary.title}
        totalChapters={totalChapters}
        onReread={() => {
          goToChapter(1);
          setShowCompletion(false);
        }}
        onClose={() => setShowCompletion(false)}
      />
    </div>
  );
}
