import { useEffect } from 'react';

interface UseKeyboardNavProps {
  onPrev: () => void;
  onNext: () => void;
  onEscape?: () => void;
}

export function useKeyboardNav({ onPrev, onNext, onEscape }: UseKeyboardNavProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          onPrev();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          onNext();
          break;
        case 'Escape':
          e.preventDefault();
          onEscape?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrev, onNext, onEscape]);
}
