import { useState, useEffect, useCallback } from 'react';

const STORAGE_PREFIX = 'eximia-reading-';

export interface ReadingProgress {
  bookId: string;
  currentChapterId: string;
  scrollPosition: number;
  progress: number; // 0-100
  lastReadAt: string;
}

export interface ReadingSettings {
  fontSize: 'small' | 'medium' | 'large';
  theme: 'dark' | 'sepia' | 'light';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  fontFamily: 'serif' | 'sans-serif' | 'monospace';
}

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 'medium',
  theme: 'dark',
  lineHeight: 'normal',
  fontFamily: 'serif',
};

export interface UseReadingProgressOptions {
  bookId: string;
  totalChapters: number;
}

export interface UseReadingProgressReturn {
  progress: ReadingProgress | null;
  settings: ReadingSettings;
  updateProgress: (updates: Partial<ReadingProgress>) => void;
  updateSettings: (updates: Partial<ReadingSettings>) => void;
  saveScrollPosition: (position: number) => void;
  getLastPosition: () => number;
  calculateProgress: (currentChapterIndex: number, scrollPercent: number) => number;
}

export const useReadingProgress = ({
  bookId,
  totalChapters,
}: UseReadingProgressOptions): UseReadingProgressReturn => {
  const progressKey = `${STORAGE_PREFIX}progress-${bookId}`;
  const settingsKey = `${STORAGE_PREFIX}settings`;

  const [progress, setProgress] = useState<ReadingProgress | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(progressKey);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const [settings, setSettings] = useState<ReadingSettings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(settingsKey);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });

  // Save progress to localStorage
  useEffect(() => {
    if (progress) {
      localStorage.setItem(progressKey, JSON.stringify(progress));
    }
  }, [progress, progressKey]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  }, [settings, settingsKey]);

  const updateProgress = useCallback((updates: Partial<ReadingProgress>) => {
    setProgress((prev) => {
      const newProgress: ReadingProgress = {
        bookId,
        currentChapterId: updates.currentChapterId || prev?.currentChapterId || '',
        scrollPosition: updates.scrollPosition ?? prev?.scrollPosition ?? 0,
        progress: updates.progress ?? prev?.progress ?? 0,
        lastReadAt: new Date().toISOString(),
      };
      return newProgress;
    });
  }, [bookId]);

  const updateSettings = useCallback((updates: Partial<ReadingSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const saveScrollPosition = useCallback((position: number) => {
    updateProgress({ scrollPosition: position });
  }, [updateProgress]);

  const getLastPosition = useCallback((): number => {
    return progress?.scrollPosition ?? 0;
  }, [progress]);

  const calculateProgress = useCallback((currentChapterIndex: number, scrollPercent: number): number => {
    if (totalChapters === 0) return 0;
    const chapterWeight = 100 / totalChapters;
    const baseProgress = currentChapterIndex * chapterWeight;
    const chapterProgress = (scrollPercent / 100) * chapterWeight;
    return Math.min(100, Math.round(baseProgress + chapterProgress));
  }, [totalChapters]);

  return {
    progress,
    settings,
    updateProgress,
    updateSettings,
    saveScrollPosition,
    getLastPosition,
    calculateProgress,
  };
};

export default useReadingProgress;
