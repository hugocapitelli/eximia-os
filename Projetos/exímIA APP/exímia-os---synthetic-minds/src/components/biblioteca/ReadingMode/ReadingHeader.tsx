// ReadingHeader Component - Header with controls
// EXIMIA-202, EXIMIA-203

import { ArrowLeft, Menu } from 'lucide-react';
import type { ReadingTheme, FontSize } from '../../../types/biblioteca';
import { THEMES, FONT_SIZES } from '../../../types/biblioteca';

interface ReadingHeaderProps {
  title: string;
  theme: ReadingTheme;
  fontSize: FontSize;
  onThemeChange: (theme: ReadingTheme) => void;
  onFontSizeChange: (size: FontSize) => void;
  onToggleSidebar: () => void;
  onBack: () => void;
}

export function ReadingHeader({
  title,
  theme,
  fontSize,
  onThemeChange,
  onFontSizeChange,
  onToggleSidebar,
  onBack,
}: ReadingHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-current/10 backdrop-blur-sm">
      <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-current/10"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-medium truncate max-w-[200px]">{title}</span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <div className="flex items-center gap-1" role="group" aria-label="Tema de leitura">
            {THEMES.map((t) => (
              <button
                key={t.name}
                onClick={() => onThemeChange(t.name)}
                title={t.label}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-300 ${
                  theme === t.name
                    ? 'scale-110 ring-2 ring-offset-2 ring-amber-500'
                    : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: t.colors.background,
                  borderColor: theme === t.name ? t.colors.accent : t.colors.muted,
                }}
                aria-pressed={theme === t.name}
                aria-label={`Tema ${t.label}`}
              >
                {theme === t.name && (
                  <span
                    className="block w-2 h-2 rounded-full mx-auto"
                    style={{ backgroundColor: t.colors.text }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Font Size */}
          <div
            className="flex items-center rounded-lg border border-current/20 overflow-hidden"
            role="group"
            aria-label="Tamanho da fonte"
          >
            {FONT_SIZES.map((f, index) => (
              <button
                key={f.name}
                onClick={() => onFontSizeChange(f.name)}
                className={`px-3 py-1.5 transition-colors duration-200 ${
                  fontSize === f.name
                    ? 'bg-current/20 font-medium'
                    : 'hover:bg-current/10'
                } ${index > 0 ? 'border-l border-current/20' : ''}`}
                aria-pressed={fontSize === f.name}
              >
                <span style={{ fontSize: f.name === 'small' ? '12px' : f.name === 'large' ? '18px' : '14px' }}>
                  {f.label}
                </span>
              </button>
            ))}
          </div>

          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-current/10"
            aria-label="Sumário"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
