# PM2 - Architecture Plan: Visual Refinement Package

## Executive Summary

**Epic:** PM2 - Visual Refinement & Admin Mode
**Architect:** Aria
**Date:** 2026-01-29
**Status:** Ready for Development

### Scope Overview

| Story | Priority | Points | Dependencies |
|-------|----------|--------|--------------|
| PM2-001: Admin Mode Complete | P0 | 8 | - |
| PM2-002: Hero Carousel Refinement | P1 | 3 | - |
| PM2-003: Trilhas Full-Width Redesign | P1 | 3 | - |
| PM2-004: Biblioteca Minimalista | P1 | 5 | - |
| PM2-005: Reading Page Redesign | P1 | 5 | - |
| PM2-006: DS Library Editor Mode | P2 | 3 | PM2-001 |
| PM2-007: Skill Tree Fix | P0 | 2 | - |

---

## PM2-001: Admin Mode Complete Architecture

### Overview

O Admin Mode é um sistema centralizado de administração que permite editar conteúdo em todas as seções do app. Atualmente existe `useAdminMode.ts` mas as funcionalidades estão fragmentadas.

### Admin Mode Features Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN MODE DASHBOARD                          │
│                    (Sidebar → Admin Section)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ ACADEMY     │  │ LIBRARY     │  │ DS MANAGER  │             │
│  │ STUDIO      │  │ EDITOR      │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│        │                │                │                      │
│        ▼                ▼                ▼                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │ Courses  │    │ Books    │    │ Components│                  │
│  │ Tracks   │    │ Authors  │    │ Tokens    │                  │
│  │ Skills   │    │ Chapters │    │ Patterns  │                  │
│  │ Featured │    │ Covers   │    │ Docs      │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Admin Features by Module

#### 1. Academy Studio (`/admin/academy-studio`)

| Feature | Description | UI |
|---------|-------------|-----|
| **Course Manager** | CRUD cursos, reordenar, publish/draft | DataTable + Modal |
| **Track Manager** | CRUD trilhas, assign courses | DataTable + Drag |
| **Featured Carousel** | Select/reorder featured courses | Drag grid |
| **Skill Tree Editor** | Add/edit skills, connections | Visual editor |
| **Stats Dashboard** | Métricas de cursos, engajamento | Charts |

#### 2. Library Editor (`/admin/library-editor`)

| Feature | Description | UI |
|---------|-------------|-----|
| **Book Manager** | CRUD livros, upload covers | DataTable + Modal |
| **Author Manager** | CRUD autores, link to Minds | DataTable |
| **Chapter Editor** | Rich text para capítulos | WYSIWYG |
| **Collection Manager** | Curadoria de coleções | Drag grid |
| **Category Manager** | Gerenciar categorias/tags | Tag editor |

#### 3. DS Manager (`/admin/ds-manager`)

| Feature | Description | UI |
|---------|-------------|-----|
| **Component Registry** | Add/edit componentes | Form + Code |
| **Token Editor** | Design tokens (colors, spacing) | Visual picker |
| **Pattern Library** | Documentar patterns | Markdown |
| **Export Tools** | Export DTCG, Tailwind | Button actions |

### Admin Visual Pattern (Glassmorphism)

```css
/* Admin Mode Visual Identity */
.admin-panel {
  background: rgba(245, 158, 11, 0.05);  /* amber/5% */
  backdrop-filter: blur(12px);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 16px;
}

.admin-header {
  background: linear-gradient(
    135deg,
    rgba(245, 158, 11, 0.1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.admin-button {
  background: #f59e0b;
  color: #000;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
}
```

### Admin State Management

```typescript
// hooks/useAdminMode.ts - ENHANCED
interface AdminModeState {
  isAdmin: boolean;
  isEditorMode: boolean;
  activeModule: 'academy' | 'library' | 'ds' | null;
  unsavedChanges: boolean;

  // Actions
  toggleAdmin: () => void;
  toggleEditorMode: () => void;
  setActiveModule: (module: string | null) => void;
  markUnsaved: () => void;
  clearUnsaved: () => void;
}
```

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `hooks/useAdminMode.ts` | Enhance | Add module tracking, unsaved state |
| `components/admin/AdminPanel.tsx` | Create | Base admin panel with glassmorphism |
| `components/admin/AdminHeader.tsx` | Create | Header with breadcrumbs, save button |
| `components/admin/CourseManager.tsx` | Create | Course CRUD table |
| `components/admin/TrackManager.tsx` | Create | Track CRUD table |
| `components/admin/BookManager.tsx` | Create | Book CRUD table |
| `components/admin/SkillTreeEditor.tsx` | Create | Visual skill editor |
| `App.tsx` | Modify | Add admin routes |

---

## PM2-002: Hero Carousel Refinement

### Current Issues
- Botões sempre visíveis (devem aparecer só no hover)
- Indicadores fora do container
- Sem animação de slide

### Target Visual (Imagem 1 Reference)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    [Gradient Background]                         │
│                                                                  │
│                      ✦ Academia Lendária v4.1                   │
│                                                                  │
│                      Crie o Lendário.                           │
│                                                                  │
│           Um ecossistema de design feito para escalar           │
│               com elegância, precisão e performance.            │
│                                                                  │
│              ┌──────────────┐   ┌──────────┐                    │
│              │ Começar Agora│   │ ▷ Demo   │                    │
│              └──────────────┘   └──────────┘                    │
│                                                                  │
│                         ● ○ ○ ○                                 │  ← Inside
│└─────────────────────────────────────────────────────────────────┘
│
│  [◀]                                                       [▶]   ← Hover only
```

### Implementation Changes

```typescript
// HeroCarousel.tsx changes

// 1. Navigation buttons - hover only
const [isHovering, setIsHovering] = useState(false);

<div
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
>
  {/* Nav buttons with opacity transition */}
  <button className={`
    transition-opacity duration-300
    ${isHovering ? 'opacity-100' : 'opacity-0'}
  `}>

// 2. Slide animation
const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

// Use CSS transform for slide
<div className={`
  transition-transform duration-500 ease-out
  ${slideDirection === 'right' ? 'animate-slide-right' : 'animate-slide-left'}
`}>

// 3. Indicators inside container (absolute bottom)
<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
  {courses.map((_, idx) => (
    <button
      className={`w-2 h-2 rounded-full transition-all ${
        idx === currentIndex
          ? 'bg-white w-6'
          : 'bg-white/30 hover:bg-white/50'
      }`}
    />
  ))}
</div>
```

### New Animations (index.html)

```javascript
// Add to tailwind.config
keyframes: {
  slideInRight: {
    '0%': { transform: 'translateX(100%)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
  slideInLeft: {
    '0%': { transform: 'translateX(-100%)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
  slideOutRight: {
    '0%': { transform: 'translateX(0)', opacity: '1' },
    '100%': { transform: 'translateX(100%)', opacity: '0' },
  },
  slideOutLeft: {
    '0%': { transform: 'translateX(0)', opacity: '1' },
    '100%': { transform: 'translateX(-100%)', opacity: '0' },
  },
}
```

### Files to Modify

| File | Changes |
|------|---------|
| `components/academy/HeroCarousel.tsx` | Hover state, indicators inside, slide animation |
| `index.html` | Add slide keyframes |

---

## PM2-003: Trilhas Full-Width Redesign

### Current Issues
- Cards muito coloridos
- Grid 2 colunas
- Visual pesado

### Target Design (Minimalista)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                     │ │
│  │  [Icon]    FUNDAMENTOS DE PRODUTO                                  │ │
│  │            "Domine os conceitos essenciais de gestão de produto"   │ │
│  │                                                                     │ │
│  │  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  35%               │ │
│  │                                                                     │ │
│  │  5 cursos  •  42h estimadas                          [Continuar →] │ │
│  │                                                                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                     │ │
│  │  [Icon]    ENGENHARIA DE SOFTWARE                                  │ │
│  │            "Arquitetura, patterns e boas práticas"                 │ │
│  │            ...                                                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### New Component: TrackCardFullWidth.tsx

```typescript
interface TrackCardFullWidthProps {
  track: AcademyTrack;
  onNavigate: (trackId: string) => void;
  isEditorMode?: boolean;
}

// Visual specs:
// - Full width (max-w-4xl or 100%)
// - Height: ~120px
// - Background: #0A0A0A with subtle border
// - Icon: 48x48 with track.color as subtle tint
// - Title: text-lg font-bold text-white
// - Description: text-sm text-zinc-500 (1 line, truncate)
// - Progress bar: thin (h-1), zinc-800 bg, track.color fill
// - Meta: text-xs text-zinc-600
// - CTA: ghost button, right aligned
// - Hover: border-zinc-700, slight translate-x
```

### Layout Change in AcademyDashboard.tsx

```typescript
// FROM: grid grid-cols-2 gap-6
// TO: flex flex-col gap-4 max-w-4xl mx-auto

<section>
  <h2>Trilhas de Aprendizado</h2>
  <div className="flex flex-col gap-4">
    {tracks.map(track => (
      <TrackCardFullWidth
        key={track.id}
        track={track}
        onNavigate={handleNavigateTrack}
      />
    ))}
  </div>
</section>
```

### Files to Create/Modify

| File | Action |
|------|--------|
| `components/academy/TrackCardFullWidth.tsx` | Create |
| `components/pages/AcademyDashboard.tsx` | Replace TrackCardLarge with TrackCardFullWidth |

---

## PM2-004: Biblioteca Minimalista Redesign

### Reference Images Analysis

**Imagem 2 (Explorar):**
- Hero com título estilizado "Expanda sua Consciência"
- Seção "Lançamentos" com cards horizontais (cover + info)
- Seção "Coleções" com cards de curadoria
- Filter chips por categoria
- Grid de livros minimalista

**Imagem 3 (Autores):**
- Título grande "Autores & Mentores" com tipografia mista (serif + italic)
- Search bar centralizada
- Alphabet filter (A-Z)
- Cards de autor circulares com foto

**Imagem 4 (Livro Detail):**
- Cover grande à esquerda
- Info à direita (título serif, autor, favoritar)
- Seção "A Mente por Trás" com card do autor
- Botões de ação (Ler Resumo, Quero Ler, Comprar Amazon)

**Imagem 5 (Autor Profile):**
- Header com foto circular e nome grande
- Bio em card com glassmorphism sutil
- Grid de livros do autor

### New Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  EXPLORAR  │  AUTORES  │  MEUS LIVROS  │  CURSOS  │  COMUNIDADE │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ CURADORIA EXCLUSIVA • 19 obras                              ││
│  │                                                              ││
│  │    Expanda sua Consciência.                                 ││
│  │    Sabedoria secular potencializada por IA.                 ││
│  │                                      [EXPLORAR BIBLIOTECA →]││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  NOVIDADES                                                       │
│  Lançamentos                                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────┐     │
│  │ [Cover]  CIÊNCIA         │  │ [Cover]  FILOSOFIA       │     │
│  │          O Início do...  │  │          O Mito de...    │     │
│  │          David Deutsch   │  │          Albert Camus    │     │
│  └──────────────────────────┘  └──────────────────────────┘     │
│                                                                  │
│  CURADORIA                                           VER TODAS → │
│  Coleções                                                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│  │ [📚] Naval  │ │ [📚] IA     │ │ [📚] Alta   │                │
│  │     5 livros│ │    10 livros│ │    Perform. │                │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  [TODOS] [BIOGRAFIAS] [CIÊNCIA] [FILOSOFIA] [PSICOLOGIA] ...    │
│                                                                  │
│  CATÁLOGO COMPLETO                                               │
│  19 obras                    Explore nossa biblioteca completa   │
│                                                                  │
│  [Book Grid - 4 columns]                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Diferenciação Explorar vs Favoritos

| Aspecto | Explorar | Favoritos |
|---------|----------|-----------|
| **Hero** | "Expanda sua Consciência" | "Sua Biblioteca Pessoal" |
| **Cor accent** | Amber (#f59e0b) | Purple/Violet (#8B5CF6) |
| **Seções** | Lançamentos, Coleções, Catálogo | Lendo Agora, Concluídos, Lista de Desejos |
| **Empty State** | N/A | "Comece a construir sua biblioteca" |
| **Organização** | Por categoria | Por status de leitura |
| **Background** | Gradient amber sutil | Gradient purple sutil |

### New Components

| Component | Description |
|-----------|-------------|
| `LibraryHero.tsx` | Hero section with styled title |
| `BookCardHorizontal.tsx` | Card com cover + info lado a lado |
| `CollectionCard.tsx` | Card de coleção curada |
| `CategoryChips.tsx` | Filter chips de categoria |
| `BookDetailPage.tsx` | Page de detalhe do livro (refatorar) |
| `AuthorCard.tsx` | Card circular de autor |
| `AuthorDetailPage.tsx` | Page de detalhe do autor |

### Files to Create/Modify

| File | Action |
|------|--------|
| `components/library/LibraryHero.tsx` | Create |
| `components/library/BookCardHorizontal.tsx` | Create |
| `components/library/CollectionCard.tsx` | Create |
| `components/library/CategoryChips.tsx` | Create |
| `components/library/AuthorCard.tsx` | Create |
| `components/pages/JourneyLibrary.tsx` | Major refactor |
| `components/pages/BookDetailPage.tsx` | Refactor to match image 4 |
| `components/pages/AuthorDetailPage.tsx` | Create |

---

## PM2-005: Reading Page Redesign

### Reference (Imagem 6)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│        ┌─────────────────────────────────────────────┐          │
│        │ ← LEITURA                                    │          │
│        │   O Início do Infinito    [●○○] [A-] [A] [A+] [≡]      │
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
│       por milênios, e colapsavam, frequentemente sem            │
│       criar nada novo...                                         │
│                                                                  │
│                                         ┌──────────────────┐    │
│                                         │ SUMÁRIO          │    │  ← Glassmorphism
│                                         │                  │    │     Right side
│                                         │ 1. O Problema... │    │     Middle aligned
│                                         │ 2. Conhecimento  │    │
│                                         │ 3. Criatividade  │    │
│                                         │ 4. Sustent...    │    │
│                                         │                  │    │
│                                         │ Capítulo 1 de 18 │    │
│                                         └──────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Changes

1. **Header**: Floating pill com glassmorphism, theme toggle (3 modes), font controls
2. **Title**: Large serif, centered, com autor abaixo
3. **Content**: Centered column (max-w-2xl), serif font, 1.8 line-height
4. **TOC Card**:
   - Position: `fixed right-8 top-1/2 -translate-y-1/2`
   - Glassmorphism: `bg-white/5 backdrop-blur-xl border-white/10`
   - Width: ~200px
   - Collapsible with button

### Glassmorphism TOC Card (Imagem 7 Reference)

```css
.toc-card-glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

### Files to Modify

| File | Changes |
|------|---------|
| `components/reading/ReadingPage.tsx` | Complete redesign |
| `components/reading/TOCCard.tsx` | Move to right side, enhance glassmorphism |
| `components/reading/ReadingHeader.tsx` | Floating pill design |

---

## PM2-006: DS Library Editor Mode

### Problem
O modo editor do DS Library não tem o visual glassmorphism consistente com o Academy.

### Solution
Aplicar o mesmo padrão visual `admin-panel` do PM2-001.

```typescript
// DesignSystemLibrary.tsx - Editor Mode Panel

{isAdminMode && (
  <div className="mb-8 p-6 rounded-2xl animate-in fade-in duration-300"
    style={{
      background: 'rgba(245, 158, 11, 0.05)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
    }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Layers className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Component Manager</h2>
          <p className="text-sm text-zinc-400">
            Adicione, edite e organize componentes do Design System.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" icon={<Zap />}>Gerar com AI</Button>
        <Button className="bg-amber-500 text-black">
          <Plus /> Novo Componente
        </Button>
      </div>
    </div>
  </div>
)}
```

### Files to Modify

| File | Changes |
|------|---------|
| `components/pages/DesignSystemLibrary.tsx` | Apply glassmorphism to admin panel |

---

## PM2-007: Skill Tree Fix

### Problem Analysis

O código está correto mas a view "tree" pode não estar sendo selecionada por padrão.

```typescript
// AcademySkillTree.tsx linha 114
const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
```

O default é `'tree'`, então deveria mostrar a árvore.

### Possíveis Causas:

1. **Cache do browser** - localStorage pode ter estado antigo
2. **Import error** - Componente não carregando
3. **Render condition** - Condição errada

### Debug Steps:

```typescript
// Add console.log temporário
console.log('viewMode:', viewMode);
console.log('SkillTreeGrid imported:', typeof SkillTreeGrid);
```

### Files to Check/Fix

| File | Action |
|------|--------|
| `components/pages/AcademySkillTree.tsx` | Verify imports, add fallback |
| `components/academy/SkillTreeGrid.tsx` | Check for render issues |
| `hooks/useSkillTree.ts` | Verify data loading |

---

## Implementation Order

```
Phase 1 (Crítico):
├── PM2-007: Skill Tree Fix (debug primeiro)
└── PM2-001: Admin Mode Foundation

Phase 2 (Visual):
├── PM2-002: Hero Carousel Refinement
├── PM2-003: Trilhas Full-Width
└── PM2-006: DS Library Editor

Phase 3 (Major Refactor):
├── PM2-004: Biblioteca Minimalista
└── PM2-005: Reading Page Redesign
```

---

## Design Tokens Reference

```typescript
const PM2_TOKENS = {
  // Admin Mode
  admin: {
    bg: 'rgba(245, 158, 11, 0.05)',
    border: 'rgba(245, 158, 11, 0.2)',
    glow: '0 0 20px rgba(245, 158, 11, 0.4)',
  },

  // Glassmorphism
  glass: {
    bg: 'rgba(255, 255, 255, 0.03)',
    blur: '20px',
    border: 'rgba(255, 255, 255, 0.08)',
  },

  // Favoritos accent
  favorites: {
    accent: '#8B5CF6', // violet-500
    bg: 'rgba(139, 92, 246, 0.05)',
  },

  // Explorar accent
  explore: {
    accent: '#f59e0b', // amber-500
    bg: 'rgba(245, 158, 11, 0.05)',
  },
};
```

---

## Summary

| Story | Effort | Risk | Dependencies |
|-------|--------|------|--------------|
| PM2-007 | Low | Low | None |
| PM2-001 | High | Medium | None |
| PM2-002 | Low | Low | None |
| PM2-003 | Low | Low | None |
| PM2-004 | High | Medium | None |
| PM2-005 | Medium | Low | None |
| PM2-006 | Low | Low | PM2-001 |

**Total Estimated Points:** 29
**Recommended Sprint:** 2 sprints (14-16 points each)

---

**Architect:** Aria
**Review Date:** 2026-01-29
**Status:** Ready for PO Review
