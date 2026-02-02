# EXIMIA-203: Controles de Tema e Fonte

> EPIC-002: Modo Leitura | Sprint 3 | 5 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-203 |
| Título | Personalização Visual — Tema e Fonte |
| Epic | EPIC-002 |
| Story Points | 5 |
| Sprint | 3 |
| Prioridade | Média |
| Assignee | @dev |

---

## User Story

**Como** usuário,
**Quero** ajustar tema e tamanho da fonte,
**Para** ler com conforto visual.

---

## Acceptance Criteria

- [ ] **AC1:** `ThemeToggle` — 3 círculos clicáveis:
  - Light (branco): bg #ffffff, text #1a1a1a
  - Sepia (bege): bg #f4ecd8, text #5c4b37
  - Dark (escuro): bg #1a1a1a, text #e5e5e5
- [ ] **AC2:** `FontSizeControl` — 3 botões:
  - A- (small): 14px, line-height 1.6
  - A (medium): 18px, line-height 1.7
  - A+ (large): 22px, line-height 1.8
- [ ] **AC3:** Mudança instantânea ao clicar
- [ ] **AC4:** Preferências salvas no banco via `saveReadingPreferences()`
- [ ] **AC5:** Fallback para localStorage se offline ou não autenticado
- [ ] **AC6:** Animação suave na transição de tema (300ms)
- [ ] **AC7:** Indicador visual do tema/fonte atual selecionado
- [ ] **AC8:** Tooltip com nome do tema ao hover
- [ ] **AC9:** Cores do accent ajustadas por tema:
  - Light: accent #f59e0b
  - Sepia: accent #b8860b
  - Dark: accent #f59e0b

---

## Technical Notes

### Arquivos de Referência
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Constantes: `THEMES`, `FONT_SIZES`

### Estrutura de Arquivos

```
src/components/biblioteca/ReadingMode/
├── ThemeToggle.tsx
├── FontSizeControl.tsx
└── ...

src/hooks/
└── useReadingPreferences.ts
```

### Theme Toggle Component

```tsx
// src/components/biblioteca/ReadingMode/ThemeToggle.tsx
'use client';

import { ReadingTheme, THEMES } from '@/types/biblioteca';

interface ThemeToggleProps {
  value: ReadingTheme;
  onChange: (theme: ReadingTheme) => void;
}

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Tema de leitura">
      {THEMES.map((theme) => (
        <button
          key={theme.name}
          onClick={() => onChange(theme.name)}
          title={theme.label}
          className={`
            w-7 h-7 rounded-full border-2 transition-all duration-300
            ${value === theme.name
              ? 'scale-110 ring-2 ring-offset-2 ring-amber-500'
              : 'hover:scale-105'
            }
          `}
          style={{
            backgroundColor: theme.colors.background,
            borderColor: value === theme.name ? theme.colors.accent : theme.colors.muted,
          }}
          aria-pressed={value === theme.name}
          aria-label={`Tema ${theme.label}`}
        >
          {/* Inner dot para mostrar seleção */}
          {value === theme.name && (
            <span
              className="block w-2 h-2 rounded-full mx-auto"
              style={{ backgroundColor: theme.colors.text }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
```

### Font Size Control Component

```tsx
// src/components/biblioteca/ReadingMode/FontSizeControl.tsx
'use client';

import { FontSize, FONT_SIZES } from '@/types/biblioteca';

interface FontSizeControlProps {
  value: FontSize;
  onChange: (size: FontSize) => void;
}

export function FontSizeControl({ value, onChange }: FontSizeControlProps) {
  return (
    <div
      className="flex items-center rounded-lg border border-current/20 overflow-hidden"
      role="group"
      aria-label="Tamanho da fonte"
    >
      {FONT_SIZES.map((size, index) => (
        <button
          key={size.name}
          onClick={() => onChange(size.name)}
          className={`
            px-3 py-1.5 transition-colors duration-200
            ${value === size.name
              ? 'bg-current/20 font-medium'
              : 'hover:bg-current/10'
            }
            ${index > 0 ? 'border-l border-current/20' : ''}
          `}
          aria-pressed={value === size.name}
          aria-label={`Fonte ${size.name === 'small' ? 'pequena' : size.name === 'large' ? 'grande' : 'média'}`}
        >
          <span style={{ fontSize: size.name === 'small' ? '12px' : size.name === 'large' ? '18px' : '14px' }}>
            {size.label}
          </span>
        </button>
      ))}
    </div>
  );
}
```

### Hook de Preferências

```tsx
// src/hooks/useReadingPreferences.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReadingTheme, FontSize, UserReadingPreferences } from '@/types/biblioteca';
import { saveReadingPreferences, getReadingPreferences } from '@/lib/actions/preferences/reading';

const STORAGE_KEY = 'reading-preferences';

interface UseReadingPreferencesReturn {
  theme: ReadingTheme;
  fontSize: FontSize;
  setTheme: (theme: ReadingTheme) => void;
  setFontSize: (size: FontSize) => void;
  isLoading: boolean;
}

export function useReadingPreferences(
  initialPreferences?: UserReadingPreferences | null
): UseReadingPreferencesReturn {
  const [theme, setThemeState] = useState<ReadingTheme>(
    initialPreferences?.theme || 'dark'
  );
  const [fontSize, setFontSizeState] = useState<FontSize>(
    initialPreferences?.font_size || 'medium'
  );
  const [isLoading, setIsLoading] = useState(!initialPreferences);

  // Carregar preferências do localStorage como fallback
  useEffect(() => {
    if (!initialPreferences) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.theme) setThemeState(parsed.theme);
          if (parsed.fontSize) setFontSizeState(parsed.fontSize);
        } catch (e) {
          // Ignore parse errors
        }
      }
      setIsLoading(false);
    }
  }, [initialPreferences]);

  // Salvar no localStorage sempre
  const saveToStorage = useCallback((theme: ReadingTheme, fontSize: FontSize) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, fontSize }));
  }, []);

  const setTheme = useCallback(async (newTheme: ReadingTheme) => {
    setThemeState(newTheme);
    saveToStorage(newTheme, fontSize);

    // Tentar salvar no banco (fire and forget)
    try {
      await saveReadingPreferences({ theme: newTheme });
    } catch (e) {
      // Falha silenciosa - localStorage é o fallback
    }
  }, [fontSize, saveToStorage]);

  const setFontSize = useCallback(async (newSize: FontSize) => {
    setFontSizeState(newSize);
    saveToStorage(theme, newSize);

    // Tentar salvar no banco (fire and forget)
    try {
      await saveReadingPreferences({ font_size: newSize });
    } catch (e) {
      // Falha silenciosa - localStorage é o fallback
    }
  }, [theme, saveToStorage]);

  return {
    theme,
    fontSize,
    setTheme,
    setFontSize,
    isLoading,
  };
}
```

### CSS para Transições

```css
/* src/styles/reading-mode.css */

/* Transição suave de tema */
.reading-mode-container {
  transition: background-color 300ms ease-in-out, color 300ms ease-in-out;
}

/* Transição de tamanho de fonte */
.reading-content {
  transition: font-size 200ms ease-out, line-height 200ms ease-out;
}

/* Temas específicos */
[data-theme="light"] {
  --reading-bg: #ffffff;
  --reading-text: #1a1a1a;
  --reading-accent: #f59e0b;
  --reading-muted: #6b7280;
}

[data-theme="sepia"] {
  --reading-bg: #f4ecd8;
  --reading-text: #5c4b37;
  --reading-accent: #b8860b;
  --reading-muted: #8b7355;
}

[data-theme="dark"] {
  --reading-bg: #1a1a1a;
  --reading-text: #e5e5e5;
  --reading-accent: #f59e0b;
  --reading-muted: #9ca3af;
}
```

### Integração no ReadingMode

```tsx
// Atualização em ReadingMode.tsx
import { useReadingPreferences } from '@/hooks/useReadingPreferences';
import { ThemeToggle } from './ThemeToggle';
import { FontSizeControl } from './FontSizeControl';

// No componente:
const { theme, fontSize, setTheme, setFontSize } = useReadingPreferences(
  userPreferences
);

// No header:
<ThemeToggle value={theme} onChange={setTheme} />
<FontSizeControl value={fontSize} onChange={setFontSize} />
```

---

## Definition of Done

- [ ] ThemeToggle implementado com 3 temas
- [ ] FontSizeControl implementado com 3 tamanhos
- [ ] Mudança instantânea visual
- [ ] Preferências salvas no banco
- [ ] Fallback localStorage funcionando
- [ ] Transições suaves (300ms)
- [ ] Indicadores visuais de seleção
- [ ] Acessibilidade (aria-labels)
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

- Mais opções de tema
- Customização de cores
- Ajuste de line-height separado
- Fonte customizada

---

*— River, removendo obstáculos 🌊*
