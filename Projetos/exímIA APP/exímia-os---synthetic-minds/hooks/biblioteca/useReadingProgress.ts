// useReadingProgress Hook - Track reading progress with offline support
// EXIMIA-205

import { useState, useCallback, useRef, useEffect } from 'react';
import type { SummaryReadingProgress } from '../../types/biblioteca';
import { saveReadingProgress } from '../../services/biblioteca';

const STORAGE_KEY_PREFIX = 'reading-progress-';
const DEBOUNCE_MS = 2000;

interface UseReadingProgressProps {
  summaryId: string;
  totalChapters: number;
  initialProgress?: SummaryReadingProgress | null;
  onComplete?: () => void;
}

interface UseReadingProgressReturn {
  currentChapter: number;
  setCurrentChapter: (chapter: number) => void;
  completed: boolean;
  isSaving: boolean;
  syncStatus: 'synced' | 'pending' | 'offline';
}

export function useReadingProgress({
  summaryId,
  totalChapters,
  initialProgress,
  onComplete,
}: UseReadingProgressProps): UseReadingProgressReturn {
  const [currentChapter, setCurrentChapterState] = useState(
    initialProgress?.current_chapter || 1
  );
  const [completed, setCompleted] = useState(initialProgress?.completed || false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'offline'>('synced');

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storageKey = `${STORAGE_KEY_PREFIX}${summaryId}`;

  // Load from localStorage as fallback
  useEffect(() => {
    if (!initialProgress) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.currentChapter) setCurrentChapterState(parsed.currentChapter);
          if (parsed.completed) setCompleted(parsed.completed);
        } catch (e) {
          // Ignore
        }
      }
    }
  }, [initialProgress, storageKey]);

  // Save to localStorage immediately, debounce server save
  const saveProgress = useCallback(async (chapter: number, isComplete: boolean) => {
    // Save to localStorage immediately
    localStorage.setItem(storageKey, JSON.stringify({
      currentChapter: chapter,
      completed: isComplete,
      updatedAt: Date.now(),
    }));
    setSyncStatus('pending');

    // Cancel previous save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce server save
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);

      try {
        const result = await saveReadingProgress({
          summary_id: summaryId,
          current_chapter: chapter,
          completed: isComplete,
        });

        if (result.success) {
          setSyncStatus('synced');
          localStorage.removeItem(storageKey);
        } else {
          setSyncStatus('offline');
        }
      } catch (error) {
        setSyncStatus('offline');
      } finally {
        setIsSaving(false);
      }
    }, DEBOUNCE_MS);
  }, [summaryId, storageKey]);

  // Set current chapter
  const setCurrentChapter = useCallback((chapter: number) => {
    setCurrentChapterState(chapter);

    const isComplete = chapter >= totalChapters && !completed;

    if (isComplete) {
      setCompleted(true);
      onComplete?.();
    }

    saveProgress(chapter, isComplete || completed);
  }, [totalChapters, completed, saveProgress, onComplete]);

  // Sync when coming back online
  useEffect(() => {
    const handleOnline = async () => {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setSyncStatus('pending');
        try {
          const parsed = JSON.parse(stored);
          const result = await saveReadingProgress({
            summary_id: summaryId,
            current_chapter: parsed.currentChapter,
            completed: parsed.completed,
          });
          if (result.success) {
            setSyncStatus('synced');
            localStorage.removeItem(storageKey);
          }
        } catch (e) {
          // Keep pending
        }
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [summaryId, storageKey]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    currentChapter,
    setCurrentChapter,
    completed,
    isSaving,
    syncStatus,
  };
}
