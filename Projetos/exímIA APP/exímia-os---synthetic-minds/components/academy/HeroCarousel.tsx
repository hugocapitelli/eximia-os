import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Heart, BookOpen, Clock, Star, Trash2 } from 'lucide-react';
import { useCarousel } from '../../hooks/useCarousel';
import { AcademyCourse } from '../../types';

// ============================================
// CAROUSEL COLOR THEMES
// ============================================
export type CarouselTheme =
  | 'purple-magenta'
  | 'ocean-blue'
  | 'emerald-green'
  | 'sunset-orange'
  | 'royal-gold'
  | 'deep-rose'
  | 'cyber-teal'
  | 'midnight-indigo';

interface ThemeColors {
  gradient: string;
  wave: string;
  glow: string;
  accent: string;
  accentText: string;
}

export const CAROUSEL_THEMES: Record<CarouselTheme, ThemeColors> = {
  'purple-magenta': {
    gradient: `linear-gradient(135deg,
      #1a0a2e 0%,
      #2d1b4e 15%,
      #4a2c6a 35%,
      #6b3a7d 50%,
      #7b3f8e 65%,
      #5c2d6b 80%,
      #2d1b4e 100%
    )`,
    wave: `radial-gradient(ellipse 120% 80% at 80% 120%,
      rgba(168, 85, 247, 0.5) 0%,
      rgba(236, 72, 153, 0.3) 30%,
      rgba(139, 92, 246, 0.2) 50%,
      transparent 70%
    )`,
    glow: `radial-gradient(ellipse 60% 40% at 20% -10%,
      rgba(167, 139, 250, 0.4) 0%,
      transparent 60%
    )`,
    accent: 'text-violet-300',
    accentText: 'text-amber-500',
  },
  'ocean-blue': {
    gradient: `linear-gradient(135deg,
      #0a1628 0%,
      #0f2847 15%,
      #1a4066 35%,
      #2563eb 50%,
      #3b82f6 65%,
      #1e40af 80%,
      #0f2847 100%
    )`,
    wave: `radial-gradient(ellipse 120% 80% at 80% 120%,
      rgba(59, 130, 246, 0.5) 0%,
      rgba(6, 182, 212, 0.3) 30%,
      rgba(37, 99, 235, 0.2) 50%,
      transparent 70%
    )`,
    glow: `radial-gradient(ellipse 60% 40% at 20% -10%,
      rgba(96, 165, 250, 0.4) 0%,
      transparent 60%
    )`,
    accent: 'text-blue-300',
    accentText: 'text-cyan-400',
  },
  'emerald-green': {
    gradient: `linear-gradient(135deg,
      #022c22 0%,
      #064e3b 15%,
      #047857 35%,
      #059669 50%,
      #10b981 65%,
      #047857 80%,
      #064e3b 100%
    )`,
    wave: `radial-gradient(ellipse 120% 80% at 80% 120%,
      rgba(16, 185, 129, 0.5) 0%,
      rgba(52, 211, 153, 0.3) 30%,
      rgba(5, 150, 105, 0.2) 50%,
      transparent 70%
    )`,
    glow: `radial-gradient(ellipse 60% 40% at 20% -10%,
      rgba(110, 231, 183, 0.4) 0%,
      transparent 60%
    )`,
    accent: 'text-emerald-300',
    accentText: 'text-emerald-400',
  },
  'sunset-orange': {
    gradient: `linear-gradient(135deg,
      #1c0a00 0%,
      #3d1f0d 15%,
      #7c2d12 35%,
      #c2410c 50%,
      #ea580c 65%,
      #9a3412 80%,
      #3d1f0d 100%
    )`,
    wave: `radial-gradient(ellipse 120% 80% at 80% 120%,
      rgba(249, 115, 22, 0.5) 0%,
      rgba(251, 146, 60, 0.3) 30%,
      rgba(234, 88, 12, 0.2) 50%,
      transparent 70%
    )`,
    glow: `radial-gradient(ellipse 60% 40% at 20% -10%,
      rgba(253, 186, 116, 0.4) 0%,
      transparent 60%
    )`,
    accent: 'text-orange-300',
    accentText: 'text-orange-400',
  },
  'royal-gold': {
    gradient: `linear-gradient(135deg,
      #1a1500 0%,
      #2d2306 15%,
      #4a3a0d 35%,
      #78590a 50%,
      #a16207 65%,
      #713f12 80%,
      #2d2306 100%
    )`,
    wave: `radial-gradient(ellipse 120% 80% at 80% 120%,
      rgba(245, 158, 11, 0.5) 0%,
      rgba(251, 191, 36, 0.3) 30%,
      rgba(217, 119, 6, 0.2) 50%,
      transparent 70%
    )`,
    glow: `radial-gradient(ellipse 60% 40% at 20% -10%,
      rgba(252, 211, 77, 0.4) 0%,
      transparent 60%
    )`,
    accent: 'text-amber-300',
    accentText: 'text-amber-500',
  },
  'deep-rose': {
    gradient: `linear-gradient(135deg,
      #1a0a14 0%,
      #3d1028 15%,
      #6b1a3d 35%,
      #9f1239 50%,
      #be185d 65%,
      #831843 80%,
      #3d1028 100%
    )`,
    wave: `radial-gradient(ellipse 120% 80% at 80% 120%,
      rgba(236, 72, 153, 0.5) 0%,
      rgba(244, 114, 182, 0.3) 30%,
      rgba(190, 24, 93, 0.2) 50%,
      transparent 70%
    )`,
    glow: `radial-gradient(ellipse 60% 40% at 20% -10%,
      rgba(251, 207, 232, 0.4) 0%,
      transparent 60%
    )`,
    accent: 'text-pink-300',
    accentText: 'text-pink-400',
  },
  'cyber-teal': {
    gradient: `linear-gradient(135deg,
      #021a1a 0%,
      #042f2e 15%,
      #0f4c4a 35%,
      #0d9488 50%,
      #14b8a6 65%,
      #0f766e 80%,
      #042f2e 100%
    )`,
    wave: `radial-gradient(ellipse 120% 80% at 80% 120%,
      rgba(20, 184, 166, 0.5) 0%,
      rgba(45, 212, 191, 0.3) 30%,
      rgba(13, 148, 136, 0.2) 50%,
      transparent 70%
    )`,
    glow: `radial-gradient(ellipse 60% 40% at 20% -10%,
      rgba(153, 246, 228, 0.4) 0%,
      transparent 60%
    )`,
    accent: 'text-teal-300',
    accentText: 'text-teal-400',
  },
  'midnight-indigo': {
    gradient: `linear-gradient(135deg,
      #0c0a1d 0%,
      #1e1b4b 15%,
      #312e81 35%,
      #4338ca 50%,
      #4f46e5 65%,
      #3730a3 80%,
      #1e1b4b 100%
    )`,
    wave: `radial-gradient(ellipse 120% 80% at 80% 120%,
      rgba(99, 102, 241, 0.5) 0%,
      rgba(129, 140, 248, 0.3) 30%,
      rgba(67, 56, 202, 0.2) 50%,
      transparent 70%
    )`,
    glow: `radial-gradient(ellipse 60% 40% at 20% -10%,
      rgba(165, 180, 252, 0.4) 0%,
      transparent 60%
    )`,
    accent: 'text-indigo-300',
    accentText: 'text-indigo-400',
  },
};

export interface FeaturedCourse extends AcademyCourse {
  featuredOrder?: number;
}

interface HeroCarouselProps {
  courses: FeaturedCourse[];
  autoPlayInterval?: number;
  onCourseClick: (courseId: string) => void;
  isEditorMode?: boolean;
  onRemoveCourse?: (courseId: string) => void;
  onReorderCourses?: (courseIds: string[]) => void;
  theme?: CarouselTheme;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  courses,
  autoPlayInterval = 5000,
  onCourseClick,
  isEditorMode = false,
  onRemoveCourse,
  onReorderCourses,
  theme = 'purple-magenta',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Get theme colors
  const themeColors = CAROUSEL_THEMES[theme];

  const {
    currentIndex,
    isPlaying,
    goToSlide,
    nextSlide,
    prevSlide,
    pause,
    play,
  } = useCarousel({
    totalSlides: courses.length,
    autoPlayInterval,
    loop: true,
  });

  // Pause on hover + track hover state
  const handleMouseEnter = () => {
    setIsHovering(true);
    pause();
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
    play();
  };

  // Wrap navigation with direction tracking
  const handlePrevSlide = () => {
    setSlideDirection('left');
    prevSlide();
  };

  const handleNextSlide = () => {
    setSlideDirection('right');
    nextSlide();
  };

  const handleGoToSlide = (index: number) => {
    setSlideDirection(index > currentIndex ? 'right' : 'left');
    goToSlide(index);
  };

  // Touch swipe support
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
  };

  if (courses.length === 0) {
    // Fallback static card with themed gradient
    return (
      <div
        className="relative border border-[#1F1F22]/50 rounded-2xl p-10 min-h-[340px] flex flex-col justify-center overflow-hidden"
      >
        {/* Theme Gradient Background */}
        <div
          className="absolute inset-0"
          style={{ background: themeColors.gradient }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: themeColors.wave }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: themeColors.glow }}
        />
        <div className="relative z-10">
          <p className={`text-[10px] font-bold ${themeColors.accent} uppercase tracking-widest mb-3`}>
            CONSTRUA O FUTURO
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Comece sua jornada de aprendizado
          </h2>
          <p className="text-zinc-300/80 text-base max-w-md">
            Explore cursos, trilhas e desenvolva novas habilidades com a Academy.
          </p>
        </div>
      </div>
    );
  }

  const currentCourse = courses[currentIndex];

  return (
    <div
      ref={containerRef}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Cursos destacados"
      aria-roledescription="carousel"
    >
      {/* Editor Mode Badge */}
      {isEditorMode && (
        <div className="absolute -top-3 left-4 z-30 px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-[10px] font-bold text-amber-500 uppercase tracking-wider">
          Editor Mode
        </div>
      )}

      {/* Main Slide Container */}
      <div
        className={`relative border rounded-2xl min-h-[340px] overflow-hidden transition-all duration-300 ${
          isEditorMode ? 'border-amber-500/50' : 'border-[#1F1F22]/50'
        }`}
        role="group"
        aria-roledescription="slide"
        aria-label={`${currentIndex + 1} de ${courses.length}: ${currentCourse.title}`}
      >
        {/* Theme Gradient Background */}
        <div
          className="absolute inset-0"
          style={{ background: themeColors.gradient }}
        />
        {/* Wave Overlay Effect */}
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: themeColors.wave }}
        />
        {/* Top Glow */}
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: themeColors.glow }}
        />

        {/* Animated Content Wrapper */}
        <div
          key={currentCourse.id}
          className={`relative p-8 md:p-10 pb-20 flex flex-col justify-between min-h-[340px] ${
            slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
          }`}
        >
          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col">
            {/* Top Row - Category & Actions */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">
                  CURSO DESTACADO
                </p>
                <span className="inline-block px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                  {currentCourse.category}
                </span>
              </div>

              {isEditorMode && onRemoveCourse && (
                <button
                  onClick={() => onRemoveCourse(currentCourse.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-500 transition-colors"
                  aria-label="Remover do carrossel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Title & Description */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {currentCourse.title}
              </h2>
              <p className="text-zinc-300/80 text-base line-clamp-2 max-w-xl">
                {currentCourse.description}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mb-6">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {currentCourse.lessonsCount} Lições
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {currentCourse.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                {currentCourse.level}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 mt-auto">
              <button
                onClick={() => onCourseClick(currentCourse.id)}
                className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {currentCourse.isEnrolled ? 'Continuar' : 'Iniciar Curso'}
              </button>
              <button
                className={`p-2.5 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 ${
                  currentCourse.isFavorite
                    ? 'bg-red-500/10 border-red-500/30 text-red-500'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
                aria-label={currentCourse.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart className={`w-4 h-4 ${currentCourse.isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress indicator if enrolled */}
        {currentCourse.isEnrolled && currentCourse.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-20">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
              style={{ width: `${currentCourse.progress}%` }}
            />
          </div>
        )}

        {/* Navigation Arrows - Hover Only */}
        {courses.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicators - Inside Container, Bottom */}
        {courses.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={() => (isPlaying ? pause() : play())}
              className="p-1.5 text-white/50 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
              aria-label={isPlaying ? 'Pausar autoplay' : 'Iniciar autoplay'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
              {courses.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGoToSlide(idx)}
                  role="tab"
                  aria-selected={idx === currentIndex}
                  aria-label={`Ir para slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                    idx === currentIndex
                      ? 'bg-white w-6'
                      : 'bg-white/30 hover:bg-white/50 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroCarousel;
