# EXIMIA-204: Sumário (Table of Contents)

> EPIC-002: Modo Leitura | Sprint 4 | 5 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-204 |
| Título | Navegação por Sumário |
| Epic | EPIC-002 |
| Story Points | 5 |
| Sprint | 4 |
| Prioridade | Média |
| Assignee | @dev |

---

## User Story

**Como** usuário,
**Quero** ver o sumário e pular para capítulos,
**Para** navegar rapidamente pelo conteúdo.

---

## Acceptance Criteria

- [ ] **AC1:** Lista de capítulos com números e títulos
- [ ] **AC2:** Indicador visual do capítulo atual (highlight)
- [ ] **AC3:** Click em capítulo navega diretamente
- [ ] **AC4:** Contador "Capítulo X de Y" no footer do sumário
- [ ] **AC5:** Toggle para abrir/fechar via botão ☰ no header
- [ ] **AC6:** Desktop: Sidebar fixa à direita (colapsável)
- [ ] **AC7:** Mobile: Drawer overlay que desliza da direita
- [ ] **AC8:** Botão X para fechar no mobile
- [ ] **AC9:** Scroll interno se muitos capítulos
- [ ] **AC10:** Animação de abertura/fechamento (slide)
- [ ] **AC11:** Backdrop escurecido no mobile
- [ ] **AC12:** Fechar ao clicar fora (mobile)
- [ ] **AC13:** Acessibilidade: focus trap no drawer, ESC para fechar

---

## Technical Notes

### Arquivos de Referência
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Interface: `SummaryChapter`

### Estrutura de Arquivos

```
src/components/biblioteca/ReadingMode/
├── TableOfContents.tsx       # Container responsivo
├── TOCSidebar.tsx            # Versão desktop
├── TOCDrawer.tsx             # Versão mobile
├── TOCList.tsx               # Lista compartilhada
└── ...
```

### Componente Principal

```tsx
// src/components/biblioteca/ReadingMode/TableOfContents.tsx
'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { TOCSidebar } from './TOCSidebar';
import { TOCDrawer } from './TOCDrawer';
import { SummaryChapter } from '@/types/biblioteca';

interface TableOfContentsProps {
  chapters: SummaryChapter[];
  currentChapter: number;
  onSelectChapter: (num: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TableOfContents({
  chapters,
  currentChapter,
  onSelectChapter,
  isOpen,
  onClose,
}: TableOfContentsProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <TOCDrawer
        chapters={chapters}
        currentChapter={currentChapter}
        onSelectChapter={(num) => {
          onSelectChapter(num);
          onClose();
        }}
        isOpen={isOpen}
        onClose={onClose}
      />
    );
  }

  return (
    <TOCSidebar
      chapters={chapters}
      currentChapter={currentChapter}
      onSelectChapter={onSelectChapter}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
```

### Desktop Sidebar

```tsx
// src/components/biblioteca/ReadingMode/TOCSidebar.tsx
'use client';

import { X } from 'lucide-react';
import { SummaryChapter } from '@/types/biblioteca';
import { TOCList } from './TOCList';

interface TOCSidebarProps {
  chapters: SummaryChapter[];
  currentChapter: number;
  onSelectChapter: (num: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TOCSidebar({
  chapters,
  currentChapter,
  onSelectChapter,
  isOpen,
  onClose,
}: TOCSidebarProps) {
  return (
    <aside
      className={`
        fixed right-0 top-0 h-full w-72 bg-current/5 border-l border-current/10
        transform transition-transform duration-300 ease-in-out z-20
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      style={{ paddingTop: '64px' }} // Altura do header
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-current/10">
          <h2 className="font-semibold">Sumário</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-current/10"
            aria-label="Fechar sumário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          <TOCList
            chapters={chapters}
            currentChapter={currentChapter}
            onSelectChapter={onSelectChapter}
          />
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-current/10 text-sm text-center opacity-70">
          Capítulo {currentChapter} de {chapters.length}
        </div>
      </div>
    </aside>
  );
}
```

### Mobile Drawer

```tsx
// src/components/biblioteca/ReadingMode/TOCDrawer.tsx
'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { SummaryChapter } from '@/types/biblioteca';
import { TOCList } from './TOCList';

interface TOCDrawerProps {
  chapters: SummaryChapter[];
  currentChapter: number;
  onSelectChapter: (num: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TOCDrawer({
  chapters,
  currentChapter,
  onSelectChapter,
  isOpen,
  onClose,
}: TOCDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      const firstFocusable = drawerRef.current?.querySelector('button');
      firstFocusable?.focus();
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-30
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Sumário"
        className={`
          fixed right-0 top-0 h-full w-[85%] max-w-sm bg-inherit z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-current/10">
            <h2 className="font-semibold text-lg">Sumário</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-current/10"
              aria-label="Fechar sumário"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            <TOCList
              chapters={chapters}
              currentChapter={currentChapter}
              onSelectChapter={onSelectChapter}
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-current/10 text-sm text-center opacity-70">
            Capítulo {currentChapter} de {chapters.length}
          </div>
        </div>
      </div>
    </>
  );
}
```

### Lista Compartilhada

```tsx
// src/components/biblioteca/ReadingMode/TOCList.tsx
'use client';

import { Check } from 'lucide-react';
import { SummaryChapter } from '@/types/biblioteca';

interface TOCListProps {
  chapters: SummaryChapter[];
  currentChapter: number;
  onSelectChapter: (num: number) => void;
}

export function TOCList({
  chapters,
  currentChapter,
  onSelectChapter,
}: TOCListProps) {
  return (
    <nav aria-label="Capítulos">
      <ul className="py-2">
        {chapters.map((chapter) => {
          const isCurrent = chapter.chapter_number === currentChapter;
          const isPast = chapter.chapter_number < currentChapter;

          return (
            <li key={chapter.id}>
              <button
                onClick={() => onSelectChapter(chapter.chapter_number)}
                className={`
                  w-full text-left px-4 py-3 flex items-start gap-3
                  transition-colors duration-200
                  ${isCurrent
                    ? 'bg-amber-500/20 border-l-4 border-amber-500'
                    : 'hover:bg-current/5 border-l-4 border-transparent'
                  }
                `}
                aria-current={isCurrent ? 'page' : undefined}
              >
                <span
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs
                    ${isCurrent
                      ? 'bg-amber-500 text-white'
                      : isPast
                      ? 'bg-green-500 text-white'
                      : 'bg-current/10'
                    }
                  `}
                >
                  {isPast ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    chapter.chapter_number
                  )}
                </span>

                <span className={`flex-1 ${isCurrent ? 'font-medium' : ''}`}>
                  {chapter.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

### Hook Media Query

```tsx
// src/hooks/useMediaQuery.ts
'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

---

## Definition of Done

- [ ] TableOfContents responsivo (sidebar/drawer)
- [ ] Lista de capítulos com indicador atual
- [ ] Navegação direta funcional
- [ ] Toggle abrir/fechar
- [ ] Animações de slide
- [ ] Backdrop no mobile
- [ ] Scroll interno
- [ ] Focus trap e ESC no drawer
- [ ] Acessibilidade completa
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-202 (Componente ReadingMode)

### Bloqueia
- Nenhuma (feature independente)

---

## Out of Scope

- Busca dentro do sumário
- Subseções aninhadas
- Progresso por capítulo no sumário

---

*— River, removendo obstáculos 🌊*
