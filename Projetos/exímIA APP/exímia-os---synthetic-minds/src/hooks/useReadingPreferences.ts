import { useState, useEffect, useCallback } from 'react';
import { ReadingTheme, FontSize, UserReadingPreferences } from '@/types/biblioteca';
import { saveReadingPreferences } from '@/lib/actions/preferences/reading';

const STORAGE_KEY = 'reading-preferences';

interface UseReadingPreferencesReturn {
  theme: ReadingTheme;
  fontSize: FontSize;
  setTheme: (theme: ReadingTheme) => void;
  setFontSize: (size: FontSize) => void;
  isLoading: boolean;
}

export function useReadingPreferences(
  initialPreferences?: UserReadingPreferences | null
): UseReadingPreferencesReturn {
  const [theme, setThemeState] = useState<ReadingTheme>(
    initialPreferences?.theme || 'dark'
  );
  const [fontSize, setFontSizeState] = useState<FontSize>(
    initialPreferences?.font_size || 'medium'
  );
  const [isLoading, setIsLoading] = useState(!initialPreferences);

  useEffect(() => {
    if (!initialPreferences && typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.theme) setThemeState(parsed.theme);
          if (parsed.fontSize) setFontSizeState(parsed.fontSize);
        } catch (e) {
          //
        }
      }
      setIsLoading(false);
    }
  }, [initialPreferences]);

  const saveToStorage = useCallback((theme: ReadingTheme, fontSize: FontSize) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, fontSize }));
    }
  }, []);

  const setTheme = useCallback(async (newTheme: ReadingTheme) => {
    setThemeState(newTheme);
    saveToStorage(newTheme, fontSize);
    try {
      await saveReadingPreferences({ theme: newTheme });
    } catch (e) {
      //
    }
  }, [fontSize, saveToStorage]);

  const setFontSize = useCallback(async (newSize: FontSize) => {
    setFontSizeState(newSize);
    saveToStorage(theme, newSize);
    try {
      await saveReadingPreferences({ font_size: newSize });
    } catch (e) {
      //
    }
  }, [theme, saveToStorage]);

  return {
    theme,
    fontSize,
    setTheme,
    setFontSize,
    isLoading,
  };
}
