# Story PM1-005: Fullscreen Reading Page

## Story Info

**Story ID:** PM1-005
**Epic:** PM1 - UX Enhancement Package
**Priority:** P1 (Alta)
**Story Points:** 5
**Status:** Ready for Development
**Depende de:** PM1-004 (Biblioteca Visual - navegação para página de leitura)

## User Story

**Como** usuário lendo um livro/resumo,
**Eu quero** uma experiência de leitura fullscreen com TOC flutuante,
**Para que** eu possa me concentrar no conteúdo sem distrações.

## Context

A página de leitura atual precisa de um redesign para modo fullscreen com:
- Texto centralizado para leitura confortável
- TOC (Table of Contents) como card flutuante glassmorphism
- Modo foco com tipografia otimizada para leitura longa

## UX Specifications (Uma)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ [←] Deep Work: Foco Total                    [📖] [🔍] [⚙️] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│        ┌─────────────────────────────────────┐              │
│        │                                     │              │
│        │  CAPÍTULO 3                         │              │
│        │  ══════════                         │              │
│        │                                     │              │
│        │  A Arte do Foco Profundo            │              │
│        │                                     │              │
│        │  Lorem ipsum dolor sit amet,        │              │
│        │  consectetur adipiscing elit.       │              │
│        │  Sed do eiusmod tempor incididunt   │              │
│        │  ut labore et dolore magna aliqua.  │              │
│        │                                     │              │
│        │  Ut enim ad minim veniam, quis      │              │
│        │  nostrud exercitation ullamco       │              │
│        │  laboris nisi ut aliquip ex ea      │              │
│        │  commodo consequat.                 │              │
│        │                                     │              │
│        │  > "O trabalho profundo é a         │              │
│        │  > capacidade de focar sem          │              │
│        │  > distração em uma tarefa          │              │
│        │  > cognitivamente exigente."        │              │
│        │                                     │              │
│        └─────────────────────────────────────┘              │
│                                                              │
│  ┌───────────────────┐                                      │
│  │ 📑 SUMÁRIO        │ (glassmorphism, flutuante)           │
│  │ ─────────────     │                                      │
│  │ 1. Introdução     │                                      │
│  │ 2. Fundamentos    │                                      │
│  │ ▸ 3. Arte do Foco │ ← current                           │
│  │ 4. Práticas       │                                      │
│  │ 5. Conclusão      │                                      │
│  │                   │                                      │
│  │ [▼ Minimizar]     │                                      │
│  └───────────────────┘                                      │
│                                                              │
│ ═══════════════════════════════════════════ 45% ════════════│
└─────────────────────────────────────────────────────────────┘
```

### Typography for Reading

```css
/* Reading Container */
.reading-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

/* Chapter Title */
.chapter-title {
  font-family: 'Georgia', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #fafafa;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

/* Chapter Subtitle */
.chapter-subtitle {
  font-family: 'Georgia', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #a1a1aa;
  margin-bottom: 3rem;
}

/* Body Text */
.reading-text {
  font-family: 'Georgia', serif;
  font-size: 1.125rem;
  line-height: 1.9;
  color: #d4d4d8;
  text-align: justify;
  hyphens: auto;
}

.reading-text p {
  margin-bottom: 1.5rem;
}

/* Blockquote */
.reading-quote {
  border-left: 3px solid #f59e0b;
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: #a1a1aa;
}

/* Links in text */
.reading-text a {
  color: #f59e0b;
  text-decoration: underline;
  text-decoration-color: rgba(245, 158, 11, 0.3);
  text-underline-offset: 2px;
}

.reading-text a:hover {
  text-decoration-color: #f59e0b;
}
```

### TOC Glassmorphism Card

```css
/* TOC Container */
.toc-card {
  position: fixed;
  bottom: 100px;
  left: 2rem;
  width: 280px;
  max-height: 400px;

  /* Glassmorphism */
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;

  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 50;
}

.toc-card--minimized {
  height: 48px;
  width: 160px;
}

/* TOC Header */
.toc-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toc-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #71717a;
}

/* TOC Items */
.toc-list {
  padding: 0.5rem;
  overflow-y: auto;
  max-height: 320px;
}

.toc-item {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  color: #a1a1aa;
}

.toc-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fafafa;
}

.toc-item--active {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  font-weight: 500;
}

.toc-item--active::before {
  content: '▸ ';
}
```

### Header Controls

```typescript
interface ReadingHeaderProps {
  title: string;
  onBack: () => void;
  onToggleTOC: () => void;
  onSearch: () => void;
  onSettings: () => void;
}

// Settings options
interface ReadingSettings {
  fontSize: 'small' | 'medium' | 'large';
  theme: 'dark' | 'sepia' | 'light';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  fontFamily: 'serif' | 'sans-serif' | 'monospace';
}
```

### Progress Indicator

```css
/* Bottom Progress Bar */
.reading-progress {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #1F1F22;
  z-index: 100;
}

.reading-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  transition: width 0.1s ease;
}

/* Progress Percentage Label */
.reading-progress-label {
  position: fixed;
  bottom: 12px;
  right: 2rem;
  font-size: 11px;
  font-weight: 600;
  color: #71717a;
}
```

### Component Structure

```typescript
interface ReadingPageProps {
  bookId: string;
  chapterId?: string;
  onBack: () => void;
}

interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  content: string; // Markdown or HTML
}

interface TableOfContents {
  chapters: {
    id: string;
    number: number;
    title: string;
    isRead: boolean;
  }[];
}
```

### Focus Mode Features

```typescript
// Keyboard shortcuts
const shortcuts = {
  'Escape': () => exitFullscreen(),
  'ArrowLeft': () => previousChapter(),
  'ArrowRight': () => nextChapter(),
  't': () => toggleTOC(),
  'f': () => toggleFocusMode(),
  '+': () => increaseFontSize(),
  '-': () => decreaseFontSize(),
};

// Focus mode hides header and TOC on scroll down
const useFocusMode = () => {
  const [isFocused, setIsFocused] = useState(false);
  // Show on scroll up, hide on scroll down
};
```

## Acceptance Criteria

### Funcional
- [ ] Layout fullscreen sem sidebar
- [ ] Texto centralizado (max-width 720px)
- [ ] Tipografia serif para leitura (Georgia ou similar)
- [ ] TOC flutuante com glassmorphism
- [ ] TOC minimizável (estado persiste)
- [ ] TOC indica capítulo atual (highlight)
- [ ] Barra de progresso no bottom
- [ ] Porcentagem de progresso visível
- [ ] Header com controles (back, TOC, search, settings)
- [ ] Modo foco esconde header no scroll down
- [ ] Keyboard shortcuts funcionais
- [ ] Responsivo em mobile (TOC vira drawer)

### Persistência
- [ ] Progresso de leitura persiste entre sessões (localStorage)
- [ ] Posição do scroll restaurada ao reabrir
- [ ] Configurações de leitura persistem (font size, theme)
- [ ] Última página visitada salva por livro
- [ ] Migration path para Supabase documentado

### Acessibilidade (WCAG AA)
- [ ] Contraste mínimo 4.5:1 para texto de leitura
- [ ] Focus visible em controles
- [ ] aria-current="page" no capítulo ativo do TOC
- [ ] Keyboard shortcuts não conflitam com screen readers
- [ ] Escape fecha TOC/modals
- [ ] Font size ajustável (16px-24px range)

### Performance
- [ ] Scroll suave a 60fps
- [ ] TOC não causa reflow no conteúdo
- [ ] Lazy rendering de capítulos longos

## Technical Tasks

- [ ] Criar componente `ReadingPage.tsx`
- [ ] Criar componente `TOCCard.tsx`
- [ ] Criar componente `ReadingProgress.tsx`
- [ ] Criar hook `useReadingProgress.ts`
- [ ] Criar hook `useFocusMode.ts`
- [ ] Implementar keyboard shortcuts
- [ ] Adicionar settings persistence
- [ ] Integrar com BookDetailPage

## Files to Modify/Create

| File | Action |
|------|--------|
| `components/reading/ReadingPage.tsx` | Create |
| `components/reading/TOCCard.tsx` | Create |
| `components/reading/ReadingProgress.tsx` | Create |
| `components/reading/ReadingHeader.tsx` | Create |
| `components/reading/ReadingSettings.tsx` | Create |
| `hooks/useReadingProgress.ts` | Create |
| `hooks/useFocusMode.ts` | Create |
| `App.tsx` | Add route |

## Definition of Done

- [ ] Experiência de leitura imersiva
- [ ] TOC glassmorphism funcionando
- [ ] Progresso rastreado e persistido (localStorage)
- [ ] Posição de scroll restaurada ao reabrir livro
- [ ] Keyboard shortcuts funcionais (documentados)
- [ ] Responsividade testada (mobile TOC como drawer)
- [ ] Tipografia legível em sessões longas
- [ ] Acessibilidade verificada (keyboard, contrast)
- [ ] Testes em Chrome, Firefox, Safari

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**UX Review:** Uma (UX Design Expert)
