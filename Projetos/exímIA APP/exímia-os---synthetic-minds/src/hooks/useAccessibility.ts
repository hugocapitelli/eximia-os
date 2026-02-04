/**
 * Accessibility Hooks
 *
 * Provides reusable hooks for implementing WCAG AA accessibility features:
 * - Focus management and trapping (for modals)
 * - Keyboard navigation support (Tab, Enter, Escape)
 * - Screen reader announcements
 * - ARIA live regions
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Focus trap hook for modals
 * Keeps focus within the modal element when Tab key is pressed
 */
export const useFocusTrap = (isActive: boolean, containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      const activeElement = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        // Shift+Tab
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const container = containerRef.current;
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, containerRef]);
};

/**
 * Keyboard navigation hook
 * Handles Escape key to close modals and Enter to submit forms
 */
export const useKeyboardNavigation = (
  onEscape?: () => void,
  onEnter?: () => void,
  elementRef?: React.RefObject<HTMLElement>
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
      }

      if (e.key === 'Enter' && onEnter) {
        // Only trigger if not in a textarea
        if ((e.target as HTMLElement).tagName !== 'TEXTAREA') {
          e.preventDefault();
          onEnter();
        }
      }
    };

    const target = elementRef?.current || window;
    target.addEventListener('keydown', handleKeyDown);

    return () => {
      target.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape, onEnter, elementRef]);
};

/**
 * Screen reader announcement hook
 * Uses aria-live region to announce messages to assistive technology
 */
export const useScreenReaderAnnouncement = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message || !announcementRef.current) return;

    const announcement = announcementRef.current;
    announcement.textContent = message;

    // Clear after announcement
    const timeout = setTimeout(() => {
      announcement.textContent = '';
    }, 3000);

    return () => clearTimeout(timeout);
  }, [message]);

  return announcementRef;
};

/**
 * Contrast checker utility
 * Checks if two colors meet WCAG AA contrast requirements
 *
 * WCAG AA requires:
 * - 4.5:1 for normal text
 * - 3:1 for large text (18pt+)
 */
export const getContrastRatio = (foreground: string, background: string): number => {
  const hexToRgb = (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
  };

  const getLuminance = (rgb: [number, number, number]): number => {
    const [r, g, b] = rgb.map((val) => {
      const normalized = val / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) return 0;

  const fgLum = getLuminance(fgRgb);
  const bgLum = getLuminance(bgRgb);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast meets WCAG AA requirements
 */
export const meetsWCAGAA = (
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  const minRatio = isLargeText ? 3 : 4.5;
  return ratio >= minRatio;
};

/**
 * Focus management hook for sequential navigation
 * Moves focus to next/previous focusable element
 */
export const useFocusNavigation = (containerRef: React.RefObject<HTMLElement>) => {
  const focusNext = useCallback(() => {
    if (!containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const activeElement = document.activeElement as HTMLElement;
    const index = Array.from(focusableElements).indexOf(activeElement);
    const nextIndex = (index + 1) % focusableElements.length;

    (focusableElements[nextIndex] as HTMLElement)?.focus();
  }, [containerRef]);

  const focusPrevious = useCallback(() => {
    if (!containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const activeElement = document.activeElement as HTMLElement;
    const index = Array.from(focusableElements).indexOf(activeElement);
    const prevIndex = (index - 1 + focusableElements.length) % focusableElements.length;

    (focusableElements[prevIndex] as HTMLElement)?.focus();
  }, [containerRef]);

  return { focusNext, focusPrevious };
};

export default {
  useFocusTrap,
  useKeyboardNavigation,
  useScreenReaderAnnouncement,
  getContrastRatio,
  meetsWCAGAA,
  useFocusNavigation,
};
