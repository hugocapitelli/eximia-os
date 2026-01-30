# Story PM1-002: Trilhas Redesign

## Story Info

**Story ID:** PM1-002
**Epic:** PM1 - UX Enhancement Package
**Priority:** P2 (Média)
**Story Points:** 5
**Status:** Ready for Development
**Depende de:** PM1-006 (Admin Sidebar - para editor mode das trilhas)

## User Story

**Como** usuário da Academy,
**Eu quero** ver as trilhas de aprendizado em cards verticais grandes e modernos,
**Para que** eu tenha uma visão mais detalhada e atraente de cada trilha disponível.

## Context

Atualmente as trilhas são exibidas em cards pequenos em 3 colunas. O redesign propõe cards verticais maiores que mostram mais informações e têm visual mais impactante.

## UX Specifications (Uma)

### Current vs New Layout

**Current:** 3 colunas, cards pequenos (~200px height)
**New:** 2 colunas (desktop), cards verticais (~400px height)

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  TRILHAS DE APRENDIZADO                                 │
│  ─────────────────────                                  │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │            │
│  │ ▓▓▓ THUMBNAIL ▓▓▓ │  │ ▓▓▓ THUMBNAIL ▓▓▓ │            │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │            │
│  ├──────────────────┤  ├──────────────────┤            │
│  │ 🏷 PRODUTIVIDADE  │  │ 🏷 LIDERANÇA      │            │
│  │                  │  │                  │            │
│  │ Deep Work        │  │ Leadership       │            │
│  │ Mastery          │  │ Excellence       │            │
│  │                  │  │                  │            │
│  │ Domine técnicas  │  │ Desenvolva       │            │
│  │ de foco e        │  │ habilidades de   │            │
│  │ produtividade    │  │ liderança...     │            │
│  │                  │  │                  │            │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │            │
│  │ │ ████░░ 60%   │ │  │ │ ██░░░░ 30%   │ │            │
│  │ └──────────────┘ │  │ └──────────────┘ │            │
│  │                  │  │                  │            │
│  │ 📚 8 cursos      │  │ 📚 12 cursos     │            │
│  │ ⏱ 24h total     │  │ ⏱ 36h total     │            │
│  │                  │  │                  │            │
│  │ [Continuar →]    │  │ [Iniciar →]      │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Card Design Specifications

```css
/* Track Card */
.track-card {
  background: #0A0A0A;
  border: 1px solid #1F1F22;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 400px;
}

.track-card:hover {
  border-color: rgba(251, 191, 36, 0.3); /* amber-400/30 */
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

/* Thumbnail area */
.track-thumbnail {
  height: 160px;
  background: linear-gradient(135deg, var(--track-color) 0%, transparent 100%);
  position: relative;
}

/* Category badge */
.category-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--track-color);
  padding: 4px 12px;
  background: rgba(var(--track-color-rgb), 0.1);
  border-radius: 9999px;
}

/* Progress bar */
.progress-bar {
  height: 6px;
  background: #1F1F22;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, amber-500, amber-400);
  border-radius: 3px;
}
```

### Component Structure

```typescript
interface TrackCardProps {
  track: LearningTrack;
  onNavigate: (trackId: string) => void;
  isEditorMode?: boolean;
  onEdit?: (trackId: string) => void;
  onDelete?: (trackId: string) => void;
}

interface LearningTrack {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string; // hex color for theming
  thumbnail?: string;
  coursesCount: number;
  totalDuration: string;
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed';
}
```

### Responsive Behavior

| Breakpoint | Columns | Card Height |
|------------|---------|-------------|
| Mobile (<640px) | 1 | 360px |
| Tablet (640-1024px) | 2 | 400px |
| Desktop (>1024px) | 2-3 | 420px |

### Admin Editor Mode

```typescript
// Em editor mode:
interface TrackEditorControls {
  addTrack: () => void;
  editTrack: (id: string) => void;
  deleteTrack: (id: string) => void;
  reorderTracks: (ids: string[]) => void;
  editThumbnail: (id: string, file: File) => void;
}
```

## Acceptance Criteria

### Funcional
- [ ] Cards verticais com altura mínima de 400px
- [ ] Layout 2 colunas em desktop, 1 coluna mobile
- [ ] Thumbnail area com gradient baseado na cor da categoria
- [ ] Badge de categoria com cor temática
- [ ] Barra de progresso visual
- [ ] Métricas: cursos, duração total
- [ ] Hover effect com elevação e border amber
- [ ] Botão de ação contextual (Iniciar/Continuar)
- [ ] Editor mode com controles de edição (depende de PM1-006)
- [ ] Transições suaves em todas interações

### Acessibilidade (WCAG AA)
- [ ] Contraste mínimo 4.5:1 para texto
- [ ] Focus visible em todos elementos interativos
- [ ] aria-label em cards e botões
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] role="listitem" nos cards, role="list" no container

### Performance
- [ ] Animações a 60fps (< 16ms per frame)
- [ ] Lazy loading de thumbnails
- [ ] Transições CSS (não JS) para hover effects

## Technical Tasks

- [ ] Criar componente `TrackCardLarge.tsx`
- [ ] Atualizar grid no AcademyDashboard (section Trilhas)
- [ ] Adicionar animações de hover
- [ ] Implementar thumbnail com gradient overlay
- [ ] Adicionar progress bar component
- [ ] Implementar controles de editor mode
- [ ] Testar responsividade

## Files to Modify/Create

| File | Action |
|------|--------|
| `components/academy/TrackCardLarge.tsx` | Create |
| `components/pages/AcademyDashboard.tsx` | Modify |
| `constants.ts` | Update TRACKS mock data |

## Definition of Done

- [ ] Código implementado e funcionando
- [ ] Visual consistente com DS
- [ ] Responsividade testada (mobile/tablet/desktop)
- [ ] Editor mode funcional
- [ ] Performance verificada (60fps, no jank)
- [ ] Acessibilidade verificada (keyboard nav, screen reader)
- [ ] Testes manuais em Chrome, Firefox, Safari

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**UX Review:** Uma (UX Design Expert)
