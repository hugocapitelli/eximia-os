import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseFocusModeOptions {
  hideDelay?: number; // ms before hiding UI on scroll down
  showDelay?: number; // ms before showing UI on scroll up
}

export interface UseFocusModeReturn {
  isFocused: boolean;
  isUIVisible: boolean;
  toggleFocus: () => void;
  showUI: () => void;
  hideUI: () => void;
}

export const useFocusMode = ({
  hideDelay = 150,
  showDelay = 50,
}: UseFocusModeOptions = {}): UseFocusModeReturn => {
  const [isFocused, setIsFocused] = useState(false);
  const [isUIVisible, setIsUIVisible] = useState(true);
  const lastScrollY = useRef(0);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const showTimeout = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    if (showTimeout.current) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
    }
  }, []);

  const showUI = useCallback(() => {
    clearTimeouts();
    setIsUIVisible(true);
  }, [clearTimeouts]);

  const hideUI = useCallback(() => {
    clearTimeouts();
    setIsUIVisible(false);
  }, [clearTimeouts]);

  const toggleFocus = useCallback(() => {
    setIsFocused((prev) => !prev);
    if (!isFocused) {
      // Entering focus mode - hide UI
      hideUI();
    } else {
      // Exiting focus mode - show UI
      showUI();
    }
  }, [isFocused, hideUI, showUI]);

  // Handle scroll to show/hide UI in focus mode
  useEffect(() => {
    if (!isFocused) {
      showUI();
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY.current;

      clearTimeouts();

      if (scrollDiff > 10) {
        // Scrolling down - hide UI after delay
        hideTimeout.current = setTimeout(() => {
          setIsUIVisible(false);
        }, hideDelay);
      } else if (scrollDiff < -10) {
        // Scrolling up - show UI after delay
        showTimeout.current = setTimeout(() => {
          setIsUIVisible(true);
        }, showDelay);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeouts();
    };
  }, [isFocused, hideDelay, showDelay, clearTimeouts]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 'f' to toggle focus mode
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement?.tagName === 'INPUT' ||
                              activeElement?.tagName === 'TEXTAREA' ||
                              activeElement?.getAttribute('contenteditable') === 'true';

        if (!isInputFocused) {
          e.preventDefault();
          toggleFocus();
        }
      }

      // Escape to exit focus mode and show UI
      if (e.key === 'Escape' && isFocused) {
        setIsFocused(false);
        showUI();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, toggleFocus, showUI]);

  return {
    isFocused,
    isUIVisible,
    toggleFocus,
    showUI,
    hideUI,
  };
};

export default useFocusMode;
