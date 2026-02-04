import { useState, useCallback, useRef, useEffect } from 'react';
import { SummaryReadingProgress } from '@/types/biblioteca';
import { saveReadingProgress } from '@/lib/actions/summaries/progress';

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

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `${STORAGE_KEY_PREFIX}${summaryId}`;

  useEffect(() => {
    if (!initialProgress && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentChapterState(parsed.currentChapter || 1);
          setCompleted(parsed.completed || false);
        } catch (e) {
          //
        }
      }
    }
  }, [initialProgress, storageKey]);

  const saveProgress = useCallback(async (chapter: number, isComplete: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify({
        currentChapter: chapter,
        completed: isComplete,
        updatedAt: Date.now(),
      }));
    }
    setSyncStatus('pending');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

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
          if (typeof window !== 'undefined') {
            localStorage.removeItem(storageKey);
          }
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

  const setCurrentChapter = useCallback((chapter: number) => {
    setCurrentChapterState(chapter);

    const isComplete = chapter >= totalChapters && !completed;

    if (isComplete) {
      setCompleted(true);
      onComplete?.();
    }

    saveProgress(chapter, isComplete || completed);
  }, [totalChapters, completed, saveProgress, onComplete]);

  useEffect(() => {
    const handleOnline = async () => {
      if (typeof window !== 'undefined') {
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
            //
          }
        }
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [summaryId, storageKey]);

  return {
    currentChapter,
    setCurrentChapter,
    completed,
    isSaving,
    syncStatus,
  };
}
