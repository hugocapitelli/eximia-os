import React from 'react';
import { ArrowLeft, List, Menu } from 'lucide-react';

interface ThemeStyles {
  bg: string;
  border: string;
  text: string;
  muted: string;
}

interface ReadingHeaderProps {
  title: string;
  onBack: () => void;
  onToggleTOC: () => void;
  onMenu?: () => void;
  isVisible?: boolean;
  // Theme controls
  theme?: 'dark' | 'sepia' | 'light';
  onThemeChange?: (theme: 'dark' | 'sepia' | 'light') => void;
  fontSize?: 'small' | 'medium' | 'large';
  onFontSizeChange?: (size: 'small' | 'medium' | 'large') => void;
  themeStyles?: ThemeStyles;
}

const THEMES = [
  { id: 'dark' as const, color: '#18181b' },
  { id: 'sepia' as const, color: '#fef3c7' },
  { id: 'light' as const, color: '#ffffff' },
];

export const ReadingHeader: React.FC<ReadingHeaderProps> = ({
  title,
  onBack,
  onToggleTOC,
  onMenu,
  isVisible = true,
  theme = 'dark',
  onThemeChange,
  fontSize = 'medium',
  onFontSizeChange,
  themeStyles,
}) => {
  // Default theme styles fallback
  const defaultStyles: ThemeStyles = {
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    text: 'text-white',
    muted: 'text-zinc-400',
  };
  const styles = themeStyles || defaultStyles;
  const handleFontSizeDecrease = () => {
    if (onFontSizeChange) {
      if (fontSize === 'large') onFontSizeChange('medium');
      else if (fontSize === 'medium') onFontSizeChange('small');
    }
  };

  const handleFontSizeIncrease = () => {
    if (onFontSizeChange) {
      if (fontSize === 'small') onFontSizeChange('medium');
      else if (fontSize === 'medium') onFontSizeChange('large');
    }
  };

  return (
    <div
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-50
        transition-all duration-300 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      `}
    >
      <div
        className="flex items-center gap-4 px-6 py-3 backdrop-blur-xl rounded-2xl shadow-lg"
        style={{
          background: styles.bg,
          border: `1px solid ${styles.border}`,
        }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className={`${styles.muted} hover:opacity-80 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/30 rounded`}
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Label + Title */}
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${styles.muted}`}>
            LEITURA
          </span>
          <span className={`text-sm font-medium truncate max-w-48 ${styles.text}`}>
            {title}
          </span>
        </div>

        <div className="w-px h-6" style={{ backgroundColor: styles.border }} />

        {/* Theme Toggle */}
        {onThemeChange && (
          <div className="flex items-center gap-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`
                  w-6 h-6 rounded-full border-2 transition-all
                  ${theme === t.id
                    ? 'border-white scale-110'
                    : 'border-transparent hover:border-white/30'
                  }
                `}
                style={{ backgroundColor: t.color }}
                aria-label={`Tema ${t.id}`}
                aria-pressed={theme === t.id}
              />
            ))}
          </div>
        )}

        {/* Font Size */}
        {onFontSizeChange && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleFontSizeDecrease}
              className={`px-2 py-1 text-sm transition-colors ${
                fontSize === 'small' ? 'opacity-40 cursor-not-allowed' : `${styles.muted} hover:opacity-80`
              }`}
              aria-label="Diminuir fonte"
              disabled={fontSize === 'small'}
            >
              A-
            </button>
            <button
              className={`px-2 py-1 text-sm font-bold ${styles.text}`}
              aria-label="Tamanho atual"
            >
              A
            </button>
            <button
              onClick={handleFontSizeIncrease}
              className={`px-2 py-1 text-sm transition-colors ${
                fontSize === 'large' ? 'opacity-40 cursor-not-allowed' : `${styles.muted} hover:opacity-80`
              }`}
              aria-label="Aumentar fonte"
              disabled={fontSize === 'large'}
            >
              A+
            </button>
          </div>
        )}

        {/* TOC Toggle */}
        <button
          onClick={onToggleTOC}
          className={`p-2 ${styles.muted} hover:opacity-80 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-amber-500/30`}
          aria-label="Sumário"
        >
          <List className="w-5 h-5" />
        </button>

        {/* Menu */}
        {onMenu && (
          <button
            onClick={onMenu}
            className={`p-2 ${styles.muted} hover:opacity-80 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-amber-500/30`}
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ReadingHeader;
