// useReadingPreferences Hook - Reading preferences with localStorage fallback
// EXIMIA-203

import { useState, useEffect, useCallback } from 'react';
import type { ReadingTheme, FontSize, UserReadingPreferences } from '../../types/biblioteca';
import { saveReadingPreferences } from '../../services/biblioteca';

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

  // Load preferences from localStorage as fallback
  useEffect(() => {
    if (!initialPreferences) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.theme) setThemeState(parsed.theme);
          if (parsed.fontSize) setFontSizeState(parsed.fontSize);
        } catch (e) {
          // Ignore parse errors
        }
      }
      setIsLoading(false);
    }
  }, [initialPreferences]);

  // Save to localStorage always
  const saveToStorage = useCallback((newTheme: ReadingTheme, newFontSize: FontSize) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: newTheme, fontSize: newFontSize }));
  }, []);

  const setTheme = useCallback(async (newTheme: ReadingTheme) => {
    setThemeState(newTheme);
    saveToStorage(newTheme, fontSize);

    // Try to save to server (fire and forget)
    try {
      await saveReadingPreferences({ theme: newTheme });
    } catch (e) {
      // Silent failure - localStorage is the fallback
    }
  }, [fontSize, saveToStorage]);

  const setFontSize = useCallback(async (newSize: FontSize) => {
    setFontSizeState(newSize);
    saveToStorage(theme, newSize);

    // Try to save to server (fire and forget)
    try {
      await saveReadingPreferences({ font_size: newSize });
    } catch (e) {
      // Silent failure - localStorage is the fallback
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
