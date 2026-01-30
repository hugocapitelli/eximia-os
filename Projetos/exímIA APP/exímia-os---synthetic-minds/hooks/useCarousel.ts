import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseCarouselOptions {
  totalSlides: number;
  autoPlayInterval?: number;
  loop?: boolean;
}

export interface UseCarouselReturn {
  currentIndex: number;
  isPlaying: boolean;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  pause: () => void;
  play: () => void;
  togglePlay: () => void;
}

export const useCarousel = ({
  totalSlides,
  autoPlayInterval = 5000,
  loop = true,
}: UseCarouselOptions): UseCarouselReturn => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= totalSlides - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [totalSlides, loop]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return loop ? totalSlides - 1 : prev;
      }
      return prev - 1;
    });
  }, [totalSlides, loop]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
    }
  }, [totalSlides]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearAutoPlay();
  }, [clearAutoPlay]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && totalSlides > 1) {
      intervalRef.current = setInterval(nextSlide, autoPlayInterval);
    }
    return clearAutoPlay;
  }, [isPlaying, totalSlides, autoPlayInterval, nextSlide, clearAutoPlay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  return {
    currentIndex,
    isPlaying,
    goToSlide,
    nextSlide,
    prevSlide,
    pause,
    play,
    togglePlay,
  };
};

export default useCarousel;
