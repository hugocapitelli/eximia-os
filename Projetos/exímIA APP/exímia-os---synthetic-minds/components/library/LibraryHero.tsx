import React from 'react';
import { ChevronRight } from 'lucide-react';

interface LibraryHeroProps {
  variant: 'explore' | 'favorites';
  bookCount: number;
  onCTA?: () => void;
}

const VARIANTS = {
  explore: {
    badge: 'CURADORIA EXCLUSIVA',
    title: 'Expanda sua Consciência.',
    subtitle: 'Sabedoria secular potencializada por IA.',
    cta: 'EXPLORAR BIBLIOTECA',
    accent: '#f59e0b', // amber-500
    gradient: 'from-amber-900/30 via-amber-900/10 to-transparent',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    ctaBg: 'bg-amber-500 hover:bg-amber-400 text-black',
  },
  favorites: {
    badge: 'SUA BIBLIOTECA',
    title: 'Sua Biblioteca Pessoal',
    subtitle: 'Organize suas leituras e acompanhe seu progresso.',
    cta: 'VER PROGRESSO',
    accent: '#8B5CF6', // violet-500
    gradient: 'from-violet-900/30 via-violet-900/10 to-transparent',
    badgeBg: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
    ctaBg: 'bg-violet-500 hover:bg-violet-400 text-white',
  },
};

export const LibraryHero: React.FC<LibraryHeroProps> = ({
  variant,
  bookCount,
  onCTA,
}) => {
  const config = VARIANTS[variant];

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden mb-12 border border-[#1F1F22] group`}
      style={{ minHeight: '280px' }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient}`} />
      <div className="absolute inset-0 bg-[#050505]/60" />

      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between h-full min-h-[280px] px-12 py-10">
        {/* Left: Text */}
        <div className="flex flex-col gap-4 max-w-xl">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit ${config.badgeBg}`}>
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: config.accent }}
            />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {config.badge} • {bookCount} obras
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            {config.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-zinc-400 font-serif leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Right: CTA */}
        <div className="hidden md:block">
          <button
            onClick={onCTA}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest
              transition-all duration-300 ${config.ctaBg}
              hover:scale-105 hover:shadow-lg
            `}
            style={{
              boxShadow: `0 8px 24px ${config.accent}30`,
            }}
          >
            {config.cta}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryHero;
