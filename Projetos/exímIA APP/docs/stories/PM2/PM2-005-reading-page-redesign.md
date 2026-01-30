# Story PM2-005: Reading Page Redesign

## Story Info

**Story ID:** PM2-005
**Epic:** PM2 - Visual Refinement Package
**Priority:** P1
**Story Points:** 5
**Status:** Ready for Development

## User Story

**Como** leitor na biblioteca,
**Eu quero** uma página de leitura com visual moderno e sumário glassmorphism à direita,
**Para que** minha experiência de leitura seja imersiva e elegante.

## Context

Referências visuais:
- Imagem 6: Layout de leitura da Lendária
- Imagem 7: Efeito glassmorphism para cards

**Mudanças principais:**
1. Header flutuante em formato pill
2. Título centralizado com autor abaixo
3. Sumário (TOC) à direita com glassmorphism
4. Conteúdo em coluna centralizada

## Target Layout (Imagem 6)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│        ┌─────────────────────────────────────────────┐          │
│        │ ← LEITURA                                    │          │
│        │   O Início do Infinito    [●○○] [A-][A][A+] [≡]        │
│        └─────────────────────────────────────────────┘          │
│                                                                  │
│                                                                  │
│                     O Início Do                                  │
│                       Infinito                                   │
│                                                                  │
│                     por David Deutsch                            │
│                                                                  │
│                    ────────────────                              │
│                                                                  │
│                                                                  │
│       O Problema Que Este Livro Resolve                         │
│       ─────────────────────────────────                         │
│                                                                  │
│       Por quase toda a história humana, o progresso             │
│       foi inexistente. Sociedades nasciam, existiam             │
│       por milênios, e colapsavam...                             │
│                                                                  │
│                                         ┌──────────────────┐    │
│                                         │ SUMÁRIO          │    │
│                                         │                  │    │
│                                         │ 1. O Problema... │    │
│                                         │ 2. Conhecimento  │    │
│                                         │ 3. Criatividade  │    │
│                                         │ 4. Sustent...    │    │
│                                         │                  │    │
│                                         │ Cap 1 de 18      │    │
│                                         └──────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Acceptance Criteria

### AC1: Floating Header (Pill)
- [ ] Header flutuante no topo central
- [ ] Formato pill (rounded-full ou rounded-2xl)
- [ ] Background glassmorphism: `bg-white/5 backdrop-blur-xl`
- [ ] Conteúdo:
  - [ ] Botão voltar (←)
  - [ ] Label "LEITURA"
  - [ ] Título do livro
  - [ ] Theme toggle (3 bolinhas: dark/sepia/light)
  - [ ] Font size controls (A- A A+)
  - [ ] Menu button (≡)

### AC2: Title Section
- [ ] Título centralizado, fonte grande (text-4xl ou 5xl)
- [ ] Fonte serif
- [ ] "por [Autor]" abaixo em italic, text-zinc-400
- [ ] Divider decorativo abaixo (linha curta centralizada)

### AC3: Content Area
- [ ] Coluna centralizada: max-w-2xl mx-auto
- [ ] Fonte serif para o texto
- [ ] Line-height confortável (1.8)
- [ ] Parágrafos com espaçamento adequado
- [ ] Headings estilizados (h2, h3)

### AC4: TOC Card Glassmorphism (Direita)
- [ ] Posição: `fixed right-8 top-1/2 -translate-y-1/2`
- [ ] Largura: ~200-240px
- [ ] Glassmorphism style:
  ```css
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  ```
- [ ] Header: "SUMÁRIO" em uppercase tracking-wider
- [ ] Lista de capítulos (scroll se muitos)
- [ ] Capítulo atual highlighted
- [ ] Footer: "Capítulo X de Y"
- [ ] Botão collapse/expand

### AC5: Theme Toggle
- [ ] 3 modes: dark, sepia, light
- [ ] Visual: 3 círculos lado a lado
- [ ] Dark: bg-zinc-900 (ativo por default)
- [ ] Sepia: bg-amber-100 (texto escuro)
- [ ] Light: bg-white (texto escuro)

### AC6: Font Controls
- [ ] A- : diminui fonte
- [ ] A : tamanho médio (reset)
- [ ] A+ : aumenta fonte
- [ ] Sizes: small (16px), medium (18px), large (20px)

### AC7: Responsividade
- [ ] Desktop: TOC à direita fixo
- [ ] Tablet: TOC colapsado, abre em overlay
- [ ] Mobile: TOC em bottom sheet ou drawer

## Component Updates

### ReadingHeader.tsx (Redesign)

```tsx
<div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
  <div className="
    flex items-center gap-4 px-6 py-3
    bg-white/5 backdrop-blur-xl
    border border-white/10 rounded-2xl
    shadow-lg
  ">
    {/* Back button */}
    <button onClick={onBack} className="text-zinc-400 hover:text-white">
      <ArrowLeft className="w-5 h-5" />
    </button>

    {/* Label + Title */}
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
        LEITURA
      </span>
      <span className="text-sm font-medium text-white truncate max-w-48">
        {bookTitle}
      </span>
    </div>

    <div className="w-px h-6 bg-white/10" />

    {/* Theme Toggle */}
    <div className="flex items-center gap-1">
      {themes.map(theme => (
        <button
          key={theme.id}
          onClick={() => setTheme(theme.id)}
          className={`w-6 h-6 rounded-full border-2 ${
            currentTheme === theme.id
              ? 'border-white'
              : 'border-transparent'
          }`}
          style={{ backgroundColor: theme.color }}
        />
      ))}
    </div>

    {/* Font Size */}
    <div className="flex items-center gap-1">
      <button className="px-2 py-1 text-sm text-zinc-400 hover:text-white">A-</button>
      <button className="px-2 py-1 text-sm text-white font-bold">A</button>
      <button className="px-2 py-1 text-sm text-zinc-400 hover:text-white">A+</button>
    </div>

    {/* Menu */}
    <button className="p-2 text-zinc-400 hover:text-white">
      <Menu className="w-5 h-5" />
    </button>
  </div>
</div>
```

### TOCCard.tsx (Redesign - Right Side Glassmorphism)

```tsx
<div className="
  fixed right-8 top-1/2 -translate-y-1/2 z-40
  w-56 p-4
  rounded-2xl
  hidden lg:block
"
  style={{
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  }}
>
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
      Sumário
    </h3>
    <button className="text-zinc-500 hover:text-white">
      <X className="w-4 h-4" />
    </button>
  </div>

  <div className="space-y-1 max-h-64 overflow-y-auto">
    {chapters.map((chapter, idx) => (
      <button
        key={chapter.id}
        onClick={() => goToChapter(chapter.id)}
        className={`
          w-full text-left px-2 py-1.5 rounded-lg text-sm
          transition-colors
          ${currentChapterId === chapter.id
            ? 'bg-white/10 text-white'
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
          }
        `}
      >
        {idx + 1}. {chapter.title}
      </button>
    ))}
  </div>

  <div className="mt-4 pt-4 border-t border-white/10">
    <p className="text-xs text-zinc-600 text-center">
      Capítulo {currentChapterIndex + 1} de {chapters.length}
    </p>
  </div>
</div>
```

### ReadingPage.tsx (Layout Update)

```tsx
<div className={`min-h-screen ${themeStyles[theme].bg}`}>
  {/* Floating Header */}
  <ReadingHeader ... />

  {/* Main Content */}
  <main className="pt-32 pb-20 px-6">
    {/* Title Section */}
    <div className="text-center mb-16">
      <h1 className={`text-5xl font-serif font-bold ${themeStyles[theme].title} mb-4`}>
        {bookTitle}
      </h1>
      <p className={`text-lg italic ${themeStyles[theme].subtitle}`}>
        por {authorName}
      </p>
      <div className="w-16 h-px bg-zinc-700 mx-auto mt-8" />
    </div>

    {/* Chapter Content */}
    <div className="max-w-2xl mx-auto">
      <article className={`prose prose-lg ${themeStyles[theme].prose}`}>
        <h2>{currentChapter.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: currentChapter.content }} />
      </article>
    </div>
  </main>

  {/* TOC Card - Right Side */}
  <TOCCard ... />

  {/* Progress Bar - Bottom */}
  <ReadingProgress ... />
</div>
```

## Files to Modify

| File | Changes |
|------|---------|
| `components/reading/ReadingPage.tsx` | Major layout update |
| `components/reading/ReadingHeader.tsx` | Floating pill design |
| `components/reading/TOCCard.tsx` | Move to right, glassmorphism |

## Theme Styles

```typescript
const themeStyles = {
  dark: {
    bg: 'bg-[#050505]',
    title: 'text-white',
    subtitle: 'text-zinc-400',
    prose: 'prose-invert',
  },
  sepia: {
    bg: 'bg-amber-50',
    title: 'text-amber-950',
    subtitle: 'text-amber-800',
    prose: 'prose-amber',
  },
  light: {
    bg: 'bg-white',
    title: 'text-zinc-900',
    subtitle: 'text-zinc-600',
    prose: '',
  },
};
```

## Testing Checklist

- [ ] Header flutuante centralizado
- [ ] Título grande centralizado
- [ ] TOC à direita com glassmorphism
- [ ] Theme toggle funciona (dark/sepia/light)
- [ ] Font size controls funcionam
- [ ] Navegação por capítulos funciona
- [ ] TOC highlight no capítulo atual
- [ ] Responsivo: TOC esconde em mobile
- [ ] Scroll position restaurado

## Definition of Done

- [ ] Layout igual à imagem 6
- [ ] TOC com glassmorphism à direita
- [ ] Header flutuante implementado
- [ ] Themes funcionando
- [ ] Responsivo
- [ ] Funcionalidades preservadas

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**Estimativa:** 4-6 horas
