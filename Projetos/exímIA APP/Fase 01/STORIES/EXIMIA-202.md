# EXIMIA-202: Componente ReadingMode

> EPIC-002: Modo Leitura | Sprint 3 | 8 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-202 |
| Título | Componente ReadingMode — Container Principal |
| Epic | EPIC-002 |
| Story Points | 8 |
| Sprint | 3 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** usuário,
**Quero** uma experiência de leitura imersiva,
**Para** ler resumos com conforto e foco.

---

## Acceptance Criteria

- [ ] **AC1:** Layout fullscreen com header fixo
- [ ] **AC2:** Header contém:
  - Botão voltar (←)
  - Título do livro
  - Controles de tema (3 círculos)
  - Controles de fonte (A- A A+)
  - Toggle do sumário (☰)
- [ ] **AC3:** Área de conteúdo centralizada:
  - Max-width para legibilidade (650px)
  - Padding lateral adequado
  - Scroll suave
- [ ] **AC4:** Título do capítulo no início do conteúdo
- [ ] **AC5:** Renderização de Markdown para HTML
- [ ] **AC6:** Footer com navegação:
  - Botão "Anterior" (desabilitado no cap 1)
  - Indicador "Capítulo X de Y"
  - Botão "Próximo" (muda para "Concluir" no último)
- [ ] **AC7:** Navegação por capítulos funcional
- [ ] **AC8:** Transições suaves entre capítulos
- [ ] **AC9:** Keyboard shortcuts:
  - `←` ou `A` — capítulo anterior
  - `→` ou `D` — próximo capítulo
  - `Esc` — voltar
- [ ] **AC10:** Responsivo:
  - Desktop: layout com sidebar potencial
  - Mobile: layout compacto, controles menores

---

## Technical Notes

### Arquivos de Referência
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Interface: `ReadingModeProps`, `SummaryWithChapters`
- Constantes: `THEMES`, `FONT_SIZES`

### Estrutura de Arquivos

```
src/components/biblioteca/ReadingMode/
├── ReadingMode.tsx           # Container principal
├── ReadingHeader.tsx         # Header com controles
├── ReadingContent.tsx        # Área de conteúdo
├── ReadingFooter.tsx         # Navegação
├── ChapterRenderer.tsx       # Renderiza Markdown
└── index.ts

src/hooks/
├── useReadingMode.ts         # Estado do modo leitura
└── useKeyboardNav.ts         # Atalhos de teclado
```

### Componente Principal

```tsx
// src/components/biblioteca/ReadingMode/ReadingMode.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { SummaryWithChapters, UserReadingPreferences, SummaryReadingProgress } from '@/types/biblioteca';
import { ReadingHeader } from './ReadingHeader';
import { ReadingContent } from './ReadingContent';
import { ReadingFooter } from './ReadingFooter';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { saveReadingProgress } from '@/lib/actions/summaries/progress';
import { THEMES, FONT_SIZES } from '@/types/biblioteca';

interface ReadingModeProps {
  summary: SummaryWithChapters;
  initialChapter?: number;
  userPreferences?: UserReadingPreferences;
  progress?: SummaryReadingProgress;
  onBack: () => void;
}

export function ReadingMode({
  summary,
  initialChapter = 1,
  userPreferences,
  progress,
  onBack,
}: ReadingModeProps) {
  const [currentChapter, setCurrentChapter] = useState(
    progress?.current_chapter || initialChapter
  );
  const [theme, setTheme] = useState(userPreferences?.theme || 'dark');
  const [fontSize, setFontSize] = useState(userPreferences?.font_size || 'medium');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalChapters = summary.chapters.length;
  const chapter = summary.chapters.find(c => c.chapter_number === currentChapter);

  // Salvar progresso ao mudar de capítulo
  useEffect(() => {
    const isLastChapter = currentChapter === totalChapters;

    saveReadingProgress({
      summary_id: summary.id,
      current_chapter: currentChapter,
      completed: isLastChapter && currentChapter > (progress?.current_chapter || 0),
    });
  }, [currentChapter, summary.id, totalChapters, progress?.current_chapter]);

  const goToChapter = useCallback((num: number) => {
    if (num >= 1 && num <= totalChapters) {
      setCurrentChapter(num);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalChapters]);

  const goNext = useCallback(() => {
    if (currentChapter < totalChapters) {
      goToChapter(currentChapter + 1);
    } else {
      // Último capítulo - mostrar modal de conclusão
      // Implementado em EXIMIA-205
    }
  }, [currentChapter, totalChapters, goToChapter]);

  const goPrev = useCallback(() => {
    if (currentChapter > 1) {
      goToChapter(currentChapter - 1);
    }
  }, [currentChapter, goToChapter]);

  // Keyboard navigation
  useKeyboardNav({
    onPrev: goPrev,
    onNext: goNext,
    onEscape: onBack,
  });

  // Theme config
  const themeConfig = THEMES.find(t => t.name === theme) || THEMES[2]; // dark default
  const fontConfig = FONT_SIZES.find(f => f.name === fontSize) || FONT_SIZES[1]; // medium default

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: themeConfig.colors.background,
        color: themeConfig.colors.text,
      }}
    >
      <ReadingHeader
        title={summary.catalog?.title || summary.title}
        theme={theme}
        fontSize={fontSize}
        onThemeChange={setTheme}
        onFontSizeChange={setFontSize}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onBack={onBack}
      />

      <ReadingContent
        chapter={chapter}
        themeConfig={themeConfig}
        fontConfig={fontConfig}
      />

      <ReadingFooter
        currentChapter={currentChapter}
        totalChapters={totalChapters}
        onPrev={goPrev}
        onNext={goNext}
        isFirst={currentChapter === 1}
        isLast={currentChapter === totalChapters}
      />

      {/* Sidebar - implementada em EXIMIA-204 */}
    </div>
  );
}
```

### Header Component

```tsx
// src/components/biblioteca/ReadingMode/ReadingHeader.tsx
'use client';

import { ArrowLeft, Menu } from 'lucide-react';
import { ReadingTheme, FontSize, THEMES, FONT_SIZES } from '@/types/biblioteca';
import { saveReadingPreferences } from '@/lib/actions/preferences/reading';

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
  const handleThemeChange = async (newTheme: ReadingTheme) => {
    onThemeChange(newTheme);
    await saveReadingPreferences({ theme: newTheme });
  };

  const handleFontSizeChange = async (newSize: FontSize) => {
    onFontSizeChange(newSize);
    await saveReadingPreferences({ font_size: newSize });
  };

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
          <div className="flex items-center gap-1">
            {THEMES.map((t) => (
              <button
                key={t.name}
                onClick={() => handleThemeChange(t.name)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  theme === t.name ? 'scale-110 border-current' : 'border-transparent'
                }`}
                style={{ backgroundColor: t.colors.background }}
                aria-label={t.label}
              />
            ))}
          </div>

          {/* Font Size */}
          <div className="flex items-center gap-1">
            {FONT_SIZES.map((f) => (
              <button
                key={f.name}
                onClick={() => handleFontSizeChange(f.name)}
                className={`px-2 py-1 rounded ${
                  fontSize === f.name ? 'bg-current/20' : 'hover:bg-current/10'
                }`}
              >
                {f.label}
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
```

### Content Component

```tsx
// src/components/biblioteca/ReadingMode/ReadingContent.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import { SummaryChapter, ThemeConfig, FontSizeConfig } from '@/types/biblioteca';

interface ReadingContentProps {
  chapter?: SummaryChapter;
  themeConfig: ThemeConfig;
  fontConfig: FontSizeConfig;
}

export function ReadingContent({
  chapter,
  themeConfig,
  fontConfig,
}: ReadingContentProps) {
  if (!chapter) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Capítulo não encontrado</p>
      </div>
    );
  }

  return (
    <main className="flex-1 py-8">
      <div className="container max-w-[650px] mx-auto px-4">
        {/* Chapter Header */}
        <div className="mb-8 text-center">
          <p
            className="text-sm uppercase tracking-wider mb-2"
            style={{ color: themeConfig.colors.muted }}
          >
            Capítulo {chapter.chapter_number}
          </p>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: themeConfig.colors.text }}
          >
            {chapter.title}
          </h1>
          {chapter.subtitle && (
            <p
              className="mt-2"
              style={{ color: themeConfig.colors.muted }}
            >
              {chapter.subtitle}
            </p>
          )}
        </div>

        {/* Chapter Content */}
        <article
          className="prose prose-lg max-w-none"
          style={{
            fontSize: fontConfig.size,
            lineHeight: fontConfig.lineHeight,
            '--tw-prose-body': themeConfig.colors.text,
            '--tw-prose-headings': themeConfig.colors.text,
            '--tw-prose-links': themeConfig.colors.accent,
          } as React.CSSProperties}
        >
          <ReactMarkdown>{chapter.content}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
```

### Footer Component

```tsx
// src/components/biblioteca/ReadingMode/ReadingFooter.tsx
'use client';

import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface ReadingFooterProps {
  currentChapter: number;
  totalChapters: number;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ReadingFooter({
  currentChapter,
  totalChapters,
  onPrev,
  onNext,
  isFirst,
  isLast,
}: ReadingFooterProps) {
  return (
    <footer className="sticky bottom-0 border-t border-current/10 backdrop-blur-sm">
      <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-current/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <span className="text-sm">
          {currentChapter} / {totalChapters}
        </span>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-current/10"
        >
          <span className="hidden sm:inline">
            {isLast ? 'Concluir' : 'Próximo'}
          </span>
          {isLast ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </footer>
  );
}
```

### Keyboard Navigation Hook

```tsx
// src/hooks/useKeyboardNav.ts
'use client';

import { useEffect } from 'react';

interface UseKeyboardNavProps {
  onPrev: () => void;
  onNext: () => void;
  onEscape?: () => void;
}

export function useKeyboardNav({ onPrev, onNext, onEscape }: UseKeyboardNavProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se estiver em input/textarea
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
```

---

## Definition of Done

- [ ] Componente ReadingMode implementado
- [ ] Header com todos os controles
- [ ] Área de conteúdo com Markdown renderizado
- [ ] Footer com navegação
- [ ] Keyboard shortcuts funcionando
- [ ] Responsivo
- [ ] Transições suaves
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-201 (Server Actions de Resumos)

### Bloqueia
- EXIMIA-203 (Controles de Tema e Fonte)
- EXIMIA-204 (Sumário)
- EXIMIA-205 (Progresso de Leitura)
- EXIMIA-206 (Rota e Integração)

---

## Bibliotecas Necessárias

```bash
npm install react-markdown
```

---

## Out of Scope

- Animações de página flip
- Modo apresentação
- Leitura em voz alta

---

*— River, removendo obstáculos 🌊*
